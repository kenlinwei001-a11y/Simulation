import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
    Target, 
    AlertTriangle, 
    CheckCircle2, 
    TrendingUp, 
    ChevronRight, 
    ChevronDown, 
    ArrowRight, 
    Activity, 
    BarChart2, 
    FileText, 
    User, 
    Clock, 
    History,
    Scale,
    ArrowLeft,
    TrendingDown,
    Flag,
    Maximize2,
    X,
    Network,
    ListTree,
    MessageSquare,
    Send,
    MoreHorizontal,
    Paperclip,
    Bot,
    Link,
    Database,
    Globe,
    FileCode,
    Minus,
    Plus,
    ZoomIn,
    ZoomOut,
    RotateCcw,
    PanelLeftClose,
    PanelLeftOpen,
    Grab,
    PanelRightClose,
    AlertCircle,
    Check,
    Move,
    FileBarChart,
    Settings2,
    BrainCircuit,
    Sparkles,
    Save,
    ClipboardList,
    ListTodo,
    CheckSquare,
    Clock4,
    ExternalLink,
    BookOpen,
    Lightbulb,
    Edit2,
    MessageCircle
} from 'lucide-react';

// --- 1. Data Types ---

interface StrategicEvent {
    id: string;
    date: string;
    title: string;
    description: string;
    impact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    source: string;
    sourceType: 'INTERNAL_SYSTEM' | 'INTERNAL_DOC' | 'EXTERNAL_NEWS' | 'EXTERNAL_REPORT' | 'EXTERNAL_SYSTEM';
}

interface ChatMessage {
    id: string;
    sender: string;
    role: 'ME' | 'OTHER' | 'SYSTEM';
    content: string;
    timestamp: string;
    isStructured?: boolean; // New: For structured summaries
}

interface ActionItem {
    id: string;
    content: string;
    owner: string;
    deadline: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'DONE';
    verifiedBySystem?: boolean; // New: System auto-verification
    verificationTime?: string;
}

interface KeyPoint {
    id: string;
    date: string;
    summary: string;
    actions: ActionItem[];
}

interface Assumption {
    id: string;
    code: string;
    name: string;
    description: string;
    type: 'MARKET' | 'CUSTOMER' | 'COST' | 'CAPACITY' | 'ORG' | 'POLICY';
    status: 'GREEN' | 'YELLOW' | 'RED';
    confidence: 1 | 2 | 3 | 4 | 5; 
    owner: string; 
    risk: string;
    metrics?: {
        target: string;
        current: string;
        delta: string;
    };
    events?: StrategicEvent[];
    subItems?: Assumption[]; // Recursive structure
    parentId?: string;
    chatHistory?: ChatMessage[]; 
    communicationStatus?: 'NONE' | 'SYSTEM_CONTACTED' | 'DISCUSSED';
    keyPoints?: KeyPoint[]; 
    externalData?: { // New: High-dimensional data linkage
        id: string;
        title: string;
        value: string;
        trend: string;
        source: string;
        updateTime: string;
        fullContent: string;
    }[];
}

interface Goal {
    id: string;
    code: string;
    name: string;
    targetValue: string;
    status: 'NORMAL' | 'RISK' | 'DEVIATED';
    progress: number;
    owner: string;
    description?: string;
}

interface GraphEdge {
    source: string;
    target: string;
    type: 'SUPPORT' | 'CONSTRAINT' | 'VETO'; 
    weight: 'STRONG' | 'MEDIUM' | 'WEAK';
    description: string;
}

interface SimulationRecord {
    id: string;
    date: string;
    scenario: string;
    dimensions: string[];
    resultSummary: string;
    actualOutcome?: string; // User input for feedback
    accuracy?: 'HIGH' | 'MEDIUM' | 'LOW';
    fullAnalysis?: string; // Detailed content
}

// --- 2. Mock Data Generation Helper ---

const mockChat = (owner: string, topic: string): ChatMessage[] => [
    { id: 'm1', sender: 'System Bot', role: 'SYSTEM', content: `[自动告警] 监测到 ${topic} 指标异常波动 (Delta > 5%)，请确认是否需要调整假设。`, timestamp: '2023-10-10 09:00' },
    { id: 'm2', sender: owner, role: 'OTHER', content: '收到。正在与供应商核实最新报价。', timestamp: '2023-10-10 09:15' },
    { id: 'm3', sender: 'System Bot', role: 'SYSTEM', content: '[系统核实] 已抓取到供应商 A 的最新报价邮件，单价确认为 16.2w，与您的判断一致。', timestamp: '2023-10-10 09:20' },
    { id: 'm4', sender: '刘总', role: 'ME', content: '这个指标直接影响 G6 毛利率，请务必在周三前给出结论。', timestamp: '2023-10-10 10:30' },
    { id: 'm5', sender: owner, role: 'OTHER', content: '明白，目前初步判断是短期波动，建议保持观望。', timestamp: '2023-10-10 11:00' }
];

const createEvent = (id: string, date: string, title: string, desc: string, impact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL', source: string, sourceType: StrategicEvent['sourceType']): StrategicEvent => ({
    id, date, title, description: desc, impact, source, sourceType
});

