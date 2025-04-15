
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Product, 
  ProductBrand, 
  ProductCategory,
} from '@/types';
import { 
  MOCK_PRODUCTS, 
  MOCK_PRODUCT_BRANDS, 
  MOCK_PRODUCT_CATEGORIES, 
} from '@/data/mockData';

export const useProductsData = () => {
  const { currentSalonId } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<ProductBrand[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentSalonId) return;

    // Simulate API call to fetch products data
    setLoading(true);
    try {
      // Fetch mock data
      setTimeout(() => {
        const productsData = MOCK_PRODUCTS[currentSalonId] || [];
        const brandsData = MOCK_PRODUCT_BRANDS[currentSalonId] || [];
        const categoriesData = MOCK_PRODUCT_CATEGORIES[currentSalonId] || [];

        setProducts(productsData);
        setBrands(brandsData);
        setCategories(categoriesData);
        setLoading(false);
      }, 500); // Simulate network delay
    } catch (err) {
      setError('Failed to fetch products data');
      setLoading(false);
    }
  }, [currentSalonId]);

  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => 
      prev.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  return { 
    products, 
    brands, 
    categories, 
    loading, 
    error,
    addProduct,
    updateProduct,
    deleteProduct
  };
};
