
import React, { useState, useMemo } from 'react';
import { ICONS } from '../constants';
import { AppTab } from '../types';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Star, TrendingUp, Users, ShoppingBag, Copy, Play, PlayCircle, Radio, Tag } from 'lucide-react';

type MetricType = 'sales' | 'newProducts' | 'creators';
type ScenarioTab = 'product' | 'influencer' | 'competitor' | 'ads';
type ProductDimension = 'new' | 'best' | 'influencer_hot';
type InfluencerDimension = 'top_sales' | 'dark_horse';
type CompetitorDimension = 'shop_sales' | 'shop_hot';
type AdsDimension = 'competitor_ads' | 'hot_creatives';

interface HomeProps {
  onNavigate: (tab: AppTab) => void;
  onboardingStep?: number;
  setOnboardingStep?: (step: number) => void;
  onCompleteGuide?: () => void;
}

const Home: React.FC<HomeProps> = ({ 
  onNavigate, 
  onboardingStep = 0, 
  setOnboardingStep, 
  onCompleteGuide 
}) => {
  const [activeMetric, setActiveMetric] = useState<MetricType>('sales');
  const [trendTimeRange, setTrendTimeRange] = useState<'7d' | '28d'>('7d');
  const [category, setCategory] = useState('美妆个护');
  
  const [activeScenario, setActiveScenario] = useState<ScenarioTab>('product');
  const [activeProdDim, setActiveProdDim] = useState<ProductDimension>('new');
  const [activeInfDim, setActiveInfDim] = useState<InfluencerDimension>('top_sales');
  const [activeCompDim, setActiveCompDim] = useState<CompetitorDimension>('shop_sales');
  const [activeAdsDim, setActiveAdsDim] = useState<AdsDimension>('competitor_ads');

  const mockTrendData = useMemo(() => {
    const points = trendTimeRange === '7d' ? 7 : 28;
    return Array.from({ length: points }, (_, i) => ({
      name: `${i + 1}日`,
      sales: Math.floor(Math.random() * 1000) + 500,
      newProducts: Math.floor(Math.random() * 200) + 50,
      creators: Math.floor(Math.random() * 150) + 20,
    }));
  }, [trendTimeRange]);

  const metrics = [
    { id: 'sales' as MetricType, label: '销量', value: '124.5k', growth: '+12.5%' },
    { id: 'newProducts' as MetricType, label: '新品数', value: '1,280', growth: '+5.2%' },
    { id: 'creators' as MetricType, label: '达人增长', value: '852', growth: '+18.1%' },
  ];

  const quickLinks = [
    { label: '商品', icon: ICONS.Cart, color: 'bg-pink-900/30 text-[#FE2062]' },
    { label: '达人', icon: ICONS.Users, color: 'bg-blue-900/30 text-blue-400' },
    { label: '店铺', icon: ICONS.Dashboard, color: 'bg-orange-900/30 text-orange-400' },
    { label: '广告', icon: ICONS.Trends, color: 'bg-green-900/30 text-green-400' },
    { label: '直播', icon: ICONS.Video, color: 'bg-purple-900/30 text-purple-400' },
    { label: '视频', icon: ICONS.Video, color: 'bg-red-900/30 text-red-400' },
  ];

  const CATEGORIES = ['美妆个护', '服装服饰', '家居百货', '3C数码', '母婴用品', '食品饮料', '运动户外', '宠物用品'];

  const scenarioTabs: { id: ScenarioTab; label: string }[] = [
    { id: 'product', label: '选品分析' },
    { id: 'influencer', label: '达人营销' },
    { id: 'competitor', label: '竞店跟踪' },
    { id: 'ads', label: '广告优化' },
  ];

  const adsDimensions: { id: AdsDimension; label: string }[] = [
    { id: 'competitor_ads', label: '竞品广告主' },
    { id: 'hot_creatives', label: '爆款广告素材' },
  ];

  const productDimensions: { id: ProductDimension; label: string }[] = [
    { id: 'new', label: '爆款新品' },
    { id: 'best', label: '畅销爆品' },
    { id: 'influencer_hot', label: '达人热推' },
  ];

  const influencerDimensions: { id: InfluencerDimension; label: string }[] = [
    { id: 'top_sales', label: '带货达人榜' },
    { id: 'dark_horse', label: '黑马达人榜' },
  ];

  const competitorDimensions: { id: CompetitorDimension; label: string }[] = [
    { id: 'shop_sales', label: '店铺销量榜' },
    { id: 'shop_hot', label: '店铺热推榜' },
  ];

  const renderProductItem = (i: number) => {
    const creatorIncrement = Math.floor(Math.random() * 200) + 20;
    const totalSales = (Math.random() * 100 + 5).toFixed(2);
    const yesterdaySales = (Math.random() * 8000 + 500).toFixed(0);
    
    return (
      <div key={i} className="py-5 border-b border-gray-800 last:border-b-0 group">
        <div className="flex gap-3 mb-4">
          <div className="relative shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-800 border border-gray-800 shadow-sm">
            <img 
              src={`https://picsum.photos/seed/prod-${i}/120/120`} 
              alt="Product" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-1">
            <h4 className="text-[13px] font-bold text-gray-100 line-clamp-1 leading-tight mb-0.5">
              {category} 2024 潮流热销单品 #{i + 1}
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-bold text-gray-100">$ {(Math.random() * 50 + 10).toFixed(2)}</span>
              <span className="px-2 py-0.5 bg-[#FE2062]/10 text-[#FE2062] text-[10px] font-bold rounded-md">
                {category}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 overflow-hidden">
              <div className="w-4 h-4 rounded-full overflow-hidden bg-gray-800 shrink-0">
                <img src={`https://picsum.photos/seed/shop-${i}/30/30`} alt="Shop" className="w-full h-full object-cover" />
              </div>
              <span className="text-[11px] text-gray-400 font-medium truncate">OFFICIAL_STORE_{i}</span>
            </div>
          </div>
          <button className="shrink-0 self-center p-2 border border-gray-800 rounded-md text-gray-600 hover:text-[#FE2062] transition-all">
            <Star size={16} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center space-y-1">
            <p className="text-[14px] font-black text-gray-100">+{creatorIncrement}</p>
            <p className="text-[10px] text-gray-500 font-bold">带货达人增量</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-[14px] font-black text-gray-100">{totalSales}万</p>
            <p className="text-[10px] text-gray-500 font-bold">总销量</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-[14px] font-black text-[#FE2062]">{yesterdaySales}</p>
            <p className="text-[10px] text-gray-500 font-bold">昨日销量</p>
          </div>
        </div>
      </div>
    );
  };

  const renderInfluencerItem = (i: number) => {
    const isDarkHorse = activeInfDim === 'dark_horse';
    const fanCount = (Math.random() * 500 + 10).toFixed(1) + 'w';
    const growth = '+' + (Math.random() * 15 + 2).toFixed(1) + '%';
    const convRate = (Math.random() * 5 + 1).toFixed(2) + '%';
    const relatedProds = Math.floor(Math.random() * 50) + 5;
    const totalSales = (Math.random() * 20 + 2).toFixed(1) + 'w';
    const monthSales = (Math.random() * 5 + 0.5).toFixed(1) + 'w';

    return (
      <div key={i} className="py-5 border-b border-gray-800 last:border-b-0 group">
        <div className="flex gap-3 mb-4">
          <div className="relative shrink-0 w-14 h-14 rounded-full overflow-hidden bg-gray-800 border-2 border-gray-800 shadow-sm">
            <img 
              src={`https://picsum.photos/seed/inf-${i}/120/120`} 
              alt="Avatar" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 border border-gray-900">
              <Users size={8} className="text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0 flex-col gap-0.5 flex">
            <h4 className="text-[13px] font-bold text-gray-100 line-clamp-1 leading-tight flex items-center gap-1.5">
              Creator_Fast_{i + 101}
              {isDarkHorse && <TrendingUp size={12} className="text-green-500" />}
            </h4>
            <p className="text-[10px] text-gray-500 font-medium">{category}核心创作达人</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-1.5 py-0.5 bg-gray-800 text-gray-400 text-[9px] font-bold rounded">直播型</span>
              <span className="px-1.5 py-0.5 bg-gray-800 text-gray-400 text-[9px] font-bold rounded">高转化</span>
            </div>
          </div>
          <button className="shrink-0 self-center p-2 border border-gray-800 rounded-md text-gray-600 hover:text-[#FE2062] transition-all">
            <Star size={16} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {!isDarkHorse ? (
            <>
              <div className="text-center space-y-1">
                <p className="text-[14px] font-black text-gray-100">{relatedProds}</p>
                <p className="text-[10px] text-gray-500 font-bold">关联商品</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-[14px] font-black text-gray-100">{totalSales}</p>
                <p className="text-[10px] text-gray-500 font-bold">总销量</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-[14px] font-black text-[#FE2062]">{monthSales}</p>
                <p className="text-[10px] text-gray-500 font-bold">近30日销量</p>
              </div>
            </>
          ) : (
            <>
              <div className="text-center space-y-1">
                <p className="text-[14px] font-black text-gray-100">{fanCount}</p>
                <p className="text-[10px] text-gray-500 font-bold">粉丝数</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-[14px] font-black text-green-500">{growth}</p>
                <p className="text-[10px] text-gray-500 font-bold">粉丝增长</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-[14px] font-black text-[#FE2062]">{convRate}</p>
                <p className="text-[10px] text-gray-500 font-bold">带货转化率</p>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderShopItem = (i: number) => {
    const isHot = activeCompDim === 'shop_hot';
    const shopName = `Elite_Shop_Asia_${i + 1}`;
    const creatorCount = Math.floor(Math.random() * 3000) + 200;
    const totalSales = (Math.random() * 200 + 10).toFixed(1) + 'w';
    const yesterdaySales = (Math.random() * 2 + 0.1).toFixed(1) + 'w';
    
    const hotIndex = (Math.random() * 20 + 80).toFixed(1);
    const videoIncrement = Math.floor(Math.random() * 500) + 50;
    const creatorIncrement = Math.floor(Math.random() * 100) + 10;

    return (
      <div key={i} className="py-5 border-b border-gray-800 last:border-b-0 group">
        <div className="flex gap-3 mb-4">
          <div className="relative shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-gray-800 border border-gray-800 shadow-sm">
            <img 
              src={`https://picsum.photos/seed/shop-logo-${i}/120/120`} 
              alt="Shop Logo" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-0.5">
            <h4 className="text-[13px] font-bold text-gray-100 line-clamp-1 leading-tight flex items-center gap-1.5">
              {shopName}
              <ShoppingBag size={12} className="text-[#FE2062]" />
            </h4>
            <p className="text-[10px] text-gray-500 font-medium">TikTok官方认证店铺 • {category}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-1.5 py-0.5 bg-gray-800 text-gray-400 text-[9px] font-bold rounded">五星店铺</span>
              <span className="px-1.5 py-0.5 bg-gray-800 text-gray-400 text-[9px] font-bold rounded">极速发货</span>
            </div>
          </div>
          <button className="shrink-0 self-center p-2 border border-gray-800 rounded-md text-gray-600 hover:text-[#FE2062] transition-all">
            <Star size={16} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {!isHot ? (
            <>
              <div className="text-center space-y-1">
                <p className="text-[14px] font-black text-gray-100">{creatorCount}</p>
                <p className="text-[10px] text-gray-500 font-bold">关联达人</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-[14px] font-black text-gray-100">{totalSales}</p>
                <p className="text-[10px] text-gray-500 font-bold">总销量</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-[14px] font-black text-[#FE2062]">{yesterdaySales}</p>
                <p className="text-[10px] text-gray-500 font-bold">昨日销量</p>
              </div>
            </>
          ) : (
            <>
              <div className="text-center space-y-1">
                <p className="text-[14px] font-black text-[#FE2062]">{hotIndex}</p>
                <p className="text-[10px] text-gray-500 font-bold">热推指数</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-[14px] font-black text-gray-100">+{videoIncrement}</p>
                <p className="text-[10px] text-gray-500 font-bold">带货视频增量</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-[14px] font-black text-gray-100">+{creatorIncrement}</p>
                <p className="text-[10px] text-gray-500 font-bold">带货达人增量</p>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderAdsCompetitorItem = (i: number) => {
    const shopName = i === 0 ? "Goli Nutrition" : `Global_Brand_${i + 1}`;
    const impression = (Math.random() * 500 + 100).toFixed(1) + '万';
    const spend = '$' + (Math.random() * 50 + 5).toFixed(1) + 'k';
    const roas = (Math.random() * 4 + 1.5).toFixed(2);

    return (
      <div key={i} className="py-5 border-b border-gray-800 last:border-b-0 group">
        <div className="flex gap-3 mb-4">
          <div className="relative shrink-0 w-14 h-14 rounded-full overflow-hidden bg-red-600 border border-gray-800 shadow-sm flex items-center justify-center">
             <img 
              src={`https://picsum.photos/seed/ads-logo-${i}/120/120`} 
              alt="Brand Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-0.5">
            <h4 className="text-[13px] font-bold text-gray-100 line-clamp-1 leading-tight flex items-center gap-1.5">
              {shopName}
              <Copy size={12} className="text-gray-500 cursor-pointer" />
            </h4>
            <div className="flex items-center gap-1 mt-1">
               <span className="px-1.5 py-0.5 bg-gray-800 text-gray-400 text-[9px] font-bold rounded">品牌广告主</span>
               <span className="px-1.5 py-0.5 bg-[#FE2062]/10 text-[#FE2062] text-[9px] font-bold rounded">高ROI</span>
            </div>
          </div>
          <button className="shrink-0 self-center p-2 border border-gray-800 rounded-full text-gray-600 hover:text-[#FE2062] transition-all bg-gray-900 shadow-sm">
            <Star size={16} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="text-center space-y-1">
            <p className="text-[14px] font-black text-gray-100">{impression}</p>
            <p className="text-[10px] text-gray-500 font-bold">广告曝光</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-[14px] font-black text-gray-100">{spend}</p>
            <p className="text-[10px] text-gray-500 font-bold">预估消耗</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-[14px] font-black text-[#FE2062]">{roas}</p>
            <p className="text-[10px] text-gray-500 font-bold">ROAS</p>
          </div>
        </div>
      </div>
    );
  };

  const renderHotAdsCreatives = () => {
    const creatives = Array.from({ length: 5 }).map((_, i) => ({
      id: i,
      title: ["夏季爆款美妆，限时抢购", "2024潮流穿搭新趋势", "家居必备黑科技好物", "运动户外专业装备推荐", "萌宠爱吃的健康零食"][i],
      brand: ["Goli Nutrition", "Fashion Hub", "Tech Home", "Active Gear", "Pet Lovers"][i],
      views: (Math.random() * 100 + 50).toFixed(1) + '万',
      roas: (Math.random() * 5 + 2).toFixed(2),
      image: `https://picsum.photos/seed/ad-cover-${i}/240/400`
    }));

    return (
      <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2 px-1">
        {creatives.map((ad) => (
          <div key={ad.id} className="w-64 shrink-0 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg group">
            <div className="relative h-72 overflow-hidden">
              <img src={ad.image} alt="Ad Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
              <div className="absolute top-3 left-3 bg-[#FE2062] text-white text-[10px] font-black px-2 py-1 rounded-md shadow-lg">
                HOT CREATIVE
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                  <Play size={24} className="text-white fill-white ml-1" />
                </div>
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                 <h5 className="text-sm font-bold text-white line-clamp-1 mb-1">{ad.title}</h5>
                 <p className="text-[10px] text-gray-400 font-medium">@{ad.brand}</p>
              </div>
            </div>
            <div className="p-3 grid grid-cols-2 gap-2 border-t border-gray-800">
               <div>
                 <p className="text-[10px] text-gray-500 font-bold mb-0.5">播放量</p>
                 <p className="text-xs font-black text-gray-100">{ad.views}</p>
               </div>
               <div className="text-right">
                 <p className="text-[10px] text-gray-500 font-bold mb-0.5">ROAS</p>
                 <p className="text-xs font-black text-[#FE2062]">{ad.roas}</p>
               </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderContentReference = () => (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-red-900/30 text-[#FE2062] rounded-lg">
            <PlayCircle size={18} />
          </div>
          <h3 className="font-extrabold text-gray-100 text-sm">内容创作参考</h3>
        </div>
        <button className="text-[10px] text-[#FE2062] font-bold">全部素材</button>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-xl space-y-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-4 pb-5 border-b border-gray-800 last:border-b-0 last:pb-0">
            <div className="flex gap-3">
              <div className="relative shrink-0 w-32 h-20 rounded-lg overflow-hidden bg-gray-800 group cursor-pointer">
                <img src={`https://picsum.photos/seed/cref-${i}/300/200`} className="w-full h-full object-cover" alt="Cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play size={20} className="text-white fill-white" />
                </div>
                <div className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/60 rounded text-[8px] text-white">00:15</div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[13px] font-bold text-gray-100 line-clamp-2 leading-tight">
                  {category}近期高转化脚本拆解：实测效果惊人
                </h4>
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="w-4 h-4 rounded-full bg-gray-700 overflow-hidden">
                    <img src={`https://picsum.photos/seed/u-${i}/30/30`} className="w-full h-full object-cover" alt="User" />
                  </div>
                  <span className="text-[11px] text-gray-500 font-bold">Top_Creator_{i+1}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 bg-gray-950/50 p-2.5 rounded-lg border border-gray-800/50">
              <div className="text-center">
                <p className="text-[11px] font-black text-gray-100">{(Math.random()*100+50).toFixed(1)}w</p>
                <p className="text-[9px] text-gray-600 font-bold">播放量</p>
              </div>
              <div className="text-center border-x border-gray-800">
                <p className="text-[11px] font-black text-gray-100">{(Math.random()*2+0.5).toFixed(1)}k</p>
                <p className="text-[9px] text-gray-600 font-bold">销量</p>
              </div>
              <div className="text-center">
                <p className="text-[11px] font-black text-[#FE2062]">${(Math.random()*10+2).toFixed(1)}w</p>
                <p className="text-[9px] text-gray-600 font-bold">销售额</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const renderLiveCases = () => (
    <section className="mt-8 mb-24">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-purple-900/30 text-purple-400 rounded-lg">
            <Radio size={18} />
          </div>
          <h3 className="font-extrabold text-gray-100 text-sm">热门直播案例</h3>
        </div>
        <button className="text-[10px] text-[#FE2062] font-bold">更多直播间</button>
      </div>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-48 shrink-0 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl group">
            <div className="relative h-60">
              <img src={`https://picsum.photos/seed/live-${i}/300/400`} className="w-full h-full object-cover" alt="Live Room" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-red-600 text-white rounded-lg shadow-lg">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-wider">LIVE</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-full border border-white/30 overflow-hidden">
                    <img src={`https://picsum.photos/seed/la-${i}/50/50`} className="w-full h-full object-cover" alt="Avatar" />
                  </div>
                  <span className="text-[11px] font-bold text-white truncate">Global_Live_Shop</span>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-gray-300">
                  <Users size={10} />
                  <span>{(Math.random()*5+1).toFixed(1)}k 在看</span>
                </div>
              </div>
            </div>
            <div className="p-3 border-t border-gray-800 flex justify-between items-center">
              <div>
                <p className="text-[13px] font-black text-[#FE2062]">${(Math.random()*20+5).toFixed(1)}w</p>
                <p className="text-[9px] text-gray-500 font-bold uppercase">预估销额</p>
              </div>
              <div className="text-right">
                <p className="text-[13px] font-black text-gray-100">{(Math.random()*5+1).toFixed(1)}k</p>
                <p className="text-[9px] text-gray-500 font-bold uppercase">本场销量</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="p-4 space-y-6 relative">
      {/* Onboarding Step 2: Category Guide */}
      {onboardingStep === 2 && (
        <div className="fixed inset-0 z-[100] flex flex-col pointer-events-none">
          <div className="absolute inset-0 bg-black/80 pointer-events-auto transition-opacity duration-500" />
          
          <div className="relative z-[101] mt-[164px] mx-4 pointer-events-auto">
             <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-2 px-3 bg-gray-900 border-2 border-[#FE2062] rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.8)]">
                <span className="flex-shrink-0 text-[10px] font-black text-gray-400">主营品类：</span>
                {CATEGORIES.slice(0, 3).map((cat) => (
                  <button key={cat} className={`flex-shrink-0 px-4 py-1.5 rounded-lg text-xs font-black transition-all border ${cat === category ? 'bg-[#FE2062] text-white border-[#FE2062]' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>{cat}</button>
                ))}
             </div>
             
             {/* Tooltip Bubble */}
             <div className="absolute top-full left-0 right-0 mt-6 bg-[#FE2062] text-white p-6 rounded-2xl shadow-2xl animate-bounce-subtle">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#FE2062] rotate-45" />
                <div className="flex items-center gap-2 justify-center mb-3">
                  <div className="bg-white/20 p-1.5 rounded-lg">
                    <Tag size={18} />
                  </div>
                  <p className="text-base font-black">第二步：选择主营类目</p>
                </div>
                <p className="text-xs font-bold leading-relaxed text-center text-white/90">
                  选择主营类目后，我们将为您精准推荐 TikTok 实时热门单品、达人和直播素材。
                </p>
                <button 
                  onClick={onCompleteGuide}
                  className="mt-5 w-full py-3.5 bg-white text-[#FE2062] rounded-xl text-sm font-black shadow-lg active:scale-95 transition-all hover:bg-gray-50"
                >
                  开启高效分析之旅
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500">
          {ICONS.Search}
        </div>
        <input 
          type="text" 
          placeholder="搜索商品、达人、店铺 or 关键词" 
          className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 pl-11 pr-4 text-sm text-gray-200 focus:ring-2 focus:ring-[#FE2062]/20 outline-none placeholder-gray-600 shadow-lg"
        />
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-6 gap-2 w-full">
        {quickLinks.map((link, idx) => (
          <button key={idx} className="flex flex-col items-center gap-1.5 group min-w-0">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center transition-all group-active:scale-90 shadow-md ${link.color}`}>
              {/* Fix: cast icon element to React.ReactElement<any> to allow 'size' prop in cloneElement */}
              {React.cloneElement(link.icon as React.ReactElement<any>, { size: 18 })}
            </div>
            <span className="text-[10px] font-bold text-gray-400 truncate w-full text-center">{link.label}</span>
          </button>
        ))}
      </div>

      {/* Category Selector */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-2 px-2 py-1">
        <span className="flex-shrink-0 text-[10px] font-bold text-gray-600 mr-1">主营品类：</span>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
              category === cat 
                ? 'bg-[#FE2062] text-white border-[#FE2062] shadow-md shadow-[#FE2062]/30' 
                : 'bg-gray-900 text-gray-500 border-gray-800 hover:border-gray-700 shadow-sm'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Category Trend Section - Updated Order and Sizes */}
      <section className="bg-gray-900 border border-gray-800 rounded-2xl p-3.5 shadow-xl">
        <div className="flex items-center justify-between mb-2 gap-2">
          <h3 className="font-extrabold text-gray-100 text-sm whitespace-nowrap">品类大盘趋势</h3>
          <div className="flex bg-gray-800 p-0.5 rounded-lg shrink-0">
            <button onClick={() => setTrendTimeRange('7d')} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${trendTimeRange === '7d' ? 'bg-[#FE2062] text-white' : 'text-gray-500'}`}>7天</button>
            <button onClick={() => setTrendTimeRange('28d')} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${trendTimeRange === '28d' ? 'bg-[#FE2062] text-white' : 'text-gray-500'}`}>28天</button>
          </div>
          <button onClick={() => onNavigate(AppTab.MARKET)} className="text-sm text-[#FE2062] font-bold flex items-center gap-0.5 hover:opacity-80 transition-opacity">详情 {ICONS.Chevron}</button>
        </div>

        <div className="grid grid-cols-3 gap-2 w-full mb-4">
          {metrics.map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveMetric(m.id)}
              className={`p-2 rounded-lg border transition-all text-left min-w-0 flex flex-col justify-between ${activeMetric === m.id ? 'border-[#FE2062] bg-[#FE2062]/10 ring-1 ring-[#FE2062]' : 'border-gray-800 bg-gray-950/50'}`}
            >
              <div className="flex flex-col mb-1.5">
                <span className="text-[11px] font-black text-gray-100 truncate">{m.value}</span>
                <span className="text-[8px] font-bold text-green-500">{m.growth}</span>
              </div>
              <p className={`text-xs font-bold truncate ${activeMetric === m.id ? 'text-[#FE2062]' : 'text-gray-600'}`}>{m.label}</p>
            </button>
          ))}
        </div>

        <div className="h-28 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockTrendData}>
              <defs>
                <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FE2062" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FE2062" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#111827', color: '#fff' }} />
              <Area type="monotone" dataKey={activeMetric} stroke="#FE2062" strokeWidth={3} fillOpacity={1} fill="url(#colorMetric)" animationDuration={1000} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Scenario Module */}
      <section className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="flex border-b border-gray-800">
          {scenarioTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveScenario(tab.id)}
              className={`flex-1 py-4 text-sm font-extrabold transition-all relative ${activeScenario === tab.id ? 'text-[#FE2062] bg-[#FE2062]/5' : 'text-gray-500'}`}
            >
              {tab.label}
              {activeScenario === tab.id && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-[#FE2062] rounded-t-full shadow-lg shadow-[#FE2062]/40" />
              )}
            </button>
          ))}
        </div>

        <div className="p-5">
          {activeScenario === 'product' && (
            <div className="space-y-6">
              <div className="flex justify-center gap-2">
                {productDimensions.map((dim) => (
                  <button key={dim.id} onClick={() => setActiveProdDim(dim.id)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${activeProdDim === dim.id ? 'bg-[#FE2062] text-white border-[#FE2062]' : 'bg-gray-950/50 text-gray-500 border-gray-800'}`}>{dim.label}</button>
                ))}
              </div>
              <div className="bg-gray-950/50 border border-gray-800/80 rounded-xl px-4 py-1 divide-y divide-gray-800/50 shadow-inner">
                {Array.from({ length: 4 }).map((_, i) => renderProductItem(i))}
              </div>
            </div>
          )}

          {activeScenario === 'influencer' && (
            <div className="space-y-6">
              <div className="flex justify-center gap-2">
                {influencerDimensions.map((dim) => (
                  <button key={dim.id} onClick={() => setActiveInfDim(dim.id)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${activeInfDim === dim.id ? 'bg-[#FE2062] text-white border-[#FE2062]' : 'bg-gray-950/50 text-gray-500 border-gray-800'}`}>{dim.label}</button>
                ))}
              </div>
              <div className="bg-gray-950/50 border border-gray-800/80 rounded-xl px-4 py-1 divide-y divide-gray-800/50 shadow-inner">
                {Array.from({ length: 4 }).map((_, i) => renderInfluencerItem(i))}
              </div>
            </div>
          )}

          {activeScenario === 'competitor' && (
            <div className="space-y-6">
              <div className="flex justify-center gap-2">
                {competitorDimensions.map((dim) => (
                  <button key={dim.id} onClick={() => setActiveCompDim(dim.id)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${activeCompDim === dim.id ? 'bg-[#FE2062] text-white border-[#FE2062]' : 'bg-gray-950/50 text-gray-500 border-gray-800'}`}>{dim.label}</button>
                ))}
              </div>
              <div className="bg-gray-950/50 border border-gray-800/80 rounded-xl px-4 py-1 divide-y divide-gray-800/50 shadow-inner">
                {Array.from({ length: 4 }).map((_, i) => renderShopItem(i))}
              </div>
            </div>
          )}

          {activeScenario === 'ads' && (
            <div className="space-y-6">
              <div className="flex justify-center gap-2">
                {adsDimensions.map((dim) => (
                  <button key={dim.id} onClick={() => setActiveAdsDim(dim.id)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${activeAdsDim === dim.id ? 'bg-[#FE2062] text-white border-[#FE2062]' : 'bg-gray-950/50 text-gray-500 border-gray-800'}`}>{dim.label}</button>
                ))}
              </div>
              
              {activeAdsDim === 'competitor_ads' ? (
                <div className="bg-gray-950/50 border border-gray-800/80 rounded-xl px-4 py-1 divide-y divide-gray-800/50 shadow-inner">
                  {Array.from({ length: 4 }).map((_, i) => renderAdsCompetitorItem(i))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <p className="text-xs font-bold text-gray-400">为您推荐优质素材</p>
                    <button className="text-[10px] text-[#FE2062] font-bold">更多素材库</button>
                  </div>
                  {renderHotAdsCreatives()}
                </div>
              )}
            </div>
          )}

          <button onClick={() => onNavigate(AppTab.DISCOVERY)} className="w-full mt-4 py-4 bg-[#FE2062]/10 hover:bg-[#FE2062]/20 border border-[#FE2062]/20 rounded-xl flex items-center justify-center gap-2 group transition-all">
            <span className="text-sm font-black text-[#FE2062]">查看完整数据榜单</span>
            <div className="w-6 h-6 rounded-full bg-[#FE2062] flex items-center justify-center text-white shadow-lg transition-transform group-hover:translate-x-1">{ICONS.Chevron}</div>
          </button>
        </div>
      </section>

      {/* New Modules Below Scenario Tab */}
      {renderContentReference()}
      {renderLiveCases()}
    </div>
  );
};

export default Home;
