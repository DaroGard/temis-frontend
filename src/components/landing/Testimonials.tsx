import { FaStar, FaRegStar } from 'react-icons/fa';
import testimonialImg from '~/assets/images/landing/testimonial.webp'

const testimonials = [
    {
        stars: 5,
        text: 'Temis revolucionó nuestra práctica legal. La gestión de casos es ahora 3 veces más eficiente y nunca perdemos una fecha importante.',
        reviewer: 'Ana López',
        date: 'Julio 2025',
        avatar: 'avatar.webp',
    },
    {
        stars: 5,
        text: 'Temis revolucionó nuestra práctica legal. La gestión de casos es ahora 3 veces más eficiente y nunca perdemos una fecha importante.',
        reviewer: 'Carlos Gómez',
        date: 'Julio 2025',
        avatar: 'avatar.webp',
    },
    {
        stars: 5,
        text: 'La funcionalidad de IA legal nos ha ahorrado horas de investigación. Es como tener un asistente jurídico 24/7.',
        reviewer: 'Lucía Rivas',
        date: 'Julio 2025',
        avatar: 'avatar.webp',
    },
    {
        stars: 5,
        text: 'La gestión de documentos y evidencias es impecable. Temis nos ayuda a construir casos más sólidos y organizados.',
        reviewer: 'Mario Castro',
        date: 'Julio 2025',
        avatar: 'avatar.webp',
    },
    {
        stars: 3,
        text: 'El sistema de facturación integrado nos ahorró contratar un contador adicional. Todo está automatizado y es muy preciso.',
        reviewer: 'Sara Martínez',
        date: 'Julio 2025',
        avatar: 'avatar.webp',
    },
];

const Testimonials = () => {
    return (
        <section
            className="relative bg-cover bg-center py-16 px-4"
            style={{
                backgroundImage: `url(${testimonialImg})`,
            }}
        >
            {/* Fondo */}
            <div className="absolute inset-0 bg-[rgba(1,37,62,0.7)] backdrop-blur-sm" />

            <div className="relative max-w-7xl mx-auto text-center" style={{ color: 'var(--secondary-color)' }}>
                <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                    Lo que nuestros clientes dicen de nosotros
                </h2>
                <div className="w-32 h-1 bg-[var(--pending-color)] mx-auto mb-10 rounded-full" />

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 px-4">
                    {testimonials.map((t, i) => (
                        <div
                            key={i}
                            className="bg-[var(--Tertiary-color)] text-black rounded-xl shadow-lg p-5 flex flex-col justify-between transition-transform hover:-translate-y-1 hover:shadow-2xl"
                            style={{ fontFamily: 'var(--font-sans)' }}
                        >
                            {/* Estrellas */}
                            <div className="flex gap-1 text-[var(--pending-color)] mb-2">
                                {Array.from({ length: 5 }).map((_, j) =>
                                    j < t.stars ? <FaStar key={j} /> : <FaRegStar key={j} />
                                )}
                            </div>

                            {/* Texto del testimonio */}
                            <p className="text-sm mb-6">"{t.text}"</p>

                            {/* Revisor */}
                            <div className="flex items-center gap-3 mt-auto">
                                <img
                                    src={t.avatar}
                                    alt={t.reviewer}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                    <p className="text-sm font-semibold">{t.reviewer}</p>
                                    <p className="text-xs text-gray-500">{t.date}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;