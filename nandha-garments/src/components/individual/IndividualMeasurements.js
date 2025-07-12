import React, { useState, useEffect } from 'react';
import Layout from '../common/Layout';
import { individualAPI } from '../../services/api';
import { Plus, Edit3, Trash2, User, Ruler, Calendar, MessageSquare, MoreVertical, Eye } from 'lucide-react';
import AddMeasurement from './AddMeasurement';

const IndividualMeasurements = () => {
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMeasurement, setEditingMeasurement] = useState(null);
  const [viewingMeasurement, setViewingMeasurement] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchMeasurements();
  }, []);

  const fetchMeasurements = async () => {
    try {
      const response = await individualAPI.getMeasurements();
      setMeasurements(response.data.data);
    } catch (error) {
      console.error('Error fetching measurements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeasurement = () => {
    setEditingMeasurement(null);
    setShowAddForm(true);
  };

  const handleEditMeasurement = (measurement) => {
    setEditingMeasurement(measurement);
    setShowAddForm(true);
  };

  const handleViewMeasurement = (measurement) => {
    setViewingMeasurement(measurement);
  };

  const handleDeleteMeasurement = async (id) => {
    if (window.confirm('Are you sure you want to delete this measurement? This action cannot be undone.')) {
      setDeletingId(id);
      try {
        await individualAPI.deleteMeasurement(id);
        fetchMeasurements();
      } catch (error) {
        console.error('Error deleting measurement:', error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleFormSubmit = () => {
    setShowAddForm(false);
    setEditingMeasurement(null);
    fetchMeasurements();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getGenderIcon = (gender) => {
    return gender === 'female' ? '👩' : '👨';
  };

  const getMeasurementFields = (measurement) => {
    const fields = [
      { label: 'Chest', value: measurement.chest, icon: '👔' },
      { label: 'Waist', value: measurement.waist, icon: '📏' },
      { label: 'Shirt Length', value: measurement.shirtLength, icon: '📐' },
      { label: 'Arm Length', value: measurement.armLength, icon: '💪' },
      { label: 'Neck', value: measurement.neck, icon: '👔' },
      { label: 'Hip', value: measurement.hip, icon: '📏' },
      { label: 'Shoulder Width', value: measurement.shoulderWidth, icon: '🤝' },
      { label: 'Seat', value: measurement.seat, icon: '👖' },
      { label: 'Wrist', value: measurement.wrist, icon: '⌚' },
      { label: 'Biceps', value: measurement.biceps, icon: '💪' }
    ].filter(field => field.value && field.value !== '');
    
    return fields;
  };

  if (loading) {
    return (
      <Layout userType="individual">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>
            Loading your measurements...
          </p>
        </div>
      </Layout>
    );
  }

  if (showAddForm) {
    return (
      <Layout userType="individual">
        <AddMeasurement
          userType="individual"
          measurement={editingMeasurement}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowAddForm(false);
            setEditingMeasurement(null);
          }}
        />
      </Layout>
    );
  }

  return (
    <Layout userType="individual">
      <div className="fade-in" style={{ 
        padding: '24px',
        maxWidth: '1200px',
        margin: '0 auto'
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
            width: '200px',
            height: '200px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            transform: 'translate(50%, -50%)'
          }}></div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <h1 style={{ 
                fontSize: '2.5rem', 
                fontWeight: '700', 
                marginBottom: '8px',
                background: 'linear-gradient(45deg, #ffffff, #f0f0f0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                My Measurements
              </h1>
              <p style={{ 
                fontSize: '1.1rem', 
                opacity: 0.9,
                marginBottom: '16px'
              }}>
                Manage your measurements for accurate tailoring
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                fontSize: '14px'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Ruler size={16} />
                  {measurements.length} Measurement{measurements.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            
            <button 
              onClick={handleAddMeasurement}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <Plus size={20} />
              Add Measurement
            </button>
          </div>
        </div>

        {measurements.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px'
          }}>
            {measurements.map((measurement) => (
              <div key={measurement.id} style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 40px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.08)';
              }}
              >
                {/* Header */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginBottom: '20px' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      background: 'linear-gradient(135deg, #667eea, #764ba2)', 
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '20px'
                    }}>
                      {getGenderIcon(measurement.gender)}
                    </div>
                    <div>
                      <h3 style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: '700', 
                        marginBottom: '4px',
                        color: '#1f2937'
                      }}>
                        {measurement.name}
                      </h3>
                      <div style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '14px',
                        color: '#6b7280'
                      }}>
                        <span style={{ textTransform: 'capitalize' }}>
                          {measurement.gender}
                        </span>
                        {measurement.createdAt && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={12} />
                            {formatDate(measurement.createdAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleViewMeasurement(measurement)}
                    style={{
                      background: '#f3f4f6',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px',
                      cursor: 'pointer',
                      color: '#6b7280',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#e5e7eb';
                      e.target.style.color = '#374151';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#f3f4f6';
                      e.target.style.color = '#6b7280';
                    }}
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>

                {/* Notes */}
                {measurement.notes && (
                  <div style={{
                    background: '#f0f9ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '20px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <MessageSquare size={14} style={{ color: '#3b82f6' }} />
                      <span style={{ fontSize: '12px', fontWeight: '500', color: '#3b82f6' }}>
                        Notes
                      </span>
                    </div>
                    <p style={{ 
                      color: '#1e40af', 
                      fontSize: '14px', 
                      margin: 0,
                      fontStyle: 'italic',
                      lineHeight: '1.4'
                    }}>
                      "{measurement.notes}"
                    </p>
                  </div>
                )}

                {/* Key Measurements Grid */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '16px', 
                  marginBottom: '24px' 
                }}>
                  {getMeasurementFields(measurement).slice(0, 4).map((field, index) => (
                    <div key={index} style={{
                      background: '#f9fafb',
                      borderRadius: '8px',
                      padding: '12px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '16px', marginBottom: '4px' }}>
                        {field.icon}
                      </div>
                      <span style={{ 
                        fontSize: '12px', 
                        color: '#6b7280',
                        display: 'block',
                        marginBottom: '4px'
                      }}>
                        {field.label}
                      </span>
                      <p style={{ 
                        fontWeight: '700',
                        fontSize: '16px',
                        margin: 0,
                        color: '#1f2937'
                      }}>
                        {field.value}"
                      </p>
                    </div>
                  ))}
                </div>

                {/* More measurements indicator */}
                {getMeasurementFields(measurement).length > 4 && (
                  <div style={{
                    textAlign: 'center',
                    marginBottom: '20px',
                    padding: '8px',
                    background: '#f3f4f6',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    +{getMeasurementFields(measurement).length - 4} more measurements
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleViewMeasurement(measurement)}
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      background: '#f3f4f6',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#374151',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#e5e7eb';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#f3f4f6';
                    }}
                  >
                    <Eye size={14} />
                    View
                  </button>
                  
                  <button 
                    onClick={() => handleEditMeasurement(measurement)}
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <Edit3 size={14} />
                    Edit
                  </button>
                  
                  <button 
                    onClick={() => handleDeleteMeasurement(measurement.id)}
                    disabled={deletingId === measurement.id}
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      background: deletingId === measurement.id ? '#9ca3af' : '#ef4444',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: deletingId === measurement.id ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (deletingId !== measurement.id) {
                        e.target.style.background = '#dc2626';
                        e.target.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (deletingId !== measurement.id) {
                        e.target.style.background = '#ef4444';
                        e.target.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    {deletingId === measurement.id ? (
                      <>
                        <div style={{
                          width: '14px',
                          height: '14px',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          borderTop: '2px solid white',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }}></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={14} />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '60px 40px',
            textAlign: 'center',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
            border: '2px dashed #d1d5db'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, #e5e7eb, #f3f4f6)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <Ruler size={48} style={{ color: '#9ca3af' }} />
            </div>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700',
              margin: '0 0 12px',
              color: '#374151'
            }}>
              No measurements recorded yet
            </h3>
            <p style={{ 
              color: '#6b7280',
              margin: '0 0 32px',
              fontSize: '16px',
              lineHeight: '1.5'
            }}>
              Start by adding your first measurement to get perfectly tailored clothes
            </p>
            <button 
              onClick={handleAddMeasurement}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                border: 'none',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '16px',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <Plus size={20} />
              Add Your First Measurement
            </button>
          </div>
        )}

        {/* View Measurement Modal */}
        {viewingMeasurement && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setViewingMeasurement(null)}
          >
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, color: '#1f2937' }}>
                  {viewingMeasurement.name} - All Measurements
                </h2>
                <button
                  onClick={() => setViewingMeasurement(null)}
                  style={{
                    background: '#f3f4f6',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px',
                    cursor: 'pointer',
                    fontSize: '18px'
                  }}
                >
                  ×
                </button>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
              }}>
                {getMeasurementFields(viewingMeasurement).map((field, index) => (
                  <div key={index} style={{
                    background: '#f9fafb',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '20px', marginBottom: '8px' }}>
                      {field.icon}
                    </div>
                    <span style={{ 
                      fontSize: '14px', 
                      color: '#6b7280',
                      display: 'block',
                      marginBottom: '8px'
                    }}>
                      {field.label}
                    </span>
                    <p style={{ 
                      fontWeight: '700',
                      fontSize: '18px',
                      margin: 0,
                      color: '#1f2937'
                    }}>
                      {field.value}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default IndividualMeasurements;