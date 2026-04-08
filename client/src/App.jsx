import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import eventLogo from './assets/event.png';
import leadersLogo from './assets/leaders.jpg';
import ovcLogo from './assets/ovc.jpg';
import essatLogo from './assets/essat.jpg';
import robotImage from './assets/robot.png';

const API_URL = 'https://all-night-challenges-production.up.railway.app';

function App() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success',
  });

  const [formData, setFormData] = useState({
    teamName: '',
    leaderFullName: '',
    leaderEmail: '',
    leaderPhone: '',
    leaderCin: '',
    member1FullName: '',
    member1Email: '',
    member2FullName: '',
    member2Email: '',
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stars = useMemo(
    () =>
      Array.from({ length: 45 }, (_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: `${2 + Math.random() * 4}px`,
        delay: `${Math.random() * 4}s`,
        duration: `${2 + Math.random() * 4}s`,
      })),
    []
  );

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        top: `${20 + Math.random() * 60}%`,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        duration: `${5 + Math.random() * 6}s`,
      })),
    []
  );

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const normalize = (value) => value.trim().toLowerCase();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!formData.teamName.trim()) {
      showToast('Team name is required ❌', 'error');
      return;
    }

    if (!formData.leaderFullName.trim()) {
      showToast('Leader full name is required ❌', 'error');
      return;
    }

    if (!formData.leaderEmail.trim()) {
      showToast('Leader email is required ❌', 'error');
      return;
    }

    if (!emailRegex.test(formData.leaderEmail.trim())) {
      showToast('Leader email is invalid ❌', 'error');
      return;
    }

    if (!/^\d{8}$/.test(formData.leaderPhone.trim())) {
      showToast('Phone must be exactly 8 digits ❌', 'error');
      return;
    }

    if (formData.leaderCin && !/^\d{8}$/.test(formData.leaderCin.trim())) {
      showToast('CIN must be exactly 8 digits ❌', 'error');
      return;
    }

    if (
      formData.member1Email.trim() &&
      !emailRegex.test(formData.member1Email.trim())
    ) {
      showToast('Member 1 email is invalid ❌', 'error');
      return;
    }

    if (
      formData.member2Email.trim() &&
      !emailRegex.test(formData.member2Email.trim())
    ) {
      showToast('Member 2 email is invalid ❌', 'error');
      return;
    }

    const emails = [
      formData.leaderEmail,
      formData.member1Email,
      formData.member2Email,
    ]
      .filter((email) => email.trim() !== '')
      .map(normalize);

    if (new Set(emails).size !== emails.length) {
      showToast('Emails must be different ❌', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          teamName: formData.teamName.trim(),
          leaderFullName: formData.leaderFullName.trim(),
          leaderEmail: formData.leaderEmail.trim(),
          leaderPhone: formData.leaderPhone.trim(),
          leaderCin: formData.leaderCin.trim(),
          member1FullName: formData.member1FullName.trim(),
          member1Email: formData.member1Email.trim(),
          member2FullName: formData.member2FullName.trim(),
          member2Email: formData.member2Email.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        showToast(result.message || 'Error ❌', 'error');
        return;
      }

      setFormData({
        teamName: '',
        leaderFullName: '',
        leaderEmail: '',
        leaderPhone: '',
        leaderCin: '',
        member1FullName: '',
        member1Email: '',
        member2FullName: '',
        member2Email: '',
      });

      showToast('Registration successful ✅', 'success');

      setTimeout(() => {
        navigate('/success');
      }, 900);
    } catch (error) {
      console.error(error);
      showToast('Server error ❌', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#03040a] text-white">
      {toast.show && (
        <div className="fixed right-5 top-5 z-[100]">
          <div
            className={`rounded-2xl border px-5 py-4 shadow-xl backdrop-blur-xl ${
              toast.type === 'error'
                ? 'border-red-400/30 bg-red-500/15 text-red-100'
                : 'border-cyan-400/30 bg-cyan-500/15 text-cyan-100'
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}

      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 cyber-bg" />
        <div className="absolute inset-0 opacity-30 grid-overlay" />

        <div className="absolute inset-0">
          {stars.map((star) => (
            <span
              key={star.id}
              className="star"
              style={{
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
                animationDelay: star.delay,
                animationDuration: star.duration,
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0">
          {particles.map((particle) => (
            <span
              key={particle.id}
              className="particle-line"
              style={{
                top: particle.top,
                left: particle.left,
                animationDelay: particle.delay,
                animationDuration: particle.duration,
              }}
            />
          ))}
        </div>

        <div className="absolute top-20 left-10 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute top-36 right-8 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'border-b border-cyan-400/30 bg-black/80 backdrop-blur-2xl shadow-[0_0_40px_rgba(34,211,238,0.12)]'
            : 'border-b border-white/10 bg-black/30 backdrop-blur-xl'
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-500 ${
            scrolled ? 'py-2' : 'py-5'
          }`}
        >
          <div className="flex items-center gap-5">
            <img
              src={eventLogo}
              alt="All Night Challenges"
              className={`object-contain glow-logo transition-all duration-500 ${
                scrolled ? 'h-16 w-16' : 'h-24 w-24'
              }`}
            />

            <div>
              <p
                className={`font-black uppercase text-cyan-300 transition-all duration-500 ${
                  scrolled
                    ? 'text-sm tracking-[0.22em]'
                    : 'text-lg tracking-[0.3em]'
                }`}
              >
                ALL NIGHT
              </p>
              <p
                className={`uppercase text-fuchsia-300 transition-all duration-500 ${
                  scrolled
                    ? 'text-xs tracking-[0.18em]'
                    : 'text-sm tracking-[0.24em]'
                }`}
              >
                CHALLENGES v1.0
              </p>
            </div>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col gap-1.5 rounded-xl border border-cyan-400/20 bg-white/5 px-3 py-2 transition hover:bg-cyan-400/10"
          >
            <span className="h-[2px] w-6 bg-cyan-300" />
            <span className="h-[2px] w-6 bg-cyan-300" />
            <span className="h-[2px] w-6 bg-cyan-300" />
          </button>
        </div>

        {menuOpen && (
          <div className="absolute right-6 mt-2 w-56 rounded-2xl border border-cyan-400/20 bg-black/90 backdrop-blur-xl shadow-[0_0_35px_rgba(34,211,238,0.2)]">
            <a
              href="#about"
              onClick={closeMenu}
              className="block px-5 py-4 text-gray-300 transition hover:bg-white/5 hover:text-cyan-300"
            >
              Event
            </a>
            <a
              href="#powered"
              onClick={closeMenu}
              className="block px-5 py-4 text-gray-300 transition hover:bg-white/5 hover:text-cyan-300"
            >
              Powered By
            </a>
            <a
              href="#register"
              onClick={closeMenu}
              className="block px-5 py-4 text-gray-300 transition hover:bg-white/5 hover:text-cyan-300"
            >
              Register
            </a>
            <a
              href="#contact"
              onClick={closeMenu}
              className="block px-5 py-4 text-gray-300 transition hover:bg-white/5 hover:text-cyan-300"
            >
              Contact
            </a>
            <a
              href="#partners"
              onClick={closeMenu}
              className="block px-5 py-4 text-gray-300 transition hover:bg-white/5 hover:text-cyan-300"
            >
              Partners
            </a>
          </div>
        )}
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:py-28">
        <div className="lg:pr-6">
          <div className="mb-6 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-cyan-300">
            Regional Night Hackathon
          </div>

          <div className="flex justify-center lg:justify-start">
            <img
              src={eventLogo}
              alt="Event Logo"
              className="hero-logo mb-10 w-[520px] max-w-full object-contain"
            />
          </div>

          <h1 className="text-center text-5xl font-black leading-[0.95] md:text-7xl lg:text-left">
            <span className="block bg-gradient-to-r from-cyan-300 via-white to-fuchsia-300 bg-clip-text text-transparent">
              ALL NIGHT
            </span>
            <span className="block bg-gradient-to-r from-white via-cyan-200 to-fuchsia-300 bg-clip-text text-transparent">
              CHALLENGES
            </span>
            <span className="mt-3 block text-3xl text-cyan-300 md:text-4xl">
              v1.0
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-center text-xl leading-9 text-gray-300 lg:text-left">
            This unique night hackathon will bring together ambitious students
            to innovate and collaborate around the theme of Technology &
            Artificial Intelligence for Sustainable Development.
          </p>

          <div className="mt-8 space-y-3 text-center text-gray-400 lg:text-left">
            <p>📍 Location: ESSAT Privée Gabes</p>
            <p>🕓 Start: April 18, 2026 at 16:00</p>
            <p>🕗 End: April 19, 2026 at 08:00</p>
            <p>🔴 Registration is FREE and MANDATORY</p>
            <p>⏳ Deadline: April 15, 2026</p>
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-cyan-400/20 bg-white/5 p-5 text-left shadow-[0_0_25px_rgba(34,211,238,0.08)]">
            <h3 className="mb-3 text-lg font-bold text-cyan-300">
              During the event
            </h3>
            <div className="space-y-2 text-gray-300">
              <p>• Dinner provided 🍽️</p>
              <p>• Coffee break ☕</p>
              <p>• Music break 🎶</p>
              <p>• Games & fun activities 🎮</p>
            </div>
          </div>

          <p className="mt-8 max-w-2xl text-center leading-8 text-gray-400 lg:text-left">
            Your presence would be a great addition to this event, and we would
            be delighted to have your club among us. Spots are limited, so hurry
            up and secure your place before the deadline.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4 lg:justify-start">
            <a
              href="#register"
              className="rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 px-8 py-4 font-bold text-black shadow-[0_0_35px_rgba(34,211,238,0.4)] transition hover:-translate-y-1"
            >
              Register Now
            </a>

            <a
              href="#about"
              className="rounded-full border border-white/15 bg-white/5 px-8 py-4 font-semibold text-white transition hover:border-fuchsia-400/40 hover:bg-fuchsia-500/10"
            >
              Explore Event
            </a>
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="hidden lg:block absolute -left-8 top-24 space-y-6">
            <div className="side-line side-line-1" />
            <div className="side-line side-line-2" />
            <div className="side-line side-line-3" />
          </div>

          <div className="absolute h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />

          <div className="relative w-full max-w-[500px] rounded-[2.2rem] border border-cyan-400/20 bg-white/5 p-6 backdrop-blur-xl shadow-[0_0_65px_rgba(34,211,238,0.18)]">
            <div className="pointer-events-none absolute inset-0 rounded-[2.2rem] cyber-border" />

            <div className="relative flex min-h-[560px] items-center justify-center overflow-hidden rounded-[1.7rem] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.10),rgba(14,19,37,0.88))]">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-transparent to-fuchsia-500/10" />
              <img
                src={robotImage}
                alt="Cyber Robot"
                className="robot-float relative z-10 w-[390px] max-w-full drop-shadow-[0_0_70px_rgba(34,211,238,0.35)]"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_0_40px_rgba(168,85,247,0.16)] backdrop-blur-xl md:p-12">
          <div className="mb-6 inline-flex rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-fuchsia-300">
            Event Description
          </div>

          <h2 className="mb-6 text-3xl font-black md:text-4xl">
            Green Future
          </h2>

          <div className="space-y-4 text-lg leading-8 text-gray-300">
            <p>
              « Green Future » est un événement intensif et pratique de trois
              jours, visant à renforcer les capacités des acteurs locaux dans le
              domaine de l’entrepreneuriat vert et à soutenir la transition
              écologique en Tunisie.
            </p>
            <p>
              L’initiative repose sur une approche pédagogique intégrée
              combinant formation appliquée, pensée innovante, mise en réseau et
              travail collaboratif.
            </p>
            <p>
              Green Future met l’accent sur l’autonomisation des jeunes, des
              entrepreneurs, des associations locales et des institutions
              engagées dans le développement durable, en leur permettant de
              concevoir et de développer des solutions environnementales
              innovantes et directement applicables au niveau local.
            </p>
            <p>
              L’événement se concentre particulièrement sur des problématiques
              environnementales concrètes, telles que la gestion des déchets,
              l’optimisation de la consommation de l’eau, le recours aux
              énergies renouvelables et le développement des pratiques de
              recyclage.
            </p>
          </div>
        </div>
      </section>

      <section id="powered" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="mb-12 text-center text-3xl font-black md:text-4xl">
          Powered By
        </h2>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center shadow-[0_0_35px_rgba(255,255,255,0.06)] backdrop-blur-xl">
            <div className="mx-auto mb-6 inline-flex rounded-2xl bg-white p-4">
              <img
                src={leadersLogo}
                alt="Leaders Club"
                className="h-28 w-28 object-contain"
              />
            </div>
            <h3 className="text-2xl font-bold text-white">Leaders Club</h3>
            <p className="mt-4 leading-7 text-gray-400">
              An inspiring space dedicated to youth personal development and
              leadership. It enables members to strengthen key skills such as
              teamwork, communication, time management, and problem-solving in
              an innovative environment.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center shadow-[0_0_35px_rgba(255,255,255,0.06)] backdrop-blur-xl">
            <div className="mx-auto mb-6 inline-flex rounded-2xl bg-white p-4">
              <img
                src={ovcLogo}
                alt="OVC"
                className="h-28 w-28 object-contain"
              />
            </div>
            <h3 className="text-2xl font-bold text-white">OVC</h3>
            <p className="mt-4 leading-7 text-gray-400">
              Founded in 2012, OVC is an independent non-profit organization
              committed to building a more just, inclusive, and sustainable
              society. It is particularly active in southern Tunisia, focusing
              on social and environmental initiatives targeting youth and
              vulnerable communities.
            </p>
          </div>
        </div>
      </section>

      <section id="register" className="mx-auto max-w-5xl px-6 py-20">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_0_45px_rgba(34,211,238,0.12)] backdrop-blur-xl md:p-10">
          <h2 className="mb-10 text-center text-3xl font-black md:text-4xl">
            Register Your Team
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="mb-4 text-xl font-bold text-cyan-300">
                Team Information
              </h3>
              <input
                type="text"
                name="teamName"
                placeholder="Team Name"
                value={formData.teamName}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-[#0b1120] p-4 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <h3 className="mb-4 text-xl font-bold text-cyan-300">
                Team Leader
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  name="leaderFullName"
                  placeholder="Full Name"
                  value={formData.leaderFullName}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-[#0b1120] p-4 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:outline-none"
                />

                <input
                  type="email"
                  name="leaderEmail"
                  placeholder="Email"
                  value={formData.leaderEmail}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-[#0b1120] p-4 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:outline-none"
                />

                <input
                  type="text"
                  name="leaderPhone"
                  placeholder="Phone (8 digits)"
                  value={formData.leaderPhone}
                  onChange={handleChange}
                  maxLength={8}
                  className="w-full rounded-2xl border border-white/10 bg-[#0b1120] p-4 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:outline-none"
                />

                <input
                  type="text"
                  name="leaderCin"
                  placeholder="CIN (8 digits)"
                  value={formData.leaderCin}
                  onChange={handleChange}
                  maxLength={8}
                  className="w-full rounded-2xl border border-white/10 bg-[#0b1120] p-4 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-xl font-bold text-fuchsia-300">
                Team Member 1
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  name="member1FullName"
                  placeholder="Full Name"
                  value={formData.member1FullName}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-[#0b1120] p-4 text-white placeholder:text-gray-500 focus:border-fuchsia-400 focus:outline-none"
                />

                <input
                  type="email"
                  name="member1Email"
                  placeholder="Email"
                  value={formData.member1Email}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-[#0b1120] p-4 text-white placeholder:text-gray-500 focus:border-fuchsia-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-xl font-bold text-fuchsia-300">
                Team Member 2
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  name="member2FullName"
                  placeholder="Full Name"
                  value={formData.member2FullName}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-[#0b1120] p-4 text-white placeholder:text-gray-500 focus:border-fuchsia-400 focus:outline-none"
                />

                <input
                  type="email"
                  name="member2Email"
                  placeholder="Email"
                  value={formData.member2Email}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-[#0b1120] p-4 text-white placeholder:text-gray-500 focus:border-fuchsia-400 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 py-4 text-lg font-black text-black shadow-[0_0_30px_rgba(34,211,238,0.35)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Submitting...' : 'Register Team'}
            </button>
          </form>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="mb-12 text-center text-3xl font-black md:text-4xl">
          Contact Us
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-center backdrop-blur-xl">
            <p className="mb-2 font-bold text-cyan-300">Phone</p>
            <p className="text-gray-300">+216 25 496 040</p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-center backdrop-blur-xl">
            <p className="mb-2 font-bold text-cyan-300">Email</p>
            <p className="text-gray-300">allnightchallenges@gmail.com</p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-center backdrop-blur-xl">
            <p className="mb-2 font-bold text-cyan-300">Location</p>
            <p className="text-gray-300">ESSAT Privée, Gabès</p>
          </div>
        </div>
      </section>

      <section id="partners" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="mb-12 text-center text-3xl font-black md:text-4xl">
          Partners
        </h2>

        <div className="mx-auto max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center shadow-[0_0_35px_rgba(255,255,255,0.06)] backdrop-blur-xl">
          <div className="mx-auto mb-6 inline-flex rounded-2xl bg-white p-4">
            <img
              src={essatLogo}
              alt="ESSAT Privée Gabès"
              className="w-40 object-contain"
            />
          </div>
          <h3 className="text-2xl font-bold text-white">ESSAT Privée Gabès</h3>
          <p className="mt-4 leading-7 text-gray-400">
            L’Ecole Supérieure des Sciences Appliquées et de la Technologie
            Privée de Gabès (ESSAT) a été créée en 2007 autour d’un projet qui
            concilie pédagogie de haut niveau, initiatives personnelles,
            développement du comportement professionnel et mise en œuvre de
            moyens innovants dans le domaine de l’enseignement supérieur.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;