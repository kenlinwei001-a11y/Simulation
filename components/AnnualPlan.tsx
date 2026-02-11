
import React, { useState, useEffect } from 'react';
import { 
    Target, 
    AlertTriangle, 
    CheckCircle2, 
    TrendingUp, 
    ChevronRight, 
    MessageCircle, 
    Bot, 
    X, 
    Send, 
    CheckSquare, 
    User, 
    DollarSign, 
    BrainCircuit, 
    ArrowLeft, 
    ArrowRight, 
    MessageSquare, 
    FileText, 
    ListTodo, 
    Check, 
    Handshake, 
    Clock, 
    Activity, 
    BarChart2, 
    Users, 
    Network, 
    ZoomIn, 
    ZoomOut, 
    Maximize, 
    TrendingDown,
    Zap,
    AlertOctagon,
    GitPullRequest,
    Workflow,
    GitMerge,
    Plus
} from 'lucide-react';

// --- Interfaces ---

interface ChatMessage {
    id: string;
    sender: string;
    role: 'ME' | 'OTHER' | 'AI';
    content: string;
    timestamp: string;
}

interface Collaborator {
    id: string;
    name: string;
    role: string;
    avatar: string;
    isAi?: boolean;
}

interface OperationalRecord {
    id: string;
    date: string;
    entity: string;
    value: string;
    status: 'NORMAL' | 'WARNING' | 'CRITICAL';
    remark?: string;
}

interface ImpactEvent {
    id: string;
    date: string;
    title: string;
    type: 'NEGATIVE' | 'POSITIVE';
    description: string;
    impactLevel: 'HIGH' | 'MEDIUM' | 'LOW';
    status: 'OPEN' | 'RESOLVED';
}

interface OptimizationAction {
    id: string;
    title: string;
    owner: string;
    dueDate: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'DONE';
}

interface OperationalMetric {
    name: string;
    value: string;
    target: string;
    trend: 'UP' | 'DOWN' | 'FLAT';
    trendValue: string;
    status: 'GREEN' | 'YELLOW' | 'RED';
    records: OperationalRecord[];
    impactEvents: ImpactEvent[];
    optimizationActions: OptimizationAction[];
    unit?: string;
}

interface WorkflowNode {
    id: string;
    type: 'PLAN_NODE';
    title: string;
    owner: string;
    department: string;
    status: 'GREEN' | 'YELLOW' | 'RED';
    x: number;
    y: number;
    data: {
        financial: { label: string; value: string; target: string; status: 'GREEN' | 'YELLOW' | 'RED' };
        assumption: { label: string; id: string };
        ksf: { label: string };
        action: { label: string; progress: number };
        operationalMetric?: OperationalMetric; // Link to daily ops data
    };
}

// --- Mock Data ---

