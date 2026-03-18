"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = el.querySelectorAll(".rv");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { (e.target as HTMLElement).classList.add("rv-show"); observer.unobserve(e.target); }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
  return ref;
}

/* Wari logo — stylized bus route arrow */
function WariLogo({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <rect width="32" height="32" rx="8" fill="currentColor" />
      <path d="M10 16h10m0 0l-4-4m4 4l-4 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8" cy="16" r="1.5" fill="white" opacity="0.5" />
    </svg>
  );
}

export default function Landing() {
  const scrollRef = useScrollReveal();

  return (
    <div ref={scrollRef} className="min-h-screen overflow-hidden">

      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#eef1f5] via-[#f3f4f7] to-[#e9ecf2]">
        <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-[#1e3a5f]/[0.025] rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -left-20 w-[500px] h-[500px] bg-indigo-300/[0.05] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-200/[0.06] rounded-full blur-[120px]" />
      </div>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-3 sm:mx-6 mt-3 sm:mt-4">
          <div className="max-w-5xl mx-auto bg-white/70 backdrop-blur-2xl rounded-2xl border border-white/80 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)] px-4 sm:px-5 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <WariLogo size={28} className="text-[#1e3a5f]" />
              <span className="text-sm font-extrabold tracking-tight text-[#1e3a5f]">Wari</span>
            </div>
            <Link href="/demo" className="text-[11px] font-bold text-white bg-[#1e3a5f] hover:bg-[#162d4a] px-4 py-2 rounded-xl transition-all hover:shadow-lg hover:shadow-[#1e3a5f]/10 active:scale-[0.97]">
              Probar ahora →
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-36 pb-16 sm:pt-48 sm:pb-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold text-[#1e3a5f]/60 uppercase tracking-[0.15em] mb-7 px-4 py-2 rounded-full bg-white/70 backdrop-blur border border-white/80 shadow-sm he he-0">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 land-pulse" />
            Metropolitano de Lima
          </div>
          <h1 className="text-[clamp(2.2rem,6vw,4.5rem)] font-extrabold tracking-tight leading-[1.08] mb-7 text-[#1e3a5f] he he-1">
            Tu ruta en el
            <br />
            <span className="relative inline-block">
              Metropolitano
              <svg className="absolute -bottom-1 left-0 w-full h-3 text-orange-400/40" viewBox="0 0 200 12" preserveAspectRatio="none"><path d="M0 8 Q50 0 100 6 T200 4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
            </span>
            {" "}al instante
          </h1>
          <p className="text-base sm:text-lg text-[#1e3a5f]/40 max-w-md mx-auto mb-10 leading-relaxed he he-2">
            Dile a Wari a donde vas y te dice la ruta exacta, con transbordo y todo.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 he he-3">
            <Link
              href="/demo"
              className="group inline-flex items-center gap-2.5 bg-[#1e3a5f] text-white font-bold text-base px-8 py-4 rounded-2xl transition-all hover:shadow-2xl hover:shadow-[#1e3a5f]/15 hover:scale-[1.03] active:scale-[0.97]"
            >
              Preguntar mi ruta
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <span className="text-xs text-[#1e3a5f]/25 font-medium">Gratis · Sin registro</span>
          </div>

          {/* Mock chat card */}
          <div className="mt-16 sm:mt-20 max-w-sm mx-auto he he-4">
            <div className="relative group">
              <div className="absolute -inset-6 bg-gradient-to-b from-[#1e3a5f]/[0.05] via-indigo-200/[0.08] to-transparent rounded-[32px] blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-5 text-left shadow-[0_8px_40px_-12px_rgba(30,58,95,0.1)] border border-white/70 hover:shadow-[0_16px_56px_-16px_rgba(30,58,95,0.15)] transition-shadow duration-500">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100/60">
                  <WariLogo size={24} className="text-[#1e3a5f]" />
                  <span className="text-xs font-bold text-[#1e3a5f]/40">Wari</span>
                  <span className="ml-auto text-[8px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full font-bold">ONLINE</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-end cm cm-1">
                    <div className="bg-[#1e3a5f] rounded-2xl rounded-br-sm px-3.5 py-2 shadow-sm">
                      <p className="text-[13px] text-white">Estoy en Naranjal, quiero ir a Angamos</p>
                    </div>
                  </div>
                  <div className="flex justify-start cm cm-2">
                    <div className="bg-slate-50/80 rounded-2xl rounded-bl-sm px-3.5 py-2.5">
                      <p className="text-[13px] text-[#1e3a5f]/70 leading-relaxed">
                        <span className="font-bold text-[#1e3a5f]">Mejor opcion:</span><br />
                        🚌 Expreso 5 → directo a Angamos<br />
                        📍 Solo 7 paradas · sin transbordo<br />
                        ⚡ ~18 min · S/ 3.20
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/70 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.05)] p-8 sm:p-10 rv">
            <div className="flex justify-center gap-6 sm:gap-14">
              {[
                { n: "44", l: "Estaciones", color: "text-[#1e3a5f]", bg: "bg-[#1e3a5f]/[0.05]" },
                { n: "18", l: "Rutas", color: "text-orange-600", bg: "bg-orange-500/[0.05]" },
                { n: "22", l: "Alimentadores", color: "text-emerald-600", bg: "bg-emerald-500/[0.05]" },
              ].map((s, i) => (
                <div key={s.l} className="text-center rv" style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${s.bg} mb-3`}>
                    <p className={`text-2xl sm:text-4xl font-extrabold ${s.color}`}>{s.n}</p>
                  </div>
                  <p className="text-[11px] text-[#1e3a5f]/30 font-semibold">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-20 sm:py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em] text-center mb-3 rv">Como funciona</p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-center mb-16 text-[#1e3a5f] rv">Asi de simple</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { step: "01", title: "Dile a donde vas", desc: "Escribe tu origen y destino, o comparte tu ubicacion GPS.", icon: "📍" },
              { step: "02", title: "Recibe tu ruta", desc: "Wari analiza las 18 rutas y te da la mejor opcion al instante.", icon: "🧠" },
              { step: "03", title: "Sube al bus correcto", desc: "Sabes donde subirte, donde bajarte y cuanto pagas.", icon: "🚌" },
            ].map((s, i) => (
              <div key={s.step} className="rv" style={{ transitionDelay: `${i * 120}ms` }}>
                <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-7 border border-white/70 shadow-sm hover:bg-white/80 hover:shadow-xl hover:shadow-[#1e3a5f]/[0.03] hover:-translate-y-1.5 transition-all duration-500 text-center h-full group cursor-default">
                  <span className="text-3xl mb-4 block group-hover:scale-110 transition-transform duration-500">{s.icon}</span>
                  <p className="text-[10px] font-bold text-orange-500/50 mb-2 tracking-wider">{s.step}</p>
                  <h3 className="text-base font-bold text-[#1e3a5f] mb-2">{s.title}</h3>
                  <p className="text-sm text-[#1e3a5f]/35 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 sm:py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-[10px] font-bold text-[#1e3a5f]/40 uppercase tracking-[0.2em] text-center mb-3 rv">Funcionalidades</p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-center mb-3 text-[#1e3a5f] rv">Todo lo que necesitas</h2>
          <p className="text-sm text-[#1e3a5f]/30 text-center mb-14 rv">del Metropolitano de Lima</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { emoji: "🚌", title: "Expresos y regulares", desc: "Sabe que expreso te conviene y si esta operando ahora." },
              { emoji: "🔄", title: "Transbordos claros", desc: "Te dice donde cambiar de bus y que ruta tomar despues." },
              { emoji: "📍", title: "Tu estacion mas cercana", desc: "Detecta tu ubicacion y encuentra la estacion mas cerca." },
              { emoji: "⏰", title: "Filtrado por horario", desc: "Solo te recomienda rutas que operan en este momento." },
              { emoji: "🔗", title: "22 alimentadores", desc: "Buses que conectan los barrios con las estaciones terminales." },
              { emoji: "💰", title: "Tarifas claras", desc: "Troncal S/ 3.20, alimentador desde S/ 1.00, integrada S/ 3.50." },
            ].map((f, i) => (
              <div key={f.title} className="rv" style={{ transitionDelay: `${i * 70}ms` }}>
                <div className="flex items-start gap-4 bg-white/50 backdrop-blur-xl rounded-2xl p-5 border border-white/60 hover:bg-white/80 hover:shadow-lg hover:shadow-[#1e3a5f]/[0.03] hover:-translate-y-0.5 transition-all duration-500 group h-full">
                  <span className="text-xl shrink-0 mt-0.5 group-hover:scale-125 transition-transform duration-300">{f.emoji}</span>
                  <div>
                    <h3 className="text-sm font-bold text-[#1e3a5f] mb-1">{f.title}</h3>
                    <p className="text-xs text-[#1e3a5f]/35 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COBERTURA */}
      <section className="py-20 sm:py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] mb-3 rv">Cobertura</p>
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-4 text-[#1e3a5f] rv">Todo el Metropolitano</h2>
          <p className="text-sm text-[#1e3a5f]/30 mb-12 rv">De Chimpu Ocllo a Matellini. Norte, centro y sur de Lima.</p>
          <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto">
            {[
              { zone: "Norte", from: "Chimpu Ocllo", to: "Caqueta", bg: "bg-[#1e3a5f]/[0.05]", border: "border-[#1e3a5f]/10", dot: "bg-[#1e3a5f]", text: "text-[#1e3a5f]" },
              { zone: "Centro", from: "R. Castilla", to: "Est. Central", bg: "bg-orange-500/[0.05]", border: "border-orange-500/10", dot: "bg-orange-500", text: "text-orange-700" },
              { zone: "Sur", from: "Est. Nacional", to: "Matellini", bg: "bg-emerald-500/[0.05]", border: "border-emerald-500/10", dot: "bg-emerald-500", text: "text-emerald-700" },
            ].map((z, i) => (
              <div key={z.zone} className="rv" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className={`rounded-2xl border ${z.border} ${z.bg} p-5 hover:-translate-y-1 hover:shadow-md transition-all duration-500`}>
                  <div className={`w-3 h-3 rounded-full ${z.dot} mx-auto mb-3`} />
                  <p className={`text-sm font-bold ${z.text} mb-1`}>{z.zone}</p>
                  <p className="text-[10px] text-[#1e3a5f]/25 leading-snug">{z.from} → {z.to}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 px-6">
        <div className="max-w-xl mx-auto rv">
          <div className="relative bg-[#1e3a5f] rounded-[2rem] px-8 py-14 sm:px-14 sm:py-16 text-center overflow-hidden shadow-2xl shadow-[#1e3a5f]/15">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/[0.03] rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-orange-500/[0.08] rounded-full translate-y-1/2 -translate-x-1/4" />
            <div className="relative">
              <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center land-float">
                <WariLogo size={28} className="text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 text-white">Pruebalo ahora</h2>
              <p className="text-sm text-white/40 mb-8">Preguntale tu ruta. Es gratis y funciona al instante.</p>
              <Link
                href="/demo"
                className="group inline-flex items-center gap-2.5 bg-white text-[#1e3a5f] font-bold text-base px-8 py-4 rounded-2xl transition-all hover:shadow-xl hover:shadow-black/10 hover:scale-[1.03] active:scale-[0.97]"
              >
                Abrir Wari
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <WariLogo size={20} className="text-[#1e3a5f]/40" />
            <span className="text-xs font-bold text-[#1e3a5f]/50">Wari</span>
            <span className="text-[10px] text-[#1e3a5f]/20">por <a href="https://www.linkedin.com/in/aguilardavidp/" target="_blank" rel="noopener noreferrer" className="hover:text-[#1e3a5f]/40 transition-colors">David Aguilar</a></span>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://www.linkedin.com/in/aguilardavidp/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#1e3a5f]/20 hover:text-[#1e3a5f]/50 transition-colors flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </a>
            <a href="https://github.com/DavidAguilarParedes/wari-metropolitano" target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#1e3a5f]/20 hover:text-[#1e3a5f]/50 transition-colors flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </a>
            <span className="text-[10px] text-[#1e3a5f]/20">#WariAI</span>
          </div>
        </div>
      </footer>

      {/* Animations */}
      <style jsx>{`
        @keyframes he-in {
          from { opacity: 0; transform: translateY(30px) scale(0.97); filter: blur(4px); }
          to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        .he { animation: he-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .he-0 { animation-delay: 0s; }
        .he-1 { animation-delay: 0.1s; }
        .he-2 { animation-delay: 0.2s; }
        .he-3 { animation-delay: 0.3s; }
        .he-4 { animation-delay: 0.5s; }
        @keyframes cm-in {
          from { opacity: 0; transform: translateY(8px) scale(0.94); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .cm { animation: cm-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .cm-1 { animation-delay: 1.1s; }
        .cm-2 { animation-delay: 1.8s; }
        .rv {
          opacity: 0;
          transform: translateY(28px) scale(0.98);
          transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .rv-show { opacity: 1; transform: translateY(0) scale(1); }
        @keyframes land-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }
        .land-float { animation: land-float 4s ease-in-out infinite; }
        @keyframes land-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(234,88,12,0.4); }
          50% { opacity: 0.7; box-shadow: 0 0 0 4px rgba(234,88,12,0); }
        }
        .land-pulse { animation: land-pulse 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
