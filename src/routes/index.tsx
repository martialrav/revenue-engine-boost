import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RevengineHQ — B2B Outbound System That Fills Your Pipeline" },
      { name: "description", content: "We build the cold email and outbound system that puts your offer in front of decision makers — consistently. From $200/mo, live in 14 days." },
      { property: "og:title", content: "RevengineHQ — We fill your pipeline. You close." },
      { property: "og:description", content: "B2B outbound system. Cold email, LinkedIn, nurture, handoff — fully managed. From $200/mo, live in 14 days." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function StrategyForm({ onClose }: { onClose: () => void }) {
  const embedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Typeform embed script dynamically
    const script = document.createElement("script");
    script.src = "https://embed.typeform.com/next/embed.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="rev-modal-overlay" onClick={onClose}>
      <div className="rev-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 800, width: "90vw", padding: "2rem" }}>
        <button className="rev-modal-close" onClick={onClose} aria-label="Close">×</button>
        <div className="rev-modal-tag">Free strategy session</div>
        <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>UNLOCK YOUR REVENUE <span className="blue">ENGINE.</span></h2>
        <p className="sub" style={{ marginBottom: "1.5rem" }}>
          Fill out the form below. We'll reach out within 48 hours with a tailored quotation and a strategy for booking more sales.
        </p>
        <div data-tf-live="01KT9QSNGYV8JEC8MKMT0PA249" ref={embedRef} style={{ minHeight: 400 }} />
      </div>
    </div>
  );
}

