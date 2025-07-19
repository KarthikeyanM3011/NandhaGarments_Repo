import React, { useState, useEffect } from 'react';
import Layout from '../common/Layout';
import { superAdminAPI } from '../../services/api';
import { Plus, Edit3, Trash2, Package, Tag, DollarSign, Image as ImageIcon, Calendar, Star } from 'lucide-react';
import AddProduct from './AddProduct';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await superAdminAPI.getProducts();
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowAddForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      setDeletingId(id);
      try {
        await superAdminAPI.deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleFormSubmit = () => {
    setShowAddForm(false);
    setEditingProduct(null);
    fetchProducts();
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
            Loading products...
          </p>
        </div>
      </Layout>
    );
  }

  if (showAddForm) {
    return (
      <Layout userType="superadmin">
        <AddProduct
          product={editingProduct}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowAddForm(false);
            setEditingProduct(null);
          }}
        />
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
                Manage Products
              </h1>
              <p style={{ 
                fontSize: '1.1rem', 
                opacity: 0.9,
                marginBottom: '16px'
              }}>
                Add, edit, and manage products in the catalog
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                fontSize: '14px',
                flexWrap: 'wrap'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Package size={16} />
                  {products.length} Products
                </span>
              </div>
            </div>
            
            <button 
              onClick={handleAddProduct}
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
              Add Product
            </button>
          </div>
        </div>

        {products.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px'
          }}>
            {products.map((product) => (
              <div key={product.id} style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.08)';
              }}
              >
                {/* Product Image */}
                <div style={{
                  position: 'relative',
                  marginBottom: '20px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)'
                }}>
                  <img 
                    src={product.images?.[0] || '/placeholder-product.jpg'} 
                    alt={product.name}
                    style={{ 
                      width: '100%', 
                      height: '200px', 
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: product.status === 'active' 
                      ? 'linear-gradient(135deg, #10b981, #059669)' 
                      : 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'capitalize',
                    backdropFilter: 'blur(10px)'
                  }}>
                    {product.status}
                  </div>
                </div>

                {/* Product Info */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px'
                  }}>
                    <h3 style={{ 
                      fontSize: '1.2rem', 
                      fontWeight: '700', 
                      margin: 0,
                      color: '#1f2937',
                      lineHeight: '1.3'
                    }}>
                      {product.name}
                    </h3>
                    <span style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      fontWeight: '500',
                      padding: '2px 8px',
                      background: '#f3f4f6',
                      borderRadius: '12px'
                    }}>
                      #{product.id}
                    </span>
                  </div>
                  
                  <p style={{
                    color: '#6b7280',
                    fontSize: '14px',
                    lineHeight: '1.4',
                    margin: '0 0 12px 0',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {product.description}
                  </p>

                </div>

                {/* Pricing */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                  borderRadius: '8px',
                  border: '1px solid #bae6fd'
                }}>
                  <div>
                    <p style={{
                      fontSize: '12px',
                      color: '#0369a1',
                      margin: '0 0 2px 0',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Original Price
                    </p>
                    <p style={{
                      fontSize: '14px',
                      color: '#0369a1',
                      margin: 0,
                      textDecoration: product.sellingPrice < product.price ? 'line-through' : 'none',
                      opacity: product.sellingPrice < product.price ? 0.7 : 1
                    }}>
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                  <div>
                    <p style={{
                      fontSize: '12px',
                      color: '#0c4a6e',
                      margin: '0 0 2px 0',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Selling Price
                    </p>
                    <p style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#0c4a6e',
                      margin: 0
                    }}>
                      {formatCurrency(product.selling_price)}
                    </p>
                  </div>
                  {product.sellingPrice < product.price && (
                    <div style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '600',
                      marginLeft: 'auto'
                    }}>
                      {Math.round((1 - product.sellingPrice / product.price) * 100)}% OFF
                    </div>
                  )}
                </div>

                {/* Available Sizes */}
                <div style={{ marginBottom: '20px' }}>
                  <p style={{
                    fontSize: '12px',
                    color: '#374151',
                    margin: '0 0 8px 0',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Available Sizes
                  </p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {product.availableSizes?.slice(0, 6).map(size => (
                      <span key={size} style={{ 
                        padding: '4px 8px',
                        background: '#f3f4f6',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#374151'
                      }}>
                        {size}
                      </span>
                    ))}
                    {product.availableSizes?.length > 6 && (
                      <span style={{ 
                        fontSize: '12px', 
                        color: '#3b82f6',
                        fontWeight: '500',
                        padding: '4px 8px'
                      }}>
                        +{product.availableSizes.length - 6} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Created Date */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '20px',
                  fontSize: '12px',
                  color: '#6b7280'
                }}>
                  <Calendar size={12} />
                  Created {formatDate(product.createdAt)}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleEditProduct(product)}
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
                    onClick={() => handleDeleteProduct(product.id)}
                    disabled={deletingId === product.id}
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      background: deletingId === product.id ? '#9ca3af' : '#ef4444',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: deletingId === product.id ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (deletingId !== product.id) {
                        e.target.style.background = '#dc2626';
                        e.target.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (deletingId !== product.id) {
                        e.target.style.background = '#ef4444';
                        e.target.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    {deletingId === product.id ? (
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
              <Package size={48} style={{ color: '#9ca3af' }} />
            </div>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700',
              margin: '0 0 12px',
              color: '#374151'
            }}>
              No products found
            </h3>
            <p style={{ 
              color: '#6b7280',
              margin: '0 0 32px',
              fontSize: '16px',
              lineHeight: '1.5'
            }}>
              Start by adding your first product to the catalog
            </p>
            <button 
              onClick={handleAddProduct}
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
              Add Your First Product
            </button>
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

export default ManageProducts;