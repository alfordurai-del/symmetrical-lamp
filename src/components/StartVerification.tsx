import React, { useState, useMemo, useRef } from 'react'; // <-- ADDED useRef
import { useNavigate } from 'react-router-dom';
import Header from './Header'; 
import countriesData from 'world-countries';

interface StartVerificationProps {
  onBack: () => void;
}

// --- Success Screen (Unchanged) ---
const SubmissionSuccess: React.FC = () => {
  const navigate = useNavigate();
  const handleContinue = () => navigate('/');

  return (
    <div className="flex-1 p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-[#1F2333] rounded-2xl p-8 text-center shadow-lg">
        <h2 className="text-2xl font-semibold text-white mb-2">
          Submission successful ✅
        </h2>
        <p className="text-gray-400 mb-6">
          Thank you for submitting your KYC documentation. Our team will review
          your information within 48 hours. Please be patient while awaiting the
          results.
        </p>
        <button
          onClick={handleContinue}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-lg transition-transform transform active:scale-95"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

// --- Main Verification Component ---
const StartVerification: React.FC<StartVerificationProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    birthday: '',
    country: '', 
    address: '',
    email: '',
    phone: '',
    countryCode: '+1', 
    documentType: '',
  });

  // --- ADDED: State for uploaded files ---
  const [fileFront, setFileFront] = useState<File | null>(null);
  const [fileBack, setFileBack] = useState<File | null>(null);
  const [filePassport, setFilePassport] = useState<File | null>(null);

  // --- ADDED: Refs for hidden file inputs ---
  const fileInputFrontRef = useRef<HTMLInputElement>(null);
  const fileInputBackRef = useRef<HTMLInputElement>(null);
  const fileInputPassportRef = useRef<HTMLInputElement>(null);

  const [submissionStatus, setSubmissionStatus] = useState<'form' | 'pending'>(() => {
    const status = localStorage.getItem('kycStatus');
    return status === 'pending' ? 'pending' : 'form';
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // --- Process Countries (Unchanged) ---
  const processedCountries = useMemo(() => {
    return countriesData
      .map(country => {
        let phoneCode = null;
        if (country.idd?.root) {
          if (country.idd.suffixes && country.idd.suffixes.length > 0) {
            phoneCode = `${country.idd.root}${country.idd.suffixes[0]}`;
          } else {
            phoneCode = country.idd.root;
          }
        }
        return { name: country.name.common, phoneCode: phoneCode };
      })
      .filter(country => country.name && country.phoneCode)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const phoneCodes = useMemo(() => {
    const codes = new Set<string>();
    codes.add('+1'); 
    processedCountries.forEach(c => {
      if (c.phoneCode) codes.add(c.phoneCode);
    });
    return Array.from(codes).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [processedCountries]);
  // --- END: Process Countries ---


  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountryName = e.target.value;
    const selectedCountry = processedCountries.find(c => c.name === newCountryName);

    if (selectedCountry) {
      setFormData(prev => ({
        ...prev,
        country: selectedCountry.name,
        countryCode: selectedCountry.phoneCode || prev.countryCode,
      }));
    }
  };

  // --- ADDED: Handlers for file upload ---
  const handleUploadClick = (ref: React.RefObject<HTMLInputElement>) => {
    ref.current?.click();
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: 'front' | 'back' | 'passport'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      switch (fileType) {
        case 'front':
          setFileFront(file);
          break;
        case 'back':
          setFileBack(file);
          break;
        case 'passport':
          setFilePassport(file);
          break;
      }
    }
  };
  // --- END: Handlers for file upload ---


  const handleSubmit = () => {
    // You can now check for file uploads in your validation
    console.log("Uploaded files:", { fileFront, fileBack, filePassport });

    localStorage.setItem('kycStatus', 'pending');
    setSubmissionStatus('pending');
  };

  const dummyAssets = []; 
  
  // --- UPDATED: renderUploadSection ---
  const renderUploadSection = () => {
    if (formData.documentType === 'id' || formData.documentType === 'driver') {
      return (
        <div className="space-y-6">
          {/* Front Side */}
          <div>
            <p className="text-white mb-2">Place the Front of ID Card in the Frame</p>
            {/* ADDED: onClick handler */}
            <div 
              className="border-2 border-dashed border-blue-500 rounded-2xl p-8 text-center bg-[#1F2333] cursor-pointer"
              onClick={() => handleUploadClick(fileInputFrontRef)}
            >
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">📷</span>
              </div>
              {/* UPDATED: Show file name or prompt */}
              <p className="text-blue-400 mb-1">
                {fileFront ? fileFront.name : 'Drop your image here, or browse'}
              </p>
              <p className="text-gray-400 text-sm">Supports: JPG, JPEG2000, PNG</p>
              {/* ADDED: Hidden file input */}
              <input 
                type="file"
                ref={fileInputFrontRef}
                onChange={(e) => handleFileChange(e, 'front')}
                className="hidden"
                accept="image/jpeg,image/png,image/jp2"
              />
            </div>
          </div>
          {/* Back Side */}
          <div>
            <p className="text-white mb-2">Place the Back of ID Card in the Frame</p>
            {/* ADDED: onClick handler */}
            <div 
              className="border-2 border-dashed border-blue-500 rounded-2xl p-8 text-center bg-[#1F2333] cursor-pointer"
              onClick={() => handleUploadClick(fileInputBackRef)}
            >
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">📷</span>
              </div>
              {/* UPDATED: Show file name or prompt */}
              <p className="text-blue-400 mb-1">
                {fileBack ? fileBack.name : 'Drop your image here, or browse'}
              </p>
              <p className="text-gray-400 text-sm">Supports: JPG, JPEG2000, PNG</p>
              {/* ADDED: Hidden file input */}
              <input 
                type="file"
                ref={fileInputBackRef}
                onChange={(e) => handleFileChange(e, 'back')}
                className="hidden"
                accept="image/jpeg,image/png,image/jp2"
              />
            </div>
          </div>
        </div>
      );
    } else if (formData.documentType === 'passport') {
      return (
        <div>
          <p className="text-white mb-2">Place your passport inside the frame</p>
          {/* ADDED: onClick handler */}
          <div 
            className="border-2 border-dashed border-blue-500 rounded-2xl p-8 text-center bg-[#1F2333] cursor-pointer"
            onClick={() => handleUploadClick(fileInputPassportRef)}
          >
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">📷</span>
            </div>
            {/* UPDATED: Show file name or prompt */}
            <p className="text-blue-400 mb-1">
              {filePassport ? filePassport.name : 'Drop your image here, or browse'}
            </p>
            <p className="text-gray-400 text-sm">Supports: JPG, JPEG2000, PNG</p>
            {/* ADDED: Hidden file input */}
            <input 
              type="file"
              ref={fileInputPassportRef}
              onChange={(e) => handleFileChange(e, 'passport')}
              className="hidden"
              accept="image/jpeg,image/png,image/jp2"
            />
          </div>
        </div>
      );
    }
    return null;
  };


  return (
    <div className="min-h-screen w-full bg-[#0D0F1C] text-white font-sans flex flex-col">
      <Header
        title="Start verification"
        isSearchOpen={isSearchOpen}
        searchTerm={searchTerm}
        onSearchToggle={() => setIsSearchOpen(!isSearchOpen)}
        onSearchChange={setSearchTerm}
        assets={dummyAssets}
      />

      {submissionStatus === 'form' ? (
        // --- 1. The Form (JSX is unchanged, only functions above were modified) ---
        <div className="flex-1 pt-4 pb-20 px-4 overflow-y-auto borrow-pt verification">
          <div className="space-y-6 pt-2">
            
            {/* First name */}
            <div className="relative">
              <label
                htmlFor="firstName"
                className="absolute left-3 -top-2.5 text-sm text-gray-400 bg-[#0D0F1C] px-1"
              >
                First name:
              </label>
              <input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className="w-full bg-[#1F2333] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Last name */}
            <div className="relative">
              <label
                htmlFor="lastName"
                className="absolute left-3 -top-2.5 text-sm text-gray-400 bg-[#0D0F1C] px-1"
              >
                Last name:
              </label>
              <input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                className="w-full bg-[#1F2333] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Gender */}
            <div className="relative">
              <label
                htmlFor="gender"
                className="absolute left-3 -top-2.5 text-sm text-gray-400 bg-[#0D0F1C] px-1"
              >
                Female / Male:
              </label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="w-full bg-[#1F2333] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Select Gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>

            {/* Birthdate */}
            <div className="relative">
              <label
                htmlFor="birthday"
                className="absolute left-3 -top-2.5 z-50 text-sm text-gray-400 bg-[#0D0F1C] px-1"
              >
                Birthdate:
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  📅
                </span>
                <input
                  id="birthday"
                  type="date"
                  value={formData.birthday}
                  onChange={(e) => handleChange('birthday', e.target.value)}
                  className="w-full bg-[#1F2333] border border-gray-600 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Country */}
            <div className="relative">
              <label
                htmlFor="country"
                className="absolute left-3 -top-2.5 text-sm text-gray-600 bg-[#0D0F1C] px-1"
              >
                Country:
              </label>
              <select
                id="country"
                value={formData.country}
                onChange={handleCountryChange}
                className="w-full bg-[#1F2333] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Select Country</option>
                {processedCountries.map((country) => (
                  <option key={country.name} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Address */}
            <div className="relative">
              <label
                htmlFor="address"
                className="absolute left-3 -top-2.5 text-sm text-gray-400 bg-[#0D0F1C] px-1"
              >
                Address:
              </label>
              <textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full bg-[#1F2333] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                rows={3}
              />
            </div>

            {/* Email */}
            <div className="relative">
              <label
                htmlFor="email"
                className="absolute left-3 -top-2.5 text-sm text-gray-400 bg-[#0D0F1C] px-1"
              >
                Email:
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full bg-[#1F2333] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Phone number */}
            <div className="relative">
              <label
                htmlFor="phone"
                className="absolute left-3 -top-2.5 text-sm text-gray-400 bg-[#0D0F1C] px-1 z-10"
              >
                Phone number:
              </label>
              <div className="flex w-full bg-[#1F2333] border border-gray-600 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                <select
                  aria-label="Country code"
                  value={formData.countryCode}
                  onChange={(e) => handleChange('countryCode', e.target.value)}
                  className="bg-transparent border-r border-gray-500 px-4 py-3 text-white focus:outline-none"
                >
                  {phoneCodes.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
                <input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number..."
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full bg-transparent px-4 py-3 text-white placeholder-gray-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Document */}
            <div className="relative">
              <label
                htmlFor="documentType"
                className="absolute left-3 -top-2.5 text-sm text-gray-400 bg-[#0D0F1C] px-1"
              >
                Document:
              </label>
              <select
                id="documentType"
                value={formData.documentType}
                onChange={(e) => handleChange('documentType', e.target.value)}
                className="w-full bg-[#1F2333] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Select Document Type</option>
                <option value="passport">Passport</option>
                <option value="id">ID Card</option>
                <option value="driver">Driver's License</option>
              </select>
            </div>

            {renderUploadSection()}
          </div>

          <button 
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white font-semibold py-4 rounded-xl mt-6 shadow-lg transition-transform transform active:scale-95"
          >
            Continue
          </button>
        </div>

      ) : (
        // --- 2. The Success Screen ---
        <SubmissionSuccess />
      )}
      
      <div className='scroller'>
        {/* Unchanged */}
      </div>
    </div>
  );
};

export default StartVerification;