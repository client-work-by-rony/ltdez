## লক্ষ্য

আপলোড করা PDF (LTDEZ English fluency promo)-এর সব section হুবহু structure অনুযায়ী **হোম পেজ (`/`)**-এ Noor Handicraft Academy ব্র্যান্ডিং দিয়ে সাজানো। বর্তমান `/promo` page-এ যা আছে সেই components reuse করব এবং বাকি missing pieces add করে home-কে complete promo-style page বানাব।

## পরিবর্তন

### 1. Home page (`src/pages/Index.tsx`) সম্পূর্ণ rewrite
পুরোনো Noor sections (`NoorHero`, `NoorProblem`, `NoorSolution`, `NoorFeatures`, `NoorCourses`, `NoorReviews`, `NoorFinalCTA`) সরিয়ে PDF অনুযায়ী নতুন order:

```text
PromoHeader
PromoHero          → "হাতের কাজ শিখে আত্মবিশ্বাসের সাথে আয় শুরু করুন" + CTA
PromoProblem       → "আপনি কি এই সমস্যাগুলোতে আটকে আছেন?" (4টা problem card)
PromoSolution      → "Fear To Fluent" → "Zero থেকে Pro" Noor solution
PromoFeatures      → ৬টা feature (Daily Practice, Vocabulary, ইত্যাদির craft equivalent)
PromoTransformation→ Before / After 90 days (handicraft journey)
PromoAudience      → Students / Housewives / Job Seekers / Beginners
PromoLiveClass     → Zoom live class + countdown
PromoPricing       → ৳৫০০ → ৳৪৯৯ (Save ৳১) one-time card
PromoOrderForm     → Full Name / Phone / Email / Address → WhatsApp redirect
PromoFAQ           → ৪টা FAQ accordion
NoorReviews        → বিদ্যমান reviews carousel রাখব (social proof)
PromoFinalCTA      → "Thousands Want Skill. Few Take Action."
PromoFooter        → bKash/Nagad/Rocket + brand row
FloatingActions    → WhatsApp/Call floating buttons
```

### 2. PromoHeader nav links update
PDF অনুযায়ী anchor links: `#hero`, `#problem`, `#solution`, `#features`, `#pricing`, `#faq`। লোগো/ব্র্যান্ড Noor-ই থাকবে।

### 3. `/promo` route রাখব নাকি সরাব?
যেহেতু home এখন এই content দেখাবে, `/promo` redirect হিসেবে home-এ পাঠাব (`<Navigate to="/" />`) যাতে পুরোনো link ভাঙে না।

### 4. কোনো নতুন database / backend পরিবর্তন নেই
- Order form আগের মতই WhatsApp (`8801711282515`) এ pre-filled message পাঠাবে
- Pricing, countdown, copy — সব frontend constant

### 5. ছোট polish
- PromoHero-তে "৮০+ Bangladeshi students" badge → "১০০০+ বাংলাদেশী শিক্ষার্থী" (ইতিমধ্যেই আছে)
- Live class date constant verify (Friday 9 PM BD)
- Section anchor id গুলো nav-এর সাথে match করা

## কোন file গুলো বদলাবে

- **Edit**: `src/pages/Index.tsx` (সম্পূর্ণ replace)
- **Edit**: `src/App.tsx` (`/promo` → redirect)
- **Edit**: `src/components/promo/PromoHeader.tsx` (nav links)
- **Reuse as-is**: সব `src/components/promo/*` component এবং `NoorReviews`, `FloatingActions`

## যা বদলাবে না

- Auth, dashboard, admin, course pages — কোনোটাই touch হবে না
- Database schema, edge functions, RLS — অপরিবর্তিত
- Noor branding (orange theme, logo, fonts) — same
