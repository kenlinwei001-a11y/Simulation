
import React, { useState, useEffect, useRef, useMemo } from 'react';
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
    Globe, 
    History as HistoryIcon, 
    ClipboardList, 
    CalendarDays, 
    Users, 
    Network, 
    ZoomIn, 
    ZoomOut, 
    RotateCcw, 
    Sparkles, 
    Eye,
    Settings
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

interface WorkflowNode {
    id: string;
    type: 'PLAN_NODE';
    title: string;
    owner: string;
    status: 'GREEN' | 'YELLOW' | 'RED';
    x: number;
    y: number;
    data: {
        financial: { label: string; value: string; target: string; status: 'GREEN' | 'YELLOW' | 'RED' };
        assumption: { label: string; id: string };
        ksf: { label: string };
        action: { label: string; progress: number };
    };
}

interface Goal {
    id: string;
    code: string;
    name: string;
    category: 'GOAL';
    owner: string;
    status: string;
    progress: number;
    targetValue: string;
    description: string;
    x: number;
    y: number;
    historyEvents?: { date: string; title: string; description: string; impact: string }[];
    meetingRecords?: { title: string; date: string; attendees: string[]; summary: string; decisions: string[] }[];
}

interface Assumption {
    id: string;
    code: string;
    name: string;
    category: 'ASSUMPTION';
    owner: string;
    status: string;
    confidence: number;
    description: string;
    risk?: string;
    metrics?: { current: string; target: string; delta: string; trendData?: number[] };
    externalData?: { source: string; updateTime: string; title: string; fullContent: string; value: string; trend: string }[];
    historyEvents?: { date: string; title: string; description: string; impact: string }[];
    meetingRecords?: { title: string; date: string; attendees: string[]; summary: string; decisions: string[] }[];
    x: number;
    y: number;
}

// --- Mock Data ---

const WORKFLOW_NODES: WorkflowNode[] = [
    // Stream 1: R&D & Product (Top Row)
    {
        id: 'WN-Q1-RD',
        type: 'PLAN_NODE',
        title: 'Q1: Gen-5 电芯原型验证',
        owner: 'R&D/Dr.Wang',
        status: 'GREEN',
        x: 100,
        y: 100,
        data: {
            financial: { label: 'R&D Budget', value: '¥ 45M', target: '¥ 50M', status: 'GREEN' },
            assumption: { label: 'A6: 新技术验证通过', id: 'A6' },
            ksf: { label: '循环寿命 > 2000次' },
            action: { label: 'B样件客户送样', progress: 100 }
        }
    },
    {
        id: 'WN-Q2-RD',
        type: 'PLAN_NODE',
        title: 'Q2: Pilot Line 试产跑通',
        owner: 'Eng/Tom',
        status: 'YELLOW',
        x: 550,
        y: 100,
        data: {
            financial: { label: 'Material Cost', value: '¥ 0.55/Wh', target: '¥ 0.52/Wh', status: 'YELLOW' },
            assumption: { label: 'A9: 生产良率爬坡', id: 'A9' },
            ksf: { label: '直通率 (FPY) > 85%' },
            action: { label: '工艺参数冻结', progress: 80 }
        }
    },
    {
        id: 'WN-Q3-RD',
        type: 'PLAN_NODE',
        title: 'Q3: 核心客户 PPAP 批准',
        owner: 'Quality/Sarah',
        status: 'GREEN',
        x: 1000,
        y: 100,
        data: {
            financial: { label: 'Validation Cost', value: '¥ 8M', target: '¥ 10M', status: 'GREEN' },
            assumption: { label: 'A2: 客户产能规划', id: 'A2' },
            ksf: { label: '零重大质量缺陷' },
            action: { label: 'SOP 启动审核', progress: 60 }
        }
    },

    // Stream 2: Supply Chain & Manufacturing (Middle Row)
    {
        id: 'WN-Q1-SCM',
        type: 'PLAN_NODE',
        title: 'Q1: 年度长协资源锁定',
        owner: 'Pur/Simon',
        status: 'RED',
        x: 100,
        y: 350,
        data: {
            financial: { label: 'Lithium Price', value: '¥ 16.5w', target: '¥ 15w', status: 'RED' },
            assumption: { label: 'A3: 原材料价格低位', id: 'A3' },
            ksf: { label: 'LCE 锁定量 > 5000吨' },
            action: { label: '签署 SQM 补充协议', progress: 40 }
        }
    },
    {
        id: 'WN-Q2-MFG',
        type: 'PLAN_NODE',
        title: 'Q2: Base 3 产线设备调试',
        owner: 'Mfg/Bob',
        status: 'GREEN',
        x: 550,
        y: 350,
        data: {
            financial: { label: 'Capex Payment', value: '¥ 1.2B', target: '¥ 1.2B', status: 'GREEN' },
            assumption: { label: 'A7: 供应链物流通畅', id: 'A7' },
            ksf: { label: '设备 OEE > 90%' },
            action: { label: '全线联调联试', progress: 95 }
        }
    },
    {
        id: 'WN-Q3-MFG',
        type: 'PLAN_NODE',
        title: 'Q3: 产能爬坡 (Ramp-up)',
        owner: 'Plant/Mike',
        status: 'YELLOW',
        x: 1000,
        y: 350,
        data: {
            financial: { label: 'Output Value', value: '¥ 800M', target: '¥ 1B', status: 'YELLOW' },
            assumption: { label: 'A10: 关键人才招聘', id: 'A10' },
            ksf: { label: '日产突破 15k 只' },
            action: { label: '双班制切换', progress: 50 }
        }
    },

    // Stream 3: Sales & Market (Bottom Row)
    {
        id: 'WN-Q2-SALES',
        type: 'PLAN_NODE',
        title: 'Q2: 欧洲销售渠道铺设',
        owner: 'Sales/Emily',
        status: 'GREEN',
        x: 550,
        y: 600,
        data: {
            financial: { label: 'Channel Cost', value: '€ 2.5M', target: '€ 3.0M', status: 'GREEN' },
            assumption: { label: 'A8: 欧洲政策补贴', id: 'A8' },
            ksf: { label: '签约经销商 > 20家' },
            action: { label: '慕尼黑办事处成立', progress: 100 }
        }
    },
    {
        id: 'WN-Q4-SALES',
        type: 'PLAN_NODE',
        title: 'Q4: 年度营收冲刺',
        owner: 'Sales/VP_Zhang',
        status: 'YELLOW',
        x: 1450,
        y: 350, // Converged point
        data: {
            financial: { label: 'Annual Revenue', value: '¥ 18.5B', target: '¥ 20B', status: 'YELLOW' },
            assumption: { label: 'A1: 市场需求增长', id: 'A1' },
            ksf: { label: 'Q4 回款率 > 90%' },
            action: { label: '主要客户年底备货', progress: 20 }
        }
    }
];

