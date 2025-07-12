// import React, { useState, useEffect } from 'react';
// import { superAdminAPI } from '../../services/api';
// import { PRODUCT_SIZES } from '../../utils/constants';
// import { ArrowLeft, Save, Upload, X, Package, Tag, DollarSign, Image as ImageIcon } from 'lucide-react';

// const AddProduct = ({ product, onSubmit, onCancel }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     price: '',
//     sellingPrice: '',
//     availableSizes: [],
//     images: [],
//     specifications: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     if (product) {
//       setFormData({
//         ...product,
//         specifications: JSON.stringify(product.specifications || {}, null, 2)
//       });
//     }
//   }, [product]);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSizeToggle = (size) => {
//     setFormData(prev => ({
//       ...prev,
//       availableSizes: prev.availableSizes.includes(size)
//         ? prev.availableSizes.filter(s => s !== size)
//         : [...prev.availableSizes, size]
//     }));
//   };

//   const handleImageUpload = (e) => {
//     const files = Array.from(e.target.files);
//     files.forEach(file => {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData(prev => ({
//           ...prev,
//           images: [...prev.images, reader.result]
//         }));
//       };
//       reader.readAsDataURL(file);
//     });
//   };

//   const removeImage = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index)
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const submitData = {
//         ...formData,
//         specifications: formData.specifications ? JSON.parse(formData.specifications) : {}
//       };

//       if (product) {
//         await superAdminAPI.updateProduct(product.id, submitData);
//       } else {
//         await superAdminAPI.addProduct(submitData);
//       }
      
//       onSubmit();
//     } catch (error) {
//       setError(error.response?.data?.message || 'Failed to save product');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fade-in" style={{ 
//       padding: '24px',
//       maxWidth: '1000px',
//       margin: '0 auto'
//     }}>
//       {/* Header Section */}
//       <div style={{
//         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//         borderRadius: '16px',
//         padding: '32px',
//         color: 'white',
//         marginBottom: '32px',
//         position: 'relative',
//         overflow: 'hidden'
//       }}>
//         <div style={{
//           position: 'absolute',
//           top: 0,
//           right: 0,
//           width: '200px',
//           height: '200px',
//           background: 'rgba(255, 255, 255, 0.1)',
//           borderRadius: '50%',
//           transform: 'translate(50%, -50%)'
//         }}></div>
        
//         <div style={{ position: 'relative', zIndex: 1 }}>
//           <button 
//             onClick={onCancel} 
//             style={{
//               background: 'rgba(255, 255, 255, 0.2)',
//               border: 'none',
//               color: 'white',
//               padding: '8px 16px',
//               borderRadius: '8px',
//               cursor: 'pointer',
//               display: 'flex',
//               alignItems: 'center',
//               gap: '8px',
//               fontSize: '14px',
//               fontWeight: '500',
//               marginBottom: '20px',
//               backdropFilter: 'blur(10px)',
//               transition: 'all 0.3s ease'
//             }}
//             onMouseEnter={(e) => {
//               e.target.style.background = 'rgba(255, 255, 255, 0.3)';
//             }}
//             onMouseLeave={(e) => {
//               e.target.style.background = 'rgba(255, 255, 255, 0.2)';
//             }}
//           >
//             <ArrowLeft size={16} />
//             Back to Products
//           </button>
          
//           <h1 style={{ 
//             fontSize: '2.5rem', 
//             fontWeight: '700', 
//             marginBottom: '8px',
//             background: 'linear-gradient(45deg, #ffffff, #f0f0f0)',
//             WebkitBackgroundClip: 'text',
//             WebkitTextFillColor: 'transparent'
//           }}>
//             {product ? 'Edit Product' : 'Add New Product'}
//           </h1>
//           <p style={{ 
//             fontSize: '1.1rem', 
//             opacity: 0.9
//           }}>
//             {product ? 'Update product details in the catalog' : 'Enter product details to add to the catalog'}
//           </p>
//         </div>
//       </div>

//       <div style={{
//         background: 'white',
//         borderRadius: '16px',
//         padding: '32px',
//         boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
//         border: '1px solid #e5e7eb'
//       }}>
//         <form onSubmit={handleSubmit}>
//           {error && (
//             <div style={{ 
//               marginBottom: '24px', 
//               padding: '16px', 
//               background: 'linear-gradient(135deg, #fee2e2, #fecaca)', 
//               border: '1px solid #f87171', 
//               borderRadius: '12px',
//               color: '#dc2626',
//               fontSize: '14px',
//               fontWeight: '500'
//             }}>
//               {error}
//             </div>
//           )}

//           {/* Basic Information */}
//           <div style={{ marginBottom: '40px' }}>
//             <div style={{
//               display: 'flex',
//               alignItems: 'center',
//               gap: '12px',
//               marginBottom: '24px',
//               paddingBottom: '16px',
//               borderBottom: '2px solid #e5e7eb'
//             }}>
//               <div style={{
//                 background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
//                 borderRadius: '10px',
//                 padding: '8px',
//                 color: 'white'
//               }}>
//                 <Package size={20} />
//               </div>
//               <h3 style={{ 
//                 fontSize: '1.25rem', 
//                 fontWeight: '700', 
//                 margin: 0,
//                 color: '#1f2937'
//               }}>
//                 Basic Information
//               </h3>
//             </div>
            
//             <div style={{ display: 'grid', gap: '20px' }}>
//               <div>
//                 <label style={{
//                   display: 'block',
//                   fontSize: '14px',
//                   fontWeight: '600',
//                   color: '#374151',
//                   marginBottom: '8px'
//                 }}>
//                   Product Name
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   placeholder="Enter product name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                   style={{
//                     width: '100%',
//                     padding: '12px 16px',
//                     border: '2px solid #e5e7eb',
//                     borderRadius: '8px',
//                     fontSize: '14px',
//                     transition: 'all 0.3s ease',
//                     outline: 'none'
//                   }}
//                   onFocus={(e) => {
//                     e.target.style.borderColor = '#3b82f6';
//                     e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
//                   }}
//                   onBlur={(e) => {
//                     e.target.style.borderColor = '#e5e7eb';
//                     e.target.style.boxShadow = 'none';
//                   }}
//                 />
//               </div>

//               <div>
//                 <label style={{
//                   display: 'block',
//                   fontSize: '14px',
//                   fontWeight: '600',
//                   color: '#374151',
//                   marginBottom: '8px'
//                 }}>
//                   Description
//                 </label>
//                 <textarea
//                   name="description"
//                   placeholder="Describe your product in detail"
//                   value={formData.description}
//                   onChange={handleChange}
//                   rows="4"
//                   required
//                   style={{
//                     width: '100%',
//                     padding: '12px 16px',
//                     border: '2px solid #e5e7eb',
//                     borderRadius: '8px',
//                     fontSize: '14px',
//                     transition: 'all 0.3s ease',
//                     outline: 'none',
//                     resize: 'vertical'
//                   }}
//                   onFocus={(e) => {
//                     e.target.style.borderColor = '#3b82f6';
//                     e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
//                   }}
//                   onBlur={(e) => {
//                     e.target.style.borderColor = '#e5e7eb';
//                     e.target.style.boxShadow = 'none';
//                   }}
//                 />
//               </div>

//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
//                 <div>
//                   <label style={{
//                     display: 'block',
//                     fontSize: '14px',
//                     fontWeight: '600',
//                     color: '#374151',
//                     marginBottom: '8px'
//                   }}>
//                     Original Price (₹)
//                   </label>
//                   <div style={{ position: 'relative' }}>
//                     <DollarSign size={16} style={{
//                       position: 'absolute',
//                       left: '12px',
//                       top: '50%',
//                       transform: 'translateY(-50%)',
//                       color: '#9ca3af'
//                     }} />
//                     <input
//                       type="number"
//                       step="0.01"
//                       name="price"
//                       placeholder="0.00"
//                       value={formData.price}
//                       onChange={handleChange}
//                       required
//                       style={{
//                         width: '100%',
//                         padding: '12px 16px 12px 40px',
//                         border: '2px solid #e5e7eb',
//                         borderRadius: '8px',
//                         fontSize: '14px',
//                         transition: 'all 0.3s ease',
//                         outline: 'none'
//                       }}
//                       onFocus={(e) => {
//                         e.target.style.borderColor = '#3b82f6';
//                         e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
//                       }}
//                       onBlur={(e) => {
//                         e.target.style.borderColor = '#e5e7eb';
//                         e.target.style.boxShadow = 'none';
//                       }}
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label style={{
//                     display: 'block',
//                     fontSize: '14px',
//                     fontWeight: '600',
//                     color: '#374151',
//                     marginBottom: '8px'
//                   }}>
//                     Selling Price (₹)
//                   </label>
//                   <div style={{ position: 'relative' }}>
//                     <Tag size={16} style={{
//                       position: 'absolute',
//                       left: '12px',
//                       top: '50%',
//                       transform: 'translateY(-50%)',
//                       color: '#9ca3af'
//                     }} />
//                     <input
//                       type="number"
//                       step="0.01"
//                       name="sellingPrice"
//                       placeholder="0.00"
//                       value={formData.sellingPrice}
//                       onChange={handleChange}
//                       required
//                       style={{
//                         width: '100%',
//                         padding: '12px 16px 12px 40px',
//                         border: '2px solid #e5e7eb',
//                         borderRadius: '8px',
//                         fontSize: '14px',
//                         transition: 'all 0.3s ease',
//                         outline: 'none'
//                       }}
//                       onFocus={(e) => {
//                         e.target.style.borderColor = '#3b82f6';
//                         e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
//                       }}
//                       onBlur={(e) => {
//                         e.target.style.borderColor = '#e5e7eb';
//                         e.target.style.boxShadow = 'none';
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Available Sizes */}
//           <div style={{ marginBottom: '40px' }}>
//             <h3 style={{ 
//               fontSize: '1.25rem', 
//               fontWeight: '700', 
//               marginBottom: '20px',
//               color: '#1f2937',
//               paddingBottom: '16px',
//               borderBottom: '2px solid #e5e7eb'
//             }}>
//               Available Sizes
//             </h3>
            
//             <div style={{ 
//               display: 'grid', 
//               gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', 
//               gap: '12px' 
//             }}>
//               {PRODUCT_SIZES.map((size) => (
//                 <button
//                   key={size}
//                   type="button"
//                   onClick={() => handleSizeToggle(size)}
//                   style={{
//                     padding: '12px 16px',
//                     border: `2px solid ${formData.availableSizes.includes(size) ? '#3b82f6' : '#e5e7eb'}`,
//                     borderRadius: '8px',
//                     background: formData.availableSizes.includes(size) 
//                       ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
//                       : 'white',
//                     color: formData.availableSizes.includes(size) ? 'white' : '#374151',
//                     fontSize: '14px',
//                     fontWeight: '600',
//                     cursor: 'pointer',
//                     transition: 'all 0.3s ease',
//                     textAlign: 'center'
//                   }}
//                   onMouseEnter={(e) => {
//                     if (!formData.availableSizes.includes(size)) {
//                       e.target.style.borderColor = '#3b82f6';
//                       e.target.style.background = '#f0f9ff';
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (!formData.availableSizes.includes(size)) {
//                       e.target.style.borderColor = '#e5e7eb';
//                       e.target.style.background = 'white';
//                     }
//                   }}
//                 >
//                   {size}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Product Images */}
//           <div style={{ marginBottom: '40px' }}>
//             <div style={{
//               display: 'flex',
//               alignItems: 'center',
//               gap: '12px',
//               marginBottom: '24px',
//               paddingBottom: '16px',
//               borderBottom: '2px solid #e5e7eb'
//             }}>
//               <div style={{
//                 background: 'linear-gradient(135deg, #f093fb, #f5576c)',
//                 borderRadius: '10px',
//                 padding: '8px',
//                 color: 'white'
//               }}>
//                 <ImageIcon size={20} />
//               </div>
//               <h3 style={{ 
//                 fontSize: '1.25rem', 
//                 fontWeight: '700', 
//                 margin: 0,
//                 color: '#1f2937'
//               }}>
//                 Product Images
//               </h3>
//             </div>
            
//             <div style={{ 
//               border: '2px dashed #d1d5db', 
//               borderRadius: '12px', 
//               padding: '40px 20px', 
//               textAlign: 'center',
//               marginBottom: '24px',
//               background: 'linear-gradient(135deg, #f9fafb, #ffffff)',
//               transition: 'all 0.3s ease'
//             }}>
//               <input
//                 type="file"
//                 accept="image/*"
//                 multiple
//                 onChange={handleImageUpload}
//                 style={{ display: 'none' }}
//                 id="image-upload"
//               />
//               <label 
//                 htmlFor="image-upload" 
//                 style={{ cursor: 'pointer', display: 'block' }}
//               >
//                 <div style={{
//                   width: '60px',
//                   height: '60px',
//                   background: 'linear-gradient(135deg, #e5e7eb, #f3f4f6)',
//                   borderRadius: '50%',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   margin: '0 auto 16px'
//                 }}>
//                   <Upload size={24} style={{ color: '#9ca3af' }} />
//                 </div>
//                 <p style={{ 
//                   fontSize: '16px', 
//                   fontWeight: '600', 
//                   color: '#374151',
//                   margin: '0 0 8px 0'
//                 }}>
//                   Click to upload images or drag and drop
//                 </p>
//                 <p style={{ 
//                   fontSize: '14px', 
//                   color: '#6b7280',
//                   margin: 0
//                 }}>
//                   PNG, JPG up to 2MB each
//                 </p>
//               </label>
//             </div>

//             {formData.images.length > 0 && (
//               <div style={{ 
//                 display: 'grid', 
//                 gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
//                 gap: '16px' 
//               }}>
//                 {formData.images.map((image, index) => (
//                   <div key={index} style={{ 
//                     position: 'relative',
//                     borderRadius: '12px',
//                     overflow: 'hidden',
//                     boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
//                   }}>
//                     <img 
//                       src={image} 
//                       alt={`Product ${index + 1}`}
//                       style={{ 
//                         width: '100%', 
//                         height: '150px', 
//                         objectFit: 'cover'
//                       }}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => removeImage(index)}
//                       style={{
//                         position: 'absolute',
//                         top: '8px',
//                         right: '8px',
//                         background: '#ef4444',
//                         color: 'white',
//                         border: 'none',
//                         borderRadius: '50%',
//                         width: '28px',
//                         height: '28px',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         cursor: 'pointer',
//                         boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
//                         transition: 'all 0.3s ease'
//                       }}
//                       onMouseEnter={(e) => {
//                         e.target.style.background = '#dc2626';
//                         e.target.style.transform = 'scale(1.1)';
//                       }}
//                       onMouseLeave={(e) => {
//                         e.target.style.background = '#ef4444';
//                         e.target.style.transform = 'scale(1)';
//                       }}
//                     >
//                       <X size={14} />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Specifications */}
//           <div style={{ marginBottom: '40px' }}>
//             <h3 style={{ 
//               fontSize: '1.25rem', 
//               fontWeight: '700', 
//               marginBottom: '20px',
//               color: '#1f2937',
//               paddingBottom: '16px',
//               borderBottom: '2px solid #e5e7eb'
//             }}>
//               Specifications (JSON Format)
//             </h3>
            
//             <textarea
//               name="specifications"
//               placeholder='{"material": "Cotton", "care": "Machine washable", "origin": "India"}'
//               value={formData.specifications}
//               onChange={handleChange}
//               rows="6"
//               style={{
//                 width: '100%',
//                 padding: '16px',
//                 border: '2px solid #e5e7eb',
//                 borderRadius: '12px',
//                 fontSize: '14px',
//                 fontFamily: 'Monaco, Consolas, "Lucida Console", monospace',
//                 background: '#f9fafb',
//                 transition: 'all 0.3s ease',
//                 outline: 'none',
//                 resize: 'vertical'
//               }}
//               onFocus={(e) => {
//                 e.target.style.borderColor = '#3b82f6';
//                 e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
//               }}
//               onBlur={(e) => {
//                 e.target.style.borderColor = '#e5e7eb';
//                 e.target.style.boxShadow = 'none';
//               }}
//             />
//           </div>

//           {/* Action Buttons */}
//           <div style={{ 
//             display: 'flex', 
//             gap: '16px', 
//             justifyContent: 'flex-end',
//             paddingTop: '24px',
//             borderTop: '2px solid #e5e7eb'
//           }}>
//             <button 
//               type="button" 
//               onClick={onCancel}
//               style={{
//                 padding: '12px 24px',
//                 background: '#f3f4f6',
//                 border: 'none',
//                 borderRadius: '8px',
//                 color: '#374151',
//                 fontSize: '14px',
//                 fontWeight: '500',
//                 cursor: 'pointer',
//                 transition: 'all 0.3s ease'
//               }}
//               onMouseEnter={(e) => {
//                 e.target.style.background = '#e5e7eb';
//               }}
//               onMouseLeave={(e) => {
//                 e.target.style.background = '#f3f4f6';
//               }}
//             >
//               Cancel
//             </button>
//             <button 
//               type="submit" 
//               disabled={loading}
//               style={{
//                 padding: '12px 24px',
//                 background: loading 
//                   ? '#9ca3af' 
//                   : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
//                 border: 'none',
//                 borderRadius: '8px',
//                 color: 'white',
//                 fontSize: '14px',
//                 fontWeight: '600',
//                 cursor: loading ? 'not-allowed' : 'pointer',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '8px',
//                 transition: 'all 0.3s ease'
//               }}
//               onMouseEnter={(e) => {
//                 if (!loading) {
//                   e.target.style.transform = 'translateY(-2px)';
//                   e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
//                 }
//               }}
//               onMouseLeave={(e) => {
//                 if (!loading) {
//                   e.target.style.transform = 'translateY(0)';
//                   e.target.style.boxShadow = 'none';
//                 }
//               }}
//             >
//               {loading ? (
//                 <>
//                   <div style={{
//                     width: '16px',
//                     height: '16px',
//                     border: '2px solid rgba(255, 255, 255, 0.3)',
//                     borderTop: '2px solid white',
//                     borderRadius: '50%',
//                     animation: 'spin 1s linear infinite'
//                   }}></div>
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   <Save size={16} />
//                   {product ? 'Update Product' : 'Add Product'}
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>

//       <style jsx>{`
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AddProduct;
import React, { useState, useEffect } from 'react';
import { superAdminAPI } from '../../services/api';
import { PRODUCT_SIZES } from '../../utils/constants';
import { ArrowLeft, Save, Upload, X, Package, Tag, DollarSign, Image as ImageIcon } from 'lucide-react';

const AddProduct = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sellingPrice: '',
    availableSizes: [],
    images: [],
    specifications: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      console.log('Product data:', product); // Debug log
      
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        sellingPrice: product.sellingPrice || product.selling_price || '',
        // Handle different possible property names and ensure it's an array
        availableSizes: product.availableSizes || product.available_sizes || [],
        images: product.images || [],
        specifications: JSON.stringify(product.specifications || {}, null, 2)
      });
    }
  }, [product]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      availableSizes: (prev.availableSizes || []).includes(size)
        ? (prev.availableSizes || []).filter(s => s !== size)
        : [...(prev.availableSizes || []), size]
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...(prev.images || []), reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        specifications: formData.specifications ? JSON.parse(formData.specifications) : {}
      };

      if (product) {
        await superAdminAPI.updateProduct(product.id, submitData);
      } else {
        await superAdminAPI.addProduct(submitData);
      }
      
      onSubmit();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ 
      padding: '24px',
      maxWidth: '1000px',
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
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '20px',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <ArrowLeft size={16} />
            Back to Products
          </button>
          
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700', 
            marginBottom: '8px',
            background: 'linear-gradient(45deg, #ffffff, #f0f0f0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {product ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            opacity: 0.9
          }}>
            {product ? 'Update product details in the catalog' : 'Enter product details to add to the catalog'}
          </p>
        </div>
      </div>

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
              marginBottom: '24px', 
              padding: '16px', 
              background: 'linear-gradient(135deg, #fee2e2, #fecaca)', 
              border: '1px solid #f87171', 
              borderRadius: '12px',
              color: '#dc2626',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {error}
            </div>
          )}

          {/* Basic Information */}
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
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                borderRadius: '10px',
                padding: '8px',
                color: 'white'
              }}>
                <Package size={20} />
              </div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '700', 
                margin: 0,
                color: '#1f2937'
              }}>
                Basic Information
              </h3>
            </div>
            
            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
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
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Describe your product in detail"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    resize: 'vertical'
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Original Price (₹)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <DollarSign size={16} style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#9ca3af'
                    }} />
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px 12px 40px',
                        border: '2px solid #e5e7eb',
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
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Selling Price (₹)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Tag size={16} style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#9ca3af'
                    }} />
                    <input
                      type="number"
                      step="0.01"
                      name="sellingPrice"
                      placeholder="0.00"
                      value={formData.sellingPrice}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px 12px 40px',
                        border: '2px solid #e5e7eb',
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
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Available Sizes */}
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '700', 
              marginBottom: '20px',
              color: '#1f2937',
              paddingBottom: '16px',
              borderBottom: '2px solid #e5e7eb'
            }}>
              Available Sizes
            </h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', 
              gap: '12px' 
            }}>
              {PRODUCT_SIZES.map((size) => {
                // Safe check with default empty array
                const isSelected = (formData.availableSizes || []).includes(size);
                
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeToggle(size)}
                    style={{
                      padding: '12px 16px',
                      border: `2px solid ${isSelected ? '#3b82f6' : '#e5e7eb'}`,
                      borderRadius: '8px',
                      background: isSelected 
                        ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
                        : 'white',
                      color: isSelected ? 'white' : '#374151',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textAlign: 'center'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.target.style.borderColor = '#3b82f6';
                        e.target.style.background = '#f0f9ff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.background = 'white';
                      }
                    }}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Images */}
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
                <ImageIcon size={20} />
              </div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '700', 
                margin: 0,
                color: '#1f2937'
              }}>
                Product Images
              </h3>
            </div>
            
            <div style={{ 
              border: '2px dashed #d1d5db', 
              borderRadius: '12px', 
              padding: '40px 20px', 
              textAlign: 'center',
              marginBottom: '24px',
              background: 'linear-gradient(135deg, #f9fafb, #ffffff)',
              transition: 'all 0.3s ease'
            }}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                id="image-upload"
              />
              <label 
                htmlFor="image-upload" 
                style={{ cursor: 'pointer', display: 'block' }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #e5e7eb, #f3f4f6)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <Upload size={24} style={{ color: '#9ca3af' }} />
                </div>
                <p style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#374151',
                  margin: '0 0 8px 0'
                }}>
                  Click to upload images or drag and drop
                </p>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#6b7280',
                  margin: 0
                }}>
                  PNG, JPG up to 2MB each
                </p>
              </label>
            </div>

            {(formData.images || []).length > 0 && (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
                gap: '16px' 
              }}>
                {(formData.images || []).map((image, index) => (
                  <div key={index} style={{ 
                    position: 'relative',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}>
                    <img 
                      src={image} 
                      alt={`Product ${index + 1}`}
                      style={{ 
                        width: '100%', 
                        height: '150px', 
                        objectFit: 'cover'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#dc2626';
                        e.target.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = '#ef4444';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Specifications */}
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '700', 
              marginBottom: '20px',
              color: '#1f2937',
              paddingBottom: '16px',
              borderBottom: '2px solid #e5e7eb'
            }}>
              Specifications (JSON Format)
            </h3>
            
            <textarea
              name="specifications"
              placeholder='{"material": "Cotton", "care": "Machine washable", "origin": "India"}'
              value={formData.specifications}
              onChange={handleChange}
              rows="6"
              style={{
                width: '100%',
                padding: '16px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '14px',
                fontFamily: 'Monaco, Consolas, "Lucida Console", monospace',
                background: '#f9fafb',
                transition: 'all 0.3s ease',
                outline: 'none',
                resize: 'vertical'
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

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            justifyContent: 'flex-end',
            paddingTop: '24px',
            borderTop: '2px solid #e5e7eb'
          }}>
            <button 
              type="button" 
              onClick={onCancel}
              style={{
                padding: '12px 24px',
                background: '#f3f4f6',
                border: 'none',
                borderRadius: '8px',
                color: '#374151',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#e5e7eb';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#f3f4f6';
              }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              style={{
                padding: '12px 24px',
                background: loading 
                  ? '#9ca3af' 
                  : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
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
                  {product ? 'Update Product' : 'Add Product'}
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

export default AddProduct;