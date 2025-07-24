import React, { useState } from 'react';
import { Building, Globe, CreditCard, MapPin, Upload, Save, Edit } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const CompanyProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // General Details State
  const [generalDetails, setGeneralDetails] = useState({
    companyName: 'ESB Technologies Corporation',
    displayName: 'ESB Tech',
    website: 'https://esbtechnologies.com',
    companyContact: 'contact@esbtechnologies.com',
    description: 'Leading technology solutions provider specializing in recruitment and talent acquisition.'
  });

  // Branding State
  const [branding, setBranding] = useState({
    companyLogo: null as File | null,
    socialLogo: null as File | null,
    companyLogoUrl: '/logo.png',
    socialLogoUrl: '/logo.png'
  });

  // Billing Information State
  const [billingInfo, setBillingInfo] = useState({
    currency: 'USD',
    billingLanguage: 'English',
    billingContact: {
      name: 'John Smith',
      email: 'billing@esbtechnologies.com',
      phone: '+1 (555) 123-4567',
      legalCompanyName: 'ESB Technologies Corporation',
      address: '123 Business Ave',
      aptSuite: 'Suite 100',
      city: 'Austin',
      stateProvince: 'TX',
      zipPostal: '78701',
      countryRegion: 'United States'
    },
    soldToContact: {
      sameAsBillTo: false,
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'sales@esbtechnologies.com',
      phone: '+1 (555) 987-6543',
      address: '123 Business Ave',
      aptSuite: 'Suite 100',
      city: 'Austin',
      stateProvince: 'TX',
      zipPostal: '78701',
      countryRegion: 'United States'
    },
    paymentMethod: {
      sameAsBillTo: false,
      address: '123 Business Ave',
      aptSuite: 'Suite 100',
      city: 'Austin',
      stateProvince: 'TX',
      zipPostal: '78701',
      countryRegion: 'United States',
      cardholderName: 'John Smith',
      cardNumber: '',
      cvv: '',
      expirationMonth: '01',
      expirationYear: '2025'
    }
  });

  // Locale Information State
  const [localeInfo, setLocaleInfo] = useState({
    companyName: 'ESB Technologies Corporation',
    displayName: 'ESB Tech',
    website: 'https://esbtechnologies.com',
    companyContact: 'contact@esbtechnologies.com',
    description: 'Leading technology solutions provider specializing in recruitment and talent acquisition.'
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving company profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = (type: 'companyLogo' | 'socialLogo', file: File) => {
    setBranding(prev => ({
      ...prev,
      [type]: file,
      [`${type}Url`]: URL.createObjectURL(file)
    }));
  };

  const handleSameAsBillToChange = (checked: boolean) => {
    setBillingInfo(prev => ({
      ...prev,
      soldToContact: {
        ...prev.soldToContact,
        sameAsBillTo: checked,
        ...(checked ? {
          firstName: prev.billingContact.name.split(' ')[0] || '',
          lastName: prev.billingContact.name.split(' ').slice(1).join(' ') || '',
          email: prev.billingContact.email,
          phone: prev.billingContact.phone,
          address: prev.billingContact.address,
          aptSuite: prev.billingContact.aptSuite,
          city: prev.billingContact.city,
          stateProvince: prev.billingContact.stateProvince,
          zipPostal: prev.billingContact.zipPostal,
          countryRegion: prev.billingContact.countryRegion
        } : {})
      }
    }));
  };

  const handlePaymentSameAsBillToChange = (checked: boolean) => {
    setBillingInfo(prev => ({
      ...prev,
      paymentMethod: {
        ...prev.paymentMethod,
        sameAsBillTo: checked,
        ...(checked ? {
          address: prev.billingContact.address,
          aptSuite: prev.billingContact.aptSuite,
          city: prev.billingContact.city,
          stateProvince: prev.billingContact.stateProvince,
          zipPostal: prev.billingContact.zipPostal,
          countryRegion: prev.billingContact.countryRegion
        } : {})
      }
    }));
  };

  // Generate month options
  const monthOptions = [
    { value: '01', label: '01 - Jan' },
    { value: '02', label: '02 - Feb' },
    { value: '03', label: '03 - Mar' },
    { value: '04', label: '04 - Apr' },
    { value: '05', label: '05 - May' },
    { value: '06', label: '06 - Jun' },
    { value: '07', label: '07 - Jul' },
    { value: '08', label: '08 - Aug' },
    { value: '09', label: '09 - Sep' },
    { value: '10', label: '10 - Oct' },
    { value: '11', label: '11 - Nov' },
    { value: '12', label: '12 - Dec' }
  ];

  // Generate year options (2025-2050)
  const yearOptions = Array.from({ length: 26 }, (_, i) => {
    const year = 2025 + i;
    return { value: year.toString(), label: year.toString() };
  });

  const renderSection = (title: string, icon: React.ReactNode, children: React.ReactNode) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mr-3">
          {icon}
        </div>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Profile"
        subtitle="Manage your company information and settings"
        actions={
          <div className="space-x-2">
            {isEditing ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  isLoading={saving}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>
        }
      />

      {/* General Details Section */}
      {renderSection(
        'General Details',
        <Building className="h-6 w-6 text-blue-600" />,
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Company Name"
            value={generalDetails.companyName}
            onChange={(e) => setGeneralDetails(prev => ({ ...prev, companyName: e.target.value }))}
            disabled={!isEditing}
          />
          <Input
            label="Display Name"
            value={generalDetails.displayName}
            onChange={(e) => setGeneralDetails(prev => ({ ...prev, displayName: e.target.value }))}
            disabled={!isEditing}
          />
          <Input
            label="Website"
            type="url"
            value={generalDetails.website}
            onChange={(e) => setGeneralDetails(prev => ({ ...prev, website: e.target.value }))}
            disabled={!isEditing}
          />
          <Input
            label="Company Contact"
            type="email"
            value={generalDetails.companyContact}
            onChange={(e) => setGeneralDetails(prev => ({ ...prev, companyContact: e.target.value }))}
            disabled={!isEditing}
          />
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full min-h-[100px] rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
              value={generalDetails.description}
              onChange={(e) => setGeneralDetails(prev => ({ ...prev, description: e.target.value }))}
              disabled={!isEditing}
            />
          </div>
        </div>
      )}

      {/* Branding Section */}
      {renderSection(
        'Branding',
        <Globe className="h-6 w-6 text-blue-600" />,
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Company Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Company Logo</label>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {branding.companyLogoUrl ? (
                  <img 
                    src={branding.companyLogoUrl} 
                    alt="Company Logo" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Building className="h-8 w-8 text-gray-400" />
                )}
              </div>
              {isEditing && (
                <div>
                  <input
                    type="file"
                    id="company-logo"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload('companyLogo', file);
                    }}
                  />
                  <label htmlFor="company-logo">
                    <Button as="span" variant="outline" size="sm" className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Upload Logo
                    </Button>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Social Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Social Logo</label>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {branding.socialLogoUrl ? (
                  <img 
                    src={branding.socialLogoUrl} 
                    alt="Social Logo" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Globe className="h-8 w-8 text-gray-400" />
                )}
              </div>
              {isEditing && (
                <div>
                  <input
                    type="file"
                    id="social-logo"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload('socialLogo', file);
                    }}
                  />
                  <label htmlFor="social-logo">
                    <Button as="span" variant="outline" size="sm" className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Upload Logo
                    </Button>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Billing Information Section */}
      {renderSection(
        'Billing Information',
        <CreditCard className="h-6 w-6 text-blue-600" />,
        <div className="space-y-8">
          {/* Basic Billing Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                value={billingInfo.currency}
                onChange={(e) => setBillingInfo(prev => ({ ...prev, currency: e.target.value }))}
                disabled={!isEditing}
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="CAD">CAD - Canadian Dollar</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Billing Language</label>
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                value={billingInfo.billingLanguage}
                onChange={(e) => setBillingInfo(prev => ({ ...prev, billingLanguage: e.target.value }))}
                disabled={!isEditing}
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>
          </div>

          {/* Billing Contact */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Name"
                value={billingInfo.billingContact.name}
                onChange={(e) => setBillingInfo(prev => ({
                  ...prev,
                  billingContact: { ...prev.billingContact, name: e.target.value }
                }))}
                disabled={!isEditing}
              />
              <Input
                label="Email"
                type="email"
                value={billingInfo.billingContact.email}
                onChange={(e) => setBillingInfo(prev => ({
                  ...prev,
                  billingContact: { ...prev.billingContact, email: e.target.value }
                }))}
                disabled={!isEditing}
              />
              <Input
                label="Phone Number"
                value={billingInfo.billingContact.phone}
                onChange={(e) => setBillingInfo(prev => ({
                  ...prev,
                  billingContact: { ...prev.billingContact, phone: e.target.value }
                }))}
                disabled={!isEditing}
              />
              <Input
                label="Legal Company Name"
                value={billingInfo.billingContact.legalCompanyName}
                onChange={(e) => setBillingInfo(prev => ({
                  ...prev,
                  billingContact: { ...prev.billingContact, legalCompanyName: e.target.value }
                }))}
                disabled={!isEditing}
              />
              <Input
                label="Address"
                value={billingInfo.billingContact.address}
                onChange={(e) => setBillingInfo(prev => ({
                  ...prev,
                  billingContact: { ...prev.billingContact, address: e.target.value }
                }))}
                disabled={!isEditing}
              />
              <Input
                label="Apt/Suite"
                value={billingInfo.billingContact.aptSuite}
                onChange={(e) => setBillingInfo(prev => ({
                  ...prev,
                  billingContact: { ...prev.billingContact, aptSuite: e.target.value }
                }))}
                disabled={!isEditing}
              />
              <Input
                label="City"
                value={billingInfo.billingContact.city}
                onChange={(e) => setBillingInfo(prev => ({
                  ...prev,
                  billingContact: { ...prev.billingContact, city: e.target.value }
                }))}
                disabled={!isEditing}
              />
              <Input
                label="State/Province"
                value={billingInfo.billingContact.stateProvince}
                onChange={(e) => setBillingInfo(prev => ({
                  ...prev,
                  billingContact: { ...prev.billingContact, stateProvince: e.target.value }
                }))}
                disabled={!isEditing}
              />
              <Input
                label="Zip/Postal"
                value={billingInfo.billingContact.zipPostal}
                onChange={(e) => setBillingInfo(prev => ({
                  ...prev,
                  billingContact: { ...prev.billingContact, zipPostal: e.target.value }
                }))}
                disabled={!isEditing}
              />
              <Input
                label="Country/Region"
                value={billingInfo.billingContact.countryRegion}
                onChange={(e) => setBillingInfo(prev => ({
                  ...prev,
                  billingContact: { ...prev.billingContact, countryRegion: e.target.value }
                }))}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Sold To Contact */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Sold To Contact</h3>
              {isEditing && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="same-as-bill-to"
                    checked={billingInfo.soldToContact.sameAsBillTo}
                    onChange={(e) => handleSameAsBillToChange(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="same-as-bill-to" className="ml-2 text-sm text-gray-700">
                    Same as Bill To Contact
                  </label>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="First Name"
                value={billingInfo.soldToContact.firstName}
                onChange={(e) => setBillingInfo(prev => ({
                  ...prev,
                  soldToContact: { ...prev.soldToContact, firstName: e.target.value }
                }))}
                disabled={!isEditing || billingInfo.soldToContact.sameAsBillTo}
              />
              <Input
                label="Last Name"
                value={billingInfo.soldToContact.lastName}
                onChange={(e) => setBillingInfo(prev => ({
                  ...prev,
                  soldToContact: { ...prev.soldToContact, lastName: e.target.value }
                }))}
                disabled={!isEditing || billingInfo.soldToContact.sameAsBillTo}
              />
              <Input
                label="Email"
                type="email"
                value={billingInfo.soldToContact.email}
                onChange={(e) => setBillingInfo(prev => ({
                  ...prev,
                  soldToContact: { ...prev.soldToContact, email: e.target.value }
                }))}
                disabled={!isEditing || billingInfo.soldToContact.sameAsBillTo}
              />
              <Input
                label="Phone Number"
                value={billingInfo.soldToContact.phone}
                onChange={(e) => setBillingInfo(prev => ({
                  ...prev,
                  soldToContact: { ...prev.soldToContact, phone: e.target.value }
                }))}
                disabled={!isEditing || billingInfo.soldToContact.sameAsBillTo}
              />
              <Input
                label="Address"
                value={billingInfo.soldToContact.address}
                onChange={(e) => setBillingInfo(prev => ({
                  ...prev,
                  soldToContact: { ...prev.soldToContact, address: e.target.value }
                }))}
                disabled={!isEditing || billingInfo.soldToContact.sameAsBillTo}
              />
              <Input
                label="Apt/Suite"
                value={billingInfo.soldToContact.aptSuite}
                onChange={(e) => setBillingInfo(prev => ({
                  ...prev,
                  soldToContact: { ...prev.soldToContact, aptSuite: e.target.value }
                }))}
                disabled={!isEditing || billingInfo.soldToContact.sameAsBillTo}
              />
              <Input
                label="City"
                value={billingInfo.soldToContact.city}
                onChange={(e) => setBillingInfo(prev => ({
                  ...prev,
                  soldToContact: { ...prev.soldToContact, city: e.target.value }
                }))}
                disabled={!isEditing || billingInfo.soldToContact.sameAsBillTo}
              />
              <Input
                label="State/Province"
                value={billingInfo.soldToContact.stateProvince}
                onChange={(e) => setBillingInfo(prev => ({
                  ...prev,
                  soldToContact: { ...prev.soldToContact, stateProvince: e.target.value }
                }))}
                disabled={!isEditing || billingInfo.soldToContact.sameAsBillTo}
              />
              <Input
                label="Zip/Postal"
                value={billingInfo.soldToContact.zipPostal}
                onChange={(e) => setBillingInfo(prev => ({
                  ...prev,
                  soldToContact: { ...prev.soldToContact, zipPostal: e.target.value }
                }))}
                disabled={!isEditing || billingInfo.soldToContact.sameAsBillTo}
              />
              <Input
                label="Country/Region"
                value={billingInfo.soldToContact.countryRegion}
                onChange={(e) => setBillingInfo(prev => ({
                  ...prev,
                  soldToContact: { ...prev.soldToContact, countryRegion: e.target.value }
                }))}
                disabled={!isEditing || billingInfo.soldToContact.sameAsBillTo}
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
            
            {/* Full Address Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-medium text-gray-800">Full Address</h4>
                {isEditing && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="payment-same-as-bill-to"
                      checked={billingInfo.paymentMethod.sameAsBillTo}
                      onChange={(e) => handlePaymentSameAsBillToChange(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="payment-same-as-bill-to" className="ml-2 text-sm text-gray-700">
                      Same as Bill To Contact
                    </label>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Address"
                  value={billingInfo.paymentMethod.address}
                  onChange={(e) => setBillingInfo(prev => ({
                    ...prev,
                    paymentMethod: { ...prev.paymentMethod, address: e.target.value }
                  }))}
                  disabled={!isEditing || billingInfo.paymentMethod.sameAsBillTo}
                />
                <Input
                  label="Apt/Suite"
                  value={billingInfo.paymentMethod.aptSuite}
                  onChange={(e) => setBillingInfo(prev => ({
                    ...prev,
                    paymentMethod: { ...prev.paymentMethod, aptSuite: e.target.value }
                  }))}
                  disabled={!isEditing || billingInfo.paymentMethod.sameAsBillTo}
                />
                <Input
                  label="City"
                  value={billingInfo.paymentMethod.city}
                  onChange={(e) => setBillingInfo(prev => ({
                    ...prev,
                    paymentMethod: { ...prev.paymentMethod, city: e.target.value }
                  }))}
                  disabled={!isEditing || billingInfo.paymentMethod.sameAsBillTo}
                />
                <Input
                  label="State/Province"
                  value={billingInfo.paymentMethod.stateProvince}
                  onChange={(e) => setBillingInfo(prev => ({
                    ...prev,
                    paymentMethod: { ...prev.paymentMethod, stateProvince: e.target.value }
                  }))}
                  disabled={!isEditing || billingInfo.paymentMethod.sameAsBillTo}
                />
                <Input
                  label="Zip/Postal"
                  value={billingInfo.paymentMethod.zipPostal}
                  onChange={(e) => setBillingInfo(prev => ({
                    ...prev,
                    paymentMethod: { ...prev.paymentMethod, zipPostal: e.target.value }
                  }))}
                  disabled={!isEditing || billingInfo.paymentMethod.sameAsBillTo}
                />
                <Input
                  label="Country/Region"
                  value={billingInfo.paymentMethod.countryRegion}
                  onChange={(e) => setBillingInfo(prev => ({
                    ...prev,
                    paymentMethod: { ...prev.paymentMethod, countryRegion: e.target.value }
                  }))}
                  disabled={!isEditing || billingInfo.paymentMethod.sameAsBillTo}
                />
              </div>
            </div>

            {/* Card Information */}
            <div>
              <h4 className="text-md font-medium text-gray-800 mb-4">Card Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Cardholder Name (exactly as printed on card) *"
                  value={billingInfo.paymentMethod.cardholderName}
                  onChange={(e) => setBillingInfo(prev => ({
                    ...prev,
                    paymentMethod: { ...prev.paymentMethod, cardholderName: e.target.value }
                  }))}
                  disabled={!isEditing}
                  required
                />
                <Input
                  label="Card Number *"
                  value={billingInfo.paymentMethod.cardNumber}
                  onChange={(e) => setBillingInfo(prev => ({
                    ...prev,
                    paymentMethod: { ...prev.paymentMethod, cardNumber: e.target.value }
                  }))}
                  disabled={!isEditing}
                  placeholder="1234 5678 9012 3456"
                  required
                />
                <Input
                  label="CVV *"
                  value={billingInfo.paymentMethod.cvv}
                  onChange={(e) => setBillingInfo(prev => ({
                    ...prev,
                    paymentMethod: { ...prev.paymentMethod, cvv: e.target.value }
                  }))}
                  disabled={!isEditing}
                  placeholder="123"
                  maxLength={4}
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiration Month *
                    </label>
                    <select
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                      value={billingInfo.paymentMethod.expirationMonth}
                      onChange={(e) => setBillingInfo(prev => ({
                        ...prev,
                        paymentMethod: { ...prev.paymentMethod, expirationMonth: e.target.value }
                      }))}
                      disabled={!isEditing}
                      required
                    >
                      {monthOptions.map(month => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiration Year *
                    </label>
                    <select
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                      value={billingInfo.paymentMethod.expirationYear}
                      onChange={(e) => setBillingInfo(prev => ({
                        ...prev,
                        paymentMethod: { ...prev.paymentMethod, expirationYear: e.target.value }
                      }))}
                      disabled={!isEditing}
                      required
                    >
                      {yearOptions.map(year => (
                        <option key={year.value} value={year.value}>
                          {year.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Locale Information Section */}
      {renderSection(
        'Locale Information',
        <MapPin className="h-6 w-6 text-blue-600" />,
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Company Name"
            value={localeInfo.companyName}
            onChange={(e) => setLocaleInfo(prev => ({ ...prev, companyName: e.target.value }))}
            disabled={!isEditing}
          />
          <Input
            label="Display Name"
            value={localeInfo.displayName}
            onChange={(e) => setLocaleInfo(prev => ({ ...prev, displayName: e.target.value }))}
            disabled={!isEditing}
          />
          <Input
            label="Website"
            type="url"
            value={localeInfo.website}
            onChange={(e) => setLocaleInfo(prev => ({ ...prev, website: e.target.value }))}
            disabled={!isEditing}
          />
          <Input
            label="Company Contact"
            type="email"
            value={localeInfo.companyContact}
            onChange={(e) => setLocaleInfo(prev => ({ ...prev, companyContact: e.target.value }))}
            disabled={!isEditing}
          />
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full min-h-[100px] rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
              value={localeInfo.description}
              onChange={(e) => setLocaleInfo(prev => ({ ...prev, description: e.target.value }))}
              disabled={!isEditing}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyProfilePage;