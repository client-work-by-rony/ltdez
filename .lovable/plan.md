## লক্ষ্য

LTDEZ promo page এর সম্পূর্ণ structure clone করা হবে — একই section flow, একই conversion-focused layout — কিন্তু **Noor Handicraft Academy** এর brand, content, color (orange `28 95% 55%`) ও language দিয়ে। এটি হবে একটি single promo/sales page যা একটি specific course বা limited-time offer প্রমোট করবে।

## নতুন route

`/promo` — main landing page (`/`) আলাদা থাকবে; এই promo page একটি independent conversion-focused page হবে। App.tsx এ route যোগ হবে।

## পেজের section order (LTDEZ এর মত)

```text
1. Hero          — promo image + headline + sub + 2 CTA + enrollment count badge
2. Problem       — dark section, 4 problem cards (red/dark)
3. Solution      — "সম্পূর্ণ Solution" badge + 2 highlight cards
4. Features      — 6টি feature card (icon + title + desc)
5. Transformation— Before / After 2-column compare card
6. Audience      — Students/Homemakers/Job Seekers/Beginners ছোট badge cards
7. Live Class    — countdown timer card (next live class)
8. Pricing       — One-Time Special Pricing card with strike-through
9. Order Form    — Name / Phone / Email / Address + Place Order button
10. FAQ          — accordion (4-5 questions)
11. Final CTA    — dark section "Few Take Action" style
12. Footer       — brand + contact + legal links + WhatsApp button
```

## টেকনিক্যাল পরিবর্তন

- **নতুন folder**: `src/components/promo/` — প্রতিটি section আলাদা component:
  - `PromoHeader.tsx`, `PromoHero.tsx`, `PromoProblem.tsx`, `PromoSolution.tsx`, `PromoFeatures.tsx`, `PromoTransformation.tsx`, `PromoAudience.tsx`, `PromoLiveClass.tsx` (countdown), `PromoPricing.tsx`, `PromoOrderForm.tsx`, `PromoFAQ.tsx`, `PromoFinalCTA.tsx`, `PromoFooter.tsx`
- **নতুন page**: `src/pages/Promo.tsx` — সব section assemble করবে
- **`src/App.tsx`** — `/promo` route যোগ
- **Order form**: existing `payment_requests` table ব্যবহার (manual bKash/Nagad flow — যেটা memory তে আছে)। Form submit হলে — entry insert হবে + WhatsApp link এ redirect (admin number `01711282515`)
- **Countdown**: client-side date-based countdown (next Friday 9pm BD time, configurable constant)
- **Design tokens**: Noor orange primary already in `index.css` — সব section semantic tokens ব্যবহার করবে (no hardcoded colors)
- **Animations**: Framer Motion (fade/slide-in on scroll) — existing pattern অনুসরণ
- **Logo**: existing `src/assets/noor-logo.png`
- **Hero image**: একটি placeholder promotional image যোগ করা হবে (`src/assets/promo-hero.jpg`) — Noor handicraft theme অনুযায়ী generate করা হবে

## Content (Noor branding)

- **Hero headline**: "হাতের কাজ শিখে আত্মবিশ্বাসের সাথে আয় শুরু করুন" + "১০০০+ বাংলাদেশী শিক্ষার্থী ইতিমধ্যে যুক্ত"
- **Problems**: হাতের কাজ শিখতে চান কিন্তু কোথা থেকে শুরু করবেন বুঝতে পারছেন না / অনলাইন বিক্রি জানেন না / মূলধন কম / সময়ের অভাব
- **Features**: Step-by-Step ভিডিও লেসন · Live ক্লাস · WhatsApp সাপোর্ট · ডিজাইন রিসোর্স · অনলাইন সেলিং গাইড · Lifetime Access
- **Pricing**: একটি promo offer (e.g. ৳২৯৯০ → ৳৪৯৯ limited time) — admin চাইলে পরে edit
- **FAQ**: Beginner শুরু করতে পারবে? · Live class কখন? · Recording পাবো? · Payment কীভাবে? · Refund?
- **Footer**: Noor Handicraft Academy + bKash/Nagad badges + WhatsApp button

## যা পরিবর্তন হবে না

- বিদ্যমান main landing (`/`), dashboard, admin panel, auth — সবকিছু আগের মতো
- Database schema পরিবর্তন নেই (existing `payment_requests` ব্যবহৃত হবে)
- কোনো নতুন backend/edge function লাগবে না

approve করলে আমি build করব।