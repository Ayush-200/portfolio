import ayushPhoto from './assets/ayush.png';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail, ArrowUpRight, Copy, Check } from 'lucide-react';

// ─── Animation Presets ────────────────────────────────────────────────────────
const ease = [0.16, 1, 0.3, 1] as const;

// Text reveal: children slide up through a clipped overflow-hidden parent
const textReveal = {
  hidden:  { y: '102%' },
  visible: { y: '0%', transition: { duration: 0.85, ease } },
};

// Fade + slight upward drift — used for supporting elements
const fadeUp = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease } },
};

// Container for staggered children
const stagger = (delay = 0.08) => ({
  hidden:  {},
  visible: { transition: { staggerChildren: delay, delayChildren: 0.05 } },
});

// Horizontal line grow — section dividers
const lineGrow = {
  hidden:  { scaleX: 0, originX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.8, ease } },
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const experience = {
  company:  'SwiftCause',
  role:     'Software Development Intern',
  period:   'Nov 2025 – Present',
  github:   'https://github.com/YNVSolutions/SwiftCause_Web',
  link:     'https://swift-cause-web.vercel.app',
  bullets: [
    'Led a team to build a full-stack fundraising platform using React and Node.js with Firebase, supporting 500+ concurrent users.',
    'Architected a scalable Feature-Sliced Design structure and developed RESTful APIs with RBAC and JWT, supporting 200+ simultaneous interactions.',
    'Integrated Stripe with webhook-based events, UK Gift Aid workflows, and automated emails via SendGrid — processing £50,000+ in donations monthly.',
    'Built real-time analytics dashboards and automated compliance reporting with Puppeteer, reducing manual effort by 80%.',
  ],
  metrics: [
    { label: 'Monthly Donations', value: '£50k+' },
    { label: 'Effort Reduced',    value: '80%'   },
    { label: 'Concurrent Users',  value: '500+'  },
  ],
  tags: ['React', 'Node.js', 'Firebase', 'Stripe', 'Puppeteer', 'SendGrid', 'JWT'],
};

const projects = [
  {
    number:   '01',
    name:     'Stream Talk',
    category: 'Real-time Communication',
    period:   'Nov 2025 – Present',
    github:   'https://github.com/Ayush-200/streamApp',
    link:     'https://streamapp-webapp.onrender.com',
    bullets: [
      'Engineered a real-time P2P video system supporting 50+ concurrent users with <200 ms latency via WebRTC and Socket.IO.',
      'Designed a WebSocket signaling server capable of 100+ session initiations per minute at 99.9% connection reliability.',
      'Integrated FFmpeg for adaptive bitrate streaming, cutting bandwidth usage by up to 40%.',
    ],
    tags: ['WebRTC', 'Socket.IO', 'FFmpeg', 'Node.js', 'MongoDB', 'AWS EC2'],
  },
  {
    number:   '02',
    name:     'CloudIDE',
    category: 'Cloud Architecture',
    period:   'Oct – Nov 2025',
    github:   'https://github.com/Ayush-200/cloudIDE_production',
    link:     'https://github.com/Ayush-200/cloudIDE_production',
    bullets: [
      'Built a cloud IDE running secure code in isolated Docker containers via AWS ECS Fargate — 100+ simultaneous users supported.',
      'Exposed RESTful APIs for project management, file ops, and execution control, handling 500+ requests per minute.',
      'Achieved zero security breaches across multi-tenant testing and 99.9% uptime through dynamic container provisioning.',
      'Rendered 1 000+ file-system entries under 2 s using React Arborist with Zustand state management.',
    ],
    tags: ['Docker', 'AWS ECS', 'Fargate', 'Next.js', 'TypeScript', 'Zustand'],
  },
];

const skills = [
  { label: 'Languages', items: ['C++', 'C', 'Java', 'Python', 'JavaScript', 'TypeScript'] },
  { label: 'Frontend',  items: ['React', 'Next.js', 'Tailwind CSS', 'Bootstrap'] },
  { label: 'Backend',   items: ['Node.js', 'Express.js', 'RESTful APIs', 'JWT'] },
  { label: 'Databases', items: ['PostgreSQL', 'MongoDB'] },
  { label: 'DevOps',    items: ['Docker', 'Google Cloud Run', 'CI/CD', 'Linux', 'AWS ECS'] },
  { label: 'Tools',     items: ['Git', 'Postman', 'Redis', 'Kafka', 'Socket.IO'] },
  { label: 'Concepts',  items: ['DSA', 'OOP', 'System Design', 'Microservices', 'Distributed Systems'] },
];

