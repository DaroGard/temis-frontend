import { LucideIcon } from "lucide-react"

interface PricingCardProps {
  icon: LucideIcon
  title: string
  description: string
  benefits: string[]
  price: string
  gradient?: string
  dark?: boolean
  highlight?: boolean 
}

export default function PricingCard({
  icon: Icon,
  title,
  description,
  benefits,
  price,
  gradient,
  dark,
  highlight,
}: PricingCardProps) {
  return (
    <div
      className={`relative rounded-2xl shadow-lg overflow-hidden border transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl
        ${highlight ? "ring-4 ring-primary/40" : "border-slate-200"}
        ${dark ? "text-white" : "text-gray-900"}
      `}
      style={gradient ? { background: gradient } : {}}
    >
      {highlight && (
        <span className="absolute top-4 right-4 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
          Más popular
        </span>
      )}

      <div className="p-8 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`p-3 rounded-full ${
              dark ? "bg-white/20" : "bg-primary/10"
            }`}
          >
            <Icon className={`h-6 w-6 ${dark ? "text-white" : "text-primary"}`} />
          </div>
          <h3 className="text-xl font-bold">{title}</h3>
        </div>

        <p className={`text-sm mb-6 ${dark ? "text-gray-200" : "text-gray-600"}`}>
          {description}
        </p>

        <ul className="space-y-3 flex-1">
          {benefits.map((benefit, idx) => (
            <li
              key={idx}
              className="flex items-center gap-2 text-sm font-medium"
            >
              <span className="text-green-500">✓</span> {benefit}
            </li>
          ))}
        </ul>

        <div className="mt-8 mb-4">
          <span className="text-4xl font-extrabold">{price}</span>
          {!price.toLowerCase().includes("free") && (
            <span className="text-sm ml-1 opacity-80">/mo</span>
          )}
        </div>
        <a href="/checkoutPage">
          <button
            className={`w-full py-3 rounded-lg font-semibold transition-colors duration-200 
              ${
                highlight
                  ? "bg-primary text-white hover:bg-primary/90"
                  : dark
                  ? "bg-white text-primary hover:bg-gray-200"
                  : "bg-primary text-white hover:bg-primary/90"
              }
            `}
          >
            Suscribirse
          </button>
        </a>
      </div>
    </div>
  )
}