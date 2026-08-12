"use client";

import React, { useState, useMemo } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  CreditCard,
  Banknote,
  QrCode,
  Receipt,
  X,
  Check,
  ChevronDown,
  Tag,
  Percent,
  User,
  Coffee,
  UtensilsCrossed,
  Bed,
  Shirt,
  Sparkles,
  Car,
  Dumbbell,
  Wine,
  Clock,
  CheckCircle2,
  Printer,
  Share2,
  RotateCcw,
} from "lucide-react";

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "all", label: "All Items", icon: Store, color: "indigo" },
  { id: "food", label: "Food & Dining", icon: UtensilsCrossed, color: "amber" },
  { id: "beverages", label: "Beverages", icon: Coffee, color: "emerald" },
  { id: "room_service", label: "Room Service", icon: Bed, color: "violet" },
  { id: "laundry", label: "Laundry", icon: Shirt, color: "rose" },
  { id: "spa", label: "Spa & Wellness", icon: Sparkles, color: "pink" },
  { id: "transport", label: "Transport", icon: Car, color: "sky" },
  { id: "gym", label: "Gym & Sports", icon: Dumbbell, color: "orange" },
  { id: "bar", label: "Bar & Lounge", icon: Wine, color: "red" },
];

const PRODUCTS = [
  // Food
  { id: 1, name: "Club Sandwich", category: "food", price: 450, tax: 5, image: "🥪", description: "Grilled chicken, bacon & fresh veggies", popular: true },
  { id: 2, name: "Butter Chicken", category: "food", price: 620, tax: 5, image: "🍛", description: "Creamy tomato-based curry", popular: true },
  { id: 3, name: "Paneer Tikka", category: "food", price: 380, tax: 5, image: "🧆", description: "Marinated cottage cheese, tandoor-grilled" },
  { id: 4, name: "Caesar Salad", category: "food", price: 290, tax: 5, image: "🥗", description: "Romaine lettuce, croutons, parmesan" },
  { id: 5, name: "Grilled Salmon", category: "food", price: 890, tax: 5, image: "🐟", description: "Atlantic salmon with lemon butter sauce", popular: true },
  { id: 6, name: "Dal Makhani", category: "food", price: 320, tax: 5, image: "🫕", description: "Slow-cooked black lentils" },
  // Beverages
  { id: 7, name: "Fresh Lime Soda", category: "beverages", price: 120, tax: 18, image: "🍋", description: "Refreshing with mint & soda" },
  { id: 8, name: "Cold Coffee", category: "beverages", price: 180, tax: 18, image: "☕", description: "Blended with ice cream", popular: true },
  { id: 9, name: "Mango Lassi", category: "beverages", price: 150, tax: 18, image: "🥭", description: "Thick yogurt & mango blend" },
  { id: 10, name: "Green Tea", category: "beverages", price: 90, tax: 18, image: "🍵", description: "Premium Japanese green tea" },
  { id: 11, name: "Fresh OJ", category: "beverages", price: 130, tax: 18, image: "🍊", description: "Freshly squeezed orange juice" },
  // Room Service
  { id: 12, name: "Extra Pillow", category: "room_service", price: 0, tax: 0, image: "🛏️", description: "Additional pillow request" },
  { id: 13, name: "Early Check-in", category: "room_service", price: 500, tax: 18, image: "🔑", description: "Check-in before standard time" },
  { id: 14, name: "Late Checkout", category: "room_service", price: 750, tax: 18, image: "⏰", description: "Extended stay until 4 PM", popular: true },
  { id: 15, name: "Minibar Restock", category: "room_service", price: 200, tax: 18, image: "🧃", description: "Full minibar replenishment" },
  // Laundry
  { id: 16, name: "Shirt Wash & Iron", category: "laundry", price: 80, tax: 18, image: "👔", description: "Per piece, 4-hour service" },
  { id: 17, name: "Suit Dry Clean", category: "laundry", price: 350, tax: 18, image: "🧥", description: "Professional dry cleaning" },
  { id: 18, name: "Express Laundry", category: "laundry", price: 500, tax: 18, image: "⚡", description: "2-hour express service" },
  // Spa
  { id: 19, name: "Swedish Massage", category: "spa", price: 1800, tax: 18, image: "💆", description: "60-minute full body massage", popular: true },
  { id: 20, name: "Facial Treatment", category: "spa", price: 1200, tax: 18, image: "✨", description: "Deep cleansing & rejuvenation" },
  { id: 21, name: "Aromatherapy", category: "spa", price: 2200, tax: 18, image: "🕯️", description: "90-minute session" },
  // Transport
  { id: 22, name: "Airport Pickup", category: "transport", price: 800, tax: 5, image: "🚐", description: "One-way airport transfer" },
  { id: 23, name: "City Tour", category: "transport", price: 1500, tax: 5, image: "🗺️", description: "Half-day guided city tour", popular: true },
  { id: 24, name: "Car Hire (8hrs)", category: "transport", price: 2500, tax: 5, image: "🚗", description: "Premium car with driver" },
  // Gym
  { id: 25, name: "Personal Training", category: "gym", price: 1000, tax: 18, image: "🏋️", description: "60-min PT session" },
  { id: 26, name: "Yoga Class", category: "gym", price: 600, tax: 18, image: "🧘", description: "Group yoga session" },
  // Bar
  { id: 27, name: "Craft Cocktail", category: "bar", price: 450, tax: 18, image: "🍸", description: "Bartender's special creation", popular: true },
  { id: 28, name: "Premium Whiskey", category: "bar", price: 800, tax: 18, image: "🥃", description: "Single malt, 30ml" },
  { id: 29, name: "Beer (500ml)", category: "bar", price: 280, tax: 18, image: "🍺", description: "Domestic premium beer" },
];

