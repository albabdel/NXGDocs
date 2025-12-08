import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "platform-fundamentals": {
        "what-is-gcxone-GCXONE": "What is GCXONE GCXONE?",
        "benefits": "Benefits",
        "hierarchy": "Hierarchy",
        "talos-integration": "Talos Integration",
        "glossary": "Glossary"
      },
      "account-management": {
        "onboarding-checklist": "Onboarding Checklist",
        "customer-setup": "Customer Setup",
        "site-setup": "Site Setup",
        "user-access": "User Access",
        "sync-troubleshooting": "Sync Troubleshooting"
      }
    }
  },
  de: {
    translation: {
      "platform-fundamentals": {
        "what-is-gcxone-GCXONE": "Was ist GCXONE GCXONE?",
        "benefits": "Vorteile",
        "hierarchy": "Hierarchie",
        "talos-integration": "Talos Integration",
        "glossary": "Glossar"
      },
      "account-management": {
        "onboarding-checklist": "Onboarding-Checkliste",
        "customer-setup": "Kunden-Setup",
        "site-setup": "Standort-Setup",
        "user-access": "Benutzerzugriff",
        "sync-troubleshooting": "Sync-Fehlerbehebung"
      }
    }
  },
  pl: {
    translation: {
      "platform-fundamentals": {
        "what-is-gcxone-GCXONE": "Co to jest GCXONE GCXONE?",
        "benefits": "Korzyści",
        "hierarchy": "Hierarchia",
        "talos-integration": "Integracja Talos",
        "glossary": "Słownik"
      },
      "account-management": {
        "onboarding-checklist": "Lista kontrolna dołączania",
        "customer-setup": "Konfiguracja klienta",
        "site-setup": "Konfiguracja witryny",
        "user-access": "Dostęp użytkownika",
        "sync-troubleshooting": "Rozwiązywanie problemów z synchronizacją"
      }
    }
  },
  es: {
    translation: {
      "platform-fundamentals": {
        "what-is-gcxone-GCXONE": "¿Qué es GCXONE GCXONE?",
        "benefits": "Beneficios",
        "hierarchy": "Jerarquía",
        "talos-integration": "Integración de Talos",
        "glossary": "Glosario"
      },
      "account-management": {
        "onboarding-checklist": "Lista de verificación de incorporación",
        "customer-setup": "Configuración del cliente",
        "site-setup": "Configuración del sitio",
        "user-access": "Acceso del usuario",
        "sync-troubleshooting": "Solución de problemas de sincronización"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;