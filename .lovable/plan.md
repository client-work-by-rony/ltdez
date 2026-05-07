# Live Program — আলাদা Page তৈরি

হোমপেজের সব content ঠিক রেখে **Live Program** এর জন্য আলাদা একটা page তৈরি করব যেখানে আপনি নিজে content add/edit করতে পারবেন।

## পরিবর্তন

### 1. নতুন page — `src/pages/LiveProgram.tsx`
- Route: `/live-program`
- Header + Footer + FloatingActions (homepage এর মতই layout)
- Content section যেখানে একটি `LIVE_PROGRAMS` array থাকবে (টপ-এ comment সহ — আপনি সহজে edit করতে পারবেন)
- প্রতিটি program card এ থাকবে:
  - Title, Topic
  - Date, Time, Platform (Zoom), Seats
  - Live countdown timer
  - Bullet points (4টি default)
  - "Reserve My Seat" CTA → হোমপেজের `#order` এ যাবে
- Hero section + final CTA

### 2. Header (`src/components/promo/PromoHeader.tsx`)
- "লাইভ প্রোগ্রাম" link `#live` (anchor) থেকে `/live-program` (route) এ পরিবর্তন
- Desktop + mobile dropdown — দুজায়গাতেই route-aware (React Router `<Link>`)
- হোম/কোর্স anchor link হিসেবে থাকবে কিন্তু `/#hero` ও `/#features` format এ যাতে অন্য route থেকেও কাজ করে

### 3. Routing (`src/App.tsx`)
- নতুন route add: `<Route path="/live-program" element={<LiveProgram />} />`

### 4. Homepage (`src/pages/Index.tsx`)
- `<PromoLiveClass />` section হোমপেজ থেকে remove (কারণ এখন আলাদা page-এ যাবে)
- বাকি সব section (Hero, Problem, Solution, Features, Transformation, Audience, Pricing, Order, Reviews, FAQ, Final CTA) অপরিবর্তিত

## Edit করার জন্য
`src/pages/LiveProgram.tsx` ফাইলের শুরুতে `LIVE_PROGRAMS` array — সেখানে নতুন program object copy-paste করে যত খুশি class add করতে পারবেন।
