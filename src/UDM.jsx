import { useState, useEffect, useRef } from "react";

const COLORS = {
  blue: "#00f2ff",
  red: "#ff0055",
  green: "#39ff14",
  white: "#FFFFFF",
  bg: "#000",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&family=Plus+Jakarta+Sans:wght@200;400;700;800&display=swap');
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

  :root {
    --blue: #00f2ff;
    --red: #ff0055;
    --green: #39ff14;
    --white: #FFFFFF;
    --bg: #000;
    --glass: rgba(255, 255, 255, 0.03);
  }
  * { margin: 0; padding: 0; box-sizing: border-box; cursor: none; scroll-behavior: smooth; }
  body { background: #000; color: white; font-family: 'Plus Jakarta Sans', sans-serif; overflow-x: hidden; }

  #udm-cursor { width: 10px; height: 10px; background: white; border-radius: 50%; position: fixed; z-index: 99999; mix-blend-mode: difference; pointer-events: none; transition: transform 0.1s; }
  #udm-cursor-f { width: 40px; height: 40px; border: 1px solid var(--blue); border-radius: 50%; position: fixed; z-index: 99998; pointer-events: none; transition: left 0.2s, top 0.2s; }

  .udm-intro-overlay {
    position: fixed; inset: 0; background: #000; z-index: 10000;
    display: flex; align-items: center; justify-content: center; text-align: center;
    transition: transform 1s cubic-bezier(0.76, 0, 0.24, 1);
  }
  .udm-intro-overlay.exit { transform: translateY(-100%); }
  .udm-intro-text {
    font-family: 'Syncopate', sans-serif; font-size: 3rem; font-weight: 700;
    color: var(--blue); letter-spacing: 15px;
    transition: opacity 0.4s, transform 0.4s;
  }

  .udm-nav {
    position: fixed; top: 0; width: 100%; display: flex; justify-content: space-between;
    align-items: center; padding: 20px 5%; z-index: 1000;
    background: rgba(0,0,0,0.85); backdrop-filter: blur(25px);
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .udm-logo {
    font-family: 'Syncopate', sans-serif; font-weight: 700; font-size: 1.5rem;
    letter-spacing: 5px; color: var(--blue); text-shadow: 0 0 20px var(--blue);
  }
  .udm-search-container {
    background: rgba(255,255,255,0.1); padding: 5px 15px; border-radius: 30px;
    border: 1px solid var(--blue); display: flex; align-items: center; gap: 8px;
  }
  .udm-search-container input {
    background: none; border: none; color: white; padding: 5px;
    outline: none; font-size: 0.9rem; width: 150px; font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .udm-nav-links a {
    color: #fff; text-decoration: none; margin-left: 20px; font-weight: 700;
    font-size: 0.7rem; letter-spacing: 1px; transition: 0.3s;
  }
  .udm-nav-links a:hover { color: var(--green); }

  .udm-hero {
    height: 100vh; display: flex; flex-direction: column; align-items: center;
    justify-content: center; position: relative; text-align: center; overflow: hidden;
    background: radial-gradient(circle at 50% 50%, #030d1a 0%, #000 100%);
  }
  .udm-banner-img {
    position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
    opacity: 0.2; transition: opacity 1.5s ease-in-out; filter: grayscale(1); z-index: 0;
  }
  .udm-hero-content { position: relative; z-index: 1; }
  .udm-hero h1 {
    font-family: 'Syncopate', sans-serif; font-size: 9.5vw; line-height: 0.85;
    text-transform: uppercase; letter-spacing: -8px;
  }
  .udm-hero h1 .outline {
    color: transparent; -webkit-text-stroke: 1px var(--blue); opacity: 0.6;
  }
  .udm-caption {
    font-size: 2rem; color: var(--red); font-weight: 800; margin-top: 30px;
    letter-spacing: 5px; height: 60px; text-shadow: 0 0 20px rgba(255,0,85,0.4);
    transition: opacity 0.4s, transform 0.4s;
  }

  .udm-stats-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px; padding: 50px 10%; margin-top: -50px; position: relative; z-index: 10;
    background: #000;
  }
  .udm-stat-card {
    background: var(--glass); border: 1px solid rgba(255,255,255,0.1); padding: 40px 20px;
    border-radius: 30px; text-align: center; transition: 0.5s; cursor: pointer;
    backdrop-filter: blur(10px);
  }
  .udm-stat-card:hover {
    border-color: var(--green); transform: translateY(-10px);
    background: rgba(57, 255, 20, 0.05);
  }
  .udm-stat-card h3 { font-family: 'Syncopate', sans-serif; color: var(--green); font-size: 2rem; margin-bottom: 10px; }
  .udm-stat-card p { font-size: 0.8rem; letter-spacing: 2px; color: #888; text-transform: uppercase; }

  .udm-about-wrap { padding: 100px 10%; position: relative; background: #000; }
  .udm-about-glass {
    background: var(--glass); padding: 80px; border-radius: 60px;
    border: 1px solid rgba(255,255,255,0.05); cursor: pointer;
    transition: 0.6s cubic-bezier(0.16, 1, 0.3, 1); backdrop-filter: blur(40px);
  }
  .udm-about-glass h2 { font-family: 'Syncopate', sans-serif; font-size: 3rem; color: var(--blue); margin-bottom: 30px; }
  .udm-typewriter-text { font-size: 1.4rem; color: #bbb; line-height: 1.8; min-height: 100px; }

  .udm-slider-section { padding: 100px 0; background: #010101; overflow: hidden; }
  .udm-slider-section h2 {
    text-align: center; font-family: 'Syncopate', sans-serif;
    font-size: 3rem; margin-bottom: 60px; color: white;
  }
  .udm-slider-wrapper { overflow: hidden; }
  .udm-slider-track {
    display: flex; gap: 40px; padding: 0 100px;
    width: max-content; animation: infiniteScroll 60s linear infinite;
  }
  .udm-slider-track.paused { animation-play-state: paused; }
  .udm-biz-card {
    width: 350px; height: 500px; background: var(--glass); border: 1px solid #222;
    border-radius: 40px; overflow: hidden; position: relative; transition: 0.6s;
    display: flex; align-items: flex-end; padding: 30px; cursor: pointer; flex-shrink: 0;
  }
  .udm-biz-card:hover { transform: translateY(-20px); border-color: var(--blue); }
  .udm-biz-card img {
    position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
    z-index: 0; filter: grayscale(1) brightness(0.4);
  }
  .udm-biz-card h3 {
    font-family: 'Syncopate', sans-serif; font-size: 2rem; color: white;
    position: relative; z-index: 1;
  }

  @keyframes infiniteScroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .udm-ai-assistant {
    position: fixed; left: 30px; bottom: 30px; z-index: 1000;
    background: var(--blue); color: black; padding: 15px 25px; border-radius: 50px;
    font-weight: 800; display: flex; align-items: center; gap: 10px; cursor: pointer;
    box-shadow: 0 0 20px var(--blue); transition: 0.3s; border: none;
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.9rem;
  }
  .udm-ai-assistant:hover { transform: scale(1.1); }

  .udm-floating-contacts {
    position: fixed; right: 30px; bottom: 30px;
    display: flex; flex-direction: column; gap: 15px; z-index: 1000;
  }
  .udm-contact-btn {
    width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center;
    justify-content: center; font-size: 1.5rem; text-decoration: none; color: white;
    transition: 0.4s; border: none;
  }
  .udm-contact-btn:hover { transform: rotate(360deg) scale(1.1); }
  .udm-wp-btn { background: #25D366; box-shadow: 0 0 20px #25D366; }
  .udm-mail-btn { background: var(--red); box-shadow: 0 0 20px var(--red); }

  .udm-modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.98); z-index: 5000;
    display: flex; align-items: center; justify-content: center; text-align: center;
    padding: 10%; backdrop-filter: blur(30px);
  }
  .udm-modal-close {
    position: absolute; top: 50px; right: 50px; color: var(--red); font-weight: 800;
    cursor: pointer; font-family: 'Syncopate', sans-serif; border: 1px solid var(--red);
    padding: 10px 30px; border-radius: 5px; background: none; font-size: 0.8rem;
  }
  .udm-modal-title { font-family: 'Syncopate', sans-serif; font-size: 3rem; color: var(--green); margin-bottom: 30px; }
  .udm-strategy-text { font-size: 1.6rem; line-height: 1.7; color: white; max-width: 900px; }

  .udm-payment-sec { padding: 100px 5%; text-align: center; background: #000; }
  .udm-payment-sec h2 { font-family: 'Syncopate', sans-serif; font-size: 3rem; color: white; }
  .udm-pay-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 20px; margin-top: 50px;
  }
  .udm-pay-card {
    background: var(--glass); border: 1px solid #333; padding: 40px 10px;
    border-radius: 30px; transition: 0.5s; cursor: pointer; text-align: center;
  }
  .udm-pay-card:hover { background: var(--blue); color: black; transform: translateY(-10px); }
  .udm-pay-card h4 { font-family: 'Syncopate', sans-serif; font-size: 0.9rem; margin-bottom: 10px; }
  .udm-pay-card h2 { font-family: 'Syncopate', sans-serif; font-size: 2rem; }

  .udm-pay-modal {
    position: fixed; inset: 0; background: rgba(0,0,0,0.99); z-index: 9000;
    display: flex; flex-direction: column; justify-content: center;
    align-items: center; padding: 40px;
  }
  .udm-pay-modal-title { color: var(--blue); font-family: 'Syncopate', sans-serif; font-size: 2rem; margin-bottom: 30px; }
  .udm-pay-info {
    background: var(--glass); padding: 30px; border-radius: 20px;
    border: 1px solid var(--blue); width: 80%; max-width: 600px;
    margin-bottom: 20px; text-align: center; line-height: 2;
  }
  .udm-pay-info p { color: #ccc; }
  .udm-pay-info b { color: var(--blue); }

  .udm-legal-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 50px; padding: 80px 10%; background: #000;
    border-top: 1px solid #111;
  }
  .udm-legal-col h4 { font-family: 'Syncopate', sans-serif; color: var(--blue); margin-bottom: 25px; font-size: 0.9rem; }
  .udm-legal-col p { color: #555; font-size: 0.9rem; line-height: 1.8; }

  .udm-footer {
    padding: 40px; text-align: center; background: #000;
    border-top: 1px solid #111; font-family: 'Syncopate', sans-serif;
    font-size: 0.7rem; color: #555; letter-spacing: 2px;
  }
  .udm-footer-caption { color: var(--blue); margin-top: 10px; display: block; }

  @media (max-width: 768px) {
    .udm-hero h1 { font-size: 15vw; letter-spacing: -3px; }
    .udm-about-glass { padding: 40px 20px; }
    .udm-about-glass h2 { font-size: 1.8rem; }
    .udm-legal-grid { grid-template-columns: 1fr; gap: 30px; padding: 40px 5%; }
    .udm-caption { font-size: 1.2rem; }
    .udm-modal-title { font-size: 2rem; }
    .udm-strategy-text { font-size: 1.2rem; }
    .udm-nav-links { display: none; }
  }
`;

const CATEGORIES = [
  "Gym", "Clinic", "Salon", "Mall", "Bakery", "Cafe", "Hotel", "Studio",
  "Law Firm", "Pharma", "Real Estate", "Jewelry", "Logistics", "Gaming",
  "Spa", "Interior", "Furniture", "Finance", "Education", "Travel"
];

const BANNERS = [
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2070",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070",
];

const CAPS = [
  "Turn Clicks into Customers",
  "From Local Shop to Market Leader",
  "We Build Empires",
  "ROI Engineered Funnels",
];

const FOOT_CAPS = [
  "ESTABLISHED IN 2021",
  "PRIVACY PROTECTED",
  "SECURE SYSTEMS",
  "TRUSTED BY 50+ DOMAINS",
];

const ABOUT_TEXT =
  "Since 2021, Utkarsh Singh Promotions has been engineering digital dominance. Based in Indore, we don't just run ads—we build complete growth architectures. We analyze your specific business category, identify high-intent customers using our proprietary algorithm, and convert them through cinematic brand storytelling.";

const INTRO_SPEECH = [
  "WE DON'T RUN ADS.",
  "WE BUILD GROWTH SYSTEMS.",
  "REAL CUSTOMERS.",
  "REAL ROI.",
  "ESTD 2021.",
  "SCALE NOW.",
];

const STRATEGIES = {
  "100x Growth":
    "We focus on aggressive market scaling and territory dominance. By optimizing every touchpoint of your sales funnel, we ensure your business grows 100 times its current capacity using predictive analytics and advanced lead capture.",
  "854% ROI":
    "Our strategies are built for pure profit. We eliminate wasted ad spend and target only high-intent buyers. This precision allows us to deliver an average return on investment of 854 percent for our elite partners consistently.",
  "100M+ Reach":
    "Visibility is currency. We leverage viral content hooks and cinematic storytelling to put your brand in front of millions. Our reach ensures you are the first name customers think of when they need services in your category.",
  "247k+ Lead":
    "Quantity meets quality. We have successfully generated over 247,000 verified leads for our clients. Every lead is pre-qualified through our proprietary AI filtering system before reaching your sales team for maximum conversion.",
};

function getStrategy(name) {
  if (STRATEGIES[name]) return STRATEGIES[name];
  return `Our specialized ${name} growth engine is designed to dominate the local market. For a ${name} business, we deploy hyper-targeted Google search ads and cinematic Instagram Reels that act as a customer magnet, pulling in ready-to-buy customers 24 hours a day.`;
}

export default function UDM() {
  const [introIdx, setIntroIdx] = useState(0);
  const [introVisible, setIntroVisible] = useState(true);
  const [introExiting, setIntroExiting] = useState(false);
  const [introTextOpacity, setIntroTextOpacity] = useState(1);

  const [bannerIdx, setBannerIdx] = useState(0);
  const [capIdx, setCapIdx] = useState(0);
  const [footCapIdx, setFootCapIdx] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");

  const [typewriterText, setTypewriterText] = useState(
    "Click the title above to see how we build your empire..."
  );
  const [isTyping, setIsTyping] = useState(false);

  const [strategyModal, setStrategyModal] = useState(null);
  const [strategyText, setStrategyText] = useState("");
  const [strategyTyping, setStrategyTyping] = useState(false);

  const [paymentModal, setPaymentModal] = useState(null);

  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorFPos, setCursorFPos] = useState({ x: -100, y: -100 });

  const sliderRef = useRef(null);

  // Cursor
  useEffect(() => {
    const move = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      setCursorFPos({ x: e.clientX - 15, y: e.clientY - 15 });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // Intro animation
  useEffect(() => {
    let timeout;
    if (introIdx < INTRO_SPEECH.length) {
      setIntroTextOpacity(1);
      timeout = setTimeout(() => {
        setIntroTextOpacity(0);
        setTimeout(() => {
          setIntroIdx((i) => i + 1);
        }, 400);
      }, 1200);
    } else {
      timeout = setTimeout(() => {
        setIntroExiting(true);
        setTimeout(() => setIntroVisible(false), 1000);
      }, 200);
    }
    return () => clearTimeout(timeout);
  }, [introIdx]);

  // Banner & caption cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIdx((i) => (i + 1) % BANNERS.length);
      setCapIdx((i) => (i + 1) % CAPS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Footer caption
  useEffect(() => {
    const interval = setInterval(() => {
      setFootCapIdx((i) => (i + 1) % FOOT_CAPS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Typewriter for about
  const runTypewriter = () => {
    if (isTyping) return;
    setIsTyping(true);
    setTypewriterText("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < ABOUT_TEXT.length) {
        setTypewriterText((t) => t + ABOUT_TEXT.charAt(i));
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 15);
  };

  // Strategy modal typewriter
  const openStrategy = (name) => {
    const desc = getStrategy(name);
    setStrategyModal(name);
    setStrategyText("");
    setStrategyTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      if (i < desc.length) {
        setStrategyText((t) => t + desc.charAt(i));
        i++;
      } else {
        clearInterval(interval);
        setStrategyTyping(false);
      }
    }, 20);
  };

  const closeStrategy = () => {
    setStrategyModal(null);
    setStrategyText("");
  };

  const openPayment = (plan, price) => {
    setPaymentModal({ plan, price });
  };

  const closePayment = () => setPaymentModal(null);

  const startAIVoice = () => {
    if (!window.speechSynthesis) return;
    const msg = new SpeechSynthesisUtterance(
      "Welcome to US Digital Marketing. Hum sirf ads nahi chalate, hum aapke business ko brand banate hain. We build complete growth architectures since 2021. Hamari services me performance marketing aur digital dominance shamil hai. Let's scale your empire."
    );
    msg.rate = 0.9;
    msg.pitch = 1;
    window.speechSynthesis.speak(msg);
  };

  const filteredCategories =
    searchTerm.trim() === ""
      ? CATEGORIES
      : CATEGORIES.filter((c) =>
          c.toLowerCase().includes(searchTerm.toLowerCase())
        );

  const displayCats = [...filteredCategories, ...filteredCategories];

  return (
    <>
      <style>{styles}</style>

      {/* Cursors */}
      <div
        id="udm-cursor"
        style={{ left: cursorPos.x, top: cursorPos.y, position: "fixed" }}
      />
      <div
        id="udm-cursor-f"
        style={{ left: cursorFPos.x, top: cursorFPos.y, position: "fixed" }}
      />

      {/* Intro Overlay */}
      {introVisible && (
        <div className={`udm-intro-overlay${introExiting ? " exit" : ""}`}>
          <div
            className="udm-intro-text"
            style={{
              opacity: introTextOpacity,
              transform: introTextOpacity === 1 ? "translateY(0)" : "translateY(30px)",
            }}
          >
            {INTRO_SPEECH[introIdx] || ""}
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="udm-nav">
        <div className="udm-logo">UDM.</div>
        <div className="udm-search-container">
          <span style={{ color: "var(--blue)", fontSize: "0.8rem" }}>🔍</span>
          <input
            type="text"
            placeholder="Search Empire..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="udm-nav-links">
          <a href="#about">ABOUT</a>
          <a href="#categories">DOMAINS</a>
          <a href="#pricing">PLANS</a>
          <a href="#support">HELP</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="udm-hero" id="home">
        <img
          src={BANNERS[bannerIdx]}
          className="udm-banner-img"
          alt="Banner"
        />
        <div className="udm-hero-content">
          <h1>
            WE BUILD <span style={{ color: "var(--blue)" }}>GROWTH</span>{" "}
            <span className="outline">EMPIRES</span>
          </h1>
          <div className="udm-caption">{CAPS[capIdx]}</div>
        </div>
      </section>

      {/* Stats */}
      <section className="udm-stats-grid">
        {[
          { val: "100×", label: "Revenue Growth", key: "100x Growth" },
          { val: "854%", label: "Average ROI", key: "854% ROI" },
          { val: "100M+", label: "Impressions", key: "100M+ Reach" },
          { val: "247k+", label: "Verified Leads", key: "247k+ Lead" },
        ].map(({ val, label, key }) => (
          <div
            className="udm-stat-card"
            key={key}
            onClick={() => openStrategy(key)}
          >
            <h3>{val}</h3>
            <p>{label}</p>
          </div>
        ))}
      </section>

      {/* About */}
      <section className="udm-about-wrap" id="about">
        <div className="udm-about-glass" onClick={runTypewriter}>
          <h2>OUR CORE LEGACY ▼</h2>
          <p style={{ fontSize: "1.4rem", color: "#888", marginBottom: "20px" }}>
            We have been engineering local monopolies in Indore since 2021.
          </p>
          <div className="udm-typewriter-text">{typewriterText}</div>
        </div>
      </section>

      {/* Categories Slider */}
      <section className="udm-slider-section" id="categories">
        <h2>CHOOSE YOUR DOMAIN</h2>
        <div className="udm-slider-wrapper">
          <div
            className={`udm-slider-track${searchTerm ? " paused" : ""}`}
            ref={sliderRef}
          >
            {displayCats.map((cat, index) => (
              <div
                className="udm-biz-card"
                key={`${cat}-${index}`}
                onClick={() => openStrategy(cat)}
              >
                <img
                  src={`https://picsum.photos/seed/${cat}${index}/800/1000`}
                  alt={cat}
                />
                <h3>{cat}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Assistant Button */}
      <button className="udm-ai-assistant" onClick={startAIVoice}>
        🤖 AI ASSISTANT
      </button>

      {/* Floating Contacts */}
      <div className="udm-floating-contacts">
        <a
          href="mailto:businessgrowthservicess@gmail.com"
          className="udm-contact-btn udm-mail-btn"
          title="Email"
        >
          ✉
        </a>
        <a
          href="https://wa.me/919630715686"
          target="_blank"
          rel="noreferrer"
          className="udm-contact-btn udm-wp-btn"
          title="WhatsApp"
        >
          💬
        </a>
      </div>

      {/* Strategy Modal */}
      {strategyModal && (
        <div className="udm-modal-overlay">
          <button className="udm-modal-close" onClick={closeStrategy}>
            BACK TO EMPIRE
          </button>
          <div>
            <h2 className="udm-modal-title">{strategyModal.toUpperCase()}</h2>
            <div className="udm-strategy-text">{strategyText}</div>
          </div>
        </div>
      )}

      {/* Pricing */}
      <section className="udm-payment-sec" id="pricing">
        <h2>ACTIVATE ENGINE</h2>
        <div className="udm-pay-grid">
          {[
            { plan: "STARTER", price: "₹25K" },
            { plan: "SMART", price: "₹30K" },
            { plan: "ADVANCED", price: "₹40K", highlight: true },
            { plan: "PRO", price: "₹50K" },
            { plan: "ELITE", price: "₹60K" },
          ].map(({ plan, price, highlight }) => (
            <div
              className="udm-pay-card"
              key={plan}
              style={highlight ? { borderColor: "var(--red)" } : {}}
              onClick={() => openPayment(plan, price)}
            >
              <h4>{plan}</h4>
              <h2>{price}</h2>
            </div>
          ))}
        </div>
      </section>

      {/* Payment Modal */}
      {paymentModal && (
        <div className="udm-pay-modal">
          <button
            className="udm-modal-close"
            style={{ position: "relative", top: "auto", right: "auto", marginBottom: "20px" }}
            onClick={closePayment}
          >
            CLOSE
          </button>
          <h2 className="udm-pay-modal-title">
            {paymentModal.plan} — {paymentModal.price}
          </h2>
          <div className="udm-pay-info">
            <p>
              <b>UPI:</b> utkarshsinghhh340@oksbi
            </p>
            <p>
              <b>Bank:</b> Kotak Mahindra Bank &nbsp;|&nbsp; <b>A/C:</b> 6049669529
            </p>
          </div>
          <iframe
            src="https://form.svhrt.com/698ace75247da1e2ca3c9de9"
            style={{
              width: "90%",
              height: "500px",
              borderRadius: "20px",
              border: "1px solid var(--blue)",
            }}
            title="Payment Form"
          />
        </div>
      )}

      {/* Legal / Support */}
      <section className="udm-legal-grid" id="support">
        <div className="udm-legal-col">
          <h4>HELP & SUPPORT</h4>
          <p>
            Direct: +91 9630715686
            <br />
            WhatsApp: +91 9630715686
            <br />
            Email: businessgrowthservicess@gmail.com
          </p>
          <p style={{ marginTop: "10px" }}>
            Office: MVPC+8WC, Indrapuri Colony, DAVV Takshila Indore, MP 452001
          </p>
        </div>
        <div className="udm-legal-col">
          <h4>TERMS OF SERVICE</h4>
          <p>
            • Campaign results in 7-14 days guaranteed.
            <br />
            • 12-Hour project initiation post-onboarding.
            <br />
            • Service fee independent of ad budget.
            <br />• IP ownership of Utkarsh Singh Promotions.
          </p>
        </div>
        <div className="udm-legal-col">
          <h4>PRIVACY POLICY</h4>
          <p>
            Your data is processed with 256-bit SSL lead encryption. We never
            share client databases. Regional exclusivity is guaranteed for elite
            partners.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="udm-footer">
        <p>© 2021-2026 US DIGITAL MARKETING. ESTD 2021. INDORE HQ.</p>
        <span className="udm-footer-caption">{FOOT_CAPS[footCapIdx]}</span>
      </footer>
    </>
  );
}