const education = {
  school:  'Lovely Professional University',
  degree:  'B.Tech · Computer Science & Engineering',
  period:  'Aug 2023 – Present',
  cgpa:    '8.92',
};

const certs = [
  { name: 'Cloud Computing',            issuer: 'NPTEL',          date: 'Oct 2025', href: 'https://drive.google.com/file/d/1rUKB_XEnmj2qYT1xbB0YUk-bez0WxxqF/view' },
  { name: 'Computer Networking',        issuer: 'Coursera',       date: 'Dec 2024', href: 'https://www.coursera.org/account/accomplishments/verify/JVG44IY8FB13' },
  { name: 'TCP/IP Advanced Protocols',  issuer: 'Coursera',       date: 'Dec 2024', href: 'https://www.coursera.org/account/accomplishments/verify/HWE2W4FA7T6J' },
  { name: 'Data Structures & Algorithms', issuer: 'Cipher Schools', date: 'Jul 2025', href: 'https://drive.google.com/file/d/14RPhK-8Fr9UH6-CYaSA4ET6JFfM9uwgg/view' },
];

// ─── Small reusable pieces ────────────────────────────────────────────────────

/** The thin horizontal rule that grows in from the left */
function SectionRule() {
  return (
    <motion.div
      variants={lineGrow}
      className="h-px bg-white/8 flex-1"
    />
  );
}

