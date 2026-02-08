
import React, { useState } from 'react';
import { 
    Filter, 
    BarChart3, 
    Table, 
    MoreHorizontal, 
    Plus, 
    ArrowRight, 
    X, 
    PieChart, 
    Save, 
    Download, 
    Layers,
    ArrowDown,
    Database,
    AlertTriangle,
    TrendingUp,
    Users,
    Package,
    Truck,
    Clock,
    CheckCircle2,
    Activity,
    GitCommit,
    PlayCircle,
    Search,
    BrainCircuit,
    ChevronRight,
    Target,
    ArrowLeft,
    Calendar,
    FileText,
    Share2,
    Settings,
    User,
    History,
    Wrench,
    ShieldAlert,
    Microscope,
    ListTodo,
    Zap,
    Sliders,
    CalendarClock,
    ArrowRightLeft,
    CheckSquare,
    Timer,
    AlertOctagon,
    Factory,
    MessageSquare,
    PhoneCall,
    ThumbsUp,
    ThumbsDown,
    BarChart,
    MessageCircle,
    Bot
} from 'lucide-react';

// --- Types ---
interface AnalysisBoard {
    id: string;
    type: 'DATASET' | 'FILTER' | 'CHART' | 'PIVOT';
    title: string;
    config: any;
    resultCount: string;
}

interface FulfillmentMetric {
    code: string;
    name: string;
    enName: string;
    definition: string;
    industryAvg: string;
    riskLine: string;
    suggestion: string[];
    currentValue: string;
    status: 'GOOD' | 'WARNING' | 'CRITICAL';
    relatedObjects: string;
}

interface RootCauseHistory {
    id: string;
    date: string;
    incident: string;
    duration: string;
    impact: string;
    resolution: string;
    preventiveAction: string;
    status: 'CLOSED' | 'MONITORING';
}

interface L4MetricDetail {
    code: string;
    name: string;
    description: string;
    owner: string;
    updateFreq: string;
    trendData: { date: string; value: number; target: number }[];
    rootCauses: { id: string; cause: string; impact: string; probability: number; type: 'PROCESS' | 'SYSTEM' | 'EXTERNAL' | 'QUALITY' }[];
    failedRecords: { id: string; customer: string; date: string; reason: string; value: string; status: string }[];
}

// --- New Types for Customer Satisfaction ---
interface TeamMember {
    id: string;
    name: string;
    role: string;
    initials: string;
    status: 'ONLINE' | 'OFFLINE' | 'BUSY';
}

interface CustomerHealth {
    id: string;
    name: string;
    type: 'PV' | 'ESS'; // Passenger Vehicle or Energy Storage
    tier: 'Strategic' | 'Key' | 'Standard';
    nps: number;
    healthScore: number; // 0-100
    status: 'HEALTHY' | 'AT_RISK' | 'CRITICAL';
    openTickets: number;
    lastInteraction: string;
    revenue: string;
    team: TeamMember[]; // New: Account Team
}

interface SatisfactionEvent {
    id: string;
    date: string;
    category: 'DELIVERY' | 'QUALITY' | 'MEETING' | 'FORECAST';
    sourceSystem: 'ERP' | 'CRM' | 'MEETING_LOG' | 'APS';
    title: string;
    description: string;
    sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    impactScore: number; // -5 to +5
}

// --- Mock Data: Lithium Battery Context ---
const fulfillmentData: Record<string, FulfillmentMetric[]> = {
    'PERFECT_ORDER': [
        { 
            code: 'L1', name: '准时交付率', enName: 'On-Time Delivery', 
            definition: '衡量对主机厂 (OEM) 承诺的 JIT 交付能力，影响客户产线停线风险。', 
            industryAvg: '95% - 98%', riskLine: '< 90%', 
            suggestion: ['实施电池包 ATP (可承诺量) 系统，联动电芯库存。', '优化 Pack 产线排程，预留 48h 缓冲。'],
            currentValue: '92%', status: 'WARNING', relatedObjects: 'Pack Orders (241)'
        },
        { 
            code: 'L2', name: '足额及时率 (OTIF)', enName: 'On Time In Full', 
            definition: '(核心KPI) 针对大客户 (Tesla/BYD) 的整车配套交付满足率。', 
            industryAvg: '90% - 95%', riskLine: '< 85%', 
            suggestion: ['提升电芯到 Pack 的齐套率预测。', '严禁未经 OEM 同意的分批交付。', '建立基地间库存调拨机制。'],
            currentValue: '84%', status: 'CRITICAL', relatedObjects: 'Shipments (89)'
        },
        { 
            code: 'L3', name: '货品完好率 (到货质量)', enName: 'Damage-Free Ratio', 
            definition: '衡量交付到主机厂线边的产品质量 (无漏液、电压压差正常、外观无损)。', 
            industryAvg: '> 99.9%', riskLine: '< 99.5%', 
            suggestion: ['加强出厂 OCV (开路电压) 终检。', '优化运输专用料架设计，减少振动损伤。', '实施运输全链路冲击记录。'],
            currentValue: '99.8%', status: 'WARNING', relatedObjects: 'Quality Reports (12)'
        },
        { 
            code: 'L4', name: '单据准确率', enName: 'Doc Accuracy (MSDS/UN38.3)', 
            definition: '衡量危包证、MSDS、出厂检测报告等合规文件的准确性。', 
            industryAvg: '100%', riskLine: '< 99.9%', 
            suggestion: ['引入自动生成危包标签系统。', '实施发货前系统强制校验 UN38.3 证书有效期。'],
            currentValue: '99.9%', status: 'GOOD', relatedObjects: 'Compliance Docs (4)'
        }
    ],
    'FULFILLMENT_CYCLE': [
        { 
            code: 'T0', name: '订单确认周期', enName: 'Order Ack Cycle Time', 
            definition: '从接收 EDI 订单到系统确认承诺交期的平均时长。', 
            industryAvg: '< 24h', riskLine: '> 48h', 
            suggestion: ['自动化 EDI 订单解析与库存匹配。'],
            currentValue: '18h', status: 'GOOD', relatedObjects: 'Orders'
        },
        { 
            code: 'T1', name: '生产提前期', enName: 'Manufacturing Lead Time', 
            definition: '从排产计划下达到产品完工入库的时长。', 
            industryAvg: '7-10 Days', riskLine: '> 14 Days', 
            suggestion: ['优化静置 (Aging) 工序周转。'],
            currentValue: '12 Days', status: 'WARNING', relatedObjects: 'Production Jobs'
        }
    ],
    'DELIVERY_RISK': [
        { 
            code: 'R1', name: '缺货风险指数', enName: 'Stockout Risk Index', 
            definition: '基于当前库存与未来30天订单预测计算的缺货概率。', 
            industryAvg: '< 5%', riskLine: '> 20%', 
            suggestion: ['增加长周期物料安全库存。'],
            currentValue: '12%', status: 'WARNING', relatedObjects: 'Inventory'
        },
        { 
            code: 'R2', name: '物流延误率', enName: 'Logistics Delay Rate', 
            definition: '实际到货时间晚于承诺时间的订单比例。', 
            industryAvg: '< 2%', riskLine: '> 5%', 
            suggestion: ['更换华南区物流承运商。'],
            currentValue: '4.5%', status: 'WARNING', relatedObjects: 'Shipments'
        }
    ]
};

// --- Mock Customer Data ---
const DEFAULT_TEAM: TeamMember[] = [
    { id: 'u1', name: 'Emily Chen', role: '客户经理 (Sales Rep)', initials: 'EC', status: 'ONLINE' },
    { id: 'u2', name: 'Michael Wang', role: '销售总监 (Sales Dir)', initials: 'MW', status: 'BUSY' },
    { id: 'u3', name: 'Sarah Li', role: '服务经理 (Service Mgr)', initials: 'SL', status: 'ONLINE' },
    { id: 'u4', name: 'David Zhang', role: '运营管理 (Ops)', initials: 'DZ', status: 'OFFLINE' },
];

const CUSTOMER_LIST: CustomerHealth[] = [
    { id: 'C001', name: 'Tesla Shanghai', type: 'PV', tier: 'Strategic', nps: 72, healthScore: 88, status: 'HEALTHY', openTickets: 2, lastInteraction: 'Today', revenue: '¥ 4.2B', team: DEFAULT_TEAM },
    { id: 'C002', name: 'BYD Auto', type: 'PV', tier: 'Strategic', nps: 65, healthScore: 75, status: 'AT_RISK', openTickets: 5, lastInteraction: 'Yesterday', revenue: '¥ 3.8B', team: DEFAULT_TEAM },
    { id: 'C003', name: 'Fluence Energy', type: 'ESS', tier: 'Key', nps: 45, healthScore: 58, status: 'CRITICAL', openTickets: 8, lastInteraction: '2 days ago', revenue: '¥ 1.5B', team: DEFAULT_TEAM },
    { id: 'C004', name: 'Xpeng Motors', type: 'PV', tier: 'Key', nps: 80, healthScore: 92, status: 'HEALTHY', openTickets: 1, lastInteraction: '3 days ago', revenue: '¥ 1.2B', team: DEFAULT_TEAM },
    { id: 'C005', name: 'Sungrow (阳光电源)', type: 'ESS', tier: 'Strategic', nps: 68, healthScore: 82, status: 'HEALTHY', openTickets: 3, lastInteraction: '1 week ago', revenue: '¥ 2.1B', team: DEFAULT_TEAM },
    { id: 'C006', name: 'Nio Inc', type: 'PV', tier: 'Key', nps: 55, healthScore: 65, status: 'AT_RISK', openTickets: 4, lastInteraction: 'Today', revenue: '¥ 1.8B', team: DEFAULT_TEAM },
];

const CUSTOMER_EVENTS: Record<string, SatisfactionEvent[]> = {
    'C001': [
        { id: 'E1', date: '2023-11-15', category: 'DELIVERY', sourceSystem: 'ERP', title: 'Q4 订单按期交付达成', description: 'Model Y 电池包批次 100% OTIF 交付，客户发邮件表扬。', sentiment: 'POSITIVE', impactScore: 3 },
        { id: 'E2', date: '2023-11-12', category: 'MEETING', sourceSystem: 'MEETING_LOG', title: '月度质量复盘会议 (QBR)', description: '客户提出希望优化 Pack 密封胶涂胶工艺，减少溢胶风险。', sentiment: 'NEUTRAL', impactScore: 0 },
        { id: 'E3', date: '2023-11-05', category: 'FORECAST', sourceSystem: 'APS', title: '预测准确率波动', description: '客户临时增加 12 月份排产计划 15%，造成我方物料紧张。', sentiment: 'NEGATIVE', impactScore: -2 },
    ],
    'C003': [
        { id: 'E4', date: '2023-11-14', category: 'QUALITY', sourceSystem: 'CRM', title: '重大客诉：储能柜温控异常', description: '现场反馈 3 台储能集装箱 BMS 报高温警报，疑似液冷管路堵塞。', sentiment: 'NEGATIVE', impactScore: -5 },
        { id: 'E5', date: '2023-11-10', category: 'DELIVERY', sourceSystem: 'ERP', title: '海运发货延期', description: '因危包证办理滞后，导致发往澳洲的项目延期船期 1 周。', sentiment: 'NEGATIVE', impactScore: -3 },
        { id: 'E6', date: '2023-11-01', category: 'MEETING', sourceSystem: 'MEETING_LOG', title: '高层沟通会', description: 'CEO 介入沟通，承诺派驻专项小组解决质量问题。', sentiment: 'POSITIVE', impactScore: 2 },
    ]
};

// --- Mock L4 Data ---
const L4_METRIC_MOCK: L4MetricDetail = {
    code: 'L2',
    name: '足额及时率 (OTIF)',
    description: '针对大客户 (Tesla/BYD) 的整车配套交付满足率。',
    owner: '供应链 / 张总',
    updateFreq: 'Daily',
    trendData: [
        { date: '11-01', value: 88, target: 90 },
        { date: '11-02', value: 85, target: 90 },
        { date: '11-03', value: 82, target: 90 },
        { date: '11-04', value: 84, target: 90 },
        { date: '11-05', value: 89, target: 90 },
        { date: '11-06', value: 91, target: 90 },
    ],
    rootCauses: [
        { id: 'RC1', cause: '上游正极材料供应延迟', impact: 'High', probability: 0.8, type: 'EXTERNAL' },
        { id: 'RC2', cause: 'Pack 产线设备故障', impact: 'Medium', probability: 0.4, type: 'QUALITY' },
    ],
    failedRecords: [
        { id: 'ORD-001', customer: 'Tesla', date: '2023-11-03', reason: '缺料', value: '500 Sets', status: 'Pending' },
        { id: 'ORD-002', customer: 'BYD', date: '2023-11-03', reason: '设备停机', value: '200 Sets', status: 'Resolved' },
    ]
};

// --- Helper Components ---

