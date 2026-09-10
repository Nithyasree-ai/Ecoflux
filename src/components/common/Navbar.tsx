import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, LayoutDashboard, Cpu, Activity, Menu, X, ArrowRight } from 'lucide-react';
import { useEcoFlux } from '../../lib/dataStore';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useEcoFlux();

  const navLinks = [
    { name: 'Overview', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'What-If Simulator', path: '/simulator' },
    { name: 'AI Copilot', path: '/copilot' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#050a08]/80 border-b border-emerald-500/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-black fill-black" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-wider text-white flex items-center gap-1.5">
                ECO<span className="text-emerald-400">FLUX</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Campus
                </span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-tight hidden sm:inline">
                Smart Energy OS
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-black font-semibold text-sm hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all transform hover:-translate-y-0.5"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Open Dashboard</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-semibold text-sm hover:opacity-95 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#07100c] border-b border-emerald-500/20 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:text-white hover:bg-emerald-500/10"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-emerald-500/10 flex flex-col gap-2">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 text-black font-semibold text-sm"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Open Dashboard</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-emerald-500/30 text-white text-sm font-semibold"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-emerald-500 text-black text-sm font-semibold"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
