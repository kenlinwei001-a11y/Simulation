
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
    Scale
} from 'lucide-react';

// ... (Keep existing interfaces: AnalysisBoard, FulfillmentMetric, RootCauseHistory, L4MetricDetail, TeamMember, CustomerHealth, SatisfactionEvent, GraphNode, GraphEdge, AbnormalityDetail, SimulationScenario, SimConfigField, SimConfigDef) ...

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

// ... (Keep getAbnormalityDetail helper) ...
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

// ... (Keep fulfillmentData, DEFAULT_TEAM, MODULE_TEAMS, CUSTOMER_LIST, CUSTOMER_EVENTS, L4_METRIC_MOCK) ...
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

// ... (Keep DEFAULT_TEAM, MODULE_TEAMS, CUSTOMER_LIST, CUSTOMER_EVENTS, L4_METRIC_MOCK) ...
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
    'C003': [
        { id: 'E4', date: '2023-11-14', category: 'QUALITY', sourceSystem: 'CRM', title: '重大客诉：模组温控异常', description: '现场反馈 3 台 Deepal SL03 BMS 报高温警报，疑似液冷管路堵塞。', sentiment: 'NEGATIVE', impactScore: -5 },
        { id: 'E5', date: '2023-11-10', category: 'DELIVERY', sourceSystem: 'ERP', title: '物料发货延期', description: '因危包证办理滞后，导致发往重庆的电芯批次延期 2 天。', sentiment: 'NEGATIVE', impactScore: -3 },
        { id: 'E6', date: '2023-11-01', category: 'MEETING', sourceSystem: 'MEETING_LOG', title: '高层沟通会', description: 'CEO 介入沟通，承诺派驻专项小组解决质量问题。', sentiment: 'POSITIVE', impactScore: 2 },
    ]
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

