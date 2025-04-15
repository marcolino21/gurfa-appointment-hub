
import React, { useState } from 'react';
import { 
  Search, 
  PlusCircle, 
  Download, 
  Upload, 
  Filter, 
  AlertTriangle, 
  RefreshCw 
} from 'lucide-react';
import { useProductsData } from '@/features/warehouse/hooks/useProductsData';
import { ProductsTable } from '@/features/warehouse/components/ProductsTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProductForm } from '@/features/warehouse/components/ProductForm';
import { CsvImportModal } from '@/features/warehouse/components/CsvImportModal';
import { toast } from '@/hooks/use-toast';

const Products: React.FC = () => {
  const { products, brands, categories, loading } = useProductsData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const uniqueFormats = [...new Set(products.map(p => p.format).filter(Boolean))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.barcode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          false;
    
    const matchesBrand = !selectedBrand || product.brand === selectedBrand;
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesFormat = !selectedFormat || product.format === selectedFormat;
    
    return matchesSearch && matchesBrand && matchesCategory && matchesFormat;
  });

  const handleExportCsv = () => {
    toast({
      title: "Esportazione avviata",
      description: "Il file CSV verrà scaricato a breve",
    });
    // In a real app, this would trigger a CSV download
  };

  const handleAddProduct = () => {
    setShowProductForm(true);
  };

  const handleShowLowStock = () => {
    // In a real app, this would filter to show only low stock products
    toast({
      title: "Filtro applicato",
      description: "Visualizzazione prodotti sotto scorta",
    });
  };

  const handleShowBestSellers = () => {
    // In a real app, this would filter to show best selling products
    toast({
      title: "Filtro applicato",
      description: "Visualizzazione prodotti più venduti",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-900">Prodotti</h1>
        <div className="flex gap-2">
          <Button onClick={handleAddProduct} className="bg-indigo-600 hover:bg-indigo-700">
            <PlusCircle className="mr-2 h-4 w-4" /> Aggiungi nuovo prodotto
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Scarica
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Esporta dati</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleExportCsv}>
                <Download className="mr-2 h-4 w-4" /> Esporta CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportCsv}>
                <Download className="mr-2 h-4 w-4" /> Esporta Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input 
            placeholder="Ricerca per Prodotto, Brand o Item Number" 
            className="pl-10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="w-full sm:w-auto">
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tutti i brand</SelectItem>
                {brands.map(brand => (
                  <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full sm:w-auto">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tutte le categorie</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full sm:w-auto">
            <Select value={selectedFormat} onValueChange={setSelectedFormat}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Formato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tutti i formati</SelectItem>
                {uniqueFormats.map(format => format && (
                  <SelectItem key={format} value={format}>{format}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="outline" className="gap-1 ml-auto" onClick={() => setShowImportModal(true)}>
            <Upload className="h-4 w-4" />
            Importa CSV
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                <Filter className="h-4 w-4" />
                Options
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleShowLowStock}>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Prodotti sotto scorta
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShowBestSellers}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Prodotti più venduti
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <ProductsTable products={filteredProducts} brands={brands} categories={categories} />
      )}

      <ProductForm 
        open={showProductForm} 
        onOpenChange={setShowProductForm}
        brands={brands}
        categories={categories}
      />

      <CsvImportModal
        open={showImportModal}
        onOpenChange={setShowImportModal}
      />
    </div>
  );
};

export default Products;
