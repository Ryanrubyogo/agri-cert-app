import { useState, useEffect } from 'react';
import Input from './Input';
import Button from './Button';

function FieldForm({ initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    crop: '',
    areaHa: '',
  });

  // When initialData is provided (for editing), populate the form state.
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        crop: initialData.crop || '',
        areaHa: initialData.areaHa || '',
      });
    } else {
      // Reset form when there's no initial data (for creation)
      setFormData({ name: '', crop: '', areaHa: '' });
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
    // Ensure areaHa is a number before saving
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
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Field Name
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., North Field"
            required
          />
        </div>

        <div>
          <label htmlFor="crop" className="block text-sm font-medium text-gray-700">
            Crop Type
          </label>
          <Input
            id="crop"
            name="crop"
            value={formData.crop}
            onChange={handleChange}
            placeholder="e.g., Wheat"
            required
          />
        </div>

        <div>
          <label htmlFor="areaHa" className="block text-sm font-medium text-gray-700">
            Area (Hectares)
          </label>
          <Input
            id="areaHa"
            name="areaHa"
            type="number"
            value={formData.areaHa}
            onChange={handleChange}
            placeholder="e.g., 15.5"
            required
          />
        </div>
      </div>
      
      <div className="mt-6 flex justify-end space-x-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Save
        </Button>
      </div>
    </form>
  );
}

export default FieldForm;