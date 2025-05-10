import { Link } from "wouter";
import { Property } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Heart } from "lucide-react";

type PropertyCardProps = {
  property: Property;
  categoryName?: string;
};

const PropertyCard = ({ property, categoryName }: PropertyCardProps) => {
  const {
    id,
    title,
    imageUrl,
    price,
    location,
    rating,
    rentalCount,
    features,
    categoryId
  } = property;
  
  // Get first feature to display as a highlight badge
  const primaryFeature = features && features.length > 0 ? features[0] : null;
  
  // Determine badge color based on feature or category
  const getBadgeVariant = (): "default" | "secondary" | "outline" => {
    if (primaryFeature?.toLowerCase().includes("electric")) return "secondary";
    if (primaryFeature?.toLowerCase().includes("4k")) return "outline";
    if (categoryId === 1) return "default"; // Cars
    if (categoryId === 2) return "outline"; // Drones
    if (categoryId === 3) return "default"; // Real Estate
    if (categoryId === 4) return "secondary"; // Equipment
    return "default";
  };
  
  return (
    <Card className="property-card overflow-hidden h-full flex flex-col">
      <div className="relative">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-0 right-0 m-4">
          <Badge variant="secondary" className="bg-black/60 text-white hover:bg-black/70">
            {categoryName || (categoryId === 1 ? "Cars" : categoryId === 2 ? "Drones" : categoryId === 3 ? "Real Estate" : "Equipment")}
          </Badge>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-0 right-0 m-2 text-white hover:text-accent"
        >
          <Heart className="h-5 w-5" />
        </Button>
      </div>
      
      <CardContent className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg font-poppins">{title}</h3>
          {primaryFeature && (
            <Badge variant={getBadgeVariant()} className="flex items-center space-x-1">
              {primaryFeature}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center mt-2 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          <span>{location}</span>
        </div>
        
        <div className="flex items-center mt-1 text-sm">
          <div className="flex items-center text-accent">
            <Star className="fill-current h-3.5 w-3.5" />
            <span className="ml-1">{rating?.toFixed(2)}</span>
          </div>
          <span className="mx-1 text-muted-foreground">•</span>
          <span className="text-muted-foreground">{rentalCount} rentals</span>
        </div>
        
        <div className="border-t border-border mt-3 pt-3 flex justify-between items-center mt-auto">
          <div>
            <span className="text-xs text-muted-foreground">Price</span>
            <div className="font-semibold">{price} ETH <span className="text-muted-foreground text-sm">/day</span></div>
          </div>
          <Link href={`/properties/${id}`}>
            <Button size="sm">Rent Now</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
