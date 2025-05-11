import { Button } from "@/components/ui/button";
import { Shield, Lock, Check, RefreshCw } from "lucide-react";
import { Link } from "wouter";

const HowItWorks = () => {
  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-6">How RentChain Works</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            A decentralized rental platform that uses blockchain technology to make rentals secure, transparent, and efficient.
          </p>
          <Link href="/list-property">
            <Button size="lg" className="mr-4">List Property</Button>
          </Link>
          <Link href="/properties">
            <Button variant="outline" size="lg">Explore Properties</Button>
          </Link>
        </div>
      </section>

      {/* Process Steps Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">The Process in 4 Simple Steps</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-border text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Connect Your Wallet</h3>
              <p className="text-muted-foreground">
                Connect your digital wallet to access all platform features securely and in a decentralized manner.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-border text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Choose a Property</h3>
              <p className="text-muted-foreground">
                Browse through our categories: Cars, Drones, Real Estate, or Equipment and find what you need.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-border text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Sign the Contract</h3>
              <p className="text-muted-foreground">
                Sign a smart contract that automatically manages the rental, deposit, and agreement terms.
              </p>
            </div>
            
            {/* Step 4 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-border text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">4. Enjoy and Return</h3>
              <p className="text-muted-foreground">
                After using the item, return it in the agreed conditions to automatically receive your deposit back.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Benefícios do RentChain</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
              <h3 className="text-xl font-semibold mb-4">Segurança Garantida</h3>
              <p className="text-muted-foreground mb-4">
                Contratos inteligentes protegem tanto locadores quanto locatários, garantindo que todas as partes cumpram suas obrigações.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <span>Depósitos protegidos por contratos</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <span>Condições imutáveis e transparentes</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <span>Verificação de identidade</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
              <h3 className="text-xl font-semibold mb-4">Economia de Custos</h3>
              <p className="text-muted-foreground mb-4">
                Elimine intermediários e reduza taxas, tornando aluguéis mais acessíveis para todos.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <span>Sem taxas de intermediários</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <span>Transações diretas entre usuários</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <span>Processos automatizados</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
              <h3 className="text-xl font-semibold mb-4">Conveniência Total</h3>
              <p className="text-muted-foreground mb-4">
                Processo simplificado de ponta a ponta, desde a listagem até a devolução.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <span>Interface intuitiva</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <span>Gestão de aluguéis em um só lugar</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <span>Devolução de depósito automática</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Perguntas Frequentes</h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
              <h3 className="text-xl font-semibold mb-2">O que é um contrato inteligente?</h3>
              <p className="text-muted-foreground">
                Um contrato inteligente é um programa autônomo que executa automaticamente quando condições predeterminadas são atendidas. No RentChain, eles gerenciam todo o processo de aluguel, desde o pagamento até a devolução do depósito.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
              <h3 className="text-xl font-semibold mb-2">Preciso de conhecimento em blockchain?</h3>
              <p className="text-muted-foreground">
                Não! Projetamos o RentChain para ser acessível a todos. Você só precisa de uma carteira digital, e nossa interface guiará você durante todo o processo.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
              <h3 className="text-xl font-semibold mb-2">Como são protegidos os depósitos?</h3>
              <p className="text-muted-foreground">
                Os depósitos são mantidos em um contrato inteligente que libera os fundos somente quando as condições acordadas são cumpridas. Isso elimina disputas e garante justiça para ambas as partes.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
              <h3 className="text-xl font-semibold mb-2">Posso listar qualquer tipo de propriedade?</h3>
              <p className="text-muted-foreground">
                Atualmente, o RentChain suporta quatro categorias: carros, drones, imóveis e equipamentos. Se você tem um item que não se encaixa nessas categorias, entre em contato conosco para discutir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Pronto para Começar?</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Junte-se a milhares de pessoas que já estão revolucionando a maneira como alugamos e compartilhamos recursos.
          </p>
          <Link href="/list-property">
            <Button variant="secondary" size="lg" className="mr-4">Listar Propriedade</Button>
          </Link>
          <Link href="/properties">
            <Button variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-white hover:text-primary">
              Explorar Propriedades
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;