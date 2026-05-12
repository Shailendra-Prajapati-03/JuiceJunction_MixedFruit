import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

/* ── tiny inline SVG icons (no extra deps needed) ── */
const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterXIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const AppleIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

const PlayStoreIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-1.4l2.585 1.493a1 1 0 010 1.4l-2.585 1.493-2.502-2.493 2.502-2.493zM5.864 3.457L16.8 9.79l-2.302 2.302-8.634-8.635z"/>
  </svg>
);

/* ── Column data ── */
const columns = [
  {
    title: 'About Juice',
    links: [
      { label: 'Our Juice Story', to: '/about#story' },
      { label: 'Fresh Ingredients', to: '/about#ingredients' },
      { label: 'Our Mission', to: '/about#mission' },
    ],
  },
  {
    title: 'Categories',
    links: [
      { label: 'Citrus Mixes', to: '/gallery' },
      { label: 'Tropical Juices', to: '/gallery' },
      { label: 'Detox Drinks', to: '/gallery' },
      { label: 'Protein Smoothies', to: '/gallery' },
    ],
  },
  {
    title: 'Customer Support',
    links: [
      { label: 'FAQs', to: '/support#faqs' },
      { label: 'Contact Us', to: '/support#contact' },
      { label: 'Delivery Info', to: '/support#delivery' },
      { label: 'Order Tracking', to: '/orders' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Terms & Conditions', to: '/terms' },
      { label: 'Refund Policy', to: '/refund-policy' },
      { label: 'Cancellation Policy', to: '/cancellation-policy' },
      { label: 'Cookie Policy', to: '/cookie-policy' },
    ],
  },
  {
    title: 'Quick Links',
    links: [
      { label: 'Build Your Juice', to: '/builder' },
      { label: 'Popular Combos', to: '/gallery' },
      { label: 'Offers', to: '/gifts' },
      { label: 'Subscription Plans', to: '/subscriptions' },
    ],
  },
  {
    title: 'For Vendors',
    links: [
      { label: 'Vendor Login', to: '/vendor/login' },
      { label: 'Vendor Registration', to: '/vendor/register' },
      { label: 'Vendor Agreement', to: '/vendor-agreement' },
    ],
  },
];

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      {/* ── Top: Newsletter banner ── */}
      <div className="border-b border-slate-700/50">
        <div className="container mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">Stay Fresh</h3>
              <p className="text-sm text-slate-400 font-medium">Get weekly recipes & exclusive offers.</p>
            </div>
          </div>
          <form className="flex w-full md:w-auto" onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 md:w-72 px-5 py-3 bg-slate-800 border border-slate-700 rounded-l-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-primary-500 hover:bg-primary-400 text-white text-sm font-black rounded-r-xl transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* ── Main: Logo + columns ── */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-8 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2 space-y-6 pr-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-primary-500/20 group-hover:rotate-6 transition-transform">
                JJ
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter leading-none">JuiceJunction</span>
                <span className="text-[9px] font-black text-primary-400 uppercase tracking-widest mt-1">Premium Blends</span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">
              Handcrafted mixed-fruit juices made from 100% fresh, seasonal produce. No preservatives, no concentrates — just pure goodness.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { Icon: InstagramIcon, label: 'Instagram' },
                { Icon: FacebookIcon, label: 'Facebook' },
                { Icon: TwitterXIcon, label: 'X / Twitter' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-primary-500 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map(col => (
            <div key={col.title} className="space-y-5">
              <h4 className="text-xs font-black uppercase tracking-[0.15em] text-slate-300">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-slate-500 hover:text-primary-400 font-medium transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom: App badges + copyright ── */}
      <div className="border-t border-slate-700/50">
        <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* App download badges */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
            >
              <AppleIcon />
              <div className="flex flex-col">
                <span className="text-[8px] font-medium text-slate-400 leading-none uppercase">Download on the</span>
                <span className="text-xs font-black text-white leading-tight">App Store</span>
              </div>
            </a>
            <a
              href="#"
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
            >
              <PlayStoreIcon />
              <div className="flex flex-col">
                <span className="text-[8px] font-medium text-slate-400 leading-none uppercase">Get it on</span>
                <span className="text-xs font-black text-white leading-tight">Google Play</span>
              </div>
            </a>
          </div>

          {/* Bottom links + copyright */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-4">
              <Link to="#" className="hover:text-slate-300 transition-colors">Web Accessibility</Link>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <Link to="/privacy-policy" className="hover:text-slate-300 transition-colors">Privacy</Link>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <Link to="/refund-policy" className="hover:text-slate-300 transition-colors">Refund</Link>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <Link to="/support#contact" className="hover:text-slate-300 transition-colors">Contact</Link>
            </div>
            <p>© {year} JuiceJunction. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
