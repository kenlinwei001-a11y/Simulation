
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
    Layout,
    Thermometer,
    Microscope,
    Scale,
    Droplets,
    Activity,
    Cpu,
    Truck,
    Factory,
    Battery,
    Wrench,
    AlertTriangle,
    Eye,
    Network,
    Clock
} from 'lucide-react';

// --- Lithium Battery Specific Mock Data ---
const products = [
    // 1. Manufacturing (Production)
    { 
        id: 1, 
        title: '涂布厚度监控 (Coating Thickness Monitor)', 
        category: 'Manufacturing', 
        author: 'Process AI', 
        installs: '2.4k', 
        rating: 4.9, 
        icon: Layers, 
        color: 'text-blue-600', 
        bg: 'bg-blue-50',
        description: '基于 Beta/X-Ray 射线数据的实时闭环控制系统。自动调节模头挤压压力，将极片涂布厚度 CPK 提升至 1.67 以上。'
    },
    { 
        id: 2, 
        title: '辊压张力控制 (Calendering Tension Ctrl)', 
        category: 'Manufacturing', 
        author: 'Siemens', 
        installs: '1.8k', 
        rating: 4.7, 
        icon: Activity, 
        color: 'text-blue-600', 
        bg: 'bg-blue-50',
        description: '针对高镍三元材料的辊压工序优化组件。实时补偿张力波动，减少极片断带风险，提升压实密度一致性。'
    },
    { 
        id: 3, 
        title: '分切毛刺检测 (Slitting Burrs AI)', 
        category: 'Manufacturing', 
        author: 'Cognex', 
        installs: '3.1k', 
        rating: 4.8, 
        icon: Microscope, 
        color: 'text-blue-600', 
        bg: 'bg-blue-50',
        description: '集成 8K 线扫相机数据，利用深度学习识别微米级毛刺与掉粉。自动标记不良品位置，防止隔膜刺穿风险。'
    },
    { 
        id: 4, 
        title: '卷绕对齐度校准 (Winding Alignment)', 
        category: 'Manufacturing', 
        author: 'Internal Ops', 
        installs: '950', 
        rating: 4.5, 
        icon: RotateCcw, 
        color: 'text-blue-600', 
        bg: 'bg-blue-50',
        description: '极片与隔膜 Overhang 实时监控。通过纠偏传感器数据反馈，动态调整卷针速度，确保 Overhang 尺寸 < 0.5mm。'
    },
    { 
        id: 5, 
        title: '焊接熔深分析 (Welding Depth Analyzer)', 
        category: 'Manufacturing', 
        author: 'LaserTech', 
        installs: '1.2k', 
        rating: 4.6, 
        icon: Zap, 
        color: 'text-blue-600', 
        bg: 'bg-blue-50',
        description: '针对顶盖焊接与极耳焊接的熔深 OCT 监测。实时剔除虚焊与炸焊品，生成每颗电芯的焊接质量溯源档案。'
    },
    { 
        id: 6, 
        title: '注液量精度控制 (Electrolyte Injection)', 
        category: 'Manufacturing', 
        author: 'Bosch Rexroth', 
        installs: '800', 
        rating: 4.7, 
        icon: Droplets, 
        color: 'text-blue-600', 
        bg: 'bg-blue-50',
        description: '高精度注液泵数据分析套件。监控注液量 CPK，自动补偿因电解液粘度变化导致的注液误差。'
    },
    { 
        id: 7, 
        title: '化成工艺优化 (Formation Optimization)', 
        category: 'Manufacturing', 
        author: 'Battery Lab', 
        installs: '1.5k', 
        rating: 4.9, 
        icon: Battery, 
        color: 'text-blue-600', 
        bg: 'bg-blue-50',
        description: '基于 SEI 膜生长模型的化成电流/电压曲线优化器。可缩短化成时间 15% 同时保证电化学性能。'
    },
    { 
        id: 8, 
        title: 'OEE 实时看板 (OEE Dashboard)', 
        category: 'Manufacturing', 
        author: 'IT Dept', 
        installs: '5.0k', 
        rating: 4.8, 
        icon: Factory, 
        color: 'text-blue-600', 
        bg: 'bg-blue-50',
        description: '产线综合设备效率监控。自动采集停机原因（换型、故障、缺料），生成帕累托图，辅助精益生产改善。'
    },

    // 2. Quality & Lab (Quality)
    { 
        id: 9, 
        title: '电压压差异常侦测 (Voltage Outlier)', 
        category: 'Quality', 
        author: 'Data Science Team', 
        installs: '2.2k', 
        rating: 4.9, 
        icon: TrendingUp, 
        color: 'text-red-600', 
        bg: 'bg-red-50',
        description: '静置阶段 OCV/K值 异常筛选算法。识别微短路风险电芯，防止流入 Pack 组装环节。'
    },
    { 
        id: 10, 
        title: 'X-Ray 缺陷识别 (X-Ray Defect AI)', 
        category: 'Quality', 
        author: 'Visual AI', 
        installs: '1.9k', 
        rating: 4.7, 
        icon: Eye, 
        color: 'text-red-600', 
        bg: 'bg-red-50',
        description: '卷芯内部结构无损检测。自动识别极耳翻折、阴阳极错位等缺陷，替代人工复判，检出率 > 99.9%。'
    },
    { 
        id: 11, 
        title: '绝缘电阻趋势分析 (Insulation Trend)', 
        category: 'Quality', 
        author: 'Quality Dept', 
        installs: '600', 
        rating: 4.5, 
        icon: ShieldCheck, 
        color: 'text-red-600', 
        bg: 'bg-red-50',
        description: 'Pack 安规测试数据分析。追踪绝缘阻值随湿度变化的趋势，提前预警潜在的绝缘失效风险。'
    },
    { 
        id: 12, 
        title: '缺陷根因追溯 (Defect Root Cause)', 
        category: 'Quality', 
        author: 'Palantir', 
        installs: '3.5k', 
        rating: 4.9, 
        icon: Network, 
        color: 'text-red-600', 
        bg: 'bg-red-50',
        description: '跨工序数据关联分析。一键追溯成品缺陷对应的原材料批次、设备参数及班组信息，快速定位问题源头。'
    },

    // 3. Supply Chain & Cost
    { 
        id: 13, 
        title: '碳酸锂价格预测 (Lithium Price Forecast)', 
        category: 'Supply Chain', 
        author: 'SMM Integration', 
        installs: '1.2k', 
        rating: 4.6, 
        icon: TrendingUp, 
        color: 'text-emerald-600', 
        bg: 'bg-emerald-50',
        description: '集成上海有色网与期货市场数据。利用 LSTM 模型预测未来 30 天碳酸锂现货价格走势，辅助采购锁单决策。'
    },
    { 
        id: 14, 
        title: '正极材料库存优化 (Cathode Inventory)', 
        category: 'Supply Chain', 
        author: 'SCM Team', 
        installs: '900', 
        rating: 4.5, 
        icon: Scale, 
        color: 'text-emerald-600', 
        bg: 'bg-emerald-50',
        description: '基于排产计划的 NCM/LFP 材料安全库存动态计算器。平衡缺货风险与资金占用成本。'
    },
    { 
        id: 15, 
        title: '供应商质量计分卡 (Supplier Scorecard)', 
        category: 'Supply Chain', 
        author: 'SQE Dept', 
        installs: '1.1k', 
        rating: 4.7, 
        icon: CheckCircle2, 
        color: 'text-emerald-600', 
        bg: 'bg-emerald-50',
        description: '自动汇总是来料检验 (IQC) 不良率、交付及时率 (OTIF) 数据，生成供应商季度绩效评分报告。'
    },
    { 
        id: 16, 
        title: '物流冲击监测 (Logistics Shock)', 
        category: 'Supply Chain', 
        author: 'IoT Hub', 
        installs: '750', 
        rating: 4.4, 
        icon: Truck, 
        color: 'text-emerald-600', 
        bg: 'bg-emerald-50',
        description: '集成运输车辆 G-Sensor 数据。监控电芯运输过程中的振动与冲击加速度，确保到货产品无物理损伤。'
    },

    // 4. R&D & Engineering
    { 
        id: 17, 
        title: '循环寿命预测 (Cycle Life Prediction)', 
        category: 'R&D', 
        author: 'Battery Lab', 
        installs: '1.4k', 
        rating: 4.8, 
        icon: Clock, 
        color: 'text-purple-600', 
        bg: 'bg-purple-50',
        description: '基于早期循环数据 (前100圈) 预测全生命周期寿命。加速新材料配方的验证周期。'
    },
    { 
        id: 18, 
        title: 'BMS 算法沙箱 (BMS Sandbox)', 
        category: 'R&D', 
        author: 'Algorithm Team', 
        installs: '600', 
        rating: 4.6, 
        icon: Cpu, 
        color: 'text-purple-600', 
        bg: 'bg-purple-50',
        description: '云端 SOX (SOC/SOH/SOP) 算法验证环境。利用海量实车数据回放验证新版 BMS 固件的准确性。'
    },

    // 5. EHS & Facility
    { 
        id: 19, 
        title: '干燥房露点控制 (Dew Point Ctrl)', 
        category: 'EHS', 
        author: 'Facility Ops', 
        installs: '1.8k', 
        rating: 4.8, 
        icon: Thermometer, 
        color: 'text-orange-600', 
        bg: 'bg-orange-50',
        description: '注液工序环境监控核心应用。实时监测露点温度 (-40°C)，联动除湿机组，防止电解液水解风险。'
    },
    { 
        id: 20, 
        title: '能耗管理专家 (Energy Saver)', 
        category: 'EHS', 
        author: 'Carbon Zero', 
        installs: '2.0k', 
        rating: 4.7, 
        icon: Zap, 
        color: 'text-orange-600', 
        bg: 'bg-orange-50',
        description: '全厂水电气能耗分析。重点监控化成充放电回馈效率与除湿机能耗，降低单瓦时制造成本。'
    }
];

