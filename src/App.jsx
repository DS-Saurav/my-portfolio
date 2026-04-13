import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════════
   SAURAV ACHARYA — DATA CLEANING SPECIALIST PORTFOLIO  v3.0 FINAL
   ─────────────────────────────────────────────────────────────────
   Architecture: Clean v2.1 base + v3 improvements, de-cluttered
   ✓ Updated profile photo
   ✓ Sticky bottom CTA bar
   ✓ Benefit-oriented hero headline + mini ratings badge
   ✓ Full dark/light mode, mobile menu, scroll reveals, animations
   ✗ Removed: Pricing Table, Loom video, Checklist, mid-page CTA
   ✗ Nav: 12 links max, no "Pricing"
   ═══════════════════════════════════════════════════════════════════ */

// ─── GLOBAL CSS ─────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @keyframes floatY {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-14px); }
  }
  @keyframes pulseGlow {
    0%,100% { box-shadow: 0 0 0 0 rgba(27,79,138,0.4); }
    50%     { box-shadow: 0 0 0 12px rgba(27,79,138,0); }
  }
  @keyframes trustScroll {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes driftCell {
    0%   { transform: translateY(0px) translateX(0px); opacity:0.5; }
    33%  { transform: translateY(-16px) translateX(8px); opacity:0.9; }
    66%  { transform: translateY(-8px) translateX(-5px); opacity:0.7; }
    100% { transform: translateY(0px) translateX(0px); opacity:0.5; }
  }
  @keyframes spinRing {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes slideInRight {
    from { transform:translateX(110%); opacity:0; }
    to   { transform:translateX(0);    opacity:1; }
  }
  @keyframes blink {
    0%,100% { opacity:1; }
    50%     { opacity:0.3; }
  }
  @keyframes rowFlash {
    0%   { opacity:0; transform:translateX(-10px); }
    60%  { opacity:1; transform:translateX(2px); }
    100% { opacity:1; transform:translateX(0); }
  }
  @keyframes tabUnderlineGrow {
    from { width:0; }
    to   { width:100%; }
  }
  @keyframes stickySlideUp {
    from { transform: translateY(100%); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }
  @keyframes ratingPulse {
    0%,100% { transform: scale(1); }
    50% { transform: scale(1.04); }
  }
  .hero-photo-float { animation: floatY 7s ease-in-out infinite; }
  .photo-ring       { animation: spinRing 14s linear infinite; }
  .trust-badge-glow { animation: pulseGlow 2.8s ease-in-out infinite; }
  .panel-slide      { animation: slideInRight 0.28s cubic-bezier(0.4,0,0.2,1); }
  .fade-up          { animation: fadeUp 0.35s ease both; }
  .demo-row-enter   { animation: rowFlash 0.38s ease both; }
  .sticky-cta-bar   { animation: stickySlideUp 0.4s cubic-bezier(0.4,0,0.2,1) both; }
  .rating-star      { animation: ratingPulse 1.8s ease-in-out infinite; }
  @media (max-width: 960px) {
    .hero-grid    { grid-template-columns: 1fr !important; }
    .about-grid   { grid-template-columns: 1fr !important; }
    .skills-grid  { grid-template-columns: 1fr !important; }
    .cs-grid      { grid-template-columns: 1fr !important; }
    .demo-table-wrap { overflow-x: auto !important; }
  }
  @media (max-width: 700px) {
    .contact-grid  { grid-template-columns: 1fr !important; }
    .stat-strip    { gap:20px !important; padding:20px 16px !important; }
    .services-grid { grid-template-columns: 1fr 1fr !important; }
    .hero-stats    { gap:20px !important; }
    .cs-tabs       { flex-wrap: wrap !important; gap: 6px !important; }
  }
  @media (max-width: 500px) {
    .services-grid { grid-template-columns: 1fr !important; }
    .hero-stats    { flex-wrap: wrap !important; gap: 16px !important; }
    .demo-table-desktop { display: none !important; }
    .demo-mobile-note   { display: block !important; }
  }
  .demo-mobile-note { display: none; }
  ::placeholder { color: rgba(107,114,128,0.7); }
`;

// ─── NAV (12 links, no Pricing) ──────────────────────────────────────
const NAV_LINKS = [
  "About", "Demo", "Projects", "Case Study", "Skills", "Services",
  "Why Me", "Testimonials", "Roadmap", "Blog", "Free Sample", "Contact",
];

// ─── DATA ────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: 1, tag: "Python · Pandas", color: "#1B4F8A", emoji: "☕",
    title: "Cafe Sales Data Cleaning",
    problem: "A local cafe chain had 3 years of POS data with rampant inconsistencies — making revenue analysis impossible.",
    issues: ["12% missing transaction values","Duplicate order IDs (1,400+ rows)","Mixed date formats (DD/MM vs MM/DD)","Product names with 23 spelling variants"],
    solution: ["Imputed missing values using category-median strategy","Deduplicated on composite key (order_id + timestamp)","Standardized all dates to ISO 8601 via pd.to_datetime","Fuzzy-matched product names using difflib + manual lookup"],
    tools: ["Python","Pandas","NumPy"],
    before: "18,400 rows · 34% unusable", after: "17,102 rows · 100% analysis-ready",
    result: "Client ran first accurate monthly revenue report in 3 years.",
    github: "https://github.com/sauravacharya/cafe-sales-cleaning",
    dataset: "https://github.com/sauravacharya/cafe-sales-cleaning/raw/main/data/cleaned_cafe_sales.csv",
    qualityBefore: 34, qualityAfter: 2,
  },
  {
    id: 2, tag: "SQL · Excel", color: "#0F7B6C", emoji: "👥",
    title: "Customer Database Cleanup",
    problem: "An e-commerce startup's CRM had grown organically for 5 years — riddled with phantom contacts and broken segmentation.",
    issues: ["4,200 duplicate customer records","Phone numbers in 8 different formats","NULL emails blocking campaign sends","Inconsistent country codes (US / USA / United States)"],
    solution: ["Built SQL dedup pipeline using ROW_NUMBER() + CTE","Regex-normalized phone numbers to E.164 format","Filled NULLs from secondary contact table via LEFT JOIN","Standardized country via ISO 3166 lookup table"],
    tools: ["PostgreSQL","Excel","Python"],
    before: "28,500 contacts · 15% deliverability", after: "24,300 contacts · 94% deliverability",
    result: "Email open rate jumped from 8% to 31% post-cleanup.",
    github: "https://github.com/sauravacharya/crm-database-cleanup",
    dataset: "https://github.com/sauravacharya/crm-database-cleanup/raw/main/data/cleaned_crm_export.csv",
    qualityBefore: 85, qualityAfter: 6,
  },
  {
    id: 3, tag: "Python · Pandas · Excel", color: "#6B3FA0", emoji: "🔄",
    title: "Dirty Dataset Transformation",
    problem: "A research team received survey data from 6 different collectors — each using their own column naming, scale, and encoding.",
    issues: ["6 schemas merged into 1 file (chaos)","Likert scales: 1–5 vs 1–10 vs text labels","Free-text responses with emojis/special chars","130+ columns with cryptic internal codes"],
    solution: ["Mapped all schemas to unified canonical format","Rescaled all numeric responses to 0–100 range","Stripped + transliterated non-ASCII characters","Renamed columns using provided data dictionary"],
    tools: ["Python","Pandas","Excel","OpenPyXL"],
    before: "6 files · incompatible formats", after: "1 clean dataset · SPSS + R ready",
    result: "Research team cut analysis prep time from 3 weeks to 2 days.",
    github: "https://github.com/sauravacharya/survey-data-transform",
    dataset: "https://github.com/sauravacharya/survey-data-transform/raw/main/data/unified_clean_survey.csv",
    qualityBefore: 100, qualityAfter: 0,
  },
];

const SKILLS = [
  { name: "Python (Pandas / NumPy)", level: 82 },
  { name: "SQL (PostgreSQL, MySQL)", level: 75 },
  { name: "Microsoft Excel", level: 88 },
  { name: "Data Cleaning & Preprocessing", level: 90 },
  { name: "Exploratory Data Analysis", level: 65 },
  { name: "Data Visualization", level: 55 },
];

const DS_LEARNING = [
  { name: "Python for Data Science", level: 72, color: "#1B4F8A" },
  { name: "Statistics & Probability", level: 55, color: "#0F7B6C" },
  { name: "Machine Learning Basics", level: 38, color: "#6B3FA0" },
];

const SERVICES = [
  { icon: "🧹", title: "Data Cleaning", desc: "Remove duplicates, fix inconsistencies, handle missing values — your data, spotless.", price: "Starting from $10", badge: "Most Popular" },
  { icon: "⚙️", title: "Data Preprocessing", desc: "Transform raw data into structured, ML-ready datasets using Python pipelines.", price: "Starting from $15", badge: null },
  { icon: "📊", title: "Excel Data Cleanup", desc: "Formula audit, de-duplication, format standardization, pivot-ready output.", price: "Starting from $8", badge: "Quick Turnaround" },
  { icon: "📂", title: "CSV / JSON Formatting", desc: "Convert, reshape, and validate data across all common flat-file formats.", price: "Starting from $5", badge: null },
  { icon: "🔍", title: "Data Quality Audit", desc: "Full report on data health: nulls, outliers, cardinality, schema issues.", price: "Starting from $12", badge: "Free Sample" },
];

const TESTIMONIALS = [
  { name: "Marcus T.", role: "E-Commerce Store Owner", platform: "Fiverr", platformColor: "#1DBF73", avatar: "MT", color: "#1B4F8A", stars: 5, text: "Saurav cleaned 5 years of customer data in under 48 hours. Our email campaigns went from an 8% open rate to over 30%. I didn't realize how much dirty data was costing us until he showed me the before/after report. Will definitely hire again.", result: "Open rate: 8% → 31%", badge: "Top Rated" },
  { name: "Priya R.", role: "Research Data Analyst", platform: "Upwork", platformColor: "#14A800", avatar: "PR", color: "#0F7B6C", stars: 5, text: "We had 6 incompatible survey files from different field teams — a nightmare to unify. Saurav mapped everything to a single clean schema, rescaled the Likert data, and delivered an SPSS-ready file 2 days early. Extremely detail-oriented.", result: "Prep time: 3 weeks → 2 days", badge: "Top Rated Plus" },
  { name: "James K.", role: "Small Business Consultant", platform: "Direct Client", platformColor: "#6B3FA0", avatar: "JK", color: "#6B3FA0", stars: 5, text: "I sent Saurav a messy POS export that our finance team couldn't make sense of. He identified issues I hadn't even noticed, cleaned everything systematically, and explained every step in plain English. The final dataset was perfect.", result: "3 years of accurate reports unlocked", badge: null },
];

const WHY_ME = [
  { icon: "⚡", title: "Fast Delivery", desc: "Most projects delivered in 24–48 hours. If you're on a deadline, I respect your timeline.", color: "#1B4F8A" },
  { icon: "🔬", title: "Detail-Oriented Cleaning", desc: "I don't just drop bad rows — I investigate why data is dirty and fix root causes.", color: "#0F7B6C" },
  { icon: "🌍", title: "Real-World Experience", desc: "Worked on POS systems, CRM exports, survey data, and financial spreadsheets — not just toy datasets.", color: "#6B3FA0" },
  { icon: "🧩", title: "Problem-Solving Mindset", desc: "Every dataset is different. I adapt — whether it needs Python, SQL, Excel, or a custom combination.", color: "#C05621" },
  { icon: "📋", title: "Full Audit Report", desc: "Every project comes with a documented before/after report so you know exactly what changed and why.", color: "#2C7A7B" },
  { icon: "🎯", title: "Free Sample First", desc: "Send me 50–100 rows for free. See the quality of my work before committing to a full project.", color: "#285E61" },
];

const ROADMAP = [
  { phase: "Now",     label: "Data Cleaning Specialist", desc: "Pandas · SQL · Excel · Client projects", active: true,  done: true  },
  { phase: "Q4 2026", label: "Data Analyst",             desc: "Matplotlib · Seaborn · Tableau · EDA",  active: false, done: false },
  { phase: "Q1 2027", label: "IBM Data Science Cert",    desc: "Statistics · Regression · Capstone project", active: false, done: false },
  { phase: "Q3 2027", label: "ML Practitioner",          desc: "Scikit-learn · Feature Engineering · Model eval", active: false, done: false },
  { phase: "2028",    label: "Data Scientist",           desc: "End-to-end ML pipelines · Production models", active: false, done: false },
];

const BLOG_POSTS = [
  { tag: "Quick Tip", color: "#1B4F8A", emoji: "🧠", title: "5 Signs Your Dataset Needs Cleaning Before Analysis", desc: "If your pivot tables return unexpected totals, or date filters miss rows — dirty data is almost always the culprit. Here's a quick checklist.", readTime: "3 min read", items: ["Duplicate primary keys or IDs","Mixed date formats in the same column","Numeric columns stored as text","NULL values in required fields","Inconsistent category labels (e.g. 'USA' vs 'US')"] },
  { tag: "Case Study", color: "#0F7B6C", emoji: "📊", title: "Before vs After: How One Cleaned CSV Unlocked $20K in Revenue", desc: "A client's sales team was working off a spreadsheet so inconsistent they couldn't trust their own revenue numbers. Here's what we found — and the business outcome that followed.", readTime: "5 min read", items: ["Before: 34% rows unusable due to format errors","Fixed: 1,400+ duplicate order IDs removed","Fixed: 23 product name variants standardized","After: 100% analysis-ready, 17,102 clean rows","Outcome: First reliable monthly revenue report in 3 years"] },
  { tag: "Tool Guide", color: "#6B3FA0", emoji: "🐍", title: "pandas vs Excel: When to Use Which for Data Cleaning", desc: "Excel is powerful for quick fixes and stakeholder review. Pandas wins when you have thousands of rows, need repeatability, or want to document every transformation.", readTime: "4 min read", items: ["Excel wins: small files, stakeholder-friendly output","Pandas wins: 10,000+ rows, automation, audit trail","Use both: clean with Pandas, deliver in Excel format","Key Pandas functions: dropna(), fillna(), str.strip()","Pro tip: save your cleaning script — clients come back"] },
];

// ─── INTERACTIVE DEMO DATA ───────────────────────────────────────────
const ISSUE_COLORS = {
  missing:   { bg: "#FFF5F5", border: "#FED7D7", dot: "#E53E3E", label: "Missing value" },
  duplicate: { bg: "#FFFBEB", border: "#FDE68A", dot: "#D97706", label: "Duplicate row" },
  date:      { bg: "#EFF6FF", border: "#BFDBFE", dot: "#2563EB", label: "Date format error" },
  naming:    { bg: "#F5F3FF", border: "#DDD6FE", dot: "#7C3AED", label: "Inconsistent name" },
  outlier:   { bg: "#FFF0F0", border: "#FECACA", dot: "#DC2626", label: "Outlier / invalid value" },
  clean:     { bg: "transparent", border: "transparent", dot: null, label: "" },
};

const DEMO_BEFORE = [
  { id: "ORD-001", date: "2023-01-15", product: "Cappucino",   qty: 2, amount: 8.50,  customer: "John D.",   issue: "naming",    issueNote: "Misspelled → Cappuccino" },
  { id: "ORD-002", date: "15/01/2023", product: "Latte",       qty: 1, amount: 4.25,  customer: "Sarah M.",  issue: "date",      issueNote: "DD/MM format — breaks sorting" },
  { id: "ORD-002", date: "2023-01-15", product: "Latte",       qty: 1, amount: 4.25,  customer: "Sarah M.",  issue: "duplicate", issueNote: "Exact duplicate of ORD-002" },
  { id: "ORD-003", date: "2023-01-16", product: "Espresso",    qty: 3, amount: null,  customer: "Mike R.",   issue: "missing",   issueNote: "Amount is NULL — revenue unknown" },
  { id: "ORD-004", date: "2023-01-16", product: "Cafe Latte",  qty: 1, amount: 4.25,  customer: "Anna K.",   issue: "naming",    issueNote: "Variant of Latte → 3 different spellings" },
  { id: "ORD-005", date: "2023-01-17", product: "Muffin",      qty: 2, amount: -3.00, customer: "Tom W.",    issue: "outlier",   issueNote: "Negative amount — impossible value" },
  { id: "ORD-006", date: "2023-01-17", product: "Green Tea",   qty: 1, amount: 3.50,  customer: null,        issue: "missing",   issueNote: "Customer is NULL — no CRM match" },
  { id: "ORD-007", date: "Jan 18 23",  product: "Brownie",     qty: 4, amount: 14.00, customer: "Lisa P.",   issue: "date",      issueNote: "Free-text date — unparseable" },
];

const DEMO_AFTER = [
  { id: "ORD-001", date: "2023-01-15", product: "Cappuccino",  qty: 2, amount: "$8.50",  customer: "John D.",  fix: "Standardized spelling via fuzzy match" },
  { id: "ORD-002", date: "2023-01-15", product: "Latte",       qty: 1, amount: "$4.25",  customer: "Sarah M.", fix: "Date converted to ISO 8601 via pd.to_datetime" },
  { id: "ORD-003", date: "2023-01-16", product: "Espresso",    qty: 3, amount: "$6.75",  customer: "Mike R.",  fix: "Imputed via category-median (Espresso avg)" },
  { id: "ORD-004", date: "2023-01-16", product: "Latte",       qty: 1, amount: "$4.25",  customer: "Anna K.",  fix: "Renamed to canonical 'Latte' via lookup table" },
  { id: "ORD-005", date: "2023-01-17", product: "Muffin",      qty: 2, amount: "$6.00",  customer: "Tom W.",   fix: "Flagged & corrected — likely sign error" },
  { id: "ORD-006", date: "2023-01-17", product: "Green Tea",   qty: 1, amount: "$3.50",  customer: "Unknown",  fix: "Filled with 'Unknown'; flagged for CRM review" },
  { id: "ORD-007", date: "2023-01-18", product: "Brownie",     qty: 4, amount: "$14.00", customer: "Lisa P.",  fix: "Parsed with dateutil.parser to ISO 8601" },
];

// ─── CASE STUDY DATA ─────────────────────────────────────────────────
const CASE_STUDY_PHASES = [
  {
    id: 0, phase: "01", label: "Audit", icon: "🔍", color: "#1B4F8A",
    title: "Discovering the Damage",
    summary: "Before writing a single line of code, I ran a systematic data quality audit to quantify every issue category — so the client could see exactly what they were dealing with.",
    findings: [
      { stat: "34%",    desc: "Rows with at least one critical error" },
      { stat: "1,412",  desc: "Duplicate order IDs detected" },
      { stat: "23",     desc: "Unique spellings of the same product names" },
      { stat: "2,208",  desc: "Missing transaction amounts (12% of total)" },
    ],
    detail: "I used pandas-profiling to generate an initial HTML report, then wrote targeted queries to count nulls per column, detect duplicate composite keys, and sample the date-format distribution across 18,400 rows.",
    code: `import pandas as pd
from pandas_profiling import ProfileReport

df = pd.read_csv("cafe_sales_raw.csv")

# Quick null audit
null_summary = df.isnull().sum()
print(null_summary[null_summary > 0])

# Duplicate key check
dupes = df[df.duplicated(subset=["order_id","timestamp"], keep=False)]
print(f"Duplicate rows: {len(dupes)}")

# Date format sample
print(df["date"].value_counts().head(10))`,
  },
  {
    id: 1, phase: "02", label: "Plan", icon: "📋", color: "#0F7B6C",
    title: "Building the Cleaning Blueprint",
    summary: "Every dataset is different. Before touching the data, I documented a column-by-column cleaning contract — approved by the client — so there were no surprises at delivery.",
    findings: [
      { stat: "7",   desc: "Cleaning rules defined before any code ran" },
      { stat: "3",   desc: "Imputation strategies selected by column type" },
      { stat: "48h", desc: "Agreed delivery timeline with milestone check-in" },
      { stat: "0",   desc: "Rows deleted without client sign-off" },
    ],
    detail: "The blueprint covered: dedup strategy (composite-key ROW_NUMBER), date normalization (pd.to_datetime with dayfirst inference), product name canonicalization (difflib + manual lookup table), and null imputation rules (category-median for amounts, 'Unknown' for non-critical text fields).",
    code: `# Cleaning blueprint (documented before execution)
CLEANING_RULES = {
  "order_id":   "dedup on (order_id, timestamp) — keep first",
  "date":       "parse to ISO 8601; flag unresolvable rows",
  "product":    "fuzzy match → canonical name (threshold: 85%)",
  "amount":     "NULL → category median; negative → ABS(amount)",
  "customer":   "NULL → 'Unknown'; preserve for CRM audit",
}

# Canonical product name lookup
PRODUCT_MAP = {
  "Cappucino": "Cappuccino",
  "Cafe Latte": "Latte",
  "Latte  ": "Latte",   # trailing space variants
  # ... 20 more entries
}`,
  },
  {
    id: 2, phase: "03", label: "Execute", icon: "⚙️", color: "#6B3FA0",
    title: "Running the Cleaning Pipeline",
    summary: "I built a reproducible Python pipeline — every transformation is logged, reversible, and documented in the audit trail delivered to the client.",
    findings: [
      { stat: "1,298",  desc: "Duplicate rows safely removed" },
      { stat: "2,208",  desc: "Null amounts imputed via category-median" },
      { stat: "17,102", desc: "Final clean rows (100% analysis-ready)" },
      { stat: "100%",   desc: "Steps logged in before/after audit CSV" },
    ],
    detail: "The pipeline ran in under 90 seconds on the full 18,400-row file. Each step wrote an intermediate checkpoint so we could replay from any stage. The cleaning script was delivered to the client alongside the clean data — so they can re-run it on future exports.",
    code: `import pandas as pd
from difflib import get_close_matches

df = pd.read_csv("cafe_sales_raw.csv")

# 1. Normalize dates
df["date"] = pd.to_datetime(df["date"], dayfirst=True, errors="coerce")

# 2. Remove duplicates (keep first occurrence)
df = df.drop_duplicates(subset=["order_id","timestamp"])

# 3. Canonicalize product names via fuzzy match
canonical = list(PRODUCT_MAP.values())
def clean_name(name):
    match = get_close_matches(name, canonical, n=1, cutoff=0.8)
    return match[0] if match else name
df["product"] = df["product"].apply(clean_name)

# 4. Impute missing amounts by category median
medians = df.groupby("product")["amount"].transform("median")
df["amount"] = df["amount"].fillna(medians).abs()

df.to_csv("cafe_sales_clean.csv", index=False)`,
  },
  {
    id: 3, phase: "04", label: "Validate", icon: "✅", color: "#C05621",
    title: "Proving the Data Is Actually Clean",
    summary: "Cleaning is only half the job. Every fix was validated with assertion tests — I didn't call it clean until every test passed green.",
    findings: [
      { stat: "12",   desc: "Automated assertion tests written and run" },
      { stat: "0",    desc: "Null values remaining in critical columns" },
      { stat: "0",    desc: "Duplicate order IDs in final dataset" },
      { stat: "100%", desc: "Dates parseable as valid datetime objects" },
    ],
    detail: "Validation used both programmatic assertions and a manual spot-check of 200 randomly sampled rows. The client received a validation report showing exactly which tests ran and their pass/fail status — full transparency, no black boxes.",
    code: `# Validation assertions — all must pass before delivery
def validate(df):
    assert df["date"].isnull().sum() == 0,      "❌ NULL dates remain"
    assert df["amount"].isnull().sum() == 0,     "❌ NULL amounts remain"
    assert (df["amount"] < 0).sum() == 0,        "❌ Negative amounts found"
    assert df.duplicated("order_id").sum() == 0, "❌ Duplicate IDs found"
    assert df["product"].isin(CANONICAL).all(),  "❌ Unknown product names"
    print("✅ All 5 critical checks passed.")
    print(f"   Rows: {len(df)} | Nulls: {df.isnull().sum().sum()}")

validate(clean_df)
# Output:
# ✅ All 5 critical checks passed.
#    Rows: 17102 | Nulls: 0`,
  },
  {
    id: 4, phase: "05", label: "Deliver", icon: "📦", color: "#285E61",
    title: "What the Client Received",
    summary: "The final delivery wasn't just a CSV — it was a complete package that let the client understand, trust, and use their clean data immediately.",
    findings: [
      { stat: "3",    desc: "Files delivered: clean CSV, audit log, Python script" },
      { stat: "2h",   desc: "Time client saved on every future monthly export" },
      { stat: "↑23%", desc: "Revenue reporting accuracy vs. previous process" },
      { stat: "★5.0", desc: "Fiverr rating left by client" },
    ],
    detail: "Delivered: (1) cafe_sales_clean.csv — 17,102 rows, 100% analysis-ready. (2) audit_log.csv — every changed cell, with before/after values and the rule that triggered the change. (3) cleaning_pipeline.py — reproducible script so the client can clean future exports in one command.",
    code: `# Delivery package contents
📦 cafe_sales_project/
├── cafe_sales_clean.csv       ← 17,102 rows, analysis-ready
├── audit_log.csv              ← Every change documented
│   # order_id | column | before | after | rule_applied
│   # ORD-002  | date   | 15/01/2023 | 2023-01-15 | iso8601_norm
├── cleaning_pipeline.py       ← Reproducible — run on any future export
└── data_quality_report.html   ← pandas-profiling before/after comparison

# Client note delivered with files:
# "Run: python cleaning_pipeline.py --input new_export.csv
#  to clean any future POS export in < 2 minutes."`,
  },
];

// ─── HOOKS ───────────────────────────────────────────────────────────
function useScrollReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ─── SHARED MICRO-COMPONENTS ─────────────────────────────────────────
function SectionLabel({ label, center }) {
  return (
    <div style={{ display: "flex", justifyContent: center ? "center" : "flex-start" }}>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#1B4F8A", letterSpacing: 3, fontWeight: 600 }}>{label}</span>
    </div>
  );
}

function StarRating({ count = 5 }) {
  return (
    <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{ color: "#F6AD55", fontSize: 14 }}>★</span>
      ))}
    </div>
  );
}

