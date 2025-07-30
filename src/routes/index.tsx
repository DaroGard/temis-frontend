import { createFileRoute } from '@tanstack/react-router';
import { useRef, useCallback } from 'react';
import Navbar from '~/components/generals/Navbar';
import Footer from '~/components/generals/Footer';
import Hero from '~/components/landing/Hero';
import AboutUs from '~/components/landing/AboutUs';
import Services from '~/components/landing/Services';
import Testimonials from '~/components/landing/Testimonials';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  const homeRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const scrollToRef = useCallback((ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="pt-16 min-h-screen flex flex-col">
      <Navbar
        onNavigateHome={() => scrollToRef(homeRef)}
        onNavigateAbout={() => scrollToRef(aboutRef)}
        onNavigateServices={() => scrollToRef(servicesRef)}
      />
      <main className="flex-grow">
        <section ref={homeRef} id="home"><Hero /></section>
        <section ref={aboutRef} id="about"><AboutUs /></section>
        <section ref={servicesRef} id="services"><Services /></section>
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}