// Deep Data Structure Population (3 Levels)
const STRATEGIC_ASSUMPTIONS: Assumption[] = [
    // --- A1: Market Demand ---
    { 
        id: 'A1', code: 'A1', name: '全球新能源车需求持续增长', description: '预计全球 NEV 销量年复合增长率 (CAGR) > 25%。', type: 'MARKET', status: 'GREEN', confidence: 4, owner: '市场战略部 / 王总', risk: '低',
        metrics: { target: 'CAGR > 25%', current: 'CAGR 28%', delta: '+3%' },
        communicationStatus: 'NONE',
        externalData: [
            { id: 'ed1', title: '中国新能源销量 (CPCA)', value: '78.5万辆 (Sep)', trend: '+12% MoM', source: '乘联会 (CPCA) / Quiver', updateTime: '2023-10-31', fullContent: '9月新能源乘用车批发销量达到82.9万辆，同比增长23.0%，环比增长4.2%。今年以来累计批发590.4万辆，同比增长36.0%。零售销量74.6万辆，同比增长22.1%，环比增长4.2%。' }
        ],
        events: [
            createEvent('e1', '2023-11-01', '彭博 BNEF 年度报告', '上调全行业年度销量预期至 1400万辆。', 'POSITIVE', 'Bloomberg NEF', 'EXTERNAL_REPORT')
        ],
        keyPoints: [
            {
                id: 'kp1', date: '2023-09-15', summary: '确认 Q3 市场需求超预期，决定维持激进扩产策略。', 
                actions: [
                    { id: 'ac1', content: '通知采购部锁定 Q4 锂矿长协', owner: '王总', deadline: '2023-09-20', status: 'DONE', verifiedBySystem: true, verificationTime: '2023-09-21 10:00' },
                    { id: 'ac2', content: '更新年度销量预测模型 V2.1', owner: '战略部', deadline: '2023-09-25', status: 'DONE', verifiedBySystem: true, verificationTime: '2023-09-25 14:30' }
                ]
            },
            {
                id: 'kp2', date: '2023-10-10', summary: '主要竞对降价，需评估对市占率影响。', 
                actions: [
                    { id: 'ac3', content: '完成竞对价格弹性测试', owner: '市场部', deadline: '2023-10-20', status: 'IN_PROGRESS', verifiedBySystem: false }
                ]
            }
        ],
        subItems: [
            {
                id: 'A1-1', code: 'A1-1', name: '中国市场需求增速', description: '国内乘用车市场渗透率分析', type: 'MARKET', status: 'GREEN', confidence: 5, owner: '中国区 / 张总', risk: '无', metrics: {target: 'YoY 30%', current: '32%', delta: '+2%'},
                subItems: [
                    { id: 'A1-1.1', code: 'A1-1.1', name: '一线城市置换需求', description: '北上广深存量置换趋势', type: 'MARKET', status: 'GREEN', confidence: 4, owner: '销售一部', risk: '低', metrics: {target: '占比 40%', current: '42%', delta: '+2%'} },
                    { id: 'A1-1.2', code: 'A1-1.2', name: '下沉市场新增量', description: '三四线城市首购用户', type: 'MARKET', status: 'YELLOW', confidence: 3, owner: '渠道部', risk: '中', metrics: {target: '增速 50%', current: '35%', delta: '-15%'} }
                ]
            },
            {
                id: 'A1-2', code: 'A1-2', name: '欧洲市场政策驱动', description: '欧洲各国补贴与碳排放政策', type: 'MARKET', status: 'YELLOW', confidence: 3, owner: '欧洲区 / Li', risk: '政策退坡', metrics: {target: '影响 < 5%', current: '8%', delta: '-3%'},
                subItems: [
                    { id: 'A1-2.1', code: 'A1-2.1', name: '德国补贴政策', description: '企业端补贴取消影响', type: 'POLICY', status: 'RED', confidence: 2, owner: '德国GM', risk: '高', metrics: {target: '0影响', current: '-20%订单', delta: '-20%'} },
                    { id: 'A1-2.2', code: 'A1-2.2', name: '法国碳足迹要求', description: '新的碳足迹积分计算法则', type: 'POLICY', status: 'YELLOW', confidence: 3, owner: '公关部', risk: '中', metrics: {target: '达标', current: '临界', delta: '0'} }
                ]
            }
        ]
    },
    // --- A3: Material Cost ---
    { 
        id: 'A3', code: 'A3', name: '原材料价格维持可控区间', description: '碳酸锂价格波动幅度不超过 ±15%。', type: 'COST', status: 'RED', confidence: 2, owner: '采购中心 / 孙总', risk: '价格战导致上游惜售',
        metrics: { target: 'Li2CO3 < 15w', current: '16.5w', delta: '+10%' },
        chatHistory: mockChat('采购中心 / 孙总', '碳酸锂价格波动'),
        communicationStatus: 'SYSTEM_CONTACTED',
        externalData: [
            { id: 'ed2', title: '碳酸锂现货价格 (SMM)', value: '¥165,000/吨', trend: '-2.4% WoW', source: '上海有色网 (SMM) / Quiver', updateTime: '2023-11-15', fullContent: 'SMM 电池级碳酸锂指数报价 16.5万元/吨。本周市场成交清淡，下游材料厂去库意愿强烈，仅维持刚需采购。上游锂盐厂挺价意愿减弱，预计短期内价格仍有下行空间。' }
        ],
        keyPoints: [
            {
                id: 'kp3', date: '2023-10-05', summary: '现货价格异常反弹，触发二级预警。', 
                actions: [
                    { id: 'ac4', content: '暂停现货采购，消耗库存', owner: '孙总', deadline: '2023-10-10', status: 'IN_PROGRESS', verifiedBySystem: true, verificationTime: '2023-10-06 09:30' },
                    { id: 'ac5', content: '启动期货套保方案 B', owner: '财务部', deadline: '2023-10-12', status: 'PENDING', verifiedBySystem: false }
                ]
            }
        ],
        events: [],
        subItems: [
            {
                id: 'A3-1', code: 'A3-1', name: '锂资源 (Lithium)', description: '电池级碳酸锂', type: 'COST', status: 'RED', confidence: 2, owner: '原材料采购部', risk: '高', metrics: {target: '15万/吨', current: '16.5万/吨', delta: '+1.5万'},
                subItems: [
                    { id: 'A3-1.1', code: 'A3-1.1', name: '澳矿长协价', description: 'Spodumene Concentrate', type: 'COST', status: 'YELLOW', confidence: 3, owner: '战略采购', risk: '中', metrics: {target: '$2000', current: '$2200', delta: '+$200'} },
                    { id: 'A3-1.2', code: 'A3-1.2', name: '国内盐湖提锂', description: '青海盐湖现货', type: 'COST', status: 'RED', confidence: 2, owner: '现货采购', risk: '高', metrics: {target: '14万', current: '16万', delta: '+2万'} }
                ]
            }
        ]
    },
    { id: 'A2', code: 'A2', name: '主要客户产能规划按期推进', description: 'T客户和B客户的新车型产线无重大延期。', type: 'CUSTOMER', status: 'YELLOW', confidence: 3, owner: '销售部 / 赵总', risk: 'T客户德国工厂延期', metrics: { target: '交付达成率 100%', current: '92%', delta: '-8%' }, subItems: [] },
    { id: 'A4', code: 'A4', name: '海外政策环境不发生重大逆转', description: '欧盟碳关税及反补贴调查不产生惩罚性关税。', type: 'POLICY', status: 'RED', confidence: 2, owner: '公共事务部 / 周总', risk: '反补贴调查立案', metrics: { target: '无惩罚性关税', current: '调查中', delta: '高风险' }, events: [], subItems: [], communicationStatus: 'DISCUSSED', chatHistory: mockChat('公共事务部 / 周总', '欧盟反补贴调查') },
    { id: 'A5', code: 'A5', name: '竞品扩产节奏低于行业需求增速', description: '主要竞对产能利用率维持在 80% 左右。', type: 'MARKET', status: 'YELLOW', confidence: 3, owner: '战略情报部 / 吴总', risk: '竞对C大幅降价', metrics: { target: '竞对均价 > 0.5元/Wh', current: '0.45元/Wh', delta: '-10%' }, events: [], subItems: [] },
    { id: 'A6', code: 'A6', name: '新一代电池技术可按期量产', description: '半固态/Base 3 产线良率达到预期', type: 'CAPACITY', status: 'GREEN', confidence: 4, owner: '研究院 / 陈CTO', risk: '低', metrics: { target: 'Base 3 > 97.5%', current: '94.1%', delta: '-3.4%' }, events: [], subItems: [] },
    { id: 'A7', code: 'A7', name: '集团现金流支持扩产投资', description: '经营性现金流净额/营收占比 > 8%。', type: 'COST', status: 'GREEN', confidence: 5, owner: '财务部 / 郑CFO', risk: '低', metrics: { target: 'OCF > 8%', current: '12%', delta: '+4%' }, events: [], subItems: [] },
    { id: 'A8', code: 'A8', name: '关键设备交付不构成瓶颈', description: '涂布机等核心设备交付周期 < 6个月。', type: 'CAPACITY', status: 'GREEN', confidence: 4, owner: '供应链中心 / 冯总', risk: '低', metrics: { target: 'Lead Time 6mo', current: '5.5mo', delta: '-0.5mo' }, events: [], subItems: [] },
    { id: 'A9', code: 'A9', name: '汇率波动处于可管理范围', description: 'USD/CNY 汇率波动在 6.8 - 7.3 之间。', type: 'COST', status: 'YELLOW', confidence: 3, owner: '财务部 / 郑CFO', risk: '汇率波动加剧', metrics: { target: '6.8-7.3', current: '7.32', delta: '超限' }, events: [], subItems: [], communicationStatus: 'SYSTEM_CONTACTED', chatHistory: mockChat('财务部 / 郑CFO', '汇率超限') },
    { id: 'A10', code: 'A10', name: '内部组织能力匹配扩张节奏', description: '海外基地核心管理团队到位率 100%。', type: 'ORG', status: 'GREEN', confidence: 4, owner: '人力资源部 / 钱总', risk: '低', metrics: { target: '到位率 100%', current: '95%', delta: '-5%' }, events: [], subItems: [] },
];

const STRATEGIC_GOALS: Goal[] = [
    { id: 'G1', code: 'G1', name: '集团年度营收 (Revenue)', targetValue: '¥ 600亿', status: 'NORMAL', progress: 88, owner: '销售部 / 赵VP', description: '包含海外业务及国内业务总和' },
    { id: 'G2', code: 'G2', name: '动力电池有效产能 (Capacity)', targetValue: '100 GWh', status: 'NORMAL', progress: 92, owner: '制造部 / 王VP', description: 'Base 1/2/3 累计产能' },
    { id: 'G3', code: 'G3', name: '电芯单位成本 (Cost)', targetValue: '0.45元/Wh', status: 'RISK', progress: 75, owner: '财务部 / 郑CFO', description: 'Ex-works cost' },
    { id: 'G4', code: 'G4', name: '海外业务收入占比', targetValue: '15%', status: 'RISK', progress: 12, owner: '海外事业部 / 李VP', description: '重点关注欧洲市场' },
    { id: 'G5', code: 'G5', name: 'One-Stop 平台渗透率', targetValue: '40%', status: 'NORMAL', progress: 45, owner: '产品部 / 孙VP', description: '新一代集成底盘技术' },
    { id: 'G6', code: 'G6', name: '整体毛利率 (Gross Margin)', targetValue: '13%', status: 'DEVIATED', progress: 10, owner: 'CFO / 郑CFO', description: '扣除原材料波动影响' },
    { id: 'G7', code: 'G7', name: '净利润率 (Net Margin)', targetValue: '6%', status: 'DEVIATED', progress: 4, owner: 'CFO / 郑CFO' },
    { id: 'G8', code: 'G8', name: '年度净利润 (Net Profit)', targetValue: '36亿', status: 'RISK', progress: 70, owner: 'CFO / 郑CFO' },
];

