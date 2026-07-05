import { Link } from "react-router-dom";
import { useAuth } from "@/store/auth";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/button";
import { Flame, Sparkles, Users, MessageCircle, Search, Shield, ArrowRight, ChevronDown } from "lucide-react";

// Hook to detect when element is in viewport
function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, inView };
}

// SVG Scene: Photographer with camera zooming into lens
function PhotographyScene({ inView }: { inView: boolean }) {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Sky background */}
      <defs>
        <radialGradient id="skyGrad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#c7d2fe" />
          <stop offset="100%" stopColor="#818cf8" />
        </radialGradient>
        <radialGradient id="lensGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#818cf8" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.1" />
        </radialGradient>
        <filter id="blur1">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>
      
      {/* Background */}
      <rect width="400" height="300" fill="url(#skyGrad)" rx="16" />
      
      {/* Ground */}
      <ellipse cx="200" cy="280" rx="180" ry="30" fill="#4ade80" opacity="0.6" />
      <rect x="20" y="260" width="360" height="40" fill="#16a34a" opacity="0.4" rx="8" />
      
      {/* Trees */}
      <g style={{ transform: inView ? "translateY(0)" : "translateY(40px)", opacity: inView ? 1 : 0, transition: "all 1s ease 0.2s" }}>
        <rect x="60" y="200" width="10" height="60" fill="#92400e" />
        <circle cx="65" cy="185" r="30" fill="#16a34a" />
        <circle cx="55" cy="195" r="20" fill="#15803d" />
        <rect x="300" y="210" width="10" height="50" fill="#92400e" />
        <circle cx="305" cy="195" r="25" fill="#16a34a" />
      </g>
      
      {/* Photographer person */}
      <g style={{ transform: inView ? "translateY(0)" : "translateY(60px)", opacity: inView ? 1 : 0, transition: "all 0.8s ease 0.4s" }}>
        {/* Body */}
        <rect x="175" y="200" width="30" height="50" fill="#4f46e5" rx="5" />
        {/* Head */}
        <circle cx="190" cy="190" r="18" fill="#fbbf24" />
        {/* Hair */}
        <ellipse cx="190" cy="176" rx="18" ry="8" fill="#1f2937" />
        {/* Arms */}
        <rect x="155" y="205" width="20" height="8" fill="#fbbf24" rx="4" />
        <rect x="205" y="205" width="20" height="8" fill="#fbbf24" rx="4" />
        {/* Legs */}
        <rect x="178" y="248" width="10" height="30" fill="#1e40af" rx="3" />
        <rect x="192" y="248" width="10" height="30" fill="#1e40af" rx="3" />
      </g>
      
      {/* Camera - big and centered */}
      <g style={{ transform: inView ? "scale(1) translateY(0)" : "scale(0.5) translateY(30px)", transformOrigin: "190px 215px", opacity: inView ? 1 : 0, transition: "all 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) 0.6s" }}>
        <rect x="155" y="205" width="70" height="45" fill="#1f2937" rx="8" />
        <rect x="165" y="198" width="20" height="10" fill="#374151" rx="3" />
        {/* Lens */}
        <circle cx="190" cy="227" r="16" fill="#374151" />
        <circle cx="190" cy="227" r="12" fill="#1e3a8a" />
        <circle cx="190" cy="227" r="8" fill="url(#lensGlow)" />
        <circle cx="190" cy="227" r="4" fill="#ffffff" opacity="0.9" />
        <circle cx="186" cy="223" r="2" fill="#ffffff" opacity="0.6" />
        {/* Flash */}
        <rect x="208" y="210" width="10" height="6" fill="#fbbf24" rx="2" />
        {/* Shutter button */}
        <circle cx="215" cy="207" r="3" fill="#ef4444" />
      </g>

      {/* Lens zoom effect - circle expanding */}
      <circle cx="190" cy="227" r={inView ? "80" : "8"} fill="none" stroke="#ffffff" strokeWidth="2" opacity={inView ? "0" : "0.8"}
        style={{ transition: "r 1.5s ease 1s, opacity 1.5s ease 1s" }} />
      <circle cx="190" cy="227" r={inView ? "60" : "6"} fill="none" stroke="#818cf8" strokeWidth="1.5" opacity={inView ? "0" : "0.6"}
        style={{ transition: "r 1.5s ease 1.2s, opacity 1.5s ease 1.2s" }} />

      {/* Floating stars/sparkles */}
      {[{x:80,y:60,d:"0.3s"},{x:320,y:80,d:"0.5s"},{x:150,y:40,d:"0.7s"},{x:280,y:50,d:"0.9s"}].map((s,i) => (
        <g key={i} style={{ opacity: inView ? 1 : 0, transition: `opacity 0.5s ease ${s.d}` }}>
          <circle cx={s.x} cy={s.y} r="3" fill="#fbbf24" />
          <line x1={s.x} y1={s.y-6} x2={s.x} y2={s.y+6} stroke="#fbbf24" strokeWidth="1.5" />
          <line x1={s.x-6} y1={s.y} x2={s.x+6} y2={s.y} stroke="#fbbf24" strokeWidth="1.5" />
        </g>
      ))}
      
      {/* Label */}
      <text x="190" y="295" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" opacity="0.9">📷 Photography</text>
    </svg>
  );
}

