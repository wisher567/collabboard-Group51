import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import collabboardLogo from '../assets/collabboard_logo.png';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  let navigate;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    navigate = useNavigate();
  } catch (e) {
    // In case rendered outside of Router in tests
    navigate = null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed. Please try again.');
      }

      setSuccess('Account created successfully! Redirecting to sign in...');
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        if (navigate) {
          navigate('/login');
        } else {
          window.location.href = '/login';
        }
      }, 1500);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex selection:bg-primary-fixed selection:text-on-primary-fixed w-full">
      {/* Left Form Section */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-surface z-10 relative min-h-screen py-10">
        <div className="mx-auto w-full max-w-sm lg:max-w-md text-left">
          <div className="mb-8">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
              <img
                src={collabboardLogo}
                alt="CollabBoard Logo"
                className="w-8 h-8 rounded object-contain shadow-sm"
              />
              <span className="font-headline-md text-headline-md text-primary font-bold tracking-tight text-xl">
                CollabBoard
              </span>
            </div>

            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2 font-bold tracking-tight">
              Create an account
              <span className="sr-only"> Register</span>
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant text-sm text-gray-600">
              Join the professional workspace and organize your projects efficiently.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-[10px] bg-error-container text-on-error-container text-sm font-medium border border-error/20 flex items-center gap-2 animate-fadeIn">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-5 p-3.5 rounded-[10px] bg-green-50 text-green-800 text-sm font-medium border border-green-200 flex items-center gap-2 animate-fadeIn">
              <span className="material-symbols-outlined text-base">check_circle</span>
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block font-label-md text-label-md text-on-surface mb-1.5 font-medium text-sm text-gray-700"
                htmlFor="name"
              >
                Full Name
              </label>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-[10px] border border-outline-variant bg-surface-container-lowest px-4 py-3 text-body-md font-body-md text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary-fixed focus:outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            <div>
              <label
                className="block font-label-md text-label-md text-on-surface mb-1.5 font-medium text-sm text-gray-700"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-[10px] border border-outline-variant bg-surface-container-lowest px-4 py-3 text-body-md font-body-md text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary-fixed focus:outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            <div>
              <label
                className="block font-label-md text-label-md text-on-surface mb-1.5 font-medium text-sm text-gray-700"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-[10px] border border-outline-variant bg-surface-container-lowest px-4 py-3 text-body-md font-body-md text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary-fixed focus:outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            <div>
              <label
                className="block font-label-md text-label-md text-on-surface mb-1.5 font-medium text-sm text-gray-700"
                htmlFor="confirm_password"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirm_password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full rounded-[10px] border border-outline-variant bg-surface-container-lowest px-4 py-3 text-body-md font-body-md text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary-fixed focus:outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-container text-on-primary-container font-label-md text-label-md py-3.5 rounded-[10px] hover:bg-surface-tint hover:text-on-primary shadow-[0px_2px_4px_rgba(26,37,64,0.05)] hover:shadow-[0px_8px_16px_rgba(26,37,64,0.08)] transition-all flex items-center justify-center gap-2 font-semibold cursor-pointer disabled:opacity-70"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </form>

          <p className="mt-8 text-center font-body-md text-body-md text-on-surface-variant text-sm text-gray-600">
            Already have an account?
            <a
              href="/login"
              onClick={(e) => {
                if (navigate) {
                  e.preventDefault();
                  navigate('/login');
                }
              }}
              className="font-label-md text-label-md text-primary hover:text-surface-tint transition-colors font-semibold ml-1.5"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>

      {/* Right Photographic/Testimonial Section */}
      <div className="hidden lg:block lg:w-[55%] relative bg-surface-container-low overflow-hidden min-h-screen">
        <img
          className="absolute inset-0 w-full h-full object-cover"
          alt="Office space collaboration around a glass whiteboard"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0ZpEICmPk5JILKhNnQ8TIzZkq7tHhP_hOGrxWWsP_qoI-oLf9iZTyV41aMzeeoZguVtuwhNQFUj5Up1Ndw--E8SGWIc36HoIg_nnbAogrdabg3ARzau-zJ3Qy9jK8ZJHY2kYBlnFrptilno3qZLBoWIBSekoF_zAOmH2-vBoEGGOXoNrOhpxXvCB2m3hh7t6T9luSo3kJpjtSIUpTuEmFopnGaEn4jFVlCtJWU7qylxlEgXO6O83_"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-on-secondary-fixed/40 to-transparent mix-blend-multiply" />
        <div className="absolute bottom-12 left-12 right-12 text-on-primary">
          <div className="max-w-lg backdrop-blur-md bg-inverse-surface/30 p-8 rounded-xl border border-white/10 shadow-[0px_8px_16px_rgba(26,37,64,0.08)] text-left">
            <p className="font-headline-sm text-headline-sm mb-4 leading-relaxed text-white text-base">
              "CollabBoard has entirely transformed how our engineering and product teams align. The clarity and density of information allow us to move faster without losing sight of the details."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-surface-container overflow-hidden border-2 border-white/20 shrink-0">
                <img
                  className="w-full h-full object-cover"
                  alt="Sarah Jenkins headshot"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwF7_jgtJdE9lw2NbK3JcuPSZi544rKRNvAwMcDi8dpUYjciYmqdpdSBNdYM7Apfc39hm2Wh3crFNPXE3UL2CvCMbYsp1TJlw3Zc-BoSX2YVxomSR7p6DwXav19nKOg12rR4LrqhdYjJILzbPoQjjT35Cc0vq6n_Zpmu44n0jqQjnx-yEJcf30LiwVJ4V7GvFvu0Ce3QjftPtjD-mgzil-20Pc4K0xZJA1O2gx8Ntnh9pE7jIeon9q"
                />
              </div>
              <div>
                <div className="font-label-md text-label-md font-bold text-white text-sm">Sarah Jenkins</div>
                <div className="font-body-md text-body-md text-white/80 text-xs">Director of Product, TechCorp</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}