import { useState } from "react";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { insertPropertySchema, Category } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import WalletModal from "@/components/WalletModal";
import { 
  Camera, 
  Plus, 
  Shield, 
  Image as ImageIcon, 
  Upload, 
  Tag, 
  MapPin, 
  Clock,
  AlertCircle,
  Loader2,
  Wallet,
  ChevronsRight,
  Check 
} from "lucide-react";

// Extend the insert schema with validation rules
const formSchema = insertPropertySchema.extend({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  imageUrl: z.string().url({ message: "Please enter a valid image URL" }),
  price: z.number().positive({ message: "Price must be greater than 0" }),
  securityDeposit: z.number().positive({ message: "Security deposit must be greater than 0" }),
  location: z.string().min(3, { message: "Location is required" }),
  categoryId: z.number({ required_error: "Please select a category" }),
  features: z.array(z.string()).min(1, { message: "Add at least one feature" }),
});

type FormValues = z.infer<typeof formSchema>;

const ListProperty = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { isConnected, connecting, connect } = useWallet();
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [currentFeature, setCurrentFeature] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Get categories for the select dropdown
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  // Sample image URLs for each category (for demo)
  const sampleImages = {
    1: [
      "https://pixabay.com/get/g96296e31bb4d95f3876162fdff9c8ac39323864fa1e35daa22dfb039f634a693bebd2a5608914264ad2b0f12a5fd843f4a8b7b7bfacde3d472be3dfd894bfa99_1280.jpg",
      "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    ],
    2: [
      "https://pixabay.com/get/g2e3f6eca009c283ee5f50e585ed8e50c908ab34f8d283e16ca0ccfad472cb2b79a1881f5bdabab281e31136b73e96d4b34995db3bae592c5b79e2b8e74fa12ee_1280.jpg",
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    ],
    3: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    ],
    4: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      "https://images.unsplash.com/photo-1542626991-cbc4e32524cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    ],
  };
  
  // Default form values
  const defaultValues: Partial<FormValues> = {
    title: "",
    description: "",
    imageUrl: "",
    price: 0.01,
    securityDeposit: 0.05,
    location: "",
    features: [],
    isAvailable: true,
  };
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  // Watch the categoryId to update sample images
  const watchCategoryId = form.watch("categoryId");
  
  // Add a new feature to the list
  const addFeature = () => {
    if (currentFeature.trim() === "") return;
    
    const currentFeatures = form.getValues("features") || [];
    form.setValue("features", [...currentFeatures, currentFeature.trim()]);
    setCurrentFeature("");
  };
  
  // Remove a feature from the list
  const removeFeature = (index: number) => {
    const currentFeatures = form.getValues("features") || [];
    form.setValue("features", currentFeatures.filter((_, i) => i !== index));
  };
  
  // Use a sample image
  const useSampleImage = (imageUrl: string) => {
    form.setValue("imageUrl", imageUrl);
  };
  
  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    if (!isConnected) {
      setWalletModalOpen(true);
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Get the connected user's ID
      const userId = 1; // Default to demo user for now
      
      // Submit the property
      const response = await apiRequest("POST", "/api/properties", {
        ...data,
        ownerId: userId,
      });
      
      if (response.ok) {
        // Show success state
        setShowSuccess(true);
        
        // Invalidate properties query to refresh the list
        queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
        
        // Wait 2 seconds then redirect to home
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create property");
      }
    } catch (error) {
      console.error("Error creating property:", error);
      toast({
        title: "Error",
        description: "Failed to create property listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Show connect wallet prompt if not connected
  if (!isConnected && !showSuccess) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <Card>
            <CardHeader>
              <CardTitle>Connect Your Wallet</CardTitle>
              <CardDescription>
                You need to connect your wallet to list a property on RentChain.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Wallet className="h-10 w-10 text-primary" />
              </div>
              <p className="text-muted-foreground mb-6">
                Connect your blockchain wallet to list your property, manage rentals, and receive payments securely.
              </p>
              <Button onClick={() => setWalletModalOpen(true)} className="w-full">
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <WalletModal open={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
      </div>
    );
  }
  
  // Show success state after submission
  if (showSuccess) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <Card>
            <CardHeader>
              <CardTitle>Property Listed Successfully!</CardTitle>
              <CardDescription>
                Your property has been successfully added to RentChain.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
                <Check className="h-10 w-10 text-secondary" />
              </div>
              <p className="text-muted-foreground mb-2">
                Your listing is now available for potential renters.
              </p>
              <p className="text-muted-foreground mb-6">
                You will be redirected to the homepage in a moment.
              </p>
              <Button onClick={() => navigate("/")} className="w-full">
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold font-poppins mb-2">List Your Property</h1>
          <p className="text-muted-foreground">
            Fill out the form below to list your property on RentChain and start earning crypto.
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Provide the basic details about your property
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter the title for your property" {...field} />
                      </FormControl>
                      <FormDescription>
                        Choose a descriptive title that highlights your property's best features.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your property in detail" 
                          className="min-h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Include details about features, condition, usage restrictions, etc.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-9" placeholder="City, State" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories?.map((category) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Property Image</CardTitle>
                <CardDescription>
                  Add an image of your property to attract renters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <ImageIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-9" placeholder="https://example.com/image.jpg" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Provide a direct link to an image of your property
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {form.getValues("imageUrl") && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                    <div className="relative h-40 bg-muted rounded-md overflow-hidden">
                      <img
                        src={form.getValues("imageUrl")}
                        alt="Property preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/400x200?text=Image+Not+Found";
                        }}
                      />
                    </div>
                  </div>
                )}
                
                {watchCategoryId && sampleImages[watchCategoryId as keyof typeof sampleImages] && (
                  <div className="mt-6">
                    <p className="text-sm font-medium mb-2">Sample Images:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {sampleImages[watchCategoryId as keyof typeof sampleImages].map((img, i) => (
                        <div 
                          key={i} 
                          className="relative h-24 bg-muted rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => useSampleImage(img)}
                        >
                          <img src={img} alt={`Sample ${i+1}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                            <Button size="sm" variant="secondary">
                              Use This
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Click on an image to use it for your listing
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Features</CardTitle>
                <CardDescription>
                  Set your rental rates and security deposit requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Daily Price (ETH)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-muted-foreground">ETH</span>
                            <Input 
                              type="number" 
                              step="0.001" 
                              min="0.001"
                              className="pl-12" 
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Set the daily rental price in ETH
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="securityDeposit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Security Deposit (ETH)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-muted-foreground">ETH</span>
                            <Input 
                              type="number" 
                              step="0.01" 
                              min="0.01"
                              className="pl-12" 
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Amount to be held in escrow as security deposit
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Separator />
                
                <div>
                  <FormLabel>Features</FormLabel>
                  <div className="flex items-center mt-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        placeholder="Add a feature (e.g. Electric, 4K Video, Premium Sound)"
                        value={currentFeature}
                        onChange={(e) => setCurrentFeature(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && currentFeature.trim() !== "") {
                            e.preventDefault();
                            addFeature();
                          }
                        }}
                      />
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="ml-2"
                      onClick={addFeature}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormDescription className="mt-2">
                    Add the key features of your property. Press Enter or click the + button to add.
                  </FormDescription>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {form.watch("features")?.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {feature}
                        <button
                          type="button"
                          className="ml-2 text-muted-foreground hover:text-foreground"
                          onClick={() => removeFeature(index)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                    
                    {(!form.watch("features") || form.watch("features").length === 0) && (
                      <p className="text-sm text-muted-foreground">No features added yet</p>
                    )}
                  </div>
                  
                  {form.formState.errors.features && (
                    <p className="text-sm font-medium text-destructive mt-2">
                      {form.formState.errors.features.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Smart Contract Information</CardTitle>
                <CardDescription>
                  Your property will be managed by a secure blockchain smart contract
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 mb-6">
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-primary mr-3 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Blockchain Security</h3>
                      <p className="text-sm text-muted-foreground">
                        Your property will be backed by a smart contract that automatically:
                      </p>
                      <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc pl-5">
                        <li>Securely manages security deposits</li>
                        <li>Enforces rental agreements</li>
                        <li>Processes payments transparently</li>
                        <li>Creates immutable records of all transactions</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded-lg border font-mono text-sm overflow-x-auto">
                  <pre>
{`contract RentalAgreement {
  address payable public owner = ${isConnected ? "YOUR_ADDRESS" : "0x0000000"};
  uint public dailyRate = ${form.watch("price") || "0.01"} ETH;
  uint public securityDeposit = ${form.watch("securityDeposit") || "0.05"} ETH;
  bool public isAvailable = true;
  // Smart contract logic...
}`}
                  </pre>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" type="button" onClick={() => navigate("/")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      List Property
                      <ChevronsRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ListProperty;