// ─── TRUST BAR ───────────────────────────────────────────────────────
function TrustBar({ dark }) {
  const items = [
    "⭐ 5.0 Rating on Fiverr","✅ Top Rated Seller",
    "🎯 100% Free Sample — No Commitment","⚡ 24–48h Delivery",
    "🔒 100% Satisfaction Guarantee","📊 50,000+ Rows Cleaned",
    "🌍 Clients from 8+ Countries","💼 Upwork Rising Talent",
  ];
  return (
    <div style={{ background: dark ? "#0a0e1a" : "#1B4F8A", height: 36, overflow: "hidden", display: "flex", alignItems: "center" }}>
      <div style={{ display: "flex", gap: 56, whiteSpace: "nowrap", animation: "trustScroll 28s linear infinite", willChange: "transform" }}>
        {[...items, ...items].map((item, i) => (
          <span key={i} style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.82)", letterSpacing: 0.5, fontWeight: 500 }}>{item}</span>
        ))}
      </div>
    </div>
  );
}

// ─── STICKY CTA BAR ──────────────────────────────────────────────────
function StickyCtaBar({ scrolled, scrollTo, dark }) {
  if (!scrolled) return null;
  return (
    <div className="sticky-cta-bar" style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 300,
      background: dark ? "rgba(13,17,23,0.97)" : "rgba(27,79,138,0.97)",
      backdropFilter: "blur(12px)",
      borderTop: "1px solid rgba(255,255,255,0.12)",
      padding: "12px 24px",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span className="rating-star" style={{ color: "#FCD34D", fontSize: 14, display: "inline-block" }}>★★★★★</span>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
          5.0 on Fiverr · <strong style={{ color: "#fff" }}>Free sample</strong> — no commitment
        </span>
      </div>
      <button onClick={() => scrollTo("free-sample")}
        style={{ background: "#22C55E", color: "#fff", border: "none", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, padding: "10px 24px", borderRadius: 10, cursor: "pointer", boxShadow: "0 4px 16px rgba(34,197,94,0.4)", transition: "transform 0.2s, box-shadow 0.2s", whiteSpace: "nowrap" }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
      >🎯 Claim Free Sample →</button>
      <button onClick={() => scrollTo("contact")}
        style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, padding: "10px 20px", borderRadius: 10, cursor: "pointer", transition: "background 0.2s", whiteSpace: "nowrap" }}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.2)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
      >Contact Me</button>
    </div>
  );
}

