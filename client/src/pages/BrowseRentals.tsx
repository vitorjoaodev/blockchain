import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Property, Category } from "@shared/schema";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Search, SlidersHorizontal } from "lucide-react";

const BrowseRentals = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Fetch categories
  const { 
    data: categories, 
    isLoading: loadingCategories 
  } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Fetch properties
  const { 
    data: properties, 
    isLoading: loadingProperties 
  } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  // Filter properties based on category, search term, and price range
  const filteredProperties = properties?.filter(property => {
    const matchesCategory = selectedCategory === "all" || property.categoryId.toString() === selectedCategory;
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (property.description?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];
    
    return matchesCategory && matchesSearch && matchesPrice;
  });

  // Function to get category name by id
  const getCategoryName = (categoryId: number): string | undefined => {
    return categories?.find(cat => cat.id === categoryId)?.name;
  };

  // Get max price for the slider
  const maxPrice = properties ? Math.max(...properties.map(p => p.pricePerDay)) : 1000;

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-6">Explore Propriedades para Alugar</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            Encontre as melhores opções em carros, drones, imóveis e equipamentos para alugar com segurança usando blockchain.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="Buscar por nome, descrição ou localização..." 
                className="pl-12 h-14 text-lg rounded-l-lg rounded-r-none focus-visible:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button 
                variant="outline" 
                className="h-14 rounded-l-none border-l-0 px-4"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Filters */}
          {showFilters && (
            <div className="bg-white rounded-lg shadow-sm border border-border p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Categorias</h3>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as categorias</SelectItem>
                      {categories?.map(category => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Preço por dia</h3>
                  <div className="px-2">
                    <Slider 
                      value={priceRange} 
                      min={0} 
                      max={maxPrice} 
                      step={10} 
                      onValueChange={setPriceRange} 
                    />
                    <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setSelectedCategory("all");
                      setSearchTerm("");
                      setPriceRange([0, maxPrice]);
                    }}
                  >
                    Limpar Filtros
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold">
              {filteredProperties?.length || 0} propriedades encontradas
            </h2>
          </div>

          {/* Loading State */}
          {loadingProperties && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-1/3 mb-4" />
                    <div className="border-t border-border mt-3 pt-3 flex justify-between items-center">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-9 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Rental Listings */}
          {!loadingProperties && (
            <>
              {filteredProperties?.length === 0 ? (
                <div className="text-center py-16">
                  <h3 className="text-xl font-medium mb-2">Nenhum resultado encontrado</h3>
                  <p className="text-muted-foreground">Tente ajustar seus filtros para ver mais opções.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProperties?.map(property => (
                    <PropertyCard 
                      key={property.id} 
                      property={property} 
                      categoryName={getCategoryName(property.categoryId)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default BrowseRentals;