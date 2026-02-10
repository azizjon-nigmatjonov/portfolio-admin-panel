import i18n from 'i18next';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

const defaultNS = 'common';

void i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    defaultNS,
    lng: 'ru',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    ns: [defaultNS],
    backend: {
      loadPath: '/locales/{{lng}}.json',
      parse: (data: string | Record<string, unknown>) => {
        const parsed =
          typeof data === 'string' ? (JSON.parse(data) as Record<string, Record<string, string>>) : data;
        return (parsed[defaultNS] ?? parsed) as Record<string, string>;
      },
    },
  });

export default i18n;