// SVG Scene: Artist sketching
function ArtScene({ inView }: { inView: boolean }) {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="artBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#fde68a" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#artBg)" rx="16" />
      
      {/* Table */}
      <rect x="80" y="220" width="240" height="15" fill="#92400e" rx="4" />
      <rect x="100" y="235" width="10" height="40" fill="#78350f" />
      <rect x="290" y="235" width="10" height="40" fill="#78350f" />
      
      {/* Sketchbook */}
      <g style={{ transform: inView ? "rotateX(0)" : "rotateX(30deg)", transformOrigin: "200px 220px", opacity: inView ? 1 : 0, transition: "all 0.8s ease 0.3s" }}>
        <rect x="120" y="170" width="160" height="55" fill="#ffffff" rx="4" stroke="#d1d5db" strokeWidth="1" />
        <rect x="120" y="170" width="8" height="55" fill="#e5e7eb" rx="2" />
        {/* Sketch lines appearing */}
        <line x1="140" y1="185" x2={inView ? "240" : "140"} y2="185" stroke="#374151" strokeWidth="1.5" style={{ transition: "x2 0.8s ease 0.8s" }} />
        <line x1="140" y1="195" x2={inView ? "220" : "140"} y2="195" stroke="#374151" strokeWidth="1" style={{ transition: "x2 0.8s ease 1s" }} />
        <line x1="140" y1="205" x2={inView ? "235" : "140"} y2="205" stroke="#374151" strokeWidth="1" style={{ transition: "x2 0.8s ease 1.2s" }} />
        {/* Eye sketch */}
        <ellipse cx="190" cy="200" rx={inView ? "15" : "0"} ry={inView ? "8" : "0"} fill="none" stroke="#4f46e5" strokeWidth="1.5" style={{ transition: "all 1s ease 1.4s" }} />
        <circle cx="190" cy="200" r={inView ? "4" : "0"} fill="#4f46e5" style={{ transition: "all 0.5s ease 1.8s" }} />
      </g>
      
      {/* Artist person sitting */}
      <g style={{ transform: inView ? "translateY(0)" : "translateY(50px)", opacity: inView ? 1 : 0, transition: "all 0.7s ease 0.2s" }}>
        <circle cx="200" cy="155" r="18" fill="#fbbf24" />
        <ellipse cx="200" cy="141" rx="18" ry="8" fill="#7c3aed" />
        <rect x="182" y="172" width="36" height="45" fill="#7c3aed" rx="5" />
        {/* Arm with pencil */}
        <rect x="218" y="185" width="35" height="7" fill="#fbbf24" rx="3" style={{ transform: "rotate(-20deg)", transformOrigin: "218px 188px" }} />
        <rect x="248" y="178" width="20" height="4" fill="#fde68a" rx="1" style={{ transform: "rotate(-20deg)", transformOrigin: "248px 180px" }} />
        <rect x="252" y="174" width="6" height="6" fill="#ef4444" rx="1" style={{ transform: "rotate(-20deg)", transformOrigin: "255px 177px" }} />
      </g>

      {/* Color palette */}
      <g style={{ opacity: inView ? 1 : 0, transition: "opacity 0.5s ease 0.6s" }}>
        {["#ef4444","#f59e0b","#10b981","#3b82f6","#8b5cf6"].map((c,i) => (
          <circle key={i} cx={90 + i*18} cy={240} r="7" fill={c} stroke="white" strokeWidth="1.5" />
        ))}
      </g>

      {/* Floating paint drops */}
      {[{x:320,y:100,c:"#ef4444"},{x:340,y:140,c:"#3b82f6"},{x:310,y:160,c:"#10b981"}].map((d,i) => (
        <ellipse key={i} cx={d.x} cy={d.y} rx="6" ry="9" fill={d.c} opacity="0.7"
          style={{ transform: inView ? "translateY(0)" : "translateY(-20px)", opacity: inView ? 0.7 : 0, transition: `all 0.6s ease ${0.4 + i*0.2}s` }} />
      ))}
      
      <text x="200" y="295" textAnchor="middle" fill="#78350f" fontSize="12" fontWeight="bold">�� Art & Sketching</text>
    </svg>
  );
}

