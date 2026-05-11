## Modern Course Showcase Section — Homepage

Homepage এ একটি নতুন **Course Showcase Section** যোগ হবে যেখানে দুটি premium program পাশাপাশি দেখানো হবে: **SPOKEN MASTERY** এবং **FEAR TO FLUENT LIVE BOOTCAMP**। শুধু frontend/presentation কাজ — কোনো backend, database বা checkout logic পরিবর্তন হবে না।

### ১. New Component: `PromoCoursesShowcase.tsx`

**Section header**
- Eyebrow: "🎯 Our Premium Courses"
- H2: "Choose Your Perfect English Transformation Program"
- Sub: বাংলা ভাষাভাষীদের জন্য Powerful English Learning Programs … Real Life এ Confidently Communication

**Course Grid** — 2 cards, side-by-side desktop / stacked mobile (`grid-cols-1 lg:grid-cols-2 gap-8`)

Card structure (glassmorphism + orange gradient accent, dark premium look on light bg with dark card variant):

```text
┌─────────────────────────────┐
│  [Badge: BEST SELLER]       │
│  01                          │
│  SPOKEN MASTERY             │
│  Complete Fluency …          │
│  ─────────────────           │
│  ✅ 12 feature bullets       │
│  ─────────────────           │
│  Perfect For: chips          │
│  ─────────────────           │
│  ৳15,000+   Limited Offer    │
│  [🚀 Enroll Now] [📚 Details]│
└─────────────────────────────┘
```

**Card 1 — SPOKEN MASTERY**
- Badge: "BEST SELLER" (amber gradient)
- Number "01", Title, sub "🔥 Beginner থেকে Confident Speaker হওয়ার Step-by-Step System"
- 12 features (Basic Building, Fluency Special, Communicative Grammar, Questioning Techniques, Topic Based Presentation, Random Topic Speaking, 60 Hours Group Discussion, AI Speaking Practice, VIP One-to-One, Public Speaking, British Phonetics, Native Fluency Hacks)
- Perfect For chips: Beginners / Freelancers / Job Seekers / University Students / Anyone Who Wants Fluency
- Price: ৳15,000+ with "🔥 Limited Time Offer" tag
- CTAs: "🚀 Enroll Now" → `/checkout?program=spoken-mastery`, "📚 View Full Details" → smooth-scroll to `#pricing`

**Card 2 — FEAR TO FLUENT LIVE BOOTCAMP**
- Badge: "POPULAR" (orange gradient)
- Number "02", Title, sub "Live Zoom Based Speaking Confidence Program"
- 8 What-You'll-Learn features (Hesitation Removal, Live Speaking Practice, Daily Conversation, Smart Vocabulary, Instant Sentence Formation, Confidence Building, Real-Life English, Zoom Group Discussion)
- Program Features row with icons: 🎤 Live Zoom / 👥 Practice Partner / 📱 WhatsApp Support / 🤖 AI Assisted / 🧠 Beginner Friendly
- Perfect For chips: ভয় পান / Practice Environment / দ্রুত Confidence
- Price: ৳2,500+ with "🔥 Discount Offer Running Now"
- CTAs: "🚀 Join Live Bootcamp" → `/checkout?program=live-bootcamp`, "📚 Learn More" → scroll to `#features`

**Card visuals**
- Rounded-3xl, gradient border (`p-[1px] bg-gradient-to-br from-primary to-amber-400`) wrapping inner `bg-card` content
- Hover: lift (`-translate-y-2`), enlarge shadow (`shadow-2xl shadow-primary/30`), subtle glow ring
- Framer Motion `whileInView` fade+slide
- Numbered badges in top-left corner (large outlined "01" / "02")
- Top badge ribbon (BEST SELLER / POPULAR) top-right

### ২. New Component: `PromoWhyLove.tsx`

Below the showcase:
- H2: "💎 Practical Learning Experience"
- Intro paragraph
- 6-item icon grid (2×3 mobile, 3×2 desktop): Bangla Friendly / Step-by-Step / Live Practice / Real Communication / Beginner Friendly / AI Powered
- Closing block: "🎯 Which Program Should You Choose?" — two mini decision cards pointing back to each program

### ৩. `Index.tsx` — section order update

```text
Header
Hero
Problem
Solution
Modules
PromoCoursesShowcase   ← NEW
PromoWhyLove           ← NEW
Features
Bonuses
Transformation
Audience
Pricing
Reviews
FAQ
FinalCTA
Footer
```

### Design notes
- Light theme consistent with site, but cards use **dark premium variant** (`bg-[#1a0e08]` / `bg-gradient-to-br from-zinc-900 to-zinc-800`) for the SaaS premium look the brief requests, with orange gradient accents
- Glassmorphism on inner badges (`backdrop-blur bg-white/10 border border-white/15`)
- Tailwind semantic tokens for primary/amber; HSL only
- Lucide icons (Mic2, Users, MessageCircle, Bot, Sparkles, ShieldCheck, Crown, Rocket, BookOpen, Zap, GraduationCap, Globe2)
- Bengali formal tone ('আপনি/আপনার')
- Mobile-first, tested at 971px viewport
- Framer Motion scroll-reveal on header, cards (staggered), why-love grid

### Files
- **Create**: `src/components/promo/PromoCoursesShowcase.tsx`, `src/components/promo/PromoWhyLove.tsx`
- **Edit**: `src/pages/Index.tsx` (mount the two new sections)

কোনো backend / database / checkout / routing পরিবর্তন নেই — শুধু presentation layer।
