import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/')({
  component: Home,
})
import { useRef } from 'react';
import Navbar from '~/components/generals/Navbar';
import Footer from '~/components/generals/Footer';
import Hero from '~/components/landing/Hero';
import AboutUs from '~/components/landing/AboutUs';
import Services from '~/components/landing/Services';
import Testimonials from '~/components/landing/Testimonials';

function Home() {
  const homeRef = useRef<HTMLDivElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const servicesRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="pt-16 min-h-screen flex flex-col">
      <Navbar
        onNavigateHome={() => homeRef.current?.scrollIntoView({ behavior: 'smooth' })}
        onNavigateAbout={() => aboutRef.current?.scrollIntoView({ behavior: 'smooth' })}
        onNavigateServices={() => servicesRef.current?.scrollIntoView({ behavior: 'smooth' })}
      />
      <main className="flex-grow">
        <div ref={homeRef} id="home">
          <Hero />
        </div>
        <div ref={aboutRef} id="about">
          <AboutUs />
        </div>
        <div ref={servicesRef} id="services">
          <Services />
        </div>
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}