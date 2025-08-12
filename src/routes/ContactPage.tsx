import { createFileRoute } from '@tanstack/react-router';
import Navbar from '~/components/generals/Navbar';
import Footer from '~/components/generals/Footer';
import { Mail, MapPin, Phone } from 'lucide-react';

export const Route = createFileRoute('/ContactPage')({
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="pt-16 min-h-screen flex flex-col bg-Tertiary text-slate-900">
      <Navbar onNavigateHome={function (): void {
              throw new Error('Function not implemented.');
          } } onNavigateAbout={function (): void {
              throw new Error('Function not implemented.');
          } } onNavigateServices={function (): void {
              throw new Error('Function not implemented.');
          } }></Navbar>
      <main className="flex-grow">
        <section className="max-w-5xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold mb-2 text-center">Contáctanos</h1>
          <p className="text-center text-slate-600 mb-10">
            Estamos aquí para ayudarte. Encuentra nuestros canales de contacto abajo.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="section-card text-center">
              <div className="flex justify-center mb-4">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold mb-1">Dirección</h2>
              <p className="text-slate-600">
                Tegucigalpa, M.D.C.<br />
                Honduras, Centroamérica
              </p>
            </div>

            <div className="section-card text-center">
              <div className="flex justify-center mb-4">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold mb-1">Correo</h2>
              <p className="text-slate-600">correotemis@correo.com</p>
            </div>

            <div className="section-card text-center">
              <div className="flex justify-center mb-4">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold mb-1">Teléfonos</h2>
              <p className="text-slate-600">
                +504 0000-0000<br />
                +504 0000-0000<br />
              </p>
            </div>
          </div>

          <div className="mt-12 text-center text-slate-500 text-sm">
            © {new Date().getFullYear()} Temis LegalTech. Todos los derechos reservados.
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
