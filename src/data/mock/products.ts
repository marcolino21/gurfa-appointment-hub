
import { 
  Product, 
  ProductBrand, 
  ProductCategory, 
  ProductSupplier, 
  ProductOrder 
} from '@/types';

// Mock products data
export const MOCK_PRODUCT_BRANDS: Record<string, ProductBrand[]> = {
  'sa1': [
    { id: 'brand1', name: 'Aveda', salonId: 'sa1' },
    { id: 'brand2', name: 'Nashi Argan', salonId: 'sa1' },
    { id: 'brand3', name: 'Wella', salonId: 'sa1' },
    { id: 'brand4', name: 'Redken', salonId: 'sa1' },
    { id: 'brand5', name: 'L\'Oréal', salonId: 'sa1' },
  ]
};

export const MOCK_PRODUCT_CATEGORIES: Record<string, ProductCategory[]> = {
  'sa1': [
    { id: 'pcat1', name: 'Colorazione', salonId: 'sa1' },
    { id: 'pcat2', name: 'Trattamenti', salonId: 'sa1' },
    { id: 'pcat3', name: 'Styling', salonId: 'sa1' },
    { id: 'pcat4', name: 'Shampoo', salonId: 'sa1' },
    { id: 'pcat5', name: 'Accessori', salonId: 'sa1' },
  ]
};

export const MOCK_PRODUCT_SUPPLIERS: Record<string, ProductSupplier[]> = {
  'sa1': [
    { 
      id: 'sup1', 
      name: 'Aveda Italia', 
      contactPerson: 'Mario Rossi', 
      email: 'mario.rossi@aveda.it', 
      phone: '+39 02 1234567',
      address: 'Via Roma 123, Milano',
      salonId: 'sa1' 
    },
    { 
      id: 'sup2', 
      name: 'Nashi Distribuzione', 
      contactPerson: 'Laura Bianchi', 
      email: 'laura.bianchi@nashidist.it', 
      phone: '+39 02 7654321',
      salonId: 'sa1' 
    },
  ]
};

