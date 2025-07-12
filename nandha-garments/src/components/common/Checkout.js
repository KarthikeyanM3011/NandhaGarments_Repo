// File: src/components/common/Checkout.js
import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { productsAPI, businessAPI, individualAPI } from '../../services/api';
import { 
  ArrowLeft, 
  MapPin, 
  Ruler, 
  CreditCard, 
  Package,
  User,
  CheckCircle,
  AlertCircle,
  Edit,
  Plus,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Checkout = ({ userType = 'individual' }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Single delivery address and measurement for all items
  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });
  
  const [selectedMeasurementId, setSelectedMeasurementId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cartResponse, measurementsResponse] = await Promise.all([
        productsAPI.getCart(),
        userType === 'business' ? businessAPI.getMeasurements() : individualAPI.getMeasurements()
      ]);
      
      const items = cartResponse.data.data || [];
      setCartItems(items);
      setMeasurements(measurementsResponse.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAddressField = (field, value) => {
    setDeliveryAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep = (step) => {
    if (step === 1) {
      return selectedMeasurementId && 
             deliveryAddress.fullName &&
             deliveryAddress.phoneNumber &&
             deliveryAddress.addressLine1 &&
             deliveryAddress.city &&
             deliveryAddress.state &&
             deliveryAddress.pincode;
    }
    return true;
  };

  const formatAddressString = () => {
    const parts = [
      deliveryAddress.fullName,
      deliveryAddress.phoneNumber,
      deliveryAddress.addressLine1,
      deliveryAddress.addressLine2,
      deliveryAddress.city,
      deliveryAddress.state,
      deliveryAddress.pincode,
      deliveryAddress.country
    ].filter(part => part && part.trim() !== ''); // Remove empty parts
    
    return parts.join(', ');
  };

  const handlePlaceOrder = async () => {
    if (!validateStep(1)) {
      alert('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      // Create order data with concatenated address string
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size || 'N/A'
        })),
        deliveryAddress: formatAddressString(),
        measurementId: selectedMeasurementId
      };

      const api = userType === 'business' ? businessAPI : individualAPI;
      const response = await api.createOrder(orderData);
      
      // Clear cart after successful order
      await Promise.all(cartItems.map(item => productsAPI.removeFromCart(item.id)));
      
      setCurrentStep(3); // Success step
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => 
      total + (parseFloat(item.price) * item.quantity), 0
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getMeasurementName = (measurementId) => {
    const measurement = measurements.find(m => m.id.toString() === measurementId.toString());
    return measurement ? measurement.name : 'Select Measurement';
  };

  if (loading) {
    return (
      <Layout userType={userType}>
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
            Loading checkout...
          </p>
        </div>
      </Layout>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Layout userType={userType}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '60px 40px',
          textAlign: 'center',
          maxWidth: '600px',
          margin: '50px auto',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)'
        }}>
          <Package size={60} style={{ color: '#9ca3af', marginBottom: '24px' }} />
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '12px', color: '#374151' }}>
            No items to checkout
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            Your cart is empty. Add some items before proceeding to checkout.
          </p>
          <button
            onClick={() => navigate(`/${userType}/products`)}
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Continue Shopping
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userType={userType}>
      <div className="fade-in" style={{ 
        padding: '24px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header */}
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
          
          <button 
            onClick={() => navigate(`/${userType}/cart`)}
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
          >
            <ArrowLeft size={16} />
            Back to Cart
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
              Checkout
            </h1>
            <p style={{ 
              fontSize: '1.1rem', 
              opacity: 0.9,
              marginBottom: '16px'
            }}>
              Complete your order with delivery details and measurement
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '40px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px'
          }}>
            {[
              { step: 1, label: 'Order Details', icon: Package },
              { step: 2, label: 'Review & Pay', icon: CreditCard },
              { step: 3, label: 'Confirmation', icon: CheckCircle }
            ].map(({ step, label, icon: Icon }, index) => (
              <div key={step} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: currentStep >= step ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : '#e5e7eb',
                  color: currentStep >= step ? 'white' : '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {currentStep > step ? <CheckCircle size={20} /> : <Icon size={20} />}
                </div>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: currentStep >= step ? '#374151' : '#9ca3af'
                }}>
                  {label}
                </span>
                {index < 2 && (
                  <div style={{
                    width: '60px',
                    height: '2px',
                    background: currentStep > step + 1 ? '#3b82f6' : '#e5e7eb',
                    marginLeft: '8px'
                  }}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 400px',
            gap: '32px',
            alignItems: 'start'
          }}>
            {/* Order Details Form */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e5e7eb'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '24px',
                color: '#1f2937'
              }}>
                Order Details
              </h2>

              {/* Measurement Selection */}
              <div style={{
                marginBottom: '32px',
                padding: '24px',
                border: '2px solid #f3f4f6',
                borderRadius: '12px'
              }}>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  marginBottom: '16px',
                  color: '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Ruler size={20} />
                  Select Measurement for All Items
                </h3>
                
                <select
                  value={selectedMeasurementId}
                  onChange={(e) => setSelectedMeasurementId(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    background: 'white',
                    color: '#374151'
                  }}
                >
                  <option value="">Choose measurement</option>
                  {measurements.map(measurement => (
                    <option key={measurement.id} value={measurement.id}>
                      {measurement.name} ({measurement.gender})
                    </option>
                  ))}
                </select>
                
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  marginTop: '8px',
                  margin: 0
                }}>
                  This measurement will be used for all items in your order.
                </p>
              </div>

              {/* Delivery Address */}
              <div style={{
                marginBottom: '32px',
                padding: '24px',
                border: '2px solid #f3f4f6',
                borderRadius: '12px'
              }}>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  marginBottom: '16px',
                  color: '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <MapPin size={20} />
                  Delivery Address
                </h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '16px',
                  marginBottom: '16px'
                }}>
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={deliveryAddress.fullName}
                    onChange={(e) => updateAddressField('fullName', e.target.value)}
                    required
                    style={{
                      padding: '12px 16px',
                      border: '2px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={deliveryAddress.phoneNumber}
                    onChange={(e) => updateAddressField('phoneNumber', e.target.value)}
                    required
                    style={{
                      padding: '12px 16px',
                      border: '2px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                
                <input
                  type="text"
                  placeholder="Address Line 1 *"
                  value={deliveryAddress.addressLine1}
                  onChange={(e) => updateAddressField('addressLine1', e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    marginBottom: '16px'
                  }}
                />
                
                <input
                  type="text"
                  placeholder="Address Line 2 (Optional)"
                  value={deliveryAddress.addressLine2}
                  onChange={(e) => updateAddressField('addressLine2', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    marginBottom: '16px'
                  }}
                />
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px'
                }}>
                  <input
                    type="text"
                    placeholder="City *"
                    value={deliveryAddress.city}
                    onChange={(e) => updateAddressField('city', e.target.value)}
                    required
                    style={{
                      padding: '12px 16px',
                      border: '2px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="State *"
                    value={deliveryAddress.state}
                    onChange={(e) => updateAddressField('state', e.target.value)}
                    required
                    style={{
                      padding: '12px 16px',
                      border: '2px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Pincode *"
                    value={deliveryAddress.pincode}
                    onChange={(e) => updateAddressField('pincode', e.target.value)}
                    required
                    style={{
                      padding: '12px 16px',
                      border: '2px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
              </div>

              {/* Cart Items Preview */}
              <div style={{
                padding: '24px',
                border: '2px solid #f3f4f6',
                borderRadius: '12px'
              }}>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  marginBottom: '16px',
                  color: '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Package size={20} />
                  Items in Your Order
                </h3>
                
                {cartItems.map((item, index) => (
                  <div key={item.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    marginBottom: index < cartItems.length - 1 ? '12px' : '0'
                  }}>
                    <img 
                      src={item.image || '/placeholder-product.jpg'} 
                      alt={item.productName}
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '6px'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <h4 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: '4px'
                      }}>
                        {item.productName}
                      </h4>
                      <p style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        margin: 0
                      }}>
                        {item.size ? `Size: ${item.size} • ` : ''}Qty: {item.quantity} • {formatCurrency(parseFloat(item.price))} each
                      </p>
                    </div>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#1f2937'
                    }}>
                      {formatCurrency(parseFloat(item.price) * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e5e7eb',
              height: 'fit-content',
              position: 'sticky',
              top: '24px'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                marginBottom: '20px',
                color: '#1f2937'
              }}>
                Order Summary
              </h3>

              {/* Items List */}
              <div style={{ marginBottom: '20px' }}>
                {cartItems.map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                    fontSize: '14px'
                  }}>
                    <span style={{ color: '#374151', flex: 1 }}>
                      {item.productName} × {item.quantity}
                    </span>
                    <span style={{ color: '#1f2937', fontWeight: '600' }}>
                      {formatCurrency(parseFloat(item.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{
                paddingTop: '16px',
                borderTop: '2px solid #e5e7eb',
                marginBottom: '24px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#1f2937'
                }}>
                  <span>Total</span>
                  <span>{formatCurrency(calculateTotal())}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div style={{
                background: '#f0f9ff',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '24px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px'
                }}>
                  <CreditCard size={16} style={{ color: '#3b82f6' }} />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e40af' }}>
                    Payment Method
                  </span>
                </div>
                <p style={{ fontSize: '14px', color: '#1e40af', margin: 0 }}>
                  Cash on Delivery (COD)
                </p>
              </div>

              {/* Continue Button */}
              <button
                onClick={() => setCurrentStep(2)}
                disabled={!validateStep(1)}
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  background: !validateStep(1) ? '#9ca3af' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: !validateStep(1) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Review Order
              </button>

              {!validateStep(1) && (
                <div style={{
                  marginTop: '12px',
                  padding: '12px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertCircle size={16} />
                  Please fill in all required fields.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Review & Pay */}
        {currentStep === 2 && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e5e7eb'
          }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              marginBottom: '32px',
              color: '#1f2937'
            }}>
              Review Your Order
            </h2>

            {/* Order Review */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 400px',
              gap: '32px'
            }}>
              <div>
                {/* Order Items */}
                <div style={{
                  marginBottom: '32px',
                  padding: '24px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px'
                }}>
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    marginBottom: '20px',
                    color: '#1f2937'
                  }}>
                    Order Items ({cartItems.length})
                  </h3>
                  
                  {cartItems.map((item, index) => (
                    <div key={item.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '16px',
                      background: '#f9fafb',
                      borderRadius: '8px',
                      marginBottom: index < cartItems.length - 1 ? '16px' : '0'
                    }}>
                      <img 
                        src={item.image || '/placeholder-product.jpg'} 
                        alt={item.productName}
                        style={{
                          width: '80px',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <h4 style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#1f2937',
                          marginBottom: '8px'
                        }}>
                          {item.productName}
                        </h4>
                        <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
                          {item.size && <p style={{ margin: '0 0 4px 0' }}><strong>Size:</strong> {item.size}</p>}
                          <p style={{ margin: '0 0 4px 0' }}><strong>Quantity:</strong> {item.quantity}</p>
                          <p style={{ margin: 0 }}><strong>Price:</strong> {formatCurrency(parseFloat(item.price))} each</p>
                        </div>
                      </div>
                      <div style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#1f2937'
                      }}>
                        {formatCurrency(parseFloat(item.price) * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Measurement Details */}
                <div style={{
                  marginBottom: '32px',
                  padding: '24px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px'
                }}>
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    marginBottom: '16px',
                    color: '#1f2937'
                  }}>
                    Measurement Details
                  </h3>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    <p><strong>Selected Measurement:</strong> {getMeasurementName(selectedMeasurementId)}</p>
                    <p style={{ margin: 0 }}>This measurement will be used for all items in your order.</p>
                  </div>
                </div>

                {/* Delivery Address */}
                <div style={{
                  padding: '24px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px'
                }}>
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    marginBottom: '16px',
                    color: '#1f2937'
                  }}>
                    Delivery Address
                  </h3>
                  <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
                    <p><strong>Name:</strong> {deliveryAddress.fullName}</p>
                    <p><strong>Phone:</strong> {deliveryAddress.phoneNumber}</p>
                    <p><strong>Address:</strong> {deliveryAddress.addressLine1}</p>
                    {deliveryAddress.addressLine2 && <p><strong>Address Line 2:</strong> {deliveryAddress.addressLine2}</p>}
                    <p><strong>City, State, Pincode:</strong> {deliveryAddress.city}, {deliveryAddress.state} - {deliveryAddress.pincode}</p>
                    <div style={{
                      marginTop: '12px',
                      padding: '12px',
                      background: '#f0f9ff',
                      border: '1px solid #bfdbfe',
                      borderRadius: '6px'
                    }}>
                      <p style={{ margin: 0, fontSize: '12px', color: '#1e40af' }}>
                        <strong>Full Address String:</strong> {formatAddressString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Final Summary */}
              <div style={{
                background: '#f9fafb',
                borderRadius: '12px',
                padding: '24px',
                height: 'fit-content',
                position: 'sticky',
                top: '24px'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  marginBottom: '20px',
                  color: '#1f2937'
                }}>
                  Final Summary
                </h3>

                {cartItems.map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    fontSize: '14px'
                  }}>
                    <span style={{ color: '#374151' }}>
                      {item.productName} × {item.quantity}
                    </span>
                    <span style={{ color: '#1f2937', fontWeight: '600' }}>
                      {formatCurrency(parseFloat(item.price) * item.quantity)}
                    </span>
                  </div>
                ))}

                <div style={{
                  paddingTop: '16px',
                  borderTop: '2px solid #e5e7eb',
                  marginBottom: '24px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#1f2937'
                  }}>
                    <span>Total Amount</span>
                    <span>{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>

                <div style={{
                  background: '#f0f9ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '24px'
                }}>
                  <p style={{ fontSize: '14px', color: '#1e40af', margin: 0 }}>
                    <strong>Payment Method:</strong> Cash on Delivery
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setCurrentStep(1)}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      background: 'white',
                      color: '#374151',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={submitting}
                    style={{
                      flex: 2,
                      padding: '12px 16px',
                      background: submitting ? '#9ca3af' : 'linear-gradient(135deg, #10b981, #047857)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    {submitting ? (
                      <>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          borderTop: '2px solid white',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }}></div>
                        Placing Order...
                      </>
                    ) : (
                      <>
                        <Package size={16} />
                        Place Order
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {currentStep === 3 && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '60px 40px',
            textAlign: 'center',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, #10b981, #047857)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 32px'
            }}>
              <CheckCircle size={60} style={{ color: 'white' }} />
            </div>
            
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              marginBottom: '16px',
              color: '#1f2937'
            }}>
              Order Placed Successfully!
            </h2>
            
            <p style={{
              fontSize: '1.1rem',
              color: '#6b7280',
              marginBottom: '32px',
              lineHeight: '1.6'
            }}>
              Thank you for your order! We have received your order details and will begin processing shortly. 
              You will receive updates via phone/email as your order progresses.
            </p>
            
            <div style={{
              background: '#f0f9ff',
              border: '1px solid #bfdbfe',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '32px',
              textAlign: 'left'
            }}>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                marginBottom: '16px',
                color: '#1e40af'
              }}>
                What happens next?
              </h3>
              <ul style={{
                fontSize: '14px',
                color: '#1e40af',
                lineHeight: '1.6',
                margin: 0,
                paddingLeft: '20px'
              }}>
                <li>We will review your measurements and order details</li>
                <li>Our tailors will begin crafting your garments</li>
                <li>You will receive regular updates on your order status</li>
                <li>Your items will be delivered to the specified address</li>
                <li>Payment will be collected upon delivery (COD)</li>
              </ul>
            </div>

            <div style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => navigate(`/${userType}/orders`)}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                View My Orders
              </button>
              <button
                onClick={() => navigate(`/${userType}/products`)}
                style={{
                  padding: '12px 24px',
                  border: '2px solid #e5e7eb',
                  background: 'white',
                  color: '#374151',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @media (max-width: 1024px) {
            .grid-container {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default Checkout;