
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
import { toast } from '@/hooks/use-toast';

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
    toast({
      title: "Prodotto aggiunto",
      description: `${product.name} è stato aggiunto al magazzino.`
    });
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => 
      prev.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    toast({
      title: "Prodotto eliminato",
      description: "Il prodotto è stato rimosso dal magazzino."
    });
  };

  const updateStock = (productId: string, newQuantity: number) => {
    setProducts(prev => 
      prev.map(p => {
        if (p.id === productId) {
          return { ...p, stockQuantity: newQuantity };
        }
        return p;
      })
    );
  };

  const bulkUpdateStock = (productUpdates: { id: string, quantity: number }[]) => {
    setProducts(prev => 
      prev.map(product => {
        const update = productUpdates.find(update => update.id === product.id);
        if (update) {
          return { ...product, stockQuantity: update.quantity };
        }
        return product;
      })
    );
    
    toast({
      title: "Giacenze aggiornate",
      description: `Aggiornate le giacenze di ${productUpdates.length} prodotti.`
    });
  };

  const getLowStockProducts = () => {
    return products.filter(
      product => product.lowStockThreshold && product.stockQuantity <= product.lowStockThreshold
    );
  };

  return { 
    products, 
    brands, 
    categories, 
    loading, 
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    bulkUpdateStock,
    getLowStockProducts
  };
};