const WORKFLOW_EDGES = [
    { id: 'e1', source: 'WN-Q1-RD', target: 'WN-Q2-RD', label: '技术转移' },
    { id: 'e2', source: 'WN-Q2-RD', target: 'WN-Q3-RD', label: '验证完成' },
    { id: 'e3', source: 'WN-Q1-SCM', target: 'WN-Q2-MFG', label: '设备到货' },
    { id: 'e4', source: 'WN-Q2-MFG', target: 'WN-Q3-MFG', label: '产线交付' },
    { id: 'e5', source: 'WN-Q3-RD', target: 'WN-Q3-MFG', label: 'SOP 批准' },
    { id: 'e6', source: 'WN-Q3-MFG', target: 'WN-Q4-SALES', label: '产能释放' },
    { id: 'e7', source: 'WN-Q2-SALES', target: 'WN-Q4-SALES', label: '订单输入' },
    { id: 'e8', source: 'WN-Q1-SCM', target: 'WN-Q3-MFG', label: '原材料保障' }
];

const STRATEGIC_ASSUMPTIONS: Assumption[] = [
    {
        id: 'A1',
        code: 'A1',
        name: '全球新能源需求持续增长',
        category: 'ASSUMPTION',
        owner: '市场部',
        status: 'GREEN',
        confidence: 4,
        description: '基于第三方机构 (Bloomberg, IHS) 预测，2024年全球新能源车销量将保持 25% 以上增速。',
        metrics: { current: '+28%', target: '>25%', delta: '+3%', trendData: [20, 22, 25, 28, 29, 28] },
        x: 100, y: 100
    },
    {
        id: 'A2',
        code: 'A2',
        name: '核心客户产能规划达成',
        category: 'ASSUMPTION',
        owner: '销售部',
        status: 'GREEN',
        confidence: 5,
        description: '主要客户 (GAC, Xpeng) 的新工厂按期投产，确保对电池包的订单需求。',
        metrics: { current: '100%', target: '100%', delta: '0%', trendData: [100, 100, 100, 100] },
        x: 100, y: 200
    },
    {
        id: 'A3',
        code: 'A3',
        name: '原材料价格维持低位',
        category: 'ASSUMPTION',
        owner: '采购部',
        status: 'RED',
        confidence: 2,
        description: '假设碳酸锂价格维持在 15-20万/吨区间，但近期波动较大，存在跌价风险。',
        risk: '库存跌价损失可能超过 5000万。',
        metrics: { current: '16.5万', target: '18万', delta: '-1.5万', trendData: [22, 21, 19, 18, 17, 16.5] },
        externalData: [
            { source: 'SMM', updateTime: '2h ago', title: '碳酸锂现货报价', fullContent: '电池级碳酸锂均价下跌 2000元/吨。', value: '16.5万', trend: '-1.2%' }
        ],
        x: 100, y: 300
    },
    {
        id: 'A4',
        code: 'A4',
        name: '汇率波动控制在 ±5%',
        category: 'ASSUMPTION',
        owner: '财务部',
        status: 'YELLOW',
        confidence: 3,
        description: 'USD/CNY 汇率保持在 7.1-7.3 区间，避免造成重大汇兑损失。',
        metrics: { current: '7.28', target: '7.20', delta: '+1.1%' },
        x: 100, y: 400
    },
    {
        id: 'A5',
        code: 'A5',
        name: '竞品扩产节奏低于预期',
        category: 'ASSUMPTION',
        owner: '战略部',
        status: 'RED',
        confidence: 2,
        description: '假设主要竞对产能释放有序，未发生恶性价格战。目前监测到竞对 Q4 激进降价。',
        x: 100, y: 500
    },
    {
        id: 'A6',
        code: 'A6',
        name: '新技术量产验证通过',
        category: 'ASSUMPTION',
        owner: 'R&D',
        status: 'GREEN',
        confidence: 4,
        description: 'Gen-5 电芯在 Q3 完成 PPAP 验证，具备大规模量产条件。',
        metrics: { current: 'Passed', target: 'Passed', delta: '-' },
        x: 100, y: 600
    },
    {
        id: 'A7',
        code: 'A7',
        name: '供应链物流通畅',
        category: 'ASSUMPTION',
        owner: '供应链',
        status: 'GREEN',
        confidence: 5,
        description: '海运运力充足，无重大地缘政治阻断风险。',
        x: 100, y: 700
    },
    {
        id: 'A8',
        code: 'A8',
        name: '欧洲政策补贴延续',
        category: 'ASSUMPTION',
        owner: '海外部',
        status: 'YELLOW',
        confidence: 3,
        description: '假设德国及法国的新能源补贴政策在 2024 年不发生剧烈退坡。',
        x: 100, y: 800
    },
    {
        id: 'A9',
        code: 'A9',
        name: '生产良率爬坡符合预期',
        category: 'ASSUMPTION',
        owner: '生产部',
        status: 'RED',
        confidence: 2,
        description: 'Base 3 新产线良率需在 Q4 达到 95%。当前仅为 92%。',
        metrics: { current: '92%', target: '95%', delta: '-3%' },
        x: 100, y: 900
    },
    {
        id: 'A10',
        code: 'A10',
        name: '关键人才招聘到位',
        category: 'ASSUMPTION',
        owner: 'HR',
        status: 'GREEN',
        confidence: 4,
        description: '海外基地关键技术岗位招聘达成率 > 90%。',
        x: 100, y: 1000
    }
];

