import { createFileRoute } from "@tanstack/react-router"
import PricingCard from "~/components/pricing/PricingCard"
import { ArrowLeft, CreditCard, Star, StarIcon } from "lucide-react"
import UserNavbar from "~/components/layout/user/UserNavbar"
import UserFooter from "~/components/layout/user/UserFooter"

export const Route = createFileRoute("/pricingPage")({
  component: PricingPage,
})

function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <UserNavbar />
      <div className="px-6 py-4">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center text-sm text-slate-700 hover:text-slate-900 transition-colors"
          type="button"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </button>
      </div>
      <main className="flex-1 flex flex-col items-center p-8">
        <section className="text-center mb-12 px-6 max-w-2xl">
          <h1 className="text-4xl font-extrabold text-primary mb-2">
            Planes y precios
          </h1>
          <p className="text-gray-600 text-lg">
            Elige el plan que se adapta a tus necesidades.
          </p>
        </section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl w-full">
          <div className="transform transition-transform hover:-translate-y-2">
            <PricingCard
              icon={CreditCard}
              title="Basico"
              description="Ideal para empezar y explorar la plataforma."
              benefits={["Beneficio 1", "Beneficio 2"]}
              price="$14.99"
            />
          </div>
          <div className="transform transition-transform hover:-translate-y-2">
            <PricingCard
              icon={Star}
              title="Profesional"
              description="Perfecto para usuarios que buscan más herramientas."
              benefits={["Beneficio 1", "Beneficio 2"]}
              price="$29.99"
              gradient="linear-gradient(135deg, #FEEFE0 0%, #01253E 100%)"
              highlight
            />
          </div>
          <div className="transform transition-transform hover:-translate-y-4 scale-105">
            <PricingCard
              icon={StarIcon}
              title="Corporativo"
              description="La experiencia completa con todas las funcionalidades."
              benefits={[
                "Beneficio 1 Corporativo",
                "Beneficio 2 Corporativo",
                "Soporte prioritario",
                "Acceso anticipado a nuevas funciones",
              ]}
              price="$39.99"
              gradient="linear-gradient(135deg, #1f2937 0%, #d4af37 100%)"
              dark
            />
          </div>
        </div>
      </main>
      <UserFooter />
    </div>
  )
}