// SVG Scene: Musician playing guitar
function MusicScene({ inView }: { inView: boolean }) {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="musicBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#312e81" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#musicBg)" rx="16" />
      
      {/* Stage spotlight */}
      <ellipse cx="200" cy="280" rx="120" ry="20" fill="#fbbf24" opacity="0.15" />
      <path d="M 160 0 L 100 280 L 300 280 L 240 0 Z" fill="#fbbf24" opacity="0.04" />

      {/* Musician */}
      <g style={{ transform: inView ? "translateY(0) scale(1)" : "translateY(30px) scale(0.9)", opacity: inView ? 1 : 0, transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s" }}>
        <circle cx="200" cy="155" r="20" fill="#fbbf24" />
        <ellipse cx="200" cy="139" rx="20" ry="9" fill="#1f2937" />
        <rect x="182" y="173" width="36" height="50" fill="#dc2626" rx="5" />
        
        {/* Guitar */}
        <ellipse cx="235" cy="210" rx="18" ry="22" fill="#92400e" />
        <ellipse cx="235" cy="210" rx="11" ry="14" fill="#78350f" />
        <circle cx="235" cy="210" r="5" fill="#1f2937" />
        <rect x="233" y="170" width="4" height="45" fill="#b45309" />
        <rect x="225" y="170" width="20" height="6" fill="#92400e" rx="2" />
        {["#fbbf24","#d1d5db","#fbbf24","#d1d5db","#fbbf24","#d1d5db"].map((c,i) => (
          <line key={i} x1={233} y1={176+i*2} x2={237} y2={176+i*2} stroke={c} strokeWidth="0.8" />
        ))}
      </g>

      {/* Music notes floating */}
      {[{x:100,y:120,d:"0.5s",r:"-15deg"},{x:280,y:100,d:"0.7s",r:"10deg"},{x:150,y:80,d:"0.9s",r:"-5deg"},{x:310,y:150,d:"1.1s",r:"20deg"}].map((n,i) => (
        <g key={i} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: `all 0.6s ease ${n.d}` }}>
          <text x={n.x} y={n.y} fontSize="24" fill="#fbbf24" opacity="0.8" style={{ transform: `rotate(${n.r})` }}>♪</text>
        </g>
      ))}
      
      {/* Sound waves */}
      {[30,50,70].map((r,i) => (
        <circle key={i} cx="200" cy="210" r={r} fill="none" stroke="#fbbf24" strokeWidth="1" opacity={inView ? 0.3 - i*0.08 : 0}
          style={{ transition: `opacity 0.5s ease ${0.8 + i*0.2}s` }} />
      ))}
      
      <text x="200" y="295" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="bold">🎵 Music</text>
    </svg>
  );
}