function Index() {
  const [open, setOpen] = useState<null | string>(null);
  const openForm = (plan?: string) => setOpen(plan ?? "");
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0, raf = 0;
    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.left = mx - 4 + "px";
        cursorRef.current.style.top = my - 4 + "px";
      }
    };
    const tick = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = rx - 16 + "px";
        ringRef.current.style.top = ry - 16 + "px";
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);

    const scale = (s: number, r: number) => () => {
      if (cursorRef.current) cursorRef.current.style.transform = `scale(${s})`;
      if (ringRef.current) ringRef.current.style.transform = `scale(${r})`;
    };
    const enter = scale(2.5, 1.5);
    const leave = scale(1, 1);
    const els = document.querySelectorAll(".rev button, .rev a");
    els.forEach((el) => {
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
    });

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add("visible"), i * 60);
          }
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll(".rev .reveal").forEach((el) => obs.observe(el));

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      els.forEach((el) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
      obs.disconnect();
    };
  }, []);

  return (
    <div className="rev">
      <div ref={cursorRef} className="rev-cursor" />
      <div ref={ringRef} className="rev-cursor-ring" />
      <div className="grid-lines" />

      <nav>
        <div className="nav-logo">Revengine<span>HQ</span></div>
        <button className="nav-contact" onClick={() => setOpen("")} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", font: "inherit" }}>Get in touch →</button>
      </nav>

      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-glow2" />
        <div className="hero-top">RevengineHQ · B2B Outbound System · Est. 2025</div>
        <h1>
          WE FILL<br />
          YOUR <span className="blue">PIPELINE.</span><br />
          <span className="outline">YOU CLOSE.</span>
        </h1>
        <div className="hero-sub-row">
          <p className="hero-desc">
            Most B2B companies have a great product and a broken top-of-funnel. We build the
            cold email and outbound system that puts your offer in front of decision makers —
            consistently, without you lifting a finger.
          </p>
          <div className="hero-stats">
            <div><div className="h-stat-num">110+</div><div className="h-stat-label">campaigns run</div></div>
            <div><div className="h-stat-num">4 YRS</div><div className="h-stat-label">B2B ops</div></div>
            <div><div className="h-stat-num">14</div><div className="h-stat-label">days to live</div></div>
          </div>
        </div>
        <div className="hero-cta">
          <button className="btn-main" onClick={() => openForm()}>Get a free strategy →</button>
          <button className="btn-ghost" onClick={() => openForm()}>Unlock your revenue engine</button>
        </div>
      </section>

      <hr className="section-divider" />

      <section>
        <div className="wrap">
          <div className="s-tag">The problem</div>
          <div className="s-title">YOUR PIPELINE<br /><span className="dim">IS LEAKING.</span></div>
          <p className="s-sub">Every B2B company struggles with the same three things before a sales conversation ever happens.</p>
          <div className="prob-grid">
            {[
              ["01","No consistent outreach","Outbound only happens when someone has time. Which means it never happens consistently enough to build real pipeline."],
              ["02","Leads fall through cracks","Interested prospects never get nurtured. They clicked, showed interest, then heard nothing. They went to your competitor."],
              ["03","SDR hires are slow & costly","6 months to ramp. 3 more to show results. $10,000+ before a single booked call. And you're still not sure they'll perform."],
            ].map(([n,t,d])=>(
              <div className="prob-card" key={n}>
                <div className="prob-num">{n}</div>
                <div className="prob-title">{t}</div>
                <div className="prob-desc">{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      <section style={{ background: "#0d0d12" }}>
        <div className="wrap">
          <div className="s-tag">Why not ads</div>
          <div className="s-title">COLD EMAIL VS<br /><span className="dim">LINKEDIN ADS.</span></div>
          <p className="s-sub">Clients always ask. Here's the honest answer backed by 2026 market data.</p>
          <div className="vs-wrap">
            <div className="vs-header">
              <div className="vs-header-cell" style={{ color: "#7a7a8c" }}>Metric</div>
              <div className="vs-header-cell">LinkedIn Ads</div>
              <div className="vs-header-cell">RevengineHQ</div>
            </div>
            {[
              ["Monthly cost","$3,000–$5,000/mo minimum","From $200/mo"],
              ["Cost per lead","$75–$164 per lead","Included in retainer"],
              ["Cost per demo request","$115–$150 per demo","Included in retainer"],
              ["Time to first result","60–90 days minimum","2 weeks to first campaign"],
              ["Learning phase","30 days just collecting data","None — starts optimised"],
              ["Audience reach","Whoever bids less than you","Exact ICP, direct inbox"],
            ].map(([m,a,b])=>(
              <div className="vs-row" key={m}>
                <div className="vs-cell">{m}</div>
                <div className="vs-cell">{a}</div>
                <div className="vs-cell">{b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      <section>
        <div className="wrap">
          <div className="s-tag">How it works</div>
          <div className="s-title">YOUR FUNNEL.<br /><span className="dim">HANDLED.</span></div>
          <p className="s-sub">We work across every stage — from first cold touch to a warm lead ready to buy. You step in only when it's time to close.</p>
          <div className="funnel-items">
            {[
              { n:"01", color:"#4f8ef7", stage:"Awareness", title:"Getting in front of the right people", desc:"We identify your exact ICP and reach out through cold email and LinkedIn outreach. Targeted, researched, personalised at scale. Your brand lands in the inbox of people who actually need your product — not a random audience hoping to scroll past your ad.", tags:["Cold Email","LinkedIn Outreach","SMTP Infrastructure","List Building","Deliverability"] },
              { n:"02", color:"#8b5cf6", stage:"Interest", title:"Converting attention into intent", desc:"Awareness alone doesn't close deals. We run live webinars, produce AI-powered on-demand videos, and distribute content that positions your product as the obvious solution. Prospects move from 'I've heard of them' to 'I want to know more.'", tags:["Live Webinars","AI OD Videos","Content Syndication","Lead Magnets"] },
              { n:"03", color:"#f59e0b", stage:"Nurture", title:"Keeping warm leads warm", desc:"Most leads aren't ready to buy immediately. We build automated nurture sequences that follow up, educate, and re-engage interested prospects — so when they're ready, you're already top of mind. Not your competitor.", tags:["Email Sequences","Follow Up Automation","CRM Integration","Re-engagement"] },
              { n:"04", color:"#22c55e", stage:"Handoff", title:"Warm leads delivered. You close.", desc:"Our job ends when a prospect raises their hand — replies to an email, registers for a demo, or books a call. We hand off a briefed, warm lead to your sales team. You show up to a conversation, not a cold call. Everything before that is on us.", tags:["Appointment Setting","Lead Briefing","Sales Handoff","Pipeline Report"] },
            ].map((f)=>(
              <div className="f-item" key={f.n}>
                <div className="f-num" style={{ color: f.color + "4d" }}>{f.n}</div>
                <div className="f-line-wrap">
                  <div className="f-dot" style={{ background: f.color, boxShadow: `0 0 12px ${f.color}` }} />
                  <div className="f-line" />
                </div>
                <div className="f-content">
                  <div className="f-stage" style={{ color: f.color }}>{f.stage}</div>
                  <div className="f-title">{f.title}</div>
                  <div className="f-desc">{f.desc}</div>
                  <div className="f-tags">
                    {f.tags.map(t => <span className="f-tag" key={t}>{t}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      <section style={{ background: "#0d0d12" }}>
        <div className="wrap">
          <div className="s-tag">Pricing</div>
          <div className="s-title">CHOOSE YOUR<br /><span className="dim">DEPTH.</span></div>
          <p className="s-sub">All plans include full setup, execution, and reporting. No hidden tool costs. No setup fee. Start this month.</p>

          <div className="pricing-grid">
            {[
              { tier:"Tier 01", name:"STARTER", price:"200", domain:"Shared domains", domainCls:"shared", hot:false,
                items:[
                  [true,"1,500 verified contacts/mo"],[true,"7,500 emails sent (5-step)"],[true,"1 sequence written"],
                  [true,"Under 3% bounce rate"],[true,"Monthly performance report"],[true,"1 copy revision/month"],
                  [false,"LinkedIn outreach"],[false,"CRM integration"],[false,"Client domains"],
                ], best:"Best for: Testing outbound for the first time" },
              { tier:"Tier 02", name:"GROWTH", price:"350", domain:"Your domains", domainCls:"own", hot:false,
                items:[
                  [true,"3,000 verified contacts/mo"],[true,"15,000 emails sent (5-step)"],[true,"2 sequences A/B tested"],
                  [true,"200 LinkedIn touches/mo"],[true,"CRM integration"],[true,"Under 3% bounce rate"],
                  [true,"Bi-weekly report"],[true,"2 copy revisions/month"],[false,"Nurture sequences"],
                ], best:"Best for: Consistent pipeline building" },
              { tier:"Tier 03", name:"SCALE", price:"600", domain:"Your domains", domainCls:"own", hot:true,
                items:[
                  [true,"7,000 verified contacts/mo"],[true,"35,000 emails sent (5-step)"],[true,"Multiple sequences, full A/B"],
                  [true,"500 LinkedIn touches/mo"],[true,"Full nurture sequence"],[true,"Under 3% bounce rate"],
                  [true,"Unlimited copy revisions"],[true,"Weekly report"],[true,"Dedicated Slack channel"],[true,"Monthly strategy call"],
                ], best:"Best for: Aggressive pipeline targets" },
              { tier:"Tier 04", name:"FULL ENGINE", price:"900", domain:"Your domains", domainCls:"own", hot:false,
                items:[
                  [true,"10,000 verified contacts/mo"],[true,"50,000 emails sent (5-step)"],[true,"Google + MS + SMTP accounts"],
                  [true,"Dedicated Instantly account"],[true,"Shared client access"],[true,"Calendly appointment setting"],
                  [true,"Sales nurture sequences"],[true,"1,000 LinkedIn touches/mo"],[true,"1 Webinar or AI OD video/mo"],[true,"Weekly pipeline report"],
                ], best:"Best for: Full funnel pipeline generation" },
            ].map((p) => (
              <div className={`p-card ${p.hot ? "hot" : ""}`} key={p.name}>
                <div className="p-tier">{p.tier}</div>
                <div className="p-name">{p.name}</div>
                <div className="p-price"><sup>$</sup>{p.price}<sub>/mo</sub></div>
                <div className={`p-domain ${p.domainCls}`}>{p.domain}</div>
                <div className="p-divider" />
                <div className="p-section">{p.name === "FULL ENGINE" ? "Everything in Scale, plus" : "Commitments"}</div>
                <ul className="p-items">
                  {p.items.map(([yes, txt], i) => (
                    <li key={i}>
                      <span className={yes ? "y" : "n"}>{yes ? "→" : "–"}</span>
                      <span style={!yes ? { opacity: 0.4 } : undefined}>{txt as string}</span>
                    </li>
                  ))}
                </ul>
                <div className="p-highlight">
                  <div className="p-highlight-text">{p.best}</div>
                </div>
                <button className="p-cta" onClick={() => openForm(p.name)}>
                  Get free strategy →
                </button>
              </div>
            ))}
          </div>

          <div className="addon-box">
            <div>
              <div className="addon-label">Add-on</div>
              <div className="addon-name">Extra Webinar or Content Syndication</div>
              <div className="addon-desc">Live webinar execution or AI on-demand video — fully produced, promoted, and followed up. Add to any plan.</div>
            </div>
            <div className="addon-price">$300<span>/webinar</span></div>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      <section>
        <div className="wrap">
          <div className="s-tag">Our promise</div>
          <div className="s-title">WHAT WE<br /><span className="dim">GUARANTEE.</span></div>
          <p className="s-sub">We can't control your market. We can control our execution — and that's exactly what we guarantee.</p>
          <div className="commit-grid">
            {[
              ["⚡","Live in 14 days","Your infrastructure is set up, domains configured, sequences loaded, and first campaign live within 14 days of onboarding. No exceptions."],
              ["📬","Under 3% bounce rate","Every contact is verified before sending. We monitor deliverability weekly. If bounce rate exceeds 3% we rebuild the list immediately at no cost."],
              ["✍️","Sequence rewrite guarantee","If open rate drops below 25% or reply rate below 1% for two consecutive months, we rewrite the sequences and rebuild targeting at zero extra cost."],
              ["🚪","30-day exit clause","Not happy with the execution after 30 days? Cancel with no penalty. We're confident enough in our work that we don't need to lock you in."],
            ].map(([icon,t,d])=>(
              <div className="commit-card" key={t}>
                <div className="commit-icon">{icon}</div>
                <div className="commit-title">{t}</div>
                <div className="commit-desc">{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="cta-section">
        <div className="cta-inner">
          <div>
            <div className="cta-title">READY TO<br />BUILD YOUR<br /><span className="blue">ENGINE?</span></div>
            <p className="cta-sub">No pitch. No pressure. Tell us about your ICP and we'll come back within 48 hours with a tailored quotation and a strategy for booking more sales.</p>
          </div>
          <div className="cta-right">
            <button className="btn-main" onClick={() => openForm()}>Get a free strategy →</button>
            <button className="btn-ghost" onClick={() => openForm()} style={{ textAlign: "center" }}>Request a callback</button>
          </div>
        </div>
      </div>

      <footer>
        <div className="f-brand">Revengine<span>HQ</span></div>
        <div className="f-email">© {new Date().getFullYear()} RevengineHQ</div>
      </footer>

      {open !== null && (
        <StrategyForm onClose={() => setOpen(null)} />
      )}
    </div>
  );
}
