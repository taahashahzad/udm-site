import { useState, useEffect, useRef } from "react";
import AIChat from "./AIChat.jsx";

// ─────────────────────────────────────────────────────────────
// HOW TO ADD YOUR LOGO:
// 1. Copy your logo image (e.g. logo.png) into the src/ folder
// 2. Uncomment the import line below and change the filename
// 3. Replace <div className="udm-logo">UDM.</div> in the navbar
//    with: <img src={logo} className="udm-logo-img" alt="Logo" />
// ─────────────────────────────────────────────────────────────
import logo from "./logo.png";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&family=Plus+Jakarta+Sans:wght@200;400;700;800&display=swap');

  :root {
    --blue: #00f2ff;
    --red: #ff0055;
    --green: #39ff14;
    --bg: #000;
    --glass: rgba(255,255,255,0.03);
  }

  * { margin:0; padding:0; box-sizing:border-box; scroll-behavior:smooth; }
  body { background:#000; color:white; font-family:'Plus Jakarta Sans',sans-serif; overflow-x:hidden; }

  /* Custom cursor — desktop only */
  @media (pointer: fine) {
    * { cursor: none; }
    #udm-cursor { width:10px; height:10px; background:white; border-radius:50%; position:fixed; z-index:99999; mix-blend-mode:difference; pointer-events:none; }
    #udm-cursor-f { width:40px; height:40px; border:1px solid var(--blue); border-radius:50%; position:fixed; z-index:99998; pointer-events:none; }
  }

  /* Intro */
  .udm-intro { position:fixed; inset:0; background:#000; z-index:10000; display:flex; align-items:center; justify-content:center; transition:transform 1s cubic-bezier(0.76,0,0.24,1); }
  .udm-intro.exit { transform:translateY(-100%); }
  .udm-intro-txt { font-family:'Syncopate',sans-serif; font-size:clamp(1.2rem,5vw,3rem); font-weight:700; color:var(--blue); letter-spacing:clamp(4px,2vw,15px); transition:opacity 0.4s, transform 0.4s; }

  /* Navbar */
  .udm-nav { position:fixed; top:0; width:100%; display:flex; justify-content:space-between; align-items:center; padding:16px 5%; z-index:1000; background:rgba(0,0,0,0.9); backdrop-filter:blur(25px); border-bottom:1px solid rgba(255,255,255,0.05); gap:16px; }
  .udm-logo { font-family:'Syncopate',sans-serif; font-weight:700; font-size:1.4rem; letter-spacing:5px; color:var(--blue); text-shadow:0 0 20px var(--blue); flex-shrink:0; }
  .udm-logo-img { height:44px; width:auto; object-fit:contain; flex-shrink:0; }

  /* Search */
  .udm-search-wrap { position:relative; flex:1; max-width:320px; min-width:0; }
  .udm-search-box { background:rgba(255,255,255,0.08); padding:6px 14px; border-radius:30px; border:1px solid var(--blue); display:flex; align-items:center; gap:8px; }
  .udm-search-box input { background:none; border:none; color:white; padding:4px; outline:none; font-size:0.9rem; width:100%; font-family:'Plus Jakarta Sans',sans-serif; }
  .udm-search-box input::placeholder { color:#555; }

  /* Search dropdown */
  .udm-search-drop { position:absolute; top:calc(100% + 8px); left:0; right:0; background:rgba(5,5,15,0.98); border:1px solid var(--blue); border-radius:16px; overflow:hidden; z-index:2000; backdrop-filter:blur(20px); box-shadow:0 20px 60px rgba(0,242,255,0.15); max-height:320px; overflow-y:auto; }
  .udm-drop-item { padding:13px 20px; cursor:pointer; display:flex; align-items:center; gap:12px; transition:0.2s; border-bottom:1px solid rgba(255,255,255,0.04); font-size:0.9rem; letter-spacing:1px; }
  .udm-drop-item:last-child { border-bottom:none; }
  .udm-drop-item:hover { background:rgba(0,242,255,0.08); color:var(--blue); }
  .udm-drop-dot { width:6px; height:6px; border-radius:50%; background:var(--green); flex-shrink:0; }
  .udm-drop-empty { padding:20px; text-align:center; color:#555; font-size:0.85rem; }

  /* Desktop nav links */
  .udm-nav-links { display:flex; align-items:center; flex-shrink:0; }
  .udm-nav-links a { color:#fff; text-decoration:none; margin-left:20px; font-weight:700; font-size:0.7rem; letter-spacing:1px; transition:0.3s; white-space:nowrap; }
  .udm-nav-links a:hover { color:var(--green); }

  /* Hamburger */
  .udm-burger { display:none; flex-direction:column; gap:5px; background:none; border:none; padding:6px; cursor:pointer; flex-shrink:0; z-index:1100; }
  .udm-burger span { display:block; width:26px; height:2px; background:var(--blue); border-radius:2px; transition:0.3s; }
  .udm-burger.open span:nth-child(1) { transform:translateY(7px) rotate(45deg); }
  .udm-burger.open span:nth-child(2) { opacity:0; }
  .udm-burger.open span:nth-child(3) { transform:translateY(-7px) rotate(-45deg); }

  /* Mobile drawer */
  .udm-drawer { position:fixed; inset:0; background:rgba(0,0,0,0.97); z-index:1050; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:36px; transform:translateX(100%); transition:transform 0.4s cubic-bezier(0.76,0,0.24,1); }
  .udm-drawer.open { transform:translateX(0); }
  .udm-drawer a { color:#fff; text-decoration:none; font-family:'Syncopate',sans-serif; font-size:clamp(1.2rem,6vw,1.8rem); font-weight:700; letter-spacing:6px; transition:0.3s; border-bottom:1px solid rgba(0,242,255,0.2); padding-bottom:14px; width:80%; text-align:center; cursor:pointer; }
  .udm-drawer a:hover { color:var(--green); }

  /* Hero */
  .udm-hero { height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; text-align:center; overflow:hidden; background:radial-gradient(circle at 50% 50%,#030d1a 0%,#000 100%); padding:20px; }
  .udm-banner-img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:0.2; transition:1.5s; filter:grayscale(1); z-index:0; }
  .udm-hero-content { position:relative; z-index:1; }
  .udm-hero h1 { font-family:'Syncopate',sans-serif; font-size:clamp(2.2rem,9.5vw,9rem); line-height:0.9; text-transform:uppercase; letter-spacing:clamp(-2px,-1vw,-8px); }
  .udm-outline { color:transparent; -webkit-text-stroke:1px var(--blue); opacity:0.6; }
  .udm-caption { font-size:clamp(0.9rem,3vw,2rem); color:var(--red); font-weight:800; margin-top:28px; letter-spacing:clamp(2px,1vw,5px); min-height:44px; text-shadow:0 0 20px rgba(255,0,85,0.4); transition:opacity 0.4s; }

  /* Stats */
  .udm-stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:16px; padding:50px 5%; background:#000; }
  .udm-stat { background:var(--glass); border:1px solid rgba(255,255,255,0.1); padding:36px 16px; border-radius:28px; text-align:center; transition:0.5s; cursor:pointer; backdrop-filter:blur(10px); }
  .udm-stat:hover { border-color:var(--green); transform:translateY(-10px); background:rgba(57,255,20,0.05); }
  .udm-stat h3 { font-family:'Syncopate',sans-serif; color:var(--green); font-size:clamp(1.3rem,3vw,2rem); margin-bottom:8px; }
  .udm-stat p { font-size:0.75rem; letter-spacing:2px; color:#888; text-transform:uppercase; }

  /* About */
  .udm-about { padding:clamp(40px,8vw,100px) 5%; background:#000; }
  .udm-about-glass { background:var(--glass); padding:clamp(28px,5vw,80px); border-radius:40px; border:1px solid rgba(255,255,255,0.05); cursor:pointer; transition:0.6s cubic-bezier(0.16,1,0.3,1); backdrop-filter:blur(40px); }
  .udm-about-glass h2 { font-family:'Syncopate',sans-serif; font-size:clamp(1.3rem,3vw,3rem); color:var(--blue); margin-bottom:20px; }
  .udm-about-sub { font-size:clamp(0.95rem,2vw,1.4rem); color:#888; margin-bottom:16px; }
  .udm-about-body { font-size:clamp(0.95rem,2vw,1.4rem); color:#bbb; line-height:1.8; min-height:80px; }

  /* Slider section */
  .udm-cats { padding:clamp(50px,8vw,100px) 0; background:#010101; overflow:hidden; }
  .udm-cats-title { text-align:center; font-family:'Syncopate',sans-serif; font-size:clamp(1.3rem,4vw,3rem); margin-bottom:40px; color:white; padding:0 5%; }

  /* Infinite slider */
  .udm-slider-wrap { overflow:hidden; }
  .udm-slider-track { display:flex; gap:28px; padding:0 5%; width:max-content; animation:slide 60s linear infinite; }
  .udm-biz-card { width:clamp(200px,28vw,350px); height:clamp(280px,38vw,500px); background:var(--glass); border:1px solid #222; border-radius:28px; overflow:hidden; position:relative; transition:0.6s; display:flex; align-items:flex-end; padding:22px; cursor:pointer; flex-shrink:0; }
  .udm-biz-card:hover { transform:translateY(-20px); border-color:var(--blue); }
  .udm-biz-card img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; z-index:0; filter:grayscale(1) brightness(0.4); }
  .udm-biz-card h3 { font-family:'Syncopate',sans-serif; font-size:clamp(0.9rem,2.5vw,2rem); color:white; position:relative; z-index:1; }
  @keyframes slide { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }

  /* Search results grid */
  .udm-search-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(130px,1fr)); gap:14px; padding:0 5%; }
  .udm-grid-card { background:var(--glass); border:1px solid #333; border-radius:18px; padding:28px 12px; text-align:center; cursor:pointer; transition:0.3s; font-family:'Syncopate',sans-serif; font-size:0.75rem; letter-spacing:1px; }
  .udm-grid-card:hover { border-color:var(--blue); background:rgba(0,242,255,0.06); color:var(--blue); transform:translateY(-5px); }
  .udm-grid-empty { text-align:center; color:#555; padding:40px; font-size:0.9rem; }

  /* AI button */
  .udm-ai { position:fixed; left:16px; bottom:16px; z-index:1000; background:var(--blue); color:black; padding:13px 20px; border-radius:50px; font-weight:800; display:flex; align-items:center; gap:8px; cursor:pointer; box-shadow:0 0 20px var(--blue); transition:0.3s; border:none; font-family:'Plus Jakarta Sans',sans-serif; font-size:0.8rem; }
  .udm-ai:hover { transform:scale(1.1); }
  .udm-ai-label { display:inline; }

  /* Floating contacts */
  .udm-contacts { position:fixed; right:16px; bottom:16px; display:flex; flex-direction:column; gap:12px; z-index:1000; }
  .udm-cbtn { width:52px; height:52px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.3rem; text-decoration:none; color:white; transition:0.4s; border:none; }
  .udm-cbtn:hover { transform:rotate(360deg) scale(1.1); }
  .udm-wp { background:#25D366; box-shadow:0 0 20px #25D366; }
  .udm-mail { background:var(--red); box-shadow:0 0 20px var(--red); }

  /* Strategy modal */
  .udm-modal { position:fixed; inset:0; background:rgba(0,0,0,0.98); z-index:5000; display:flex; align-items:center; justify-content:center; text-align:center; padding:80px 5% 5%; backdrop-filter:blur(30px); overflow-y:auto; }
  .udm-modal-close { position:fixed; top:20px; right:20px; color:var(--red); font-weight:800; cursor:pointer; font-family:'Syncopate',sans-serif; border:1px solid var(--red); padding:10px 18px; border-radius:5px; background:none; font-size:0.7rem; z-index:10; }
  .udm-modal-title { font-family:'Syncopate',sans-serif; font-size:clamp(1.3rem,5vw,3rem); color:var(--green); margin-bottom:28px; }
  .udm-modal-body { font-size:clamp(1rem,2.5vw,1.6rem); line-height:1.7; color:white; max-width:900px; }

  /* Pricing */
  .udm-pricing { padding:clamp(60px,8vw,100px) 5%; text-align:center; background:#000; }
  .udm-pricing-title { font-family:'Syncopate',sans-serif; font-size:clamp(1.3rem,4vw,3rem); color:white; margin-bottom:40px; }
  .udm-pay-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(130px,1fr)); gap:14px; }
  .udm-pay-card { background:var(--glass); border:1px solid #333; padding:32px 10px; border-radius:22px; transition:0.5s; cursor:pointer; text-align:center; }
  .udm-pay-card:hover { background:var(--blue); color:black; transform:translateY(-10px); }
  .udm-pay-card h4 { font-family:'Syncopate',sans-serif; font-size:0.7rem; margin-bottom:10px; }
  .udm-pay-card h2 { font-family:'Syncopate',sans-serif; font-size:clamp(1.1rem,3vw,2rem); }

  /* Payment modal */
  .udm-pay-modal { position:fixed; inset:0; background:rgba(0,0,0,0.99); z-index:9000; display:flex; flex-direction:column; align-items:center; padding:80px 20px 40px; overflow-y:auto; }
  .udm-pay-title { color:var(--blue); font-family:'Syncopate',sans-serif; font-size:clamp(1rem,3vw,2rem); margin-bottom:24px; text-align:center; }
  .udm-pay-info { background:var(--glass); padding:clamp(18px,4vw,30px) clamp(18px,4vw,40px); border-radius:20px; border:1px solid var(--blue); width:100%; max-width:640px; margin-bottom:20px; text-align:left; line-height:2.1; }
  .udm-pay-info p { color:#ccc; font-size:clamp(0.8rem,2vw,0.95rem); }
  .udm-pay-info b { color:var(--blue); }
  .udm-pay-divider { border-top:1px solid rgba(0,242,255,0.2); margin:14px 0; }
  .udm-pay-label { color:var(--green); font-family:'Syncopate',sans-serif; font-size:0.7rem; letter-spacing:3px; margin-bottom:10px; display:block; }

  /* Legal */
  .udm-legal { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:36px; padding:clamp(40px,6vw,80px) 5%; background:#000; border-top:1px solid #111; }
  .udm-legal-col h4 { font-family:'Syncopate',sans-serif; color:var(--blue); margin-bottom:18px; font-size:0.8rem; }
  .udm-legal-col p { color:#555; font-size:0.85rem; line-height:1.8; }

  /* Footer */
  .udm-footer { padding:36px 20px; text-align:center; background:#000; border-top:1px solid #111; font-family:'Syncopate',sans-serif; font-size:0.65rem; color:#555; letter-spacing:2px; }
  .udm-footer-cap { color:var(--blue); margin-top:10px; display:block; }

  /* Mobile */
  @media (max-width: 768px) {
    .udm-nav-links { display:none; }
    .udm-burger { display:flex; }
    .udm-search-wrap { flex:1; max-width:100%; }
    .udm-ai-label { display:none; }
    .udm-ai { padding:14px; border-radius:50%; }
  }
  @media (max-width: 480px) {
    .udm-search-wrap { display:none; }
  }
`;

const CATEGORIES = [
  "Gym","Clinic","Salon","Mall","Bakery","Cafe","Hotel","Studio",
  "Law Firm","Pharma","Real Estate","Jewelry","Logistics","Gaming",
  "Spa","Interior","Furniture","Finance","Education","Travel",
];
const BANNERS = [
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2070",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070",
];
const CAPS = ["Turn Clicks into Customers","From Local Shop to Market Leader","We Build Empires","ROI Engineered Funnels"];
const FOOT_CAPS = ["ESTABLISHED IN 2020","PRIVACY PROTECTED","SECURE SYSTEMS","TRUSTED BY 50+ DOMAINS"];
const ABOUT_TEXT = "SSince 2020, Utkarsh Singh Promotions has been engineering digital dominance. Based in Indore, we don't just run ads—we build complete growth architectures. We analyze your specific business category, identify high-intent customers using our proprietary algorithm, and convert them through cinematic brand storytelling.";
const INTRO_SPEECH = ["WE DON'T RUN ADS.","WE BUILD GROWTH SYSTEMS.","REAL CUSTOMERS.","REAL ROI.","ESTD 2021.","SCALE NOW."];
const STRATEGIES = {
  "100x Growth": "We focus on aggressive market scaling and territory dominance. By optimizing every touchpoint of your sales funnel, we ensure your business grows 100 times its current capacity using predictive analytics and advanced lead capture.",
  "854% ROI": "Our strategies are built for pure profit. We eliminate wasted ad spend and target only high-intent buyers. This precision allows us to deliver an average return on investment of 854 percent for our elite partners consistently.",
  "100M+ Reach": "Visibility is currency. We leverage viral content hooks and cinematic storytelling to put your brand in front of millions. Our reach ensures you are the first name customers think of when they need services in your category.",
  "247k+ Lead": "Quantity meets quality. We have successfully generated over 247,000 verified leads for our clients. Every lead is pre-qualified through our proprietary AI filtering system before reaching your sales team for maximum conversion.",
};
const getStrategy = (name) => STRATEGIES[name] || `Our specialized ${name} growth engine is designed to dominate the local market. For a ${name} business, we deploy hyper-targeted Google search ads and cinematic Instagram Reels that act as a customer magnet, pulling in ready-to-buy customers 24 hours a day.`;

export default function UDM() {
  const [introIdx, setIntroIdx] = useState(0);
  const [introVisible, setIntroVisible] = useState(true);
  const [introExiting, setIntroExiting] = useState(false);
  const [introOpacity, setIntroOpacity] = useState(1);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bannerIdx, setBannerIdx] = useState(0);
  const [capIdx, setCapIdx] = useState(0);
  const [footCapIdx, setFootCapIdx] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [typeText, setTypeText] = useState("Click the title above to see how we build your empire...");
  const [isTyping, setIsTyping] = useState(false);
  const [strategyModal, setStrategyModal] = useState(null);
  const [strategyText, setStrategyText] = useState("");
  const [payModal, setPayModal] = useState(null);
  const [cursor, setCursor] = useState({ x: -100, y: -100 });
  const [cursorF, setCursorF] = useState({ x: -100, y: -100 });
  const searchRef = useRef(null);

  // Cursor
  useEffect(() => {
    const fn = (e) => { setCursor({ x: e.clientX, y: e.clientY }); setCursorF({ x: e.clientX - 15, y: e.clientY - 15 }); };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  // Intro
  useEffect(() => {
    let t;
    if (introIdx < INTRO_SPEECH.length) {
      setIntroOpacity(1);
      t = setTimeout(() => { setIntroOpacity(0); setTimeout(() => setIntroIdx(i => i + 1), 400); }, 1200);
    } else {
      t = setTimeout(() => { setIntroExiting(true); setTimeout(() => setIntroVisible(false), 1000); }, 200);
    }
    return () => clearTimeout(t);
  }, [introIdx]);

  // Cycles
  useEffect(() => { const iv = setInterval(() => { setBannerIdx(i => (i+1)%BANNERS.length); setCapIdx(i => (i+1)%CAPS.length); }, 2500); return () => clearInterval(iv); }, []);
  useEffect(() => { const iv = setInterval(() => setFootCapIdx(i => (i+1)%FOOT_CAPS.length), 3000); return () => clearInterval(iv); }, []);

  // Outside click closes search
  useEffect(() => {
    const fn = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setSearchFocused(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  // Mobile scroll lock
  useEffect(() => { document.body.style.overflow = mobileOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [mobileOpen]);

  const runTypewriter = () => {
    if (isTyping) return;
    setIsTyping(true); setTypeText("");
    let i = 0;
    const iv = setInterval(() => {
      if (i < ABOUT_TEXT.length) { setTypeText(t => t + ABOUT_TEXT.charAt(i)); i++; }
      else { clearInterval(iv); setIsTyping(false); }
    }, 15);
  };

  const openStrategy = (name) => {
    const desc = getStrategy(name);
    setStrategyModal(name); setStrategyText("");
    let i = 0;
    const iv = setInterval(() => {
      if (i < desc.length) { setStrategyText(t => t + desc.charAt(i)); i++; }
      else clearInterval(iv);
    }, 20);
  };

  const startVoice = () => {
    if (!window.speechSynthesis) return;
    const msg = new SpeechSynthesisUtterance("Welcome to US Digital Marketing. Hum sirf ads nahi chalate, hum aapke business ko brand banate hain. We build complete growth architectures since 2021. Let's scale your empire.");
    msg.rate = 0.9; msg.pitch = 1;
    window.speechSynthesis.speak(msg);
  };

  const trimmed = searchTerm.trim().toLowerCase();
  const filtered = trimmed === "" ? CATEGORIES : CATEGORIES.filter(c => c.toLowerCase().includes(trimmed));
  const isSearching = trimmed !== "";
  const showDrop = searchFocused && isSearching;

  const handleSelect = (cat) => {
    setSearchFocused(false); setSearchTerm("");
    openStrategy(cat);
    document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleMobileLink = (href) => {
    setMobileOpen(false);
    setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" }), 400);
  };

  return (
    <>
      <style>{styles}</style>

      <div id="udm-cursor" style={{ left: cursor.x, top: cursor.y, position: "fixed" }} />
      <div id="udm-cursor-f" style={{ left: cursorF.x, top: cursorF.y, position: "fixed" }} />

      {/* Intro */}
      {introVisible && (
        <div className={`udm-intro${introExiting ? " exit" : ""}`}>
          <div className="udm-intro-txt" style={{ opacity: introOpacity, transform: introOpacity === 1 ? "translateY(0)" : "translateY(30px)" }}>
            {INTRO_SPEECH[introIdx] || ""}
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      <div className={`udm-drawer${mobileOpen ? " open" : ""}`}>
        {[["#about","ABOUT"],["#categories","DOMAINS"],["#pricing","PLANS"],["#support","HELP"]].map(([h, l]) => (
          <a key={h} onClick={() => handleMobileLink(h)}>{l}</a>
        ))}
      </div>

      {/* Navbar */}
      <nav className="udm-nav">
        {/*
          ── LOGO SWAP INSTRUCTIONS ──────────────────────────────────
          Step 1: Put your logo file (e.g. logo.png) inside the src/ folder.
          Step 2: At the top of this file, uncomment: import logo from "./logo.png";
          Step 3: Replace the <div className="udm-logo"> block below with:
                  <img src={logo} className="udm-logo-img" alt="UDM Logo" />
          ────────────────────────────────────────────────────────────
        */}
        <img src={logo} className="udm-logo-img" alt="UDM Logo" />

        <div className="udm-search-wrap" ref={searchRef}>
          <div className="udm-search-box">
            <span style={{ color: "var(--blue)", fontSize: "0.8rem", flexShrink: 0 }}>🔍</span>
            <input
              type="text"
              placeholder="Search a domain..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onFocus={() => setSearchFocused(true)}
            />
          </div>
          {showDrop && (
            <div className="udm-search-drop">
              {filtered.length === 0 ? (
                <div className="udm-drop-empty">No results for "{searchTerm}"</div>
              ) : filtered.map(cat => (
                <div key={cat} className="udm-drop-item" onMouseDown={() => handleSelect(cat)}>
                  <span className="udm-drop-dot" />{cat}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="udm-nav-links">
          <a href="#about">ABOUT</a>
          <a href="#categories">DOMAINS</a>
          <a href="#pricing">PLANS</a>
          <a href="#support">HELP</a>
        </div>

        <button className={`udm-burger${mobileOpen ? " open" : ""}`} onClick={() => setMobileOpen(o => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* Hero */}
      <section className="udm-hero" id="home">
        <img src={BANNERS[bannerIdx]} className="udm-banner-img" alt="" />
        <div className="udm-hero-content">
          <h1>WE BUILD <span style={{ color: "var(--blue)" }}>GROWTH</span> <span className="udm-outline">EMPIRES</span></h1>
          <div className="udm-caption">{CAPS[capIdx]}</div>
        </div>
      </section>

      {/* Stats */}
      <section className="udm-stats">
        {[
          { val: "100×", label: "Revenue Growth", key: "100x Growth" },
          { val: "854%", label: "Average ROI",    key: "854% ROI" },
          { val: "100M+",label: "Impressions",    key: "100M+ Reach" },
          { val: "247k+",label: "Verified Leads", key: "247k+ Lead" },
        ].map(({ val, label, key }) => (
          <div className="udm-stat" key={key} onClick={() => openStrategy(key)}>
            <h3>{val}</h3><p>{label}</p>
          </div>
        ))}
      </section>

      {/* About */}
      <section className="udm-about" id="about">
        <div className="udm-about-glass" onClick={runTypewriter}>
          <h2>OUR CORE LEGACY ▼</h2>
          <p className="udm-about-sub">We have been engineering local monopolies in Indore since 2021.</p>
          <div className="udm-about-body">{typeText}</div>
        </div>
      </section>

      {/* Categories */}
      <section className="udm-cats" id="categories">
        <h2 className="udm-cats-title">CHOOSE YOUR DOMAIN</h2>
        {isSearching ? (
          filtered.length === 0 ? (
            <div className="udm-grid-empty">No domains match "{searchTerm}"</div>
          ) : (
            <div className="udm-search-grid">
              {filtered.map(cat => (
                <div key={cat} className="udm-grid-card" onClick={() => openStrategy(cat)}>{cat}</div>
              ))}
            </div>
          )
        ) : (
          <div className="udm-slider-wrap">
            <div className="udm-slider-track">
              {[...CATEGORIES, ...CATEGORIES].map((cat, i) => (
                <div className="udm-biz-card" key={`${cat}-${i}`} onClick={() => openStrategy(cat)}>
                  <img src={`https://picsum.photos/seed/${cat}${i}/800/1000`} alt={cat} />
                  <h3>{cat}</h3>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* AI Assistant */}
      <AIChat />

      {/* Contacts */}
      <div className="udm-contacts">
        <a href="mailto:businessgrowthservicess@gmail.com" className="udm-cbtn udm-mail" title="Email">✉</a>
        <a href="https://wa.me/919630715686" target="_blank" rel="noreferrer" className="udm-cbtn udm-wp" title="WhatsApp">💬</a>
      </div>

      {/* Strategy Modal */}
      {strategyModal && (
        <div className="udm-modal">
          <button className="udm-modal-close" onClick={() => { setStrategyModal(null); setStrategyText(""); }}>✕ CLOSE</button>
          <div>
            <h2 className="udm-modal-title">{strategyModal.toUpperCase()}</h2>
            <div className="udm-modal-body">{strategyText}</div>
          </div>
        </div>
      )}

      {/* Pricing */}
      <section className="udm-pricing" id="pricing">
        <h2 className="udm-pricing-title">ACTIVATE ENGINE</h2>
        <div className="udm-pay-grid">
          {[
            { plan: "STARTER",  price: "₹25K" },
            { plan: "SMART",    price: "₹30K" },
            { plan: "ADVANCED", price: "₹40K", hi: true },
            { plan: "PRO",      price: "₹50K" },
            { plan: "ELITE",    price: "₹60K" },
          ].map(({ plan, price, hi }) => (
            <div className="udm-pay-card" key={plan} style={hi ? { borderColor: "var(--red)" } : {}} onClick={() => setPayModal({ plan, price })}>
              <h4>{plan}</h4><h2>{price}</h2>
            </div>
          ))}
        </div>
      </section>

      {/* Payment Modal */}
      {payModal && (
        <div className="udm-pay-modal">
          <button className="udm-modal-close" style={{ position: "fixed", top: 20, right: 20 }} onClick={() => setPayModal(null)}>✕ CLOSE</button>
          <h2 className="udm-pay-title">{payModal.plan} — {payModal.price}</h2>
          <div className="udm-pay-info">
            <span className="udm-pay-label">🇮🇳 DOMESTIC PAYMENT</span>
            <p><b>Account Holder:</b> Utkarsh Singh</p>
            <p><b>Bank:</b> Kotak Mahindra Bank</p>
            <p><b>Account No:</b> 6049669529</p>
            <p><b>IFSC Code:</b> KKBK0005336</p>
            <p><b>UPI ID:</b> utkarshsinghhh340@oksbi</p>
            <div className="udm-pay-divider" />
            <span className="udm-pay-label">🌍 INTERNATIONAL PAYMENT</span>
            <p><b>PayPal:</b> @UtkarshSingh521</p>
            <p><b>Payoneer:</b> utkarshsinghhh340@gmail.com</p>
          </div>
          <iframe
            src="https://form.svhrt.com/698ace75247da1e2ca3c9de9"
            style={{ width: "100%", maxWidth: 640, height: 500, borderRadius: 20, border: "1px solid var(--blue)" }}
            title="Payment Form"
          />
        </div>
      )}

      {/* Legal */}
      <section className="udm-legal" id="support">
        <div className="udm-legal-col">
          <h4>HELP & SUPPORT</h4>
          <p>Direct: +91 9630715686<br />WhatsApp: +91 9630715686<br />Email: businessgrowthservicess@gmail.com<br /><br />Office: MVPC+8WC, Indrapuri Colony, DAVV Takshila Indore, MP 452001</p>
        </div>
        <div className="udm-legal-col">
          <h4>TERMS OF SERVICE</h4>
          <p>• Campaign results in 7-14 days guaranteed.<br />• 12-Hour project initiation post-onboarding.<br />• Service fee independent of ad budget.<br />• IP ownership of Utkarsh Singh Promotions.</p>
        </div>
        <div className="udm-legal-col">
          <h4>PRIVACY POLICY</h4>
          <p>Your data is processed with 256-bit SSL lead encryption. We never share client databases. Regional exclusivity is guaranteed for elite partners.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="udm-footer">
        <p>© 2020-2026 US DIGITAL MARKETING. ESTD 2020. INDORE HQ.</p>
        <span className="udm-footer-cap">{FOOT_CAPS[footCapIdx]}</span>
      </footer>
    </>
  );
}
