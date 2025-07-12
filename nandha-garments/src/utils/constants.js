export const MEASUREMENT_FIELDS = [
    { name: 'chest', label: 'Chest', unit: 'inches' },
    { name: 'waist', label: 'Waist', unit: 'inches' },
    { name: 'seat', label: 'Seat', unit: 'inches' },
    { name: 'shirtLength', label: 'Shirt Length', unit: 'inches' },
    { name: 'armLength', label: 'Arm Length', unit: 'inches' },
    { name: 'neck', label: 'Neck', unit: 'inches' },
    { name: 'hip', label: 'Hip', unit: 'inches' },
    { name: 'poloShirtLength', label: 'Polo Shirt Length', unit: 'inches' },
    { name: 'shoulderWidth', label: 'Shoulder Width', unit: 'inches' },
    { name: 'wrist', label: 'Wrist', unit: 'inches' },
    { name: 'biceps', label: 'Biceps', unit: 'inches' },
  ];
  
  export const ORDER_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    IN_PROGRESS: 'in_progress',
    READY: 'ready',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
  };
  
  export const USER_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    BLOCKED: 'blocked',
  };
  
  export const PRODUCT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  
  export const SORT_OPTIONS = [
    { value: 'name_asc', label: 'Name (A-Z)' },
    { value: 'name_desc', label: 'Name (Z-A)' },
    { value: 'price_asc', label: 'Price (Low to High)' },
    { value: 'price_desc', label: 'Price (High to Low)' },
    { value: 'date_asc', label: 'Oldest First' },
    { value: 'date_desc', label: 'Newest First' },
  ];