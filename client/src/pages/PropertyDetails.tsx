import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Property, User, Category } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays } from "date-fns";
import { useWallet } from "@/contexts/WalletContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Star,
  MapPin,
  Calendar as CalendarIcon,
  Clock,
  Shield,
  FileText,
  User as UserIcon,
  ChevronRight,
  Wallet,
  Lock,
  Check,
  Loader2,
} from "lucide-react";

const PropertyDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { isConnected, walletAddress, userData, connect } = useWallet();
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 3));
  const [rentalDays, setRentalDays] = useState(3);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showRentalModal, setShowRentalModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [contractModalOpen, setContractModalOpen] = useState(false);
  const [contractDeployed, setContractDeployed] = useState(false);
  const [contractAddress, setContractAddress] = useState("");
  const [processingStep, setProcessingStep] = useState(0);
  
  // Fetch property details
  const { 
    data: property, 
    isLoading: loadingProperty,
    error
  } = useQuery<Property>({
    queryKey: [`/api/properties/${id}`],
  });
  
  // Fetch owner details if property is loaded
  const { 
    data: owner 
  } = useQuery<User>({
    queryKey: [`/api/users/${property?.ownerId}`],
    enabled: !!property?.ownerId
  });
  
  // Fetch categories
  const { 
    data: categories 
  } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  // Find the matching category for this property
  const category = categories?.find(c => c.id === property?.categoryId);
  
  // Update total price when start/end dates change
  useEffect(() => {
    if (property && startDate && endDate) {
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      setRentalDays(days);
      setTotalPrice(Number((days * (property.price || 0)).toFixed(3)));
    }
  }, [property, startDate, endDate]);
  
  const handleRentNow = () => {
    if (!isConnected) {
      connect();
      return;
    }
    
    setShowRentalModal(true);
  };
  
  const handleConfirmRental = async () => {
    if (!property || !userData) return;
    
    try {
      setIsProcessing(true);
      setProcessingStep(1);
      
      // Step 1: Create the rental
      const rentalData = {
        propertyId: property.id,
        renterId: userData.id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalPrice,
        securityDeposit: property.securityDeposit,
      };
      
      const rentalResponse = await apiRequest("POST", "/api/rentals", rentalData);
      const rentalResult = await rentalResponse.json();
      
      // Step 2: Generate a smart contract
      setProcessingStep(2);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate fake contract address
      const mockContractAddress = `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      
      const contractData = {
        contractAddress: mockContractAddress,
        rentalId: rentalResult.id,
        depositAmount: property.securityDeposit,
        rentalAmount: totalPrice,
      };
      
      const contractResponse = await apiRequest("POST", "/api/smart-contracts", contractData);
      const contractResult = await contractResponse.json();
      
      // Step 3: Deploy the smart contract
      setProcessingStep(3);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const deployResponse = await apiRequest("POST", `/api/smart-contracts/${contractResult.id}/deploy`, {});
      const deployResult = await deployResponse.json();
      
      setContractAddress(mockContractAddress);
      setShowRentalModal(false);
      setContractModalOpen(true);
      
      toast({
        title: "Rental Confirmed",
        description: "Your rental has been confirmed and the smart contract has been deployed.",
      });
    } catch (error) {
      console.error("Error processing rental:", error);
      toast({
        title: "Error",
        description: "There was an error processing your rental. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProcessingStep(0);
    }
  };
  
  const handleDeployContract = async () => {
    setContractDeployed(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setContractModalOpen(false);
    
    toast({
      title: "Contract Deployed",
      description: "Your smart contract has been successfully deployed to the blockchain.",
    });
  };
  
  if (loadingProperty) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="w-full h-[400px] rounded-xl" />
            <div className="mt-6">
              <Skeleton className="w-3/4 h-10 mb-4" />
              <Skeleton className="w-1/2 h-6 mb-2" />
              <Skeleton className="w-full h-32 mt-6" />
            </div>
          </div>
          <div>
            <Skeleton className="w-full h-[400px] rounded-xl" />
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
        <p className="text-muted-foreground mb-8">We couldn't find the property you're looking for.</p>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2">
            <div className="rounded-xl overflow-hidden">
              <img 
                src={property.imageUrl} 
                alt={property.title}
                className="w-full h-[400px] object-cover"
              />
            </div>
            
            <div className="mt-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold font-poppins">{property.title}</h1>
                  <div className="flex items-center mt-2 text-sm">
                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-muted-foreground">{property.location}</span>
                    <span className="mx-2 text-muted-foreground">•</span>
                    <div className="flex items-center text-accent">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1">{property.rating !== null ? property.rating.toFixed(2) : "0.00"}</span>
                    </div>
                    <span className="mx-2 text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{property.rentalCount} rentals</span>
                  </div>
                </div>
                
                <Badge variant="outline" className="text-sm">
                  {category?.name || "Property"}
                </Badge>
              </div>
              
              <div className="mt-6">
                <Tabs defaultValue="description">
                  <TabsList className="w-full">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="contract">Smart Contract</TabsTrigger>
                  </TabsList>
                  <TabsContent value="description" className="mt-4">
                    <p className="text-muted-foreground">{property.description}</p>
                    
                    <div className="mt-6 flex items-start">
                      <img 
                        src={owner?.profileImage || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"} 
                        alt={owner?.username || "Owner"} 
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <h3 className="font-semibold">Listed by {owner?.username || "Owner"}</h3>
                        <p className="text-sm text-muted-foreground">
                          {owner?.walletAddress ? `Wallet: ${owner.walletAddress.slice(0, 6)}...${owner.walletAddress.slice(-4)}` : "Property Owner"}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">{owner?.bio || "Blockchain property owner"}</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="features" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {property.features && property.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <Check className="h-5 w-5 text-secondary mr-2" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="contract" className="mt-4">
                    <div className="bg-background p-4 rounded-lg border border-border">
                      <h3 className="font-semibold mb-2">Smart Contract Information</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        This property is managed by a smart contract on the blockchain, providing secure 
                        and transparent rental transactions.
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm border-b border-border pb-2">
                          <span className="text-muted-foreground">Security Deposit</span>
                          <span className="font-medium">{property.securityDeposit} ETH</span>
                        </div>
                        <div className="flex justify-between text-sm border-b border-border pb-2">
                          <span className="text-muted-foreground">Daily Rate</span>
                          <span className="font-medium">{property.price} ETH</span>
                        </div>
                        <div className="flex justify-between text-sm border-b border-border pb-2">
                          <span className="text-muted-foreground">Contract Type</span>
                          <span className="font-medium">RentalAgreement</span>
                        </div>
                        <div className="flex justify-between text-sm border-b border-border pb-2">
                          <span className="text-muted-foreground">Payment Method</span>
                          <span className="font-medium">ETH</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Blockchain</span>
                          <span className="font-medium">Ethereum</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex items-start">
                        <Shield className="h-6 w-6 text-primary mr-3 mt-1" />
                        <div>
                          <h4 className="font-semibold">Security Guaranteed</h4>
                          <p className="text-sm text-muted-foreground">
                            Your rental is protected by smart contracts that automatically handle security deposits and 
                            payments, ensuring a trustless and secure transaction for both parties.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
          
          {/* Right Column - Booking Widget */}
          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-sm text-muted-foreground">Price</span>
                    <div className="text-2xl font-bold">{property.price} ETH <span className="text-muted-foreground text-sm">/day</span></div>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-accent fill-current" />
                    <span className="ml-1 font-medium">{property.rating !== null ? property.rating.toFixed(2) : "0.00"}</span>
                  </div>
                </div>
                
                <div className="border border-border rounded-lg p-4 mb-6">
                  <div className="flex text-sm font-medium mb-4">
                    <div className="w-1/2 border-r border-border pr-2">
                      <div className="text-muted-foreground mb-1">Start Date</div>
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {format(startDate, "MMM dd, yyyy")}
                      </div>
                    </div>
                    <div className="w-1/2 pl-2">
                      <div className="text-muted-foreground mb-1">End Date</div>
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {format(endDate, "MMM dd, yyyy")}
                      </div>
                    </div>
                  </div>
                  
                  <Calendar
                    mode="range"
                    selected={{
                      from: startDate,
                      to: endDate
                    }}
                    onSelect={(range) => {
                      if (range?.from) setStartDate(range.from);
                      if (range?.to) setEndDate(range.to);
                    }}
                    className="border border-border rounded-lg p-1"
                  />
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>{property.price} ETH x {rentalDays} days</span>
                    <span>{(property.price * rentalDays).toFixed(3)} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Security deposit</span>
                    <span>{property.securityDeposit} ETH</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-3 border-t border-border">
                    <span>Total</span>
                    <span>{(totalPrice + property.securityDeposit).toFixed(3)} ETH</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={handleRentNow}
                >
                  {isConnected ? "Rent Now" : "Connect Wallet to Rent"}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground mt-4">
                  You won't be charged yet. Your rental will be secured using a smart contract.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Rental Modal */}
      <Dialog open={showRentalModal} onOpenChange={setShowRentalModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Confirm Your Rental</DialogTitle>
            <DialogDescription>
              {isProcessing ? "Processing your rental transaction..." : "Review and confirm the rental details below."}
            </DialogDescription>
          </DialogHeader>
          
          {isProcessing ? (
            <div className="py-6">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="flex items-center space-x-8">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full ${processingStep >= 1 ? 'bg-primary' : 'bg-muted'} flex items-center justify-center`}>
                      {processingStep > 1 ? (
                        <Check className="h-5 w-5 text-white" />
                      ) : processingStep === 1 ? (
                        <Loader2 className="h-5 w-5 text-white animate-spin" />
                      ) : (
                        <span className="text-muted-foreground">1</span>
                      )}
                    </div>
                    <span className="text-sm mt-2">Create Rental</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full ${processingStep >= 2 ? 'bg-primary' : 'bg-muted'} flex items-center justify-center`}>
                      {processingStep > 2 ? (
                        <Check className="h-5 w-5 text-white" />
                      ) : processingStep === 2 ? (
                        <Loader2 className="h-5 w-5 text-white animate-spin" />
                      ) : (
                        <span className="text-muted-foreground">2</span>
                      )}
                    </div>
                    <span className="text-sm mt-2">Generate Contract</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full ${processingStep >= 3 ? 'bg-primary' : 'bg-muted'} flex items-center justify-center`}>
                      {processingStep > 3 ? (
                        <Check className="h-5 w-5 text-white" />
                      ) : processingStep === 3 ? (
                        <Loader2 className="h-5 w-5 text-white animate-spin" />
                      ) : (
                        <span className="text-muted-foreground">3</span>
                      )}
                    </div>
                    <span className="text-sm mt-2">Deploy Contract</span>
                  </div>
                </div>
                
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Please wait while we process your rental request. Do not close this window.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-[80px_1fr] items-center">
                  <span className="text-sm text-muted-foreground">Property:</span>
                  <span className="font-medium">{property.title}</span>
                </div>
                
                <div className="grid grid-cols-[80px_1fr] items-center">
                  <span className="text-sm text-muted-foreground">Dates:</span>
                  <span className="font-medium">
                    {format(startDate, "MMM dd, yyyy")} → {format(endDate, "MMM dd, yyyy")}
                  </span>
                </div>
                
                <div className="grid grid-cols-[80px_1fr] items-center">
                  <span className="text-sm text-muted-foreground">Duration:</span>
                  <span className="font-medium">{rentalDays} days</span>
                </div>
                
                <div className="grid grid-cols-[80px_1fr] items-center">
                  <span className="text-sm text-muted-foreground">Price:</span>
                  <span className="font-medium">{totalPrice.toFixed(3)} ETH</span>
                </div>
                
                <div className="grid grid-cols-[80px_1fr] items-center">
                  <span className="text-sm text-muted-foreground">Deposit:</span>
                  <span className="font-medium">{property.securityDeposit} ETH</span>
                </div>
                
                <div className="grid grid-cols-[80px_1fr] items-center">
                  <span className="text-sm text-muted-foreground">Total:</span>
                  <span className="font-medium font-poppins">{(totalPrice + property.securityDeposit).toFixed(3)} ETH</span>
                </div>
              </div>
              
              <div className="bg-muted/40 p-3 rounded-md">
                <p className="text-sm text-muted-foreground flex items-start">
                  <Shield className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
                  Your payment will be held in a secure smart contract until the rental period begins.
                </p>
              </div>
              
              <DialogFooter className="sm:justify-start">
                <Button 
                  type="button" 
                  variant="ghost"
                  onClick={() => setShowRentalModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="button"
                  onClick={handleConfirmRental}
                >
                  Confirm Rental
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Contract Deployed Modal */}
      <Dialog open={contractModalOpen} onOpenChange={setContractModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Smart Contract Created</DialogTitle>
            <DialogDescription>
              Your rental agreement has been encoded in a smart contract.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-primary/5 p-4 rounded-md border border-primary/20 mb-4">
              <p className="text-sm overflow-hidden overflow-ellipsis font-mono">
                Contract: {contractAddress}
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-[100px_1fr] items-center">
                <span className="text-sm text-muted-foreground">Property:</span>
                <span className="font-medium">{property.title}</span>
              </div>
              
              <div className="grid grid-cols-[100px_1fr] items-center">
                <span className="text-sm text-muted-foreground">Amount:</span>
                <span className="font-medium">{totalPrice.toFixed(3)} ETH</span>
              </div>
              
              <div className="grid grid-cols-[100px_1fr] items-center">
                <span className="text-sm text-muted-foreground">Deposit:</span>
                <span className="font-medium">{property.securityDeposit} ETH</span>
              </div>
              
              <div className="grid grid-cols-[100px_1fr] items-center">
                <span className="text-sm text-muted-foreground">Dates:</span>
                <span className="font-medium">
                  {format(startDate, "MMM dd, yyyy")} → {format(endDate, "MMM dd, yyyy")}
                </span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setContractModalOpen(false)}
            >
              Close
            </Button>
            <Button 
              type="button"
              className="w-full sm:w-auto flex items-center"
              onClick={handleDeployContract}
              disabled={contractDeployed}
            >
              {contractDeployed ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Deployed
                </>
              ) : (
                "Deploy Contract"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PropertyDetails;