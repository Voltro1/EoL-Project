import { useContext } from 'react';
import { PageContext } from '../contexts/PageContext';
import { translations, type TranslationKey } from '../translations';

export function useTranslation() {
  const { language } = useContext(PageContext);

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.English[key];
  };

  return { t, language };
}
