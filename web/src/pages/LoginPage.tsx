import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../state/useAuth';
import { Eye, EyeOff, Mail, Lock, User, X } from 'lucide-react';

/* ---------------- Types ---------------- */

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/* ---------------- Inputs ---------------- */

interface InputProps {
  label: string;
  icon?: React.ReactNode;
  name: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({ label, icon, ...props }: InputProps) => (
  <div>
    <label className="mb-1 block text-[11px] font-medium text-zinc-400">{label}</label>
    <div className="relative">
      {icon && (
        <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-zinc-500">
          {icon}
        </span>
      )}
      <input
        {...props}
        className={`w-full ${
          icon ? 'pl-9' : 'pl-3'
        } rounded-lg border border-zinc-700 bg-zinc-950 py-2.5 pr-3 text-sm text-zinc-100 placeholder-zinc-500 transition-colors focus:border-zinc-500 focus:outline-none [&:-webkit-autofill]:[-webkit-background-clip:text] [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#111_inset]`}
      />
    </div>
  </div>
);

interface PasswordInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  show: boolean;
  toggle: () => void;
}

const PasswordInput = ({ value, onChange, show, toggle }: PasswordInputProps) => (
  <div>
    <label className="mb-1 block text-[11px] font-medium text-zinc-400">Password</label>
    <div className="relative">
      <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
      <input
        type={show ? 'text' : 'password'}
        name="password"
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2.5 pl-9 pr-9 text-sm text-zinc-100 placeholder-zinc-500 transition-colors focus:border-zinc-500 focus:outline-none"
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
      >
        {show ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  </div>
);

/* ---------------- Component ---------------- */

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* -------- Submit -------- */

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (isLogin) {
        // LOGIN
        await login(formData.email, formData.password);
        navigate('/');
      } else {
        // SIGNUP
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setSubmitting(false);
          return;
        }

        await register(formData.name, formData.email, formData.password);
        navigate('/');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-black px-4 py-8 pb-[20vh] md:items-center md:pt-8">
      {/* Card */}
      <div className="w-full max-w-85 overflow-hidden">
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
          {/* Header */}
          <div className="px-5 pb-3 pt-6 text-center">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100">
              <User size={18} className="text-black" />
            </div>
            <h1 className="text-lg font-semibold text-zinc-100">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="mt-1 text-xs text-zinc-400">{isLogin ? 'Sign in to continue' : 'Start shopping'}</p>
          </div>

          <div className="px-5 pb-6">
            {/* Toggle */}
            <div className="mb-5 flex rounded-lg border border-zinc-700 bg-zinc-900 p-1">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 rounded-md py-2 text-xs font-medium transition-all ${
                  isLogin ? 'bg-zinc-100 text-black' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-all ${
                  !isLogin ? 'bg-zinc-100 text-black' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {!isLogin && (
                <Input
                  label="Full Name"
                  icon={<User size={14} />}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              )}

              <Input
                label="Email"
                icon={<Mail size={14} />}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />

              <PasswordInput
                value={formData.password}
                onChange={handleChange}
                show={showPassword}
                toggle={() => setShowPassword(!showPassword)}
              />

              {!isLogin && (
                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              )}

              {isLogin && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-[10px] text-zinc-400 hover:text-zinc-200"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {error && (
                <p className="rounded-lg border border-rose-900/50 bg-rose-950/50 px-3 py-2 text-xs text-rose-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 w-full rounded-lg bg-zinc-100 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-zinc-200 disabled:opacity-60"
              >
                {submitting ? (isLogin ? 'Signing in...' : 'Creating account...') : isLogin ? 'Sign In' : 'Create Account'}
              </button>

              <p className="pt-3 text-center text-[11px] text-zinc-400">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-medium text-zinc-100 hover:text-zinc-300"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="relative w-full max-w-70 rounded-xl border border-zinc-700 bg-zinc-950 p-5">
            <button
              type="button"
              onClick={() => setShowForgot(false)}
              className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-200"
            >
              <X size={16} />
            </button>

            <div className="mb-4 text-center">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100">
                <Mail size={16} className="text-black" />
              </div>
              <h2 className="text-sm font-semibold text-zinc-100">Reset Password</h2>
              <p className="mt-0.5 text-[11px] text-zinc-400">We'll send you a reset link</p>
            </div>

            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="mb-3 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
              placeholder="you@example.com"
            />

            <button
              type="button"
              className="w-full rounded-lg bg-zinc-100 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
            >
              Send Reset Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
