import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Tab } from '@headlessui/react';
import Modal from '../components/Modal';
import FieldForm from '../components/FieldForm';
import FarmForm from '../components/FarmForm';
import Button from '../components/Button';

// A helper function for class names
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function FarmerDetailPage() {
  const [farmer, setFarmer] = useState(null);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { farmerId } = useParams();

  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [currentFarmId, setCurrentFarmId] = useState(null);

  const [isFarmModalOpen, setIsFarmModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const farmerResponse = await axios.get(`http://localhost:3001/api/farmers/${farmerId}`);
      const farmsResponse = await axios.get(`http://localhost:3001/api/farmers/${farmerId}/farms`);
      
      setFarmer(farmerResponse.data);
      const farmsData = farmsResponse.data;

      const farmsWithDetailsPromises = farmsData.map(async (farm) => {
        const [inspectionsRes, certificatesRes, fieldsRes] = await Promise.all([
          axios.get(`http://localhost:3001/api/farms/${farm.id}/inspections`),
          axios.get(`http://localhost:3001/api/farms/${farm.id}/certificates`),
          axios.get(`http://localhost:3001/api/farms/${farm.id}/fields`),
        ]);
        return { 
          ...farm, 
          inspections: inspectionsRes.data, 
          certificates: certificatesRes.data,
          fields: fieldsRes.data 
        };
      });
      
      const farmsWithDetails = await Promise.all(farmsWithDetailsPromises);
      setFarms(farmsWithDetails);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [farmerId]);

  const handleApprove = async (inspectionId) => {
    try {
      await axios.post(`http://localhost:3001/api/inspections/${inspectionId}/approve`);
      toast.success('Inspection approved successfully!');
      fetchData(); 
    } catch (error) {
      console.error('Failed to approve inspection:', error);
      toast.error('Failed to approve inspection.');
    }
  };
  
  const handleOpenAddFarmModal = () => { setEditingFarm(null); setIsFarmModalOpen(true); };
  const handleOpenEditFarmModal = (farm) => { setEditingFarm(farm); setIsFarmModalOpen(true); };
  const handleCloseFarmModal = () => { setIsFarmModalOpen(false); setEditingFarm(null); };

  const handleSaveFarm = async (farmData) => {
    const dataToSend = { ...farmData, farmerId: parseInt(farmerId, 10) };
    try {
      if (editingFarm) {
        await axios.put(`http://localhost:3001/api/farms/${editingFarm.id}`, dataToSend);
        toast.success('Farm updated successfully!');
      } else {
        await axios.post(`http://localhost:3001/api/farms`, dataToSend);
        toast.success('Farm added successfully!');
      }
      handleCloseFarmModal();
      fetchData();
    } catch (error) {
      console.error('Failed to save farm:', error);
      toast.error('Failed to save farm.');
    }
  };
  
  const handleDeleteFarm = async (farmId) => {
    if (window.confirm('Are you sure you want to permanently delete this farm and all its associated data?')) {
      try {
        await axios.delete(`http://localhost:3001/api/farms/${farmId}`);
        toast.success('Farm deleted successfully!');
        fetchData();
      } catch (error) {
        console.error('Failed to delete farm:', error);
        toast.error('Failed to delete farm.');
      }
    }
  };

  const handleOpenAddFieldModal = (farmId) => { setEditingField(null); setCurrentFarmId(farmId); setIsFieldModalOpen(true); };
  const handleOpenEditFieldModal = (field) => { setEditingField(field); setCurrentFarmId(field.farmId); setIsFieldModalOpen(true); };
  const handleCloseFieldModal = () => { setIsFieldModalOpen(false); setEditingField(null); setCurrentFarmId(null); };

  const handleSaveField = async (fieldData) => {
    const dataToSend = { ...fieldData, farmId: currentFarmId };
    try {
      if (editingField) {
        await axios.put(`http://localhost:3001/api/fields/${editingField.id}`, dataToSend);
        toast.success('Field updated successfully!');
      } else {
        await axios.post('http://localhost:3001/api/fields', dataToSend);
        toast.success('Field added successfully!');
      }
      handleCloseFieldModal();
      fetchData();
    } catch (error) {
      console.error('Failed to save field:', error);
      toast.error('Failed to save field.');
    }
  };

  const handleDeleteField = async (fieldId) => {
    if (window.confirm('Are you sure you want to delete this field permanently?')) {
      try {
        await axios.delete(`http://localhost:3001/api/fields/${fieldId}`);
        toast.success('Field deleted successfully!');
        fetchData();
      } catch (error) {
        console.error('Failed to delete field:', error);
        toast.error('Failed to delete field.');
      }
    }
  };
  
  if (loading) return <p className="text-on-surface">Loading details...</p>;
  if (error) return <p className="text-on-surface">{error}</p>;
  if (!farmer) return <p className="text-on-surface">Farmer not found.</p>;

  return (
    <div>
      <div className="bg-surface p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold text-on-surface">{farmer.name}'s Profile</h2>
        <p className="text-on-surface-muted mt-2"><strong>Contact:</strong> {farmer.email} | {farmer.phone}</p>
        <p className="text-on-surface-muted"><strong>County:</strong> {farmer.county}</p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-on-surface">Registered Farms</h3>
        <Button onClick={handleOpenAddFarmModal}>Add New Farm</Button>
      </div>

      {farms.length > 0 ? (
        <div className="space-y-4">
          {farms.map(farm => (
            <div key={farm.id} className="bg-surface p-4 rounded-lg shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-bold text-lg text-on-surface">{farm.farmName}</p>
                  <p className="text-sm text-on-surface-muted">{farm.location}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button onClick={() => handleOpenEditFarmModal(farm)} variant="secondary">Edit Farm</Button>
                  {/* --- START: New Delete Button --- */}
                  <Button onClick={() => handleDeleteFarm(farm.id)} variant="destructive">Delete Farm</Button>
                  {/* --- END: New Delete Button --- */}
                  <Button onClick={() => handleOpenAddFieldModal(farm.id)} variant="primary">Add Field</Button>
                </div>
              </div>
              
              <Tab.Group>
                <Tab.List className="flex space-x-4 border-b border-border">
                  <Tab className={({ selected }) =>
                    classNames(
                      'w-full py-2.5 text-sm font-medium leading-5 border-b-2',
                      'focus:outline-none',
                      selected
                        ? 'border-primary text-primary'
                        : 'border-transparent text-on-surface-muted hover:text-on-surface'
                    )
                  }>
                    Inspections & Certs
                  </Tab>
                  <Tab className={({ selected }) =>
                    classNames(
                      'w-full py-2.5 text-sm font-medium leading-5 border-b-2',
                      'focus:outline-none',
                      selected
                        ? 'border-primary text-primary'
                        : 'border-transparent text-on-surface-muted hover:text-on-surface'
                    )
                  }>
                    Fields
                  </Tab>
                </Tab.List>
                <Tab.Panels className="mt-4">
                  <Tab.Panel className="focus:outline-none">
                    <div>
                      <Link
                        to={`/farms/${farm.id}/inspect`}
                        className="inline-block text-center w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 text-white bg-primary hover:bg-primary-hover focus:ring-primary mb-4"
                      >
                        Start New Inspection
                      </Link>

                      {farm.certificates.length > 0 ? (
                         <div className="text-green-700 font-semibold">
                          <a href={`http://localhost:3001${farm.certificates[0].pdfUrl}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-green-100 text-green-800 py-1 px-3 rounded-full text-sm hover:bg-green-200">
                            Download Certificate
                          </a>
                        </div>
                      ) : farm.inspections.length > 0 ? (
                        <ul className="space-y-2 text-sm">
                          {farm.inspections.map(insp => (
                            <li key={insp.id} className="flex justify-between items-center text-on-surface-muted">
                              <span>Inspection on {new Date(insp.date).toLocaleDateString()} - <span className="font-medium text-on-surface">Score: {insp.complianceScore}%</span></span>
                              {insp.complianceScore >= 80 && insp.status !== 'Completed' && (
                                <Button onClick={() => handleApprove(insp.id)} variant="primary" className="py-1 px-3 text-xs">
                                  Approve
                                </Button>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-on-surface-muted">No inspections or certificates found for this farm.</p>
                      )}
                    </div>
                  </Tab.Panel>
                  <Tab.Panel className="focus:outline-none">
                    {farm.fields && farm.fields.length > 0 ? (
                      <ul className="space-y-2 text-sm">
                        {farm.fields.map(field => (
                          <li key={field.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <div>
                              <span className="font-medium text-on-surface">{field.name}</span>
                              <span className="text-on-surface-muted"> - {field.crop} ({field.areaHa} Ha)</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button onClick={() => handleOpenEditFieldModal(field)} variant="secondary" className="py-1 px-2 text-xs">Edit</Button>
                              <Button
                                onClick={() => handleDeleteField(field.id)}
                                variant="destructive"
                                className="py-1 px-2 text-xs"
                              >
                                Delete
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-on-surface-muted">No fields registered for this farm.</p>
                    )}
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-on-surface-muted">No farms registered for this farmer.</p>
      )}

      <Modal isOpen={isFieldModalOpen} onClose={handleCloseFieldModal} title={editingField ? 'Edit Field' : 'Add New Field'}>
        <FieldForm onSave={handleSaveField} onCancel={handleCloseFieldModal} initialData={editingField} />
      </Modal>

      <Modal isOpen={isFarmModalOpen} onClose={handleCloseFarmModal} title={editingFarm ? 'Edit Farm' : 'Add New Farm'}>
        <FarmForm onSave={handleSaveFarm} onCancel={handleCloseFarmModal} initialData={editingFarm} />
      </Modal>
    </div>
  );
}

export default FarmerDetailPage;