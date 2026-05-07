## Modernize "Fear To Fluent — সম্পূর্ণ Solution" Section

`src/components/promo/PromoSolution.tsx` কে brand color (orange/amber) অনুযায়ী আরও modern এবং premium look দেব।

### Changes

**1. Background & Layout**
- Soft orange gradient background (`from-orange-50 via-white to-amber-50`)
- Decorative blurred orange/amber blobs (top-right, bottom-left) for depth
- Increased padding ও max-width adjustment

**2. Section Header Upgrade**
- "THE SOLUTION" badge — gradient bg (`from-primary/15 to-amber-200/40`) with sparkle icon, subtle border
- Headline এ "Fear To Fluent" + "সম্পূর্ণ Solution" — full gradient text effect, bigger size (`text-5xl md:text-6xl`)
- Decorative divider line with center dot between badge ও heading

**3. Feature Cards (3 items) — Modern Bento Style**
- White card with subtle orange border, hover lift + shadow-glow
- Top gradient bar (orange→amber) — full opacity (always visible, brand reinforce)
- Numbered badge ("01", "02", "03") at top-right corner — light orange chip
- Larger icon container (14x14) with gradient `from-primary to-amber-500`, rotate-3 on hover
- Title — bigger, bolder, hover color shift to primary
- Bottom corner: small `ArrowRight` icon that slides on hover
- Stagger animation with framer-motion

**4. Bottom Highlight Strip (New)**
- Full-width gradient pill: "১০,০০০+ student already started their journey →" with avatar stack mock + CTA arrow
- Reinforces social proof + leads to next section

### Technical
- File: `src/components/promo/PromoSolution.tsx` (single file rewrite)
- Icons: existing `Sparkles, MapPin, BookOpen, Mic` + add `ArrowRight`
- No new dependencies — Framer Motion + Tailwind + Lucide already in project
- Brand colors strictly: `primary` (orange `28 95% 55%`) + `amber-400/500` accents, white surface, black text

### Preview
Section টি দেখতে হবে premium SaaS landing page এর "Solution" block এর মত — warm orange tone, subtle depth, smooth animation, এবং brand consistency পুরো page এর সাথে maintain করবে।