const WORKFLOW_NODES: WorkflowNode[] = [
    // Level 1: CEO
    {
        id: 'PLAN-CEO-01',
        type: 'PLAN_NODE',
        title: '2024 集团战略：增效与规模化',
        owner: 'CEO / Alex',
        department: '集团总部',
        status: 'YELLOW',
        x: 600,
        y: 50,
        data: {
            financial: { label: '营收/毛利', value: '¥ 185亿 / 16%', target: '¥ 200亿 / 18%', status: 'YELLOW' },
            assumption: { label: 'A1: 全球需求 +25%', id: 'A1' },
            ksf: { label: '市场份额 > 8%' },
            action: { label: 'Q4 战略冲刺', progress: 75 },
            operationalMetric: {
                name: '集团整体毛利率 (Gross Margin)',
                value: '16.2%',
                target: '18.0%',
                trend: 'UP',
                trendValue: '+0.5%',
                status: 'YELLOW',
                records: [
                    { id: 'BU-01', date: '2023-11', entity: '乘用车事业部', value: '15.8%', status: 'WARNING', remark: '受碳酸锂库存跌价影响' },
                    { id: 'BU-02', date: '2023-11', entity: '储能事业部', value: '18.5%', status: 'NORMAL', remark: '海外高毛利订单交付' },
                    { id: 'BU-03', date: '2023-11', entity: '商用车事业部', value: '14.2%', status: 'CRITICAL', remark: '价格战激烈' }
                ],
                impactEvents: [],
                optimizationActions: []
            }
        }
    },
    // Level 2: R&D
    {
        id: 'PLAN-RD-01',
        type: 'PLAN_NODE',
        title: '产品领先：第五代降本',
        owner: 'CTO / Dr.Wang',
        department: '研发部',
        status: 'GREEN',
        x: 150,
        y: 300,
        data: {
            financial: { label: 'BOM 成本', value: '¥ 0.45/Wh', target: '¥ 0.48/Wh', status: 'GREEN' },
            assumption: { label: 'A6: 新技术良率', id: 'A6' },
            ksf: { label: 'Q2 量产 (SOP)' },
            action: { label: '材料认证', progress: 90 },
            operationalMetric: {
                name: '试产直通率 (Pilot Run FPY)',
                value: '88.5%',
                target: '90%',
                trend: 'UP',
                trendValue: '+2.1%',
                status: 'GREEN',
                records: [
                    { id: 'BATCH-A005', date: '2023-11-10', entity: 'Gen-5 Sample #5', value: '92.0%', status: 'NORMAL', remark: '达到量产标准' },
                    { id: 'BATCH-A004', date: '2023-11-02', entity: 'Gen-5 Sample #4', value: '85.0%', status: 'WARNING', remark: '极耳焊接问题' },
                    { id: 'BATCH-A003', date: '2023-10-25', entity: 'Gen-5 Sample #3', value: '81.5%', status: 'CRITICAL', remark: '隔膜起皱' }
                ],
                impactEvents: [
                    { id: 'EVT-RD-01', date: '2023-10-28', title: '极耳焊接设备故障', type: 'NEGATIVE', description: '设备参数漂移导致虚焊', impactLevel: 'HIGH', status: 'RESOLVED' }
                ],
                optimizationActions: [
                    { id: 'ACT-RD-01', title: '设备参数DOE验证', owner: 'Process Eng.', dueDate: '2023-11-15', status: 'DONE' }
                ]
            }
        }
    },
    // Level 2: Supply Chain
    {
        id: 'PLAN-SCM-01',
        type: 'PLAN_NODE',
        title: '供应链：韧性与成本',
        owner: 'VP SCM / Simon',
        department: '供应链',
        status: 'RED',
        x: 150,
        y: 600,
        data: {
            financial: { label: '材料节省', value: '¥ 1.2亿', target: '¥ 2.0亿', status: 'RED' },
            assumption: { label: 'A3: 锂价 < 15万', id: 'A3' },
            ksf: { label: '100% 份额分配' },
            action: { label: '2024 框架协议', progress: 40 },
            operationalMetric: {
                name: '订单满足率 (Order Fulfillment)',
                value: '94.2%',
                target: '98%',
                trend: 'DOWN',
                trendValue: '-1.5%',
                status: 'RED',
                records: [
                    { id: 'PO-2023-8821', date: '2023-11-14', entity: 'GAC Aion 订单', value: '100%', status: 'NORMAL', remark: '按期交付' },
                    { id: 'PO-2023-8825', date: '2023-11-13', entity: 'Xpeng P7 订单', value: '85%', status: 'WARNING', remark: '正极材料短缺导致分批' },
                    { id: 'PO-2023-8829', date: '2023-11-12', entity: 'Leapmotor 订单', value: '60%', status: 'CRITICAL', remark: 'BMS 芯片缺货严重延期' }
                ],
                impactEvents: [
                    { id: 'EVT-SCM-01', date: '2023-11-10', title: '供应商 Ronbay 产线检修', type: 'NEGATIVE', description: '正极材料供应减少 20%', impactLevel: 'HIGH', status: 'OPEN' }
                ],
                optimizationActions: [
                    { id: 'ACT-SCM-01', title: '启动二供 (Easpring) 紧急调货', owner: 'Sourcing Mgr', dueDate: '2023-11-12', status: 'DONE' },
                    { id: 'ACT-SCM-02', title: '调整下周排产计划', owner: 'Planning', dueDate: '2023-11-13', status: 'IN_PROGRESS' }
                ]
            }
        }
    },
    // Level 2: Manufacturing
    {
        id: 'PLAN-MFG-01',
        type: 'PLAN_NODE',
        title: '制造：产能爬坡',
        owner: 'COO / Bob',
        department: '制造部',
        status: 'YELLOW',
        x: 600,
        y: 450,
        data: {
            financial: { label: '制造成本', value: '¥ 0.09/Wh', target: '¥ 0.08/Wh', status: 'YELLOW' },
            assumption: { label: 'A9: OEE 稳定性', id: 'A9' },
            ksf: { label: '产能 50GWh' },
            action: { label: '基地 3 调试', progress: 60 },
            operationalMetric: {
                name: '日均产出 (Daily Output)',
                value: '480 Packs',
                target: '500 Packs',
                trend: 'FLAT',
                trendValue: '0',
                status: 'YELLOW',
                records: [
                    { id: 'SHIFT-D-15', date: '2023-11-15', entity: 'Base 1 Day Shift', value: '250', status: 'NORMAL', remark: '满负荷' },
                    { id: 'SHIFT-N-15', date: '2023-11-15', entity: 'Base 1 Night Shift', value: '230', status: 'WARNING', remark: '设备临时保养 1h' }
                ],
                impactEvents: [
                    { id: 'EVT-MFG-01', date: '2023-11-14', title: 'Base 1 涂布机停机', type: 'NEGATIVE', description: '断带故障导致停机 2h', impactLevel: 'MEDIUM', status: 'RESOLVED' }
                ],
                optimizationActions: [
                    { id: 'ACT-MFG-01', title: '周末加班追赶产量', owner: 'Plant Mgr', dueDate: '2023-11-18', status: 'PENDING' }
                ]
            }
        }
    },
    // Level 2: Sales
    {
        id: 'PLAN-SALES-01',
        type: 'PLAN_NODE',
        title: '销售：全球市场扩张',
        owner: 'CMO / Emily',
        department: '销售部',
        status: 'GREEN',
        x: 1050,
        y: 300,
        data: {
            financial: { label: '在手订单', value: '38 GWh', target: '40 GWh', status: 'GREEN' },
            assumption: { label: 'A2: 大客户 SOP', id: 'A2' },
            ksf: { label: '欧盟份额 > 5%' },
            action: { label: 'VW/Stellantis 定点', progress: 85 },
            operationalMetric: {
                name: '商机转化率 (Conversion Rate)',
                value: '28%',
                target: '25%',
                trend: 'UP',
                trendValue: '+3%',
                status: 'GREEN',
                records: [
                    { id: 'OPP-EU-001', date: '2023-11-10', entity: 'VW ID.2 Project', value: 'Won', status: 'NORMAL', remark: '定点函已发' },
                    { id: 'OPP-CN-055', date: '2023-11-05', entity: 'GAC New Model', value: 'Lost', status: 'WARNING', remark: '价格劣势丢单' }
                ],
                impactEvents: [],
                optimizationActions: []
            }
        }
    },
    // Level 2: Finance
    {
        id: 'PLAN-FIN-01',
        type: 'PLAN_NODE',
        title: '财务：资本效率',
        owner: 'CFO / David',
        department: '财务部',
        status: 'GREEN',
        x: 1050,
        y: 600,
        data: {
            financial: { label: '现金流', value: '+ ¥15亿', target: '> ¥10亿', status: 'GREEN' },
            assumption: { label: 'A4: 汇率稳定', id: 'A4' },
            ksf: { label: 'DSO < 60 天' },
            action: { label: 'IPO 前审计', progress: 50 },
            operationalMetric: {
                name: '应收账款周转天数 (DSO)',
                value: '62 Days',
                target: '60 Days',
                trend: 'DOWN',
                trendValue: '-3 Days',
                status: 'YELLOW',
                records: [
                    { id: 'INV-9981', date: '2023-11-01', entity: 'Client A (Strategic)', value: '45 Days', status: 'NORMAL', remark: '回款及时' },
                    { id: 'INV-9920', date: '2023-10-15', entity: 'Client B (New)', value: '92 Days', status: 'CRITICAL', remark: '严重逾期，已发催款函' }
                ],
                impactEvents: [],
                optimizationActions: []
            }
        }
    }
];

