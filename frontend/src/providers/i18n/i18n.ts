import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
	en: {
		translation: {
			welcomeMessage: "Welcome to Wanderly",
		},
	},
	pt_br: {
		translation: {
			welcomeMessage: "Bem-vindo ao Wanderly!",
		},
	},
};

i18n.use(initReactI18next).init({
	resources,
	lng: "en",

	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
