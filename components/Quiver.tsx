import React, { useState } from 'react';
import { 
    LineChart, 
    Plus, 
    Filter, 
    Settings, 
    Download, 
    Calendar,
    Table,
    TrendingUp,
    MoreHorizontal,
    Search,
    Sigma,
    Globe,
    DollarSign,
    BarChart2,
    Newspaper,
    AlertTriangle,
    TrendingDown,
    ArrowLeft,
    FileText,
    CheckCircle2,
    Clock,
    User,
    BrainCircuit,
    ArrowUpRight,
    Link as LinkIcon
} from 'lucide-react';
import { ViewState } from '../types';

// --- Types for Drill Down Data ---
interface ImpactedAssumption {
    id: string;
    name: string;
    status: 'RED' | 'YELLOW' | 'GREEN' | 'DEVIATED';
    impactType: 'SUPPORT' | 'CONFLICT' | 'NEUTRAL';
    description: string;
}

interface MetricDetail {
    id: string;
    title: string;
    subtitle: string;
    updateTime: string;
    decision: {
        id: string;
        subject: string;
        content: string;
        approver: string;
        date: string;
        status: 'EXECUTING' | 'DONE' | 'REVIEW';
    };
    chartType: 'LINE' | 'BAR' | 'AREA';
    dataPoints: number[]; // Simple mock data points for visual
    labels: string[];
    relatedAssumptions?: ImpactedAssumption[];
}

