import {
  FaFileAlt,
  FaUserTie,
  FaFolderOpen,
  FaCalendarAlt,
  FaTasks,
  FaMoneyBillWave,
  FaCheckCircle,
} from 'react-icons/fa';
import lawImg from '~/assets/images/landing/law.webp';

const services = [
  {
    icon: <FaFileAlt />,
    title: 'Control de casos activos',
    description: 'Gestiona todos tus casos desde un dashboard centralizado.',
  },
  {
    icon: <FaUserTie />,
    title: 'Asignación por abogado',
    description: 'Distribuye casos eficientemente entre tu equipo.',
  },
  {
    icon: <FaFolderOpen />,
    title: 'Archivos legales organizados',
    description: 'Almacena y organiza documentos de forma segura.',
  },
  {
    icon: <FaCalendarAlt />,
    title: 'Calendario de audiencias',
    description: 'Nunca pierdas una fecha importante.',
  },
  {
    icon: <FaTasks />,
    title: 'To-Do List por caso',
    description: 'Mantén el control de todas las tareas pendientes.',
  },
  {
    icon: <FaMoneyBillWave />,
    title: 'Facturación legal',
    description: 'Genera facturas profesionales automáticamente.',
  },
];

const Services = () => {
  return (
    <section
      className="w-full py-40 px-6 lg:px-24 bg-[var(--primary-color)] bg-cover bg-center bg-no-repeat text-secondary"
      style={{
        backgroundImage: `url(${lawImg})`,
        backgroundBlendMode: 'overlay',
      }}
      aria-labelledby="services-title"
      role="region"
    >
      {/* Título */}
      <div className="text-center mb-12">
        <h3
          id="services-title"
          className="text-3xl font-serif font-bold text-[var(--secondary-color)] inline-block border-b-4 border-[var(--pending-color)] pb-1 mb-2"
        >
          Nuestros servicios
        </h3>
        <p className="text-lg mt-4 font-sans text-secondary">
          Todo lo que necesitas para gestionar tu firma legal de manera profesional
        </p>
      </div>
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(({ icon, title, description }, i) => {
          const isLight = i % 2 === 0;
          return (
            <div
              key={i}
              className={`relative rounded-xl p-6 shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 backdrop-blur-sm min-h-[235px] ${
                isLight
                  ? 'bg-[var(--secondary-color)] text-[var(--primary-color)]'
                  : 'bg-[var(--primary-color)]/60 text-[var(--secondary-color)]'
              }`}
            >
              {/* Icono */}
              <div
                className={`w-14 h-14 flex items-center justify-center shadow-md rounded-lg mb-5 text-4xl ${
                  isLight ? 'bg-[var(--primary-color)] text-[var(--secondary-color)]' : 'bg-[var(--secondary-color)] text-[var(--primary-color)]'
                }`}
              >
                {icon}
              </div>
              <h4 className="text-xl font-bold mb-3 font-serif">{title}</h4>
              <p className="text-base font-sans">{description}</p>
              <FaCheckCircle
                className="absolute bottom-4 left-4 text-[var(--pending-color)] text-xl"
                aria-hidden="true"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Services;