const WORKFLOW_EDGES = [
    { id: 'e1', source: 'PLAN-CEO-01', target: 'PLAN-SALES-01', label: '营收目标', type: 'solid' },
    { id: 'e2', source: 'PLAN-CEO-01', target: 'PLAN-MFG-01', label: '产能需求', type: 'solid' },
    { id: 'e3', source: 'PLAN-CEO-01', target: 'PLAN-RD-01', label: '产品路线', type: 'solid' },
    { id: 'e4', source: 'PLAN-SCM-01', target: 'PLAN-RD-01', label: '成本支撑', type: 'dashed' },
    { id: 'e5', source: 'PLAN-RD-01', target: 'PLAN-MFG-01', label: 'DFM', type: 'solid' },
    { id: 'e6', source: 'PLAN-SCM-01', target: 'PLAN-MFG-01', label: '材料供应', type: 'solid' },
    { id: 'e7', source: 'PLAN-MFG-01', target: 'PLAN-SALES-01', label: '交付', type: 'solid' },
    { id: 'e8', source: 'PLAN-SALES-01', target: 'PLAN-FIN-01', label: 'AR', type: 'dashed' },
    { id: 'e9', source: 'PLAN-SCM-01', target: 'PLAN-FIN-01', label: 'AP', type: 'dashed' }
];

const getDetailedPlan = (node: WorkflowNode) => ({
    overview: `针对 ${node.title} 的详细执行计划。该计划通过关注部门具体交付物，确保与 CEO 年度战略保持一致。`,
    subGoals: [
        { id: 'sg1', title: 'Q3 里程碑交付', owner: node.owner, deadline: '2023-11-30', metric: '100% 完成', progress: node.data.action.progress, actions: [{ id: 'a1', task: '评审会议', status: 'DONE', owner: 'Alice', deadline: '11-15' }] },
        { id: 'sg2', title: '2024 预算冻结', owner: node.owner, deadline: '2023-12-15', metric: '已批准', progress: 40, actions: [{ id: 'a2', task: '提交草案', status: 'IN_PROGRESS', owner: 'Bob', deadline: '12-05' }] }
    ],
    supportNeeds: [
        { department: '财务部', contact: 'David', content: 'Q1 预算审批', criticality: 'HIGH', status: 'PENDING' },
        { department: '人力资源', contact: 'Lisa', content: '关键招聘：技术负责人', criticality: 'MEDIUM', status: 'AGREED' }
    ]
});

// --- Components ---

