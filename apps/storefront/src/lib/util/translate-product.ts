type ProductTranslation = {
  te: string
  hi: string
}

const productTranslations: Record<string, ProductTranslation> = {
  "medusa sweatshirt": {
    te: "మెడూసా స్వెట్‌షర్ట్",
    hi: "मेडुसा स्वेटशर्ट",
  },

  "medusa sweatpants": {
    te: "మెడూసా స్వెట్‌ప్యాంట్స్",
    hi: "मेडुसा स्वेटपैंट्स",
  },

  "medusa shorts": {
    te: "మెడూసా షార్ట్స్",
    hi: "मेडुसा शॉर्ट्स",
  },

  "medusa t-shirt": {
    te: "మెడూసా టీ-షర్ట్",
    hi: "मेडुसा टी-शर्ट",
  },

  "nike air max": {
    te: "నైక్ ఎయిర్ మ్యాక్స్",
    hi: "नाइकी एयर मैक्स",
  },
}

export function translateProductName(
  title: string,
  locale: string
): string {
  const normalizedTitle = title.trim().toLowerCase()

  const translation = productTranslations[normalizedTitle]

  if (!translation) {
    return title
  }

  switch (locale) {
    case "te":
      return translation.te

    case "hi":
      return translation.hi

    default:
      return title
  }
}