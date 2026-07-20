"use client";

import { useMemo, useState } from "react";

type Field = {
  id: string;
  label: string;
  form: string;
  value: string;
  source: string;
  sourceLabel: string;
  box: string;
  confidence: number;
  status: "verified" | "review" | "unverified";
  note: string;
  transform?: string;
};

const fields: Field[] = [
  {
    id: "wages",
    label: "Wages, salaries, tips",
    form: "Form 1040 · Line 1a",
    value: "$128,450",
    source: "w2-northstar",
    sourceLabel: "Northstar Labs · W-2",
    box: "Box 1 · Wages, tips, other compensation",
    confidence: 99,
    status: "verified",
    note: "Exact match to the employer-issued W-2. No transformation applied.",
  },
  {
    id: "interest",
    label: "Taxable interest",
    form: "Form 1040 · Line 2b",
    value: "$1,842",
    source: "1099-northbank",
    sourceLabel: "North Bank · 1099-INT",
    box: "Box 1 · Interest income",
    confidence: 94,
    status: "unverified",
    note: "The amount is legible and matches the document total.",
  },
  {
    id: "withholding",
    label: "Federal income tax withheld",
    form: "Form 1040 · Line 25a",
    value: "$23,612",
    source: "w2-northstar",
    sourceLabel: "Northstar Labs · W-2",
    box: "Box 2 · Federal income tax withheld",
    confidence: 98,
    status: "verified",
    note: "Exact match to the employer-issued W-2.",
  },
  {
    id: "charity",
    label: "Gifts to charity",
    form: "Schedule A · Line 12",
    value: "$3,250",
    source: "charity-receipts",
    sourceLabel: "Charitable receipts · 3 documents",
    box: "Annual contribution totals",
    confidence: 72,
    status: "review",
    note: "One handwritten receipt is partially obscured. Review the $750 extraction before approval.",
    transform: "$1,500 + $1,000 + $750 = $3,250",
  },
];

