import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface ProfileCardProps {
  name?: string;
  email?: string;
  specialization?: string;
  experience?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProfileCard = ({ name = '', email = '', specialization = '', experience = '' }: ProfileCardProps) => {
  const { user, setUser } = useAuth(); // get user from context
  const [formData, setFormData] = useState({
    name: name || user?.name || '',
    specialization: specialization || user?.specialization || '',
    experience: experience || user?.experience || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_BASE_URL}/api/doctors`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.data) {
        setUser(response.data.data);
        localStorage.setItem('user', JSON.stringify(response.data.data));
        toast.success('Profile updated successfully!');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Failed to update profile');
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-6 mb-6">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-2xl">{formData.name.charAt(0).toUpperCase()}</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{formData.name}</h2>
          {formData.specialization && <p className="text-blue-600 font-medium">{formData.specialization}</p>}
          <p className="text-gray-500">{email || user?.email}</p>
        </div>
      </div>

      {/* Editable Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
          <input
            type="text"
            value={formData.specialization}
            onChange={(e) => handleChange('specialization', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
          <input
            type="text"
            value={formData.experience}
            onChange={(e) => handleChange('experience', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