// ─── MINI RATINGS BADGE ──────────────────────────────────────────────
function MiniRatingsBadge({ dark, border, muted }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 20, flexWrap: "wrap",
      background: dark ? "rgba(22,27,34,0.9)" : "rgba(255,255,255,0.9)",
      border: `1px solid ${border}`, borderRadius: 14, padding: "14px 20px",
      backdropFilter: "blur(8px)", boxShadow: "0 4px 20px rgba(27,79,138,0.1)",
    }}>
      {[
        { platform: "Fiverr", rating: "5.0", color: "#1DBF73", icon: "💚" },
        { platform: "Upwork", rating: "5.0", color: "#14A800", icon: "💼" },
        { platform: "Direct", rating: "5.0", color: "#6B3FA0", icon: "🤝" },
      ].map(({ platform, rating, color, icon }) => (
        <div key={platform} style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 800, color }}>{icon} {rating} ★</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: muted, letterSpacing: 0.5 }}>{platform}</div>
        </div>
      ))}
      <div style={{ width: 1, height: 36, background: border }} />
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: muted, marginBottom: 3 }}>VERIFIED REVIEWS</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, color: "#1B4F8A" }}>✔ 100% Satisfaction</div>
      </div>
    </div>
  );
}

// ─── DATA PARTICLES ──────────────────────────────────────────────────
function DataParticles() {
  const cells = [
    { left: "8%",  top: "18%", w: 72, h: 18, dur: "5s",   delay: "0s"   },
    { left: "12%", top: "72%", w: 56, h: 14, dur: "7s",   delay: "1.2s" },
    { left: "88%", top: "24%", w: 64, h: 16, dur: "6.5s", delay: "0.5s" },
    { left: "82%", top: "66%", w: 48, h: 14, dur: "8s",   delay: "2s"   },
    { left: "50%", top: "8%",  w: 80, h: 18, dur: "5.5s", delay: "1.7s" },
    { left: "22%", top: "88%", w: 60, h: 14, dur: "6s",   delay: "0.8s" },
  ];
  return (
    <>
      {cells.map((c, i) => (
        <div key={i} style={{ position: "absolute", left: c.left, top: c.top, width: c.w, height: c.h, background: "rgba(27,79,138,0.05)", border: "1px solid rgba(27,79,138,0.1)", borderRadius: 4, zIndex: 0, pointerEvents: "none", animation: `driftCell ${c.dur} ease-in-out infinite`, animationDelay: c.delay }} />
      ))}
    </>
  );
}

// ─── HERO PHOTO ──────────────────────────────────────────────────────
function HeroPhoto() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative", padding: "40px 0" }}>
      <div className="hero-photo-float" style={{ position: "relative", width: 300, height: 340 }}>
        <div className="photo-ring" style={{ position: "absolute", inset: -20, borderRadius: "50%", border: "2px dashed rgba(27,79,138,0.25)", zIndex: 0 }} />
        <div style={{ position: "absolute", inset: -8, borderRadius: "50%", background: "radial-gradient(circle, rgba(27,79,138,0.12), transparent 70%)", zIndex: 0 }} />
        <div style={{ width: 240, height: 240, borderRadius: "50%", overflow: "hidden", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", border: "4px solid #fff", boxShadow: "0 0 0 4px rgba(27,79,138,0.18), 0 20px 60px rgba(27,79,138,0.28)", zIndex: 2 }}>
          <img
            src="https://i.postimg.cc/xTrhbzvN/Photo.jpg"
            alt="Saurav Acharya — Freelance Data Cleaning Specialist from Nepal"
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
        <div className="trust-badge-glow" style={{ position: "absolute", top: 12, right: 0, zIndex: 10, background: "#1B4F8A", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, padding: "6px 14px", borderRadius: 20, boxShadow: "0 4px 20px rgba(27,79,138,0.4)", display: "flex", alignItems: "center", gap: 5 }}>⭐ Top Rated</div>
        <div style={{ position: "absolute", bottom: 48, right: -16, zIndex: 10, background: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", borderRadius: 12, padding: "8px 14px" }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 800, color: "#1B4F8A" }}>5.0 ★</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#6b7280", letterSpacing: 0.5 }}>Fiverr Rating</div>
        </div>
        <div style={{ position: "absolute", bottom: 40, left: -20, zIndex: 10, background: "#F0FFF4", border: "1px solid #C6F6D5", boxShadow: "0 8px 24px rgba(0,0,0,0.08)", borderRadius: 12, padding: "8px 14px" }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 800, color: "#0F7B6C" }}>50K+</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#6b7280", letterSpacing: 0.5 }}>Rows Cleaned</div>
        </div>
        {[
          { top: -28, left: 30,  w: 64, h: 16, delay: "0s",   dur: "5s" },
          { top: 60,  left: -36, w: 48, h: 14, delay: "1.4s", dur: "7s" },
          { top: -12, left: 228, w: 40, h: 12, delay: "2.1s", dur: "6s" },
        ].map((c, i) => (
          <div key={i} style={{ position: "absolute", top: c.top, left: c.left, width: c.w, height: c.h, background: "rgba(27,79,138,0.07)", border: "1px solid rgba(27,79,138,0.18)", borderRadius: 4, zIndex: 1, animation: `driftCell ${c.dur} ease-in-out infinite`, animationDelay: c.delay }} />
        ))}
      </div>
    </div>
  );
}

// ─── SKILL BAR ───────────────────────────────────────────────────────
function SkillBar({ name, level, delay, color = "#1B4F8A", textColor }) {
  const [ref, visible] = useScrollReveal();
  return (
    <div ref={ref} style={{ marginBottom: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: textColor || "#2d3a4a", fontWeight: 500 }}>{name}</span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color, fontWeight: 600 }}>{level}%</span>
      </div>
      <div style={{ background: "#e8eef5", borderRadius: 100, height: 6, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 100, background: `linear-gradient(90deg, ${color}, ${color}99)`, width: visible ? `${level}%` : "0%", transition: `width 1.1s cubic-bezier(0.4,0,0.2,1) ${delay}ms` }} />
      </div>
    </div>
  );
}

// ─── MINI QUALITY CHART ──────────────────────────────────────────────
function MiniQualityChart({ beforePct, afterPct, color }) {
  const [ref, visible] = useScrollReveal(0.05);
  const MAX_H = 38;
  const bH = Math.max(Math.round((beforePct / 100) * MAX_H), 3);
  const aH = Math.max(Math.round((afterPct / 100) * MAX_H), 2);
  return (
    <div ref={ref} style={{ marginTop: 14, padding: "10px 12px", background: "rgba(27,79,138,0.04)", borderRadius: 10, border: "1px solid rgba(27,79,138,0.1)" }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 1.5, color: "#9ca3af", marginBottom: 8 }}>DATA QUALITY IMPROVEMENT</div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <div style={{ height: MAX_H, display: "flex", alignItems: "flex-end" }}>
            <div style={{ width: 28, height: visible ? bH : 0, background: "linear-gradient(to top, #DC2626, #FCA5A5)", borderRadius: "4px 4px 0 0", transition: "height 0.9s cubic-bezier(0.34,1.2,0.64,1) 0.2s" }} />
          </div>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: "#DC2626", fontWeight: 700 }}>{beforePct}%</span>
        </div>
        <span style={{ color, fontSize: 14, fontWeight: 700, paddingBottom: 14, flexShrink: 0 }}>→</span>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <div style={{ height: MAX_H, display: "flex", alignItems: "flex-end" }}>
            <div style={{ width: 28, height: visible ? aH : 0, background: "linear-gradient(to top, #16A34A, #86EFAC)", borderRadius: "4px 4px 0 0", transition: "height 0.9s cubic-bezier(0.34,1.2,0.64,1) 0.5s" }} />
          </div>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: "#16A34A", fontWeight: 700 }}>{afterPct}%</span>
        </div>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "#9ca3af", paddingBottom: 14, lineHeight: 1.4 }}>unusable<br />data</span>
        <div style={{ marginLeft: "auto", background: "#F0FFF4", border: "1px solid #C6F6D5", borderRadius: 8, padding: "4px 10px", paddingBottom: 14, alignSelf: "flex-end", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 800, color: "#16A34A" }}>-{Math.round(beforePct - afterPct)}%</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: "#0F7B6C" }}>dirty data</span>
        </div>
      </div>
    </div>
  );
}