const STRATEGIC_EDGES: GraphEdge[] = [
    { source: 'A1', target: 'G1', type: 'SUPPORT', weight: 'STRONG', description: '市场需求支撑营收' },
    { source: 'A2', target: 'G1', type: 'SUPPORT', weight: 'STRONG', description: '客户订单支撑营收' },
    { source: 'A3', target: 'G3', type: 'CONSTRAINT', weight: 'STRONG', description: '材料价格制约单位成本' },
    { source: 'A3', target: 'G6', type: 'CONSTRAINT', weight: 'STRONG', description: '成本制约毛利' },
    { source: 'A4', target: 'G4', type: 'VETO', weight: 'STRONG', description: '政策风险阻断出海' },
    { source: 'A5', target: 'G6', type: 'CONSTRAINT', weight: 'MEDIUM', description: '竞对价格战压制毛利' },
    { source: 'A6', target: 'G5', type: 'SUPPORT', weight: 'STRONG', description: '技术成功支撑产品平台' },
    { source: 'A6', target: 'G3', type: 'SUPPORT', weight: 'MEDIUM', description: '技术进步降低成本' },
    { source: 'A7', target: 'G2', type: 'SUPPORT', weight: 'STRONG', description: '资金支撑扩产' },
    { source: 'A8', target: 'G2', type: 'CONSTRAINT', weight: 'STRONG', description: '设备交付制约产能爬坡' },
    { source: 'A9', target: 'G8', type: 'CONSTRAINT', weight: 'WEAK', description: '汇率影响最终利润' },
    { source: 'A10', target: 'G4', type: 'SUPPORT', weight: 'MEDIUM', description: '组织保障海外业务' },
];

// --- Helper Functions ---
const findAssumption = (id: string, items: Assumption[]): Assumption | undefined => {
    for (const item of items) {
        if (item.id === id) return item;
        if (item.subItems) {
            const found = findAssumption(id, item.subItems);
            if (found) return found;
        }
    }
    return undefined;
};

// --- Modals ---

