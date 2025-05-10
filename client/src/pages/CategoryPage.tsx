import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Category, Property } from "@shared/schema";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  Search,
  SlidersHorizontal,
  Star,
  Tag,
  ChevronLeft,
  XCircle,
} from "lucide-react";

const CategoryPage = () => {
  const { slug } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("price-asc");
  const [priceRange, setPriceRange] = useState([0, 0.1]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Fetch category
  const { 
    data: category,
    isLoading: loadingCategory,
    error: categoryError
  } = useQuery<Category>({
    queryKey: [`/api/categories/${slug}`],
  });
  
  // Fetch all properties
  const {
    data: properties,
    isLoading: loadingProperties,
    error: propertiesError
  } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });
  
  // Fetch all categories for navigation
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  // Filter properties by category
  const filteredProperties = properties?.filter(property => {
    // First filter by category
    if (category && property.categoryId !== category.id) return false;
    
    // Then filter by search term
    if (searchTerm && !property.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by price range
    if (property.price < priceRange[0] || property.price > priceRange[1]) {
      return false;
    }
    
    return true;
  });
  
  // Sort properties
  const sortedProperties = filteredProperties ? [...filteredProperties].sort((a, b) => {
    switch (sortOption) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating-desc":
        return b.rating - a.rating;
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  }) : [];
  
  // Find the max price to set the max range
  useEffect(() => {
    if (properties) {
      const categoryProperties = properties.filter(p => category && p.categoryId === category.id);
      if (categoryProperties.length > 0) {
        const maxPrice = Math.max(...categoryProperties.map(p => p.price));
        // Round up to the nearest tenth
        const roundedMax = Math.ceil(maxPrice * 10) / 10;
        setPriceRange([0, roundedMax]);
      }
    }
  }, [properties, category]);
  
  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setSortOption("price-asc");
    if (properties) {
      const categoryProperties = properties.filter(p => category && p.categoryId === category.id);
      if (categoryProperties.length > 0) {
        const maxPrice = Math.max(...categoryProperties.map(p => p.price));
        // Round up to the nearest tenth
        const roundedMax = Math.ceil(maxPrice * 10) / 10;
        setPriceRange([0, roundedMax]);
      }
    }
  };
  
  if (loadingCategory || loadingProperties) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-1/3 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  if (categoryError || !category) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Category Not Found</h2>
        <p className="text-muted-foreground mb-8">We couldn't find the category you're looking for.</p>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/" className="text-primary hover:underline inline-flex items-center mb-4">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-poppins">{category.name}</h1>
            <p className="text-muted-foreground mt-1">{category.description}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search..."
                className="pl-9 w-full sm:w-auto"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
        
        {showFilters && (
          <div className="mt-4 p-4 bg-background rounded-lg border border-border">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="w-full sm:w-1/3">
                <label className="text-sm font-medium mb-1 block">Sort By</label>
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="rating-desc">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-2/3">
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium">Price Range (ETH)</label>
                  <span className="text-sm text-muted-foreground">
                    {priceRange[0].toFixed(2)} - {priceRange[1].toFixed(2)} ETH
                  </span>
                </div>
                <Slider
                  defaultValue={[0, 0.1]}
                  max={0.2}
                  step={0.01}
                  value={[priceRange[0], priceRange[1]]}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                />
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="flex items-center text-muted-foreground hover:text-foreground"
              >
                <XCircle className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
          </div>
        )}
        
        <div className="flex overflow-x-auto gap-2 mt-4 pb-2">
          {categories?.map(cat => (
            <Link key={cat.id} href={`/category/${cat.slug}`}>
              <Button 
                variant={cat.id === category.id ? "default" : "outline"} 
                size="sm"
                className="whitespace-nowrap"
              >
                {cat.name}
              </Button>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="mb-4 flex justify-between items-center">
        <p className="text-muted-foreground">
          {sortedProperties.length} {sortedProperties.length === 1 ? 'property' : 'properties'} found
        </p>
      </div>
      
      {sortedProperties.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Tag className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No properties found</h3>
          <p className="text-muted-foreground mb-6">
            We couldn't find any properties matching your criteria.
          </p>
          <Button onClick={clearFilters}>Clear Filters</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProperties.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              categoryName={category.name}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