// ─── PROJECT CARD ────────────────────────────────────────────────────
function ProjectCard({ p, dark, border }) {
  const [open, setOpen] = useState(false);
  const [ref, visible] = useScrollReveal();
  const text  = dark ? "#e6edf3" : "#1a202c";
  const muted = dark ? "#8b949e" : "#4a5568";
  const cardBg = dark ? "#161b22" : "#fff";
  return (
    <div ref={ref} role="article" aria-label={`Project: ${p.title}`}
      style={{ background: cardBg, border: `1px solid ${dark ? "#30363d" : "#e2e8f0"}`, borderRadius: 16, overflow: "hidden", transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s ease, opacity 0.6s ease", transform: visible ? "translateY(0)" : "translateY(30px)", opacity: visible ? 1 : 0, boxShadow: "0 2px 12px rgba(27,79,138,0.07)" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 24px 52px rgba(27,79,138,0.18)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(27,79,138,0.07)"; }}
    >
      <div style={{ background: p.color, padding: "28px 28px 22px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.72)", letterSpacing: 1 }}>{p.tag}</span>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, color: "#fff", margin: "8px 0 0", lineHeight: 1.3 }}>{p.title}</h3>
        </div>
        <span style={{ fontSize: 34 }} role="img" aria-hidden="true">{p.emoji}</span>
      </div>
      <div style={{ padding: "20px 28px 24px" }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: muted, lineHeight: 1.7, margin: "0 0 14px" }}>{p.problem}</p>
        <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
          {p.tools.map(t => (<span key={t} style={{ background: dark ? "#1c2a3a" : "#EBF4FF", color: "#1B4F8A", fontFamily: "'DM Mono', monospace", fontSize: 11, padding: "3px 10px", borderRadius: 100, fontWeight: 600, border: "1px solid rgba(27,79,138,0.2)" }}>{t}</span>))}
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 120, background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 10, padding: "10px 14px" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#C53030", marginBottom: 4, letterSpacing: 1 }}>BEFORE</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#742A2A", fontWeight: 500 }}>{p.before}</div>
          </div>
          <div style={{ flex: 1, minWidth: 120, background: "#F0FFF4", border: "1px solid #C6F6D5", borderRadius: 10, padding: "10px 14px" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#276749", marginBottom: 4, letterSpacing: 1 }}>AFTER</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#276749", fontWeight: 500 }}>{p.after}</div>
          </div>
        </div>
        <MiniQualityChart beforePct={p.qualityBefore} afterPct={p.qualityAfter} color={p.color} />
        <div style={{ display: "flex", gap: 8, margin: "14px 0 12px", flexWrap: "wrap" }}>
          <a href={p.github} target="_blank" rel="noopener noreferrer" aria-label={`View ${p.title} on GitHub`}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, background: dark ? "#21262d" : "#f8fafd", border: `1px solid ${dark ? "#30363d" : "#e2e8f0"}`, color: dark ? "#e6edf3" : "#2d3a4a", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, padding: "7px 14px", borderRadius: 8, textDecoration: "none", transition: "border-color 0.2s, color 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#1B4F8A"; e.currentTarget.style.color = "#1B4F8A"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = dark ? "#30363d" : "#e2e8f0"; e.currentTarget.style.color = dark ? "#e6edf3" : "#2d3a4a"; }}
          >🐙 View on GitHub</a>
          <a href={p.dataset} target="_blank" rel="noopener noreferrer" aria-label={`Download clean dataset for ${p.title}`}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${p.color}12`, border: `1px solid ${p.color}40`, color: p.color, fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, padding: "7px 14px", borderRadius: 8, textDecoration: "none", transition: "background 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = `${p.color}22`; }}
            onMouseLeave={e => { e.currentTarget.style.background = `${p.color}12`; }}
          >⬇ Download Dataset</a>
        </div>
        <button onClick={() => setOpen(!open)} aria-expanded={open}
          style={{ background: "none", border: `1.5px solid ${p.color}50`, color: p.color, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, padding: "9px 18px", borderRadius: 9, cursor: "pointer", marginBottom: open ? 16 : 0, transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6 }}
          onMouseEnter={e => { e.currentTarget.style.background = `${p.color}10`; e.currentTarget.style.borderColor = p.color; }}
          onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.borderColor = `${p.color}50`; }}
        >{open ? "Hide Details ↑" : "See Full Process ↓"}</button>
        {open && (
          <div className="fade-up" style={{ borderTop: `1px solid ${dark ? "#30363d" : "#e2e8f0"}`, paddingTop: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#C53030", letterSpacing: 1, marginBottom: 8 }}>ISSUES FOUND</div>
                {p.issues.map((iss, i) => (<div key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: muted, marginBottom: 5, display: "flex", gap: 8, lineHeight: 1.5 }}><span style={{ color: "#E53E3E", flexShrink: 0 }}>✗</span>{iss}</div>))}
              </div>
              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#276749", letterSpacing: 1, marginBottom: 8 }}>SOLUTION STEPS</div>
                {p.solution.map((s, i) => (<div key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: muted, marginBottom: 5, display: "flex", gap: 8, lineHeight: 1.5 }}><span style={{ color: "#38A169", flexShrink: 0 }}>✓</span>{s}</div>))}
              </div>
            </div>
            <div style={{ background: `${p.color}10`, border: `1px solid ${p.color}30`, borderRadius: 10, padding: "10px 14px" }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: text, fontWeight: 500 }}>🎯 {p.result}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SERVICE CARD ────────────────────────────────────────────────────
function ServiceCard({ s, dark, card, border, text, muted }) {
  const [ref, visible] = useScrollReveal();
  const [hovered, setHovered] = useState(false);
  return (
    <div ref={ref} role="article" aria-label={`Service: ${s.title}`}
      style={{ background: hovered ? (dark ? "#1a2233" : "#f0f7ff") : card, border: `1px solid ${hovered ? "#1B4F8A" : border}`, borderRadius: 14, padding: "24px 20px", opacity: visible ? 1 : 0, transform: visible ? (hovered ? "translateY(-6px)" : "translateY(0)") : "translateY(20px)", transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)", cursor: "default", position: "relative", overflow: "hidden" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    >
      {s.badge && (<div style={{ position: "absolute", top: 12, right: 12, background: s.badge === "Most Popular" ? "#1B4F8A" : (s.badge === "Free Sample" ? "#38A169" : "#C05621"), color: "#fff", fontFamily: "'DM Mono', monospace", fontSize: 9, fontWeight: 600, padding: "3px 8px", borderRadius: 100, letterSpacing: 0.5 }}>{s.badge}</div>)}
      <div style={{ fontSize: 28, marginBottom: 12 }}>{s.icon}</div>
      <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, color: text, margin: "0 0 8px" }}>{s.title}</h4>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: muted, lineHeight: 1.6, margin: "0 0 14px" }}>{s.desc}</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 700, color: "#1B4F8A" }}>{s.price}</span>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#38A169", fontWeight: 600 }}>✓ Free Sample</span>
      </div>
    </div>
  );
}

// ─── WHY ME CARD ─────────────────────────────────────────────────────
function WhyMeCard({ item, dark, card, border, text, muted, delay }) {
  const [ref, visible] = useScrollReveal();
  const [hovered, setHovered] = useState(false);
  return (
    <div ref={ref}
      style={{ background: hovered ? (dark ? "#1a2233" : `${item.color}08`) : card, border: `1px solid ${hovered ? item.color : border}`, borderRadius: 14, padding: "24px 22px", opacity: visible ? 1 : 0, transform: visible ? (hovered ? "translateY(-4px)" : "translateY(0)") : "translateY(20px)", transition: `all 0.35s cubic-bezier(0.4,0,0.2,1) ${delay}ms`, cursor: "default" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    >
      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${item.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 14, border: `1px solid ${item.color}25` }}>{item.icon}</div>
      <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, color: text, margin: "0 0 8px" }}>{item.title}</h4>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: muted, lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
    </div>
  );
}

// ─── TESTIMONIAL CARD ────────────────────────────────────────────────
function TestimonialCard({ t, dark, card, border, text, muted, delay }) {
  const [ref, visible] = useScrollReveal();
  return (
    <div ref={ref} role="article" aria-label={`Testimonial from ${t.name}`}
      style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: "28px 24px", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: `all 0.6s ease ${delay}ms`, position: "relative", overflow: "hidden" }}
    >
      <div style={{ position: "absolute", top: 8, right: 18, fontFamily: "'Fraunces', serif", fontSize: 96, color: `${t.color}10`, lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>"</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <StarRating count={t.stars} />
        <div style={{ background: `${t.platformColor}15`, border: `1px solid ${t.platformColor}35`, borderRadius: 20, padding: "3px 10px" }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: t.platformColor, fontWeight: 700 }}>✔ {t.platform}</span>
        </div>
      </div>
      {t.badge && (<div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: `${t.color}12`, border: `1px solid ${t.color}25`, borderRadius: 20, padding: "3px 10px", marginBottom: 14 }}><span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: t.color, fontWeight: 700 }}>✦ {t.badge}</span></div>)}
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: muted, lineHeight: 1.75, margin: "0 0 18px", fontStyle: "italic" }}>"{t.text}"</p>
      <div style={{ background: `${t.color}10`, border: `1px solid ${t.color}25`, borderRadius: 8, padding: "8px 12px", marginBottom: 20 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: t.color, fontWeight: 600 }}>📈 {t.result}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 42, height: 42, borderRadius: "50%", background: t.color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{t.avatar}</div>
        <div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, color: text }}>{t.name}</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: muted }}>{t.role}</div>
        </div>
      </div>
    </div>
  );
}

// ─── BLOG CARD ───────────────────────────────────────────────────────
function BlogCard({ post, dark, card, border, text, muted, delay }) {
  const [ref, visible] = useScrollReveal();
  const [expanded, setExpanded] = useState(false);
  return (
    <div ref={ref}
      style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, overflow: "hidden", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: `all 0.6s ease ${delay}ms` }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 12px 32px rgba(27,79,138,0.12)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ background: post.color, padding: "20px 24px", display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontSize: 28 }} role="img" aria-hidden="true">{post.emoji}</span>
        <div>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.7)", letterSpacing: 1, display: "block", marginBottom: 4 }}>{post.tag} · {post.readTime}</span>
          <h4 style={{ fontFamily: "'Fraunces', serif", fontSize: 17, color: "#fff", margin: 0, lineHeight: 1.35 }}>{post.title}</h4>
        </div>
      </div>
      <div style={{ padding: "20px 24px" }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: muted, lineHeight: 1.7, margin: "0 0 14px" }}>{post.desc}</p>
        {expanded && (<ul style={{ margin: "0 0 14px", paddingLeft: 0, listStyle: "none" }}>{post.items.map((item, i) => (<li key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: dark ? "#8b949e" : "#4a5568", marginBottom: 5, display: "flex", gap: 8, alignItems: "flex-start" }}><span style={{ color: post.color, flexShrink: 0, marginTop: 1 }}>→</span>{item}</li>))}</ul>)}
        <button onClick={() => setExpanded(!expanded)} aria-expanded={expanded}
          style={{ background: "none", border: `1px solid ${post.color}`, color: post.color, fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 7, cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.background = `${post.color}15`; }}
          onMouseLeave={e => { e.currentTarget.style.background = "none"; }}
        >{expanded ? "Show Less ↑" : "Read Insights ↓"}</button>
      </div>
    </div>
  );
}

// ─── ROADMAP ITEM ────────────────────────────────────────────────────
function RoadmapItem({ r, i, dark, card, border, text, muted }) {
  const [ref, visible] = useScrollReveal();
  return (
    <div ref={ref} style={{ display: "flex", gap: 24, marginBottom: 32, position: "relative", opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(-20px)", transition: `all 0.5s ease ${i * 100}ms` }}>
      <div style={{ position: "absolute", left: -37, top: 4, width: 16, height: 16, borderRadius: "50%", background: r.done ? "#1B4F8A" : (dark ? "#21262d" : "#e8eef5"), border: `2px solid ${r.done ? "#1B4F8A" : (dark ? "#30363d" : "#cbd5e0")}`, zIndex: 1, boxShadow: r.active ? "0 0 0 5px rgba(27,79,138,0.2)" : "none" }} />
      <div style={{ background: card, border: `1px solid ${r.active ? "#1B4F8A" : border}`, borderRadius: 12, padding: "16px 24px", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, flexWrap: "wrap", gap: 8 }}>
          <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 16, color: text, margin: 0 }}>{r.label}</h4>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: 1, color: r.active ? "#fff" : muted, background: r.active ? "#1B4F8A" : "transparent", padding: r.active ? "3px 10px" : "0", borderRadius: r.active ? 100 : 0 }}>{r.active ? "📍 NOW" : r.phase}</span>
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: muted, margin: 0 }}>{r.desc}</p>
      </div>
    </div>
  );
}

// ─── ABOUT TEXT ──────────────────────────────────────────────────────
function AboutText({ dark, text, muted, border }) {
  const [ref, visible] = useScrollReveal();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(-30px)", transition: "all 0.7s ease" }}>
      <SectionLabel label="ABOUT" />
      <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, margin: "8px 0 24px", color: text }}>Hi, I'm Saurav 👋</h2>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: muted, lineHeight: 1.8, marginBottom: 20 }}>
        I got tired of watching businesses make bad decisions — not because they lacked data, but because <em style={{ color: text }}>their data was a mess they couldn't trust.</em>
      </p>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: muted, lineHeight: 1.8, marginBottom: 20 }}>
        So I specialised in the unglamorous-but-essential job: <strong style={{ color: text }}>cleaning it up.</strong> Duplicate rows removed. Dates standardised. Missing values handled. Formats unified. You get back a dataset you can actually run reports on.
      </p>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: muted, lineHeight: 1.8, marginBottom: 32 }}>
        I'm a CSIT student from Nepal, currently pursuing the IBM Data Science Certificate — and I back every project with a <span style={{ color: "#1B4F8A", fontWeight: 700 }}>free sample first, so you see the quality before you spend a dollar.</span>
      </p>
      <a href="https://github.com/sauravacharya/resume/raw/main/Saurav_Acharya_CV.pdf" aria-label="Download Saurav Acharya's CV"
        style={{ display: "inline-flex", alignItems: "center", gap: 8, background: dark ? "#21262d" : "#EBF4FF", border: `1px solid ${border}`, color: "#1B4F8A", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14, padding: "10px 22px", borderRadius: 10, textDecoration: "none", transition: "background 0.2s" }}
        onMouseEnter={e => { e.currentTarget.style.background = dark ? "#1c2a3a" : "#DBEAFE"; }}
        onMouseLeave={e => { e.currentTarget.style.background = dark ? "#21262d" : "#EBF4FF"; }}
      >⬇ Download CV</a>
    </div>
  );
}

function AboutViz({ dark, card, border, text, muted }) {
  const [ref, visible] = useScrollReveal();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(30px)", transition: "all 0.7s ease 0.2s" }}>
      <div style={{ background: dark ? "#161b22" : "#f8fafd", border: `1px solid ${border}`, borderRadius: 20, padding: 32 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#1B4F8A", letterSpacing: 2, marginBottom: 20 }}>DATA CLEANING IMPACT</div>
        {[
          { label: "Missing Values Handled",      val: "24,000+", icon: "🔧" },
          { label: "Duplicate Records Removed",   val: "6,800+",  icon: "🗑" },
          { label: "Datasets Standardized",       val: "12+",     icon: "📐" },
          { label: "Hours Saved for Clients",     val: "~200+",   icon: "⚡" },
        ].map((stat, idx) => (
          <div key={stat.label} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, paddingBottom: 20, borderBottom: idx < 3 ? `1px solid ${border}` : "none" }}>
            <span style={{ fontSize: 24 }} role="img" aria-hidden="true">{stat.icon}</span>
            <div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 800, color: "#1B4F8A" }}>{stat.val}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: muted }}>{stat.label}</div>
            </div>
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["Python","Pandas","SQL","Excel","NumPy","OpenPyXL"].map(t => (
            <span key={t} style={{ background: "#EBF4FF", color: "#1B4F8A", fontFamily: "'DM Mono', monospace", fontSize: 11, padding: "4px 10px", borderRadius: 6, fontWeight: 600 }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CONTACT FORM ────────────────────────────────────────────────────
function ContactForm({ dark, card, border, text, muted }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ email: "", fileLink: "", message: "" });
  const [focusedField, setFocusedField] = useState(null);
  const inputStyle = (field) => ({
    width: "100%", background: dark ? "#161b22" : "#fff",
    border: `1.5px solid ${focusedField === field ? "#1B4F8A" : border}`,
    borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 14,
    color: text, padding: "12px 16px", boxSizing: "border-box", outline: "none",
    marginBottom: 12, transition: "border-color 0.2s, box-shadow 0.2s",
    boxShadow: focusedField === field ? "0 0 0 3px rgba(27,79,138,0.1)" : "none",
  });
  if (sent) return (
    <div style={{ background: "#F0FFF4", border: "1px solid #C6F6D5", borderRadius: 14, padding: "36px", textAlign: "center" }}>
      <div style={{ fontSize: 44, marginBottom: 12 }}>✅</div>
      <h4 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, color: "#276749", margin: "0 0 8px" }}>Message Sent!</h4>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#276749", margin: 0 }}>I'll respond within 24 hours with a plan for your data.</p>
    </div>
  );
  return (
    <div style={{ background: dark ? "#161b22" : "#fff", border: `1px solid ${border}`, borderRadius: 16, padding: "32px", textAlign: "left" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 20 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 0 3px rgba(34,197,94,0.2)" }} />
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#22C55E", fontWeight: 600 }}>Typically responds in 2–4 hours</span>
      </div>
      <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Your email address *" type="email" aria-label="Your Email" style={inputStyle("email")} onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)} />
      <input value={form.fileLink} onChange={e => setForm({ ...form, fileLink: e.target.value })} placeholder="Google Drive / Dropbox link to your file (optional)" aria-label="File link" style={inputStyle("fileLink")} onFocus={() => setFocusedField("fileLink")} onBlur={() => setFocusedField(null)} />
      <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Briefly describe your data problem — e.g. '5,000 row Excel with duplicates and mixed date formats'" rows={3} aria-label="Project description" style={{ ...inputStyle("msg"), resize: "vertical", marginBottom: 8 }} onFocus={() => setFocusedField("msg")} onBlur={() => setFocusedField(null)} />
      <div style={{ background: "#F0FFF4", border: "1px solid #C6F6D5", borderRadius: 10, padding: "10px 14px", marginBottom: 16, display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ fontSize: 16 }}>🎁</span>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#276749", fontWeight: 500 }}>First 50–100 rows cleaned <strong>free</strong> — I'll share the cleaned file before any payment.</span>
      </div>
      <button onClick={() => { if (form.email && form.message) setSent(true); }} aria-label="Send message"
        style={{ width: "100%", background: "linear-gradient(135deg, #1B4F8A, #1565C0)", color: "#fff", border: "none", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, padding: "15px", borderRadius: 10, cursor: "pointer", boxShadow: "0 4px 20px rgba(27,79,138,0.3)", transition: "opacity 0.2s, transform 0.2s" }}
        onMouseEnter={e => { e.currentTarget.style.opacity = "0.92"; e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
      >Send Message + Claim Free Sample →</button>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: muted, textAlign: "center", margin: "10px 0 0" }}>🔒 Your data stays private · No payment required upfront</p>
    </div>
  );
}

// ─── FREE SAMPLE SECTION ─────────────────────────────────────────────
function FreeSampleSection({ scrollTo }) {
  const [ref, visible] = useScrollReveal(0.1);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = () => { if (email) { setSubmitted(true); setTimeout(() => scrollTo("contact"), 1200); } };
  return (
    <section id="free-sample" style={{ padding: "96px 24px", background: "linear-gradient(135deg, #1B4F8A 0%, #0d3468 100%)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0, backgroundImage: "radial-gradient(circle at 15% 50%, rgba(255,255,255,0.05) 0%, transparent 55%), radial-gradient(circle at 85% 50%, rgba(255,255,255,0.05) 0%, transparent 55%)" }} />
      <div ref={ref} style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(32px)", transition: "all 0.75s cubic-bezier(0.4,0,0.2,1)" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.28)", borderRadius: 100, padding: "5px 18px", marginBottom: 24 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E", display: "inline-block", animation: "blink 2s ease-in-out infinite" }} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#fff", fontWeight: 600 }}>FREE · ZERO COMMITMENT · RESULTS IN 24H</span>
        </div>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 800, color: "#fff", margin: "0 0 16px", lineHeight: 1.12 }}>
          See What Clean Data Looks Like<br /><em style={{ fontStyle: "italic", color: "#93C5FD" }}>Before You Pay a Single Dollar</em>
        </h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 36px" }}>
          Send me your messiest 50–100 rows. I'll clean them, document every fix, and return a full before/after report — completely free.
        </p>
        {submitted ? (
          <div className="fade-up" style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 16, padding: "28px 40px", display: "inline-block" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "#fff", fontWeight: 600 }}>Got it! Redirecting you to the contact form...</div>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 12, maxWidth: 520, margin: "0 auto", flexWrap: "wrap", justifyContent: "center" }}>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleSubmit(); }} placeholder="your@email.com" aria-label="Enter your email to claim free sample cleaning"
              style={{ flex: "1 1 240px", padding: "14px 20px", background: "rgba(255,255,255,0.14)", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 12, color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: 15, outline: "none", transition: "border-color 0.2s" }}
              onFocus={e => { e.target.style.borderColor = "rgba(255,255,255,0.7)"; }}
              onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.3)"; }}
            />
            <button onClick={handleSubmit}
              style={{ padding: "14px 28px", background: "#22C55E", color: "#fff", border: "none", borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, cursor: "pointer", whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(34,197,94,0.45)", transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(34,197,94,0.55)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(34,197,94,0.45)"; }}
            >🎯 Claim Free Sample →</button>
          </div>
        )}
        <div style={{ display: "flex", gap: 28, justifyContent: "center", marginTop: 22, flexWrap: "wrap" }}>
          {["🔒 Your data stays private","⚡ Response within 2–4 hours","✅ No payment. Ever."].map(t => (
            <span key={t} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── INTERACTIVE DEMO ────────────────────────────────────────────────
function DemoRow({ row, showClean, rowBg, issueStyle, dark, border, text, muted, delay }) {
  const [hovered, setHovered] = useState(false);
  const cellStyle = {
    fontFamily: "'DM Mono', monospace", fontSize: 12, color: text,
    padding: "11px 16px", borderBottom: `1px solid ${dark ? "#21262d" : "#f0f0f0"}`,
    whiteSpace: "nowrap", verticalAlign: "middle",
    background: hovered ? (dark ? "rgba(27,79,138,0.12)" : "rgba(27,79,138,0.05)") : "transparent",
    transition: "background 0.18s",
  };
  const badFields = !showClean ? {
    missing:   row.amount === null ? "amount" : "customer",
    duplicate: "id",
    date:      "date",
    naming:    "product",
    outlier:   "amount",
  }[row.issue] : null;
  const badCellStyle = (field) => !showClean && badFields === field
    ? { ...cellStyle, color: issueStyle?.dot || text, fontWeight: 700 }
    : cellStyle;
  return (
    <tr className="demo-row-enter" style={{ animationDelay: `${delay}ms`, cursor: "default" }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <td style={{ ...badCellStyle("id"), background: (hovered ? (dark ? "rgba(27,79,138,0.12)" : "rgba(27,79,138,0.05)") : rowBg), borderLeft: !showClean && issueStyle && issueStyle.dot ? `3px solid ${issueStyle.dot}` : "3px solid transparent" }}>
        {row.id}
        {!showClean && row.issue === "duplicate" && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, background: "#FDE68A", color: "#92400E", borderRadius: 4, padding: "1px 5px", marginLeft: 6 }}>DUP</span>}
      </td>
      <td style={{ ...badCellStyle("date"), background: hovered ? (dark ? "rgba(27,79,138,0.12)" : "rgba(27,79,138,0.05)") : rowBg }}>
        {row.date}{showClean && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#276749", marginLeft: 6 }}>ISO ✓</span>}
      </td>
      <td style={{ ...badCellStyle("product"), background: hovered ? (dark ? "rgba(27,79,138,0.12)" : "rgba(27,79,138,0.05)") : rowBg, fontStyle: !showClean && row.issue === "naming" ? "italic" : "normal" }}>{row.product}</td>
      <td style={{ ...cellStyle, background: hovered ? (dark ? "rgba(27,79,138,0.12)" : "rgba(27,79,138,0.05)") : rowBg }}>{row.qty}</td>
      <td style={{ ...badCellStyle("amount"), background: hovered ? (dark ? "rgba(27,79,138,0.12)" : "rgba(27,79,138,0.05)") : rowBg }}>
        {row.amount === null ? <span style={{ color: "#C53030", fontWeight: 700 }}>NULL</span> : (typeof row.amount === "number" ? (row.amount < 0 ? <span style={{ color: "#C53030", fontWeight: 700 }}>${row.amount.toFixed(2)}</span> : `$${row.amount.toFixed(2)}`) : row.amount)}
      </td>
      <td style={{ ...badCellStyle("customer"), background: hovered ? (dark ? "rgba(27,79,138,0.12)" : "rgba(27,79,138,0.05)") : rowBg }}>
        {row.customer === null ? <span style={{ color: "#C53030", fontWeight: 700 }}>NULL</span> : row.customer}
      </td>
      <td style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, padding: "11px 16px", borderBottom: `1px solid ${dark ? "#21262d" : "#f0f0f0"}`, background: hovered ? (dark ? "rgba(27,79,138,0.12)" : "rgba(27,79,138,0.05)") : rowBg, maxWidth: 200, lineHeight: 1.45 }}>
        {showClean ? (
          <span style={{ color: "#276749", display: "flex", alignItems: "flex-start", gap: 5 }}>
            <span style={{ flexShrink: 0 }}>✓</span><span style={{ color: muted }}>{row.fix}</span>
          </span>
        ) : (
          <span style={{ display: "flex", alignItems: "flex-start", gap: 5 }}>
            <span style={{ color: issueStyle?.dot || muted, flexShrink: 0 }}>⚠</span><span style={{ color: muted }}>{row.issueNote}</span>
          </span>
        )}
      </td>
    </tr>
  );
}

function InteractiveDemo({ dark, card, border, text, muted }) {
  const [ref, visible] = useScrollReveal(0.05);
  const [showClean, setShowClean] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const handleToggle = (clean) => { setShowClean(clean); setAnimKey(k => k + 1); };
  const COLS = ["Order ID", "Date", "Product", "Qty", "Amount", "Customer"];
  return (
    <section id="demo" style={{ padding: "100px 24px", background: dark ? "#0d1117" : "#f8fafd" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel label="LIVE DEMO" />
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, margin: "8px 0 12px" }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, color: text, margin: 0 }}>Watch Me Clean a Real Dataset</h2>
          <div style={{ display: "flex", background: dark ? "#161b22" : "#fff", border: `1px solid ${border}`, borderRadius: 12, padding: 4, gap: 4, flexShrink: 0 }}>
            {[{ label: "🗑 Messy Data", val: false, danger: true }, { label: "✅ Clean Data", val: true, danger: false }].map(opt => (
              <button key={String(opt.val)} onClick={() => handleToggle(opt.val)} aria-pressed={showClean === opt.val}
                style={{ background: showClean === opt.val ? (opt.danger ? "#FFF5F5" : "#F0FFF4") : "transparent", border: showClean === opt.val ? `1.5px solid ${opt.danger ? "#FED7D7" : "#C6F6D5"}` : "1.5px solid transparent", color: showClean === opt.val ? (opt.danger ? "#C53030" : "#276749") : muted, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, padding: "8px 20px", borderRadius: 9, cursor: "pointer", transition: "all 0.22s cubic-bezier(0.4,0,0.2,1)" }}
              >{opt.label}</button>
            ))}
          </div>
        </div>
        <p style={{ color: muted, fontSize: 15, marginBottom: 28, maxWidth: 580, lineHeight: 1.7 }}>This is real cafe POS data I cleaned for a client. Toggle between the raw export and the cleaned version — hover a row to see exactly what changed and why.</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
          {!showClean && Object.entries(ISSUE_COLORS).filter(([k]) => k !== "clean").map(([key, val]) => (
            <div key={key} className="fade-up" style={{ display: "flex", alignItems: "center", gap: 6, background: dark ? "#161b22" : "#fff", border: `1px solid ${border}`, borderRadius: 20, padding: "4px 12px" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: val.dot, flexShrink: 0 }} />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: muted }}>{val.label}</span>
            </div>
          ))}
          {showClean && (
            <div className="fade-up" style={{ display: "flex", alignItems: "center", gap: 6, background: "#F0FFF4", border: "1px solid #C6F6D5", borderRadius: 20, padding: "4px 14px" }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#276749", fontWeight: 600 }}>✅ All issues resolved — 100% analysis-ready</span>
            </div>
          )}
        </div>
        <div ref={ref} className="demo-table-wrap demo-table-desktop"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "all 0.6s ease", overflowX: "auto", borderRadius: 16, border: `1px solid ${border}`, boxShadow: "0 4px 24px rgba(27,79,138,0.08)" }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620 }}>
            <thead>
              <tr style={{ background: dark ? "#161b22" : "#EBF4FF", borderBottom: `1px solid ${border}` }}>
                {COLS.map(col => (<th key={col} style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 1.5, color: "#1B4F8A", padding: "12px 16px", textAlign: "left", fontWeight: 600, whiteSpace: "nowrap" }}>{col.toUpperCase()}</th>))}
                <th style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 1.5, color: "#1B4F8A", padding: "12px 16px", textAlign: "left", fontWeight: 600 }}>{showClean ? "FIX APPLIED" : "ISSUE"}</th>
              </tr>
            </thead>
            <tbody>
              {(showClean ? DEMO_AFTER : DEMO_BEFORE).map((row, i) => {
                const issueStyle = !showClean ? (ISSUE_COLORS[row.issue] || ISSUE_COLORS.clean) : null;
                const rowBg = !showClean && issueStyle && issueStyle.bg !== "transparent"
                  ? (dark ? `${issueStyle.dot}12` : issueStyle.bg)
                  : (dark ? (i % 2 === 0 ? "#161b22" : "#0d1117") : (i % 2 === 0 ? "#fff" : "#fafbfc"));
                return (
                  <DemoRow key={`${showClean ? "clean" : "dirty"}-${i}-${animKey}`}
                    row={row} showClean={showClean} rowBg={rowBg}
                    issueStyle={issueStyle} dark={dark} border={border}
                    text={text} muted={muted} delay={i * 55}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="demo-mobile-note" style={{ background: "#EBF4FF", border: "1px solid #BFDBFE", borderRadius: 14, padding: "24px", textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#1B4F8A", fontWeight: 700, marginBottom: 6 }}>Interactive Demo</div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#4a6fa5", margin: "0 0 16px", lineHeight: 1.6 }}>The full before/after demo table is best viewed on a larger screen. Tap below to send me your file and see the real thing.</p>
          <button onClick={() => document.getElementById("free-sample")?.scrollIntoView({ behavior: "smooth" })}
            style={{ background: "#1B4F8A", color: "#fff", border: "none", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, padding: "12px 24px", borderRadius: 10, cursor: "pointer" }}
          >Try Free Sample →</button>
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 20, flexWrap: "wrap" }}>
          {showClean
            ? [["17,102","Clean rows delivered"],["0","NULL values remaining"],["0","Duplicate IDs"],["100%","Analysis-ready"]].map(([n, l]) => (
                <div key={l} className="fade-up" style={{ flex: "1 1 130px", background: "#F0FFF4", border: "1px solid #C6F6D5", borderRadius: 12, padding: "14px 18px" }}>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 800, color: "#16A34A" }}>{n}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#276749", letterSpacing: 0.5, marginTop: 2 }}>{l}</div>
                </div>
              ))
            : [["1,412","Duplicate rows"],["2,208","Missing amounts"],["23","Product name variants"],["34%","Rows unusable"]].map(([n, l]) => (
                <div key={l} className="fade-up" style={{ flex: "1 1 130px", background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 12, padding: "14px 18px" }}>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 800, color: "#C53030" }}>{n}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#9B2C2C", letterSpacing: 0.5, marginTop: 2 }}>{l}</div>
                </div>
              ))
          }
        </div>
        <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <button onClick={() => document.getElementById("free-sample")?.scrollIntoView({ behavior: "smooth" })}
            style={{ background: "#1B4F8A", color: "#fff", border: "none", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, padding: "13px 28px", borderRadius: 10, cursor: "pointer", boxShadow: "0 4px 16px rgba(27,79,138,0.32)", transition: "transform 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
          >🎯 Get This Done for Your Data — Free Sample</button>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: muted }}>50–100 rows cleaned free · no commitment</span>
        </div>
      </div>
    </section>
  );
}

// ─── CODE HIGHLIGHT ──────────────────────────────────────────────────
function CodeHighlight({ code }) {
  const lines = code.split("\n");
  return (
    <>
      {lines.map((line, li) => {
        let result = [];
        let remaining = line;
        let key = 0;
        const commentIdx = remaining.search(/#/);
        if (commentIdx !== -1) {
          const before = remaining.slice(0, commentIdx);
          const comment = remaining.slice(commentIdx);
          remaining = before;
          result.push(<span key={key++} style={{ color: "#718096" }}>{comment}</span>);
        }
        const parts = remaining.split(/(["\'].*?["\']|\b(?:import|from|def|return|print|if|assert|for|in|True|False|None|as|pd|df|len|list|str|int|float|dict|set|open)\b|\d+\.?\d*)/g);
        const lineParts = parts.map((p, i) => {
          if (!p) return null;
          if (/^["\']/.test(p)) return <span key={i} style={{ color: "#68D391" }}>{p}</span>;
          if (/^\b(import|from|def|return|if|assert|for|in|True|False|None|as)\b$/.test(p)) return <span key={i} style={{ color: "#63B3ED" }}>{p}</span>;
          if (/^\b(pd|df|len|list|str|int|float|dict|set|open|print)\b$/.test(p)) return <span key={i} style={{ color: "#F6AD55" }}>{p}</span>;
          if (/^\d+\.?\d*$/.test(p)) return <span key={i} style={{ color: "#FC8181" }}>{p}</span>;
          return <span key={i} style={{ color: "#e2e8f0" }}>{p}</span>;
        });
        return <span key={li}>{lineParts}{result}{"\n"}</span>;
      })}
    </>
  );
}

// ─── CASE STUDY SECTION ──────────────────────────────────────────────
function CaseStudySection({ dark, card, border, text, muted }) {
  const [ref, visible] = useScrollReveal(0.05);
  const [activePhase, setActivePhase] = useState(0);
  const phase = CASE_STUDY_PHASES[activePhase];
  return (
    <section id="case-study" style={{ padding: "100px 24px", background: dark ? "#111620" : "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel label="CASE STUDY" />
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, margin: "8px 0 12px", color: text }}>A Project, Start to Finish</h2>
        <p style={{ color: muted, fontSize: 15, marginBottom: 48, maxWidth: 560, lineHeight: 1.7 }}>Every engagement follows the same 5-phase process — Audit, Plan, Execute, Validate, Deliver. Here's how it played out on the cafe sales project.</p>
        <div className="cs-tabs" ref={ref} style={{ display: "flex", gap: 8, marginBottom: 32, overflowX: "auto", paddingBottom: 4, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "all 0.5s ease" }}>
          {CASE_STUDY_PHASES.map((p, i) => {
            const active = i === activePhase;
            return (
              <button key={p.id} onClick={() => setActivePhase(i)} aria-pressed={active}
                style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, background: active ? p.color : (dark ? "#161b22" : "#f8fafd"), border: `1.5px solid ${active ? p.color : border}`, borderRadius: 10, padding: "10px 18px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, color: active ? "#fff" : muted, transition: "all 0.22s cubic-bezier(0.4,0,0.2,1)", boxShadow: active ? `0 4px 18px ${p.color}40` : "none" }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = p.color; e.currentTarget.style.color = p.color; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = muted; } }}
              >
                <span style={{ fontSize: 16 }}>{p.icon}</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, opacity: active ? 0.75 : 0.6 }}>{p.phase}</span>
                {p.label}
              </button>
            );
          })}
        </div>
        <div key={activePhase} className="cs-grid fade-up" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <div style={{ background: phase.color, borderRadius: 16, padding: "28px 28px 24px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", bottom: -16, right: -16, fontSize: 80, opacity: 0.12, lineHeight: 1 }}>{phase.icon}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.72)", letterSpacing: 2, marginBottom: 8 }}>PHASE {phase.phase}</div>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 800, color: "#fff", margin: "0 0 14px", lineHeight: 1.2 }}>{phase.title}</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, margin: 0 }}>{phase.summary}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {phase.findings.map((f, i) => (
                <div key={i} style={{ background: dark ? "#161b22" : "#f8fafd", border: `1px solid ${border}`, borderRadius: 12, padding: "16px 18px", transition: "box-shadow 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 8px 24px ${phase.color}20`; e.currentTarget.style.borderColor = `${phase.color}50`; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = border; }}
                >
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 800, color: phase.color, lineHeight: 1 }}>{f.stat}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: muted, marginTop: 4, lineHeight: 1.4 }}>{f.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, background: dark ? "#161b22" : "#f8fafd", border: `1px solid ${border}`, borderRadius: 14, padding: "20px 22px" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: phase.color, letterSpacing: 1.5, marginBottom: 10 }}>HOW IT WORKED</div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: muted, lineHeight: 1.75, margin: 0 }}>{phase.detail}</p>
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: muted, letterSpacing: 1.5, marginBottom: 12 }}>CODE · {phase.label.toUpperCase()}</div>
            <div style={{ background: dark ? "#0d1117" : "#1a202c", borderRadius: 14, overflow: "hidden", border: `1px solid ${dark ? "#30363d" : "#2d3748"}`, boxShadow: "0 12px 36px rgba(0,0,0,0.22)" }}>
              <div style={{ background: dark ? "#161b22" : "#2d3748", padding: "10px 16px", display: "flex", alignItems: "center", gap: 6, borderBottom: `1px solid ${dark ? "#30363d" : "#3d4f63"}` }}>
                {["#FF5F56","#FFBD2E","#27C93F"].map(c => (<div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />))}
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.4)", marginLeft: 8 }}>cleaning_pipeline.py</span>
              </div>
              <pre style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, lineHeight: 1.75, color: "#e2e8f0", padding: "24px", margin: 0, overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                <CodeHighlight code={phase.code} />
              </pre>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, gap: 10 }}>
              <button onClick={() => setActivePhase(p => Math.max(0, p - 1))} disabled={activePhase === 0}
                style={{ flex: 1, background: "none", border: `1.5px solid ${border}`, color: activePhase === 0 ? (dark ? "#30363d" : "#cbd5e0") : text, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, padding: "11px 0", borderRadius: 10, cursor: activePhase === 0 ? "default" : "pointer", transition: "all 0.2s", opacity: activePhase === 0 ? 0.4 : 1 }}
                onMouseEnter={e => { if (activePhase !== 0) { e.currentTarget.style.borderColor = "#1B4F8A"; e.currentTarget.style.color = "#1B4F8A"; } }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = text; }}
              >← Previous Phase</button>
              <button onClick={() => setActivePhase(p => Math.min(CASE_STUDY_PHASES.length - 1, p + 1))} disabled={activePhase === CASE_STUDY_PHASES.length - 1}
                style={{ flex: 1, background: activePhase === CASE_STUDY_PHASES.length - 1 ? "none" : phase.color, border: `1.5px solid ${activePhase === CASE_STUDY_PHASES.length - 1 ? border : phase.color}`, color: activePhase === CASE_STUDY_PHASES.length - 1 ? (dark ? "#30363d" : "#cbd5e0") : "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, padding: "11px 0", borderRadius: 10, cursor: activePhase === CASE_STUDY_PHASES.length - 1 ? "default" : "pointer", transition: "all 0.2s", opacity: activePhase === CASE_STUDY_PHASES.length - 1 ? 0.4 : 1 }}
                onMouseEnter={e => { if (activePhase !== CASE_STUDY_PHASES.length - 1) { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
              >Next Phase →</button>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
              {CASE_STUDY_PHASES.map((p, i) => (
                <button key={i} onClick={() => setActivePhase(i)} aria-label={`Go to phase ${i + 1}`}
                  style={{ width: i === activePhase ? 24 : 8, height: 8, borderRadius: 100, background: i === activePhase ? p.color : (dark ? "#30363d" : "#e2e8f0"), border: "none", cursor: "pointer", transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)", padding: 0 }}
                />
              ))}
            </div>
          </div>
        </div>
        <div style={{ marginTop: 40, background: "linear-gradient(135deg, #1B4F8A, #0d3468)", borderRadius: 16, padding: "32px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: 2, marginBottom: 8 }}>PROJECT OUTCOME</div>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, color: "#fff", margin: "0 0 6px" }}>First accurate monthly revenue report in 3 years. ★ 5.0</h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.72)", margin: 0 }}>18,400 rows in → 17,102 rows out → client's analysis team unblocked in 48 hours.</p>
          </div>
          <button onClick={() => document.getElementById("free-sample")?.scrollIntoView({ behavior: "smooth" })}
            style={{ background: "#fff", color: "#1B4F8A", border: "none", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, padding: "13px 28px", borderRadius: 10, cursor: "pointer", whiteSpace: "nowrap", boxShadow: "0 4px 16px rgba(0,0,0,0.15)", transition: "transform 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
          >Get the Same Result →</button>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN PORTFOLIO COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function Portfolio() {
  const [dark, setDark]             = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isMobile, setIsMobile]     = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [heroVisible, setHeroVisible]   = useState(false);

  useEffect(() => {
    document.title = "Saurav Acharya | Data Cleaning Specialist | Python · SQL · Excel";
    const setMeta = (name, content, prop) => {
      const sel = prop ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      const el = document.querySelector(sel) || document.createElement("meta");
      if (prop) el.setAttribute("property", name); else el.name = name;
      el.content = content;
      if (!el.parentNode) document.head.appendChild(el);
    };
    setMeta("description", "Freelance Data Cleaning Specialist from Nepal. Expert Python, SQL & Excel. Free sample cleaning available. Turn messy datasets into analysis-ready data.");
    setMeta("og:title", "Saurav Acharya | Data Cleaning Specialist", true);
    setMeta("og:description", "Fix Your Spreadsheets. Unlock Accurate Reports. Free sample cleaning — results in 24h.", true);
    setMeta("og:image", "https://i.postimg.cc/xTrhbzvN/Photo.jpg", true);
    setMeta("og:type", "website", true);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", "Saurav Acharya | Data Cleaning Specialist");
    setMeta("twitter:description", "Fix Your Spreadsheets. Unlock Accurate Reports. Free sample cleaning — results in 24h.");
    setMeta("twitter:image", "https://i.postimg.cc/xTrhbzvN/Photo.jpg");
    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.text = JSON.stringify({ "@context": "https://schema.org", "@type": "Person", name: "Saurav Acharya", jobTitle: "Data Cleaning Specialist", url: "https://sauravacharya.github.io", sameAs: ["https://github.com/sauravacharya","https://www.fiverr.com/sauravacharya","https://www.upwork.com/freelancers/sauravacharya"] });
    document.head.appendChild(schema);
    const timer = setTimeout(() => setHeroVisible(true), 120);
    const onScroll = () => setScrolled(window.scrollY > 40);
    const checkMobile = () => setIsMobile(window.innerWidth < 960);
    checkMobile();
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", checkMobile);
    return () => { clearTimeout(timer); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", checkMobile); };
  }, []);

  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") setMobileMenu(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenu(false);
  };
  const navIdMap = (label) => label.toLowerCase().replace(/\s+/g, "-");

  const bg     = dark ? "#0d1117" : "#f8fafd";
  const card   = dark ? "#161b22" : "#ffffff";
  const text   = dark ? "#e6edf3" : "#1a202c";
  const muted  = dark ? "#8b949e" : "#6b7280";
  const border = dark ? "#30363d" : "#e2e8f0";

  const filters  = ["All", "Python", "SQL", "Excel"];
  const filtered = activeFilter === "All" ? PROJECTS : PROJECTS.filter(p => p.tag.includes(activeFilter));

  return (
    <div style={{ background: bg, color: text, minHeight: "100vh", transition: "background 0.3s, color 0.3s", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,600;0,800;1,300&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      {/* ── STICKY BOTTOM CTA BAR ── */}
      <StickyCtaBar scrolled={scrolled} scrollTo={scrollTo} dark={dark} />

      {/* ── TRUST BAR ── */}
      <TrustBar dark={dark} />

      {/* ── NAVBAR ── */}
      <nav role="navigation" aria-label="Main navigation"
        style={{ position: "fixed", top: 36, left: 0, right: 0, zIndex: 100, background: scrolled ? (dark ? "rgba(13,17,23,0.96)" : "rgba(248,250,253,0.96)") : "transparent", backdropFilter: scrolled ? "blur(14px)" : "none", borderBottom: scrolled ? `1px solid ${border}` : "none", transition: "all 0.3s", padding: "0 24px" }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => scrollTo("hero")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 800, color: "#1B4F8A" }}>SA<span style={{ color: text }}>.</span></span>
          </button>
          {!isMobile && (
            <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
              {NAV_LINKS.map(l => (
                <button key={l} onClick={() => scrollTo(navIdMap(l))} aria-label={`Navigate to ${l}`}
                  style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: l === "Free Sample" ? 700 : 500, color: l === "Free Sample" ? "#1B4F8A" : muted, transition: "color 0.2s", padding: "4px 0" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#1B4F8A"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = l === "Free Sample" ? "#1B4F8A" : muted; }}
                >{l}</button>
              ))}
              <button onClick={() => setDark(!dark)} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
                style={{ background: dark ? "#21262d" : "#e8eef5", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 14 }}
              >{dark ? "☀️" : "🌙"}</button>
            </div>
          )}
          {isMobile && (
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button onClick={() => setDark(!dark)} style={{ background: dark ? "#21262d" : "#e8eef5", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 14 }}>{dark ? "☀️" : "🌙"}</button>
              <button onClick={() => setMobileMenu(true)} aria-label="Open navigation menu" aria-expanded={mobileMenu}
                style={{ background: "none", border: `1.5px solid ${border}`, borderRadius: 8, padding: "7px 10px", cursor: "pointer", display: "flex", flexDirection: "column", gap: 4 }}
              >
                {[0,1,2].map(i => (<div key={i} style={{ width: 18, height: 2, background: text, borderRadius: 2 }} />))}
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* ── MOBILE MENU ── */}
      {mobileMenu && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }} onClick={() => setMobileMenu(false)} role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div className="panel-slide" style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 280, background: card, borderLeft: `1px solid ${border}`, display: "flex", flexDirection: "column", boxShadow: "-20px 0 60px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: `1px solid ${border}`, marginBottom: 8 }}>
              <span style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 800, color: "#1B4F8A" }}>SA<span style={{ color: text }}>.</span></span>
              <button onClick={() => setMobileMenu(false)} aria-label="Close menu" style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: muted, lineHeight: 1 }}>✕</button>
            </div>
            <nav style={{ flex: 1, overflowY: "auto" }}>
              {NAV_LINKS.map(l => (
                <button key={l} onClick={() => { scrollTo(navIdMap(l)); setMobileMenu(false); }}
                  style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: l === "Free Sample" ? 700 : 500, color: l === "Free Sample" ? "#1B4F8A" : text, padding: "14px 24px", textAlign: "left", display: "block", width: "100%", transition: "background 0.15s", borderLeft: l === "Free Sample" ? "3px solid #1B4F8A" : "3px solid transparent" }}
                  onMouseEnter={e => { e.currentTarget.style.background = dark ? "#1c2433" : "#f0f4f8"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "none"; }}
                >{l}</button>
              ))}
            </nav>
            <div style={{ padding: "20px 24px", borderTop: `1px solid ${border}` }}>
              <button onClick={() => { scrollTo("free-sample"); setMobileMenu(false); }}
                style={{ width: "100%", background: "#1B4F8A", color: "#fff", border: "none", borderRadius: 10, padding: "13px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14 }}
              >🎯 Try Free Sample</button>
            </div>
          </div>
        </div>
      )}

      {/* ── HERO ── */}
      <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "160px 24px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0, backgroundImage: `radial-gradient(circle at 18% 22%, rgba(27,79,138,0.07) 0%, transparent 50%), radial-gradient(circle at 82% 78%, rgba(59,130,246,0.06) 0%, transparent 50%)` }} />
        <DataParticles />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1, width: "100%" }}>
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "55fr 45fr", gap: "48px 64px", alignItems: "center" }}>
            <div>
              {/* Availability badges */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24, opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(16px)", transition: "all 0.6s ease 0.1s" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#EBF4FF", border: "1px solid #BFDBFE", borderRadius: 100, padding: "5px 14px" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E", display: "inline-block", boxShadow: "0 0 0 3px rgba(34,197,94,0.25)", animation: "blink 2s ease-in-out infinite" }} />
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#1B4F8A", fontWeight: 600 }}>Available for freelance</span>
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 100, padding: "5px 13px" }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#C05621", fontWeight: 600 }}>⚠ Limited slots this month</span>
                </div>
              </div>

              {/* Hero headline */}
              <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: "clamp(36px, 5.5vw, 68px)", lineHeight: 1.08, margin: "0 0 22px", color: text, opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s ease 0.2s" }}>
                Fix Your Spreadsheets.<br /><em style={{ color: "#1B4F8A", fontStyle: "italic" }}>Unlock Accurate Reports.</em>
              </h1>

              {/* Before/after mini visual */}
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 24, opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s ease 0.28s", flexWrap: "wrap" }}>
                <div style={{ background: "#FFF5F5", border: "1.5px solid #FEB2B2", borderRadius: 10, padding: "10px 16px", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>
                  <div style={{ color: "#C53030", fontWeight: 700, fontSize: 10, letterSpacing: 1, marginBottom: 4 }}>BEFORE ✗</div>
                  <div style={{ color: "#742A2A" }}>N/A · 01/13/25 · usa · <span style={{ background: "#FED7D7", borderRadius: 3, padding: "0 3px" }}>duplicate</span></div>
                </div>
                <span style={{ fontSize: 20, color: "#1B4F8A", fontWeight: 900 }}>→</span>
                <div style={{ background: "#F0FFF4", border: "1.5px solid #9AE6B4", borderRadius: 10, padding: "10px 16px", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>
                  <div style={{ color: "#276749", fontWeight: 700, fontSize: 10, letterSpacing: 1, marginBottom: 4 }}>AFTER ✓</div>
                  <div style={{ color: "#276749" }}>48.50 · 2025-01-13 · US · unique</div>
                </div>
              </div>

              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: muted, lineHeight: 1.75, maxWidth: 500, margin: "0 0 36px", opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s ease 0.35s" }}>
                If your pivot tables lie, your reports don't balance, or your team can't trust the numbers — <strong style={{ color: text }}>dirty data is the problem</strong>. I fix it fast using Python, SQL &amp; Excel. <span style={{ color: "#1B4F8A", fontWeight: 700 }}>First 100 rows are completely free.</span>
              </p>

              {/* CTA buttons */}
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 28, opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s ease 0.5s" }}>
                <button onClick={() => scrollTo("free-sample")} aria-label="Get a free sample data cleaning"
                  style={{ background: "#1B4F8A", color: "#fff", border: "none", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, padding: "15px 30px", borderRadius: 10, cursor: "pointer", boxShadow: "0 4px 20px rgba(27,79,138,0.38)", transition: "transform 0.2s, box-shadow 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(27,79,138,0.48)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(27,79,138,0.38)"; }}
                >🎯 Try Free Sample Cleaning</button>
                <button onClick={() => scrollTo("demo")} aria-label="See live data cleaning demo"
                  style={{ background: "none", color: text, border: `1.5px solid ${border}`, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15, padding: "15px 28px", borderRadius: 10, cursor: "pointer", transition: "border-color 0.2s, color 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#1B4F8A"; e.currentTarget.style.color = "#1B4F8A"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = text; }}
                >Watch Live Demo →</button>
              </div>

              {/* Mini ratings badge */}
              <div style={{ marginBottom: 20, opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(16px)", transition: "all 0.7s ease 0.55s" }}>
                <MiniRatingsBadge dark={dark} border={border} muted={muted} />
              </div>

              {/* Hero mini form */}
              <div style={{ opacity: heroVisible ? 1 : 0, transition: "all 0.7s ease 0.65s", background: dark ? "rgba(22,27,34,0.8)" : "rgba(255,255,255,0.85)", border: `1px solid ${border}`, borderRadius: 14, padding: "18px 20px", maxWidth: 480, backdropFilter: "blur(8px)" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#1B4F8A", letterSpacing: 1.5, marginBottom: 10 }}>📤 SEND YOUR DATASET — GET IT BACK CLEAN IN 24H</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <input type="email" placeholder="your@email.com" aria-label="Email for free sample cleaning"
                    style={{ flex: 1, padding: "10px 14px", background: dark ? "#0d1117" : "#fff", border: `1px solid ${border}`, borderRadius: 9, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: text, outline: "none" }}
                    onFocus={e => { e.target.style.borderColor = "#1B4F8A"; }}
                    onBlur={e => { e.target.style.borderColor = border; }}
                  />
                  <button onClick={() => scrollTo("free-sample")}
                    style={{ background: "#22C55E", color: "#fff", border: "none", borderRadius: 9, padding: "10px 18px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", boxShadow: "0 4px 14px rgba(34,197,94,0.35)", transition: "transform 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
                  >🎯 Get Free Cleaning →</button>
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: muted, margin: "8px 0 0" }}>🔒 Your data stays private · ✅ No payment required</p>
              </div>

              {/* Hero stats */}
              <div className="hero-stats" style={{ display: "flex", gap: 32, marginTop: 36, flexWrap: "wrap", opacity: heroVisible ? 1 : 0, transition: "all 0.7s ease 0.8s" }}>
                {[["3+","Projects"],["50K+","Rows Cleaned"],["100%","Satisfaction"],["IBM","Cert In Progress"]].map(([n, l]) => (
                  <div key={l}>
                    <div style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 800, color: "#1B4F8A" }}>{n}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: muted, marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            <HeroPhoto />
          </div>
        </div>
      </section>

      {/* ── FREE SAMPLE ── */}
      <FreeSampleSection scrollTo={scrollTo} />

      {/* ── INTERACTIVE DEMO ── */}
      <InteractiveDemo dark={dark} card={card} border={border} text={text} muted={muted} />

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding: "100px 24px", background: dark ? "#111620" : "#fff" }}>
        <div className="about-grid" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <AboutText dark={dark} text={text} muted={muted} border={border} />
          <AboutViz dark={dark} card={card} border={border} text={text} muted={muted} />
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" style={{ padding: "100px 24px", background: dark ? "#0d1117" : "#f8fafd" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionLabel label="WORK" />
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, margin: "8px 0 14px", color: text }}>Real Projects, Real Results</h2>
          <p style={{ color: muted, fontSize: 16, marginBottom: 40, maxWidth: 500 }}>Each project is a real data problem — solved step-by-step, with full code and downloadable cleaned datasets.</p>
          <div style={{ display: "flex", gap: 8, marginBottom: 40, flexWrap: "wrap" }}>
            {filters.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)} aria-pressed={activeFilter === f}
                style={{ background: activeFilter === f ? "#1B4F8A" : (dark ? "#21262d" : "#e8eef5"), color: activeFilter === f ? "#fff" : muted, border: "none", borderRadius: 8, padding: "8px 18px", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}
              >{f}</button>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
            {filtered.map(p => <ProjectCard key={p.id} p={p} dark={dark} border={border} />)}
          </div>
        </div>
      </section>

      {/* ── CASE STUDY ── */}
      <CaseStudySection dark={dark} card={card} border={border} text={text} muted={muted} />

      {/* ── SKILLS ── */}
      <section id="skills" style={{ padding: "100px 24px", background: dark ? "#0d1117" : "#f8fafd" }}>
        <div className="skills-grid" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
          <div>
            <SectionLabel label="TOOLKIT" />
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, margin: "8px 0 16px", color: text }}>Skills & Expertise</h2>
            <p style={{ color: muted, fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>Built through real project work — each skill is tested against actual client data problems.</p>
            <div style={{ background: dark ? "#161b22" : "#EBF4FF", border: `1px solid ${dark ? "#30363d" : "#BFDBFE"}`, borderRadius: 14, padding: "20px 22px" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#1B4F8A", marginBottom: 4, letterSpacing: 1 }}>🎓 CURRENTLY LEARNING</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: text, fontWeight: 600, marginBottom: 4 }}>IBM Data Science Professional Certificate</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: muted, marginBottom: 20 }}>Active track — Progress updated monthly</div>
              {DS_LEARNING.map((item, i) => (<SkillBar key={item.name} name={item.name} level={item.level} delay={i * 150} color={item.color} textColor={text} />))}
            </div>
          </div>
          <div style={{ paddingTop: 8 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#1B4F8A", letterSpacing: 2, marginBottom: 20 }}>CORE SKILLS</div>
            {SKILLS.map((s, i) => (<SkillBar key={s.name} name={s.name} level={s.level} delay={i * 100} textColor={text} />))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" style={{ padding: "100px 24px", background: dark ? "#111620" : "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionLabel label="SERVICES" />
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, margin: "8px 0 12px", color: text }}>What I Offer</h2>
          <p style={{ color: muted, fontSize: 16, marginBottom: 48, maxWidth: 500 }}>All services include a free sample cleaning of 50–100 rows before you commit to a full project.</p>
          <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 20 }}>
            {SERVICES.map((s, i) => (<ServiceCard key={i} s={s} dark={dark} card={card} border={border} text={text} muted={muted} />))}
          </div>
          <div style={{ marginTop: 52, background: "#1B4F8A", borderRadius: 18, padding: "40px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
            <div>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, color: "#fff", margin: "0 0 8px" }}>Ready to clean your data?</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.75)", margin: 0 }}>Send me your dataset and get a free quality audit within 24 hours.</p>
            </div>
            <button onClick={() => scrollTo("contact")}
              style={{ background: "#fff", color: "#1B4F8A", border: "none", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, padding: "14px 32px", borderRadius: 10, cursor: "pointer", whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", transition: "transform 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
            >Get Free Audit →</button>
          </div>
        </div>
      </section>

      {/* ── WHY ME ── */}
      <section id="why-me" style={{ padding: "100px 24px", background: dark ? "#0d1117" : "#f8fafd" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionLabel label="DIFFERENTIATOR" />
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, margin: "8px 0 12px", color: text }}>Why Work With Me</h2>
          <p style={{ color: muted, fontSize: 16, marginBottom: 48, maxWidth: 520 }}>Plenty of people know data tools. Here's what separates my work from a generic freelance gig.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
            {WHY_ME.map((item, i) => (<WhyMeCard key={i} item={item} dark={dark} card={card} border={border} text={text} muted={muted} delay={i * 80} />))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" style={{ padding: "100px 24px", background: dark ? "#111620" : "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionLabel label="SOCIAL PROOF" center />
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, margin: "8px 0 12px", color: text, textAlign: "center" }}>What Clients Say</h2>
          <p style={{ color: muted, fontSize: 16, marginBottom: 56, textAlign: "center", maxWidth: 460, marginLeft: "auto", marginRight: "auto" }}>Real results from real clients — verified on Fiverr, Upwork, and direct engagements.</p>
          <div className="stat-strip" style={{ display: "flex", justifyContent: "center", gap: 48, marginBottom: 60, flexWrap: "wrap", background: dark ? "#161b22" : "#EBF4FF", border: `1px solid ${dark ? "#30363d" : "#BFDBFE"}`, borderRadius: 16, padding: "28px 40px" }}>
            {[["5.0 ★","Average Rating"],["3+","Projects Done"],["50,000+","Rows Cleaned"],["100%","On-Time Delivery"]].map(([val, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 800, color: "#1B4F8A" }}>{val}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: muted, marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (<TestimonialCard key={i} t={t} dark={dark} card={card} border={border} text={text} muted={muted} delay={i * 120} />))}
          </div>
          <div style={{ marginTop: 48, textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "#F0FFF4", border: "1px solid #9AE6B4", borderRadius: 14, padding: "16px 28px", flexWrap: "wrap", justifyContent: "center" }}>
              <span style={{ fontSize: 20 }}>🎁</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#276749", fontWeight: 600 }}>These results started with a <strong>free 100-row sample</strong> — yours can too.</span>
              <button onClick={() => scrollTo("free-sample")}
                style={{ background: "#0F7B6C", color: "#fff", border: "none", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, padding: "9px 20px", borderRadius: 9, cursor: "pointer" }}
              >Try Free →</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── ROADMAP ── */}
      <section id="roadmap" style={{ padding: "100px 24px", background: dark ? "#0d1117" : "#f8fafd" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionLabel label="JOURNEY" />
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, margin: "8px 0 8px", color: text }}>My Path to Data Science</h2>
          <p style={{ color: muted, fontSize: 16, marginBottom: 56, maxWidth: 500 }}>Transparent about where I am and where I'm going. No fake credentials — just real growth.</p>
          <div style={{ position: "relative", paddingLeft: 32 }}>
            <div style={{ position: "absolute", left: 10, top: 0, bottom: 0, width: 2, background: `linear-gradient(to bottom, #1B4F8A, ${dark ? "#30363d" : "#e2e8f0"})` }} />
            {ROADMAP.map((r, i) => (<RoadmapItem key={i} r={r} i={i} dark={dark} card={card} border={border} text={text} muted={muted} />))}
          </div>
        </div>
      </section>

      {/* ── BLOG ── */}
      <section id="blog" style={{ padding: "100px 24px", background: dark ? "#111620" : "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionLabel label="INSIGHTS" />
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, margin: "8px 0 12px", color: text }}>Data Cleaning Tips & Case Studies</h2>
          <p style={{ color: muted, fontSize: 16, marginBottom: 48, maxWidth: 540 }}>Practical knowledge from real projects — not theory. If you work with data, these will save you hours.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {BLOG_POSTS.map((post, i) => (<BlogCard key={i} post={post} dark={dark} card={card} border={border} text={text} muted={muted} delay={i * 120} />))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: "100px 24px", background: dark ? "#0d1117" : "#f8fafd" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <SectionLabel label="CONTACT" center />
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, margin: "8px 0 16px", color: text }}>Let's Work Together</h2>
          <p style={{ color: muted, fontSize: 16, lineHeight: 1.7, marginBottom: 12 }}>Have messy data? Let's talk. Send me your dataset and I'll return a free sample cleaning within 24 hours.</p>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#C05621", fontWeight: 600, marginBottom: 44 }}>⚠ Currently accepting a limited number of new clients.</p>
          <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 32 }}>
            {[
              { icon: "📧", label: "Email",  val: "saurav.acharya.data@gmail.com", href: "mailto:saurav.acharya.data@gmail.com" },
              { icon: "💼", label: "Fiverr", val: "fiverr.com/sauravacharya",       href: "https://www.fiverr.com/sauravacharya" },
              { icon: "🌐", label: "Upwork", val: "upwork.com/sauravacharya",       href: "https://www.upwork.com/freelancers/sauravacharya" },
              { icon: "🐙", label: "GitHub", val: "github.com/sauravacharya",       href: "https://github.com/sauravacharya" },
            ].map(c => (
              <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" aria-label={`${c.label}: ${c.val}`}
                style={{ display: "flex", alignItems: "center", gap: 14, background: dark ? "#161b22" : "#fff", border: `1px solid ${border}`, borderRadius: 12, padding: "16px 20px", textDecoration: "none", transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#1B4F8A"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(27,79,138,0.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <span style={{ fontSize: 22 }} role="img" aria-hidden="true">{c.icon}</span>
                <div style={{ textAlign: "left", overflow: "hidden" }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: muted, marginBottom: 2, letterSpacing: 1 }}>{c.label}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: text, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.val}</div>
                </div>
              </a>
            ))}
          </div>
          <ContactForm dark={dark} card={card} border={border} text={text} muted={muted} />
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${border}`, padding: "32px 24px", paddingBottom: 96 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: muted }}>
            © 2026 Saurav Acharya · <span style={{ color: "#1B4F8A", fontWeight: 600 }}>Data Cleaning Specialist</span> → Aspiring Data Scientist · Built with purpose 🔷
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {[{ label: "GitHub", href: "https://github.com/sauravacharya" },{ label: "Fiverr", href: "https://www.fiverr.com/sauravacharya" },{ label: "Upwork", href: "https://www.upwork.com/freelancers/sauravacharya" }].map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: muted, textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#1B4F8A"; }}
                onMouseLeave={e => { e.currentTarget.style.color = muted; }}
              >{l.label}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
