import { useEffect, useState } from "react";
import {
  Search,
  TrendingDown,
  ShoppingBag,
  Menu,
  X,
} from "lucide-react";

const navLinks = ["Home", "Compare", "Price History", "Deals"];

function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);

    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* ================= NAVBAR ================= */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/80 backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex items-center justify-between h-16 md:h-20">
          
          {/* Logo */}
          <a
            href="#"
            className={`text-white text-xl md:text-2xl font-semibold tracking-tight z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mounted
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4"
            }`}
          >
            PriceLens
          </a>

          {/* Desktop Navigation */}
          <div
            className={`hidden md:flex items-center gap-8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mounted
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4"
            }`}
            style={{
              transitionDelay: mounted ? "200ms" : "0ms",
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="text-white/70 text-sm hover:text-white transition-colors duration-300"
              >
                {link}
              </a>
            ))}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="px-5 py-2 rounded-full border border-white/20 text-white/90 text-sm hover:bg-white/10 transition-colors duration-300 flex items-center gap-2"
            >
              {menuOpen ? "Close" : "Explore"}
            </button>
          </div>

          {/* Desktop Search */}
          <div
            className={`hidden md:flex transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mounted
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4"
            }`}
            style={{
              transitionDelay: mounted ? "400ms" : "0ms",
            }}
          >
            <Search className="w-6 h-6 text-white/90" />
          </div>

          {/* Mobile Menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className={`md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5 z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mounted
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4"
            }`}
            style={{
              transitionDelay: mounted ? "200ms" : "0ms",
            }}
          >
            <span
              className={`w-6 h-[2px] bg-white transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                menuOpen
                  ? "rotate-45 translate-y-[4px]"
                  : ""
              }`}
            />

            <span
              className={`w-6 h-[2px] bg-white transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                menuOpen
                  ? "-rotate-45 -translate-y-[4px]"
                  : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* ================= FULL SCREEN MENU ================= */}
      <div
        className={`fixed inset-0 z-40 bg-black flex flex-col items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          menuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }`}
      >
        <div className="flex flex-col items-center gap-8">
          {["Home", "Compare", "Price History", "Deals"].map(
            (link, index) => (
              <a
                key={link}
                href="#"
                onClick={() => setMenuOpen(false)}
                className={`font-instrument text-4xl md:text-6xl text-white hover:opacity-60 transition-all duration-600 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                  menuOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
                style={{
                  transitionDelay: menuOpen
                    ? `${150 + index * 80}ms`
                    : "0ms",
                }}
              >
                {link}
              </a>
            )
          )}
        </div>
      </div>

      {/* ================= HERO ================= */}
      <section className="relative w-full h-screen overflow-hidden flex items-end justify-center bg-black">

        {/* Full-bleed motion background */}
        <div className="absolute inset-0">
          <video
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260820_010308_b1636845-4c15-4ab6-b0c9-9a29bfb0c6e3.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover object-bottom"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-16 md:pb-24">
          
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* LEFT */}
            <div className="text-center lg:text-left min-w-0">
              
              <p
                className={`text-blue-400 text-xs md:text-sm uppercase tracking-[0.25em] mb-5 transition-all duration-900 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  mounted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{
                  transitionDelay: mounted ? "300ms" : "0ms",
                }}
              >
                Smarter Shopping
              </p>

              <h1
                className={`font-instrument text-white text-[2.8rem] leading-[0.92] sm:text-5xl md:text-6xl lg:text-7xl mb-5 md:mb-6 transition-all duration-900 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  mounted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{
                  transitionDelay: mounted ? "400ms" : "0ms",
                }}
              >
                Know the price.
                <br className="hidden sm:block" />
                Know the deal.
              </h1>

              <p
                className={`text-white/60 text-base md:text-lg mb-8 md:mb-10 max-w-md mx-auto lg:mx-0 transition-all duration-900 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  mounted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{
                  transitionDelay: mounted ? "600ms" : "0ms",
                }}
              >
                Compare prices, track price history, and
                discover whether you're actually getting a
                good deal.
              </p>

              {/* Search */}
              <div
                className={`max-w-xl mx-auto lg:mx-0 transition-all duration-900 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  mounted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{
                  transitionDelay: mounted ? "800ms" : "0ms",
                }}
              >
                <div className="flex items-center gap-3 p-1.5 bg-white rounded-full">
                  <Search className="w-5 h-5 ml-4 text-black/40" />

                  <input
                    type="text"
                    placeholder="Search a product or paste a link..."
                    className="flex-1 bg-transparent outline-none text-black text-sm md:text-base placeholder:text-black/40 min-w-0"
                  />

                  <button className="px-6 py-3 bg-black text-white text-sm font-medium rounded-full hover:bg-black/80 transition-colors duration-300">
                    Compare
                  </button>
                </div>
              </div>

            </div>

            {/* RIGHT — PRODUCT INTELLIGENCE CARD */}
            <div
              className={`relative transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] flex justify-center lg:justify-end ${
                mounted
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-10 scale-95"
              }`}
              style={{
                transitionDelay: mounted ? "500ms" : "0ms",
              }}
            >
              <ProductCard />
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="w-full py-20 md:py-32 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-instrument text-4xl md:text-5xl text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-white/60 text-lg">
              Everything you need to shop smarter
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Price Comparison', desc: 'Compare prices across stores in real-time.' },
              { title: 'Price History', desc: 'Understand historical pricing trends.' },
              { title: 'Smart Deal Score', desc: 'Know whether a deal is actually good.' },
              { title: 'Price Alerts', desc: 'Get notified when prices drop.' },
              { title: 'Coupons & Offers', desc: 'Discover available savings.' },
              { title: 'Wishlist', desc: 'Track products you want to buy later.' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white/[0.06] border border-white/10 backdrop-blur-xl rounded-2xl p-6 hover:border-blue-400/30 transition-all duration-300">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 border border-blue-400/20">
                  <span className="text-blue-400">✨</span>
                </div>
                <h3 className="text-white text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/60 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="w-full py-20 md:py-32 px-6 bg-gradient-to-b from-black to-blue-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-instrument text-4xl md:text-5xl text-white mb-4">
            Before You Buy, Check Price Lens
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            Compare smarter. Understand the price. Buy with confidence.
          </p>
          <button className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300">
            Start Comparing
          </button>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="w-full py-12 px-6 border-t border-white/10 bg-black/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <p className="font-semibold text-white mb-2">PriceLens</p>
              <p className="text-white/60 text-sm">Compare prices. Shop smarter.</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-4">Product</p>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><a href="#" className="hover:text-white transition">Compare</a></li>
                <li><a href="#" className="hover:text-white transition">Deals</a></li>
                <li><a href="#" className="hover:text-white transition">Price History</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white mb-4">Company</p>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white mb-4">Legal</p>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-white/50 text-sm">
            © 2024 Price Lens. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}

function ProductCard() {
  return (
    <div className="relative w-full max-w-sm">
      {/* Card */}
      <div className="bg-white/[0.06] border border-white/10 backdrop-blur-xl rounded-[28px] p-6 md:p-7 shadow-2xl">
        
        {/* Product Header */}
        <div className="flex items-start justify-between mb-7">
          <div>
            <p className="text-white/40 text-xs uppercase tracking-wider mb-2">
              Product
            </p>

            <h3 className="text-white text-lg font-medium">
              Sony WH-1000XM5
            </h3>

            <p className="text-white/40 text-sm mt-1">
              Wireless Headphones
            </p>
          </div>

          <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-white/80" />
          </div>
        </div>

        {/* Best Price */}
        <div className="bg-white rounded-2xl p-5 text-black mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-black/50 text-xs uppercase tracking-wider">
              Best Price
            </span>

            <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
              Best Deal
            </span>
          </div>

          <div className="flex items-end justify-between">
            <span className="text-3xl md:text-4xl font-semibold tracking-tight">
              ₹27,990
            </span>

            <span className="text-green-600 text-sm font-medium flex items-center gap-1 mb-1">
              <TrendingDown className="w-4 h-4" />
              ₹3,000
            </span>
          </div>
        </div>

        {/* Stores */}
        <div className="space-y-2">
          
          <StoreRow
            name="Amazon"
            price="₹29,990"
          />

          <StoreRow
            name="Flipkart"
            price="₹27,990"
            best
          />

          <StoreRow
            name="Croma"
            price="₹31,490"
          />

        </div>

        {/* Deal Score */}
        <div className="mt-5 pt-5 border-t border-white/10 flex items-center justify-between">
          <div>
            <p className="text-white/40 text-xs uppercase tracking-wider">
              PriceLens Score
            </p>

            <p className="text-white mt-1 text-sm">
              Excellent deal
            </p>
          </div>

          <div className="text-right">
            <span className="text-2xl font-semibold text-green-400">
              92
            </span>

            <span className="text-white/30 text-sm">
              /100
            </span>
          </div>
        </div>

      </div>

      {/* Floating badge */}
      <div className="absolute -right-4 md:-right-8 top-12 bg-green-500 text-black rounded-full px-4 py-2 text-xs font-semibold shadow-xl rotate-3">
        ↓ Price dropped today
      </div>

    </div>
  );
}

function StoreRow({
  name,
  price,
  best = false,
}) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-3 rounded-xl ${
        best
          ? "bg-white/[0.08] border border-green-400/20"
          : "bg-white/[0.03]"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
          <span className="text-white/70 text-xs font-semibold">
            {name.charAt(0)}
          </span>
        </div>

        <span className="text-white/70 text-sm">
          {name}
        </span>

        {best && (
          <span className="text-green-400 text-[10px] uppercase tracking-wider">
            Lowest
          </span>
        )}
      </div>

      <span className="text-white text-sm font-medium">
        {price}
      </span>
    </div>
  );
}

export default LandingPage;
