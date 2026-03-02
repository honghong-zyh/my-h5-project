
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ICONS } from '../constants';
import { Treemap, ResponsiveContainer } from 'recharts';
import { 
  Star, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Zap, 
  Play, 
  ChevronRight, 
  BarChart3, 
  DollarSign, 
  Package, 
  LayoutGrid,
  Video,
  Flame,
  Clock,
  Crown
} from 'lucide-react';

interface CategoryNode {
  name: string;
  value: number; // 占比数值
  displayValue: string; // 销量文本
  percentage: number; // 占比
  children?: CategoryNode[];
}

const CATEGORY_HIERARCHY: CategoryNode[] = [
  {
    name: '美妆个护', value: 19, displayValue: '1250.4万', percentage: 19,
    children: [
      {
        name: '美容护肤', value: 23, displayValue: '265.00万', percentage: 23,
        children: [
          { name: '面部护理套装', value: 34, displayValue: '91.14万', percentage: 34 },
          { name: '面部精华液', value: 19, displayValue: '49.93万', percentage: 19 },
          { name: '保湿乳液', value: 15, displayValue: '39.12万', percentage: 15 },
          { name: '面膜', value: 5, displayValue: '13.1万', percentage: 5 },
          { name: '眼部护理', value: 7, displayValue: '18.4万', percentage: 7 },
        ]
      },
      { name: '美妆', value: 18, displayValue: '211.45万', percentage: 18 },
      { name: '香水', value: 15, displayValue: '176.2万', percentage: 15 },
      { name: '美容个护电器', value: 15, displayValue: '173.43万', percentage: 15 },
      { name: '头部护理', value: 10, displayValue: '114.28万', percentage: 10 },
      { name: '洗浴身体', value: 9, displayValue: '103.1万', percentage: 9 },
    ]
  },
  { name: '女装与女士内衣', value: 10, displayValue: '658.2万', percentage: 10 },
  { name: '时尚配件', value: 7, displayValue: '462.1万', percentage: 7 },
  { name: '保健', value: 6, displayValue: '395.4万', percentage: 6 },
  { name: '手机与数码', value: 5, displayValue: '332.0万', percentage: 5 },
  { name: '收藏品', value: 5, displayValue: '328.5万', percentage: 5 },
  { name: '运动与户外', value: 5, displayValue: '319.2万', percentage: 5 },
  { name: '家居用品', value: 5, displayValue: '312.4万', percentage: 5 },
  { name: '家电', value: 4, displayValue: '265.8万', percentage: 4 },
  { name: '玩具', value: 3, displayValue: '201.2万', percentage: 3 },
  { name: '男装', value: 3, displayValue: '198.4万', percentage: 3 },
  { name: '汽车', value: 3, displayValue: '189.5万', percentage: 3 },
  { name: '家具', value: 3, displayValue: '182.0万', percentage: 3 },
];

// 价格分布模拟数据
const PRICE_DISTRIBUTION_DATA = [
  { range: '0-5', value: '64.17万', percentage: 9.57 },
  { range: '5-10', value: '128.88万', percentage: 19.22, highlighted: true },
  { range: '10-15', value: '125.17万', percentage: 18.67 },
  { range: '15-20', value: '99.78万', percentage: 14.88 },
  { range: '20-30', value: '113.25万', percentage: 16.89 },
  { range: '30-40', value: '58.14万', percentage: 8.67 },
  { range: '40-60', value: '48.60万', percentage: 7.25 },
  { range: '60-80', value: '20.52万', percentage: 3.06 },
  { range: '80-100', value: '10.99万', percentage: 1.64 },
  { range: '>100', value: '1.04万', percentage: 0.16 },
];

