import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import eventLogo from './assets/event.png';
import leadersLogo from './assets/leaders.jpg';
import ovcLogo from './assets/ovc.jpg';
import essatLogo from './assets/essat.jpg';
import robotImage from './assets/robot.png';
import forumLogo from './assets/forum.png';
import oasisLogo from './assets/oasis.png';

const API_URL = 'https://all-night-challenges-production.up.railway.app';
//const API_URL = 'http://all-night-challenges.essat-gabes.com:5000';

const DEADLINE = new Date('2026-04-19T08:00:00');

function App() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success',
  });

  const [formData, setFormData] = useState({
    teamName: '',
    leaderCin: '',
    driveLink: '',
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = DEADLINE.getTime() - now.getTime();

      if (diff <= 0) {
        setIsClosed(true);
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        return;
      }

      setIsClosed(false);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
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

  const isValidDriveLink = (url) => {
    try {
      const parsed = new URL(url);
      return (
        (parsed.protocol === 'http:' || parsed.protocol === 'https:') &&
        parsed.hostname.includes('drive.google.com')
      );
    } catch {
      return false;
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting || isClosed) return;

    if (!formData.teamName.trim()) {
      showToast('Team name is required ❌', 'error');
      return;
    }

    if (!/^\d{8}$/.test(formData.leaderCin.trim())) {
      showToast('Leader CIN must be exactly 8 digits ❌', 'error');
      return;
    }

    if (!formData.driveLink.trim()) {
      showToast('Drive link is required ❌', 'error');
      return;
    }

    if (!isValidDriveLink(formData.driveLink.trim())) {
      showToast('Please enter a valid Google Drive link ❌', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamName: formData.teamName.trim(),
          leaderCin: formData.leaderCin.trim(),
          driveLink: formData.driveLink.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        showToast(result.message || 'Error ❌', 'error');
        return;
      }

      setFormData({
        teamName: '',
        leaderCin: '',
        driveLink: '',
      });

      showToast('Submission successful ✅', 'success');

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
            <a href="#about" onClick={closeMenu} className="block px-5 py-4 text-gray-300 transition hover:bg-white/5 hover:text-cyan-300">Event</a>
            <a href="#powered" onClick={closeMenu} className="block px-5 py-4 text-gray-300 transition hover:bg-white/5 hover:text-cyan-300">Powered By</a>
            <a href="#register" onClick={closeMenu} className="block px-5 py-4 text-gray-300 transition hover:bg-white/5 hover:text-cyan-300">Submit</a>
            <a href="#contact" onClick={closeMenu} className="block px-5 py-4 text-gray-300 transition hover:bg-white/5 hover:text-cyan-300">Contact</a>
            <a href="#partners" onClick={closeMenu} className="block px-5 py-4 text-gray-300 transition hover:bg-white/5 hover:text-cyan-300">Partners</a>
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
            <p>🔴 Submission is FREE and MANDATORY</p>
            <p>⏳ Deadline: April 19, 2026 at 08:00</p>
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-cyan-400/20 bg-white/5 p-5 shadow-[0_0_25px_rgba(34,211,238,0.08)]">
            <h3 className="mb-4 text-center text-lg font-bold text-cyan-300">
              Countdown to Deadline
            </h3>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-[#0b1120] p-4 text-center">
                <p className="text-3xl font-black text-cyan-300">{timeLeft.days}</p>
                <p className="mt-1 text-sm text-gray-400">Days</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0b1120] p-4 text-center">
                <p className="text-3xl font-black text-cyan-300">{timeLeft.hours}</p>
                <p className="mt-1 text-sm text-gray-400">Hours</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0b1120] p-4 text-center">
                <p className="text-3xl font-black text-cyan-300">{timeLeft.minutes}</p>
                <p className="mt-1 text-sm text-gray-400">Minutes</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0b1120] p-4 text-center">
                <p className="text-3xl font-black text-cyan-300">{timeLeft.seconds}</p>
                <p className="mt-1 text-sm text-gray-400">Seconds</p>
              </div>
            </div>
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
              Submit Now
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
          <h2 className="mb-6 text-3xl font-black md:text-4xl">Green Future</h2>
          <div className="space-y-4 text-lg leading-8 text-gray-300">
            <p>« Green Future » est un événement intensif et pratique de trois jours, visant à renforcer les capacités des acteurs locaux dans le domaine de l’entrepreneuriat vert et à soutenir la transition écologique en Tunisie.</p>
            <p>L’initiative repose sur une approche pédagogique intégrée combinant formation appliquée, pensée innovante, mise en réseau et travail collaboratif.</p>
            <p>Green Future met l’accent sur l’autonomisation des jeunes, des entrepreneurs, des associations locales et des institutions engagées dans le développement durable, en leur permettant de concevoir et de développer des solutions environnementales innovantes et directement applicables au niveau local.</p>
            <p>L’événement se concentre particulièrement sur des problématiques environnementales concrètes, telles que la gestion des déchets, l’optimisation de la consommation de l’eau, le recours aux énergies renouvelables et le développement des pratiques de recyclage.</p>
          </div>
        </div>
      </section>

      <section id="powered" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="mb-12 text-center text-3xl font-black md:text-4xl">Powered By</h2>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center shadow-[0_0_35px_rgba(255,255,255,0.06)] backdrop-blur-xl">
            <div className="mx-auto mb-6 inline-flex rounded-2xl bg-white p-4">
              <img src={leadersLogo} alt="Leaders Club" className="h-28 w-28 object-contain" />
            </div>
            <h3 className="text-2xl font-bold text-white">Leaders Club</h3>
            <p className="mt-4 leading-7 text-gray-400">
              An inspiring space dedicated to youth personal development and leadership. It enables members to strengthen key skills such as teamwork, communication, time management, and problem-solving in an innovative environment.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center shadow-[0_0_35px_rgba(255,255,255,0.06)] backdrop-blur-xl">
            <div className="mx-auto mb-6 inline-flex rounded-2xl bg-white p-4">
              <img src={ovcLogo} alt="OVC" className="h-28 w-28 object-contain" />
            </div>
            <h3 className="text-2xl font-bold text-white">OVC</h3>
            <p className="mt-4 leading-7 text-gray-400">
              Founded in 2012, OVC is an independent non-profit organization committed to building a more just, inclusive, and sustainable society. It is particularly active in southern Tunisia, focusing on social and environmental initiatives targeting youth and vulnerable communities.
            </p>
          </div>
        </div>
      </section>

      <section id="register" className="mx-auto max-w-5xl px-6 py-20">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_0_45px_rgba(34,211,238,0.12)] backdrop-blur-xl md:p-10">
          <h2 className="mb-10 text-center text-3xl font-black md:text-4xl">
            Submit Your Team
          </h2>

          {isClosed ? (
            <div className="text-center">
              <h3 className="text-3xl font-black text-red-400">Submissions Closed ❌</h3>
              <p className="mt-4 text-lg leading-8 text-gray-300">
                The submission deadline has passed.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="mb-4 text-xl font-bold text-cyan-300">Team Name</h3>
                <input
                  type="text"
                  name="teamName"
                  placeholder="Enter your team name"
                  value={formData.teamName}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-[#0b1120] p-4 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <h3 className="mb-4 text-xl font-bold text-cyan-300">Leader CIN</h3>
                <input
                  type="text"
                  name="leaderCin"
                  placeholder="Enter leader CIN"
                  value={formData.leaderCin}
                  onChange={handleChange}
                  maxLength={8}
                  className="w-full rounded-2xl border border-white/10 bg-[#0b1120] p-4 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <h3 className="mb-4 text-xl font-bold text-cyan-300">Drive Link</h3>
                <input
                  type="url"
                  name="driveLink"
                  placeholder="Paste your Google Drive link"
                  value={formData.driveLink}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-[#0b1120] p-4 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 py-4 text-lg font-black text-black shadow-[0_0_30px_rgba(34,211,238,0.35)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          )}
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="mb-12 text-center text-3xl font-black md:text-4xl">Contact Us</h2>

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
        <h2 className="mb-12 text-center text-3xl font-black md:text-4xl">Partners</h2>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center shadow-[0_0_35px_rgba(255,255,255,0.06)] backdrop-blur-xl">
            <div className="mx-auto mb-6 inline-flex rounded-2xl bg-white p-4">
              <img src={essatLogo} alt="ESSAT Privée Gabès" className="w-32 object-contain" />
            </div>
            <h3 className="text-xl font-bold text-white">ESSAT Privée Gabès</h3>
            <p className="mt-4 leading-7 text-gray-400">
              L’Ecole Supérieure des Sciences Appliquées et de la Technologie Privée de Gabès (ESSAT) a été créée en 2007 autour d’un projet qui concilie pédagogie de haut niveau, initiatives personnelles, développement du comportement professionnel et mise en œuvre de moyens innovants dans le domaine de l’enseignement supérieur.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center shadow-[0_0_35px_rgba(255,255,255,0.06)] backdrop-blur-xl">
            <div className="mx-auto mb-6 inline-flex rounded-2xl bg-white p-4">
              <img src={oasisLogo} alt="Oasis FM" className="w-32 object-contain" />
            </div>
            <h3 className="text-xl font-bold text-white">Oasis FM</h3>
            <p className="mt-4 leading-7 text-gray-400">
              Oasis FM is a private Tunisian radio station based in Gabès. It was launched on 29 December 2011 and is considered the first local radio station in the region.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center shadow-[0_0_35px_rgba(255,255,255,0.06)] backdrop-blur-xl">
            <div className="mx-auto mb-6 inline-flex rounded-2xl bg-white p-4">
              <img src={forumLogo} alt="Forum FM" className="w-32 object-contain" />
            </div>
            <h3 className="text-xl font-bold text-white">Forum FM</h3>
            <p className="mt-4 leading-7 text-gray-400">
              Forum Radio is a private Tunisian radio station based in Gabès. It was launched after the 2011 revolution and focuses on local and regional issues, especially those affecting the south of Tunisia.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;