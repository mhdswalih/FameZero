import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const ResetPassword = () => {
    interface password {
        oldPassword:string;
        newPassword:string;
        confirmPassword:string;
    }
    const navigate = useNavigate()
    const [formData, setFormData] = useState<password>({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e:React.FormEvent) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const validate = () => {
        const newErrors = {}
        
        if (!formData.oldPassword) newErrors.oldPassword = 'Old password is required'
        if (!formData.newPassword) newErrors.newPassword = 'New password is required'
        else if (formData.newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters'
        
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password'
        else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (validate()) {
            setIsSubmitting(true)
            try {
                // Here you would typically make an API call to reset the password
                console.log('Form submitted:', formData)
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000))
                alert('Password reset successfully!')
                navigate('/login') // Redirect after successful reset
            } catch (error) {
                console.error('Error resetting password:', error)
                alert('Failed to reset password. Please try again.')
            } finally {
                setIsSubmitting(false)
            }
        }
    }

    return (
        <div className='bg-white h-screen w-full'>
            <div className="flex-1 lg:ml-0">
                <header className="bg-white shadow-sm border-b border-gray-100">
                    <div className="flex items-center justify-between h-16 px-6">
                        <h2 className="text-lg font-semibold text-gray-900">Reset Password</h2>
                        <div className="flex items-center gap-2 rounded-full py-1 pr-3 pl-1">
                            <span className="text-sm font-medium text-gray-700"></span>
                        </div>
                    </div>
                </header>
            </div>

            <main className="p-5">
                <div onClick={() => navigate(-1)} className="cursor-pointer mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" 
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" 
                        strokeLinejoin="round" className="icon-arrow-left">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 5 5 12 12 19" />
                    </svg>
                </div>

                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6"
                    >
                        <form onSubmit={handleSubmit}>
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        {/* Content here */}
                                    </div>
                                    <div className="flex-1">
                                        {/* Content here */}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Old Password</h4>
                                        <div className="space-y-3">
                                            <input
                                                type="password"
                                                name="oldPassword"
                                                value={formData.oldPassword}
                                                onChange={handleChange}
                                                className={`w-full px-3 py-2 border rounded-md ${errors.oldPassword ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="Enter old password"
                                            />
                                            {errors.oldPassword && <p className="text-red-500 text-xs mt-1">{errors.oldPassword}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-700 mb-3">New Password</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-start gap-3">
                                                <input
                                                    type="password"
                                                    name="newPassword"
                                                    value={formData.newPassword}
                                                    onChange={handleChange}
                                                    className={`w-full px-3 py-2 border rounded-md ${errors.newPassword ? 'border-red-500' : 'border-gray-300'}`}
                                                    placeholder="Enter new password"
                                                />
                                            </div>
                                            {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
                                        </div>
                                        
                                        <div className="mt-4">
                                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Confirm Password</h4>
                                            <div className="space-y-2">
                                                <div className="flex items-start gap-3">
                                                    <input
                                                        type="password"
                                                        name="confirmPassword"
                                                        value={formData.confirmPassword}
                                                        onChange={handleChange}
                                                        className={`w-full px-3 py-2 border rounded-md ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                                                        placeholder="Confirm new password"
                                                    />
                                                </div>
                                                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-4 py-2 bg-orange-400 text-white rounded-md hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'Processing...' : 'Reset Password'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </main>
        </div>
    )
}

export default ResetPassword