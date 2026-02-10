

// ... existing imports ...
import React, { useState, useRef, useEffect, useMemo } from 'react';
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
    Bot,
    UserPlus,
    Maximize2,
    RotateCcw,
    ZoomIn,
    ZoomOut,
    Move,
    Link,
    Network,
    Info,
    Thermometer,
    Droplets,
    Anchor,
    Wind,
    ToggleLeft,
    Shuffle,
    Scale,
    GanttChartSquare,
    AlertCircle,
    MapPin,
    Link as LinkIcon,
    Send,
    ChevronDown,
    ChevronUp,
    Briefcase,
    FileCheck,
    GitPullRequest,
    Milestone,
    Layout,
    DollarSign
} from 'lucide-react';

// ... (Keep existing interfaces: AnalysisBoard, FulfillmentMetric, RootCauseHistory, L4MetricDetail, TeamMember, GraphNode, GraphEdge, AbnormalityDetail, SimulationScenario, SimConfigField, SimConfigDef) ...

// --- Enhanced Customer Interfaces ---

interface ActionItem {
    id: string;
    task: string;
    owner: string;
    dueDate: string;
    status: 'DONE' | 'IN_PROGRESS' | 'PENDING' | 'OVERDUE';
    completionDate?: string;
}

interface MeetingDetail {
    id: string;
    date: string;
    title: string;
    type: 'QBR' | 'Project' | 'Crisis' | 'Routine';
    summary: string;
    attendees: string[];
    actionItems: ActionItem[];
}

interface RootCauseAnalysis {
    issue: string;
    rootCauseChain: string[]; // 5 Whys
    impact: string;
    correctiveActions: ActionItem[];
}

interface OrderIssue {
    orderId: string;
    product: string;
    expectedDate: string;
    actualDate?: string;
    delayDays: number;
    status: 'DELAYED' | 'RISK' | 'DELIVERED';
    analysis?: RootCauseAnalysis;
}

interface DeepCustomerProfile {
    id: string;
    overview: {
        revenue: string;
        yoy: string;
        margin: string;
        otif: string; // On-Time In-Full
        ppm: number; // Quality defect rate
        arAging: string; // Accounts Receivable
        nps: number;
    };
    meetings: MeetingDetail[];
    deliveryIssues: OrderIssue[];
}

// ... (Keep existing basic interfaces: TeamMember, SatisfactionEvent, etc.) ...

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

interface GraphNode {
    id: string;
    label: string;
    type: 'METRIC' | 'RISK' | 'OBJECT' | 'TEAM';
    status: 'NORMAL' | 'WARNING' | 'CRITICAL';
    x: number;
    y: number;
    details?: any;
}

interface GraphEdge {
    source: string;
    target: string;
    label?: string;
}

interface AbnormalityDetail {
    owner: string;
    occurredTime: string;
    processingStatus: string;
    historyCount: number;
    rootCauseHint: string;
}

interface SimulationScenario {
    id: string;
    title: string;
    desc: string;
    category: 'SUPPLY' | 'PRODUCTION' | 'DELIVERY' | 'MARKET';
    icon: any;
    color: string;
}

interface SimConfigField {
    id: string;
    label: string;
    type: 'select' | 'number' | 'date' | 'range' | 'boolean' | 'radio' | 'text';
    options?: string[];
    unit?: string;
    default?: any;
    min?: number;
    max?: number;
    step?: number;
}

interface SimConfigDef {
    params: SimConfigField[];
    constraints: SimConfigField[];
    logic: SimConfigField[];
}

// ... (Keep existing helpers) ...
const getAbnormalityDetail = (id: string, status: string): AbnormalityDetail => {
    // Deterministic mock based on ID
    const owners = ['David Z. (SCM)', 'Sarah L. (QA)', 'Mike W. (Sales)', 'Tom H. (Prod)'];
    const statuses = ['Analyzing (Step 2/4)', 'Pending', 'Escalated (P0)', 'Monitoring'];
    const hints = [
        'Upstream material supply delay causing chain reaction. Check inventory levels.',
        'Production line parameter drift, suspected temperature control failure.',
        'Customer demand change causing schedule conflicts.',
        'Logistics carrier capacity insufficient, suggest backup plan.'
    ];
    
    const idx = id.charCodeAt(0) % 4;
    return {
        owner: owners[idx],
        occurredTime: `${(id.charCodeAt(id.length-1) % 12) + 1}h ago`,
        processingStatus: statuses[idx],
        historyCount: (id.charCodeAt(0) % 5) + 1,
        rootCauseHint: hints[idx]
    };
};

// ... (Keep existing data constants) ...
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
            definition: '(核心KPI) 针对大客户 (GAC Aion/Xpeng) 的整车配套交付满足率。', 
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

const DEFAULT_TEAM: TeamMember[] = [
    { id: 'u1', name: 'Emily Chen', role: '客户经理 (Sales Rep)', initials: 'EC', status: 'ONLINE' },
    { id: 'u2', name: 'Michael Wang', role: '销售总监 (Sales Dir)', initials: 'MW', status: 'BUSY' },
    { id: 'u3', name: 'Sarah Li', role: '服务经理 (Service Mgr)', initials: 'SL', status: 'ONLINE' },
    { id: 'u4', name: 'David Zhang', role: '运营管理 (Ops)', initials: 'DZ', status: 'OFFLINE' },
];

const MODULE_TEAMS: Record<string, TeamMember[]> = {
    'customer_satisfaction': [
        { id: 'u1', name: 'Emily Chen', role: 'Sales Director', initials: 'EC', status: 'ONLINE' },
        { id: 'u2', name: 'Sarah Li', role: 'Service Mgr', initials: 'SL', status: 'BUSY' }
    ],
    'inventory_turnover': [
        { id: 'u3', name: 'David Zhang', role: 'Warehouse Mgr', initials: 'DZ', status: 'ONLINE' },
        { id: 'u4', name: 'Tom Wu', role: 'Supply Chain', initials: 'TW', status: 'OFFLINE' }
    ],
    's1_monitoring': [
        { id: 'u5', name: 'Logistics Lead', role: 'Logistics', initials: 'LL', status: 'ONLINE' },
        { id: 'u6', name: 'Prod Manager', role: 'Production', initials: 'PM', status: 'BUSY' }
    ],
    'fulfillment': [
        { id: 'u7', name: 'OPS Director', role: 'Operations', initials: 'OD', status: 'ONLINE' },
        { id: 'u8', name: 'Plan Manager', role: 'Planning', initials: 'PM', status: 'OFFLINE' }
    ],
    'default': [
        { id: 'admin', name: 'Module Owner', role: 'Admin', initials: 'MO', status: 'ONLINE' },
        { id: 'ai', name: 'AI Analyst', role: 'Bot', initials: 'AI', status: 'ONLINE' }
    ]
};

const CUSTOMER_LIST: CustomerHealth[] = [
    { id: 'C001', name: 'GAC Aion (广汽埃安)', type: 'PV', tier: 'Strategic', nps: 75, healthScore: 88, status: 'HEALTHY', openTickets: 2, lastInteraction: 'Today', revenue: '¥ 4.2B', team: DEFAULT_TEAM },
    { id: 'C002', name: 'Xpeng Motors (小鹏)', type: 'PV', tier: 'Strategic', nps: 65, healthScore: 75, status: 'AT_RISK', openTickets: 5, lastInteraction: 'Yesterday', revenue: '¥ 3.8B', team: DEFAULT_TEAM },
    { id: 'C003', name: 'Changan Auto (长安)', type: 'PV', tier: 'Key', nps: 45, healthScore: 58, status: 'CRITICAL', openTickets: 8, lastInteraction: '2 days ago', revenue: '¥ 1.5B', team: DEFAULT_TEAM },
    { id: 'C004', name: 'Leapmotor (零跑)', type: 'PV', tier: 'Key', nps: 80, healthScore: 92, status: 'HEALTHY', openTickets: 1, lastInteraction: '3 days ago', revenue: '¥ 1.2B', team: DEFAULT_TEAM },
    { id: 'C005', name: 'Geely Auto (吉利)', type: 'PV', tier: 'Strategic', nps: 68, healthScore: 82, status: 'HEALTHY', openTickets: 3, lastInteraction: '1 week ago', revenue: '¥ 2.1B', team: DEFAULT_TEAM },
    { id: 'C006', name: 'Dongfeng (东风)', type: 'PV', tier: 'Key', nps: 55, healthScore: 65, status: 'AT_RISK', openTickets: 4, lastInteraction: 'Today', revenue: '¥ 1.8B', team: DEFAULT_TEAM },
    { id: 'C007', name: 'Smart (智马达)', type: 'PV', tier: 'Key', nps: 72, healthScore: 80, status: 'HEALTHY', openTickets: 2, lastInteraction: 'Today', revenue: '¥ 1.1B', team: DEFAULT_TEAM },
    { id: 'C008', name: 'Honda (本田)', type: 'PV', tier: 'Key', nps: 60, healthScore: 70, status: 'AT_RISK', openTickets: 3, lastInteraction: '2 days ago', revenue: '¥ 0.9B', team: DEFAULT_TEAM },
];

const CUSTOMER_EVENTS: Record<string, SatisfactionEvent[]> = {
    'C001': [
        { id: 'E1', date: '2023-11-15', category: 'DELIVERY', sourceSystem: 'ERP', title: 'Q4 订单按期交付达成', description: 'GAC Aion 弹匣电池批次 100% OTIF 交付，客户发邮件表扬。', sentiment: 'POSITIVE', impactScore: 3 },
        { id: 'E2', date: '2023-11-12', category: 'MEETING', sourceSystem: 'MEETING_LOG', title: '月度质量复盘会议 (QBR)', description: '客户提出希望优化 Pack 密封胶涂胶工艺，减少溢胶风险。', sentiment: 'NEUTRAL', impactScore: 0 },
        { id: 'E3', date: '2023-11-05', category: 'FORECAST', sourceSystem: 'APS', title: '预测准确率波动', description: '客户临时增加 12 月份排产计划 15%，造成我方物料紧张。', sentiment: 'NEGATIVE', impactScore: -2 },
    ],
    // ... other events
};

// --- MOCK DEEP DATA ---
const MOCK_CUSTOMER_DEEP_DATA: Record<string, DeepCustomerProfile> = {
    'C001': {
        id: 'C001',
        overview: {
            revenue: '¥ 4.2B', yoy: '+18%', margin: '14.5%',
            otif: '94.2%', ppm: 45, arAging: '32 Days', nps: 75
        },
        meetings: [
            {
                id: 'MTG-001', date: '2023-11-12', title: 'Q4 质量复盘会议 (QBR)', type: 'QBR',
                summary: '针对 Q3 出现的 3 起溢胶客诉进行了深入复盘。客户对目前的整改方案表示基本认可，但要求加强出厂 OCV 抽检比例。',
                attendees: ['David Z.', 'Sarah L.', 'Customer QA Lead', 'Customer Purchase'],
                actionItems: [
                    { id: 'ACT-01', task: '优化 Pack 密封胶涂胶工艺参数', owner: 'Engineering/Tom', dueDate: '2023-11-20', status: 'DONE', completionDate: '2023-11-18' },
                    { id: 'ACT-02', task: '增加 OCV 终检设备台套数', owner: 'Plant/Mike', dueDate: '2023-12-01', status: 'IN_PROGRESS' },
                    { id: 'ACT-03', task: '修订《出厂检验规范》V2.4', owner: 'Quality/Sarah', dueDate: '2023-11-25', status: 'PENDING' }
                ]
            },
            {
                id: 'MTG-002', date: '2023-11-01', title: '2024 年度价格谈判首轮', type: 'Project',
                summary: '客户提出明年降价 10% 的要求。我方强调了原材料价格波动的风险，提议建立价格联动机制。',
                attendees: ['Michael Wang', 'Sales VP', 'Customer Purchase Head'],
                actionItems: [
                    { id: 'ACT-04', task: '测算 2024 原材料成本模型', owner: 'Finance/Li', dueDate: '2023-11-10', status: 'DONE', completionDate: '2023-11-08' },
                    { id: 'ACT-05', task: '起草价格联动协议草案', owner: 'Legal/Chen', dueDate: '2023-11-15', status: 'OVERDUE' }
                ]
            }
        ],
        deliveryIssues: [
            {
                orderId: 'ORD-9921', product: 'Magazine Battery Pack', expectedDate: '2023-11-20', delayDays: 3, status: 'RISK',
                analysis: {
                    issue: '正极材料 (NCM) 供应短缺',
                    rootCauseChain: [
                        '供应商 A (Ronbay) 产线故障',
                        '关键设备 (窑炉) 温控模块损坏',
                        '备件需从德国进口，物流受阻',
                        '供应商未建立关键备件安全库存'
                    ],
                    impact: '影响 Base 1 产线 3 天排产计划，预计造成交付延期 48 小时。',
                    correctiveActions: [
                        { id: 'CA-01', task: '启动二供 (Easpring) 紧急调货', owner: 'SCM/David', dueDate: '2023-11-17', status: 'DONE', completionDate: '2023-11-17' },
                        { id: 'CA-02', task: '调整产线排程，优先生产其他订单', owner: 'Plan/Bob', dueDate: '2023-11-17', status: 'DONE', completionDate: '2023-11-17' },
                        { id: 'CA-03', task: '对供应商 A 进行二方审核', owner: 'SQE/Team', dueDate: '2023-12-01', status: 'PENDING' }
                    ]
                }
            },
            {
                orderId: 'ORD-8832', product: 'Standard 60kWh Pack', expectedDate: '2023-11-10', actualDate: '2023-11-12', delayDays: 2, status: 'DELAYED',
                analysis: {
                    issue: '物流运输途中车辆故障',
                    rootCauseChain: ['承运商车辆高速抛锚', '车辆未按期保养'],
                    impact: '客户线边库存告急，触发 1 级预警。',
                    correctiveActions: [
                        { id: 'CA-04', task: '安排临时专车转运', owner: 'Logistics/Wu', dueDate: '2023-11-11', status: 'DONE', completionDate: '2023-11-11' }
                    ]
                }
            }
        ]
    }
    // ... add more mock data for other customers as needed
};

