import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, Zap, Shield, DollarSign, Phone, Mail, Rocket, CheckCircle, ChevronRight,
  Linkedin, Twitter, Github, Code2, Database, Headphones, Cpu, BarChart3, Layers
} from "lucide-react";

/**
 * easebot.ai – React + Tailwind v4 + Framer Motion
 * Pages via hash routes: Home (#/), About (#/about), Contact (#/contact)
 */

// --- Tiny hash router helpers ---
const routes = { HOME: "/", ABOUT: "/about", CONTACT: "/contact" } as const;
type Route = typeof routes[keyof typeof routes];

function getHashRoute(): Route {
  const h = (typeof window !== 'undefined' ? window.location.hash : '') || "#/";
  const path = h.replace(/^#/, "");
  if (path.startsWith(routes.ABOUT)) return routes.ABOUT;
  if (path.startsWith(routes.CONTACT)) return routes.CONTACT;
  return routes.HOME;
}
function navTo(path: Route){ if (typeof window !== 'undefined') window.location.hash = path; }

// --- Nav data (mega menu) ---
const mega = {
  solutions: {
    label: "Solutions",
    columns: [
      { title: "Customer Experience", items: [
        { label: "Support Automation", desc: "24/7 chat + ticket deflection", href: `#${routes.HOME}#services`, icon: Headphones },
        { label: "Sales Outreach", desc: "AI SDR, lead qual & follow-ups", href: `#${routes.HOME}#services`, icon: Rocket },
        { label: "Success & Onboarding", desc: "Guides, checklists, nudges", href: `#${routes.HOME}#services`, icon: CheckCircle },
      ]},
      { title: "Operations", items: [
        { label: "Back-Office RPA", desc: "Invoices, AP/AR, HR ops", href: `#${routes.HOME}#services`, icon: Layers },
        { label: "Agentic Workflows", desc: "Plan → act → verify loops", href: `#${routes.HOME}#services`, icon: Cpu },
        { label: "Data & Integrations", desc: "ETL, APIs, warehouses", href: `#${routes.HOME}#services`, icon: Database },
      ]},
      { title: "Insights", items: [
        { label: "Analytics Dashboard", desc: "ROI, deflection, CSAT", href: `#${routes.HOME}#services`, icon: BarChart3 },
        { label: "Quality Systems", desc: "Human-in-the-loop reviews", href: `#${routes.HOME}#process`, icon: Shield },
      ]},
    ],
  },
  products: {
    label: "Products",
    columns: [
      { title: "Platform", items: [
        { label: "Easebot Core", desc: "Model-agnostic AI engine", href: `#${routes.HOME}#services`, icon: Bot },
        { label: "Pre-built Bots", desc: "Templates for common flows", href: `#${routes.HOME}#services`, icon: Zap },
        { label: "API & Webhooks", desc: "Integrate your stack", href: `#${routes.HOME}#services`, icon: Code2 },
      ]},
      { title: "Compliance", items: [
        { label: "Security", desc: "SSO, RBAC, audit logs", href: `#${routes.HOME}#services`, icon: Shield },
        { label: "Data Residency", desc: "US/EU options", href: `#${routes.HOME}#pricing`, icon: Shield },
      ]},
    ],
  },
  resources: {
    label: "Resources",
    columns: [
      { title: "Learn", items: [
        { label: "Case Studies", desc: "Results from real teams", href: `#${routes.HOME}#results`, icon: CheckCircle },
        { label: "FAQ", desc: "Common questions answered", href: `#${routes.HOME}#faq`, icon: ChevronRight },
      ]},
      { title: "Guides", items: [
        { label: "RAG Playbook", desc: "Blueprint for knowledge bots", href: `#${routes.HOME}#process`, icon: Layers },
        { label: "Agent Safety", desc: "Guardrails that work", href: `#${routes.HOME}#process`, icon: Shield },
      ]},
    ],
  },
  company: {
    label: "Company",
    columns: [
      { title: "About", items: [
        { label: "About Easebot", desc: "Team & mission", href: `#${routes.ABOUT}`, icon: Bot },
        { label: "Contact", desc: "Talk to a human", href: `#${routes.CONTACT}`, icon: Mail },
      ]},
      { title: "Careers", items: [
        { label: "Open Roles", desc: "We hire pragmatists", href: `#${routes.ABOUT}`, icon: Rocket },
      ]},
    ],
  },
  pricing: { label: "Pricing", href: `#${routes.HOME}#pricing` },
} as const;

const services = [
  { title: "AI Chatbots & Assistants", icon: Bot, desc: "Custom GPT-style chat for support, sales, onboarding, and internal knowledge with tone and guardrails tuned to your brand.", bullets: ["24/7 omni-channel (web, Slack, WhatsApp)","Retrieval-Augmented Generation (RAG)","Escalation to human in one click"] },
  { title: "Workflow Automation", icon: Layers, desc: "Streamline repetitive tasks across CRM, ticketing, and back-office tools with no-code triggers and AI steps.", bullets: ["Zapier/Make/Tray & custom nodes","Human-in-the-loop approvals","SLA & error monitoring"] },
  { title: "Data & Integrations", icon: Database, desc: "Clean, sync, and route data between apps. Build resilient APIs and webhooks that your business can trust.", bullets: ["ETL to warehouses (Snowflake/BigQuery)","Webhook & API gateways","SOC2-friendly observability"] },
  { title: "Agentic Workforces", icon: Cpu, desc: "Deploy multi-step agents that plan, act, and verify outcomes across emails, CRMs, and internal tools.", bullets: ["Function-calling tools","Planning + self-check loops","Safe action scopes"] },
  { title: "Analytics & Reporting", icon: BarChart3, desc: "Measure ROI with dashboards and attribution so every automation is tied to real business impact.", bullets: ["AI quality & deflection metrics","Revenue and saved hours","A/B tests & cohorting"] },
  { title: "Security & Compliance", icon: Shield, desc: "Enterprise-grade practices to protect your data and customers from day one.", bullets: ["SSO, RBAC, audit logs","PII redaction & data residency","Vendor risk assessments"] },
];

const plans = [
  { name: "Growth", price: "$999", cadence: "/mo", badge: "Popular", features: ["3 chatbots + 10 automations","Up to 25,000 messages/actions","Priority support (24h)","Advanced analytics & A/B"], highlighted: true, cta: "Scale with Ease" },
  { name: "Business", price: "$1,499", cadence: "/mo", badge: "Teams", features: ["Unlimited chatbots & automations","Up to 150,000 messages/actions","SLA support + phone","SSO, RBAC, audit logs"], highlighted: false, cta: "Talk to Sales" },
  { name: "Enterprise", price: "$1,999", cadence: "/mo", badge: "Security & scale", features: ["Custom SLAs & throughput","Dedicated VPC / on-prem options","Data residency (US/EU)","Compliance support"], highlighted: false, cta: "Book a Demo" },
];

const faqs = [
  { q: "Which LLMs and tools do you support?", a: "We’re model-agnostic: OpenAI, Anthropic, Google, and open-source models. We integrate with CRMs (HubSpot/Salesforce), help desks (Zendesk/Intercom), Slack/Teams, Google/Microsoft, Zapier/Make, and custom APIs." },
  { q: "How do you handle data privacy?", a: "We minimize retention, encrypt data at rest and in transit, and can route traffic through your cloud. Optional PII redaction, access controls, and audit logging are available on Business and Enterprise." },
  { q: "What does onboarding look like?", a: "Week 1 discovery & design, Week 2 build & connect, Week 3 launch & measure. We bring templates and playbooks so you see value fast." },
  { q: "How is ROI measured?", a: "We track saved hours, resolution times, deflection rates, conversion lifts, and revenue influence in dashboards—plus A/B testing to validate impact." },
];

const steps = [
  { title: "Discover", desc: "Map goals, stack, SLAs, and data flows.", icon: SearchIcon },
  { title: "Design", desc: "Draft prompts, tools, and guardrails.", icon: Layers },
  { title: "Build", desc: "Implement automations and integrations.", icon: Code2 },
  { title: "Launch", desc: "Ship with QA, monitoring, and fallback.", icon: Rocket },
  { title: "Optimize", desc: "Iterate with analytics & A/B tests.", icon: Zap },
];

function SearchIcon(props:any){
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className}>
      <path d="M11 19a8 8 0 1 1 5.292-14.006A8 8 0 0 1 11 19Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

const gradientBg =
  "bg-[radial-gradient(1400px_900px_at_100%_-10%,rgba(59,130,246,0.25),transparent_70%),radial-gradient(1400px_900px_at_0%_10%,rgba(147,197,253,0.25),transparent_70%),linear-gradient(180deg,#01040d,#020617,#0f172a)]";
const glass =
  "card backdrop-blur-xl border border-white/10 shadow-[0_0_1px_rgba(255,255,255,0.25),0_8px_40px_rgba(2,132,199,0.25)]";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: "easeOut" },
};

