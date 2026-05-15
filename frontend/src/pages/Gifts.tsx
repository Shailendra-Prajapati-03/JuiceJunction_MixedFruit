import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Tag, Star, Copy, Check, Zap, Shield, Trophy } from 'lucide-react';
import api from '../utils/api';
import { GiftVoucher, Reward } from '../types';

/* ── Reward level config ─────────────────────────────────────────────────── */
const LEVEL_CONFIG = {
  Bronze:   { color: 'from-amber-700 to-amber-500',   icon: Shield, tiers: [100, 250, 500] },
  Silver:   { color: 'from-slate-500 to-slate-300',   icon: Star,   tiers: [250, 500, 1000] },
  Gold:     { color: 'from-yellow-500 to-amber-300',  icon: Trophy, tiers: [500, 1000, 2000] },
  Platinum: { color: 'from-cyan-500 to-blue-400',     icon: Zap,    tiers: [1000, 2000, 5000] },
};

const REWARD_TIERS = [
  { pts: 100,  label: '₹50 off voucher',   icon: '🏷️' },
  { pts: 250,  label: 'Free add-in',        icon: '🧊' },
  { pts: 500,  label: 'Free juice',         icon: '🥤' },
  { pts: 1000, label: 'Gold membership',    icon: '🏅' },
];

