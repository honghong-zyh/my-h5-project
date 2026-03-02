
import React, { useState, useEffect, useRef } from 'react';
import { AppTab } from './types';
import { ICONS, COUNTRIES } from './constants';
import Home from './components/Home';
import MarketAnalysis from './components/MarketAnalysis';
import AIAgent from './components/AIAgent';
import Discovery from './components/Discovery';
import Profile from './components/Profile';
import ProductDetail from './components/ProductDetail';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.WORKBENCH);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  const mainRef = useRef<HTMLElement>(null);
  const GUIDE_STORAGE_KEY = 'fastmoss_onboarding_progress';

  const [onboardingStep, setOnboardingStep] = useState<number>(0);

  useEffect(() => {
    const savedProgress = localStorage.getItem(GUIDE_STORAGE_KEY);
    if (!savedProgress) {
      setOnboardingStep(1);
      localStorage.setItem(GUIDE_STORAGE_KEY, '1');
    } else if (savedProgress === '1') {
      setOnboardingStep(1);
    } else if (savedProgress === '2') {
      setOnboardingStep(2);
    } else {
      setOnboardingStep(0);
    }
  }, []);

  useEffect(() => {
    const mainElement = mainRef.current;
    if (!mainElement) return;

    const handleScroll = () => {
      if (mainElement.scrollTop > window.innerHeight) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    mainElement.addEventListener('scroll', handleScroll);
    return () => mainElement.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    mainRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const updateOnboardingStep = (step: number | 'completed') => {
    if (step === 'completed') {
      setOnboardingStep(0);
      localStorage.setItem(GUIDE_STORAGE_KEY, 'completed');
    } else {
      setOnboardingStep(step);
      localStorage.setItem(GUIDE_STORAGE_KEY, step.toString());
    }
  };

  const handleProductClick = (id: number) => {
    setSelectedProductId(id);
    setActiveTab(AppTab.PRODUCT_DETAIL);
  };

  const handleBack = () => {
    setActiveTab(AppTab.DISCOVERY);
    setSelectedProductId(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.WORKBENCH: 
        return <Home 
          onNavigate={setActiveTab} 
          onboardingStep={onboardingStep} 
          setOnboardingStep={(step) => updateOnboardingStep(step)}
          onCompleteGuide={() => updateOnboardingStep('completed')}
        />;
      case AppTab.MARKET: return <MarketAnalysis country={selectedCountry.name} />;
      case AppTab.AGENT: return <AIAgent />;
      case AppTab.DISCOVERY: return <Discovery onProductClick={handleProductClick} />;
      case AppTab.PRODUCT_DETAIL: return <ProductDetail productId={selectedProductId} onBack={handleBack} />;
      case AppTab.PROFILE: return <Profile />;
      default: return <Home onNavigate={setActiveTab} />;
    }
  };

  const isDetailView = activeTab === AppTab.PRODUCT_DETAIL;

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-gray-950 shadow-2xl overflow-hidden relative border-x border-gray-900">
      {/* Onboarding Step 1 */}
      {!isDetailView && onboardingStep === 1 && (
        <div className="fixed inset-0 z-[100] flex flex-col pointer-events-none">
          <div className="absolute inset-0 bg-black/70 pointer-events-auto" />
          <div className="relative z-[101] mt-3 ml-4 w-fit pointer-events-auto">
             <div className="flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded-full border bg-gray-800 border-gray-700 text-gray-100 shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] ring-2 ring-white/50 animate-pulse-ring">
                <span>{selectedCountry.flag}</span>
                <span className="max-w-[60px] truncate uppercase">{selectedCountry.code}</span>
                {ICONS.Chevron}
             </div>
             <div className="absolute top-full left-0 mt-8 w-[320px] bg-white rounded-2xl p-6 shadow-2xl shadow-blue-500/20 pointer-events-auto">
                <div className="absolute -top-3 left-10 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[16px] border-b-white" />
                <div className="w-full h-36 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl mb-6 overflow-hidden border border-blue-100 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-8 bg-white rounded-full shadow-sm border border-blue-100 flex items-center px-2 gap-2">
                            <div className="w-4 h-4 bg-blue-100 rounded-full" />
                            <div className="w-10 h-2 bg-blue-50 rounded-full" />
                        </div>
                    </div>
                </div>
                <div className="space-y-2 mb-8 px-2">
                    <h3 className="text-gray-900 font-black text-lg flex items-center gap-2">
                       <span className="text-blue-500">1.</span> 选择业务国家
                    </h3>
                    <p className="text-gray-500 text-sm font-bold leading-relaxed">
                       选择您关注的国家，FastMoss 将为您切换对应的 TikTok 数据源。
                    </p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                    <button onClick={() => updateOnboardingStep('completed')} className="px-4 py-2 bg-gray-100 text-gray-500 text-xs font-black rounded-full hover:bg-gray-200 transition-colors">跳过(1/2)</button>
                    <button onClick={() => updateOnboardingStep(2)} className="px-8 py-3 bg-blue-500 text-white text-sm font-black rounded-lg shadow-lg shadow-blue-500/30 active:scale-95 transition-all">下一步</button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Header - Hidden on Detail View as it has its own header */}
      {!isDetailView && (
        <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 px-4 py-3 flex items-center justify-between">
          <div className="relative">
            <button 
              onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
              className={`flex items-center gap-1 text-sm font-medium px-2.5 py-1.5 rounded-full border transition-all ${
                isCountryDropdownOpen ? 'bg-[#FE2062]/10 border-[#FE2062] text-[#FE2062]' : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
              }`}
            >
              <span>{selectedCountry.flag}</span>
              <span className="max-w-[60px] truncate">{selectedCountry.code}</span>
              <span className={`transition-transform duration-200 ${isCountryDropdownOpen ? 'rotate-90' : ''}`}>{ICONS.Chevron}</span>
            </button>
            {isCountryDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10 bg-black/20" onClick={() => setIsCountryDropdownOpen(false)} />
                <div className="absolute left-0 mt-3 w-48 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl z-20 overflow-hidden">
                  <div className="max-h-[60vh] overflow-y-auto scrollbar-hide py-2">
                    {COUNTRIES.map((c) => (
                      <button key={c.code} onClick={() => { setSelectedCountry(c); setIsCountryDropdownOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${selectedCountry.code === c.code ? 'bg-[#FE2062]/10 text-[#FE2062]' : 'text-gray-300 hover:bg-gray-800'}`}>
                        <span className="text-lg">{c.flag}</span>
                        <span className="font-semibold">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col items-center space-y-1">
            <span className="font-bold text-white text-base tracking-tight leading-none">FastMoss</span>
            <span className="text-[9px] text-gray-400 font-bold leading-none uppercase tracking-widest">TikTok数据分析</span>
          </div>
          <button className="text-sm font-semibold text-[#FE2062] px-3 py-1.5 rounded-md border border-[#FE2062] active:bg-[#FE2062]/10 transition-colors">登录</button>
        </header>
      )}

      {/* Main Content Area */}
      <main ref={mainRef} className="flex-1 overflow-y-auto pb-24 scroll-smooth">
        {renderContent()}
      </main>

      {/* Back to Top Button */}
      {!isDetailView && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-24 right-6 z-40 w-12 h-12 flex flex-col items-center justify-center bg-white border border-gray-200 rounded-full shadow-xl transition-all duration-300 transform ${
            showBackToTop ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-10 pointer-events-none'
          } active:scale-90 group`}
        >
          <div className="text-gray-800 -mb-1 group-hover:-translate-y-0.5 transition-transform">{ICONS.ChevronUp}</div>
          <span className="text-[9px] font-bold text-gray-800">顶部</span>
        </button>
      )}

      {/* Navigation Bar - Hidden on Detail View */}
      {!isDetailView && (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-gray-900/90 backdrop-blur-md border-t border-gray-800 px-2 py-2 flex justify-around items-center z-50 pb-safe">
          {[
            { id: AppTab.WORKBENCH, icon: ICONS.Dashboard, label: '首页' },
            { id: AppTab.MARKET, icon: ICONS.Market, label: '大盘' },
            { id: AppTab.AGENT, icon: ICONS.Agent, label: 'AGENT' },
            { id: AppTab.DISCOVERY, icon: ICONS.Discovery, label: '搜索' },
            { id: AppTab.PROFILE, icon: ICONS.Profile, label: '我的' },
          ].map((item) => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); mainRef.current?.scrollTo(0, 0); }} className={`flex flex-col items-center justify-center w-16 transition-all duration-200 ${activeTab === item.id ? 'text-[#FE2062]' : 'text-gray-500'}`}>
              <span className={`p-1 rounded-lg transition-colors ${activeTab === item.id ? 'bg-[#FE2062]/20 text-[#FE2062]' : ''}`}>{item.icon}</span>
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      )}

      <style>{`
        @keyframes pulse-ring {
            0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
        }
        .animate-pulse-ring { animation: pulse-ring 2s infinite; }
      `}</style>
    </div>
  );
};

export default App;