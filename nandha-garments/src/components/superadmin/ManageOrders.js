import React, { useState, useEffect } from 'react';
import Layout from '../common/Layout';
import { superAdminAPI } from '../../services/api';
import { Package, Eye, Calendar, MapPin, User, ShoppingCart, TrendingUp, Clock, CheckCircle, Download, X, Filter } from 'lucide-react';
import { ORDER_STATUS } from '../../utils/constants';
import DownloadOrdersModal from './DownloadOrdersModal';
import { generateOrdersPDF } from '../../utils/pdfGenerator';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await superAdminAPI.getOrders();
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingStatus(orderId);
    try {
      await superAdminAPI.updateOrderStatus(orderId, newStatus);
      fetchOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDownloadOrders = async (filters) => {
    try {
      // Fetch orders with measurements for download
      const response = await superAdminAPI.getOrdersForDownload(filters);
      const ordersWithMeasurements = response.data.data;
      
      // Generate PDF
      generateOrdersPDF(ordersWithMeasurements, filters);
      
      setShowDownloadModal(false);
    } catch (error) {
      console.error('Error downloading orders:', error);
      alert('Failed to download orders. Please try again.');
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: '#f59e0b',
      processing: '#3b82f6',
      shipped: '#8b5cf6',
      delivered: '#10b981',
      cancelled: '#ef4444'
    };
    return statusColors[status?.toLowerCase()] || '#6b7280';
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Clock size={14} />;
      case 'processing':
        return <Package size={14} />;
      case 'shipped':
        return <TrendingUp size={14} />;
      case 'delivered':
        return <CheckCircle size={14} />;
      default:
        return <Package size={14} />;
    }
  };

  if (loading) {
    return (
      <Layout userType="superadmin">
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
            Loading orders...
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userType="superadmin">
      <div className="fade-in" style={{ 
        padding: '24px',
        maxWidth: '1400px',
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
                Manage Orders
              </h1>
              <p style={{ 
                fontSize: '1.1rem', 
                opacity: 0.9,
                marginBottom: '16px'
              }}>
                View and manage all orders across the platform
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
                  {orders.length} Total Orders
                </span>
              </div>
            </div>
            
            {/* Download Button */}
            <button 
              onClick={() => setShowDownloadModal(true)}
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
              <Download size={20} />
              Download Data
            </button>
          </div>
        </div>

        {orders.length > 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e5e7eb',
            overflowX: 'auto'
          }}>
            <div style={{ minWidth: '1000px' }}>
              <table style={{ 
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '14px'
              }}>
                <thead>
                  <tr style={{ background: '#f9fafb' }}>
                    <th style={{ 
                      padding: '16px', 
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '2px solid #e5e7eb'
                    }}>
                      Order ID
                    </th>
                    <th style={{ 
                      padding: '16px', 
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '2px solid #e5e7eb'
                    }}>
                      Customer
                    </th>
                    <th style={{ 
                      padding: '16px', 
                      textAlign: 'center',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '2px solid #e5e7eb'
                    }}>
                      Type
                    </th>
                    <th style={{ 
                      padding: '16px', 
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '2px solid #e5e7eb'
                    }}>
                      Products
                    </th>
                    <th style={{ 
                      padding: '16px', 
                      textAlign: 'right',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '2px solid #e5e7eb'
                    }}>
                      Total Amount
                    </th>
                    <th style={{ 
                      padding: '16px', 
                      textAlign: 'center',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '2px solid #e5e7eb'
                    }}>
                      Status
                    </th>
                    <th style={{ 
                      padding: '16px', 
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '2px solid #e5e7eb'
                    }}>
                      Order Date
                    </th>
                    <th style={{ 
                      padding: '16px', 
                      textAlign: 'center',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '2px solid #e5e7eb'
                    }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={order.id} style={{
                      borderBottom: index < orders.length - 1 ? '1px solid #f3f4f6' : 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f9fafb';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                    >
                      <td style={{ padding: '16px', color: '#3b82f6', fontWeight: '600' }}>
                        #{order.id}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div>
                            <p style={{ fontWeight: '600', marginBottom: '2px', color: '#1f2937' }}>
                              {order.user_name}
                            </p>
                            <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                              {order.user_email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <span style={{ 
                          padding: '6px 12px',
                          background: order.user_type === 'business' 
                            ? 'linear-gradient(135deg, #f59e0b, #d97706)' 
                            : 'linear-gradient(135deg, #10b981, #059669)',
                          color: 'white',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'capitalize'
                        }}>
                          {order.user_type}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div>
                          {order.items.slice(0, 2).map((item, itemIndex) => (
                            <div key={itemIndex} style={{ 
                              marginBottom: '4px',
                              fontSize: '13px',
                              color: '#374151'
                            }}>
                              <span style={{ fontWeight: '500' }}>{item.productName}</span>
                              <span style={{ color: '#6b7280' }}> (Qty: {item.quantity})</span>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <div style={{ 
                              fontSize: '12px', 
                              color: '#3b82f6',
                              fontWeight: '500'
                            }}>
                              +{order.items.length - 2} more items
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ 
                        padding: '16px', 
                        textAlign: 'right',
                        fontWeight: '700',
                        fontSize: '15px',
                        color: '#1f2937'
                      }}>
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          disabled={updatingStatus === order.id}
                          style={{
                            padding: '6px 12px',
                            background: getStatusColor(order.status),
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: updatingStatus === order.id ? 'not-allowed' : 'pointer',
                            opacity: updatingStatus === order.id ? 0.7 : 1
                          }}
                        >
                          {Object.entries(ORDER_STATUS).map(([key, value]) => (
                            <option key={key} value={value} style={{ color: '#1f2937' }}>
                              {value?.charAt(0).toUpperCase() + value?.slice(1).replace('_', ' ') || ''}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px',
                          color: '#6b7280',
                          fontSize: '13px'
                        }}>
                          <Calendar size={14} />
                          {formatDate(order.createdAt)}
                        </div>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          style={{
                            padding: '8px 16px',
                            background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#374151',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
                            e.target.style.color = 'white';
                            e.target.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'linear-gradient(135deg, #f3f4f6, #e5e7eb)';
                            e.target.style.color = '#374151';
                            e.target.style.transform = 'translateY(0)';
                          }}
                        >
                          <Eye size={14} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #e5e7eb, #f3f4f6)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <Package size={36} style={{ color: '#9ca3af' }} />
            </div>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700',
              margin: '0 0 12px',
              color: '#374151'
            }}>
              No orders found
            </h3>
            <p style={{ 
              color: '#6b7280',
              margin: 0,
              fontSize: '16px'
            }}>
              Orders will appear here once customers start placing them
            </p>
          </div>
        )}

        {/* Download Orders Modal */}
        {showDownloadModal && (
          <DownloadOrdersModal
            isOpen={showDownloadModal}
            onClose={() => setShowDownloadModal(false)}
            onDownload={handleDownloadOrders}
            totalOrders={orders.length}
          />
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
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
          onClick={() => setSelectedOrder(null)}
          >
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: '2px solid #e5e7eb'
              }}>
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700',
                  margin: 0,
                  color: '#1f2937'
                }}>
                  Order Details #{selectedOrder.id}
                </h3>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  style={{
                    background: '#f3f4f6',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: '#6b7280',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#e5e7eb';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#f3f4f6';
                  }}
                >
                  ×
                </button>
              </div>

              {/* Customer Information */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ 
                  fontWeight: '600', 
                  marginBottom: '16px',
                  color: '#374151',
                  fontSize: '16px'
                }}>
                  Customer Information
                </h4>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '16px', 
                  padding: '20px', 
                  background: 'linear-gradient(135deg, #f9fafb, #ffffff)', 
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</p>
                    <p style={{ fontWeight: '600', margin: 0, color: '#1f2937' }}>{selectedOrder.user_name}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</p>
                    <p style={{ fontWeight: '500', margin: 0, color: '#1f2937' }}>{selectedOrder.user_email}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</p>
                    <span style={{ 
                      padding: '4px 12px',
                      background: selectedOrder.user_type === 'business' 
                        ? 'linear-gradient(135deg, #f59e0b, #d97706)' 
                        : 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'capitalize'
                    }}>
                      {selectedOrder.user_type}
                    </span>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order Date</p>
                    <p style={{ fontWeight: '500', margin: 0, color: '#1f2937' }}>{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Items Ordered */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ 
                  fontWeight: '600', 
                  marginBottom: '16px',
                  color: '#374151',
                  fontSize: '16px'
                }}>
                  Items Ordered
                </h4>
                <div style={{ 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}>
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '16px 20px',
                      borderBottom: index < selectedOrder.items.length - 1 ? '1px solid #f3f4f6' : 'none',
                      background: index % 2 === 0 ? '#ffffff' : '#f9fafb'
                    }}>
                      <div>
                        <p style={{ 
                          fontWeight: '600', 
                          marginBottom: '6px',
                          color: '#1f2937',
                          fontSize: '15px'
                        }}>
                          {item.productName}
                        </p>
                        <div style={{ 
                          display: 'flex',
                          gap: '16px',
                          fontSize: '13px', 
                          color: '#6b7280'
                        }}>
                          <span>Size: <strong>{item.size}</strong></span>
                          <span>Qty: <strong>{item.quantity}</strong></span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ 
                          fontWeight: '700',
                          margin: '0 0 4px 0',
                          color: '#1f2937',
                          fontSize: '16px'
                        }}>
                          {formatCurrency(item.quantity * item.price)}
                        </p>
                        <p style={{ 
                          fontSize: '13px', 
                          color: '#6b7280',
                          margin: 0
                        }}>
                          {formatCurrency(item.price)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Information */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ 
                  fontWeight: '600', 
                  marginBottom: '16px',
                  color: '#374151',
                  fontSize: '16px'
                }}>
                  Delivery Information
                </h4>
                <div style={{ 
                  padding: '20px', 
                  background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)', 
                  borderRadius: '12px',
                  border: '1px solid #bae6fd'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    marginBottom: '12px' 
                  }}>
                    <MapPin size={16} style={{ color: '#0369a1' }} />
                    <p style={{ 
                      fontWeight: '600',
                      margin: 0,
                      color: '#0369a1'
                    }}>
                      Delivery Address
                    </p>
                  </div>
                  <p style={{ 
                    color: '#1e40af',
                    margin: '0 0 12px 0',
                    lineHeight: '1.5'
                  }}>
                    {selectedOrder.deliveryAddress}
                  </p>
                  <p style={{ 
                    fontSize: '13px', 
                    color: '#0369a1',
                    margin: 0,
                    fontWeight: '500'
                  }}>
                    Measurement ID: #{selectedOrder.measurementId}
                  </p>
                </div>
              </div>

              {/* Order Status & Total */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                paddingTop: '20px', 
                borderTop: '2px solid #e5e7eb',
                gap: '20px',
                flexWrap: 'wrap'
              }}>
                <div>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#6b7280', 
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Current Status
                  </p>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
                      disabled={updatingStatus === selectedOrder.id}
                      style={{
                        padding: '10px 16px',
                        background: getStatusColor(selectedOrder.status),
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: updatingStatus === selectedOrder.id ? 'not-allowed' : 'pointer',
                        opacity: updatingStatus === selectedOrder.id ? 0.7 : 1,
                        minWidth: '140px'
                      }}
                    >
                      {Object.entries(ORDER_STATUS).map(([key, value]) => (
                        <option key={key} value={value} style={{ color: '#1f2937' }}>
                          {value ? value.charAt(0).toUpperCase() + value.slice(1).replace('_', ' ') : ''}
                        </option>
                      ))}
                    </select>
                    {updatingStatus === selectedOrder.id && (
                      <div style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ 
                    fontSize: '20px', 
                    fontWeight: '700',
                    margin: '0 0 6px 0',
                    color: '#1f2937'
                  }}>
                    Total: {formatCurrency(selectedOrder.totalAmount)}
                  </p>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#6b7280',
                    margin: 0,
                    fontWeight: '500'
                  }}>
                    Payment: Cash on Delivery
                  </p>
                </div>
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

export default ManageOrders;