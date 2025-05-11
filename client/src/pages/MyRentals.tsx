import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Property, Rental, Category } from "@shared/schema";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon, HomeIcon, AlertCircle } from "lucide-react";
import WalletModal from "@/components/WalletModal";

const MyRentals = () => {
  const { isConnected, connect, walletAddress, userData } = useWallet();
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  // Fetch rentals
  const { 
    data: rentals, 
    isLoading: loadingRentals,
    refetch: refetchRentals
  } = useQuery<Rental[]>({
    queryKey: ["/api/rentals"],
    enabled: !!userData?.id
  });

  // Fetch properties
  const { 
    data: properties, 
    isLoading: loadingProperties 
  } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  // Fetch categories
  const { 
    data: categories 
  } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Connect wallet if needed
  const handleConnect = async () => {
    if (!isConnected) {
      setWalletModalOpen(true);
    }
  };

  // Function to get property details by id
  const getPropertyDetails = (propertyId: number) => {
    return properties?.find(p => p.id === propertyId);
  };

  // Function to get category name
  const getCategoryName = (categoryId: number): string => {
    return categories?.find(c => c.id === categoryId)?.name || "Categoria";
  };

  // Filter rentals by status
  const activeRentals = rentals?.filter(rental => rental.status === "active" || rental.status === "pending");
  const pastRentals = rentals?.filter(rental => rental.status === "completed" || rental.status === "cancelled");

  // Helper function to format date
  const formatDate = (date: string | Date) => {
    return format(new Date(date), 'dd/MM/yyyy');
  };

  // Helper function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Helper function to get status display name
  const getStatusName = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'pending':
        return 'Pendente';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  // Show wallet modal if not connected
  useEffect(() => {
    if (!isConnected) {
      setWalletModalOpen(true);
    }
  }, [isConnected]);

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Wallet Modal */}
      <WalletModal open={walletModalOpen} onClose={() => setWalletModalOpen(false)} />

      {/* Hero Section */}
      <section className="bg-primary/10 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold font-poppins mb-6">Meus Aluguéis</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mb-6">
            Gerencie todos os seus aluguéis ativos e passados em um só lugar.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {!isConnected ? (
            <div className="bg-white rounded-lg shadow-sm border border-border p-8 text-center">
              <AlertCircle className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-4">Conecte sua carteira para ver seus aluguéis</h2>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Para acessar seus aluguéis e gerenciar suas propriedades, você precisa conectar sua carteira digital.
              </p>
              <Button size="lg" onClick={handleConnect}>
                Conectar Carteira
              </Button>
            </div>
          ) : (
            <>
              {loadingRentals ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                      <CardHeader>
                        <Skeleton className="h-8 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col md:flex-row md:space-x-4">
                          <Skeleton className="h-32 w-full md:w-48 mb-4 md:mb-0" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-6 w-1/3" />
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-4 w-1/2" />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Skeleton className="h-10 w-32" />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <>
                  {(!rentals || rentals.length === 0) ? (
                    <div className="bg-white rounded-lg shadow-sm border border-border p-8 text-center">
                      <HomeIcon className="w-16 h-16 text-primary mx-auto mb-4" />
                      <h2 className="text-2xl font-semibold mb-4">Você ainda não tem aluguéis</h2>
                      <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                        Comece a explorar propriedades disponíveis para encontrar algo para alugar.
                      </p>
                      <Link href="/properties">
                        <Button size="lg">Explorar Propriedades</Button>
                      </Link>
                    </div>
                  ) : (
                    <Tabs defaultValue="active">
                      <TabsList className="mb-8">
                        <TabsTrigger value="active">Aluguéis Ativos ({activeRentals?.length || 0})</TabsTrigger>
                        <TabsTrigger value="past">Aluguéis Passados ({pastRentals?.length || 0})</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="active" className="space-y-6">
                        {activeRentals?.length === 0 ? (
                          <div className="bg-white rounded-lg shadow-sm border border-border p-8 text-center">
                            <CalendarIcon className="w-16 h-16 text-primary mx-auto mb-4" />
                            <h2 className="text-2xl font-semibold mb-4">Nenhum aluguel ativo no momento</h2>
                            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                              Você não tem aluguéis ativos ou pendentes. Que tal explorar propriedades disponíveis?
                            </p>
                            <Link href="/properties">
                              <Button size="lg">Explorar Propriedades</Button>
                            </Link>
                          </div>
                        ) : (
                          activeRentals?.map(rental => {
                            const property = getPropertyDetails(rental.propertyId);
                            return (
                              <Card key={rental.id}>
                                <CardHeader>
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <CardTitle>{property?.title}</CardTitle>
                                      <CardDescription>
                                        {getCategoryName(property?.categoryId || 0)}
                                      </CardDescription>
                                    </div>
                                    <Badge 
                                      variant="outline" 
                                      className={getStatusColor(rental.status)}
                                    >
                                      {getStatusName(rental.status)}
                                    </Badge>
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  <div className="flex flex-col md:flex-row md:space-x-4">
                                    <img 
                                      src={property?.imageUrl || "https://placehold.co/600x400?text=Imagem+Indisponível"} 
                                      alt={property?.title} 
                                      className="h-48 w-full md:w-64 object-cover rounded-lg mb-4 md:mb-0"
                                    />
                                    <div className="space-y-3 flex-1">
                                      <div>
                                        <h4 className="font-medium text-sm text-muted-foreground">Período de Aluguel</h4>
                                        <p className="font-medium">
                                          {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                                        </p>
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-sm text-muted-foreground">Valor Total</h4>
                                        <p className="font-semibold text-lg">${rental.totalPrice.toFixed(2)}</p>
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-sm text-muted-foreground">Depósito de Segurança</h4>
                                        <p className="font-medium">${rental.securityDeposit.toFixed(2)}</p>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                  <p className="text-sm text-muted-foreground">
                                    ID do Contrato: {rental.id}
                                  </p>
                                  <Link href={`/properties/${property?.id}`}>
                                    <Button variant="outline">Ver Detalhes</Button>
                                  </Link>
                                </CardFooter>
                              </Card>
                            );
                          })
                        )}
                      </TabsContent>
                      
                      <TabsContent value="past" className="space-y-6">
                        {pastRentals?.length === 0 ? (
                          <div className="bg-white rounded-lg shadow-sm border border-border p-8 text-center">
                            <CalendarIcon className="w-16 h-16 text-primary mx-auto mb-4" />
                            <h2 className="text-2xl font-semibold mb-4">Nenhum aluguel no histórico</h2>
                            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                              Você ainda não tem aluguéis concluídos ou cancelados no histórico.
                            </p>
                            <Link href="/properties">
                              <Button size="lg">Explorar Propriedades</Button>
                            </Link>
                          </div>
                        ) : (
                          pastRentals?.map(rental => {
                            const property = getPropertyDetails(rental.propertyId);
                            return (
                              <Card key={rental.id}>
                                <CardHeader>
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <CardTitle>{property?.title}</CardTitle>
                                      <CardDescription>
                                        {getCategoryName(property?.categoryId || 0)}
                                      </CardDescription>
                                    </div>
                                    <Badge 
                                      variant="outline" 
                                      className={getStatusColor(rental.status)}
                                    >
                                      {getStatusName(rental.status)}
                                    </Badge>
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  <div className="flex flex-col md:flex-row md:space-x-4">
                                    <img 
                                      src={property?.imageUrl || "https://placehold.co/600x400?text=Imagem+Indisponível"} 
                                      alt={property?.title} 
                                      className="h-48 w-full md:w-64 object-cover rounded-lg mb-4 md:mb-0"
                                    />
                                    <div className="space-y-3 flex-1">
                                      <div>
                                        <h4 className="font-medium text-sm text-muted-foreground">Período de Aluguel</h4>
                                        <p className="font-medium">
                                          {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                                        </p>
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-sm text-muted-foreground">Valor Total</h4>
                                        <p className="font-semibold text-lg">${rental.totalPrice.toFixed(2)}</p>
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-sm text-muted-foreground">Depósito Devolvido</h4>
                                        <p className="font-medium">${rental.securityDeposit.toFixed(2)}</p>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                  <p className="text-sm text-muted-foreground">
                                    Finalizado em: {rental.status === "completed" ? formatDate(rental.endDate) : "Cancelado"}
                                  </p>
                                  <Link href={`/properties/${property?.id}`}>
                                    <Button variant="outline">Ver Propriedade</Button>
                                  </Link>
                                </CardFooter>
                              </Card>
                            );
                          })
                        )}
                      </TabsContent>
                    </Tabs>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default MyRentals;