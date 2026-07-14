"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const NAV_ITEMS: [string, string][] = [
  ["hero", "Home"],
  ["features", "Features"],
  ["about", "About"],
];

const FEATURES = [
  {
    icon: "shield-lock",
    title: "Phishing Simulation",
    desc: "Launch realistic phishing campaigns to identify vulnerable employees before attackers do. Customize templates, schedule campaigns, and track click rates in real time.",
  },
  {
    icon: "mortarboard",
    title: "Course Management",
    desc: "Build and deliver role-based cybersecurity courses with rich media, quizzes, and interactive modules. Support SCORM content and custom learning paths.",
  },
  {
    icon: "graph-up-arrow",
    title: "Analytics Dashboard",
    desc: "Track individual and team-level awareness scores. Export detailed compliance reports, risk heatmaps, and training completion certificates.",
  },
  {
    icon: "people-fill",
    title: "Team Management",
    desc: "Organize your workforce into departments and groups. Assign targeted training, set completion deadlines, and automate reminders.",
  },
  {
    icon: "award",
    title: "Certifications",
    desc: "Automatically issue verifiable digital certificates when employees complete training. Certificates include QR codes and are shareable on LinkedIn.",
  },
  {
    icon: "camera-video",
    title: "Live Training Sessions",
    desc: "Conduct virtual instructor-led training sessions with built-in video conferencing, screen sharing, attendance tracking, and session recordings.",
  },
];

const STEPS = [
  {
    num: "01",
    icon: "building-add",
    title: "Create Your Organization",
    desc: "Register your organization in minutes. Configure branding, departments, and security policies. Invite your admin team to get started right away.",
  },
  {
    num: "02",
    icon: "people-fill",
    title: "Onboard Your Team",
    desc: "Bulk-import employees via CSV or invite them by email. Assign them to groups and departments, set roles, and configure their training paths automatically.",
  },
  {
    num: "03",
    icon: "play-circle-fill",
    title: "Launch Training Programs",
    desc: "Activate courses, schedule phishing simulations, and set up automated training reminders. Monitor progress on your live security dashboard.",
  },
  {
    num: "04",
    icon: "bar-chart-fill",
    title: "Track & Improve",
    desc: "Review detailed analytics to identify knowledge gaps. Use risk scores to prioritize who needs extra training. Export compliance reports in one click.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "ZenithLMS completely transformed how we manage security training. Phishing simulations revealed blind spots we didn't know existed, and the course completion rates jumped from 40% to 94% within three months.",
    name: "Priya Sharma",
    role: "CISO, TechVision Enterprises",
  },
  {
    quote:
      "The analytics dashboard alone is worth every rupee. We can now show our board a clear picture of our security posture, track improvements over time, and demonstrate ROI on our awareness program.",
    name: "Rahul Mehta",
    role: "IT Head, ByteWave Technologies",
  },
  {
    quote:
      "Deploying to 2,000 employees used to be a nightmare. With ZenithLMS, we bulk-imported everyone, assigned role-based training paths, and had 80% of staff actively learning within 48 hours.",
    name: "Anjali Verma",
    role: "HR Director, FutureStack Labs",
  },
];

const STATS = [
  { n: "10,000+", l: "Organizations Protected", icon: "building" },
  { n: "500K+", l: "Employees Trained", icon: "people-fill" },
  { n: "2.4M+", l: "Phishing Tests Run", icon: "envelope-fill" },
  { n: "98%", l: "Satisfaction Score", icon: "star-fill" },
  { n: "72 hrs", l: "Avg. Onboarding Time", icon: "clock-fill" },
];