const L4_METRIC_MOCK: L4MetricDetail = {
    code: 'L2',
    name: '足额及时率 (OTIF)',
    description: '针对大客户 (GAC Aion/Xpeng) 的整车配套交付满足率。',
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
        { id: 'ORD-001', customer: 'GAC Aion', date: '2023-11-03', reason: '缺料', value: '500 Sets', status: 'Pending' },
        { id: 'ORD-002', customer: 'Xpeng', date: '2023-11-03', reason: '设备停机', value: '200 Sets', status: 'Resolved' },
    ]
};

const SIMULATION_CONFIGS: Record<string, SimConfigDef> = {
    // ... (Keep existing S1-S10 definitions)
    'S1': { // Urgent Order
        params: [
            { id: 'p1', label: '插单客户 (Customer)', type: 'select', options: ['GAC Aion', 'Xpeng Motors', 'Leapmotor', 'Changan Auto'], default: 'GAC Aion' },
            { id: 'p2', label: '追加订单数量 (Qty)', type: 'number', unit: 'Sets', default: 500, step: 50 },
            { id: 'p3', label: '要求交付日期 (Due Date)', type: 'date', default: '2023-12-01' },
            { id: 'p4', label: '订单优先级 (Priority)', type: 'select', options: ['P0 - Top Strategic', 'P1 - Urgent', 'P2 - Standard'], default: 'P1 - Urgent' },
            { id: 'p5', label: '产品类型 (Product)', type: 'select', options: ['Magazine Battery Pack', '800V Fast Charge Pack', 'Standard 60kWh Pack'], default: 'Magazine Battery Pack' },
            { id: 'p6', label: '最低毛利要求 (Margin)', type: 'number', unit: '%', default: 15, step: 0.5 }
        ],
        constraints: [
            { id: 'c1', label: '允许占用安全库存', type: 'boolean', default: false },
            { id: 'c2', label: '产线负荷上限 (Max Load)', type: 'range', min: 100, max: 130, default: 110, unit: '%' },
            { id: 'c3', label: '冻结期订单保护 (T-3)', type: 'boolean', default: true },
            { id: 'c4', label: '最大允许延期违约金', type: 'number', unit: 'CNY', default: 50000 },
            { id: 'c5', label: '物料齐套率检查', type: 'boolean', default: true }
        ],
        logic: [
            { id: 'l1', label: '排产策略 (Scheduling)', type: 'radio', options: ['插入空闲时隙 (Insert Idle)', '整体计划后移 (Shift All)', '拆分订单交付 (Split)'], default: '整体计划后移 (Shift All)' },
            { id: 'l2', label: '产线分配 (Allocation)', type: 'select', options: ['系统自动均衡', '优先 Base 1 (效率高)', '优先 Base 2 (成本低)'], default: '系统自动均衡' },
            { id: 'l3', label: '低优先级订单置换', type: 'boolean', default: false }
        ]
    },
    'S2': { // Equipment Breakdown
        params: [
            { id: 'p1', label: '故障设备 (Equipment)', type: 'select', options: ['Laser Welder #02 (Bottleneck)', 'Coating Machine #05', 'Formation Cabinet A', 'Aging Room B'], default: 'Laser Welder #02 (Bottleneck)' },
            { id: 'p2', label: '预计停机时长 (Duration)', type: 'number', unit: 'Hours', default: 4, step: 0.5 },
            { id: 'p3', label: '故障类型 (Type)', type: 'select', options: ['Mechanical Failure', 'Software/PLC Error', 'Electrical Fault', 'Planned Maintenance'], default: 'Mechanical Failure' },
            { id: 'p4', label: '当前在制品数量 (WIP)', type: 'number', unit: 'Units', default: 120 },
            { id: 'p5', label: '备件可用性', type: 'select', options: ['Available On-site', 'Local Warehouse (4h)', 'Vendor (24h+)'], default: 'Available On-site' }
        ],
        constraints: [
            { id: 'c1', label: '允许启用备用产线', type: 'boolean', default: true },
            { id: 'c2', label: '最大允许订单延期', type: 'number', default: 12, unit: 'Hours' },
            { id: 'c3', label: '维修技师资质要求', type: 'select', options: ['L1 (Junior)', 'L2 (Senior)', 'L3 (Expert)'], default: 'L2 (Senior)' },
            { id: 'c4', label: '开机前质量首检', type: 'boolean', default: true }
        ],
        logic: [
            { id: 'l1', label: '产能损失补偿', type: 'radio', options: ['周末加班 (Overtime)', '外协加工 (Outsource)', '接受延期 (Delay)'], default: '周末加班 (Overtime)' },
            { id: 'l2', label: '在制品 (WIP) 处理', type: 'select', options: ['报废 (Scrap)', '返工 (Rework)', '暂存等待 (Hold)'], default: '暂存等待 (Hold)' },
            { id: 'l3', label: '维修优先级策略', type: 'select', options: ['FIFO', 'Criticality Based', 'Shortest Job First'], default: 'Criticality Based' }
        ]
    },
    'S3': { // Material Shortage
        params: [
            { id: 'p1', label: '短缺物料 (Material)', type: 'select', options: ['NCM811 Cathode', 'Electrolyte Type-C', 'Copper Foil 6um', 'Separator Film 9um'], default: 'NCM811 Cathode' },
            { id: 'p2', label: '供应商 (Supplier)', type: 'select', options: ['Ronbay Tech', 'Tianqi Lithium', 'Capchem', 'Putailai'], default: 'Ronbay Tech' },
            { id: 'p3', label: '预计到货延迟 (Delay)', type: 'number', unit: 'Days', default: 3, step: 1 },
            { id: 'p4', label: '缺口数量 (Gap)', type: 'number', unit: 'Ton', default: 5, step: 0.1 },
            { id: 'p5', label: '受影响订单数', type: 'number', unit: 'Orders', default: 12 }
        ],
        constraints: [
            { id: 'c1', label: '安全库存最低水位', type: 'range', min: 0, max: 7, default: 2, unit: 'Days' },
            { id: 'c2', label: '现货采购限价上浮', type: 'range', min: 0, max: 20, default: 5, unit: '%' },
            { id: 'c3', label: '特采质量审批', type: 'boolean', default: true },
            { id: 'c4', label: '允许拆单生产', type: 'boolean', default: false }
        ],
        logic: [
            { id: 'l1', label: '替代料策略 (Alt Material)', type: 'radio', options: ['自动匹配替代料', '仅原厂认证物料', '现货市场紧急采购'], default: '仅原厂认证物料' },
            { id: 'l2', label: '生产计划调整', type: 'select', options: ['按缺料比例减产', '全线停产等待', '切换产品型号 (Changeover)'], default: '按缺料比例减产' },
            { id: 'l3', label: '跨基地调拨', type: 'boolean', default: true }
        ]
    },
    'S4': { // Logistics Delay
        params: [
            { id: 'p1', label: '受影响线路 (Route)', type: 'select', options: ['CN-EU Sea Freight', 'CN-US Air Freight', 'Domestic South Lane'], default: 'CN-EU Sea Freight' },
            { id: 'p2', label: '物流承运商 (Carrier)', type: 'select', options: ['Maersk', 'COSCO', 'SF Express', 'DHL'], default: 'COSCO' },
            { id: 'p3', label: '预计延误时长', type: 'number', unit: 'Days', default: 7 },
            { id: 'p4', label: '受影响货值 (Value)', type: 'number', unit: 'M RMB', default: 45 }
        ],
        constraints: [
            { id: 'c1', label: '客户 SLA 违约风险', type: 'boolean', default: true },
            { id: 'c2', label: '最大运输成本预算', type: 'number', unit: 'k RMB', default: 500 },
            { id: 'c3', label: '温控记录完整性', type: 'boolean', default: true }
        ],
        logic: [
            { id: 'l1', label: '补救措施 (Remedy)', type: 'radio', options: ['转空运 (Expedite Air)', '部分补发 (Partial)', '等待恢复 (Wait)'], default: '转空运 (Expedite Air)' },
            { id: 'l2', label: '海关快速通关申请', type: 'boolean', default: false }
        ]
    },
    'S5': { // Yield Drop
        params: [
            { id: 'p1', label: '异常产线 (Line)', type: 'select', options: ['Cell Line 1', 'Cell Line 2', 'Pack Line A'], default: 'Cell Line 1' },
            { id: 'p2', label: '异常工序 (Process)', type: 'select', options: ['Coating', 'Winding', 'Welding', 'Formation'], default: 'Welding' },
            { id: 'p3', label: '良率下降幅度', type: 'number', unit: '%', default: 5.0, step: 0.1 },
            { id: 'p4', label: '主要缺陷类型', type: 'select', options: ['Particle', 'Burr', 'Weak Weld', 'Insulation Fail'], default: 'Weak Weld' }
        ],
        constraints: [
            { id: 'c1', label: '最大报废成本限额', type: 'number', unit: 'k RMB/Day', default: 200 },
            { id: 'c2', label: '是否触发停线机制', type: 'boolean', default: true }
        ],
        logic: [
            { id: 'l1', label: '不良品处理 (Defect Handling)', type: 'radio', options: ['在线返修 (Rework)', '降级使用 (Downgrade)', '直接报废 (Scrap)'], default: '在线返修 (Rework)' },
            { id: 'l2', label: '工艺参数调整授权', type: 'select', options: ['Operator', 'Line Lead', 'Process Engineer'], default: 'Process Engineer' }
        ]
    },
    'S6': { // Labor Shortage
        params: [
            { id: 'p1', label: '受影响班次 (Shift)', type: 'select', options: ['Day Shift A', 'Night Shift B'], default: 'Day Shift A' },
            { id: 'p2', label: '缺勤人数 (Count)', type: 'number', unit: 'Pax', default: 15 },
            { id: 'p3', label: '缺勤比例 (Rate)', type: 'number', unit: '%', default: 12 },
            { id: 'p4', label: '关键岗位缺失', type: 'boolean', default: true }
        ],
        constraints: [
            { id: 'c1', label: 'EHS 最大工时限制', type: 'number', unit: 'Hours/Day', default: 12 },
            { id: 'c2', label: '技能矩阵匹配度', type: 'range', min: 0, max: 100, default: 80, unit: '%' }
        ],
        logic: [
            { id: 'l1', label: '人力补充策略', type: 'radio', options: ['跨班次调动', '外包临时工', '管理人员顶岗'], default: '跨班次调动' },
            { id: 'l2', label: '线速调整 (Line Speed)', type: 'range', min: 50, max: 100, default: 90, unit: '%' }
        ]
    },
    'S7': { // Cost Fluctuation
        params: [
            { id: 'p1', label: '大宗商品 (Commodity)', type: 'select', options: ['Lithium Carbonate', 'Nickel Sulfate', 'Cobalt', 'Copper'], default: 'Lithium Carbonate' },
            { id: 'p2', label: '价格波动幅度', type: 'number', unit: '%', default: 10, step: 1 },
            { id: 'p3', label: '预测持续时间', type: 'number', unit: 'Months', default: 3 }
        ],
        constraints: [
            { id: 'c1', label: '毛利率底线 (Min GM)', type: 'number', unit: '%', default: 12 },
            { id: 'c2', label: '长协锁价比例', type: 'number', unit: '%', default: 60 }
        ],
        logic: [
            { id: 'l1', label: '成本传导机制', type: 'radio', options: ['价格联动机制触发', '内部消化', '重新谈判'], default: '价格联动机制触发' },
            { id: 'l2', label: '套期保值策略', type: 'select', options: ['不操作', '买入看涨期权', '增加期货多单'], default: '增加期货多单' }
        ]
    },
    'S8': { // NPI Ramp-up
        params: [
            { id: 'p1', label: '新产品型号 (Model)', type: 'text' as any, default: 'Gen-5 Prismatic Cell' },
            { id: 'p2', label: '目标产能 (Target JPH)', type: 'number', default: 20 },
            { id: 'p3', label: '当前良率 (Yield)', type: 'number', unit: '%', default: 85 }
        ],
        constraints: [
            { id: 'c1', label: '工程团队支持时长', type: 'number', unit: 'Hours/Day', default: 8 },
            { id: 'c2', label: '试产物料配额', type: 'number', unit: 'Sets', default: 1000 }
        ],
        logic: [
            { id: 'l1', label: '爬坡曲线选择', type: 'radio', options: ['激进 (Aggressive)', '线性 (Linear)', '保守 (Conservative)'], default: '线性 (Linear)' },
            { id: 'l2', label: '质量门禁 (Quality Gate)', type: 'select', options: ['Strict (Zero Defect)', 'Standard (AQL 0.65)', 'Loose (Dev Phase)'], default: 'Standard (AQL 0.65)' }
        ]
    },
    'S9': { // Inventory Policy
        params: [
            { id: 'p1', label: '物料分类 (ABC Class)', type: 'select', options: ['Class A (High Value)', 'Class B', 'Class C (Low Value)'], default: 'Class A (High Value)' },
            { id: 'p2', label: '目标库存天数 (DOI)', type: 'number', unit: 'Days', default: 15 },
            { id: 'p3', label: '服务水平目标 (SLA)', type: 'number', unit: '%', default: 98 }
        ],
        constraints: [
            { id: 'c1', label: '营运资金限额', type: 'number', unit: 'M RMB', default: 50 },
            { id: 'c2', label: '仓库容积利用率上限', type: 'number', unit: '%', default: 90 }
        ],
        logic: [
            { id: 'l1', label: '补货策略 (Replenishment)', type: 'radio', options: ['Min-Max', 'Fixed Period', 'Just-In-Time (JIT)'], default: 'Min-Max' },
            { id: 'l2', label: '安全库存计算模型', type: 'select', options: ['Static', 'Dynamic (Demand Var)', 'AI Predictive'], default: 'Dynamic (Demand Var)' }
        ]
    },
    'S10': { // Demand Shock
        params: [
            { id: 'p1', label: '市场细分 (Segment)', type: 'select', options: ['Domestic EV', 'Export EV', 'Energy Storage'], default: 'Domestic EV' },
            { id: 'p2', label: '需求增幅 (Surge)', type: 'number', unit: '%', default: 30 },
            { id: 'p3', label: '持续时间 (Duration)', type: 'number', unit: 'Months', default: 6 }
        ],
        constraints: [
            { id: 'c1', label: '供应链弹性极限', type: 'number', unit: '%', default: 20 },
            { id: 'c2', label: '资本支出预算 (CapEx)', type: 'number', unit: 'M RMB', default: 10 }
        ],
        logic: [
            { id: 'l1', label: '扩产策略 (Expansion)', type: 'radio', options: ['新建产线 (Greenfield)', '技改扩容 (Brownfield)', '代工 (OEM)'], default: '技改扩容 (Brownfield)' },
            { id: 'l2', label: 'SKU 合理化', type: 'boolean', default: true }
        ]
    }
};

