import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

function esNavidad() {
  const d = new Date();
  const m = d.getMonth();
  const dia = d.getDate();
  return (m === 10 && dia >= 13) || m === 11 || (m === 0 && dia <= 6);
}

function dibujarCopo(ctx, x, y, r, rot) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    ctx.rotate(Math.PI / 3);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, r);
    ctx.moveTo(0, r * 0.55);
    ctx.lineTo(r * 0.28, r * 0.82);
    ctx.moveTo(0, r * 0.55);
    ctx.lineTo(-r * 0.28, r * 0.82);
  }
  ctx.stroke();
  ctx.restore();
}

function Banner() {
  return (
    <span className="navidad">
      <svg className="lazo" viewBox="0 0 120 90" aria-hidden="true">
        <path d="M60 45C30 5 0 15 10 45 18 70 45 62 60 45Z" fill="#d6203a" />
        <path d="M60 45C90 5 120 15 110 45 102 70 75 62 60 45Z" fill="#d6203a" />
        <path d="M54 50 36 86l16-8 6-22Z" fill="#b5122b" />
        <path d="M66 50l18 36-16-8-6-22Z" fill="#b5122b" />
        <ellipse cx="60" cy="46" rx="10" ry="11" fill="#a50f25" />
      </svg>
      <span className="navidad-texto">
        <span className="navidad-titulo">Especial Navidad</span>
        <span className="navidad-sub">Gracias por un año increíble, mis besties ✨</span>
      </span>
    </span>
  );
}

export default function Navidad() {
  const canvasRef = useRef(null);
  const [slot, setSlot] = useState(null);
  const activo = esNavidad();

  // Nieve
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

    const n = window.innerWidth < 600 ? 22 : 40;
    const copos = Array.from({ length: n }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 5 + 4,
      v: Math.random() * 0.6 + 0.3,
      o: Math.random() * Math.PI * 2,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.01,
    }));

    ctx.lineWidth = 1.2;
    ctx.lineCap = "round";

    const loop = (t) => {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(214,55,122,0.55)";
      for (const f of copos) {
        f.y += f.v;
        f.x += Math.sin(t / 1000 + f.o) * 0.35;
        f.rot += f.vr;
        if (f.y > h + 10) {
          f.y = -10;
          f.x = Math.random() * w;
        }
        dibujarCopo(ctx, f.x, f.y, f.r, f.rot);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [activo]);

  // Sustituye el título de la portada por el banner
  useEffect(() => {
    if (!activo) return;
    let holder = null;
    let oculto = null;

    const colocar = () => {
      const h1 = document.querySelector("h1.hero-font");
      if (!h1) return;
      if (h1.dataset.navidad === "1" && holder && holder.isConnected) return;
      if (holder) holder.remove();
      h1.dataset.navidad = "1";
      h1.style.display = "none";
      oculto = h1;
      holder = document.createElement("div");
      holder.style.marginBottom = "1.25rem";
      h1.insertAdjacentElement("afterend", holder);
      setSlot(holder);
    };

    colocar();
    const obs = new MutationObserver(colocar);
    obs.observe(document.body, { childList: true, subtree: true });

    return () => {
      obs.disconnect();
      if (oculto) oculto.style.display = "";
      if (holder) holder.remove();
    };
  }, [activo]);

  if (!activo) return null;

  return (
    <>
      <style>{`
        .navidad {
          display: flex; align-items: center; gap: 10px;
          width: fit-content; max-width: calc(100% - 32px);
          margin: 12px auto; padding: 8px 16px;
          background: #fff; border: 1px solid #f0c9d9;
          border-radius: 999px;
          box-shadow: 0 4px 14px rgba(210,55,122,.12);
          text-align: left; font-style: normal;
        }
        @media (min-width: 768px) { .navidad { margin-left: 0; } }
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
        .navidad-sub { font-size: .8rem; color: #b0527a; line-height: 1.2; }
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

      {slot && createPortal(<Banner />, slot)}
    </>
  );
}
