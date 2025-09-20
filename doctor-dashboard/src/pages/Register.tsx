import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { AlertCircle, CheckCircle, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'patient'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
        }

        if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
        }

        setLoading(true);

        try {
            await register(formData.email, formData.password, formData.name, formData.role);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Registration failed');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
            <div className="text-center">
            <div className="flex justify-center items-center space-x-2 mb-6">
                <Heart className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Clinix Sphere</h1>
            </div>
            <h2 className="text-xl text-gray-600">Create your account</h2>
            </div>
            
            <div className="bg-white shadow-2xl rounded-2xl px-8 py-10">
            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your full name"
                    required
                />
                </div>
                
                <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                    required
                />
                </div>
                
                <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                    Account Type
                </label>
                <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                </select>
                </div>
                
                <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Create a password"
                    required
                />
                </div>
                
                <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                </label>
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Confirm your password"
                    required
                />
                {formData.password && formData.confirmPassword && (
                    <div className="mt-2 flex items-center space-x-2">
                    {formData.password === formData.confirmPassword ? (
                        <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">Passwords match</span>
                        </>
                    ) : (
                        <>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-600">Passwords don't match</span>
                        </>
                    )}
                    </div>
                )}
                </div>
                
                <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                {loading ? (
                    <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating account...</span>
                    </>
                ) : (
                    <span>Create Account</span>
                )}
                </button>
            </form>
            
            <div className="mt-6 text-center">
                <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign in
                </Link>
                </p>
            </div>
            </div>
        </div>
        </div>
    );
}

export default Register
