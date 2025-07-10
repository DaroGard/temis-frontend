export const Hero = () => {
  return (
    <section className="w-full bg-gradient-to-r from-[#01253E] to-[#000000] text-[var(--secondary-color)] py-16 px-6 lg:px-24 flex flex-col lg:flex-row items-center justify-between gap-12">
      
      {/* Texto */}
      <div className="max-w-xl">
        <h1 className="text-4xl lg:text-5xl font-bold leading-tight font-serif mb-6">
          Centraliza tus casos legales<br />
          con <span className="text-[var(--pending-color)] italic">inteligencia y claridad</span>
        </h1>
        <p className="text-lg font-sans mb-8">
          Temis es el ERP legal que potencia tu firma con organización, velocidad y tecnología.
        </p>
        <button className="bg-[var(--secondary-color)] text-[var(--primary-color)] font-semibold px-6 py-3 rounded-xl shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover:bg-[#f5dfc7]">
          Regístrate
        </button>
      </div>

      {/* Imagen */}
      <div className="w-full lg:w-[500px]">
        <img
          src="imagen.svg"
          alt="imagen"
          className="w-full h-auto object-contain"
        />
      </div>
    </section>
  );
};

export default Hero;