const ExternalFactorsModal = ({ data, onClose }: { data: any, onClose: () => void }) => (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-white rounded-xl shadow-2xl w-[500px] flex flex-col overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <TrendingUp size={20} className="text-purple-600"/>
                    高维信息详情 (External Factors)
                </h3>
                <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded text-slate-500"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-6">
                <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-1">{data.title}</h4>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                        <span className="flex items-center gap-1"><Database size={12}/> {data.source}</span>
                        <span className="flex items-center gap-1"><Clock size={12}/> {data.updateTime}</span>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 leading-relaxed font-medium">
                        {data.fullContent}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                        <div className="text-xs text-blue-500 font-bold uppercase">当前数值</div>
                        <div className="text-lg font-bold text-blue-700 mt-1">{data.value}</div>
                    </div>
                    <div className="p-3 bg-purple-50 border border-purple-100 rounded-lg">
                        <div className="text-xs text-purple-500 font-bold uppercase">趋势 (Trend)</div>
                        <div className="text-lg font-bold text-purple-700 mt-1">{data.trend}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const KnowledgeLearningModal = ({ onClose }: { onClose: () => void }) => {
    // Mock Data State
    const [logicList, setLogicList] = useState([
        { id: 1, text: '当原材料价格波动超过 ±15% 时，系统自动触发库存消耗预案，优先使用长协额度。', source: '历史对话: 采购会议纪要 2023-10-05', isEditing: false },
        { id: 2, text: '竞对降价信息需在 24小时内 关联到市场占有率假设 (A1-1) 进行敏感性测试。', source: '决策规则: 市场反应机制 V2.0', isEditing: false }
    ]);
    const [methodList, setMethodList] = useState([
        { id: 1, text: '在价格下行周期，采用 "Just-in-Time" 采购策略优于 "囤货" 策略，可减少资金占用 12%。', source: '复盘报告: 2023 Q3 供应链复盘', isEditing: false },
        { id: 2, text: '对于汇率波动风险，建议将套保比例维持在 40%-60% 区间，以平衡风险与成本。', source: '外部专家建议: 2023-09-12', isEditing: false }
    ]);

    const toggleEdit = (listType: 'logic' | 'method', id: number) => {
        if (listType === 'logic') {
            setLogicList(logicList.map(item => item.id === id ? { ...item, isEditing: !item.isEditing } : item));
        } else {
            setMethodList(methodList.map(item => item.id === id ? { ...item, isEditing: !item.isEditing } : item));
        }
    };

    const handleTextChange = (listType: 'logic' | 'method', id: number, val: string) => {
        if (listType === 'logic') {
            setLogicList(logicList.map(item => item.id === id ? { ...item, text: val } : item));
        } else {
            setMethodList(methodList.map(item => item.id === id ? { ...item, text: val } : item));
        }
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-[700px] max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Sparkles size={20} className="text-yellow-300"/>
                        系统学习与沉淀 (Knowledge Base)
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded text-white"><X size={20}/></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
                    {/* Business Logic Section */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <BrainCircuit size={18} className="text-indigo-600"/>
                            沉淀的业务逻辑 (Business Logic)
                        </h4>
                        <div className="space-y-4">
                            {logicList.map(item => (
                                <div key={item.id} className="relative group">
                                    <div className="flex gap-3 text-sm text-slate-700">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold mt-0.5">{item.id}</span>
                                        <div className="flex-1">
                                            {item.isEditing ? (
                                                <textarea 
                                                    value={item.text} 
                                                    onChange={(e) => handleTextChange('logic', item.id, e.target.value)}
                                                    className="w-full border border-indigo-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                                    rows={3}
                                                />
                                            ) : (
                                                <div className="leading-relaxed bg-slate-50 p-2 rounded border border-transparent hover:border-indigo-100 transition-colors">
                                                    {item.text}
                                                </div>
                                            )}
                                            <div className="mt-1 flex items-center gap-2">
                                                <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                                                    <Link size={8}/> 溯源: {item.source}
                                                </span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => toggleEdit('logic', item.id)}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-indigo-600 transition-all self-start"
                                            title="编辑内容"
                                        >
                                            {item.isEditing ? <CheckCircle2 size={14} className="text-green-600"/> : <Edit2 size={14}/>}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Methodology Section */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <BookOpen size={18} className="text-purple-600"/>
                            学习到的方法论 (Methodology)
                        </h4>
                        <div className="space-y-4">
                            {methodList.map(item => (
                                <div key={item.id} className="relative group">
                                    <div className="p-3 bg-slate-50 rounded border border-slate-100">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="text-xs font-bold text-slate-500 uppercase">策略 #{item.id}</div>
                                            <button 
                                                onClick={() => toggleEdit('method', item.id)}
                                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-purple-600 transition-all"
                                            >
                                                {item.isEditing ? <CheckCircle2 size={12} className="text-green-600"/> : <Edit2 size={12}/>}
                                            </button>
                                        </div>
                                        {item.isEditing ? (
                                            <textarea 
                                                value={item.text} 
                                                onChange={(e) => handleTextChange('method', item.id, e.target.value)}
                                                className="w-full border border-purple-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                                                rows={3}
                                            />
                                        ) : (
                                            <p className="text-sm text-slate-700 leading-relaxed">{item.text}</p>
                                        )}
                                        <div className="mt-2 pt-2 border-t border-slate-200">
                                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                                <Link size={8}/> 溯源: {item.source}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SimulationDetailModal = ({ record, onClose }: { record: SimulationRecord, onClose: () => void }) => (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-white rounded-xl shadow-2xl w-[600px] flex flex-col overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <History size={20} className="text-indigo-600"/>
                    推演复盘详情 (Simulation Review)
                </h3>
                <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded text-slate-500"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-6">
                <div>
                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">推演场景 (Scenario)</div>
                    <h4 className="text-base font-bold text-slate-800">{record.scenario}</h4>
                    <div className="flex items-center gap-3 mt-2 text-xs">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-mono">{record.date}</span>
                        <span className={`px-2 py-0.5 rounded font-bold ${
                            record.accuracy === 'HIGH' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>{record.accuracy} ACCURACY</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                        <div className="text-xs font-bold text-slate-500 uppercase mb-2">评估维度</div>
                        <div className="flex flex-wrap gap-1">
                            {record.dimensions.map(d => (
                                <span key={d} className="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded text-slate-600 font-medium">{d}</span>
                            ))}
                        </div>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                        <div className="text-xs font-bold text-slate-500 uppercase mb-2">推演ID</div>
                        <span className="text-xs font-mono text-slate-700">{record.id}</span>
                    </div>
                </div>

                <div>
                    <div className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                        <BrainCircuit size={12}/> AI 分析结论
                    </div>
                    <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg text-sm text-indigo-900 leading-relaxed">
                        {record.resultSummary}
                        {record.fullAnalysis && <div className="mt-2 pt-2 border-t border-indigo-200 text-xs text-indigo-700">{record.fullAnalysis}</div>}
                    </div>
                </div>

                <div>
                    <div className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                        <CheckSquare size={12}/> 实际结果 (Actual Outcome)
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 leading-relaxed shadow-sm">
                        {record.actualOutcome || "暂无实际结果反馈"}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const KeyPointsModal = ({ 
    nodeId, 
    onClose 
}: { 
    nodeId: string, 
    onClose: () => void 
}) => {
    const node = findAssumption(nodeId, STRATEGIC_ASSUMPTIONS);
    if (!node || !node.keyPoints) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-[650px] max-h-[80vh] flex flex-col overflow-hidden border border-slate-200">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <ListTodo size={20} className="text-blue-600"/>
                        历史对话关键点与行动追踪
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded text-slate-500"><X size={20}/></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {node.keyPoints.map((kp) => (
                        <div key={kp.id} className="relative pl-6 border-l-2 border-slate-200 pb-2">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-blue-500"></div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-bold text-slate-800">{kp.date}</span>
                                <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-500">沟通结论</span>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm text-slate-700 mb-3">
                                {kp.summary}
                            </div>
                            
                            {kp.actions.length > 0 && (
                                <div className="space-y-2">
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                        <ClipboardList size={12}/> 行动落实 (Action Items)
                                    </div>
                                    {kp.actions.map(action => (
                                        <div key={action.id} className="flex items-start gap-3 p-2 border border-slate-100 rounded bg-white hover:border-blue-200 transition-colors">
                                            <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border ${
                                                action.status === 'DONE' ? 'bg-emerald-500 border-emerald-500 text-white' : 
                                                action.status === 'IN_PROGRESS' ? 'bg-blue-100 border-blue-300 text-blue-600' : 
                                                'bg-slate-50 border-slate-300 text-slate-400'
                                            }`}>
                                                {action.status === 'DONE' && <Check size={10} strokeWidth={4}/>}
                                                {action.status === 'IN_PROGRESS' && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>}
                                            </div>
                                            <div className="flex-1">
                                                <div className={`text-sm ${action.status === 'DONE' ? 'line-through text-slate-400' : 'text-slate-800'}`}>{action.content}</div>
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className="text-[10px] text-slate-500">Owner: {action.owner}</span>
                                                    <div className="flex items-center gap-2">
                                                        {action.verifiedBySystem && (
                                                            <span className="text-[9px] text-indigo-600 flex items-center gap-0.5 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100" title={`验证时间: ${action.verificationTime}`}>
                                                                <Bot size={8}/> 系统核实
                                                            </span>
                                                        )}
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                                                            action.status === 'DONE' ? 'bg-emerald-50 text-emerald-600' : 
                                                            action.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600' : 
                                                            'bg-amber-50 text-amber-600'
                                                        }`}>
                                                            {action.status === 'DONE' ? '已完成' : action.status === 'IN_PROGRESS' ? '进行中' : '待处理'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- Draggable Floating Modal ---
const DraggableFloatingModal = ({ 
    nodeId, 
    onClose, 
    onChat,
    onShowKeyPoints // Keeping for FullScreen mode usage, but removing button from footer
}: { 
    nodeId: string, 
    onClose: () => void, 
    onChat: (context: any) => void,
    onShowKeyPoints?: () => void
}) => {
    const [position, setPosition] = useState({ x: window.innerWidth / 2 - 200, y: 100 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [showExternalData, setShowExternalData] = useState<any>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Identify Node Type
    const assumption = findAssumption(nodeId, STRATEGIC_ASSUMPTIONS);
    const goal = STRATEGIC_GOALS.find(g => g.id === nodeId);
    const node: any = assumption || goal;
    const type = assumption ? 'ASSUMPTION' : 'GOAL';

    const handleMouseDown = (e: React.MouseEvent) => {
        if (modalRef.current && (e.target as HTMLElement).closest('.drag-handle')) {
            setIsDragging(true);
            const rect = modalRef.current.getBoundingClientRect();
            setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                setPosition({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
            }
        };
        const handleMouseUp = () => setIsDragging(false);

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragOffset]);

    if (!node) return null;

    return (
        <>
            <div 
                ref={modalRef}
                className="absolute z-50 w-[420px] bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
                style={{ left: position.x, top: position.y }}
                onMouseDown={handleMouseDown}
            >
                {/* Header (Drag Handle) */}
                <div className="bg-slate-50 border-b border-slate-200 p-3 flex justify-between items-center cursor-grab active:cursor-grabbing drag-handle select-none">
                    <div className="flex items-center gap-2">
                        <Move size={14} className="text-slate-400"/>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            type === 'GOAL' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                        }`}>{type === 'GOAL' ? '战略目标' : '战略假设'}</span>
                        <span className="font-mono text-xs text-slate-500">{node.code}</span>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-200"><X size={16}/></button>
                </div>

                {/* Content */}
                <div className="p-5 max-h-[600px] overflow-y-auto cursor-default" onMouseDown={(e) => e.stopPropagation()}>
                    <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight">{node.name}</h3>
                    <p className="text-xs text-slate-500 mb-4 leading-relaxed bg-slate-50 p-2 rounded border border-slate-100">{node.description || '暂无描述'}</p>

                    {/* New: External Data Icon for Assumptions */}
                    {type === 'ASSUMPTION' && node.externalData && node.externalData.length > 0 && (
                        <div className="mb-4">
                            <div className="text-[10px] text-slate-400 uppercase font-bold mb-2 flex items-center gap-1">
                                <Globe size={10}/> 外部高维信息 (External Factors)
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {node.externalData.map((ed: any) => (
                                    <div 
                                        key={ed.id}
                                        onClick={() => setShowExternalData(ed)}
                                        className="flex items-center gap-2 px-3 py-2 bg-purple-50 border border-purple-100 hover:border-purple-300 rounded-lg cursor-pointer transition-colors group"
                                    >
                                        <TrendingUp size={14} className="text-purple-600"/>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-purple-800">{ed.title}</span>
                                            <span className="text-[9px] text-purple-600">{ed.trend}</span>
                                        </div>
                                        <ExternalLink size={12} className="text-purple-400 opacity-0 group-hover:opacity-100 ml-1"/>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Metrics / Status */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="border border-slate-200 rounded-lg p-3 bg-white">
                            <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">当前状态</div>
                            <div className={`text-sm font-bold flex items-center gap-1 ${
                                node.status === 'RED' || node.status === 'RISK' ? 'text-red-600' :
                                node.status === 'YELLOW' || node.status === 'DEVIATED' ? 'text-amber-600' : 'text-emerald-600'
                            }`}>
                                {node.status}
                            </div>
                        </div>
                        {node.targetValue && (
                            <div className="border border-slate-200 rounded-lg p-3 bg-white">
                                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">目标值</div>
                                <div className="text-sm font-bold text-slate-800">{node.targetValue}</div>
                            </div>
                        )}
                        {node.metrics && (
                            <div className="border border-slate-200 rounded-lg p-3 bg-white col-span-2">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] text-slate-400 uppercase font-bold">KPI 进度</span>
                                    <span className="text-xs font-mono font-bold text-slate-700">{node.metrics.current} / {node.metrics.target}</span>
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                    <div className={`h-full ${node.metrics.delta.includes('-') ? 'bg-red-500' : 'bg-emerald-500'}`} style={{width: '60%'}}></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Person In Charge & Communication */}
                    <div className="border-t border-slate-100 pt-4">
                        <div className="text-xs font-bold text-slate-500 uppercase mb-3">负责人 (Owner)</div>
                        <div className="flex items-center justify-between p-3 border border-indigo-100 bg-indigo-50/50 rounded-xl mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-white text-indigo-600 flex items-center justify-center font-bold border border-indigo-200 shadow-sm text-xs">
                                    {node.owner ? node.owner[0] : 'U'}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-800 text-sm">{node.owner || '未分配'}</div>
                                    <div className="text-[10px] text-indigo-600 flex items-center gap-1">
                                        <Clock size={10}/> 最近活跃: 2小时前
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-3 bg-slate-50 border-t border-slate-200 flex gap-2">
                    <button 
                        onClick={() => {
                            const initMsg = {
                                id: 'sys_init',
                                sender: 'System',
                                role: 'SYSTEM',
                                isStructured: true,
                                content: `**历史核实记录**\n\n- 2023-09-15: 锁定 Q4 锂矿长协 (系统已核实邮件确认)\n- 2023-10-10: 竞对价格弹性测试 (等待人工录入)\n\n负责人 ${node.owner} 已在线。`,
                                timestamp: 'Now'
                            };
                            onChat({ 
                                target: node.owner, 
                                topic: node.name, 
                                history: node.chatHistory || [initMsg],
                                nodeId: node.id // Pass nodeId for fetching Key Points
                            });
                        }}
                        className="flex-1 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <MessageSquare size={14}/> 发起讨论
                    </button>
                </div>
            </div>
            
            {showExternalData && <ExternalFactorsModal data={showExternalData} onClose={() => setShowExternalData(null)} />}
        </>
    );
};

const SimulationModule = ({ onBack }: { onBack: () => void }) => {
    const [selectedAssumptions, setSelectedAssumptions] = useState<string[]>(['A1', 'A3']);
    const [selectedDimensions, setSelectedDimensions] = useState<string[]>(['COST', 'RISK']);
    const [chatInput, setChatInput] = useState('');
    const [simChat, setSimChat] = useState<ChatMessage[]>([
        { id: 's1', sender: 'AI Strategist', role: 'SYSTEM', content: '您好！我是决策推演助手。请在左侧选择您希望纳入考量的假设和维度，我将为您生成情景分析报告。', timestamp: 'Now' }
    ]);
    const [history, setHistory] = useState<SimulationRecord[]>([
        { id: 'SIM-001', date: '2023-10-15', scenario: '碳酸锂价格暴跌至 10w', dimensions: ['COST'], resultSummary: '毛利提升至 18%，但需注意库存跌价损失。', accuracy: 'HIGH', actualOutcome: '实际跌至 12w，符合预期', fullAnalysis: '根据历史数据模型，当碳酸锂价格跌破10w时，虽然直接材料成本降低，但需计提大额库存跌价准备（约2亿）。建议配合期货套保策略。' },
        { id: 'SIM-002', date: '2023-11-01', scenario: '欧洲反补贴税率 20%', dimensions: ['RISK', 'PROFIT'], resultSummary: '欧洲销量预计下滑 30%，建议加速匈牙利建厂。', accuracy: 'MEDIUM', fullAnalysis: '若税率提升至20%，本地化生产将成为唯一解。匈牙利工厂需提前6个月启动设备采购。' }
    ]);
    const [viewingSimulation, setViewingSimulation] = useState<SimulationRecord | null>(null);
    const [showWisdomModal, setShowWisdomModal] = useState(false);

    const handleSimulate = () => {
        if (selectedAssumptions.length === 0) return;
        const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'Me', role: 'ME', content: `基于假设 [${selectedAssumptions.join(', ')}] 和维度 [${selectedDimensions.join(', ')}] 开始推演。`, timestamp: 'Now' };
        setSimChat(prev => [...prev, userMsg]);
        
        setTimeout(() => {
            const reply: ChatMessage = { 
                id: (Date.now()+1).toString(), 
                sender: 'AI Strategist', 
                role: 'SYSTEM', 
                content: `正在构建推演模型...\n\n**分析报告概要**：\n1. **成本影响**：若 A3 (原材料) 维持现状，结合 A1 (需求增长)，G6 (毛利率) 有望回升至 12.5%。\n2. **风险提示**：A4 (政策) 仍是最大变量。若叠加汇率波动 (A9)，净利润可能承压。\n3. **建议行动**：建议锁定 Q1 长协价格，并对冲汇率风险。`, 
                timestamp: 'Now' 
            };
            setSimChat(prev => [...prev, reply]);
        }, 1500);
    };

    return (
        <div className="h-full bg-slate-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                        <ArrowLeft size={20}/>
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Scale className="text-purple-600" />
                            决策沙盘推演 (Decision Wargaming)
                        </h1>
                        <p className="text-xs text-slate-500">基于多维假设的 AI 情景模拟与复盘系统</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-hidden flex">
                {/* Left: Configuration */}
                <div className="w-80 bg-white border-r border-slate-200 flex flex-col overflow-y-auto p-6">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Settings2 size={14}/> 推演配置
                    </h3>
                    
                    <div className="mb-6">
                        <label className="text-sm font-bold text-slate-700 mb-2 block">1. 纳入考量的假设</label>
                        <div className="space-y-2">
                            {STRATEGIC_ASSUMPTIONS.map(a => (
                                <label key={a.id} className="flex items-start gap-2 p-2 border border-slate-100 rounded hover:bg-slate-50 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedAssumptions.includes(a.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) setSelectedAssumptions([...selectedAssumptions, a.id]);
                                            else setSelectedAssumptions(selectedAssumptions.filter(id => id !== a.id));
                                        }}
                                        className="mt-1 rounded text-purple-600 focus:ring-purple-500"
                                    />
                                    <div>
                                        <div className="text-xs font-bold text-slate-700">{a.code} {a.name}</div>
                                        <div className="text-[10px] text-slate-400">{a.risk}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="text-sm font-bold text-slate-700 mb-2 block">2. 评估维度</label>
                        <div className="flex flex-wrap gap-2">
                            {['COST', 'RISK', 'PROFIT', 'SPEED', 'QUALITY'].map(d => (
                                <button 
                                    key={d}
                                    onClick={() => {
                                        if (selectedDimensions.includes(d)) setSelectedDimensions(selectedDimensions.filter(x => x !== d));
                                        else setSelectedDimensions([...selectedDimensions, d]);
                                    }}
                                    className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
                                        selectedDimensions.includes(d) 
                                        ? 'bg-purple-600 text-white border-purple-600' 
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-purple-300'
                                    }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={handleSimulate}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 font-bold text-sm"
                    >
                        <Sparkles size={16}/> 开始推演
                    </button>
                </div>

                {/* Center: Interaction */}
                <div className="flex-1 bg-slate-50 flex flex-col relative">
                    {/* Chat Header with Wisdom Icon */}
                    <div className="px-6 py-3 border-b border-slate-200 bg-white flex justify-between items-center">
                        <div className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Bot size={16} className="text-purple-600"/> AI 助手在线
                        </div>
                        <button 
                            onClick={() => setShowWisdomModal(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg text-xs font-bold hover:bg-yellow-100 transition-colors shadow-sm"
                        >
                            <Sparkles size={14} className="text-yellow-600"/> 决策智慧
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {simChat.map(msg => (
                            <div key={msg.id} className={`flex gap-4 ${msg.role === 'ME' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    msg.role === 'SYSTEM' ? 'bg-purple-600 text-white' : 'bg-slate-300 text-slate-600'
                                }`}>
                                    {msg.role === 'SYSTEM' ? <BrainCircuit size={20}/> : <User size={20}/>}
                                </div>
                                <div className={`max-w-[80%] p-4 rounded-2xl text-sm shadow-sm ${
                                    msg.role === 'ME' ? 'bg-white text-slate-800 rounded-tr-none border border-slate-200' : 'bg-white text-slate-800 rounded-tl-none border border-purple-100'
                                }`}>
                                    <div className="font-bold text-xs text-slate-400 mb-1">{msg.sender}</div>
                                    <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-slate-200 flex gap-3">
                        <input 
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                            placeholder="输入更多约束条件或追问细节..."
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && chatInput) {
                                    setSimChat(prev => [...prev, { id: Date.now().toString(), sender: 'Me', role: 'ME', content: chatInput, timestamp: 'Now' }]);
                                    setChatInput('');
                                    setTimeout(() => {
                                        setSimChat(prev => [...prev, { id: (Date.now()+1).toString(), sender: 'AI Strategist', role: 'SYSTEM', content: '收到补充条件，正在重新计算概率模型...', timestamp: 'Now' }]);
                                    }, 1000);
                                }
                            }}
                        />
                        <button className="p-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-sm">
                            <Send size={18}/>
                        </button>
                    </div>
                </div>

                {/* Right: History & Feedback */}
                <div className="w-80 bg-white border-l border-slate-200 flex flex-col p-6 overflow-y-auto">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <History size={14}/> 历史推演复盘
                    </h3>
                    
                    <div className="space-y-4">
                        {history.map(rec => (
                            <div 
                                key={rec.id} 
                                onClick={() => setViewingSimulation(rec)}
                                className="p-4 border border-slate-200 rounded-xl bg-slate-50 hover:bg-white hover:shadow-md hover:border-purple-200 transition-all group cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-mono text-slate-400">{rec.date}</span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                        rec.accuracy === 'HIGH' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                    }`}>{rec.accuracy} ACCURACY</span>
                                </div>
                                <div className="text-xs font-bold text-slate-800 mb-1 group-hover:text-purple-700 transition-colors">{rec.scenario}</div>
                                <div className="text-[10px] text-slate-500 mb-3 line-clamp-2">{rec.resultSummary}</div>
                                
                                <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-slate-400">实际结果:</span>
                                    <span className="text-[10px] text-blue-600 group-hover:underline">查看详情</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {viewingSimulation && <SimulationDetailModal record={viewingSimulation} onClose={() => setViewingSimulation(null)} />}
            {showWisdomModal && <KnowledgeLearningModal onClose={() => setShowWisdomModal(false)} />}
        </div>
    );
};

// --- UPDATED ThreeLayerGraph ---
const ThreeLayerGraph = ({ 
    activeNode, 
    setActiveNode, 
    fullScreen = false 
}: { 
    activeNode: string | null, 
    setActiveNode: (id: string | null) => void, 
    fullScreen?: boolean 
}) => {
    const [graphExpandedIds, setGraphExpandedIds] = useState<Set<string>>(new Set(['A1', 'A3', 'A1-1', 'A3-1'])); 
    
    // Zoom & Pan State
    const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
    const [isPanning, setIsPanning] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    
    // Node Drag State
    const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
    const [nodeOffsets, setNodeOffsets] = useState<Record<string, {x: number, y: number}>>({});
    
    // Hover State for Action Tooltip
    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (activeNode) {
            const parentId = activeNode.split('-').slice(0, -1).join('-');
            if (parentId) {
                setGraphExpandedIds(prev => new Set(prev).add(parentId));
            }
        }
    }, [activeNode]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!draggingNodeId) {
            setIsPanning(true);
            setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
        }
    };

    const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
        e.stopPropagation();
        setDraggingNodeId(nodeId);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (draggingNodeId) {
            const dx = e.movementX / transform.k;
            const dy = e.movementY / transform.k;
            setNodeOffsets(prev => ({
                ...prev,
                [draggingNodeId]: {
                    x: (prev[draggingNodeId]?.x || 0) + dx,
                    y: (prev[draggingNodeId]?.y || 0) + dy
                }
            }));
        } else if (isPanning) {
            setTransform({ ...transform, x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
        }
    };

    const handleMouseUp = () => {
        setIsPanning(false);
        setDraggingNodeId(null);
    };
    const handleMouseLeave = () => {
        setIsPanning(false);
        setDraggingNodeId(null);
        setHoveredNodeId(null);
    };

    const handleZoom = (delta: number) => {
        setTransform(prev => ({ 
            ...prev, 
            k: Math.max(0.2, Math.min(4, prev.k + delta)) 
        }));
    };

    const handleReset = () => {
        setTransform({ x: 0, y: 0, k: 1 });
        setNodeOffsets({}); 
    };

    // --- Layout Logic: 3 Levels Deep ---
    const ROOT_X = 850; 
    const GOAL_X = 1200; 
    const X_OFFSET = 280;
    const Y_ROW_HEIGHT = 80;

    interface RenderNode extends Assumption {
        x: number;
        y: number;
        depth: number;
        hasChildren: boolean;
        isExpanded: boolean;
    }

    const { flatNodes, totalHeight } = useMemo(() => {
        const nodes: RenderNode[] = [];

        const layout = (items: Assumption[], depth: number, startY: number): { nodes: RenderNode[], height: number } => {
            let yCursor = startY;
            let resultNodes: RenderNode[] = [];

            items.forEach(item => {
                const isExpanded = graphExpandedIds.has(item.id);
                const hasChildren = !!(item.subItems && item.subItems.length > 0);
                
                let myY = yCursor;
                let childNodes: RenderNode[] = [];
                let childrenHeight = 0;

                if (isExpanded && hasChildren) {
                    const childLayout = layout(item.subItems!, depth + 1, yCursor);
                    childNodes = childLayout.nodes;
                    childrenHeight = childLayout.height;
                    
                    if (childNodes.length > 0) {
                        const firstChildY = childNodes[0].y;
                        const lastChildY = childNodes[childNodes.length - 1].y;
                        myY = (firstChildY + lastChildY) / 2; 
                    }
                    yCursor += childrenHeight;
                } else {
                    myY = yCursor + Y_ROW_HEIGHT / 2 - 20;
                    yCursor += Y_ROW_HEIGHT;
                }

                const myX = ROOT_X - (depth * X_OFFSET);

                resultNodes.push({
                    ...item,
                    x: myX,
                    y: myY,
                    depth,
                    hasChildren,
                    isExpanded
                });
                resultNodes = resultNodes.concat(childNodes);
            });

            return { nodes: resultNodes, height: Math.max(yCursor - startY, Y_ROW_HEIGHT) };
        };

        const layoutResult = layout(STRATEGIC_ASSUMPTIONS, 0, 40);
        return { flatNodes: layoutResult.nodes, totalHeight: Math.max(800, layoutResult.height + 100) };

    }, [graphExpandedIds]);

    const toggleNode = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const newSet = new Set(graphExpandedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setGraphExpandedIds(newSet);
    };

    const goalNodes = STRATEGIC_GOALS.map((g, i) => ({
        ...g,
        x: GOAL_X,
        y: 60 + i * (totalHeight / STRATEGIC_GOALS.length)
    }));

    const parentChildEdges = useMemo(() => {
        const edges: {x1:number, y1:number, x2:number, y2:number}[] = [];
        const nodeMap = new Map(flatNodes.map(n => [n.id, n]));
        
        flatNodes.forEach(node => {
            if (node.subItems && node.isExpanded) {
                node.subItems.forEach(child => {
                    const childNode = nodeMap.get(child.id);
                    if (childNode) {
                        const pOffset = nodeOffsets[node.id] || {x:0, y:0};
                        const cOffset = nodeOffsets[childNode.id] || {x:0, y:0};

                        // Arrow from Child (Left) to Parent (Right)
                        edges.push({
                            x1: childNode.x + cOffset.x + 200, 
                            y1: childNode.y + cOffset.y + 18,  
                            x2: node.x + pOffset.x,            
                            y2: node.y + pOffset.y + 18
                        });
                    }
                });
            }
        });
        return edges;
    }, [flatNodes, nodeOffsets]);

    const causalEdges = useMemo(() => {
        const edges: {x1:number, y1:number, x2:number, y2:number, color: string, style: string}[] = [];
        const nodeMap = new Map(flatNodes.map(n => [n.id, n])); 
        
        STRATEGIC_EDGES.forEach(edge => {
            const sourceNode = nodeMap.get(edge.source);
            const targetNode = goalNodes.find(g => g.id === edge.target);
            
            if (sourceNode && targetNode) {
                const sOffset = nodeOffsets[sourceNode.id] || {x:0, y:0};
                const tOffset = nodeOffsets[targetNode.id] || {x:0, y:0};

                edges.push({
                    x1: sourceNode.x + sOffset.x + 200,
                    y1: sourceNode.y + sOffset.y + 18,
                    x2: targetNode.x + tOffset.x,
                    y2: targetNode.y + tOffset.y + 18,
                    color: edge.type === 'SUPPORT' ? '#10b981' : edge.type === 'CONSTRAINT' ? '#f59e0b' : '#ef4444',
                    style: edge.type === 'VETO' ? '5,5' : 'none'
                });
            }
        });
        return edges;
    }, [flatNodes, goalNodes, nodeOffsets]);

    return (
        <div 
            ref={containerRef}
            className={`relative bg-slate-50 border-r border-slate-200 overflow-hidden ${draggingNodeId ? 'cursor-grabbing' : isPanning ? 'cursor-grabbing' : 'cursor-grab'} ${fullScreen ? 'h-full' : 'h-full'}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
        >
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-1 bg-white border border-slate-200 rounded-lg shadow-sm p-1">
                <button onClick={() => handleZoom(0.1)} className="p-1.5 hover:bg-slate-100 rounded text-slate-600"><ZoomIn size={18}/></button>
                <button onClick={() => handleZoom(-0.1)} className="p-1.5 hover:bg-slate-100 rounded text-slate-600"><ZoomOut size={18}/></button>
                <button onClick={handleReset} className="p-1.5 hover:bg-slate-100 rounded text-slate-600"><RotateCcw size={18}/></button>
            </div>

            <svg width="100%" height="100%" className="pointer-events-none">
                <defs>
                    <marker id="arrow-support" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#10b981" /></marker>
                    <marker id="arrow-constraint" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#f59e0b" /></marker>
                    <marker id="arrow-veto" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#ef4444" /></marker>
                    <marker id="arrow-tree" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#94a3b8" /></marker>
                </defs>

                <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.k})`}>
                    {parentChildEdges.map((e, i) => (
                        <path key={`pc-${i}`} d={`M ${e.x1} ${e.y1} C ${e.x1 + 50} ${e.y1}, ${e.x2 - 50} ${e.y2}, ${e.x2} ${e.y2}`} stroke="#94a3b8" strokeWidth="1.5" fill="none" markerEnd="url(#arrow-tree)"/>
                    ))}
                    {causalEdges.map((e, i) => (
                        <path key={`causal-${i}`} d={`M ${e.x1} ${e.y1} C ${e.x1 + 100} ${e.y1}, ${e.x2 - 100} ${e.y2}, ${e.x2} ${e.y2}`} stroke={e.color} strokeWidth="2" fill="none" strokeDasharray={e.style} opacity={0.6} markerEnd={e.color === '#10b981' ? 'url(#arrow-support)' : e.color === '#f59e0b' ? 'url(#arrow-constraint)' : 'url(#arrow-veto)'}/>
                    ))}

                    {/* Assumption Nodes */}
                    {flatNodes.map(node => {
                        const offset = nodeOffsets[node.id] || {x:0, y:0};
                        const hasKeyPoints = node.keyPoints && node.keyPoints.length > 0;
                        
                        return (
                            <g 
                                key={node.id} 
                                transform={`translate(${node.x + offset.x}, ${node.y + offset.y})`}
                                className="cursor-grab active:cursor-grabbing group pointer-events-auto"
                                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                                onClick={() => setActiveNode(node.id)}
                            >
                                <rect width="200" height="36" rx="6" fill="white" stroke={activeNode === node.id ? '#3b82f6' : node.status === 'RED' ? '#fca5a5' : '#cbd5e1'} strokeWidth={activeNode === node.id ? 2 : 1} className="shadow-sm transition-all group-hover:shadow-md"/>
                                <circle cx="18" cy="18" r="6" fill={node.status === 'RED' ? '#ef4444' : node.status === 'YELLOW' ? '#f59e0b' : '#10b981'} />
                                <text x="32" y="22" fontSize="10" fill="#64748b" fontWeight="bold" fontFamily="monospace">{node.code}</text>
                                <text x="70" y="22" fontSize="11" fill="#1e293b" fontWeight="medium" clipPath="inset(0 0 0 0)">{node.name.length > 12 ? node.name.substring(0, 12) + '...' : node.name}</text>
                                
                                {/* Communication Icon */}
                                {node.communicationStatus && node.communicationStatus !== 'NONE' && (
                                    <g transform="translate(180, 18)">
                                        <circle cx="0" cy="0" r="8" fill={node.communicationStatus === 'DISCUSSED' ? '#eff6ff' : '#fffbeb'} />
                                        <MessageSquare size={10} className={node.communicationStatus === 'DISCUSSED' ? 'text-blue-600' : 'text-amber-600'} x="-5" y="-5"/>
                                    </g>
                                )}

                                {/* Action Tracker Label (New) */}
                                {hasKeyPoints && (
                                    <g 
                                        transform="translate(160, 22)"
                                        onMouseEnter={() => setHoveredNodeId(node.id)}
                                        onMouseLeave={() => setHoveredNodeId(null)}
                                        className="cursor-pointer hover:scale-110 transition-transform"
                                    >
                                        <circle cx="0" cy="0" r="7" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
                                        <ListTodo size={8} className="text-slate-500" x="-4" y="-4"/>
                                    </g>
                                )}

                                {node.hasChildren && (
                                    <g transform="translate(0, 18)" onClick={(e) => toggleNode(e, node.id)} className="cursor-pointer hover:scale-110 transition-transform">
                                        <circle cx="0" cy="0" r="8" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
                                        {node.isExpanded ? <line x1="-4" y1="0" x2="4" y2="0" stroke="#475569" strokeWidth="1.5" /> : <><line x1="-4" y1="0" x2="4" y2="0" stroke="#475569" strokeWidth="1.5" /><line x1="0" y1="-4" x2="0" y2="4" stroke="#475569" strokeWidth="1.5" /></>}
                                    </g>
                                )}

                                {/* Hover Tooltip for Action Tracker */}
                                {hoveredNodeId === node.id && node.keyPoints && (
                                    <foreignObject x="100" y="30" width="250" height="200" className="pointer-events-none z-50 overflow-visible">
                                        <div className="bg-white rounded-lg shadow-xl border border-slate-200 p-3 text-left">
                                            <div className="text-[10px] font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                                                <ListTodo size={12}/> 行动落实情况
                                            </div>
                                            <div className="space-y-2">
                                                {node.keyPoints[0].actions.slice(0, 3).map(act => (
                                                    <div key={act.id} className="flex items-start gap-2">
                                                        <div className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                                            act.status === 'DONE' ? 'bg-emerald-500' : 
                                                            act.status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-slate-300'
                                                        }`}></div>
                                                        <div>
                                                            <div className="text-xs text-slate-800 leading-tight">{act.content}</div>
                                                            <div className="text-[9px] text-slate-400 mt-0.5">{act.status === 'DONE' ? '已完成' : act.status === 'IN_PROGRESS' ? '进行中' : '待处理'} • {act.owner}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </foreignObject>
                                )}
                            </g>
                        );
                    })}

                    {/* Goal Nodes */}
                    {goalNodes.map(node => {
                        const offset = nodeOffsets[node.id] || {x:0, y:0};
                        return (
                            <g 
                                key={node.id} 
                                transform={`translate(${node.x + offset.x}, ${node.y + offset.y})`}
                                className="cursor-grab active:cursor-grabbing hover:opacity-80 transition-opacity pointer-events-auto"
                                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                                onClick={() => setActiveNode(node.id)}
                            >
                                <rect width="180" height="40" rx="20" fill="white" stroke={activeNode === node.id ? '#3b82f6' : '#cbd5e1'} strokeWidth={activeNode === node.id ? 2 : 1} filter="drop-shadow(0px 1px 2px rgba(0,0,0,0.05))"/>
                                <text x="20" y="16" fontSize="9" fill="#64748b" fontWeight="bold">{node.code}</text>
                                <text x="20" y="30" fontSize="12" fill="#1e293b" fontWeight="bold">{node.targetValue}</text>
                                <text x="90" y="24" fontSize="10" fill="#475569" textAnchor="start">{node.name.substring(0,8)}...</text>
                                <circle cx="165" cy="20" r="4" fill={node.status === 'RISK' ? '#ef4444' : node.status === 'DEVIATED' ? '#f59e0b' : '#3b82f6'} />
                            </g>
                        );
                    })}
                </g>
            </svg>
        </div>
    );
};

const ExpandedAnalysisModal = ({ onClose, initialActiveNode }: { onClose: () => void, initialActiveNode: string | null }) => {
    const [activeNode, setActiveNode] = useState<string | null>(initialActiveNode);
    const [chatContext, setChatContext] = useState<any>(null);
    const [showKeyPointsModal, setShowKeyPointsModal] = useState(false);

    return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 relative z-20">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Network className="text-purple-600"/> 全局归因图谱 (Full Causal Graph)
                    </h2>
                    <p className="text-xs text-slate-500">查看战略假设与目标之间的完整因果链路</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={onClose} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
                        <X size={20}/>
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-hidden relative bg-slate-50">
                <ThreeLayerGraph activeNode={activeNode} setActiveNode={setActiveNode} fullScreen={true} />
                {/* Draggable Modal inside Full Screen */}
                {activeNode && (
                     <DraggableFloatingModal 
                        nodeId={activeNode} 
                        onClose={() => setActiveNode(null)} 
                        onChat={(ctx) => setChatContext(ctx)}
                        onShowKeyPoints={() => setShowKeyPointsModal(true)}
                     />
                )}
            </div>
            
            {showKeyPointsModal && activeNode && (
                <KeyPointsModal nodeId={activeNode} onClose={() => setShowKeyPointsModal(false)} />
            )}

            {chatContext && (
                <div className="absolute bottom-6 right-6 z-50">
                    <AIChatWidget initialContext={chatContext} />
                </div>
            )}
        </div>
    );
};

export const AIChatWidget = ({ initialContext }: { initialContext?: any }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '1', sender: 'Copilot', role: 'SYSTEM', content: '您好！我是战略助理 AI。', timestamp: 'Now' }
    ]);
    const [input, setInput] = useState('');
    const [showLearning, setShowLearning] = useState(false);
    const [showKeyPoints, setShowKeyPoints] = useState(false);

    useEffect(() => {
        if (initialContext) {
            setIsOpen(true);
            const introContent = initialContext.topic 
                ? `正在为您连接负责人 ${initialContext.target || ''}...\n关于: ${initialContext.topic}` 
                : `正在为您连接负责人 ${initialContext.target || ''}...`;
            
            setMessages([
                { id: '1', sender: 'System', role: 'SYSTEM', content: introContent, timestamp: 'Now' },
                ...(initialContext.history || [])
            ]);
        }
    }, [initialContext]);

    const handleSend = () => {
        if (!input.trim()) return;
        const newMsg: ChatMessage = { id: Date.now().toString(), sender: 'Me', role: 'ME', content: input, timestamp: 'Now' };
        setMessages([...messages, newMsg]);
        setInput('');
        
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: (Date.now()+1).toString(),
                sender: 'Copilot',
                role: 'SYSTEM',
                content: '正在分析影响链路... 这是一个模拟回复。',
                timestamp: 'Now'
            }]);
        }, 1000);
    };

    return (
        <div className="flex flex-col items-end">
            {isOpen && (
                <div className="bg-white w-[380px] h-[500px] rounded-2xl shadow-2xl border border-slate-200 mb-4 pointer-events-auto flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white flex-shrink-0">
                        <div className="flex items-center gap-2 font-bold">
                            <Bot size={20} className="text-white"/> 战略助理 Copilot
                        </div>
                        <div className="flex items-center gap-2">
                            {initialContext?.nodeId && (
                                <button 
                                    onClick={() => setShowKeyPoints(true)} 
                                    className="hover:bg-white/20 p-1.5 rounded transition-colors text-white" 
                                    title="历史对话关键点"
                                >
                                    <ListTodo size={16}/>
                                </button>
                            )}
                            <button onClick={() => setShowLearning(true)} className="hover:bg-white/20 p-1 rounded transition-colors text-white flex items-center gap-1 text-xs font-medium" title="学习到的业务逻辑">
                                <Sparkles size={14}/> 决策智慧
                            </button>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded transition-colors"><X size={16}/></button>
                        </div>
                    </div>
                    <div className="flex-1 bg-slate-50 p-4 overflow-y-auto space-y-4">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex gap-3 ${msg.role === 'ME' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${
                                    msg.role === 'SYSTEM' ? 'bg-indigo-500' : 'bg-blue-600'
                                }`}>
                                    {msg.role === 'SYSTEM' ? <Bot size={16}/> : <User size={16}/>}
                                </div>
                                <div className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-sm ${
                                    msg.role === 'ME' ? 'bg-blue-600 text-white rounded-tr-none' : 
                                    'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
                                }`}>
                                    {msg.isStructured ? (
                                        <div className="whitespace-pre-wrap leading-relaxed text-xs">
                                            {msg.content}
                                        </div>
                                    ) : (
                                        msg.content
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-3 bg-white border-t border-slate-100 flex gap-2 flex-shrink-0">
                        <input 
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-all"
                            placeholder="输入回复..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button onClick={handleSend} className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
                            <Send size={18}/>
                        </button>
                    </div>
                </div>
            )}

            {showLearning && <KnowledgeLearningModal onClose={() => setShowLearning(false)} />}
            {showKeyPoints && initialContext?.nodeId && (
                <KeyPointsModal nodeId={initialContext.nodeId} onClose={() => setShowKeyPoints(false)} />
            )}

            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="pointer-events-auto w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 group"
            >
                {isOpen ? <ChevronDown size={28}/> : <MessageSquare size={28} className="group-hover:animate-pulse"/>}
            </button>
        </div>
    );
};

export const AnnualPlan = ({ initialContext }: { initialContext?: any }) => {
    const [viewMode, setViewMode] = useState<'GRAPH' | 'SIMULATION'>('GRAPH');
    const [activeNodeId, setActiveNodeId] = useState<string | null>(initialContext?.targetNode || null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [chatContext, setChatContext] = useState<any>(null);

    // Effect to handle navigation context updates
    useEffect(() => {
        if (initialContext?.targetNode) {
            setActiveNodeId(initialContext.targetNode);
        }
    }, [initialContext]);

    return (
        <div className="flex h-full flex-col bg-slate-50 relative">
             {viewMode === 'SIMULATION' ? (
                 <SimulationModule onBack={() => setViewMode('GRAPH')} />
             ) : (
                 <>
                    {/* Header */}
                    <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 z-10">
                         <div className="flex items-center gap-3">
                             <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center text-purple-600">
                                 <Target size={18}/>
                             </div>
                             <div>
                                 <h1 className="font-bold text-slate-800 text-sm">年度战略计划 (Annual Plan 2024)</h1>
                                 <div className="text-[10px] text-slate-500">版本 v2.4 • 最后更新: 今天 09:30</div>
                             </div>
                         </div>
                         <div className="flex items-center gap-3">
                             <button 
                                onClick={() => setViewMode('SIMULATION')}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded text-xs font-medium hover:bg-slate-50 transition-colors"
                             >
                                 <Scale size={14}/> 沙盘推演
                             </button>
                             <button 
                                onClick={() => setIsFullScreen(true)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded text-xs font-medium hover:bg-purple-700 transition-colors shadow-sm"
                             >
                                 <Maximize2 size={14}/> 全屏图谱
                             </button>
                         </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 overflow-hidden relative">
                        <ThreeLayerGraph activeNode={activeNodeId} setActiveNode={setActiveNodeId} />
                        
                        {/* Draggable Modal for Active Node */}
                        {activeNodeId && (
                            <DraggableFloatingModal 
                                nodeId={activeNodeId} 
                                onClose={() => setActiveNodeId(null)}
                                onChat={(ctx) => setChatContext(ctx)}
                            />
                        )}
                    </div>
                 </>
             )}

             {/* Full Screen Modal */}
             {isFullScreen && (
                 <ExpandedAnalysisModal 
                    initialActiveNode={activeNodeId} 
                    onClose={() => setIsFullScreen(false)} 
                 />
             )}

             {/* AI Chat Widget */}
             <div className="absolute bottom-6 right-6 z-40 pointer-events-none">
                 <AIChatWidget initialContext={chatContext} />
             </div>
        </div>
    );
};