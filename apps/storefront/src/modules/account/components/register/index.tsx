
"use client"

import { useActionState } from "react"
import { useLocale } from "next-intl"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const translations = {
  en: {
    heading: "Become a Medusa Store Member",
    description: "Create your Medusa Store Member profile, and get access to an enhanced shopping experience.",
    verification: "We sent a verification link to",
    verifyEmail: "Please check your inbox to verify your email, then sign in.",
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    phone: "Phone",
    password: "Password",
    agreement: "By creating an account, you agree to Medusa Store's",
    privacy: "Privacy Policy",
    and: "and",
    terms: "Terms of Use",
    join: "Join",
    alreadyMember: "Already a member?",
    signIn: "Sign in",
  },
  te: {
    heading: "Medusa Store సభ్యుడిగా చేరండి",
    description: "మీ Medusa Store ప్రొఫైల్‌ను సృష్టించి మెరుగైన షాపింగ్ అనుభవాన్ని పొందండి.",
    verification: "మేము ధృవీకరణ లింక్‌ను ఈ ఇమెయిల్‌కు పంపాము:",
    verifyEmail: "మీ ఇమెయిల్‌ను ధృవీకరించడానికి ఇన్‌బాక్స్‌ను తనిఖీ చేసి, ఆపై సైన్ ఇన్ చేయండి.",
    firstName: "మొదటి పేరు",
    lastName: "చివరి పేరు",
    email: "ఇమెయిల్",
    phone: "ఫోన్ నంబర్",
    password: "పాస్‌వర్డ్",
    agreement: "ఖాతాను సృష్టించడం ద్వారా, మీరు Medusa Store యొక్క",
    privacy: "గోప్యతా విధానం",
    and: "మరియు",
    terms: "ఉపయోగ నిబంధనలను",
    join: "చేరండి",
    alreadyMember: "ఇప్పటికే సభ్యులా?",
    signIn: "సైన్ ఇన్",
  },
  hi: {
    heading: "Medusa Store के सदस्य बनें",
    description: "अपनी Medusa Store प्रोफ़ाइल बनाएँ और बेहतर खरीदारी अनुभव प्राप्त करें।",
    verification: "हमने इस ईमेल पर सत्यापन लिंक भेजा है:",
    verifyEmail: "अपना ईमेल सत्यापित करने के लिए इनबॉक्स देखें और फिर साइन इन करें।",
    firstName: "पहला नाम",
    lastName: "अंतिम नाम",
    email: "ईमेल",
    phone: "फ़ोन नंबर",
    password: "पासवर्ड",
    agreement: "खाता बनाकर, आप Medusa Store की",
    privacy: "गोपनीयता नीति",
    and: "और",
    terms: "उपयोग की शर्तों",
    join: "जुड़ें",
    alreadyMember: "पहले से सदस्य हैं?",
    signIn: "साइन इन करें",
  },
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)
  const locale = useLocale()
  const t = translations[locale as keyof typeof translations] ?? translations.en

  return (
    <div className="flex max-w-sm flex-col items-center" data-testid="register-page">
      <h1 className="mb-6 text-large-semi uppercase">{t.heading}</h1>

      <p className="mb-4 text-center text-base-regular text-ui-fg-base">
        {t.description}
      </p>

      {message?.state === "verification_required" && (
        <div
          className="mb-4 w-full rounded-rounded border border-ui-border-base bg-ui-bg-subtle p-4 text-center text-base-regular text-ui-fg-base"
          data-testid="register-verification-message"
        >
          {t.verification} <strong>{message.email}</strong>. {t.verifyEmail}
        </div>
      )}

      <form className="flex w-full flex-col" action={formAction}>
        <div className="flex w-full flex-col gap-y-2">
          <Input label={t.firstName} name="first_name" required autoComplete="given-name" data-testid="first-name-input" />
          <Input label={t.lastName} name="last_name" required autoComplete="family-name" data-testid="last-name-input" />
          <Input label={t.email} name="email" required type="email" autoComplete="email" data-testid="email-input" />
          <Input label={t.phone} name="phone" type="tel" autoComplete="tel" data-testid="phone-input" />
          <Input label={t.password} name="password" required type="password" autoComplete="new-password" data-testid="password-input" />
        </div>

        <ErrorMessage
          error={message?.state === "error" ? message.error : null}
          data-testid="register-error"
        />

        <span className="mt-6 text-center text-small-regular text-ui-fg-base">
          {t.agreement}{" "}
          <LocalizedClientLink href="/content/privacy-policy" className="underline">
            {t.privacy}
          </LocalizedClientLink>{" "}
          {t.and}{" "}
          <LocalizedClientLink href="/content/terms-of-use" className="underline">
            {t.terms}
          </LocalizedClientLink>.
        </span>

        <SubmitButton className="mt-6 w-full" data-testid="register-button">
          {t.join}
        </SubmitButton>
      </form>

      <span className="mt-6 text-center text-small-regular text-ui-fg-base">
        {t.alreadyMember}{" "}
        <button
          type="button"
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="underline"
        >
          {t.signIn}
        </button>.
      </span>
    </div>
  )
}

export default Register
