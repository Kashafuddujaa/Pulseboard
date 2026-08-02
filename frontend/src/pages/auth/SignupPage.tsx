import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import {
  validateSignup,
  type FormErrors,
  type SignupFormValues,
} from '@/lib/validation'

const INITIAL_VALUES: SignupFormValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

export function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [values, setValues] = useState<SignupFormValues>(INITIAL_VALUES)
  const [errors, setErrors] = useState<FormErrors<SignupFormValues>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const validationErrors = validateSignup(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setIsSubmitting(true)
    try {
      await signup(values.name, values.email, values.password)
      navigate('/dashboard', { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  const setField =
    (field: keyof SignupFormValues) => (e: ChangeEvent<HTMLInputElement>) =>
      setValues((v) => ({ ...v, [field]: e.target.value }))

  return (
    <Card>
      <CardContent className="p-6">
        <h1 className="mb-1 text-xl font-semibold text-text-primary">
          Create your workspace
        </h1>
        <p className="mb-6 text-sm text-text-secondary">
          Start monitoring your business metrics in minutes
        </p>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <Input
            label="Full name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={setField('name')}
            error={errors.name}
          />
          <Input
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            value={values.email}
            onChange={setField('email')}
            error={errors.email}
          />
          <Input
            label="Password"
            type="password"
            name="password"
            autoComplete="new-password"
            value={values.password}
            onChange={setField('password')}
            error={errors.password}
          />
          <Input
            label="Confirm password"
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={setField('confirmPassword')}
            error={errors.confirmPassword}
          />

          <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-accent hover:text-accent-hover">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