const Home = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileNavOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "features", "about", "howitworks"];
      let current = "hero";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (
          rect.top <= window.innerHeight / 2 &&
          rect.bottom >= window.innerHeight / 2
        ) {
          current = id;
          break;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex min-h-full flex-col bg-white text-slate-800">
      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-sky-100 bg-white/80 px-6 py-4 backdrop-blur-md md:px-10">
        <div
          className="flex cursor-pointer items-center gap-2"
          onClick={() => scrollTo("hero")}
        >
          <img
            src="/zenith%20guard%20transparent%20logo.png"
            alt="ZenithLMS"
            className="h-8 w-8 object-contain"
          />
          <span className="text-lg font-bold text-sky-600">ZenithLMS</span>
        </div>

        <div
          className={
            "fixed inset-x-0 top-16 z-40 flex flex-col items-center gap-2 border-b border-sky-100 bg-white px-6 py-4 shadow-md transition-all duration-200 md:static md:flex md:flex-row md:items-center md:gap-6 md:border-none md:bg-transparent md:p-0 md:shadow-none " +
            (mobileNavOpen ? "flex" : "hidden md:flex")
          }
        >
          {NAV_ITEMS.map(([id, label]) => (
            <button
              key={id}
              className={
                "rounded-md px-3 py-2 text-sm font-medium transition-colors md:px-0 md:py-0 " +
                (activeSection === id
                  ? "text-sky-600"
                  : "text-slate-600 hover:text-sky-600")
              }
              onClick={() => scrollTo(id)}
            >
              {label}
            </button>
          ))}
          <button
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-sky-600 md:px-0 md:py-0"
            onClick={() => {
              setMobileNavOpen(false);
              router.push("/pricing");
            }}
          >
            Pricing
          </button>
          <button
            className="w-full rounded-md border border-sky-500 px-4 py-2 text-sm font-semibold text-sky-600 transition-colors hover:bg-sky-50 md:w-auto"
            onClick={() => {
              setMobileNavOpen(false);
              router.push("/auth/login");
            }}
          >
            Sign In
          </button>
          <button
            className="w-full rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-600 md:w-auto"
            onClick={() => {
              setMobileNavOpen(false);
              router.push("/auth/register");
            }}
          >
            Get Started
          </button>
        </div>

        <button
          className="text-2xl text-sky-600 md:hidden"
          onClick={() => setMobileNavOpen((p) => !p)}
          aria-label="Toggle navigation menu"
        >
          <i className={"bi bi-" + (mobileNavOpen ? "x" : "list")} />
        </button>
      </nav>

      <main className="flex-1">
        {/* ── HERO ── */}
        <section
          id="hero"
          className="bg-linear-to-br from-sky-50 via-white to-sky-100 px-6 py-20 md:px-10 md:py-13"
        >
          <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-1.5 text-sm font-medium text-sky-700">
                <i className="bi bi-shield-check" /> Trusted by 10,000+
                Organizations
              </span>
              <h1 className="mt-6 text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
                Build a
                <br />
                <span className="text-sky-600">Cyber-Aware</span>
                <br />
                Organization
              </h1>
              <p className="mt-6 max-w-lg text-base text-slate-600">
                ZenithLMS is the all-in-one cybersecurity awareness platform
                that helps enterprises train employees, simulate real phishing
                attacks, track compliance, and dramatically reduce human risk —
                all from a single dashboard.
              </p>
              <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {[
                  "ISO 27001 Aligned Training",
                  "Automated Phishing Campaigns",
                  "Real-Time Risk Scoring",
                  "One-Click Compliance Reports",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-slate-700"
                  >
                    <i className="bi bi-check-circle-fill text-sky-500" /> {f}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  className="rounded-md bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-600"
                  onClick={() => router.push("/auth/register")}
                >
                  Start Free Trial <i className="bi bi-arrow-right" />
                </button>
                <button
                  className="rounded-md border border-sky-300 px-6 py-3 text-sm font-semibold text-sky-700 transition-colors hover:bg-sky-50"
                  onClick={() => scrollTo("features")}
                >
                  Explore Features
                </button>
              </div>
            </div>

            <div className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-sky-200/50">
                <i className="bi bi-shield-fill-check text-8xl text-sky-500" />
              </div>
              {[
                {
                  icon: "people-fill",
                  label: "10,000+ Orgs",
                  className: "top-2 -left-6",
                },
                {
                  icon: "mortarboard",
                  label: "500K Learners",
                  className: "bottom-4 -right-6",
                },
                {
                  icon: "star-fill",
                  label: "98% Satisfaction",
                  className: "top-1/3 -right-10",
                },
              ].map((b, i) => (
                <div
                  key={i}
                  className={
                    "absolute flex items-center gap-2 whitespace-nowrap rounded-xl border border-sky-100 bg-white/90 px-4 py-2.5 shadow-md backdrop-blur " +
                    b.className
                  }
                >
                  <i className={"bi bi-" + b.icon + " text-lg text-sky-500"} />
                  <span className="text-sm font-bold text-slate-800">
                    {b.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TRUSTED BY ── */}
        <section className="border-y border-sky-100 bg-sky-50/60 px-6 py-10 md:px-10">
          <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-10 gap-y-6">
            {STATS.map((s) => (
              <div key={s.l} className="flex flex-col items-center text-center">
                <i className={"bi bi-" + s.icon + " text-2xl text-sky-500"} />
                <div className="mt-2 text-xl font-extrabold text-slate-900">
                  {s.n}
                </div>
                <div className="text-xs text-slate-500">{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" className="px-6 py-20 md:px-10">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-wide text-sky-600">
                Platform Features
              </span>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Everything You Need to Stay Secure
              </h2>
              <p className="mt-3 text-slate-600">
                A unified platform covering every aspect of cybersecurity
                awareness — from training to testing to reporting.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="rounded-xl border border-sky-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-sky-100 text-xl text-sky-600">
                    <i className={"bi bi-" + f.icon} />
                  </div>
                  <div className="mt-4 font-semibold text-slate-900">
                    {f.title}
                  </div>
                  <div className="mt-2 text-sm text-slate-600">{f.desc}</div>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <button
                className="rounded-md bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-600"
                onClick={() => router.push("/auth/register")}
              >
                View All Features <i className="bi bi-arrow-right" />
              </button>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="howitworks" className="bg-sky-50/60 px-6 py-20 md:px-10">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-wide text-sky-600">
                How It Works
              </span>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                From Setup to Secure in 4 Steps
              </h2>
              <p className="mt-3 text-slate-600">
                Get your entire organization protected in less than 72 hours
                with our guided onboarding.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step) => (
                <div
                  key={step.num}
                  className="flex flex-col items-center rounded-xl border border-sky-100 bg-white p-6 text-center shadow-sm"
                >
                  <div className="text-2xl font-black text-sky-500">
                    {step.num}
                  </div>
                  <div className="mt-3 flex h-11 w-11 items-center justify-center rounded-lg bg-sky-100 text-xl text-sky-600">
                    <i className={"bi bi-" + step.icon} />
                  </div>
                  <div className="mt-4 font-semibold text-slate-900">
                    {step.title}
                  </div>
                  <div className="mt-2 text-sm text-slate-600">{step.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ABOUT / TESTIMONIALS ── */}
        <section id="about" className="px-6 py-20 md:px-10">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-wide text-sky-600">
                Customer Stories
              </span>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Trusted by Security Leaders Across India
              </h2>
              <p className="mt-3 text-slate-600">
                See how organizations are building cyber-resilient workforces
                with ZenithLMS.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((t, i) => (
                <div
                  key={i}
                  className="flex flex-col rounded-xl border border-sky-100 bg-white p-6 shadow-sm"
                >
                  <div className="text-sky-400">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <i key={n} className="bi bi-star-fill" />
                    ))}
                  </div>
                  <p className="mt-4 flex-1 text-sm italic text-slate-600">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 font-bold text-white">
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {t.name}
                      </div>
                      <div className="text-xs text-slate-500">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="px-6 py-20 md:px-10">
          <div className="mx-auto max-w-4xl rounded-2xl bg-linear-to-br from-sky-500 to-sky-600 px-8 py-14 text-center text-white shadow-lg">
            <span className="text-sm font-semibold uppercase tracking-wide text-sky-100">
              Get Started Today
            </span>
            <h2 className="mt-2 text-3xl font-bold">
              Protect Your Organization from Cyber Threats
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sky-50">
              Join 10,000+ organizations already using ZenithLMS to train their
              workforce and reduce human risk. Free trial, no credit card
              required.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-sky-600 shadow-sm transition-colors hover:bg-sky-50"
                onClick={() => router.push("/auth/register")}
              >
                Start Free Trial <i className="bi bi-arrow-right" />
              </button>
              <button
                className="rounded-md border border-white/60 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                onClick={() => scrollTo("about")}
              >
                Learn About Us
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-sky-100 bg-white px-6 py-8 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <img
              src="/zenith%20guard%20transparent%20logo.png"
              alt="ZenithLMS"
              className="h-7 w-7 object-contain"
            />
            <span className="font-bold text-sky-600">ZenithLMS</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-600">
            <a href="#" className="hover:text-sky-600">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-sky-600">
              Terms of Service
            </a>
            <a href="#" className="hover:text-sky-600">
              Support
            </a>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-slate-400">
          © 2026 ZenithLMS. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
