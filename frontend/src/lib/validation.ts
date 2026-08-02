const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface LoginFormValues {
  email: string
  password: string
}

export interface SignupFormValues {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export type FormErrors<T> = Partial<Record<keyof T, string>>

export function validateLogin(values: LoginFormValues): FormErrors<LoginFormValues> {
  const errors: FormErrors<LoginFormValues> = {}
  if (!values.email.trim()) errors.email = 'Email is required'
  else if (!EMAIL_RE.test(values.email)) errors.email = 'Enter a valid email address'
  if (!values.password) errors.password = 'Password is required'
  else if (values.password.length < 8)
    errors.password = 'Password must be at least 8 characters'
  return errors
}

export function validateSignup(
  values: SignupFormValues,
): FormErrors<SignupFormValues> {
  const errors: FormErrors<SignupFormValues> = {}
  if (!values.name.trim()) errors.name = 'Name is required'
  if (!values.email.trim()) errors.email = 'Email is required'
  else if (!EMAIL_RE.test(values.email)) errors.email = 'Enter a valid email address'
  if (!values.password) errors.password = 'Password is required'
  else if (values.password.length < 8)
    errors.password = 'Password must be at least 8 characters'
  if (values.confirmPassword !== values.password)
    errors.confirmPassword = 'Passwords do not match'
  return errors
}
