import React, { useState, useEffect } from 'react';
import Layout from '../common/Layout';
import { superAdminAPI } from '../../services/api';
import { 
  Users, 
  Building, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  ArrowRight,
  DollarSign,
  Calendar,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SuperAdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalBusinessUsers: 0,
    totalIndividualUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    pendingApprovals: 0,
    recentOrders: [],
    revenue: 0,
    recentUsers: [],
    recentProducts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await superAdminAPI.getDashboard();
      setDashboardData(response.data.data);
      setError(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(true);
    } finally {
      setLoading(false);
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
      approved: '#10b981',
      blocked: '#ef4444',
      active: '#10b981'
    };
    return statusColors[status] || '#6b7280';
  };

  const getTotalUsers = () => {
    return dashboardData.totalBusinessUsers + dashboardData.totalIndividualUsers;
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
            Loading dashboard...
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
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              marginBottom: '8px',
              background: 'linear-gradient(45deg, #ffffff, #f0f0f0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Super Admin Dashboard
            </h1>
            <p style={{ 
              fontSize: '1.1rem', 
              opacity: 0.9,
              marginBottom: '16px'
            }}>
              Welcome to the command center. Manage everything from here.
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              fontSize: '14px',
              flexWrap: 'wrap'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={16} />
                {getTotalUsers()} Total Users
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Package size={16} />
                {dashboardData.totalProducts} Products
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShoppingCart size={16} />
                {dashboardData.totalOrders} Orders
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <DollarSign size={16} />
                {formatCurrency(dashboardData.revenue)} Revenue
              </span>
            </div>
          </div>
        </div>

        {/* Error Loading Message */}
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
            <div>
              <p style={{ fontWeight: '500', color: '#991b1b', margin: '0 0 4px 0' }}>
                There was an error loading dashboard data
              </p>
              <p style={{ fontSize: '14px', color: '#991b1b', margin: 0 }}>
                Please try refreshing the page or contact support if the problem persists.
              </p>
            </div>
            <button
              onClick={fetchDashboardData}
              style={{
                background: '#dc2626',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                marginLeft: 'auto'
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px',
            padding: '24px',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '80px',
              height: '80px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%'
            }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '12px',
                backdropFilter: 'blur(10px)'
              }}>
                <Building size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>
                  {dashboardData.totalBusinessUsers}
                </h3>
                <p style={{ margin: 0, opacity: 0.9 }}>Business Users</p>
              </div>
            </div>
            <Link 
              to="/superadmin/users" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
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
              View Organizations
              <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            borderRadius: '16px',
            padding: '24px',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(240, 147, 251, 0.3)'
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '80px',
              height: '80px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%'
            }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '12px',
                backdropFilter: 'blur(10px)'
              }}>
                <Users size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>
                  {dashboardData.totalIndividualUsers}
                </h3>
                <p style={{ margin: 0, opacity: 0.9 }}>Individual Users</p>
              </div>
            </div>
            <Link 
              to="/superadmin/users" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
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
              View Individuals
              <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            borderRadius: '16px',
            padding: '24px',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(79, 172, 254, 0.3)'
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '80px',
              height: '80px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%'
            }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '12px',
                backdropFilter: 'blur(10px)'
              }}>
                <Package size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>
                  {dashboardData.totalProducts}
                </h3>
                <p style={{ margin: 0, opacity: 0.9 }}>Total Products</p>
              </div>
            </div>
            <Link 
              to="/superadmin/products" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
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
              View Products
              <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            borderRadius: '16px',
            padding: '24px',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(250, 112, 154, 0.3)'
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '80px',
              height: '80px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%'
            }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '12px',
                backdropFilter: 'blur(10px)'
              }}>
                <ShoppingCart size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>
                  {dashboardData.totalOrders}
                </h3>
                <p style={{ margin: 0, opacity: 0.9 }}>Total Orders</p>
              </div>
            </div>
            <Link 
              to="/superadmin/orders" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
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
              View Orders
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Revenue Card */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px',
            padding: '24px',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '80px',
              height: '80px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%'
            }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '12px',
                backdropFilter: 'blur(10px)'
              }}>
                <TrendingUp size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: '700', margin: 0 }}>
                  {formatCurrency(dashboardData.revenue)}
                </h3>
                <p style={{ margin: 0, opacity: 0.9 }}>Total Revenue</p>
              </div>
            </div>
          </div>

          {/* Pending Approvals Card */}
          <div style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            borderRadius: '16px',
            padding: '24px',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(245, 158, 11, 0.3)'
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '80px',
              height: '80px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%'
            }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '12px',
                backdropFilter: 'blur(10px)'
              }}>
                <Clock size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>
                  {dashboardData.pendingApprovals}
                </h3>
                <p style={{ margin: 0, opacity: 0.9 }}>Pending Approvals</p>
              </div>
            </div>
            <Link 
              to="/superadmin/users" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
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
              Review Pending
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '24px'
        }}>
          {/* Recent Users */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700',
                margin: 0,
                color: '#1f2937'
              }}>
                Recent Registrations
              </h2>
              <Link 
                to="/superadmin/users"
                style={{
                  color: '#3b82f6',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                View All
                <ArrowRight size={16} />
              </Link>
            </div>
            
            {dashboardData.recentUsers && dashboardData.recentUsers.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {dashboardData.recentUsers.slice(0, 5).map((user, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: '#f9fafb',
                    borderRadius: '8px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: user.type === 'business' ? '#f59e0b' : '#10b981',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      {user.type === 'business' ? <Building size={20} /> : <Users size={20} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontWeight: '500',
                        color: '#1f2937',
                        margin: '0 0 2px 0'
                      }}>
                        {user.name}
                      </p>
                      <p style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        margin: 0
                      }}>
                        {user.type} • {formatDate(user.createdAt)}
                      </p>
                    </div>
                    <span style={{
                      background: getStatusColor(user.status),
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: '500',
                      textTransform: 'capitalize'
                    }}>
                      {user.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: '#f3f4f6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <Users size={24} style={{ color: '#9ca3af' }} />
                </div>
                <p style={{ color: '#6b7280', margin: 0 }}>
                  No recent registrations
                </p>
              </div>
            )}
          </div>

          {/* Recent Products */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700',
                margin: 0,
                color: '#1f2937'
              }}>
                Recent Products
              </h2>
              <Link 
                to="/superadmin/products"
                style={{
                  color: '#3b82f6',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                View All
                <ArrowRight size={16} />
              </Link>
            </div>
            
            {dashboardData.recentProducts && dashboardData.recentProducts.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {dashboardData.recentProducts.slice(0, 5).map((product, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: '#f9fafb',
                    borderRadius: '8px'
                  }}>
                    <img
                      src={product.images?.[0] || '/placeholder-product.jpg'}
                      alt={product.name}
                      style={{
                        width: '40px',
                        height: '40px',
                        objectFit: 'cover',
                        borderRadius: '6px'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontWeight: '500',
                        color: '#1f2937',
                        margin: '0 0 2px 0'
                      }}>
                        {product.name}
                      </p>
                      <p style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        margin: 0
                      }}>
                        {formatCurrency(product.sellingPrice)} • {formatDate(product.createdAt)}
                      </p>
                    </div>
                    <span style={{
                      background: getStatusColor(product.status),
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: '500',
                      textTransform: 'capitalize'
                    }}>
                      {product.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: '#f3f4f6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <Package size={24} style={{ color: '#9ca3af' }} />
                </div>
                <p style={{ color: '#6b7280', margin: 0 }}>
                  No recent products added
                </p>
              </div>
            )}
          </div>

          {/* Recent Orders */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e5e7eb',
            gridColumn: 'span 2'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700',
                margin: 0,
                color: '#1f2937'
              }}>
                Recent Orders
              </h2>
              <Link 
                to="/superadmin/orders"
                style={{
                  color: '#3b82f6',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                View All
                <ArrowRight size={16} />
              </Link>
            </div>
            
            {dashboardData.recentOrders && dashboardData.recentOrders.length > 0 ? (
              <div style={{ 
                overflowX: 'auto',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <table style={{ 
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '14px'
                }}>
                  <thead>
                    <tr style={{ background: '#f9fafb' }}>
                      <th style={{ 
                        padding: '12px', 
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        Order ID
                      </th>
                      <th style={{ 
                        padding: '12px', 
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        Customer
                      </th>
                      <th style={{ 
                        padding: '12px', 
                        textAlign: 'right',
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        Amount
                      </th>
                      <th style={{ 
                        padding: '12px', 
                        textAlign: 'center',
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        Status
                      </th>
                      <th style={{ 
                        padding: '12px', 
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recentOrders.slice(0, 5).map((order, index) => (
                      <tr key={index}>
                        <td style={{ padding: '12px', color: '#3b82f6', fontWeight: '500' }}>
                          #{order.id}
                        </td>
                        <td style={{ padding: '12px', color: '#1f2937', fontWeight: '500' }}>
                          {order.customerName}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right', color: '#1f2937', fontWeight: '600' }}>
                          {formatCurrency(order.totalAmount)}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <span style={{
                            background: getStatusColor(order.status),
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            textTransform: 'capitalize'
                          }}>
                            {order.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px', color: '#6b7280' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={12} />
                            {formatDate(order.createdAt)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: '#f3f4f6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <ShoppingCart size={24} style={{ color: '#9ca3af' }} />
                </div>
                <p style={{ color: '#6b7280', margin: 0 }}>
                  No recent orders
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Layout>
  );
};

export default SuperAdminDashboard;