export const MOCK_PRODUCTS: Record<string, Product[]> = {
  'sa1': [
    {
      id: 'p1',
      name: '10 Volume Color Catalyst 887ml 10%',
      description: 'Catalyst for permanent color',
      barcode: '018084868027',
      brand: 'brand1',
      category: 'pcat1',
      supplier: 'sup1',
      price: 20.61,
      costPrice: 12.35,
      stockQuantity: 4,
      lowStockThreshold: 2,
      volume: '887ml',
      format: '10%',
      salonId: 'sa1',
      createdAt: '2025-01-15',
      updatedAt: '2025-04-10'
    },
    {
      id: 'p2',
      name: '5 Volume Color Catalyst 887ml 5%',
      description: 'Catalyst for permanent color',
      barcode: '018084860021',
      brand: 'brand1',
      category: 'pcat1',
      supplier: 'sup1',
      price: 20.61,
      costPrice: 12.35,
      stockQuantity: 1,
      lowStockThreshold: 2,
      volume: '887ml',
      format: '5%',
      salonId: 'sa1',
      createdAt: '2025-01-15',
      updatedAt: '2025-04-10'
    },
    {
      id: 'p3',
      name: 'Air Control 300ml',
      description: 'Light hold hairspray',
      barcode: '018084836552',
      brand: 'brand1',
      category: 'pcat3',
      supplier: 'sup1',
      price: 30.50,
      costPrice: 18.30,
      stockQuantity: 2,
      lowStockThreshold: 3,
      volume: '300ml',
      salonId: 'sa1',
      createdAt: '2025-01-20',
      updatedAt: '2025-04-10'
    },
    {
      id: 'p4',
      name: 'Armonia Shampoo 250ml',
      description: 'Nourishing shampoo',
      barcode: '8025026270536',
      brand: 'brand2',
      category: 'pcat4',
      supplier: 'sup2',
      price: 21.00,
      costPrice: 12.60,
      stockQuantity: 2,
      lowStockThreshold: 2,
      volume: '250ml',
      salonId: 'sa1',
      createdAt: '2025-01-10',
      updatedAt: '2025-04-10'
    },
    {
      id: 'p5',
      name: 'Aveda Mini Paddle Brush',
      description: 'Mini paddle brush for styling',
      barcode: '018084009413',
      brand: 'brand1',
      category: 'pcat5',
      supplier: 'sup1',
      price: 21.50,
      costPrice: 12.90,
      stockQuantity: 4,
      lowStockThreshold: 2,
      salonId: 'sa1',
      createdAt: '2025-02-05',
      updatedAt: '2025-04-10'
    },
    {
      id: 'p6',
      name: 'Be Curly Co Wash 250ml',
      description: 'Co-wash for curly hair',
      barcode: '018084951200',
      brand: 'brand1',
      category: 'pcat4',
      supplier: 'sup1',
      price: 30.50,
      costPrice: 18.30,
      stockQuantity: 1,
      lowStockThreshold: 2,
      volume: '250ml',
      salonId: 'sa1',
      createdAt: '2025-02-10',
      updatedAt: '2025-04-10'
    },
    {
      id: 'p7',
      name: 'Be Curly conditioner 200ml',
      description: 'Conditioner for curly hair',
      barcode: '018084844625',
      brand: 'brand1',
      category: 'pcat2',
      supplier: 'sup1',
      price: 37.00,
      costPrice: 22.20,
      stockQuantity: 3,
      lowStockThreshold: 2,
      volume: '200ml',
      salonId: 'sa1',
      createdAt: '2025-02-15',
      updatedAt: '2025-04-10'
    },
    {
      id: 'p8',
      name: 'Be Curly Curl Enhancer 200ml',
      description: 'Curl enhancer for curly hair',
      barcode: '018084803479',
      brand: 'brand1',
      category: 'pcat3',
      supplier: 'sup1',
      price: 34.50,
      costPrice: 20.70,
      stockQuantity: 1,
      lowStockThreshold: 2,
      volume: '200ml',
      salonId: 'sa1',
      createdAt: '2025-02-20',
      updatedAt: '2025-04-10'
    },
    {
      id: 'p9',
      name: 'Be Curly Curl Enhancer Cream BB 200ml',
      description: 'Curl enhancer cream for curly hair',
      barcode: '018084804223',
      brand: 'brand1',
      category: 'pcat3',
      supplier: 'sup1',
      price: 31.50,
      costPrice: 18.90,
      stockQuantity: 0,
      lowStockThreshold: 2,
      volume: '200ml',
      salonId: 'sa1',
      createdAt: '2025-02-25',
      updatedAt: '2025-04-10'
    },
    {
      id: 'p10',
      name: 'Be Curly Detangling masque 150ml',
      description: 'Detangling mask for curly hair',
      barcode: '018084951231',
      brand: 'brand1',
      category: 'pcat2',
      supplier: 'sup1',
      price: 38.50,
      costPrice: 23.10,
      stockQuantity: 3,
      lowStockThreshold: 2,
      volume: '150ml',
      salonId: 'sa1',
      createdAt: '2025-03-01',
      updatedAt: '2025-04-10'
    }
  ]
};

export const MOCK_PRODUCT_ORDERS: Record<string, ProductOrder[]> = {
  'sa1': [
    {
      id: 'order1',
      supplierId: 'sup1',
      orderDate: '2025-03-10',
      expectedDeliveryDate: '2025-03-15',
      status: 'delivered',
      totalAmount: 250.80,
      paymentStatus: 'paid',
      salonId: 'sa1',
      items: [
        {
          id: 'item1',
          productId: 'p1',
          quantity: 5,
          unitPrice: 12.35,
          totalPrice: 61.75,
          orderId: 'order1'
        },
        {
          id: 'item2',
          productId: 'p3',
          quantity: 3,
          unitPrice: 18.30,
          totalPrice: 54.90,
          orderId: 'order1'
        },
        {
          id: 'item3',
          productId: 'p5',
          quantity: 2,
          unitPrice: 12.90,
          totalPrice: 25.80,
          orderId: 'order1'
        }
      ]
    },
    {
      id: 'order2',
      supplierId: 'sup2',
      orderDate: '2025-04-05',
      expectedDeliveryDate: '2025-04-12',
      status: 'pending',
      totalAmount: 126.00,
      paymentStatus: 'pending',
      salonId: 'sa1',
      items: [
        {
          id: 'item4',
          productId: 'p4',
          quantity: 10,
          unitPrice: 12.60,
          totalPrice: 126.00,
          orderId: 'order2'
        }
      ]
    }
  ]
};
