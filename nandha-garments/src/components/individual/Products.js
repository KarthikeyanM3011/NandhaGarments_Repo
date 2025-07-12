import React, { useState, useEffect } from 'react';
import Layout from '../common/Layout';
import { productsAPI } from '../../services/api';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Star, 
  Grid, 
  List,
  Heart,
  Eye,
  ArrowUpDown,
  Tag,
  CheckCircle,
  Plus
} from 'lucide-react';
import { SORT_OPTIONS } from '../../utils/constants';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name_asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState(new Set());
  const [addingToCart, setAddingToCart] = useState(new Set());
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, sortBy, currentPage]);

  const fetchProducts = async () => {
    try {
      const params = {
        search: searchTerm,
        sort: sortBy,
        page: currentPage,
        limit: 12
      };
      const response = await productsAPI.getProducts(params);
      setProducts(response.data.data.products);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    setAddingToCart(prev => new Set([...prev, product.id]));
    try {
      await productsAPI.addToCart({
        productId: product.id,
        quantity: 1
      });
      // Show success notification
      showNotification('Product added to cart!', 'success');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showNotification('Failed to add product to cart', 'error');
    } finally {
      setAddingToCart(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const showNotification = (message, type) => {
    // This would typically integrate with a toast notification system
    alert(message);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getDiscountPercentage = (price, sellingPrice) => {
    if (price <= sellingPrice) return 0;
    return Math.round(((price - sellingPrice) / price) * 100);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        size={14} 
        fill={i < (rating || 4) ? '#fbbf24' : 'none'}
        color="#fbbf24"
      />
    ));
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
            Loading products...
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userType="individual">
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
              Product Catalog
            </h1>
            <p style={{ 
              fontSize: '1.1rem', 
              opacity: 0.9,
              marginBottom: '16px'
            }}>
              Browse our extensive collection of quality garments
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
                {products.length} Products Available
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Star size={16} />
                Premium Quality Guaranteed
              </span>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            alignItems: 'end',
            marginBottom: '20px'
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
                Search Products
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
                  placeholder="Search by name, category, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    transition: 'all 0.3s ease'
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
            
            {/* Sort */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Sort Products
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
                    padding: '12px 12px 12px 40px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: 'white',
                    cursor: 'pointer'
                  }}
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                View Mode
              </label>
              <div style={{
                display: 'flex',
                gap: '8px',
                background: '#f3f4f6',
                padding: '4px',
                borderRadius: '8px'
              }}>
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: '4px',
                    background: viewMode === 'grid' ? 'white' : 'transparent',
                    color: viewMode === 'grid' ? '#374151' : '#6b7280',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'
                  }}
                >
                  <Grid size={14} />
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: '4px',
                    background: viewMode === 'list' ? 'white' : 'transparent',
                    color: viewMode === 'list' ? '#374151' : '#6b7280',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'
                  }}
                >
                  <List size={14} />
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Results info */}
          <div style={{
            paddingTop: '16px',
            borderTop: '1px solid #e5e7eb',
            fontSize: '14px',
            color: '#6b7280'
          }}>
            Showing {products.length} of {products.length} products
            {searchTerm && (
              <span> for "{searchTerm}"</span>
            )}
          </div>
        </div>

        {/* Products Display */}
        {products.length > 0 ? (
          <>
            {viewMode === 'grid' ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '24px',
                marginBottom: '40px'
              }}>
                {products.map((product) => (
                  <div key={product.id} style={{
                    background: 'white',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
                    border: '1px solid #e5e7eb',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 48px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.08)';
                  }}
                  >
                    {/* Product Image */}
                    <div style={{ position: 'relative', overflow: 'hidden' }}>
                      <img 
                        src={product.images?.[0] || '/placeholder-product.jpg'} 
                        alt={product.name}
                        style={{
                          width: '100%',
                          height: '250px',
                          objectFit: 'cover',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'scale(1)';
                        }}
                      />
                      
                      {/* Discount Badge */}
                      {getDiscountPercentage(product.price, product.sellingPrice) > 0 && (
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          background: '#ef4444',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          -{getDiscountPercentage(product.price, product.sellingPrice)}%
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        display: 'flex',
                        gap: '8px'
                      }}>
                        <button
                          onClick={() => toggleFavorite(product.id)}
                          style={{
                            background: 'rgba(255, 255, 255, 0.9)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <Heart 
                            size={16} 
                            fill={favorites.has(product.id) ? '#ef4444' : 'none'}
                            color={favorites.has(product.id) ? '#ef4444' : '#6b7280'}
                          />
                        </button>
                        <button
                          onClick={() => setSelectedProduct(product)}
                          style={{
                            background: 'rgba(255, 255, 255, 0.9)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <Eye size={16} color="#6b7280" />
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div style={{ padding: '20px' }}>
                      <h3 style={{
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        color: '#1f2937',
                        marginBottom: '8px',
                        lineHeight: '1.3'
                      }}>
                        {product.name}
                      </h3>
                      
                      {/* Rating */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        marginBottom: '12px' 
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                          {renderStars(product.rating)}
                        </div>
                        <span style={{ fontSize: '14px', color: '#6b7280' }}>
                          ({product.reviews || 0} reviews)
                        </span>
                      </div>

                      {/* Price */}
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            color: '#1f2937'
                          }}>
                            {formatCurrency(product.sellingPrice)}
                          </span>
                          {product.sellingPrice < product.price && (
                            <span style={{ 
                              fontSize: '14px', 
                              color: '#6b7280', 
                              textDecoration: 'line-through'
                            }}>
                              {formatCurrency(product.price)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p style={{ 
                        fontSize: '14px', 
                        color: '#6b7280', 
                        marginBottom: '16px',
                        lineHeight: '1.5',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {product.description}
                      </p>

                      {/* Available Sizes */}
                      {product.availableSizes && product.availableSizes.length > 0 && (
                        <div style={{ marginBottom: '16px' }}>
                          <p style={{
                            fontSize: '12px',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '6px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>
                            Available Sizes
                          </p>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {product.availableSizes.map(size => (
                              <span key={size} style={{ 
                                padding: '4px 8px',
                                background: '#f3f4f6',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: '500',
                                color: '#374151'
                              }}>
                                {size}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Add to Cart Button */}
                      <button 
                        onClick={() => handleAddToCart(product)}
                        disabled={addingToCart.has(product.id)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: addingToCart.has(product.id) 
                            ? '#9ca3af' 
                            : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                          border: 'none',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: addingToCart.has(product.id) ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!addingToCart.has(product.id)) {
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!addingToCart.has(product.id)) {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                          }
                        }}
                      >
                        {addingToCart.has(product.id) ? (
                          <>
                            <div style={{
                              width: '16px',
                              height: '16px',
                              border: '2px solid rgba(255, 255, 255, 0.3)',
                              borderTop: '2px solid white',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite'
                            }}></div>
                            Adding...
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={16} />
                            Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // List View
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
                {products.map((product) => (
                  <div key={product.id} style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
                    border: '1px solid #e5e7eb',
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'center'
                  }}>
                    <img 
                      src={product.images?.[0] || '/placeholder-product.jpg'} 
                      alt={product.name}
                      style={{
                        width: '120px',
                        height: '120px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        flexShrink: 0
                      }}
                    />
                    
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        color: '#1f2937',
                        marginBottom: '8px'
                      }}>
                        {product.name}
                      </h3>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                          {renderStars(product.rating)}
                        </div>
                        <span style={{ fontSize: '14px', color: '#6b7280' }}>
                          ({product.reviews || 0})
                        </span>
                      </div>

                      <p style={{ 
                        fontSize: '14px', 
                        color: '#6b7280', 
                        marginBottom: '12px',
                        lineHeight: '1.5'
                      }}>
                        {product.description}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          fontSize: '1.1rem',
                          fontWeight: '700',
                          color: '#1f2937'
                        }}>
                          {formatCurrency(product.sellingPrice)}
                        </span>
                        {product.sellingPrice < product.price && (
                          <span style={{ 
                            fontSize: '14px', 
                            color: '#6b7280', 
                            textDecoration: 'line-through'
                          }}>
                            {formatCurrency(product.price)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        disabled={addingToCart.has(product.id)}
                        style={{
                          padding: '10px 20px',
                          background: addingToCart.has(product.id) 
                            ? '#9ca3af' 
                            : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                          border: 'none',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: addingToCart.has(product.id) ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        {addingToCart.has(product.id) ? (
                          <>
                            <div style={{
                              width: '14px',
                              height: '14px',
                              border: '2px solid rgba(255, 255, 255, 0.3)',
                              borderTop: '2px solid white',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite'
                            }}></div>
                            Adding...
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={14} />
                            Add to Cart
                          </>
                        )}
                      </button>
                      
                      {product.availableSizes && product.availableSizes.length > 0 && (
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          Sizes: {product.availableSizes.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                gap: '8px',
                marginTop: '40px'
              }}>
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    background: currentPage === 1 ? '#f9fafb' : 'white',
                    color: currentPage === 1 ? '#9ca3af' : '#374151',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Previous
                </button>
                
                {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      style={{
                        padding: '8px 12px',
                        border: 'none',
                        borderRadius: '8px',
                        background: currentPage === pageNum 
                          ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                          : 'white',
                        color: currentPage === pageNum ? 'white' : '#374151',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        border: currentPage === pageNum ? 'none' : '1px solid #d1d5db'
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    background: currentPage === totalPages ? '#f9fafb' : 'white',
                    color: currentPage === totalPages ? '#9ca3af' : '#374151',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
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
              <ShoppingCart size={48} style={{ color: '#9ca3af' }} />
            </div>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700',
              margin: '0 0 12px',
              color: '#374151'
            }}>
              {searchTerm ? 'No products found' : 'No products available'}
            </h3>
            <p style={{ 
              color: '#6b7280',
              margin: '0 0 24px',
              fontSize: '16px'
            }}>
              {searchTerm 
                ? `No products found matching "${searchTerm}". Try adjusting your search terms.`
                : 'Products will be displayed here once available.'
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  border: 'none',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Product Detail Modal */}
        {selectedProduct && (
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
          onClick={() => setSelectedProduct(null)}
          >
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '0',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 0
            }}
            onClick={(e) => e.stopPropagation()}
            >
              {/* Product Image */}
              <div style={{ position: 'relative' }}>
                <img 
                  src={selectedProduct.images?.[0] || '/placeholder-product.jpg'} 
                  alt={selectedProduct.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '16px 0 0 16px'
                  }}
                />
                {getDiscountPercentage(selectedProduct.price, selectedProduct.sellingPrice) > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    background: '#ef4444',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    -{getDiscountPercentage(selectedProduct.price, selectedProduct.sellingPrice)}%
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div style={{ padding: '32px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '20px'
                }}>
                  <h2 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '700',
                    margin: 0,
                    color: '#1f2937',
                    lineHeight: '1.3'
                  }}>
                    {selectedProduct.name}
                  </h2>
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    style={{
                      background: '#f3f4f6',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      cursor: 'pointer',
                      fontSize: '18px',
                      color: '#6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ×
                  </button>
                </div>

                {/* Rating */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  marginBottom: '16px' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    {renderStars(selectedProduct.rating)}
                  </div>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>
                    ({selectedProduct.reviews || 0} reviews)
                  </span>
                </div>

                {/* Price */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      fontSize: '2rem',
                      fontWeight: '700',
                      color: '#1f2937'
                    }}>
                      {formatCurrency(selectedProduct.sellingPrice)}
                    </span>
                    {selectedProduct.sellingPrice < selectedProduct.price && (
                      <span style={{ 
                        fontSize: '1.1rem', 
                        color: '#6b7280', 
                        textDecoration: 'line-through'
                      }}>
                        {formatCurrency(selectedProduct.price)}
                      </span>
                    )}
                  </div>
                  {selectedProduct.sellingPrice < selectedProduct.price && (
                    <p style={{
                      fontSize: '14px',
                      color: '#10b981',
                      fontWeight: '500',
                      margin: '4px 0 0 0'
                    }}>
                      You save {formatCurrency(selectedProduct.price - selectedProduct.sellingPrice)}!
                    </p>
                  )}
                </div>

                {/* Description */}
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Description
                  </h4>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#6b7280', 
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    {selectedProduct.description}
                  </p>
                </div>

                {/* Available Sizes */}
                {selectedProduct.availableSizes && selectedProduct.availableSizes.length > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '12px'
                    }}>
                      Available Sizes
                    </h4>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {selectedProduct.availableSizes.map(size => (
                        <span key={size} style={{ 
                          padding: '8px 16px',
                          background: '#f3f4f6',
                          border: '2px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#374151',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.borderColor = '#3b82f6';
                          e.target.style.background = '#dbeafe';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.borderColor = '#d1d5db';
                          e.target.style.background = '#f3f4f6';
                        }}
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => toggleFavorite(selectedProduct.id)}
                    style={{
                      padding: '12px',
                      border: '2px solid #d1d5db',
                      borderRadius: '8px',
                      background: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Heart 
                      size={20} 
                      fill={favorites.has(selectedProduct.id) ? '#ef4444' : 'none'}
                      color={favorites.has(selectedProduct.id) ? '#ef4444' : '#6b7280'}
                    />
                  </button>
                  
                  <button 
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    disabled={addingToCart.has(selectedProduct.id)}
                    style={{
                      flex: 1,
                      padding: '12px 24px',
                      background: addingToCart.has(selectedProduct.id) 
                        ? '#9ca3af' 
                        : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '500',
                      cursor: addingToCart.has(selectedProduct.id) ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    {addingToCart.has(selectedProduct.id) ? (
                      <>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          borderTop: '2px solid white',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }}></div>
                        Adding to Cart...
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={20} />
                        Add to Cart
                      </>
                    )}
                  </button>
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
          
          @media (max-width: 768px) {
            .modal-content {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default Products;