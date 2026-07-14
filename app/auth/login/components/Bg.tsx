const Bg = () => (
  <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-sky-300/30 blur-3xl" />
    <div className="absolute top-1/3 -right-32 h-112 w-md rounded-full bg-sky-200/40 blur-3xl" />
    <div className="absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />
    <svg
      className="absolute inset-x-0 bottom-0 h-40 w-full text-sky-200/50"
      viewBox="0 0 1440 200"
      preserveAspectRatio="none"
      fill="currentColor"
    >
      <path d="M0,120 C240,180 480,60 720,110 C960,160 1200,60 1440,110 L1440,200 L0,200 Z" />
    </svg>
  </div>
);

export default Bg;
