import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-[#2c3e50] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <svg className="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
              <span className="ml-2 text-xl font-bold font-poppins">RentChain</span>
            </div>
            <p className="text-white/70 mb-4">Decentralized rental platform with blockchain security for cars, drones, real estate, and equipment.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/70 hover:text-primary">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a href="#" className="text-white/70 hover:text-primary">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.545 2.907a13.227 13.227 0 00-3.257-1.011.05.05 0 00-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 00-3.658 0 8.258 8.258 0 00-.412-.833.051.051 0 00-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 00-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 003.995 2.02.05.05 0 00.056-.019c.308-.42.582-.863.818-1.329a.05.05 0 00-.01-.059.051.051 0 00-.018-.011 8.875 8.875 0 01-1.248-.595.05.05 0 01-.02-.066.051.051 0 01.015-.019c.084-.063.168-.129.248-.195a.05.05 0 01.051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 01.053.007c.08.066.164.132.248.195a.051.051 0 01-.004.085 8.254 8.254 0 01-1.249.594.05.05 0 00-.03.03.052.052 0 00.003.041c.24.465.515.909.817 1.329a.05.05 0 00.056.019 13.235 13.235 0 004.001-2.02.049.049 0 00.021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 00-.02-.019zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612z" />
                </svg>
              </a>
              <a href="#" className="text-white/70 hover:text-primary">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.5 6.436-1.07 9.46-.107.575-.206.943-.345 1.187-.206.354-.4.385-.925.162-1.158-.494-2.586-1.084-3.837-1.618l-1.229-.536c-1.863-.813-3.216-1.412-4.393-1.94-.773-.36-.739-.358-.739-.443 0-.068.218-.216.96-.4.359-.085.72-.17 1.099-.257.47-.107 1.111-.277 1.99-.41 1.245-.189 2.648-.447 4.183-.837 3.498-.89 7.077-1.839 8.65-2.305zm-8.293 9.19c.102.008.22-.037.23-.092.01-.055-.08-.145-.212-.18-.132-.035-.263-.063-.294.012-.03.075.155.252.276.26z" />
                </svg>
              </a>
              <a href="#" className="text-white/70 hover:text-primary">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.846 6.887c.03-.295-.083-.586-.303-.784l-2.24-2.7v-.403h6.958l5.378 11.795 4.728-11.795h6.633v.403l-1.916 1.837c-.165.126-.247.333-.213.538v13.498c-.034.204.048.411.213.537l1.871 1.837v.403h-9.412v-.403l1.939-1.882c.19-.19.19-.246.19-.537v-10.91l-5.389 13.688h-.728l-6.275-13.688v9.174c-.052.385.076.774.347 1.052l2.521 3.058v.404h-7.148v-.404l2.521-3.058c.27-.279.39-.67.325-1.052v-10.608z" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 font-poppins">Categories</h4>
            <ul className="space-y-2">
              <li><Link href="/category/cars" className="text-white/70 hover:text-primary">Cars</Link></li>
              <li><Link href="/category/drones" className="text-white/70 hover:text-primary">Drones</Link></li>
              <li><Link href="/category/real-estate" className="text-white/70 hover:text-primary">Real Estate</Link></li>
              <li><Link href="/category/equipment" className="text-white/70 hover:text-primary">Equipment</Link></li>
              <li><Link href="/#rentals" className="text-white/70 hover:text-primary">All Rentals</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 font-poppins">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/70 hover:text-primary">About Us</a></li>
              <li><a href="#how-it-works" className="text-white/70 hover:text-primary">How It Works</a></li>
              <li><a href="#" className="text-white/70 hover:text-primary">Careers</a></li>
              <li><a href="#" className="text-white/70 hover:text-primary">Blog</a></li>
              <li><a href="#" className="text-white/70 hover:text-primary">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 font-poppins">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/70 hover:text-primary">Help Center</a></li>
              <li><a href="#" className="text-white/70 hover:text-primary">Smart Contract Guide</a></li>
              <li><a href="#" className="text-white/70 hover:text-primary">Wallet Setup</a></li>
              <li><a href="#" className="text-white/70 hover:text-primary">Security</a></li>
              <li><a href="#" className="text-white/70 hover:text-primary">Tokenomics</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/70 text-sm mb-4 md:mb-0">
            © 2023 RentChain. All rights reserved. Developed by João Vitor Belasque | 
            <a href="https://www.linkedin.com/in/joaovitorfullstack/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              LinkedIn
            </a>
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-white/70 hover:text-primary text-sm">Terms of Service</a>
            <a href="#" className="text-white/70 hover:text-primary text-sm">Privacy Policy</a>
            <a href="#" className="text-white/70 hover:text-primary text-sm">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
