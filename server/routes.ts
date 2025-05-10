import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertPropertySchema, 
  insertRentalSchema, 
  insertSmartContractSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  const apiRouter = app.route("/api");
  
  // Health check
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "ok" });
  });
  
  // User routes
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await storage.getUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't send password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
  
  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const newUser = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = newUser;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating user" });
    }
  });
  
  app.post("/api/users/connect-wallet", async (req: Request, res: Response) => {
    try {
      const { walletAddress } = req.body;
      
      if (!walletAddress) {
        return res.status(400).json({ message: "Wallet address is required" });
      }
      
      // Check if the wallet address is already associated with a user
      const existingUser = await storage.getUserByWalletAddress(walletAddress);
      
      if (existingUser) {
        const { password, ...userWithoutPassword } = existingUser;
        return res.json({ user: userWithoutPassword });
      }
      
      // For demo, create a new user with this wallet address
      const newUser = await storage.createUser({
        username: `user_${walletAddress.substring(0, 8)}`,
        password: "generated_password", // In a real app, this would be properly handled
        email: `wallet_${walletAddress.substring(0, 8)}@example.com`,
        walletAddress,
        profileImage: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50",
        bio: "Blockchain user"
      });
      
      const { password, ...userWithoutPassword } = newUser;
      res.status(201).json({ user: userWithoutPassword, isNewUser: true });
    } catch (error) {
      res.status(500).json({ message: "Error connecting wallet" });
    }
  });
  
  // Category routes
  app.get("/api/categories", async (req: Request, res: Response) => {
    const categories = await storage.getAllCategories();
    res.json(categories);
  });
  
  app.get("/api/categories/:slug", async (req: Request, res: Response) => {
    const { slug } = req.params;
    const category = await storage.getCategoryBySlug(slug);
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.json(category);
  });
  
  // Property routes
  app.get("/api/properties", async (req: Request, res: Response) => {
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
    const ownerId = req.query.ownerId ? parseInt(req.query.ownerId as string) : undefined;
    
    let properties;
    
    if (categoryId) {
      properties = await storage.getPropertiesByCategory(categoryId);
    } else if (ownerId) {
      properties = await storage.getPropertiesByOwner(ownerId);
    } else {
      properties = await storage.getAllProperties();
    }
    
    res.json(properties);
  });
  
  app.get("/api/properties/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid property ID" });
    }
    
    const property = await storage.getProperty(id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    
    res.json(property);
  });
  
  app.post("/api/properties", async (req: Request, res: Response) => {
    try {
      const propertyData = insertPropertySchema.parse(req.body);
      const newProperty = await storage.createProperty(propertyData);
      res.status(201).json(newProperty);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid property data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating property" });
    }
  });
  
  app.put("/api/properties/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }
      
      const propertyData = req.body;
      const updatedProperty = await storage.updateProperty(id, propertyData);
      
      if (!updatedProperty) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      res.json(updatedProperty);
    } catch (error) {
      res.status(500).json({ message: "Error updating property" });
    }
  });
  
  app.delete("/api/properties/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }
      
      const success = await storage.deleteProperty(id);
      
      if (!success) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting property" });
    }
  });
  
  // Rental routes
  app.get("/api/rentals", async (req: Request, res: Response) => {
    const renterId = req.query.renterId ? parseInt(req.query.renterId as string) : undefined;
    const propertyId = req.query.propertyId ? parseInt(req.query.propertyId as string) : undefined;
    
    let rentals;
    
    if (renterId) {
      rentals = await storage.getRentalsByRenter(renterId);
    } else if (propertyId) {
      rentals = await storage.getRentalsByProperty(propertyId);
    } else {
      return res.status(400).json({ message: "Either renterId or propertyId is required" });
    }
    
    res.json(rentals);
  });
  
  app.get("/api/rentals/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid rental ID" });
    }
    
    const rental = await storage.getRental(id);
    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }
    
    res.json(rental);
  });
  
  app.post("/api/rentals", async (req: Request, res: Response) => {
    try {
      const rentalData = insertRentalSchema.parse(req.body);
      
      // Validate that property exists
      const property = await storage.getProperty(rentalData.propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      // Validate that property is available
      if (!property.isAvailable) {
        return res.status(400).json({ message: "Property is not available for rent" });
      }
      
      const newRental = await storage.createRental(rentalData);
      
      // Temporarily mark property as unavailable
      await storage.updateProperty(property.id, { isAvailable: false });
      
      res.status(201).json(newRental);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid rental data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating rental" });
    }
  });
  
  app.patch("/api/rentals/:id/status", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid rental ID" });
      }
      
      const { status } = req.body;
      if (!status || !["pending", "active", "completed", "canceled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const updatedRental = await storage.updateRentalStatus(id, status);
      
      if (!updatedRental) {
        return res.status(404).json({ message: "Rental not found" });
      }
      
      // If rental is completed or canceled, make property available again
      if (status === "completed" || status === "canceled") {
        await storage.updateProperty(updatedRental.propertyId, { isAvailable: true });
      }
      
      res.json(updatedRental);
    } catch (error) {
      res.status(500).json({ message: "Error updating rental status" });
    }
  });
  
  // Smart Contract routes (mock)
  app.post("/api/smart-contracts", async (req: Request, res: Response) => {
    try {
      const contractData = insertSmartContractSchema.parse(req.body);
      
      // Validate that rental exists
      const rental = await storage.getRental(contractData.rentalId);
      if (!rental) {
        return res.status(404).json({ message: "Rental not found" });
      }
      
      // Check if a smart contract already exists for this rental
      const existingContract = await storage.getSmartContractByRental(contractData.rentalId);
      if (existingContract) {
        return res.status(400).json({ message: "Smart contract already exists for this rental" });
      }
      
      const newContract = await storage.createSmartContract(contractData);
      
      // Update rental with contract address
      await storage.updateRentalStatus(rental.id, "pending");
      
      res.status(201).json(newContract);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid smart contract data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating smart contract" });
    }
  });
  
  app.get("/api/smart-contracts/rental/:rentalId", async (req: Request, res: Response) => {
    const rentalId = parseInt(req.params.rentalId);
    if (isNaN(rentalId)) {
      return res.status(400).json({ message: "Invalid rental ID" });
    }
    
    const contract = await storage.getSmartContractByRental(rentalId);
    if (!contract) {
      return res.status(404).json({ message: "Smart contract not found" });
    }
    
    res.json(contract);
  });
  
  app.post("/api/smart-contracts/:id/deploy", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid smart contract ID" });
      }
      
      // Generate a fake transaction hash
      const txHash = `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      
      const deployedContract = await storage.deploySmartContract(id, txHash);
      
      if (!deployedContract) {
        return res.status(404).json({ message: "Smart contract not found" });
      }
      
      // Update rental status to active
      if (deployedContract.rentalId) {
        await storage.updateRentalStatus(deployedContract.rentalId, "active");
      }
      
      res.json({
        ...deployedContract,
        transactionHash: txHash
      });
    } catch (error) {
      res.status(500).json({ message: "Error deploying smart contract" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