function RotateCcw({ size, className }: { size: number, className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
        </svg>
    )
}

export const Marketplace = () => {
    const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
    const [filterCategory, setFilterCategory] = useState('All');

    const categories = ['All', 'Manufacturing', 'Quality', 'Supply Chain', 'R&D', 'EHS'];
    const filteredProducts = filterCategory === 'All' ? products : products.filter(p => p.category === filterCategory);

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
                                        <Download size={20}/> 安装组件
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
                                 该组件专为锂电制造场景设计，开箱即用。安装后将自动连接相关产线数据源（需配置连接器）。
                             </p>
                             <div className="grid grid-cols-2 gap-4 mt-6">
                                 <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                                     <div className="p-2 bg-purple-100 text-purple-600 rounded"><Database size={20}/></div>
                                     <div className="font-medium text-slate-800">内置数据模型 (Ontology)</div>
                                 </div>
                                 <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                                     <div className="p-2 bg-blue-100 text-blue-600 rounded"><Layers size={20}/></div>
                                     <div className="font-medium text-slate-800">预置流水线模板</div>
                                 </div>
                                 <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                                     <div className="p-2 bg-orange-100 text-orange-600 rounded"><Layout size={20}/></div>
                                     <div className="font-medium text-slate-800">Workshop 交互界面</div>
                                 </div>
                                 <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                                     <div className="p-2 bg-emerald-100 text-emerald-600 rounded"><AlertTriangle size={20}/></div>
                                     <div className="font-medium text-slate-800">自动告警规则库</div>
                                 </div>
                             </div>
                         </div>
                         
                         {/* Screenshots Placeholder */}
                         <div className="bg-slate-200 rounded-xl h-64 flex items-center justify-center text-slate-400 border border-slate-300">
                             应用截图预览区域 (Screenshot Preview)
                         </div>
                    </div>

                    <div className="col-span-1 space-y-6">
                        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-900 mb-4">适用场景</h3>
                            <ul className="space-y-3">
                                {['Base 1/2/3 生产基地', '质量检测实验室', '供应链控制塔', 'R&D 试制线'].map((item, i) => (
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
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-3 mb-4 text-indigo-400">
                        <ShoppingBag size={24}/>
                        <span className="font-bold tracking-wide text-sm uppercase">Industry Components</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-4">锂电制造数字化应用组件市场</h1>
                    <p className="text-slate-400 max-w-2xl mb-8 text-lg">
                        浏览专为锂电池全生命周期打造的业务组件。覆盖从电极制备、电芯装配到化成老化及供应链管理的细分场景。一键安装，即刻赋能。
                    </p>
                    
                    <div className="relative max-w-xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="搜索组件：涂布监控、焊接检测、库存优化..." 
                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                        />
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
                        {categories.map((cat, i) => (
                            <button 
                                key={cat}
                                onClick={() => setFilterCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                                    filterCategory === cat ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map(product => (
                            <div 
                                key={product.id} 
                                onClick={() => setSelectedProduct(product)}
                                className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg hover:border-indigo-300 transition-all cursor-pointer group flex flex-col h-full"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${product.bg} ${product.color}`}>
                                        <product.icon size={24}/>
                                    </div>
                                    <div className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase">
                                        {product.category}
                                    </div>
                                </div>
                                
                                <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1" title={product.title}>{product.title}</h3>
                                <p className="text-xs text-slate-500 mb-6 flex-1 line-clamp-3 leading-relaxed">
                                    {product.description}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1 text-[10px] font-medium text-slate-700">
                                            <Star size={10} className="text-amber-400 fill-amber-400"/> {product.rating}
                                            <span className="text-slate-400 mx-1">•</span>
                                            <span className="text-slate-500">{product.installs}</span>
                                        </div>
                                        <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[100px]">{product.author}</div>
                                    </div>
                                    <button className="p-2 bg-slate-50 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors text-slate-500">
                                        <Download size={16}/>
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