// SVG Scene: Programmer coding
function CodingScene({ inView }: { inView: boolean }) {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="codeBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#codeBg)" rx="16" />
      
      {/* Monitor */}
      <g style={{ transform: inView ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)", opacity: inView ? 1 : 0, transition: "all 0.7s ease 0.3s" }}>
        <rect x="100" y="120" width="200" height="130" fill="#1e293b" rx="8" stroke="#334155" strokeWidth="2" />
        <rect x="110" y="130" width="180" height="110" fill="#0f172a" rx="4" />
        <rect x="170" y="250" width="60" height="10" fill="#334155" />
        <rect x="140" y="258" width="120" height="6" fill="#475569" rx="2" />
      </g>
      
      {/* Code lines appearing */}
      <g style={{ opacity: inView ? 1 : 0, transition: "opacity 0.3s ease 0.8s" }}>
        {[
          {y:145, text:"const passion = {", color:"#818cf8"},
          {y:158, text:"  hobby: 'coding',", color:"#34d399"},
          {y:171, text:"  level: 'expert',", color:"#34d399"},
          {y:184, text:"  love: true", color:"#fbbf24"},
          {y:197, text:"};", color:"#818cf8"},
          {y:215, text:"🚀 Building dreams...", color:"#94a3b8"},
        ].map((line, i) => (
          <text key={i} x="118" y={line.y} fontSize="10" fill={line.color} fontFamily="monospace"
            style={{ opacity: inView ? 1 : 0, transition: `opacity 0.3s ease ${0.8 + i*0.15}s` }}>
            {line.text}
          </text>
        ))}
        {/* Cursor blink */}
        <rect x="118" y="220" width="6" height="10" fill="#818cf8" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0;0.8" dur="1s" repeatCount="indefinite" />
        </rect>
      </g>

      {/* Programmer */}
      <g style={{ transform: inView ? "translateY(0)" : "translateY(40px)", opacity: inView ? 1 : 0, transition: "all 0.7s ease 0.2s" }}>
        <circle cx="200" cy="100" r="18" fill="#fbbf24" />
        <ellipse cx="200" cy="86" rx="18" ry="8" fill="#1f2937" />
        <rect x="182" y="117" width="36" height="10" fill="#4f46e5" rx="3" />
        {/* Glasses */}
        <circle cx="194" cy="99" r="6" fill="none" stroke="#6366f1" strokeWidth="1.5" />
        <circle cx="206" cy="99" r="6" fill="none" stroke="#6366f1" strokeWidth="1.5" />
        <line x1="200" y1="99" x2="200" y2="99" stroke="#6366f1" strokeWidth="1.5" />
      </g>

      {/* Floating tech icons */}
      {[{x:60,y:80,t:"</>",c:"#818cf8"},{x:320,y:90,t:"{ }",c:"#34d399"},{x:50,y:180,t:"#!",c:"#fbbf24"},{x:330,y:170,t:"=>",c:"#f472b6"}].map((icon,i) => (
        <text key={i} x={icon.x} y={icon.y} fontSize="14" fill={icon.c} fontFamily="monospace" fontWeight="bold"
          style={{ opacity: inView ? 0.8 : 0, transition: `opacity 0.5s ease ${0.5 + i*0.2}s` }}>
          {icon.t}
        </text>
      ))}
      
      <text x="200" y="295" textAnchor="middle" fill="#818cf8" fontSize="12" fontWeight="bold">💻 Programming</text>
    </svg>
  );
}

// SVG Scene: Fitness
function FitnessScene({ inView }: { inView: boolean }) {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fitBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef2f2" />
          <stop offset="100%" stopColor="#fee2e2" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#fitBg)" rx="16" />
      
      {/* Ground mat */}
      <rect x="60" y="240" width="280" height="20" fill="#dc2626" rx="5" opacity="0.7" />
      
      {/* Dumbbell */}
      <g style={{ transform: inView ? "translateY(0) rotate(0deg)" : "translateY(30px) rotate(-10deg)", transformOrigin: "200px 220px", opacity: inView ? 1 : 0, transition: "all 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s" }}>
        <rect x="120" y="215" width="160" height="12" fill="#374151" rx="6" />
        <rect x="108" y="205" width="24" height="30" fill="#6b7280" rx="8" />
        <rect x="100" y="208" width="12" height="24" fill="#9ca3af" rx="4" />
        <rect x="268" y="205" width="24" height="30" fill="#6b7280" rx="8" />
        <rect x="288" y="208" width="12" height="24" fill="#9ca3af" rx="4" />
      </g>
      
      {/* Athlete lifting */}
      <g style={{ transform: inView ? "translateY(0)" : "translateY(40px)", opacity: inView ? 1 : 0, transition: "all 0.7s ease 0.3s" }}>
        <circle cx="200" cy="165" r="20" fill="#fbbf24" />
        <ellipse cx="200" cy="149" rx="20" ry="9" fill="#1f2937" />
        <rect x="183" y="183" width="34" height="55" fill="#dc2626" rx="5" />
        {/* Arms raised */}
        <rect x="148" y="183" width="38" height="10" fill="#fbbf24" rx="5" style={{ transform: "rotate(-30deg)", transformOrigin: "183px 188px" }} />
        <rect x="214" y="183" width="38" height="10" fill="#fbbf24" rx="5" style={{ transform: "rotate(30deg)", transformOrigin: "217px 188px" }} />
        {/* Legs */}
        <rect x="186" y="236" width="12" height="35" fill="#1e40af" rx="4" />
        <rect x="202" y="236" width="12" height="35" fill="#1e40af" rx="4" />
      </g>

      {/* Energy lines */}
      {[{x:80,y:150},{x:310,y:150},{x:70,y:190},{x:320,y:190}].map((l,i) => (
        <line key={i} x1={l.x} y1={l.y} x2={l.x + (l.x < 200 ? 20 : -20)} y2={l.y}
          stroke="#dc2626" strokeWidth="2" strokeLinecap="round"
          style={{ opacity: inView ? 0.6 : 0, transition: `opacity 0.3s ease ${0.6 + i*0.1}s` }} />
      ))}

      {/* Sweat drops */}
      {[{x:170,y:150},{x:230,y:145},{x:185,y:160}].map((d,i) => (
        <ellipse key={i} cx={d.x} cy={d.y} rx="3" ry="5" fill="#60a5fa" opacity="0.7"
          style={{ opacity: inView ? 0.7 : 0, transition: `opacity 0.5s ease ${0.8 + i*0.2}s` }} />
      ))}
      
      <text x="200" y="295" textAnchor="middle" fill="#dc2626" fontSize="12" fontWeight="bold">💪 Fitness</text>
    </svg>
  );
}

