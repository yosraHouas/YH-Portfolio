export default function AnimatedLogo() {
  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 200 200">
        <defs>
          <path
            id="circlePath"
            d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
            fill="none"
          />
        </defs>
        <text className="text-[16px] fill-blue-400 font-semibold tracking-wider" style={{ letterSpacing: '0.3em' }}>
          <textPath href="#circlePath" startOffset="0%">
            YOSRA HOUAS • YOSRA HOUAS •
          </textPath>
        </text>
      </svg>

      <div className="relative z-10 text-white font-bold text-2xl">
        YH
      </div>
    </div>
  );
}
