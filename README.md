# AI.Ops.SMB.PROJECT — Private AI Ops

Managed AI operations firm for privacy-sensitive SMBs in South Florida (Broward/Miami-Dade), with private AI infrastructure as a demand-gated premium add-on. Verticals: law firms (primary beachhead), dental/healthcare, property management, marine/charter.

**This README is the index of record.** Update it in the same commit any time a file is added, replaced, or archived.

---

## /docs — Strategy, GTM & Cost Documents

| File | Status | What it covers |
|---|---|---|
| `SMB_AI_Ops_Integrated_Strategy_May2026.docx` | Foundational | 18-section core business strategy: thesis, positioning, layered business model, GTM, moats, risk. |
| `Private_AI_Ops_Unified_Strategy_May2026.docx` | Foundational | Combined SMB AI Ops + private infrastructure strategy synthesis. |
| `GPU_Hosting_PoC_Report_May2026.docx` | Foundational | Residential 4×RTX 4090 GPU hosting proof-of-concept (~$14K capex reference figure). |
| `Private_AI_Ops_Channel_Partner_GTM_Addendum.docx` | **New (Sept 2026)** | Assessment of an "AI-forward MSP" pivot (rejected) and the resulting channel-partner strategy: Broward/Miami MSP target list, 3-tier referral/co-sell structure, outreach sequence, guardrails. |
| `Private_AI_Ops_Tech_Infrastructure_Cost_Inventory.docx` | **New (Sept 2026, Rev. 2)** | Founder technical skill matrix, hardware/software inventory with costs, 4-layer business technology architecture. **Rev. 2 optimizes for a Microsoft 365 Business Premium environment** (replacing the original Google Workspace baseline) and adds top-2–3 vendor recommendations for every hardware/software line. |
| `Private_AI_Ops_Opex_Capex_NetARR_OnePager.docx` | **New (Sept 2026)** | One-page bridge mapping the SKU Catalog's revenue/margin data to the Tech Infrastructure Cost Inventory's cash costs — capex trigger rule for the GPU node, Opex breakdown, illustrative Net ARR model. |

## /dashboards — Interactive HTML

| File | Status | What it covers |
|---|---|---|
| `private_ai_ops_pitch.html` | Current | GTM-ready investor/client pitch, eight sections. |
| `private_ai_ops_strategy_dashboard_v2.html` | **Canonical** | Interactive strategy dashboard: scenario switcher, churn sensitivity slider, six tabs (Overview, Financials, Verticals, Roadmap, Positioning, Risk Register). |
| `SMB_AI_Ops_Architecture.html` | Current | Interactive SVG infrastructure architecture diagram with pan/zoom — scoped to the private inference/RAG environment. |
| `Private_AI_Ops_Platform_Architecture.html` | **New (Sept 2026)** | Internal platform & development architecture: the seven-layer engineering system that delivers the SKU catalog (acquisition surface, delivery/orchestration plane, connector framework, public-by-default inference plane, data/knowledge layer, security/compliance, internal ops). Six tabs — Overview, Platform Architecture, SKU→Capability Map, Build Roadmap (tied to gates G1–G6), Data Flow & Trust, Tech Stack. Complements the two existing architecture views by describing what the dev team actually *builds*. |
| `archive/private_ai_ops_strategy_dashboard.html` | **Superseded by v2** | Kept for history only. Do not link from external materials — v2 is canonical. Safe to delete this folder once you're confident v2 covers everything you need. |

## /models — Spreadsheets

| File | Status | What it covers |
|---|---|---|
| `SMB_AI_Ops_Financial_Model.xlsx` | Foundational | 5-sheet financial model: Assumptions, Monthly Model, 3-Year Pro Forma, Net MRR Bridge, Scenarios. |
| `Private_AI_Ops_SKU_Pricing_Catalog.xlsx` | **New (Sept 2026)** | Coded SKU catalog (`PAO-XXX-XXX`) across Assessment/Onboarding/Retainer/Infra/Free Tools/Pro Tier, vertical package bundles with live formula-driven Year-1 TCV, and a directional margin reference by SKU. |

## /apps — Code Artifacts

| File | Status | What it covers |
|---|---|---|
| `charter-brief-pro_jsx.tsx` | Current | Charter Brief Pro — React/TSX SaaS dashboard UI with FareHarbor integration flow (marine vertical free-tool lead magnet). |

---

## Open items / notes

- **Dashboard v1 → archived, not deleted.** This resolves the previously-open "retire or keep with supersession note" question — v1 is preserved under `/dashboards/archive` in case anything there hasn't made it into v2 yet, but nothing should link to it going forward.
- **This sync is additive, not a rewrite.** Today's four new files sit alongside the existing nine rather than replacing them — the strategic core (services-first, MSP-as-channel-not-category, GPU capex demand-gated) is unchanged; today's work fills in the operational layer (tech costs, SKU pricing, ARR bridge, channel GTM) underneath it.
- **Cross-document consistency check (Sept 2026):** the Tech Infrastructure Cost Inventory, SKU Pricing Catalog, and Opex/Capex/Net ARR one-pager are now mutually linked — a fully-loaded margin computed bottom-up from the SKU Catalog (~77%) lands close to the top-down ~71.8% EBITDA margin in the core Financial Model, which is a good sign these documents agree with each other. Re-run that check whenever pricing or cost assumptions change in any one of the three.
- **Three architecture views, three scopes — keep them distinct.** `SMB_AI_Ops_Architecture.html` = the private inference/RAG environment. The Tech Infrastructure Cost Inventory's four-layer diagram = the business-technology stack of SaaS tools purchased (M365, HubSpot, QuickBooks). `Private_AI_Ops_Platform_Architecture.html` (new) = the internal engineering system the team *builds* to deliver the SKUs, sequenced behind the services per decision gate G6. It cites the strategy suite rather than restating it.
- **Vendor/pricing figures are time-stamped to Sept 2026 research.** SaaS and API pricing move often — re-verify before quoting a client or committing spend, and refresh the Tech Infrastructure Cost Inventory quarterly as it recommends.