// --- COMPLEX SIMULATION CONFIG DEFINITIONS ---
const SIMULATION_CONFIGS: Record<string, SimConfigDef> = {
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

// ... (Keep SIMULATION_SCENARIOS, RocketIcon, AbnormalityPopover, MetricHoverWrapper, MetricCard, CollaborativeChatModal, NodeDetailPopover, getSimulationConfig, SimulationOverlay, CustomerSatisfactionDetail, MetricL4Detail, Analytics component shell) ...
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

// ... (Keep all other helper components) ...
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

const MetricCard = ({ metric, onClick }: { metric: FulfillmentMetric, onClick: () => void }) => {
    return (
        <div 
            onClick={onClick}
            className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition-all group relative overflow-hidden cursor-pointer h-full"
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
};

const CollaborativeChatModal = ({ title, members, onClose }: { title: string, members: TeamMember[], onClose: () => void }) => {
    const [messages, setMessages] = useState<{sender: string, text: string, type: 'user'|'agent'|'system', avatar?: string, isSimulation?: boolean}[]>([
        { sender: 'System', text: `已创建 "${title}" 专项沟通群。AI 助手已就位。`, type: 'system' },
        { sender: 'AI Agent', text: `大家好，我是业务助手。关于 "${title}"，我已准备好相关数据报告，请问需要重点分析哪部分？`, type: 'agent', avatar: 'AI' }
    ]);
    const [input, setInput] = useState('');
    const [isSimulating, setIsSimulating] = useState(false);

    const handleSend = () => {
        if (!input) return;
        setMessages([...messages, { sender: 'Me', text: input, type: 'user', avatar: 'Me' }]);
        setInput('');
        setTimeout(() => {
            setMessages(prev => [...prev, { 
                sender: 'AI Agent', 
                text: '收到。正在调取相关数据进行多维分析... ', 
                type: 'agent', 
                avatar: 'AI' 
            }]);
        }, 1000);
    };

    const handleSimulateInChat = () => {
        setMessages(prev => [...prev, { sender: 'Me', text: '请求进行智能推演分析', type: 'user', avatar: 'Me' }]);
        setIsSimulating(true);
        setTimeout(() => {
            setMessages(prev => [...prev, {
                sender: 'AI Agent',
                text: '推演已完成。基于当前参数（订单量+15%），预计下周产能负荷将达到 102%，缺口主要集中在 Base 1 产线。建议启动 Base 2 备用班次。',
                type: 'agent',
                avatar: 'AI',
                isSimulation: true
            }]);
            setIsSimulating(false);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-[600px] h-[550px] flex flex-col overflow-hidden border border-slate-200">
                <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                            <Users size={16} className="text-indigo-600"/>
                            团队协作: {title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex -space-x-1">
                                {members.map((m, i) => (
                                    <div key={i} className="w-5 h-5 rounded-full bg-slate-200 border border-white text-[8px] flex items-center justify-center font-bold text-slate-600" title={m.name}>
                                        {m.initials}
                                    </div>
                                ))}
                                <div className="w-5 h-5 rounded-full bg-indigo-100 border border-white text-[8px] flex items-center justify-center font-bold text-indigo-600">
                                    AI
                                </div>
                            </div>
                            <span className="text-[10px] text-slate-400">{members.length + 1} 人在线</span>
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
                                    {m.isSimulation && (
                                        <div className="mt-2 pt-2 border-t border-indigo-100">
                                            <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 mb-1">
                                                <BrainCircuit size={12}/> 推演结果摘要
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600">
                                                <div className="bg-white/50 p-1.5 rounded">产能负荷: <span className="text-red-500 font-bold">102%</span></div>
                                                <div className="bg-white/50 p-1.5 rounded">延期订单: <span className="text-amber-500 font-bold">3</span></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                    {isSimulating && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">AI</div>
                            <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl rounded-tl-none text-sm text-indigo-900 flex items-center gap-2">
                                <BrainCircuit size={14} className="animate-pulse"/> 正在进行多维推演计算...
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-3 border-t border-slate-200 bg-white flex gap-2">
                    <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg">
                        <UserPlus size={18}/>
                    </button>
                    <button 
                        onClick={handleSimulateInChat}
                        disabled={isSimulating}
                        title="执行智能推演"
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors border border-transparent hover:border-purple-100"
                    >
                        <BrainCircuit size={18}/>
                    </button>
                    <input 
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        placeholder="输入消息..."
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

const NodeDetailPopover = ({ node, onClose }: { node: GraphNode, onClose: () => void }) => {
    return (
        <div className="absolute z-50 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-4 animate-in fade-in zoom-in-95 duration-200" style={{ left: node.x + 20, top: node.y - 20 }}>
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${
                        node.status === 'CRITICAL' ? 'bg-red-500' : node.status === 'WARNING' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}></span>
                    <h4 className="font-bold text-slate-800 text-sm">{node.label}</h4>
                </div>
                <button onClick={onClose}><X size={14} className="text-slate-400 hover:text-slate-600"/></button>
            </div>
            <div className="space-y-3 text-xs">
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                    <div className="font-bold text-slate-500 mb-1 uppercase">详情 (Details)</div>
                    {Object.entries(node.details || {}).map(([k, v]: any) => (
                        <div key={k} className="flex justify-between py-0.5">
                            <span className="text-slate-500 capitalize">{k}:</span>
                            <span className="font-mono text-slate-700 font-bold">{v}</span>
                        </div>
                    ))}
                </div>
                {node.type === 'METRIC' && (
                    <div className="flex gap-2">
                        <button className="flex-1 py-1.5 bg-indigo-50 text-indigo-600 rounded font-medium hover:bg-indigo-100 border border-indigo-100">历史趋势</button>
                        <button className="flex-1 py-1.5 bg-white text-slate-600 rounded font-medium hover:bg-slate-50 border border-slate-200">联系负责人</button>
                    </div>
                )}
                {node.type === 'OBJECT' && (
                    <div className="flex items-center gap-2 text-blue-600 cursor-pointer hover:underline pt-2 border-t border-slate-100">
                        <Database size={12}/> 查看实体详情
                    </div>
                )}
                {node.type === 'TEAM' && (
                    <div className="flex items-center gap-2 text-purple-600 cursor-pointer hover:underline pt-2 border-t border-slate-100">
                        <MessageCircle size={12}/> 发起沟通
                    </div>
                )}
            </div>
        </div>
    )
}

const getSimulationConfig = (context: string) => {
    let nodes: GraphNode[] = [];
    let edges: GraphEdge[] = [];
    let initialMessage = "";

    // 1. Customer Satisfaction / Specific Customer
    if (context.includes('Satisfaction') || context.includes('Customer') || context.includes('客户')) {
        nodes = [
            { id: 'n1', label: 'NPS 净推荐值', type: 'METRIC', status: 'CRITICAL', x: 400, y: 300, details: { current: '45', target: '65' } },
            { id: 'n2', label: '工单响应时间', type: 'METRIC', status: 'WARNING', x: 200, y: 450, details: { avgTime: '48h', target: '24h' } },
            { id: 'n3', label: '产品质量', type: 'METRIC', status: 'NORMAL', x: 600, y: 450, details: { defectRate: '0.5%' } },
            { id: 'n4', label: '客户支持团队', type: 'TEAM', status: 'WARNING', x: 50, y: 450, details: { load: '120%' } },
            { id: 'n5', label: '近期重大客诉', type: 'RISK', status: 'CRITICAL', x: 400, y: 150, details: { type: 'Service', impact: 'High' } }
        ];
        edges = [
            { source: 'n2', target: 'n1', label: '驱动因素' },
            { source: 'n3', target: 'n1', label: '驱动因素' },
            { source: 'n4', target: 'n2', label: '负责人' },
            { source: 'n5', target: 'n1', label: '负面影响' }
        ];
        initialMessage = "正在分析客户满意度驱动因素。NPS 处于危急状态，主要原因是工单响应延迟和近期发生的重大客诉。";
    } 
    // 2. Inventory Turnover / Stockout Risk
    else if (context.includes('Inventory') || context.includes('Stockout') || context.includes('Shortage') || context.includes('库存') || context.includes('缺货')) {
        nodes = [
            { id: 'n1', label: '库存周转率', type: 'METRIC', status: 'WARNING', x: 400, y: 300, details: { value: '52 Days', target: '45 Days' } },
            { id: 'n2', label: '呆滞库存', type: 'RISK', status: 'CRITICAL', x: 600, y: 300, details: { amount: '¥8.5M' } },
            { id: 'n3', label: '仓库 A', type: 'OBJECT', status: 'NORMAL', x: 200, y: 450, details: { cap: '85%' } },
            { id: 'n4', label: '销售预测', type: 'METRIC', status: 'WARNING', x: 600, y: 150, details: { accuracy: '70%' } },
            { id: 'n5', label: '采购团队', type: 'TEAM', status: 'NORMAL', x: 50, y: 300, details: { active: 'True' } }
        ];
        edges = [
            { source: 'n2', target: 'n1', label: '降低' },
            { source: 'n4', target: 'n2', label: '导致' },
            { source: 'n3', target: 'n1', label: '位置' },
            { source: 'n5', target: 'n2', label: '管理' }
        ];
        initialMessage = "正在模拟库存流转。检测到仓库 A 存在呆滞库存，主要由销售预测准确率低导致。";
    }
    // 3. Fulfillment / OTIF / Delivery / Orders
    else if (context.includes('Fulfillment') || context.includes('Delivery') || context.includes('OTIF') || context.includes('Order') || context.includes('交付') || context.includes('订单')) {
        nodes = [
            { id: 'n1', label: 'OTIF 交付率', type: 'METRIC', status: 'CRITICAL', x: 400, y: 300, details: { value: '84%', target: '90%' } },
            { id: 'n2', label: '物料延误', type: 'RISK', status: 'CRITICAL', x: 200, y: 300, details: { supplier: 'Sup-A', delay: '3 days' } },
            { id: 'n3', label: '设备故障', type: 'RISK', status: 'WARNING', x: 200, y: 450, details: { line: 'L2', prob: '40%' } },
            { id: 'n4', label: '埃安订单 #991', type: 'OBJECT', status: 'CRITICAL', x: 600, y: 300, details: { customer: 'GAC Aion', due: 'Today' } },
            { id: 'n5', label: '物流团队', type: 'TEAM', status: 'NORMAL', x: 750, y: 350, details: { contact: 'David' } }
        ];
        edges = [
            { source: 'n2', target: 'n1', label: '主要原因' },
            { source: 'n3', target: 'n1', label: '次要原因' },
            { source: 'n1', target: 'n4', label: '影响' },
            { source: 'n4', target: 'n5', label: '负责人' }
        ];
        initialMessage = "已加载履行模型。OTIF 指标告急。供应商 A 的物料延误是主要根因。";
    }
    // Default Fallback
    else {
        nodes = [
            { id: 'n1', label: '目标指标', type: 'METRIC', status: 'WARNING', x: 400, y: 300, details: { value: 'Checking...' } },
            { id: 'n2', label: '关联实体', type: 'OBJECT', status: 'NORMAL', x: 200, y: 300, details: { id: 'OBJ-001' } },
            { id: 'n3', label: '责任团队', type: 'TEAM', status: 'NORMAL', x: 600, y: 300, details: { group: 'Ops' } }
        ];
        edges = [
            { source: 'n2', target: 'n1', label: '影响' },
            { source: 'n3', target: 'n1', label: '负责' }
        ];
        initialMessage = "通用模拟模型已加载，上下文: " + context;
    }

    return { nodes, edges, initialMessage };
};

// ... (Keep SimulationOverlay, CustomerSatisfactionDetail, MetricL4Detail) ...
const SimulationOverlay = ({ context, onClose }: { context: string, onClose: () => void }) => {
    const config = useMemo(() => getSimulationConfig(context), [context]);
    
    const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
    const [nodes, setNodes] = useState<GraphNode[]>(config.nodes);
    const [dragNode, setDragNode] = useState<string | null>(null);
    const [chatMessages, setChatMessages] = useState<{sender: string, text: string, type: 'user'|'ai'}[]>([
        { sender: 'AI', text: config.initialMessage, type: 'ai' }
    ]);
    const [chatInput, setChatInput] = useState('');

    useEffect(() => {
        setNodes(config.nodes);
        setChatMessages([{ sender: 'AI', text: config.initialMessage, type: 'ai' }]);
    }, [config]);

    const handleMouseDown = (id: string) => setDragNode(id);
    const handleMouseUp = () => setDragNode(null);
    const handleMouseMove = (e: React.MouseEvent) => {
        if (dragNode) {
            setNodes(prev => prev.map(n => n.id === dragNode ? { ...n, x: n.x + e.movementX, y: n.y + e.movementY } : n));
        }
    };

    const handleSend = () => {
        if (!chatInput) return;
        setChatMessages(prev => [...prev, { sender: '我', text: chatInput, type: 'user' }]);
        setChatInput('');
        setTimeout(() => {
            setChatMessages(prev => [...prev, { sender: 'AI', text: '正在重新计算概率... 基于当前参数，预计影响将增加 15%。建议立即干预。', type: 'ai' }]);
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-[80] bg-slate-100 flex flex-col animate-in fade-in duration-300">
            {/* Header */}
            <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded flex items-center justify-center">
                        <BrainCircuit size={18}/>
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-800 text-sm">智能推演与归因 (Intelligent Simulation)</h2>
                        <div className="text-xs text-slate-500">上下文: {context}</div>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Chat Panel */}
                <div className="w-96 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                        {chatMessages.map((msg, i) => (
                            <div key={i} className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${
                                    msg.type === 'ai' ? 'bg-purple-600' : 'bg-slate-400'
                                }`}>
                                    {msg.type === 'ai' ? <Bot size={14}/> : <User size={14}/>}
                                </div>
                                <div className={`max-w-[80%] p-3 rounded-xl text-sm shadow-sm ${
                                    msg.type === 'user' ? 'bg-white border border-slate-200 text-slate-800' : 'bg-purple-50 border border-purple-100 text-purple-900'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t border-slate-200 bg-white">
                        <div className="relative">
                            <input 
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-4 pr-10 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                placeholder="输入推演指令..."
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <button onClick={handleSend} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">
                                <ArrowRight size={14}/>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Graph Canvas */}
                <div 
                    className="flex-1 relative bg-slate-50 overflow-hidden cursor-grab active:cursor-grabbing"
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur p-2 rounded-lg border border-slate-200 shadow-sm text-xs text-slate-500">
                        <div className="font-bold mb-1">图谱控制</div>
                        <div>拖拽节点进行重排</div>
                        <div>点击节点查看详情</div>
                    </div>

                    <svg className="w-full h-full pointer-events-none">
                        <defs>
                            <marker id="arrow" markerWidth="10" markerHeight="10" refX="20" refY="3" orient="auto" markerUnits="strokeWidth">
                                <path d="M0,0 L0,6 L9,3 z" fill="#cbd5e1" />
                            </marker>
                        </defs>
                        {config.edges.map((edge, i) => {
                            const s = nodes.find(n => n.id === edge.source);
                            const t = nodes.find(n => n.id === edge.target);
                            if (!s || !t) return null;
                            return (
                                <g key={i}>
                                    <line x1={s.x + 60} y1={s.y + 20} x2={t.x + 60} y2={t.y + 20} stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrow)" />
                                    <text x={(s.x + t.x)/2 + 60} y={(s.y + t.y)/2 + 15} textAnchor="middle" fontSize="10" fill="#94a3b8" className="bg-slate-50">{edge.label}</text>
                                </g>
                            )
                        })}
                    </svg>

                    {nodes.map(node => (
                        <div 
                            key={node.id}
                            onMouseDown={() => handleMouseDown(node.id)}
                            onClick={(e) => { e.stopPropagation(); setSelectedNode(node); }}
                            className={`absolute w-32 h-10 bg-white rounded-full shadow-md border-2 flex items-center gap-2 px-3 cursor-pointer transition-all hover:scale-105 pointer-events-auto z-10 ${
                                node.status === 'CRITICAL' ? 'border-red-400' : 
                                node.status === 'WARNING' ? 'border-amber-400' : 'border-emerald-400'
                            }`}
                            style={{ left: node.x, top: node.y }}
                        >
                            <div className={`p-1.5 rounded-full ${
                                node.type === 'METRIC' ? 'bg-blue-100 text-blue-600' :
                                node.type === 'RISK' ? 'bg-red-100 text-red-600' :
                                node.type === 'TEAM' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-600'
                            }`}>
                                {node.type === 'METRIC' ? <Activity size={12}/> :
                                 node.type === 'RISK' ? <AlertTriangle size={12}/> :
                                 node.type === 'TEAM' ? <Users size={12}/> : <Database size={12}/>}
                            </div>
                            <span className="text-xs font-bold text-slate-700 truncate select-none">{node.label}</span>
                        </div>
                    ))}

                    {selectedNode && <NodeDetailPopover node={selectedNode} onClose={() => setSelectedNode(null)} />}
                </div>
            </div>
        </div>
    );
};

const CustomerSatisfactionDetail = ({ customer, onBack, onSimulate }: { customer: CustomerHealth, onBack: () => void, onSimulate: () => void }) => {
    const events = CUSTOMER_EVENTS[customer.id] || [];
    const [showChat, setShowChat] = useState(false);
    const [chatTarget, setChatTarget] = useState<{title: string, members: TeamMember[]} | null>(null);

    const startChat = (members: TeamMember[], specificContext?: string) => {
        setChatTarget({
            title: specificContext ? `${customer.name} - ${specificContext}` : customer.name,
            members: members
        });
        setShowChat(true);
    };

    return (
        <div className="max-w-6xl mx-auto pb-10 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
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
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={onSimulate}
                        className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-sm text-sm font-medium transition-colors"
                    >
                        <BrainCircuit size={16}/> 智能推演
                    </button>
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
                                    onClick={() => startChat([member], `Private with ${member.name}`)}
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

            {showChat && chatTarget && (
                <CollaborativeChatModal 
                    title={chatTarget.title}
                    members={chatTarget.members} 
                    onClose={() => setShowChat(false)} 
                />
            )}
        </div>
    );
};

const MetricL4Detail = ({ code, onBack, onChat, onSimulate }: { code: string, onBack: () => void, onChat: (ctx: any) => void, onSimulate: () => void }) => {
    // Uses L4_METRIC_MOCK
    const data = L4_METRIC_MOCK; // In real app, fetch based on code

    return (
        <div className="max-w-6xl mx-auto pb-10 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 shadow-sm transition-all">
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded">{code}</span>
                            <h2 className="text-2xl font-bold text-slate-900">{data.name}</h2>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">{data.description}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={onSimulate} className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-sm text-sm font-medium transition-colors">
                        <BrainCircuit size={16}/> 智能推演
                    </button>
                    <button onClick={onChat} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 shadow-sm text-sm font-medium transition-colors">
                        <MessageCircle size={16}/> 联系负责人
                    </button>
                </div>
            </div>

            {/* Content similar to design */}
            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4">趋势分析 (Trend)</h3>
                    {/* Mock Chart */}
                    <div className="h-64 flex items-end justify-between gap-4 px-4 border-b border-l border-slate-200 relative">
                         {data.trendData.map((d, i) => (
                             <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                 <div className="w-full bg-blue-100 rounded-t relative hover:bg-blue-200 transition-colors" style={{height: `${(d.value/100)*100}%`}}>
                                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                         {d.value}%
                                     </div>
                                 </div>
                                 <span className="text-xs text-slate-500">{d.date}</span>
                             </div>
                         ))}
                         {/* Target Line */}
                         <div className="absolute left-0 right-0 top-[10%] border-t-2 border-dashed border-red-300 pointer-events-none">
                             <span className="absolute right-0 -top-5 text-xs text-red-500 font-bold">Target: 90%</span>
                         </div>
                    </div>
                </div>

                <div className="col-span-1 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4">归因分析 (Root Causes)</h3>
                        <div className="space-y-4">
                            {data.rootCauses.map((rc, i) => (
                                <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex justify-between mb-1">
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${rc.impact === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{rc.impact} Impact</span>
                                        <span className="text-[10px] text-slate-400">{rc.type}</span>
                                    </div>
                                    <div className="text-sm font-medium text-slate-800 mb-1">{rc.cause}</div>
                                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-blue-500 h-full" style={{width: `${rc.probability * 100}%`}}></div>
                                    </div>
                                    <div className="text-[10px] text-slate-400 mt-1 text-right">Probability: {rc.probability * 100}%</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-6 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-bold text-slate-800">异常记录 (Failed Records)</h3>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3">客户</th>
                            <th className="px-6 py-3">日期</th>
                            <th className="px-6 py-3">原因</th>
                            <th className="px-6 py-3">影响值</th>
                            <th className="px-6 py-3">状态</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.failedRecords.map((rec, i) => (
                            <tr key={i} className="hover:bg-slate-50">
                                <td className="px-6 py-3 font-mono text-slate-600">{rec.id}</td>
                                <td className="px-6 py-3 font-bold text-slate-700">{rec.customer}</td>
                                <td className="px-6 py-3 text-slate-500">{rec.date}</td>
                                <td className="px-6 py-3 text-slate-700">{rec.reason}</td>
                                <td className="px-6 py-3 text-slate-600">{rec.value}</td>
                                <td className="px-6 py-3">
                                    <span className={`px-2 py-1 rounded text-xs font-bold border ${rec.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                                        {rec.status}
                                    </span>
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
        { id: 'fulfillment_cycle', label: '订单履行周期 (Fulfillment Cycle)', icon: Clock },
        { id: 'fulfillment_risk', label: '订单交付风险 (Delivery Risk)', icon: AlertTriangle },
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

    // 4. New: Simulation Hub View
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

                    {selectedAnalysisId === 'simulation_hub' && renderSimulationHub()}

                    {/* Placeholder for other menu items */}
                    {!['customer_satisfaction', 'fulfillment_perfect', 'simulation_hub'].includes(selectedAnalysisId) && (
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