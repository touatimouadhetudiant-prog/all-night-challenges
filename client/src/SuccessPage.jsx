import { Link } from 'react-router-dom';
import eventLogo from './assets/event.png';
import successRobot from './assets/success-robot.png';

function SuccessPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#03040a] px-6 text-white">
      <div className="absolute inset-0 cyber-bg" />
      <div className="absolute inset-0 grid-overlay opacity-30" />

      <div className="absolute left-10 top-20 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute right-8 top-36 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="absolute bottom-10 left-1/3 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />

      <div className="relative z-10 w-full max-w-3xl rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center shadow-[0_0_50px_rgba(34,211,238,0.16)] backdrop-blur-xl md:p-12">
        <img
          src={eventLogo}
          alt="Event Logo"
          className="hero-logo mx-auto w-56 max-w-full"
        />

        <div className="mt-8 flex justify-center">
          <img
            src={successRobot}
            alt="Success Robot"
            className="robot-float w-[320px] max-w-full drop-shadow-[0_0_70px_rgba(34,211,238,0.35)]"
          />
        </div>

        <h1 className="mt-8 bg-gradient-to-r from-cyan-300 via-white to-fuchsia-300 bg-clip-text text-4xl font-black text-transparent md:text-5xl">
          Submission Received
        </h1>

        <p className="mt-6 text-lg leading-8 text-gray-300">
          Your team submission has been successfully received for{' '}
          <span className="font-bold text-cyan-300">
            ALL NIGHT CHALLENGES v1.0
          </span>
          .
        </p>

        <p className="mt-4 leading-7 text-gray-400">
          Thank you for submitting your team information and drive link. Please
          make sure your shared folder or file remains accessible for review.
        </p>

        <div className="mt-8 rounded-[1.5rem] border border-cyan-400/20 bg-white/5 p-5 text-left shadow-[0_0_25px_rgba(34,211,238,0.08)]">
          <h3 className="mb-3 text-lg font-bold text-cyan-300">
            Important Reminder
          </h3>
          <div className="space-y-2 text-gray-300">
            <p>• Keep your Google Drive link available and accessible.</p>
            <p>• Make sure your submitted files stay organized.</p>
            <p>• Follow event timing and instructions carefully.</p>
          </div>
        </div>

        <p className="mt-6 leading-7 text-gray-400">
          We look forward to discovering your idea. Good luck and see you at the
          event.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/"
            className="rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 px-7 py-4 font-bold text-black shadow-[0_0_35px_rgba(34,211,238,0.4)] transition hover:-translate-y-1"
          >
            Back to Home
          </Link>

          <a
            href="/#contact"
            className="rounded-full border border-white/15 bg-white/5 px-7 py-4 font-semibold text-white transition hover:border-fuchsia-400/40 hover:bg-fuchsia-500/10"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}

export default SuccessPage;