
import React, { useState } from 'react';
import { ICONS } from '../constants';
import { 
  Search, 
  ChevronDown, 
  ListFilter, 
  Star, 
  Trophy, 
  UserCheck, 
  Share2, 
  X, 
  MessageCircle, 
  Globe, 
  Copy, 
  Check, 
  Calendar
} from 'lucide-react';

interface DiscoveryProps {
  onProductClick?: (id: number) => void;
}

const Discovery: React.FC<DiscoveryProps> = ({ onProductClick }) => {
  const [activeSubTab, setActiveSubTab] = useState('products');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [activeRankLabel, setActiveRankLabel] = useState('');
  const [isRankDropdownOpen, setIsRankDropdownOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const [appliedCategoryL1, setAppliedCategoryL1] = useState('全部');
  const [appliedCategoryL2, setAppliedCategoryL2] = useState('全部');
  const [appliedCategoryL3, setAppliedCategoryL3] = useState('全部');

  const [draftCategoryL1, setDraftCategoryL1] = useState('全部');
  const [draftCategoryL2, setDraftCategoryL2] = useState('全部');
  const [draftCategoryL3, setDraftCategoryL3] = useState('全部');

  // 直播总销量排序状态
  const [isSalesSortModalOpen, setIsSalesSortModalOpen] = useState(false);
  const [appliedSalesSort, setAppliedSalesSort] = useState('直播总销量排序');
  const salesSortOptions = [
    '佣金比例排序',
    '销售额排序',
    '销量排序'
  ];

  const [isRankTimeModalOpen, setIsRankTimeModalOpen] = useState(false);
  const rankTimeOptions = [
    { label: '日榜', date: '2026-02-03' },
    { label: '周榜', date: '2026-02-02' },
    { label: '月榜', date: '2026-02-01' },
  ];
  const [selectedRankTimeIndex, setSelectedRankTimeIndex] = useState(0);

  const [isAllFilterModalOpen, setIsAllFilterModalOpen] = useState(false);

  const shopTypeOptions = ['全部', '跨境店', '本土店'] as const;
  const advancedOptions = ['上新商品', '售出商品', '本地仓商品', '爆款商品'] as const;
  const commissionOptions = ['<15%', '15%-30%', '30%-50%', '50%-70%', '>70%'] as const;
  const deliveryOptions = ['全部', '直播带货', '视频带货'] as const;
  const influencerCountOptions = ['100-499', '500-999', '1000-5000', '5000-1万', '>1万'] as const;
  const salesOptions = ['<1万', '1万-10万', '10万-20万', '20万-30万', '30万-40万', '50万-100万', '>100万'] as const;

  const [appliedShopType, setAppliedShopType] = useState<(typeof shopTypeOptions)[number]>('全部');
  const [appliedAdvanced, setAppliedAdvanced] = useState<(typeof advancedOptions)[number] | ''>('');
  const [appliedCommission, setAppliedCommission] = useState<(typeof commissionOptions)[number] | ''>('');
  const [appliedDelivery, setAppliedDelivery] = useState<(typeof deliveryOptions)[number]>('全部');
  const [appliedInfluencerCount, setAppliedInfluencerCount] = useState<(typeof influencerCountOptions)[number] | ''>('');
  const [appliedSales, setAppliedSales] = useState<(typeof salesOptions)[number] | ''>('');

  const [draftShopType, setDraftShopType] = useState<(typeof shopTypeOptions)[number]>('全部');
  const [draftAdvanced, setDraftAdvanced] = useState<(typeof advancedOptions)[number] | ''>('');
  const [draftCommission, setDraftCommission] = useState<(typeof commissionOptions)[number] | ''>('');
  const [draftDelivery, setDraftDelivery] = useState<(typeof deliveryOptions)[number]>('全部');
  const [draftInfluencerCount, setDraftInfluencerCount] = useState<(typeof influencerCountOptions)[number] | ''>('');
  const [draftSales, setDraftSales] = useState<(typeof salesOptions)[number] | ''>('');
  
  
  const subTabs = [
    { id: 'products', label: '商品' },
    { id: 'shops', label: '店铺' },
    { id: 'creators', label: '达人' },
    { id: 'live', label: '直播' },
    { id: 'video', label: '视频' },
    { id: 'ads', label: '广告' },
    { id: 'advertisers', label: '广告主' },
  ];

  const rankOptions = ['热销榜', '新品榜', '热推榜'];

  const categoryTree: Record<string, Record<string, string[]>> = {
    '全部': {
      '全部': ['全部'],
    },
    '服饰内衣': {
      '全部': ['全部'],
      '女装': ['全部', '裤子', '羽绒服', '毛呢外套', '短外套', '毛针织衫', '连衣裙', 'T恤', '套装/学生校服/工作制服'],
      '男装': ['全部', 'T恤', '衬衫', '外套', '裤子'],
      '童装/婴儿装/亲子装': ['全部', '套装', '上衣', '裤子'],
      '内衣/袜子/家居服': ['全部', '内衣', '袜子', '家居服'],
      '服饰配件/皮带/帽子': ['全部', '帽子', '皮带', '围巾'],
    },
    '鞋靴箱包': {
      '全部': ['全部'],
      '女鞋': ['全部', '运动鞋', '凉鞋', '高跟鞋'],
      '男鞋': ['全部', '运动鞋', '皮鞋'],
      '箱包': ['全部', '双肩包', '手提包', '钱包'],
    },
    '食品饮料': {
      '全部': ['全部'],
      '零食': ['全部', '饼干', '糖果', '坚果'],
      '饮料': ['全部', '茶饮', '咖啡', '功能饮料'],
    },
    '美妆护肤': {
      '全部': ['全部'],
      '护肤': ['全部', '面膜', '洁面', '精华'],
      '彩妆': ['全部', '口红', '底妆', '眼妆'],
    },
    '运动户外': {
      '全部': ['全部'],
      '运动服饰': ['全部', '上衣', '裤子'],
      '户外装备': ['全部', '帐篷', '背包'],
    },
    '日用百货': {
      '全部': ['全部'],
      '清洁用品': ['全部', '纸品', '清洁剂'],
      '收纳': ['全部', '收纳盒', '置物架'],
    },
    '家居家纺': {
      '全部': ['全部'],
      '床上用品': ['全部', '四件套', '被子'],
      '家居饰品': ['全部', '摆件', '挂画'],
    },
  };

  const level1Options = Object.keys(categoryTree);
  const level2Options = Object.keys(categoryTree[draftCategoryL1] || { '全部': ['全部'] });
  const level3Options = (categoryTree[draftCategoryL1]?.[draftCategoryL2] || ['全部']);

  const appliedCategoryLabel = (() => {
    if (appliedCategoryL1 === '全部') return '全部类目';
    if (appliedCategoryL3 !== '全部') return appliedCategoryL3;
    if (appliedCategoryL2 !== '全部') return appliedCategoryL2;
    return appliedCategoryL1;
  })();

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderListItem = (item: number) => {
    const isProduct = activeSubTab === 'products';
    const isCreator = activeSubTab === 'creators';
    const price = (Math.random() * 300 + 50).toFixed(2);
    const commission = Math.floor(Math.random() * 30 + 10);
    const salesAmount = (Math.random() * 800 + 100).toFixed(2);
    const salesCount = (Math.random() * 3 + 0.5).toFixed(2);

    return (
      <div 
        key={item} 
        onClick={() => isProduct && onProductClick?.(item)}
        className={`bg-gray-900 rounded-2xl p-4 border border-gray-800 ${isProduct ? 'cursor-pointer active:scale-[0.98]' : ''}`}
      >
        {/* 商品信息区 */}
        <div className="flex gap-3 mb-3">
          <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-800 shrink-0">
            <img 
              src={`https://picsum.photos/seed/dis-${activeSubTab}-${item}/200/200`} 
              className="w-full h-full object-cover" 
              alt="Thumbnail" 
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <h4 className="text-[14px] font-bold text-gray-100 line-clamp-1 flex-1">
                {isProduct ? '商品名称' : isCreator ? '达人账号_' : '数据项_'}{isProduct ? '' : item}
              </h4>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(item);
                }}
                className={`shrink-0 ml-2 p-1.5 rounded-lg transition-all active:scale-90 ${
                  favorites.includes(item) 
                    ? 'text-[#FE2062]' 
                    : 'text-gray-600 hover:text-gray-400'
                }`}
              >
                <Star size={16} fill={favorites.includes(item) ? "currentColor" : "none"} />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[13px] text-gray-400">${price}</span>
              <span className="text-[12px] text-gray-500">佣金比例</span>
              <span className="text-[12px] text-[#FE2062] font-bold">{commission}%</span>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex items-center gap-1">
                <span className="text-[11px]">🇺🇸</span>
                <span className="text-[11px] text-[#3B82F6]">食品饮料</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-full bg-gray-800 flex items-center justify-center">
                  <span className="text-[8px]">🏪</span>
                </div>
                <span className="text-[11px] text-gray-500">Gallet</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 数据指标区 */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-800">
          <div className="text-center">
            <p className="text-[16px] font-black text-gray-100">{salesAmount}万</p>
            <p className="text-[11px] text-[#3B82F6] font-medium">销售额</p>
          </div>
          <div className="text-center">
            <p className="text-[16px] font-black text-gray-100">{salesCount}万</p>
            <p className="text-[11px] text-gray-500 font-medium">销量</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-full bg-gray-950 relative">
      {/* 顶部固定区域 */}
      <div className="bg-gray-950 px-4 pt-3 pb-2 sticky top-0 z-30 space-y-3">
        {/* 1. 模块切换导航 */}
        <div className="flex items-center justify-between overflow-x-auto scrollbar-hide gap-6">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`relative shrink-0 text-[15px] font-bold transition-all whitespace-nowrap pb-1 ${
                activeSubTab === tab.id ? 'text-gray-100 font-black scale-105' : 'text-gray-500 hover:text-gray-400 font-semibold'
              }`}
            >
              {tab.label}
              {activeSubTab === tab.id && (
                <div className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-[#FE2062] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* 2. 搜索框 + 榜单下拉按钮 */}
        <div className="flex items-center gap-3 relative">
          <div className={`flex-1 flex items-center gap-2 bg-gray-900/60 rounded-full px-4 py-2 border transition-all duration-300 ${isSearchFocused ? 'border-[#FE2062]/50 shadow-[0_0_15px_rgba(254,32,98,0.1)]' : 'border-gray-800 focus-within:border-gray-700'}`}>
            <input
              type="text"
              placeholder="搜索商品、达人或店铺"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-300 outline-none placeholder-gray-600"
            />
            <Search size={16} className={`transition-colors ${isSearchFocused ? 'text-[#FE2062]' : 'text-gray-400'}`} />
          </div>
          
          {!isSearchFocused && (
            <div className="relative animate-in fade-in slide-in-from-right-2 duration-300">
              {activeRankLabel ? (
                <button 
                  onClick={() => setActiveRankLabel('')}
                  className="flex items-center gap-1.5 bg-[#FE2062]/10 px-4 py-2 rounded-full border border-[#FE2062]/20 active:scale-95 transition-all"
                >
                  <Trophy size={14} className="text-[#FE2062] fill-[#FE2062]" />
                  <span className="text-xs font-black text-[#FE2062]">{activeRankLabel}</span>
                  <X size={12} className="text-[#FE2062]" />
                </button>
              ) : (
                <button 
                  onClick={() => setIsRankDropdownOpen(!isRankDropdownOpen)}
                  className="flex items-center gap-1.5 bg-[#FE2062]/10 px-4 py-2 rounded-full border border-[#FE2062]/20 active:scale-95 transition-all"
                >
                  <Trophy size={14} className="text-[#FE2062] fill-[#FE2062]" />
                  <span className="text-xs font-black text-[#FE2062]">选择榜单</span>
                  <ChevronDown size={12} className={`text-[#FE2062] transition-transform ${isRankDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
              )}

              {isRankDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-[35]" onClick={() => setIsRankDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-32 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl z-[40] overflow-hidden animate-in fade-in slide-in-from-top-2">
                    {rankOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setActiveRankLabel(opt);
                          setIsRankDropdownOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left text-xs font-black text-gray-300 hover:bg-[#FE2062]/10 hover:text-[#FE2062] transition-colors"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* 3. 筛选行 */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => {
              setDraftCategoryL1(appliedCategoryL1);
              setDraftCategoryL2(appliedCategoryL2);
              setDraftCategoryL3(appliedCategoryL3);
              setIsCategoryModalOpen(true);
            }}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-gray-900/40 border border-gray-800 rounded-full text-[11px] font-bold text-gray-400 truncate"
          >
            {appliedCategoryLabel} <ChevronDown size={12} className="shrink-0" />
          </button>
          {activeRankLabel ? (
            <button
              onClick={() => setIsRankTimeModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-gray-900/40 border border-gray-800 rounded-full text-[11px] font-bold text-gray-400 truncate"
            >
              {`${rankTimeOptions[selectedRankTimeIndex]?.label ?? '日榜'}(${rankTimeOptions[selectedRankTimeIndex]?.date ?? '2026-02-03'})`}{' '}
              <ChevronDown size={12} className="shrink-0" />
            </button>
          ) : (
            <button
              onClick={() => setIsSalesSortModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-gray-900/40 border border-gray-800 rounded-full text-[11px] font-bold text-gray-400 truncate"
            >
              {appliedSalesSort} <ChevronDown size={12} className="shrink-0" />
            </button>
          )}

          {!activeRankLabel && (
            <button
              onClick={() => {
                setDraftShopType(appliedShopType);
                setDraftAdvanced(appliedAdvanced);
                setDraftCommission(appliedCommission);
                setDraftDelivery(appliedDelivery);
                setDraftInfluencerCount(appliedInfluencerCount);
                setDraftSales(appliedSales);
                setIsAllFilterModalOpen(true);
              }}
              className="shrink-0 p-1.5 text-gray-500 hover:text-gray-300"
            >
              <ListFilter size={20} />
            </button>
          )}
        </div>
      </div>

      {isCategoryModalOpen && (
        <>
          <div
            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
            onClick={() => setIsCategoryModalOpen(false)}
          />
          <div className="fixed left-0 right-0 bottom-0 z-[91] bg-gray-900 rounded-t-2xl border-t border-gray-800 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="px-4 pt-4 pb-3 border-b border-gray-800">
              <div className="relative flex items-center justify-center">
                <div className="text-[15px] font-black text-gray-100">全部类目</div>
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="h-[420px] flex">
              <div className="w-1/3 bg-gray-900 overflow-y-auto">
                {level1Options.map((name) => {
                  const isActive = draftCategoryL1 === name;
                  return (
                    <button
                      key={name}
                      onClick={() => {
                        setDraftCategoryL1(name);
                        setDraftCategoryL2('全部');
                        setDraftCategoryL3('全部');
                      }}
                      className={`w-full relative text-left px-4 py-3 text-[13px] font-bold ${
                        isActive ? 'text-[#FE2062] bg-gray-800' : 'text-gray-300'
                      }`}
                    >
                      {isActive && <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#FE2062]" />}
                      {name}
                    </button>
                  );
                })}
              </div>

              <div className="w-1/3 bg-gray-900 overflow-y-auto border-l border-gray-800">
                {level2Options.map((name) => {
                  const isActive = draftCategoryL2 === name;
                  return (
                    <button
                      key={name}
                      onClick={() => {
                        setDraftCategoryL2(name);
                        setDraftCategoryL3('全部');
                      }}
                      className={`w-full text-left px-4 py-3 text-[13px] font-bold ${
                        isActive ? 'text-[#FE2062]' : 'text-gray-300'
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>

              <div className="w-1/3 bg-gray-900 overflow-y-auto border-l border-gray-800">
                {level3Options.map((name) => {
                  const isActive = draftCategoryL3 === name;
                  return (
                    <button
                      key={name}
                      onClick={() => setDraftCategoryL3(name)}
                      className={`w-full text-left px-4 py-3 text-[13px] font-bold ${
                        isActive ? 'text-[#FE2062]' : 'text-gray-300'
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="px-4 py-4 border-t border-gray-800 flex gap-3">
              <button
                onClick={() => {
                  setDraftCategoryL1('全部');
                  setDraftCategoryL2('全部');
                  setDraftCategoryL3('全部');
                }}
                className="flex-1 h-11 rounded-full border border-gray-700 text-gray-200 text-[14px] font-black"
              >
                重置
              </button>
              <button
                onClick={() => {
                  setAppliedCategoryL1(draftCategoryL1);
                  setAppliedCategoryL2(draftCategoryL2);
                  setAppliedCategoryL3(draftCategoryL3);
                  setIsCategoryModalOpen(false);
                }}
                className="flex-1 h-11 rounded-full bg-[#FE2062] text-white text-[14px] font-black"
              >
                确定
              </button>
            </div>
          </div>
        </>
      )}

      {isAllFilterModalOpen && (
        <>
          <div
            className="fixed inset-0 z-[94] bg-black/70 backdrop-blur-sm"
            onClick={() => setIsAllFilterModalOpen(false)}
          />
          <div className="fixed left-0 right-0 bottom-0 z-[95] bg-gray-900 rounded-t-2xl border-t border-gray-800 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="px-4 pt-4 pb-3 border-b border-gray-800">
              <div className="relative flex items-center justify-center">
                <div className="text-[15px] font-black text-gray-100">商品信息</div>
                <button
                  onClick={() => setIsAllFilterModalOpen(false)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="h-[460px] overflow-y-auto px-4 py-4">
              <div className="space-y-5">
                <div>
                  <div className="text-[12px] font-black text-gray-200 mb-3">店铺类型</div>
                  <div className="flex flex-wrap gap-2">
                    {shopTypeOptions.map((opt) => {
                      const active = draftShopType === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => setDraftShopType(opt)}
                          className={`px-4 py-2 rounded-full text-[12px] font-black border transition-colors ${
                            active
                              ? 'bg-[#FE2062] border-[#FE2062] text-white'
                              : 'bg-gray-800 border-gray-700 text-gray-300'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="text-[12px] font-black text-gray-200 mb-3">高级筛选</div>
                  <div className="flex flex-wrap gap-2">
                    {advancedOptions.map((opt) => {
                      const active = draftAdvanced === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => setDraftAdvanced(active ? '' : opt)}
                          className={`px-4 py-2 rounded-full text-[12px] font-black border transition-colors ${
                            active
                              ? 'bg-[#FE2062]/20 border-[#FE2062] text-[#FE2062]'
                              : 'bg-gray-800 border-gray-700 text-gray-300'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="text-[12px] font-black text-gray-200 mb-3">佣金比例</div>
                  <div className="flex flex-wrap gap-2">
                    {commissionOptions.map((opt) => {
                      const active = draftCommission === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => setDraftCommission(active ? '' : opt)}
                          className={`px-4 py-2 rounded-full text-[12px] font-black border transition-colors ${
                            active
                              ? 'bg-[#FE2062]/20 border-[#FE2062] text-[#FE2062]'
                              : 'bg-gray-800 border-gray-700 text-gray-300'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="text-[12px] font-black text-gray-200 mb-3">带货方式</div>
                  <div className="flex flex-wrap gap-2">
                    {deliveryOptions.map((opt) => {
                      const active = draftDelivery === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => setDraftDelivery(opt)}
                          className={`px-4 py-2 rounded-full text-[12px] font-black border transition-colors ${
                            active
                              ? 'bg-[#FE2062] border-[#FE2062] text-white'
                              : 'bg-gray-800 border-gray-700 text-gray-300'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="text-[12px] font-black text-gray-200 mb-3">关联达人数</div>
                  <div className="flex flex-wrap gap-2">
                    {influencerCountOptions.map((opt) => {
                      const active = draftInfluencerCount === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => setDraftInfluencerCount(active ? '' : opt)}
                          className={`px-4 py-2 rounded-full text-[12px] font-black border transition-colors ${
                            active
                              ? 'bg-[#FE2062]/20 border-[#FE2062] text-[#FE2062]'
                              : 'bg-gray-800 border-gray-700 text-gray-300'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="text-[12px] font-black text-gray-200 mb-3">商品销量</div>
                  <div className="flex flex-wrap gap-2">
                    {salesOptions.map((opt) => {
                      const active = draftSales === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => setDraftSales(active ? '' : opt)}
                          className={`px-4 py-2 rounded-full text-[12px] font-black border transition-colors ${
                            active
                              ? 'bg-[#FE2062]/20 border-[#FE2062] text-[#FE2062]'
                              : 'bg-gray-800 border-gray-700 text-gray-300'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 py-4 border-t border-gray-800 flex gap-3">
              <button
                onClick={() => {
                  setDraftShopType('全部');
                  setDraftAdvanced('');
                  setDraftCommission('');
                  setDraftDelivery('全部');
                  setDraftInfluencerCount('');
                  setDraftSales('');
                }}
                className="flex-1 h-11 rounded-full border border-gray-700 text-gray-200 text-[14px] font-black"
              >
                重置
              </button>
              <button
                onClick={() => {
                  setAppliedShopType(draftShopType);
                  setAppliedAdvanced(draftAdvanced);
                  setAppliedCommission(draftCommission);
                  setAppliedDelivery(draftDelivery);
                  setAppliedInfluencerCount(draftInfluencerCount);
                  setAppliedSales(draftSales);
                  setIsAllFilterModalOpen(false);
                }}
                className="flex-1 h-11 rounded-full bg-[#FE2062] text-white text-[14px] font-black"
              >
                确定
              </button>
            </div>
          </div>
        </>
      )}

      {isRankTimeModalOpen && (
        <>
          <div
            className="fixed inset-0 z-[96] bg-black/70 backdrop-blur-sm"
            onClick={() => setIsRankTimeModalOpen(false)}
          />
          <div className="fixed left-0 right-0 bottom-0 z-[97] bg-gray-900 rounded-t-2xl border-t border-gray-800 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="px-4 pt-4 pb-3 border-b border-gray-800">
              <div className="relative flex items-center justify-center">
                <div className="text-[15px] font-black text-gray-100">榜单时间</div>
                <button
                  onClick={() => setIsRankTimeModalOpen(false)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="px-4 py-2">
              {rankTimeOptions.map((opt, idx) => {
                const active = idx === selectedRankTimeIndex;
                return (
                  <button
                    key={`${opt.label}-${opt.date}`}
                    onClick={() => {
                      setSelectedRankTimeIndex(idx);
                      setIsRankTimeModalOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[13px] font-bold transition-colors ${
                      active
                        ? 'bg-[#FE2062]/20 text-[#FE2062]'
                        : 'text-gray-200 hover:bg-gray-800'
                    }`}
                  >
                    <span>{opt.label}</span>
                    <span className={`${active ? 'text-[#FE2062]' : 'text-gray-500'} text-[13px] font-bold`}>{opt.date}</span>
                  </button>
                );
              })}
            </div>

            <div className="h-3" />
          </div>
        </>
      )}

      {isSalesSortModalOpen && (
        <>
          <div
            className="fixed inset-0 z-[92] bg-black/70 backdrop-blur-sm"
            onClick={() => setIsSalesSortModalOpen(false)}
          />
          <div className="fixed left-0 right-0 bottom-0 z-[93] bg-gray-900 rounded-t-2xl border-t border-gray-800 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="px-4 pt-4 pb-3 border-b border-gray-800">
              <div className="relative flex items-center justify-center">
                <div className="text-[15px] font-black text-gray-100">排序方式</div>
                <button
                  onClick={() => setIsSalesSortModalOpen(false)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="px-4 py-2">
              {salesSortOptions.map((opt) => {
                const active = appliedSalesSort === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => {
                      setAppliedSalesSort(opt);
                      setIsSalesSortModalOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[13px] font-bold transition-colors ${
                      active
                        ? 'bg-[#FE2062]/20 text-[#FE2062]'
                        : 'text-gray-200 hover:bg-gray-800'
                    }`}
                  >
                    <span>{opt}</span>
                    {active && <Check size={16} className="text-[#FE2062]" />}
                  </button>
                );
              })}
            </div>

            <div className="h-3" />
          </div>
        </>
      )}

      {/* 列表数据 */}
      <div className="flex-1 bg-gray-950 p-4 space-y-4 pb-24 animate-in fade-in duration-500 relative">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => renderListItem(item))}
      </div>

      {/* 悬浮分享按钮 */}
      <button 
        onClick={() => setIsShareModalOpen(true)}
        className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.4)] flex items-center justify-center transition-all active:scale-90 border border-gray-100 group"
      >
        <Share2 size={24} className="text-gray-900 group-hover:rotate-12 transition-transform" />
      </button>

      {/* 分享组件 */}
      {isShareModalOpen && (
        <>
          <div 
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsShareModalOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-[101] bg-gray-900 rounded-t-2xl border-t border-gray-800 shadow-2xl animate-in slide-in-from-bottom duration-300 px-6 pt-8 pb-safe">
            <div className="flex items-center justify-between mb-8 px-2">
              <h3 className="text-lg font-black text-white">分享榜单至</h3>
              <button onClick={() => setIsShareModalOpen(false)} className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-4 gap-6 mb-8">
              {[
                { icon: <MessageCircle size={24} fill="#07C160" className="text-[#07C160]" />, label: '微信好友', color: 'bg-white' },
                { icon: <Globe size={24} className="text-[#07C160]" />, label: '朋友圈', color: 'bg-white' },
                { 
                  icon: copied ? <Check size={24} className="text-green-600" /> : <Copy size={24} className="text-gray-900" />, 
                  label: copied ? '已复制' : '复制链接', 
                  color: 'bg-white', 
                  action: handleCopyLink 
                },
                { icon: <Check size={24} className="text-gray-900" />, label: '生成海报', color: 'bg-white' },
              ].map((item, idx) => (
                <button key={idx} onClick={item.action} className="flex flex-col items-center gap-3 group">
                  <div className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center shadow-lg group-active:scale-90 transition-all border border-gray-100`}>{item.icon}</div>
                  <span className="text-[11px] font-bold text-gray-400">{item.label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setIsShareModalOpen(false)} className="w-full py-4 bg-gray-800 text-gray-300 text-sm font-black rounded-xl hover:bg-gray-700 transition-colors">取消</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Discovery;