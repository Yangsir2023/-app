/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  PawPrint, Search, Bell, LayoutGrid, MapPin, ArrowRight, Heart,
  HeartHandshake, Plus, Home as HomeIcon, User as UserIcon, ArrowLeft,
  Share2, Mars, Venus, CheckCircle2, MessageCircle, Send, Building2,
  Home as BuildingHome, ClipboardList, Stethoscope, Navigation, ChevronRight,
  Settings, LogOut, ShieldCheck, Edit3, Loader2, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Pet, RescueStation, FAQ, Application } from './types';
import {
  fetchPets, fetchStations, fetchFAQs, fetchApplications,
  submitApplication, fetchFavoritePetIds, toggleFavorite, ApplicationPayload
} from './lib/api';

type Screen = 'home' | 'detail' | 'form' | 'center' | 'profile';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [favoritePetIds, setFavoritePetIds] = useState<Set<string>>(new Set());

  // 初始化加载收藏列表
  useEffect(() => {
    fetchFavoritePetIds()
      .then(ids => setFavoritePetIds(new Set(ids)))
      .catch(() => {});
  }, []);

  const navigateTo = (screen: Screen, pet: Pet | null = null) => {
    if (pet) setSelectedPet(pet);
    setCurrentScreen(screen);
    window.scrollTo(0, 0);
  };

  const handleToggleFavorite = useCallback(async (petId: string) => {
    try {
      const result = await toggleFavorite(petId);
      setFavoritePetIds(prev => {
        const next = new Set(prev);
        result.favorited ? next.add(petId) : next.delete(petId);
        return next;
      });
    } catch (e) {
      console.error('收藏操作失败', e);
    }
  }, []);

  return (
    <div className="min-h-screen bg-surface pb-24">
      <AnimatePresence mode="wait">
        {currentScreen === 'home' && (
          <HomeScreen
            key="home"
            onPetClick={(pet) => navigateTo('detail', pet)}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            favoritePetIds={favoritePetIds}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
        {currentScreen === 'detail' && selectedPet && (
          <DetailScreen
            key="detail"
            pet={{ ...selectedPet, isFavorite: favoritePetIds.has(selectedPet.id) }}
            onBack={() => navigateTo('home')}
            onAdopt={() => navigateTo('form')}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
        {currentScreen === 'form' && selectedPet && (
          <FormScreen
            key="form"
            pet={selectedPet}
            onBack={() => navigateTo('detail')}
            onSuccess={() => navigateTo('profile')}
          />
        )}
        {currentScreen === 'center' && (
          <CenterScreen key="center" />
        )}
        {currentScreen === 'profile' && (
          <ProfileScreen key="profile" />
        )}
      </AnimatePresence>

      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/80 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,0,0,0.04)] rounded-t-[2rem]">
        <NavButton active={currentScreen === 'home'} icon={<HomeIcon size={24} />} label="首页" onClick={() => navigateTo('home')} />
        <NavButton active={currentScreen === 'center'} icon={<HeartHandshake size={24} />} label="领养中心" onClick={() => navigateTo('center')} />
        <NavButton active={currentScreen === 'profile'} icon={<UserIcon size={24} />} label="个人中心" onClick={() => navigateTo('profile')} />
      </nav>
    </div>
  );
}

function NavButton({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center px-5 py-2 rounded-[1.5rem] transition-all active:scale-90 ${active ? 'bg-primary/10 text-primary' : 'text-stone-400'}`}>
      <div className={active ? 'fill-current' : ''}>{icon}</div>
      <span className={`text-[11px] mt-1 font-medium ${active ? 'font-bold' : ''}`}>{label}</span>
    </button>
  );
}

// =====================================================================
// Loading / Error helpers
// =====================================================================
function LoadingState({ text = '加载中...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3 text-on-surface-variant">
      <Loader2 size={36} className="animate-spin text-primary" />
      <p className="text-sm">{text}</p>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-on-surface-variant px-6">
      <AlertCircle size={36} className="text-red-400" />
      <p className="text-sm text-center">{message}</p>
      <button onClick={onRetry} className="bg-primary text-on-primary px-6 py-2 rounded-full text-sm font-bold">重试</button>
    </div>
  );
}

// =====================================================================
// HomeScreen
// =====================================================================
function HomeScreen({ onPetClick, activeCategory, setActiveCategory, favoritePetIds, onToggleFavorite }: {
  onPetClick: (pet: Pet) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  favoritePetIds: Set<string>;
  onToggleFavorite: (id: string) => void;
  key?: string;
}) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllPets, setShowAllPets] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [searchText, setSearchText] = useState('');

  const loadPets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPets({ category: activeCategory, search: searchText || undefined });
      setPets(data);
    } catch (e) {
      setError('加载宠物数据失败，请检查后端服务是否已启动');
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchText]);

  useEffect(() => { loadPets(); }, [loadPets]);

  const displayPets = showAllPets ? pets : pets.slice(0, 5);
  const categories = [
    { id: 'all', label: '全部', icon: <LayoutGrid size={20} /> },
    { id: 'dog', label: '狗狗', icon: <PawPrint size={20} /> },
    { id: 'cat', label: '猫咪', icon: <PawPrint size={20} /> },
    { id: 'small', label: '小动物', icon: <PawPrint size={20} /> },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-6 pt-20">
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-surface/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <PawPrint className="text-primary" size={24} />
          <h1 className="font-bold text-xl text-primary">宠物领养</h1>
        </div>
        <div className="flex gap-4">
          <button className="text-stone-500"><Search size={24} /></button>
          <button className="text-stone-500"><Bell size={24} /></button>
        </div>
      </header>

      <AnimatePresence>
        {showGuide && (
          <DetailModal title="领养指南" onBack={() => setShowGuide(false)}>
            <div className="space-y-6 pb-10">
              <div className="aspect-video rounded-3xl overflow-hidden mb-6">
                <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Guide" referrerPolicy="no-referrer" />
              </div>
              <h3 className="text-2xl font-bold text-primary">新手领养必备手册</h3>
              <p className="text-on-surface-variant leading-relaxed">欢迎加入领养家庭！在迎接新成员之前，请确保您已经做好了以下准备：</p>
              <div className="space-y-4">
                <GuideSection title="心理准备" content="宠物需要长期的陪伴和照顾，请确保您有足够的耐心和责任心来应对它们可能带来的麻烦。" />
                <GuideSection title="环境准备" content="为宠物准备舒适的窝、餐具、牵引绳、猫砂盆等基础生活用品，并确保居家环境安全。" />
                <GuideSection title="经济准备" content="领养虽然免费，但后续的口粮、医疗、美容等开销需要您有稳定的经济能力承担。" />
              </div>
            </div>
          </DetailModal>
        )}
      </AnimatePresence>

      <section className="mt-4">
        <div className="mb-6">
          <h2 className="text-[2.75rem] font-black leading-tight text-on-surface-variant tracking-tight mb-2">
            找到你的<br /><span className="text-primary">新伙伴</span>
          </h2>
          <p className="text-on-surface-variant/70 text-lg">开启一段充满温情的领养旅程</p>
        </div>
        <div className="relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="text-outline" size={20} />
          </div>
          <input
            className="w-full h-16 pl-14 pr-6 rounded-2xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/60 text-lg transition-all"
            placeholder="搜索宠物品种、性格..."
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </section>

      <section className="mt-10 overflow-x-auto hide-scrollbar -mx-6 px-6">
        <div className="flex gap-4 pb-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setShowAllPets(false); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all active:scale-95 ${activeCategory === cat.id ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'}`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-2xl font-bold">为您推荐</h3>
          <button onClick={() => setShowAllPets(!showAllPets)} className="text-primary font-bold text-sm flex items-center gap-1">
            {showAllPets ? '收起' : '查看全部'} <ArrowRight size={16} className={showAllPets ? 'rotate-90 transition-transform' : ''} />
          </button>
        </div>

        {loading && <LoadingState text="正在加载宠物..." />}
        {error && <ErrorState message={error} onRetry={loadPets} />}
        {!loading && !error && (
          <div className="grid grid-cols-2 gap-4">
            {displayPets.map((pet, idx) => (
              <div
                key={pet.id}
                className={`${idx === 0 && activeCategory === 'all' && !showAllPets ? 'col-span-2' : 'col-span-1'} group cursor-pointer`}
                onClick={() => onPetClick(pet)}
              >
                <div className="relative overflow-hidden rounded-3xl bg-surface-container-lowest shadow-sm">
                  <div className={`${idx === 0 && activeCategory === 'all' && !showAllPets ? 'aspect-[16/10]' : 'aspect-square'} overflow-hidden`}>
                    <img src={pet.image} alt={pet.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h4 className={`${idx === 0 && activeCategory === 'all' && !showAllPets ? 'text-2xl' : 'text-lg'} font-bold text-on-surface`}>{pet.name}</h4>
                        <p className="text-on-surface-variant/70 text-xs">{pet.breed} • {pet.age}</p>
                      </div>
                      {idx === 0 && activeCategory === 'all' && !showAllPets && (
                        <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                          {pet.gender === 'male' ? '弟弟' : '妹妹'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1 text-secondary font-medium">
                        <MapPin size={idx === 0 && activeCategory === 'all' && !showAllPets ? 18 : 14} />
                        <span className="text-xs">{pet.distance}</span>
                      </div>
                      {idx === 0 && activeCategory === 'all' && !showAllPets ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); onPetClick(pet); }}
                          className="bg-primary text-on-primary px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all"
                        >
                          立即领养
                        </button>
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); onToggleFavorite(pet.id); }}
                          className="active:scale-90 transition-transform"
                        >
                          <Heart size={20} className={favoritePetIds.has(pet.id) ? 'text-primary fill-current' : 'text-stone-300'} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 mb-12">
        <div onClick={() => setShowGuide(true)} className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary to-primary-container p-8 text-on-primary cursor-pointer active:scale-[0.98] transition-transform">
          <div className="relative z-10 max-w-[60%]">
            <h4 className="text-2xl font-black mb-2">需要帮助？</h4>
            <p className="text-sm opacity-90 mb-4">了解领养流程，给它一个温暖的家。</p>
            <button className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-white/30 transition-all">领养指南</button>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-20">
            <HeartHandshake size={180} />
          </div>
        </div>
      </section>

      <button className="fixed bottom-28 right-6 w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-2xl shadow-primary/30 z-40 active:scale-95 transition-all">
        <Plus size={28} />
      </button>
    </motion.div>
  );
}

function GuideSection({ title, content }: { title: string; content: string }) {
  return (
    <div className="bg-surface-container-low p-5 rounded-2xl">
      <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
        <div className="w-1.5 h-4 bg-primary rounded-full"></div>
        {title}
      </h4>
      <p className="text-on-surface-variant text-sm leading-relaxed">{content}</p>
    </div>
  );
}

// =====================================================================
// DetailScreen
// =====================================================================
function DetailScreen({ pet, onBack, onAdopt, onToggleFavorite }: {
  pet: Pet; onBack: () => void; onAdopt: () => void;
  onToggleFavorite: (id: string) => void; key?: string;
}) {
  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="bg-surface min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-surface/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="text-primary"><ArrowLeft size={24} /></button>
          <h1 className="font-bold text-xl text-primary">宠物详情</h1>
        </div>
        <div className="flex gap-4">
          <button onClick={() => onToggleFavorite(pet.id)} className="text-primary">
            <Heart size={24} className={pet.isFavorite ? 'fill-current' : ''} />
          </button>
          <button className="text-primary"><Share2 size={24} /></button>
        </div>
      </header>

      <main className="pt-16 pb-32">
        <section className="px-4 pt-2">
          <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar rounded-3xl h-[450px]">
            {(pet.images && pet.images.length > 0 ? pet.images : [pet.image]).map((img, i) => (
              <div key={i} className="flex-none w-full h-full snap-center">
                <img src={img} alt={`${pet.name}-${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
          {pet.images && pet.images.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-4">
              {pet.images.map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/20"></div>)}
            </div>
          )}
        </section>

        <section className="mt-8 px-6">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-4xl font-black text-on-surface mb-2">{pet.name}</h1>
              <div className="flex items-center gap-2 text-primary font-medium">
                <MapPin size={18} /><span>上海 · 浦东新区</span>
              </div>
            </div>
            <div className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-full flex items-center gap-1">
              {pet.gender === 'male' ? <Mars size={18} /> : <Venus size={18} />}
              <span className="text-sm font-bold">{pet.gender === 'male' ? '男生' : '女生'}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <InfoCard label="年龄" value={pet.age} />
            <InfoCard label="品种" value={pet.breed} />
            <InfoCard label="体重" value={pet.weight} />
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><span className="w-1.5 h-6 bg-primary rounded-full"></span>性格特质</h3>
            <div className="flex flex-wrap gap-3">
              {pet.tags.map(tag => <span key={tag} className="bg-tertiary-fixed text-on-tertiary-fixed px-5 py-2.5 rounded-full text-sm font-medium">{tag}</span>)}
            </div>
          </div>

          <div className="mb-8 p-6 bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><span className="w-1.5 h-6 bg-secondary rounded-full"></span>健康状况</h3>
            <div className="space-y-4">
              <HealthItem label="疫苗情况" status={pet.health.vaccination ? '已完成' : '未完成'} />
              <HealthItem label="绝育情况" status={pet.health.sterilization ? '已绝育' : '未绝育'} />
              <HealthItem label="定期驱虫" status={pet.health.deworming ? '已驱虫' : '未驱虫'} />
              <p className="text-on-surface-variant leading-relaxed mt-4">{pet.health.description}</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><span className="w-1.5 h-6 bg-primary-container rounded-full"></span>我的故事</h3>
            <p className="text-on-surface-variant leading-loose">{pet.story}</p>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 w-full p-6 bg-white/80 backdrop-blur-xl z-50">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button className="p-4 bg-surface-container-high text-on-surface rounded-2xl active:scale-95 transition-all"><MessageCircle size={24} /></button>
          <button onClick={onAdopt} className="flex-1 bg-gradient-to-r from-primary to-primary-container text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all text-lg">
            立即申请领养
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-container-low p-4 rounded-2xl flex flex-col items-center justify-center">
      <span className="text-on-surface-variant text-xs mb-1">{label}</span>
      <span className="font-bold text-lg text-on-surface text-center">{value}</span>
    </div>
  );
}

function HealthItem({ label, status }: { label: string; status: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-surface-container-highest last:border-0">
      <span className="text-on-surface-variant">{label}</span>
      <div className="flex items-center text-secondary gap-1">
        <CheckCircle2 size={18} /><span className="font-medium">{status}</span>
      </div>
    </div>
  );
}

// =====================================================================
// FormScreen — 真实提交到后端
// =====================================================================
function FormScreen({ pet, onBack, onSuccess }: { pet: Pet; onBack: () => void; onSuccess: () => void; key?: string }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [housingType, setHousingType] = useState<'apt' | 'house'>('apt');
  const [experience, setExperience] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { setFeedback({ type: 'error', msg: '请先同意领养协议' }); return; }
    if (!name || !phone || !address) { setFeedback({ type: 'error', msg: '请填写所有必填项' }); return; }

    setSubmitting(true);
    setFeedback(null);
    try {
      const payload: ApplicationPayload = {
        petId: pet.id, petName: pet.name, petImage: pet.image,
        breed: pet.breed, age: pet.age,
        applicantName: name, phone, address, housingType, experience,
      };
      const result = await submitApplication(payload);
      setFeedback({ type: 'success', msg: result.message });
      setTimeout(() => onSuccess(), 1500);
    } catch (err: unknown) {
      setFeedback({ type: 'error', msg: err instanceof Error ? err.message : '提交失败，请重试' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="bg-surface min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-surface/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="text-primary"><ArrowLeft size={24} /></button>
          <h1 className="font-bold text-xl text-primary">领养申请</h1>
        </div>
      </header>

      <main className="pt-20 px-6 pb-12 max-w-md mx-auto">
        <section className="flex flex-col gap-4 mt-4">
          <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden">
            <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            <div className="absolute bottom-4 left-6">
              <span className="bg-primary text-on-primary px-3 py-1 rounded-full text-[10px] font-bold tracking-widest mb-2 inline-block uppercase">Adoption Form</span>
              <h2 className="text-white text-2xl font-bold">开启一段新缘分</h2>
            </div>
          </div>
          <p className="text-on-surface-variant leading-relaxed px-1">领养不仅是给它们一个家，更是为您的人生增添一份温暖的陪伴。请如实填写以下信息。</p>
        </section>

        <form className="mt-8 flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <FormSectionHeader title="基本信息" />
            <div className="space-y-4">
              <FormInput label="姓名" placeholder="请输入您的真实姓名" value={name} onChange={setName} />
              <FormInput label="联系电话" placeholder="请输入您的手机号码" type="tel" value={phone} onChange={setPhone} />
              <FormInput label="居住地址" placeholder="请输入您的详细居住地址" value={address} onChange={setAddress} />
            </div>
          </div>

          <div className="space-y-6">
            <FormSectionHeader title="住房情况" />
            <div className="grid grid-cols-2 gap-4">
              <HousingOption icon={<Building2 size={24} />} label="公寓" id="apt" selected={housingType === 'apt'} onSelect={() => setHousingType('apt')} />
              <HousingOption icon={<BuildingHome size={24} />} label="自建房/别墅" id="house" selected={housingType === 'house'} onSelect={() => setHousingType('house')} />
            </div>
          </div>

          <div className="space-y-6">
            <FormSectionHeader title="养宠经历" />
            <textarea
              className="w-full bg-surface-container-low border-none rounded-2xl px-4 py-4 text-on-surface placeholder:text-stone-400 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              placeholder='请简述您过去的养宠经验，如果没有请填"无"。'
              rows={4}
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 h-5 w-5 rounded border-none bg-surface-container-highest text-primary focus:ring-0" />
              <span className="text-xs text-on-surface-variant leading-tight">
                我已阅读并完全理解并<span className="text-primary font-bold">同意领养协议</span>，承诺将为领养的动物提供必要的医疗照顾、充足的食物和关爱，绝不遗弃。
              </span>
            </label>

            {feedback && (
              <div className={`p-4 rounded-2xl text-sm font-medium ${feedback.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                {feedback.msg}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-16 bg-gradient-to-r from-primary to-primary-container text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              {submitting ? '提交中...' : '提交申请'}
            </button>
          </div>
        </form>
      </main>
    </motion.div>
  );
}

function FormSectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-1.5 h-6 bg-primary rounded-full"></div>
      <h3 className="text-lg font-bold text-on-surface">{title}</h3>
    </div>
  );
}

function FormInput({ label, placeholder, type = 'text', value, onChange }: {
  label: string; placeholder: string; type?: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <label className="absolute -top-2 left-4 bg-surface px-1 text-[10px] text-primary font-bold">{label}</label>
      <input
        className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 text-on-surface placeholder:text-stone-400 focus:ring-2 focus:ring-primary/20 transition-all"
        placeholder={placeholder} type={type} value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function HousingOption({ icon, label, id, selected, onSelect }: {
  icon: React.ReactNode; label: string; id: string; selected: boolean; onSelect: () => void;
}) {
  return (
    <button type="button" onClick={onSelect} className="cursor-pointer w-full">
      <div className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${selected ? 'border-primary bg-primary/5' : 'border-transparent bg-surface-container-low'}`}>
        <div className={`mb-2 ${selected ? 'text-primary' : 'text-stone-400'}`}>{icon}</div>
        <span className={`text-sm font-medium ${selected ? 'text-primary' : 'text-on-surface-variant'}`}>{label}</span>
      </div>
    </button>
  );
}

// =====================================================================
// CenterScreen
// =====================================================================
function CenterScreen({ key: _key }: { key?: string }) {
  const [stations, setStations] = useState<RescueStation[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDetail, setActiveDetail] = useState<'process' | 'health' | null>(null);

  useEffect(() => {
    Promise.all([fetchStations(), fetchFAQs()])
      .then(([s, f]) => { setStations(s); setFaqs(f); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-6 pt-20 space-y-8">
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-surface/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <PawPrint className="text-primary" size={24} />
          <h1 className="font-bold text-xl text-primary">领养中心</h1>
        </div>
        <button className="text-primary"><Search size={24} /></button>
      </header>

      <AnimatePresence>
        {activeDetail === 'process' && (
          <DetailModal title="领养流程" onBack={() => setActiveDetail(null)}>
            <div className="space-y-8">
              <StepItem number="01" title="在线咨询" desc="在APP内选择心仪的宠物，与救助站工作人员进行初步沟通，了解宠物的性格和生活习惯。" image="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=400" />
              <StepItem number="02" title="提交申请" desc="填写详细的领养申请表，包括您的家庭环境、养宠经验等信息，以便我们进行匹配审核。" image="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80&w=400" />
              <StepItem number="03" title="实地互动" desc="审核通过后，邀请您前往救助点与宠物进行实地互动，观察彼此的适应情况。" image="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=400" />
              <StepItem number="04" title="正式领养" desc="签署领养协议，办理相关手续，带它回家开启幸福的新生活。我们会进行定期回访。" image="https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=400" />
            </div>
          </DetailModal>
        )}
        {activeDetail === 'health' && (
          <DetailModal title="健康档案" onBack={() => setActiveDetail(null)}>
            <div className="space-y-6">
              <div className="bg-surface-container-low p-6 rounded-3xl">
                <h4 className="font-bold text-lg mb-4 flex items-center gap-2"><Stethoscope className="text-primary" size={20} />基础免疫</h4>
                <p className="text-on-surface-variant text-sm leading-relaxed">所有待领养宠物均已完成基础疫苗接种（猫三联/犬六联）及狂犬疫苗。领养后需按年度进行加强免疫。</p>
              </div>
              <div className="bg-surface-container-low p-6 rounded-3xl">
                <h4 className="font-bold text-lg mb-4 flex items-center gap-2"><CheckCircle2 className="text-secondary" size={20} />绝育情况</h4>
                <p className="text-on-surface-variant text-sm leading-relaxed">成年宠物在领养前均已完成绝育手术。幼年宠物领养时需签署绝育承诺书，并在适龄时完成手术。</p>
              </div>
              <div className="bg-surface-container-low p-6 rounded-3xl">
                <h4 className="font-bold text-lg mb-4 flex items-center gap-2"><Plus className="text-tertiary" size={20} />日常驱虫</h4>
                <p className="text-on-surface-variant text-sm leading-relaxed">救助站每月进行一次体内外驱虫。领养人需保持每月一次的预防性驱虫习惯。</p>
              </div>
              <img src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=800" alt="Health" className="w-full h-48 object-cover rounded-3xl mt-4" referrerPolicy="no-referrer" />
            </div>
          </DetailModal>
        )}
      </AnimatePresence>

      <section>
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">领养指南</h2>
          <span className="text-primary text-sm font-medium">查看全部</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 relative aspect-[16/9] rounded-3xl overflow-hidden group">
            <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800" alt="Guide" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
              <span className="bg-primary text-on-primary px-3 py-1 rounded-full text-[10px] w-fit mb-2">必备知识</span>
              <h3 className="text-white text-xl font-bold">新手贴士：迎接新成员的头一周</h3>
            </div>
          </div>
          <button onClick={() => setActiveDetail('process')} className="relative bg-surface-container-low rounded-3xl flex flex-col justify-between aspect-square overflow-hidden group active:scale-95 transition-all">
            <img src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=400" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity" alt="" />
            <div className="relative p-5 flex flex-col h-full justify-between">
              <div className="bg-secondary/10 w-12 h-12 rounded-full flex items-center justify-center text-secondary"><ClipboardList size={24} /></div>
              <div className="text-left"><h4 className="font-bold text-lg leading-tight mb-1">领养流程</h4><p className="text-on-surface-variant text-xs">四步开启幸福生活</p></div>
            </div>
          </button>
          <button onClick={() => setActiveDetail('health')} className="relative bg-tertiary-container/10 rounded-3xl flex flex-col justify-between aspect-square overflow-hidden group active:scale-95 transition-all">
            <img src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=400" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity" alt="" />
            <div className="relative p-5 flex flex-col h-full justify-between">
              <div className="bg-tertiary/10 w-12 h-12 rounded-full flex items-center justify-center text-tertiary"><Stethoscope size={24} /></div>
              <div className="text-left"><h4 className="font-bold text-lg leading-tight mb-1">健康档案</h4><p className="text-on-surface-variant text-xs">疫苗与日常护理</p></div>
            </div>
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold tracking-tight mb-6">附近救助点</h2>
        <div className="space-y-4">
          <div className="w-full h-48 rounded-3xl overflow-hidden relative shadow-sm">
            <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800" alt="Map" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2">
              <div className="bg-primary text-on-primary p-2 rounded-full shadow-lg animate-pulse"><MapPin size={16} /></div>
            </div>
          </div>
          {loading ? (
            <LoadingState text="加载救助站..." />
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
              {stations.map(station => (
                <div key={station.id} className="flex-none w-72 bg-surface-container-lowest p-4 rounded-3xl snap-start shadow-sm">
                  <div className="flex items-start gap-4">
                    <img src={station.image} className="w-16 h-16 rounded-2xl object-cover" alt={station.name} referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="font-bold text-base">{station.name}</h4>
                      <div className="flex items-center text-xs text-on-surface-variant mt-1">
                        <Navigation size={12} className="mr-1" />{station.distance} · {station.status}
                      </div>
                      <div className="mt-2 flex gap-1">
                        {station.tags.map(tag => <span key={tag} className="bg-secondary-fixed text-on-secondary-fixed text-[10px] px-2 py-0.5 rounded-full">{tag}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="pb-8">
        <h2 className="text-2xl font-bold tracking-tight mb-6">常见问题</h2>
        {loading ? <LoadingState /> : (
          <div className="space-y-3">
            {faqs.map(faq => (
              <div key={faq.id} className="bg-surface-container-low rounded-2xl p-5 flex items-center justify-between group active:bg-surface-container-high transition-colors">
                <div>
                  <p className="font-bold text-sm">{faq.question}</p>
                  <p className="text-on-surface-variant text-xs mt-1">{faq.answer.substring(0, 30)}...</p>
                </div>
                <ChevronRight size={20} className="text-on-surface-variant group-hover:translate-x-1 transition-transform" />
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="bg-gradient-to-br from-primary to-primary-container p-6 rounded-3xl text-on-primary shadow-xl shadow-primary/20 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-2">想为TA们出一份力？</h3>
          <p className="text-sm opacity-90 mb-4 leading-relaxed">除了领养，您还可以通过捐赠物资或申请义工来帮助流浪动物。</p>
          <button className="bg-white text-primary px-6 py-2.5 rounded-full text-sm font-bold active:scale-95 transition-transform">联系我们</button>
        </div>
        <HeartHandshake size={120} className="absolute -right-4 -bottom-4 opacity-10 rotate-12" />
      </div>
    </motion.div>
  );
}

// =====================================================================
// ProfileScreen
// =====================================================================
function ProfileScreen({ key: _key }: { key?: string }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications()
      .then(setApplications)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-6 pt-20 space-y-8 max-w-2xl mx-auto">
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-surface/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <PawPrint className="text-primary" size={24} />
          <h1 className="font-bold text-xl text-primary">个人中心</h1>
        </div>
        <button className="text-primary"><Search size={24} /></button>
      </header>

      <section className="relative">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-surface-container-lowest shadow-sm">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400" alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-primary text-on-primary w-8 h-8 rounded-full flex items-center justify-center border-2 border-surface shadow-sm">
              <Edit3 size={18} />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-on-surface tracking-tight">爱心领养人</h2>
            <p className="text-on-surface-variant text-sm mt-1">爱宠达人 · 共 {applications.length} 条申请记录</p>
            <div className="flex gap-2 mt-3">
              <span className="px-3 py-1 bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold rounded-full uppercase tracking-wider">资深救助者</span>
              <span className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold rounded-full uppercase tracking-wider">信誉极佳</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container-low p-6 rounded-3xl flex flex-col justify-between aspect-square">
          <Heart size={32} className="text-primary" />
          <div><h3 className="text-on-surface font-bold text-lg">我的收藏</h3><p className="text-on-surface-variant text-sm mt-1">已收藏宠物</p></div>
        </div>
        <div className="bg-secondary-container p-6 rounded-3xl flex flex-col justify-between aspect-square">
          <ShieldCheck size={32} className="text-secondary" />
          <div><h3 className="text-on-secondary-container font-bold text-lg">实名认证</h3><p className="text-on-secondary-container/70 text-sm mt-1">已通过审核</p></div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="font-bold text-xl">我的申请</h3>
          <span className="text-primary text-sm font-medium">查看全部</span>
        </div>
        {loading ? <LoadingState text="加载申请记录..." /> : applications.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant">
            <HeartHandshake size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">暂无领养申请记录</p>
            <p className="text-xs mt-1 opacity-70">去首页挑选心仪的宠物吧 🐾</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map(app => (
              <div key={app.id} className="bg-surface-container-lowest rounded-3xl p-4 flex gap-4 shadow-sm active:scale-[0.98] transition-all">
                <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={app.petImage} alt={app.petName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-grow flex flex-col justify-between py-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-lg">{app.petName}</h4>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${app.status === 'pending' ? 'bg-orange-100 text-primary' : app.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {app.status === 'pending' ? '审核中' : app.status === 'approved' ? '已通过' : '已拒绝'}
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-xs">{app.breed} · {app.age} · {app.location}</p>
                  <div className="w-full bg-surface-container-high h-1 rounded-full mt-2">
                    <div className={`h-full rounded-full transition-all duration-1000 ${app.status === 'pending' ? 'bg-primary' : app.status === 'approved' ? 'bg-green-500' : 'bg-red-400'}`} style={{ width: `${app.progress}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-surface-container-low rounded-3xl overflow-hidden">
        <div className="divide-y divide-surface-container-high">
          <ProfileLink icon={<Settings size={20} />} label="账号设置" />
          <ProfileLink icon={<Bell size={20} />} label="通知偏好" />
          <ProfileLink icon={<LogOut size={20} />} label="退出登录" isError />
        </div>
      </section>
    </motion.div>
  );
}

function ProfileLink({ icon, label, isError }: { icon: React.ReactNode; label: string; isError?: boolean }) {
  return (
    <button className={`w-full flex items-center justify-between px-6 py-5 hover:bg-surface-container-high transition-colors ${isError ? 'text-red-500' : ''}`}>
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isError ? 'bg-red-100' : 'bg-surface-container-lowest text-primary'}`}>{icon}</div>
        <span className="font-medium">{label}</span>
      </div>
      {!isError && <ChevronRight size={20} className="text-on-surface-variant" />}
    </button>
  );
}

function DetailModal({ title, onBack, children }: { title: string; onBack: () => void; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed inset-0 z-[60] bg-surface overflow-y-auto pb-24">
      <header className="sticky top-0 left-0 right-0 z-50 flex items-center gap-4 px-6 py-4 bg-surface/80 backdrop-blur-md">
        <button onClick={onBack} className="text-primary"><ArrowLeft size={24} /></button>
        <h1 className="font-bold text-xl text-primary">{title}</h1>
      </header>
      <div className="px-6 pt-4">{children}</div>
    </motion.div>
  );
}

function StepItem({ number, title, desc, image }: { number: string; title: string; desc: string; image: string }) {
  return (
    <div className="flex gap-6">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">{number}</div>
        <div className="flex-1 w-px bg-outline-variant/30 my-2"></div>
      </div>
      <div className="flex-1 pb-8">
        <h4 className="text-xl font-bold mb-2">{title}</h4>
        <p className="text-on-surface-variant text-sm leading-relaxed mb-4">{desc}</p>
        <img src={image} alt={title} className="w-full h-40 object-cover rounded-2xl" referrerPolicy="no-referrer" />
      </div>
    </div>
  );
}
