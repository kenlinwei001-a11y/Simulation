
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
    Settings, 
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
    MessageCircle, 
    Newspaper, 
    Landmark, 
    Search, 
    Share2, 
    MoreVertical, 
    Layout, 
    Table, 
    GitCommit, 
    Users, 
    Mic, 
    PenTool, 
    Calendar, 
    Milestone, 
    RefreshCw, 
    MousePointer, 
    Briefcase, 
    GraduationCap, 
    Landmark as LandmarkIcon, 
    Gavel, 
    DollarSign, 
    StickyNote, 
    Play, 
    Link2, 
    BellRing,
    ArrowUpRight, 
    Handshake,     
    List,          
    CalendarDays,  
    HelpCircle,
    Eye
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

interface MeetingRecord {
    id: string;
    date: string;
    title: string;
    attendees: string[];
    summary: string;
    decisions: string[];
}

interface ChatMessage {
    id: string;
    sender: string;
    role: 'ME' | 'OTHER' | 'SYSTEM' | 'AI';
    content: string;
    timestamp: string;
    isStructured?: boolean; 
}

interface ActionItem {
    id: string;
    content: string;
    owner: string;
    deadline: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'DONE';
    verifiedBySystem?: boolean; 
    verificationTime?: string;
}

interface KeyPoint {
    id: string;
    date: string;
    summary: string;
    actions: ActionItem[];
}

interface IntelligenceItem {
    id: string;
    title: string;
    type: 'REPORT' | 'POLICY' | 'NEWS' | 'DATA';
    source: string;
    date: string;
    summary: string;
    tags?: string[];
    url?: string;
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
        trendData?: number[]; 
    };
    events?: StrategicEvent[];
    historyEvents?: StrategicEvent[]; // Added for Detail Panel
    meetingRecords?: MeetingRecord[]; // Added for Detail Panel
    subItems?: Assumption[]; 
    parentId?: string;
    chatHistory?: ChatMessage[]; 
    communicationStatus?: 'NONE' | 'SYSTEM_CONTACTED' | 'DISCUSSED';
    keyPoints?: KeyPoint[]; 
    externalData?: { 
        id: string;
        title: string;
        value: string;
        trend: string;
        source: string;
        updateTime: string;
        fullContent: string;
    }[];
    intelligence?: IntelligenceItem[];
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
    historyEvents?: StrategicEvent[]; // Added
    meetingRecords?: MeetingRecord[]; // Added
}

interface GraphEdge {
    source: string;
    target: string;
    type: 'SUPPORT' | 'CONSTRAINT' | 'VETO'; 
    weight: 'STRONG' | 'MEDIUM' | 'WEAK';
    description: string;
}

// --- New Types for Chat & Records ---
interface StructuredRecord {
    id: string;
    date: string;
    participants: string[];
    summary: string;
    decisions: string[];
    todos: { task: string; owner: string; due: string }[];
}

// --- Workflow / Plan Node Types ---
interface WorkflowNodeData {
    financial: { label: string; value: string; target: string; status: 'GREEN'|'YELLOW'|'RED'; source: string; lastUpdate: string; rawData?: any[] };
    assumption: { label: string; status: 'GREEN'|'YELLOW'|'RED'; id?: string }; 
    ksf: { label: string; status: 'GREEN'|'YELLOW'|'RED'; id?: string }; 
    action: { label: string; progress: number; dueDate: string };
}

interface WorkflowNode {
    id: string;
    type: 'GROUP' | 'DEPT' | 'BASE';
    title: string;
    owner: string;
    status: 'GREEN' | 'YELLOW' | 'RED';
    x: number;
    y: number;
    data: WorkflowNodeData;
}

type NodeHandleType = 'financial' | 'assumption' | 'ksf' | 'action';

interface WorkflowEdge {
    id: string;
    source: string;
    target: string;
    sourceHandle?: NodeHandleType;
    targetHandle?: NodeHandleType;
    label?: string;
    type?: 'dependency' | 'flow';
}

// --- Visual Node Type for Deduction Chain ---
interface VisualDeductionNode {
    id: string;
    type: 'ASSUMPTION' | 'GOAL';
    x: number;
    y: number;
    data: Assumption | Goal;
}

// --- NEW: Detailed Plan Breakdown Structure ---
interface PlanAction {
    id: string;
    task: string;
    owner: string;
    deadline: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'DELAYED';
    weight: number; // Contribution to goal
}

