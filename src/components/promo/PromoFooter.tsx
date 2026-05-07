import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import logo from "@/assets/ltdez-logo.png";

export default function PromoFooter() {
  return (
    <footer className="bg-[#0f0805] text-white px-4 py-14">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="LTDEZ" className="h-10 w-auto bg-white rounded-lg p-1" />
            <div>
              <div className="font-extrabold">LTDEZ</div>
              <div className="text-xs text-white/60">Academy</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-white/60">
            Bangla Friendly · Beginner Friendly · Result Focused — হাতের কাজ শিখে আয়ের পথ।
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white/50 tracking-wider mb-4">CONTACT</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> +৮৮ ০১৭১১২৮২৫১৫</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> support@noor-academy.com</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Bangladesh</li>
          </ul>
          <a
            href="https://wa.me/8801711282515"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500 text-green-400 text-sm font-semibold hover:bg-green-500/10"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp Support
          </a>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white/50 tracking-wider mb-4">LEGAL</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-primary">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-primary">Refund Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-5xl mx-auto mt-10 pt-6 border-t border-white/10 text-center text-xs text-white/40">
        © 2026 LTDEZ. All rights reserved.
      </div>
    </footer>
  );
}
