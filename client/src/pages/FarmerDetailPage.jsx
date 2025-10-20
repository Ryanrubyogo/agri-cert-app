import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function FarmerDetailPage() {
  const [farmer, setFarmer] = useState(null);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { farmerId } = useParams();

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const farmerResponse = await axios.get(`${API_BASE_URL}/api/farmers/${farmerId}`);
      const farmsResponse = await axios.get(`${API_BASE_URL}/api/farmers/${farmerId}/farms`);
      
      setFarmer(farmerResponse.data);
      const farmsData = farmsResponse.data;

      const farmsWithDetailsPromises = farmsData.map(async (farm) => {
        const [inspectionsRes, certificatesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/farms/${farm.id}/inspections`),
          axios.get(`${API_BASE_URL}/api/farms/${farm.id}/certificates`),
        ]);
        return { ...farm, inspections: inspectionsRes.data, certificates: certificatesRes.data };
      });
      
      const farmsWithDetails = await Promise.all(farmsWithDetailsPromises);
      setFarms(farmsWithDetails);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [farmerId]);

  const handleApprove = async (inspectionId) => {
    try {
      await axios.post(`${API_BASE_URL}/api/inspections/${inspectionId}/approve`);
      fetchData(); 
    } catch (error) {
      alert(error.response?.data || 'An error occurred during approval.');
    }
  };

  const handleDeleteFarm = async (farmId) => {
    if (window.confirm('Are you sure you want to delete this farm?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/farms/${farmId}`);
        fetchData();
      } catch (error) {
        alert('An error occurred while deleting the farm.');
      }
    }
  };

  if (loading) return <p>Loading details...</p>;
  if (error) return <p>{error}</p>;
  if (!farmer) return <p>Farmer not found.</p>;

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{farmer.name}'s Profile</h2>
        <p className="text-gray-600 mt-2"><strong>Contact:</strong> {farmer.email} | {farmer.phone}</p>
        <p className="text-gray-600"><strong>County:</strong> {farmer.county}</p>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Registered Farms</h3>
      {farms.map(farm => (
        <div key={farm.id} className="bg-white p-4 rounded-lg shadow mb-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold text-lg text-gray-900">{farm.farmName}</p>
              <p className="text-sm text-gray-500">{farm.location}</p>
            </div>
            <div className="flex space-x-2">
              <Link to={`/farms/${farm.id}/inspect`} className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 text-sm font-medium">New Inspection</Link>
              <button onClick={() => handleDeleteFarm(farm.id)} className="bg-red-600 text-white py-1 px-2 text-xs rounded hover:bg-red-700 font-semibold">Delete Farm</button>
            </div>
          </div>
          <div className="mt-4 border-t border-gray-200 pt-4">
            {farm.certificates.length > 0 ? (
              <div className="text-green-600 font-semibold">
                <a href={`${API_BASE_URL}${farm.certificates[0].pdfUrl}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-green-100 text-green-800 py-1 px-3 rounded-full text-sm">Download Certificate</a>
              </div>
            ) : farm.inspections.length > 0 ? (
              <ul className="space-y-2 text-sm">{farm.inspections.map(insp => (<li key={insp.id} className="flex justify-between items-center"><span>Inspection on {new Date(insp.date).toLocaleDateString()} - <span className="font-medium">Score: {insp.complianceScore}%</span></span>{insp.complianceScore >= 80 && insp.status !== 'Completed' && (<button onClick={() => handleApprove(insp.id)} className="bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700 text-xs font-medium">Approve</button>)}</li>))}</ul>
            ) : (<p className="text-sm text-gray-500">No inspections found for this farm.</p>)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default FarmerDetailPage;