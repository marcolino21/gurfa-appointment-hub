
import React from 'react';
import { Search, Upload, Filter, AlertTriangle, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProductBrand, ProductCategory } from '@/types';
import { toast } from '@/hooks/use-toast';

interface ProductsFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedBrand: string;
  setSelectedBrand: (brandId: string) => void;
  selectedCategory: string;
  setSelectedCategory: (categoryId: string) => void;
  selectedFormat: string;
  setSelectedFormat: (format: string) => void;
  brands: ProductBrand[];
  categories: ProductCategory[];
  uniqueFormats: string[];
  onShowImportModal: () => void;
}

export const ProductsFilters: React.FC<ProductsFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedBrand,
  setSelectedBrand,
  selectedCategory,
  setSelectedCategory,
  selectedFormat,
  setSelectedFormat,
  brands,
  categories,
  uniqueFormats,
  onShowImportModal,
}) => {
  const handleShowLowStock = () => {
    toast({
      title: "Filtro applicato",
      description: "Visualizzazione prodotti sotto scorta",
    });
  };

  const handleShowBestSellers = () => {
    toast({
      title: "Filtro applicato",
      description: "Visualizzazione prodotti più venduti",
    });
  };

  return (
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
              <SelectItem value="all_brands">Tutti i brand</SelectItem>
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
              <SelectItem value="all_categories">Tutte le categorie</SelectItem>
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
              <SelectItem value="all_formats">Tutti i formati</SelectItem>
              {uniqueFormats.map(format => format && (
                <SelectItem key={format} value={format}>{format}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline" className="gap-1 ml-auto" onClick={onShowImportModal}>
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
  );
};
