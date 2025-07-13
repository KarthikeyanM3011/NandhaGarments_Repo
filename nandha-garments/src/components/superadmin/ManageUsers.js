import React, { useState, useEffect } from 'react';
import Layout from '../common/Layout';
import { superAdminAPI } from '../../services/api';
import { 
  Users, 
  Building, 
  Check, 
  X, 
  Ban, 
  CheckCircle, 
  Search,
  Filter,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Eye,
  ArrowUpDown,
  UserCheck,
  UserX
} from 'lucide-react';

const ManageUsers = () => {
  const [businessUsers, setBusinessUsers] = useState([]);
  const [individualUsers, setIndividualUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('business');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(new Set());

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  useEffect(() => {
    filterAndSortUsers();
  }, [businessUsers, individualUsers, activeTab, searchTerm, statusFilter, sortBy]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      if (activeTab === 'business') {
        const response = await superAdminAPI.getUsers('business');
        setBusinessUsers(response.data.data);
      } else {
        const response = await superAdminAPI.getUsers('individual');
        setIndividualUsers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortUsers = () => {
    const currentUsers = activeTab === 'business' ? businessUsers : individualUsers;
    let filtered = [...currentUsers];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.legalEntityName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toString().includes(searchTerm)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    // Sort users
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'name':
          const nameA = a.name || a.legalEntityName || '';
          const nameB = b.name || b.legalEntityName || '';
          return nameA.localeCompare(nameB);
        default:
          return 0;
      }
    });

    setFilteredUsers(filtered);
  };

  const handleUserAction = async (id, action) => {
    setActionLoading(prev => new Set([...prev, `${id}-${action}`]));
    
    try {
      switch (action) {
        case 'approve':
          await superAdminAPI.approveUser(id);
          break;
        case 'block':
          await superAdminAPI.blockUser(id);
          break;
        case 'unblock':
          await superAdminAPI.unblockUser(id);
          break;
      }
      fetchUsers();
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
    } finally {
      setActionLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(`${id}-${action}`);
        return newSet;
      });
    }
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
      blocked: '#ef4444'
    };
    return statusColors[status] || '#6b7280';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Check size={14} />;
      case 'approved':
        return <CheckCircle size={14} />;
      case 'blocked':
        return <Ban size={14} />;
      default:
        return <Check size={14} />;
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
            Loading users...
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
              Manage Users
            </h1>
            <p style={{ 
              fontSize: '1.1rem', 
              opacity: 0.9,
              marginBottom: '16px'
            }}>
              View and manage all registered users on the platform
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              fontSize: '14px',
              flexWrap: 'wrap'
            }}>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '8px',
          marginBottom: '24px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e5e7eb',
          display: 'flex',
          gap: '8px'
        }}>
          <button
            onClick={() => setActiveTab('business')}
            style={{
              flex: 1,
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              background: activeTab === 'business' 
                ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
                : 'transparent',
              color: activeTab === 'business' ? 'white' : '#6b7280',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
          >
            <Building size={20} />
            Business Users ({businessUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('individual')}
            style={{
              flex: 1,
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              background: activeTab === 'individual' 
                ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
                : 'transparent',
              color: activeTab === 'individual' ? 'white' : '#6b7280',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
          >
            <Users size={20} />
            Individual Users ({individualUsers.length})
          </button>
        </div>

        {/* Filters and Search */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            alignItems: 'end'
          }}>
            {/* Search */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Search Users
              </label>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }} />
                <input
                  type="text"
                  placeholder="Search by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Filter by Status
              </label>
              <div style={{ position: 'relative' }}>
                <Filter size={16} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: 'white',
                    outline: 'none'
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
            </div>

            {/* Sort */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Sort Users
              </label>
              <div style={{ position: 'relative' }}>
                <ArrowUpDown size={16} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: 'white',
                    outline: 'none'
                  }}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results info */}
          <div style={{
            paddingTop: '16px',
            borderTop: '1px solid #e5e7eb',
            fontSize: '14px',
            color: '#6b7280',
            marginTop: '16px'
          }}>
            Showing {filteredUsers.length} of {activeTab === 'business' ? businessUsers.length : individualUsers.length} users
            {searchTerm && (
              <span> for "{searchTerm}"</span>
            )}
          </div>
        </div>

        {/* Users Display */}
        {filteredUsers.length > 0 ? (
          <div style={{
            display: 'grid',
            gap: '16px'
          }}>
            {filteredUsers.map((user) => (
              <div key={user.id} style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.06)';
              }}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr auto',
                  gap: '20px',
                  alignItems: 'center'
                }}>
                  {/* User Avatar and Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: activeTab === 'business' 
                        ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                        : 'linear-gradient(135deg, #10b981, #059669)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '24px'
                    }}>
                      {activeTab === 'business' ? <Building size={24} /> : <Users size={24} />}
                    </div>
                    
                    <div>
                      <h3 style={{
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        color: '#1f2937',
                        margin: '0 0 4px 0'
                      }}>
                        #{user.id} - {activeTab === 'business' ? user.legalEntityName : user.name}
                      </h3>
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        fontSize: '14px',
                        color: '#6b7280',
                        flexWrap: 'wrap'
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Mail size={12} />
                          {user.email}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Phone size={12} />
                          {user.contactNumber}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} />
                          {formatDate(user.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* User Details */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px'
                  }}>
                    {activeTab === 'business' && (
                      <div style={{
                        background: '#f9fafb',
                        padding: '12px',
                        borderRadius: '8px'
                      }}>
                        <p style={{
                          fontSize: '12px',
                          color: '#6b7280',
                          margin: '0 0 4px 0',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          GST & PAN
                        </p>
                        <p style={{
                          fontSize: '14px',
                          color: '#1f2937',
                          fontWeight: '500',
                          margin: 0
                        }}>
                          GST: {user.gst}<br />
                          PAN: {user.pan}
                        </p>
                      </div>
                    )}
                    
                    <div style={{
                      background: '#f9fafb',
                      padding: '12px',
                      borderRadius: '8px'
                    }}>
                      <p style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        margin: '0 0 4px 0',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        {activeTab === 'business' ? 'Contact Person' : 'Address'}
                      </p>
                      <p style={{
                        fontSize: '14px',
                        color: '#1f2937',
                        fontWeight: '500',
                        margin: 0
                      }}>
                        {activeTab === 'business' ? user.contactPersonName : user.address}
                      </p>
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '12px'
                  }}>
                    {/* Status Badge */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: getStatusColor(user.status),
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {getStatusIcon(user.status)}
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setSelectedUser(user)}
                        style={{
                          padding: '6px 12px',
                          background: '#f3f4f6',
                          border: 'none',
                          borderRadius: '6px',
                          color: '#374151',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#e5e7eb';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#f3f4f6';
                        }}
                      >
                        <Eye size={12} />
                        View
                      </button>

                      {user.status === 'pending' && (
                        <button
                          onClick={() => handleUserAction(user.id, 'approve')}
                          disabled={actionLoading.has(`${user.id}-approve`)}
                          style={{
                            padding: '6px 12px',
                            background: actionLoading.has(`${user.id}-approve`) ? '#9ca3af' : '#10b981',
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: actionLoading.has(`${user.id}-approve`) ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {actionLoading.has(`${user.id}-approve`) ? (
                            <div style={{
                              width: '12px',
                              height: '12px',
                              border: '2px solid rgba(255, 255, 255, 0.3)',
                              borderTop: '2px solid white',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite'
                            }}></div>
                          ) : (
                            <UserCheck size={12} />
                          )}
                          Approve
                        </button>
                      )}

                      {user.status === 'approved' && (
                        <button
                          onClick={() => handleUserAction(user.id, 'block')}
                          disabled={actionLoading.has(`${user.id}-block`)}
                          style={{
                            padding: '6px 12px',
                            background: actionLoading.has(`${user.id}-block`) ? '#9ca3af' : '#ef4444',
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: actionLoading.has(`${user.id}-block`) ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {actionLoading.has(`${user.id}-block`) ? (
                            <div style={{
                              width: '12px',
                              height: '12px',
                              border: '2px solid rgba(255, 255, 255, 0.3)',
                              borderTop: '2px solid white',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite'
                            }}></div>
                          ) : (
                            <UserX size={12} />
                          )}
                          Block
                        </button>
                      )}

                      {user.status === 'blocked' && (
                        <button
                          onClick={() => handleUserAction(user.id, 'unblock')}
                          disabled={actionLoading.has(`${user.id}-unblock`)}
                          style={{
                            padding: '6px 12px',
                            background: actionLoading.has(`${user.id}-unblock`) ? '#9ca3af' : '#10b981',
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: actionLoading.has(`${user.id}-unblock`) ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {actionLoading.has(`${user.id}-unblock`) ? (
                            <div style={{
                              width: '12px',
                              height: '12px',
                              border: '2px solid rgba(255, 255, 255, 0.3)',
                              borderTop: '2px solid white',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite'
                            }}></div>
                          ) : (
                            <UserCheck size={12} />
                          )}
                          Unblock
                        </button>
                      )}
                    </div>
                  </div>
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
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #e5e7eb, #f3f4f6)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              {activeTab === 'business' ? <Building size={36} style={{ color: '#9ca3af' }} /> : <Users size={36} style={{ color: '#9ca3af' }} />}
            </div>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700',
              margin: '0 0 12px',
              color: '#374151'
            }}>
              No {activeTab} users found
            </h3>
            <p style={{ 
              color: '#6b7280',
              margin: '0 0 24px',
              fontSize: '16px'
            }}>
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filters to see more users'
                : `${activeTab === 'business' ? 'Business registrations' : 'Individual users'} will appear here`
              }
            </p>
            {(searchTerm || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setSortBy('newest');
                }}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  border: 'none',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
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
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* User Detail Modal */}
        {selectedUser && (
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
          onClick={() => setSelectedUser(null)}
          >
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
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
                <h2 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700', 
                  margin: 0, 
                  color: '#1f2937' 
                }}>
                  User Details
                </h2>
                <button
                  onClick={() => setSelectedUser(null)}
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
              
              <div style={{
                display: 'grid',
                gap: '20px'
              }}>
                <div style={{
                  background: '#f9fafb',
                  padding: '20px',
                  borderRadius: '12px'
                }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '16px'
                  }}>
                    Basic Information
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>User ID</p>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>#{selectedUser.id}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Name</p>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                        {activeTab === 'business' ? selectedUser.legalEntityName : selectedUser.name}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Email</p>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>{selectedUser.email}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Contact</p>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>{selectedUser.contactNumber}</p>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Registration Date</p>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>{formatDate(selectedUser.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {activeTab === 'business' && (
                  <div style={{
                    background: '#f9fafb',
                    padding: '20px',
                    borderRadius: '12px'
                  }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '16px'
                    }}>
                      Business Details
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>GST Number</p>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>{selectedUser.gst}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>PAN Number</p>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>{selectedUser.pan}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Contact Person</p>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>{selectedUser.contactPersonName}</p>
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Address</p>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>{selectedUser.address}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'individual' && selectedUser.address && (
                  <div style={{
                    background: '#f9fafb',
                    padding: '20px',
                    borderRadius: '12px'
                  }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '16px'
                    }}>
                      Address Information
                    </h3>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>{selectedUser.address}</p>
                  </div>
                )}

                <div style={{
                  background: '#f9fafb',
                  padding: '20px',
                  borderRadius: '12px'
                }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '16px'
                  }}>
                    Account Status
                  </h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: getStatusColor(selectedUser.status),
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    {getStatusIcon(selectedUser.status)}
                    Status: {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                  </div>
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

export default ManageUsers;