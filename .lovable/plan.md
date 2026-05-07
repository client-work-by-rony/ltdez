# "কোর্সে যা যা পাবেন" Section Modernization

## Goal
PromoFeatures section-এর design আরও modern, visually engaging এবং high-converting করে upgrade করা।

## Changes

### 1. Bento-Style Grid Layout
- Current 3-column uniform grid এর জায়গায় responsive bento-style grid (1-2-1 span pattern)
- কিছু cards larger (md:col-span-2), কিছু standard size — visual rhythm তৈরি হবে
- 4-column grid on large screens for better space utilization

### 2. Enhanced Cards
- প্রতিটি card-এ unique gradient top border (hover এ reveal)
- প্রতিটি card-এ color-coded highlight badge (e.g., "30+ Days Practice", "500+ Words")
- Larger gradient icon containers (12x12) with hover scale animation
- Arrow indicator on hover for interactivity cue
- Better shadows and hover lift effect

### 3. Section Header Upgrade
- "What's Included" badge যোগ (like Pricing section)
- Larger gradient headline (text-5xl on desktop)
- Subtitle text larger and more readable
- Decorative blurred background circles for depth

### 4. Bottom Summary Card (New)
- Full-width glow card with "Everything You Need in One Place" heading
- Left side: CTA text + "Enroll Now" button
- Right side: 6-item checklist with green check icons
- Gradient border blur effect (Pricing section এর মত)

### 5. Visual Polish
- Background decorative blur blobs for depth
- Better spacing (gap-4 instead of gap-5, more breathing room)
- Consistent gradient colors matching the orange/amber brand theme
- All animations via Framer Motion with stagger delays

## Technical
- File: `src/components/promo/PromoFeatures.tsx`
- No new dependencies — existing Framer Motion + Lucide icons ব্যবহার
- Lucide icons: `Check`, `ArrowRight` 추가

## Preview
Section-টি দেখতে হবে একটি premium SaaS landing page এর features grid এর মত — colorful, organized, এবং scroll করলে smooth staggered animation সহ আসবে।