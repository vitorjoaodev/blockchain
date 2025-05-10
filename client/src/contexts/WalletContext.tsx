import { createContext, useContext, useState, ReactNode } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type WalletContextType = {
  isConnected: boolean;
  walletAddress: string | null;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  userData: any | null;
};

const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  walletAddress: null,
  connecting: false,
  connect: async () => {},
  disconnect: () => {},
  userData: null,
});

export const useWallet = () => useContext(WalletContext);

type WalletProviderProps = {
  children: ReactNode;
};

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const { toast } = useToast();

  const connect = async () => {
    try {
      setConnecting(true);
      
      // For demo purposes, generate a mock wallet address
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate random wallet address
      const randomAddr = `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      
      // Simulate backend API call to connect wallet
      const response = await apiRequest("POST", "/api/users/connect-wallet", {
        walletAddress: randomAddr
      });
      
      const data = await response.json();
      
      setIsConnected(true);
      setWalletAddress(randomAddr);
      setUserData(data.user);
      
      toast({
        title: "Wallet Connected",
        description: data.isNewUser 
          ? "New account created with your wallet" 
          : "Welcome back to RentChain!",
      });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to your wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setWalletAddress(null);
    setUserData(null);
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        walletAddress,
        connecting,
        connect,
        disconnect,
        userData,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