const GENERIC_CONFIG: SimConfigDef = {
    params: [
        { id: 'gp1', label: '关键变量 (Variable)', type: 'text' as any, default: 'Default Value' },
        { id: 'gp2', label: '调整幅度 (Delta)', type: 'range', min: -50, max: 50, default: 0, unit: '%' }
    ],
    constraints: [
        { id: 'gc1', label: '通用约束条件 A', type: 'boolean', default: true }
    ],
    logic: [
        { id: 'gl1', label: '推演模式', type: 'radio', options: ['保守模式', '激进模式'], default: '保守模式' }
    ]
};

const SIMULATION_SCENARIOS: SimulationScenario[] = [
    { id: 'S1', title: '急单插单模拟 (Urgent Order)', desc: '评估插入高优先级订单对现有排产和交付的冲击。', category: 'MARKET', icon: Zap, color: 'text-purple-600' },
    { id: 'S2', title: '设备故障停机 (Breakdown)', desc: '模拟关键瓶颈工序设备停机 4-24 小时的产能损失。', category: 'PRODUCTION', icon: Wrench, color: 'text-red-600' },
    { id: 'S3', title: '原材料短缺 (Material Shortage)', desc: '分析正极材料或电解液供应延迟对交付的影响。', category: 'SUPPLY', icon: Package, color: 'text-orange-600' },
    { id: 'S4', title: '物流延误 (Logistics Delay)', desc: '模拟海运或陆运干线中断对海外交付的影响。', category: 'DELIVERY', icon: Truck, color: 'text-blue-600' },
    { id: 'S5', title: '良率波动 (Yield Drop)', desc: '产线直通率下降 5% 对补料成本和交付周期的影响。', category: 'PRODUCTION', icon: TrendingUp, color: 'text-amber-600' },
    { id: 'S6', title: '人员缺勤 (Labor Shortage)', desc: '流感季或假期导致一线作业人员短缺 20% 的情景。', category: 'PRODUCTION', icon: Users, color: 'text-pink-600' },
    { id: 'S7', title: '成本波动 (Cost Fluctuation)', desc: '碳酸锂价格上涨 10% 对 Q4 毛利率的敏感性分析。', category: 'MARKET', icon: BarChart, color: 'text-emerald-600' },
    { id: 'S8', title: '新品爬坡 (NPI Ramp-up)', desc: '模拟新产品导入期产能爬坡曲线及良率学习曲线。', category: 'PRODUCTION', icon: RocketIcon, color: 'text-cyan-600' },
    { id: 'S9', title: '库存策略 (Inventory Policy)', desc: '调整安全库存天数 (DOI) 对缺货风险和资金占用的影响。', category: 'SUPPLY', icon: Layers, color: 'text-indigo-600' },
    { id: 'S10', title: '需求激增 (Demand Shock)', desc: '核心客户需求临时增加 30% 的全链路压力测试。', category: 'MARKET', icon: Activity, color: 'text-rose-600' },
];

function RocketIcon({ className }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>;
}

// --- Component Definitions ---

const AbnormalityPopover = ({ title, detail, onSimulate, onClickDetail, onContact, visible, onMouseEnter, onMouseLeave }: any) => {
    if (!visible) return null;
    return (
        <div 
            className="absolute z-[100] w-80 bg-white rounded-xl shadow-2xl border border-slate-200 p-0 animate-in fade-in zoom-in-95 duration-200 left-1/2 -translate-x-1/2 mt-2"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="px-4 py-3 border-b border-slate-100 bg-red-50/50 rounded-t-xl flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <AlertTriangle size={14} className="text-red-500"/>
                    <span className="font-bold text-slate-800 text-sm truncate max-w-[180px]">{title}</span>
                </div>
                <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold whitespace-nowrap">异常详情</span>
            </div>
            <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                        <div className="text-slate-400 mb-1">负责人</div>
                        <div className="font-medium text-slate-700 flex items-center gap-1">
                            <div className="w-4 h-4 rounded-full bg-slate-200 text-[9px] flex items-center justify-center">
                                {detail.owner[0]}
                            </div>
                            {detail.owner}
                        </div>
                    </div>
                    <div>
                        <div className="text-slate-400 mb-1">发生时间</div>
                        <div className="font-medium text-slate-700">{detail.occurredTime}</div>
                    </div>
                    <div>
                        <div className="text-slate-400 mb-1">当前状态</div>
                        <div className="font-medium text-blue-600">{detail.processingStatus}</div>
                    </div>
                    <div>
                        <div className="text-slate-400 mb-1">历史频次</div>
                        <div className="font-medium text-slate-700">{detail.historyCount} 次 / 30天</div>
                    </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-500 mb-1 uppercase flex items-center gap-1">
                        <BrainCircuit size={10}/> 智能归因
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {detail.rootCauseHint}
                    </p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <button onClick={(e) => { e.stopPropagation(); onContact(); }} className="py-1.5 border border-slate-200 rounded text-xs text-slate-600 hover:bg-slate-50 font-medium">
                        联系负责人
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onSimulate(); }} className="py-1.5 bg-purple-50 text-purple-700 border border-purple-100 rounded text-xs hover:bg-purple-100 font-medium">
                        推演分析
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onClickDetail(); }} className="py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 font-medium shadow-sm">
                        查看详情
                    </button>
                </div>
            </div>
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-50 border-t border-l border-slate-100 transform rotate-45"></div>
        </div>
    );
};