export default function EasebotSite() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [route, setRoute] = useState<Route>(getHashRoute());
  const [navOpen, setNavOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<null | keyof typeof mega>(null);
  const year = useMemo(() => new Date().getFullYear(), []);

  // --- Hover intent to prevent menu flicker ---
  const [hoverTimer, setHoverTimer] = useState<number | null>(null);
  const openMenuNow = (k: keyof typeof mega) => {
    if (hoverTimer) clearTimeout(hoverTimer);
    setHoverTimer(null);
    setOpenMenu(k);
  };
  const scheduleCloseMenu = () => {
    if (hoverTimer) clearTimeout(hoverTimer);
    const t = window.setTimeout(() => setOpenMenu(null), 150); // small delay avoids gaps flicker
    setHoverTimer(t);
  };

  useEffect(() => {
    const onHash = () => { setRoute(getHashRoute()); setNavOpen(false); };
    window.addEventListener('hashchange', onHash);
    if (!window.location.hash) navTo(routes.HOME);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return (
    <div className={`min-h-screen text-white ${gradientBg} selection:bg-blue-500/30 selection:text-white`}>
      {/* Local CSS for animated gradients with adjustable sheen intensity */}
      <style>{`
        :root {
          --card-grad: linear-gradient(135deg, rgba(59,130,246,0.16), rgba(8,145,178,0.12) 35%, rgba(59,130,246,0.16));
          --sheen-alpha: 0.06; /* increase for stronger sheen */
          --sheen-speed: 18s;  /* lower = faster */
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .card { background: var(--card-grad); background-size: 200% 200%; animation: gradientShift 30s ease-in-out infinite; position: relative; overflow: hidden; }
        .card::after { content: ""; position: absolute; inset: 0; pointer-events:none; background: radial-gradient(600px 300px at 100% 0%, rgba(147,197,253,0.08), transparent 60%), radial-gradient(600px 300px at 0% 100%, rgba(59,130,246,0.08), transparent 60%); }
        .sheen { position: relative; overflow: hidden; }
        .sheen::before { content: ""; position: absolute; top: -120%; left: -60%; width: 220%; height: 340%; transform: rotate(18deg); background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,var(--sheen-alpha)) 50%, rgba(255,255,255,0) 100% ); animation: sheenMove var(--sheen-speed) linear infinite; }
        @keyframes sheenMove {
          0% { transform: translateX(-60%) rotate(18deg); }
          50% { transform: translateX(0%) rotate(18deg); }
          100% { transform: translateX(60%) rotate(18deg); }
        }
      `}</style>

      {/* Floating abstract blobs */}
      <Decor />

      {/* Header / Nav */}
      <header className="sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4">
          <div className={`flex items-center justify-between rounded-2xl px-4 py-3 md:px-6 ${glass} sheen`}>
            <a href={`#${routes.HOME}`} className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 grid place-items-center shadow-inner">
                <Bot className="h-5 w-5" />
              </div>
              <span className="font-semibold tracking-tight">easebot<span className="text-blue-400">.ai</span></span>
            </a>

            {/* Desktop nav with mega menu (fixed) */}
            <nav
              className="hidden md:flex items-center gap-2 text-sm relative"
              onMouseLeave={scheduleCloseMenu}
            >
              {(["solutions","products","resources","company"] as Array<keyof typeof mega>).map((key)=> (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => openMenuNow(key)}
                >
                  <button className={`px-3 py-2 rounded-lg hover:bg-white/10 ${openMenu===key ? 'text-blue-300' : ''}`}>
                    {mega[key].label}
                  </button>
                </div>
              ))}
              <a href={`${mega.pricing.href}`} className="px-3 py-2 rounded-lg hover:bg-white/10">
                {mega.pricing.label}
              </a>

              {/* Mega panel (shared) */}
              <AnimatePresence>
                {openMenu && (
                  <motion.div
                    onMouseEnter={() => { if (hoverTimer) { clearTimeout(hoverTimer); setHoverTimer(null); } }}
                    onMouseLeave={scheduleCloseMenu}
                    initial={{opacity:0, y:-6}}
                    animate={{opacity:1, y:0}}
                    exit={{opacity:0, y:-6}}
                    className={`absolute left-0 top-full mt-2 w-[900px] max-w-[90vw] ${glass} rounded-2xl p-6 grid grid-cols-3 gap-4`}
                  >
                    {mega[openMenu].columns.map((col)=> (
                      <div key={col.title}>
                        <div className="text-xs uppercase tracking-wide text-white/60">{col.title}</div>
                        <ul className="mt-2 space-y-1">
                          {col.items.map((it)=> (
                            <li key={it.label}>
                              <a href={it.href} className="flex items-start gap-3 rounded-lg px-2 py-2 hover:bg-white/10">
                                <div className="h-8 w-8 rounded-md bg-white/10 grid place-items-center"><it.icon className="h-4 w-4"/></div>
                                <div>
                                  <div className="font-medium">{it.label}</div>
                                  <div className="text-xs text-white/60">{it.desc}</div>
                                </div>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </nav>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <a href={`#${routes.CONTACT}`} className="rounded-xl px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/20 transition-colors">Book a demo</a>
              <a href={`#${routes.HOME}#pricing`} className="rounded-xl px-4 py-2 text-sm font-medium bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 transition-colors shadow-lg">
                See pricing
              </a>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden inline-flex items-center justify-center rounded-lg p-2 bg-white/10 hover:bg-white/20"
              aria-label="Open menu"
              aria-expanded={navOpen}
              onClick={() => setNavOpen(!navOpen)}
            >
              <span className="sr-only">Menu</span>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/90">
                <path d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>

          {/* Mobile menu panel (accordion mega) */}
          <AnimatePresence>
            {navOpen && (
              <motion.div
                initial={{opacity:0, y:-8}}
                animate={{opacity:1, y:0}}
                exit={{opacity:0, y:-8}}
                className={`mt-2 md:hidden rounded-2xl p-3 ${glass}`}
              >
                {(["solutions","products","resources","company"] as Array<keyof typeof mega>).map((key)=> (
                  <details key={key} className="group border-b border-white/10 last:border-0">
                    <summary className="flex items-center justify-between py-2 cursor-pointer list-none">
                      <span className="text-sm">{mega[key].label}</span>
                      <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90"/>
                    </summary>
                    <div className="pb-2 pl-2 grid gap-1">
                      {mega[key].columns.flatMap(c=>c.items).map((it)=> (
                        <a key={it.label} href={it.href} onClick={()=>setNavOpen(false)} className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-white/10">
                          <it.icon className="h-4 w-4"/> <span className="text-sm">{it.label}</span>
                        </a>
                      ))}
                    </div>
                  </details>
                ))}
                <a href={`${mega.pricing.href}`} onClick={()=>setNavOpen(false)} className="block mt-2 rounded-lg px-3 py-2 text-sm bg-white/10 hover:bg-white/20">Pricing</a>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <a href={`#${routes.CONTACT}`} className="rounded-lg px-3 py-2 text-center text-sm bg-white/10 hover:bg-white/20">Book a demo</a>
                  <a href={`#${routes.HOME}#pricing`} className="rounded-lg px-3 py-2 text-center text-sm bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400">See pricing</a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Router outlet */}
      {route === routes.HOME && <Home openFaq={openFaq} setOpenFaq={setOpenFaq} />}
      {route === routes.ABOUT && <AboutPage />}
      {route === routes.CONTACT && <ContactPage />}

      {/* Footer */}
      <SiteFooter year={year} />
    </div>
  );
}

function Home({openFaq, setOpenFaq}:{openFaq:number|null, setOpenFaq:(n:number|null)=>void}){
  return (
    <>
      {/* Hero */}
      <section id="home" className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 pb-16">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <motion.div {...fadeUp} className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-blue-200">
                <Shield className="h-3.5 w-3.5" /> Enterprise-minded. Startup-fast.
              </span>
              <h1 className="mt-4 text-4xl/tight md:text-5xl/tight lg:text-6xl/tight font-bold tracking-tight">
                Automate work with <span className="bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">AI agents</span> that deliver results.
              </h1>
              <p className="mt-4 text-white/70 max-w-2xl">
                Easebot.ai designs, builds, and runs AI automations—so your team can focus on what matters. From chat to back-office workflows, we ship measurable ROI in weeks, not months.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={`#${routes.CONTACT}`} className="rounded-2xl px-5 py-3 font-semibold bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 transition-colors shadow-xl flex items-center gap-2">
                  <Rocket className="h-5 w-5" /> Book a demo
                </a>
                <a href={`#${routes.HOME}#services`} className="rounded-2xl px-5 py-3 font-semibold bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-2">
                  <ChevronRight className="h-5 w-5" /> Explore services
                </a>
              </div>
              <div className="mt-8 flex items-center gap-6 text-xs text-white/60">
                <span className="inline-flex items-center gap-2"><CheckCircle className="h-4 w-4 text-blue-300"/> SOC2-aware</span>
                <span className="inline-flex items-center gap-2"><CheckCircle className="h-4 w-4 text-blue-300"/> Human-in-the-loop</span>
                <span className="inline-flex items-center gap-2"><CheckCircle className="h-4 w-4 text-blue-300"/> ROI-first</span>
              </div>
            </motion.div>
            <motion.div {...fadeUp} className="lg:col-span-5">
              <HeroCard />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Logos */}
      <section aria-label="logos" className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className={`grid grid-cols-2 md:grid-cols-6 gap-6 items-center justify-items-center rounded-2xl p-6 ${glass}`}>
            {["NovaCorp","Acme","BluePeak","Halcyon","Northwind","Vertex"].map((n)=>(
              <div key={n} className="text-white/50 text-xs md:text-sm tracking-widest uppercase">{n}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="pt-8 md:pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="What we do" title="AI automation, end to end" subtitle="Strategy, build, and ongoing optimization—delivered by a team that blends product, data, and platform engineering." />
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.div key={s.title} {...fadeUp} transition={{delay: i*0.03, duration: 0.5}} className={`p-6 rounded-2xl ${glass} sheen`}>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500/30 to-cyan-500/30 grid place-items-center">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{s.title}</h3>
                    <p className="text-sm text-white/70 mt-2">{s.desc}</p>
                  </div>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-white/70">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-blue-300 mt-0.5"/> {b}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Fair market pricing" title="Simple, transparent plans" subtitle="Month-to-month. Cancel anytime. Usage beyond included message/action allotments billed at cost + 10%." />
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((p) => (
              <motion.div key={p.name} {...fadeUp} className={`p-6 rounded-2xl flex flex-col ${glass} ${p.highlighted ? 'ring-2 ring-blue-400/60' : ''}`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{p.name}</h3>
                  {p.badge && (
                    <span className="text-[10px] uppercase tracking-wider rounded-full px-2 py-1 bg-white/10 border border-white/10">{p.badge}</span>
                  )}
                </div>
                <div className="mt-4 flex items-end gap-1">
                  <div className="text-3xl font-bold">{p.price}</div>
                  <div className="text-white/60 mb-1">{p.cadence}</div>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-white/70">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-blue-300 mt-0.5"/> {f}</li>
                  ))}
                </ul>
                <a href={`#${routes.CONTACT}`} className={`mt-6 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 font-medium bg-white/10 hover:bg-white/20 transition ${p.highlighted ? 'bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400' : ''}`}>
                  <DollarSign className="h-4 w-4"/> {p.cta}
                </a>
              </motion.div>
            ))}
          </div>
          <p className="text-xs text-white/50 mt-4">Need a custom SOW or want to bring your cloud? We offer fixed-bid projects and usage-based pricing. Contact us below.</p>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="How it works" title="From idea to impact" subtitle="A crisp, collaborative delivery model that respects your timelines and constraints." />
          <div className="mt-8 grid md:grid-cols-5 gap-4">
            {steps.map((s, i) => (
              <motion.div key={s.title} {...fadeUp} transition={{delay: i*0.04}} className={`p-5 rounded-2xl text-center ${glass}`}>
                <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500/30 to-cyan-500/30 grid place-items-center">
                  <s.icon className="h-6 w-6" />
                </div>
                <div className="mt-3 font-semibold">{s.title}</div>
                <div className="text-sm text-white/70 mt-1">{s.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Results" title="Teams we’ve helped" subtitle="Early projects have delivered quick wins and durable savings." />
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            {[1,2,3].map((i) => (
              <motion.figure key={i} {...fadeUp} className={`p-6 rounded-2xl ${glass}`}>
                <blockquote className="text-sm text-white/80">“Easebot automated our lead routing and SDR follow-ups in two weeks. Response times dropped by 63% and pipeline increased 18%.”</blockquote>
                <figcaption className="mt-4 text-xs text-white/60">Alex P. • VP Growth, BluePeak</figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="pt-16 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="FAQ" title="Answers to common questions" subtitle="Have something else? Reach out and we’ll get right back to you." />
          <div className="mt-6 grid lg:grid-cols-2 gap-4">
            {faqs.map((f, i) => (
              <motion.div key={f.q} {...fadeUp}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className={`w-full text-left p-5 rounded-2xl ${glass}`}>
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{f.q}</div>
                    <ChevronRight className={`h-5 w-5 transition-transform ${openFaq === i ? 'rotate-90' : ''}`}/>
                  </div>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.p initial={{height:0, opacity:0}} animate={{height:'auto', opacity:1}} exit={{height:0, opacity:0}} className="text-sm text-white/70 mt-3">
                        {f.a}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function AboutPage(){
  return (
    <section id="about" className="pt-16 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="About us" title="Who we are" subtitle="A senior team of product engineers, data practitioners, and designers who ship business outcomes—not just demos." />
        <div className="mt-8 grid lg:grid-cols-2 gap-6 items-stretch">
          <motion.div {...fadeUp} className={`p-6 rounded-2xl ${glass} sheen`}>
            <h3 className="font-semibold">Our mission</h3>
            <p className="text-white/70 text-sm mt-2">Make AI useful for every operator by turning messy workflows into reliable automations. We believe good automation feels invisible—things just get easier.</p>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-blue-300 mt-0.5"/> Outcome-driven roadmaps</li>
              <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-blue-300 mt-0.5"/> Security-minded delivery</li>
              <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-blue-300 mt-0.5"/> Pragmatic, vendor-agnostic advice</li>
            </ul>
          </motion.div>
          <motion.div {...fadeUp} className={`p-6 rounded-2xl ${glass} sheen`}>
            <h3 className="font-semibold">How we work</h3>
            <p className="text-white/70 text-sm mt-2">We start from your metrics, then design agents and automations that measurably move them. We ship quickly, monitor, and iterate with you.</p>
            <div className="mt-4 grid sm:grid-cols-3 gap-3 text-sm">
              {[{label:"Avg. pilot",value:"3 weeks"},{label:"Support",value:"SLA"},{label:"Coverage",value:"24/7"}].map((s)=> (
                <div key={s.label} className={`rounded-xl p-3 ${glass}`}>
                  <div className="text-white/60">{s.label}</div>
                  <div className="font-semibold">{s.value}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ContactPage(){
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const FORM_ENDPOINT = "https://formspree.io/f/yourid"; // TODO: replace with your Formspree form ID

  async function onSubmit(e:any){
    e.preventDefault();
    setStatus("loading");
    const data = new FormData(e.currentTarget);
    try {
      const r = await fetch(FORM_ENDPOINT, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } });
      if (r.ok) { setStatus("success"); e.currentTarget.reset(); }
      else { setStatus("error"); }
    } catch { setStatus("error"); }
  }

  return (
    <section id="contact" className="pt-16 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Contact" title="Tell us about your project" subtitle="Share a few details and we’ll propose a pilot in 24–48 hours." />
        <div className="mt-8 grid lg:grid-cols-3 gap-6">
          <motion.form {...fadeUp} onSubmit={onSubmit} className={`lg:col-span-2 p-6 rounded-2xl ${glass}`}>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Name" id="name" placeholder="Jane Doe" required />
              <Field label="Work email" id="email" type="email" placeholder="jane@company.com" required />
              <Field label="Company" id="company" placeholder="Acme Inc." />
              <Field label="Phone" id="phone" type="tel" placeholder="+1 (555) 000-0000" />
              <div className="md:col-span-2">
                <Field label="Project goals" id="message" placeholder="What do you want to automate?" textarea required />
              </div>
            </div>
            <input type="hidden" name="source" value="easebot.ai" />
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button disabled={status==="loading"} type="submit" className="rounded-2xl px-5 py-3 font-semibold bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 transition-colors shadow-xl flex items-center gap-2">
                <Rocket className="h-5 w-5" /> {status==="loading"?"Sending…":"Request proposal"}
              </button>
              {status==="success" && <span className="text-sm text-emerald-300">Thanks! We&apos;ll be in touch shortly.</span>}
              {status==="error" && <span className="text-sm text-rose-300">Something went wrong. Please email <a className="underline" href="mailto:hello@easebot.ai">hello@easebot.ai</a>.</span>}
              <a href="mailto:hello@easebot.ai" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white">
                <Mail className="h-4 w-4"/> hello@easebot.ai
              </a>
              <a href="tel:+15550000000" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white">
                <Phone className="h-4 w-4"/> +1 (555) 000-0000
              </a>
            </div>
          </motion.form>

          <motion.div {...fadeUp} className={`p-6 rounded-2xl ${glass}`}>
            <h3 className="font-semibold">What’s included</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              {["Discovery workshop","Solution design","Build & QA","Launch support","Training & docs"].map((i)=>(
                <li key={i} className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-blue-300 mt-0.5"/> {i}</li>
              ))}
            </ul>
            <h3 className="font-semibold mt-6">Office</h3>
            <p className="text-sm text-white/70 mt-1">123 Gradient Ave, Suite 42<br/>New York, NY 10001</p>
            <div className="mt-4 flex items-center gap-3">
              <a href="#" aria-label="LinkedIn" className="p-2 rounded-lg bg-white/10 hover:bg-white/20"><Linkedin className="h-4 w-4"/></a>
              <a href="#" aria-label="Twitter" className="p-2 rounded-lg bg-white/10 hover:bg-white/20"><Twitter className="h-4 w-4"/></a>
              <a href="#" aria-label="GitHub" className="p-2 rounded-lg bg-white/10 hover:bg-white/20"><Github className="h-4 w-4"/></a>
            </div>
            <div className="mt-6 rounded-xl p-3 bg-white/5 border border-white/10 text-xs text-white/60">
              <p>By submitting, you agree to our <a className="underline hover:text-white" href="#">Terms</a> and <a className="underline hover:text-white" href="#">Privacy Policy</a>.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SiteFooter({year}:{year:number}){
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className={`flex items-center gap-3 ${glass} rounded-xl p-3`}>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 grid place-items-center">
              <Bot className="h-5 w-5" />
            </div>
            <span className="font-semibold tracking-tight">easebot<span className="text-blue-400">.ai</span></span>
          </div>
          <p className="text-white/60 mt-3 max-w-xs">AI automation company based in NYC. We build chatbot and workflow systems that deliver measurable ROI fast.</p>
        </div>
        <div>
          <div className="font-semibold text-white/90">Company</div>
          <ul className="mt-3 space-y-2 text-white/60">
            <li><a href={`#${routes.ABOUT}`} className="hover:text-white">About</a></li>
            <li><a href={`#${routes.HOME}#process`} className="hover:text-white">Process</a></li>
            <li><a href={`#${routes.HOME}#pricing`} className="hover:text-white">Pricing</a></li>
            <li><a href={`#${routes.CONTACT}`} className="hover:text-white">Contact</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-white/90">Legal</div>
          <ul className="mt-3 space-y-2 text-white/60">
            <li><a href="#" className="hover:text-white">Privacy</a></li>
            <li><a href="#" className="hover:text-white">Terms</a></li>
            <li><a href="#" className="hover:text-white">Security</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-white/90">Newsletter</div>
          <form onSubmit={(e)=>{e.preventDefault(); alert('Subscribed!');}} className={`mt-3 flex gap-2 ${glass} rounded-xl p-2`}>
            <input type="email" required placeholder="Work email" className="flex-1 rounded-xl bg-white/10 border border-white/10 px-3 py-2 placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <button className="rounded-xl px-4 py-2 font-medium bg-gradient-to-br from-blue-500 to-cyan-500">Join</button>
          </form>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10 text-xs text-white/50">© {year} easebot.ai. All rights reserved.</div>
    </footer>
  );
}

function SectionHeader({ eyebrow, title, subtitle }:{eyebrow:string, title:string, subtitle?:string}){
  return (
    <div className="text-center max-w-3xl mx-auto">
      <div className="text-xs uppercase tracking-[0.2em] text-blue-200">{eyebrow}</div>
      <h2 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-3 text-white/70">{subtitle}</p>}
    </div>
  );
}

function Field({ label, id, placeholder, type = 'text', textarea = false, required=false }:{
  label:string, id:string, placeholder?:string, type?:string, textarea?:boolean, required?:boolean
}){
  return (
    <label htmlFor={id} className="block text-sm">
      <span className="text-white/80">{label}</span>
      {textarea ? (
        <textarea name={id} id={id} required={required} placeholder={placeholder}
          className="mt-2 w-full min-h-[120px] rounded-xl bg-white/10 border border-white/10 px-3 py-2 placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      ) : (
        <input name={id} id={id} type={type} required={required} placeholder={placeholder}
          className="mt-2 w-full rounded-xl bg-white/10 border border-white/10 px-3 py-2 placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      )}
    </label>
  );
}

/* === Decorative bits === */
function Decor(){
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute -top-24 -right-24 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/10 blur-3xl" />
    </div>
  );
}

function HeroCard(){
  return (
    <div className={`p-6 rounded-2xl ${glass} sheen`}>
      <div className="text-sm text-white/70">Plug-and-play building blocks</div>
      <ul className="mt-3 space-y-2 text-sm text-white/80">
        <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-blue-300 mt-0.5"/> Chatbots: support, sales, onboarding</li>
        <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-blue-300 mt-0.5"/> Workflows: RPA + agent tools</li>
        <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-blue-300 mt-0.5"/> Integrations: CRMs, help desks, data</li>
        <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-blue-300 mt-0.5"/> Analytics: attribution & QA</li>
      </ul>
      <div className="mt-6 rounded-xl p-3 bg-white/5 border border-white/10 text-xs text-white/60">
        <p>Security first: SSO, RBAC, audit logs, PII redaction, and data residency options.</p>
      </div>
    </div>
  );
}
