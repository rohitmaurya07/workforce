import React, { useState } from "react";
import { setUpCompany } from "../redux/adminSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Building2, Upload, CheckCircle2, ChevronRight, ChevronLeft, Shield, Globe, Users, Lock, Image as ImageIcon } from "lucide-react";

const CompanyWizard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1
    companyLogo: null,
    companyName: "",
    legalName: "",
    industry: "",
    foundedYear: "",
    // Step 2
    website: "",
    businessEmail: "",
    phoneNumber: "",
    // Step 3
    companySize: "1-10",
    currency: "USD",
    timezone: "UTC+05:30",
    // Step 4
    loginName: "",
    loginEmail: "",
    loginPassword: "",
  });

  const [errors, setErrors] = useState({});
  const totalSteps = 4;

  const fields = {
    step1: [
      { id: "companyName", label: "Company Name", type: "text", required: true, placeholder: "Acme Inc." },
      { id: "legalName", label: "Legal Registered Name", type: "text", required: false, placeholder: "Acme Corporation LLC" },
      { id: "industry", label: "Industry Sector", type: "text", required: true, placeholder: "Software & Technology" },
      { id: "foundedYear", label: "Founded Year", type: "number", required: false, placeholder: "2024" },
    ],
    step2: [
      { id: "website", label: "Company Website", type: "url", required: false, placeholder: "https://acme.com" },
      { id: "businessEmail", label: "Official Business Email", type: "email", required: true, placeholder: "contact@acme.com" },
      { id: "phoneNumber", label: "Contact Phone Number", type: "tel", required: false, placeholder: "+1 (555) 000-0000" },
    ],
    step3: [
      { id: "companySize", label: "Company Size", type: "select", required: true, options: ["1-10", "11-50", "51-200", "201-500", "500+"] },
      { id: "currency", label: "Default Currency", type: "select", required: true, options: ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "INR"] },
      { id: "timezone", label: "Primary Timezone", type: "select", required: true, options: ["UTC-08:00", "UTC-05:00", "UTC+00:00", "UTC+01:00", "UTC+05:30", "UTC+08:00", "UTC+09:00"] },
    ],
    step4: [
      { id: "loginName", label: "Admin Full Name", type: "text", required: true, placeholder: "John Doe" },
      { id: "loginEmail", label: "Admin Login Email", type: "email", required: true, placeholder: "admin@acme.com" },
      { id: "loginPassword", label: "Admin Password", type: "password", required: true, placeholder: "••••••••" },
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
      [id]: type === "file" ? files[0] : value,
    }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const validateStep = (step) => {
    const stepFields = getStepFields(step);
    const newErrors = {};
    let isValid = true;

    stepFields.forEach((field) => {
      if (field.required) {
        const value = formData[field.id];
        if (!value || (typeof value === "string" && value.trim() === "")) {
          newErrors[field.id] = `${field.label} is required`;
          isValid = false;
        }
        if (field.type === "email" && value && !/\S+@\S+\.\S+/.test(value)) {
          newErrors[field.id] = "Enter a valid email address";
          isValid = false;
        }
        if (field.type === "url" && value && !/^https?:\/\/.+/.test(value)) {
          newErrors[field.id] = "Enter a valid URL starting with http:// or https://";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setLoading(true);
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
    };

    const success = await dispatch(setUpCompany(newFormData));
    setLoading(false);
    if (success) {
      navigate("/");
    }
  };

  const getStepTitle = (step) => {
    const titles = {
      1: "Organization Details",
      2: "Contact Information",
      3: "Regional Preferences",
      4: "Admin Account Setup",
    };
    return titles[step];
  };

  const getStepSubtitle = (step) => {
    const subtitles = {
      1: "Step 1 of 4: Enter basic company info and upload logo",
      2: "Step 2 of 4: Enter official email and website links",
      3: "Step 3 of 4: Configure company size, currency, and timezone",
      4: "Step 4 of 4: Set up administrator account credentials",
    };
    return subtitles[step];
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 sm:px-8 pt-8 pb-6 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Building2 size={20} />
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {getStepTitle(currentStep)}
              </h1>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
              Step {currentStep} / {totalSteps}
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-1">{getStepSubtitle(currentStep)}</p>
        </div>

        {/* Step Progress Pills */}
        <div className="px-6 sm:px-8 pt-6 pb-4 bg-slate-950/40 border-b border-slate-800">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-800 rounded-full z-0" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 rounded-full transition-all duration-300 z-0"
              style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            />

            {[1, 2, 3, 4].map((step) => {
              const isActive = step === currentStep;
              const isCompleted = step < currentStep;
              return (
                <div key={step} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition-all duration-200 ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400 scale-110"
                        : isCompleted
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-slate-900 text-slate-500 border border-slate-800"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 size={16} /> : step}
                  </div>
                  <span className={`text-[10px] uppercase font-semibold mt-1.5 ${isActive ? "text-indigo-400" : "text-slate-500"}`}>
                    {step === 1 ? "Basic" : step === 2 ? "Contact" : step === 3 ? "Config" : "Admin"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-6 space-y-5">
          {currentStep === 1 && (
            <div className="space-y-4">
              {/* Logo Upload Box */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Company Logo
                </label>
                <div className="flex items-center gap-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                  <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {formData.companyLogo ? (
                      <img
                        src={URL.createObjectURL(formData.companyLogo)}
                        alt="Logo preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="text-slate-600" size={24} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <label
                      htmlFor="companyLogo"
                      className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 text-xs font-semibold rounded-xl cursor-pointer transition"
                    >
                      <Upload size={14} />
                      {formData.companyLogo ? "Change Logo" : "Upload Logo Image"}
                    </label>
                    <input
                      id="companyLogo"
                      type="file"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">PNG, JPG, or WEBP up to 5MB</p>
                  </div>
                </div>
              </div>

              {fields.step1.map((field) => (
                <div key={field.id}>
                  <label htmlFor={field.id} className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {field.label} {field.required && <span className="text-rose-400">*</span>}
                  </label>
                  <input
                    id={field.id}
                    type={field.type}
                    value={formData[field.id] || ""}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className={`w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition ${
                      errors[field.id] ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20" : "border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    }`}
                  />
                  {errors[field.id] && <p className="text-xs text-rose-400 mt-1 font-medium">{errors[field.id]}</p>}
                </div>
              ))}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              {fields.step2.map((field) => (
                <div key={field.id}>
                  <label htmlFor={field.id} className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {field.label} {field.required && <span className="text-rose-400">*</span>}
                  </label>
                  <input
                    id={field.id}
                    type={field.type}
                    value={formData[field.id] || ""}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className={`w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition ${
                      errors[field.id] ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20" : "border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    }`}
                  />
                  {errors[field.id] && <p className="text-xs text-rose-400 mt-1 font-medium">{errors[field.id]}</p>}
                </div>
              ))}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              {fields.step3.map((field) => (
                <div key={field.id}>
                  <label htmlFor={field.id} className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {field.label} {field.required && <span className="text-rose-400">*</span>}
                  </label>
                  <select
                    id={field.id}
                    value={formData[field.id] || ""}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                  >
                    {field.options.map((opt) => (
                      <option key={opt} value={opt} className="bg-slate-900 text-slate-100">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              {fields.step4.map((field) => (
                <div key={field.id}>
                  <label htmlFor={field.id} className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {field.label} {field.required && <span className="text-rose-400">*</span>}
                  </label>
                  <input
                    id={field.id}
                    type={field.type}
                    value={formData[field.id] || ""}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className={`w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition ${
                      errors[field.id] ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20" : "border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    }`}
                  />
                  {errors[field.id] && <p className="text-xs text-rose-400 mt-1 font-medium">{errors[field.id]}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-800">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 hover:text-white text-xs font-semibold transition"
              >
                <ChevronLeft size={16} />
                Back
              </button>
            ) : (
              <div />
            )}

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow-lg shadow-indigo-600/20"
              >
                Next Step
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-8 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/20"
              >
                {loading ? "Creating Company..." : "Complete Setup & Launch"}
                <CheckCircle2 size={16} />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyWizard;