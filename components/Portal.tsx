import React, { useState } from 'react';
import { 
    Search, 
    Clock, 
    ChevronDown, 
    Plus, 
    Box, 
    AppWindow, 
    Settings, 
    Users, 
    Truck, 
    Factory, 
    AlertTriangle, 
    TrendingUp, 
    DollarSign, 
    Activity, 
    X, 
    ArrowLeft, 
    MapPin, 
    PieChart, 
    BarChart3, 
    Calendar,
    FileText,
    TrendingDown,
    Target,
    Network,
    Bot,
    Sparkles,
    CheckCircle2,
    ArrowRight,
    BrainCircuit,
    Lightbulb,
    Layers
} from 'lucide-react';
import { ViewState } from '../types';

interface PortalProps {
    onNavigate: (view: ViewState, context?: any) => void;
}

// --- Widget Definitions ---
type WidgetType = 'CUSTOMER_FORECAST' | 'REALTIME_ORDERS' | 'PAYMENT_COLLECTION' | 'PRODUCTION_YIELD' | 'LITHIUM_PRICE';

interface WidgetConfig {
    id: WidgetType;
    title: string;
    description: string;
    icon: any;
    color: string;
    enabled: boolean;
}

const DEFAULT_WIDGETS: WidgetConfig[] = [
    { id: 'CUSTOMER_FORECAST', title: '客户需求预测 (Forecast)', description: 'Tesla, BYD 等核心客户未来3个月排产预测', icon: Users, color: 'text-purple-600', enabled: true },
    { id: 'REALTIME_ORDERS', title: '实时大额订单 (Orders)', description: '监控今日进场的超过 500万 RMB 的订单', icon: Truck, color: 'text-blue-600', enabled: true },
    { id: 'PAYMENT_COLLECTION', title: '回款进度 (Payments)', description: '本月应收账款与实际回款进度监控', icon: DollarSign, color: 'text-emerald-600', enabled: true },
    { id: 'PRODUCTION_YIELD', title: '产线直通率 (Yield)', description: '各基地 Pack/Cell 产线实时良率大盘', icon: Factory, color: 'text-orange-600', enabled: true },
    { id: 'LITHIUM_PRICE', title: '原材料价格 (Material)', description: '碳酸锂及前驱体实时市场报价', icon: TrendingUp, color: 'text-rose-600', enabled: true },
];

// --- Mock Data for AI & Graph ---
const IMPACT_DATA: Record<string, { root: string, nodes: any[], edges: any[] }> = {
    'LITHIUM_PRICE': {
        root: '碳酸锂价格 (Metric)',
        nodes: [
            { id: 'm1', label: '碳酸锂现货价', type: 'METRIC', status: 'normal' },
            { id: 'a3', label: 'A3: 原材料成本控制', type: 'ASSUMPTION', status: 'risk' },
            { id: 'g3', label: 'G3: 电芯单位成本', type: 'GOAL', status: 'risk' },
            { id: 'g6', label: 'G6: 整体毛利率', type: 'GOAL', status: 'deviated' }
        ],
        edges: [
            { from: 'm1', to: 'a3', label: '直接决定' },
            { from: 'a3', to: 'g3', label: '强约束' },
            { from: 'a3', to: 'g6', label: '负相关' }
        ]
    },
    'PRODUCTION_YIELD': {
        root: '产线直通率 (Metric)',
        nodes: [
            { id: 'm1', label: 'Base 3 直通率', type: 'METRIC', status: 'warning' },
            { id: 'a6', label: 'A6: 新技术量产', type: 'ASSUMPTION', status: 'normal' },
            { id: 'g2', label: 'G2: 有效产能', type: 'GOAL', status: 'normal' },
            { id: 'g3', label: 'G3: 单位制造成本', type: 'GOAL', status: 'risk' }
        ],
        edges: [
            { from: 'm1', to: 'a6', label: '关键验证' },
            { from: 'a6', to: 'g2', label: '支撑' },
            { from: 'a6', to: 'g3', label: '降低' }
        ]
    },
    'CUSTOMER_FORECAST': {
        root: '客户需求 (Metric)',
        nodes: [
            { id: 'm1', label: 'Q4 排产预测', type: 'METRIC', status: 'normal' },
            { id: 'a2', label: 'A2: 客户产能规划', type: 'ASSUMPTION', status: 'warning' },
            { id: 'g1', label: 'G1: 集团营收', type: 'GOAL', status: 'normal' }
        ],
        edges: [
            { from: 'm1', to: 'a2', label: '输入' },
            { from: 'a2', to: 'g1', label: '支撑' }
        ]
    }
};

const AI_ADVICE_DATA: Record<string, any> = {
    'LITHIUM_PRICE': {
        title: '原材料采购策略建议',
        context: '当前碳酸锂价格 ¥165,000/吨，处于下行通道（WoW -2.4%）。行业库存普遍较高（平均 2.5个月），且下游需求增速放缓。',
        options: [
            { title: '方案 A：激进策略', desc: '停止所有现货采购，消耗安全库存至 15 天，赌价格跌破 15万。', risk: '高 (若价格反弹将导致断供)', benefit: '预计节省采购成本 1200万' },
            { title: '方案 B：稳健策略 (推荐)', desc: '维持长协最低提货量 (60%)，暂停现货采购。利用期货工具进行 30% 敞口套保。', risk: '中', benefit: '成本波动控制在 ±5% 以内' },
            { title: '方案 C：保守策略', desc: '按原计划采购，甚至逢低补库。', risk: '中 (可能面临存货跌价损失)', benefit: '供应绝对安全' }
        ],
        recommendation: '建议采用【方案 B】。目前市场供大于求格局未变，无需急于补库。同时建议采购部与 SQM 发起 Q1 长协价格谈判，目标下调 8%。'
    },
    'PRODUCTION_YIELD': {
        title: '产线良率提升建议',
        context: 'Base 3 产线良率 94.1%，低于目标 97.5%。主要失效模式为 "虚焊" (Top 1, 42%)。',
        options: [
            { title: '方案 A：工艺优化', desc: '调整激光焊接功率参数，增加焊后AOI检测频次。', risk: '低', benefit: '预计良率提升 +1.5%' },
            { title: '方案 B：设备改造', desc: '停线 3 天，更换新型焊接头。', risk: '高 (影响当期产量)', benefit: '预计良率提升 +3.0%' }
        ],
        recommendation: '建议立即执行【方案 A】。当前处于交付高峰期，不宜长时间停线。若两周后良率未达标，再考虑方案 B。'
    }
};

// --- Modals ---

