import React, { useState, useEffect } from 'react';
import { businessAPI, individualAPI } from '../../services/api';
import { MEASUREMENT_FIELDS } from '../../utils/constants';
import { ArrowLeft, Save, User, Ruler, AlertCircle, Check, FileText } from 'lucide-react';

const AddMeasurement = ({ userType, measurement, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    gender: 'male',
    notes: '',
    chest: '',
    waist: '',
    seat: '',
    shirtLength: '',
    armLength: '',
    neck: '',
    hip: '',
    poloShirtLength: '',
    shoulderWidth: '',
    wrist: '',
    biceps: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [showMeasurementGuide, setShowMeasurementGuide] = useState(false);

  useEffect(() => {
    if (measurement) {
      setFormData(measurement);
    }
  }, [measurement]);

  const validateField = (name, value) => {
    const errors = { ...validationErrors };
    
    if (MEASUREMENT_FIELDS.find(field => field.name === name)) {
      const numValue = parseFloat(value);
      if (value && (isNaN(numValue) || numValue <= 0 || numValue > 100)) {
        errors[name] = 'Please enter a valid measurement (0-100 inches)';
      } else {
        delete errors[name];
      }
    }
    
    if (name === 'name' && value.trim().length < 2) {
      errors[name] = 'Name must be at least 2 characters';
    } else if (name === 'name') {
      delete errors[name];
    }

    if (userType === 'business' && name === 'id' && value.trim().length < 1) {
      errors[name] = 'Customer ID is required';
    } else if (userType === 'business' && name === 'id') {
      delete errors[name];
    }
    
    setValidationErrors(errors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Final validation
    const requiredMeasurements = MEASUREMENT_FIELDS.filter(field => 
      ['chest', 'waist', 'shirtLength', 'armLength'].includes(field.name)
    );
    
    const missingFields = requiredMeasurements.filter(field => 
      !formData[field.name] || formData[field.name].trim() === ''
    );

    if (missingFields.length > 0) {
      setError(`Please fill in required measurements: ${missingFields.map(f => f.label).join(', ')}`);
      setLoading(false);
      return;
    }

    try {
      const api = userType === 'business' ? businessAPI : individualAPI;
      
      if (measurement) {
        await api.updateMeasurement(measurement.id, formData);
      } else {
        await api.addMeasurement(formData);
      }
      
      onSubmit();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save measurement');
    } finally {
      setLoading(false);
    }
  };

  const getFieldIcon = (fieldName) => {
    const iconMap = {
      chest: '👔',
      waist: '📏',
      seat: '👖',
      shirtLength: '📐',
      armLength: '💪',
      neck: '👔',
      hip: '📏',
      shoulderWidth: '🤝',
      wrist: '⌚',
      biceps: '💪'
    };
    return iconMap[fieldName] || '📏';
  };

  const isRequired = (fieldName) => {
    return ['chest', 'waist', 'shirtLength', 'armLength'].includes(fieldName);
  };

  return (
    <div className="fade-in" style={{ 
      padding: '24px',
      maxWidth: '1000px',
      margin: '0 auto',
      minHeight: '100vh'
    }}>
      {/* Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        padding: '32px',
        color: 'white',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '150px',
          height: '150px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          transform: 'translate(30%, -30%)'
        }}></div>
        
        <button 
          onClick={onCancel}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          <ArrowLeft size={16} />
          Back to Measurements
        </button>
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700', 
            marginBottom: '8px',
            background: 'linear-gradient(45deg, #ffffff, #f0f0f0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {measurement ? 'Edit Measurement' : 'Add New Measurement'}
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            opacity: 0.9,
            marginBottom: '16px'
          }}>
            {userType === 'business' 
              ? 'Enter measurement details for accurate tailoring'
              : 'Enter your measurement details for accurate tailoring'
            }
          </p>
          <button
            onClick={() => setShowMeasurementGuide(!showMeasurementGuide)}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              backdropFilter: 'blur(10px)'
            }}
          >
            {showMeasurementGuide ? 'Hide' : 'Show'} Measurement Guide
          </button>
        </div>
      </div>

      {/* Measurement Guide */}
      {showMeasurementGuide && (
        <div style={{
          background: '#f0f9ff',
          border: '1px solid #0ea5e9',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <h4 style={{ color: '#0369a1', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} />
            How to Take Measurements
          </h4>
          <div style={{ fontSize: '14px', color: '#0369a1', lineHeight: '1.6' }}>
            <p><strong>Tips for accurate measurements:</strong></p>
            <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
              <li>Use a flexible measuring tape</li>
              <li>Measure over light clothing or directly on skin</li>
              <li>Keep the tape parallel to the floor</li>
              <li>Don't pull the tape too tight - it should be snug but comfortable</li>
              <li>Take measurements in front of a mirror if possible</li>
            </ul>
          </div>
        </div>
      )}

      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e5e7eb'
      }}>
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <AlertCircle size={20} style={{ color: '#dc2626', flexShrink: 0 }} />
              <span style={{ color: '#dc2626', fontSize: '14px' }}>{error}</span>
            </div>
          )}

          {/* Basic Information Section */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: '2px solid #e5e7eb'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                borderRadius: '10px',
                padding: '8px',
                color: 'white'
              }}>
                <User size={20} />
              </div>
              <h3 style={{ 
                fontSize: '1.4rem', 
                fontWeight: '700',
                margin: 0,
                color: '#1f2937'
              }}>
                {userType === 'business' ? 'Customer Information' : 'Basic Information'}
              </h3>
            </div>
            
            {userType === 'business' ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
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
                    Customer ID <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="id"
                    placeholder="Enter customer ID"
                    value={formData.id}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `2px solid ${validationErrors.id ? '#dc2626' : '#e5e7eb'}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                      background: 'white'
                    }}
                    onFocus={(e) => {
                      if (!validationErrors.id) {
                        e.target.style.borderColor = '#3b82f6';
                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      if (!validationErrors.id) {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  />
                  {validationErrors.id && (
                    <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                      {validationErrors.id}
                    </p>
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
                    Customer Name <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter customer name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `2px solid ${validationErrors.name ? '#dc2626' : '#e5e7eb'}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                      background: 'white'
                    }}
                    onFocus={(e) => {
                      if (!validationErrors.name) {
                        e.target.style.borderColor = '#3b82f6';
                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      if (!validationErrors.name) {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  />
                  {validationErrors.name && (
                    <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                      {validationErrors.name}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Name <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: `2px solid ${validationErrors.name ? '#dc2626' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    background: 'white'
                  }}
                  onFocus={(e) => {
                    if (!validationErrors.name) {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    if (!validationErrors.name) {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                />
                {validationErrors.name && (
                  <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                    {validationErrors.name}
                  </p>
                )}
              </div>
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Gender <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    background: 'white',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
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
                  Special Notes
                </label>
                <input
                  type="text"
                  name="notes"
                  placeholder="Any special notes for the tailor..."
                  value={formData.notes}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    background: 'white'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Measurements Section */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: '2px solid #e5e7eb'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                borderRadius: '10px',
                padding: '8px',
                color: 'white'
              }}>
                <Ruler size={20} />
              </div>
              <h3 style={{ 
                fontSize: '1.4rem', 
                fontWeight: '700',
                margin: 0,
                color: '#1f2937'
              }}>
                Body Measurements
              </h3>
              <span style={{
                background: '#fef3c7',
                color: '#92400e',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                All measurements in inches
              </span>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {MEASUREMENT_FIELDS.map((field) => (
                <div key={field.name}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    <span style={{ marginRight: '8px' }}>{getFieldIcon(field.name)}</span>
                    {field.label} ({field.unit})
                    {isRequired(field.name) && <span style={{ color: '#dc2626' }}> *</span>}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      step="0.1"
                      name={field.name}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      value={formData[field.name]}
                      onChange={handleChange}
                      required={isRequired(field.name)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        paddingRight: formData[field.name] && !validationErrors[field.name] ? '40px' : '16px',
                        border: `2px solid ${validationErrors[field.name] ? '#dc2626' : (formData[field.name] && !validationErrors[field.name] ? '#10b981' : '#e5e7eb')}`,
                        borderRadius: '8px',
                        fontSize: '14px',
                        transition: 'all 0.3s ease',
                        background: 'white'
                      }}
                      onFocus={(e) => {
                        if (!validationErrors[field.name]) {
                          e.target.style.borderColor = '#3b82f6';
                          e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                        }
                      }}
                      onBlur={(e) => {
                        if (!validationErrors[field.name]) {
                          e.target.style.borderColor = formData[field.name] ? '#10b981' : '#e5e7eb';
                          e.target.style.boxShadow = 'none';
                        }
                      }}
                    />
                    {formData[field.name] && !validationErrors[field.name] && (
                      <Check 
                        size={16} 
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#10b981'
                        }}
                      />
                    )}
                  </div>
                  {validationErrors[field.name] && (
                    <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                      {validationErrors[field.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'flex-end',
            paddingTop: '24px',
            borderTop: '1px solid #e5e7eb'
          }}>
            <button 
              type="button" 
              onClick={onCancel}
              style={{
                padding: '12px 24px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                background: 'white',
                color: '#374151',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.background = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.background = 'white';
              }}
            >
              Cancel
            </button>
            
            <button 
              type="submit" 
              disabled={loading || Object.keys(validationErrors).length > 0}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                background: loading || Object.keys(validationErrors).length > 0 
                  ? '#9ca3af' 
                  : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                cursor: loading || Object.keys(validationErrors).length > 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (!loading && Object.keys(validationErrors).length === 0) {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && Object.keys(validationErrors).length === 0) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {measurement ? 'Update Measurement' : 'Save Measurement'}
                </>
              )}
            </button>
          </div>
        </form>
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

export default AddMeasurement;