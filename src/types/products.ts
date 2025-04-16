
export interface ProductCategory {
  id: string;
  name: string;
  salonId: string;
}

export interface ProductBrand {
  id: string;
  name: string;
  salonId: string;
}

export interface ProductSupplier {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  salonId: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  barcode?: string;
  brand?: string;
  category?: string;
  supplier?: string;
  price: number;
  costPrice?: number;
  stockQuantity: number;
  lowStockThreshold?: number;
  size?: string;
  weight?: number;
  volume?: string;
  format?: string;
  salonId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductOrder {
  id: string;
  supplierId: string;
  orderDate: string;
  expectedDeliveryDate?: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'partially_paid';
  salonId: string;
  items: ProductOrderItem[];
}

export interface ProductOrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  orderId: string;
}