/** Section header: label + rule */
function SectionHeader({ label }: { label: string }) {
  return (
    <motion.div
      variants={stagger(0.12)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className="flex items-center gap-6 mb-16 md:mb-20"
    >
      <motion.span
        variants={fadeUp}
        className="font-mono text-[10px] tracking-[0.35em] text-subtle uppercase"
      >
        {label}
      </motion.span>
      <SectionRule />
    </motion.div>
  );
}

/** Pill tag */
function Tag({ label }: { label: string }) {
  return (
    <span className="font-mono text-[10px] tracking-wider px-3 py-1 rounded-full border border-white/8 text-subtle bg-surface">
      {label}
    </span>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = ['Experience', 'Projects', 'Skills', 'Education', 'Contact'];

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-canvas/85 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        {/* Monogram */}
        <a
          href="#hero"
          className="font-display font-bold text-sm tracking-widest text-text/80 hover:text-accent transition-colors duration-300"
        >
          AB
        </a>

        {/* Nav links — desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-xs tracking-widest text-subtle hover:text-text transition-colors duration-300 font-medium"
            >
              {link}
            </a>
          ))}
          <a
            href="mailto:ayushbhatia456@gmail.com"
            className="ml-4 text-xs tracking-widest font-semibold px-4 py-2 rounded-full border border-white/10 hover:border-accent/50 hover:text-accent transition-all duration-300 text-text/70"
          >
            Get in touch
          </a>
        </nav>
      </div>
    </motion.header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-16"
    >
      <div className="max-w-6xl mx-auto w-full px-6 md:px-10 py-24 md:py-32">
        <div className="grid md:grid-cols-[1fr_auto] gap-16 md:gap-24 items-center">

          {/* ── Left column ── */}
          <div>
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center gap-2.5 mb-10"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="font-mono text-[11px] tracking-widest text-subtle">
                Open to opportunities
              </span>
            </motion.div>

            {/* Role */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-mono text-[11px] tracking-[0.3em] text-subtle uppercase mb-5"
            >
              Software Engineer · Full-Stack
            </motion.p>

            {/* Name — editorial text reveal */}
            <div className="mb-10 overflow-hidden">
              <motion.h1
                variants={stagger(0.05)}
                initial="hidden"
                animate="visible"
                className="font-display font-extrabold leading-[0.88] tracking-tight"
                style={{ fontSize: 'clamp(64px, 13vw, 152px)' }}
              >
                {['AYUSH', 'BHATIA'].map((word) => (
                  <div key={word} className="overflow-hidden">
                    <motion.span variants={textReveal} className="block">
                      {word}
                    </motion.span>
                  </div>
                ))}
              </motion.h1>
            </div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65, ease }}
              className="text-subtle text-base md:text-lg leading-relaxed max-w-md mb-12 font-light"
            >
              Building scalable{' '}
              <span className="text-text/80">full-stack systems</span> &{' '}
              <span className="text-text/80">distributed architectures</span> —
              with an eye on the details that matter.
            </motion.p>

            {/* CTA row */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8, ease }}
              className="flex flex-wrap items-center gap-4 mb-14"
            >
              <a
                href="#projects"
                className="group flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-full bg-accent text-canvas hover:bg-accent/90 transition-colors duration-300"
              >
                View Work
                <ArrowUpRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
              <a
                href="mailto:ayushbhatia456@gmail.com"
                className="font-medium text-sm text-subtle hover:text-text transition-colors duration-300"
              >
                ayushbhatia456@gmail.com
              </a>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="flex items-center gap-5"
            >
              {[
                { href: 'https://github.com/Ayush-200',             icon: Github,   label: 'GitHub'   },
                { href: 'https://www.linkedin.com/in/ayush10023/', icon: Linkedin, label: 'LinkedIn' },
                { href: 'mailto:ayushbhatia456@gmail.com',          icon: Mail,     label: 'Email'    },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-ghost hover:text-subtle transition-colors duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </motion.div>
          </div>

          {/* ── Right column — Photo placeholder ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, delay: 0.4, ease }}
            className="hidden md:block"
          >
            <div
              className="relative rounded-[28px] overflow-hidden border border-white/8 bg-surface"
              style={{ width: 300, height: 380 }}
            >
              {/* Profile photo */}
              <img
                src={ayushPhoto}
                alt="Ayush Bhatia"
                className="absolute inset-0 w-full h-full object-cover object-top"
              />

              {/* Ornamental corner dots */}
              {['top-4 left-4', 'top-4 right-4', 'bottom-4 left-4', 'bottom-4 right-4'].map((pos) => (
                <div key={pos} className={`absolute ${pos} w-1 h-1 rounded-full bg-ghost`} />
              ))}

              {/* Subtle inner gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/4 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Small caption below photo */}
            <p className="mt-3 text-center font-mono text-[9px] tracking-widest text-ghost">
              Ayush Bhatia · Engineer
            </p>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-drift"
        >
          <div className="w-px h-10 bg-gradient-to-b from-ghost to-transparent" />
          <span className="font-mono text-[9px] tracking-widest text-ghost">scroll</span>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Experience ────────────────────────────────────────────────────────────────
function Experience() {
  return (
    <section id="experience" className="py-28 md:py-36">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <SectionHeader label="Experience" />

        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {/* Company header */}
          <div className="grid md:grid-cols-[1fr_auto] items-start gap-6 mb-12">
            <div>
              <motion.div variants={fadeUp} className="flex items-center gap-3 mb-2">
                <span className="font-mono text-[10px] tracking-widest text-subtle">{experience.period}</span>
              </motion.div>
              <div className="overflow-hidden">
                <motion.h2
                  variants={textReveal}
                  className="font-display font-bold tracking-tight leading-none mb-1"
                  style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}
                >
                  {experience.company}
                </motion.h2>
              </div>
              <motion.p variants={fadeUp} className="text-subtle text-sm font-medium mt-2">
                {experience.role}
              </motion.p>
            </div>

            {/* Links */}
            <motion.div variants={fadeUp} className="flex gap-3 pt-1 md:pt-8">
              <a
                href={experience.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-xs text-subtle hover:text-text border border-white/8 hover:border-white/20 rounded-full px-4 py-2 transition-all duration-300"
              >
                <Github size={13} />
                Source
              </a>
              <a
                href={experience.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-xs text-accent hover:text-text border border-accent/25 hover:border-accent/60 rounded-full px-4 py-2 transition-all duration-300"
              >
                <ArrowUpRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                Live
              </a>
            </motion.div>
          </div>

          {/* Metrics row */}
          <motion.div
            variants={stagger(0.08)}
            className="grid grid-cols-3 gap-4 mb-12 p-6 rounded-2xl bg-surface border border-white/5"
          >
            {experience.metrics.map((m) => (
              <motion.div key={m.label} variants={fadeUp} className="text-center">
                <p className="font-display font-bold text-gold mb-1" style={{ fontSize: 'clamp(22px, 4vw, 36px)' }}>
                  {m.value}
                </p>
                <p className="font-mono text-[9px] tracking-widest text-subtle uppercase">{m.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Bullets */}
          <motion.ul variants={stagger(0.07)} className="space-y-5 mb-10">
            {experience.bullets.map((b, i) => (
              <motion.li key={i} variants={fadeUp} className="flex gap-5 items-start">
                <span className="mt-[7px] shrink-0 w-1.5 h-1.5 rounded-full bg-accent/60" />
                <span className="text-text/75 leading-relaxed font-light">{b}</span>
              </motion.li>
            ))}
          </motion.ul>

          {/* Tags */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
            {experience.tags.map((t) => <Tag key={t} label={t} />)}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Projects ──────────────────────────────────────────────────────────────────
function Projects() {
  return (
    <section id="projects" className="py-28 md:py-36">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <SectionHeader label="Projects" />

        <div className="space-y-0">
          {projects.map((p, idx) => (
            <motion.article
              key={p.number}
              variants={stagger(0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              className={`grid md:grid-cols-[auto_1fr] gap-10 md:gap-16 py-16 md:py-20 ${
                idx < projects.length - 1 ? 'border-b border-white/5' : ''
              }`}
            >
              {/* Number */}
              <motion.div variants={fadeUp} className="hidden md:block">
                <span className="font-display font-bold text-ghost" style={{ fontSize: '4rem', lineHeight: 1 }}>
                  {p.number}
                </span>
              </motion.div>

              {/* Content */}
              <div>
                <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
                  <span className="font-mono text-[10px] tracking-widest text-subtle uppercase">{p.category}</span>
                  <div className="w-4 h-px bg-white/10" />
                  <span className="font-mono text-[10px] tracking-widest text-ghost">{p.period}</span>
                </motion.div>

                {/* Project name */}
                <div className="overflow-hidden mb-6">
                  <motion.h3
                    variants={textReveal}
                    className="font-display font-extrabold tracking-tight leading-none"
                    style={{ fontSize: 'clamp(28px, 4.5vw, 52px)' }}
                  >
                    {p.name}
                  </motion.h3>
                </div>

                <motion.p variants={fadeUp} className="font-mono text-[10px] text-ghost tracking-wider mb-8">
                  {p.tags.join(' · ')}
                </motion.p>

                {/* Bullets */}
                <motion.ul variants={stagger(0.07)} className="space-y-4 mb-8">
                  {p.bullets.map((b, i) => (
                    <motion.li key={i} variants={fadeUp} className="flex gap-5 items-start">
                      <span className="mt-[7px] shrink-0 w-1.5 h-1.5 rounded-full bg-accent/50" />
                      <span className="text-text/70 leading-relaxed font-light text-[15px]">{b}</span>
                    </motion.li>
                  ))}
                </motion.ul>

                {/* Tags + links */}
                <motion.div variants={fadeUp} className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex flex-wrap gap-2">
                    {p.tags.slice(0, 4).map((t) => <Tag key={t} label={t} />)}
                  </div>
                  <div className="flex gap-3">
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 text-xs text-subtle hover:text-text border border-white/8 hover:border-white/20 rounded-full px-4 py-2 transition-all duration-300"
                    >
                      <Github size={12} />
                      Source
                    </a>
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 text-xs text-accent border border-accent/25 hover:border-accent/60 rounded-full px-4 py-2 transition-all duration-300"
                    >
                      <ArrowUpRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      View
                    </a>
                  </div>
                </motion.div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Skills ────────────────────────────────────────────────────────────────────
function Skills() {
  return (
    <section id="skills" className="py-28 md:py-36">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <SectionHeader label="Skills" />

        <motion.div
          variants={stagger(0.06)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="space-y-0"
        >
          {skills.map((group, idx) => (
            <motion.div
              key={group.label}
              variants={fadeUp}
              className={`grid grid-cols-[100px_1fr] md:grid-cols-[180px_1fr] gap-6 py-6 items-baseline ${
                idx < skills.length - 1 ? 'border-b border-white/5' : ''
              }`}
            >
              <span className="font-mono text-[10px] tracking-widest text-subtle uppercase shrink-0">
                {group.label}
              </span>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="text-sm text-text/70 font-light"
                  >
                    {item}
                    <span className="text-ghost mx-2">·</span>
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Education ─────────────────────────────────────────────────────────────────
function Education() {
  return (
    <section id="education" className="py-28 md:py-36">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <SectionHeader label="Education & Certifications" />

        <div className="grid md:grid-cols-2 gap-8 md:gap-14">
          {/* Degree */}
          <motion.div
            variants={stagger(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            <motion.p variants={fadeUp} className="font-mono text-[10px] tracking-widest text-subtle mb-4">
              {education.period}
            </motion.p>
            <div className="overflow-hidden mb-2">
              <motion.h3
                variants={textReveal}
                className="font-display font-bold text-2xl md:text-3xl tracking-tight"
              >
                {education.school}
              </motion.h3>
            </div>
            <motion.p variants={fadeUp} className="text-subtle font-light mb-1">{education.degree}</motion.p>
            <motion.p variants={fadeUp} className="font-mono text-sm text-gold">{education.cgpa} CGPA</motion.p>
          </motion.div>

          {/* Certifications */}
          <motion.div
            variants={stagger(0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            <motion.p variants={fadeUp} className="font-mono text-[10px] tracking-widest text-subtle mb-6">
              Certifications
            </motion.p>
            <ul className="space-y-4">
              {certs.map((c) => (
                <motion.li key={c.name} variants={fadeUp}>
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between py-3 border-b border-white/5 hover:border-white/12 transition-colors duration-300"
                  >
                    <div>
                      <p className="text-sm text-text/80 font-medium group-hover:text-text transition-colors duration-300">
                        {c.name}
                      </p>
                      <p className="font-mono text-[10px] text-ghost mt-0.5">
                        {c.issuer} · {c.date}
                      </p>
                    </div>
                    <ArrowUpRight
                      size={14}
                      className="text-ghost group-hover:text-accent transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Contact ───────────────────────────────────────────────────────────────────
function Contact() {
  const [copied, setCopied] = useState(false);
  const email = 'ayushbhatia456@gmail.com';

  const copy = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section id="contact" className="py-28 md:py-40">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {/* Divider */}
        <motion.div
          variants={lineGrow}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="h-px bg-white/6 mb-20"
        />

        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <motion.p variants={fadeUp} className="font-mono text-[10px] tracking-widest text-subtle mb-8">
            Let's talk
          </motion.p>

          {/* Big CTA heading */}
          <div className="overflow-hidden mb-10">
            <motion.h2
              variants={textReveal}
              className="font-display font-extrabold tracking-tight leading-[0.9]"
              style={{ fontSize: 'clamp(36px, 8vw, 96px)' }}
            >
              Let's build
              <br />
              <span className="text-accent">something.</span>
            </motion.h2>
          </div>

          <motion.p variants={fadeUp} className="text-subtle font-light text-base md:text-lg max-w-lg mb-12">
            Whether it's a full-stack system, a distributed app, or a new idea —
            I'm always open to meaningful conversations.
          </motion.p>

          {/* Email + copy */}
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
            <a
              href={`mailto:${email}`}
              className="font-display font-bold text-text/80 hover:text-accent text-lg md:text-2xl transition-colors duration-300 tracking-tight"
            >
              {email}
            </a>
            <button
              onClick={copy}
              className="group flex items-center gap-2 text-xs rounded-full border border-white/8 hover:border-white/20 px-4 py-2 text-subtle hover:text-text transition-all duration-300"
            >
              <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                    className="flex items-center gap-2 text-emerald-400"
                  >
                    <Check size={12} /> Copied
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Copy size={12} /> Copy
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </motion.div>

          {/* Socials */}
          <motion.div variants={fadeUp} className="flex items-center gap-6 mt-10">
            <a
              href="https://github.com/Ayush-200"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-xs text-subtle hover:text-text transition-colors duration-300"
            >
              <Github size={15} />
              <span className="font-mono tracking-wider">GitHub</span>
              <ArrowUpRight size={11} className="text-ghost group-hover:text-subtle transition-colors duration-300" />
            </a>
            <a
              href="https://www.linkedin.com/in/ayush10023/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-xs text-subtle hover:text-text transition-colors duration-300"
            >
              <Linkedin size={15} />
              <span className="font-mono tracking-wider">LinkedIn</span>
              <ArrowUpRight size={11} className="text-ghost group-hover:text-subtle transition-colors duration-300" />
            </a>
          </motion.div>
        </motion.div>

        {/* Footer rule */}
        <motion.div
          variants={lineGrow}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="h-px bg-white/5 mt-24 mb-10"
        />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <p className="font-mono text-[10px] tracking-widest text-ghost">
            © 2026 Ayush Bhatia
          </p>
          <p className="font-mono text-[10px] tracking-widest text-ghost">
            Built with React · TypeScript · Tailwind CSS v4
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <Experience />
      <Projects />
      <Skills />
      <Education />
      <Contact />
    </>
  );
}
