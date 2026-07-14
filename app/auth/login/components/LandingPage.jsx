import classes from "../Login.module.css";
import zenithIcon from "../../../../public/zenithGuard.png";
import Bg from "./Bg";
import LandingNav from "./LandingNav";
import { useLogin } from "../LoginContext";

const LandingPage = () => {
  const { goTo, scrollTo } = useLogin();

  return (
    <div className={classes.landingRoot}>
      <div className={classes.landingBg}><Bg /></div>
      <LandingNav />

      {/* ── HERO ── */}
      <section className={classes.section} id="hero">
        <div className={classes.heroContent}>
          <div className={classes.secureBadge}><i className="bi bi-shield-check" /> Secure Access Portal</div>
          <h1 className={classes.heroTitleLg}>Your Awareness<br /><span className={classes.heroGreen}>Trainer</span></h1>
          <p className={classes.heroDescLg}>Protect your organization with world's leading cybersecurity awareness solutions. Train your team, simulate threats, and build a security-first culture.</p>
          <ul className={classes.heroChecks}>
            {["Enterprise Grade Security","Interactive Learning","Real-time Progress Tracking","24/7 Expert Support"].map((f) => (
              <li key={f}><i className="bi bi-check-circle-fill" /> {f}</li>
            ))}
          </ul>
          <div className={classes.heroCtas}>
            <button className={classes.ctaPrimary} onClick={() => goTo("choose-path")}>Get Started Free <i className="bi bi-arrow-right" /></button>
            <button className={classes.ctaSecondary} onClick={() => goTo("login")}>Sign In</button>
          </div>
        </div>
        <div className={classes.heroVisual}>
          <div className={classes.heroShieldWrap}>
            <div className={classes.heroShield}><i className="bi bi-shield-fill-check" /></div>
            <div className={classes.heroRing1} /><div className={classes.heroRing2} /><div className={classes.heroRing3} />
          </div>
          <div className={classes.heroFloatCard1}><i className="bi bi-people-fill" style={{color:"#0fe0be"}} /><div><strong>10,000+</strong><span>Organizations</span></div></div>
          <div className={classes.heroFloatCard2}><i className="bi bi-shield-check" style={{color:"#22c55e"}} /><div><strong>500K+</strong><span>Learners Trained</span></div></div>
          <div className={classes.heroFloatCard3}><i className="bi bi-award-fill" style={{color:"#f59e0b"}} /><div><strong>98%</strong><span>Satisfaction Rate</span></div></div>
        </div>
        <button className={classes.scrollDown} onClick={() => scrollTo("features")}><i className="bi bi-chevron-down" /></button>
      </section>

      {/* ── FEATURES ── */}
      <section className={classes.section + " " + classes.sectionDark} id="features">
        <div className={classes.sectionInner}>
          <div className={classes.sectionHdr}>
            <span className={classes.sectionTag}>Features</span>
            <h2>Everything Your Organization Needs</h2>
            <p>A complete cybersecurity awareness platform built for modern teams</p>
          </div>
          <div className={classes.featuresGrid}>
            {[
              {icon:"shield-lock",  color:"#0d9370", title:"Phishing Simulation",  desc:"Run realistic campaigns to test and train your team against real-world threats."},
              {icon:"mortarboard",  color:"#2563eb", title:"Course Management",    desc:"Create and deliver engaging cybersecurity training modules with ease."},
              {icon:"graph-up",     color:"#7c3aed", title:"Analytics & Reports",  desc:"Track progress with detailed reports and actionable insights."},
              {icon:"people",       color:"#dc2626", title:"Team Management",      desc:"Manage users, groups, and organizations from one unified dashboard."},
              {icon:"award",        color:"#d97706", title:"Certifications",        desc:"Issue verifiable certificates upon successful course completion."},
              {icon:"camera-video", color:"#059669", title:"Live Training",         desc:"Host live training sessions with built-in video conferencing."},
            ].map((f,i) => (
              <div key={i} className={classes.featureCard}>
                <div className={classes.featureIcon} style={{background:f.color+"22",color:f.color}}><i className={"bi bi-"+f.icon} /></div>
                <h3>{f.title}</h3><p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <button className={classes.scrollDown} onClick={() => scrollTo("about")}><i className="bi bi-chevron-down" /></button>
      </section>

      {/* ── ABOUT ── */}
      <section className={classes.section + " " + classes.sectionMid} id="about">
        <div className={classes.sectionInner}>
          <div className={classes.aboutLayout}>
            <div className={classes.aboutLeft}>
              <span className={classes.sectionTag}>About Us</span>
              <h2>Why Choose ZenithLMS?</h2>
              <p>ZenithLMS is a complete cybersecurity awareness platform designed for modern organizations. From phishing simulations to live training sessions, we provide everything you need to build a security-conscious culture.</p>
              <p>Trusted by thousands of organizations worldwide, our platform delivers measurable improvements in security posture and employee awareness.</p>
              <button className={classes.ctaPrimary} onClick={() => goTo("choose-path")} style={{marginTop:8}}>Start Free Trial <i className="bi bi-arrow-right" /></button>
            </div>
            <div className={classes.aboutRight}>
              <div className={classes.statsGrid}>
                {[
                  {n:"10,000+",l:"Organizations",   icon:"building",color:"#0d9370"},
                  {n:"500K+",  l:"Learners Trained", icon:"people",  color:"#2563eb"},
                  {n:"98%",    l:"Satisfaction Rate",icon:"star",    color:"#d97706"},
                  {n:"24/7",   l:"Expert Support",   icon:"headset", color:"#7c3aed"},
                ].map((s) => (
                  <div key={s.l} className={classes.statCard}>
                    <div className={classes.statIcon} style={{background:s.color+"22",color:s.color}}><i className={"bi bi-"+s.icon} /></div>
                    <div className={classes.statNum}>{s.n}</div>
                    <div className={classes.statLabel}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <button className={classes.scrollDown} onClick={() => scrollTo("howitworks")}><i className="bi bi-chevron-down" /></button>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className={classes.section + " " + classes.sectionDark} id="howitworks">
        <div className={classes.sectionInner}>
          <div className={classes.sectionHdr}>
            <span className={classes.sectionTag}>Get Started</span>
            <h2>How It Works</h2>
            <p>Get your organization protected in three simple steps</p>
          </div>
          <div className={classes.howGrid}>
            {[
              {step:"01",icon:"building-add",    color:"#0d9370",title:"Create Organization",desc:"Sign up and set up your organization profile in minutes. Invite your admin team to get started."},
              {step:"02",icon:"people-fill",      color:"#2563eb",title:"Add Your Team",       desc:"Invite users and trainers, assign them to groups, and configure access levels."},
              {step:"03",icon:"shield-fill-check",color:"#7c3aed",title:"Start Training",      desc:"Launch courses, run phishing simulations, and track your team's security awareness progress."},
            ].map((h) => (
              <div key={h.step} className={classes.howCard}>
                <div className={classes.howNum} style={{color:h.color}}>{h.step}</div>
                <div className={classes.howIcon} style={{background:h.color+"22",color:h.color}}><i className={"bi bi-"+h.icon} /></div>
                <h3>{h.title}</h3><p>{h.desc}</p>
              </div>
            ))}
          </div>
          <div className={classes.ctaBannerInline}>
            <h3>Ready to secure your organization?</h3>
            <div className={classes.heroCtas}>
              <button className={classes.ctaPrimary} onClick={() => goTo("choose-path")}>Get Started Free <i className="bi bi-arrow-right" /></button>
              <button className={classes.ctaSecondary} onClick={() => goTo("login")}>Sign In</button>
            </div>
          </div>
        </div>
      </section>

      <footer className={classes.footer}>
        <div className={classes.footerTop}>
          <div className={classes.footerBrand}><img src={zenithIcon} alt="" className={classes.brandLogo} /><span>ZenithLMS</span></div>
          <div className={classes.footerLinks}><a href="#">Privacy Policy</a><a href="#">Terms of Service</a><a href="#">Support</a></div>
        </div>
        <p className={classes.footerCopy}>© 2024 ZenithLMS. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
