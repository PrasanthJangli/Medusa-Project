
type ProductTranslation = {
  te: string
  hi: string
}

type ProductDescriptionTranslation = {
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
    hi: "नाइकी ఎయిర్ మ్యాక్స్",
  },
}

const productDescriptionTranslations: Record<
  string,
  ProductDescriptionTranslation
> = {
  "medusa sweatshirt": {
    te: "క్లాసిక్ స్వెట్‌షర్ట్ అనుభూతిని మళ్లీ ఆస్వాదించండి. మా కాటన్ స్వెట్‌షర్ట్‌తో, రోజువారీ దుస్తులు ఇకపై సాధారణంగా ఉండాల్సిన అవసరం లేదు.",
    hi: "क्लासिक स्वेटशर्ट के एहसास को फिर से अनुभव करें। हमारे कॉटन स्वेटशर्ट के साथ, रोज़मर्रा के कपड़े अब साधारण नहीं रहेंगे।",
  },

  "medusa sweatpants": {
    te: "క్లాసిక్ స్వెట్‌ప్యాంట్స్ అనుభూతిని మళ్లీ ఆస్వాదించండి. మా కాటన్ స్వెట్‌ప్యాంట్స్‌తో, రోజువారీ దుస్తులు ఇకపై సాధారణంగా ఉండాల్సిన అవసరం లేదు.",
    hi: "क्लासिक स्वेटपैंट्स के एहसास को फिर से अनुभव करें। हमारे कॉटन स्वेटपैंट्स के साथ, रोज़मर्रा के कपड़े अब साधारण नहीं रहेंगे।",
  },

  "medusa t-shirt": {
    te: "క్లాసిక్ టీ-షర్ట్ అనుభూతిని మళ్లీ ఆస్వాదించండి. మా కాటన్ టీ-షర్ట్‌లతో, రోజువారీ దుస్తులు ఇకపై సాధారణంగా ఉండాల్సిన అవసరం లేదు.",
    hi: "क्लासिक टी-शर्ट के एहसास को फिर से अनुभव करें। हमारी कॉटन टी-शर्ट के साथ, रोज़मर्रा के कपड़े अब साधारण नहीं रहेंगे।",
  },

  "medusa shorts": {
    te: "క్లాసిక్ షార్ట్స్ అనుభూతిని మళ్లీ ఆస్వాదించండి. మా కాటన్ షార్ట్స్‌తో, రోజువారీ దుస్తులు ఇకపై సాధారణంగా ఉండాల్సిన అవసరం లేదు.",
    hi: "क्लासिक शॉर्ट्स के एहसास को फिर से अनुभव करें। हमारे कॉटन शॉर्ट्स के साथ, रोज़मर्रा के कपड़े अब साधारण नहीं रहेंगे।",
  },

  "nike air max": {
    te: "సౌకర్యవంతమైన రన్నింగ్ షూ.",
    hi: "आरामदायक रनिंग शू।",
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

export function translateProductDescription(
  title: string,
  description: string,
  locale: string
): string {
  const normalizedTitle = title.trim().toLowerCase()
  const translation =
    productDescriptionTranslations[normalizedTitle]

  if (!translation) {
    return description
  }

  switch (locale) {
    case "te":
      return translation.te

    case "hi":
      return translation.hi

    default:
      return description
  }
}