// SVG Scene: Cooking
function CookingScene({ inView }: { inView: boolean }) {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cookBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ecfdf5" />
          <stop offset="100%" stopColor="#d1fae5" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#cookBg)" rx="16" />
      
      {/* Kitchen counter */}
      <rect x="60" y="220" width="280" height="20" fill="#d97706" rx="4" />
      <rect x="60" y="238" width="280" height="30" fill="#b45309" rx="4" />
      
      {/* Pan with steam */}
      <g style={{ transform: inView ? "translateY(0)" : "translateY(30px)", opacity: inView ? 1 : 0, transition: "all 0.7s ease 0.4s" }}>
        <ellipse cx="200" cy="225" rx="60" ry="12" fill="#374151" />
        <rect x="140" y="213" width="120" height="14" fill="#4b5563" rx="3" />
        <rect x="255" y="215" width="40" height="8" fill="#6b7280" rx="4" />
        {/* Food in pan */}
        <ellipse cx="200" cy="213" rx="50" ry="8" fill="#f59e0b" opacity="0.8" />
        <circle cx="185" cy="213" r="6" fill="#ef4444" opacity="0.9" />
        <circle cx="200" cy="211" r="5" fill="#10b981" opacity="0.9" />
        <circle cx="215" cy="213" r="6" fill="#f97316" opacity="0.9" />
      </g>
      
      {/* Steam */}
      {[185,200,215].map((x,i) => (
        <path key={i} d={`M ${x} 205 Q ${x+8} 195 ${x} 185 Q ${x-8} 175 ${x} 165`}
          fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round"
          style={{ opacity: inView ? 0.6 : 0, transition: `opacity 0.5s ease ${0.8 + i*0.2}s` }}>
          <animate attributeName="d" 
            values={`M ${x} 205 Q ${x+8} 195 ${x} 185 Q ${x-8} 175 ${x} 165;M ${x} 205 Q ${x-8} 195 ${x} 185 Q ${x+8} 175 ${x} 165;M ${x} 205 Q ${x+8} 195 ${x} 185 Q ${x-8} 175 ${x} 165`}
            dur="2s" repeatCount="indefinite" />
        </path>
      ))}
      
      {/* Chef */}
      <g style={{ transform: inView ? "translateY(0)" : "translateY(40px)", opacity: inView ? 1 : 0, transition: "all 0.7s ease 0.2s" }}>
        <circle cx="200" cy="155" r="20" fill="#fbbf24" />
        {/* Chef hat */}
        <rect x="185" y="130" width="30" height="20" fill="white" rx="3" />
        <ellipse cx="200" cy="130" rx="22" ry="8" fill="white" />
        <ellipse cx="200" cy="148" rx="18" ry="5" fill="#e5e7eb" />
        <rect x="183" y="173" width="34" height="45" fill="#ffffff" rx="5" stroke="#e5e7eb" strokeWidth="1" />
        <rect x="155" y="180" width="30" height="8" fill="#fbbf24" rx="4" />
        <circle cx="153" cy="185" r="5" fill="#9ca3af" />
      </g>
      
      {/* Ingredients */}
      {[{x:100,y:200,c:"#ef4444",r:8},{x:290,y:195,c:"#f59e0b",r:10},{x:80,y:225,c:"#10b981",r:7}].map((v,i) => (
        <circle key={i} cx={v.x} cy={v.y} r={v.r} fill={v.c}
          style={{ opacity: inView ? 1 : 0, transition: `opacity 0.4s ease ${0.5 + i*0.2}s` }} />
      ))}
      
      <text x="200" y="295" textAnchor="middle" fill="#065f46" fontSize="12" fontWeight="bold">🍳 Cooking</text>
    </svg>
  );
}

