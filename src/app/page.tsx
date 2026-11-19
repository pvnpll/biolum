import Link from 'next/link';
import { ArrowRight, Download, Sparkles, Palette, Share2, Star, CheckCircle } from 'lucide-react';

const features = [
  { icon: '🎨', title: '10+ Designer Templates', desc: 'Traditional, modern & elegant — switch anytime, data stays' },
  { icon: '⚡', title: 'Live Preview', desc: 'See changes instantly in a split-pane editor as you type' },
  { icon: '📄', title: 'PDF & Image Export', desc: 'A4 print-ready PDF and WhatsApp-shareable image in one click' },
  { icon: '✨', title: 'AI Bio Writer', desc: 'Let Gemini AI write your "About Me" paragraph automatically' },
  { icon: '📱', title: 'WhatsApp Share', desc: 'One-tap sharing directly to WhatsApp contacts' },
  { icon: '🔒', title: 'Privacy First', desc: 'Your data stays on your device — no account needed' },
];

const testimonials = [
  { name: 'Priya S.', city: 'Pune', text: 'Created my biodata in 10 minutes. The templates are gorgeous and the PDF was perfect!', stars: 5 },
  { name: 'Rahul M.', city: 'Bangalore', text: 'Finally a biodata maker that actually looks professional. My family loved the design.', stars: 5 },
  { name: 'Anjali K.', city: 'Mumbai', text: 'The WhatsApp share feature is brilliant. Sent it to 20 contacts instantly!', stars: 5 },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent">BioLum</span>
            <span className="text-xs bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-medium">Beta</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/templates" className="text-sm text-gray-600 hover:text-gray-900 transition-colors hidden sm:block">Templates</Link>
            <Link
              href="/create"
              className="bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors flex items-center gap-1.5"
            >
              Create Biodata <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-16 px-4 text-center bg-gradient-to-b from-rose-50/50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 text-rose-700 text-sm px-4 py-1.5 rounded-full mb-6 font-medium">
            <Sparkles className="w-4 h-4" />
            Free • No signup required • Download instantly
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Create Your
            <span className="bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent"> Marriage Biodata</span>
            <br />in Minutes
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Professional matrimonial biodata with 10+ beautiful templates. 
            Live preview, AI-assisted writing, instant PDF &amp; WhatsApp-ready export.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/create"
              className="inline-flex items-center justify-center gap-2 bg-rose-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-rose-700 transition-all shadow-lg shadow-rose-200 hover:shadow-rose-300"
            >
              Create My Biodata Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/templates"
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all border border-gray-200"
            >
              <Palette className="w-5 h-5" /> Browse Templates
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-4">✓ Free PDF download &nbsp; ✓ No watermark on images &nbsp; ✓ Works on mobile</p>
        </div>
      </section>

      {/* Template Preview Strip */}
      <section className="py-10 px-4 bg-gray-50 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {['Royal Tradition', 'Modern Minimal', 'Elegant Gold', 'Floral Bliss', 'Sacred Blue', 'Classic Navy', 'Nature Fresh'].map((name, i) => (
              <div key={name} className="flex-none w-32 sm:w-40">
                <div
                  className="h-48 sm:h-56 rounded-xl shadow-md border border-white/50"
                  style={{ background: ['#8B0000', '#2D2D2D', '#1A1A2E', '#9B2335', '#1B3A6B', '#0D1B2A', '#2D6A4F'][i] }}
                />
                <p className="text-xs text-center text-gray-600 mt-2 font-medium">{name}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-2">10+ templates — more coming soon</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Everything you need</h2>
          <p className="text-center text-gray-500 mb-12">More powerful than any other biodata maker</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="p-6 rounded-2xl border border-gray-100 hover:border-rose-100 hover:shadow-md transition-all bg-white">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Fill Your Details', desc: 'Enter personal, family, education & contact info in our easy step-by-step form', icon: '📝' },
              { step: '2', title: 'Choose a Template', desc: 'Pick from 10+ beautiful designs and customize colors & fonts', icon: '🎨' },
              { step: '3', title: 'Download & Share', desc: 'Get a print-ready PDF and a WhatsApp-shareable image instantly', icon: '📤' },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">{s.icon}</div>
                <div className="text-sm font-bold text-rose-600 mb-2">Step {s.step}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Loved by families across India</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">"{t.text}"</p>
                <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                <div className="text-xs text-gray-400">{t.city}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-rose-600 to-orange-500">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to create your biodata?</h2>
          <p className="text-rose-100 mb-8">Free, beautiful, and done in minutes. No signup required.</p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 bg-white text-rose-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-rose-50 transition-all shadow-lg"
          >
            Start Creating Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xl font-bold bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent">BioLum</span>
          <p className="text-sm text-gray-400">© 2024 BioLum. Free matrimonial biodata maker.</p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-900 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
