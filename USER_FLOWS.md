# USER FLOWS & WORKFLOW SPECIFICATION

## Flow 1: Player Instant Discovery & Gameplay
```mermaid
flowchart TD
    A[Visitor Lands on Homepage] --> B{Action}
    B -->|Search| C[Search Page / Live Results]
    B -->|Category Filter| D[Category Page]
    B -->|Click Game Card| E[Game Detail Page]
    C --> E
    D --> E
    E --> F[Click 'Play Now']
    F --> G[Gameplay Page /play/:slug]
    G --> H[Load HTML5 Game in Sandboxed Iframe]
    G --> I[Render Non-Intrusive Banner Placement]
    H --> J[Play Interactive Game]
    J --> K[Submit Score to Verified Leaderboard]
```

## Flow 2: Publisher Onboarding to Live Portal
```mermaid
flowchart TD
    A[Register / Sign In] --> B[Enter Publisher Organization Profile]
    B --> C[Name First Portal & Select URL Slug]
    C --> D[Select Visual Theme Preset]
    D --> E[Curate Starter Games from Catalog]
    E --> F[Configure Monetization & Ad Placement Settings]
    F --> G[Interactive Preview on Desktop & Mobile Viewport]
    G --> H[Publish Portal]
    H --> I[White-Label Portal Live on Web]
```

## Flow 3: Super Admin Game Upload & Ingestion
```mermaid
flowchart TD
    A[Developer Submits Game ZIP Bundle] --> B[Super Admin Reviews Submission in Ingestion Queue]
    B --> C[Inspect Manifest, Licensing & Origin Rights]
    B --> D[Test Run in Restricted Sandbox Iframe]
    D --> E{Approval Decision}
    E -->|Approved| F[Assign Categories & Publish to Global Catalog]
    E -->|Rejected| G[Provide Constructive Feedback Reason]
    F --> H[Action Timestamped to Security Audit Log]
```

## Flow 4: Ad Monetization & Revenue Reconciliation
```mermaid
flowchart TD
    A[Visitor Plays Game on Tenant Portal] --> B[Ad Unit Renders via Adapter]
    B --> C[Log Verified Impression / Click Telemetry]
    C --> D[MTD Accrued Revenue Recorded as 'Estimated']
    D --> E[End of Month: Reconcile Network Disbursem*nts]
    E --> F[Deduct 20% Platform Fee, Allocate 80% Publisher Share]
    F --> G[Status Transitioned to 'Verified Payable']
    G --> H[Publisher Requests Direct Payout]
```

