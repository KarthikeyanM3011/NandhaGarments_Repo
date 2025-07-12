// File: src/components/common/Cart.js
import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { productsAPI } from '../../services/api';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  Package,
  AlertCircle,
  Tag,
  Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = ({ userType = 'individual' }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(new Set());
  const [removeLoading, setRemoveLoading] = useState(new Set());

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await productsAPI.getCart();
      setCartItems(response.data.data || []);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdateLoading(prev => new Set([...prev, itemId]));
    try {
      await productsAPI.updateCartItem(itemId, { quantity: newQuantity });
      setCartItems(prev => 
        prev.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setUpdateLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const removeItem = async (itemId) => {
    setRemoveLoading(prev => new Set([...prev, itemId]));
    try {
      await productsAPI.removeFromCart(itemId);
      setCartItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setRemoveLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => 
      total + (parseFloat(item.price) * item.quantity), 0
    );
  };

  const calculateTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
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
            Loading your cart...
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userType={userType}>
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
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              marginBottom: '8px',
              background: 'linear-gradient(45deg, #ffffff, #f0f0f0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Shopping Cart
            </h1>
            <p style={{ 
              fontSize: '1.1rem', 
              opacity: 0.9,
              marginBottom: '16px'
            }}>
              Review your selected items and proceed to checkout
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              fontSize: '14px',
              flexWrap: 'wrap'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShoppingCart size={16} />
                {calculateTotalItems()} Item{calculateTotalItems() !== 1 ? 's' : ''}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Tag size={16} />
                {formatCurrency(calculateSubtotal())} Total
              </span>
            </div>
          </div>
        </div>

        {cartItems.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 400px',
            gap: '32px',
            alignItems: 'start'
          }}>
            {/* Cart Items */}
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
                Cart Items ({cartItems.length})
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {cartItems.map((item) => (
                  <div key={item.id} style={{
                    display: 'flex',
                    gap: '16px',
                    padding: '20px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  >
                    {/* Product Image */}
                    <img 
                      src={item.image || '/placeholder-product.jpg'} 
                      alt={item.productName}
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        flexShrink: 0
                      }}
                    />

                    {/* Product Details */}
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: '8px',
                        lineHeight: '1.3'
                      }}>
                        {item.productName}
                      </h3>

                      {/* Size and Price */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '16px'
                      }}>
                        {item.size && (
                          <span style={{
                            background: '#f3f4f6',
                            padding: '4px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500',
                            color: '#374151'
                          }}>
                            Size: {item.size}
                          </span>
                        )}
                        <span style={{
                          fontSize: '1.1rem',
                          fontWeight: '700',
                          color: '#1f2937'
                        }}>
                          {formatCurrency(parseFloat(item.price))}
                        </span>
                      </div>

                      {/* Quantity Controls */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}>
                          <span style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#374151'
                          }}>
                            Quantity:
                          </span>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px'
                          }}>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || updateLoading.has(item.id)}
                              style={{
                                padding: '6px 8px',
                                border: 'none',
                                background: 'transparent',
                                cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                                color: item.quantity <= 1 ? '#9ca3af' : '#374151',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <Minus size={14} />
                            </button>
                            <span style={{
                              padding: '6px 12px',
                              fontSize: '14px',
                              fontWeight: '500',
                              borderLeft: '1px solid #d1d5db',
                              borderRight: '1px solid #d1d5db'
                            }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={updateLoading.has(item.id)}
                              style={{
                                padding: '6px 8px',
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                color: '#374151',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={removeLoading.has(item.id)}
                          style={{
                            padding: '8px 12px',
                            border: 'none',
                            background: removeLoading.has(item.id) ? '#f9fafb' : '#fef2f2',
                            color: removeLoading.has(item.id) ? '#9ca3af' : '#dc2626',
                            borderRadius: '6px',
                            cursor: removeLoading.has(item.id) ? 'not-allowed' : 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (!removeLoading.has(item.id)) {
                              e.target.style.background = '#fee2e2';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!removeLoading.has(item.id)) {
                              e.target.style.background = '#fef2f2';
                            }
                          }}
                        >
                          {removeLoading.has(item.id) ? (
                            <>
                              <div style={{
                                width: '14px',
                                height: '14px',
                                border: '2px solid #d1d5db',
                                borderTop: '2px solid #9ca3af',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                              }}></div>
                              Removing...
                            </>
                          ) : (
                            <>
                              <Trash2 size={14} />
                              Remove
                            </>
                          )}
                        </button>
                      </div>

                      {/* Item Total */}
                      <div style={{
                        marginTop: '12px',
                        paddingTop: '12px',
                        borderTop: '1px solid #f3f4f6',
                        textAlign: 'right'
                      }}>
                        <span style={{
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#1f2937'
                        }}>
                          Subtotal: {formatCurrency(parseFloat(item.price) * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
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

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '20px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '14px',
                  color: '#6b7280'
                }}>
                  <span>Items ({calculateTotalItems()})</span>
                  <span>{formatCurrency(calculateSubtotal())}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '14px',
                  color: '#6b7280'
                }}>
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '14px',
                  color: '#6b7280'
                }}>
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
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
                  <span>{formatCurrency(calculateSubtotal())}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                to={`/${userType}/checkout`}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '16px 24px',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  marginBottom: '16px'
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
                Proceed to Checkout
                <ArrowRight size={20} style={{ marginLeft: '8px', display: 'inline' }} />
              </Link>

              {/* Continue Shopping */}
              <Link
                to={`/${userType}/products`}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px 24px',
                  border: '2px solid #e5e7eb',
                  color: '#374151',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  textAlign: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.color = '#3b82f6';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.color = '#374151';
                }}
              >
                Continue Shopping
              </Link>

              {/* Security Note */}
              <div style={{
                marginTop: '20px',
                padding: '12px',
                background: '#f0f9ff',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#1e40af',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Package size={16} />
                <span>
                  <strong>Secure Checkout:</strong> Your order will be processed securely with end-to-end encryption.
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Empty Cart */
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '60px 40px',
            textAlign: 'center',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
            border: '2px dashed #d1d5db'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              background: 'linear-gradient(135deg, #e5e7eb, #f3f4f6)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 32px'
            }}>
              <ShoppingCart size={60} style={{ color: '#9ca3af' }} />
            </div>
            <h3 style={{ 
              fontSize: '1.8rem', 
              fontWeight: '700',
              margin: '0 0 16px',
              color: '#374151'
            }}>
              Your cart is empty
            </h3>
            <p style={{ 
              color: '#6b7280',
              margin: '0 0 32px',
              fontSize: '16px',
              lineHeight: '1.5'
            }}>
              Looks like you haven't added any items to your cart yet. <br />
              Start shopping to build your perfect wardrobe!
            </p>
            <Link 
              to={`/${userType}/products`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: 'white',
                textDecoration: 'none',
                padding: '16px 32px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
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
              <ShoppingCart size={20} />
              Start Shopping
            </Link>
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

export default Cart;