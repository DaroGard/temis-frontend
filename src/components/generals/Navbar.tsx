import React, { useEffect, useState } from 'react';
import NavLink from './NavLink';
import { useRouter } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router'
import logo from '~/assets/logos/logotemis2.svg'
 
interface NavbarProps {
  onNavigateHome: () => void;
  onNavigateAbout: () => void;
  onNavigateServices: () => void;
}

const Navbar = ({ onNavigateHome, onNavigateAbout, onNavigateServices }: NavbarProps) => {
  const router = useRouter();
  const isHome = router.state.location.pathname === '/';

  const [activeSection, setActiveSection] = useState<string>('inicio');

  useEffect(() => {
    if (!isHome) {
      setActiveSection('');
      return;
    }

    const homeSection = document.getElementById('home');
    const aboutSection = document.getElementById('about');
    const servicesSection = document.getElementById('services');

    if (!homeSection || !aboutSection || !servicesSection) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 2;

      if (window.scrollY < 100) {
        setActiveSection('inicio');
      } else if (scrollPos >= servicesSection.offsetTop) {
        setActiveSection('services');
      } else if (scrollPos >= aboutSection.offsetTop) {
        setActiveSection('about');
      } else if (scrollPos >= homeSection.offsetTop) {
        setActiveSection('inicio');
      } else {
        setActiveSection('inicio');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHome]);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-primary to-[#060606] text-secondary z-50">
      <div className="max-w-8xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="flex-shrink-0">
              <img className="h-full w-full" src={logo} alt="TemisLogo" />
            </div>
            {/* Enlaces */}
            <div className="flex space-x-4">
              <NavLink
                to="/"
                label="Inicio"
                isActive={activeSection === 'inicio'}
                onClick={(e) => {
                  if (isHome) {
                    e.preventDefault();
                    onNavigateHome();
                    setActiveSection('inicio');
                  }
                }}
              />
              <NavLink
                to="/#about"
                label="Acerca de"
                isActive={activeSection === 'about'}
                onClick={(e) => {
                  if (isHome) {
                    e.preventDefault();
                    onNavigateAbout();
                  }
                }}
              />
              <NavLink
                to="/#services"
                label="Servicios"
                isActive={activeSection === 'services'}
                onClick={(e) => {
                  if (isHome) {
                    e.preventDefault();
                    onNavigateServices();
                  }
                }}
              />
              <NavLink to="/contacto" label="Contacto" />
            </div>
          </div>
          {/* Iniciar sesión */}
          <div>
            <Link
              to="/login"
              className="inline-block bg-primary hover:bg-links text-secondary font-semibold py-2 px-4 rounded-md text-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;