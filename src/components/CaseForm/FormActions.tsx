import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";

export function FormActions() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto px-6 pt-4 pb-10 flex justify-end gap-4"
    >
      {/* Botón Cancelar */}
      <button
        type="button"
        onClick={() => navigate({ to: "/cases" })}
        className="px-4 py-2 border border-slate-400 text-slate-700 rounded-md hover:border-slate-600 hover:text-slate-900 transition"
      >
        Cancelar
      </button>
      {/* Botón Guardar */}
      <button
        type="submit"
        className="px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-900 transition"
      >
        Guardar caso
      </button>
    </motion.div>
  );
}