/* ── Voucher Card ────────────────────────────────────────────────────────── */
const VoucherCard: React.FC<{ voucher: GiftVoucher }> = ({ voucher }) => {
  const [copied, setCopied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(voucher.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = async () => {
    setApplying(true);
    setResult(null);
    try {
      const res = await api.post('/api/apply-voucher/', { code: voucher.code, order_total: 500 });
      setResult({ success: true, message: res.data.message });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Could not apply voucher.';
      setResult({ success: false, message: msg });
    } finally {
      setApplying(false);
    }
  };

  const discountLabel = voucher.discount_type === 'percentage'
    ? `${voucher.discount_value}% OFF`
    : `₹${voucher.discount_value} OFF`;

  const expiry = new Date(voucher.expiry_date);
  const daysLeft = Math.ceil((expiry.getTime() - Date.now()) / 86400000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-[2rem] border border-slate-100 p-0 relative overflow-hidden group hover:shadow-2xl transition-all duration-500"
    >
      {/* Premium Gift Card Image Banner */}
      <div className="relative h-40 overflow-hidden">
        <img 
          src="/gift_card.png" 
          alt="Gift Card"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-lg">
          <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">{discountLabel}</span>
        </div>
      </div>

      <div className="p-8 pt-0">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">{voucher.code}</p>
            <h4 className="text-xl font-black text-slate-900 tracking-tight leading-tight">{voucher.description}</h4>
          </div>
          <button 
            onClick={handleCopy}
            className={`p-2 rounded-xl transition-all ${copied ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' : 'bg-slate-50 text-slate-400 hover:text-primary-500'}`}
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>

      <div className="flex items-center justify-between pt-6 border-t border-slate-100">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Valid Until</span>
          <span className={`text-sm font-black ${daysLeft <= 7 ? 'text-red-500' : 'text-slate-700'}`}>
            {new Date(voucher.expiry_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </span>
        </div>
        <button
          onClick={handleApply}
          disabled={applying || daysLeft <= 0}
          className="px-8 py-3 bg-slate-900 text-white text-[10px] font-black rounded-xl hover:bg-primary-500 transition-all active:scale-95 disabled:opacity-30 shadow-lg shadow-slate-900/10"
        >
          {applying ? '...' : 'REDEEM VOUCHER'}
        </button>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`absolute inset-0 z-10 flex items-center justify-center p-8 text-center backdrop-blur-md ${result.success ? 'bg-primary-500/90' : 'bg-red-600/90'} text-white`}
        >
          <div className="space-y-4">
            <p className="text-sm font-black uppercase tracking-widest leading-tight">{result.message}</p>
            <button onClick={() => setResult(null)} className="text-[10px] font-black border-2 border-white px-6 py-2 rounded-full uppercase hover:bg-white hover:text-slate-900 transition-colors">Close</button>
          </div>
        </motion.div>
      )}
      </div>
    </motion.div>
  );
};

/* ── Reward Progress Card ────────────────────────────────────────────────── */
const RewardCard: React.FC<{ reward: Reward }> = ({ reward }) => {
  const cfg = LEVEL_CONFIG[reward.level] ?? LEVEL_CONFIG.Bronze;
  const LevelIcon = cfg.icon;
  const nextTier = REWARD_TIERS.find(t => t.pts > reward.points);
  const prevTier = [...REWARD_TIERS].reverse().find(t => t.pts <= reward.points);
  const progressFrom = prevTier?.pts ?? 0;
  const progressTo   = nextTier?.pts ?? reward.points;
  const progressPct  = progressTo > progressFrom
    ? ((reward.points - progressFrom) / (progressTo - progressFrom)) * 100
    : 100;

  return (
    <div className="bg-slate-900 rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl shadow-slate-900/40">
      <div className={`bg-gradient-to-br ${cfg.color} p-10 flex flex-col items-center gap-4 text-center`}>
        <div className="w-20 h-20 bg-white/20 rounded-[2rem] flex items-center justify-center text-white backdrop-blur-md">
          <LevelIcon className="w-10 h-10" />
        </div>
        <div className="text-white space-y-1">
          <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">{reward.level} Elite Status</p>
          <p className="text-6xl font-black tracking-tighter">{reward.points}</p>
          <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Available Points</p>
        </div>
      </div>

      {/* Progress to next reward */}
      <div className="px-8 py-6 space-y-4">
        {nextTier && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm font-black text-slate-700">
                Next: <span className="text-primary-500">{nextTier.icon} {nextTier.label}</span>
              </p>
              <p className="text-xs font-black text-slate-400">{reward.points_to_next} pts to go</p>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${cfg.color} rounded-full`}
                initial={{ width: '0%' }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <p className="text-xs text-slate-400 font-medium text-center">
              {reward.points} / {progressTo} points — {reward.next_reward_label}
            </p>
          </>
        )}

        {/* Reward tiers */}
        <div className="mt-4 space-y-2">
          {REWARD_TIERS.map(tier => {
            const unlocked = reward.points >= tier.pts;
            return (
              <div
                key={tier.pts}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors
                  ${unlocked ? 'bg-primary-50 border border-primary-100' : 'bg-slate-50 border border-slate-100'}`}
              >
                <span className="text-lg">{tier.icon}</span>
                <div className="flex-1">
                  <p className={`text-sm font-black ${unlocked ? 'text-primary-700' : 'text-slate-500'}`}>{tier.label}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{tier.pts} points required</p>
                </div>
                {unlocked && (
                  <span className="text-[9px] font-black text-primary-600 bg-primary-100 px-2 py-0.5 rounded-full uppercase">
                    Unlocked
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ── Gifts page ──────────────────────────────────────────────────────────── */
const Gifts: React.FC = () => {
  const [vouchers, setVouchers] = useState<GiftVoucher[]>([]);
  const [reward, setReward] = useState<Reward | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [vRes, rRes] = await Promise.all([
          api.get<GiftVoucher[]>('/api/gifts/'),
          api.get<Reward>('/api/rewards-summary/'),
        ]);
        if (Array.isArray(vRes.data)) setVouchers(vRes.data);
        if (rRes.data) setReward(rRes.data);
      } catch { /* silent */ } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="container mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <span className="text-primary-500 font-black text-xs uppercase tracking-[0.2em]">Perks & Rewards</span>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter mt-1">Gifts & Vouchers</h1>
        <p className="text-slate-400 font-medium mt-2">Exclusive deals and loyalty rewards for JuiceJunction fans.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* Vouchers (2/3 width on xl) */}
          <div className="xl:col-span-2 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary-50 rounded-2xl flex items-center justify-center">
                <Tag className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">Active Vouchers</h2>
                <p className="text-xs text-slate-400 font-medium">{vouchers.length} vouchers available</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {vouchers.map(v => <VoucherCard key={v.id} voucher={v} />)}
            </div>
          </div>

          {/* Reward card (1/3 width on xl) */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-50 rounded-2xl flex items-center justify-center">
                <Gift className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">Reward Points</h2>
                <p className="text-xs text-slate-400 font-medium">Earn points on every order</p>
              </div>
            </div>
            {reward ? (
              <RewardCard reward={reward} />
            ) : (
              <div className="bg-slate-50 rounded-3xl p-10 text-center text-slate-300">
                <Star className="w-12 h-12 mx-auto mb-3" />
                <p className="font-black">No reward data</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gifts;
