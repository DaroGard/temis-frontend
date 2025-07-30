import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
} from 'react-icons/fa';
import React from 'react';
import logo from '~/assets/logos/temisGI.svg';

const socialLinks = [
  {
    href: '#',
    label: 'Instagram',
    icon: FaInstagram,
    hoverColor: '#E1306C',
  },
  {
    href: '#',
    label: 'Facebook',
    icon: FaFacebookF,
    hoverColor: '#1877F2',
  },
  {
    href: '#',
    label: 'LinkedIn',
    icon: FaLinkedinIn,
    hoverColor: '#0A66C2',
  },
  {
    href: '#',
    label: 'Twitter',
    icon: FaTwitter,
    hoverColor: '#1DA1F2',
  },
];

const Footer = () => {
  return (
    <footer
      className="bg-gradient-to-r from-primary to-[#060606] text-secondary px-4 py-8"
      role="contentinfo"
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="pr-8 flex justify-center">
          <img src={logo} alt="TEMIS logo" className="w-40 max-w-full" loading="lazy" />
        </div>
        {/* Redes sociales */}
        <div className="flex gap-6 text-3xl">
          {socialLinks.map(({ href, label, icon: Icon, hoverColor }) => (
            <a
              key={label}
              href={href}
              className="transition-all duration-300 ease-in-out text-secondary hover:scale-110 hover:bg-white/10 hover:drop-shadow-lg p-2 rounded-full"
              aria-label={label}
              style={{ color: 'inherit' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = hoverColor)}
              onMouseLeave={(e) => (e.currentTarget.style.color = '')}
            >
              <Icon />
            </a>
          ))}
        </div>
        {/* Derechos reservados */}
        <p className="text-sm text-center text-secondary select-text">
          © 2025 TEMIS Gestión legal Inteligente. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default React.memo(Footer);