// --- Mock Data Dictionary ---
const metricDetails: Record<string, MetricDetail> = {
    'nev_sales_cn': {
        id: 'nev_sales_cn',
        title: '中国新能源销量 (China NEV Sales)',
        subtitle: '乘联会 (CPCA) 月度零售数据',
        updateTime: '2023-10-31',
        decision: {
            id: 'DEC_2023_10_05',
            subject: 'Q4 生产计划上调批复',
            content: '鉴于10月市场销量环比增长 12%，超出此前预测模型。经S&OP会议决定，立即启动备选供应链方案，上调 Q4 电池包排产计划 15% 以应对主机厂（OEM）的追加订单。',
            approver: '供应链委员会 / 李总',
            date: '2023-11-02',
            status: 'EXECUTING'
        },
        chartType: 'LINE',
        dataPoints: [45, 48, 52, 58, 65, 72, 68, 75, 82, 88, 95, 102],
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        relatedAssumptions: [
            {
                id: 'A1',
                name: '全球新能源车需求持续增长',
                status: 'GREEN',
                impactType: 'SUPPORT',
                description: '中国区 Q3 销量数据强劲 (+12% MoM)，有力支撑了全球年复合增长率 > 25% 的假设。'
            },
            {
                id: 'G1',
                name: '集团年度营收目标',
                status: 'GREEN',
                impactType: 'SUPPORT',
                description: '销量超预期直接提升年度营收达成概率。'
            }
        ]
    },
    'global_penetration': {
        id: 'global_penetration',
        title: '全球渗透率趋势 (Global Penetration)',
        subtitle: '主要经济体 NEV 市场占比',
        updateTime: '2023-Q3',
        decision: {
            id: 'DEC_2023_09_12',
            subject: '欧洲工厂扩建项目加速',
            content: '数据显示欧洲市场渗透率突破 25% 拐点。批准“匈牙利二期工厂”项目进入详细设计阶段，并提前锁定当地锂矿长协供应。',
            approver: '战略投资部 / 王总',
            date: '2023-09-15',
            status: 'DONE'
        },
        chartType: 'LINE',
        dataPoints: [12, 14, 18, 22, 25, 29, 33, 38],
        labels: ['2020', '2021', '2022', '2023 Q1', '2023 Q2', '2023 Q3', '2024 (F)', '2025 (F)'],
        relatedAssumptions: [
            {
                id: 'A1-2',
                name: '欧洲市场政策驱动',
                status: 'YELLOW',
                impactType: 'NEUTRAL',
                description: '渗透率虽然上升，但主要由政策补贴驱动，需关注德国补贴退坡后的市场反应。'
            }
        ]
    },
    'battery_install': {
        id: 'battery_install',
        title: '动力电池装机量 (Battery Installed)',
        subtitle: '全球 Top 10 厂商月度数据 (GWh)',
        updateTime: '2023-10-01',
        decision: {
            id: 'DEC_2023_10_01',
            subject: '竞对策略分析报告',
            content: '针对主要竞对在 LFP 电池领域的低价策略，批准市场部下调中端产品线价格 5%，并启动 "Cost-Down 2024" 专项研发计划，目标在明年 Q1 降低电芯成本 8%。',
            approver: '经营管理委员会',
            date: '2023-10-05',
            status: 'EXECUTING'
        },
        chartType: 'BAR',
        dataPoints: [180, 95, 70, 45, 30, 25],
        labels: ['CATL', 'BYD', 'LGES', 'Panasonic', 'SK On', 'CALB'],
        relatedAssumptions: [
            {
                id: 'A5',
                name: '竞品扩产节奏低于行业需求增速',
                status: 'YELLOW',
                impactType: 'CONFLICT',
                description: '竞对装机量增速异常，表明其产能释放快于预期，可能引发价格战风险。'
            }
        ]
    },
    'lithium_price_spot': {
        id: 'lithium_price_spot',
        title: '碳酸锂现货价格 (Lithium Carbonate Spot)',
        subtitle: 'SMM 电池级 (99.5%) 每日报价',
        updateTime: '2023-11-15',
        decision: {
            id: 'DEC_2023_11_14',
            subject: '暂缓现货采购指令',
            content: '现货价格触及 16.5万/吨 支撑位但仍有下行趋势。决定暂缓本周现货采购计划，仅维持长协最低提货量，优先消耗 45 天安全库存。',
            approver: '采购中心 / 孙总',
            date: '2023-11-14',
            status: 'EXECUTING'
        },
        chartType: 'LINE',
        dataPoints: [220, 210, 195, 180, 175, 172, 168, 165],
        labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'],
        relatedAssumptions: [
            {
                id: 'A3',
                name: '原材料价格维持可控区间',
                status: 'RED',
                impactType: 'CONFLICT',
                description: '虽然价格下行有利于成本，但波动幅度超过 ±15% 阈值，导致库存跌价风险剧增 (A3-1.1)。'
            },
            {
                id: 'G6',
                name: '整体毛利率 (Gross Margin)',
                status: 'DEVIATED',
                impactType: 'SUPPORT',
                description: '原材料成本下降长期有利于毛利修复，但短期需计提减值。'
            }
        ]
    },
    'ess_forecast': {
        id: 'ess_forecast',
        title: '储能市场需求预测 (ESS Forecast)',
        subtitle: '2024-2030 全球大储/户储 CAGR 分析',
        updateTime: '2023-11-01',
        decision: {
            id: 'DEC_2023_11_10',
            subject: '新一代储能电芯立项',
            content: '基于未来5年储能市场 35% 的复合增长率预测，正式批准 314Ah+ 大容量储能专用电芯的研发立项，预算 5000 万人民币。',
            approver: '技术委员会 / 陈CTO',
            date: '2023-11-12',
            status: 'REVIEW'
        },
        chartType: 'AREA',
        dataPoints: [50, 85, 140, 210, 300, 420, 580],
        labels: ['2023', '2024', '2025', '2026', '2027', '2028', '2029']
    }
};

interface QuiverProps {
    onNavigate: (view: ViewState, context?: any) => void;
}

