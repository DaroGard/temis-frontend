import { motion } from 'framer-motion';
import { FaCogs, FaAward, FaNetworkWired, FaLifeRing } from 'react-icons/fa';
import teamImage from '~/assets/images/landing/team.webp';

const AboutUs = () => {
    return (
        <section className="bg-[var(--Tertiary-color)] text-[var(--primary-color)] py-20 px-4 sm:px-6 lg:px-24">
            <div className="flex flex-col lg:flex-row gap-10 items-center">

                {/* Imagen */}
                <motion.div
                    className="w-full lg:w-[550px] rounded-xl overflow-hidden"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <img
                        src={teamImage}
                        alt="imagen"
                        className="w-full h-auto object-cover"
                    />
                </motion.div>
                {/* Texto */}
                <motion.div
                    className="max-w-2xl text-center lg:text-left"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    <h3 className="text-[var(--primary-color)] font-serif text-sm font-bold uppercase mb-4 inline-block border-b-4 border-[var(--pending-color)] pb-1">
                        Quiénes somos
                    </h3>
                    <h2 className="text-3xl sm:text-4xl font-bold font-serif mb-4">
                        El equipo que está modernizando la gestión legal
                    </h2>
                    <p className="mb-4 text-lg leading-relaxed font-sans">
                        Somos un equipo de expertos en tecnología y derecho, comprometidos con revolucionar la forma en que los profesionales legales gestionan sus casos y procesos.
                    </p>
                    <p className="text-lg leading-relaxed font-sans">
                        Nos impulsa la innovación y la búsqueda constante de la excelencia. Trabajamos de forma coordinada y en conjunto desde distintas áreas para impulsar la transformación del sector jurídico, aportando soluciones tecnológicas que optimizan la gestión legal y elevan el estándar profesional.
                    </p>
                </motion.div>
            </div>
            {/* Cards */}
            <motion.div
                className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ staggerChildren: 0.2 }}
            >
                {cards.map((card, index) => (
                    <Card key={index} icon={card.icon} title={card.title} />
                ))}
            </motion.div>
        </section>
    );
};

// Tarjetas animadas
const Card = ({ icon, title }: { icon: React.ReactNode; title: string }) => {
    return (
        <motion.div
            className="bg-white rounded-xl shadow-md hover:shadow-xl p-6 text-center transition transform hover:-translate-y-1"
            variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6 }}
        >
            <div className="flex flex-col items-center justify-center">
                <div className="text-5xl text-[var(--primary-color)] mb-4">{icon}</div>
                <h3 className="text-lg font-semibold font-sans text-[var(--primary-color)]">{title}</h3>
            </div>
        </motion.div>
    );
};

// Íconos y títulos
const cards = [
    { icon: <FaCogs />, title: 'Innovación Tecnológica' },
    { icon: <FaAward />, title: 'Excelencia Operativa' },
    { icon: <FaNetworkWired />, title: 'Arquitectura Empresarial' },
    { icon: <FaLifeRing />, title: 'Soporte Especializado' },
];

export default AboutUs;