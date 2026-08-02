import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg text-text-primary">
      <h1 className="text-3xl font-semibold">404</h1>
      <p className="text-text-secondary">This page doesn't exist.</p>
      <Link to="/dashboard" className="text-accent hover:text-accent-hover">
        Back to dashboard
      </Link>
    </div>
  )
}