export default function Home() {
  const [activeId, setActiveId] = useState("charity");
  const [items, setItems] = useState(fields);
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("3250");

  const active = useMemo(
    () => items.find((field) => field.id === activeId) ?? items[0],
    [activeId, items],
  );
  const verifiedCount = items.filter((field) => field.status === "verified").length;

  function verifyField() {
    setItems((current) =>
      current.map((field) =>
        field.id === active.id ? { ...field, status: "verified" } : field,
      ),
    );
    setNotice(`${active.label} was verified and added to the audit trail.`);
    setEditing(false);
  }

  function saveCorrection() {
    const amount = Number(draft.replace(/[^0-9.]/g, ""));
    if (!Number.isFinite(amount)) return;
    setItems((current) =>
      current.map((field) =>
        field.id === active.id
          ? { ...field, value: `$${amount.toLocaleString()}`, status: "verified" }
          : field,
      ),
    );
    setNotice(`Correction saved. The original AI value remains in the audit trail.`);
    setEditing(false);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="TraceTax home">
          <span className="brand-mark">T</span>
          <span>TraceTax</span>
        </a>
        <nav className="topnav" aria-label="Primary navigation">
          <a href="#overview">Overview</a>
          <a className="active" href="#review">Review</a>
          <a href="#documents">Documents</a>
          <a href="#issues">Issues <span className="nav-count">2</span></a>
        </nav>
        <div className="reviewer">
          <span className="avatar">LC</span>
          <span><strong>Leena CPA</strong><small>Reviewer</small></span>
          <button aria-label="Open account menu">⌄</button>
        </div>
      </header>

      <section className="return-bar">
        <div className="crumbs"><a href="#clients">Clients</a><span>/</span><span>Maya Chen</span><span>/</span><strong>2025 Individual Return</strong></div>
        <div className="return-heading">
          <div>
            <span className="eyebrow">2025 FORM 1040</span>
            <h1>Maya Chen</h1>
          </div>
          <div className="return-meta">
            <span className="status-pill"><i /> Review in progress</span>
            <span className="progress-label"><strong>{verifiedCount} of {items.length}</strong> reviewed</span>
            <div className="progress-track"><span style={{ width: `${(verifiedCount / items.length) * 100}%` }} /></div>
          </div>
        </div>
      </section>

      {notice && <div className="toast" role="status"><span>✓</span>{notice}<button onClick={() => setNotice("")} aria-label="Dismiss notification">×</button></div>}

      <section className="workspace" id="review">
        <aside className="field-panel">
          <div className="panel-heading">
            <div><span className="eyebrow">RETURN FIELDS</span><h2>Income & deductions</h2></div>
            <button className="icon-button" aria-label="Filter fields">≡</button>
          </div>
          <label className="search"><span>⌕</span><input placeholder="Search return fields" aria-label="Search return fields" /></label>
          <div className="section-label"><span>Income</span><small>3 fields</small></div>
          <div className="field-list">
            {items.slice(0, 3).map((field) => <FieldRow key={field.id} field={field} active={field.id === activeId} onClick={() => { setActiveId(field.id); setEditing(false); setNotice(""); }} />)}
          </div>
          <div className="section-label"><span>Itemized deductions</span><small>1 field</small></div>
          <div className="field-list">
            {items.slice(3).map((field) => <FieldRow key={field.id} field={field} active={field.id === activeId} onClick={() => { setActiveId(field.id); setEditing(false); setNotice(""); }} />)}
          </div>
          <div className="legend"><span><i className="dot verified" />Verified</span><span><i className="dot review" />Needs review</span><span><i className="dot ready" />Ready</span></div>
        </aside>

        <section className="document-panel" aria-label="Source document">
          <div className="document-toolbar">
            <div><span className="file-icon">▤</span><span><strong>{active.sourceLabel}</strong><small>Page 1 of 1 · Uploaded Feb 12, 2026</small></span></div>
            <div><button aria-label="Zoom out">−</button><span>100%</span><button aria-label="Zoom in">+</button><button aria-label="More document actions">•••</button></div>
          </div>
          <div className="document-canvas">
            {active.id === "charity" ? <ReceiptDocument /> : <TaxDocument field={active} />}
          </div>
          <div className="source-caption"><span className="pulse-dot" /><strong>Source highlighted</strong><span>{active.box}</span></div>
        </section>

        <aside className="evidence-panel">
          <div className="evidence-heading">
            <div><span className="eyebrow">AI EVIDENCE</span><h2>How we got this value</h2></div>
            <button aria-label="Close evidence panel">×</button>
          </div>
          <div className="selected-value">
            <span>{active.label}</span>
            {editing ? (
              <label className="edit-value"><span>$</span><input autoFocus value={draft} onChange={(event) => setDraft(event.target.value)} aria-label={`Corrected value for ${active.label}`} /></label>
            ) : <strong>{active.value}</strong>}
            <small>{active.form}</small>
          </div>

          <div className={`confidence confidence-${active.confidence < 80 ? "low" : "high"}`}>
            <div className="confidence-score"><span>AI confidence</span><strong>{active.confidence}%</strong></div>
            <div className="confidence-track"><span style={{ width: `${active.confidence}%` }} /></div>
            <p>{active.note}</p>
          </div>

          <div className="trace">
            <div className="trace-step"><span className="step-number">1</span><div><small>SOURCE</small><strong>{active.sourceLabel}</strong><span>{active.box}</span></div><button aria-label="View source">↗</button></div>
            <div className="trace-line" />
            <div className="trace-step"><span className="step-number">2</span><div><small>EXTRACTED VALUE</small><strong>{active.id === "charity" ? "$750 + 2 other receipts" : active.value}</strong><span>Document text recognition</span></div></div>
            {active.transform && <><div className="trace-line" /><div className="trace-step"><span className="step-number">3</span><div><small>CALCULATION</small><strong className="formula">{active.transform}</strong><span>Sum of eligible contributions</span></div></div></>}
            <div className="trace-line" />
            <div className="trace-step"><span className="step-number final">{active.transform ? "4" : "3"}</span><div><small>RETURN FIELD</small><strong>{active.form}</strong><span>{active.value}</span></div></div>
          </div>

          {active.status === "review" && !editing && <div className="warning"><span>!</span><p><strong>Why this needs review</strong>Part of the source is obscured. Confirm the highlighted amount before accepting it.</p></div>}

          <div className="action-area">
            {editing ? <>
              <button className="primary" onClick={saveCorrection}>Save correction</button>
              <button className="secondary" onClick={() => setEditing(false)}>Cancel</button>
            </> : <>
              <button className="primary" onClick={verifyField}>{active.status === "verified" ? "Verified ✓" : "Verify value"}</button>
              <button className="secondary" onClick={() => { setDraft(active.value.replace(/[^0-9.]/g, "")); setEditing(true); }}>Correct value</button>
            </>}
            <button className="text-button" onClick={() => setNotice("Issue flagged for the preparer. Maya’s return remains in review.")}>Flag an issue</button>
          </div>
          <div className="audit-note"><span>⌁</span><p><strong>Every action is recorded</strong>Source, AI output, and reviewer changes stay in the audit trail.</p></div>
        </aside>
      </section>
    </main>
  );
}

