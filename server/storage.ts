import { 
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  properties, type Property, type InsertProperty,
  rentals, type Rental, type InsertRental,
  smartContracts, type SmartContract, type InsertSmartContract
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByWalletAddress(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Categories
  getAllCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  incrementCategoryCount(id: number): Promise<void>;
  
  // Properties
  getAllProperties(): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  getPropertiesByCategory(categoryId: number): Promise<Property[]>;
  getPropertiesByOwner(ownerId: number): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, property: Partial<Property>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;
  
  // Rentals
  getRental(id: number): Promise<Rental | undefined>;
  getRentalsByRenter(renterId: number): Promise<Rental[]>;
  getRentalsByProperty(propertyId: number): Promise<Rental[]>;
  createRental(rental: InsertRental): Promise<Rental>;
  updateRentalStatus(id: number, status: string): Promise<Rental | undefined>;
  
  // Smart Contracts (mock)
  createSmartContract(contract: InsertSmartContract): Promise<SmartContract>;
  getSmartContractByRental(rentalId: number): Promise<SmartContract | undefined>;
  deploySmartContract(id: number, deploymentHash: string): Promise<SmartContract | undefined>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private properties: Map<number, Property>;
  private rentals: Map<number, Rental>;
  private smartContracts: Map<number, SmartContract>;
  
  private userId: number;
  private categoryId: number;
  private propertyId: number;
  private rentalId: number;
  private smartContractId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.properties = new Map();
    this.rentals = new Map();
    this.smartContracts = new Map();
    
    this.userId = 1;
    this.categoryId = 1;
    this.propertyId = 1;
    this.rentalId = 1;
    this.smartContractId = 1;
    
    // Initialize with default categories
    this.initializeData();
  }

  private initializeData() {
    // Add default categories
    const categories: InsertCategory[] = [
      {
        name: "Cars",
        description: "Luxury and everyday vehicles available for rent",
        imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        slug: "cars"
      },
      {
        name: "Drones",
        description: "Professional and recreational drones for aerial photography",
        imageUrl: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        slug: "drones"
      },
      {
        name: "Real Estate",
        description: "Properties and spaces for short-term rentals",
        imageUrl: "https://images.unsplash.com/photo-1460317442991-0ec209397118?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        slug: "real-estate"
      },
      {
        name: "Equipment",
        description: "Professional tools and equipment for rent",
        imageUrl: "https://images.unsplash.com/photo-1542626991-cbc4e32524cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        slug: "equipment"
      }
    ];
    
    categories.forEach(category => {
      this.createCategory(category);
    });
    
    // Create a demo user
    this.createUser({
      username: "demo_user",
      password: "password123",
      email: "demo@rentchain.com",
      walletAddress: "0x71C98b5814FCb4500fF99E89a580F250F31bc8F3D",
      profileImage: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50",
      bio: "Property owner and blockchain enthusiast"
    });
    
    // Add sample properties
    const properties: InsertProperty[] = [
      {
        title: "Tesla Model S",
        description: "Luxury electric sedan with autopilot features and long range battery",
        imageUrl: "https://pixabay.com/get/g96296e31bb4d95f3876162fdff9c8ac39323864fa1e35daa22dfb039f634a693bebd2a5608914264ad2b0f12a5fd843f4a8b7b7bfacde3d472be3dfd894bfa99_1280.jpg",
        price: 0.015,
        securityDeposit: 0.1,
        location: "San Francisco, CA",
        ownerId: 1,
        categoryId: 1,
        rating: 4.92,
        rentalCount: 24,
        features: ["Electric", "Autopilot", "500mi Range", "Premium Interior"],
        isAvailable: true
      },
      {
        title: "DJI Mavic Pro",
        description: "Professional drone with 4K camera, obstacle avoidance, and 27-minute flight time",
        imageUrl: "https://pixabay.com/get/g2e3f6eca009c283ee5f50e585ed8e50c908ab34f8d283e16ca0ccfad472cb2b79a1881f5bdabab281e31136b73e96d4b34995db3bae592c5b79e2b8e74fa12ee_1280.jpg",
        price: 0.007,
        securityDeposit: 0.05,
        location: "Los Angeles, CA",
        ownerId: 1,
        categoryId: 2,
        rating: 4.85,
        rentalCount: 41,
        features: ["4K Video", "27min Flight Time", "Obstacle Avoidance"],
        isAvailable: true
      },
      {
        title: "Luxury Downtown Apt",
        description: "Modern 2-bedroom apartment in downtown with city views and premium amenities",
        imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        price: 0.05,
        securityDeposit: 0.2,
        location: "New York, NY",
        ownerId: 1,
        categoryId: 3,
        rating: 4.97,
        rentalCount: 16,
        features: ["2 Bedrooms", "City View", "Gym Access", "Pool"],
        isAvailable: true
      },
      {
        title: "Sony A7 III Kit",
        description: "Professional mirrorless camera with multiple lenses and accessories",
        imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        price: 0.01,
        securityDeposit: 0.08,
        location: "Seattle, WA",
        ownerId: 1,
        categoryId: 4,
        rating: 4.89,
        rentalCount: 52,
        features: ["Full Frame", "4K Video", "Multiple Lenses", "Carrying Case"],
        isAvailable: true
      },
      {
        title: "BMW i8",
        description: "Hybrid sports car with futuristic design and impressive performance",
        imageUrl: "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        price: 0.02,
        securityDeposit: 0.15,
        location: "Miami, FL",
        ownerId: 1,
        categoryId: 1,
        rating: 4.94,
        rentalCount: 18,
        features: ["Hybrid", "Sports Car", "Butterfly Doors", "Premium Sound"],
        isAvailable: true
      },
      {
        title: "Beachfront Villa",
        description: "Stunning beachfront property with private access and panoramic ocean views",
        imageUrl: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        price: 0.08,
        securityDeposit: 0.25,
        location: "Malibu, CA",
        ownerId: 1,
        categoryId: 3,
        rating: 4.99,
        rentalCount: 12,
        features: ["Beachfront", "4 Bedrooms", "Private Pool", "Home Theater"],
        isAvailable: true
      }
    ];
    
    properties.forEach(property => {
      this.createProperty(property);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.walletAddress === walletAddress
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug
    );
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const category: Category = { ...insertCategory, id, listingCount: 0 };
    this.categories.set(id, category);
    return category;
  }
  
  async incrementCategoryCount(id: number): Promise<void> {
    const category = this.categories.get(id);
    if (category) {
      category.listingCount = (category.listingCount || 0) + 1;
      this.categories.set(id, category);
    }
  }

  // Property methods
  async getAllProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }
  
  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }
  
  async getPropertiesByCategory(categoryId: number): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      (property) => property.categoryId === categoryId
    );
  }
  
  async getPropertiesByOwner(ownerId: number): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      (property) => property.ownerId === ownerId
    );
  }
  
  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.propertyId++;
    const createdAt = new Date();
    const property: Property = { 
      ...insertProperty, 
      id, 
      rating: insertProperty.rating || 0,
      rentalCount: insertProperty.rentalCount || 0,
      createdAt 
    };
    this.properties.set(id, property);
    
    // Increment category listing count
    await this.incrementCategoryCount(property.categoryId);
    
    return property;
  }
  
  async updateProperty(id: number, propertyUpdate: Partial<Property>): Promise<Property | undefined> {
    const property = this.properties.get(id);
    if (!property) return undefined;
    
    const updatedProperty = { ...property, ...propertyUpdate };
    this.properties.set(id, updatedProperty);
    return updatedProperty;
  }
  
  async deleteProperty(id: number): Promise<boolean> {
    return this.properties.delete(id);
  }

  // Rental methods
  async getRental(id: number): Promise<Rental | undefined> {
    return this.rentals.get(id);
  }
  
  async getRentalsByRenter(renterId: number): Promise<Rental[]> {
    return Array.from(this.rentals.values()).filter(
      (rental) => rental.renterId === renterId
    );
  }
  
  async getRentalsByProperty(propertyId: number): Promise<Rental[]> {
    return Array.from(this.rentals.values()).filter(
      (rental) => rental.propertyId === propertyId
    );
  }
  
  async createRental(insertRental: InsertRental): Promise<Rental> {
    const id = this.rentalId++;
    const createdAt = new Date();
    const rental: Rental = { 
      ...insertRental, 
      id, 
      status: "pending",
      transactionHash: "",
      contractAddress: "",
      smartContractId: "",
      createdAt 
    };
    this.rentals.set(id, rental);
    
    // Update property rental count
    const property = this.properties.get(rental.propertyId);
    if (property) {
      property.rentalCount = (property.rentalCount || 0) + 1;
      this.properties.set(property.id, property);
    }
    
    return rental;
  }
  
  async updateRentalStatus(id: number, status: string): Promise<Rental | undefined> {
    const rental = this.rentals.get(id);
    if (!rental) return undefined;
    
    rental.status = status;
    this.rentals.set(id, rental);
    return rental;
  }

  // Smart Contract methods (mock)
  async createSmartContract(insertContract: InsertSmartContract): Promise<SmartContract> {
    const id = this.smartContractId++;
    const createdAt = new Date();
    const contract: SmartContract = { 
      ...insertContract, 
      id, 
      isDeployed: false,
      deploymentHash: "",
      createdAt 
    };
    this.smartContracts.set(id, contract);
    
    // Update rental with smart contract ID
    const rental = this.rentals.get(insertContract.rentalId);
    if (rental) {
      rental.smartContractId = id.toString();
      rental.contractAddress = insertContract.contractAddress;
      this.rentals.set(rental.id, rental);
    }
    
    return contract;
  }
  
  async getSmartContractByRental(rentalId: number): Promise<SmartContract | undefined> {
    return Array.from(this.smartContracts.values()).find(
      (contract) => contract.rentalId === rentalId
    );
  }
  
  async deploySmartContract(id: number, deploymentHash: string): Promise<SmartContract | undefined> {
    const contract = this.smartContracts.get(id);
    if (!contract) return undefined;
    
    contract.isDeployed = true;
    contract.deploymentHash = deploymentHash;
    this.smartContracts.set(id, contract);
    
    return contract;
  }
}

export const storage = new MemStorage();