const SmartCollaborationModal = ({ owner, topic, history, initialParticipants, onClose }: { 
    owner: string, 
    topic: string, 
    history?: ChatMessage[], 
    initialParticipants?: Collaborator[],
    onClose: () => void 
}) => {
    const [messages, setMessages] = useState<ChatMessage[]>(history || []);
    const [input, setInput] = useState('');
    const [activeTab, setActiveTab] = useState<'CHAT' | 'RECORDS' | 'TRACKING'>('CHAT');
    const [participants, setParticipants] = useState<Collaborator[]>(initialParticipants || [
        { id: 'owner', name: owner, role: 'Owner', avatar: owner.substring(0, 1).toUpperCase() },
        { id: 'me', name: '我', role: 'User', avatar: 'M' },
        { id: 'ai', name: 'AI 助手', role: 'Bot', avatar: 'AI', isAi: true }
    ]);
    const [isAiTracking, setIsAiTracking] = useState(false);

    const handleSend = () => {
        if (!input.trim()) return;
        const newMsg: ChatMessage = {
            id: Date.now().toString(),
            sender: '我',
            role: 'ME',
            content: input,
            timestamp: new Date().toLocaleString()
        };
        setMessages([...messages, newMsg]);
        setInput('');
        
        if (participants.some(p => p.isAi)) {
            setTimeout(() => {
                 let aiContent = `已收到关于 "${topic}" 的信息。`;
                 if (isAiTracking) {
                     aiContent += ` 已为您创建跟踪任务："${input}"，我会在下周一提醒您跟进。`;
                     setIsAiTracking(false);
                 } else {
                     aiContent += ` 正在检索相关的历史决策记录，稍后将同步给团队成员。`;
                 }

                 const aiMsg: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    sender: 'AI 助手',
                    role: 'AI',
                    content: aiContent,
                    timestamp: new Date().toLocaleString()
                };
                setMessages(prev => [...prev, aiMsg]);
            }, 800);
        }
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-[800px] h-[600px] flex flex-col overflow-hidden border border-slate-200">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                            <MessageCircle size={20} className="text-indigo-600"/> 智能协作空间
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                            <span className="font-medium text-slate-700">主题: {topic}</span>
                            <span>•</span>
                            <div className="flex -space-x-1">
                                {participants.map(p => (
                                    <div key={p.id} className={`w-5 h-5 rounded-full border border-white flex items-center justify-center text-[9px] font-bold text-white ${p.isAi ? 'bg-indigo-600' : 'bg-slate-400'}`} title={p.name}>
                                        {p.isAi ? <Bot size={10}/> : p.avatar}
                                    </div>
                                ))}
                            </div>
                            <span className="ml-1">{participants.length} 参与者</span>
                        </div>
                    </div>
                    <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
                </div>

                <div className="flex border-b border-slate-200 px-6 bg-white">
                    <button onClick={() => setActiveTab('CHAT')} className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'CHAT' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>对话</button>
                    <button onClick={() => setActiveTab('RECORDS')} className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'RECORDS' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>会议记录</button>
                    <button onClick={() => setActiveTab('TRACKING')} className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'TRACKING' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>任务追踪</button>
                </div>

                <div className="flex-1 overflow-y-auto p-0 bg-slate-50/50">
                    {activeTab === 'CHAT' && (
                        <div className="p-6 space-y-4">
                            {messages.length === 0 && (
                                <div className="text-center text-slate-400 text-sm py-10">
                                    暂无对话记录。开始讨论吧！
                                </div>
                            )}
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex gap-3 ${msg.role === 'ME' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${
                                        msg.role === 'ME' ? 'bg-slate-800' : msg.role === 'AI' ? 'bg-indigo-600' : 'bg-blue-500'
                                    }`}>
                                        {msg.role === 'ME' ? '我' : msg.role === 'AI' ? <Bot size={14}/> : msg.sender[0]}
                                    </div>
                                    <div className={`max-w-[80%] p-3 rounded-xl text-sm shadow-sm ${
                                        msg.role === 'ME' ? 'bg-white border border-slate-200 text-slate-800 rounded-tr-none' : 
                                        msg.role === 'AI' ? 'bg-indigo-50 border border-indigo-100 text-indigo-900 rounded-tl-none' :
                                        'bg-blue-50 border border-blue-100 text-blue-900 rounded-tl-none'
                                    }`}>
                                        <div className="text-[10px] font-bold opacity-50 mb-1 flex justify-between gap-4">
                                            <span>{msg.sender}</span>
                                            <span>{msg.timestamp}</span>
                                        </div>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {activeTab === 'RECORDS' && (
                        <div className="p-6 space-y-4">
                            {[
                                { date: '2023-10-15', title: 'Q4 预算调整会议', summary: '确认增加 15% 营销预算用于海外市场拓展。', type: '会议' },
                                { date: '2023-10-02', title: 'KPI 异常自动归档', summary: '系统检测到连续3天发货延迟，自动生成工单 #TKT-992。', type: '系统' },
                            ].map((rec, i) => (
                                <div key={i} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:border-indigo-300 transition-all cursor-pointer">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${rec.type === '系统' ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>{rec.type}</span>
                                            <span className="font-bold text-slate-800 text-sm">{rec.title}</span>
                                        </div>
                                        <span className="text-xs text-slate-400 font-mono">{rec.date}</span>
                                    </div>
                                    <p className="text-sm text-slate-600">{rec.summary}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    {activeTab === 'TRACKING' && (
                        <div className="p-6">
                            <div className="bg-white border border-slate-200 rounded-lg p-6 text-center">
                                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <CheckSquare size={24}/>
                                </div>
                                <h3 className="font-bold text-slate-800 mb-2">AI 任务追踪</h3>
                                <p className="text-sm text-slate-500 mb-4">在对话中指派 AI 负责跟踪事项，系统将自动在此生成待办清单和提醒。</p>
                                <div className="text-left space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded border border-slate-100">
                                        <div className="w-4 h-4 rounded border border-slate-300 bg-white"></div>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-slate-700">跟进供应商 A 的最新报价邮件</div>
                                            <div className="text-xs text-slate-400">Due: 明天 10:00 AM • 分派给 AI</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {activeTab === 'CHAT' && (
                    <div className="p-4 bg-white border-t border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                            <label className={`flex items-center gap-2 text-xs px-2 py-1 rounded cursor-pointer transition-colors ${isAiTracking ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-slate-500 hover:bg-slate-100'}`}>
                                <input type="checkbox" checked={isAiTracking} onChange={(e) => setIsAiTracking(e.target.checked)} className="rounded text-indigo-600 focus:ring-indigo-500"/>
                                <Bot size={14}/> 让 AI 负责落实跟踪
                            </label>
                        </div>
                        <div className="flex gap-2">
                            <input 
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                placeholder={`发送消息给 ${owner}, AI 及其他成员...`}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <button onClick={handleSend} className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                                <Send size={18}/>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const WorkflowNodeCard: React.FC<{ node: WorkflowNode, onMouseDown: (e: React.MouseEvent) => void, onClick: () => void }> = ({ node, onMouseDown, onClick }) => {
    return (
        <div 
            className="absolute w-[320px] bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden hover:shadow-lg transition-shadow cursor-pointer z-10 node-card"
            style={{ left: node.x, top: node.y }}
            onMouseDown={onMouseDown}
            onClick={(e) => { e.stopPropagation(); onClick(); }}
        >
            <div className={`px-4 py-2 border-b border-slate-100 flex justify-between items-center ${
                node.status === 'RED' ? 'bg-red-50' : node.status === 'YELLOW' ? 'bg-amber-50' : 'bg-emerald-50'
            }`}>
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                        node.status === 'RED' ? 'bg-red-500' : node.status === 'YELLOW' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}></span>
                    <span className="font-bold text-sm text-slate-800">{node.department}</span>
                </div>
                <span className="text-xs text-slate-500 flex items-center gap-1"><User size={10}/> {node.owner}</span>
            </div>
            
            <div className="p-3 space-y-2 text-xs">
                <div className="font-bold text-sm text-slate-800 mb-2">{node.title}</div>
                
                <div className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-100 group hover:border-blue-300 transition-colors">
                    <div className="flex items-center gap-2">
                        <DollarSign size={12} className="text-slate-400"/>
                        <span className="text-slate-700 font-medium truncate w-24" title={node.data.financial.label}>{node.data.financial.label}</span>
                    </div>
                    <span className={`font-mono font-bold ${
                        node.data.financial.status === 'RED' ? 'text-red-600' : node.data.financial.status === 'YELLOW' ? 'text-amber-600' : 'text-emerald-600'
                    }`}>{node.data.financial.value}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-600 hover:text-purple-600 transition-colors cursor-pointer" title="点击查看详情">
                    <BrainCircuit size={12} className="text-purple-500 flex-shrink-0"/>
                    <span className="truncate">{node.data.assumption.label}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer" title="点击查看详情">
                    <Target size={12} className="text-blue-500 flex-shrink-0"/>
                    <span className="truncate">{node.data.ksf.label}</span>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-slate-500 flex items-center gap-1 truncate"><CheckSquare size={12}/> {node.data.action.label}</span>
                        <span className="text-slate-400 font-mono">{node.data.action.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: `${node.data.action.progress}%` }}></div>
                    </div>
                </div>
            </div>
            {/* Connection Points */}
            <div className="absolute top-1/2 -left-1 w-2 h-2 bg-slate-300 rounded-full"></div>
            <div className="absolute top-1/2 -right-1 w-2 h-2 bg-slate-300 rounded-full"></div>
            <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-300 rounded-full"></div>
            <div className="absolute top-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-300 rounded-full"></div>
        </div>
    )
}

const TraceabilityGraph = ({ node, activeTab, onTabChange }: { node: WorkflowNode, activeTab: 'METRIC' | 'EVENTS', onTabChange: (tab: 'METRIC' | 'EVENTS') => void }) => {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Workflow size={120} />
            </div>
            
            <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <GitPullRequest size={18} className="text-indigo-600"/> 
                    溯源归因与 PDCA 闭环 (Traceability Loop)
                </h3>
                <div className="flex gap-2">
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-full"></span> 计划 (P)</span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded flex items-center gap-1"><span className="w-2 h-2 bg-indigo-500 rounded-full"></span> 执行 (D)</span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span> 检查 (C)</span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded flex items-center gap-1"><span className="w-2 h-2 bg-amber-500 rounded-full"></span> 优化 (A)</span>
                </div>
            </div>

            <div className="relative flex items-center justify-between px-10 py-4">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-slate-200 -z-10"></div>

                {/* Node 1: Strategy (P) */}
                <div className="flex flex-col items-center gap-3 bg-white p-2 z-10 cursor-default">
                    <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
                        <Target size={20}/>
                    </div>
                    <div className="text-center w-32">
                        <div className="text-xs font-bold text-slate-700">集团战略目标 (P)</div>
                        <div className="text-[10px] text-slate-500 mt-1 bg-blue-50 px-2 py-1 rounded border border-blue-100 line-clamp-1">
                            增效与规模化
                        </div>
                    </div>
                </div>

                {/* Node 2: Plan/Execution (D) */}
                <div className="flex flex-col items-center gap-3 bg-white p-2 z-10 cursor-default">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center text-indigo-600 shadow-sm">
                        <GitMerge size={20}/>
                    </div>
                    <div className="text-center w-32">
                        <div className="text-xs font-bold text-slate-700">部门执行计划 (D)</div>
                        <div className="text-[10px] text-slate-500 mt-1 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 line-clamp-1">
                            {node.title}
                        </div>
                    </div>
                </div>

                {/* Node 3: Metric (C) - Interactive */}
                <div 
                    className={`flex flex-col items-center gap-3 bg-white p-2 z-10 cursor-pointer transition-all transform hover:scale-105 ${activeTab === 'METRIC' ? 'scale-105' : ''}`}
                    onClick={() => onTabChange('METRIC')}
                >
                    <div className={`w-14 h-14 rounded-full border-4 flex items-center justify-center shadow-lg transition-colors ${
                        activeTab === 'METRIC' ? 'bg-emerald-600 border-emerald-100 text-white' : 'bg-emerald-50 border-emerald-200 text-emerald-600'
                    }`}>
                        <Activity size={24}/>
                    </div>
                    <div className="text-center w-36">
                        <div className={`text-sm font-bold ${activeTab === 'METRIC' ? 'text-emerald-700' : 'text-slate-700'}`}>关键指标监控 (C)</div>
                        <div className="text-[10px] text-slate-500 mt-1 font-mono">
                            {node.data.operationalMetric?.name}
                        </div>
                    </div>
                </div>

                {/* Node 4: Feedback/Events (A) - Interactive */}
                <div 
                    className={`flex flex-col items-center gap-3 bg-white p-2 z-10 cursor-pointer transition-all transform hover:scale-105 ${activeTab === 'EVENTS' ? 'scale-105' : ''}`}
                    onClick={() => onTabChange('EVENTS')}
                >
                    <div className={`w-14 h-14 rounded-full border-4 flex items-center justify-center shadow-lg transition-colors ${
                        activeTab === 'EVENTS' ? 'bg-amber-500 border-amber-100 text-white' : 'bg-amber-50 border-amber-200 text-amber-600'
                    }`}>
                        <AlertOctagon size={24}/>
                    </div>
                    <div className="text-center w-36">
                        <div className={`text-sm font-bold ${activeTab === 'EVENTS' ? 'text-amber-700' : 'text-slate-700'}`}>归因与优化 (A)</div>
                        <div className="text-[10px] text-slate-500 mt-1">
                            {node.data.operationalMetric?.impactEvents.length || 0} 个影响事件
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const PlanDetailPanelV2 = ({ node, onClose, onChat }: { node: WorkflowNode, onClose: () => void, onChat: (ctx: any) => void }) => {
    const plan = getDetailedPlan(node);
    const [activeGraphTab, setActiveGraphTab] = useState<'METRIC' | 'EVENTS'>('METRIC');

    return (
        <div className="absolute inset-0 bg-white z-40 flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-slate-50">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500"><ArrowLeft size={20}/></button>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 text-xs rounded font-bold ${
                                node.status === 'RED' ? 'bg-red-100 text-red-700' :
                                node.status === 'YELLOW' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                            }`}>{node.status}</span>
                            <h2 className="text-lg font-bold text-slate-800">{node.title}</h2>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-3">
                            <span className="font-bold text-slate-600">{node.department}</span>
                            <span className="flex items-center gap-1 bg-slate-200 px-1.5 py-0.5 rounded text-slate-600"><User size={12}/> {node.owner}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => onChat({ owner: node.owner, topic: `关于 ${node.title}` })}
                        className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2"
                    >
                        <MessageSquare size={16}/> 联系负责人
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Overview */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                            <FileText size={18} className="text-blue-600"/> 计划总览
                        </h3>
                        <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded border border-slate-100">{plan.overview}</p>
                    </div>

                    {/* NEW: Traceability Graph (Interactive PDCA) */}
                    {node.data.operationalMetric && (
                        <TraceabilityGraph 
                            node={node} 
                            activeTab={activeGraphTab} 
                            onTabChange={setActiveGraphTab} 
                        />
                    )}

                    {/* Operational Data Content */}
                    {node.data.operationalMetric && (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in duration-300">
                            {activeGraphTab === 'METRIC' ? (
                                <>
                                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <Activity size={18} className="text-emerald-600"/> 日常运营指标监控 (Daily Metrics)
                                    </h3>
                                    <div className="grid grid-cols-4 gap-6">
                                        {/* Left: Metric Card */}
                                        <div className="col-span-1 p-5 rounded-xl border flex flex-col justify-center bg-gradient-to-br from-white to-emerald-50/30 border-slate-200">
                                            <div className="text-xs text-slate-500 font-bold uppercase mb-2">{node.data.operationalMetric.name}</div>
                                            <div className="flex items-end gap-3 mb-1">
                                                <div className={`text-3xl font-bold ${
                                                    node.data.operationalMetric.status === 'RED' ? 'text-red-600' :
                                                    node.data.operationalMetric.status === 'YELLOW' ? 'text-amber-600' : 'text-emerald-600'
                                                }`}>{node.data.operationalMetric.value}</div>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs">
                                                <span className="text-slate-400">目标: {node.data.operationalMetric.target}</span>
                                                <span className={`flex items-center font-bold ${
                                                    node.data.operationalMetric.trend === 'UP' ? 'text-emerald-600' : 
                                                    node.data.operationalMetric.trend === 'DOWN' ? 'text-red-600' : 'text-slate-500'
                                                }`}>
                                                    {node.data.operationalMetric.trend === 'UP' ? <TrendingUp size={12}/> : 
                                                    node.data.operationalMetric.trend === 'DOWN' ? <TrendingDown size={12}/> : '-'} 
                                                    {node.data.operationalMetric.trendValue}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Right: Data Table */}
                                        <div className="col-span-3 border border-slate-200 rounded-xl overflow-hidden">
                                            <table className="w-full text-left text-xs">
                                                <thead className="bg-slate-50 text-slate-500 font-medium">
                                                    <tr>
                                                        <th className="px-4 py-2">ID / 批次号</th>
                                                        <th className="px-4 py-2">日期</th>
                                                        <th className="px-4 py-2">关联对象</th>
                                                        <th className="px-4 py-2">数值</th>
                                                        <th className="px-4 py-2">状态</th>
                                                        <th className="px-4 py-2">备注</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {node.data.operationalMetric.records.map((rec, i) => (
                                                        <tr key={i} className="hover:bg-slate-50">
                                                            <td className="px-4 py-2.5 font-mono text-slate-600">{rec.id}</td>
                                                            <td className="px-4 py-2.5 text-slate-500">{rec.date}</td>
                                                            <td className="px-4 py-2.5 font-medium text-slate-700">{rec.entity}</td>
                                                            <td className="px-4 py-2.5 font-bold text-slate-800">{rec.value}</td>
                                                            <td className="px-4 py-2.5">
                                                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                                                    rec.status === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                                                                    rec.status === 'WARNING' ? 'bg-amber-100 text-amber-700' :
                                                                    'bg-emerald-100 text-emerald-700'
                                                                }`}>{rec.status}</span>
                                                            </td>
                                                            <td className="px-4 py-2.5 text-slate-400 italic">{rec.remark || '-'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 text-[10px] text-slate-400 flex justify-center hover:bg-slate-100 cursor-pointer transition-colors">
                                                查看更多历史数据 <ArrowRight size={10} className="ml-1"/>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-8">
                                        {/* Impact Events List */}
                                        <div>
                                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                                <AlertOctagon size={18} className="text-amber-600"/> 影响事件溯源 (Impact Events)
                                            </h3>
                                            <div className="space-y-3">
                                                {node.data.operationalMetric.impactEvents.length > 0 ? node.data.operationalMetric.impactEvents.map((evt, i) => (
                                                    <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                                                                evt.impactLevel === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                                            }`}>{evt.impactLevel} IMPACT</span>
                                                            <span className="text-xs text-slate-400">{evt.date}</span>
                                                        </div>
                                                        <div className="text-sm font-bold text-slate-800 mb-1">{evt.title}</div>
                                                        <p className="text-xs text-slate-600">{evt.description}</p>
                                                    </div>
                                                )) : (
                                                    <div className="text-center py-8 text-slate-400 text-sm italic">暂无重大影响事件</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Optimization Actions */}
                                        <div>
                                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                                <Zap size={18} className="text-blue-600"/> 优化闭环行动 (Optimization)
                                            </h3>
                                            <div className="space-y-3">
                                                {node.data.operationalMetric.optimizationActions.length > 0 ? node.data.operationalMetric.optimizationActions.map((act, i) => (
                                                    <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                                                                act.status === 'DONE' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'
                                                            }`}>
                                                                {act.status === 'DONE' && <Check size={14}/>}
                                                            </div>
                                                            <div>
                                                                <div className={`text-sm font-medium ${act.status === 'DONE' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{act.title}</div>
                                                                <div className="text-xs text-slate-500 mt-0.5">Owner: {act.owner} • Due: {act.dueDate}</div>
                                                            </div>
                                                        </div>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                                                            act.status === 'DONE' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                                                        }`}>{act.status}</span>
                                                    </div>
                                                )) : (
                                                    <div className="text-center py-8 text-slate-400 text-sm italic">暂无优化行动项</div>
                                                )}
                                                <button className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-xs text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
                                                    <Plus size={14}/> 添加优化行动
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* KPIs */}
                    <div className="grid grid-cols-4 gap-6">
                        <div className="col-span-1 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-xs text-slate-400 font-bold uppercase mb-2">{node.data.financial.label}</div>
                            <div className="text-2xl font-bold text-slate-800">{node.data.financial.value}</div>
                            <div className="text-xs text-slate-500 mt-1">目标: {node.data.financial.target}</div>
                        </div>
                        <div className="col-span-3 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                            <h4 className="text-xs text-slate-400 font-bold uppercase mb-4">关键假设与成功要素</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-purple-50 rounded border border-purple-100">
                                    <div className="text-xs text-purple-700 font-bold mb-1">关键假设</div>
                                    <div className="text-sm font-medium text-slate-800">{node.data.assumption.label}</div>
                                </div>
                                <div className="p-3 bg-blue-50 rounded border border-blue-100">
                                    <div className="text-xs text-blue-700 font-bold mb-1">关键成功要素</div>
                                    <div className="text-sm font-medium text-slate-800">{node.data.ksf.label}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sub Goals & Actions */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <ListTodo size={18} className="text-emerald-600"/> 目标分解与行动
                        </h3>
                        <div className="space-y-6">
                            {plan.subGoals.map((sg) => (
                                <div key={sg.id} className="border border-slate-200 rounded-lg overflow-hidden">
                                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                                        <div>
                                            <div className="font-bold text-slate-800 text-sm">{sg.title}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">负责人: {sg.owner} • 截止: {sg.deadline}</div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-xs text-slate-600 font-medium">{sg.metric}</div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 bg-white h-2 rounded-full border border-slate-200 overflow-hidden">
                                                    <div className="bg-emerald-500 h-full" style={{width: `${sg.progress}%`}}></div>
                                                </div>
                                                <span className="text-xs font-bold text-slate-700">{sg.progress}%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-0">
                                        {sg.actions.map((act, i) => (
                                            <div key={act.id} className={`flex items-center justify-between px-4 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                                                        act.status === 'DONE' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white'
                                                    }`}>
                                                        {act.status === 'DONE' && <Check size={10}/>}
                                                    </div>
                                                    <span className={`text-sm ${act.status === 'DONE' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                                        {act.task}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-xs text-slate-400">{act.owner}</span>
                                                    <span className="text-xs text-slate-400">{act.deadline}</span>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                        act.status === 'DONE' ? 'bg-emerald-100 text-emerald-700' :
                                                        act.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-slate-100 text-slate-600'
                                                    }`}>{act.status}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Support Needs */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Handshake size={18} className="text-orange-500"/> 跨部门支持需求
                        </h3>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 font-medium">
                                <tr>
                                    <th className="px-4 py-2">协作部门</th>
                                    <th className="px-4 py-2">联系人</th>
                                    <th className="px-4 py-2">需求内容</th>
                                    <th className="px-4 py-2">紧迫度</th>
                                    <th className="px-4 py-2">状态</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {plan.supportNeeds.map((req, i) => (
                                    <tr key={i} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 font-medium text-slate-700">{req.department}</td>
                                        <td className="px-4 py-3 text-slate-600">{req.contact}</td>
                                        <td className="px-4 py-3 text-slate-600">{req.content}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                req.criticality === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                            }`}>{req.criticality}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                req.status === 'AGREED' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                                            }`}>{req.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AnnualPlan = ({ initialContext }: { initialContext?: any }) => {
    const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
    const [chatContext, setChatContext] = useState<any>(null);
    const [zoom, setZoom] = useState(1);
    
    // Check if initialContext points to a specific node (e.g. from Quiver jump)
    useEffect(() => {
        if (initialContext?.targetNode) {
            // For now, let's just log or ignore as we don't have full Assumption data wired up to main nodes perfectly yet in this mock
        }
    }, [initialContext]);

    return (
        <div className="flex h-full bg-slate-50 relative overflow-hidden">
            {/* Toolbar */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                 <div className="bg-white p-1.5 rounded-lg shadow-md border border-slate-200 flex flex-col gap-1">
                     <button className="p-2 hover:bg-slate-100 rounded text-slate-600" title="Zoom In" onClick={() => setZoom(z => Math.min(z + 0.1, 2))}><ZoomIn size={18}/></button>
                     <button className="p-2 hover:bg-slate-100 rounded text-slate-600" title="Zoom Out" onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))}><ZoomOut size={18}/></button>
                     <button className="p-2 hover:bg-slate-100 rounded text-slate-600" title="Fit to Screen"><Maximize size={18}/></button>
                 </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 relative overflow-auto bg-slate-50/50" style={{backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
                 <div 
                    className="absolute inset-0 w-[2000px] h-[1000px] transition-transform duration-200 origin-top-left"
                    style={{ transform: `scale(${zoom})` }}
                 >
                    {/* Edges */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                        {WORKFLOW_EDGES.map(edge => {
                            const sourceNode = WORKFLOW_NODES.find(n => n.id === edge.source);
                            const targetNode = WORKFLOW_NODES.find(n => n.id === edge.target);
                            if (!sourceNode || !targetNode) return null;

                            // Simple layout logic: draw connection
                            return (
                                <g key={edge.id}>
                                    <path 
                                        d={`M ${sourceNode.x + 160} ${sourceNode.y + 100} C ${sourceNode.x + 160} ${targetNode.y - 50}, ${targetNode.x + 160} ${sourceNode.y + 100}, ${targetNode.x + 160} ${targetNode.y}`}
                                        stroke={edge.type === 'dashed' ? '#94a3b8' : '#cbd5e1'}
                                        strokeWidth="2"
                                        strokeDasharray={edge.type === 'dashed' ? '5,5' : ''}
                                        fill="none"
                                        markerEnd="url(#arrow)"
                                    />
                                    <rect 
                                        x={(sourceNode.x + targetNode.x)/2 + 160 - (edge.label.length * 4)} 
                                        y={(sourceNode.y + targetNode.y)/2 + 40} 
                                        width={edge.label.length * 10} 
                                        height="14" 
                                        fill="white" 
                                        rx="2"
                                    />
                                    <text 
                                        x={(sourceNode.x + targetNode.x)/2 + 160} 
                                        y={(sourceNode.y + targetNode.y)/2 + 50} 
                                        textAnchor="middle" 
                                        fill="#64748b" 
                                        fontSize="10" 
                                        className="font-medium"
                                    >
                                        {edge.label}
                                    </text>
                                </g>
                            )
                        })}
                        <defs>
                            <marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="3" orient="auto" markerUnits="strokeWidth">
                                <path d="M0,0 L0,6 L9,3 z" fill="#cbd5e1" />
                            </marker>
                        </defs>
                    </svg>

                    {/* Nodes */}
                    {WORKFLOW_NODES.map(node => (
                        <WorkflowNodeCard 
                            key={node.id} 
                            node={node} 
                            onMouseDown={() => {}} 
                            onClick={() => setSelectedNode(node)} 
                        />
                    ))}
                 </div>
            </div>

            {/* Overlays */}
            {selectedNode && (
                <PlanDetailPanelV2 
                    node={selectedNode} 
                    onClose={() => setSelectedNode(null)} 
                    onChat={setChatContext}
                />
            )}

            {chatContext && (
                <SmartCollaborationModal 
                    owner={chatContext.owner} 
                    topic={chatContext.topic} 
                    onClose={() => setChatContext(null)} 
                />
            )}
        </div>
    );
};