const STRATEGIC_GOALS: Goal[] = [
    {
        id: 'G1',
        code: 'G1',
        name: '集团年度营收 200亿',
        category: 'GOAL',
        owner: 'CEO',
        status: 'GREEN',
        progress: 85,
        targetValue: '200亿',
        description: '2024年度核心财务目标。',
        x: 700, y: 100
    },
    {
        id: 'G2',
        code: 'G2',
        name: '有效产能 50GWh',
        category: 'GOAL',
        owner: 'COO',
        status: 'GREEN',
        progress: 92,
        targetValue: '50GWh',
        description: '各基地合计有效产出能力。',
        x: 700, y: 300
    },
    {
        id: 'G3',
        code: 'G3',
        name: '电芯单位成本 < 0.5元/Wh',
        category: 'GOAL',
        owner: 'CTO',
        status: 'YELLOW',
        progress: 60,
        targetValue: '0.48元',
        description: '通过技术降本和规模效应实现。',
        x: 700, y: 500
    },
    {
        id: 'G4',
        code: 'G4',
        name: '全球市场份额 > 8%',
        category: 'GOAL',
        owner: 'CMO',
        status: 'RED',
        progress: 40,
        targetValue: '8%',
        description: '在动力电池市场的占有率目标。',
        x: 700, y: 700
    }
];

const STRATEGIC_EDGES = [
    { source: 'A1', target: 'G1', type: 'SUPPORT', description: '市场增长支撑营收' },
    { source: 'A2', target: 'G1', type: 'SUPPORT', description: '客户订单直接贡献营收' },
    { source: 'A4', target: 'G1', type: 'CONSTRAINT', description: '汇率影响最终财报营收' },
    
    { source: 'A6', target: 'G2', type: 'SUPPORT', description: '新技术提升产线效率' },
    { source: 'A7', target: 'G2', type: 'CONSTRAINT', description: '物料供应制约产能释放' },
    { source: 'A10', target: 'G2', type: 'SUPPORT', description: '人才到位保障开工率' },

    { source: 'A3', target: 'G3', type: 'CONSTRAINT', description: '材料价格直接影响成本' },
    { source: 'A9', target: 'G3', type: 'SUPPORT', description: '良率提升降低报废成本' },

    { source: 'A5', target: 'G4', type: 'CONSTRAINT', description: '竞品策略影响份额扩张' },
    { source: 'A8', target: 'G4', type: 'SUPPORT', description: '海外补贴利好出口份额' }
];

// --- Helpers ---

const findStrategicNode = (id: string) => {
    return [...STRATEGIC_ASSUMPTIONS, ...STRATEGIC_GOALS].find(n => n.id === id);
};

