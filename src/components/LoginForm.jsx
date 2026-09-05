import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import collabboardLogo from '../assets/collabboard_logo.png';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  let navigate;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    navigate = useNavigate();
  } catch (e) {
    navigate = null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      localStorage.setItem('token', data.token);
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      window.dispatchEvent(new Event('storage'));

      if (navigate) {
        navigate('/dashboard');
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface min-h-screen w-full flex items-center justify-center p-4 selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Login Card Container */}
      <div className="bg-surface-container-lowest w-full max-w-[440px] rounded-2xl p-8 sm:p-10 shadow-[0px_4px_20px_rgba(26,37,64,0.06)] border border-outline-variant/30 flex flex-col items-center">
        {/* Logo Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <img
            alt="CollabBoard Logo"
            className="w-16 h-16 mb-4 object-contain"
            src={collabboardLogo}
          />
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-1 font-bold text-2xl md:text-3xl text-gray-900 tracking-tight">
            Welcome back
            <span className="sr-only"> Log In</span>
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant text-gray-500 text-sm">
            Please enter your details to sign in.
          </p>
        </div>

        {error && (
          <div className="w-full mb-5 p-3 rounded-lg bg-error-container text-on-error-container text-sm font-medium border border-error/20 flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4 text-left">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label
              className="font-label-md text-label-md text-on-surface block font-medium text-sm text-gray-700"
              htmlFor="email"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-outline text-[20px] text-gray-400">
                  mail
                </span>
              </div>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label
                className="font-label-md text-label-md text-on-surface block font-medium text-sm text-gray-700"
                htmlFor="password"
              >
                Password
              </label>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="font-label-md text-label-md text-primary hover:text-primary-container transition-colors text-xs font-semibold"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-outline text-[20px] text-gray-400">
                  lock
                </span>
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface transition-colors cursor-pointer text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-primary hover:bg-primary-container text-on-primary font-semibold py-3 rounded-lg transition-all flex justify-center items-center gap-2 active:scale-[0.98] cursor-pointer shadow-[0px_2px_4px_rgba(0,85,206,0.15)] disabled:opacity-70 text-sm"
          >
            <span>{loading ? 'Logging in...' : 'Log In'}</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-8 text-center w-full border-t border-outline-variant/30 pt-6">
          <p className="font-body-md text-body-md text-on-surface-variant text-gray-500 text-sm">
            Don't have an account?{' '}
            <a
              href="/register"
              onClick={(e) => {
                if (navigate) {
                  e.preventDefault();
                  navigate('/register');
                }
              }}
              className="text-primary font-semibold hover:underline decoration-primary/50 underline-offset-4 transition-all ml-1"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}