
import React, { useState } from 'react';
import { 
  Settings, 
  Headphones, 
  FileText, 
  Ticket, 
  MessageSquareWarning, 
  Plus, 
  Edit3, 
  TrendingUp, 
  Users, 
  ChevronRight,
  Store,
  Heart
} from 'lucide-react';

const Profile: React.FC = () => {
  const [activeShopIndex, setActiveShopIndex] = useState(0);

  const shops = [
    { name: '店铺名称', sales: '+21.1%', creators: 211, posts: 32 },
    { name: '店铺名称', sales: '+12.4%', creators: 85, posts: 142 },
    { name: '店铺名称', sales: '-2.1%', creators: 12, posts: 45 },
  ];

  return (
    <div className="flex flex-col min-h-full bg-gray-950 px-4 pt-6 pb-24 space-y-5">
      
      {/* 1. 顶部基础信息区 - 高度压缩1/3，增加层级背景 */}
      <section className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-950 opacity-100" />
        <div className="relative z-10 p-4 border border-white/5 rounded-2xl flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-full border border-white/10 p-0.5 bg-gray-800">
              <img 
                src="https://picsum.photos/seed/fm-user-829/200/200" 
                alt="Avatar" 
                className="w-full h-full object-cover rounded-full" 
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 bg-[#FE2062] rounded-full p-1 border border-gray-950">
              <Store size={8} className="text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-gray-100 truncate">FastMoss_829</h2>
              <span className="px-1.5 py-0.5 bg-white/5 text-gray-500 text-[8px] font-bold rounded tracking-tighter uppercase border border-white/5">
                Standard
              </span>
            </div>
            <p className="text-[10px] text-gray-500 font-medium mt-0.5">
              到期: 2025-06-30
            </p>
          </div>
          <button className="px-4 py-1.5 bg-[#FE2062] text-white text-[11px] font-black rounded-lg shadow-lg shadow-[#FE2062]/20 active:scale-95 transition-all shrink-0">
            升级会员
          </button>
        </div>
      </section>

      {/* 2. 我的店铺 - 标题字号缩小至 text-sm，整体高度压缩1/5 */}
      <section className="bg-gray-900/40 rounded-2xl p-4 border border-white/5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-gray-100 font-extrabold text-sm">我的店铺</h3>
          <button className="px-3 py-1 border border-gray-700 text-[#FE2062] text-[10px] font-bold rounded-lg active:scale-95 transition-all">
            添加/编辑
          </button>
        </div>
        
        {/* 店铺选择器 */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {shops.map((shop, idx) => (
            <button
              key={idx}
              onClick={() => setActiveShopIndex(idx)}
              className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
                activeShopIndex === idx 
                  ? 'bg-[#FE2062] border-[#FE2062] text-white' 
                  : 'bg-transparent border-gray-800 text-gray-500'
              }`}
            >
              <div className="w-5 h-5 rounded-full overflow-hidden bg-white/20">
                <img src={`https://picsum.photos/seed/shop-${idx}/40/40`} alt="" className="w-full h-full object-cover" />
              </div>
              <span className="truncate max-w-[60px]">{shop.name}</span>
            </button>
          ))}
        </div>

        {/* 数据展示卡片 - 紧凑布局 */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-transparent border border-gray-800 rounded-xl py-4 flex flex-col items-center justify-center">
            <p className="text-lg font-black text-gray-100">{shops[activeShopIndex].sales}</p>
            <p className="text-[9px] text-gray-500 font-bold mt-1">销量日环比</p>
          </div>
          <div className="bg-transparent border border-gray-800 rounded-xl py-4 flex flex-col items-center justify-center">
            <p className="text-lg font-black text-gray-100">{shops[activeShopIndex].creators}</p>
            <p className="text-[9px] text-gray-500 font-bold mt-1">达人新增</p>
          </div>
          <div className="bg-transparent border border-gray-800 rounded-xl py-4 flex flex-col items-center justify-center">
            <p className="text-lg font-black text-gray-100">{shops[activeShopIndex].posts}</p>
            <p className="text-[9px] text-gray-500 font-bold mt-1">视频发布</p>
          </div>
        </div>

        {/* 查看明细按钮 - 高度压缩 */}
        <button className="w-full py-1.5 bg-[#FE2062] text-white text-sm font-black rounded-xl active:scale-95 transition-all">
          查看明细
        </button>
      </section>

      {/* 3. 我关注的 - 按照设计图精细调整层级，标题修改 */}
      <section className="bg-gray-900/40 rounded-2xl p-4 border border-white/5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-gray-100 font-extrabold text-sm">我关注的</h3>
          <button className="px-4 py-1.5 border border-gray-700 text-[#FE2062] text-[10px] font-bold rounded-lg">
            查看全部
          </button>
        </div>
        
        {/* 去掉了标题下方的横线区隔 */}

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button className="bg-transparent border border-gray-800 p-4 rounded-2xl flex items-center justify-between active:scale-95 transition-transform group">
            <div className="text-left space-y-1.5">
              <p className="text-2xl font-black text-gray-100">321</p>
              <p className="text-[10px] text-gray-500 font-bold whitespace-nowrap uppercase tracking-tighter">商品 (昨日动销)</p>
            </div>
            <div className="text-[#FE2062] font-black text-xl italic tracking-tighter ml-2 shrink-0">
              »
            </div>
          </button>
          <button className="bg-transparent border border-gray-800 p-4 rounded-2xl flex items-center justify-between active:scale-95 transition-transform group">
            <div className="text-left space-y-1.5">
              <p className="text-2xl font-black text-gray-100">321</p>
              <p className="text-[10px] text-gray-500 font-bold whitespace-nowrap uppercase tracking-tighter">达人 (昨日发帖)</p>
            </div>
            <div className="text-[#FE2062] font-black text-xl italic tracking-tighter ml-2 shrink-0">
              »
            </div>
          </button>
        </div>
      </section>

      {/* 4. 功能菜单 */}
      <section className="bg-gray-900/40 rounded-2xl border border-white/5 overflow-hidden divide-y divide-white/5">
        {[
          { label: '第四届大会门票', icon: <Ticket size={16} />, detail: 'HOT', detailColor: 'text-[#FE2062]' },
          { label: '联系客服', icon: <Headphones size={16} />, detail: '09:00-21:00' },
          { label: '开具发票', icon: <FileText size={16} /> },
          { label: '我的优惠券', icon: <Ticket size={16} />, detail: '2张', detailColor: 'text-green-500' },
          { label: '投诉建议', icon: <MessageSquareWarning size={16} /> },
          { label: '账号设置', icon: <Settings size={16} /> },
        ].map((item, idx) => (
          <button key={idx} className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors group">
            <div className="flex items-center gap-3">
              <span className="text-gray-500 group-hover:text-gray-300 transition-colors">{item.icon}</span>
              <span className="text-[13px] font-semibold text-gray-300">{item.label}</span>
            </div>
            <div className="flex items-center gap-1.5">
              {item.detail && <span className={`text-[9px] font-bold ${item.detailColor || 'text-gray-600'}`}>{item.detail}</span>}
              <ChevronRight size={12} className="text-gray-700" />
            </div>
          </button>
        ))}
      </section>

      {/* 5. 信息卡片模块 */}
      <section className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
        <button className="flex-1 flex items-center gap-3 active:scale-95 transition-transform">
          <div className="relative shrink-0">
            <div className="w-9 h-9 bg-pink-50 rounded-lg flex items-center justify-center text-[#FE2062] border border-pink-100">
               <Heart size={16} fill="currentColor" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
          </div>
          <div className="min-w-0 text-left">
            <h4 className="text-[12px] font-bold text-gray-900 leading-tight">关注公众号</h4>
            <p className="text-[9px] text-gray-400 font-bold mt-0.5 whitespace-nowrap">获取更多行业资讯</p>
          </div>
        </button>

        <div className="w-[1px] h-6 bg-gray-100 mx-2" />

        <button className="flex-1 flex items-center gap-3 active:scale-95 transition-transform">
          <div className="shrink-0">
            <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
              <div className="w-6 h-6 bg-[#FE2062] rounded flex items-center justify-center text-white font-black text-[10px] shadow-md shadow-[#FE2062]/10">F</div>
            </div>
          </div>
          <div className="min-w-0 text-left">
            <h4 className="text-[12px] font-bold text-gray-900 leading-tight">关于 FastMoss</h4>
            <p className="text-[9px] text-gray-400 font-bold mt-0.5 whitespace-nowrap">我们的行业影响力</p>
          </div>
        </button>
      </section>

      {/* 底部落款 */}
      <div className="pt-2 pb-6 text-center">
        <div className="bg-white/5 py-6 rounded-2xl px-4">
          <p className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.2em] mb-2">电脑在身边？访问PC端体验更多功能</p>
          <p className="text-sm font-bold text-[#FE2062] select-all">WWW.FastMoss.COM</p>
        </div>
      </div>

    </div>
  );
};

export default Profile;
