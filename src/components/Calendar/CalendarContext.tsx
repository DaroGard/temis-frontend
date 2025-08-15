import React, { createContext, useContext } from "react";
import { useCalendar } from "~/types/useCalendar";

// contexto
const CalendarContext = createContext<ReturnType<typeof useCalendar> | null>(null);

// proveedor
export const CalendarProvider = ({ children }: { children: React.ReactNode }) => {
  const calendar = useCalendar(); // init calendar
  return (
    <CalendarContext.Provider value={calendar}>
      {children}
    </CalendarContext.Provider>
  );
};

// hook de consumo
export const useCalendarContext = () => {
  const context = useContext(CalendarContext);
  if (!context) throw new Error("useCalendarContext must be used within CalendarProvider");
  return context;
};