// Scene wrapper with scroll animation
function HobbyScene({ title, description, index, children }: {
  title: string;
  description: string;
  index: number;
  children: React.ReactNode;
}) {
  const { ref, inView } = useInView(0.2);
  const isEven = index % 2 === 0;
  
  return (
    <div ref={ref} className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-12 py-16 border-b border-gray-100 dark:border-gray-800 last:border-0`}>
      <div className={`flex-1 ${isEven ? "lg:pr-8" : "lg:pl-8"}`}
        style={{ opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : isEven ? "translateX(-40px)" : "translateX(40px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}>
        <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{title}</h3>
        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
      </div>
      <div className="flex-1 w-full max-w-sm aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl"
        style={{ opacity: inView ? 1 : 0, transform: inView ? "scale(1) translateY(0)" : "scale(0.9) translateY(30px)", transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.1s" }}>
        {children}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const hobbyScenes = [
    {
      title: "Capture Every Moment",
      description: "Share your photography journey with a community that appreciates the art of capturing life. From golden hour shots to street photography — every click tells a story.",
      scene: (inView: boolean) => <PhotographyScene inView={inView} />,
    },
    {
      title: "Express Through Art",
      description: "Whether you sketch, paint, or sculpt — your creative expressions deserve an audience. Connect with fellow artists who understand the language of visual art.",
      scene: (inView: boolean) => <ArtScene inView={inView} />,
    },
    {
      title: "Make Music Together",
      description: "From bedroom producers to stage performers — music connects souls. Share your melodies, collaborate on projects, and find your bandmates here.",
      scene: (inView: boolean) => <MusicScene inView={inView} />,
    },
    {
      title: "Code Your Dreams",
      description: "Build, share, and grow with a community of passionate developers. Showcase your projects, get feedback, and collaborate with engineers worldwide.",
      scene: (inView: boolean) => <CodingScene inView={inView} />,
    },
    {
      title: "Push Your Limits",
      description: "Track your fitness journey, share your achievements, and inspire others. From marathon runners to gym enthusiasts — every rep counts.",
      scene: (inView: boolean) => <FitnessScene inView={inView} />,
    },
    {
      title: "Cook with Passion",
      description: "Share recipes, cooking tips, and culinary adventures. From home cooks to aspiring chefs — food is the universal language of love.",
      scene: (inView: boolean) => <CookingScene inView={inView} />,
    },
  ];

  const features = [
    { icon: Users, title: "Connect with Passion", description: "Find people who share your interests.", color: "from-indigo-500 to-purple-600" },
    { icon: MessageCircle, title: "Real-Time Chat", description: "Chat instantly with fellow enthusiasts.", color: "from-pink-500 to-rose-600" },
    { icon: Search, title: "Discover Communities", description: "Explore trending hobbies and communities.", color: "from-emerald-500 to-teal-600" },
    { icon: Shield, title: "Safe & Secure", description: "Your data is protected always.", color: "from-orange-500 to-red-600" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 navbar-glass">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200 animate-float">
                <Flame className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">PassionVerse</span>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login"><Button variant="ghost" size="sm">Log In</Button></Link>
              {isAuthenticated ? (
                <Link to="/feed"><Button variant="primary" size="sm">Go to Feed <ArrowRight className="w-4 h-4" /></Button></Link>
              ) : (
                <Link to="/register"><Button variant="primary" size="sm">Get Started <ArrowRight className="w-4 h-4" /></Button></Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-950 dark:to-indigo-950/30" />
        {/* Parallax background orbs */}
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-indigo-200/40 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }} />
        <div className="absolute top-40 right-1/4 w-48 h-48 bg-purple-200/40 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }} />
        <div className="absolute bottom-20 left-1/3 w-32 h-32 bg-pink-200/30 rounded-full blur-2xl"
          style={{ transform: `translateY(${scrollY * 0.15}px)` }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-4 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-6 animate-bounce-in">
              <Sparkles className="w-4 h-4" />
              Where Passions Connect
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-6 animate-fade-in">
              Connect Through{" "}
              <span className="gradient-text-animate">Passion</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up">
              PassionVerse is the social network for your hobbies. Share your creations, discover new interests,
              and connect with people who share your enthusiasm.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
              {isAuthenticated ? (
                <Link to="/feed"><Button variant="primary" size="lg">Go to Feed <ArrowRight className="w-5 h-5" /></Button></Link>
              ) : (
                <>
                  <Link to="/register">
                    <button className="btn-primary-gradient text-white px-8 py-3.5 rounded-xl font-semibold flex items-center gap-2">
                      Join PassionVerse <ArrowRight className="w-5 h-5" />
                    </button>
                  </Link>
                  <Link to="/login"><Button variant="outline" size="lg">Sign In</Button></Link>
                </>
              )}
            </div>
            {/* Scroll indicator */}
            <div className="mt-16 flex flex-col items-center gap-2 animate-bounce">
              <p className="text-sm text-gray-400">Scroll to explore hobbies</p>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Animated Hobby Scenes */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Your <span className="gradient-text">Passions</span>, Brought to Life
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Whatever you love — we have a community waiting for you.
            </p>
          </div>
          {hobbyScenes.map((hobby, index) => {
            const { ref, inView } = useInView(0.2);
            return (
              <div key={index} ref={ref}
                className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-12 py-16 border-b border-gray-100 dark:border-gray-800 last:border-0`}>
                <div className={`flex-1 ${index % 2 === 0 ? "lg:pr-8" : "lg:pl-8"}`}
                  style={{ opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : index % 2 === 0 ? "translateX(-40px)" : "translateX(40px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{hobby.title}</h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">{hobby.description}</p>
                  <Link to="/register" className="inline-flex items-center gap-2 mt-6 text-indigo-600 font-semibold hover:text-indigo-700">
                    Join this community <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="flex-1 w-full max-w-sm aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl hover-lift"
                  style={{ opacity: inView ? 1 : 0, transform: inView ? "scale(1) translateY(0)" : "scale(0.9) translateY(30px)", transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.1s" }}>
                  {hobby.scene(inView)}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Everything You Need</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">A complete platform to share, connect, and grow through your passions.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={feature.title} className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover-lift dark:border-gray-800 dark:bg-gray-900"
                style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hobbies Tags */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Explore Hobbies</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">From coding to cooking, find your community.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {["💻 Programming", "🤖 AI", "📷 Photography", "🎵 Music", "⚽ Football", "🎨 Art", "🍳 Cooking", "💪 Fitness", "✈️ Traveling", "🎮 Gaming", "✍️ Writing", "🔬 Science", "💼 Entrepreneurship", "🏏 Cricket"].map((hobby, i) => (
              <span key={hobby} className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all hover:bg-indigo-50 hover:text-indigo-600 hover:scale-105 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 cursor-pointer"
                style={{ animationDelay: `${i * 0.05}s` }}>
                {hobby}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 animate-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute w-2 h-2 bg-white rounded-full"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 3}s` }} />
          ))}
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Share Your Passion?</h2>
          <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">Join thousands of creators, makers, and enthusiasts already connecting through their hobbies.</p>
          {isAuthenticated ? (
            <Link to="/feed"><Button variant="secondary" size="lg">Go to Feed <ArrowRight className="w-5 h-5" /></Button></Link>
          ) : (
            <Link to="/register">
              <button className="bg-white text-indigo-600 px-8 py-3.5 rounded-xl font-semibold hover:bg-indigo-50 transition-all hover:scale-105 shadow-lg flex items-center gap-2 mx-auto">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-indigo-600" />
              <span className="font-bold gradient-text">PassionVerse</span>
            </div>
            <p className="text-sm text-gray-500">© 2024 PassionVerse. Connect Through Passion.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
