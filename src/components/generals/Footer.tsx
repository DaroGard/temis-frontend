import {
    FaInstagram,
    FaFacebookF,
    FaLinkedinIn,
    FaTwitter,
} from 'react-icons/fa';
import logo from '~/assets/logos/temisGI.svg'

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-primary to-[#060606] text-secondary px-4 py-8">
            <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">
                {/*Logo*/}
                <div className="pr-8 flex justify-center">
                    <img src={logo} alt="TEMIS logo" className="w-40 max-w-full" />
                </div>

                {/*Redes sociales*/}
                <div className="flex gap-6 text-3xl">
                    <a
                        href="#"
                        className="transition-all duration-300 ease-in-out text-secondary hover:text-[#E1306C] hover:scale-110 hover:bg-white/10 hover:drop-shadow-lg p-2 rounded-full"
                        aria-label="Instagram"
                    >
                        <FaInstagram />
                    </a>
                    <a
                        href="#"
                        className="transition-all duration-300 ease-in-out text-secondary hover:text-[#1877F2] hover:scale-110 hover:bg-white/10 hover:drop-shadow-lg p-2 rounded-full"
                        aria-label="Facebook"
                    >
                        <FaFacebookF />
                    </a>
                    <a
                        href="#"
                        className="transition-all duration-300 ease-in-out text-secondary hover:text-[#0A66C2] hover:scale-110 hover:bg-white/10 hover:drop-shadow-lg p-2 rounded-full"
                        aria-label="LinkedIn"
                    >
                        <FaLinkedinIn />
                    </a>
                    <a
                        href="#"
                        className="transition-all duration-300 ease-in-out text-secondary hover:text-[#1DA1F2] hover:scale-110 hover:bg-white/10 hover:drop-shadow-lg p-2 rounded-full"
                        aria-label="Twitter"
                    >
                        <FaTwitter />
                    </a>
                </div>

                {/*Derechos reservados*/}
                <p className="text-sm text-center text-secondary">
                    © 2025 TEMIS Gestión legal Inteligente. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
};

export default Footer;