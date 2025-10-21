import { useState, useEffect } from 'react';
import Input from './Input';
import Button from './Button';

function FarmerForm({ initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    county: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        county: initialData.county || '',
      });
    } else {
      // Reset form for creating a new farmer
      setFormData({ name: '', phone: '', email: '', county: '' });
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
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Jane Doe" required />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
          <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="e.g., 555-123-4567" required />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="e.g., jane.doe@example.com" required />
        </div>
        <div>
          <label htmlFor="county" className="block text-sm font-medium text-gray-700">County</label>
          <Input id="county" name="county" value={formData.county} onChange={handleChange} placeholder="e.g., Springfield County" required />
        </div>
      </div>
      
      <div className="mt-6 flex justify-end space-x-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary">Save Farmer</Button>
      </div>
    </form>
  );
}

export default FarmerForm;