# Fear To Fluent — English Speaking Fluency Landing Page

বর্তমান promo landing page (LTDEZ Handicraft) এর সম্পূর্ণ structure ইতিমধ্যে আছে — Hero, Problem, Solution, Features, Transformation, Audience, Live Class, Pricing, Order Form, Reviews, FAQ, Final CTA, Footer. শুধু content + কিছু visual touch-up করে English Speaking Fluency Program এ রূপান্তর করব। নতুন কোনো section বা ফাইল লাগবে না।

## কী কী পরিবর্তন হবে

### 1. Hero (`PromoHero.tsx`)
- Badge: "১০০০+ শিক্ষার্থী ইংরেজি বলা শুরু করেছেন"
- Headline: **"Speak English Confidently — Even If You're Starting From Zero"**
- Subheadline: Bangla Friendly Step-by-Step English Speaking Fluency Program
- CTA: "Join Now" + "Start Speaking Today"

### 2. Problem (`PromoProblem.tsx`) — Red alert cards
- English বলতে ভয় লাগে
- Sentence আটকে যায়
- Vocabulary মনে থাকে না
- Confidence নেই
- Grammar জানলেও কথা বলতে পারে না

### 3. Solution (`PromoSolution.tsx`)
- Step-by-Step system, Bangla-friendly explanation, Real speaking practice, Beginner friendly

### 4. Benefits/Features (`PromoFeatures.tsx`) — 7টি card
Daily Speaking Practice, Vocabulary System, Pronunciation Training, Live Zoom Class, WhatsApp Support, Confidence Building, Real Conversation Practice

### 5. Transformation (`PromoTransformation.tsx`)
- Before: Fear, Hesitation, No Confidence, English এ চুপ
- After: Fluent Speaking, Confidence, Better Communication, Interview Ready

### 6. Audience (`PromoAudience.tsx`)
Students, Freelancers, Job Seekers, Beginners, University Students, Online Earners, Content Creators

### 7. Live Class (`PromoLiveClass.tsx`)
- Date/Time/Zoom info সহ pulse animation highlight box

### 8. Pricing (`PromoPricing.tsx`)
- Program name: "Fear To Fluent — Full Program"
- Includes list: ৬০-Day Speaking Roadmap, Vocabulary Builder, Pronunciation Drills, Weekly Live Zoom, Daily Practice Tasks, WhatsApp Support, Lifetime Recording, Confidence Mindset
- Price একই রাখব (৳৪৯৯ / ৳২,৯৯০) — user চাইলে পরে পরিবর্তন করতে পারবে

### 9. Order Form (`PromoOrderForm.tsx`)
- Fields: Full Name, Phone, Email, Address (already there — content labels ঠিক করব)

### 10. FAQ (`PromoFAQ.tsx`)
- Beginners join করতে পারবে?
- Live class হবে?
- Recording পাবো?
- Mobile দিয়ে করা যাবে?
- Support থাকবে?

### 11. Final CTA (`PromoFinalCTA.tsx`)
- Headline: **"Thousands Want Fluency. Few Take Action."**
- CTA: "Place Order Now"

### 12. Footer (`PromoFooter.tsx`) — minor copy tweak (Fear To Fluent branding)

### 13. SEO (`index.html`)
- Title: "Fear To Fluent — English Speaking Fluency Program"
- Meta description per PRD

## যা পরিবর্তন হবে না
- Color theme (orange/amber primary), fonts, animations stack — already PRD এর সাথে match করে
- Header (already universal — হোম/কোর্স/লাইভ প্রোগ্রাম + লগইন)
- Reviews section, FloatingActions, payment manual flow (bKash/Nagad/Rocket — already configured)
- Auth, dashboard, admin, database — কিছুই touch করব না

## Hero image
বর্তমান `promo-hero.jpg` handicraft এর। English fluency theme এর জন্য নতুন hero image generate করা যেতে পারে — কিন্তু সেটা optional. আপাতত existing image রাখব; আপনি বললে নতুন AI-generated image add করব।
