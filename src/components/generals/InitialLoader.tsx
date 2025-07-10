import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function InitialLoader() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const MIN_DURATION = 1000
    const start = Date.now()

    const hideLoader = () => {
      const elapsed = Date.now() - start
      const remaining = MIN_DURATION - elapsed
      setTimeout(() => setIsVisible(false), remaining > 0 ? remaining : 0)
    }

    if (document.readyState === 'complete') {
      hideLoader()
    } else {
      window.addEventListener('load', hideLoader)
      return () => window.removeEventListener('load', hideLoader)
    }
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="flex flex-col items-center justify-center space-y-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
          >
            <motion.img
              src="/logo.png"
              alt="Logo"
              className="w-40 h-40"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            />
            <motion.div
              className="w-14 h-14 border-[6px] border-links border-t-transparent rounded-full animate-spin"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            />
            <motion.p
              className="text-lg font-semibold text-secondary animate-pulse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              Cargando...
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}