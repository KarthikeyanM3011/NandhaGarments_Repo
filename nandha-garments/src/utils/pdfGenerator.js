// src/utils/pdfGenerator.js

export const generateOrdersPDF = (orders, filters) => {
    // Create PDF content as HTML string that can be converted to PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Orders for Tailors - ${new Date().toLocaleDateString()}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
          }
          
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #3b82f6;
          }
          
          .header h1 {
            color: #1f2937;
            margin: 0 0 10px 0;
            font-size: 24px;
            font-weight: bold;
          }
          
          .header .subtitle {
            color: #6b7280;
            font-size: 14px;
            margin: 0;
          }
          
          .filters-info {
            background: #f9fafb;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 25px;
            border-left: 4px solid #3b82f6;
          }
          
          .filters-info h3 {
            margin: 0 0 10px 0;
            color: #374151;
            font-size: 14px;
          }
          
          .filters-info p {
            margin: 2px 0;
            font-size: 11px;
            color: #6b7280;
          }
          
          .order-card {
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            margin-bottom: 25px;
            page-break-inside: avoid;
            background: white;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          
          .order-header {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
            padding: 15px 20px;
            border-radius: 10px 10px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .order-header h2 {
            margin: 0;
            font-size: 16px;
            font-weight: bold;
          }
          
          .order-status {
            background: rgba(255, 255, 255, 0.2);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 500;
            text-transform: uppercase;
          }
          
          .order-content {
            padding: 20px;
          }
          
          .customer-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
            padding: 15px;
            background: #f8fafc;
            border-radius: 8px;
          }
          
          .info-section h4 {
            margin: 0 0 8px 0;
            color: #374151;
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .info-section p {
            margin: 2px 0;
            color: #1f2937;
            font-size: 12px;
          }
          
          .measurements-section {
            margin: 20px 0;
            padding: 15px;
            background: #fef3c7;
            border-radius: 8px;
            border-left: 4px solid #f59e0b;
          }
          
          .measurements-section h4 {
            margin: 0 0 15px 0;
            color: #92400e;
            font-size: 14px;
            font-weight: bold;
          }
          
          .measurements-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
          }
          
          .measurement-item {
            background: white;
            padding: 8px;
            border-radius: 6px;
            text-align: center;
            border: 1px solid #fbbf24;
          }
          
          .measurement-item .label {
            font-size: 10px;
            color: #92400e;
            font-weight: 500;
            text-transform: uppercase;
            margin-bottom: 2px;
          }
          
          .measurement-item .value {
            font-size: 12px;
            font-weight: bold;
            color: #1f2937;
          }
          
          .products-section {
            margin: 20px 0;
          }
          
          .products-section h4 {
            margin: 0 0 10px 0;
            color: #374151;
            font-size: 13px;
            font-weight: 600;
          }
          
          .product-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 15px;
            background: #f9fafb;
            border-radius: 6px;
            margin-bottom: 8px;
            border-left: 3px solid #10b981;
          }
          
          .product-details {
            flex: 1;
          }
          
          .product-name {
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 2px;
          }
          
          .product-specs {
            font-size: 11px;
            color: #6b7280;
          }
          
          .product-price {
            font-weight: bold;
            color: #059669;
            font-size: 12px;
          }
          
          .notes-section {
            margin: 20px 0;
            padding: 15px;
            background: #ede9fe;
            border-radius: 8px;
            border-left: 4px solid #8b5cf6;
          }
          
          .notes-section h4 {
            margin: 0 0 8px 0;
            color: #6b21a8;
            font-size: 13px;
            font-weight: 600;
          }
          
          .address-section {
            margin: 20px 0;
            padding: 15px;
            background: #ecfdf5;
            border-radius: 8px;
            border-left: 4px solid #10b981;
          }
          
          .address-section h4 {
            margin: 0 0 8px 0;
            color: #065f46;
            font-size: 13px;
            font-weight: 600;
          }
          
          .footer-info {
            margin-top: 20px;
            padding-top: 15px;
            border-top: 2px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
            color: #6b7280;
          }
          
          .total-amount {
            font-size: 16px;
            font-weight: bold;
            color: #1f2937;
          }
          
          @media print {
            body { margin: 0; }
            .order-card { page-break-inside: avoid; }
          }
          
          .no-measurements {
            color: #ef4444;
            font-style: italic;
            text-align: center;
            padding: 15px;
            background: #fef2f2;
            border-radius: 6px;
            border: 1px solid #fecaca;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Orders for Tailors</h1>
          <p class="subtitle">Generated on ${new Date().toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </div>
        
        <div class="filters-info">
          <h3>Filter Applied:</h3>
          <p><strong>Status:</strong> ${filters.status === 'all' ? 'All Statuses' : filters.status.charAt(0).toUpperCase() + filters.status.slice(1)}</p>
          <p><strong>User Type:</strong> ${filters.userType === 'all' ? 'All User Types' : filters.userType.charAt(0).toUpperCase() + filters.userType.slice(1)}</p>
          ${filters.dateFrom ? `<p><strong>Date From:</strong> ${new Date(filters.dateFrom).toLocaleDateString('en-IN')}</p>` : ''}
          ${filters.dateTo ? `<p><strong>Date To:</strong> ${new Date(filters.dateTo).toLocaleDateString('en-IN')}</p>` : ''}
          <p><strong>Total Orders:</strong> ${orders.length}</p>
        </div>
        
        ${orders.map(order => `
          <div class="order-card">
            <div class="order-header">
              <h2>Order #${order.id}</h2>
              <span class="order-status">${order.status}</span>
            </div>
            
            <div class="order-content">
              <div class="customer-info">
                <div class="info-section">
                  <h4>Customer Details</h4>
                  <p><strong>Name:</strong> ${order.user_name || 'N/A'}</p>
                  <p><strong>Email:</strong> ${order.user_email || 'N/A'}</p>
                  <p><strong>Type:</strong> ${order.user_type || 'N/A'}</p>
                  <p><strong>Order Date:</strong> ${new Date(order.created_at || order.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
                <div class="info-section">
                  <h4>Order Summary</h4>
                  <p><strong>Total Amount:</strong> ₹${order.total_amount?.toLocaleString('en-IN') || order.totalAmount?.toLocaleString('en-IN') || '0'}</p>
                  <p><strong>Payment:</strong> Cash on Delivery</p>
                  <p><strong>Items:</strong> ${order.items?.length || 0} product(s)</p>
                  ${order.measurement_id || order.measurementId ? `<p><strong>Measurement ID:</strong> #${order.measurement_id || order.measurementId}</p>` : ''}
                </div>
              </div>
              
              ${order.measurements ? `
                <div class="measurements-section">
                  <h4>📏 Measurements (${order.measurements.gender || 'Unknown'})</h4>
                  <div class="measurements-grid">
                    <div class="measurement-item">
                      <div class="label">Chest</div>
                      <div class="value">${order.measurements.chest || 'N/A'}"</div>
                    </div>
                    <div class="measurement-item">
                      <div class="label">Waist</div>
                      <div class="value">${order.measurements.waist || 'N/A'}"</div>
                    </div>
                    <div class="measurement-item">
                      <div class="label">Seat</div>
                      <div class="value">${order.measurements.seat || 'N/A'}"</div>
                    </div>
                    <div class="measurement-item">
                      <div class="label">Shirt Length</div>
                      <div class="value">${order.measurements.shirtLength || 'N/A'}"</div>
                    </div>
                    <div class="measurement-item">
                      <div class="label">Arm Length</div>
                      <div class="value">${order.measurements.armLength || 'N/A'}"</div>
                    </div>
                    <div class="measurement-item">
                      <div class="label">Neck</div>
                      <div class="value">${order.measurements.neck || 'N/A'}"</div>
                    </div>
                    <div class="measurement-item">
                      <div class="label">Hip</div>
                      <div class="value">${order.measurements.hip || 'N/A'}"</div>
                    </div>
                    <div class="measurement-item">
                      <div class="label">Polo Length</div>
                      <div class="value">${order.measurements.poloShirtLength || 'N/A'}"</div>
                    </div>
                    <div class="measurement-item">
                      <div class="label">Shoulder</div>
                      <div class="value">${order.measurements.shoulderWidth || 'N/A'}"</div>
                    </div>
                    <div class="measurement-item">
                      <div class="label">Wrist</div>
                      <div class="value">${order.measurements.wrist || 'N/A'}"</div>
                    </div>
                    <div class="measurement-item">
                      <div class="label">Biceps</div>
                      <div class="value">${order.measurements.biceps || 'N/A'}"</div>
                    </div>
                  </div>
                  ${order.measurements.notes ? `
                    <div style="margin-top: 10px; padding: 8px; background: white; border-radius: 4px;">
                      <strong>Special Notes:</strong> ${order.measurements.notes}
                    </div>
                  ` : ''}
                </div>
              ` : `
                <div class="no-measurements">
                  ⚠️ No measurements available for this order
                </div>
              `}
              
              <div class="products-section">
                <h4>🛍️ Products Ordered</h4>
                ${order.items?.map(item => `
                  <div class="product-item">
                    <div class="product-details">
                      <div class="product-name">${item.product_name || item.productName || 'Unknown Product'}</div>
                      <div class="product-specs">Size: ${item.size || 'N/A'} | Quantity: ${item.quantity || 1}</div>
                    </div>
                    <div class="product-price">₹${(item.price * item.quantity)?.toLocaleString('en-IN') || '0'}</div>
                  </div>
                `).join('') || '<p>No items found</p>'}
              </div>
              
              <div class="address-section">
                <h4>📍 Delivery Address</h4>
                <p>${order.delivery_address || order.deliveryAddress || 'No delivery address provided'}</p>
              </div>
              
              <div class="footer-info">
                <span>Order ID: #${order.id} | Generated: ${new Date().toLocaleString('en-IN')}</span>
                <span class="total-amount">Total: ₹${(order.total_amount || order.totalAmount)?.toLocaleString('en-IN') || '0'}</span>
              </div>
            </div>
          </div>
        `).join('')}
        
        <div style="text-align: center; margin-top: 30px; padding: 20px; border-top: 2px solid #e5e7eb; color: #6b7280; font-size: 11px;">
          <p>This document contains ${orders.length} orders for tailoring work.</p>
          <p>Generated by Nandha Garments Management System</p>
        </div>
      </body>
      </html>
    `;
  
    // Create and download PDF using browser's print functionality
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = function() {
      printWindow.print();
      // Close window after printing (optional)
      setTimeout(() => {
        printWindow.close();
      }, 1000);
    };
  };
  
  // Alternative method for direct PDF download (requires additional libraries)
  export const downloadOrdersPDFDirect = async (orders, filters) => {
    try {
      // This would use html2pdf.js library if installed
      // npm install html2pdf.js
      
      const html2pdf = (await import('html2pdf.js')).default;
      
      const element = document.createElement('div');
      element.innerHTML = generatePDFContent(orders, filters);
      
      const opt = {
        margin: 1,
        filename: `orders-for-tailors-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      
      html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Direct PDF download not available, using print method instead');
      generateOrdersPDF(orders, filters);
    }
  };
  
  const generatePDFContent = (orders, filters) => {
    // Same HTML content but without the full HTML structure
    return `
      <div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; color: #333;">
        <!-- PDF content goes here - similar to above but adapted for direct PDF generation -->
      </div>
    `;
  };