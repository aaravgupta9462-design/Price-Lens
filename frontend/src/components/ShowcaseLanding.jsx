import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { ArrowRight, ArrowDown, ShieldCheck, TrendingDown, Bell, Sparkles } from 'lucide-react';
import './ShowcaseLanding.css';

gsap.registerPlugin(ScrollTrigger);

const ShowcaseLanding = ({ onLaunchDashboard, onOpenAuth }) => {
  const rootRef = useRef(null);
  const deviceRef = useRef(null);
  const secondCardRef = useRef(null);
  const watermarkRef = useRef(null);
  const cursorRingRef = useRef(null);
  const cursorDotRef = useRef(null);

  const [showScrollCue, setShowScrollCue] = useState(true);
  const [showEngineCaption, setShowEngineCaption] = useState(false);

  // Custom trailing cursor
  useEffect(() => {
    const ring = cursorRingRef.current;
    const dot = cursorDotRef.current;
    if (!ring || !dot) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let rafId = null;

    const handleMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    };

    const tick = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      rafId = requestAnimationFrame(tick);
    };

    const handleHoverIn = (e) => {
      if (e.target.closest('button, a, [data-cursor-hover]')) {
        ring.classList.add('is-hover');
      }
    };
    const handleHoverOut = (e) => {
      if (e.target.closest('button, a, [data-cursor-hover]')) {
        ring.classList.remove('is-hover');
      }
    };

    window.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseover', handleHoverIn);
    document.addEventListener('mouseout', handleHoverOut);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseover', handleHoverIn);
      document.removeEventListener('mouseout', handleHoverOut);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Lenis smooth scroll + GSAP ScrollTrigger choreography
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', () => {
      ScrollTrigger.update();
      const y = window.scrollY;
      setShowScrollCue(y < 140);
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    const rafId = requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      // Chapter 1 -> Chapter 2: 3D device tilts & floating store/price chips burst out
      gsap.to(deviceRef.current, {
        rotateY: -18,
        rotateX: 8,
        scale: 1.04,
        scrollTrigger: {
          trigger: '#story-ch-2',
          start: 'top bottom',
          end: 'center center',
          scrub: 1.2,
        },
      });

      // Floating chips in Chapter 2
      gsap.to('.pl-chip-ch2', {
        opacity: 1,
        y: (i) => (i % 2 === 0 ? -36 : 28),
        x: (i) => (i % 2 === 0 ? -24 : 24),
        stagger: 0.08,
        scrollTrigger: {
          trigger: '#story-ch-2',
          start: 'top 80%',
          end: 'bottom 35%',
          scrub: 1,
        },
      });

      // Chapter 3: Centerpiece glides toward center, kinetic words sweep diagonally
      gsap.to(deviceRef.current, {
        x: -140,
        rotateY: 16,
        rotateX: -4,
        scale: 1.02,
        scrollTrigger: {
          trigger: '#story-ch-3',
          start: 'top bottom',
          end: 'center center',
          scrub: 1.2,
          onEnter: () => setShowEngineCaption(true),
          onLeave: () => setShowEngineCaption(false),
          onEnterBack: () => setShowEngineCaption(true),
          onLeaveBack: () => setShowEngineCaption(false),
        },
      });

      gsap.to(watermarkRef.current, {
        opacity: 0.12,
        scale: 1.1,
        scrollTrigger: {
          trigger: '#story-ch-3',
          start: 'top bottom',
          end: 'center center',
          scrub: 1,
        },
      });

      // Kinetic diagonal words
      gsap.fromTo(
        '.pl-kinetic-1',
        { opacity: 0, x: -240 },
        {
          opacity: 0.92,
          x: 180,
          scrollTrigger: {
            trigger: '#story-ch-3',
            start: 'top 85%',
            end: 'center 25%',
            scrub: 1,
          },
        }
      );

      gsap.fromTo(
        '.pl-kinetic-2',
        { opacity: 0, x: 260 },
        {
          opacity: 0.92,
          x: -160,
          scrollTrigger: {
            trigger: '#story-ch-3',
            start: 'center 85%',
            end: 'bottom 20%',
            scrub: 1,
          },
        }
      );

      // Fade out chips from ch2 before ch4
      gsap.to('.pl-chip-ch2', {
        opacity: 0,
        scrollTrigger: {
          trigger: '#story-ch-4',
          start: 'top 90%',
          end: 'top 50%',
          scrub: 1,
        },
      });

      // Chapter 4: Device settles back right, second comparison card slides in beside it
      gsap.to(deviceRef.current, {
        x: 30,
        rotateY: -10,
        rotateX: 4,
        scale: 0.96,
        scrollTrigger: {
          trigger: '#story-ch-4',
          start: 'top bottom',
          end: 'center center',
          scrub: 1.2,
        },
      });

      gsap.to(secondCardRef.current, {
        opacity: 1,
        y: 12,
        scale: 1,
        rotate: -4,
        scrollTrigger: {
          trigger: '#story-ch-4',
          start: 'top 75%',
          end: 'center center',
          scrub: 1.1,
        },
      });
    }, rootRef);

    return () => {
      ctx.revert();
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const scrollToChapter2 = () => {
    const el = document.getElementById('story-ch-2');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div ref={rootRef} className="pl-story-root">
      {/* Custom Precision Cursor */}
      <div ref={cursorRingRef} className="pl-story-cursor-ring" />
      <div ref={cursorDotRef} className="pl-story-cursor-dot" />

      {/* Floating Editorial Header */}
      <header className="pl-story-header">
        <div className="pl-story-header-left">
          <div className="pl-story-brand" onClick={onLaunchDashboard} data-cursor-hover>
            <img src="/logo.png" alt="PriceLens" />
            <span className="pl-story-brand-divider">×</span>
            <span className="pl-story-brand-tag">LIVE TELEMETRY</span>
          </div>
        </div>

        <div className="pl-story-header-right">
          {onOpenAuth && (
            <button type="button" className="pl-story-ghost-btn" onClick={onOpenAuth}>
              Sign in
            </button>
          )}
          <button type="button" className="pl-story-pill-btn" onClick={onLaunchDashboard}>
            <span>Open Dashboard</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </header>

      {/* Main Scroll-Telling Stage */}
      <div className="pl-story-stage">
        {/* Sticky 3D Viewport */}
        <div className="pl-story-sticky-viewport">
          <div ref={watermarkRef} className="pl-story-watermark">
            LENS
          </div>

          {/* Kinetic Diagonal Words */}
          <div className="pl-story-kinetic-layer">
            <div className="pl-story-kinetic-word pl-kinetic-1" style={{ top: '34%' }}>
              REAL-TIME
            </div>
            <div className="pl-story-kinetic-word pl-kinetic-2" style={{ top: '52%' }}>
              TELEMETRY
            </div>
          </div>

          <div className="pl-story-3d-anchor">
            {/* Floating Orbital Chips (Burst out during scroll) */}
            <div className="pl-story-float-chip pl-chip-ch2" style={{ top: '18%', right: '34%' }}>
              <span>Flipkart</span>
              <span className="mono">₹1,30,900</span>
            </div>
            <div className="pl-story-float-chip pl-chip-ch2" style={{ top: '24%', right: '7%' }}>
              <span>Amazon</span>
              <span className="mono">₹1,31,900</span>
            </div>
            <div className="pl-story-float-chip pl-chip-ch2 is-blurred" style={{ bottom: '24%', right: '38%' }}>
              <TrendingDown size={14} color="#dc2626" />
              <span className="warn">-22% Drop</span>
            </div>
            <div className="pl-story-float-chip pl-chip-ch2" style={{ bottom: '19%', right: '8%' }}>
              <ShieldCheck size={14} color="#059669" />
              <span>Direct Product URL</span>
            </div>

            {/* Second Comparison Card (Slides in at Chapter 4) */}
            <div ref={secondCardRef} className="pl-story-3d-second-card">
              <div className="pl-story-3d-prod-eyebrow">BANK OFFER MATH</div>
              <div className="pl-story-3d-prod-title" style={{ fontSize: '17px', marginTop: '4px' }}>
                Effective Checkout
              </div>
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="pl-story-3d-store-row winner" style={{ padding: '9px 11px' }}>
                  <div>
                    <div className="pl-story-3d-store-name">ICICI Card</div>
                    <div className="pl-story-3d-store-sub">Instant ₹2,500 Off</div>
                  </div>
                  <div className="pl-story-3d-store-price">₹1,28,400</div>
                </div>
                <div className="pl-story-3d-store-row" style={{ padding: '9px 11px' }}>
                  <div>
                    <div className="pl-story-3d-store-name">Fake MRP</div>
                    <div className="pl-story-3d-store-sub">Blocked by Audit</div>
                  </div>
                  <div className="pl-story-3d-store-price" style={{ textDecoration: 'line-through', opacity: 0.5 }}>
                    ₹1,44,900
                  </div>
                </div>
              </div>
            </div>

            {/* Primary 3D Device Centerpiece */}
            <div ref={deviceRef} className="pl-story-3d-device">
              <div className="pl-story-3d-device-top">
                <span style={{ fontWeight: 800, fontSize: '13px', letterSpacing: '-0.02em' }}>
                  PriceLens Audit
                </span>
                <span className="pl-story-3d-pill-live">LIVE</span>
              </div>

              <div className="pl-story-3d-device-product">
                <div className="pl-story-3d-prod-eyebrow">VERIFIED VARIANT</div>
                <div className="pl-story-3d-prod-title">iPhone 17 Pro (256 GB)</div>

                <div className="pl-story-3d-store-rows">
                  <div className="pl-story-3d-store-row winner">
                    <div>
                      <div className="pl-story-3d-store-name">Flipkart</div>
                      <div className="pl-story-3d-store-sub">Best Price • In Stock</div>
                    </div>
                    <div className="pl-story-3d-store-price">₹1,30,900</div>
                  </div>

                  <div className="pl-story-3d-store-row">
                    <div>
                      <div className="pl-story-3d-store-name">Amazon</div>
                      <div className="pl-story-3d-store-sub">Prime • 1-Day Delivery</div>
                    </div>
                    <div className="pl-story-3d-store-price">₹1,31,900</div>
                  </div>
                </div>
              </div>

              <div className="pl-story-3d-mini-chart">
                <div className="pl-story-3d-chart-head">
                  <span>90-Day Price Curve</span>
                  <span className="pl-story-3d-chart-badge">LOWEST NOW</span>
                </div>
                <svg viewBox="0 0 220 52" width="100%" height="52">
                  <path
                    d="M 4 14 C 36 12, 54 28, 86 24 C 118 20, 144 8, 174 30 C 192 42, 204 44, 216 44"
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="216" cy="44" r="4" fill="#34d399" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Foreground Scroll-Telling Chapters */}
        <div className="pl-story-sections">
          {/* Chapter 1: Hero */}
          <section id="story-ch-1" className="pl-story-chapter">
            <div className="pl-story-copy-col">
              <span className="pl-story-eyebrow">SMART SHOPPING INTELLIGENCE</span>
              <h1 className="pl-story-h1">
                Track
                <br />
                Before
                <br />
                You Buy.
              </h1>
              <p className="pl-story-lead">
                Real-time price audits across Amazon &amp; Flipkart. Spot fake festive markups, inspect
                1-year price curves, and unlock verified lowest prices.
              </p>
              <div className="pl-story-cta-row">
                <button type="button" className="pl-story-pill-btn" onClick={onLaunchDashboard}>
                  <span>Compare Prices Now</span>
                  <ArrowRight size={15} />
                </button>
                <button type="button" className="pl-story-ghost-btn" onClick={scrollToChapter2}>
                  Explore the engine <ArrowDown size={13} style={{ display: 'inline', verticalAlign: 'middle' }} />
                </button>
              </div>
            </div>
          </section>

          {/* Chapter 2: Link-to-Audit */}
          <section id="story-ch-2" className="pl-story-chapter">
            <div className="pl-story-copy-col">
              <span className="pl-story-eyebrow">INSTANT URL RESOLUTION</span>
              <h2 className="pl-story-h2">
                Paste any Amazon or Flipkart link. Get both live prices in seconds.
              </h2>
              <p className="pl-story-lead">
                No more switching tabs or falling for inflated strike-through MRPs. PriceLens matches
                exact storage, colour, and model variants across stores and opens direct product pages.
              </p>
            </div>
          </section>

          {/* Chapter 3: The Engine (Kinetic Typography) */}
          <section id="story-ch-3" className="pl-story-chapter">
            <div className="pl-story-copy-col" style={{ opacity: 0.96 }}>
              <span className="pl-story-eyebrow">KEEPA-GRADE TELEMETRY</span>
              <h2 className="pl-story-h2">
                365-day price curves, bank card math, and instant drop alerts.
              </h2>
              <p className="pl-story-lead">
                See whether today&apos;s deal is genuinely the lowest price of the year — or a
                festive markup disguised as a discount.
              </p>
            </div>
          </section>

          {/* Chapter 4: Final Showcase & Launch */}
          <section id="story-ch-4" className="pl-story-chapter">
            <div className="pl-story-copy-col">
              <span className="pl-story-eyebrow">READY FOR YOUR NEXT PURCHASE</span>
              <h2 className="pl-story-h2">Two Stores. One Truth.</h2>
              <p className="pl-story-lead">
                Paste any product URL into PriceLens right now to compare live Amazon &amp; Flipkart
                checkout prices, card discounts, and historical lows.
              </p>

              <div className="pl-story-tags-row">
                <span className="pl-story-tag-pill">Live Price Audit</span>
                <span className="pl-story-tag-pill">1-Year History</span>
                <span className="pl-story-tag-pill">Fake Discount Guard</span>
                <span className="pl-story-tag-pill">Bank Card Math</span>
              </div>

              <div className="pl-story-cta-row">
                <button type="button" className="pl-story-pill-btn" onClick={onLaunchDashboard}>
                  <Sparkles size={15} />
                  <span>Launch PriceLens Dashboard</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Bottom Scroll Cue */}
      <div className="pl-story-scroll-cue" style={{ opacity: showScrollCue ? 1 : 0 }}>
        <span>SCROLL</span>
        <div className="pl-story-scroll-line" />
      </div>

      {/* Bottom-Right Engine Caption */}
      <div className={`pl-story-bottom-caption ${showEngineCaption ? 'visible' : ''}`}>
        <div className="pl-story-bottom-caption-title">
          <Bell size={11} style={{ display: 'inline', marginRight: '5px', verticalAlign: 'middle' }} />
          THE INTELLIGENCE ENGINE
        </div>
        <div className="pl-story-bottom-caption-body">
          Live multi-store scraping, variant guards, bank card discounts, and 365-day price telemetry.
        </div>
      </div>
    </div>
  );
};

export default ShowcaseLanding;
