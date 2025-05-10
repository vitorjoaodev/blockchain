import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Property, Category } from "@shared/schema";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield, Search, Lock, Check, ArrowRight, Star, MapPin, Wallet, Upload, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Home = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
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
  
  // Filter properties by category if selected
  const filteredProperties = selectedCategory === "all" 
    ? properties 
    : properties?.filter(property => {
      const category = categories?.find(c => c.id === property.categoryId);
      return category?.slug === selectedCategory;
    });
  
  // Get category name by ID
  const getCategoryName = (categoryId: number): string => {
    return categories?.find(c => c.id === categoryId)?.name || "";
  };
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/90 to-primary">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1502810365585-56ffa361fdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600')" }}></div>
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-poppins leading-tight">
              Decentralized Rentals with<br />Blockchain Security
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Rent cars, drones, real estate, and equipment with the security of smart contracts and automated deposit management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#rentals">
                <Button size="lg" variant="default" className="bg-white text-primary hover:bg-white/90">
                  Browse Rentals
                </Button>
              </Link>
              <Link href="/list-property">
                <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white/10">
                  List Your Property
                </Button>
              </Link>
            </div>
            
            <div className="mt-12 flex items-center">
              <div className="flex -space-x-2">
                <img className="w-10 h-10 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" alt="User" />
              </div>
              <div className="ml-4 text-white">
                <p className="text-sm font-medium">Trusted by 2,500+ users worldwide</p>
                <div className="flex items-center mt-1">
                  <div className="flex">
                    <Star className="h-4 w-4 text-accent fill-current" />
                    <Star className="h-4 w-4 text-accent fill-current" />
                    <Star className="h-4 w-4 text-accent fill-current" />
                    <Star className="h-4 w-4 text-accent fill-current" />
                    <Star className="h-4 w-4 text-accent fill-current" />
                  </div>
                  <span className="ml-1 text-sm">4.8/5 rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-poppins text-foreground mb-2">How RentChain Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Secure, transparent and efficient property rentals powered by blockchain technology</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Wallet className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3 font-poppins">Connect Your Wallet</h3>
              <p className="text-muted-foreground">Connect your cryptocurrency wallet to securely access the RentChain platform with your blockchain identity.</p>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-6">
                <Search className="text-secondary h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3 font-poppins">Find & Book Properties</h3>
              <p className="text-muted-foreground">Browse available rentals, from cars to real estate, and book them with automatic smart contract execution.</p>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                <Lock className="text-accent h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3 font-poppins">Secure & Automated</h3>
              <p className="text-muted-foreground">Enjoy automated security deposit management with blockchain-based verification for frictionless transactions.</p>
            </div>
          </div>
          
          {/* Blockchain Illustration */}
          <div className="mt-16 p-8 bg-background rounded-2xl shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <h3 className="text-2xl font-bold font-poppins mb-4">Blockchain-Powered Security</h3>
                <p className="text-muted-foreground mb-6">RentChain uses smart contracts to automate and secure every rental transaction, eliminating the need for intermediaries and reducing costs.</p>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Secure Deposits</h4>
                      <p className="text-sm text-muted-foreground">Automated escrow system ensures fair deposit management</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold">Smart Contracts</h4>
                      <p className="text-sm text-muted-foreground">Self-executing contracts with rental terms</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <RefreshCw className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Immutable Records</h4>
                      <p className="text-sm text-muted-foreground">Transparent history of all rental transactions</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <img src="https://images.unsplash.com/photo-1639762681057-408e52192e55?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" alt="Blockchain technology illustration" className="rounded-xl shadow-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Category Selector */}
      <section id="rentals" className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold font-poppins text-foreground mb-8">Explore Rental Categories</h2>
          
          {loadingCategories ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <Skeleton className="h-32 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-24 mb-2" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories?.map((category) => (
                <div 
                  key={category.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedCategory(category.slug)}
                >
                  <div 
                    className="h-32 bg-cover bg-center" 
                    style={{ backgroundImage: `url('${category.imageUrl}')` }}
                  ></div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold font-poppins">{category.name}</h3>
                      <span className="text-sm text-muted-foreground">{category.listingCount} listings</span>
                    </div>
                    <div className="mt-2 flex items-center text-primary group-hover:translate-x-2 transition-transform duration-200">
                      <span className="text-sm font-medium">View all</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Featured Listings */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold font-poppins text-foreground">Featured Rentals</h2>
            <div className="flex items-center">
              <div className="relative mr-4">
                <select 
                  className="appearance-none bg-background border border-border rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories?.map(category => (
                    <option key={category.id} value={category.slug}>{category.name}</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <Link href="/properties" className="text-primary font-medium hover:underline flex items-center">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
          
          {loadingProperties ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProperties?.slice(0, 4).map(property => (
                <PropertyCard 
                  key={property.id} 
                  property={property} 
                  categoryName={getCategoryName(property.categoryId)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Smart Contract Benefits */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-poppins text-foreground mb-4">Smart Contract Powered Rentals</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Revolutionary technology that makes rental transactions secure, transparent, and efficient.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Smart Contract Illustration */}
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-xl shadow-md p-6 relative overflow-hidden">
                <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" alt="Smart contract visualization" className="w-full h-auto rounded-lg" />
                
                <div className="mt-6 p-4 bg-background rounded-lg border border-border">
                  <h4 className="font-semibold mb-2 font-poppins">Example Smart Contract</h4>
                  <div className="bg-[#2c3e50] rounded-md p-3 text-white text-sm font-mono overflow-x-auto">
                    <pre>
contract RentalAgreement {"{"}
  address payable public owner;
  address payable public renter;
  uint public securityDeposit;
  uint public rentalFee;
  // ...rental logic...
{"}"}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Benefits */}
            <div className="order-1 lg:order-2">
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mr-4">
                    <Shield className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 font-poppins">Secure Deposits</h3>
                    <p className="text-muted-foreground">Security deposits are held in escrow by smart contracts, not by individuals or companies. They're automatically released when rental conditions are fulfilled.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mr-4">
                    <svg className="text-secondary h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 font-poppins">No Intermediaries</h3>
                    <p className="text-muted-foreground">Direct peer-to-peer transactions without middlemen means lower fees and faster processing. Deal directly with property owners.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mr-4">
                    <svg className="text-accent h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 font-poppins">Automated Execution</h3>
                    <p className="text-muted-foreground">Smart contracts automatically execute payment releases and rental agreements based on predefined conditions, eliminating payment disputes.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mr-4">
                    <RefreshCw className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 font-poppins">Immutable Records</h3>
                    <p className="text-muted-foreground">All rental agreements and transactions are stored on the blockchain, providing an immutable record that can't be altered or disputed.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* List Your Property CTA */}
      <section id="list-property" className="py-16 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">Start Earning With Your Property</h2>
            <p className="text-xl text-white/80 mb-8">List your cars, drones, real estate, or equipment on RentChain and start earning cryptocurrency today with secure, automated transactions.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <Upload className="text-white h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold mb-2">List Your Property</h3>
                <p className="text-white/80">Create detailed listings with photos and rental terms in minutes.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <Wallet className="text-white h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Set Your Rates</h3>
                <p className="text-white/80">Define your rental rates and security deposit requirements in cryptocurrency.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="text-white h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm1-11h-2v4h-4v2h4v4h2v-4h4v-2h-4V9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Earn Crypto</h3>
                <p className="text-white/80">Get paid automatically when rentals complete with our smart contracts.</p>
              </div>
            </div>
            
            <Link href="/list-property">
              <Button size="lg" className="px-8 py-7 bg-white text-primary font-bold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                List Your Property Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-poppins text-foreground mb-2">What Our Users Say</h2>
            <p className="text-lg text-muted-foreground">Hear from property owners and renters using our platform</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-background rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80" alt="Michael Thompson" className="w-12 h-12 rounded-full object-cover" />
                <div className="ml-4">
                  <h4 className="font-semibold font-poppins">Michael Thompson</h4>
                  <div className="flex text-accent">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground">"As a car owner, I was hesitant about renting my Tesla through a blockchain platform, but RentChain made it incredibly simple. The security deposit was handled automatically, and I've earned more crypto than I expected."</p>
              <p className="mt-4 text-sm text-primary">Car Owner • San Francisco</p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-background rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80" alt="Sarah Johnson" className="w-12 h-12 rounded-full object-cover" />
                <div className="ml-4">
                  <h4 className="font-semibold font-poppins">Sarah Johnson</h4>
                  <div className="flex text-accent">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground">"I needed a drone for a weekend photography project and was amazed by how quick and secure the rental process was. No paperwork, no waiting for approval - just a simple blockchain transaction and I was ready to go."</p>
              <p className="mt-4 text-sm text-primary">Drone Renter • Los Angeles</p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-background rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80" alt="David Chen" className="w-12 h-12 rounded-full object-cover" />
                <div className="ml-4">
                  <h4 className="font-semibold font-poppins">David Chen</h4>
                  <div className="flex text-accent">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground">"I've been listing my vacation property on RentChain for six months now. The automatic security deposit handling gives me peace of mind, and I love that the payment is instantaneous when guests check out."</p>
              <p className="mt-4 text-sm text-primary">Property Owner • Miami</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
