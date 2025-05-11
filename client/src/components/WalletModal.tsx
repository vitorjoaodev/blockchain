import { useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { X } from "lucide-react";
import MetaMaskLogo from "@assets/apple-touch-icon.png";
import CoinbaseLogo from "@assets/images (3).png";

type WalletModalProps = {
  open: boolean;
  onClose: () => void;
};

const WalletModal = ({ open, onClose }: WalletModalProps) => {
  const { connect, connecting, isConnected } = useWallet();
  
  // Close modal if wallet gets connected
  useEffect(() => {
    if (isConnected && open) {
      onClose();
    }
  }, [isConnected, open, onClose]);
  
  const handleConnect = async (walletType: string) => {
    await connect();
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold font-poppins">Connect Your Wallet</DialogTitle>
          <DialogDescription>
            Connect your cryptocurrency wallet to access RentChain's decentralized rental platform.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          <Button 
            variant="outline" 
            disabled={connecting}
            onClick={() => handleConnect("metamask")}
            className="w-full flex items-center justify-between p-6 hover:bg-muted"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                <img src={MetaMaskLogo} alt="MetaMask" className="w-full h-full object-cover" />
              </div>
              <span className="font-medium">MetaMask</span>
            </div>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Button>
          
          <Button 
            variant="outline" 
            disabled={connecting}
            onClick={() => handleConnect("coinbase")}
            className="w-full flex items-center justify-between p-6 hover:bg-muted"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-[#0052FF] mr-3">
                <img src={CoinbaseLogo} alt="Coinbase" className="w-full h-full object-cover" />
              </div>
              <span className="font-medium">Coinbase Wallet</span>
            </div>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Button>
          
          <Button 
            variant="outline" 
            disabled={connecting}
            onClick={() => handleConnect("walletconnect")}
            className="w-full flex items-center justify-between p-6 hover:bg-muted"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#0052FF] flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 10-5.656-5.656l-1.1 1.1"></path>
                </svg>
              </div>
              <span className="font-medium">WalletConnect</span>
            </div>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Button>
        </div>
        
        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">New to blockchain wallets?</p>
          <a href="#" className="text-primary font-medium hover:underline">Learn how to setup a wallet</a>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletModal;