const MetricCard = ({ metric, onClick }: { metric: FulfillmentMetric, onClick: () => void }) => (
    <div 
        onClick={onClick}
        className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition-all group relative overflow-hidden cursor-pointer"
    >
        <div className={`absolute top-0 left-0 w-1 h-full ${
            metric.status === 'GOOD' ? 'bg-emerald-500' : 
            metric.status === 'WARNING' ? 'bg-amber-500' : 'bg-red-500'
        }`}></div>
        
        <div className="flex justify-between items-start mb-3">
            <div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{metric.code}</span>
                    <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{metric.name}</h3>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-medium">{metric.enName}</div>
            </div>
            <div className={`text-xl font-bold ${
                metric.status === 'GOOD' ? 'text-emerald-600' : 
                metric.status === 'WARNING' ? 'text-amber-600' : 'text-red-600'
            }`}>
                {metric.currentValue}
            </div>
        </div>

        <p className="text-xs text-slate-600 mb-4 h-10 line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100">
            {metric.definition}
        </p>

        <div className="border-t border-slate-100 pt-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
                <BrainCircuit size={12} className="text-blue-600"/> 智能建议 (Actions)
            </div>
            <ul className="space-y-1">
                {metric.suggestion.slice(0, 2).map((s, i) => (
                    <li key={i} className="text-[10px] text-slate-600 flex items-start gap-1.5 leading-snug">
                        <span className="mt-0.5 w-1 h-1 rounded-full bg-slate-400 flex-shrink-0"></span>
                        {s}
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

// --- New: Chat Component ---
const SatisfactionChatModal = ({ customer, members, onClose }: { customer: CustomerHealth, members?: TeamMember[], onClose: () => void }) => {
    const [messages, setMessages] = useState<{sender: string, text: string, type: 'user'|'agent'|'system', avatar?: string}[]>([
        { sender: 'System', text: `已创建 "${customer.name}" 满意度专项沟通群。AI 助手已就位。`, type: 'system' },
        { sender: 'AI Agent', text: `大家好，我是客户健康度 AI 助理。检测到 ${customer.name} 近期发起 3 起关于“温控异常”的工单，NPS 下滑至 45。建议服务经理 @Sarah Li 优先跟进。`, type: 'agent', avatar: 'AI' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input) return;
        setMessages([...messages, { sender: 'Me', text: input, type: 'user', avatar: 'Me' }]);
        setInput('');
        setTimeout(() => {
            setMessages(prev => [...prev, { 
                sender: 'AI Agent', 
                text: '收到。正在调取相关工单(T-2023-991, T-2023-993)的技术日志分析... 初步判断为批次性传感器故障。', 
                type: 'agent', 
                avatar: 'AI' 
            }]);
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-[600px] h-[500px] flex flex-col overflow-hidden border border-slate-200">
                <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                            <Users size={16} className="text-indigo-600"/>
                            团队协作: {customer.name}
                        </h3>
                        <div className="text-[10px] text-slate-500 flex gap-2 mt-0.5">
                            {members?.map(m => <span key={m.id}>{m.name}</span>)}
                            <span>+ AI Agent</span>
                        </div>
                    </div>
                    <button onClick={onClose}><X size={18} className="text-slate-400 hover:text-slate-600"/></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex gap-3 ${m.type === 'user' ? 'flex-row-reverse' : ''}`}>
                            {m.type !== 'system' && (
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${
                                    m.type === 'agent' ? 'bg-indigo-600' : 'bg-slate-400'
                                }`}>
                                    {m.avatar}
                                </div>
                            )}
                            {m.type === 'system' ? (
                                <div className="w-full text-center text-[10px] text-slate-400 my-2">{m.text}</div>
                            ) : (
                                <div className={`max-w-[80%] p-3 rounded-xl text-sm shadow-sm ${
                                    m.type === 'user' ? 'bg-white border border-slate-200 text-slate-800 rounded-tr-none' : 
                                    m.type === 'agent' ? 'bg-indigo-50 border border-indigo-100 text-indigo-900 rounded-tl-none' :
                                    'bg-white border border-slate-200 text-slate-800'
                                }`}>
                                    <div className="text-[10px] font-bold opacity-50 mb-1">{m.sender}</div>
                                    {m.text}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="p-3 border-t border-slate-200 bg-white flex gap-2">
                    <input 
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        placeholder="输入消息，@团队成员 或 @AI..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button onClick={handleSend} className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                        <ArrowRight size={18}/>
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- New: Customer Detail Drill Down ---
const CustomerSatisfactionDetail = ({ customer, onBack }: { customer: CustomerHealth, onBack: () => void }) => {
    const events = CUSTOMER_EVENTS[customer.id] || [];
    const [showChat, setShowChat] = useState(false);
    const [chatTarget, setChatTarget] = useState<TeamMember[]>([]);

    const startChat = (members: TeamMember[]) => {
        setChatTarget(members);
        setShowChat(true);
    };

    return (
        <div className="max-w-6xl mx-auto pb-10 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button 
                    onClick={onBack} 
                    className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 shadow-sm transition-all"
                >
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-slate-900">{customer.name}</h2>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold border ${
                            customer.type === 'PV' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-green-50 text-green-700 border-green-200'
                        }`}>{customer.type === 'PV' ? '乘用车 (PV)' : '储能 (ESS)'}</span>
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">{customer.tier}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                        <span className="flex items-center gap-1"><User size={12}/> Account Manager: {customer.team[0].name}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span className="flex items-center gap-1"><Database size={12}/> Revenue YTD: {customer.revenue}</span>
                    </p>
                </div>
                <div className="ml-auto flex items-center gap-4">
                    <div className="text-right">
                        <div className="text-xs text-slate-400 uppercase font-bold">Health Score</div>
                        <div className={`text-2xl font-bold ${
                            customer.healthScore > 80 ? 'text-emerald-600' : customer.healthScore > 60 ? 'text-amber-600' : 'text-red-600'
                        }`}>{customer.healthScore}</div>
                    </div>
                    <div className="text-right pl-4 border-l border-slate-200">
                        <div className="text-xs text-slate-400 uppercase font-bold">NPS</div>
                        <div className="text-2xl font-bold text-blue-600">{customer.nps}</div>
                    </div>
                </div>
            </div>

            {/* Team Section (New) */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <Users size={16} className="text-indigo-600"/> 专属服务团队 (Account Team)
                    </h3>
                    <button 
                        onClick={() => startChat(customer.team)}
                        className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <MessageCircle size={14}/> 发起团队会议 (Group Chat + AI)
                    </button>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    {customer.team.map((member, i) => (
                        <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50 hover:bg-white hover:border-blue-200 hover:shadow-sm transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold border border-white shadow-sm">
                                    {member.initials}
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-700">{member.name}</div>
                                    <div className="text-[10px] text-slate-500">{member.role}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                    member.status === 'ONLINE' ? 'bg-emerald-500' : member.status === 'BUSY' ? 'bg-amber-500' : 'bg-slate-300'
                                }`} title={member.status}></div>
                                <button 
                                    onClick={() => startChat([member])}
                                    className="p-1.5 hover:bg-indigo-50 rounded text-slate-400 hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <MessageSquare size={14}/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Left: Trend & Metrics */}
                <div className="col-span-4 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                        <h3 className="font-bold text-slate-800 text-sm mb-4">满意度趋势 (6 Months)</h3>
                        <div className="h-40 flex items-end gap-2 px-2">
                            {[65, 68, 70, 72, 69, customer.healthScore].map((val, i) => (
                                <div key={i} className="flex-1 flex flex-col justify-end group">
                                    <div 
                                        className="w-full bg-blue-100 rounded-t hover:bg-blue-200 transition-colors relative" 
                                        style={{ height: `${val}%` }}
                                    >
                                        {i === 5 && <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>}
                                    </div>
                                    <div className="text-[10px] text-slate-400 text-center mt-2">M-{5-i}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                        <h3 className="font-bold text-slate-800 text-sm mb-4">关键指标概览</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-600">未结工单 (Open Tickets)</span>
                                <span className={`text-sm font-bold ${customer.openTickets > 3 ? 'text-red-600' : 'text-slate-800'}`}>{customer.openTickets}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-600">OTIF (本月)</span>
                                <span className="text-sm font-bold text-slate-800">94.2%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-600">预测准确率 (Forecast)</span>
                                <span className="text-sm font-bold text-slate-800">85%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Event Timeline */}
                <div className="col-span-8">
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                <Activity size={16} className="text-blue-600"/> 
                                满意度影响事件流 (Satisfaction Impact Events)
                            </h3>
                            <button className="text-xs bg-white border border-slate-200 px-2 py-1 rounded text-slate-600 hover:bg-slate-50">
                                导出日志
                            </button>
                        </div>
                        <div className="p-6 relative">
                            <div className="absolute left-8 top-6 bottom-6 w-0.5 bg-slate-100"></div>
                            <div className="space-y-6">
                                {events.map((event, i) => (
                                    <div key={i} className="relative pl-10">
                                        {/* Icon Node */}
                                        <div className={`absolute left-0 top-0 w-8 h-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center z-10 ${
                                            event.category === 'DELIVERY' ? 'bg-blue-100 text-blue-600' :
                                            event.category === 'QUALITY' ? 'bg-red-100 text-red-600' :
                                            event.category === 'MEETING' ? 'bg-purple-100 text-purple-600' :
                                            'bg-orange-100 text-orange-600'
                                        }`}>
                                            {event.category === 'DELIVERY' ? <Truck size={14}/> :
                                             event.category === 'QUALITY' ? <AlertTriangle size={14}/> :
                                             event.category === 'MEETING' ? <MessageSquare size={14}/> :
                                             <BarChart size={14}/>}
                                        </div>

                                        {/* Content Card */}
                                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 hover:bg-white hover:shadow-md transition-all">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                                                            event.sourceSystem === 'ERP' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                            event.sourceSystem === 'CRM' ? 'bg-red-50 text-red-700 border-red-100' :
                                                            event.sourceSystem === 'MEETING_LOG' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                            'bg-orange-50 text-orange-700 border-orange-100'
                                                        }`}>
                                                            {event.sourceSystem}
                                                        </span>
                                                        <span className="text-xs text-slate-400">{event.date}</span>
                                                    </div>
                                                    <h4 className="font-bold text-sm text-slate-800 mt-1">{event.title}</h4>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {event.sentiment === 'POSITIVE' ? <ThumbsUp size={14} className="text-emerald-500"/> :
                                                     event.sentiment === 'NEGATIVE' ? <ThumbsDown size={14} className="text-red-500"/> : null}
                                                    <span className={`text-xs font-bold ${
                                                        event.sentiment === 'POSITIVE' ? 'text-emerald-600' : 
                                                        event.sentiment === 'NEGATIVE' ? 'text-red-600' : 'text-slate-500'
                                                    }`}>
                                                        {event.impactScore > 0 ? `+${event.impactScore}` : event.impactScore} Score
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                {event.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {events.length === 0 && (
                                    <div className="text-center text-slate-400 text-sm py-8">暂无关键事件记录</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showChat && (
                <SatisfactionChatModal 
                    customer={customer} 
                    members={chatTarget} 
                    onClose={() => setShowChat(false)} 
                />
            )}
        </div>
    );
};

const MetricL4Detail = ({ code, onBack }: { code: string, onBack: () => void }) => {
    // In a real app, fetch data based on code. Using mock here.
    const data = L4_METRIC_MOCK; 

    return (
        <div className="max-w-6xl mx-auto pb-10 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button 
                    onClick={onBack} 
                    className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 shadow-sm transition-all"
                >
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <span className="text-sm bg-slate-100 px-2 py-1 rounded text-slate-500">{data.code}</span>
                        {data.name}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                        Owner: {data.owner} • Updated: {data.updateFreq}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Trend Chart */}
                <div className="col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4 text-sm">近 7 天趋势 (7-Day Trend)</h3>
                    <div className="h-48 flex items-end justify-between px-4 gap-4">
                        {data.trendData.map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <div className="relative w-full flex items-end justify-center h-full">
                                    <div 
                                        className={`w-full max-w-[40px] rounded-t transition-all ${d.value < d.target ? 'bg-red-400' : 'bg-emerald-400'}`} 
                                        style={{height: `${(d.value / 100) * 100}%`}}
                                    ></div>
                                    {/* Target Line marker (simplified) */}
                                    <div className="absolute w-full border-t border-dashed border-slate-400" style={{bottom: `${d.target}%`}}></div>
                                </div>
                                <span className="text-xs text-slate-500">{d.date}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Root Causes */}
                <div className="col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4 text-sm">主要根因 (Top Root Causes)</h3>
                    <div className="space-y-3">
                        {data.rootCauses.map((rc, i) => (
                            <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-bold text-slate-700">{rc.cause}</span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${rc.impact === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{rc.impact}</span>
                                </div>
                                <div className="text-[10px] text-slate-500 flex gap-2">
                                    <span>Type: {rc.type}</span>
                                    <span>Prob: {rc.probability * 100}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Failed Records */}
                <div className="col-span-3 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 font-bold text-slate-700 text-sm">
                        异常记录 (Failed Records)
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-medium">
                            <tr>
                                <th className="px-6 py-3">ID</th>
                                <th className="px-6 py-3">Customer</th>
                                <th className="px-6 py-3">Reason</th>
                                <th className="px-6 py-3">Value</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.failedRecords.map((rec, i) => (
                                <tr key={i} className="hover:bg-slate-50">
                                    <td className="px-6 py-3 font-mono text-slate-600">{rec.id}</td>
                                    <td className="px-6 py-3">{rec.customer}</td>
                                    <td className="px-6 py-3 text-red-600">{rec.reason}</td>
                                    <td className="px-6 py-3">{rec.value}</td>
                                    <td className="px-6 py-3">
                                        <span className={`text-xs px-2 py-1 rounded ${
                                            rec.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                            {rec.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// --- L4: Contour-style Analysis Path ---
export const Analytics = () => {
    const [selectedAnalysisId, setSelectedAnalysisId] = useState<string>('customer_satisfaction'); // Default
    const [activeL4Metric, setActiveL4Metric] = useState<string | null>(null);
    const [simResult, setSimResult] = useState<any>(null);
    const [isSimulating, setIsSimulating] = useState(false);
    
    // New State for Customer Detail
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

    const menuItems = [
        { id: 'customer_satisfaction', label: '高价值客户满意度分析', icon: Users, isCritical: true }, // Updated Label
        { id: 'inventory_turnover', label: '库存周转率监控', icon: Package },
        
        { section: '核心场景 (Core Scenarios)' },
        { id: 's1_monitoring', label: 'S1 全链路交付监控', icon: Activity },
        { id: 's2_shortage', label: 'S2 缺货风险预警', icon: AlertTriangle },
        { id: 's3_rootcause', label: 'S3 异常根因分析', icon: Search },
        { id: 's4_bottleneck', label: 'S4 瓶颈工序识别', icon: Timer },
        { id: 'urgent_sim', label: 'S5 急单插单模拟', icon: Zap },

        { section: '订单履行 (Fulfillment)' },
        { id: 'fulfillment_perfect', label: '完美订单履行 (L1-L4)', icon: CheckCircle2 },
        { id: 'fulfillment_cycle', label: '订单履行周期 (T0-T3)', icon: Clock },
        { id: 'fulfillment_risk', label: '订单交付风险 (Delivery Risk)', icon: AlertTriangle },
    ];

    const handleSimulate = () => {
        setIsSimulating(true);
        setTimeout(() => {
            setSimResult({
                impactLevel: 'HIGH',
                capacityChange: { before: 92, after: 105 },
                backlogChange: { before: 2, after: 5 }, // Weeks
                delayedOrders: [
                    { id: 'ORD-2023-881', customer: 'Tesla Shanghai', product: 'Model 3 Pack', delay: '+2 Days' },
                    { id: 'ORD-2023-892', customer: 'Xpeng Motors', product: 'P7 Pack', delay: '+3 Days' },
                    { id: 'ORD-2023-905', customer: 'GAC Aion', product: 'S Plus Pack', delay: '+1 Day' }
                ],
                recommendation: '建议开启 Base 2 产线周末加班 (Overtime) 以消化增量，否则将导致核心客户延期。'
            });
            setIsSimulating(false);
        }, 1500);
    };

    // --- Render Functions ---

    // 2. UPDATED: Satisfaction Analysis View
    const renderSatisfactionView = () => (
        <div className="max-w-6xl mx-auto pb-10 animate-in slide-in-from-right-4 duration-300">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Users className="text-indigo-600"/> 高价值客户满意度分析 (High Value Satisfaction)
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        覆盖乘用车 (PV) 及储能 (ESS) 核心客户 • 综合分析交付、质量、服务等多维数据
                    </p>
                </div>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm flex items-center gap-2">
                    <FileText size={16}/> 生成月度报告
                </button>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
                {/* KPIs adjusted to top since graph is removed */}
                <div className="col-span-1 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-2">平均满意度 (Avg Health Score)</div>
                    <div className="text-3xl font-bold text-slate-800">78.5 <span className="text-sm font-normal text-slate-500">/ 100</span></div>
                    <div className="text-xs text-emerald-500 mt-1 font-medium flex items-center gap-1"><TrendingUp size={12}/> +2.4% MoM</div>
                </div>
                <div className="col-span-1 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-2">待处理客诉 (Open Tickets)</div>
                    <div className="text-3xl font-bold text-slate-800">23</div>
                    <div className="text-xs text-red-500 mt-1">其中 3 个严重级 (P0)</div>
                </div>
                <div className="col-span-1 bg-indigo-50 p-5 rounded-xl border border-indigo-100">
                    <div className="text-xs font-bold text-indigo-600 uppercase mb-2">AI 风险提示</div>
                    <p className="text-sm text-indigo-800 mb-3 leading-relaxed">
                        检测到 <strong>Fluence Energy</strong> (ESS) 近期因“温控故障”产生多起工单，满意度骤降。建议优先关注。
                    </p>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-700 text-sm">客户健康度清单 (Customer Health Monitor)</h3>
                    <div className="flex gap-2">
                        <button className="p-1.5 hover:bg-slate-200 rounded text-slate-500"><Filter size={14}/></button>
                        <button className="p-1.5 hover:bg-slate-200 rounded text-slate-500"><Download size={14}/></button>
                    </div>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                            <th className="px-6 py-3">客户名称</th>
                            <th className="px-6 py-3">类型</th>
                            <th className="px-6 py-3">健康分 (Score)</th>
                            <th className="px-6 py-3">状态</th>
                            <th className="px-6 py-3">未结工单</th>
                            <th className="px-6 py-3">最后互动</th>
                            <th className="px-6 py-3 text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {CUSTOMER_LIST.map((row, i) => (
                            <tr 
                                key={i} 
                                className="hover:bg-slate-50 group cursor-pointer transition-colors"
                                onClick={() => setSelectedCustomerId(row.id)}
                            >
                                <td className="px-6 py-4 font-bold text-slate-700 flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm ${
                                        row.type === 'PV' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                                    }`}>
                                        {row.type === 'PV' ? 'PV' : 'ESS'}
                                    </div>
                                    <div>
                                        <div>{row.name}</div>
                                        <div className="text-[10px] text-slate-400 font-normal">{row.tier}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600">{row.type === 'PV' ? '乘用车' : '储能系统'}</td>
                                <td className="px-6 py-4 font-mono font-bold text-slate-700">{row.healthScore}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold border ${
                                        row.status === 'HEALTHY' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                        row.status === 'AT_RISK' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                        'bg-red-50 text-red-700 border-red-100'
                                    }`}>{row.status}</span>
                                </td>
                                <td className="px-6 py-4">
                                    {row.openTickets > 0 ? (
                                        <span className="text-red-600 font-bold flex items-center gap-1">
                                            <AlertTriangle size={12}/> {row.openTickets}
                                        </span>
                                    ) : (
                                        <span className="text-slate-400">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-slate-500 text-xs">{row.lastInteraction}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-blue-600 hover:underline text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end gap-1">
                                        <History size={12}/> 历史归因
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // 3. Inventory Turnover View
    const renderInventoryView = () => (
        <div className="max-w-6xl mx-auto pb-10 animate-in slide-in-from-right-4 duration-300">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Package className="text-orange-500"/> 库存周转率监控 (Inventory Turnover)
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">数据源: ERP (WMS Module) • 目标周转天数 &lt; 45 天</p>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs text-slate-400 font-bold uppercase mb-1">当前周转天数 (DSI)</div>
                    <div className="text-2xl font-bold text-slate-800">52.4 <span className="text-sm font-normal text-slate-500">Days</span></div>
                    <div className="w-full bg-slate-100 h-1.5 mt-3 rounded-full overflow-hidden">
                        <div className="bg-orange-500 w-[80%] h-full"></div>
                    </div>
                    <div className="text-[10px] text-orange-600 mt-1 font-medium">超出目标 16%</div>
                </div>
                <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs text-slate-400 font-bold uppercase mb-1">呆滞库存金额</div>
                    <div className="text-2xl font-bold text-slate-800">¥ 8.5M</div>
                    <div className="text-xs text-slate-500 mt-2">库龄 &gt; 90天 (正极材料)</div>
                </div>
                <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs text-slate-400 font-bold uppercase mb-1">缺货率 (Stockout)</div>
                    <div className="text-2xl font-bold text-slate-800">1.2%</div>
                    <div className="text-xs text-emerald-500 mt-2">优于行业标准 (2%)</div>
                </div>
                <div className="p-5 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100 flex flex-col justify-center">
                    <div className="text-sm font-bold text-orange-800 mb-1">清理建议</div>
                    <div className="text-xs text-orange-700 leading-tight">
                        SKU-LFP-280 (旧款电芯) 库存积压严重，建议发起 7 折促销给储能集成商。
                    </div>
                </div>
            </div>

            {/* Heatmap Placeholder */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
                <h3 className="font-bold text-slate-800 mb-4">库龄分布热力图 (Aging Heatmap)</h3>
                <div className="h-48 flex gap-1">
                    {Array.from({length: 20}).map((_, i) => {
                        const h = Math.random() * 80 + 20;
                        const color = h > 80 ? 'bg-red-500' : h > 50 ? 'bg-orange-400' : 'bg-blue-300';
                        return (
                            <div key={i} className="flex-1 flex flex-col justify-end group relative cursor-pointer">
                                <div className={`w-full rounded-t ${color} hover:opacity-80 transition-opacity`} style={{height: `${h}%`}}></div>
                                <div className="text-[10px] text-slate-400 text-center mt-2 font-mono">WH-{i+1}</div>
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                    Warehouse {i+1}: {Math.floor(h * 10)}k Units
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );

    // --- S1: Full-Chain Monitoring ---
    const renderS1View = () => (
        <div className="max-w-6xl mx-auto pb-10 animate-in slide-in-from-right-4 duration-300">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Activity className="text-blue-600"/> 全链条交付监控 (Full-Chain Monitoring)
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">场景 S01: 实时掌握订单在各环节的状态，自动预警超时环节。</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                <div className="flex items-center justify-between relative mb-12">
                    {/* Progress Line */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-10"></div>
                    
                    {[
                        { id: 'T0', name: '订单处理', count: 15, delay: 2, icon: FileText, color: 'bg-blue-100 text-blue-600' },
                        { id: 'T1', name: '物料准备', count: 42, delay: 5, icon: Package, color: 'bg-purple-100 text-purple-600' },
                        { id: 'T2', name: '生产制造', count: 128, delay: 12, icon: Factory, color: 'bg-orange-100 text-orange-600' },
                        { id: 'T3', name: '物流发运', count: 56, delay: 3, icon: Truck, color: 'bg-emerald-100 text-emerald-600' }
                    ].map((stage, i) => (
                        <div key={stage.id} className="flex flex-col items-center bg-white p-2">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${stage.color} shadow-sm border-4 border-white`}>
                                <stage.icon size={24}/>
                            </div>
                            <div className="text-sm font-bold text-slate-800">{stage.name} ({stage.id})</div>
                            <div className="text-xs text-slate-500 mt-1">{stage.count} Active Orders</div>
                            {stage.delay > 0 && (
                                <div className="mt-2 px-2 py-1 bg-red-50 text-red-600 rounded text-[10px] font-bold border border-red-100 flex items-center gap-1">
                                    <AlertTriangle size={10}/> {stage.delay} Delayed
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <h3 className="font-bold text-slate-800 text-sm mb-4">异常订单列表 (Delayed Orders)</h3>
                <table className="w-full text-left text-sm border border-slate-200 rounded-lg overflow-hidden">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                            <th className="px-4 py-2">订单号</th>
                            <th className="px-4 py-2">客户</th>
                            <th className="px-4 py-2">当前环节</th>
                            <th className="px-4 py-2">滞留时长</th>
                            <th className="px-4 py-2">预计影响</th>
                            <th className="px-4 py-2 text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {[
                            { id: 'ORD-2023-881', cust: 'Tesla SH', stage: 'T2 生产', duration: '48h (超限)', impact: '高', status: 'red' },
                            { id: 'ORD-2023-892', cust: 'Xpeng', stage: 'T1 物料', duration: '24h', impact: '中', status: 'amber' },
                            { id: 'ORD-2023-905', cust: 'BYD', stage: 'T3 物流', duration: '12h', impact: '低', status: 'blue' },
                        ].map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50">
                                <td className="px-4 py-3 font-mono text-blue-600">{row.id}</td>
                                <td className="px-4 py-3 font-bold text-slate-700">{row.cust}</td>
                                <td className="px-4 py-3"><span className="bg-slate-100 px-2 py-1 rounded text-xs">{row.stage}</span></td>
                                <td className={`px-4 py-3 font-bold ${row.status === 'red' ? 'text-red-600' : 'text-slate-600'}`}>{row.duration}</td>
                                <td className="px-4 py-3 text-slate-500">{row.impact}</td>
                                <td className="px-4 py-3 text-right">
                                    <button className="text-blue-600 hover:underline text-xs">催办</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // --- S2: Shortage Warning ---
    const renderS2View = () => (
        <div className="max-w-6xl mx-auto pb-10 animate-in slide-in-from-right-4 duration-300">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <AlertOctagon className="text-red-600"/> 缺货风险预警 (Shortage Warning)
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">场景 S02: 基于库存水位 (R1) 和积压 (R3)，提前 3-7 天推送缺货预警。</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 bg-red-50 border-b border-red-100 flex items-center gap-3">
                        <AlertTriangle className="text-red-600"/>
                        <div>
                            <div className="text-lg font-bold text-red-700">3 项关键物料面临断供风险</div>
                            <div className="text-xs text-red-600">请立即启动调拨或紧急采购流程。</div>
                        </div>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">物料名称 / 代码</th>
                                <th className="px-6 py-4">当前库存</th>
                                <th className="px-6 py-4">日消耗量</th>
                                <th className="px-6 py-4">可支撑天数 (DOS)</th>
                                <th className="px-6 py-4">预计断供日期</th>
                                <th className="px-6 py-4 text-right">建议行动</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {[
                                { name: '正极材料 NCM811', code: 'MAT-8821', stock: '2.4 吨', usage: '0.8 吨/天', dos: '3.0 天', date: 'Nov 18', action: '紧急调拨 (WH-2)' },
                                { name: 'BMS 主控芯片 (TI)', code: 'IC-9920', stock: '1,200 片', usage: '300 片/天', dos: '4.0 天', date: 'Nov 19', action: '现货扫货' },
                                { name: '电解液 (Type-C)', code: 'MAT-3321', stock: '5.0 吨', usage: '1.0 吨/天', dos: '5.0 天', date: 'Nov 20', action: '催促供应商' },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-800">{row.name}</div>
                                        <div className="text-xs text-slate-500 font-mono">{row.code}</div>
                                    </td>
                                    <td className="px-6 py-4 font-mono">{row.stock}</td>
                                    <td className="px-6 py-4 font-mono">{row.usage}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded font-bold">{row.dos}</span>
                                    </td>
                                    <td className="px-6 py-4 text-red-600 font-medium">{row.date}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="px-3 py-1.5 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700 shadow-sm">
                                            {row.action}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    // --- S3: Root Cause Analysis (List View) ---
    const renderS3View = () => (
        <div className="max-w-6xl mx-auto pb-10 animate-in slide-in-from-right-4 duration-300">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Search className="text-purple-600"/> 异常根因分析 (Root Cause Analysis)
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">场景 S03: 定位 OTIF 低下的主要归因，点击下钻查看历史事件。</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h3 className="font-bold text-slate-800 mb-4">OTIF 异常归因帕累托图 (Pareto Chart)</h3>
                    <div className="space-y-4">
                        {[
                            { id: 'RC1', label: '上游物料短缺 (Supplier)', val: 65, color: 'bg-red-500' },
                            { id: 'RC2', label: '产线设备故障 (Production)', val: 25, color: 'bg-orange-500' },
                            { id: 'RC3', label: '物流运输延误 (Logistics)', val: 8, color: 'bg-blue-500' },
                            { id: 'RC4', label: '单据/合规错误 (Docs)', val: 2, color: 'bg-slate-400' },
                        ].map((item, i) => (
                            <div key={i} className="group cursor-pointer" onClick={() => setActiveL4Metric('L2')}> {/* Use L2 as entry point to details */}
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-slate-700 group-hover:text-purple-600 transition-colors">{item.label}</span>
                                    <span className="font-bold text-slate-800">{item.val}%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                    <div className={`${item.color} h-full rounded-full`} style={{width: `${item.val}%`}}></div>
                                </div>
                                <div className="mt-1 text-[10px] text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                    点击查看详情 <ArrowRight size={10}/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-span-1 bg-purple-50 rounded-xl border border-purple-100 p-6">
                    <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                        <BrainCircuit size={18}/> AI 洞察
                    </h3>
                    <p className="text-sm text-purple-800 leading-relaxed">
                        本周主要瓶颈集中在 <span className="font-bold">上游正极材料供应</span>。建议立即检查供应商 A 的交付记录，并启动备选供应商 B 的验厂流程。
                    </p>
                    <button 
                        onClick={() => setActiveL4Metric('L2')}
                        className="w-full mt-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        查看 L2 指标详情
                    </button>
                </div>
            </div>
        </div>
    );

    // --- S4: Bottleneck Identification ---
    const renderS4View = () => (
        <div className="max-w-6xl mx-auto pb-10 animate-in slide-in-from-right-4 duration-300">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Timer className="text-amber-600"/> 瓶颈工序识别 (Bottleneck ID)
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">场景 S04: 对比 T0-T3 历史趋势与标准工时，识别具体的瓶颈工序。</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                <div className="grid grid-cols-4 gap-4 h-64 items-end mb-6 border-b border-slate-200 pb-4">
                    {[
                        { stage: 'T0 订单', actual: 36, std: 24, unit: 'h' },
                        { stage: 'T1 物料', actual: 19, std: 14, unit: 'd' },
                        { stage: 'T2 生产', actual: 14, std: 10, unit: 'h', isBottleneck: true },
                        { stage: 'T3 物流', actual: 4.5, std: 3, unit: 'd' },
                    ].map((d, i) => {
                        const maxVal = Math.max(d.actual, d.std) * 1.2;
                        return (
                            <div key={i} className="flex flex-col items-center gap-2 h-full justify-end group">
                                <div className="flex items-end gap-2 h-full">
                                    <div className="w-8 bg-slate-300 rounded-t relative group-hover:opacity-80" style={{height: `${(d.std/maxVal)*100}%`}}>
                                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-slate-500">Std</span>
                                    </div>
                                    <div className={`w-8 rounded-t relative ${d.isBottleneck ? 'bg-red-500' : 'bg-blue-500'}`} style={{height: `${(d.actual/maxVal)*100}%`}}>
                                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-800">{d.actual}</span>
                                    </div>
                                </div>
                                <div className="text-xs font-bold text-slate-700">{d.stage}</div>
                                {d.isBottleneck && <span className="text-[10px] text-red-500 bg-red-50 px-1 rounded">Bottleneck</span>}
                            </div>
                        )
                    })}
                </div>
                
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex items-start gap-3">
                    <Wrench className="text-amber-600 mt-0.5 flex-shrink-0"/>
                    <div>
                        <div className="font-bold text-amber-800 text-sm mb-1">发现瓶颈: T2 生产制造 (Aging Process)</div>
                        <p className="text-xs text-amber-700 leading-relaxed">
                            高温静置 (High-temp Aging) 工序平均耗时 14h，超出标准 10h 约 40%。
                            <br/>原因推测：化成柜周转率不足，或静置房容量受限。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    // 4. Urgent Order Simulation View (Retained)
    const renderSimulationView = () => (
        <div className="max-w-6xl mx-auto pb-10 animate-in slide-in-from-right-4 duration-300">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Zap className="text-purple-600"/> 急单插单模拟 (Order Simulation)
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">场景 S05: 模拟插单对现有产能 (R3) 及交付延期 (R4) 的影响。</p>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Left: Input Panel */}
                <div className="col-span-4 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Sliders size={16}/> 插单参数配置
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">客户 (Customer)</label>
                                <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none bg-white">
                                    <option>Nio Inc (Strategic)</option>
                                    <option>Tesla SH</option>
                                    <option>BYD Auto</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">产品类型 (SKU)</label>
                                <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none bg-white">
                                    <option>LFP Pack 75kWh</option>
                                    <option>NCM Module 50Ah</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">插单数量 (Sets)</label>
                                <input type="number" defaultValue={500} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">期望交付日 (Due Date)</label>
                                <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2 bg-white">
                                    <CalendarClock size={14} className="text-slate-400"/>
                                    <input type="text" defaultValue="2023-11-20" className="w-full text-sm outline-none"/>
                                </div>
                            </div>
                            <button 
                                onClick={handleSimulate}
                                disabled={isSimulating}
                                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                            >
                                {isSimulating ? <ArrowRightLeft className="animate-spin" size={16}/> : <PlayCircle size={16}/>}
                                {isSimulating ? '模拟计算中...' : '开始模拟 (Run Simulation)'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Results Panel */}
                <div className="col-span-8">
                    {simResult ? (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            {/* Impact Summary Cards */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className={`p-4 rounded-xl border ${
                                    simResult.impactLevel === 'HIGH' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'
                                }`}>
                                    <div className="text-xs font-bold uppercase mb-1 text-slate-500">综合影响等级</div>
                                    <div className={`text-xl font-bold ${
                                        simResult.impactLevel === 'HIGH' ? 'text-red-600' : 'text-amber-600'
                                    }`}>{simResult.impactLevel} RISK</div>
                                </div>
                                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                                    <div className="text-xs font-bold uppercase mb-1 text-slate-500">产能负荷 (Capacity)</div>
                                    <div className="flex items-end gap-2">
                                        <span className="text-xl font-bold text-slate-800">{simResult.capacityChange.before}%</span>
                                        <ArrowRight size={16} className="text-slate-400 mb-1"/>
                                        <span className="text-xl font-bold text-red-600">{simResult.capacityChange.after}%</span>
                                    </div>
                                    <div className="text-[10px] text-red-500 mt-1">超负荷预警</div>
                                </div>
                                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                                    <div className="text-xs font-bold uppercase mb-1 text-slate-500">积压延期 (R3 Backlog)</div>
                                    <div className="flex items-end gap-2">
                                        <span className="text-xl font-bold text-slate-800">{simResult.backlogChange.before}周</span>
                                        <ArrowRight size={16} className="text-slate-400 mb-1"/>
                                        <span className="text-xl font-bold text-slate-800">{simResult.backlogChange.after}周</span>
                                    </div>
                                </div>
                            </div>

                            {/* Recommendation */}
                            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3">
                                <BrainCircuit size={20} className="text-indigo-600 mt-0.5 flex-shrink-0"/>
                                <div>
                                    <div className="font-bold text-indigo-900 text-sm mb-1">AI 决策建议 (Recommendation)</div>
                                    <p className="text-sm text-indigo-800 leading-relaxed">{simResult.recommendation}</p>
                                </div>
                            </div>

                            {/* Affected Orders List */}
                            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                <div className="px-6 py-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                                    <h4 className="font-bold text-slate-700 text-sm">受影响订单列表 (Affected Orders)</h4>
                                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-medium">{simResult.delayedOrders.length} Impacted</span>
                                </div>
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-slate-500 font-medium text-xs">
                                        <tr>
                                            <th className="px-6 py-2">订单号</th>
                                            <th className="px-6 py-2">客户</th>
                                            <th className="px-6 py-2">产品</th>
                                            <th className="px-6 py-2 text-right">预计延期 (R4)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {simResult.delayedOrders.map((order: any, i: number) => (
                                            <tr key={i} className="hover:bg-slate-50">
                                                <td className="px-6 py-3 font-mono text-slate-600">{order.id}</td>
                                                <td className="px-6 py-3 font-bold text-slate-800">{order.customer}</td>
                                                <td className="px-6 py-3 text-slate-600">{order.product}</td>
                                                <td className="px-6 py-3 text-right font-bold text-red-600">{order.delay}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                                <button className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors" onClick={() => setSimResult(null)}>重置</button>
                                <button className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                                    <CheckSquare size={16}/> 确认插单并调整计划
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 min-h-[400px]">
                            <Zap size={48} className="mb-4 opacity-20"/>
                            <p className="text-sm font-medium">请在左侧配置参数并点击 "开始模拟"</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    // 5. Fulfillment View Generator
    const renderFulfillmentView = (key: string, title: string, icon: any) => {
        const Icon = icon;
        // FIX: Ensure metrics is an array, default to empty array if key not found
        const metrics = fulfillmentData[key] || [];

        return (
            <div className="max-w-6xl mx-auto pb-10 animate-in slide-in-from-right-4 duration-300">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            <Icon className="text-blue-600"/> {title}
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">
                            基于完美订单履行模型的详细指标分解与改进建议。
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-700 text-sm font-medium hover:bg-slate-50">
                            <Layers size={14}/> 查看数据血缘
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    {/* FIX: Ensure map runs on array */}
                    {metrics.map((m, i) => (
                        <MetricCard 
                            key={i} 
                            metric={m} 
                            onClick={() => setActiveL4Metric(m.code)}
                        />
                    ))}
                    {metrics.length === 0 && (
                        <div className="col-span-2 text-center text-slate-400 py-10">暂无数据</div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-full bg-slate-100">
            {/* Left Sidebar: Saved Analyses */}
            <div className="w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-700 text-sm">我的分析 (Analyses)</h3>
                    <button className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Plus size={16}/></button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {menuItems.map((item, idx) => {
                        if (item.section) {
                            return <div key={idx} className="px-3 py-2 text-xs font-bold text-slate-400 uppercase mt-2">{item.section}</div>
                        }
                        const ItemIcon = item.icon!;
                        return (
                            <div 
                                key={item.id}
                                onClick={() => {
                                    setSelectedAnalysisId(item.id!);
                                    setActiveL4Metric(null); // Reset drill down when switching boards
                                    setSelectedCustomerId(null); // Reset customer drill down
                                    if(item.id !== 'urgent_sim') setSimResult(null);
                                }}
                                className={`px-3 py-2 rounded-lg text-sm font-medium cursor-pointer flex items-center gap-2 transition-colors ${
                                    selectedAnalysisId === item.id 
                                    ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                                }`}
                            >
                                <ItemIcon size={16} className={selectedAnalysisId === item.id ? 'text-blue-600' : 'text-slate-400'}/>
                                {item.label}
                                {item.isCritical && <span className="w-2 h-2 rounded-full bg-red-500 ml-auto"></span>}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-8 relative">
                {activeL4Metric ? (
                    <MetricL4Detail code={activeL4Metric} onBack={() => setActiveL4Metric(null)} />
                ) : selectedCustomerId ? (
                    <CustomerSatisfactionDetail 
                        customer={CUSTOMER_LIST.find(c => c.id === selectedCustomerId)!} 
                        onBack={() => setSelectedCustomerId(null)} 
                    />
                ) : (
                    <>
                        {selectedAnalysisId === 'customer_satisfaction' && renderSatisfactionView()}
                        {selectedAnalysisId === 'inventory_turnover' && renderInventoryView()}
                        
                        {/* Core Scenarios */}
                        {selectedAnalysisId === 's1_monitoring' && renderS1View()}
                        {selectedAnalysisId === 's2_shortage' && renderS2View()}
                        {selectedAnalysisId === 's3_rootcause' && renderS3View()}
                        {selectedAnalysisId === 's4_bottleneck' && renderS4View()}
                        {selectedAnalysisId === 'urgent_sim' && renderSimulationView()}

                        {/* Fulfillment Metrics */}
                        {selectedAnalysisId === 'fulfillment_perfect' && renderFulfillmentView('PERFECT_ORDER', '完美订单履行 (Perfect Order Fulfillment)', CheckCircle2)}
                        {selectedAnalysisId === 'fulfillment_cycle' && renderFulfillmentView('FULFILLMENT_CYCLE', '订单履行周期 (Fulfillment Cycle)', Clock)}
                        {selectedAnalysisId === 'fulfillment_risk' && renderFulfillmentView('DELIVERY_RISK', '订单交付风险 (Delivery Risk)', AlertTriangle)}
                    </>
                )}
            </div>
        </div>
    );
};