const PAYMENT_METHODS = [
  { id: "cash", label: "Cash", icon: Banknote, color: "emerald" },
  { id: "card", label: "Card", icon: CreditCard, color: "indigo" },
  { id: "upi", label: "UPI / QR", icon: QrCode, color: "violet" },
  { id: "room_charge", label: "Room Charge", icon: Bed, color: "amber" },
];

const COLOR_MAP = {
  indigo: { bg: "bg-indigo-50 dark:bg-indigo-500/10", text: "text-indigo-600 dark:text-indigo-400", active: "bg-indigo-600 text-white", dot: "bg-indigo-500" },
  amber: { bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", active: "bg-amber-500 text-white", dot: "bg-amber-500" },
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", active: "bg-emerald-600 text-white", dot: "bg-emerald-500" },
  violet: { bg: "bg-violet-50 dark:bg-violet-500/10", text: "text-violet-600 dark:text-violet-400", active: "bg-violet-600 text-white", dot: "bg-violet-500" },
  rose: { bg: "bg-rose-50 dark:bg-rose-500/10", text: "text-rose-600 dark:text-rose-400", active: "bg-rose-600 text-white", dot: "bg-rose-500" },
  pink: { bg: "bg-pink-50 dark:bg-pink-500/10", text: "text-pink-600 dark:text-pink-400", active: "bg-pink-600 text-white", dot: "bg-pink-500" },
  sky: { bg: "bg-sky-50 dark:bg-sky-500/10", text: "text-sky-600 dark:text-sky-400", active: "bg-sky-600 text-white", dot: "bg-sky-500" },
  orange: { bg: "bg-orange-50 dark:bg-orange-500/10", text: "text-orange-600 dark:text-orange-400", active: "bg-orange-600 text-white", dot: "bg-orange-500" },
  red: { bg: "bg-red-50 dark:bg-red-500/10", text: "text-red-600 dark:text-red-400", active: "bg-red-600 text-white", dot: "bg-red-500" },
};

// ─── Sub Components ────────────────────────────────────────────────────────────

function ProductCard({ product, onAdd, quantity }) {
  const cat = CATEGORIES.find((c) => c.id === product.category);
  const color = COLOR_MAP[cat?.color || "indigo"];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -3 }}
      className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 cursor-pointer group shadow-sm hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-700 transition-all duration-200"
      onClick={() => onAdd(product)}
    >
      {product.popular && (
        <div className="absolute top-2.5 right-2.5 text-[9px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-full">
          Popular
        </div>
      )}
      <div className={`w-12 h-12 ${color.bg} rounded-xl flex items-center justify-center text-2xl mb-3`}>
        {product.image}
      </div>
      <h4 className="font-semibold text-slate-900 dark:text-white text-sm leading-tight mb-0.5 pr-8">
        {product.name}
      </h4>
      <p className="text-xs text-slate-400 dark:text-slate-500 mb-3 line-clamp-1">
        {product.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="font-bold text-slate-900 dark:text-white text-sm">
          {product.price === 0 ? "Free" : `₹${product.price}`}
        </span>
        <div className="flex items-center gap-1.5">
          {quantity > 0 && (
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${color.bg} ${color.text}`}>
              {quantity}
            </span>
          )}
          <div className="w-7 h-7 bg-indigo-600 group-hover:bg-indigo-700 text-white rounded-full flex items-center justify-center transition-colors shadow-sm shadow-indigo-500/30">
            <Plus size={14} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-center gap-3 py-3 border-b border-slate-100 dark:border-slate-800 last:border-none group"
    >
      <div className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-lg shrink-0">
        {item.image}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{item.name}</p>
        <p className="text-xs text-slate-400">₹{item.price} × {item.qty}</p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => onDecrease(item.id)}
          className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 flex items-center justify-center transition-colors"
        >
          <Minus size={11} />
        </button>
        <span className="w-5 text-center text-sm font-bold text-slate-900 dark:text-white">{item.qty}</span>
        <button
          onClick={() => onIncrease(item.id)}
          className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 flex items-center justify-center transition-colors"
        >
          <Plus size={11} />
        </button>
      </div>
      <span className="text-sm font-bold text-slate-900 dark:text-white w-16 text-right shrink-0">
        ₹{item.price * item.qty}
      </span>
      <button
        onClick={() => onRemove(item.id)}
        className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center justify-center transition-all ml-1"
      >
        <Trash2 size={12} />
      </button>
    </motion.div>
  );
}

function SuccessModal({ order, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 30 }}
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center"
      >
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Payment Done!</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-1">
          Order #{order.id} • {order.paymentLabel}
        </p>
        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
          ₹{order.total.toFixed(2)}
        </p>
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-6 text-left space-y-2">
          {order.items.map((i) => (
            <div key={i.id} className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">{i.name} × {i.qty}</span>
              <span className="font-semibold text-slate-900 dark:text-white">₹{i.price * i.qty}</span>
            </div>
          ))}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-xs text-slate-400">
            <span>Tax</span>
            <span>₹{order.tax.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium text-sm transition-colors">
            <Printer size={16} />
            Print Receipt
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm transition-colors"
          >
            New Order
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────────
export default function POSPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [guestRoom, setGuestRoom] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [orderCounter, setOrderCounter] = useState(1001);

  // ── Filtering ──────────────────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCat = activeCategory === "all" || p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  // ── Cart Operations ────────────────────────────────────────────────────────
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const increase = (id) => setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty: i.qty + 1 } : i));
  const decrease = (id) => setCart((prev) => {
    const item = prev.find((i) => i.id === id);
    if (item.qty === 1) return prev.filter((i) => i.id !== id);
    return prev.map((i) => i.id === id ? { ...i, qty: i.qty - 1 } : i);
  });
  const remove = (id) => setCart((prev) => prev.filter((i) => i.id !== id));
  const clearCart = () => setCart([]);

  const getQty = (id) => cart.find((i) => i.id === id)?.qty || 0;

  // ── Billing ────────────────────────────────────────────────────────────────
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const taxAmount = cart.reduce((sum, i) => sum + (i.price * i.qty * (i.tax / 100)), 0);
  const discountAmount = ((subtotal + taxAmount) * discountPercent) / 100;
  const total = subtotal + taxAmount - discountAmount;

  // ── Checkout ───────────────────────────────────────────────────────────────
  const handleCheckout = () => {
    if (cart.length === 0) return;
    const pm = PAYMENT_METHODS.find((p) => p.id === paymentMethod);
    setLastOrder({
      id: orderCounter,
      items: [...cart],
      subtotal,
      tax: taxAmount,
      discount: discountAmount,
      total,
      paymentLabel: pm?.label,
    });
    setOrderCounter((c) => c + 1);
    setShowSuccess(true);
  };

  const handleNewOrder = () => {
    setShowSuccess(false);
    setCart([]);
    setDiscountPercent(0);
    setGuestRoom("");
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)] -m-8">
        {/* ── Top Bar ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-8 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-none">Point of Sale</h1>
              <p className="text-xs text-slate-400 mt-0.5">Hotel Services & Billing</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-full font-semibold">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              POS Active
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
              <Clock size={12} />
              {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* ── Left: Product Catalog ──────────────────────────────────── */}
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950">
            {/* Category + Search Bar */}
            <div className="px-6 pt-5 pb-3 shrink-0">
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search services & products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none"
                />
              </div>
              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const active = activeCategory === cat.id;
                  const c = COLOR_MAP[cat.color];
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                        active ? c.active + " shadow-md" : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300"
                      }`}
                    >
                      <Icon size={13} />
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <Store size={48} className="mb-3 opacity-30" />
                  <p className="font-medium">No items found</p>
                  <p className="text-sm">Try a different category or search term</p>
                </div>
              ) : (
                <motion.div layout className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  <AnimatePresence>
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAdd={addToCart}
                        quantity={getQty(product.id)}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </div>

          {/* ── Right: Cart & Billing ──────────────────────────────────── */}
          <div className="w-[380px] shrink-0 flex flex-col bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800">
            {/* Cart Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-indigo-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {cart.reduce((s, i) => s + i.qty, 0)}
                    </span>
                  )}
                </div>
                <span className="font-bold text-slate-900 dark:text-white">Current Order</span>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-600 font-medium transition-colors"
                >
                  <RotateCcw size={12} />
                  Clear
                </button>
              )}
            </div>

            {/* Guest Room Input */}
            <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Guest name or Room no. (optional)"
                  value={guestRoom}
                  onChange={(e) => setGuestRoom(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none"
                />
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-2">
              <AnimatePresence>
                {cart.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full text-slate-400 py-12"
                  >
                    <ShoppingCart size={44} className="mb-3 opacity-25" />
                    <p className="font-medium text-sm">Cart is empty</p>
                    <p className="text-xs mt-1">Click on any item to add</p>
                  </motion.div>
                ) : (
                  cart.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onIncrease={increase}
                      onDecrease={decrease}
                      onRemove={remove}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Billing Summary */}
            {cart.length > 0 && (
              <div className="border-t border-slate-100 dark:border-slate-800 px-6 py-4 shrink-0 space-y-4">
                {/* Discount */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <Percent size={14} />
                    <span className="text-xs font-medium">Discount</span>
                  </div>
                  <div className="flex gap-1.5 ml-auto">
                    {[0, 5, 10, 15, 20].map((d) => (
                      <button
                        key={d}
                        onClick={() => setDiscountPercent(d)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                          discountPercent === d
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                      >
                        {d === 0 ? "None" : `${d}%`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Tax (GST)</span>
                    <span>₹{taxAmount.toFixed(2)}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                      <span>Discount ({discountPercent}%)</span>
                      <span>-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-slate-900 dark:text-white text-base pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Payment Method
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {PAYMENT_METHODS.map((pm) => {
                      const Icon = pm.icon;
                      const active = paymentMethod === pm.id;
                      const c = COLOR_MAP[pm.color];
                      return (
                        <button
                          key={pm.id}
                          onClick={() => setPaymentMethod(pm.id)}
                          className={`flex items-center gap-2.5 p-3 rounded-xl border text-sm font-semibold transition-all ${
                            active
                              ? `${c.bg} ${c.text} border-current`
                              : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                          }`}
                        >
                          <Icon size={16} />
                          {pm.label}
                          {active && <Check size={13} className="ml-auto" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Checkout Button */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCheckout}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2.5 shadow-xl shadow-indigo-500/30 transition-all"
                >
                  <Receipt size={18} />
                  Charge ₹{total.toFixed(2)}
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Success Modal ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showSuccess && lastOrder && (
          <SuccessModal order={lastOrder} onClose={handleNewOrder} />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
