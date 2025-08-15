import { FaStar, FaRegStar } from 'react-icons/fa';
import testimonialImg from '~/assets/images/landing/testimonial.webp';
import perfilImg1 from '~/assets/images/landing/lawyer1.webp';
import perfilImg2 from '~/assets/images/landing/lawyer2.webp';
import perfilImg3 from '~/assets/images/landing/lawyer3.webp';
import perfilImg4 from '~/assets/images/landing/lawyer4.webp';
import perfilImg5 from '~/assets/images/landing/lawyer5.webp';


const testimonials = [
  {
    stars: 5,
    text: 'Temis revolucionó nuestra práctica legal. La gestión de casos es ahora 3 veces más eficiente y nunca perdemos una fecha importante.',
    reviewer: 'Ana López',
    date: 'Julio 2025',
    avatar: `${perfilImg1}`,
  },
  {
    stars: 5,
    text: 'Temis revolucionó nuestra práctica legal. La gestión de casos es ahora 3 veces más eficiente y nunca perdemos una fecha importante.',
    reviewer: 'Carlos Gómez',
    date: 'Julio 2025',
    avatar: `${perfilImg3}`,
  },
  {
    stars: 5,
    text: 'La funcionalidad de IA legal nos ha ahorrado horas de investigación. Es como tener un asistente jurídico 24/7.',
    reviewer: 'Lucía Rivas',
    date: 'Julio 2025',
    avatar: `${perfilImg2}`,
  },
  {
    stars: 5,
    text: 'La gestión de documentos y evidencias es impecable. Temis nos ayuda a construir casos más sólidos y organizados.',
    reviewer: 'Mario Castro',
    date: 'Julio 2025',
    avatar: `${perfilImg4}`,
  },
  {
    stars: 3,
    text: 'El sistema de facturación integrado nos ahorró contratar un contador adicional. Todo está automatizado y es muy preciso.',
    reviewer: 'Sara Martínez',
    date: 'Julio 2025',
    avatar: `${perfilImg5}`,
  },
];

const Testimonials = () => {
  return (
    <section
      className="relative bg-cover bg-center py-40 px-4"
      style={{
        backgroundImage: `url(${testimonialImg})`,
      }}
      aria-labelledby="testimonials-title"
      role="region"
    >
      {/* Fondo */}
      <div className="absolute inset-0 bg-[rgba(1,37,62,0.7)] backdrop-blur-sm" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto text-center text-[var(--secondary-color)]">
        <h2
          id="testimonials-title"
          className="text-3xl font-bold mb-2 font-serif"
        >
          Lo que nuestros clientes dicen de nosotros
        </h2>
        <div className="w-32 h-1 bg-[var(--pending-color)] mx-auto mb-10 rounded-full" />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 px-4">
          {testimonials.map((t, i) => (
            <article
              key={i}
              className="bg-[var(--Tertiary-color)] text-black rounded-xl shadow-lg p-5 flex flex-col justify-between transition-transform hover:-translate-y-1 hover:shadow-2xl"
              style={{ fontFamily: 'var(--font-sans)' }}
              aria-label={`Testimonio de ${t.reviewer}`}
            >
              {/* Estrellas */}
              <div className="flex gap-1 text-[var(--pending-color)] mb-2" aria-label={`${t.stars} estrellas`}>
                {Array.from({ length: 5 }).map((_, j) =>
                  j < t.stars ? <FaStar key={j} aria-hidden="true" /> : <FaRegStar key={j} aria-hidden="true" />
                )}
              </div>

              {/* Texto */}
              <p className="text-sm mb-6">&quot;{t.text}&quot;</p>
              {/* Revisor */}
              <div className="flex items-center gap-3 mt-auto">
                <img
                  src={t.avatar}
                  alt={`Avatar de ${t.reviewer}`}
                  className="w-10 h-10 rounded-full object-cover"
                  loading="lazy"
                />
                <div>
                  <p className="text-sm font-semibold">{t.reviewer}</p>
                  <p className="text-xs text-gray-500">{t.date}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;