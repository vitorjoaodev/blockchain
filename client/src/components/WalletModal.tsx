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
              <div className="w-10 h-10 rounded-full bg-[#F6851B] metamask-glow flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.4791 2L13.0703 8.28003L14.5195 4.50922L21.4791 2Z" fill="white"/>
                  <path d="M2.52148 2L10.8555 8.35238L9.48047 4.50921L2.52148 2Z" fill="white"/>
                  <path d="M18.5508 16.4906L16.3594 19.8619L21.0234 21.1478L22.3594 16.5725L18.5508 16.4906Z" fill="white"/>
                  <path d="M1.64844 16.5725L2.97656 21.1478L7.64062 19.8619L5.45312 16.4906L1.64844 16.5725Z" fill="white"/>
                  <path d="M7.40625 10.6175L6.17188 12.6706L10.793 12.8932L10.6367 7.87695L7.40625 10.6175Z" fill="white"/>
                  <path d="M16.5937 10.6175L13.3047 7.80457L13.207 12.8932L17.8281 12.6706L16.5937 10.6175Z" fill="white"/>
                  <path d="M7.64062 19.8619L10.5156 18.4942L8.03125 16.6134L7.64062 19.8619Z" fill="white"/>
                  <path d="M13.4844 18.4942L16.3594 19.8619L15.9687 16.6134L13.4844 18.4942Z" fill="white"/>
                </svg>
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
              <div className="w-10 h-10 rounded-full bg-[#3B99FC] flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
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
