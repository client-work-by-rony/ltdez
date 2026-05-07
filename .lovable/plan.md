## লক্ষ্য
Header-এ ৩টি nav link (হোম, কোর্স, লাইভ প্রোগ্রাম) + একটি **লগইন** বাটন যোগ করা।

## পরিবর্তন

### 1. `src/components/promo/PromoHeader.tsx` rewrite
- Desktop nav (md+): `হোম` → `#hero`, `কোর্স` → `#features`, `লাইভ প্রোগ্রাম` → `#live`
- ডানদিকে: outlined **লগইন** বাটন (`<Link to="/auth">` + LogIn icon) + filled `অর্ডার করুন` বাটন
- Mobile: hamburger drawer যেখানে একই links + লগইন/অর্ডার বাটন
- LTDEZ লোগো ও ব্র্যান্ড টেক্সট অপরিবর্তিত

### 2. `src/components/promo/PromoLiveClass.tsx`
- `<section>`-এ `id="live"` যোগ করা যাতে nav anchor কাজ করে

### যা touch হবে না
- বাকি promo sections, auth flow, dashboard, admin
