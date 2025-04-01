import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram, ArrowRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 rounded-2xl text-white py-10">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="flex flex-col md:flex-row justify-between items-start border-b border-gray-700 pb-6">
          
          <nav className="w-full md:w-auto">
            <ul className="flex flex-col space-y-4 text-lg font-medium">
              {["About Us", "Services", "Contact"].map((item, index) => (
                <li key={index}>
                  <Link 
                    to={`/${item.toLowerCase()}`} 
                    className="group flex items-center relative overflow-hidden transition"
                  >
                    <span className="relative z-10">{item}</span>
                    <ArrowRight size={20} className="ml-2 -rotate-45 relative z-10" />

                    <span className="absolute left-0 bottom-0 w-full h-[2px] bg-gray-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-6 md:mt-0 flex space-x-6">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition">
              <Facebook size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition">
              <Twitter size={24} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition">
              <Linkedin size={24} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition">
              <Instagram size={24} />
            </a>
          </div>

        </div>

        <div className="text-center text-gray-400 text-base mt-6">
          © {new Date().getFullYear()} OttawaHousing. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