const MetricHoverWrapper = ({ children, metricId, title, status, onSimulate, onClickDetail, onContact, className }: any) => {
    const [visible, setVisible] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const detail = useMemo(() => getAbnormalityDetail(metricId, status), [metricId, status]);

    const handleMouseEnter = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (status === 'WARNING' || status === 'CRITICAL' || status === 'AT_RISK' || status === 'red') {
            setVisible(true);
        }
    };

    const handleMouseLeave = () => {
        timerRef.current = setTimeout(() => {
            setVisible(false);
        }, 5000); 
    };

    return (
        <div 
            className={`relative ${className || ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            <AbnormalityPopover 
                title={title}
                detail={detail}
                visible={visible}
                onSimulate={onSimulate}
                onClickDetail={onClickDetail}
                onContact={onContact}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />
        </div>
    );
};

const ShortageDetailView = ({ item, onBack }: { item: any, onBack: () => void }) => {
    return (
        <div className="max-w-6xl mx-auto animate-in slide-in-from-right duration-300 pb-10">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button onClick={onBack} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 shadow-sm transition-all">
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold text-slate-900">{item.name}</h2>
                        <span className="font-mono text-sm text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{item.code}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">供应商: {item.supplier} • 缺口: {item.gap}</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">当前库存 (DOI)</div>
                    <div className="text-2xl font-bold text-red-600">{item.doi}</div>
                    <div className="text-xs text-slate-500 mt-1">低于安全水位 (7 Days)</div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">预计断货日</div>
                    <div className="text-2xl font-bold text-slate-800">{item.date}</div>
                    <div className="text-xs text-amber-600 mt-1 font-medium">剩余 2 天</div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">风险等级</div>
                    <div className={`text-2xl font-bold ${item.risk === 'HIGH' ? 'text-red-600' : 'text-amber-600'}`}>{item.risk}</div>
                    <div className="text-xs text-slate-500 mt-1">需立即干预</div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center">
                    <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-slate-800 flex items-center gap-2">
                        <Zap size={16}/> 启动应急预案
                    </button>
                </div>
            </div>

            {/* Traceability Chain */}
            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 bg-slate-50 border-b border-r border-slate-200 px-4 py-1 text-xs font-bold text-slate-500 rounded-br-lg">
                    溯源归因与影响链条 (Root Cause & Impact Chain)
                </div>
                
                <div className="flex items-center justify-between mt-6 relative">
                    {/* Connecting Line */}
                    <div className="absolute left-10 right-10 top-1/2 h-0.5 bg-slate-200 -z-10"></div>

                    {/* Nodes */}
                    {/* 1. Supplier Source */}
                    <div className="flex flex-col items-center gap-3 bg-white p-2 z-10">
                        <div className="w-12 h-12 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center text-red-600 shadow-sm">
                            <Factory size={20}/>
                        </div>
                        <div className="text-center w-32">
                            <div className="text-xs font-bold text-slate-700">供应商生产受阻</div>
                            <div className="text-[10px] text-slate-500 mt-1 bg-red-50 px-2 py-1 rounded border border-red-100">
                                Ronbay Tech 产线检修延期
                            </div>
                        </div>
                    </div>

                    {/* 2. Logistics */}
                    <div className="flex flex-col items-center gap-3 bg-white p-2 z-10">
                        <div className="w-12 h-12 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-amber-600 shadow-sm">
                            <Truck size={20}/>
                        </div>
                        <div className="text-center w-32">
                            <div className="text-xs font-bold text-slate-700">物流在途</div>
                            <div className="text-[10px] text-slate-500 mt-1">
                                预计延误 3 天到达
                            </div>
                        </div>
                    </div>

                    {/* 3. Shortage Event (Center) */}
                    <div className="flex flex-col items-center gap-3 bg-white p-2 z-10">
                        <div className="w-16 h-16 rounded-full bg-red-600 border-4 border-red-100 flex items-center justify-center text-white shadow-lg animate-pulse">
                            <AlertTriangle size={28}/>
                        </div>
                        <div className="text-center w-40">
                            <div className="text-sm font-bold text-red-600">断货节点 (Stockout)</div>
                            <div className="text-xs text-slate-500 font-mono mt-1">
                                {item.date}
                            </div>
                        </div>
                    </div>

                    {/* 4. Manufacturing Impact */}
                    <div className="flex flex-col items-center gap-3 bg-white p-2 z-10">
                        <div className="w-12 h-12 rounded-full bg-orange-50 border-2 border-orange-200 flex items-center justify-center text-orange-600 shadow-sm">
                            <Wrench size={20}/>
                        </div>
                        <div className="text-center w-32">
                            <div className="text-xs font-bold text-slate-700">产线停机风险</div>
                            <div className="text-[10px] text-slate-500 mt-1 bg-orange-50 px-2 py-1 rounded border border-orange-100">
                                Base 1 & 2 (Cell Line)
                            </div>
                        </div>
                    </div>

                    {/* 5. Customer Impact */}
                    <div className="flex flex-col items-center gap-3 bg-white p-2 z-10">
                        <div className="w-12 h-12 rounded-full bg-purple-50 border-2 border-purple-200 flex items-center justify-center text-purple-600 shadow-sm">
                            <Users size={20}/>
                        </div>
                        <div className="text-center w-32">
                            <div className="text-xs font-bold text-slate-700">客户交付延期</div>
                            <div className="text-[10px] text-slate-500 mt-1 space-y-1">
                                <div className="bg-purple-50 px-1 py-0.5 rounded border border-purple-100">GAC Aion (ORD-9921)</div>
                                <div className="bg-purple-50 px-1 py-0.5 rounded border border-purple-100">Xpeng (ORD-8832)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Strategic Impact Analysis */}
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-3 opacity-10">
                        <Target size={80} className="text-indigo-900"/>
                    </div>
                    <h3 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
                        <Target size={18}/> 战略目标影响 (Strategic Goals at Risk)
                    </h3>
                    <div className="space-y-3 relative z-10">
                        <div className="bg-white/80 backdrop-blur p-3 rounded-lg border border-indigo-100 shadow-sm flex justify-between items-center">
                            <div>
                                <div className="text-xs font-bold text-slate-500">G2: 有效产能 (Capacity)</div>
                                <div className="font-bold text-slate-800 text-sm">目标: 50GWh</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs font-bold text-red-600">-2.5 GWh</div>
                                <div className="text-[10px] text-slate-400">预计损失</div>
                            </div>
                        </div>
                        <div className="bg-white/80 backdrop-blur p-3 rounded-lg border border-indigo-100 shadow-sm flex justify-between items-center">
                            <div>
                                <div className="text-xs font-bold text-slate-500">G4: 市场份额 (Market Share)</div>
                                <div className="font-bold text-slate-800 text-sm">目标: 8%</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs font-bold text-amber-600">High Risk</div>
                                <div className="text-[10px] text-slate-400">交付信誉受损</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-3 opacity-10">
                        <BrainCircuit size={80} className="text-amber-900"/>
                    </div>
                    <h3 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
                        <BrainCircuit size={18}/> 战略假设偏离 (Assumption Deviation)
                    </h3>
                    <div className="space-y-3 relative z-10">
                        <div className="bg-white/80 backdrop-blur p-3 rounded-lg border border-amber-100 shadow-sm">
                            <div className="flex justify-between items-center mb-1">
                                <div className="text-xs font-bold text-slate-500">A3: 原材料成本控制</div>
                                <span className="bg-red-100 text-red-700 text-[10px] px-1.5 py-0.5 rounded font-bold">DEVIATED</span>
                            </div>
                            <div className="text-xs text-slate-700">
                                若启动紧急现货采购，预计采购成本将上浮 15%，直接击穿 A3 设定的成本红线。
                            </div>
                        </div>
                        <div className="bg-white/80 backdrop-blur p-3 rounded-lg border border-amber-100 shadow-sm">
                            <div className="flex justify-between items-center mb-1">
                                <div className="text-xs font-bold text-slate-500">A7: 供应链物流通畅</div>
                                <span className="bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0.5 rounded font-bold">AT RISK</span>
                            </div>
                            <div className="text-xs text-slate-700">
                                上游物流延误频次增加，需重新评估物流供应商 SLA。
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const MetricCard = ({ metric, onClick }: { metric: FulfillmentMetric, onClick: () => void }) => (
    <div 
        onClick={onClick}
        className={`bg-white p-5 rounded-xl border transition-all cursor-pointer group hover:shadow-md ${
            metric.status === 'CRITICAL' ? 'border-red-200 bg-red-50/20' : 
            metric.status === 'WARNING' ? 'border-amber-200 bg-amber-50/20' : 
            'border-slate-200 hover:border-blue-300'
        }`}
    >
        <div className="flex justify-between items-start mb-2">
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{metric.code}</div>
            {metric.status === 'CRITICAL' && <AlertTriangle size={16} className="text-red-500"/>}
            {metric.status === 'WARNING' && <AlertCircle size={16} className="text-amber-500"/>}
            {metric.status === 'GOOD' && <CheckCircle2 size={16} className="text-emerald-500"/>}
        </div>
        <div className="text-sm font-bold text-slate-800 mb-1 line-clamp-1" title={metric.name}>{metric.name}</div>
        <div className="text-xs text-slate-400 mb-4 line-clamp-1">{metric.enName}</div>
        
        <div className="flex items-end justify-between">
            <div className="text-2xl font-bold text-slate-800">{metric.currentValue}</div>
            <div className="text-xs text-slate-500 mb-1">Target: {metric.industryAvg}</div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] text-slate-400">{metric.relatedObjects}</span>
            <ArrowRight size={14} className="text-blue-600"/>
        </div>
    </div>
);

const CollaborativeChatModal = ({ title, members, onClose }: { title: string, members: TeamMember[], onClose: () => void }) => {
    const [msgs, setMsgs] = useState([
        { id: 1, user: 'System', text: `Channel created for: ${title}`, time: 'Just now' }
    ]);
    const [input, setInput] = useState('');

    const send = () => {
        if(!input.trim()) return;
        setMsgs([...msgs, { id: Date.now(), user: 'Me', text: input, time: 'Now' }]);
        setInput('');
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-white w-[600px] h-[500px] rounded-xl shadow-2xl flex flex-col overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <MessageCircle size={18} className="text-indigo-600"/> {title}
                        </h3>
                        <div className="text-xs text-slate-500 mt-0.5 flex gap-2">
                            {members.map(m => <span key={m.id}>{m.name}</span>)}
                        </div>
                    </div>
                    <button onClick={onClose}><X size={18} className="text-slate-400 hover:text-slate-600"/></button>
                </div>
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
                    {msgs.map(m => (
                        <div key={m.id} className={`flex flex-col ${m.user === 'Me' ? 'items-end' : 'items-start'}`}>
                            <div className={`px-3 py-2 rounded-lg text-sm max-w-[80%] ${
                                m.user === 'Me' ? 'bg-indigo-600 text-white rounded-tr-none' : 
                                m.user === 'System' ? 'bg-slate-200 text-slate-600 text-xs py-1 self-center rounded-full' :
                                'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                            }`}>
                                {m.text}
                            </div>
                            {m.user !== 'System' && <span className="text-[10px] text-slate-400 mt-1">{m.user} • {m.time}</span>}
                        </div>
                    ))}
                </div>
                <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
                    <input 
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Type a message..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && send()}
                    />
                    <button onClick={send} className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                        <Send size={18}/>
                    </button>
                </div>
            </div>
        </div>
    );
};

const SimulationOverlay = ({ context, onClose }: { context: string, onClose: () => void }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-[900px] h-[650px] rounded-xl shadow-2xl flex flex-col overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        <BrainCircuit size={20} className="text-purple-600"/> 智能仿真推演 (AI Simulation)
                    </h3>
                    <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
                </div>
                <div className="flex-1 p-8 flex flex-col items-center justify-center bg-slate-50">
                    <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                        <BrainCircuit size={48} className="text-purple-600"/>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">正在初始化仿真环境...</h2>
                    <p className="text-slate-500 mb-8">Context: {context}</p>
                    <div className="w-full max-w-md bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-purple-600 h-full w-2/3 animate-[shimmer_1s_infinite]"></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-4">加载计算节点 (Nodes) ... 45%</p>
                </div>
            </div>
        </div>
    )
}

