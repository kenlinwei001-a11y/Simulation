import React, { useState } from 'react';
import { 
    ShoppingBag, 
    Star, 
    Download, 
    Search, 
    Filter,
    ShieldCheck,
    Building2,
    Plane,
    Stethoscope,
    Zap,
    TrendingUp,
    ArrowLeft,
    CheckCircle2,
    Layers,
    Database,
    Layout
} from 'lucide-react';

const products = [
    { 
        id: 1, 
        title: '反洗钱套件 (AML Suite)', 
        category: 'Finance', 
        author: 'Palantir', 
        installs: '2.4k', 
        rating: 4.9, 
        icon: ShieldCheck, 
        color: 'text-indigo-600', 
        bg: 'bg-indigo-50',
        description: '完整的反洗钱调查工作流。包含交易图谱分析、风险评分模型以及 SAR 报告生成器。已适配主流银行数据模型。'
    },
    { 
        id: 2, 
        title: '预测性维护 (Predictive Maintenance)', 
        category: 'Manufacturing', 
        author: 'Airbus', 
        installs: '1.1k', 
        rating: 4.8, 
        icon: Plane, 
        color: 'text-blue-600', 
        bg: 'bg-blue-50',
        description: '基于传感器数据的设备故障预测。内置震动分析、温度趋势监测模型，可显著降低非计划停机时间。'
    },
    { id: 3, title: '医院病床管理 (Hospital Ops)', category: 'Healthcare', author: 'NHS', installs: '850', rating: 4.7, icon: Stethoscope, color: 'text-rose-600', bg: 'bg-rose-50', description: '实时监控全院床位占用情况，优化病人流转效率。集成 EMR 系统数据。' },
    { id: 4, title: '能源网格优化 (Grid Optimization)', category: 'Energy', author: 'PG&E', installs: '620', rating: 4.6, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50', description: '电网负荷平衡与分布式能源管理套件。' },
    { id: 5, title: '供应链控制塔 (Supply Chain Tower)', category: 'Logistics', author: 'Maersk', installs: '3.2k', rating: 4.9, icon: Building2, color: 'text-emerald-600', bg: 'bg-emerald-50', description: '端到端供应链可视化。实时追踪物流节点，预警潜在延误。' },
    { id: 6, title: '营销归因模型 (Marketing Attribution)', category: 'Retail', author: 'Internal Data Team', installs: '400', rating: 4.5, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50', description: '多触点归因分析模型，优化广告投放 ROI。' },
];

export const Marketplace = () => {
    const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);

    if (selectedProduct) {
        return (
            <div className="h-full bg-slate-50 flex flex-col animate-in slide-in-from-right duration-300">
                {/* Detail Header */}
                <div className="bg-white border-b border-slate-200 px-8 py-6 flex-shrink-0">
                    <button onClick={() => setSelectedProduct(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors">
                        <ArrowLeft size={16}/> 返回市场
                    </button>
                    <div className="flex gap-6">
                        <div className={`w-24 h-24 rounded-2xl flex items-center justify-center ${selectedProduct.bg} ${selectedProduct.color} shadow-sm`}>
                            <selectedProduct.icon size={48}/>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">{selectedProduct.category}</div>
                                    <h1 className="text-3xl font-bold text-slate-900 mb-2">{selectedProduct.title}</h1>
                                    <div className="flex items-center gap-4 text-sm text-slate-600">
                                        <div className="flex items-center gap-1"><Star size={14} className="text-amber-400 fill-amber-400"/> {selectedProduct.rating}</div>
                                        <div>{selectedProduct.installs} 次安装</div>
                                        <div>发布者: {selectedProduct.author}</div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors flex items-center gap-2">
                                        <Download size={20}/> 安装套件
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detail Content */}
                <div className="flex-1 overflow-y-auto p-8 max-w-6xl mx-auto w-full grid grid-cols-3 gap-8">
                    <div className="col-span-2 space-y-8">
                         <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
                             <h3 className="text-lg font-bold text-slate-900 mb-4">应用简介</h3>
                             <p className="text-slate-600 leading-relaxed text-lg">
                                 {selectedProduct.description}
                                 <br/><br/>
                                 该套件包含完整的 Foundry 资源定义，安装后将自动创建以下内容：
                             </p>
                             <div className="grid grid-cols-2 gap-4 mt-6">
                                 <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                                     <div className="p-2 bg-purple-100 text-purple-600 rounded"><Database size={20}/></div>
                                     <div className="font-medium text-slate-800">4 个数据业务实体</div>
                                 </div>
                                 <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                                     <div className="p-2 bg-blue-100 text-blue-600 rounded"><Layers size={20}/></div>
                                     <div className="font-medium text-slate-800">12 个数据流水线</div>
                                 </div>
                                 <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                                     <div className="p-2 bg-orange-100 text-orange-600 rounded"><Layout size={20}/></div>
                                     <div className="font-medium text-slate-800">2 个 Workshop 应用</div>
                                 </div>
                             </div>
                         </div>
                         
                         {/* Screenshots Placeholder */}
                         <div className="bg-slate-200 rounded-xl h-64 flex items-center justify-center text-slate-400 border border-slate-300">
                             应用截图预览区域
                         </div>
                    </div>

                    <div className="col-span-1 space-y-6">
                        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-900 mb-4">包含功能</h3>
                            <ul className="space-y-3">
                                {['实时数据集成', '自动告警规则', '交互式仪表盘', '角色权限控制'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-slate-600 text-sm">
                                        <CheckCircle2 size={16} className="text-emerald-500"/> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-slate-50 flex flex-col overflow-hidden">
            {/* Hero Section */}
            <div className="bg-slate-900 text-white p-8 flex-shrink-0">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-3 mb-4 text-indigo-400">
                        <ShoppingBag size={24}/>
                        <span className="font-bold tracking-wide text-sm uppercase">Marketplace</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-4">发现并安装高价值业务应用</h1>
                    <p className="text-slate-400 max-w-2xl mb-8 text-lg">
                        浏览数以千计的预构建数据业务实体、流水线模板和分析仪表盘。一键部署，立即产生价值。
                    </p>
                    
                    <div className="relative max-w-xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="搜索应用包、数据业务实体、流水线模板..." 
                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                        />
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
                        {['All Categories', 'Finance', 'Manufacturing', 'Healthcare', 'Energy', 'Public Sector'].map((cat, i) => (
                            <button 
                                key={cat}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                                    i === 0 ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map(product => (
                            <div 
                                key={product.id} 
                                onClick={() => setSelectedProduct(product)}
                                className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-indigo-300 transition-all cursor-pointer group flex flex-col h-full"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${product.bg} ${product.color}`}>
                                        <product.icon size={24}/>
                                    </div>
                                    <div className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase">
                                        {product.category}
                                    </div>
                                </div>
                                
                                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{product.title}</h3>
                                <p className="text-sm text-slate-500 mb-6 flex-1 line-clamp-3">
                                    {product.description}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1 text-xs font-medium text-slate-700">
                                            <Star size={12} className="text-amber-400 fill-amber-400"/> {product.rating}
                                            <span className="text-slate-400 mx-1">•</span>
                                            <span className="text-slate-500">{product.installs} installs</span>
                                        </div>
                                        <div className="text-[10px] text-slate-400 mt-1">By {product.author}</div>
                                    </div>
                                    <button className="p-2 bg-slate-100 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors text-slate-600">
                                        <Download size={18}/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};