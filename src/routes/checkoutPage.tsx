import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import UserNavbar from "~/components/layout/user/UserNavbar"
import UserFooter from "~/components/layout/user/UserFooter"
import logo from '~/assets/logos/LogoTemis.svg'
import { ArrowLeft } from "lucide-react"

export const Route = createFileRoute("/checkoutPage")({
  component: CheckoutPage,
})

function CheckoutPage() {
  const [paid, setPaid] = useState(false)
  const [invoiceData, setInvoiceData] = useState<any>(null)

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const data = new FormData(form)
    const name = data.get("name")
    const email = data.get("email")
    const plan = data.get("plan")
    const price =
      plan === "Basico" ? "14.99" : plan === "Profesional" ? "29.99" : "39.99"

    setInvoiceData({
      name,
      email,
      plan,
      price,
      date: new Date().toLocaleDateString(),
    })
    setPaid(true)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <nav className="print:hidden">
        <UserNavbar />
      </nav>

      <main className="flex-1 flex flex-col items-center p-8">
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
        <section className="max-w-xl w-full bg-white p-6 rounded-lg shadow-lg">
          {!paid ? (
            <>
              <h1 className="text-2xl font-bold mb-6 text-primary text-center">
                Pasarela de Pago
              </h1>
              <form className="space-y-4" onSubmit={handlePayment}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="mt-1 block w-full border rounded-lg p-2 text-black"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="mt-1 block w-full border rounded-lg p-2 text-black"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Plan
                  </label>
                  <select
                    name="plan"
                    className="mt-1 block w-full border rounded-lg p-2 text-black"
                    required
                  >
                    <option value="Basico">Basico - $14.99</option>
                    <option value="Profesional">Profesional - $29.99</option>
                    <option value="Corporativo">Corporativo - $39.99</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Número de tarjeta
                    </label>
                    <input
                      type="text"
                      maxLength={16}
                      className="mt-1 block w-full border rounded-lg p-2 text-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      CVV
                    </label>
                    <input
                      type="text"
                      maxLength={3}
                      className="mt-1 block w-full border rounded-lg p-2 text-black"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
                  >
                    Pagar
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-6 text-primary text-center">
                Factura
              </h1>
              <div className="bg-gray-50 border rounded-lg p-6 shadow-md text-primary relative">
                <img
                  src={logo}
                  alt="Logo Temis"
                  className="absolute top-4 right-4 w-20 opacity-30 text-primary"
                  style={{ pointerEvents: 'none' }}
                />

                <p>
                  <strong>Cliente:</strong> {invoiceData.name}
                </p>
                <p>
                  <strong>Email:</strong> {invoiceData.email}
                </p>
                <p>
                  <strong>Plan:</strong> {invoiceData.plan}
                </p>
                <p>
                  <strong>Precio:</strong> ${invoiceData.price}
                </p>
                <p>
                  <strong>Fecha:</strong> {invoiceData.date}
                </p>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  onClick={handlePrint}
                  className="bg-primary px-6 py-2 rounded-lg hover:bg-primary/90"
                >
                  Imprimir Factura
                </button>
              </div>
            </>
          )}
        </section>
      </main>
      <footer className="print:hidden">
        <UserFooter />
      </footer>
    </div>
  )
}