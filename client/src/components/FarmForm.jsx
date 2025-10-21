import { useState, useEffect } from 'react';
import Input from './Input';
import Button from './Button';

function FarmForm({ initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    farmName: '',
    location: '',
    areaHa: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        farmName: initialData.farmName || '',
        location: initialData.location || '',
        areaHa: initialData.areaHa || '',
      });
    } else {
      setFormData({ farmName: '', location: '', areaHa: '' });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      areaHa: parseFloat(formData.areaHa) || 0,
    };
    onSave(dataToSave);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="farmName" className="block text-sm font-medium text-gray-700">
            Farm Name
          </label>
          <Input
            id="farmName"
            name="farmName"
            value={formData.farmName}
            onChange={handleChange}
            placeholder="e.g., Green Acres"
            required
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Springfield County"
            required
          />
        </div>

        <div>
          <label htmlFor="areaHa" className="block text-sm font-medium text-gray-700">
            Total Area (Hectares)
          </label>
          <Input
            id="areaHa"
            name="areaHa"
            type="number"
            value={formData.areaHa}
            onChange={handleChange}
            placeholder="e.g., 150"
            required
          />
        </div>
      </div>
      
      <div className="mt-6 flex justify-end space-x-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Save Farm
        </Button>
      </div>
    </form>
  );
}

export default FarmForm;