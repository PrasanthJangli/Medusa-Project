
"use client"

import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"
import { useLocale } from "next-intl"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const translations = {
  en: {
    welcome: "Welcome back",
    description: "Sign in to access an enhanced shopping experience.",
    verification: "We sent a verification link to",
    verifyEmail: "Please verify your email, then sign in.",
    email: "Email",
    password: "Password",
    validEmail: "Enter a valid email address.",
    signIn: "Sign in",
    notMember: "Not a member?",
    joinUs: "Join us",
  },
  te: {
    welcome: "తిరిగి స్వాగతం",
    description: "మెరుగైన షాపింగ్ అనుభవం కోసం సైన్ ఇన్ చేయండి.",
    verification: "మేము ధృవీకరణ లింక్‌ను ఈ ఇమెయిల్‌కు పంపాము:",
    verifyEmail: "దయచేసి మీ ఇమెయిల్‌ను ధృవీకరించి, సైన్ ఇన్ చేయండి.",
    email: "ఇమెయిల్",
    password: "పాస్‌వర్డ్",
    validEmail: "సరైన ఇమెయిల్ చిరునామాను నమోదు చేయండి.",
    signIn: "సైన్ ఇన్",
    notMember: "ఇంకా సభ్యులు కాలేదా?",
    joinUs: "చేరండి",
  },
  hi: {
    welcome: "वापस स्वागत है",
    description: "बेहतर खरीदारी अनुभव के लिए साइन इन करें।",
    verification: "हमने इस ईमेल पर सत्यापन लिंक भेजा है:",
    verifyEmail: "कृपया अपना ईमेल सत्यापित करें और फिर साइन इन करें।",
    email: "ईमेल",
    password: "पासवर्ड",
    validEmail: "एक मान्य ईमेल पता दर्ज करें।",
    signIn: "साइन इन करें",
    notMember: "अभी सदस्य नहीं हैं?",
    joinUs: "हमसे जुड़ें",
  },
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)
  const locale = useLocale()

  const t =
    translations[locale as keyof typeof translations] ?? translations.en

  return (
    <div
      className="flex w-full max-w-sm flex-col items-center"
      data-testid="login-page"
    >
      <h1 className="mb-6 text-large-semi uppercase">
        {t.welcome}
      </h1>

      <p className="mb-8 text-center text-base-regular text-ui-fg-base">
        {t.description}
      </p>

      {message?.state === "verification_required" && (
        <div
          className="mb-6 w-full rounded-rounded border border-ui-border-base bg-ui-bg-subtle p-4 text-center text-base-regular text-ui-fg-base"
          data-testid="login-verification-message"
        >
          {t.verification} <strong>{message.email}</strong>.
          {" "}{t.verifyEmail}
        </div>
      )}

      <form className="w-full" action={formAction}>
        <div className="flex w-full flex-col gap-y-2">
          <Input
            label={t.email}
            name="email"
            type="email"
            title={t.validEmail}
            autoComplete="email"
            required
            data-testid="email-input"
          />

          <Input
            label={t.password}
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
        </div>

        <ErrorMessage
          error={message?.state === "error" ? message.error : null}
          data-testid="login-error-message"
        />

        <SubmitButton data-testid="sign-in-button" className="mt-6 w-full">
          {t.signIn}
        </SubmitButton>
      </form>

      <span className="mt-6 text-center text-small-regular text-ui-fg-base">
        {t.notMember}{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="underline"
          data-testid="register-button"
        >
          {t.joinUs}
        </button>
        .
      </span>
    </div>
  )
}

export default Login