const StrategicImpactModal = ({ type, onClose }: { type: string, onClose: () => void }) => {
    const data = IMPACT_DATA[type] || IMPACT_DATA['LITHIUM_PRICE']; // Fallback

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-[800px] h-[500px] flex flex-col overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                            <Network size={20} className="text-purple-600"/>
                            战略归因图谱 (Causal Graph)
                        </h3>
                        <p className="text-xs text-slate-500">分析运营指标对集团战略目标的影响链路</p>
                    </div>
                    <button onClick={onClose} className="hover:bg-slate-200 p-1 rounded text-slate-500"><X size={20}/></button>
                </div>
                <div className="flex-1 bg-slate-50 relative overflow-hidden flex items-center justify-center">
                    {/* Simulated Graph Visualization */}
                    <div className="relative w-full h-full p-10">
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <defs>
                                <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                                    <path d="M0,0 L0,6 L9,3 z" fill="#cbd5e1" />
                                </marker>
                            </defs>
                            {/* Simple connecting lines based on fixed positions for demo */}
                            <path d="M 150 250 C 250 250, 250 250, 350 250" stroke="#94a3b8" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
                            {data.nodes.length > 2 && <path d="M 550 250 C 600 250, 600 150, 650 150" stroke="#94a3b8" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />}
                            {data.nodes.length > 3 && <path d="M 550 250 C 600 250, 600 350, 650 350" stroke="#94a3b8" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />}
                        </svg>

                        <div className="flex justify-between items-center h-full relative z-10">
                            {/* Layer 1: Metric */}
                            <div className="flex flex-col justify-center h-full">
                                <div className="w-48 p-4 bg-white border-2 border-blue-500 rounded-xl shadow-lg flex flex-col items-center gap-2">
                                    <Activity size={24} className="text-blue-500"/>
                                    <div className="font-bold text-slate-800 text-center">{data.nodes[0].label}</div>
                                    <div className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">运营指标层</div>
                                </div>
                            </div>

                            {/* Layer 2: Assumption */}
                            <div className="flex flex-col justify-center h-full">
                                <div className="w-48 p-4 bg-white border-2 border-yellow-400 rounded-xl shadow-lg flex flex-col items-center gap-2">
                                    <BrainCircuit size={24} className="text-yellow-500"/>
                                    <div className="font-bold text-slate-800 text-center">{data.nodes[1].label}</div>
                                    <div className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">战略假设层</div>
                                </div>
                            </div>

                            {/* Layer 3: Goals */}
                            <div className="flex flex-col justify-center gap-8 h-full">
                                {data.nodes.slice(2).map((node, i) => (
                                    <div key={i} className="w-48 p-4 bg-white border-2 border-emerald-500 rounded-xl shadow-lg flex flex-col items-center gap-2">
                                        <Target size={24} className="text-emerald-500"/>
                                        <div className="font-bold text-slate-800 text-center">{node.label}</div>
                                        <div className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">战略目标层</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AiAdviceModal = ({ type, onClose }: { type: string, onClose: () => void }) => {
    const advice = AI_ADVICE_DATA[type] || AI_ADVICE_DATA['LITHIUM_PRICE']; // Fallback

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-[700px] flex flex-col overflow-hidden border border-slate-200">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 flex justify-between items-center text-white">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Sparkles size={20} className="text-yellow-300"/>
                        AI 智能决策顾问 (Smart Advisor)
                    </h3>
                    <button onClick={onClose} className="hover:bg-white/20 p-1 rounded text-white transition-colors"><X size={20}/></button>
                </div>
                
                <div className="p-8 overflow-y-auto max-h-[600px]">
                    <h2 className="text-xl font-bold text-slate-900 mb-2">{advice.title}</h2>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm mb-6 leading-relaxed">
                        <span className="font-bold text-slate-900 block mb-1">当前局势 (Situation):</span>
                        {advice.context}
                    </div>

                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Layers size={14}/> 可选方案 (Options)
                    </h4>
                    <div className="space-y-3 mb-8">
                        {advice.options.map((opt: any, i: number) => (
                            <div key={i} className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors group">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="font-bold text-slate-800 text-sm">{opt.title}</div>
                                    {opt.title.includes('推荐') && <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded font-bold">AI 推荐</span>}
                                </div>
                                <p className="text-sm text-slate-600 mb-2">{opt.desc}</p>
                                <div className="flex gap-4 text-xs">
                                    <span className="text-slate-500">风险: <span className="font-medium text-slate-700">{opt.risk}</span></span>
                                    <span className="text-slate-500">收益: <span className="font-medium text-blue-600">{opt.benefit}</span></span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-xl flex gap-4">
                        <div className="p-2 bg-white rounded-full h-fit shadow-sm text-indigo-600 border border-indigo-100">
                            <Lightbulb size={24}/>
                        </div>
                        <div>
                            <h4 className="font-bold text-indigo-900 mb-1">最终建议 (Final Recommendation)</h4>
                            <p className="text-sm text-indigo-800 leading-relaxed">
                                {advice.recommendation}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">关闭</button>
                    <button className="px-4 py-2 text-sm bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center gap-2">
                        <FileText size={16}/> 生成详细报告
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Detail View Components ---

const DetailViewHeader = ({ title, onBack }: { title: string, onBack: () => void }) => (
    <div className="flex items-center gap-4 mb-6">
        <button 
            onClick={onBack} 
            className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 shadow-sm transition-all"
        >
            <ArrowLeft size={18} />
        </button>
        <div>
            <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
            <p className="text-xs text-slate-500 mt-1">数据实时同步中 • 最后更新: 刚刚</p>
        </div>
    </div>
);

const ExecutiveSummary = ({ text, type = 'NEUTRAL', onAdvice }: { text: string, type?: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL', onAdvice?: () => void }) => (
    <div className="flex gap-4 mb-6 items-start">
        <div className={`flex-1 p-4 rounded-xl border flex items-start gap-3 ${
            type === 'POSITIVE' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
            type === 'NEGATIVE' ? 'bg-rose-50 border-rose-100 text-rose-800' :
            'bg-blue-50 border-blue-100 text-blue-800'
        }`}>
            <FileText size={20} className="mt-0.5 flex-shrink-0" />
            <div>
                <div className="text-xs font-bold uppercase opacity-70 mb-1">决策摘要 (Executive Summary)</div>
                <p className="text-sm font-medium leading-relaxed">{text}</p>
            </div>
        </div>
        {onAdvice && (
            <button 
                onClick={onAdvice}
                className="group flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all w-32 h-full flex-shrink-0 border border-indigo-400"
            >
                <Sparkles size={24} className="mb-2 text-yellow-300 animate-pulse"/>
                <span className="text-xs font-bold">智能建议</span>
                <span className="text-[10px] opacity-80">AI Insight</span>
            </button>
        )}
    </div>
);

const CustomerForecastDetail = ({ onBack, onShowGraph, onShowAi }: { onBack: () => void, onShowGraph: () => void, onShowAi: () => void }) => (
    <div className="animate-in slide-in-from-right duration-300">
        <DetailViewHeader title="客户需求预测详情 (Customer Forecast Analysis)" onBack={onBack} />
        
        <ExecutiveSummary 
            text="Q4 核心客户（Tesla, BYD）总需求量预计环比增长 15%，超出当前 Base 1 工厂产能上限。建议立即启动 Base 2 备用产线，并与供应链确认 12 月份电解液增补订单。"
            type="NEGATIVE"
            onAdvice={onShowAi}
        />

        <div className="grid grid-cols-3 gap-6">
            {/* Chart */}
            <div className="col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800">分客户排产预测 (Q4 - 2024 Q1)</h3>
                    <div className="flex gap-2">
                        <span className="flex items-center gap-1 text-xs text-slate-500"><div className="w-2 h-2 bg-purple-500 rounded-full"></div> Tesla</span>
                        <span className="flex items-center gap-1 text-xs text-slate-500"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> BYD</span>
                        <span className="flex items-center gap-1 text-xs text-slate-500"><div className="w-2 h-2 bg-slate-300 rounded-full"></div> Others</span>
                    </div>
                </div>
                <div className="h-64 flex items-end justify-between gap-4 px-4">
                    {['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'].map((m, i) => (
                        <div key={i} className="flex-1 flex flex-col justify-end gap-1 h-full">
                            <div className="w-full bg-slate-300 rounded-sm hover:opacity-80 transition-opacity" style={{height: `${10 + Math.random()*20}%`}}></div>
                            <div className="w-full bg-blue-500 rounded-sm hover:opacity-80 transition-opacity" style={{height: `${20 + Math.random()*30}%`}}></div>
                            <div className="w-full bg-purple-500 rounded-sm hover:opacity-80 transition-opacity relative group" style={{height: `${30 + Math.random()*40}%`}}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                    Total: {Math.floor(80 + Math.random() * 40)}k
                                </div>
                            </div>
                            <span className="text-xs text-slate-500 text-center mt-2 font-mono">{m}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4">产能负荷预警</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-600">Base 1 (LFP Line)</span>
                                <span className="text-red-600 font-bold">102%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-red-500 w-full h-full rounded-full"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-600">Base 2 (NCM Line)</span>
                                <span className="text-emerald-600 font-bold">78%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 w-[78%] h-full rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                    <h3 className="font-bold text-indigo-800 mb-2 flex items-center gap-2"><Network size={16}/> 战略归因分析</h3>
                    <div className="text-sm text-indigo-700 leading-relaxed mb-4">
                        该预测波动直接影响年度目标 G1 (营收) 和 A2 (客户产能)。建议查看战略图谱以评估全局影响。
                    </div>
                    <button 
                        onClick={onShowGraph}
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                        查看影响链路
                    </button>
                </div>
            </div>
        </div>
    </div>
);

const OrdersDetail = ({ onBack }: { onBack: () => void }) => (
    <div className="animate-in slide-in-from-right duration-300">
        <DetailViewHeader title="实时订单与交付监控 (Order Fulfillment)" onBack={onBack} />
        
        <ExecutiveSummary 
            text="今日累计接收订单金额 1.2 亿元。注意：GAC Aion 的一笔加急订单 (950w) 物流状态显示异常滞留，请物流部关注。"
            type="NEUTRAL"
        />

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                    <tr>
                        <th className="px-6 py-4 font-medium">客户名称</th>
                        <th className="px-6 py-4 font-medium">订单编号</th>
                        <th className="px-6 py-4 font-medium">金额 (RMB)</th>
                        <th className="px-6 py-4 font-medium">产品类型</th>
                        <th className="px-6 py-4 font-medium">交付状态</th>
                        <th className="px-6 py-4 font-medium text-right">操作</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {[
                        { cust: 'Tesla Shanghai', id: 'ORD-2023-9981', amt: '24,500,000', type: 'Model Y Pack (78kWh)', status: 'In Production', sColor: 'bg-blue-100 text-blue-700' },
                        { cust: 'BYD Auto', id: 'ORD-2023-9982', amt: '18,200,000', type: 'Blade Battery Module', status: 'Shipped', sColor: 'bg-purple-100 text-purple-700' },
                        { cust: 'GAC Aion', id: 'ORD-2023-9983', amt: '9,500,000', type: 'Aion S Pack', status: 'Logistics Delay', sColor: 'bg-red-100 text-red-700' },
                        { cust: 'Xpeng Motors', id: 'ORD-2023-9984', amt: '5,600,000', type: 'P7i Battery Pack', status: 'Pending Material', sColor: 'bg-amber-100 text-amber-700' },
                    ].map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50 group">
                            <td className="px-6 py-4 font-bold text-slate-800">{row.cust}</td>
                            <td className="px-6 py-4 font-mono text-slate-500">{row.id}</td>
                            <td className="px-6 py-4 font-mono font-bold">¥ {row.amt}</td>
                            <td className="px-6 py-4 text-slate-600">{row.type}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${row.sColor}`}>
                                    {row.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-blue-600 hover:underline font-medium text-xs">查看详情</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-full"><Truck size={24}/></div>
                <div>
                    <div className="text-sm text-slate-500">在途车辆</div>
                    <div className="text-2xl font-bold text-slate-800">142 辆</div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-full"><AlertTriangle size={24}/></div>
                <div>
                    <div className="text-sm text-slate-500">预计延误风险</div>
                    <div className="text-2xl font-bold text-orange-600">3 批次</div>
                </div>
            </div>
        </div>
    </div>
);

const PaymentDetail = ({ onBack }: { onBack: () => void }) => (
    <div className="animate-in slide-in-from-right duration-300">
        <DetailViewHeader title="资金与回款分析 (Financial Overview)" onBack={onBack} />
        
        <ExecutiveSummary 
            text="本月回款达成率 68%，略低于预期 (75%)。主要原因为某新势力客户 (Nio) 申请延期支付 30 天。现金流依旧健康，无需启动过桥融资。"
            type="NEUTRAL"
        />

        <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-6">应收账款账龄分析 (AR Aging)</h3>
                <div className="flex items-center gap-8">
                    {/* Mock Doughnut */}
                    <div className="w-40 h-40 rounded-full border-[16px] border-emerald-500 border-r-blue-500 border-b-amber-500 border-l-emerald-500 relative flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-xs text-slate-400">总应收</div>
                            <div className="font-bold text-slate-800">4.2 亿</div>
                        </div>
                    </div>
                    <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2 text-sm text-slate-600"><div className="w-3 h-3 bg-emerald-500 rounded"></div> 0-30 天 (正常)</span>
                            <span className="font-bold text-slate-800">65% (2.73亿)</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2 text-sm text-slate-600"><div className="w-3 h-3 bg-blue-500 rounded"></div> 31-60 天 (关注)</span>
                            <span className="font-bold text-slate-800">25% (1.05亿)</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2 text-sm text-slate-600"><div className="w-3 h-3 bg-amber-500 rounded"></div> 60-90 天 (预警)</span>
                            <span className="font-bold text-slate-800">8% (0.33亿)</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2 text-sm text-slate-600"><div className="w-3 h-3 bg-red-500 rounded"></div> 90+ 天 (坏账风险)</span>
                            <span className="font-bold text-red-600">2% (0.09亿)</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4">逾期 Top 3 客户</h3>
                <div className="space-y-4">
                    {[
                        { name: 'Customer A', amt: '1200w', days: '7 天', risk: '低' },
                        { name: 'Customer B', amt: '850w', days: '15 天', risk: '中' },
                        { name: 'Customer C', amt: '320w', days: '32 天', risk: '高' },
                    ].map((c, i) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <div>
                                <div className="font-bold text-slate-700 text-sm">{c.name}</div>
                                <div className="text-xs text-slate-500">逾期 {c.days}</div>
                            </div>
                            <div className="text-right">
                                <div className="font-mono font-bold text-slate-800">¥ {c.amt}</div>
                                <div className={`text-[10px] font-bold ${
                                    c.risk === '高' ? 'text-red-500' : c.risk === '中' ? 'text-amber-500' : 'text-blue-500'
                                }`}>风险: {c.risk}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="w-full mt-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                    发起催款流程
                </button>
            </div>
        </div>
    </div>
);

const ProductionDetail = ({ onBack, onShowGraph, onShowAi }: { onBack: () => void, onShowGraph: () => void, onShowAi: () => void }) => (
    <div className="animate-in slide-in-from-right duration-300">
        <DetailViewHeader title="生产质量与良率看板 (Production Quality)" onBack={onBack} />
        
        <ExecutiveSummary 
            text="Base 1 (LFP) 产线良率稳定在 98% 以上。Base 3 (新产线) 本周爬坡顺利，但 Top 2 模组焊接工序出现间歇性虚焊问题，已安排工艺工程师驻场解决。"
            type="NEUTRAL"
            onAdvice={onShowAi}
        />

        <div className="grid grid-cols-4 gap-6 mb-6">
            {['Base 1 (Main)', 'Base 2 (Exp)', 'Base 3 (New)', 'Pack Assembly'].map((name, i) => (
                <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-center group hover:border-blue-300 transition-all">
                    <div className="text-xs text-slate-500 uppercase font-bold mb-2">{name}</div>
                    <div className="relative inline-block">
                        <svg className="w-24 h-24 transform -rotate-90">
                            <circle cx="48" cy="48" r="40" stroke="#e2e8f0" strokeWidth="8" fill="transparent" />
                            <circle cx="48" cy="48" r="40" stroke={i === 2 ? '#ef4444' : i === 0 ? '#10b981' : '#3b82f6'} strokeWidth="8" fill="transparent" strokeDasharray={251.2} strokeDashoffset={251.2 * (1 - [0.982, 0.965, 0.941, 0.978][i])} className="transition-all duration-1000"/>
                        </svg>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-slate-800">
                            {[98.2, 96.5, 94.1, 97.8][i]}%
                        </div>
                    </div>
                    <div className="mt-2 text-xs text-slate-400">Target: 97.5%</div>
                </div>
            ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4">不良原因帕累托分析 (Pareto Chart)</h3>
                <div className="space-y-3">
                    {[
                        { reason: '电芯电压异常 (Voltage Diff)', count: 142, pct: '42%' },
                        { reason: '外观划痕 (Scratch)', count: 85, pct: '25%' },
                        { reason: '焊点强度不足 (Weak Weld)', count: 45, pct: '13%' },
                        { reason: '绝缘测试失败 (Insulation)', count: 32, pct: '9%' },
                    ].map((item, i) => (
                        <div key={i}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-slate-700">{i+1}. {item.reason}</span>
                                <span className="text-slate-500">{item.count} ppm</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                                <div className="bg-blue-500 h-full rounded-full" style={{width: item.pct}}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="col-span-1 bg-indigo-50 p-6 rounded-xl border border-indigo-100 flex flex-col">
                <h3 className="font-bold text-indigo-800 mb-2 flex items-center gap-2"><Network size={16}/> 战略关联</h3>
                <div className="text-sm text-indigo-700 leading-relaxed mb-4 flex-1">
                    Base 3 的良率直接影响 A6 (技术量产假设) 和 G2 (产能目标)。建议排查 A6 相关技术假设。
                </div>
                <button 
                    onClick={onShowGraph}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm mt-auto"
                >
                    查看归因图谱 (A6)
                </button>
            </div>
        </div>
    </div>
);

const MaterialPriceDetail = ({ onBack, onShowGraph, onShowAi }: { onBack: () => void, onShowGraph: () => void, onShowAi: () => void }) => (
    <div className="animate-in slide-in-from-right duration-300">
        <DetailViewHeader title="原材料价格趋势与策略 (Material Strategy)" onBack={onBack} />
        
        <ExecutiveSummary 
            text="碳酸锂现货价格持续下行 (-2.4% WoW)。鉴于目前库存水位处于高位 (45天)，建议暂停现货采购，维持长协最低提货量，等待价格进一步触底（预计支撑位 15.5万/吨）。"
            type="POSITIVE"
            onAdvice={onShowAi}
        />

        <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800">价格走势 (RMB/吨) - 30 Days</h3>
                    <div className="flex gap-2">
                        <button className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">Spot</button>
                        <button className="text-xs bg-white border border-slate-200 px-2 py-1 rounded text-slate-400">Contract</button>
                    </div>
                </div>
                <div className="h-64 w-full relative">
                    {/* Mock Line Chart */}
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                        <path d="M0,50 C100,60 200,40 300,80 S500,120 700,140" fill="none" stroke="#f43f5e" strokeWidth="3" />
                        <defs>
                            <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style={{stopColor:'rgb(244, 63, 94)', stopOpacity:0.2}} />
                                <stop offset="100%" style={{stopColor:'rgb(244, 63, 94)', stopOpacity:0}} />
                            </linearGradient>
                        </defs>
                        <path d="M0,50 C100,60 200,40 300,80 S500,120 700,140 V200 H0 Z" fill="url(#grad1)" stroke="none" />
                        
                        {/* Grid Lines */}
                        <line x1="0" y1="0" x2="100%" y2="0" stroke="#e2e8f0" strokeDasharray="4"/>
                        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#e2e8f0" strokeDasharray="4"/>
                        <line x1="0" y1="100%" x2="100%" y2="100%" stroke="#e2e8f0" strokeDasharray="4"/>
                    </svg>
                    <div className="absolute top-10 left-1/2 bg-white border border-rose-200 p-2 rounded shadow-lg">
                        <div className="text-xs text-slate-500">Current</div>
                        <div className="text-lg font-bold text-rose-600">¥165,000</div>
                    </div>
                </div>
            </div>

            <div className="col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4">库存价值分析</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                            <span className="text-sm text-slate-600">当前持仓量</span>
                            <span className="font-mono font-bold text-slate-800">450 吨</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                            <span className="text-sm text-slate-600">加权平均成本</span>
                            <span className="font-mono font-bold text-slate-800">¥172,000</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-sm text-slate-600">浮动盈亏</span>
                            <span className="font-mono font-bold text-red-500">- ¥3,150,000</span>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2"><Target size={16}/> 采购建议</h3>
                    <div className="text-sm text-blue-700 leading-relaxed mb-4">
                        模型建议维持观望策略。若价格跌破 16万，可分批建仓锁量。
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors shadow-sm">
                            调整计划
                        </button>
                        <button 
                            onClick={onShowGraph}
                            className="w-full bg-white text-blue-600 border border-blue-200 py-2 rounded-lg text-xs font-medium hover:bg-blue-50 transition-colors shadow-sm flex items-center justify-center gap-1"
                        >
                            <Network size={12}/> 查看归因
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// --- Main Portal Component ---

export const Portal: React.FC<PortalProps> = ({ onNavigate }) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [activeDetailId, setActiveDetailId] = useState<WidgetType | null>(null); 
  const [widgets, setWidgets] = useState<WidgetConfig[]>(DEFAULT_WIDGETS);
  
  // New States for Popups
  const [impactModalType, setImpactModalType] = useState<string | null>(null);
  const [aiAdviceType, setAiAdviceType] = useState<string | null>(null);

  const toggleWidget = (id: WidgetType) => {
      setWidgets(widgets.map(w => w.id === id ? { ...w, enabled: !w.enabled } : w));
  };

  const activeWidgets = widgets.filter(w => w.enabled);

  // --- Render Functions for Specific Widgets ---
  const renderWidgetContent = (widget: WidgetConfig) => {
      switch (widget.id) {
          case 'CUSTOMER_FORECAST':
              return (
                  <div className="h-32 flex items-end justify-between gap-2 px-2 pb-2">
                      {[65, 78, 82, 95, 110, 105].map((h, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                              <div className="text-[10px] opacity-0 group-hover:opacity-100 text-slate-500 font-bold">{h}k</div>
                              <div className="w-full bg-purple-100 rounded-t-sm hover:bg-purple-200 transition-colors relative group-hover:shadow-md" style={{height: `${h*0.6}%`}}>
                                  <div className="absolute top-0 left-0 w-full h-1 bg-purple-400 rounded-t-sm"></div>
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">{['T', 'B', 'N', 'X', 'L', 'G'][i]}</div>
                          </div>
                      ))}
                  </div>
              );
          case 'REALTIME_ORDERS':
              return (
                  <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-50">
                          <span className="font-bold text-slate-700">Tesla Shanghai</span>
                          <span className="font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">¥ 2,450w</span>
                      </div>
                      <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-50">
                          <span className="font-bold text-slate-700">BYD Auto</span>
                          <span className="font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">¥ 1,800w</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-700">GAC Aion</span>
                          <span className="font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">¥ 950w</span>
                      </div>
                  </div>
              );
          case 'PAYMENT_COLLECTION':
              return (
                  <div className="flex flex-col justify-center h-full gap-4">
                      <div>
                          <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-500">本月目标: 4.5亿</span>
                              <span className="text-emerald-600 font-bold">68%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full w-[68%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                          <div className="bg-slate-50 p-2 rounded border border-slate-100">
                              <div className="text-[10px] text-slate-400">已回款</div>
                              <div className="text-sm font-bold text-slate-700">3.06 亿</div>
                          </div>
                          <div className="bg-slate-50 p-2 rounded border border-slate-100">
                              <div className="text-[10px] text-slate-400">逾期</div>
                              <div className="text-sm font-bold text-red-500">1,200 万</div>
                          </div>
                      </div>
                  </div>
              );
          case 'PRODUCTION_YIELD':
              return (
                  <div className="grid grid-cols-3 gap-2 text-center h-full items-center">
                      <div className="p-2 bg-orange-50 rounded-lg border border-orange-100">
                          <div className="text-[10px] text-orange-400 uppercase font-bold mb-1">Base 1</div>
                          <div className="text-lg font-bold text-orange-600">98.2%</div>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                          <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Base 2</div>
                          <div className="text-lg font-bold text-slate-600">96.5%</div>
                      </div>
                      <div className="p-2 bg-red-50 rounded-lg border border-red-100">
                          <div className="text-[10px] text-red-400 uppercase font-bold mb-1">Base 3</div>
                          <div className="text-lg font-bold text-red-600">94.1%</div>
                      </div>
                  </div>
              );
          case 'LITHIUM_PRICE':
              return (
                  <div className="flex flex-col h-full justify-center">
                      <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-slate-500">电池级碳酸锂</span>
                          <span className="text-xs font-bold text-rose-500 bg-rose-50 px-1 rounded">-2.4%</span>
                      </div>
                      <div className="text-2xl font-bold text-slate-800 tracking-tight">¥ 165,000 <span className="text-xs font-normal text-slate-400">/吨</span></div>
                      <div className="h-10 w-full mt-2 relative overflow-hidden opacity-50">
                          <svg className="w-full h-full" preserveAspectRatio="none">
                              <path d="M0,40 L10,35 L30,38 L50,20 L70,25 L100,10 L140,30 L200,35" stroke="#f43f5e" strokeWidth="2" fill="none" />
                          </svg>
                      </div>
                  </div>
              );
          default:
              return null;
      }
  };

  const renderDetailView = () => {
      switch(activeDetailId) {
          case 'CUSTOMER_FORECAST': return <CustomerForecastDetail onBack={() => setActiveDetailId(null)} onShowGraph={() => setImpactModalType('CUSTOMER_FORECAST')} onShowAi={() => setAiAdviceType('CUSTOMER_FORECAST')} />;
          case 'REALTIME_ORDERS': return <OrdersDetail onBack={() => setActiveDetailId(null)} />;
          case 'PAYMENT_COLLECTION': return <PaymentDetail onBack={() => setActiveDetailId(null)} />;
          case 'PRODUCTION_YIELD': return <ProductionDetail onBack={() => setActiveDetailId(null)} onShowGraph={() => setImpactModalType('PRODUCTION_YIELD')} onShowAi={() => setAiAdviceType('PRODUCTION_YIELD')} />;
          case 'LITHIUM_PRICE': return <MaterialPriceDetail onBack={() => setActiveDetailId(null)} onShowGraph={() => setImpactModalType('LITHIUM_PRICE')} onShowAi={() => setAiAdviceType('LITHIUM_PRICE')} />;
          default: return null;
      }
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50 relative">
      {/* Configuration Modal */}
      {isConfigOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white w-[600px] rounded-xl shadow-2xl overflow-hidden border border-slate-200">
                  <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                          <Settings size={18} className="text-slate-500"/>
                          配置您的专属看板
                      </h3>
                      <button onClick={() => setIsConfigOpen(false)} className="hover:bg-slate-200 p-1 rounded text-slate-500"><X size={18}/></button>
                  </div>
                  <div className="p-6 max-h-[400px] overflow-y-auto space-y-3">
                      <p className="text-sm text-slate-500 mb-4">勾选您希望在首页“运营概览”区域关注的关键指标卡片。</p>
                      {widgets.map(w => (
                          <div 
                            key={w.id} 
                            className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                                w.enabled ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                            }`}
                            onClick={() => toggleWidget(w.id)}
                          >
                              <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                                  w.enabled ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'
                              }`}>
                                  {w.enabled && <div className="w-2 h-2 bg-white rounded-full"></div>}
                              </div>
                              <div className={`p-2 rounded-lg bg-white border border-slate-100 ${w.color}`}>
                                  <w.icon size={20}/>
                              </div>
                              <div>
                                  <div className="font-bold text-slate-800 text-sm">{w.title}</div>
                                  <div className="text-xs text-slate-500">{w.description}</div>
                              </div>
                          </div>
                      ))}
                  </div>
                  <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end">
                      <button 
                        onClick={() => setIsConfigOpen(false)}
                        className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 shadow-md transition-colors"
                      >
                          完成配置
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Popups */}
      {impactModalType && <StrategicImpactModal type={impactModalType} onClose={() => setImpactModalType(null)} />}
      {aiAdviceType && <AiAdviceModal type={aiAdviceType} onClose={() => setAiAdviceType(null)} />}

      {/* Top Hero Section (Only show if not in detail view) */}
      {!activeDetailId && (
        <div className="bg-white border-b border-slate-200 px-8 py-10">
            <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-start mb-8">
                <div className="animate-in slide-in-from-left duration-500">
                <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">我今天能帮助您做什么，刘总？</h1>
                <p className="text-slate-500 flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    系统运行正常 • 上次登录: 今天 08:30 AM
                </p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setIsConfigOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm group"
                    >
                        <Settings size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors"/> 
                        配置看板
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-all shadow-md">
                        切换工作空间 <ChevronDown size={14} />
                    </button>
                </div>
            </div>

            <div className="relative shadow-lg shadow-blue-900/5 rounded-2xl overflow-hidden group border border-slate-200">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                type="text"
                className="block w-full pl-14 pr-4 py-5 bg-white text-slate-900 placeholder-slate-400 focus:outline-none text-lg transition-all"
                placeholder="搜索数据、业务实体、应用、或输入 '2024 Q1 销售预测'..."
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                    <span className="text-[10px] border border-slate-200 rounded px-2 py-1 bg-slate-50 text-slate-400 hidden group-focus-within:block animate-in fade-in">Cmd + K</span>
                </div>
            </div>
            </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-8 py-8">
          {activeDetailId ? (
              // --- DETAIL VIEW ---
              renderDetailView()
          ) : (
              // --- DASHBOARD VIEW ---
              <>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Activity size={16} /> 运营概览 (Operational Dashboard)
                    </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-10">
                    {activeWidgets.map(widget => (
                        <div 
                            key={widget.id} 
                            onClick={() => setActiveDetailId(widget.id)}
                            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all hover:border-slate-300 group cursor-pointer flex flex-col h-48 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-slate-50 to-transparent rounded-bl-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="flex items-center gap-3 mb-3 relative z-10">
                                <div className={`p-2 rounded-lg bg-slate-50 border border-slate-100 ${widget.color}`}>
                                    <widget.icon size={18}/>
                                </div>
                                <div className="font-bold text-slate-800 text-sm truncate">{widget.title}</div>
                            </div>
                            <div className="flex-1 bg-slate-50 rounded-lg border border-slate-100 relative overflow-hidden group-hover:bg-white transition-colors">
                                {renderWidgetContent(widget)}
                            </div>
                        </div>
                    ))}
                    
                    {/* Add Button */}
                    <button 
                        onClick={() => setIsConfigOpen(true)}
                        className="rounded-xl border-2 border-dashed border-slate-200 p-5 flex flex-col items-center justify-center text-slate-400 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-500 transition-all cursor-pointer h-48"
                    >
                        <Plus size={32} className="mb-2 opacity-50"/>
                        <span className="text-xs font-medium">添加卡片</span>
                    </button>
                </div>

                {/* Quick Access Grid (Existing) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-2">
                        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">最近访问</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div 
                                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 cursor-pointer transition-all group"
                                onClick={() => onNavigate(ViewState.OBJECT_CENTER)}
                                >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-100">
                                        <Box size={20} />
                                    </div>
                                    <div>
                                        <div className="font-medium text-slate-900">客户订单 (Order)</div>
                                        <div className="text-xs text-slate-500">数据业务实体</div>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-400">最后编辑于 10 分钟前</div>
                            </div>

                            <div 
                                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 cursor-pointer transition-all group"
                                onClick={() => onNavigate(ViewState.APP_BUILDER)}
                                >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg group-hover:bg-orange-100">
                                        <AppWindow size={20} />
                                    </div>
                                    <div>
                                        <div className="font-medium text-slate-900">销售大盘 V2</div>
                                        <div className="text-xs text-slate-500">应用</div>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-400">最后编辑于 2 小时前</div>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1">
                        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">系统公告</h2>
                        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm h-[150px] overflow-hidden relative">
                            <div className="flex items-start gap-3">
                                <AlertTriangle size={18} className="text-amber-500 mt-0.5 flex-shrink-0"/>
                                <div>
                                    <div className="text-sm font-bold text-slate-800 mb-1">Q4 算力扩容维护通知</div>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        本周日凌晨 02:00 - 06:00 将进行 Spark 集群扩容，届时离线计算任务可能会延迟。请提前做好准备。
                                    </p>
                                    <div className="mt-3 text-[10px] text-slate-400">IT 运维部 • 2023-11-15</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
              </>
          )}
      </div>
    </div>
  );
};