const getDetailedPlan = (node: WorkflowNode) => ({
    overview: `针对 ${node.title} 的详细执行方案。包括关键里程碑、资源需求及风险应对策略。`,
    subGoals: [
        { id: 'sg1', title: '完成设备选型', owner: node.owner, deadline: '2023-11-30', metric: '选型报告评审通过', progress: 100, actions: [{ id: 'a1', task: '供应商调研', status: 'DONE', owner: 'Alice', deadline: '11-15' }] },
        { id: 'sg2', title: '产线安装调试', owner: node.owner, deadline: '2024-02-28', metric: 'OEE > 90%', progress: 30, actions: [{ id: 'a2', task: '入场施工', status: 'IN_PROGRESS', owner: 'Bob', deadline: '01-10' }] }
    ],
    supportNeeds: [
        { department: 'IT部', contact: 'Charlie', content: 'MES 系统对接接口开发', criticality: 'HIGH', status: 'AGREED' },
        { department: 'HR部', contact: 'David', content: '新增 50 名产线工人招聘', criticality: 'MEDIUM', status: 'PENDING' }
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
        { id: 'me', name: 'Me', role: 'User', avatar: 'M' },
        { id: 'ai', name: 'AI Assistant', role: 'Bot', avatar: 'AI', isAi: true }
    ]);
    const [isAiTracking, setIsAiTracking] = useState(false);

    const handleSend = () => {
        if (!input.trim()) return;
        const newMsg: ChatMessage = {
            id: Date.now().toString(),
            sender: 'Me',
            role: 'ME',
            content: input,
            timestamp: new Date().toLocaleString()
        };
        setMessages([...messages, newMsg]);
        setInput('');
        
        // Sim AI Response
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
                    sender: 'AI Agent',
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
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                            <MessageCircle size={20} className="text-indigo-600"/> 智能协作空间 (Smart Space)
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                            <span className="font-medium text-slate-700">Topic: {topic}</span>
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

                {/* Tabs */}
                <div className="flex border-b border-slate-200 px-6 bg-white">
                    <button onClick={() => setActiveTab('CHAT')} className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'CHAT' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>对话 (Chat)</button>
                    <button onClick={() => setActiveTab('RECORDS')} className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'RECORDS' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>会议记录 (Records)</button>
                    <button onClick={() => setActiveTab('TRACKING')} className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'TRACKING' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>任务追踪 (Tasks)</button>
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
                                        {msg.role === 'ME' ? 'ME' : msg.role === 'AI' ? <Bot size={14}/> : msg.sender[0]}
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
                            {/* Mock Records */}
                            {[
                                { date: '2023-10-15', title: 'Q4 预算调整会议', summary: '确认增加 15% 营销预算用于海外市场拓展。', type: 'Meeting' },
                                { date: '2023-10-02', title: 'KPI 异常自动归档', summary: '系统检测到连续3天发货延迟，自动生成工单 #TKT-992。', type: 'System' },
                            ].map((rec, i) => (
                                <div key={i} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:border-indigo-300 transition-all cursor-pointer">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${rec.type === 'System' ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>{rec.type}</span>
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
                                            <div className="text-xs text-slate-400">Due: 明天 10:00 AM • Assigned to AI</div>
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
                                <Bot size={14}/> 让 AI 负责落实跟踪 (Assign to AI)
                            </label>
                        </div>
                        <div className="flex gap-2">
                            <input 
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                placeholder={`Message ${owner}, AI & others...`}
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
            className="absolute w-[320px] bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden hover:shadow-md transition-shadow cursor-pointer z-10 node-card"
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
                    <span className="font-bold text-sm text-slate-800">{node.title}</span>
                </div>
                <span className="text-xs text-slate-500 flex items-center gap-1"><User size={10}/> {node.owner}</span>
            </div>
            
            <div className="p-3 space-y-2 text-xs">
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
        </div>
    )
}

const PlanDetailPanelV2 = ({ node, onClose, onChat }: { node: WorkflowNode, onClose: () => void, onChat: (ctx: any) => void }) => {
    const plan = getDetailedPlan(node);

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
                            <span>Type: {node.type}</span>
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
                            <FileText size={18} className="text-blue-600"/> 计划总览 (Overview)
                        </h3>
                        <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded border border-slate-100">{plan.overview}</p>
                    </div>

                    {/* KPIs */}
                    <div className="grid grid-cols-4 gap-6">
                        <div className="col-span-1 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-xs text-slate-400 font-bold uppercase mb-2">{node.data.financial.label}</div>
                            <div className="text-2xl font-bold text-slate-800">{node.data.financial.value}</div>
                            <div className="text-xs text-slate-500 mt-1">Target: {node.data.financial.target}</div>
                        </div>
                        <div className="col-span-3 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                            <h4 className="text-xs text-slate-400 font-bold uppercase mb-4">关键假设与成功要素</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-purple-50 rounded border border-purple-100">
                                    <div className="text-xs text-purple-700 font-bold mb-1">关键假设 (Assumption)</div>
                                    <div className="text-sm font-medium text-slate-800">{node.data.assumption.label}</div>
                                </div>
                                <div className="p-3 bg-blue-50 rounded border border-blue-100">
                                    <div className="text-xs text-blue-700 font-bold mb-1">关键成功要素 (KSF)</div>
                                    <div className="text-sm font-medium text-slate-800">{node.data.ksf.label}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sub Goals & Actions */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <ListTodo size={18} className="text-emerald-600"/> 目标分解与行动 (Sub-goals & Actions)
                        </h3>
                        <div className="space-y-6">
                            {plan.subGoals.map((sg) => (
                                <div key={sg.id} className="border border-slate-200 rounded-lg overflow-hidden">
                                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                                        <div>
                                            <div className="font-bold text-slate-800 text-sm">{sg.title}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">Owner: {sg.owner} • Due: {sg.deadline}</div>
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
                            <Handshake size={18} className="text-orange-500"/> 跨部门支持需求 (Cross-functional Support)
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
                                        <td className="px-4 py-3 font-bold text-slate-700">{req.department}</td>
                                        <td className="px-4 py-3 text-slate-600">{req.contact}</td>
                                        <td className="px-4 py-3 text-slate-600">{req.content}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                req.criticality === 'HIGH' ? 'bg-red-100 text-red-700' :
                                                req.criticality === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>{req.criticality}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`flex items-center gap-1 font-medium text-xs ${
                                                req.status === 'AGREED' || req.status === 'DONE' ? 'text-emerald-600' : 'text-slate-500'
                                            }`}>
                                                {req.status === 'AGREED' || req.status === 'DONE' ? <CheckCircle2 size={12}/> : <Clock size={12}/>}
                                                {req.status}
                                            </span>
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

const StrategicDetailPanel = ({ itemId, onClose, onChat }: { itemId: string, onClose: () => void, onChat: (ctx: any) => void }) => {
    const item = findStrategicNode(itemId);
    if (!item) return null;

    return (
        <div className="absolute inset-0 bg-white z-40 flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-slate-50">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500"><ArrowLeft size={20}/></button>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 text-xs rounded font-bold ${
                                item.category === 'ASSUMPTION' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                            }`}>{item.category}</span>
                            <h2 className="text-lg font-bold text-slate-800">{item.name}</h2>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-3">
                            <span>ID: {item.code}</span>
                            <span className="flex items-center gap-1 bg-slate-200 px-1.5 py-0.5 rounded text-slate-600"><User size={12}/> {item.owner}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => onChat({ owner: item.owner, topic: `关于 ${item.name}` })}
                        className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2"
                    >
                        <MessageSquare size={16}/> 联系负责人
                    </button>
                    <button 
                        onClick={() => onChat({ owner: 'AI Assistant', topic: `AI Analysis: ${item.name}`, isAi: true })}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2"
                    >
                        <Sparkles size={16}/> AI 智能对话
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Top: Status & Definition */}
                    <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Activity size={18} className="text-blue-600"/> 状态与定义 (Status & Definition)
                            </h3>
                            <div className="flex gap-6 mb-4">
                                <div className="flex-1 p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="text-xs text-slate-500 mb-1">当前状态</div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                                        item.status === 'RED' || item.status === 'RISK' || item.status === 'DEVIATED' ? 'bg-red-100 text-red-700' :
                                        item.status === 'YELLOW' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                                    }`}>{item.status}</span>
                                </div>
                                {item.category === 'ASSUMPTION' && (
                                    <div className="flex-1 p-4 bg-slate-50 rounded-lg border border-slate-100">
                                        <div className="text-xs text-slate-500 mb-1">置信度 (Confidence)</div>
                                        <div className="flex gap-1 mt-1">
                                            {[1,2,3,4,5].map(i => (
                                                <div key={i} className={`w-2 h-6 rounded-sm ${i <= (item.confidence || 0) ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {item.category === 'GOAL' && (
                                    <div className="flex-1 p-4 bg-slate-50 rounded-lg border border-slate-100">
                                        <div className="text-xs text-slate-500 mb-1">达成进度 (Progress)</div>
                                        <div className="flex items-end gap-2">
                                            <span className="text-xl font-bold text-slate-800">{item.progress}%</span>
                                            <span className="text-xs text-slate-400 mb-1">Target: {item.targetValue}</span>
                                        </div>
                                        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                                            <div className="bg-blue-600 h-full" style={{width: `${item.progress}%`}}></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded border border-slate-100">
                                {item.description}
                            </p>
                        </div>

                        {/* Risk/Warning Box */}
                        <div className="col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <AlertTriangle size={18} className="text-amber-500"/> 风险预警 (Risk)
                            </h3>
                            {item.category === 'ASSUMPTION' && item.risk ? (
                                <div className="flex-1 bg-red-50 border border-red-100 rounded-lg p-4">
                                    <div className="text-red-800 font-medium text-sm mb-2">主要风险点:</div>
                                    <p className="text-sm text-red-700 leading-relaxed">{item.risk}</p>
                                </div>
                            ) : (
                                <div className="flex-1 bg-emerald-50 border border-emerald-100 rounded-lg p-4 flex items-center justify-center text-emerald-700 text-sm">
                                    暂无重大风险预警
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Metrics Section (Visual) */}
                    {item.category === 'ASSUMPTION' && item.metrics && (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <BarChart2 size={18} className="text-indigo-500"/> 关键指标监控 (Key Metrics)
                            </h3>
                            <div className="grid grid-cols-3 gap-6">
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="text-xs text-slate-500 mb-1">目标值 (Target)</div>
                                    <div className="text-lg font-bold text-slate-800">{item.metrics.target}</div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="text-xs text-slate-500 mb-1">当前值 (Current)</div>
                                    <div className="text-lg font-bold text-slate-800">{item.metrics.current}</div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="text-xs text-slate-500 mb-1">偏差 (Delta)</div>
                                    <div className={`text-lg font-bold ${
                                        item.metrics.delta.includes('-') ? 'text-red-600' : 'text-emerald-600'
                                    }`}>{item.metrics.delta}</div>
                                </div>
                            </div>
                            {item.metrics.trendData && (
                                <div className="mt-4 h-24 flex items-end gap-2 px-2 bg-slate-50 rounded border border-slate-100 pt-4 pb-2">
                                    {item.metrics.trendData.map((d, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-1 group">
                                            <div className="w-full bg-indigo-200 hover:bg-indigo-400 transition-colors rounded-t relative" style={{height: `${(d/40)*100}%`}}>
                                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                    {d}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Data Intelligence & Sources */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Latest Intelligence */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Globe size={18} className="text-blue-500"/> 最新情报与数据源 (Intelligence)
                            </h3>
                            <div className="space-y-3">
                                {item.category === 'ASSUMPTION' && item.externalData && item.externalData.map((d: any, i: number) => (
                                    <div key={i} className="p-3 border border-slate-200 rounded-lg bg-slate-50 hover:bg-white hover:shadow-md transition-all">
                                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                                            <span className="font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">{d.source}</span>
                                            <span>{d.updateTime}</span>
                                        </div>
                                        <div className="font-bold text-slate-800 text-sm mb-1">{d.title}</div>
                                        <div className="text-xs text-slate-600 mb-2">{d.fullContent}</div>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="text-slate-500">Value:</span>
                                            <span className="font-mono font-bold text-slate-800">{d.value}</span>
                                            <span className={`px-1.5 py-0.5 rounded font-bold ${d.trend.includes('-') ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>{d.trend}</span>
                                        </div>
                                    </div>
                                ))}
                                {(!item.category || item.category === 'GOAL') && <div className="text-sm text-slate-400 text-center py-4">暂无外部情报关联</div>}
                            </div>
                        </div>

                        {/* History Events */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <HistoryIcon size={18} className="text-purple-500"/> 历史重要影响事件 (History)
                            </h3>
                            <div className="space-y-4 relative pl-4 border-l border-slate-200">
                                {item.historyEvents && item.historyEvents.map((evt, i) => (
                                    <div key={i} className="relative">
                                        <div className={`absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                                            evt.impact === 'POSITIVE' ? 'bg-emerald-500' : evt.impact === 'NEGATIVE' ? 'bg-red-500' : 'bg-slate-400'
                                        }`}></div>
                                        <div className="text-xs text-slate-400 mb-0.5">{evt.date}</div>
                                        <div className="font-bold text-slate-800 text-sm">{evt.title}</div>
                                        <p className="text-xs text-slate-600 mt-1">{evt.description}</p>
                                    </div>
                                ))}
                                {(!item.historyEvents || item.historyEvents.length === 0) && (
                                    <div className="text-sm text-slate-400 py-4 italic pl-2">暂无重大历史事件记录</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Meeting Records */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <ClipboardList size={18} className="text-orange-500"/> 战略会议纪要 (Strategic Meeting Minutes)
                        </h3>
                        {item.meetingRecords && item.meetingRecords.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                                {item.meetingRecords.map((rec, i) => (
                                    <div key={i} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <div className="font-bold text-slate-800">{rec.title}</div>
                                                <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                                                    <CalendarDays size={12}/> {rec.date}
                                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                    <Users size={12}/> {rec.attendees.join(', ')}
                                                </div>
                                            </div>
                                            <button className="text-xs text-blue-600 border border-blue-200 bg-white px-2 py-1 rounded hover:bg-blue-50">查看详情</button>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="bg-white p-3 rounded border border-slate-100">
                                                <div className="text-xs font-bold text-slate-500 uppercase mb-1">会议摘要</div>
                                                <p className="text-sm text-slate-700">{rec.summary}</p>
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-slate-500 uppercase mb-1">关键决策</div>
                                                <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                                                    {rec.decisions.map((d, di) => <li key={di}>{d}</li>)}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-slate-50 rounded border border-dashed border-slate-200 text-slate-400 text-sm">
                                暂无关联的战略会议记录
                            </div>
                        )}
                    </div>

                    {/* Linked Goals/Assumptions (Reverse lookup) */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Network size={18} className="text-purple-500"/> 战略关联 (Strategic Links)
                        </h3>
                        <div className="space-y-2">
                            {STRATEGIC_EDGES.filter(e => e.source === item.id || e.target === item.id).map((edge, i) => {
                                const isSource = edge.source === item.id;
                                const otherId = isSource ? edge.target : edge.source;
                                const otherNode = findStrategicNode(otherId);
                                return (
                                    <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xs font-bold px-2 py-1 rounded ${
                                                edge.type === 'SUPPORT' ? 'bg-emerald-50 text-emerald-600' :
                                                edge.type === 'CONSTRAINT' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                                            }`}>{edge.type}</span>
                                            <span className="text-xs text-slate-400">{isSource ? '影响 ->' : '<- 受制于'}</span>
                                            <span className="text-sm font-medium text-slate-700">{otherNode?.name}</span>
                                        </div>
                                        <div className="text-xs text-slate-500">{edge.description}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const StrategicLinkageView = ({ onOpenDetail }: { onOpenDetail: (id: string) => void }) => {
    const [transform, setTransform] = useState({ x: 0, y: 0, k: 0.85 });
    const [isDragging, setIsDragging] = useState(false);
    const [startPan, setStartPan] = useState({ x: 0, y: 0 });
    const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);

    // Zoom handlers
    const zoomIn = () => setTransform(t => ({ ...t, k: Math.min(t.k + 0.1, 2) }));
    const zoomOut = () => setTransform(t => ({ ...t, k: Math.max(t.k - 0.1, 0.2) }));
    const reset = () => setTransform({ x: 0, y: 0, k: 0.85 });

    // Pan handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        // Only drag if clicking on background (not nodes)
        if ((e.target as HTMLElement).closest('.node-card')) return;
        setIsDragging(true);
        setStartPan({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setTransform(t => ({ ...t, x: e.clientX - startPan.x, y: e.clientY - startPan.y }));
    };

    const handleMouseUp = () => setIsDragging(false);

    // Layout nodes: Columns
    const ASSUMPTION_COL_X = 100;
    const GOAL_COL_X = 700;
    const VERTICAL_GAP = 160;

    const aNodes = STRATEGIC_ASSUMPTIONS.map((a, i) => ({ 
        ...a, 
        x: ASSUMPTION_COL_X, 
        y: 100 + i * VERTICAL_GAP 
    }));
    
    const gNodes = STRATEGIC_GOALS.map((g, i) => ({ 
        ...g, 
        x: GOAL_COL_X, 
        y: 100 + i * VERTICAL_GAP 
    }));

    const allNodes = [...aNodes, ...gNodes];

    // Helper to check connectivity for highlighting
    const isConnected = (nodeId: string) => {
        if (!highlightedNodeId) return true; // Show all if none highlighted
        if (highlightedNodeId === nodeId) return true;
        // Check if connected
        return STRATEGIC_EDGES.some(e => 
            (e.source === highlightedNodeId && e.target === nodeId) || 
            (e.target === highlightedNodeId && e.source === nodeId)
        );
    };

    const isEdgeHighlighted = (source: string, target: string) => {
        if (!highlightedNodeId) return true;
        return source === highlightedNodeId || target === highlightedNodeId;
    }

    return (
        <div className="relative w-full h-full overflow-hidden bg-slate-50"
             onMouseDown={handleMouseDown}
             onMouseMove={handleMouseMove}
             onMouseUp={handleMouseUp}
             onMouseLeave={handleMouseUp}
             onClick={() => setHighlightedNodeId(null)} // Click bg to deselect
        >
            {/* Toolbar */}
            <div className="absolute bottom-8 right-8 flex flex-col gap-2 z-20">
                <div className="bg-white p-1.5 rounded-lg shadow-lg border border-slate-200 flex flex-col gap-1">
                    <button className="p-2 hover:bg-slate-100 rounded-md text-slate-600 transition-colors" onClick={zoomIn} title="Zoom In"><ZoomIn size={20}/></button>
                    <div className="h-px bg-slate-100 w-full my-0.5"></div>
                    <button className="p-2 hover:bg-slate-100 rounded-md text-slate-600 transition-colors" onClick={zoomOut} title="Zoom Out"><ZoomOut size={20}/></button>
                    <div className="h-px bg-slate-100 w-full my-0.5"></div>
                    <button className="p-2 hover:bg-slate-100 rounded-md text-slate-600 transition-colors" onClick={reset} title="Reset View"><RotateCcw size={20}/></button>
                </div>
                <div className="bg-white px-2 py-1 rounded-md shadow-sm border border-slate-200 text-center text-xs font-mono text-slate-500">
                    {Math.round(transform.k * 100)}%
                </div>
            </div>

            {/* Column Headers (Fixed visual aid) */}
            <div className="absolute top-4 left-0 w-full flex pointer-events-none z-10" style={{ transform: `translate(${transform.x}px, 0)` }}>
                 {/* Can add column labels here if needed, but positions scale with transform so tricky. Keeping clean. */}
            </div>

            <div style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`, transformOrigin: '0 0' }} className="w-full h-full">
                
                {/* Connections (Layer 0) */}
                <svg className="absolute inset-0 w-[2000px] h-[3000px] pointer-events-none">
                    <defs>
                        <marker id="arrow-support" markerWidth="10" markerHeight="10" refX="10" refY="3" orient="auto" markerUnits="strokeWidth">
                            <path d="M0,0 L0,6 L9,3 z" fill="#10b981" />
                        </marker>
                        <marker id="arrow-constraint" markerWidth="10" markerHeight="10" refX="10" refY="3" orient="auto" markerUnits="strokeWidth">
                            <path d="M0,0 L0,6 L9,3 z" fill="#ef4444" />
                        </marker>
                        <marker id="arrow-dimmed" markerWidth="10" markerHeight="10" refX="10" refY="3" orient="auto" markerUnits="strokeWidth">
                            <path d="M0,0 L0,6 L9,3 z" fill="#e2e8f0" />
                        </marker>
                    </defs>
                    {STRATEGIC_EDGES.map((edge, i) => {
                        const sourceNode = allNodes.find(n => n.id === edge.source);
                        const targetNode = allNodes.find(n => n.id === edge.target);
                        if (!sourceNode || !targetNode) return null;

                        const isHighlighted = isEdgeHighlighted(edge.source, edge.target);
                        const strokeColor = !isHighlighted ? '#e2e8f0' : (edge.type === 'SUPPORT' ? '#10b981' : '#ef4444');
                        const markerEnd = !isHighlighted ? 'url(#arrow-dimmed)' : (edge.type === 'SUPPORT' ? 'url(#arrow-support)' : 'url(#arrow-constraint)');
                        const opacity = !isHighlighted ? 0.3 : 1;
                        const strokeWidth = !isHighlighted ? 1 : 2;

                        // Bezier Curve
                        const startX = sourceNode.x + 280; // Right edge of card
                        const startY = sourceNode.y + 50; // Center of card height
                        const endX = targetNode.x; // Left edge of card
                        const endY = targetNode.y + 50;
                        
                        const controlX1 = startX + 150;
                        const controlX2 = endX - 150;

                        return (
                            <path 
                                key={i}
                                d={`M ${startX} ${startY} C ${controlX1} ${startY}, ${controlX2} ${endY}, ${endX} ${endY}`}
                                stroke={strokeColor}
                                strokeWidth={strokeWidth}
                                fill="none"
                                markerEnd={markerEnd}
                                opacity={opacity}
                                strokeDasharray={edge.type === 'CONSTRAINT' ? '5,5' : '0'}
                                className="transition-all duration-300"
                            />
                        );
                    })}
                </svg>

                {/* Nodes (Layer 1) */}
                {allNodes.map(node => {
                    const isDimmed = highlightedNodeId && !isConnected(node.id);
                    const isSelected = highlightedNodeId === node.id;
                    const isGoal = 'targetValue' in node; // Check if it's a Goal

                    return (
                        <div 
                            key={node.id} 
                            className={`absolute w-[280px] bg-white rounded-xl shadow-sm border transition-all duration-300 cursor-pointer node-card flex flex-col justify-between group overflow-visible ${
                                isDimmed ? 'opacity-30 grayscale' : 'opacity-100'
                            } ${
                                isSelected ? 'border-blue-500 ring-4 ring-blue-100 scale-105 z-20' : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
                            }`}
                            style={{ left: node.x, top: node.y, minHeight: '100px' }}
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                setHighlightedNodeId(node.id); 
                            }}
                            onDoubleClick={(e) => {
                                e.stopPropagation();
                                onOpenDetail(node.id);
                            }}
                        >
                            {/* Card Header */}
                            <div className={`px-4 py-2 border-b flex justify-between items-center rounded-t-xl ${
                                node.status === 'RED' || node.status === 'RISK' || node.status === 'DEVIATED' ? 'bg-red-50 border-red-100' :
                                node.status === 'YELLOW' ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'
                            }`}>
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${
                                        node.status === 'RED' || node.status === 'RISK' || node.status === 'DEVIATED' ? 'bg-red-500' :
                                        node.status === 'YELLOW' ? 'bg-amber-500' : 'bg-emerald-500'
                                    }`}></span>
                                    <span className="text-[10px] font-bold text-slate-500">{node.code}</span>
                                </div>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                    isGoal ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                }`}>{isGoal ? 'GOAL' : 'ASSUMPTION'}</span>
                            </div>

                            {/* Card Body */}
                            <div className="p-3 flex-1">
                                <div className="font-bold text-slate-800 text-sm mb-2 leading-tight">{node.name}</div>
                                {isGoal ? (
                                    <div className="mt-1">
                                        <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                                            <span>Progress</span>
                                            <span className="font-bold text-slate-700">{(node as Goal).progress}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-blue-500 h-full rounded-full" style={{width: `${(node as Goal).progress}%`}}></div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {(node as Assumption).metrics && (
                                            <div className="text-[10px] bg-slate-50 border border-slate-100 px-2 py-1 rounded text-slate-600 font-mono">
                                                {(node as Assumption).metrics?.current}
                                            </div>
                                        )}
                                        <div className="text-[10px] bg-slate-50 border border-slate-100 px-2 py-1 rounded text-slate-600 flex items-center gap-1">
                                            Conf: {(node as Assumption).confidence}/5
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Card Footer */}
                            <div className="px-3 py-2 border-t border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-b-xl">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold border border-white shadow-sm">
                                        {node.owner.substring(0,1)}
                                    </div>
                                    <span className="text-[10px] text-slate-500 truncate w-20">{node.owner}</span>
                                </div>
                                {isSelected && (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onOpenDetail(node.id); }}
                                        className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-sm"
                                    >
                                        详情 <ArrowRight size={10}/>
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const PlanExecutionView = ({ onSelectNode }: { onSelectNode: (node: WorkflowNode) => void }) => {
    const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
    const [isDragging, setIsDragging] = useState(false);
    const [startPan, setStartPan] = useState({ x: 0, y: 0 });

    // Zoom handlers
    const zoomIn = () => setTransform(t => ({ ...t, k: Math.min(t.k + 0.1, 2) }));
    const zoomOut = () => setTransform(t => ({ ...t, k: Math.max(t.k - 0.1, 0.2) }));
    const reset = () => setTransform({ x: 0, y: 0, k: 1 });

    // Pan handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        // Only drag if clicking on background (not nodes)
        if ((e.target as HTMLElement).closest('.node-card')) return;
        setIsDragging(true);
        setStartPan({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setTransform(t => ({ ...t, x: e.clientX - startPan.x, y: e.clientY - startPan.y }));
    };

    const handleMouseUp = () => setIsDragging(false);

    return (
        <div className="relative w-full h-full overflow-hidden bg-slate-50"
             onMouseDown={handleMouseDown}
             onMouseMove={handleMouseMove}
             onMouseUp={handleMouseUp}
             onMouseLeave={handleMouseUp}
        >
            {/* Toolbar */}
            <div className="absolute bottom-8 right-8 flex flex-col gap-2 z-20">
                <div className="bg-white p-1.5 rounded-lg shadow-lg border border-slate-200 flex flex-col gap-1">
                    <button className="p-2 hover:bg-slate-100 rounded-md text-slate-600 transition-colors" onClick={zoomIn} title="Zoom In"><ZoomIn size={20}/></button>
                    <div className="h-px bg-slate-100 w-full my-0.5"></div>
                    <button className="p-2 hover:bg-slate-100 rounded-md text-slate-600 transition-colors" onClick={zoomOut} title="Zoom Out"><ZoomOut size={20}/></button>
                    <div className="h-px bg-slate-100 w-full my-0.5"></div>
                    <button className="p-2 hover:bg-slate-100 rounded-md text-slate-600 transition-colors" onClick={reset} title="Reset View"><RotateCcw size={20}/></button>
                </div>
                <div className="bg-white px-2 py-1 rounded-md shadow-sm border border-slate-200 text-center text-xs font-mono text-slate-500">
                    {Math.round(transform.k * 100)}%
                </div>
            </div>

            <div style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`, transformOrigin: '0 0' }} className="w-full h-full">
                {/* Edges */}
                <svg className="absolute inset-0 w-[2000px] h-[1500px] pointer-events-none z-0">
                    <defs>
                        <marker id="arrow-gray" markerWidth="10" markerHeight="10" refX="10" refY="3" orient="auto" markerUnits="strokeWidth">
                            <path d="M0,0 L0,6 L9,3 z" fill="#cbd5e1" />
                        </marker>
                    </defs>
                    {WORKFLOW_EDGES.map(edge => {
                        const s = WORKFLOW_NODES.find(n => n.id === edge.source);
                        const t = WORKFLOW_NODES.find(n => n.id === edge.target);
                        if (!s || !t) return null;
                        
                        // Bezier logic for smooth curves
                        const startX = s.x + 320; // Card width
                        const startY = s.y + 60;  // Card half height approx
                        const endX = t.x;
                        const endY = t.y + 60;
                        const controlX1 = startX + 100;
                        const controlX2 = endX - 100;

                        return (
                            <g key={edge.id}>
                                <path 
                                    d={`M ${startX} ${startY} C ${controlX1} ${startY}, ${controlX2} ${endY}, ${endX} ${endY}`}
                                    stroke="#cbd5e1" 
                                    strokeWidth="2" 
                                    fill="none"
                                    markerEnd="url(#arrow-gray)"
                                />
                                {edge.label && (
                                    <text x={(startX + endX)/2} y={(startY + endY)/2} textAnchor="middle" fill="#94a3b8" fontSize="10" className="bg-slate-50 px-1">{edge.label}</text>
                                )}
                            </g>
                        )
                    })}
                </svg>

                {/* Nodes */}
                {WORKFLOW_NODES.map(node => (
                    <WorkflowNodeCard 
                        key={node.id} 
                        node={node} 
                        onMouseDown={(e) => {}} 
                        onClick={() => onSelectNode(node)} 
                    />
                ))}
            </div>
        </div>
    )
}

export const AnnualPlan = ({ initialContext }: { initialContext?: any }) => {
    const [view, setView] = useState<'PLAN' | 'STRATEGY'>('PLAN');
    const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
    const [selectedStrategicId, setSelectedStrategicId] = useState<string | null>(null);
    const [chatConfig, setChatConfig] = useState<any>(null);

    // Initial context handling
    useEffect(() => {
        if (initialContext?.targetNode) {
            // Logic to switch view or select node
            // For now, if node starts with 'WN', open plan node. If 'A' or 'G', switch to strategy.
            if (initialContext.targetNode.startsWith('WN')) {
                const n = WORKFLOW_NODES.find(n => n.id === initialContext.targetNode);
                if(n) setSelectedNode(n);
            } else {
                setView('STRATEGY');
                // Could also set selectedStrategicId here if needed
                if(initialContext.targetNode) setSelectedStrategicId(initialContext.targetNode);
            }
        }
    }, [initialContext]);

    return (
        <div className="h-full flex flex-col bg-slate-100 overflow-hidden relative">
            {/* Toolbar */}
            <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Target className="text-blue-600"/> 年度战略计划 (Annual Strategic Plan 2024)
                    </h1>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button 
                            onClick={() => setView('PLAN')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${view === 'PLAN' ? 'bg-white shadow text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            执行计划视图 (Execution)
                        </button>
                        <button 
                            onClick={() => setView('STRATEGY')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${view === 'STRATEGY' ? 'bg-white shadow text-purple-700' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            战略归因视图 (Strategy)
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-200">Last Sync: 10 mins ago</span>
                    <button className="p-2 hover:bg-slate-100 rounded text-slate-500"><Settings size={18}/></button>
                </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 overflow-auto relative cursor-grab active:cursor-grabbing">
                {view === 'PLAN' ? (
                    <PlanExecutionView onSelectNode={setSelectedNode} />
                ) : (
                    <StrategicLinkageView onOpenDetail={setSelectedStrategicId} />
                )}
            </div>

            {/* Panels & Modals */}
            {selectedNode && (
                <PlanDetailPanelV2 
                    node={selectedNode} 
                    onClose={() => setSelectedNode(null)} 
                    onChat={(ctx) => setChatConfig(ctx)}
                />
            )}

            {selectedStrategicId && (
                <StrategicDetailPanel 
                    itemId={selectedStrategicId} 
                    onClose={() => setSelectedStrategicId(null)} 
                    onChat={(ctx) => setChatConfig(ctx)} 
                />
            )}

            {chatConfig && (
                <SmartCollaborationModal 
                    owner={chatConfig.owner} 
                    topic={chatConfig.topic} 
                    onClose={() => setChatConfig(null)} 
                />
            )}
        </div>
    );
};