const MarketAnalysis: React.FC<{ country: string }> = ({ country }) => {
  const [activeTab, setActiveTab] = useState('distribution');
  const [timeRange, setTimeRange] = useState('week');
  const [path, setPath] = useState<CategoryNode[]>([]);
  const [prodType, setProdType] = useState<'hot' | 'new'>('hot');
  const [creativeType, setCreativeType] = useState<'video' | 'ad'>('video');

  const currentLevelData = useMemo(() => {
    const data = path.length === 0 ? CATEGORY_HIERARCHY : path[path.length - 1].children || [];
    return [...data].sort((a, b) => b.value - a.value);
  }, [path]);

  const currentCategoryName = path.length > 0 ? path[path.length - 1].name : '面部护理';

  const handleDrillDown = (node: any) => {
    if (path.length < 2 && node.children && node.children.length > 0) {
      setPath(prev => [...prev, node]);
    }
  };

  const handleGoBack = () => {
    setPath(prev => prev.slice(0, -1));
  };

  const navigateToPath = (index: number) => {
    if (index === -1) {
      setPath([]);
    } else {
      setPath(prev => prev.slice(0, index + 1));
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 140; 
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveTab(id);
    }
  };

  const CustomizedContent = (props: any) => {
    const { x, y, width, height, name, displayValue, percentage, index } = props;
    const colors = ['#FE2062', '#FF4D84', '#FF79A6', '#FFA6C8', '#FFD2E9'];
    const fillColor = colors[index % colors.length];
    const showText = width > 70 && height > 30;

    return (
      <g onClick={() => handleDrillDown(props)} className="cursor-pointer group">
        <rect
          x={x} y={y} width={width} height={height}
          style={{ fill: fillColor, stroke: '#111827', strokeWidth: 2, transition: 'all 0.3s' }}
          className="group-hover:brightness-110"
        />
        {showText && (
          <foreignObject x={x + 4} y={y + 4} width={width - 8} height={height - 8}>
            <div className="text-white flex flex-col h-full pointer-events-none overflow-hidden">
              <p className="text-[10px] font-black truncate leading-tight drop-shadow-md">{name}</p>
              <div className="mt-auto">
                <p className="text-[9px] font-bold opacity-90 truncate">{displayValue}</p>
                <p className="text-[9px] font-bold opacity-80">{percentage}%</p>
              </div>
            </div>
          </foreignObject>
        )}
      </g>
    );
  };

  const PodiumItem = ({ rank, title, sales, image, height }: { rank: number; title: string; sales: string; image: string; height: string }) => {
    const crownColor = rank === 1 ? 'text-yellow-400' : rank === 2 ? 'text-slate-300' : 'text-orange-300';
    const podiumColor = rank === 1 ? 'bg-gray-800' : 'bg-gray-900';
    const borderColor = 'border-[#FE2062]';
    
    return (
      <div className={`flex flex-col items-center flex-1 min-w-0 transition-all duration-500`}>
        <div className="relative mb-3 flex flex-col items-center">
          <div className={`${crownColor} mb-1 animate-bounce-slow`}>
            <Crown size={rank === 1 ? 20 : 16} fill="currentColor" />
          </div>
          <div className={`relative w-16 h-16 rounded-xl border-[2px] ${borderColor} p-0.5 shadow-lg shadow-[#FE2062]/10 overflow-hidden bg-gray-950`}>
            <img src={image} className="w-full h-full object-cover rounded-lg" alt={title} />
          </div>
        </div>
        
        <div className="w-full text-center px-1 mb-2">
          <p className="text-[9px] font-black text-gray-200 truncate leading-tight">
            {title}
          </p>
          <p className="text-[8px] font-bold text-[#FE2062] mt-0.5">
            销量: {sales}
          </p>
        </div>
        
        <div className={`w-full ${podiumColor} ${height} rounded-t-lg flex flex-col items-center justify-center border-x border-t border-gray-700/50 shadow-inner relative`}>
           <span className="text-xl font-black text-gray-500 opacity-80">{rank}</span>
           <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700/30" />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col bg-gray-950 min-h-screen">
      <div className="bg-gray-950 shadow-none border-b border-gray-900">
        <div className="flex overflow-x-auto scrollbar-hide px-4 gap-8 pt-2">
          {[
            { id: 'distribution', label: '品类占比' },
            { id: 'overview', label: '数据概览' },
            { id: 'price', label: '价格分布' },
            { id: 'bestseller', label: '品类爆款' },
            { id: 'influencer', label: 'Top达人' },
            { id: 'creative', label: '爆款素材' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => scrollToSection(tab.id)}
              className={`shrink-0 text-sm font-black transition-all pb-2.5 relative ${
                activeTab === tab.id ? 'text-[#FE2062]' : 'text-gray-500 hover:text-gray-400'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#FE2062] rounded-t-full shadow-[0_-2px_6px_rgba(254,32,98,0.5)]" />
              )}
            </button>
          ))}
        </div>
        
        <div className="px-4 pb-2 pt-0.5 bg-gray-950">
          <div className="flex bg-[#0D1117] p-0.5 rounded-full border border-gray-800/60 shadow-inner">
            {[
              { id: 'day', label: '日榜' },
              { id: 'week', label: '周榜' },
              { id: 'month', label: '月榜' },
              { id: 'custom', label: '自定义' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeRange(t.id)}
                className={`flex-1 py-1 text-[11px] font-black rounded-full transition-all duration-300 ${
                  timeRange === t.id 
                    ? 'bg-[#FE2062] text-white shadow-[0_0_20px_rgba(254,32,98,0.4)] transform scale-[1.01]' 
                    : 'text-gray-500 hover:text-gray-400'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 pb-4 space-y-10">
        {/* 品类销量占比 */}
        <section id="distribution" className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-[#FE2062] rounded-full shadow-[0_0_8px_#FE2062]" />
              <h3 className="text-gray-100 font-black text-sm">品类销量占比｜<span className="text-blue-400">{currentCategoryName}</span></h3>
            </div>
            {path.length > 0 && (
              <button 
                onClick={handleGoBack}
                className="flex items-center gap-1.5 text-blue-400 font-bold text-[11px] bg-blue-400/10 px-3 py-1.5 rounded-lg border border-blue-400/20 active:scale-95 transition-all"
              >
                <span className="scale-x-[-1]">{ICONS.Undo}</span> 返回
              </button>
            )}
          </div>
          
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 shadow-2xl overflow-hidden">
            <div className="flex items-center flex-wrap gap-1 mb-3 text-[11px] font-bold px-1 overflow-hidden">
              <button onClick={() => navigateToPath(-1)} className={`${path.length === 0 ? "text-[#FE2062]" : "text-gray-600 hover:text-gray-400"}`}>
                美妆个护/美妆护理/面部护理套装
              </button>
              {path.map((p, idx) => (
                <React.Fragment key={idx}>
                  <span className="text-gray-800">{ICONS.Chevron}</span>
                  <button onClick={() => navigateToPath(idx)} className={`${idx === path.length - 1 ? "text-[#FE2062]" : "text-gray-600 hover:text-gray-400"}`}>{p.name}</button>
                </React.Fragment>
              ))}
            </div>
            <div className="w-full aspect-[2/1] rounded-xl overflow-hidden bg-gray-950 border border-gray-800 shadow-inner">
              <ResponsiveContainer width="100%" height="100%">
                <Treemap data={currentLevelData} dataKey="value" stroke="#111827" content={<CustomizedContent />} animationDuration={800} />
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* 数据概览 */}
        <section id="overview" className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <div className="w-1 h-4 bg-[#FE2062] rounded-full shadow-[0_0_8px_#FE2062]" />
            <h3 className="text-gray-100 font-black text-sm">数据概览｜<span className="text-blue-400">{currentCategoryName}</span></h3>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { label: '销量', value: '1,382.15万', sub: '+12.5%', icon: ShoppingBag },
              { label: '动销品', value: '15.42万', sub: '+3.4%', icon: Package },
              { label: '上新品', value: '2.18万', sub: '+8.2%', icon: Zap },
              { label: '平均客单价', value: '$22.8', sub: '-1.5%', icon: DollarSign },
              { label: '市场集中度', value: '45.2%', sub: '稳健型', icon: BarChart3 },
              { label: '带货达人数', value: '13.33万', sub: '+18.1%', icon: Users },
            ].map((stat, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 p-3 rounded-xl shadow-lg group hover:border-gray-700 transition-colors flex flex-col justify-between min-h-[90px]">
                <div className="space-y-1">
                  <p className="text-sm font-black text-gray-100 truncate">{stat.value}</p>
                  <p className={`text-[9px] font-bold ${stat.sub.startsWith('+') ? 'text-green-500' : 'text-gray-500'}`}>{stat.sub}</p>
                </div>
                <p className="text-xs font-bold text-gray-500 mt-2 truncate">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 价格-销量分布 - 新增模块 */}
        <section id="price" className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <div className="w-1 h-4 bg-[#FE2062] rounded-full shadow-[0_0_8px_#FE2062]" />
            <h3 className="text-gray-100 font-black text-sm">价格-销量分布｜<span className="text-blue-400">{currentCategoryName}</span></h3>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs font-black text-gray-400">价格带 ($)</span>
              <span className="text-xs font-black text-gray-600">商品数</span>
            </div>
            <div className="space-y-4">
              {PRICE_DISTRIBUTION_DATA.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-12 shrink-0 text-right">
                    <span className="text-[11px] font-black text-gray-500">{item.range}</span>
                  </div>
                  <div className="flex-1 h-3.5 bg-gray-800 rounded-full overflow-hidden relative border border-gray-800/50">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${item.highlighted ? 'bg-[#FE2062] shadow-[0_0_10px_rgba(254,32,98,0.4)]' : 'bg-[#FE2062]/20'}`}
                      style={{ width: `${item.percentage * 2}%` }} // 倍率处理方便视觉展示
                    />
                  </div>
                  <div className="shrink-0 min-w-[100px]">
                    <span className={`text-[11px] font-black ${item.highlighted ? 'text-gray-200' : 'text-gray-500'}`}>
                      {item.value} ({item.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 品类爆款 */}
        <section id="bestseller" className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-[#FE2062] rounded-full shadow-[0_0_8px_#FE2062]" />
              <h3 className="text-gray-100 font-black text-sm">品类爆款｜<span className="text-blue-400">{currentCategoryName}</span></h3>
            </div>
            <div className="flex bg-gray-900 p-0.5 rounded-lg border border-gray-800">
              <button onClick={() => setProdType('hot')} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${prodType === 'hot' ? 'bg-[#FE2062] text-white shadow-lg' : 'text-gray-500'}`}>热销品</button>
              <button onClick={() => setProdType('new')} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${prodType === 'new' ? 'bg-[#FE2062] text-white shadow-lg' : 'text-gray-500'}`}>新品</button>
            </div>
          </div>
          
          <div className="bg-gray-900/50 border border-gray-800 px-2 py-6 rounded-2xl shadow-xl">
             <div className="flex items-end justify-center gap-1.5 mt-2">
                <PodiumItem 
                  rank={2} 
                  title="SK-II 经典护肤套装" 
                  sales="8.42万"
                  image={`https://picsum.photos/seed/p-prod-2/150/150`}
                  height="h-16"
                />
                <PodiumItem 
                  rank={1} 
                  title="Estée Lauder 雅诗兰黛小棕瓶" 
                  sales="12.15万"
                  image={`https://picsum.photos/seed/p-prod-1/150/150`}
                  height="h-28"
                />
                <PodiumItem 
                  rank={3} 
                  title="L'Oreal 复颜玻尿酸..." 
                  sales="6.88万"
                  image={`https://picsum.photos/seed/p-prod-3/150/150`}
                  height="h-12"
                />
             </div>
          </div>
          
          <button className="w-full py-4 bg-gray-900 border border-gray-800 rounded-xl text-[11px] font-black text-gray-500 flex items-center justify-center gap-1 active:scale-95 transition-all">
            更多品类爆款 <ChevronRight size={14} />
          </button>
        </section>

        {/* Top 达人 */}
        <section id="influencer" className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-[#FE2062] rounded-full shadow-[0_0_8px_#FE2062]" />
              <h3 className="text-gray-100 font-black text-sm">Top达人｜<span className="text-blue-400">{currentCategoryName}</span></h3>
            </div>
            <span className="text-[10px] text-gray-600 font-bold italic tracking-wider uppercase">BY GMV RANKING</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-900 border border-gray-800 p-4 rounded-2xl text-center flex flex-col items-center shadow-xl group hover:border-[#FE2062]/30 transition-all">
                <div className="relative mb-3">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-800 p-1 bg-gray-950 group-hover:border-[#FE2062] transition-all">
                    <img src={`https://picsum.photos/seed/inf-market-${i}/120/120`} className="w-full h-full object-cover rounded-full" alt="Influencer" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-[#FE2062] text-white text-[9px] px-1.5 py-0.5 rounded-full font-black border-2 border-gray-900">NO.{i}</div>
                </div>
                <p className="text-[11px] font-black text-gray-100 truncate w-full mb-0.5">TikTok_Creator_{i}</p>
                <p className="text-[12px] font-black text-[#FE2062]">${(Math.random() * 80 + 20).toFixed(1)}w</p>
                <p className="text-[8px] text-gray-600 font-bold uppercase mt-1 tracking-tighter">EST. GMV</p>
              </div>
            ))}
          </div>
          <button className="w-full py-4 bg-gray-900 border border-gray-800 rounded-xl text-[11px] font-black text-gray-500 flex items-center justify-center gap-1 active:scale-95 transition-all">
            完整达人榜单 <ChevronRight size={14} />
          </button>
        </section>

        {/* 爆款素材 */}
        <section id="creative" className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-[#FE2062] rounded-full shadow-[0_0_8px_#FE2062]" />
              <h3 className="text-gray-100 font-black text-sm">爆款素材｜<span className="text-blue-400">{currentCategoryName}</span></h3>
            </div>
            <div className="flex bg-gray-900 p-0.5 rounded-lg border border-gray-800">
              <button onClick={() => setCreativeType('video')} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${creativeType === 'video' ? 'bg-[#FE2062] text-white shadow-lg' : 'text-gray-500'}`}>视频</button>
              <button onClick={() => setCreativeType('ad')} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${creativeType === 'ad' ? 'bg-[#FE2062] text-white shadow-lg' : 'text-gray-500'}`}>广告</button>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-44 shrink-0 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl group cursor-pointer hover:border-gray-700 transition-all">
                <div className="relative h-64">
                  <img src={`https://picsum.photos/seed/crea-market-${i}/300/400`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt="Creative" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30">
                      <Play size={20} className="text-white fill-white ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg">
                    <Flame size={10} className="text-[#FE2062]" />
                    <span className="text-[9px] font-black text-white uppercase tracking-tighter">HOT CONTENT</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-[11px] font-bold truncate mb-1">爆款带货素材示例 #{i}</p>
                    <div className="flex items-center gap-1 text-[9px] text-gray-400 font-bold uppercase tracking-tight">
                      <Clock size={8} /> 2024-03-20 发布
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-gray-800 flex justify-between items-center bg-gray-900">
                  <div><p className="text-xs font-black text-gray-100">{(Math.random() * 100 + 10).toFixed(1)}w</p><p className="text-[8px] text-gray-600 font-black uppercase tracking-tighter mt-0.5">PLAYS</p></div>
                  <div className="text-right"><p className="text-xs font-black text-[#FE2062]">{(Math.random() * 4 + 1.2).toFixed(2)}</p><p className="text-[8px] text-gray-600 font-black uppercase tracking-tighter mt-0.5">ROAS</p></div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-2 py-4 bg-gray-900 border border-gray-800 rounded-xl text-[11px] font-black text-gray-500 flex items-center justify-center gap-1 active:scale-95 transition-all">
            更多爆款素材 <ChevronRight size={14} />
          </button>
        </section>
      </div>
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-5%); }
          50% { transform: translateY(0); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default MarketAnalysis;
