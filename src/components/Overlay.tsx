"use client";

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';

const FeaturedInsights = dynamic(() => import('./FeaturedInsights'), {
  ssr: false,
});

export default function Overlay() {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastDateRef = useRef<string>('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      // Format time (HH:MM:SS)
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const newTime = `${hours}:${minutes}:${seconds}`;
      
      // Only update if changed
      setCurrentTime(prev => prev !== newTime ? newTime : prev);
      
      // Optimize date formatting - only update when day changes
      const dateKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
      if (lastDateRef.current !== dateKey) {
        const options: Intl.DateTimeFormatOptions = { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        };
        const newDate = now.toLocaleDateString('en-US', options);
        setCurrentDate(newDate);
        lastDateRef.current = dateKey;
      }
    };

    updateDateTime();
    timeIntervalRef.current = setInterval(updateDateTime, 1000);

    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
    };
  }, []);

  // Intersection Observer for CSS animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll(
      '.animate-up, .animate-holo-card, .animate-works-card, .animate-footer-card, .tech-stack-section'
    );
    
    animatedElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section className="hero-section">
        {/* HEADER */}
        <header className="header">
          <div className="logo">Studi<span>o</span></div>
          <nav className="nav-links">
            <span className="nav-item active">Home</span>
            <span className="nav-item">Projects</span>
            <span className="nav-item">About Me</span>
            <span className="nav-item">Certifications</span>
          </nav>
          <div className="header-actions">
            <button className="btn-outline">Account</button>
            <button className="btn-solid">Contact Me</button>
          </div>
        </header>

        {/* HERO LAYOUT */}
        <div className="hero-layout">
          
          {/* LEFT SIDE: Title and sub-text */}
          <div className="hero-left">
            <div className="title-glass-box">
              <h1 className="hero-title">Ayush <br/>Bhatia</h1>
            </div>

            <div>
              <div className="scroll-indicator">
                SCROLL
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M19 12l-7 7-7-7"/>
                </svg>
              </div>
              <p className="hero-subtitle">
                I design and develop interactive web experiences with a focus on<br/>
                performance, usability, and modern UI.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE: Stats and Widgets */}
          <div className="hero-right">
            <div className="stats-container">
              <div className="stat-item">
                <div className="stat-number">250+</div>
                <div className="stat-label">Problems Solved</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">3+</div>
                <div className="stat-label">Apps in Production</div>
              </div>
            </div>

            <div>
              <div className="projects-glass-box">
                <div className="project-time-date-full">
                  <h3 className="project-time-large">{currentTime}</h3>
                  <p className="project-date-small">{currentDate}</p>
                </div>
              </div>
              <div className="view-all">
                View All Projects 
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* NEW SCROLLING SECTION */}
      <section className="dark-studio-section" id="studio">
        <div className="studio-card animate-up">
          
          <div className="studio-top">
            {/* Top Left Time & Date Card */}
            <div className="holo-card time-card">
              <div className="holo-bg"></div>
              <div className="holo-content">
                <h3>Interactive<br/>Web Experiences</h3>
                <p>Designing and building smooth, engaging web interfaces with modern animations and real-time interactions.</p>
              </div>
              <button className="arrow-btn-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>

            {/* Top Right Art Studio */}
            <div className="art-studio-info">
              <h2>About Me</h2>
              <p>I am Ayush Bhatia currently pursuing Bachelors of Technology at Lovely Professional University. I am a full stack web developer having a hands on experience in currently ternding technologies. My focus is on creating mordern, interactive and scalable systems. My interest heavily lies in full stack web development, cloud infrastructure and sytem design. I focus on delivering clean, performant, and engaging user experiences.</p>
            </div>
          </div>

          <div className="studio-bottom">
            {/* Bottom Left Title */}
            <h2 className="interactive-title"><em>full stack <br/>web developer!</em></h2>

            {/* Bottom Right LinkedIn Pill */}
            <a 
              href="https://www.linkedin.com/in/ayush10023" 
              target="_blank" 
              rel="noopener noreferrer"
              className="team-pill linkedin-pill"
            >
              <div className="linkedin-icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              <p>Connect with me<br/>on LinkedIn</p>
              <button className="arrow-btn-white" onClick={(e) => e.preventDefault()}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </a>
          </div>
        </div>

        {/* SECOND SCROLLING CARD */}
        <div className="studio-card interact-card animate-up">
          <h2 className="interact-title">I build,<br /> therefore I evolve.</h2>
          <p className="interact-subtitle">Might be the new foundation of the 23st century</p>
          <button className="view-projects-btn">
            View All Projects 
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        {/* THIRD SCROLLING CARD: Holo Graphics Art Design */}
        <div className="studio-card animate-holo-card">
          <div className="holo-graphics-layout">
            <div className="holo-graphics-tall-img holo-img"></div>
            
            <div className="holo-graphics-right">
              <div className="holo-text-block">
                <h2 className="holo-main-title">Cloud IDE<br/>Web Based IDE</h2>
                <button className="view-projects-btn">
                  View All Projects 
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
              <div className="holo-graphics-wide-img holo-img"></div>
            </div>
          </div>
        </div>

        {/* REPEATED Holo Graphics Art Design Card */}
        <div className="studio-card animate-holo-card">
          <div className="holo-graphics-layout holo-graphics-layout-2">
            <div className="holo-graphics-tall-img holo-graphics-tall-img-2 holo-img"></div>
            
            <div className="holo-graphics-right">
              <div className="holo-text-block">
                <h2 className="holo-main-title">Stream<br/>Podcasting </h2>
                <button className="view-projects-btn">
                  View All Projects 
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
              <div className="holo-graphics-wide-img holo-graphics-wide-img-2 holo-img"></div>
            </div>
          </div>
        </div>

        {/* FOURTH SCROLLING CARD: Our Best Works */}
        <div className="studio-card animate-works-card" style={{ padding: '4rem' }}>
          <div className="works-header">
            <h2 className="works-title">Industry Experiences</h2>
            <button className="view-projects-btn works-btn">
              View All 
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '0.5rem' }}>
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
          
          <div className="works-grid">
            {/* Card 1 */}
            <div className="work-card">
              <div className="work-img-wrapper" style={{background: '#8bb8e8'}}>
                <div className="work-placeholder character-blue"></div>
              </div>
              <div className="work-info">
                <h4>Optical illusion of motion &rarr;</h4>
                <p style={{color: '#8bb8e8'}}>123 works</p>
              </div>
            </div>
            
            {/* Card 2 */}
            <div className="work-card">
              <div className="work-img-wrapper" style={{background: '#c5e063'}}>
                <div className="work-placeholder character-green"></div>
              </div>
              <div className="work-info">
                <h4>Optical illusion of motion &rarr;</h4>
                <p style={{color: '#c5e063'}}>123 works</p>
              </div>
            </div>
            
            {/* Card 3 */}
            <div className="work-card">
              <div className="work-img-wrapper" style={{background: '#eede84'}}>
                <div className="work-placeholder character-yellow"></div>
              </div>
              <div className="work-info">
                <h4>Optical illusion of motion &rarr;</h4>
                <p style={{color: '#eede84'}}>123 works</p>
              </div>
            </div>
            
            {/* Card 4 */}
            <div className="work-card">
              <div className="work-img-wrapper" style={{background: '#f2a6b6'}}>
                <div className="work-placeholder character-pink"></div>
              </div>
              <div className="work-info">
                <h4>Optical illusion of motion &rarr;</h4>
                <p style={{color: '#f2a6b6'}}>123 works</p>
              </div>
            </div>
          </div>
        </div>

        {/* FIFTH SCROLLING CARD: Tech Stack */}
        <div className="studio-card animate-tech-stack tech-stack-section" style={{ padding: '8rem 0', minHeight: '100vh' }}>
          <div className="clients-header">
            <h2 className="clients-title">Tech Stack</h2>
            <p className="clients-subtitle">Technologies I work with</p>
          </div>
          
          <div className="tech-stack-wrapper">
            {/* Row 1 - Scrolling Left to Right */}
            <div className="tech-row tech-row-1">
              <div className="client-logo tech-logo">
                <img src="/techStack/ReactLogo.png" alt="React" />
              </div>
              <div className="client-logo tech-logo">
                <img src="/techStack/next.png" alt="Next.js" />
              </div>
              <div className="client-logo tech-logo">
                <img src="/techStack/node.svg" alt="Node.js" />
              </div>
              <div className="client-logo tech-logo">
                <img src="/techStack/express.png" alt="Express.js" />
              </div>
            </div>
            
            {/* Row 2 - Scrolling Right to Left */}
            <div className="tech-row tech-row-2">
              <div className="client-logo tech-logo">
                <img src="/techStack/ts-logo-128.png" alt="TypeScript" />
              </div>
              <div className="client-logo tech-logo">
                <img src="/techStack/c++.svg" alt="C++" />
              </div>
              <div className="client-logo tech-logo">
                <img src="/techStack/postgres (2).png" alt="PostgreSQL" />
              </div>
              <div className="client-logo tech-logo">
                <img src="/techStack/drizzle.png" alt="Drizzle ORM" />
              </div>
              <div className="client-logo tech-logo">
                <img src="/techStack/redis-seeklogo.png" alt="Redis" />
              </div>
            </div>
            
            {/* Row 3 - Scrolling Left to Right */}
            <div className="tech-row tech-row-3">
              <div className="client-logo tech-logo">
                <img src="/techStack/pngfind.com-docker-logo-png-6835644.png" alt="Docker" />
              </div>
              <div className="client-logo tech-logo">
                <img src="/techStack/awslogo2.png" alt="AWS" />
              </div>
              <div className="client-logo tech-logo">
                <img src="/techStack/socketIO.png" alt="Socket.io" />
              </div>
              <div className="client-logo tech-logo">
                <img src="/techStack/jwt.svg" alt="JWT" />
              </div>
            </div>
            
            {/* Row 4 - Scrolling Right to Left */}
            <div className="tech-row tech-row-4">
              <div className="client-logo tech-logo">
                <img src="/techStack/github.png" alt="GitHub" />
                <span className="tech-label">GitHub</span>
              </div>
              <div className="client-logo tech-logo">
                <img src="/techStack/zustand.svg" alt="Zustand" />
                <span className="tech-label">Zustand</span>
              </div>
              <div className="client-logo tech-logo tech-logo-tailwind">
                <img src="/techStack/tailwind.svg" alt="Tailwind CSS" />
              </div>
              <div className="client-logo tech-logo">
                <img src="/techStack/bullmq.png" alt="BullMQ" />
              </div>
              <div className="client-logo tech-logo">
                <img src="/techStack/stripe.svg" alt="Stripe" />
              </div>
            </div>
          </div>
        </div>

        {/* NEW SCROLLING CARD: Stacked Papers - 3D Interactive */}
        <div className="studio-card stacked-papers-section" style={{ padding: '6rem 4rem', minHeight: '70vh', backgroundColor: '#151515', boxShadow: 'none' }}>
          <FeaturedInsights />
        </div>

        {/* SIXTH SCROLLING CARD: Contact / Footer */}
        <div className="studio-card animate-footer-card" style={{ padding: '0 4rem 4rem 4rem', backgroundColor: 'transparent', boxShadow: 'none' }}>
          <div className="contact-banner">
            <div className="contact-banner-top">
              <p className="contact-pretitle">Have a something in Mind?</p>
              <h2 className="contact-title">Get Connected</h2>
            </div>

            <div className="contact-btn-row">
               <button className="contact-btn">Contact us &rarr;</button>
            </div>

            <div className="contact-banner-bottom">
              <div className="contact-socials">
                <a href="#" className="social-icon" aria-label="Twitter">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="#" className="social-icon" aria-label="Instagram">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/ayush10023" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="social-icon" aria-label="Behance">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"/>
                  </svg>
                </a>
                <a href="#" className="social-icon" aria-label="Dribbble">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.628 0-12 5.373-12 12s5.372 12 12 12 12-5.373 12-12-5.372-12-12-12zm9.885 11.441c-2.575-.422-4.943-.445-7.103-.073-.244-.563-.497-1.125-.767-1.68 2.31-1 4.165-2.358 5.548-4.082 1.35 1.594 2.197 3.619 2.322 5.835zm-3.842-7.282c-1.205 1.554-2.868 2.783-4.986 3.68-1.016-1.861-2.178-3.676-3.488-5.438.779-.197 1.591-.314 2.431-.314 2.275 0 4.368.779 6.043 2.072zm-10.516-.993c1.331 1.742 2.511 3.538 3.537 5.381-2.43.715-5.331 1.082-8.684 1.105.692-2.835 2.601-5.193 5.147-6.486zm-5.44 8.834l.013-.256c3.849-.005 7.169-.448 9.95-1.322.233.475.456.952.67 1.432-3.38 1.057-6.165 3.222-8.337 6.48-1.432-1.719-2.296-3.927-2.296-6.334zm3.829 7.81c1.969-3.088 4.482-5.098 7.598-6.027.928 2.42 1.609 4.91 2.043 7.46-3.349 1.291-7.21.873-9.641-1.433zm11.586.43c-.438-2.353-1.08-4.653-1.92-6.897 1.876-.265 3.94-.196 6.199.196-.437 2.786-2.028 5.192-4.279 6.701z"/>
                  </svg>
                </a>
              </div>
              <div className="contact-legal">
                <span>Privacy Policy - Terms - Conditions - Cookies Policy</span>
              </div>
            </div>
          </div>
        </div>

      </section>
    </>
  );
}
