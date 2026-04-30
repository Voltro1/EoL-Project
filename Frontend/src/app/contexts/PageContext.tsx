import { createContext, useState, useEffect, ReactNode } from 'react';
import type { Language } from '../translations';

export type Currency = 'LBP' | 'USD' | 'EUR';
export type MeasurementUnit = 'Watts' | 'Kilowatts' | 'kWh';

interface PageContextType {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  measurementUnit: MeasurementUnit;
  setMeasurementUnit: (unit: MeasurementUnit) => void;
}

export const PageContext = createContext<PageContextType>({
  currentPage: '/',
  setCurrentPage: () => {},
  language: 'English',
  setLanguage: () => {},
  currency: 'LBP',
  setCurrency: () => {},
  measurementUnit: 'Kilowatts',
  setMeasurementUnit: () => {}
});

export function PageProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState('/');
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('edl-language') as Language) || 'English';
  });
  const [currency, setCurrency] = useState<Currency>(() => {
    return (localStorage.getItem('edl-currency') as Currency) || 'LBP';
  });
  const [measurementUnit, setMeasurementUnit] = useState<MeasurementUnit>(() => {
    return (localStorage.getItem('edl-measurementUnit') as MeasurementUnit) || 'Kilowatts';
  });

  useEffect(() => {
    if (language === 'Arabic') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }, [language]);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('edl-language', lang);
  };

  const handleSetCurrency = (curr: Currency) => {
    setCurrency(curr);
    localStorage.setItem('edl-currency', curr);
  };

  const handleSetMeasurementUnit = (unit: MeasurementUnit) => {
    setMeasurementUnit(unit);
    localStorage.setItem('edl-measurementUnit', unit);
  };

  return (
    <PageContext.Provider value={{ 
      currentPage, setCurrentPage, 
      language, setLanguage: handleSetLanguage, 
      currency, setCurrency: handleSetCurrency,
      measurementUnit, setMeasurementUnit: handleSetMeasurementUnit
    }}>
      {children}
    </PageContext.Provider>
  );
}
