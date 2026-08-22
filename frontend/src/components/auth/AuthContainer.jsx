import React, { useState } from 'react';
import { Login } from './Login';
import { useAuth } from '../../context/AuthContext';
import { Globe, ChevronDown, CheckCircle2 } from 'lucide-react';

export const AuthContainer = () => {
  const { signup, isLoading, addToast } = useAuth();
  const [viewState, setViewState] = useState('login');

  // Register State
  const [registerData, setRegisterData] = useState({ fullName: '', email: '', mobile: '', password: '' });
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerErrors, setRegisterErrors] = useState({});

  // Forgot Password State
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotIdentifierError, setForgotIdentifierError] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotPasswordErrors, setForgotPasswordErrors] = useState({});

  const switchView = (view) => {
    setViewState(view);
    setRegisterErrors({});
    setForgotStep(1);
    setForgotIdentifierError('');
    setOtpError('');
    setForgotPasswordErrors({});
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!registerData.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!registerData.email.trim()) errors.email = 'Email address is required';
    if (!registerData.mobile.trim()) errors.mobile = 'Mobile number is required';
    if (!registerData.password || registerData.password.length < 6) errors.password = 'Password must be at least 6 characters';

    if (Object.keys(errors).length > 0) {
      setRegisterErrors(errors);
      return;
    }

    try {
      await signup(registerData);
    } catch (err) {
      // Handled via AuthContext
    }
  };

  if (viewState === 'login') {
    return (
      <Login
        onSwitchToSignUp={() => switchView('register')}
        onOpenForgotPassword={() => switchView('forgot')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="bg-white w-full max-w-[1100px] h-auto md:h-[750px] rounded-[2.5rem] p-2 flex flex-col md:flex-row shadow-2xl overflow-hidden">
        {/* LEFT SIDE VISUAL */}
        <div className="relative w-full md:w-1/2 h-[300px] md:h-full rounded-[2rem] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1000&auto=format&fit=crop')`
            }}
          />
          <div className="absolute inset-0 bg-black/30 pointer-events-none" />
          <div className="absolute top-8 left-8 right-8 flex justify-between items-center text-white z-10">
            <span className="text-sm font-semibold tracking-wide">Selected Works</span>
            <button
              onClick={() => switchView('login')}
              className="border border-white rounded-full px-5 py-1.5 hover:bg-white/20 transition-all text-sm font-medium cursor-pointer"
            >
              Login
            </button>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="w-full md:w-1/2 flex flex-col justify-between px-8 py-10 md:px-16 md:py-12 relative bg-white">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-black tracking-tighter uppercase text-slate-900">PRICELENS</span>
            <button className="border border-gray-200 rounded-full px-4 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 flex items-center gap-1">
              <span>🇬🇧 EN</span>
              <span className="text-xs">⌄</span>
            </button>
          </div>

          <div className="my-auto py-4">
            {viewState === 'register' && (
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Create Account</h1>
                <p className="text-gray-500 text-sm mb-6">Join PriceLens to compare prices and buy smarter.</p>
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={registerData.fullName}
                    onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-5 py-4 text-gray-800 placeholder-gray-400 focus:border-gray-400 outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-5 py-4 text-gray-800 placeholder-gray-400 focus:border-gray-400 outline-none"
                  />
                  <input
                    type="tel"
                    placeholder="Mobile Number (10 digits)"
                    value={registerData.mobile}
                    onChange={(e) => setRegisterData({ ...registerData, mobile: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-5 py-4 text-gray-800 placeholder-gray-400 focus:border-gray-400 outline-none"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-5 py-4 text-gray-800 placeholder-gray-400 focus:border-gray-400 outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full bg-[#E94E44] hover:bg-[#d6453b] text-white rounded-full py-4 text-lg font-bold shadow-lg mt-2 cursor-pointer"
                  >
                    Sign Up
                  </button>
                </form>
                <div className="text-center text-sm text-gray-500 font-medium mt-6">
                  Already have an account?{' '}
                  <button onClick={() => switchView('login')} className="text-[#E94E44] font-bold hover:underline">
                    Login
                  </button>
                </div>
              </div>
            )}

            {viewState === 'forgot' && (
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Reset Password</h1>
                <p className="text-gray-500 text-xs mb-6">Enter your email or mobile to receive an OTP.</p>
                {forgotStep === 1 && (
                  <form onSubmit={(e) => { e.preventDefault(); setForgotStep(2); }} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Email or Mobile Number"
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-5 py-4 text-gray-800 outline-none"
                    />
                    <button type="submit" className="w-full bg-[#E94E44] text-white rounded-full py-4 font-bold">
                      Send OTP
                    </button>
                  </form>
                )}
                {forgotStep === 2 && (
                  <form onSubmit={(e) => { e.preventDefault(); setForgotStep(3); }} className="space-y-4">
                    <input
                      type="text"
                      placeholder="6-Digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-5 py-4 text-center font-bold tracking-widest text-gray-800 outline-none"
                    />
                    <button type="submit" className="w-full bg-[#E94E44] text-white rounded-full py-4 font-bold">
                      Verify OTP
                    </button>
                  </form>
                )}
                {forgotStep === 3 && (
                  <form onSubmit={(e) => { e.preventDefault(); setForgotStep(4); }} className="space-y-4">
                    <input
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-5 py-4 text-gray-800 outline-none"
                    />
                    <button type="submit" className="w-full bg-[#E94E44] text-white rounded-full py-4 font-bold">
                      Reset Password
                    </button>
                  </form>
                )}
                {forgotStep === 4 && (
                  <div className="text-center py-4 space-y-3">
                    <CheckCircle2 size={36} className="text-emerald-500 mx-auto" />
                    <p className="text-sm font-semibold text-gray-800">Password updated successfully!</p>
                    <button onClick={() => switchView('login')} className="w-full bg-[#E94E44] text-white rounded-full py-3.5 font-bold">
                      Back to Login
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
