import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Building, User, Moon, Sun, Ruler, Package, ShoppingCart, Star, CheckCircle, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Header */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #ffffff, #f0f0f0)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '18px',
              color: '#667eea',
              boxShadow: '0 4px 20px rgba(255, 255, 255, 0.3)'
            }}>
              NG
            </div>
            <span style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: 'white',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              Nandha Garments
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link 
              to="/login"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                color: 'white',
                textDecoration: 'none',
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
              Super Admin Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '80px 24px', position: 'relative', overflow: 'hidden' }}>
        {/* Background Decorations */}
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

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '60px', 
            alignItems: 'center',
            '@media (max-width: 768px)': {
              gridTemplateColumns: '1fr'
            }
          }}>
            <div>
              <h1 style={{ 
                fontSize: '3.5rem', 
                fontWeight: '800', 
                marginBottom: '24px', 
                lineHeight: '1.1',
                background: 'linear-gradient(45deg, #ffffff, #f0f0f0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
              }}>
                Welcome to <br />
                <span style={{ 
                  background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  NandhaGarments
                </span>
              </h1>
              <p style={{ 
                fontSize: '1.3rem', 
                color: 'rgba(255, 255, 255, 0.9)', 
                marginBottom: '40px', 
                lineHeight: '1.6',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}>
                Streamlined garment management for organizations and individuals. 
                From measurements to ordering, we've got you covered with premium quality and service.
              </p>
              
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <Link 
                  to="/business/login"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 32px',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 12px 35px rgba(59, 130, 246, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
                  }}
                >
                  <Building size={20} />
                  Organization Login
                </Link>
                <Link 
                  to="/individual/login"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '12px',
                    padding: '14px 30px',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                    e.target.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <User size={20} />
                  Individual Login
                </Link>
              </div>
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '60px 40px',
              textAlign: 'center',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 8px 25px rgba(251, 191, 36, 0.3)'
              }}>
                <Package size={40} color="white" />
              </div>
              <h2 style={{ 
                fontSize: '2.2rem', 
                fontWeight: '700', 
                marginBottom: '16px',
                color: 'white',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}>
                Nandha Garments
              </h2>
              <p style={{ 
                fontSize: '1.1rem', 
                color: 'rgba(255, 255, 255, 0.9)',
                margin: 0
              }}>
                Professional Garment Solutions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section style={{ 
        padding: '80px 24px', 
        background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ 
              fontSize: '2.8rem', 
              fontWeight: '800', 
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #1f2937, #374151)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Our Services
            </h2>
            <p style={{ 
              fontSize: '1.2rem', 
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Comprehensive garment solutions tailored to your needs
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '40px',
              textAlign: 'center',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.1)';
            }}
            >
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: 'linear-gradient(135deg, #667eea, #764ba2)', 
                borderRadius: '20px', 
                margin: '0 auto 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
              }}>
                <Ruler size={32} color="white" />
              </div>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                marginBottom: '16px',
                color: '#1f2937'
              }}>
                Custom Measurements
              </h3>
              <p style={{ 
                color: '#6b7280', 
                lineHeight: '1.6',
                fontSize: '15px'
              }}>
                Precise measurement recording and management for perfect fit garments tailored to your specifications
              </p>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '40px',
              textAlign: 'center',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.1)';
            }}
            >
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: 'linear-gradient(135deg, #10b981, #059669)', 
                borderRadius: '20px', 
                margin: '0 auto 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)'
              }}>
                <Package size={32} color="white" />
              </div>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                marginBottom: '16px',
                color: '#1f2937'
              }}>
                Product Catalog
              </h3>
              <p style={{ 
                color: '#6b7280', 
                lineHeight: '1.6',
                fontSize: '15px'
              }}>
                Browse our extensive collection of quality garments and accessories with detailed specifications
              </p>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '40px',
              textAlign: 'center',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.1)';
            }}
            >
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: 'linear-gradient(135deg, #f59e0b, #d97706)', 
                borderRadius: '20px', 
                margin: '0 auto 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 25px rgba(245, 158, 11, 0.3)'
              }}>
                <ShoppingCart size={32} color="white" />
              </div>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                marginBottom: '16px',
                color: '#1f2937'
              }}>
                Order Management
              </h3>
              <p style={{ 
                color: '#6b7280', 
                lineHeight: '1.6',
                fontSize: '15px'
              }}>
                Seamless ordering process with real-time tracking and updates throughout your journey
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ 
        padding: '80px 24px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '60px', 
            alignItems: 'center'
          }}>
            <div>
              <h2 style={{ 
                fontSize: '2.8rem', 
                fontWeight: '800', 
                marginBottom: '24px',
                background: 'linear-gradient(45deg, #ffffff, #f0f0f0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Why Choose NandhaGarments?
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {[
                  {
                    title: "Professional Quality",
                    description: "Premium fabrics and expert craftsmanship ensuring durability and style"
                  },
                  {
                    title: "Custom Fit",
                    description: "Precise measurements for perfect fitting garments tailored to you"
                  },
                  {
                    title: "Fast Delivery",
                    description: "Quick turnaround times for all orders without compromising quality"
                  },
                  {
                    title: "24/7 Support",
                    description: "Round-the-clock customer service for all your garment needs"
                  }
                ].map((feature, index) => (
                  <div key={index} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ 
                      width: '24px', 
                      height: '24px', 
                      background: 'linear-gradient(135deg, #10b981, #059669)', 
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '4px',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                    }}>
                      <CheckCircle size={14} color="white" />
                    </div>
                    <div>
                      <h4 style={{ 
                        fontWeight: '700', 
                        marginBottom: '8px',
                        color: 'white',
                        fontSize: '1.1rem'
                      }}>
                        {feature.title}
                      </h4>
                      <p style={{ 
                        color: 'rgba(255, 255, 255, 0.9)',
                        margin: 0,
                        lineHeight: '1.5'
                      }}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '40px',
              textAlign: 'center',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 8px 25px rgba(251, 191, 36, 0.3)'
              }}>
                <Star size={40} color="white" />
              </div>
              <h3 style={{ 
                fontSize: '1.8rem', 
                fontWeight: '700', 
                marginBottom: '24px',
                color: 'white'
              }}>
                Get Started Today
              </h3>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                marginBottom: '32px',
                lineHeight: '1.6'
              }}>
                Join thousands of satisfied customers who trust NandhaGarments for their clothing needs.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Link 
                  to="/business/signup"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
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
                  Register Your Organization
                  <ArrowRight size={16} />
                </Link>
                <Link 
                  to="/individual/signup"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
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
                  Create Individual Account
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        background: 'rgba(31, 41, 55, 0.9)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '40px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '16px',
              color: 'white'
            }}>
              NG
            </div>
            <span style={{ 
              fontSize: '1.25rem', 
              fontWeight: '700', 
              color: 'white'
            }}>
              NandhaGarments
            </span>
          </div>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            margin: 0,
            fontSize: '14px'
          }}>
            © 2025 NandhaGarments. All rights reserved. Crafting quality garments with precision and care.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;