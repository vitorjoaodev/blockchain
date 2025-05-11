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
          <h2 className="text-3xl font-bold text-center mb-16">Benefits of RentChain</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
              <h3 className="text-xl font-semibold mb-4">Guaranteed Security</h3>
              <p className="text-muted-foreground mb-4">
                Smart contracts protect both landlords and tenants, ensuring all parties fulfill their obligations.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <span>Deposits protected by contracts</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <span>Immutable and transparent conditions</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <span>Identity verification</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
              <h3 className="text-xl font-semibold mb-4">Cost Savings</h3>
              <p className="text-muted-foreground mb-4">
                Eliminate intermediaries and reduce fees, making rentals more affordable for everyone.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <span>No intermediary fees</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <span>Direct transactions between users</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <span>Automated processes</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
              <h3 className="text-xl font-semibold mb-4">Total Convenience</h3>
              <p className="text-muted-foreground mb-4">
                Streamlined end-to-end process, from listing to return.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <span>Intuitive interface</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <span>Manage all rentals in one place</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <span>Automatic deposit return</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
              <h3 className="text-xl font-semibold mb-2">What is a smart contract?</h3>
              <p className="text-muted-foreground">
                A smart contract is an autonomous program that automatically executes when predetermined conditions are met. In RentChain, they manage the entire rental process, from payment to deposit return.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
              <h3 className="text-xl font-semibold mb-2">Do I need blockchain knowledge?</h3>
              <p className="text-muted-foreground">
                No! We designed RentChain to be accessible to everyone. You only need a digital wallet, and our interface will guide you through the entire process.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
              <h3 className="text-xl font-semibold mb-2">How are deposits protected?</h3>
              <p className="text-muted-foreground">
                Deposits are held in a smart contract that releases funds only when the agreed conditions are met. This eliminates disputes and ensures fairness for both parties.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
              <h3 className="text-xl font-semibold mb-2">Can I list any type of property?</h3>
              <p className="text-muted-foreground">
                Currently, RentChain supports four categories: cars, drones, real estate, and equipment. If you have an item that doesn't fit these categories, contact us to discuss.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Join thousands of people who are already revolutionizing the way we rent and share resources.
          </p>
          <Link href="/list-property">
            <Button variant="secondary" size="lg" className="mr-4">List Property</Button>
          </Link>
          <Link href="/properties">
            <Button variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-white hover:text-primary">
              Explore Properties
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;