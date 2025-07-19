import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Upload, Building, Mail, Phone, MapPin, Lock, FileText, User, CreditCard } from 'lucide-react';

const BusinessSignup = () => {
  const [formData, setFormData] = useState({
    legalEntityName: '',
    gst: '',
    pan: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    contactPersonName: '',
    contactNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    logo: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length <= 5) {
      errors.push('Password must be more than 5 characters');
    }
    
    if (!/[A-Za-z]/.test(password)) {
      errors.push('Password must contain at least 1 letter');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least 1 number');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least 1 special character');
    }
    
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'password') {
      const errors = validatePassword(value);
      setPasswordErrors(errors);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          logo: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const combineAddress = () => {
    const addressParts = [
      formData.address,
      formData.apartment,
      formData.city,
      formData.state,
      formData.country,
      formData.zipCode
    ].filter(part => part.trim() !== '');
    
    return addressParts.join(', ');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate required fields
    if (!formData.legalEntityName || !formData.gst || !formData.pan || 
        !formData.address || !formData.city || !formData.state || 
        !formData.country || !formData.zipCode || !formData.contactPersonName || 
        !formData.contactNumber || !formData.email || !formData.password || 
        !formData.confirmPassword) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    // Validate password
    const passwordValidationErrors = validatePassword(formData.password);
    if (passwordValidationErrors.length > 0) {
      setError('Please fix password requirements: ' + passwordValidationErrors.join(', '));
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Combine address fields
    const combinedAddress = combineAddress();
    
    const submitData = {
      ...formData,
      address: combinedAddress
    };

    // Simulate API call
    try {
      // Replace this with actual API call: const result = await signup(submitData, 'business');
      console.log('Submitting business data:', submitData);
      // Simulate successful response
      setTimeout(() => {
        setSuccess('Registration request submitted successfully! Please wait for admin approval.');
        setLoading(false);
        navigate('/business/login');
      }, 3000);
    } catch (err) {
      setError('Registration failed. Please try again.');
      setLoading(false);
    }
  };

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
    'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'
  ];

  const countries = [
    'India', 'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Japan', 'Singapore'
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decorations */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '10%',
        width: '300px',
        height: '300px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        transform: 'translate(50%, -50%)'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '5%',
        width: '200px',
        height: '200px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '50%'
      }}></div>

      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '800px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        position: 'relative',
        zIndex: 1,
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Link 
            to="/" 
            style={{ 
              color: '#667eea', 
              textDecoration: 'none', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              marginBottom: '24px',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#4f46e5';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#667eea';
            }}
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '18px',
              color: 'white',
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
            }}>
              NG
            </div>
            <span style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              NandhaGarments
            </span>
          </div>
          
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 25px rgba(245, 158, 11, 0.3)'
          }}>
            <Building size={28} color="white" />
          </div>
          
          <h2 style={{ 
            fontSize: '1.8rem', 
            fontWeight: '700', 
            marginBottom: '8px',
            color: '#1f2937'
          }}>
            Register Your Organization
          </h2>
          <p style={{ 
            color: '#6b7280',
            fontSize: '15px',
            margin: 0
          }}>
            Create an account for your organization to access bulk garment services
          </p>
        </div>

        <div>
          {error && (
            <div style={{ 
              marginBottom: '24px', 
              padding: '16px', 
              background: 'linear-gradient(135deg, #fee2e2, #fecaca)', 
              border: '1px solid #f87171', 
              borderRadius: '12px',
              color: '#dc2626',
              fontSize: '14px',
              fontWeight: '500',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ 
              marginBottom: '24px', 
              padding: '16px', 
              background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)', 
              border: '1px solid #34d399', 
              borderRadius: '12px',
              color: '#065f46',
              fontSize: '14px',
              fontWeight: '500',
              textAlign: 'center'
            }}>
              {success}
            </div>
          )}

          {/* Company Information Section */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#374151',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Building size={18} />
              Company Information
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Legal Entity Name *
              </label>
              <input
                type="text"
                name="legalEntityName"
                placeholder="Company Legal Name"
                value={formData.legalEntityName}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '16px', 
              marginBottom: '20px' 
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  GST Number *
                </label>
                <div style={{ position: 'relative' }}>
                  <FileText size={16} style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af'
                  }} />
                  <input
                    type="text"
                    name="gst"
                    placeholder="GST Number"
                    value={formData.gst}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px 12px 40px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  PAN Number *
                </label>
                <div style={{ position: 'relative' }}>
                  <CreditCard size={16} style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af'
                  }} />
                  <input
                    type="text"
                    name="pan"
                    placeholder="PAN Number"
                    value={formData.pan}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px 12px 40px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Company Address Section */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#374151',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <MapPin size={18} />
              Company Address
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Street Address *
              </label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '16px',
                  color: '#9ca3af'
                }} />
                <input
                  type="text"
                  name="address"
                  placeholder="Building number and street name"
                  value={formData.address}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 40px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Suite, Floor, etc. (Optional)
              </label>
              <div style={{ position: 'relative' }}>
                <Building size={16} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }} />
                <input
                  type="text"
                  name="apartment"
                  placeholder="Suite, floor, building, tower, etc."
                  value={formData.apartment}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 40px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '16px', 
              marginBottom: '20px' 
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  State/Province *
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    boxSizing: 'border-box',
                    backgroundColor: 'white'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="">Select State</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '16px', 
              marginBottom: '20px' 
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Country *
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    boxSizing: 'border-box',
                    backgroundColor: 'white'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="">Select Country</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  ZIP/Postal Code *
                </label>
                <input
                  type="text"
                  name="zipCode"
                  placeholder="ZIP/Postal Code"
                  value={formData.zipCode}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#374151',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <User size={18} />
              Contact Information
            </h3>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '16px', 
              marginBottom: '20px' 
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Contact Person Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af'
                  }} />
                  <input
                    type="text"
                    name="contactPersonName"
                    placeholder="Contact Person Name"
                    value={formData.contactPersonName}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px 12px 40px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Contact Number *
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af'
                  }} />
                  <input
                    type="tel"
                    name="contactNumber"
                    placeholder="Contact Number"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px 12px 40px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Email Address *
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }} />
                <input
                  type="email"
                  name="email"
                  placeholder="organization@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 40px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#374151',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Lock size={18} />
              Account Security
            </h3>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '16px', 
              marginBottom: '20px' 
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af'
                  }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 40px 12px 40px',
                      border: `2px solid ${passwordErrors.length > 0 && formData.password ? '#f87171' : '#e5e7eb'}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = passwordErrors.length > 0 ? '#f87171' : '#667eea';
                      e.target.style.boxShadow = `0 0 0 3px rgba(102, 126, 234, 0.1)`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = passwordErrors.length > 0 && formData.password ? '#f87171' : '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#9ca3af',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#667eea';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#9ca3af';
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {passwordErrors.length > 0 && formData.password && (
                  <div style={{ marginTop: '8px' }}>
                    {passwordErrors.map((error, index) => (
                      <p key={index} style={{ 
                        fontSize: '12px', 
                        color: '#dc2626', 
                        margin: '2px 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <span style={{ color: '#dc2626' }}>•</span>
                        {error}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Confirm Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af'
                  }} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 40px 12px 40px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#9ca3af',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#667eea';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#9ca3af';
                    }}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Company Logo */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Company Logo (Optional)
            </label>
            <div style={{ 
              border: '2px dashed #d1d5db', 
              borderRadius: '12px', 
              padding: '40px 20px', 
              textAlign: 'center',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #f9fafb, #ffffff)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#667eea';
              e.currentTarget.style.background = 'linear-gradient(135deg, #f0f9ff, #e0f2fe)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db';
              e.currentTarget.style.background = 'linear-gradient(135deg, #f9fafb, #ffffff)';
            }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="logo-upload"
              />
              <label htmlFor="logo-upload" style={{ cursor: 'pointer', display: 'block' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #e5e7eb, #f3f4f6)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <Upload size={24} style={{ color: '#9ca3af' }} />
                </div>
                <p style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#374151',
                  margin: '0 0 8px 0'
                }}>
                  Click to upload logo or drag and drop
                </p>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#6b7280',
                  margin: 0
                }}>
                  PNG, JPG up to 2MB
                </p>
              </label>
              {formData.logo && (
                <div style={{ marginTop: '20px' }}>
                  <img 
                    src={formData.logo} 
                    alt="Logo preview" 
                    style={{ 
                      maxWidth: '120px', 
                      maxHeight: '120px', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <p style={{ 
                    fontSize: '12px', 
                    color: '#10b981',
                    marginTop: '8px',
                    fontWeight: '500'
                  }}>
                    Logo uploaded successfully
                  </p>
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={loading || passwordErrors.length > 0}
            style={{
              width: '100%',
              padding: '16px 16px',
              background: loading || passwordErrors.length > 0
                ? '#9ca3af' 
                : 'linear-gradient(135deg, #f59e0b, #d97706)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading || passwordErrors.length > 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: loading || passwordErrors.length > 0 ? 'none' : '0 4px 15px rgba(245, 158, 11, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (!loading && passwordErrors.length === 0) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && passwordErrors.length === 0) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.3)';
              }
            }}
          >
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Creating Account...
              </div>
            ) : (
              'Submit Registration Request'
            )}
          </button>
        </div>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '24px',
          padding: '20px 0',
          borderTop: '1px solid #e5e7eb'
        }}>
          <p style={{ 
            color: '#6b7280',
            fontSize: '14px',
            margin: '0 0 8px 0'
          }}>
            Already have an account?{' '}
            <button 
              onClick={() => console.log('Navigate to business login')}
              style={{ 
                color: '#667eea', 
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#4f46e5';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#667eea';
              }}
            >
              Sign in here
            </button>
          </p>
          <p style={{ 
            color: '#9ca3af',
            fontSize: '12px',
            margin: 0,
            fontStyle: 'italic'
          }}>
            Your registration will be reviewed by our admin team within 24-48 hours
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default BusinessSignup;