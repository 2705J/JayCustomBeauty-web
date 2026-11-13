import { useEffect, useRef } from "react";

function esNavidad() {
  const d = new Date();
  const m = d.getMonth();
  return m === 11 || (m === 0 && d.getDate() <= 6);
}

export default function Navidad() {
  const canvasRef = useRef(null);
  const activo = esNavidad();

  useEffect(() => {
    if (!activo) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    let w, h, raf;
    const resize = () => {
      w = c.width = window.innerWidth;
      h = c.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const n = window.innerWidth < 600 ? 35 : 70;
    const copos = Array.from({ length: n }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 3 + 1,
      v: Math.random() * 0.8 + 0.4,
      o: Math.random() * Math.PI * 2,
    }));

    const loop = (t) => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(214,55,122,0.35)";
      for (const f of copos) {
        f.y += f.v;
        f.x += Math.sin(t / 1000 + f.o) * 0.4;
        if (f.y > h) {
          f.y = -5;
          f.x = Math.random() * w;
        }
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, 7);
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [activo]);

  if (!activo) return null;

  return (
    <>
      <style>{`
        .navidad {
          display: flex; align-items: center; gap: 10px;
          margin: 12px 16px; padding: 8px 16px;
          background: #fff; border: 1px solid #f0c9d9;
          border-radius: 999px;
          box-shadow: 0 4px 14px rgba(210,55,122,.12);
        }
        .navidad .lazo {
          width: 44px; flex-shrink: 0;
          animation: balanceo 3s ease-in-out infinite;
          transform-origin: center top;
        }
        .navidad-texto { display: flex; flex-direction: column; }
        .navidad-titulo {
          font-family: "Cormorant Garamond", serif;
          font-style: italic; font-size: 1.5rem;
          line-height: 1; color: #2a0f1a;
        }
        .navidad-sub { font-size: .8rem; color: #b0527a; }
        @keyframes balanceo {
          0%,100% { transform: rotate(-4deg); }
          50% { transform: rotate(4deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .navidad .lazo { animation: none; }
        }
      `}</style>

      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 50,
        }}
      />

      <div className="navidad">
        <svg className="lazo" viewBox="0 0 120 90" aria-hidden="true">
          <path d="M60 45C30 5 0 15 10 45 18 70 45 62 60 45Z" fill="#d6203a" />
          <path d="M60 45C90 5 120 15 110 45 102 70 75 62 60 45Z" fill="#d6203a" />
          <path d="M54 50 36 86l16-8 6-22Z" fill="#b5122b" />
          <path d="M66 50l18 36-16-8-6-22Z" fill="#b5122b" />
          <ellipse cx="60" cy="46" rx="10" ry="11" fill="#a50f25" />
        </svg>
        <div className="navidad-texto">
          <span className="navidad-titulo">Especial Navidad</span>
          <span className="navidad-sub">Gracias por un año increíble, mis amores ✨</span>
        </div>
      </div>
    </>
  );
}
