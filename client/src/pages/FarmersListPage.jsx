import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../apiConfig'
import { toast } from 'react-hot-toast';
import Modal from '../components/Modal';
import FarmerForm from '../components/FarmerForm';
import Button from '../components/Button';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

function FarmersListPage() {
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [isFarmerModalOpen, setIsFarmerModalOpen] = useState(false);
    const [editingFarmer, setEditingFarmer] = useState(null);

     const fetchFarmers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/api/farmers');
            setFarmers(response.data);
        } catch (error) {
            console.error('Error fetching farmers:', error);
            toast.error('Failed to fetch farmers.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFarmers();
    }, [fetchFarmers]);

    const handleOpenAddFarmerModal = () => {
        setEditingFarmer(null);
        setIsFarmerModalOpen(true);
    };

    const handleOpenEditFarmerModal = (farmer) => {
        setEditingFarmer(farmer);
        setIsFarmerModalOpen(true);
    };

    const handleCloseFarmerModal = () => {
        setIsFarmerModalOpen(false);
        setEditingFarmer(null);
    };
    
    const handleSaveFarmer = async (farmerData) => {
        try {
            if (editingFarmer) {
                await apiClient.put(`/api/farmers/${editingFarmer.id}`, farmerData);
                toast.success('Farmer updated successfully!');
            } else {
                await apiClient.post(`/api/farmers`, farmerData);
                toast.success('Farmer added successfully!');
            }
            handleCloseFarmerModal();
            fetchFarmers();
        } catch (error) {
            console.error('Failed to save farmer:', error);
            toast.error('Failed to save farmer.');
        }
    };

    const handleDeleteFarmer = async (farmerId) => {
        if (window.confirm('Are you sure you want to permanently delete this farmer and all their associated data?')) {
            try {
                await apiClient.delete(`/api/farmers/${farmerId}`);
                toast.success('Farmer deleted successfully!');
                fetchFarmers();
            } catch (error) {
                console.error('Failed to delete farmer:', error);
                toast.error('Failed to delete farmer.');
            }
        }
    };
    // --- END: New Delete Farmer Function ---

    if (loading) return <p className="text-on-surface">Loading farmers...</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-on-surface">Farmer Registry</h2>
                <Button onClick={handleOpenAddFarmerModal} variant="primary">
                    Add New Farmer
                </Button>
            </div>

            <div className="bg-surface rounded-lg shadow overflow-hidden">
                <table className="w-full divide-y divide-border">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-muted uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-muted uppercase tracking-wider">County</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-on-surface-muted uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-surface divide-y divide-border">
                        {farmers.map(farmer => (
                            <tr key={farmer.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-on-surface">{farmer.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-muted">{farmer.county}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <Button onClick={() => handleOpenEditFarmerModal(farmer)} variant="secondary" className="py-1 px-3 text-xs">
                                        Edit
                                    </Button>
                                    <Button onClick={() => handleDeleteFarmer(farmer.id)} variant="destructive" className="py-1 px-3 text-xs">
                                        Delete
                                    </Button>
                                    <Link to={`/farmers/${farmer.id}`} className="text-primary hover:text-primary-hover font-medium inline-flex items-center px-3 py-1">
                                        View Details
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isFarmerModalOpen}
                onClose={handleCloseFarmerModal}
                title={editingFarmer ? 'Edit Farmer' : 'Add New Farmer'}
            >
                <FarmerForm
                    onSave={handleSaveFarmer}
                    onCancel={handleCloseFarmerModal}
                    initialData={editingFarmer}
                />
            </Modal>
        </div>
    );
}

export default FarmersListPage;