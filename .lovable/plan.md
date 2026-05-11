## SPOKEN MASTERY — Landing Page Redesign

পুরো homepage কে নতুন **SPOKEN MASTERY** program অনুযায়ী সাজানো হবে। "Fear To Fluent" branding update হবে, ৮টি module add হবে, VIP bonus + exclusive bonuses section আসবে, এবং Money-back guarantee badge যোগ হবে।

### ১. Hero Section (`PromoHero.tsx`) — Update
- Headline: **"SPOKEN MASTERY"** — Complete English Fluency Transformation
- Sub: "From Fear & Hesitation → To Confident English Speaking"
- Tagline: বাংলা ভাষাভাষীদের জন্য Complete Practical English Speaking System
- Badge: "8 Modules • 60 Hours Practice • VIP Mentorship"
- CTA: "Join SPOKEN MASTERY" → `/checkout`

### ২. Solution Section (`PromoSolution.tsx`) — Update
- Heading: "SPOKEN MASTERY — সম্পূর্ণ Solution"
- 3 pillars retain (Bangla Friendly / Step-by-Step / Real Practice) — copy refresh

### ৩. NEW: Modules Section (`PromoModules.tsx`)
8টি module-এর bento grid (2 col mobile, 3-4 col desktop), প্রতিটিতে:
- Number badge (01-08), Icon, Title, Short desc, ৩-৪টি bullet points
- Modules:
  1. Basic Building Mastery (5 Power Classes)
  2. Fluency Special Training (5 Advanced Classes)
  3. Communicative Grammar
  4. Questioning Techniques
  5. Topic Based Presentation
  6. Random Topic Speaking Challenge
  7. 60 Hours Group Discussion Practice
  8. AI Powered Speaking Practice
- Color-coded gradient cards, hover lift, scroll-reveal

### ৪. NEW: VIP + Bonuses Section (`PromoBonuses.tsx`)
- **VIP Bonus**: "1-to-1 Private Mentorship Session (Value ৳5000)" — premium card with crown icon, gold/amber gradient, 4 bullet points (Personal Fluency Review, Mistake Analysis, Confidence Coaching, Customized Plan)
- **Exclusive Bonuses** (4 cards):
  - 🎤 Public Speaking Techniques
  - 🇬🇧 Native Fluency Hacks
  - 🔊 British Phonetics Training
  - 🚀 Inertia Break Method

### ৫. Features Section (`PromoFeatures.tsx`) — Light refresh
Keep current 7 feature cards but align language with SPOKEN MASTERY.

### ৬. Transformation Section — Keep as-is
Already matches "Fear → Fluent" before/after narrative.

### ৭. Audience Section — Keep, refine labels
Update to: English বুঝেন কিন্তু বলতে পারেন না / Confidence নেই / Freelancing-Job / Interview Skill

### ৮. Pricing Section (`PromoPricing.tsx`) — Update
- Title: "SPOKEN MASTERY — Full Program"
- Total Value badge: **৳15,000+**
- Special offer price (keep ৳499 or as-is)
- Includes list expanded to cover all 8 modules + VIP + 4 bonuses
- Add **"100% Money Back Guarantee"** trust badge with shield icon below CTA

### ৯. Final CTA Section (`PromoFinalCTA.tsx`) — Update
- Headline keep: "Thousands Want Fluency. Few Take Action."
- Sub-text: "Join SPOKEN MASTERY Today and Start Speaking English With Confidence."
- CTA: "Join SPOKEN MASTERY" → `/checkout`

### ১০. Index.tsx — New section order
```
Header
Hero
Problem
Solution
Modules        ← NEW
Features
Bonuses        ← NEW (VIP + Exclusive)
Transformation
Audience
Pricing (with money-back badge)
Reviews
FAQ
FinalCTA
Footer
```

### Design notes
- Brand orange/amber gradient consistent (existing `--primary`)
- Framer Motion scroll-reveal on every section (consistent with current style)
- Bengali formal tone ('আপনি/আপনার')
- Lucide icons; no new image assets needed
- Mobile-first responsive (current 971px viewport tested)

### Files
- **Edit**: `PromoHero.tsx`, `PromoSolution.tsx`, `PromoFeatures.tsx`, `PromoAudience.tsx`, `PromoPricing.tsx`, `PromoFinalCTA.tsx`, `pages/Index.tsx`
- **Create**: `PromoModules.tsx`, `PromoBonuses.tsx`

কোনো backend/database/checkout logic change হবে না — শুধুই presentation layer।