const CustomerSatisfactionDetail = ({ customer, onBack, onSimulate }: { customer: CustomerHealth, onBack: () => void, onSimulate: () => void }) => {
    const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'ENGAGEMENT' | 'DELIVERY'>('DASHBOARD');
    const [selectedMeeting, setSelectedMeeting] = useState<MeetingDetail | null>(null);
    const [selectedIssue, setSelectedIssue] = useState<OrderIssue | null>(null);

    // Mock Logic for getting deep data
    const deepData = MOCK_CUSTOMER_DEEP_DATA[customer.id] || MOCK_CUSTOMER_DEEP_DATA['C001']; // Fallback

    return (
        <div className="flex h-full bg-slate-50">
            {/* Left Sidebar: Quick Nav & Profile */}
            <div className="w-72 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 animate-in slide-in-from-left duration-300">
                <div className="p-6 border-b border-slate-100">
                    <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-4 transition-colors">
                        <ArrowLeft size={16}/> 返回列表
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm border border-indigo-200">
                            {customer.name.substring(0, 1)}
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900 text-lg leading-tight">{customer.name}</h2>
                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold mt-1 inline-block ${
                                customer.status === 'HEALTHY' ? 'bg-emerald-100 text-emerald-700' : 
                                customer.status === 'AT_RISK' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                            }`}>
                                {customer.status} • {customer.tier}
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="bg-slate-50 p-2 rounded border border-slate-100 text-center">
                            <div className="text-[10px] text-slate-400 uppercase font-bold">NPS Score</div>
                            <div className="text-xl font-bold text-slate-800">{customer.nps}</div>
                        </div>
                        <div className="bg-slate-50 p-2 rounded border border-slate-100 text-center">
                            <div className="text-[10px] text-slate-400 uppercase font-bold">Health</div>
                            <div className="text-xl font-bold text-slate-800">{customer.healthScore}</div>
                        </div>
                    </div>
                </div>
                
                <div className="flex-1 p-2 space-y-1">
                    {[
                        { id: 'DASHBOARD', label: '全景看板 (360 View)', icon: Layout },
                        { id: 'ENGAGEMENT', label: '交互与会议 (Engagement)', icon: MessageSquare },
                        { id: 'DELIVERY', label: '交付与风险 (Delivery)', icon: Truck },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id as any); setSelectedMeeting(null); setSelectedIssue(null); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                activeTab === tab.id 
                                ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            <tab.icon size={18}/> {tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-4 border-t border-slate-200">
                    <button onClick={onSimulate} className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2">
                        <BrainCircuit size={16}/> 满意度推演 (AI Sim)
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-8 relative">
                {activeTab === 'DASHBOARD' && (
                    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-slate-900">客户全景看板 (Customer 360)</h2>
                            <div className="text-sm text-slate-500">Data updated: Real-time</div>
                        </div>

                        {/* KPI Cards */}
                        <div className="grid grid-cols-4 gap-6">
                            {[
                                { label: '年度营收 (Revenue)', val: deepData.overview.revenue, sub: deepData.overview.yoy, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
                                { label: '交付准时率 (OTIF)', val: deepData.overview.otif, sub: 'Target: 95%', icon: Truck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                { label: '质量缺陷 (PPM)', val: deepData.overview.ppm, sub: 'Target: <50', icon: Microscope, color: 'text-red-600', bg: 'bg-red-50' },
                                { label: '应收账龄 (AR Aging)', val: deepData.overview.arAging, sub: 'Healthy', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
                            ].map((kpi, i) => (
                                <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-2 rounded-lg ${kpi.bg} ${kpi.color}`}>
                                            <kpi.icon size={20}/>
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${kpi.sub.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>{kpi.sub}</span>
                                    </div>
                                    <div className="text-2xl font-bold text-slate-800">{kpi.val}</div>
                                    <div className="text-xs text-slate-500 mt-1 uppercase font-bold">{kpi.label}</div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {/* NPS Trend (Mock) */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-80 flex flex-col">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Activity size={18} className="text-indigo-600"/> 净推荐值趋势 (NPS Trend)
                                </h3>
                                <div className="flex-1 flex items-end justify-between px-4 pb-2 border-b border-l border-slate-200 relative">
                                    {[65, 68, 66, 70, 72, 75].map((val, i) => (
                                        <div key={i} className="flex flex-col items-center gap-2 group w-full">
                                            <div className="w-full max-w-[40px] bg-indigo-500 rounded-t hover:bg-indigo-600 transition-colors relative" style={{height: `${val}%`}}>
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {val}
                                                </div>
                                            </div>
                                            <span className="text-xs text-slate-500">{['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'][i]}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Alerts */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-80 overflow-y-auto">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <AlertTriangle size={18} className="text-amber-500"/> 近期风险预警 (Recent Alerts)
                                </h3>
                                <div className="space-y-3">
                                    {deepData.deliveryIssues.filter(i => i.status !== 'DELIVERED').map((issue, i) => (
                                        <div key={i} className="p-3 bg-red-50 border border-red-100 rounded-lg flex gap-3">
                                            <AlertTriangle size={16} className="text-red-600 mt-0.5 flex-shrink-0"/>
                                            <div>
                                                <div className="text-sm font-bold text-slate-800">{issue.product} 交付延期</div>
                                                <div className="text-xs text-slate-600 mt-1">
                                                    订单 {issue.orderId} 预计晚于 {issue.expectedDate} 交付，延误 {issue.delayDays} 天。
                                                </div>
                                                <button 
                                                    onClick={() => { setActiveTab('DELIVERY'); setSelectedIssue(issue); }}
                                                    className="text-xs text-red-700 font-bold mt-2 hover:underline flex items-center gap-1"
                                                >
                                                    查看根因分析 <ArrowRight size={10}/>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex gap-3">
                                        <MessageSquare size={16} className="text-amber-600 mt-0.5 flex-shrink-0"/>
                                        <div>
                                            <div className="text-sm font-bold text-slate-800">Q4 价格谈判僵局</div>
                                            <div className="text-xs text-slate-600 mt-1">
                                                客户要求降价幅度超出财务底线，需高层介入。
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'ENGAGEMENT' && (
                    <div className="max-w-5xl mx-auto h-full flex flex-col animate-in fade-in duration-300">
                        {selectedMeeting ? (
                            // --- Meeting Detail View ---
                            <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => setSelectedMeeting(null)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500"><ArrowLeft size={18}/></button>
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-800">{selectedMeeting.title}</h2>
                                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                                <span className="flex items-center gap-1"><Calendar size={12}/> {selectedMeeting.date}</span>
                                                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">{selectedMeeting.type}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex -space-x-2">
                                        {selectedMeeting.attendees.map((a, i) => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600" title={a}>
                                                {a.substring(0,1)}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-8 overflow-y-auto space-y-8">
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <FileText size={16} className="text-slate-400"/> 会议纪要摘要
                                        </h3>
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-700 leading-relaxed">
                                            {selectedMeeting.summary}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <ListTodo size={16} className="text-indigo-600"/> 待办事项追踪 (Action Items)
                                        </h3>
                                        <div className="space-y-3">
                                            {selectedMeeting.actionItems.map((item) => (
                                                <div key={item.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:shadow-sm hover:border-indigo-200 transition-all bg-white group">
                                                    <div className="flex items-start gap-3">
                                                        <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center ${
                                                            item.status === 'DONE' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 text-transparent'
                                                        }`}>
                                                            <CheckSquare size={14}/>
                                                        </div>
                                                        <div>
                                                            <div className={`text-sm font-medium ${item.status === 'DONE' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{item.task}</div>
                                                            <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                                                                <User size={12}/> {item.owner}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className={`text-xs font-bold px-2 py-1 rounded mb-1 inline-block ${
                                                            item.status === 'DONE' ? 'bg-emerald-100 text-emerald-700' :
                                                            item.status === 'OVERDUE' ? 'bg-red-100 text-red-700' :
                                                            item.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                                                        }`}>
                                                            {item.status}
                                                        </div>
                                                        <div className={`text-xs ${item.status === 'OVERDUE' ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                                                            Due: {item.dueDate}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // --- Engagement Timeline ---
                            <>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">交互与会议记录 (Engagement History)</h2>
                                <div className="space-y-6 relative pl-6 border-l-2 border-slate-200">
                                    {deepData.meetings.map((mtg, i) => (
                                        <div key={i} className="relative group">
                                            <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-white border-4 border-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm group-hover:border-indigo-300 transition-colors">
                                                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                                            </div>
                                            <div 
                                                onClick={() => setSelectedMeeting(mtg)}
                                                className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-xs font-bold text-slate-500">{mtg.date}</span>
                                                            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold border border-indigo-100">{mtg.type}</span>
                                                        </div>
                                                        <h3 className="text-base font-bold text-slate-800">{mtg.title}</h3>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="text-xs text-slate-500 text-right">
                                                            <div className="font-bold">{mtg.actionItems.length} Actions</div>
                                                            <div className="text-[10px]">{mtg.actionItems.filter(a => a.status !== 'DONE').length} Open</div>
                                                        </div>
                                                        <ChevronRight size={16} className="text-slate-300"/>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-slate-600 line-clamp-2">{mtg.summary}</p>
                                                
                                                {/* Preview Action Items */}
                                                <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
                                                    {mtg.actionItems.slice(0, 2).map((action, ai) => (
                                                        <div key={ai} className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${action.status === 'DONE' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                                            <span className="truncate max-w-[150px]">{action.task}</span>
                                                        </div>
                                                    ))}
                                                    {mtg.actionItems.length > 2 && <span className="text-xs text-slate-400 self-center">+ {mtg.actionItems.length - 2}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {activeTab === 'DELIVERY' && (
                    <div className="max-w-5xl mx-auto h-full flex flex-col animate-in fade-in duration-300">
                        {selectedIssue ? (
                            // --- Root Cause Analysis View ---
                            <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => setSelectedIssue(null)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500"><ArrowLeft size={18}/></button>
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                                订单异常分析: {selectedIssue.orderId}
                                                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded border border-red-200">{selectedIssue.delayDays} Days Delay</span>
                                            </h2>
                                            <div className="text-xs text-slate-500 mt-1">Product: {selectedIssue.product}</div>
                                        </div>
                                    </div>
                                </div>
                                
                                {selectedIssue.analysis ? (
                                    <div className="p-8 overflow-y-auto">
                                        {/* Visual Root Cause Chain */}
                                        <div className="mb-8">
                                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                                                <GitPullRequest size={16} className="text-indigo-600"/> 归因溯源 (Traceability Chain)
                                            </h3>
                                            <div className="flex items-center justify-between relative">
                                                {/* Connecting Line */}
                                                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -z-10 transform -translate-y-1/2"></div>
                                                
                                                {selectedIssue.analysis.rootCauseChain.map((cause, idx) => (
                                                    <div key={idx} className="flex flex-col items-center gap-3 bg-white p-2 z-10 max-w-[180px]">
                                                        <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-indigo-200 flex items-center justify-center text-indigo-600 font-bold text-sm shadow-sm">
                                                            {idx + 1}
                                                        </div>
                                                        <div className="text-center">
                                                            <div className="text-xs font-bold text-slate-400 mb-1">Why?</div>
                                                            <div className="text-sm font-medium text-slate-800 bg-slate-50 p-2 rounded border border-slate-200">{cause}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="flex flex-col items-center gap-3 bg-white p-2 z-10">
                                                    <div className="w-10 h-10 rounded-full bg-red-100 border-2 border-red-300 flex items-center justify-center text-red-600 shadow-md">
                                                        <AlertTriangle size={20}/>
                                                    </div>
                                                    <div className="text-center font-bold text-red-700 text-sm mt-1">当前异常</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-8">
                                            {/* Impact */}
                                            <div className="col-span-1 bg-slate-50 p-5 rounded-xl border border-slate-200">
                                                <h3 className="text-sm font-bold text-slate-800 mb-3">业务影响 (Impact)</h3>
                                                <p className="text-sm text-slate-600 leading-relaxed">
                                                    {selectedIssue.analysis.impact}
                                                </p>
                                            </div>

                                            {/* CAPA Plan */}
                                            <div className="col-span-2">
                                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                    <Wrench size={16} className="text-emerald-600"/> 改善行动 (Corrective Actions)
                                                </h3>
                                                <div className="space-y-3">
                                                    {selectedIssue.analysis.correctiveActions.map((action) => (
                                                        <div key={action.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-white shadow-sm">
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="font-bold text-sm text-slate-800">{action.task}</span>
                                                                    {action.status === 'DONE' && <CheckCircle2 size={14} className="text-emerald-500"/>}
                                                                </div>
                                                                <div className="text-xs text-slate-500">
                                                                    Owner: {action.owner} • Due: {action.dueDate}
                                                                </div>
                                                            </div>
                                                            <div className={`px-3 py-1 rounded text-xs font-bold ${
                                                                action.status === 'DONE' ? 'bg-emerald-100 text-emerald-700' :
                                                                'bg-blue-100 text-blue-700'
                                                            }`}>
                                                                {action.status}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-slate-400">暂无详细归因分析数据</div>
                                )}
                            </div>
                        ) : (
                            // --- Delivery Issues List ---
                            <>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">交付异常与风险 (Delivery Issues)</h2>
                                <div className="space-y-4">
                                    {deepData.deliveryIssues.map((issue, i) => (
                                        <div 
                                            key={i} 
                                            onClick={() => setSelectedIssue(issue)}
                                            className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-red-200 transition-all cursor-pointer group"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${
                                                        issue.status === 'DELAYED' ? 'bg-red-50 text-red-600' : 
                                                        issue.status === 'RISK' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                                                    }`}>
                                                        {issue.status === 'DELAYED' ? <AlertOctagon size={20}/> : <AlertTriangle size={20}/>}
                                                    </div>
                                                    <div>
                                                        <div className="text-base font-bold text-slate-800">{issue.orderId}</div>
                                                        <div className="text-xs text-slate-500">{issue.product}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`text-lg font-bold ${issue.status === 'DELAYED' ? 'text-red-600' : 'text-amber-600'}`}>
                                                        +{issue.delayDays} Days
                                                    </div>
                                                    <div className="text-xs text-slate-400">Delay Impact</div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
                                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                                    <span>Expected: {issue.expectedDate}</span>
                                                    {issue.actualDate && <span>Actual: {issue.actualDate}</span>}
                                                </div>
                                                <div className="flex items-center gap-1 text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    归因分析 <ArrowRight size={12}/>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {deepData.deliveryIssues.length === 0 && (
                                        <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                            <CheckCircle2 size={32} className="text-emerald-300 mx-auto mb-2"/>
                                            <div className="text-slate-500 font-medium">当前无交付异常</div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const MetricL4Detail = ({ code, onBack, onChat, onSimulate }: { code: string, onBack: () => void, onChat: () => void, onSimulate: () => void }) => {
    // In a real app, fetch metric detail by code. Here using mock.
    const metric = L4_METRIC_MOCK; 

    return (
        <div className="max-w-6xl mx-auto animate-in slide-in-from-right duration-300 pb-10">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 shadow-sm transition-all">
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold text-slate-900">{metric.name}</h2>
                            <span className="font-mono text-sm text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{code}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{metric.description}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={onSimulate} className="px-4 py-2 bg-purple-50 text-purple-700 border border-purple-100 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors flex items-center gap-2">
                        <BrainCircuit size={16}/> 根因推演
                    </button>
                    <button onClick={onChat} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm">
                        <MessageCircle size={16}/> 发起讨论
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
                {/* Trend Chart Placeholder */}
                <div className="col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-80 flex flex-col">
                    <h3 className="font-bold text-slate-800 mb-4 text-sm">指标趋势 (Trend)</h3>
                    <div className="flex-1 flex items-end justify-between gap-2 px-4 border-b border-l border-slate-200 pb-2 relative">
                        {/* Target Line */}
                        <div className="absolute top-[20%] left-0 right-0 border-t border-dashed border-red-300">
                            <span className="absolute right-0 -top-5 text-xs text-red-400 font-bold">Target: 90%</span>
                        </div>
                        
                        {metric.trendData.map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-2 group">
                                <div 
                                    className={`w-12 rounded-t-sm transition-all relative ${d.value >= d.target ? 'bg-emerald-500' : 'bg-red-500'}`} 
                                    style={{ height: `${d.value}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {d.value}%
                                    </div>
                                </div>
                                <div className="text-[10px] text-slate-500">{d.date}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Root Causes */}
                <div className="col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2">
                        <Search size={16} className="text-blue-600"/> 归因分析 (Root Causes)
                    </h3>
                    <div className="space-y-3">
                        {metric.rootCauses.map((rc, i) => (
                            <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors">
                                <div className="flex justify-between items-start mb-1">
                                    <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                        rc.impact === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                    }`}>{rc.impact}</div>
                                    <div className="text-[10px] text-slate-400">Prob: {(rc.probability * 100).toFixed(0)}%</div>
                                </div>
                                <div className="text-xs font-bold text-slate-700 mb-1">{rc.cause}</div>
                                <div className="text-[10px] text-slate-500">Type: {rc.type}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Failed Records */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-3 border-b border-slate-200 bg-slate-50">
                    <h3 className="font-bold text-slate-700 text-sm">异常明细记录 (Failed Records)</h3>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium text-xs">
                        <tr>
                            <th className="px-6 py-2">ID</th>
                            <th className="px-6 py-2">Customer</th>
                            <th className="px-6 py-2">Date</th>
                            <th className="px-6 py-2">Reason</th>
                            <th className="px-6 py-2">Value</th>
                            <th className="px-6 py-2 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {metric.failedRecords.map((rec, i) => (
                            <tr key={i} className="hover:bg-slate-50">
                                <td className="px-6 py-3 font-mono text-slate-600">{rec.id}</td>
                                <td className="px-6 py-3 font-bold text-slate-800">{rec.customer}</td>
                                <td className="px-6 py-3 text-slate-500">{rec.date}</td>
                                <td className="px-6 py-3 text-red-600">{rec.reason}</td>
                                <td className="px-6 py-3 text-slate-700">{rec.value}</td>
                                <td className="px-6 py-3 text-right">
                                    <span className={`text-[10px] px-2 py-1 rounded font-bold ${
                                        rec.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                    }`}>{rec.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- L4: Contour-style Analysis Path ---
export const Analytics = () => {
    // ... (Keep state variables) ...
    const [selectedAnalysisId, setSelectedAnalysisId] = useState<string>('customer_satisfaction'); // Default
    const [activeL4Metric, setActiveL4Metric] = useState<string | null>(null);
    const [simResult, setSimResult] = useState<any>(null);
    const [isSimulating, setIsSimulating] = useState(false);
    
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
    const [chatConfig, setChatConfig] = useState<{title: string, members: TeamMember[]} | null>(null);
    const [simulationContext, setSimulationContext] = useState<string | null>(null);
    const [selectedSimScenario, setSelectedSimScenario] = useState<SimulationScenario | null>(null);

    // NEW STATE for Shortage Detail
    const [selectedShortageItem, setSelectedShortageItem] = useState<any>(null);

    // ... (Keep menuItems, getTeam, handleSimulate) ...
    const menuItems = [
        { id: 'customer_satisfaction', label: '高价值客户满意度分析', icon: Users, isCritical: true }, 
        { id: 'inventory_turnover', label: '库存周转率监控', icon: Package },
        { section: '核心场景 (Core Scenarios)' },
        { id: 's1_monitoring', label: 'S1 全链路交付监控', icon: Activity },
        { id: 's2_shortage', label: 'S2 缺货风险预警', icon: AlertTriangle },
        { id: 's3_rootcause', label: 'S3 异常根因分析', icon: Search },
        { id: 's4_bottleneck', label: 'S4 瓶颈工序识别', icon: Timer },
        { id: 'simulation_hub', label: 'S5 仿真模拟 (Simulation)', icon: BrainCircuit },
        { section: '订单履行 (Fulfillment)' },
        { id: 'fulfillment_perfect', label: '完美订单履行 (L1-L4)', icon: CheckCircle2 },
        { id: 'fulfillment_cycle', label: '订单履行周期 (Cycle Time)', icon: Clock },
        { id: 'fulfillment_risk', label: '订单交付风险 (Delivery Risk)', icon: ShieldAlert },
    ];

    const getTeam = (id: string) => MODULE_TEAMS[id] || MODULE_TEAMS['default'];

    const handleSimulate = () => {
        setIsSimulating(true);
        setTimeout(() => {
            setSimResult({
                impactLevel: 'HIGH',
                capacityChange: { before: 92, after: 105 },
                backlogChange: { before: 2, after: 5 }, // Weeks
                delayedOrders: [
                    { id: 'ORD-2023-881', customer: 'GAC Aion', product: 'Magazine Battery Pack', delay: '+2 Days' },
                    { id: 'ORD-2023-892', customer: 'Xpeng Motors', product: 'G6 Battery Pack', delay: '+3 Days' },
                    { id: 'ORD-2023-905', customer: 'Leapmotor', product: 'C11 Extended Range', delay: '+1 Day' }
                ],
                recommendation: '建议开启 Base 2 产线周末加班 (Overtime) 以消化增量，否则将导致核心客户延期。'
            });
            setIsSimulating(false);
        }, 1500);
    };

    // --- Render Functions ---

    // ... (Keep renderSimulationHub) ...
    const renderSimulationHub = () => {
        if (selectedSimScenario) {
            // Get dynamic config for the selected scenario, or fallback to generic
            const simConfig = SIMULATION_CONFIGS[selectedSimScenario.id] || GENERIC_CONFIG;

            // Detailed View for a specific scenario
            return (
                <div className="max-w-6xl mx-auto pb-10 animate-in slide-in-from-right-4 duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => { setSelectedSimScenario(null); setSimResult(null); }}
                                className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 shadow-sm transition-all"
                            >
                                <ArrowLeft size={18} />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                    <selectedSimScenario.icon className={selectedSimScenario.color} size={24}/> 
                                    {selectedSimScenario.title}
                                </h1>
                                <p className="text-slate-500 text-sm mt-1">{selectedSimScenario.desc}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setSimulationContext(selectedSimScenario.title)}
                                className="bg-white text-purple-600 border border-purple-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 shadow-sm flex items-center gap-2 transition-colors"
                            >
                                <BrainCircuit size={16}/> 智能推演
                            </button>
                            <button 
                                onClick={() => setChatConfig({ title: selectedSimScenario.title, members: getTeam('default') })}
                                className="bg-white text-indigo-600 border border-indigo-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 shadow-sm flex items-center gap-2 transition-colors"
                            >
                                <MessageCircle size={16}/> 联系负责人
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-6">
                        {/* Left: Input Panel */}
                        <div className="col-span-5 space-y-6">
                            {/* 1. Parameters - 2 Column Grid */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm">
                                    <Sliders size={16} className="text-blue-600"/> 场景参数 (Parameters)
                                </h3>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                                    {simConfig.params.map((param, i) => (
                                        <div key={i} className={param.type === 'select' || param.type === 'text' ? 'col-span-2' : 'col-span-1'}>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 truncate" title={param.label}>{param.label}</label>
                                            {param.type === 'select' ? (
                                                <select className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-xs outline-none bg-white focus:border-blue-500 transition-colors" defaultValue={param.default}>
                                                    {param.options?.map((opt, oi) => <option key={oi}>{opt}</option>)}
                                                </select>
                                            ) : param.type === 'date' ? (
                                                <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-2.5 py-2 bg-white focus-within:border-blue-500 transition-colors">
                                                    <CalendarClock size={14} className="text-slate-400 flex-shrink-0"/>
                                                    <input type="text" defaultValue={param.default} className="w-full text-xs outline-none"/>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-2.5 py-2 bg-white focus-within:border-blue-500 transition-colors">
                                                    <input type="number" defaultValue={param.default} step={param.step || 1} className="w-full text-xs outline-none"/>
                                                    {param.unit && <span className="text-[10px] text-slate-400 flex-shrink-0">{param.unit}</span>}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 2. Constraints */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm">
                                    <Scale size={16} className="text-amber-600"/> 约束规则 (Constraints)
                                </h3>
                                <div className="space-y-3">
                                    {simConfig.constraints.map((cons, i) => (
                                        <div key={i} className="flex flex-col gap-1 pb-2 border-b border-slate-50 last:border-0 last:pb-0">
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs font-medium text-slate-700">{cons.label}</label>
                                                {cons.type === 'boolean' && (
                                                    <div className="relative inline-block w-8 h-4 align-middle select-none transition duration-200 ease-in">
                                                        <input type="checkbox" defaultChecked={cons.default} className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-300 checked:right-0 checked:border-blue-600"/>
                                                        <label className="toggle-label block overflow-hidden h-4 rounded-full bg-slate-300 cursor-pointer checked:bg-blue-600"></label>
                                                    </div>
                                                )}
                                                {cons.type === 'select' && (
                                                    <select className="text-xs border border-slate-200 rounded px-1 py-0.5 bg-slate-50 outline-none" defaultValue={cons.default}>
                                                        {cons.options?.map(opt => <option key={opt}>{opt}</option>)}
                                                    </select>
                                                )}
                                            </div>
                                            {cons.type === 'range' && (
                                                <div className="flex items-center gap-2 mt-1">
                                                    <input type="range" min={cons.min} max={cons.max} defaultValue={cons.default} className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                                                    <span className="text-xs font-mono text-slate-600 w-10 text-right">{cons.default}{cons.unit}</span>
                                                </div>
                                            )}
                                            {cons.type === 'number' && (
                                                <div className="flex items-center gap-2 border border-slate-200 rounded px-2 py-1 bg-slate-50 w-24 self-end">
                                                    <input type="number" defaultValue={cons.default} className="w-full text-xs bg-transparent outline-none text-right"/>
                                                    <span className="text-[10px] text-slate-400">{cons.unit}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 3. Logic */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm">
                                    <BrainCircuit size={16} className="text-purple-600"/> 推演逻辑 (Deduction Logic)
                                </h3>
                                <div className="space-y-4">
                                    {simConfig.logic.map((log, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="block text-xs font-bold text-slate-500 uppercase">{log.label}</label>
                                                {log.type === 'boolean' && (
                                                    <input type="checkbox" defaultChecked={log.default} className="rounded text-purple-600 focus:ring-purple-500"/>
                                                )}
                                            </div>
                                            {(log.type === 'radio' || log.type === 'select') && (
                                                <div className="flex flex-wrap gap-2">
                                                    {log.options?.map((opt, oi) => (
                                                        <label key={oi} className="flex items-center gap-1.5 cursor-pointer bg-slate-50 px-2 py-1.5 rounded border border-slate-200 hover:border-purple-300 transition-colors">
                                                            <input type="radio" name={`logic-${i}`} defaultChecked={opt === log.default} className="text-purple-600 focus:ring-purple-500"/>
                                                            <span className="text-xs text-slate-700">{opt}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                            {log.type === 'range' && (
                                                <div className="flex items-center gap-2">
                                                    <input type="range" min={log.min} max={log.max} defaultValue={log.default} className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600" />
                                                    <span className="text-xs font-mono text-slate-600">{log.default}{log.unit}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button 
                                onClick={handleSimulate}
                                disabled={isSimulating}
                                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-70 disabled:cursor-not-allowed group"
                            >
                                {isSimulating ? <ArrowRightLeft className="animate-spin" size={18}/> : <PlayCircle size={18} className="group-hover:text-emerald-400 transition-colors"/>}
                                {isSimulating ? '模拟计算中 (Calculating)...' : '开始模拟 (Run Simulation)'}
                            </button>
                        </div>

                        {/* Right: Results Panel */}
                        <div className="col-span-7">
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
                                            <div className="text-xs font-bold uppercase mb-1 text-slate-500">关键指标变化 (Delta)</div>
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
                                            <h4 className="font-bold text-slate-700 text-sm">受影响业务实体 (Affected Entities)</h4>
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
                                            <CheckSquare size={16}/> 确认方案并下发
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
            )
        }

        // Hub View (Grid of scenarios)
        return (
            <div className="max-w-6xl mx-auto pb-10 animate-in slide-in-from-right-4 duration-300">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <BrainCircuit className="text-indigo-600"/> 仿真模拟中心 (Simulation Hub)
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">
                            基于数字孪生技术，提供多维度业务场景的压力测试与沙盘推演。
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {SIMULATION_SCENARIOS.map((scenario) => (
                        <div 
                            key={scenario.id}
                            onClick={() => setSelectedSimScenario(scenario)}
                            className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-indigo-300 transition-all cursor-pointer group relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl bg-slate-50 group-hover:bg-white group-hover:shadow-sm transition-all ${scenario.color}`}>
                                    <scenario.icon size={24} />
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{scenario.category}</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{scenario.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed mb-4 min-h-[40px]">{scenario.desc}</p>
                            <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                                进入模拟 <ArrowRight size={14}/>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-full bg-slate-50">
            {/* Left Sidebar */}
            <div className="w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <BarChart3 size={18} className="text-blue-600"/> 经营分析 (Analytics)
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {menuItems.map((item: any, idx) => {
                        if (item.section) {
                            return (
                                <div key={idx} className="px-3 py-2 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    {item.section}
                                </div>
                            );
                        }
                        const Icon = item.icon;
                        const isActive = selectedAnalysisId === item.id;
                        return (
                            <div 
                                key={item.id}
                                onClick={() => {
                                    setSelectedAnalysisId(item.id);
                                    setActiveL4Metric(null);
                                    setSelectedCustomerId(null);
                                    setSelectedSimScenario(null);
                                    setSelectedShortageItem(null); // Reset detail view
                                }}
                                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm font-medium ${
                                    isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Icon size={16} className={isActive ? 'text-blue-600' : 'text-slate-400'}/>
                                    <span>{item.label}</span>
                                </div>
                                {item.isCritical && <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Modals/Overlays */}
                {simulationContext && (
                    <SimulationOverlay context={simulationContext} onClose={() => setSimulationContext(null)} />
                )}
                
                {chatConfig && (
                    <CollaborativeChatModal 
                        title={chatConfig.title} 
                        members={chatConfig.members} 
                        onClose={() => setChatConfig(null)}
                    />
                )}

                <div className="flex-1 overflow-y-auto p-8 relative">
                    {/* Render logic based on selectedAnalysisId */}
                    {selectedAnalysisId === 'customer_satisfaction' && (
                        selectedCustomerId ? (
                            <CustomerSatisfactionDetail 
                                customer={CUSTOMER_LIST.find(c => c.id === selectedCustomerId)!} 
                                onBack={() => setSelectedCustomerId(null)}
                                onSimulate={() => setSimulationContext(`Customer: ${CUSTOMER_LIST.find(c => c.id === selectedCustomerId)?.name}`)}
                            />
                        ) : (
                            <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-2xl font-bold text-slate-900">高价值客户满意度分析 (HVC Health)</h1>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1.5 bg-white border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50">本月</button>
                                        <button className="px-3 py-1.5 bg-white border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-1"><Filter size={14}/> 筛选</button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {CUSTOMER_LIST.map(customer => (
                                        <div 
                                            key={customer.id} 
                                            onClick={() => setSelectedCustomerId(customer.id)}
                                            className="bg-white p-5 rounded-xl border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600">{customer.name}</h3>
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                            customer.status === 'HEALTHY' ? 'bg-emerald-100 text-emerald-700' :
                                                            customer.status === 'AT_RISK' ? 'bg-amber-100 text-amber-700' :
                                                            'bg-red-100 text-red-700'
                                                        }`}>{customer.status}</span>
                                                    </div>
                                                    <div className="text-xs text-slate-500 mt-1">{customer.type === 'PV' ? 'Passenger Vehicle' : 'Energy Storage'} • {customer.tier}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-slate-800">{customer.healthScore}</div>
                                                    <div className="text-[10px] text-slate-400">Health Score</div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                                                <div>
                                                    <div className="text-[10px] text-slate-400 uppercase">NPS</div>
                                                    <div className="font-bold text-slate-700">{customer.nps}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[10px] text-slate-400 uppercase">Open Tickets</div>
                                                    <div className={`font-bold ${customer.openTickets > 3 ? 'text-red-600' : 'text-slate-700'}`}>{customer.openTickets}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[10px] text-slate-400 uppercase">Revenue</div>
                                                    <div className="font-bold text-slate-700">{customer.revenue}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    )}

                    {/* S1 Monitoring View - REFACTORED TO CUSTOMER-ORDER VIEW */}
                    {selectedAnalysisId === 's1_monitoring' && (
                        <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
                            <div className="mb-8 flex justify-between items-end">
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900 mb-2">全链路交付监控 (End-to-End Delivery)</h1>
                                    <p className="text-slate-500 text-sm">按客户维度追踪订单的实时状态、所处阶段及交付风险。</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1.5 bg-white border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-1">
                                        <Filter size={14}/> 筛选订单
                                    </button>
                                    <button className="px-3 py-1.5 bg-white border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-1">
                                        <Download size={14}/> 导出报表
                                    </button>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="flex gap-6 mb-6 px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm w-fit">
                                <div className="flex items-center gap-2 text-xs">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                    <span className="text-slate-600">正常 (On Track)</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                    <span className="text-slate-600">风险预警 (At Risk)</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <span className="text-slate-600">已延误 (Delayed)</span>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                {[
                                    {
                                        customerId: 'C001', customerName: 'GAC Aion (广汽埃安)', totalOrders: 5, activeOrders: 2,
                                        orders: [
                                            { id: 'ORD-2023-881', product: 'Magazine Battery Pack', qty: '500 Sets', amount: '¥25M', status: 'ON_TRACK', currentStage: 4, date: '2023-11-15' },
                                            { id: 'ORD-2023-882', product: 'Aion Y Pack', qty: '300 Sets', amount: '¥12M', status: 'DELAYED', currentStage: 6, date: '2023-11-12', delayReason: 'Logistics' },
                                        ]
                                    },
                                    {
                                        customerId: 'C002', customerName: 'Xpeng Motors (小鹏汽车)', totalOrders: 8, activeOrders: 3,
                                        orders: [
                                            { id: 'ORD-2023-892', product: 'G6 800V Battery', qty: '450 Sets', amount: '¥28M', status: 'AT_RISK', currentStage: 3, date: '2023-11-18', riskReason: 'Material Shortage' },
                                            { id: 'ORD-2023-895', product: 'P7i Pack', qty: '200 Sets', amount: '¥9M', status: 'ON_TRACK', currentStage: 2, date: '2023-11-20' },
                                            { id: 'ORD-2023-896', product: 'G9 Pack', qty: '150 Sets', amount: '¥11M', status: 'ON_TRACK', currentStage: 5, date: '2023-11-16' },
                                        ]
                                    },
                                    {
                                        customerId: 'C004', customerName: 'Leapmotor (零跑汽车)', totalOrders: 3, activeOrders: 1,
                                        orders: [
                                            { id: 'ORD-2023-905', product: 'C11 Extended Range', qty: '600 Sets', amount: '¥18M', status: 'ON_TRACK', currentStage: 7, date: '2023-11-10' },
                                        ]
                                    }
                                ].map((cust) => (
                                    <div key={cust.customerId} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                                        {/* Customer Header */}
                                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-bold shadow-sm">
                                                    {cust.customerName.substring(0, 1)}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-800 text-sm">{cust.customerName}</h3>
                                                    <div className="text-xs text-slate-500">活跃订单: {cust.activeOrders} / 总订单: {cust.totalOrders}</div>
                                                </div>
                                            </div>
                                            <button className="text-slate-400 hover:text-slate-600">
                                                <MoreHorizontal size={18}/>
                                            </button>
                                        </div>

                                        {/* Orders List */}
                                        <div className="divide-y divide-slate-100">
                                            {cust.orders.map((order) => (
                                                <div key={order.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                                                    <div className="flex items-start justify-between mb-6">
                                                        <div className="flex gap-8">
                                                            <div>
                                                                <div className="text-xs text-slate-400 mb-1">订单编号</div>
                                                                <div className="font-mono font-bold text-slate-700 text-sm">{order.id}</div>
                                                            </div>
                                                            <div>
                                                                <div className="text-xs text-slate-400 mb-1">产品型号</div>
                                                                <div className="font-medium text-slate-700 text-sm">{order.product}</div>
                                                            </div>
                                                            <div>
                                                                <div className="text-xs text-slate-400 mb-1">交付数量</div>
                                                                <div className="font-medium text-slate-700 text-sm">{order.qty}</div>
                                                            </div>
                                                            <div>
                                                                <div className="text-xs text-slate-400 mb-1">金额</div>
                                                                <div className="font-mono font-medium text-slate-700 text-sm">{order.amount}</div>
                                                            </div>
                                                        </div>
                                                        
                                                        {order.status === 'DELAYED' && (
                                                            <div className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold border border-red-100 flex items-center gap-1">
                                                                <AlertTriangle size={12}/> 延误: {order.delayReason}
                                                            </div>
                                                        )}
                                                        {order.status === 'AT_RISK' && (
                                                            <div className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold border border-amber-100 flex items-center gap-1">
                                                                <AlertCircle size={12}/> 风险: {order.riskReason}
                                                            </div>
                                                        )}
                                                        {order.status === 'ON_TRACK' && (
                                                            <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-100 flex items-center gap-1">
                                                                <CheckCircle2 size={12}/> 正常
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Progress Bar */}
                                                    <div className="relative pt-2 pb-2">
                                                        {/* Line */}
                                                        <div className="absolute top-5 left-0 right-0 h-1 bg-slate-100 rounded-full -z-10"></div>
                                                        <div className="absolute top-5 left-0 h-1 rounded-full -z-10 transition-all duration-1000"
                                                             style={{ 
                                                                 width: `${(order.currentStage / 7) * 100}%`,
                                                                 backgroundColor: order.status === 'DELAYED' ? '#ef4444' : order.status === 'AT_RISK' ? '#f59e0b' : '#10b981'
                                                             }}
                                                        ></div>

                                                        <div className="flex justify-between">
                                                            {['订单接收', '计划排产', '物料配套', '生产制造', '质量放行', '物流运输', '客户签收'].map((step, idx) => {
                                                                const stepNum = idx + 1;
                                                                const isCompleted = stepNum <= order.currentStage;
                                                                const isCurrent = stepNum === order.currentStage;
                                                                
                                                                let nodeColor = 'bg-slate-200 border-slate-300 text-slate-400'; // Default
                                                                if (isCompleted) {
                                                                    if (order.status === 'DELAYED') nodeColor = 'bg-red-500 border-red-500 text-white';
                                                                    else if (order.status === 'AT_RISK') nodeColor = 'bg-amber-500 border-amber-500 text-white';
                                                                    else nodeColor = 'bg-emerald-500 border-emerald-500 text-white';
                                                                }

                                                                return (
                                                                    <div key={idx} className="flex flex-col items-center gap-2 relative">
                                                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold z-10 transition-colors ${nodeColor} ${isCurrent ? 'ring-4 ring-opacity-20 ' + (order.status === 'DELAYED' ? 'ring-red-500' : order.status === 'AT_RISK' ? 'ring-amber-500' : 'ring-emerald-500') : ''}`}>
                                                                            {isCompleted ? <CheckCircle2 size={12}/> : stepNum}
                                                                        </div>
                                                                        <span className={`text-[10px] font-medium ${isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>{step}</span>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {selectedAnalysisId === 's2_shortage' && (
                        selectedShortageItem ? (
                            <ShortageDetailView item={selectedShortageItem} onBack={() => setSelectedShortageItem(null)} />
                        ) : (
                            <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
                                <div className="mb-6 flex justify-between items-center">
                                    <div>
                                        <h1 className="text-2xl font-bold text-slate-900 mb-2">物料缺货风险预警 (Shortage Risk)</h1>
                                        <p className="text-slate-500 text-sm">基于 MRP 运算与实时库存的未来 4 周缺料预警。</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1.5 bg-white border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50">导出清单</button>
                                        <button className="px-3 py-1.5 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700 shadow-sm">一键催料</button>
                                    </div>
                                </div>

                                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-slate-50 text-slate-500 font-medium">
                                            <tr>
                                                <th className="px-6 py-3">物料编码</th>
                                                <th className="px-6 py-3">物料名称</th>
                                                <th className="px-6 py-3">当前库存 (DOI)</th>
                                                <th className="px-6 py-3">预计断货日</th>
                                                <th className="px-6 py-3">缺口数量</th>
                                                <th className="px-6 py-3">风险等级</th>
                                                <th className="px-6 py-3">供应商</th>
                                                <th className="px-6 py-3 text-right">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {[
                                                { code: 'MAT-8821', name: 'NCM811 Cathode', doi: '2.5 Days', date: '2023-11-20', gap: '5.2 Tons', risk: 'HIGH', supplier: 'Ronbay Tech' },
                                                { code: 'MAT-3329', name: 'Electrolyte Type-C', doi: '4.0 Days', date: '2023-11-22', gap: '12 Barrels', risk: 'MED', supplier: 'Capchem' },
                                                { code: 'MAT-1002', name: 'Separator 9um', doi: '1.2 Days', date: '2023-11-18', gap: '80 Rolls', risk: 'HIGH', supplier: 'Semcorp' },
                                                { code: 'MAT-5591', name: 'Copper Foil 6um', doi: '5.5 Days', date: '2023-11-25', gap: '2.0 Tons', risk: 'LOW', supplier: 'Jiayuan' },
                                            ].map((row, i) => (
                                                <tr key={i} className={`hover:bg-slate-50 ${row.risk === 'HIGH' ? 'bg-red-50/30' : ''}`}>
                                                    <td className="px-6 py-4 font-mono text-slate-600">{row.code}</td>
                                                    <td className="px-6 py-4 font-bold text-slate-700">{row.name}</td>
                                                    <td className="px-6 py-4 text-slate-600">{row.doi}</td>
                                                    <td className="px-6 py-4 text-red-600 font-medium">{row.date}</td>
                                                    <td className="px-6 py-4 text-slate-700">{row.gap}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                            row.risk === 'HIGH' ? 'bg-red-100 text-red-700' : 
                                                            row.risk === 'MED' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                                                        }`}>{row.risk}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-600">{row.supplier}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button 
                                                            onClick={() => setSelectedShortageItem(row)}
                                                            className="text-blue-600 hover:underline text-xs font-medium"
                                                        >
                                                            查看详情
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )
                    )}

                    {selectedAnalysisId === 's3_rootcause' && (
                        <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
                            <div className="mb-8">
                                <h1 className="text-2xl font-bold text-slate-900 mb-2">异常事件根因分析 (Root Cause Analysis)</h1>
                                <p className="text-slate-500 text-sm">利用 AI 模型自动关联人、机、料、法、环数据，定位异常根因。</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    { title: 'OTIF 指标骤降 (Nov 12)', score: 92, cause: '供应商 A 物料批次质量不合格导致产线停工待料。', system: 'QMS + ERP' },
                                    { title: 'Base 2 产线良率波动', score: 85, cause: '涂布机 #05 张力控制参数漂移，建议立即校准。', system: 'MES + IoT' },
                                    { title: '物流成本超支 15%', score: 88, cause: '紧急空运比例增加，主要用于弥补前期海运延误。', system: 'TMS + SAP' },
                                    { title: '客诉：SOC 显示不准', score: 78, cause: 'BMS 固件版本 v2.1 在低温环境下估算算法偏差。', system: 'CRM + PLM' },
                                ].map((card, i) => (
                                    <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-red-50 text-red-600 rounded-lg group-hover:bg-red-100 transition-colors">
                                                    <AlertOctagon size={20}/>
                                                </div>
                                                <h3 className="font-bold text-slate-800 text-base">{card.title}</h3>
                                            </div>
                                            <div className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">
                                                AI 置信度: <span className="text-slate-800">{card.score}%</span>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-4">
                                            <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 mb-2">
                                                <BrainCircuit size={14}/> AI 根因诊断
                                            </div>
                                            <p className="text-sm text-indigo-900 leading-relaxed">
                                                {card.cause}
                                            </p>
                                        </div>

                                        <div className="flex justify-between items-center text-xs text-slate-500">
                                            <span>数据源: {card.system}</span>
                                            <button className="flex items-center gap-1 text-blue-600 hover:underline font-medium">
                                                查看完整分析报告 <ArrowRight size={12}/>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {selectedAnalysisId === 's4_bottleneck' && (
                        <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
                            <div className="mb-8">
                                <h1 className="text-2xl font-bold text-slate-900 mb-2">生产瓶颈工序识别 (Bottleneck ID)</h1>
                                <p className="text-slate-500 text-sm">实时监控各工序 JPH (Jobs Per Hour) 与 OEE，识别产能短板。</p>
                            </div>

                            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm mb-6">
                                <div className="flex items-end justify-between gap-4 h-64 border-b border-slate-200 px-4 relative">
                                    {/* Capacity Line */}
                                    <div className="absolute top-[20%] left-0 right-0 border-t-2 border-dashed border-slate-300 pointer-events-none">
                                        <span className="absolute right-0 -top-5 text-xs text-slate-400">Target: 30 JPH</span>
                                    </div>

                                    {[
                                        { name: '涂布 (Coating)', val: 32, util: '92%' },
                                        { name: '辊压 (Calender)', val: 35, util: '88%' },
                                        { name: '分切 (Slitting)', val: 34, util: '85%' },
                                        { name: '卷绕 (Winding)', val: 22, util: '98%', isBottleneck: true }, // Bottleneck
                                        { name: '装配 (Assembly)', val: 28, util: '90%' },
                                        { name: '化成 (Formation)', val: 30, util: '95%' },
                                    ].map((proc, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-2 group">
                                            <div className="text-xs font-bold text-slate-500 mb-1">{proc.val} JPH</div>
                                            <div 
                                                className={`w-16 rounded-t-lg transition-all relative group-hover:opacity-90 ${
                                                    proc.isBottleneck ? 'bg-red-500' : 'bg-blue-500'
                                                }`} 
                                                style={{ height: `${(proc.val / 40) * 100}%` }}
                                            >
                                                {proc.isBottleneck && (
                                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded border border-red-200 whitespace-nowrap animate-bounce">
                                                        瓶颈 (Constraint)
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-xs font-medium text-slate-700">{proc.name}</div>
                                            <div className="text-[10px] text-slate-400">Util: {proc.util}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-red-50 border border-red-100 rounded-xl p-5 flex justify-between items-center">
                                <div>
                                    <h4 className="text-sm font-bold text-red-800 mb-1 flex items-center gap-2">
                                        <AlertCircle size={16}/> 建议措施: 卷绕工序扩容
                                    </h4>
                                    <p className="text-xs text-red-700">卷绕工序 JPH (22) 远低于目标 (30)，已成为全线产能瓶颈。建议增加 2 台卷绕机或开启周末加班。</p>
                                </div>
                                <button className="bg-white border border-red-200 text-red-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors shadow-sm">
                                    生成扩产方案
                                </button>
                            </div>
                        </div>
                    )}

                    {selectedAnalysisId === 'fulfillment_perfect' && (
                        activeL4Metric ? (
                            <MetricL4Detail 
                                code={activeL4Metric} 
                                onBack={() => setActiveL4Metric(null)} 
                                onChat={() => setChatConfig({ title: `Metric: ${activeL4Metric}`, members: getTeam('fulfillment') })}
                                onSimulate={() => setSimulationContext(`Metric: ${activeL4Metric} Optimization`)}
                            />
                        ) : (
                            <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
                                <div className="mb-8">
                                    <h1 className="text-2xl font-bold text-slate-900 mb-2">完美订单履行 (Perfect Order Fulfillment)</h1>
                                    <p className="text-slate-500 text-sm">监控从订单接收到最终交付的全链路指标，确保 OTIF 达成率。</p>
                                </div>
                                
                                {['PERFECT_ORDER', 'FULFILLMENT_CYCLE', 'DELIVERY_RISK'].map(category => (
                                    <div key={category} className="mb-8">
                                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
                                            {category === 'PERFECT_ORDER' ? '核心交付指标 (Core Metrics)' : 
                                             category === 'FULFILLMENT_CYCLE' ? '周期效率 (Cycle Time)' : '风险监控 (Risk Monitor)'}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            {fulfillmentData[category].map(metric => (
                                                <MetricHoverWrapper 
                                                    key={metric.code}
                                                    metricId={metric.code}
                                                    title={metric.name}
                                                    status={metric.status}
                                                    onSimulate={() => setSimulationContext(`Anomaly: ${metric.name} (${metric.code})`)}
                                                    onClickDetail={() => setActiveL4Metric(metric.code)}
                                                    onContact={() => setChatConfig({ title: `Anomaly: ${metric.name}`, members: getTeam('fulfillment') })}
                                                >
                                                    <MetricCard 
                                                        metric={metric} 
                                                        onClick={() => setActiveL4Metric(metric.code)}
                                                    />
                                                </MetricHoverWrapper>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    )}

                    {selectedAnalysisId === 'fulfillment_cycle' && (
                        <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
                            <div className="mb-8">
                                <h1 className="text-2xl font-bold text-slate-900 mb-2">订单履行周期分析 (Order-to-Delivery Cycle)</h1>
                                <p className="text-slate-500 text-sm">分析全流程各环节耗时，识别缩短交付周期的机会点。</p>
                            </div>

                            <div className="grid grid-cols-3 gap-6 mb-8">
                                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">平均交付周期 (Lead Time)</div>
                                    <div className="text-3xl font-bold text-slate-800">14.2 <span className="text-sm font-normal text-slate-500">Days</span></div>
                                    <div className="text-xs text-emerald-600 mt-2 flex items-center gap-1"><TrendingUp size={12} className="rotate-180"/> -1.5 Days YoY</div>
                                </div>
                                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">生产周期 (Mfg Cycle)</div>
                                    <div className="text-3xl font-bold text-slate-800">8.5 <span className="text-sm font-normal text-slate-500">Days</span></div>
                                    <div className="text-xs text-amber-600 mt-2 flex items-center gap-1"><TrendingUp size={12}/> +0.5 Days YoY</div>
                                </div>
                                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">物流周期 (Logistics)</div>
                                    <div className="text-3xl font-bold text-slate-800">4.1 <span className="text-sm font-normal text-slate-500">Days</span></div>
                                    <div className="text-xs text-slate-500 mt-2">Stable</div>
                                </div>
                            </div>

                            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-6">周期构成瀑布图 (Cycle Time Breakdown)</h3>
                                <div className="flex gap-1 h-32 items-end">
                                    <div className="w-1/6 bg-slate-200 rounded-t-md h-[10%] relative group">
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold">1.2d</div>
                                        <div className="text-[10px] text-slate-500 text-center mt-36">Order Proc.</div>
                                    </div>
                                    <div className="w-1/6 bg-blue-300 rounded-t-md h-[20%] relative mb-[10%] group">
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold">2.5d</div>
                                        <div className="text-[10px] text-slate-500 text-center mt-[120px]">Planning</div>
                                    </div>
                                    <div className="w-1/6 bg-blue-500 rounded-t-md h-[40%] relative mb-[30%] group">
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold">5.0d</div>
                                        <div className="text-[10px] text-slate-500 text-center mt-[150px]">Manufacturing</div>
                                    </div>
                                    <div className="w-1/6 bg-blue-400 rounded-t-md h-[10%] relative mb-[70%] group">
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold">1.0d</div>
                                        <div className="text-[10px] text-slate-500 text-center mt-[50px]">QA/QC</div>
                                    </div>
                                    <div className="w-1/6 bg-indigo-400 rounded-t-md h-[35%] relative mb-[80%] group">
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold">4.5d</div>
                                        <div className="text-[10px] text-slate-500 text-center mt-[130px]">Logistics</div>
                                    </div>
                                    <div className="w-1/6 bg-emerald-500 rounded-t-md h-[100%] relative ml-4 group">
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold">14.2d</div>
                                        <div className="text-[10px] text-slate-500 text-center mt-[160px]">Total</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedAnalysisId === 'fulfillment_risk' && (
                        <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
                            <div className="mb-6 flex justify-between items-center">
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900 mb-2">订单交付风险雷达 (Delivery Risk Radar)</h1>
                                    <p className="text-slate-500 text-sm">基于 AI 预测的在途订单延期风险扫描。</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1.5 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700 shadow-sm flex items-center gap-2">
                                        <ShieldAlert size={14}/> 发起风险阻断
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-slate-500 font-medium">
                                        <tr>
                                            <th className="px-6 py-3">订单号</th>
                                            <th className="px-6 py-3">客户</th>
                                            <th className="px-6 py-3">承诺交期 (ETA)</th>
                                            <th className="px-6 py-3">预测延期</th>
                                            <th className="px-6 py-3">主要风险因子</th>
                                            <th className="px-6 py-3">风险概率</th>
                                            <th className="px-6 py-3 text-right">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {[
                                            { id: 'ORD-9921', cust: 'GAC Aion', eta: '2023-11-20', delay: '+3 Days', reason: 'Material Shortage (NCM)', prob: '85%' },
                                            { id: 'ORD-8832', cust: 'Xpeng Motors', eta: '2023-11-22', delay: '+1 Day', reason: 'Logistics Congestion', prob: '60%' },
                                            { id: 'ORD-7710', cust: 'Leapmotor', eta: '2023-11-18', delay: '+5 Days', reason: 'Production Line Down', prob: '92%' },
                                            { id: 'ORD-6629', cust: 'Changan', eta: '2023-11-25', delay: '+2 Days', reason: 'Quality Hold', prob: '75%' },
                                        ].map((row, i) => (
                                            <tr key={i} className="hover:bg-slate-50 group">
                                                <td className="px-6 py-4 font-mono text-slate-600">{row.id}</td>
                                                <td className="px-6 py-4 font-bold text-slate-800">{row.cust}</td>
                                                <td className="px-6 py-4 text-slate-600">{row.eta}</td>
                                                <td className="px-6 py-4 text-red-600 font-bold">{row.delay}</td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded text-xs border border-amber-100">{row.reason}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                                            <div className="bg-red-500 h-full" style={{width: row.prob}}></div>
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-700">{row.prob}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="text-blue-600 hover:underline text-xs font-medium">干预</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {selectedAnalysisId === 'simulation_hub' && renderSimulationHub()}

                    {/* Placeholder for other menu items */}
                    {!['customer_satisfaction', 'fulfillment_perfect', 'simulation_hub', 's1_monitoring', 's2_shortage', 's3_rootcause', 's4_bottleneck', 'fulfillment_cycle', 'fulfillment_risk'].includes(selectedAnalysisId) && (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                            <BarChart size={48} className="mb-4 opacity-20"/>
                            <p className="text-lg font-medium text-slate-500">正在加载分析模块...</p>
                            <p className="text-sm">Module ID: {selectedAnalysisId}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
