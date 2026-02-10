import { Cloud, Facebook, Twitter, Instagram, Linkedin, Mail, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Cloud className="text-gold-400" size={32} />
              <span className="text-2xl font-heading font-bold text-white">
                ShaadiMausam
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted partner for weather-perfect wedding planning across India.
            </p>
            <div className="flex items-center space-x-2 text-gray-400 mb-2">
              <MapPin size={16} />
              <span className="text-sm">Pan-India Service</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <Mail size={16} />
              <span className="text-sm">hello@shaadimausam.in</span>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection('hero')}
                  className="hover:text-gold-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('features')}
                  className="hover:text-gold-400 transition-colors"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="hover:text-gold-400 transition-colors"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('demo')}
                  className="hover:text-gold-400 transition-colors"
                >
                  Demo
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-gold-400 transition-colors">
                  Weather Forecasts
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gold-400 transition-colors">
                  Golden Hour Timing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gold-400 transition-colors">
                  Travel Advisory
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gold-400 transition-colors">
                  Venue Recommendations
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-gold-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gold-400 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gold-400 transition-colors">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gold-400 transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              &copy; {currentYear} ShaadiMausam.in. All rights reserved.
            </div>

            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-gold-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gold-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gold-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gold-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
