import common_en from "./en/common.json";
import common_es from "./es/common.json";

import private_en from "./en/private.json";
import private_es from "./es/private.json";

import public_en from "./en/public.json";
import public_es from "./es/public.json";

import { initReactI18next } from "react-i18next"; 
import i18n from 'i18next';
import { initLang } from "../global/Misc";

declare module 'i18next' {
    interface CustomTypeOptions {
        returnNull: false;
    }
}
i18n.use(initReactI18next)
    .init({

        interpolation: { escapeValue: false },
        lng: initLang(),

        fallbackLng: ["en", "es"],
        ns: ['common', 'public', 'private'],
        defaultNS: 'common',

        keySeparator: ".",
        nsSeparator: '.',
        debug: false,
        saveMissingTo: 'all',
        returnNull: false,
        resources: {
            en: {
                public: public_en,
                common: common_en,
                private: private_en,
            },
            es: {
                public: public_es,
                common: common_es,
                private: private_es
            },
        },
    });
export default i18n;