function FieldRow({ field, active, onClick }: { field: Field; active: boolean; onClick: () => void }) {
  return <button className={`field-row ${active ? "selected" : ""}`} onClick={onClick} aria-pressed={active}>
    <span className={`state-icon ${field.status}`}>{field.status === "verified" ? "✓" : field.status === "review" ? "!" : "·"}</span>
    <span className="field-copy"><strong>{field.label}</strong><small>{field.form}</small></span>
    <span className="field-value"><strong>{field.value}</strong><small>{field.confidence}% AI</small></span>
    <span className="chevron">›</span>
  </button>;
}

function ReceiptDocument() {
  return <article className="paper receipt">
    <div className="receipt-top"><div className="receipt-logo">H</div><div><strong>HARBOR COMMUNITY FOUNDATION</strong><span>Building stronger neighborhoods together</span></div></div>
    <div className="receipt-title"><h3>CHARITABLE CONTRIBUTION RECEIPT</h3><span>Receipt No. HCF-2025-1842</span></div>
    <div className="receipt-grid"><span>Donor name</span><strong>Maya Chen</strong><span>Contribution date</span><strong>December 18, 2025</strong><span>Contribution type</span><strong>Monetary donation</strong><span>Payment method</span><strong>Check •••• 2481</strong></div>
    <div className="amount-box"><span>Contribution amount</span><strong>$750.00</strong><i className="highlight-ring" /><em>AI found this value</em></div>
    <p className="receipt-copy">No goods or services were provided in exchange for this contribution. Harbor Community Foundation is a qualified organization under section 501(c)(3) of the Internal Revenue Code.</p>
    <div className="signature"><span>Jordan Ellis</span><small>Authorized signature</small></div>
    <footer><span>42 Harbor Way · Boston, MA 02110</span><span>EIN 04-8216390</span></footer>
  </article>;
}

function TaxDocument({ field }: { field: Field }) {
  return <article className="paper tax-form">
    <div className="form-head"><strong>{field.source.includes("1099") ? "1099-INT" : "W-2"}</strong><span>2025</span></div>
    <h3>{field.source.includes("1099") ? "INTEREST INCOME" : "WAGE AND TAX STATEMENT"}</h3>
    <div className="fake-form-grid">
      <div><small>PAYER / EMPLOYER</small><strong>{field.source.includes("1099") ? "NORTH BANK, N.A." : "NORTHSTAR LABS, INC."}</strong><span>125 Summer Street · Boston, MA 02110</span></div>
      <div><small>RECIPIENT / EMPLOYEE</small><strong>MAYA CHEN</strong><span>18 Beacon Place · Boston, MA 02108</span></div>
      <div className="highlight-cell"><small>{field.box}</small><strong>{field.value}</strong><i className="highlight-ring" /><em>AI found this value</em></div>
      <div><small>Account number</small><strong>•••• 4829</strong></div>
      <div><small>Tax year</small><strong>2025</strong></div>
      <div><small>Federal identification no.</small><strong>04-8291746</strong></div>
    </div>
    <div className="form-disclaimer">Copy B — To be filed with employee’s federal tax return</div>
  </article>;
}
