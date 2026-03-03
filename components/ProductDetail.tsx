import React, { useState, useRef, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ICONS } from '../constants';
import posterTemplateUrl from '../20260209-110202.jpg';
import { 
  ChevronLeft, 
  Share2, 
  Star, 
  ChevronRight, 
  Calendar,
  Clock,
  TrendingUp,
  BarChart3,
  Users,
  Video,
  Radio,
  DollarSign,
  Crown,
  X,
  MessageCircle,
  Globe,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Download,
  Filter,
  UserCheck,
  ArrowUpDown,
  ChevronDown
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface ProductDetailProps {
  productId: number | null;
  onBack: () => void;
}

const SKU_FILTER_TABS = [
  { id: 'color', label: '颜色' },
  { id: 'size', label: '尺寸' },
  { id: 'spec', label: '规格' },
  { id: 'material', label: '材质' },
  { id: 'storage', label: '存储容量' },
  { id: 'version', label: '版本' },
  { id: 'network', label: '网络制式' },
  { id: 'power', label: '功率' },
] as const;

type SkuFilterType = (typeof SKU_FILTER_TABS)[number]['id'];

const ProductDetail: React.FC<ProductDetailProps> = ({ productId, onBack }) => {
  const [activeTab, setActiveTab] = useState('trend');
  const [timeRange, setTimeRange] = useState('7d');
  const [trendMetricsSelected, setTrendMetricsSelected] = useState<string[]>(['sales', 'gmv']);
  const [trendValueType, setTrendValueType] = useState<'increment' | 'total'>('increment');
  const [showTrendOverlay, setShowTrendOverlay] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  
  const [isSkuModalOpen, setIsSkuModalOpen] = useState(false);
  const [selectedSkuSize, setSelectedSkuSize] = useState<'14' | '42'>('14');
  const [adFlowFilter, setAdFlowFilter] = useState<'ad' | 'noAd'>('ad');
  
  // 顶部精简吸顶栏状态（商品大卡片移出视口后显示）
  const [showCompactHeader, setShowCompactHeader] = useState(false);
  const [showStickyPanel, setShowStickyPanel] = useState(false);
  const [stickyPanelHeight, setStickyPanelHeight] = useState(0);
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(52);
  const productInfoRef = useRef<HTMLDivElement>(null);
  const stickyPanelRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);
  const lastScrollDirection = useRef<'up' | 'down'>('down');

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const update = () => setHeaderHeight(el.offsetHeight || 52);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const posterImageUrl = useMemo(() => {
    return posterTemplateUrl;
  }, []);

  const shareText = useMemo(() => {
    return '【FastMoss 爆款预警】🔥 TikTok 惊现黑马！销量全线飘红，大批达人全速进场！正势如破竹抢占榜首，🔗 https://fastmoss.com/s/xxxxxx 复制消息查看详情。';
  }, []);
  
  // 监听滚动：当商品大卡片整体滚出 fixed Header 下方时，显示精简吸顶栏；上滑显示吸顶面板，下滑隐藏
  useEffect(() => {
    const HEADER_HEIGHT = 52;
    const triggerEl = productInfoRef.current;
    if (!triggerEl) return;

    const findScrollableAncestor = (el: HTMLElement | null): HTMLElement | null => {
      let cur: HTMLElement | null = el;
      while (cur) {
        const style = window.getComputedStyle(cur);
        const overflowY = style.overflowY;
        if ((overflowY === 'auto' || overflowY === 'scroll') && cur.scrollHeight > cur.clientHeight) {
          return cur;
        }
        cur = cur.parentElement;
      }
      return null;
    };

    const scrollContainer = findScrollableAncestor(triggerEl);
    const scroller: HTMLElement | Window = scrollContainer ?? window;

    const getScrollTop = () => {
      return scroller === window
        ? window.scrollY || document.documentElement.scrollTop || 0
        : (scroller as HTMLElement).scrollTop;
    };

    lastScrollTop.current = getScrollTop();

    let rafId = 0;
    const handleScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        const rect = triggerEl.getBoundingClientRect();

        const isPastThreshold = rect.bottom <= HEADER_HEIGHT;

        const currentTop = getScrollTop();
        const delta = currentTop - lastScrollTop.current;
        lastScrollTop.current = currentTop;

        if (!isPastThreshold) {
          setShowCompactHeader(false);
          setShowStickyPanel(false);
          return;
        }

        // 上滑/下滑保持一致：过阈值后始终显示紧凑 Header + 吸顶面板
        setShowCompactHeader(true);
        setShowStickyPanel(true);
      });
    };

    (scroller === window ? window : (scroller as HTMLElement)).addEventListener('scroll', handleScroll, { passive: true } as any);
    handleScroll();
    return () => {
      (scroller === window ? window : (scroller as HTMLElement)).removeEventListener('scroll', handleScroll as any);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  // 计算吸顶面板高度，用于占位防跳动
  useEffect(() => {
    if (!showStickyPanel) {
      setStickyPanelHeight(0);
      return;
    }

    const el = stickyPanelRef.current;
    if (!el) return;

    const update = () => setStickyPanelHeight(el.offsetHeight);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [showStickyPanel]);
  
  // New states for Influencer List View and Export
  const [isAllInfluencersOpen, setIsAllInfluencersOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportEmail, setExportEmail] = useState('');
  
  // 达人列表筛选状态
  const [influencerCategory, setInfluencerCategory] = useState<'all' | 'video' | 'live'>('all');
  const [influencerCategoryOpen, setInfluencerCategoryOpen] = useState(false);
  const [influencerFollowers, setInfluencerFollowers] = useState<'all' | '<10w' | '10-50w' | '50-100w' | '100-500w' | '500-1000w' | '>1000w'>('all');
  const [influencerFollowersOpen, setInfluencerFollowersOpen] = useState(false);
  const [influencerSortMetric, setInfluencerSortMetric] = useState<'sales' | 'gmv' | 'followers'>('sales');
  const [influencerSortMenuOpen, setInfluencerSortMenuOpen] = useState(false);
  const [influencerSortOrder, setInfluencerSortOrder] = useState<'desc' | 'asc'>('desc');
  
  // 下拉框位置状态
  const [categoryButtonRect, setCategoryButtonRect] = useState<DOMRect | null>(null);
  const [followersButtonRect, setFollowersButtonRect] = useState<DOMRect | null>(null);
  const categoryButtonRef = useRef<HTMLButtonElement>(null);
  const followersButtonRef = useRef<HTMLButtonElement>(null);
  
  // SKU 分析模块状态
  const [skuFilterType, setSkuFilterType] = useState<SkuFilterType>('color');
  const [skuMetricType, setSkuMetricType] = useState<'sales' | 'amount'>('sales');
  const [skuViewType, setSkuViewType] = useState<'transaction' | 'stock'>('transaction'); // 成交占比/库存占比
  const [skuDropdownOpen, setSkuDropdownOpen] = useState(false);
  const [skuSalesExpanded, setSkuSalesExpanded] = useState(false);
  const [skuStockExpanded, setSkuStockExpanded] = useState(false);
  const [highlightedSkuIndex, setHighlightedSkuIndex] = useState<number | null>(null);
  
  // 投流分析模块状态 - 多选指标（最多2个）
  const [adMetricsSelected, setAdMetricsSelected] = useState<string[]>(['adCost', 'playCount']);
  const [isAdVideosOpen, setIsAdVideosOpen] = useState(false);
  const [adVideoSortMetric, setAdVideoSortMetric] = useState<'cost' | 'playCount' | 'roas' | 'ctr' | 'publishDate' | 'sales'>('cost');
  const [adVideoSortOrder, setAdVideoSortOrder] = useState<'asc' | 'desc'>('desc');
  const [adVideoFlowFilter, setAdVideoFlowFilter] = useState<'ad' | 'noAd'>('ad');
  const [adVideoSortMenuOpen, setAdVideoSortMenuOpen] = useState(false);

  const adVideoAllowedSortMetrics = useMemo(() => {
    return adVideoFlowFilter === 'ad'
      ? (['publishDate', 'cost', 'playCount', 'roas'] as const)
      : (['publishDate', 'sales', 'playCount'] as const);
  }, [adVideoFlowFilter]);

  useEffect(() => {
    if (!adVideoAllowedSortMetrics.includes(adVideoSortMetric as any)) {
      setAdVideoSortMetric('publishDate');
    }
  }, [adVideoAllowedSortMetrics, adVideoSortMetric]);
  
  // 关联视频模块状态
  const [relatedVideoFilter, setRelatedVideoFilter] = useState<'all' | 'ad' | 'noAd'>('all');
  const [isRelatedVideosOpen, setIsRelatedVideosOpen] = useState(false);
  const [relatedVideoSortType, setRelatedVideoSortType] = useState<'playDesc' | 'playAsc' | 'publishDesc' | 'publishAsc' | 'salesDesc' | 'salesAsc'>('playDesc');
  const [relatedVideoSortDropdownOpen, setRelatedVideoSortDropdownOpen] = useState(false);
  
  // 关联直播模块状态
  const [isRelatedLivesOpen, setIsRelatedLivesOpen] = useState(false);
  const [relatedLiveSortMetric, setRelatedLiveSortMetric] = useState<'sales' | 'followers' | 'viewers'>('sales');
  const [relatedLiveSortOrder, setRelatedLiveSortOrder] = useState<'desc' | 'asc'>('desc');
  const [relatedLiveSortMenuOpen, setRelatedLiveSortMenuOpen] = useState(false);
  
  // 评论模块状态
  const [isCommentListOpen, setIsCommentListOpen] = useState(false);
  const [commentEmotionFilter, setCommentEmotionFilter] = useState<'all' | 'positive' | 'negative'>('all');
  const [selectedViewpoint, setSelectedViewpoint] = useState<'positive' | 'negative'>('positive');
  const [isCommentsEmptyDemo, setIsCommentsEmptyDemo] = useState(false);
  const [pcUrlToastOpen, setPcUrlToastOpen] = useState(false);
  
  // 成交分析模块状态
  const [conversionType, setConversionType] = useState<'channel' | 'content' | 'delivery'>('channel');
  const [conversionDropdownOpen, setConversionDropdownOpen] = useState(false);
  
  // 评论数据
  const commentsData = [
    { id: 1, date: '2025-01-30 05:34:09', rating: 5, content: 'Delicious.', type: 'positive' },
    { id: 2, date: '2025-01-30 05:34:21', rating: 5, content: 'My new favorite!', type: 'positive' },
    { id: 3, date: '2024-11-09 03:20:54', rating: 4, content: 'Really good flavor.', type: 'positive' },
    { id: 4, date: '2024-10-15 12:45:30', rating: 5, content: 'Amazing product, will buy again!', type: 'positive' },
    { id: 5, date: '2024-09-20 08:15:22', rating: 3, content: 'Good but could be better.', type: 'negative' },
    { id: 6, date: '2024-08-10 14:30:00', rating: 2, content: '等待时间太长了', type: 'negative' },
    { id: 7, date: '2024-07-05 09:20:15', rating: 2, content: '袍子不厚，质量一般', type: 'negative' },
  ];
  
  // 正向观点饼图数据
  const positiveViewpointData = [
    { name: '口味好', value: 35, color: '#F59E0B' },
    { name: '质量优', value: 25, color: '#3B82F6' },
    { name: '物流快', value: 20, color: '#22C55E' },
    { name: '包装精美', value: 15, color: '#8B5CF6' },
    { name: '其他', value: 5, color: '#6B7280' },
  ];
  
  // 负向观点饼图数据
  const negativeViewpointData = [
    { name: '等待时间长', value: 30, color: '#F59E0B' },
    { name: '薄', value: 25, color: '#3B82F6' },
    { name: '袍子不厚', value: 20, color: '#22C55E' },
    { name: '发货有点慢', value: 15, color: '#8B5CF6' },
    { name: '其他', value: 10, color: '#6B7280' },
  ];
  
  // 关联直播数据
  const relatedLivesData = [
    { id: 1, cover: 'https://picsum.photos/seed/live1/120/160', title: 'LIVE配信カレンダー', hostId: 'ID:rerere___0', country: '🇯🇵 日本', followers: '6.12万', viewers: '4.32万', totalSales: 725 },
    { id: 2, cover: 'https://picsum.photos/seed/live2/120/160', title: '午夜直播 好物推荐', hostId: 'ID:beauty_live', country: '🇨🇳 中国', followers: '12.5万', viewers: '8.90万', totalSales: 1250 },
    { id: 3, cover: 'https://picsum.photos/seed/live3/120/160', title: '新品首发 限时抢购', hostId: 'ID:shop_master', country: '🇲🇾 马来西亚', followers: '3.80万', viewers: '2.15万', totalSales: 456 },
    { id: 4, cover: 'https://picsum.photos/seed/live4/120/160', title: '美妆专场 超低价', hostId: 'ID:makeup_queen', country: '🇹🇭 泰国', followers: '8.25万', viewers: '5.60万', totalSales: 890 },
    { id: 5, cover: 'https://picsum.photos/seed/live5/120/160', title: '周末特惠 不容错过', hostId: 'ID:weekend_sale', country: '🇻🇳 越南', followers: '5.40万', viewers: '3.20万', totalSales: 680 },
  ];

  // 投流视频数据
  const adVideosData = [
    { id: 1, cover: 'https://picsum.photos/seed/ad1/120/160', title: 'Trả lời @Nippon37E1 Giày bả...', source: 'shop.tiktok.com', cost: 'Rp16.80万', playCount: '16.80万', publishDate: '2025/11/5', roas: '6.25', ctr: '3.2%', sales: '12.5w' },
    { id: 2, cover: 'https://picsum.photos/seed/ad2/120/160', title: '新品上架 限时优惠中...', source: 'shop.tiktok.com', cost: 'Rp12.50万', playCount: '25.30万', publishDate: '2025/11/3', roas: '5.10', ctr: '2.4%', sales: '4.1w' },
    { id: 3, cover: 'https://picsum.photos/seed/ad3/120/160', title: '爆款推荐 必买清单...', source: 'shop.tiktok.com', cost: 'Rp8.90万', playCount: '18.60万', publishDate: '2025/11/1', roas: '4.85', ctr: '1.9%', sales: '2.8w' },
    { id: 4, cover: 'https://picsum.photos/seed/ad4/120/160', title: '双11特惠 不容错过...', source: 'shop.tiktok.com', cost: 'Rp22.10万', playCount: '32.40万', publishDate: '2025/10/28', roas: '7.02', ctr: '3.8%', sales: '6.9w' },
    { id: 5, cover: 'https://picsum.photos/seed/ad5/120/160', title: '好物分享 超值好价...', source: 'shop.tiktok.com', cost: 'Rp5.60万', playCount: '9.80万', publishDate: '2025/10/25', roas: '3.66', ctr: '1.2%', sales: '1.6w' },
  ];

  const noAdVideosData = [
    { id: 101, cover: 'https://picsum.photos/seed/noad1/120/160', title: '自然流量爆款 分享技巧...', source: 'shop.tiktok.com', cost: 'Rp0', playCount: '12.20万', publishDate: '2025/11/4', roas: '-', ctr: '2.0%', sales: '1.8w' },
    { id: 102, cover: 'https://picsum.photos/seed/noad2/120/160', title: '新品测评 真实反馈...', source: 'shop.tiktok.com', cost: 'Rp0', playCount: '9.80万', publishDate: '2025/11/2', roas: '-', ctr: '1.5%', sales: '1.1w' },
    { id: 103, cover: 'https://picsum.photos/seed/noad3/120/160', title: '热门趋势 跟拍模板...', source: 'shop.tiktok.com', cost: 'Rp0', playCount: '15.60万', publishDate: '2025/10/31', roas: '-', ctr: '2.6%', sales: '2.3w' },
    { id: 104, cover: 'https://picsum.photos/seed/noad4/120/160', title: '达人同款 真实种草...', source: 'shop.tiktok.com', cost: 'Rp0', playCount: '8.40万', publishDate: '2025/10/27', roas: '-', ctr: '1.1%', sales: '0.8w' },
    { id: 105, cover: 'https://picsum.photos/seed/noad5/120/160', title: '好物开箱 质感展示...', source: 'shop.tiktok.com', cost: 'Rp0', playCount: '10.10万', publishDate: '2025/10/24', roas: '-', ctr: '1.8%', sales: '1.4w' },
  ];
  
  // 关联视频数据
  const relatedVideosData = [
    { id: 1, cover: 'https://picsum.photos/seed/rv1/120/160', title: 'Trả lời @Nippon37E1 Giày bả...', source: 'shop.tiktok.com', sales: 689, playCount: '16.80万', publishDate: '2025/11/5', isAd: true },
    { id: 2, cover: 'https://picsum.photos/seed/rv2/120/160', title: '新品上架 限时优惠中...', source: 'shop.tiktok.com', sales: 1250, playCount: '25.30万', publishDate: '2025/11/3', isAd: false },
    { id: 3, cover: 'https://picsum.photos/seed/rv3/120/160', title: '爆款推荐 必买清单...', source: 'shop.tiktok.com', sales: 890, playCount: '18.60万', publishDate: '2025/11/1', isAd: true },
    { id: 4, cover: 'https://picsum.photos/seed/rv4/120/160', title: '双11特惠 不容错过...', source: 'shop.tiktok.com', sales: 2210, playCount: '32.40万', publishDate: '2025/10/28', isAd: false },
    { id: 5, cover: 'https://picsum.photos/seed/rv5/120/160', title: '好物分享 超值好价...', source: 'shop.tiktok.com', sales: 560, playCount: '9.80万', publishDate: '2025/10/25', isAd: true },
    { id: 6, cover: 'https://picsum.photos/seed/rv6/120/160', title: '必入好物 超级推荐...', source: 'shop.tiktok.com', sales: 780, playCount: '12.50万', publishDate: '2025/10/22', isAd: false },
  ];

  const tabs = [
    { id: 'trend', label: '趋势分析' },
    { id: 'conversion', label: '成交分析' },
    { id: 'sku', label: 'SKU分析' },
    { id: 'influencer', label: '达人分析' },
    { id: 'relatedVideos', label: '关联视频', target: 'adflow' },
    { id: 'relatedLives', label: '关联直播' },
    { id: 'comments', label: '评论' },
    { id: 'similarProducts', label: '相似品' },
  ];

  // SKU 数据 - 包含销量、销售额、库存三维度数据
  const skuData = [
    { name: 'Strawberry Matcha', color: '#f778ba', salesPercent: 38.63, salesValue: '6.38万', amountPercent: 35.2, amountValue: '¥58.8万', stockPercent: 38.63, stockValue: '6.38万' },
    { name: 'Peach Mango', color: '#56d4dd', salesPercent: 35.89, salesValue: '6.38万', amountPercent: 32.5, amountValue: '¥54.3万', stockPercent: 35.89, stockValue: '6.38万' },
    { name: 'Default', color: '#58a6ff', salesPercent: 11.92, salesValue: '6.38万', amountPercent: 15.8, amountValue: '¥26.4万', stockPercent: 11.92, stockValue: '6.38万' },
    { name: 'Peach Mango - 20 Day Serving', color: '#f39c12', salesPercent: 8.3, salesValue: '6.38万', amountPercent: 10.2, amountValue: '¥17.0万', stockPercent: 8.3, stockValue: '6.38万' },
    { name: '其他', color: '#8b949e', salesPercent: 5.26, salesValue: '4.50万', amountPercent: 6.3, amountValue: '¥10.5万', stockPercent: 8.3, stockValue: '6.38万' },
  ];

  const timeOptions = [
    { id: '7d', label: '7天' },
    { id: '28d', label: '28天' },
    { id: '180d', label: '90天' },
  ];

  const trendData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => ({
      date: `12-0${i + 1}`,
      sales: Math.floor(Math.random() * 20000) + 5000,
      gmv: Math.floor(Math.random() * 100000) + 20000,
    }));
  }, []);

  const followerData = [
    { name: '<1万', value: 62.27, color: '#FFA07A' },
    { name: '1万-10万', value: 27.51, color: '#FACC15' },
    { name: '10万-100万', value: 8.74, color: '#6EE7B7' },
    { name: '100万-500万', value: 0.93, color: '#60A5FA' },
    { name: '>500万', value: 0.56, color: '#A7F3D0' },
  ];

  const followerDistributionData = [
    { range: '<= 1k', count: 24, color: '#FE2062' },
    { range: '1k-5k', count: 82, color: '#F472B6' },
    { range: '5k-10k', count: 13, color: '#A78BFA' },
    { range: '10k-50k', count: 16, color: '#60A5FA' },
    { range: '50k-100k', count: 1, color: '#34D399' },
    { range: '>= 100k', count: 5, color: '#FBBF24' },
  ];

  const followerDistributionTotal = useMemo(() => {
    return followerDistributionData.reduce((sum, item) => sum + item.count, 0);
  }, [followerDistributionData]);

  const scrollToSection = (id: string) => {
    const tab = tabs.find(t => t.id === id);
    const targetId = tab?.target || id;
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveTab(id);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(textarea);
        return ok;
      } catch {
        return false;
      }
    }
  };

  const handleCopyLink = async () => {
    const ok = await copyToClipboard(shareText);
    if (!ok) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyPcUrl = async () => {
    const ok = await copyToClipboard('https://www.fastmoss.com/');
    if (!ok) return;
    setPcUrlToastOpen(true);
    setTimeout(() => setPcUrlToastOpen(false), 2000);
  };

  const handleDownloadPoster = async () => {
    try {
      const res = await fetch(posterImageUrl, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch image');
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = `fastmoss-poster-${productId ?? 'unknown'}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(objectUrl);
    } catch {
      const a = document.createElement('a');
      a.href = posterImageUrl;
      a.download = `fastmoss-poster-${productId ?? 'unknown'}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const PodiumInfluencer = ({ rank, name, stats, avatar, height }: { rank: number; name: string; stats: string; avatar: string; height: string }) => {
    const crownColor = rank === 1 ? 'text-yellow-400' : rank === 2 ? 'text-slate-300' : 'text-orange-300';
    return (
      <div className="flex flex-col items-center flex-1 min-w-0">
        <div className="relative mb-2 flex flex-col items-center">
          <Crown size={18} className={`${crownColor} mb-1`} fill="currentColor" />
          <div className="relative w-12 h-12 rounded-full border-2 border-[#FE2062] p-0.5 overflow-hidden bg-gray-950">
            <img src={avatar} className="w-full h-full object-cover rounded-full" alt={name} />
          </div>
        </div>
        <p className="text-[10px] font-black text-gray-200 truncate w-full text-center px-1">{name}</p>
        <div className="flex flex-col items-center text-[9px] font-bold text-[#FE2062] mb-2">
          {stats.includes(',') ? (
            stats.split(',').map((part, i) => (
              <span key={i}>{part.trim()}</span>
            ))
          ) : (
            <span>{stats}</span>
          )}
        </div>
        <div className={`w-full bg-gray-900 ${height} rounded-t-lg border-x border-t border-gray-800 flex items-center justify-center`}>
          <span className="text-lg font-black text-gray-700">{rank}</span>
        </div>
      </div>
    );
  };

  // Sub-component for All Influencers View
  const AllInfluencersView = () => (
    <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col animate-in slide-in-from-right duration-300">
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between shrink-0">
        <button onClick={() => setIsAllInfluencersOpen(false)} className="text-gray-400 p-1">
          <ChevronLeft size={24} />
        </button>
        <h3 className="text-sm font-black text-gray-100">带货达人（近7天）</h3>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsShareModalOpen(true)} className="text-gray-400">
            <Share2 size={18} />
          </button>
          <button onClick={() => setIsExportModalOpen(true)} className="text-gray-400">
            <Download size={18} />
          </button>
        </div>
      </header>

      <div className="bg-gray-900 px-4 py-2 flex items-center gap-2 border-b border-gray-800 shadow-sm shrink-0">
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setInfluencerCategoryOpen(!influencerCategoryOpen)}
            className="flex items-center justify-between gap-3 min-w-[96px] px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 text-[12px] font-bold"
          >
            <span>{influencerCategory === 'all' ? '全部' : influencerCategory === 'video' ? '视频达人' : '直播达人'}</span>
            <ChevronDown size={14} className={`text-gray-400 transition-transform ${influencerCategoryOpen ? 'rotate-180' : ''}`} />
          </button>

          {influencerCategoryOpen && (
            <>
              <div className="fixed inset-0 z-[60]" onClick={() => setInfluencerCategoryOpen(false)} />
              <div className="absolute left-0 mt-2 w-40 bg-white rounded-xl shadow-2xl z-[65] overflow-hidden">
                {([
                  { id: 'all', label: '全部' },
                  { id: 'video', label: '视频达人' },
                  { id: 'live', label: '直播达人' },
                ] as const).map((opt) => {
                  const active = influencerCategory === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setInfluencerCategory(opt.id);
                        setInfluencerCategoryOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-[13px] font-bold flex items-center justify-between ${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-800 hover:bg-gray-100'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {active && <Check size={16} className="text-gray-900" />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="flex-1" />

        <div className="relative flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setInfluencerSortMenuOpen(!influencerSortMenuOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 text-[12px] font-bold"
          >
            <span className="text-gray-400">排序：</span>
            <span className="text-gray-100">
              {influencerSortMetric === 'sales' ? '总销量' : influencerSortMetric === 'gmv' ? '销售额' : '粉丝数'}
            </span>
            <span className="text-[10px] text-gray-200">{influencerSortOrder === 'desc' ? '↓' : '↑'}</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {influencerSortMenuOpen && (
            <>
              <div className="fixed inset-0 z-[60]" onClick={() => setInfluencerSortMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-36 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-xl z-[65]">
                {([
                  { id: 'sales', label: '总销量' },
                  { id: 'gmv', label: '销售额' },
                  { id: 'followers', label: '粉丝数' },
                ] as const).map((opt) => {
                  const active = influencerSortMetric === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setInfluencerSortMetric(opt.id);
                        setInfluencerSortMenuOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-[12px] font-bold transition-all ${
                        active ? 'bg-[#FE2062]/15 text-[#FE2062]' : 'text-gray-200 hover:bg-gray-800'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          <button
            type="button"
            onClick={() => setInfluencerSortOrder(influencerSortOrder === 'desc' ? 'asc' : 'desc')}
            className="w-9 h-9 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-300 active:opacity-70"
          >
            <ArrowUpDown size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex gap-4">
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-full border border-gray-800 overflow-hidden">
                <img src={`https://picsum.photos/seed/inf-list-${i}/120/120`} className="w-full h-full object-cover" alt="influencer" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 border border-gray-900">
                <UserCheck size={8} className="text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-[13px] font-black text-gray-100 truncate">TikTok_Influencer_{i + 1}</h4>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">美妆个护 • {(Math.random() * 50 + 10).toFixed(1)}w 粉丝</p>
                </div>
                <button className="text-gray-600"><Star size={14} /></button>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <p className="text-xs font-black text-gray-200">{(Math.random() * 5).toFixed(1)}k</p>
                  <p className="text-[8px] text-gray-600 font-black uppercase">总销量</p>
                </div>
                <div>
                  <p className="text-xs font-black text-[#FE2062]">${(Math.random() * 50 + 10).toFixed(1)}k</p>
                  <p className="text-[8px] text-gray-600 font-black uppercase">销售额</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-950">
      {/* 1. Header */}
      <header ref={headerRef} className={`fixed top-0 left-0 right-0 z-50 bg-[#0b0e14]/80 backdrop-blur-md px-4 border-b border-gray-800 ${showCompactHeader ? 'py-2' : 'py-3'}`}
              style={{ maxWidth: '448px', margin: '0 auto' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-gray-100 cursor-pointer active:opacity-70 transition-opacity" onClick={onBack}>
            <ChevronLeft size={24} />
            <span className={`font-bold transition-all duration-200 ${showCompactHeader ? 'text-sm opacity-100 translate-y-0' : 'text-base opacity-100 translate-y-0'}`}>
              FastMoss·商品详情
            </span>
          </div>

          <div className="w-6" />
        </div>

        {/* 精简吸顶栏（缩略图 + 单行标题） */}
        {showCompactHeader && (
          <div className="mt-2 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0 border border-gray-800">
              <img
                src={`https://picsum.photos/seed/product-${productId ?? 1}/300/300`}
                alt="Product"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-gray-100 text-[13px] font-bold truncate">
                [SAIZ BESAR] ANAS Gincu Baldu (SEMI-MATTE) with Sweet Almond Oil...
              </h3>
            </div>
          </div>
        )}
      </header>

      {/* Header 下方吸顶面板：上滑出现，下滑消失 */}
      {!isAllInfluencersOpen && (
        <div
          ref={stickyPanelRef}
          className={`fixed left-0 right-0 z-[55] transition-all duration-200 ease-out ${
            showStickyPanel ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
          style={{ top: headerHeight, maxWidth: '448px', margin: '0 auto' }}
        >
          <div className="bg-[#0b0e14]/90 backdrop-blur-md border-b border-gray-900 shadow-lg">
            <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide px-4 border-b border-gray-900">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => scrollToSection(tab.id)}
                  className={`shrink-0 py-2.5 text-[13px] font-black transition-all relative whitespace-nowrap ${
                    activeTab === tab.id ? 'text-[#FE2062]' : 'text-gray-400'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FE2062] rounded-full" />}
                </button>
              ))}
            </div>
            <div className="p-3">
              <div className="flex items-center gap-1 bg-[#141824] p-1 rounded-xl border border-gray-800/80">
                {timeOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setTimeRange(opt.id)}
                    className={`flex-1 py-2 text-[12px] font-black rounded-lg transition-all ${
                      timeRange === opt.id
                        ? 'bg-[#FE2062] text-white shadow-lg shadow-[#FE2062]/30'
                        : 'text-gray-400 bg-transparent'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 pb-32" style={{ paddingTop: headerHeight }}>
        {/* 占位空间 - 防止吸顶面板出现时内容跳动 */}
        {!isAllInfluencersOpen && showStickyPanel && <div style={{ height: stickyPanelHeight }} />}
        {/* 商品信息模块（用于触发吸顶：完全看不到时才出现吸顶层） */}
        <div className="px-4 space-y-3 transition-all duration-300 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-gray-500 font-bold">数据更新时间：2025-12-08 16:10</span>
            <div className="flex items-center gap-2">
              <button className="w-7 h-7 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400">
                <RefreshCw size={14} />
              </button>
              <button onClick={() => setIsFavorited(!isFavorited)} className="w-7 h-7 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400">
                <Star size={14} fill={isFavorited ? "currentColor" : "none"} className={isFavorited ? "text-yellow-400" : ""} />
              </button>
            </div>
          </div>

          <div ref={productInfoRef} className="rounded-xl p-3 shadow-xl transition-all duration-300 bg-gray-900 border border-gray-800">
            <div className="flex gap-3">
              <div className="w-[90px] shrink-0 space-y-1.5">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-950 border border-gray-800">
                  <img src={`https://picsum.photos/seed/product-${productId ?? 1}/300/300`} alt="Product" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 text-center">
                    <p className="text-[10px] font-black text-white">RM6.50</p>
                    <p className="text-[8px] text-gray-400 font-bold line-through">RM49.90</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsSkuModalOpen(true)}
                  className="w-full py-1 border border-gray-800 rounded-md text-[9px] font-black text-gray-300 bg-gray-800 active:bg-gray-700 transition-all duration-300 active:scale-95"
                >
                  SKU详情
                </button>
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                <h2 className="text-[13px] font-black text-gray-100 leading-tight line-clamp-2">
                  [SAIZ BESAR] ANAS Gincu Baldu (SEMI-MATTE) with Sweet Almond Oil...
                </h2>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px]">🇲🇾</span>
                    <span className="text-[10px] text-gray-400 font-bold">马来</span>
                  </div>
                  <span className="px-1.5 py-0.5 bg-[#FE2062]/10 text-[#FE2062] text-[9px] font-black rounded border border-[#FE2062]/20">美妆个护</span>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] text-gray-400 font-bold">佣金比例: <span className="text-gray-200">10%</span></p>
                  <p className="text-[10px] text-gray-400 font-bold">上架时间: <span className="text-gray-200">2025-07-24</span></p>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold">
                    <span>体验分:</span>
                    <div className="flex items-center gap-0.5 ml-1">
                      {[1,2,3,4].map(i => <Star key={i} size={9} fill="#FACC15" className="text-[#FACC15]" />)}
                      <Star size={9} fill="#FACC15" className="text-[#FACC15]" opacity="0.5" />
                      <span className="text-gray-200 ml-0.5">4.8</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold">总销量: <span className="text-gray-200 font-black">36.28万</span></p>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-800 flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] text-gray-500 font-bold">所属店铺</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-800">
                    <img src="https://picsum.photos/seed/mazaville/80/80" className="w-full h-full object-cover" alt="Shop" />
                  </div>
                  <span className="text-xs font-black text-gray-100">MAZAVILLE</span>
                </div>
              </div>
              <ChevronRight size={14} className="text-gray-600 group-hover:text-gray-400" />
            </div>
          </div>
        </div>

        {/* SKU 详情弹窗（黑色背景） */}
        {isSkuModalOpen && (
          <div
            className="fixed inset-0 z-[70] bg-black/60 flex items-end justify-center px-4 pb-6"
            onClick={() => setIsSkuModalOpen(false)}
          >
            <div
              className="w-full max-w-md bg-[#0b0e14] rounded-2xl shadow-2xl overflow-hidden border border-gray-800 animate-in slide-in-from-bottom duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-5 py-4 flex items-center justify-between border-b border-gray-800">
                <h3 className="text-base font-black text-gray-100">SKU详情</h3>
                <button onClick={() => setIsSkuModalOpen(false)} className="text-gray-500 p-1 hover:text-gray-300">
                  <X size={18} />
                </button>
              </div>

              <div className="px-5 pb-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-900 border border-gray-800 flex-shrink-0">
                    <img
                      src={`https://picsum.photos/seed/sku-modal-${productId ?? 1}/120/120`}
                      alt="SKU"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-medium text-gray-100 leading-snug">
                      DRDENT Purple Teeth Whitening Strips - 7/21 Whitening Sessions - Safe for Enamel - Non Sensitive Teeth Whitening - Peroxide-Free
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-8 text-[12px]">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">价格:</span>
                    <span className="text-gray-200">$14.01</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">库存:</span>
                    <span className="text-gray-200">0</span>
                  </div>
                </div>

                <div className="mt-5 flex items-start gap-3">
                  <div className="pt-2 text-[12px] text-gray-500">Size:</div>
                  <div className="flex-1 space-y-3">
                    <button
                      onClick={() => setSelectedSkuSize('14')}
                      className={`w-full rounded-xl px-4 py-3 flex items-center justify-center gap-2 border transition-colors ${
                        selectedSkuSize === '14'
                          ? 'border-blue-400 border-dashed bg-blue-500/10 text-blue-300'
                          : 'border-gray-800 bg-[#0b0e14] text-gray-200'
                      }`}
                    >
                      <img
                        src={`https://picsum.photos/seed/sku-opt-14/40/40`}
                        alt="14"
                        className="w-5 h-5 rounded object-cover"
                      />
                      <span className="text-[13px]">
                        14 strips (7 sessions)
                      </span>
                    </button>

                    <button
                      onClick={() => setSelectedSkuSize('42')}
                      className={`w-full rounded-xl px-4 py-3 flex items-center justify-center gap-2 border transition-colors ${
                        selectedSkuSize === '42'
                          ? 'border-blue-400 border-dashed bg-blue-500/10 text-blue-300'
                          : 'border-gray-800 bg-[#0b0e14] text-gray-200'
                      }`}
                    >
                      <img
                        src={`https://picsum.photos/seed/sku-opt-42/40/40`}
                        alt="42"
                        className="w-5 h-5 rounded object-cover"
                      />
                      <span className="text-[13px]">42 strips (21 sessions)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs：正常状态 sticky；吸顶面板显示时隐藏，避免重复 */}
        {!showStickyPanel && (
          <div className="sticky top-[52px] z-40 bg-gray-950 mt-3 border-t border-gray-900 shadow-md">
            <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide px-4 border-b border-gray-900">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => scrollToSection(tab.id)}
                  className={`shrink-0 py-3 text-[13px] font-black transition-all relative whitespace-nowrap ${
                    activeTab === tab.id ? 'text-[#FE2062]' : 'text-gray-500'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FE2062] rounded-full" />}
                </button>
              ))}
            </div>
            <div className="p-3">
              <div className="flex items-center gap-1 bg-gray-900 p-0.5 rounded-lg border border-gray-800">
                {timeOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setTimeRange(opt.id)}
                    className={`flex-1 py-1.5 text-[10px] font-black rounded-md transition-all ${
                      timeRange === opt.id ? 'bg-[#FE2062] text-white shadow-lg' : 'text-gray-500'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Trend Module */}
        <section id="trend" className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-[#FE2062] rounded-full" />
            <h3 className="text-sm font-black text-gray-100">趋势分析</h3>
          </div>
          <div className="relative">
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'sales', label: '销量', value: '5.64万' },
                { id: 'gmv', label: '销售额', value: '49.2w' },
                { id: 'influencer', label: '带货达人', value: '132' },
                { id: 'video', label: '带货视频', value: '147' },
                { id: 'live', label: '带货直播', value: '25' },
                { id: 'price', label: '售价', value: 'RM6.5' },
              ].map((m) => {
                const isSelected = trendMetricsSelected.includes(m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      if (isSelected) {
                        setTrendMetricsSelected(trendMetricsSelected.filter(id => id !== m.id));
                      } else if (trendMetricsSelected.length < 2) {
                        setTrendMetricsSelected([...trendMetricsSelected, m.id]);
                      }
                    }}
                    className={`bg-gray-900 border ${isSelected ? 'border-[#FE2062]' : 'border-[#FE2062]/30'} p-3 rounded-xl relative text-left transition-all active:scale-95 ${!isSelected && trendMetricsSelected.length >= 2 ? 'opacity-50' : ''}`}
                  >
                    <p className={`text-sm font-black ${isSelected ? 'text-[#FE2062]' : 'text-[#FE2062]/80'}`}>{m.value}</p>
                    <p className="text-[10px] text-gray-500 font-bold mt-1">{m.label}</p>
                    <div className={`absolute top-2 right-2 w-3 h-3 rounded-full flex items-center justify-center ${isSelected ? 'bg-[#FE2062]' : 'border border-[#FE2062]/50'}`}>{isSelected && <Check size={8} className="text-white" />}</div>
                  </button>
                );
              })}
            </div>
            <div className="h-48 w-full bg-gray-900 border border-gray-800 rounded-2xl p-4 mt-4 relative">
              <div className="absolute top-3 right-3 z-10">
                <div className="flex items-center bg-gray-950/40 border border-gray-800 rounded-lg p-0.5 backdrop-blur-sm">
                  <button
                    onClick={() => setTrendValueType('increment')}
                    className={`px-2.5 py-1 text-[10px] font-black rounded-md transition-all ${
                      trendValueType === 'increment' ? 'bg-[#FE2062] text-white shadow-lg shadow-[#FE2062]/20' : 'text-gray-400'
                    }`}
                  >
                    增量
                  </button>
                  <button
                    onClick={() => setTrendValueType('total')}
                    className={`px-2.5 py-1 text-[10px] font-black rounded-md transition-all ${
                      trendValueType === 'total' ? 'bg-[#FE2062] text-white shadow-lg shadow-[#FE2062]/20' : 'text-gray-400'
                    }`}
                  >
                    总量
                  </button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="date" hide />
                  <YAxis hide />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="sales" stroke="#FE2062" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="gmv" stroke="#3B82F6" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {/* 权限蒙层 - 不覆盖标题 */}
            {showTrendOverlay && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center z-10">
                <p className="text-[12px] text-gray-400 mb-4">
                  当前数据仅限 <span className="text-[#FE2062] font-bold">个人版以上会员</span>查看，请升级会员
                </p>
                <button className="w-40 py-2.5 bg-[#FE2062] text-white text-[13px] font-bold rounded-full mb-2">
                  升级会员
                </button>
                <button 
                  onClick={() => setShowTrendOverlay(false)}
                  className="w-40 py-2.5 bg-transparent border border-gray-600 text-gray-300 text-[13px] font-bold rounded-full"
                >
                  查看示例
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Conversion Module */}
        <section id="conversion" className="p-4 space-y-4 border-t border-gray-900">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-[#FE2062] rounded-full" />
            <h3 className="text-sm font-black text-gray-100">成交分析</h3>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-6">
            {/* 下拉选择标题 */}
            <div className="relative">
              <button 
                onClick={() => setConversionDropdownOpen(!conversionDropdownOpen)}
                className="flex items-center gap-2 text-[14px] font-black text-gray-100"
              >
                {conversionType === 'channel' ? '成交渠道占比' : conversionType === 'content' ? '成交内容占比' : '成交投放占比'}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {conversionDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-[35]" onClick={() => setConversionDropdownOpen(false)} />
                  <div className="absolute left-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-[40] overflow-hidden">
                    {[
                      { id: 'channel', label: '成交渠道占比' },
                      { id: 'content', label: '成交内容占比' },
                      { id: 'delivery', label: '成交投放占比' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setConversionType(opt.id as 'channel' | 'content' | 'delivery');
                          setConversionDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-xs font-bold transition-colors ${
                          conversionType === opt.id 
                            ? 'bg-[#FE2062]/20 text-[#FE2062]' 
                            : 'text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[11px] text-gray-500 font-bold mb-1">成交销量</p>
                <p className="text-2xl font-black text-gray-100">36.28万 <span className="text-lg text-gray-700">=</span></p>
              </div>
              <div className="flex bg-gray-800 p-0.5 rounded-lg">
                <button className="px-3 py-1 text-[10px] font-bold bg-white text-gray-900 rounded-md">销量</button>
                <button className="px-3 py-1 text-[10px] font-bold text-gray-500">销售额</button>
              </div>
            </div>
            
            {/* 成交渠道占比 - 条形图 */}
            {conversionType === 'channel' && (
              <div className="space-y-4">
                <div className="flex h-10 rounded-lg overflow-hidden gap-1">
                  <div className="bg-blue-500 h-full" style={{ width: '29%' }} />
                  <div className="bg-emerald-500 h-full" style={{ width: '61%' }} />
                  <div className="bg-purple-500 h-full" style={{ width: '10%' }} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500" /> <span className="text-[10px] text-gray-400 font-bold">自营号</span></div>
                    <p className="text-xs font-black text-gray-200">10.5万</p>
                    <p className="text-[9px] text-gray-600 font-bold">(29%)</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> <span className="text-[10px] text-gray-400 font-bold">带货达人</span></div>
                    <p className="text-xs font-black text-gray-200">22.1万</p>
                    <p className="text-[9px] text-gray-600 font-bold">(61%)</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500" /> <span className="text-[10px] text-gray-400 font-bold">商品卡</span></div>
                    <p className="text-xs font-black text-gray-200">3.68万</p>
                    <p className="text-[9px] text-gray-600 font-bold">(10%)</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* 成交内容占比 - 条形图样式 */}
            {conversionType === 'content' && (
              <div className="space-y-4">
                <div className="flex h-10 rounded-lg overflow-hidden gap-1">
                  <div className="bg-pink-500 h-full" style={{ width: '14.87%' }} />
                  <div className="bg-emerald-400 h-full" style={{ width: '58.83%' }} />
                  <div className="bg-cyan-400 h-full" style={{ width: '26.3%' }} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-pink-500" /> <span className="text-[10px] text-gray-400 font-bold">视频</span></div>
                    <p className="text-xs font-black text-gray-200">7500</p>
                    <p className="text-[9px] text-gray-600 font-bold">(14.87%)</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-400" /> <span className="text-[10px] text-gray-400 font-bold">直播</span></div>
                    <p className="text-xs font-black text-gray-200">2.5w</p>
                    <p className="text-[9px] text-gray-600 font-bold">(58.83%)</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-cyan-400" /> <span className="text-[10px] text-gray-400 font-bold">商品卡</span></div>
                    <p className="text-xs font-black text-gray-200">1w</p>
                    <p className="text-[9px] text-gray-600 font-bold">(26.3%)</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* 成交投放占比 - 条形图样式 */}
            {conversionType === 'delivery' && (
              <div className="space-y-4">
                <div className="flex h-10 rounded-lg overflow-hidden gap-1">
                  <div className="bg-pink-400 h-full" style={{ width: '32.87%' }} />
                  <div className="bg-emerald-400 h-full" style={{ width: '67.13%' }} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-pink-400" /> <span className="text-[10px] text-gray-400 font-bold">广告投放</span></div>
                    <p className="text-xs font-black text-gray-200">3.87万</p>
                    <p className="text-[9px] text-gray-600 font-bold">(32.87%)</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-400" /> <span className="text-[10px] text-gray-400 font-bold">其他流量</span></div>
                    <p className="text-xs font-black text-gray-200">6.38万</p>
                    <p className="text-[9px] text-gray-600 font-bold">(67.13%)</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SKU分析模块 - 单环切换版本 */}
        <section id="sku" className="p-4 space-y-4 border-t border-gray-900">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-[#FE2062] rounded-full" />
            <h3 className="text-sm font-black text-gray-100">SKU分析</h3>
          </div>

          {/* 筛选Tab - 颜色/尺寸 */}
          <div className="relative">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {SKU_FILTER_TABS.map((tab) => {
                const active = skuFilterType === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSkuFilterType(tab.id)}
                    className={`shrink-0 px-3 py-1.5 text-[11px] font-black rounded-full transition-all whitespace-nowrap ${
                      active
                        ? 'bg-[#FE2062] text-white shadow-lg shadow-[#FE2062]/20'
                        : 'bg-[#2A2E35] text-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
            <div className="pointer-events-none absolute top-0 right-0 h-full w-10 bg-gradient-to-l from-gray-950 to-transparent" />
          </div>

          {/* SKU分析卡片 */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            {/* 卡片头部 - 下拉选项在左，切换按钮在右 */}
            <div className="flex justify-between items-center mb-4">
              {/* 下拉选项 */}
              <div className="relative">
                <button
                  onClick={() => setSkuDropdownOpen(!skuDropdownOpen)}
                  className="flex items-center gap-1 text-[13px] font-black text-gray-100"
                >
                  {skuViewType === 'transaction' ? '成交占比（近7天）' : '库存占比（当前）'}
                  <ChevronRight size={14} className={`transition-transform ${skuDropdownOpen ? '-rotate-90' : 'rotate-90'}`} />
                </button>
                {skuDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10 min-w-[160px]">
                    <button
                      onClick={() => { setSkuViewType('transaction'); setSkuDropdownOpen(false); }}
                      className={`w-full px-4 py-2.5 text-left text-[12px] font-bold transition-colors ${
                        skuViewType === 'transaction' ? 'text-[#FE2062] bg-[#FE2062]/10' : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      成交占比（近7天）
                    </button>
                    <button
                      onClick={() => { setSkuViewType('stock'); setSkuDropdownOpen(false); }}
                      className={`w-full px-4 py-2.5 text-left text-[12px] font-bold transition-colors ${
                        skuViewType === 'stock' ? 'text-[#FE2062] bg-[#FE2062]/10' : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      库存占比（当前）
                    </button>
                  </div>
                )}
              </div>
              {/* 总销量/总销售额切换按钮 - 仅在成交占比时显示 */}
              {skuViewType === 'transaction' && (
                <div className="flex bg-gray-800 p-0.5 rounded-lg">
                  <button
                    onClick={() => setSkuMetricType('sales')}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all ${
                      skuMetricType === 'sales' ? 'bg-[#FE2062] text-white' : 'text-gray-500'
                    }`}
                  >
                    总销量
                  </button>
                  <button
                    onClick={() => setSkuMetricType('amount')}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all ${
                      skuMetricType === 'amount' ? 'bg-[#FE2062] text-white' : 'text-gray-500'
                    }`}
                  >
                    总销售额
                  </button>
                </div>
              )}
            </div>

            {/* 单环饼状图 */}
            <div className="flex justify-center mb-4">
              <div className="relative w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={skuData.slice(0, 5)}
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey={skuViewType === 'stock' ? 'stockPercent' : (skuMetricType === 'sales' ? 'salesPercent' : 'amountPercent')}
                      onClick={(_, index) => setHighlightedSkuIndex(highlightedSkuIndex === index ? null : index)}
                    >
                      {skuData.slice(0, 5).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          opacity={highlightedSkuIndex === null || highlightedSkuIndex === index ? 1 : 0.3}
                          style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* 中心数据 - 动态显示当前选中的总数值 */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-gray-100">
                    {skuViewType === 'stock' ? '12.8万' : (skuMetricType === 'sales' ? '25.52万' : '¥168.5万')}
                  </span>
                  <span className="text-[10px] text-gray-500 font-bold">
                    {skuViewType === 'stock' ? '总库存' : (skuMetricType === 'sales' ? '总销量' : '总销售额')}
                  </span>
                </div>
              </div>
            </div>

            {/* SKU列表 - 3+2展示策略 */}
            <div className="space-y-0">
              {(skuSalesExpanded ? skuData : skuData.slice(0, 3)).map((sku, index) => (
                <div
                  key={index}
                  onClick={() => setHighlightedSkuIndex(highlightedSkuIndex === index ? null : index)}
                  className={`flex items-center py-3 border-b border-gray-800 last:border-b-0 cursor-pointer transition-all ${
                    highlightedSkuIndex === index ? 'bg-[#FE2062]/10 -mx-2 px-2 rounded-lg' : ''
                  }`}
                >
                  <div className="w-3 h-3 rounded-full mr-3 shrink-0" style={{ backgroundColor: sku.color }} />
                  <span className="flex-1 text-[13px] text-gray-200 font-medium truncate">{sku.name}</span>
                  {/* 右侧：占比百分比 + 数值加粗 */}
                  <div className="flex items-center gap-2 ml-2 shrink-0">
                    <span className="text-[13px] text-gray-400">
                      {skuViewType === 'stock' ? sku.stockPercent : (skuMetricType === 'sales' ? sku.salesPercent : sku.amountPercent)}%
                    </span>
                    <span className="text-[14px] font-black text-gray-100">
                      {skuViewType === 'stock' ? sku.stockValue : (skuMetricType === 'sales' ? sku.salesValue : sku.amountValue)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* 展开更多 - 3+2策略 */}
            {skuData.length > 3 && (
              <button
                onClick={() => setSkuSalesExpanded(!skuSalesExpanded)}
                className="w-full flex items-center justify-center gap-1 pt-4 text-[12px] text-[#58a6ff] font-bold"
              >
                <span>{skuSalesExpanded ? '收起' : '展开更多'}</span>
                <ChevronRight size={14} className={`transition-transform ${skuSalesExpanded ? '-rotate-90' : 'rotate-90'}`} />
              </button>
            )}
          </div>
        </section>

        {/* Influencer Module */}
        <section id="influencer" className="p-4 space-y-4 border-t border-gray-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-[#FE2062] rounded-full" />
              <h3 className="text-sm font-black text-gray-100">达人分析</h3>
            </div>
            <button 
              onClick={() => setIsAllInfluencersOpen(true)}
              className="text-[10px] text-[#FE2062] font-black flex items-center gap-0.5 active:opacity-70"
            >
              查看达人 <ChevronRight size={12} />
            </button>
          </div>
          
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
             <p className="text-[11px] text-gray-500 font-bold mb-4">达人粉丝数量分布</p>
             <div className="flex items-center">
               <div className="w-32 h-32 shrink-0">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={followerDistributionData}
                       innerRadius={35}
                       outerRadius={55}
                       paddingAngle={2}
                       dataKey="count"
                       nameKey="range"
                     >
                       {followerDistributionData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                     </Pie>
                     <Tooltip
                       contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                       formatter={(value: any, name: any) => {
                         const count = Number(value);
                         const pct = followerDistributionTotal > 0 ? ((count / followerDistributionTotal) * 100).toFixed(2) : '0.00';
                         return [`${count}人 (${pct}%)`, name];
                       }}
                     />
                   </PieChart>
                 </ResponsiveContainer>
               </div>
               <div className="flex-1 pl-4 space-y-1.5">
                 {followerDistributionData.map((d, i) => {
                   const pct = followerDistributionTotal > 0 ? ((d.count / followerDistributionTotal) * 100).toFixed(2) : '0.00';
                   return (
                     <div key={i} className="flex items-center justify-between">
                       <div className="flex items-center gap-1.5 min-w-0">
                         <div className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: d.color }} />
                         <span className="text-[10px] text-gray-500 font-bold truncate">{d.range}</span>
                       </div>
                       <div className="flex items-center gap-2 ml-2 shrink-0">
                         <span className="text-[10px] font-black text-gray-300">{d.count}人</span>
                         <span className="text-[10px] font-black text-gray-500">{pct}%</span>
                       </div>
                     </div>
                   );
                 })}
               </div>
             </div>
             
             <div className="pt-4 border-t border-gray-800 mt-4">
               <p className="text-[11px] text-gray-500 font-bold mb-4">近7天销量Top3达人榜单</p>
               <div className="flex items-end justify-center gap-2 mb-6">
                 <PodiumInfluencer rank={2} name="Maya_Beauty" stats="销量4.1w" avatar="https://picsum.photos/seed/inf-2/80/80" height="h-12" />
                 <PodiumInfluencer rank={1} name="Anas_Official" stats="销量12.5w" avatar="https://picsum.photos/seed/inf-1/80/80" height="h-20" />
                 <PodiumInfluencer rank={3} name="Skincare_Lover" stats="销量2.8w" avatar="https://picsum.photos/seed/inf-3/80/80" height="h-8" />
               </div>
             </div>
          </div>
        </section>

        {/* 关联视频模块 */}
        <section id="adflow" className="p-4 space-y-4 border-t border-gray-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-[#FE2062] rounded-full" />
              <h3 className="text-sm font-black text-gray-100">关联视频</h3>
            </div>
            <button 
              onClick={() => setIsAdVideosOpen(true)}
              className="text-[10px] text-[#FE2062] font-black flex items-center gap-0.5 active:opacity-70"
            >
              查看视频 <ChevronRight size={12} />
            </button>
          </div>
          
          {/* 筛选按钮 */}
          <div className="flex gap-2">
            {[
              { id: 'ad', label: '投流' },
              { id: 'noAd', label: '未投流' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setAdFlowFilter(opt.id as any);
                  if (opt.id === 'noAd') {
                    setAdMetricsSelected(['salesCount', 'salesAmount']);
                  } else {
                    setAdMetricsSelected(['adCost', 'playCount']);
                  }
                }}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all ${
                  adFlowFilter === opt.id ? 'bg-[#FE2062] text-white' : 'bg-gray-800 text-gray-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {[
              ...(adFlowFilter === 'ad' ? [
                { id: 'adCost', label: '广告投放消耗', value: 'Rp4496', selectable: true, color: '#FE2062' },
                { id: 'playCount', label: '播放量', value: '8.97万', selectable: true, color: '#3B82F6' },
                { id: 'salesCount', label: '销量', value: '3000', selectable: true, color: '#22C55E' },
                { id: 'salesAmount', label: '销售额', value: 'Rp2.81万', selectable: true, color: '#F59E0B' },
                { id: 'adMaterial', label: '广告素材量', value: '1908个', selectable: false, color: '#6B7280' },
                { id: 'roas', label: 'ROAS', value: '6.25', selectable: false, color: '#6B7280' },
              ] : [
                { id: 'salesCount', label: '销量', value: '3000', selectable: true, color: '#22C55E' },
                { id: 'salesAmount', label: '销售额', value: 'Rp2.81万', selectable: true, color: '#F59E0B' },
                { id: 'playCount', label: '播放量', value: '8.97万', selectable: true, color: '#3B82F6' },
                { id: 'likeCount', label: '点赞数', value: '1.2万', selectable: true, color: '#EF4444' },
                { id: 'commentCount', label: '评论数', value: '856', selectable: true, color: '#8B5CF6' },
                { id: 'interactionRate', label: '互动率', value: '3.2%', selectable: true, color: '#06B6D4' },
              ])
            ]
            .map((m) => {
              const isSelected = adMetricsSelected.includes(m.id);
              const canSelect = m.selectable && (isSelected || adMetricsSelected.length < 2);
              return (
                <div 
                  key={m.id} 
                  onClick={() => {
                    if (!m.selectable) return;
                    if (isSelected) {
                      setAdMetricsSelected(adMetricsSelected.filter(id => id !== m.id));
                    } else if (adMetricsSelected.length < 2) {
                      setAdMetricsSelected([...adMetricsSelected, m.id]);
                    }
                  }}
                  className={`bg-gray-900 border ${isSelected ? 'border-[#FE2062]' : m.selectable ? 'border-[#FE2062]/30' : 'border-gray-800'} p-3 rounded-xl relative ${m.selectable ? 'cursor-pointer active:scale-95 transition-transform' : ''} ${m.selectable && !canSelect && !isSelected ? 'opacity-50' : ''}`}
                >
                  <p className={`text-sm font-black ${isSelected ? 'text-[#FE2062]' : m.selectable ? 'text-[#FE2062]/80' : 'text-gray-200'}`}>{m.value}</p>
                  <p className="text-[10px] text-gray-500 font-bold mt-1">{m.label}</p>
                  {m.selectable && <div className={`absolute top-2 right-2 w-3 h-3 rounded-full flex items-center justify-center ${isSelected ? 'bg-[#FE2062]' : 'border border-[#FE2062]/50'}`}>{isSelected && <Check size={8} className="text-white" />}</div>}
                </div>
              );
            })}
          </div>
          {adMetricsSelected.length > 0 && (
            <div className="h-48 w-full bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <div className="flex justify-center gap-4 mb-2 text-[10px]">
                {adMetricsSelected.map((id, idx) => {
                  const metric = [
                    ...(adFlowFilter === 'ad' ? [
                      { id: 'adCost', label: '广告投放消耗', color: '#FE2062' },
                      { id: 'playCount', label: '播放量', color: '#3B82F6' },
                      { id: 'salesCount', label: '销量', color: '#22C55E' },
                      { id: 'salesAmount', label: '销售额', color: '#F59E0B' },
                    ] : [
                      { id: 'salesCount', label: '销量', color: '#22C55E' },
                      { id: 'salesAmount', label: '销售额', color: '#F59E0B' },
                      { id: 'playCount', label: '播放量', color: '#3B82F6' },
                      { id: 'likeCount', label: '点赞数', color: '#EF4444' },
                      { id: 'commentCount', label: '评论数', color: '#8B5CF6' },
                      { id: 'interactionRate', label: '互动率', color: '#06B6D4' },
                    ])
                  ].find(m => m.id === id);
                  return metric ? (
                    <div key={id} className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: metric.color }} />
                      <span className="text-gray-400">{metric.label}</span>
                    </div>
                  ) : null;
                })}
              </div>
              <ResponsiveContainer width="100%" height="85%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="date" hide />
                  <YAxis hide />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '8px' }} />
                  {adFlowFilter === 'ad' && (
                    <>
                      {adMetricsSelected.includes('adCost') && <Line type="monotone" dataKey="sales" name="广告投放消耗" stroke="#FE2062" strokeWidth={3} dot={false} />}
                      {adMetricsSelected.includes('playCount') && <Line type="monotone" dataKey="gmv" name="播放量" stroke="#3B82F6" strokeWidth={3} dot={false} />}
                      {adMetricsSelected.includes('salesCount') && <Line type="monotone" dataKey="sales" name="销量" stroke="#22C55E" strokeWidth={3} dot={false} />}
                      {adMetricsSelected.includes('salesAmount') && <Line type="monotone" dataKey="gmv" name="销售额" stroke="#F59E0B" strokeWidth={3} dot={false} />}
                    </>
                  )}
                  {adFlowFilter === 'noAd' && (
                    <>
                      {adMetricsSelected.includes('salesCount') && <Line type="monotone" dataKey="sales" name="销量" stroke="#22C55E" strokeWidth={3} dot={false} />}
                      {adMetricsSelected.includes('salesAmount') && <Line type="monotone" dataKey="gmv" name="销售额" stroke="#F59E0B" strokeWidth={3} dot={false} />}
                      {adMetricsSelected.includes('playCount') && <Line type="monotone" dataKey="gmv" name="播放量" stroke="#3B82F6" strokeWidth={3} dot={false} />}
                      {adMetricsSelected.includes('likeCount') && <Line type="monotone" dataKey="sales" name="点赞数" stroke="#EF4444" strokeWidth={3} dot={false} />}
                      {adMetricsSelected.includes('commentCount') && <Line type="monotone" dataKey="gmv" name="评论数" stroke="#8B5CF6" strokeWidth={3} dot={false} />}
                      {adMetricsSelected.includes('interactionRate') && <Line type="monotone" dataKey="sales" name="互动率" stroke="#06B6D4" strokeWidth={3} dot={false} />}
                    </>
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="pt-4 border-t border-gray-800 mt-4">
            <p className="text-[11px] text-gray-500 font-bold mb-4">近7天GMV Top3 视频榜单</p>
            <div className="flex items-end justify-center gap-2 mb-6">
              <PodiumInfluencer rank={2} name="Maya_Beauty" stats="播放量16.8万,销量12.5w" avatar="https://picsum.photos/seed/inf-2/80/80" height="h-12" />
              <PodiumInfluencer rank={1} name="Anas_Official" stats="播放量16.8万,销量12.5w" avatar="https://picsum.photos/seed/inf-1/80/80" height="h-20" />
              <PodiumInfluencer rank={3} name="Skincare_Lover" stats="播放量16.8万,销量12.5w" avatar="https://picsum.photos/seed/inf-3/80/80" height="h-8" />
            </div>
          </div>
        </section>

        
        {/* 关联直播模块 - 与关联视频同级 */}
        <section id="relatedLives" className="p-4 space-y-4 border-t border-gray-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-[#FE2062] rounded-full" />
              <h3 className="text-sm font-black text-gray-100">关联直播</h3>
            </div>
            <button 
              onClick={() => setIsRelatedLivesOpen(true)}
              className="text-[10px] text-[#FE2062] font-black flex items-center gap-0.5 active:opacity-70"
            >
              查看直播 <ChevronRight size={12} />
            </button>
          </div>

          {/* 直播数据概览 */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-900 border border-gray-800 p-3 rounded-xl relative">
              <p className="text-sm font-black text-gray-200">128场</p>
              <p className="text-[10px] text-gray-500 font-bold mt-1">直播总场次</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-3 rounded-xl relative">
              <p className="text-sm font-black text-gray-200">3.26万</p>
              <p className="text-[10px] text-gray-500 font-bold mt-1">销量</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-3 rounded-xl relative">
              <p className="text-sm font-black text-gray-200">¥298.4万</p>
              <p className="text-[10px] text-gray-500 font-bold mt-1">销售额</p>
            </div>
          </div>

          {/* 近7天GMV Top3达人推荐 */}
          <div className="pt-4 border-t border-gray-800 mt-4">
            <p className="text-[11px] text-gray-500 font-bold mb-4">近7天GMV Top3直播榜单</p>
            <div className="flex items-end justify-center gap-2 mb-6">
              <PodiumInfluencer rank={2} name="Live_Star_A" stats="直播总销量8.9k" avatar="https://picsum.photos/seed/live-2/80/80" height="h-12" />
              <PodiumInfluencer rank={1} name="Beauty_King" stats="直播总销量15.2k" avatar="https://picsum.photos/seed/live-1/80/80" height="h-20" />
              <PodiumInfluencer rank={3} name="Fashion_Queen" stats="直播总销量6.3k" avatar="https://picsum.photos/seed/live-3/80/80" height="h-8" />
            </div>
          </div>
        </section>

        {/* 评论模块 */}
        <section id="comments" className="p-4 space-y-4 border-t border-gray-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-[#FE2062] rounded-full" />
              <h3 className="text-sm font-black text-gray-100">评论</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCommentsEmptyDemo(!isCommentsEmptyDemo)}
                className={`px-2.5 py-1.5 text-[10px] font-black rounded-lg border transition-all active:scale-95 ${
                  isCommentsEmptyDemo ? 'bg-[#FE2062] text-white border-[#FE2062]' : 'bg-gray-900 text-gray-400 border-gray-800'
                }`}
              >
                无
              </button>
              <button 
                onClick={() => setIsCommentListOpen(true)}
                className="text-[10px] text-[#FE2062] font-black flex items-center gap-0.5 active:opacity-70"
              >
                查看评论 <ChevronRight size={12} />
              </button>
            </div>
          </div>
          
          {/* 评分概览 */}
          <div className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((star) => (
                <Star key={star} size={16} className="text-gray-600 fill-gray-600" />
              ))}
            </div>
            <span className="text-2xl font-black text-gray-100">4.85</span>
            <span className="text-[12px] text-gray-500 font-bold">530条</span>
          </div>
          
          {/* 正面评论/负面评论 按钮 */}
          <div className="flex gap-2">
            <button 
              onClick={() => setSelectedViewpoint(selectedViewpoint === 'positive' ? null : 'positive')}
              className={`px-4 py-2 text-[11px] font-bold rounded-lg transition-all ${
                selectedViewpoint === 'positive' ? 'bg-[#FE2062] text-white' : 'bg-gray-800 text-gray-400'
              }`}
            >
              正面评论
            </button>
            <button 
              onClick={() => setSelectedViewpoint(selectedViewpoint === 'negative' ? null : 'negative')}
              className={`px-4 py-2 text-[11px] font-bold rounded-lg transition-all ${
                selectedViewpoint === 'negative' ? 'bg-gray-800 text-white border border-gray-600' : 'bg-gray-800 text-gray-400'
              }`}
            >
              负面评论
            </button>
          </div>
          
          {/* 观点饼状图 */}
          {(isCommentsEmptyDemo ? 'positive' : selectedViewpoint) && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 relative overflow-hidden">
              <div className={`flex items-center gap-6 ${isCommentsEmptyDemo ? 'filter blur-sm pointer-events-none select-none' : ''}`}>
                <div className="w-28 h-28">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={(isCommentsEmptyDemo ? 'positive' : selectedViewpoint) === 'positive' ? positiveViewpointData : negativeViewpointData}
                        cx="50%"
                        cy="50%"
                        innerRadius={28}
                        outerRadius={45}
                        dataKey="value"
                        stroke="none"
                      >
                        {((isCommentsEmptyDemo ? 'positive' : selectedViewpoint) === 'positive' ? positiveViewpointData : negativeViewpointData).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-1.5">
                  {((isCommentsEmptyDemo ? 'positive' : selectedViewpoint) === 'positive' ? positiveViewpointData : negativeViewpointData).map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                        <span className="text-[11px] text-gray-300 font-medium">{item.name}</span>
                      </div>
                      <span className="text-[11px] text-gray-400 font-bold">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {isCommentsEmptyDemo && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center">
                  <div className="text-center px-6">
                    <p className="text-[12px] text-gray-200 font-black mb-2">去PC端解锁 VOC 洞察，看透商品优劣势</p>
                    <button
                      onClick={handleCopyPcUrl}
                      className="px-4 py-2.5 bg-[#FE2062] text-white text-[12px] font-black rounded-xl shadow-lg shadow-[#FE2062]/20 active:scale-95 transition-all"
                    >
                      复制 PC 端网址
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {pcUrlToastOpen && (
            <div className="fixed left-1/2 -translate-x-1/2 bottom-24 z-[120] px-4 py-2 bg-gray-900/90 border border-gray-700 text-gray-200 text-[11px] font-bold rounded-full shadow-2xl backdrop-blur-sm">
              网址已复制，请在电脑浏览器访问
            </div>
          )}
        </section>

        {/* 相似品模块 */}
        <section id="similarProducts" className="p-4 space-y-4 border-t border-gray-900">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-[#FE2062] rounded-full" />
            <h3 className="text-sm font-black text-gray-100">相似品</h3>
          </div>
          
          {/* 相似品卡片列表 - 左右滑动 */}
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {[
              { id: 1, cover: 'https://picsum.photos/seed/similar1/80/80', title: '6pk Coffee Bu...', rating: 4.8, category: '食品饮料', sales: 2325, amount: '$4.32万' },
              { id: 2, cover: 'https://picsum.photos/seed/similar2/80/80', title: 'Premium Tea Set', rating: 4.6, category: '食品饮料', sales: 1856, amount: '$3.28万' },
              { id: 3, cover: 'https://picsum.photos/seed/similar3/80/80', title: 'Organic Blend', rating: 4.9, category: '食品饮料', sales: 3102, amount: '$5.67万' },
              { id: 4, cover: 'https://picsum.photos/seed/similar4/80/80', title: 'Instant Coffee', rating: 4.5, category: '食品饮料', sales: 1420, amount: '$2.15万' },
            ].map((product) => (
              <div key={product.id} className="flex-shrink-0 w-44 bg-gray-900 border border-gray-800 rounded-2xl p-3">
                <div className="flex gap-2 mb-2">
                  <img src={product.cover} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  <h4 className="text-[12px] font-bold text-gray-100 flex-1 line-clamp-2">{product.title}</h4>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-gray-500">商品体验分:</span>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={10} 
                          className={star <= Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} 
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-400">{product.rating}/5</span>
                  </div>
                  <div className="text-[10px] text-gray-500">
                    商品分类: <span className="text-gray-400">{product.category}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div className="text-center">
                      <p className="text-[14px] font-black text-gray-100">{product.sales}</p>
                      <p className="text-[9px] text-[#3B82F6] font-bold">总销量</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[14px] font-black text-[#F59E0B]">{product.amount}</p>
                      <p className="text-[9px] text-[#F59E0B] font-bold">总销售额</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Full-screen All Influencers Overlay */}
      {isAllInfluencersOpen && <AllInfluencersView />}

      {/* 投流视频列表全屏弹窗 */}
      {isAdVideosOpen && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
          {/* 头部 */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <button onClick={() => setIsAdVideosOpen(false)} className="p-2 -ml-2">
              <ChevronLeft size={24} className="text-gray-200" />
            </button>
            <h2 className="text-base font-black text-gray-100">投流视频（近7天）</h2>
            <div className="flex items-center gap-2">
              <Share2 size={20} className="text-gray-400" />
              <Download size={20} className="text-gray-400" />
            </div>
          </div>

          {/* 筛选栏 */}
          <div className="px-4 py-3 border-b border-gray-800">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center bg-gray-800 rounded-lg p-0.5">
                <button
                  onClick={() => setAdVideoFlowFilter('ad')}
                  className={`px-3 py-2 rounded-md text-[12px] font-bold transition-all ${
                    adVideoFlowFilter === 'ad' ? 'bg-[#FE2062] text-white' : 'text-gray-300'
                  }`}
                >
                  投流
                </button>
                <button
                  onClick={() => setAdVideoFlowFilter('noAd')}
                  className={`px-3 py-2 rounded-md text-[12px] font-bold transition-all ${
                    adVideoFlowFilter === 'noAd' ? 'bg-[#FE2062] text-white' : 'text-gray-300'
                  }`}
                >
                  未投流
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => setAdVideoSortMenuOpen(!adVideoSortMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 text-[12px] font-bold"
                  >
                    <span className="text-gray-400">排序：</span>
                    <span className="text-gray-100">
                      {adVideoSortMetric === 'publishDate'
                        ? '发布时间'
                        : adVideoSortMetric === 'cost'
                          ? '预计消耗'
                          : adVideoSortMetric === 'playCount'
                            ? '播放量'
                            : adVideoSortMetric === 'roas'
                              ? 'ROAS'
                              : adVideoSortMetric === 'sales'
                                ? '销量'
                                : '点击率'}
                    </span>
                    <span className="text-[10px] text-gray-200">
                      {adVideoSortOrder === 'desc' ? '↓' : '↑'}
                    </span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </button>

                  {adVideoSortMenuOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-xl z-20">
                      {(adVideoFlowFilter === 'ad'
                        ? ([
                            { id: 'publishDate', label: '发布时间' },
                            { id: 'cost', label: '预计消耗' },
                            { id: 'playCount', label: '播放量' },
                            { id: 'roas', label: 'ROAS' },
                          ] as const)
                        : ([
                            { id: 'publishDate', label: '发布时间' },
                            { id: 'sales', label: '销量' },
                            { id: 'playCount', label: '播放量' },
                          ] as const)
                      ).map((opt) => {
                        const active = adVideoSortMetric === (opt.id as any);
                        return (
                          <button
                            key={opt.id}
                            onClick={() => {
                              setAdVideoSortMetric(opt.id as any);
                              setAdVideoSortMenuOpen(false);
                            }}
                            className={`w-full px-4 py-2.5 text-left text-[12px] font-bold transition-all ${
                              active ? 'bg-[#FE2062]/15 text-[#FE2062]' : 'text-gray-200 hover:bg-gray-800'
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setAdVideoSortOrder(adVideoSortOrder === 'desc' ? 'asc' : 'desc')}
                  className="w-9 h-9 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-300 active:opacity-70 relative z-[45]"
                >
                  <ArrowUpDown size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* 视频列表 */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {(adVideoFlowFilter === 'ad' ? adVideosData : noAdVideosData)
              .slice()
              .sort((a, b) => {
                const parseNumber = (s: string) => Number(String(s).replace(/[^0-9.]/g, ''));
                const parsePercent = (s: string) => Number(String(s).replace(/[^0-9.]/g, ''));

                const getValue = (v: any) => {
                  if (adVideoSortMetric === 'cost') return parseNumber(v.cost);
                  if (adVideoSortMetric === 'playCount') return parseNumber(v.playCount);
                  if (adVideoSortMetric === 'roas') {
                    const n = parseNumber(v.roas);
                    return Number.isFinite(n) ? n : -1;
                  }
                  if (adVideoSortMetric === 'sales') {
                    return parseNumber(v.sales ?? '0');
                  }
                  if (adVideoSortMetric === 'ctr') {
                    const n = parsePercent(v.ctr ?? '0');
                    return Number.isFinite(n) ? n : 0;
                  }
                  return new Date(v.publishDate).getTime();
                };

                const aVal = getValue(a);
                const bVal = getValue(b);
                const diff = bVal - aVal;
                return adVideoSortOrder === 'desc' ? diff : -diff;
              })
              .map((video, index) => (
              <div key={video.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                {/* 视频信息 */}
                <div className="flex gap-3 mb-4">
                  <div className="relative w-16 h-20 rounded-lg overflow-hidden shrink-0">
                    <img src={video.cover} alt="" className="w-full h-full object-cover" />
                    <div className="absolute top-1 left-1 bg-[#FE2062] text-white text-[10px] font-black px-1.5 py-0.5 rounded">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] font-bold text-gray-100 truncate mb-1">{video.title}</h4>
                    <div className="flex items-center gap-1 text-[11px] text-gray-500">
                      <div className="w-4 h-4 rounded-full bg-gray-700" />
                      <span>{video.source}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 font-bold mt-1">{video.publishDate}</p>
                  </div>
                </div>
                {/* 数据指标 */}
                {adVideoFlowFilter === 'noAd' ? (
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-[14px] font-black text-gray-100">{video.sales}</p>
                      <p className="text-[10px] text-gray-500 font-bold mt-0.5">销量</p>
                    </div>
                    <div>
                      <p className="text-[14px] font-black text-[#FE2062]">{video.playCount}</p>
                      <p className="text-[10px] text-gray-500 font-bold mt-0.5">播放量</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-[14px] font-black text-[#FE2062]">{video.cost}</p>
                      <p className="text-[10px] text-gray-500 font-bold mt-0.5">预计消耗</p>
                    </div>
                    <div>
                      <p className="text-[14px] font-black text-gray-100">{video.playCount}</p>
                      <p className="text-[10px] text-gray-500 font-bold mt-0.5">播放量</p>
                    </div>
                    <div>
                      <p className="text-[14px] font-black text-gray-100">{video.roas}</p>
                      <p className="text-[10px] text-gray-500 font-bold mt-0.5">ROAS</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 关联视频列表全屏弹窗 */}
      {isRelatedVideosOpen && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
          {/* 头部 */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <button onClick={() => setIsRelatedVideosOpen(false)} className="p-2 -ml-2">
              <ChevronLeft size={24} className="text-gray-200" />
            </button>
            <h2 className="text-base font-black text-gray-100">全部关联视频</h2>
            <div className="flex items-center gap-2">
              <Share2 size={20} className="text-gray-400" />
              <Download size={20} className="text-gray-400" />
            </div>
          </div>

          {/* 筛选栏 */}
          <div className="px-4 py-3 border-b border-gray-800">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (relatedVideoSortType === 'playAsc') {
                    setRelatedVideoSortType('playDesc');
                  } else {
                    setRelatedVideoSortType('playAsc');
                  }
                }}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-[12px] font-bold transition-all ${
                  relatedVideoSortType === 'playDesc' || relatedVideoSortType === 'playAsc' 
                    ? 'bg-[#FE2062] text-white' 
                    : 'bg-gray-800 text-gray-300'
                }`}
              >
                播放量
                <span className="text-[10px]">{relatedVideoSortType === 'playDesc' ? '↓' : '↑'}</span>
              </button>
              <button
                onClick={() => {
                  if (relatedVideoSortType === 'publishAsc') {
                    setRelatedVideoSortType('publishDesc');
                  } else {
                    setRelatedVideoSortType('publishAsc');
                  }
                }}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-[12px] font-bold transition-all ${
                  relatedVideoSortType === 'publishDesc' || relatedVideoSortType === 'publishAsc' 
                    ? 'bg-[#FE2062] text-white' 
                    : 'bg-gray-800 text-gray-300'
                }`}
              >
                发布时间
                <span className="text-[10px]">{relatedVideoSortType === 'publishDesc' ? '↓' : '↑'}</span>
              </button>
              <button
                onClick={() => {
                  if (relatedVideoSortType === 'salesAsc') {
                    setRelatedVideoSortType('salesDesc');
                  } else {
                    setRelatedVideoSortType('salesAsc');
                  }
                }}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-[12px] font-bold transition-all ${
                  relatedVideoSortType === 'salesDesc' || relatedVideoSortType === 'salesAsc' 
                    ? 'bg-[#FE2062] text-white' 
                    : 'bg-gray-800 text-gray-300'
                }`}
              >
                销量
                <span className="text-[10px]">{relatedVideoSortType === 'salesDesc' ? '↓' : '↑'}</span>
              </button>
            </div>
          </div>

          {/* 视频列表 */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {relatedVideosData.map((video, index) => (
              <div key={video.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                {/* 视频信息 */}
                <div className="flex gap-3 mb-4">
                  <div className="relative w-16 h-20 rounded-lg overflow-hidden shrink-0">
                    <img src={video.cover} alt="" className="w-full h-full object-cover" />
                    <div className="absolute top-1 left-1 bg-[#FE2062] text-white text-[10px] font-black px-1.5 py-0.5 rounded">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] font-bold text-gray-100 truncate mb-1">{video.title}</h4>
                    <div className="flex items-center gap-1 text-[11px] text-gray-500">
                      <div className="w-4 h-4 rounded-full bg-gray-700" />
                      <span>{video.source}</span>
                    </div>
                  </div>
                </div>
                {/* 数据指标 */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-[14px] font-black text-gray-100">{video.sales}</p>
                    <p className="text-[10px] text-gray-500 font-bold mt-0.5">销量</p>
                  </div>
                  <div>
                    <p className="text-[14px] font-black text-gray-100">{video.playCount}</p>
                    <p className="text-[10px] text-gray-500 font-bold mt-0.5">播放量</p>
                  </div>
                  <div>
                    <p className="text-[14px] font-black text-gray-100">{video.publishDate}</p>
                    <p className="text-[10px] text-gray-500 font-bold mt-0.5">发布时间</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 关联直播列表全屏弹窗 */}
      {isRelatedLivesOpen && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
          {/* 头部 */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <button onClick={() => setIsRelatedLivesOpen(false)} className="p-2 -ml-2">
              <ChevronLeft size={24} className="text-gray-200" />
            </button>
            <h2 className="text-base font-black text-gray-100">关联直播（近7天）</h2>
            <div className="flex items-center gap-2">
              <Share2 size={20} className="text-gray-400" />
              <Download size={20} className="text-gray-400" />
            </div>
          </div>

          {/* 筛选栏 */}
          <div className="px-4 py-3 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <div className="flex-1" />

              <div className="relative flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setRelatedLiveSortMenuOpen(!relatedLiveSortMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 text-[12px] font-bold"
                >
                  <span className="text-gray-400">排序：</span>
                  <span className="text-gray-100">
                    {relatedLiveSortMetric === 'sales' ? '直播总销量' : relatedLiveSortMetric === 'followers' ? '粉丝数' : '累计观看人数'}
                  </span>
                  <span className="text-[10px] text-gray-200">{relatedLiveSortOrder === 'desc' ? '↓' : '↑'}</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>

                {relatedLiveSortMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-[60]" onClick={() => setRelatedLiveSortMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-40 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-xl z-[65]">
                      {([
                        { id: 'sales', label: '直播总销量' },
                        { id: 'followers', label: '粉丝数' },
                        { id: 'viewers', label: '累计观看人数' },
                      ] as const).map((opt) => {
                        const active = relatedLiveSortMetric === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              setRelatedLiveSortMetric(opt.id);
                              setRelatedLiveSortMenuOpen(false);
                            }}
                            className={`w-full px-4 py-2.5 text-left text-[12px] font-bold transition-all ${
                              active ? 'bg-[#FE2062]/15 text-[#FE2062]' : 'text-gray-200 hover:bg-gray-800'
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => setRelatedLiveSortOrder(relatedLiveSortOrder === 'desc' ? 'asc' : 'desc')}
                  className="w-9 h-9 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-300 active:opacity-70"
                >
                  <ArrowUpDown size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* 直播列表 */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {[...relatedLivesData].sort((a, b) => {
              const parseWan = (s: string) => parseFloat(String(s).replace('万', '')) * 10000;
              const aVal =
                relatedLiveSortMetric === 'sales'
                  ? a.totalSales
                  : relatedLiveSortMetric === 'followers'
                    ? parseWan(a.followers)
                    : parseWan(a.viewers);
              const bVal =
                relatedLiveSortMetric === 'sales'
                  ? b.totalSales
                  : relatedLiveSortMetric === 'followers'
                    ? parseWan(b.followers)
                    : parseWan(b.viewers);
              const diff = bVal - aVal;
              return relatedLiveSortOrder === 'desc' ? diff : -diff;
            }).map((live, index) => (
              <div key={live.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                {/* 直播信息 */}
                <div className="flex gap-3 mb-4">
                  <div className="relative w-16 h-20 rounded-lg overflow-hidden shrink-0">
                    <img src={live.cover} alt="" className="w-full h-full object-cover" />
                    <div className="absolute top-1 left-1 bg-[#FE2062] text-white text-[10px] font-black px-1.5 py-0.5 rounded">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] font-bold text-gray-100 truncate mb-1">{live.title}</h4>
                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                      <div className="w-4 h-4 rounded-full bg-gray-700" />
                      <span>{live.hostId}</span>
                      <span>{live.country}</span>
                    </div>
                  </div>
                </div>
                {/* 数据指标 */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-[14px] font-black text-[#3B82F6]">{live.followers}</p>
                    <p className="text-[10px] text-gray-500 font-bold mt-0.5">粉丝数</p>
                  </div>
                  <div>
                    <p className="text-[14px] font-black text-gray-100">{live.viewers}</p>
                    <p className="text-[10px] text-gray-500 font-bold mt-0.5">累计观看人数</p>
                  </div>
                  <div>
                    <p className="text-[14px] font-black text-[#FE2062]">{live.totalSales}</p>
                    <p className="text-[10px] text-gray-500 font-bold mt-0.5">直播总销量</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 评论列表全屏弹窗 */}
      {isCommentListOpen && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
          {/* 头部 */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <button onClick={() => setIsCommentListOpen(false)} className="p-2 -ml-2">
              <ChevronLeft size={24} className="text-gray-200" />
            </button>
            <h2 className="text-base font-black text-gray-100">评论列表（近7天）</h2>
            <div className="w-8" />
          </div>

          {/* 筛选栏 */}
          <div className="px-4 py-3 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-gray-400 font-bold">评论情绪:</span>
              <div className="flex gap-2">
                {[
                  { id: 'all', label: '全部' },
                  { id: 'positive', label: '好评点' },
                  { id: 'negative', label: '吐槽点' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setCommentEmotionFilter(opt.id as any)}
                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                      commentEmotionFilter === opt.id ? 'bg-[#FE2062] text-white' : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 评论列表 */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {commentsData
              .filter(c => commentEmotionFilter === 'all' ? true : c.type === commentEmotionFilter)
              .map((comment) => (
              <div key={comment.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-gray-500 font-bold">评论时间: {comment.date}</span>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={14} 
                        className={star <= comment.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} 
                      />
                    ))}
                    <span className="text-[11px] text-gray-400 font-bold ml-1">{comment.rating}/5</span>
                  </div>
                </div>
                <p className="text-[13px] text-gray-200 font-medium">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Share Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/90 backdrop-blur-lg border-t border-gray-800 flex items-center justify-center gap-4 z-50 pb-safe">
        <button 
          onClick={() => setIsShareModalOpen(true)} 
          className="w-full py-2 bg-[#FE2062] text-white text-sm font-black rounded-xl shadow-lg shadow-[#FE2062]/20 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Share2 size={16} /> 分享给好友
        </button>
      </div>

      {/* Export Email Modal */}
      {isExportModalOpen && (
        <>
          <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm" onClick={() => setIsExportModalOpen(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[121] w-[85%] bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h4 className="text-base font-black text-gray-100 mb-2">导出达人名单</h4>
            <p className="text-xs text-gray-500 font-bold mb-6">数据将以 Excel 表格形式发送至您的邮箱</p>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase">接收邮箱</label>
                <input 
                  type="email" 
                  value={exportEmail}
                  onChange={(e) => setExportEmail(e.target.value)}
                  placeholder="请输入您的常用邮箱"
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:ring-1 focus:ring-[#FE2062] transition-all"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setIsExportModalOpen(false)}
                  className="flex-1 py-3 bg-gray-800 text-gray-400 text-xs font-black rounded-xl active:bg-gray-700"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    // Simulate export
                    alert('数据已提交后台处理，请稍后查收邮件');
                    setIsExportModalOpen(false);
                  }}
                  className="flex-1 py-3 bg-[#FE2062] text-white text-xs font-black rounded-xl shadow-lg shadow-[#FE2062]/20 active:scale-95"
                >
                  确定导出
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Share Modal */}
      {isShareModalOpen && (
        <>
          <div className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsShareModalOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-[111] bg-gray-900 rounded-t-3xl border-t border-gray-800 shadow-2xl animate-in slide-in-from-bottom duration-300 px-6 pt-8 pb-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-white">分享至</h3>
              <button onClick={() => setIsShareModalOpen(false)} className="p-2 bg-gray-800 rounded-full text-gray-400"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-4 gap-6 mb-8 text-center">
              {[
                { icon: <MessageCircle size={24} className="text-[#07C160]" />, label: '微信' },
                { icon: <Globe size={24} className="text-blue-500" />, label: '朋友圈' },
                { icon: copied ? <Check size={24} className="text-green-500" /> : <Copy size={24} className="text-gray-200" />, label: copied ? '已复制' : '复制链接', action: handleCopyLink },
                { icon: <Share2 size={24} className="text-[#FE2062]" />, label: '生成海报', action: handleDownloadPoster },
              ].map((item, idx) => (
                <button key={idx} onClick={item.action} className="flex flex-col items-center gap-2 group">
                  <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center border border-gray-700 active:scale-90 transition-all">{item.icon}</div>
                  <span className="text-[11px] font-bold text-gray-400">{item.label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setIsShareModalOpen(false)} className="w-full py-4 bg-gray-800 text-gray-300 text-sm font-black rounded-2xl">取消</button>
          </div>
        </>
      )}

      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle { animation: bounce-subtle 3s infinite ease-in-out; }
      `}</style>
    </div>
    
    {/* Portal 渲染的下拉框 */}
    {/* 达人分类下拉框 */}
    {influencerCategoryOpen && categoryButtonRect && createPortal(
      <>
        <div className="fixed inset-0 z-[100]" onClick={() => setInfluencerCategoryOpen(false)} />
        <div 
          className="fixed bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-[110] overflow-hidden"
          style={{
            left: `${categoryButtonRect.left}px`,
            top: `${categoryButtonRect.bottom + 4}px`,
            width: '112px'
          }}
        >
          {[
            { id: 'all', label: '全部' },
            { id: 'video', label: '视频达人' },
            { id: 'live', label: '直播达人' },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                setInfluencerCategory(opt.id as 'all' | 'video' | 'live');
                setInfluencerCategoryOpen(false);
              }}
              className={`w-full px-4 py-2.5 text-left text-[11px] font-bold transition-colors ${
                influencerCategory === opt.id 
                  ? 'bg-[#FE2062]/20 text-[#FE2062]' 
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </>,
      document.body
    )}
    
    {/* 粉丝数下拉框 */}
    {influencerFollowersOpen && followersButtonRect && createPortal(
      <>
        <div className="fixed inset-0 z-[100]" onClick={() => setInfluencerFollowersOpen(false)} />
        <div 
          className="fixed bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-[110] overflow-hidden"
          style={{
            left: `${followersButtonRect.left}px`,
            top: `${followersButtonRect.bottom + 4}px`,
            width: '128px'
          }}
        >
          {[
            { id: 'all', label: '全部' },
            { id: '<10w', label: '<10万' },
            { id: '10-50w', label: '10万-50万' },
            { id: '50-100w', label: '50万-100万' },
            { id: '100-500w', label: '100万-500万' },
            { id: '500-1000w', label: '500万-1000万' },
            { id: '>1000w', label: '>1000万' },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                setInfluencerFollowers(opt.id as 'all' | '<10w' | '10-50w' | '50-100w' | '100-500w' | '500-1000w' | '>1000w');
                setInfluencerFollowersOpen(false);
              }}
              className={`w-full px-4 py-2.5 text-left text-[11px] font-bold transition-colors ${
                influencerFollowers === opt.id 
                  ? 'bg-[#FE2062]/20 text-[#FE2062]' 
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </>,
      document.body
    )}
    </>
  );
};

export default ProductDetail;
