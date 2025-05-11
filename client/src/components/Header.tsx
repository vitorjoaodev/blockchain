import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import WalletModal from "@/components/WalletModal";
import { Menu, X, Wallet } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const { isConnected, walletAddress, disconnect, userData } = useWallet();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const openWalletModal = () => {
    setWalletModalOpen(true);
  };
  
  const closeWalletModal = () => {
    setWalletModalOpen(false);
  };
  
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <svg className="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span className="ml-2 text-xl font-bold font-poppins text-foreground">RentChain</span>
          </Link>
          <nav className="hidden md:flex ml-10 space-x-8">
            <Link href="/" className={`${location === '/' ? 'text-primary' : 'text-foreground'} hover:text-primary font-medium`}>
              Home
            </Link>
            <Link href="/properties" className={`${location === '/properties' ? 'text-primary' : 'text-foreground'} hover:text-primary font-medium`}>
              Propriedades
            </Link>
            <Link href="/list-property" className={`${location === '/list-property' ? 'text-primary' : 'text-foreground'} hover:text-primary font-medium`}>
              Anunciar
            </Link>
            <Link href="/how-it-works" className={`${location === '/how-it-works' ? 'text-primary' : 'text-foreground'} hover:text-primary font-medium`}>
              Como Funciona
            </Link>
            <Link href="/my-rentals" className={`${location === '/my-rentals' ? 'text-primary' : 'text-foreground'} hover:text-primary font-medium`}>
              Meus Aluguéis
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          {!isConnected ? (
            <Button 
              variant="outline" 
              className="hidden md:flex items-center space-x-2 border-primary text-primary hover:bg-primary hover:text-white"
              onClick={openWalletModal}
            >
              <Wallet className="h-5 w-5" />
              <span>Connect Wallet</span>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2 px-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userData?.profileImage} alt="User" />
                    <AvatarFallback>{userData?.username?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden sm:inline">{walletAddress ? truncateAddress(walletAddress) : ""}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="font-medium">{userData?.username || "User"}</DropdownMenuItem>
                <DropdownMenuItem className="text-xs text-muted-foreground break-all px-2">
                  {walletAddress}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/my-properties" className="cursor-pointer">My Properties</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/my-rentals" className="cursor-pointer">My Rentals</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={disconnect} className="text-destructive focus:text-destructive cursor-pointer">
                  Disconnect Wallet
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted">
              Home
            </Link>
            <Link href="/properties" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted">
              Propriedades
            </Link>
            <Link href="/list-property" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted">
              Anunciar
            </Link>
            <Link href="/how-it-works" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted">
              Como Funciona
            </Link>
            <Link href="/my-rentals" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted">
              Meus Aluguéis
            </Link>
            {!isConnected && (
              <Button 
                variant="default" 
                className="mt-3 w-full flex items-center justify-center"
                onClick={openWalletModal}
              >
                <Wallet className="mr-2 h-5 w-5" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      )}
      
      <WalletModal open={walletModalOpen} onClose={closeWalletModal} />
    </header>
  );
};

export default Header;