interface SubGoal {
    id: string;
    title: string;
    owner: string;
    deadline: string;
    metric: string; // e.g., "完成率 100%"
    progress: number;
    actions: PlanAction[];
}

interface SupportRequest {
    department: string;
    contact: string;
    content: string; // What is needed
    status: 'AGREED' | 'PENDING' | 'REJECTED' | 'DONE';
    criticality: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface DetailedPlan {
    id: string; // Links to WorkflowNode.id
    overview: string;
    subGoals: SubGoal[];
    supportNeeds: SupportRequest[];
}

// --- 2. Mock Data Generation Helper ---

const mockChat = (owner: string, topic: string): ChatMessage[] => [
    { id: 'm1', sender: 'System Bot', role: 'SYSTEM', content: `[自动告警] 监测到 ${topic} 指标异常波动 (Delta > 5%)，请确认是否需要调整假设。`, timestamp: '2023-10-10 09:00' },
    { id: 'm2', sender: owner, role: 'OTHER', content: '收到。正在与供应商核实最新报价。', timestamp: '2023-10-10 09:15' },
    { id: 'm3', sender: 'System Bot', role: 'SYSTEM', content: '[系统核实] 已抓取到供应商 A 的最新报价邮件，单价确认为 16.2w，与您的判断一致。', timestamp: '2023-10-10 09:20' },
    { id: 'm4', sender: '刘总', role: 'ME', content: '这个指标直接影响 G6 毛利率，请务必在周三前给出结论。', timestamp: '2023-10-10 10:30' },
    { id: 'm5', sender: owner, role: 'OTHER', content: '明白，目前初步判断是短期波动，建议保持观望。', timestamp: '2023-10-10 11:00' }
];

const STRATEGIC_ASSUMPTIONS: Assumption[] = [
    { 
        id: 'A1', code: 'A1', name: '全球新能源车需求持续增长', description: '预计全球 NEV 销量年复合增长率 (CAGR) > 25%。', type: 'MARKET', status: 'GREEN', confidence: 4, owner: '市场战略部 / 王总', risk: '低',
        metrics: { target: 'CAGR > 25%', current: 'CAGR 28%', delta: '+3%', trendData: [22, 24, 25, 27, 28, 28] },
        communicationStatus: 'NONE',
        externalData: [
            { id: 'ed1', title: '中国新能源销量 (CPCA)', value: '78.5万辆 (Sep)', trend: '+12% MoM', source: '乘联会 (CPCA) / Quiver', updateTime: '2023-10-31', fullContent: '乘联会数据显示，9月新能源乘用车批发销量达到82.9万辆，同比增长23.0%，环比增长4.2%。' },
            { id: 'ed2', title: 'Global EV Outlook 2024', value: 'Positive', trend: 'Stable', source: 'IEA', updateTime: '2023-10-15', fullContent: 'IEA predicts global electric car sales will break records this year.' }
        ],
        historyEvents: [
            { id: 'he1', date: '2023-09-20', title: '欧盟反补贴调查启动', description: '欧盟委员会主席冯德莱恩宣布对中国电动汽车启动反补贴调查。', impact: 'NEGATIVE', source: 'EXTERNAL_NEWS', sourceType: 'EXTERNAL_NEWS' },
            { id: 'he2', date: '2023-10-01', title: '国内购车补贴延续', description: '财政部公告延续新能源汽车免征车辆购置税政策至2027年底。', impact: 'POSITIVE', source: 'GOV_WEBSITE', sourceType: 'EXTERNAL_NEWS' }
        ],
        meetingRecords: [
            { id: 'mr1', date: '2023-10-05', title: 'Q4 市场策略调整会', attendees: ['王总', '刘总', 'Sales VP'], summary: '针对欧盟调查风险，决定加速东南亚及南美市场布局。', decisions: ['启动泰国工厂二期调研', '调整欧洲出口占比预期'] }
        ],
        intelligence: [], events: [], subItems: []
    },
    { 
        id: 'A2', code: 'A2', name: '主要客户产能规划按期推进', description: 'GAC和Xpeng的新车型产线无重大延期。', type: 'CUSTOMER', status: 'YELLOW', confidence: 3, owner: '销售部 / 赵总', risk: 'Xpeng新工厂延期', 
        metrics: { target: '交付达成率 100%', current: '92%', delta: '-8%' },
        externalData: [
            { id: 'ed_a2', title: 'GAC Aion Production', value: '45k/month', trend: '+5%', source: 'Public Earnings', updateTime: '2023-10-20', fullContent: 'GAC Aion 最新排产数据显示产能利用率已达 95%，Hyper GT 爬坡顺利。' }
        ],
        historyEvents: [
            { id: 'he3', date: '2023-10-12', title: 'Xpeng G9 改款发布', description: '新款 G9 上市，定价策略激进，预计带动 Q4 订单增长。', impact: 'POSITIVE', source: 'AutoNews', sourceType: 'EXTERNAL_NEWS' }
        ],
        subItems: [], events: [], communicationStatus: 'NONE'
    },
    { 
        id: 'A3', code: 'A3', name: '原材料价格维持可控区间', description: '碳酸锂价格波动幅度不超过 ±15%。', type: 'COST', status: 'RED', confidence: 2, owner: '采购中心 / 孙总', risk: '价格战导致上游惜售',
        metrics: { target: 'Li2CO3 < 15w', current: '16.5w', delta: '+10%', trendData: [14, 14.5, 15, 16, 17, 16.5] },
        chatHistory: mockChat('采购中心 / 孙总', '碳酸锂价格波动'),
        communicationStatus: 'SYSTEM_CONTACTED',
        externalData: [
            { id: 'ed_a3', title: 'SMM 碳酸锂报价', value: '16.5万/吨', trend: '-2.4%', source: 'SMM', updateTime: 'Today', fullContent: '电池级碳酸锂现货报价今日下跌 2000元。' }
        ],
        meetingRecords: [
            { id: 'mr2', date: '2023-11-01', title: '原材料采购紧急应对会', attendees: ['孙总', 'CFO', 'CEO'], summary: '现货价格波动超出预期，需调整采购策略。', decisions: ['暂停现货采购', '启用期货套保方案'] }
        ],
        events: [], subItems: []
    },
    { id: 'A4', code: 'A4', name: '海外政策环境不发生重大逆转', description: '欧盟碳关税及反补贴调查不产生惩罚性关税。', type: 'POLICY', status: 'RED', confidence: 2, owner: '公共事务部 / 周总', risk: '反补贴调查立案', metrics: { target: '无惩罚性关税', current: '调查中', delta: '高风险' }, events: [], subItems: [], communicationStatus: 'DISCUSSED' },
    { id: 'A5', code: 'A5', name: '竞品扩产节奏低于行业需求', description: '主要竞对产能利用率维持在 80% 左右。', type: 'MARKET', status: 'YELLOW', confidence: 3, owner: '战略情报部 / 吴总', risk: '竞对C大幅降价', metrics: { target: '竞对均价 > 0.5元/Wh', current: '0.45元/Wh', delta: '-10%' }, events: [], subItems: [] },
    { id: 'A6', code: 'A6', name: '新一代电池技术可按期量产', description: '半固态/Base 3 产线良率达到预期', type: 'CAPACITY', status: 'GREEN', confidence: 4, owner: '研究院 / 陈CTO', risk: '低', metrics: { target: 'Base 3 > 97.5%', current: '94.1%', delta: '-3.4%' }, events: [], subItems: [] },
    { id: 'A7', code: 'A7', name: '集团现金流支持扩产投资', description: '经营性现金流净额/营收占比 > 8%。', type: 'COST', status: 'GREEN', confidence: 5, owner: '财务部 / 郑CFO', risk: '低', metrics: { target: 'OCF > 8%', current: '12%', delta: '+4%' }, events: [], subItems: [] },
    { id: 'A8', code: 'A8', name: '关键设备交付不构成瓶颈', description: '涂布机等核心设备交付周期 < 6个月。', type: 'CAPACITY', status: 'GREEN', confidence: 4, owner: '供应链中心 / 冯总', risk: '低', metrics: { target: 'Lead Time 6mo', current: '5.5mo', delta: '-0.5mo' }, events: [], subItems: [] },
    { id: 'A9', code: 'A9', name: '汇率波动处于可管理范围', description: 'USD/CNY 汇率波动在 6.8 - 7.3 之间。', type: 'COST', status: 'YELLOW', confidence: 3, owner: '财务部 / 郑CFO', risk: '汇率波动加剧', metrics: { target: '6.8-7.3', current: '7.32', delta: '超限' }, events: [], subItems: [], communicationStatus: 'SYSTEM_CONTACTED' },
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

const WORKFLOW_NODES: WorkflowNode[] = [
    {
        id: 'WN-01', type: 'GROUP', title: '集团年度营收目标', owner: 'CEO Office', status: 'GREEN', x: 50, y: 250,
        data: {
            financial: { label: '年度营收 ¥600亿', value: '¥528亿', target: '¥600亿', status: 'GREEN', source: 'SAP S/4HANA', lastUpdate: '10 mins ago' },
            assumption: { label: '全球市场 CAGR > 25%', status: 'GREEN', id: 'A1' },
            ksf: { label: '核心大客户份额稳定', status: 'GREEN' },
            action: { label: '签署年度经营责任状', progress: 100, dueDate: '2023-12-30' }
        }
    },
    // ... (rest of WORKFLOW_NODES)
    {
        id: 'WN-02', type: 'DEPT', title: '销售部交付计划', owner: 'Sales VP', status: 'YELLOW', x: 450, y: 50,
        data: {
            financial: { label: '交付量 (GWh)', value: '62 GWh', target: '70 GWh', status: 'YELLOW', source: 'DMS (Delivery Mgmt)', lastUpdate: '1 hour ago' },
            assumption: { label: 'GAC/Xpeng 产能无延期', status: 'YELLOW', id: 'A2' },
            ksf: { label: 'S&OP 产销协同效率', status: 'GREEN' },
            action: { label: '锁定 Q4 补充协议', progress: 80, dueDate: '2023-11-15' }
        }
    },
    {
        id: 'WN-03', type: 'DEPT', title: '供应链降本专项', owner: 'SCM VP', status: 'RED', x: 450, y: 450,
        data: {
            financial: { label: '采购均价 (Li)', value: '16.5万', target: '15万', status: 'RED', source: 'SRM System', lastUpdate: 'Real-time' },
            assumption: { label: '碳酸锂价格 < 15万', status: 'RED', id: 'A3' },
            ksf: { label: '澳矿长协锁定率', status: 'YELLOW' },
            action: { label: '启动期货套保方案', progress: 30, dueDate: '2023-11-20' }
        }
    },
    {
        id: 'WN-06', type: 'DEPT', title: '生产制造年度计划', owner: 'Mfg VP', status: 'GREEN', x: 900, y: 50,
        data: {
            financial: { label: '产能利用率 > 85%', value: '88%', target: '85%', status: 'GREEN', source: 'MES', lastUpdate: '4 hours ago' },
            assumption: { label: '核心设备OEE > 90%', status: 'GREEN', id: 'A8' },
            ksf: { label: '新产线爬坡速度', status: 'GREEN' },
            action: { label: 'Base 2 扩产项目验收', progress: 95, dueDate: '2023-11-10' }
        }
    },
    {
        id: 'WN-07', type: 'DEPT', title: '研发技术演进', owner: 'CTO', status: 'YELLOW', x: 900, y: 450,
        data: {
            financial: { label: '研发投入占比', value: '5.2%', target: '6%', status: 'YELLOW', source: 'Finance', lastUpdate: '1 day ago' },
            assumption: { label: '半固态电池技术冻结', status: 'GREEN', id: 'A6' },
            ksf: { label: '核心人才流失率 < 5%', status: 'YELLOW' },
            action: { label: '314Ah 电芯量产认证', progress: 60, dueDate: '2023-12-15' }
        }
    },
    {
        id: 'WN-08', type: 'DEPT', title: '人力资源与组织', owner: 'HR VP', status: 'GREEN', x: 900, y: 850,
        data: {
            financial: { label: '人工成本总额', value: '¥24.5亿', target: '¥25亿', status: 'GREEN', source: 'Workday', lastUpdate: '1 day ago' },
            assumption: { label: '海外关键岗位到岗', status: 'GREEN', id: 'A10' },
            ksf: { label: '校招 Offer 接受率', status: 'GREEN' },
            action: { label: '匈牙利基地团队组建', progress: 75, dueDate: '2024-03-01' }
        }
    },
    {
        id: 'WN-09', type: 'DEPT', title: '财务资金计划', owner: 'CFO', status: 'YELLOW', x: 900, y: 1250,
        data: {
            financial: { label: '经营性现金流', value: '¥32亿', target: '¥40亿', status: 'YELLOW', source: 'SAP FICO', lastUpdate: '2 hours ago' },
            assumption: { label: '汇率波动 < 5%', status: 'YELLOW', id: 'A9' },
            ksf: { label: '融资成本控制 < 3%', status: 'GREEN' },
            action: { label: '发行绿色债券', progress: 40, dueDate: '2024-01-15' }
        }
    },
    {
        id: 'WN-10', type: 'DEPT', title: '公共事务与合规', owner: 'PA VP', status: 'RED', x: 450, y: 850,
        data: {
            financial: { label: '合规成本', value: '¥1.2亿', target: '¥1.0亿', status: 'RED', source: 'Legal Ops', lastUpdate: '3 days ago' },
            assumption: { label: '无重大贸易制裁', status: 'RED', id: 'A4' },
            ksf: { label: '碳足迹认证通过率', status: 'YELLOW' },
            action: { label: '欧盟反补贴调查应诉', progress: 20, dueDate: '2023-11-30' }
        }
    },
    {
        id: 'WN-04', type: 'BASE', title: 'GAC 客户组执行', owner: 'Account Mgr', status: 'GREEN', x: 1300, y: 50,
        data: {
            financial: { label: 'GAC 回款', value: '24亿', target: '25亿', status: 'GREEN', source: 'Finance TMS', lastUpdate: '2 hours ago' },
            assumption: { label: 'Aion Y 销量持续', status: 'GREEN' },
            ksf: { label: 'JIT 交付达成率 100%', status: 'GREEN' },
            action: { label: '驻场服务团队建立', progress: 100, dueDate: '2023-10-01' }
        }
    },
    {
        id: 'WN-05', type: 'BASE', title: '战略采购执行', owner: 'Procurement Dir', status: 'YELLOW', x: 1300, y: 450,
        data: {
            financial: { label: '长协履约率', value: '85%', target: '95%', status: 'YELLOW', source: 'SRM', lastUpdate: '1 day ago' },
            assumption: { label: '供应商产能充足', status: 'GREEN' },
            ksf: { label: '谈判筹码构建', status: 'YELLOW' },
            action: { label: 'SQM 季度谈判', progress: 50, dueDate: '2023-11-25' }
        }
    }
];

const WORKFLOW_EDGES: WorkflowEdge[] = [
    { id: 'e1', source: 'WN-01', target: 'WN-02', label: '分解' },
    { id: 'e2', source: 'WN-02', target: 'WN-04', label: '执行' },
    { id: 'e3', source: 'WN-01', target: 'WN-06', label: '生产协同' },
    { id: 'e4', source: 'WN-06', target: 'WN-03', label: '物料需求' },
    { id: 'e5', source: 'WN-03', target: 'WN-05', label: '执行' },
    { id: 'e6', source: 'WN-07', target: 'WN-06', label: '技术导入' },
    { id: 'e7', source: 'WN-09', target: 'WN-01', label: '资金支持' },
    { id: 'e8', source: 'WN-08', target: 'WN-06', label: '人力保障' },
    { id: 'e9', source: 'WN-10', target: 'WN-02', label: '合规护航' },
];

const MOCK_NODE_DETAILS: any = {
    // ... (Keep existing mock data for Strategic Nodes if any, otherwise use default)
    'DEFAULT': {
        kpiTitle: '核心指标监控 (Key Metrics)',
        metrics: [
            { label: '达成率', value: '92%', target: '100%', status: 'YELLOW', delta: '-8%' },
            { label: '偏差值', value: 'High', target: 'Low', status: 'RED', delta: '+15%' }
        ],
        trendData: [
            { date: 'W1', value: 80, target: 90 },
            { date: 'W2', value: 85, target: 90 },
            { date: 'W3', value: 92, target: 90 }
        ],
        rootCauses: [],
        failedRecords: []
    }
};

const DETAILED_PLAN_DATA: Record<string, DetailedPlan> = {
    'WN-02': { // Sales Plan
        id: 'WN-02',
        overview: '确保核心大客户（GAC、Xpeng）的年度交付目标达成，并完成海外市场渠道铺设。',
        subGoals: [
            {
                id: 'SG-01', title: 'Q4 交付冲刺', owner: '李经理 (销售)', deadline: '2023-12-31', metric: '交付 20GWh', progress: 85,
                actions: [
                    { id: 'A-01', task: '确认 GAC 12月排产计划', owner: '李经理', deadline: '2023-11-15', status: 'DONE', weight: 30 },
                    { id: 'A-02', task: '协调 Base 2 产能分配', owner: '张调度', deadline: '2023-11-20', status: 'IN_PROGRESS', weight: 40 },
                    { id: 'A-03', task: '完成年底回款对账', owner: '财务BP', deadline: '2023-12-10', status: 'PENDING', weight: 30 },
                ]
            },
            {
                id: 'SG-02', title: '新车型定点 (Nomination)', owner: '王总监 (BD)', deadline: '2024-01-15', metric: '2个新项目', progress: 40,
                actions: [
                    { id: 'A-04', task: '提交 Xpeng G9 改款报价', owner: '王总监', deadline: '2023-11-30', status: 'IN_PROGRESS', weight: 50 },
                    { id: 'A-05', task: '完成技术交流会 (Tech Day)', owner: '陈工 (售前)', deadline: '2023-12-05', status: 'PENDING', weight: 50 },
                ]
            }
        ],
        supportNeeds: [
            { department: '供应链 (SCM)', contact: '孙总', content: '保障 12 月份 NCM811 正极材料的额外 500 吨供应。', status: 'AGREED', criticality: 'HIGH' },
            { department: '研发 (R&D)', contact: '赵博', content: '派驻工程师支持欧洲客户现场测试 (2人/月)。', status: 'PENDING', criticality: 'MEDIUM' },
            { department: '法务 (Legal)', contact: '周律师', content: '审核匈牙利销售合同条款。', status: 'DONE', criticality: 'HIGH' }
        ]
    }
};

// Fallback generator for other nodes
const getDetailedPlan = (node: WorkflowNode): DetailedPlan => {
    if (DETAILED_PLAN_DATA[node.id]) return DETAILED_PLAN_DATA[node.id];
    
    return {
        id: node.id,
        overview: `${node.title} 的具体执行方案与目标分解。`,
        subGoals: [
            {
                id: 'SG-01', title: '核心指标达成', owner: node.owner, deadline: '2023-12-31', metric: node.data.financial.target, progress: parseInt(node.data.financial.value) || 60,
                actions: [
                    { id: 'act-1', task: '制定月度分解计划', owner: node.owner, deadline: '2023-10-15', status: 'DONE', weight: 20 },
                    { id: 'act-2', task: '执行关键里程碑 A', owner: node.owner, deadline: '2023-11-30', status: 'IN_PROGRESS', weight: 40 },
                    { id: 'act-3', task: '年度复盘与总结', owner: node.owner, deadline: '2024-01-10', status: 'PENDING', weight: 40 }
                ]
            }
        ],
        supportNeeds: [
            { department: '人力资源 (HR)', contact: 'HRBP', content: '关键岗位招聘支持 (2人)', status: 'PENDING', criticality: 'MEDIUM' },
            { department: 'IT 部门', contact: 'IT Support', content: '数据看板开发', status: 'AGREED', criticality: 'LOW' }
        ]
    };
};

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

type StrategicNode = (Assumption & { category: 'ASSUMPTION' }) | (Goal & { category: 'GOAL' });

const findStrategicNode = (id: string): StrategicNode | null => {
    const assumption = findAssumption(id, STRATEGIC_ASSUMPTIONS);
    if (assumption) return { ...assumption, category: 'ASSUMPTION' };
    
    const goal = STRATEGIC_GOALS.find(g => g.id === id);
    if (goal) return { ...goal, category: 'GOAL' };
    
    return null;
}

// ... (SmartCollaborationModal, WorkflowNodeCard components remain unchanged) ...
// --- Enhanced Modal: Chat & Records ---
interface Collaborator {
    id: string;
    name: string;
    role: string;
    avatar: string;
    isAi?: boolean;
}

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

const WorkflowNodeCard = ({ node, onMouseDown, onClick }: { node: WorkflowNode, onMouseDown: (e: React.MouseEvent) => void, onClick: () => void }) => {
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
                                <History size={18} className="text-purple-500"/> 历史重要影响事件 (History)
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

// --- NEW Strategic Linkage View (Visual Graph) ---
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
                        // Simple straight lines for now, can be improved to bezier
                        return (
                            <g key={edge.id}>
                                <line 
                                    x1={s.x + 160} y1={s.y + 120} 
                                    x2={t.x + 160} y2={t.y + 120} 
                                    stroke="#cbd5e1" 
                                    strokeWidth="2" 
                                    markerEnd="url(#arrow-gray)"
                                />
                                {edge.label && (
                                    <text x={(s.x + t.x)/2 + 160} y={(s.y + t.y)/2 + 120} textAnchor="middle" fill="#94a3b8" fontSize="10" className="bg-white px-1">{edge.label}</text>
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
                        <Target className="text-blue-600"/> 年度经营计划 (Annual Plan 2024)
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