export const Quiver: React.FC<QuiverProps> = ({ onNavigate }) => {
    const [selectedMetricId, setSelectedMetricId] = useState<string | null>(null);

    const currentDetail = selectedMetricId ? metricDetails[selectedMetricId] : null;

    return (
        <div className="flex h-full bg-slate-50 text-slate-800">
            {/* Top Bar (Light) */}
            <div className="w-full absolute top-0 h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                     <div className="w-8 h-8 bg-indigo-100 rounded flex items-center justify-center text-indigo-600">
                        <LineChart size={18}/>
                     </div>
                     <div>
                         <h1 className="font-bold text-slate-800 text-sm">企业战略决策支持 - 外部市场监控</h1>
                         <div className="text-[10px] text-slate-500">数据源: 彭博 (Bloomberg), 上海有色网 (SMM), 乘联会 (CPCA) • 更新于: 09:30 AM</div>
                     </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium transition-colors flex items-center gap-2 shadow-sm">
                        <Plus size={14}/> 添加图表
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded text-slate-500 border border-slate-200">
                        <Settings size={16}/>
                    </button>
                </div>
            </div>

            {/* Left Sidebar: Data & Transforms */}
            <div className="w-80 bg-white border-r border-slate-200 pt-14 flex flex-col flex-shrink-0">
                <div className="p-3 border-b border-slate-100">
                    <div className="relative">
                        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"/>
                        <input type="text" placeholder="搜索宏观指标..." className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded text-xs text-slate-800 outline-none transition-all"/>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {/* Market Demand Section - Clickable */}
                    <div className="px-2 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">市场需求 (Demand)</div>
                    
                    <div 
                        onClick={() => setSelectedMetricId('nev_sales_cn')}
                        className={`px-3 py-2 rounded cursor-pointer border-l-2 transition-all group ${selectedMetricId === 'nev_sales_cn' ? 'bg-indigo-50 border-indigo-500' : 'hover:bg-slate-50 border-transparent'}`}
                    >
                        <div className={`flex items-center gap-2 text-xs font-bold mb-1 ${selectedMetricId === 'nev_sales_cn' ? 'text-indigo-700' : 'text-slate-700 group-hover:text-indigo-600'}`}>
                            <TrendingUp size={12}/> 中国新能源销量
                        </div>
                        <div className="text-[10px] text-slate-500">乘联会月度数据 (CPCA)</div>
                    </div>

                    <div 
                        onClick={() => setSelectedMetricId('global_penetration')}
                        className={`px-3 py-2 rounded cursor-pointer border-l-2 transition-all group ${selectedMetricId === 'global_penetration' ? 'bg-indigo-50 border-indigo-500' : 'hover:bg-slate-50 border-transparent'}`}
                    >
                        <div className={`flex items-center gap-2 text-xs font-bold mb-1 ${selectedMetricId === 'global_penetration' ? 'text-indigo-700' : 'text-slate-700 group-hover:text-indigo-600'}`}>
                            <Globe size={12}/> 全球渗透率趋势
                        </div>
                        <div className="text-[10px] text-slate-500">主要经济体 NEV 占比</div>
                    </div>

                    <div 
                        onClick={() => setSelectedMetricId('battery_install')}
                        className={`px-3 py-2 rounded cursor-pointer border-l-2 transition-all group ${selectedMetricId === 'battery_install' ? 'bg-indigo-50 border-indigo-500' : 'hover:bg-slate-50 border-transparent'}`}
                    >
                        <div className={`flex items-center gap-2 text-xs font-bold mb-1 ${selectedMetricId === 'battery_install' ? 'text-indigo-700' : 'text-slate-700 group-hover:text-indigo-600'}`}>
                            <BarChart2 size={12}/> 动力电池装机量
                        </div>
                        <div className="text-[10px] text-slate-500">全球 Top 10 厂商月度数据</div>
                    </div>

                    <div 
                        onClick={() => setSelectedMetricId('ess_forecast')}
                        className={`px-3 py-2 rounded cursor-pointer border-l-2 transition-all group ${selectedMetricId === 'ess_forecast' ? 'bg-indigo-50 border-indigo-500' : 'hover:bg-slate-50 border-transparent'}`}
                    >
                        <div className={`flex items-center gap-2 text-xs font-bold mb-1 ${selectedMetricId === 'ess_forecast' ? 'text-indigo-700' : 'text-slate-700 group-hover:text-indigo-600'}`}>
                            <TrendingUp size={12}/> 储能市场需求预测
                        </div>
                        <div className="text-[10px] text-slate-500">2024-2030 CAGR 分析</div>
                    </div>

                    {/* Supply Chain Section */}
                    <div className="px-2 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-2">供应链价格 (Supply Chain)</div>
                    <div 
                        onClick={() => setSelectedMetricId('lithium_price_spot')}
                        className={`px-3 py-2 rounded cursor-pointer border-l-2 transition-all group ${selectedMetricId === 'lithium_price_spot' ? 'bg-indigo-50 border-indigo-500' : 'hover:bg-slate-50 border-transparent'}`}
                    >
                        <div className={`flex items-center gap-2 text-xs font-bold mb-1 ${selectedMetricId === 'lithium_price_spot' ? 'text-indigo-700' : 'text-slate-700 group-hover:text-indigo-600'}`}>
                            <DollarSign size={12}/> 碳酸锂现货价
                        </div>
                        <div className="text-[10px] text-slate-500">电池级 (99.5%) - SMM报价</div>
                    </div>
                    <div className="px-3 py-2 hover:bg-slate-50 rounded cursor-pointer border-l-2 border-transparent group">
                        <div className="flex items-center gap-2 text-slate-700 group-hover:text-blue-600 text-xs font-bold mb-1">
                            <DollarSign size={12}/> 硫酸钴价格
                        </div>
                        <div className="text-[10px] text-slate-500">金川/含税出厂价</div>
                    </div>
                     <div className="px-3 py-2 hover:bg-slate-50 rounded cursor-pointer border-l-2 border-transparent group">
                        <div className="flex items-center gap-2 text-slate-700 group-hover:text-blue-600 text-xs font-bold mb-1">
                            <DollarSign size={12}/> LME 镍期货
                        </div>
                        <div className="text-[10px] text-slate-500">伦敦金属交易所 3月期</div>
                    </div>
                     <div className="px-3 py-2 hover:bg-slate-50 rounded cursor-pointer border-l-2 border-transparent group">
                        <div className="flex items-center gap-2 text-slate-700 group-hover:text-blue-600 text-xs font-bold mb-1">
                            <AlertTriangle size={12}/> 锂精矿库存指数
                        </div>
                        <div className="text-[10px] text-slate-500">主要港口库存周转天数</div>
                    </div>

                    <div className="px-2 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-2">宏观与竞对 (Macro & Comp)</div>
                     <div className="px-3 py-2 hover:bg-slate-50 rounded cursor-pointer border-l-2 border-transparent group">
                        <div className="flex items-center gap-2 text-slate-700 group-hover:text-blue-600 text-xs font-bold mb-1">
                            <DollarSign size={12}/> 离岸汇率 (USD/CNY)
                        </div>
                        <div className="text-[10px] text-slate-500">实时汇率波动</div>
                    </div>
                     <div className="px-3 py-2 hover:bg-slate-50 rounded cursor-pointer border-l-2 border-transparent group">
                        <div className="flex items-center gap-2 text-slate-700 group-hover:text-blue-600 text-xs font-bold mb-1">
                            <BarChart2 size={12}/> 主机厂排产计划
                        </div>
                        <div className="text-[10px] text-slate-500">Tesla/BYD 季度排产预测</div>
                    </div>
                </div>
            </div>

            {/* Main Canvas */}
            <div className="flex-1 pt-14 p-6 overflow-y-auto bg-slate-50 relative">
                {currentDetail ? (
                    // --- Drill Down View ---
                    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
                        {/* Header */}
                        <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => setSelectedMetricId(null)}
                                    className="p-2 bg-white hover:bg-slate-50 rounded-lg text-slate-600 border border-slate-200 shadow-sm transition-colors"
                                >
                                    <ArrowLeft size={18}/>
                                </button>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                        {currentDetail.title}
                                    </h2>
                                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                                        <span>{currentDetail.subtitle}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                        <Clock size={12}/> 更新于: {currentDetail.updateTime}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1.5 bg-white text-slate-600 border border-slate-200 rounded text-xs hover:bg-slate-50 font-medium">导出 CSV</button>
                                <button className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-medium hover:bg-indigo-700 shadow-sm">订阅更新</button>
                            </div>
                        </div>

                        {/* Decision Context Card */}
                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-6 relative shadow-sm">
                             <div className="absolute top-0 left-0 bottom-0 w-1 bg-indigo-500"></div>
                             <div className="p-6">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-indigo-600 font-bold text-sm flex items-center gap-2">
                                        <FileText size={16}/> 决策批复 (Decision Context)
                                    </h3>
                                    <div className={`px-2 py-1 rounded text-[10px] font-bold border ${
                                        currentDetail.decision.status === 'EXECUTING' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                        currentDetail.decision.status === 'DONE' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                        'bg-amber-50 text-amber-700 border-amber-100'
                                    }`}>
                                        {currentDetail.decision.status === 'EXECUTING' ? '执行中 (EXECUTING)' :
                                         currentDetail.decision.status === 'DONE' ? '已完成 (DONE)' : '审批中 (REVIEW)'}
                                    </div>
                                </div>
                                <h4 className="text-slate-800 font-bold text-base mb-2">{currentDetail.decision.subject}</h4>
                                <p className="text-slate-600 text-sm leading-relaxed mb-4 bg-slate-50 p-4 rounded border border-slate-100">
                                    {currentDetail.decision.content}
                                </p>
                                <div className="flex items-center gap-6 text-xs text-slate-500 border-t border-slate-100 pt-4">
                                    <div className="flex items-center gap-2">
                                        <User size={14} className="text-slate-400"/> 批复人: <span className="text-slate-700 font-medium">{currentDetail.decision.approver}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} className="text-slate-400"/> 批复时间: <span className="text-slate-700 font-medium">{currentDetail.decision.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FileText size={14} className="text-slate-400"/> 关联文号: <span className="text-slate-700 font-mono font-medium">{currentDetail.decision.id}</span>
                                    </div>
                                </div>
                             </div>
                        </div>

                        {/* Data Visualization Section */}
                        <div className="grid grid-cols-3 gap-6">
                            {/* Main Chart */}
                            <div className="col-span-2 bg-white border border-slate-200 rounded-xl p-6 h-[450px] flex flex-col shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                        <TrendingUp size={16} className="text-blue-600"/> 趋势分析 (Trend Analysis)
                                    </h3>
                                    <div className="flex gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                                        <button className="px-3 py-1 text-[10px] text-white bg-white shadow-sm text-slate-800 rounded font-medium">1Y</button>
                                        <button className="px-3 py-1 text-[10px] text-slate-500 hover:bg-slate-200 rounded transition-colors">3Y</button>
                                        <button className="px-3 py-1 text-[10px] text-slate-500 hover:bg-slate-200 rounded transition-colors">All</button>
                                    </div>
                                </div>
                                <div className="flex-1 flex items-end justify-between px-4 gap-2 relative border-b border-l border-slate-200">
                                    {/* Y-Axis Lines */}
                                    <div className="absolute left-0 right-0 top-1/4 h-px bg-slate-100 border-t border-dashed border-slate-200"></div>
                                    <div className="absolute left-0 right-0 top-2/4 h-px bg-slate-100 border-t border-dashed border-slate-200"></div>
                                    <div className="absolute left-0 right-0 top-3/4 h-px bg-slate-100 border-t border-dashed border-slate-200"></div>
                                    
                                    {/* Visual Bar/Line Representation */}
                                    {currentDetail.dataPoints.map((val, idx) => {
                                        const maxVal = Math.max(...currentDetail.dataPoints) * 1.2;
                                        const heightPct = (val / maxVal) * 100;
                                        return (
                                            <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                                                <div 
                                                    className={`w-full max-w-[30px] rounded-t transition-all duration-500 shadow-sm ${
                                                        currentDetail.chartType === 'LINE' ? 'bg-indigo-100 border-t-4 border-indigo-600' :
                                                        currentDetail.chartType === 'BAR' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-emerald-100 border-t border-emerald-500'
                                                    }`}
                                                    style={{ height: `${heightPct}%` }}
                                                ></div>
                                                <div className="mt-3 text-[10px] text-slate-400 rotate-0 truncate w-full text-center">
                                                    {currentDetail.labels[idx]}
                                                </div>
                                                {/* Tooltip */}
                                                <div className="absolute -top-10 bg-slate-800 text-white text-xs px-2 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-lg">
                                                    {val}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Right Column: Strategic Impact & Stats */}
                            <div className="col-span-1 space-y-6">
                                {/* Strategic Impact Card (NEW) */}
                                {currentDetail.relatedAssumptions && currentDetail.relatedAssumptions.length > 0 && (
                                    <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-xl p-5 shadow-sm relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-2 text-purple-200"><BrainCircuit size={48}/></div>
                                        <h3 className="font-bold text-purple-900 text-sm mb-3 flex items-center gap-2 relative z-10">
                                            <LinkIcon size={14}/> 战略假设关联
                                        </h3>
                                        <div className="space-y-3 relative z-10">
                                            {currentDetail.relatedAssumptions.map((assump) => (
                                                <div key={assump.id} className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-purple-100 shadow-sm">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="text-xs font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{assump.id}</span>
                                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                                                            assump.impactType === 'SUPPORT' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                            assump.impactType === 'CONFLICT' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                                            'bg-slate-50 text-slate-600 border-slate-100'
                                                        }`}>
                                                            {assump.impactType === 'SUPPORT' ? '正向支撑' : assump.impactType === 'CONFLICT' ? '负向冲击' : '中性'}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs font-medium text-slate-800 mb-1">{assump.name}</div>
                                                    <p className="text-[10px] text-slate-500 leading-snug mb-2">{assump.description}</p>
                                                    
                                                    <button 
                                                        onClick={() => onNavigate(ViewState.ANNUAL_PLAN, { targetNode: assump.id })}
                                                        className="w-full mt-1 flex items-center justify-center gap-1 py-1.5 text-[10px] font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded transition-colors border border-purple-100"
                                                    >
                                                        在战略视图中分析 <ArrowUpRight size={10}/>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Key Stats Table */}
                                <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col shadow-sm flex-1">
                                    <h3 className="font-bold text-slate-800 text-sm mb-4">详细数据 (Detailed Data)</h3>
                                    <div className="flex-1 overflow-auto">
                                        <table className="w-full text-left text-xs">
                                            <thead className="text-slate-500 border-b border-slate-100 bg-slate-50 sticky top-0">
                                                <tr>
                                                    <th className="pb-2 pt-2 pl-2">Period</th>
                                                    <th className="pb-2 pt-2 text-right">Value</th>
                                                    <th className="pb-2 pt-2 text-right pr-2">YoY</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-slate-700 divide-y divide-slate-50">
                                                {[...currentDetail.dataPoints].reverse().slice(0, 6).map((val, i) => {
                                                    const idx = currentDetail.dataPoints.length - 1 - i;
                                                    const label = currentDetail.labels[idx];
                                                    const prev = currentDetail.dataPoints[idx - 1] || val;
                                                    const change = ((val - prev) / prev * 100).toFixed(1);
                                                    const isUp = parseFloat(change) >= 0;

                                                    return (
                                                        <tr key={i} className="hover:bg-slate-50">
                                                            <td className="py-3 pl-2 font-mono text-slate-500">{label}</td>
                                                            <td className="py-3 text-right font-bold">{val}</td>
                                                            <td className={`py-3 text-right pr-2 font-bold flex items-center justify-end gap-1 ${isUp ? 'text-green-600' : 'text-red-500'}`}>
                                                                {isUp ? '+' : ''}{change}%
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                    <button className="mt-4 w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs rounded-lg transition-colors border border-slate-200 font-medium">
                                        查看完整历史记录
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    // --- Default Dashboard View ---
                    <div className="grid grid-cols-2 gap-6 max-w-7xl mx-auto animate-in fade-in duration-500">
                        {/* Chart Card 1: Sales vs Material Price */}
                        <div className="col-span-2 bg-white border border-slate-200 rounded-xl p-6 h-[400px] flex flex-col shadow-sm">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                        <TrendingUp size={16} className="text-indigo-600"/> 剪刀差分析：碳酸锂价格 vs 新能源车销量
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1">关联度分析 (Correlation): -0.65 (Lag 3 months)</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500 border border-transparent hover:border-slate-200"><Calendar size={16}/></button>
                                    <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500 border border-transparent hover:border-slate-200"><Filter size={16}/></button>
                                    <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500 border border-transparent hover:border-slate-200"><MoreHorizontal size={16}/></button>
                                </div>
                            </div>
                            {/* Mock Chart Area */}
                            <div className="flex-1 relative border-l border-b border-slate-200 ml-2 mb-2">
                                {/* Grid Lines */}
                                <div className="absolute top-1/4 w-full h-px bg-slate-50 border-t border-dashed border-slate-200"></div>
                                <div className="absolute top-2/4 w-full h-px bg-slate-50 border-t border-dashed border-slate-200"></div>
                                <div className="absolute top-3/4 w-full h-px bg-slate-50 border-t border-dashed border-slate-200"></div>
                                
                                {/* Lines */}
                                <svg className="absolute inset-0 w-full h-full overflow-visible">
                                    {/* Price Curve (High start, dip, stabilize) */}
                                    <path d="M 0 50 C 100 50, 200 80, 300 150 S 500 280, 800 290" stroke="#f43f5e" strokeWidth="3" fill="none" strokeLinecap="round"/>
                                    {/* Sales Curve (Rising) */}
                                    <path d="M 0 280 C 150 270, 300 200, 500 150 S 700 80, 800 50" stroke="#10b981" strokeWidth="3" fill="none" strokeLinecap="round"/>
                                </svg>
                                
                                {/* Legend */}
                                <div className="absolute top-2 right-4 flex flex-col gap-2 bg-white/80 p-2 rounded backdrop-blur-sm border border-slate-100">
                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                        <div className="w-3 h-1 bg-rose-500 rounded-full"></div> 碳酸锂价格 (RMB/Ton)
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                        <div className="w-3 h-1 bg-emerald-500 rounded-full"></div> NEV 销量 (Units)
                                    </div>
                                </div>
                                
                                {/* Tooltip Mock */}
                                <div className="absolute top-[150px] left-[300px] bg-white border border-slate-200 p-3 rounded-lg shadow-lg z-20">
                                    <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">2023 Q2 Snapshot</div>
                                    <div className="text-xs text-rose-600 font-bold mb-0.5">Price: ¥245,000</div>
                                    <div className="text-xs text-emerald-600 font-bold">Sales: 680k</div>
                                </div>
                            </div>
                            {/* X Axis */}
                            <div className="flex justify-between text-[10px] text-slate-400 px-2 font-medium">
                                <span>2022-Q1</span><span>2022-Q3</span><span>2023-Q1</span><span>2023-Q3</span><span>2024-Q1 (F)</span>
                            </div>
                        </div>

                        {/* Chart Card 2: Competitor Share */}
                        <div className="bg-white border border-slate-200 rounded-xl p-6 h-[320px] flex flex-col shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-slate-800 text-sm">全球动力电池装机量份额 (YTD)</h3>
                                <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500"><Download size={16}/></button>
                            </div>
                            <div className="flex-1 flex flex-col justify-center space-y-4 px-2">
                                {[
                                    {name: 'CATL (宁德时代)', share: '37%', color: 'bg-blue-600', w: 'w-[80%]'},
                                    {name: 'BYD (比亚迪)', share: '16%', color: 'bg-indigo-600', w: 'w-[45%]'},
                                    {name: 'LG Energy Sol', share: '13%', color: 'bg-purple-600', w: 'w-[35%]'},
                                    {name: 'Panasonic', share: '7%', color: 'bg-slate-500', w: 'w-[20%]'},
                                    {name: 'Others', share: '27%', color: 'bg-slate-300', w: 'w-[60%]'},
                                ].map((c, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-24 text-xs text-slate-500 truncate text-right font-medium">{c.name}</div>
                                        <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden relative">
                                            <div className={`absolute left-0 top-0 bottom-0 ${c.color} ${c.w} rounded-full`}></div>
                                        </div>
                                        <div className="w-8 text-xs text-slate-700 font-bold font-mono">{c.share}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Data Table Card: Key Metrics */}
                        <div className="bg-white border border-slate-200 rounded-xl p-6 h-[320px] flex flex-col shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-slate-800 text-sm">核心原材料价格预警 (Price Alert)</h3>
                            </div>
                             <div className="flex-1 overflow-auto">
                                 <table className="w-full text-left text-xs">
                                     <thead className="text-slate-500 border-b border-slate-100 bg-slate-50">
                                         <tr>
                                             <th className="pb-2 pt-2 pl-2">项目 (Item)</th>
                                             <th className="pb-2 pt-2">现价 (Current)</th>
                                             <th className="pb-2 pt-2">周环比 (WoW)</th>
                                             <th className="pb-2 pt-2">信号 (Signal)</th>
                                         </tr>
                                     </thead>
                                     <tbody className="text-slate-700 divide-y divide-slate-50">
                                         <tr 
                                            className="hover:bg-slate-50 cursor-pointer"
                                            onClick={() => setSelectedMetricId('lithium_price_spot')}
                                         >
                                             <td className="py-3 pl-2 font-medium">电池级碳酸锂</td>
                                             <td className="py-3 font-mono text-slate-500">¥165,000</td>
                                             <td className="py-3 text-red-600 font-bold flex items-center gap-1"><TrendingDown size={12}/> -2.4%</td>
                                             <td className="py-3"><span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded border border-green-200 font-bold text-[10px]">BUY</span></td>
                                         </tr>
                                         <tr className="hover:bg-slate-50">
                                             <td className="py-3 pl-2 font-medium">氢氧化锂 (LiOH)</td>
                                             <td className="py-3 font-mono text-slate-500">¥158,000</td>
                                             <td className="py-3 text-red-600 font-bold flex items-center gap-1"><TrendingDown size={12}/> -1.8%</td>
                                             <td className="py-3"><span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded border border-green-200 font-bold text-[10px]">BUY</span></td>
                                         </tr>
                                         <tr className="hover:bg-slate-50">
                                             <td className="py-3 pl-2 font-medium">硫酸钴</td>
                                             <td className="py-3 font-mono text-slate-500">¥32,500</td>
                                             <td className="py-3 text-slate-400 flex items-center gap-1"> 0.0%</td>
                                             <td className="py-3"><span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 font-bold text-[10px]">HOLD</span></td>
                                         </tr>
                                         <tr className="hover:bg-slate-50">
                                             <td className="py-3 pl-2 font-medium">硫酸镍</td>
                                             <td className="py-3 font-mono text-slate-500">¥28,200</td>
                                             <td className="py-3 text-green-600 font-bold flex items-center gap-1"><TrendingUp size={12}/> +1.2%</td>
                                             <td className="py-3"><span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded border border-red-200 font-bold text-[10px]">SELL</span></td>
                                         </tr>
                                     </tbody>
                                 </table>
                             </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};