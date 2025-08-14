import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import logo from "~/assets/logos/temisGI.svg";
import { useState } from "react";

const Footer: React.FC = () => {
  // Lista de redes sociales 
  const socialLinks = [
    {
      icon: <FaInstagram />,
      href: "#",
      label: "Instagram",
      hoverColor: "#E1306C",
    },
    {
      icon: <FaFacebookF />,
      href: "#",
      label: "Facebook",
      hoverColor: "#1877F2",
    },
    {
      icon: <FaLinkedinIn />,
      href: "#",
      label: "LinkedIn",
      hoverColor: "#0A66C2",
    },
    {
      icon: <FaTwitter />,
      href: "#",
      label: "Twitter",
      hoverColor: "#1DA1F2",
    },
  ];

  // hover dinámico
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <footer className="bg-gradient-to-r from-primary to-[#060606] text-secondary px-8 py-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">

        {/* Logo */}
        <div className="flex-shrink-0">
          <img src={logo} alt="TEMIS logo" className="w-40 max-w-full" />
        </div>

        {/* Texto de derechos */}
        <p className="text-sm text-center flex-1">
          © 2025 TEMIS Gestión Legal Inteligente. Todos los derechos reservados.
        </p>

        {/* Redes sociales */}
        <div className="flex gap-4 md:gap-6 text-2xl md:text-3xl mt-4 md:mt-0">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              aria-label={link.label}
              className={`
                transition-all duration-300 ease-in-out
                text-secondary
                hover:scale-110 hover:bg-white/10 hover:drop-shadow-lg
                p-2 rounded-full
                focus:outline-none focus:ring-2 focus:ring-offset-1
              `}
              onMouseEnter={() => setHovered(link.label)}
              onMouseLeave={() => setHovered(null)}
              style={{
                color: hovered === link.label ? link.hoverColor : undefined,
                "--tw-ring-color": link.hoverColor,
              } as React.CSSProperties}
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;