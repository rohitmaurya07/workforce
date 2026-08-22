import React, { useState } from 'react';
import { setUpCompany } from '../redux/adminSlice';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CompanyWizard = () => {
    
    
 const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(1);
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        // Step 1
        companyLogo: null,
        companyName: 'Webvault Ltd',
        legalName: 'webbv',
        industry: 'tech',
        foundedYear: '1980',
        // Step 2
        website: '',
        businessEmail: 'rohitmk@gmail.com',
        phoneNumber: '9915011474',
        // Step 3
        companySize: '1-10',
        currency: 'USD',
        timezone: 'UTC-11:00',
        loginName: '',
        loginEmail: '',
        loginPassword: '',
    });

    const [errors, setErrors] = useState({});

    const totalSteps = 4;

    // Field definitions with required/optional status
    const fields = {
        step1: [
            { id: 'companyLogo', label: 'Company Logo', type: 'file', required: false },
            { id: 'companyName', label: 'Company Name', type: 'text', required: true },
            { id: 'legalName', label: 'Legal Name', type: 'text', required: false },
            { id: 'industry', label: 'Industry', type: 'text', required: true },
            { id: 'foundedYear', label: 'Founded Year', type: 'number', required: false },
        ],
        step2: [
            { id: 'website', label: 'Website', type: 'url', required: false },
            { id: 'businessEmail', label: 'Business Email', type: 'email', required: true },
            { id: 'phoneNumber', label: 'Phone Number', type: 'tel', required: false },
        ],
        step3: [
            { id: 'companySize', label: 'Company Size', type: 'select', required: true, options: ['1-10', '11-50', '51-200', '201-500', '500+'] },
            { id: 'currency', label: 'Currency', type: 'select', required: true, options: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'] },
            { id: 'timezone', label: 'Timezone', type: 'select', required: true, options: ['UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:00', 'UTC-08:00', 'UTC-07:00', 'UTC-06:00', 'UTC-05:00', 'UTC-04:00', 'UTC-03:00', 'UTC-02:00', 'UTC-01:00', 'UTC+00:00', 'UTC+01:00', 'UTC+02:00', 'UTC+03:00', 'UTC+04:00', 'UTC+05:00', 'UTC+06:00', 'UTC+07:00', 'UTC+08:00', 'UTC+09:00', 'UTC+10:00', 'UTC+11:00', 'UTC+12:00'] },
        ],
        step4: [
            { id: 'loginName', label: 'Enter Your Name', type: 'text', required: true, },
            { id: 'loginEmail', label: 'Setup Login Email', type: 'email', required: true, },
            { id: 'loginPassword', label: 'Set Password', type: 'password', required: true },
        ],
    };

    const getStepFields = (step) => {
        if (step === 1) return fields.step1;
        if (step === 2) return fields.step2;
        if (step === 3) return fields.step3;
        return fields.step4;
    };

    const handleChange = (e) => {
        const { id, value, type, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: type === 'file' ? files[0] : value,
        }));
        // Clear error for this field
        if (errors[id]) {
            setErrors((prev) => ({ ...prev, [id]: '' }));
        }
    };

    const validateStep = (step) => {
        const stepFields = getStepFields(step);
        const newErrors = {};
        let isValid = true;

        stepFields.forEach((field) => {
            if (field.required) {
                const value = formData[field.id];
                if (!value || (typeof value === 'string' && value.trim() === '')) {
                    newErrors[field.id] = `${field.label} is required`;
                    isValid = false;
                }
                // Email validation
                if (field.type === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
                    newErrors[field.id] = 'Please enter a valid email address';
                    isValid = false;
                }
                // URL validation
                if (field.type === 'url' && value && !/^https?:\/\/.+/.test(value)) {
                    newErrors[field.id] = 'Please enter a valid URL (e.g., https://example.com)';
                    isValid = false;
                }
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            if (currentStep < totalSteps) {
                setCurrentStep(currentStep + 1);
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateStep(currentStep)) {
            // All steps validated, submit the form
            console.log('Form submitted:', formData);
            const newFormData = {
                    name: formData.companyName,
                    legalName: formData.legalName,
                    website: formData.website,
                    email: formData.businessEmail,
                    phone: formData.phoneNumber,
                    logo: formData.companyLogo,
                    industry: formData.industry,
                    companySize: formData.companySize,
                    foundedYear: formData.foundedYear,
                    currency: formData.currency,
                    timezone: formData.timezone,
                    loginEmail: formData.loginEmail,
                    loginPassword: formData.loginPassword,
                    loginName: formData.loginName,
}
dispatch(setUpCompany(newFormData,dispatch))
navigate("/")
console.log(newFormData);

            
            console.log('Company created successfully! 🎉');
        }
    };

    const getStepTitle = (step) => {
        const titles = {
            1: 'Basic Information',
            2: 'Contact Details',
            3: 'Organization Settings',
        };
        return titles[step];
    };

    const getStepSubtitle = (step) => {
        const subtitles = {
            1: 'Create Company',
            2: 'Contact Details',
            3: 'Organization Settings',
        };
        return subtitles[step];
    };

    const renderField = (field) => {
        const value = formData[field.id];
        const error = errors[field.id];
        const isRequired = field.required;

        const baseInputClass = `w-full px-4 py-2.5 rounded-xl border ${error ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400`;

        if (field.type === 'select') {
            return (
                <div key={field.id} className="space-y-1.5">
                    <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                        {field.label}
                        {isRequired && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <select
                        id={field.id}
                        value={value || ''}
                        onChange={handleChange}
                        className={baseInputClass}
                    >
                        <option value="">Select {field.label}</option>
                        {field.options.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
                </div>
            );
        }

        if (field.type === 'file') {
            return (
                <div key={field.id} className="space-y-1.5">
                    <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                        {field.label}
                    </label>
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <input
                                id={field.id}
                                type="file"
                                accept="image/*"
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 file:text-sm file:font-medium hover:file:bg-indigo-100"
                            />
                        </div>
                        {formData.companyLogo && (
                            <div className="w-14 h-14 rounded-xl border-2 border-gray-200 overflow-hidden flex-shrink-0 bg-gray-50 flex items-center justify-center">
                                <img
                                    src={URL.createObjectURL(formData.companyLogo)}
                                    alt="Company logo preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div key={field.id} className="space-y-1.5">
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                    {field.label}
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                    id={field.id}
                    type={field.type}
                    value={value || ''}
                    onChange={handleChange}
                    placeholder={`Enter ${field.label}`}
                    className={baseInputClass}
                />
                {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            </div>
        );
    };

    // Get all required and optional fields for the summary
    const allFields = [...fields.step1, ...fields.step2, ...fields.step3];
    const requiredFields = allFields.filter(f => f.required).map(f => f.label);
    const optionalFields = allFields.filter(f => !f.required).map(f => f.label);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl shadow-indigo-100/50 border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="px-6 sm:px-8 pt-8 pb-6 border-b border-gray-100 bg-white/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            {getStepTitle(currentStep)}
                        </h1>
                        <span className="text-sm font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                            Step {currentStep} of {totalSteps}
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm">
                        {getStepSubtitle(currentStep)}
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="px-6 sm:px-8 pt-6 pb-4">
                    <div className="relative flex items-center justify-between">
                        {/* Background line */}
                        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 rounded-full">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                            />
                        </div>

                        {/* Step indicators */}
                        {[1, 2, 3].map((step) => {
                            const isActive = step === currentStep;
                            const isCompleted = step < currentStep;
                            return (
                                <div key={step} className="relative flex flex-col items-center">
                                    <div
                                        className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10
                                            ${isActive
                                                ? 'border-indigo-500 bg-indigo-500 text-white shadow-lg shadow-indigo-200 scale-110'
                                                : isCompleted
                                                    ? 'border-indigo-500 bg-indigo-100 text-indigo-600'
                                                    : 'border-gray-300 bg-white text-gray-400'
                                            }`}
                                    >
                                        {isCompleted ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <span className="text-sm font-semibold">{step}</span>
                                        )}
                                    </div>
                                    <span className={`text-xs mt-2 font-medium transition-colors duration-200 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`}>
                                        {step === 1 ? 'Basic' : step === 2 ? 'Contact' : 'Settings'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-4">
                    <div className="space-y-5">
                        {getStepFields(currentStep).map((field) => renderField(field))}
                    </div>

                    {/* Navigation Buttons */}
                    <div className={`flex items-center gap-3 mt-8 pt-6 border-t border-gray-100 ${currentStep === 1 ? 'justify-end' : 'justify-between'}`}>
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={handleBack}
                                className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                                Back
                            </button>
                        )}

                        {currentStep < totalSteps ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                            >
                                Next
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium hover:from-emerald-600 hover:to-teal-700 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Create Company
                            </button>
                        )}
                    </div>
                </form>

                {/* Footer - Required/Optional summary */}
                <div className="px-6 sm:px-8 py-4 bg-gray-50/80 border-t border-gray-100">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                            <span className="text-red-500 font-bold">*</span>
                            <span>Required ({requiredFields.length})</span>
                            <span className="text-gray-300">|</span>
                            <span className="flex flex-wrap gap-1">
                                {requiredFields.map((f, i) => (
                                    <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-xs font-medium">
                                        {f}
                                    </span>
                                ))}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400">○</span>
                            <span>Optional ({optionalFields.length})</span>
                            <span className="text-gray-300">|</span>
                            <span className="flex flex-wrap gap-1">
                                {optionalFields.map((f, i) => (
                                    <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">
                                        {f}
                                    </span>
                                ))}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyWizard;