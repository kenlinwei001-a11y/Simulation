import React, { useState } from 'react';
import { 
   Workflow, 
   Plus, 
   Folder, 
   MoreHorizontal, 
   Play, 
   Clock, 
   GitBranch, 
   Database, 
   FileCode, 
   Table, 
   ArrowRight, 
   CheckCircle2, 
   XCircle, 
   AlertTriangle, 
   Sparkles, 
   LayoutTemplate, 
   Save,
   X,
   RefreshCw,
   Terminal,
   ShieldCheck,
   Cpu,
   CalendarClock,
   Layers,
   ArrowLeft
} from 'lucide-react';

// --- Types ---
interface Pipeline {
    id: string;
    name: string;
    status: 'HEALTHY' | 'ERROR' | 'RUNNING';
    lastRun: string;
    nodes: number;
}

interface PipelineNode {
    id: string;
    type: 'SOURCE' | 'TRANSFORM' | 'SINK';
    name: string;
    status: 'SUCCESS' | 'WAITING' | 'ERROR';
    icon: any;
    x: number;
    y: number;
}

// --- L3.5: New Pipeline Wizard (Modal) ---
const NewPipelineWizard = ({ onClose, onCreate }: { onClose: () => void, onCreate: (name: string) => void }) => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('blank');

    const templates = [
        { id: 'blank', name: '空白流水线', desc: '从零开始构建数据处理逻辑', icon: LayoutTemplate },
        { id: 'batch_etl', name: '批量 ETL 同步', desc: '标准的源到目标数据清洗与转换', icon: Database },
        { id: 'stream', name: '实时流处理', desc: '基于 Kafka/Flink 的低延迟处理', icon: ZapIcon },
        { id: 'ml_ops', name: '机器学习训练', desc: '特征工程与模型训练流水线', icon: Cpu },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-[800px] h-[500px] flex overflow-hidden">
                {/* Left Sidebar Steps */}
                <div className="w-48 bg-slate-50 border-r border-slate-200 p-6 flex flex-col">
                    <h3 className="font-bold text-slate-800 mb-6">创建流水线</h3>
                    <div className="space-y-6 relative">
                        {/* Connecting Line */}
                        <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-slate-200 -z-10"></div>
                        
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center gap-3 relative">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                    step === s ? 'bg-blue-600 text-white' : 
                                    step > s ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-300 text-slate-500'
                                }`}>
                                    {step > s ? <CheckCircle2 size={14}/> : s}
                                </div>
                                <span className={`text-sm font-medium ${step === s ? 'text-blue-700' : 'text-slate-500'}`}>
                                    {s === 1 ? '基础信息' : s === 2 ? '选择模板' : '运行配置'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Content */}
                <div className="flex-1 flex flex-col">
                    <div className="flex-1 p-8 overflow-y-auto">
                        {step === 1 && (
                            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">流水线名称 <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" 
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"
                                        placeholder="例如：核心交易数据清洗_V2"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">唯一标识 (ID)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-mono">pl_</span>
                                        <input 
                                            type="text" 
                                            className="w-full border border-slate-300 rounded-lg pl-8 pr-3 py-2 text-sm font-mono focus:border-blue-500 outline-none bg-slate-50"
                                            placeholder="core_transaction_clean"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">所属文件夹</label>
                                    <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none bg-white">
                                        <option>生产环境 (Production)</option>
                                        <option>测试环境 (Staging)</option>
                                        <option>个人沙盒 (Sandbox)</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-right-4 duration-300">
                                {templates.map(t => (
                                    <div 
                                        key={t.id}
                                        onClick={() => setSelectedTemplate(t.id)}
                                        className={`p-4 border rounded-xl cursor-pointer transition-all hover:shadow-md ${
                                            selectedTemplate === t.id 
                                            ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                                            : 'border-slate-200 hover:border-blue-300 bg-white'
                                        }`}
                                    >
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                                            selectedTemplate === t.id ? 'bg-blue-200 text-blue-700' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                            <t.icon size={20}/>
                                        </div>
                                        <h4 className="font-bold text-slate-800 text-sm mb-1">{t.name}</h4>
                                        <p className="text-xs text-slate-500">{t.desc}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-3">
                                    <AlertTriangle className="text-amber-600 flex-shrink-0" size={18}/>
                                    <div className="text-xs text-amber-800">
                                        注意：生产环境的计算资源需要审批，当前将使用默认的 "Shared-Spark-Cluster" 进行初始化。
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                        <Cpu size={16}/> 计算引擎
                                    </label>
                                    <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none bg-white">
                                        <option>Spark 3.4 (Standard)</option>
                                        <option>Spark 3.5 (High Memory)</option>
                                        <option>Flink 1.17 (Streaming)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                        <CalendarClock size={16}/> 调度周期
                                    </label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 border border-slate-200 rounded px-3 py-2 text-sm cursor-pointer hover:bg-slate-50">
                                            <input type="radio" name="schedule" defaultChecked/> 手动触发
                                        </label>
                                        <label className="flex items-center gap-2 border border-slate-200 rounded px-3 py-2 text-sm cursor-pointer hover:bg-slate-50">
                                            <input type="radio" name="schedule"/> 每日 (T+1)
                                        </label>
                                        <label className="flex items-center gap-2 border border-slate-200 rounded px-3 py-2 text-sm cursor-pointer hover:bg-slate-50">
                                            <input type="radio" name="schedule"/> 实时
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
                        {step > 1 ? (
                            <button onClick={() => setStep(step - 1)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg">
                                上一步
                            </button>
                        ) : <div></div>}
                        
                        <div className="flex gap-2">
                            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg">
                                取消
                            </button>
                            {step < 3 ? (
                                <button 
                                    onClick={() => setStep(step + 1)} 
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                                    disabled={step === 1 && !name}
                                >
                                    下一步
                                </button>
                            ) : (
                                <button 
                                    onClick={() => onCreate(name)} 
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-2"
                                >
                                    <CheckCircle2 size={16}/> 完成创建
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- L6: Quality Check Configuration (Modal) ---
const QualityCheckModal = ({ onClose }: { onClose: () => void }) => {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
            <div className="bg-white rounded-xl shadow-2xl w-[500px] border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                        <ShieldCheck size={16} className="text-emerald-600"/>
                        添加数据质量检测
                    </h3>
                    <button onClick={onClose}><X size={16} className="text-slate-400 hover:text-slate-600"/></button>
                </div>
                <div className="p-5 space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">检测字段</label>
                        <select className="w-full text-sm border border-slate-200 rounded px-2 py-2 outline-none focus:border-blue-500 bg-white">
                            <option>订单ID (order_id)</option>
                            <option>金额 (amount)</option>
                            <option>客户邮箱 (customer_email)</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">规则类型</label>
                         <div className="grid grid-cols-2 gap-2">
                            <div className="border border-blue-500 bg-blue-50 text-blue-700 px-3 py-2 rounded text-sm font-medium text-center cursor-pointer">非空校验</div>
                            <div className="border border-slate-200 hover:border-blue-300 text-slate-600 px-3 py-2 rounded text-sm font-medium text-center cursor-pointer">唯一性校验</div>
                            <div className="border border-slate-200 hover:border-blue-300 text-slate-600 px-3 py-2 rounded text-sm font-medium text-center cursor-pointer">数值范围</div>
                            <div className="border border-slate-200 hover:border-blue-300 text-slate-600 px-3 py-2 rounded text-sm font-medium text-center cursor-pointer">正则匹配</div>
                         </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">失败策略</label>
                        <div className="flex items-center gap-2">
                             <input type="radio" name="policy" id="p1" defaultChecked />
                             <label htmlFor="p1" className="text-sm text-slate-700">阻断流水线 (Fail Pipeline)</label>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                             <input type="radio" name="policy" id="p2" />
                             <label htmlFor="p2" className="text-sm text-slate-700">仅发送告警 (Warn Only)</label>
                        </div>
                    </div>
                </div>
                <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
                    <button onClick={onClose} className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-white rounded border border-transparent">取消</button>
                    <button onClick={onClose} className="px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded shadow-sm">添加规则</button>
                </div>
            </div>
        </div>
    )
}

// --- L5: Node Configuration Drawer ---
const NodeConfigPanel = ({ node, onClose }: { node: PipelineNode, onClose: () => void }) => {
    const [showQualityModal, setShowQualityModal] = useState(false);

    return (
        <div className="absolute top-0 right-0 h-full w-[600px] bg-white border-l border-slate-200 shadow-xl flex flex-col z-40 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="h-12 border-b border-slate-200 flex items-center justify-between px-4 bg-slate-50">
                <div className="flex items-center gap-2">
                    <node.icon size={16} className="text-blue-600"/>
                    <span className="font-bold text-slate-800 text-sm">{node.name}</span>
                    <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono">ID: {node.id}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-slate-200 rounded text-slate-500"><Play size={14}/></button>
                    <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded text-slate-500"><X size={14}/></button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto flex flex-col">
                {/* 1. Logic / Code Editor */}
                <div className="flex-1 flex flex-col min-h-[300px] border-b border-slate-200">
                    <div className="bg-slate-100 px-4 py-2 flex items-center justify-between">
                         <span className="text-xs font-bold text-slate-500">转换逻辑 (PYTHON)</span>
                         <span className="text-[10px] text-slate-400">自动保存中...</span>
                    </div>
                    <div className="flex-1 bg-[#1e1e1e] p-4 font-mono text-sm text-slate-300 relative overflow-auto">
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-[#1e1e1e] border-r border-[#333] flex flex-col items-end pr-2 pt-4 text-slate-600 select-none">
                            <div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div>
                        </div>
                        <div className="pl-6">
                            <span className="text-purple-400">def</span> <span className="text-yellow-200">compute</span>(df):{'\n'}
                            {'  '}df = df.filter(col(<span className="text-green-300">"amount"</span>) > <span className="text-orange-300">0</span>){'\n'}
                            {'  '}df = df.withColumn(<span className="text-green-300">"tax"</span>, col(<span className="text-green-300">"amount"</span>) * <span className="text-orange-300">0.15</span>){'\n'}
                            {'  '}df = df.dropDuplicates([<span className="text-green-300">"id"</span>]){'\n'}
                            {'  '}<span className="text-purple-400">return</span> df
                        </div>
                    </div>
                </div>

                {/* 2. Schema & Quality */}
                <div className="h-1/2 bg-slate-50 p-6 space-y-6 overflow-y-auto">
                    {/* Input/Output Schema */}
                    <div>
                         <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-2">
                            <Table size={14}/> 结构定义 (Schema)
                         </h4>
                         <div className="bg-white border border-slate-200 rounded-lg overflow-hidden text-xs">
                             <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200 py-2 px-3 font-medium text-slate-500">
                                 <div>字段名</div>
                                 <div>类型</div>
                                 <div>描述</div>
                             </div>
                             <div className="grid grid-cols-3 border-b border-slate-100 py-2 px-3 text-slate-700">
                                 <div className="font-mono">order_id</div>
                                 <div className="text-blue-600">String</div>
                                 <div className="text-slate-400">主键</div>
                             </div>
                             <div className="grid grid-cols-3 border-b border-slate-100 py-2 px-3 text-slate-700">
                                 <div className="font-mono">amount</div>
                                 <div className="text-blue-600">Double</div>
                                 <div className="text-slate-400">总金额</div>
                             </div>
                             <div className="grid grid-cols-3 py-2 px-3 text-slate-700">
                                 <div className="font-mono">tax</div>
                                 <div className="text-blue-600">Double</div>
                                 <div className="text-slate-400">计算税费</div>
                             </div>
                         </div>
                    </div>

                    {/* Health Checks */}
                    <div>
                         <div className="flex items-center justify-between mb-3">
                             <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2">
                                <ShieldCheck size={14}/> 质量检测
                             </h4>
                             <button onClick={() => setShowQualityModal(true)} className="text-[10px] bg-white border border-slate-200 hover:border-blue-400 text-blue-600 px-2 py-1 rounded shadow-sm transition-colors">
                                + 添加规则
                             </button>
                         </div>
                         <div className="space-y-2">
                             <div className="flex items-center justify-between p-3 bg-white border border-emerald-200 rounded-lg shadow-sm">
                                 <div className="flex items-center gap-2">
                                     <CheckCircle2 size={14} className="text-emerald-500"/>
                                     <span className="text-xs font-medium text-slate-700">校验 (amount) &gt; 0</span>
                                 </div>
                                 <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">通过</span>
                             </div>
                             <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg shadow-sm opacity-60">
                                 <div className="flex items-center gap-2">
                                     <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300"></div>
                                     <span className="text-xs font-medium text-slate-700">校验 (order_id) 唯一性</span>
                                 </div>
                                 <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">等待中</span>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
            
            {showQualityModal && <QualityCheckModal onClose={() => setShowQualityModal(false)} />}
        </div>
    );
};

// --- L4: Pipeline Canvas (Workbench) ---
const PipelineCanvas = ({ pipeline, onBack }: { pipeline: Pipeline, onBack: () => void }) => {
    const [selectedNode, setSelectedNode] = useState<PipelineNode | null>(null);

    // Mock DAG Nodes
    const nodes: PipelineNode[] = [
        { id: 'n1', type: 'SOURCE', name: '原始订单表_PG', status: 'SUCCESS', icon: Database, x: 50, y: 150 },
        { id: 'n2', type: 'TRANSFORM', name: '数据清洗_Python', status: 'SUCCESS', icon: FileCode, x: 300, y: 150 },
        { id: 'n3', type: 'TRANSFORM', name: '关联客户信息', status: 'WAITING', icon: GitBranch, x: 550, y: 150 },
        { id: 'n4', type: 'SINK', name: '标准销售宽表', status: 'WAITING', icon: Table, x: 800, y: 150 },
    ];

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
            {/* Toolbar */}
            <div className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-20 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="text-slate-400 hover:text-slate-600">
                        <ArrowLeft size={16}/>
                    </button>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">流水线</span>
                    <h2 className="font-bold text-slate-800">{pipeline.name}</h2>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        pipeline.status === 'HEALTHY' ? 'bg-emerald-100 text-emerald-700' : 
                        pipeline.status === 'RUNNING' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                    }`}>{pipeline.status}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 mr-2">最后构建: {pipeline.lastRun}</span>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors">
                        <Play size={14}/> 立即运行
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded text-sm font-medium hover:bg-slate-50 transition-colors">
                        <Save size={14}/> 发布
                    </button>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 relative overflow-hidden">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                    style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                </div>

                {/* Nodes & Edges (Simulated Graph) */}
                <div className="absolute inset-0 top-10 left-10">
                    {/* SVG Connections */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                        <path d="M 250 190 L 300 190" stroke="#cbd5e1" strokeWidth="2" fill="none" />
                        <path d="M 500 190 L 550 190" stroke="#cbd5e1" strokeWidth="2" fill="none" />
                        <path d="M 750 190 L 800 190" stroke="#cbd5e1" strokeWidth="2" fill="none" />
                    </svg>

                    {nodes.map(node => (
                        <div 
                            key={node.id}
                            onClick={() => setSelectedNode(node)}
                            className={`absolute w-48 bg-white rounded-lg shadow-sm border-2 transition-all cursor-pointer group z-10
                                ${selectedNode?.id === node.id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200 hover:border-blue-300'}
                            `}
                            style={{ left: node.x, top: node.y }}
                        >
                            {/* Node Header */}
                            <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-md">
                                <div className="flex items-center gap-2">
                                    <node.icon size={14} className="text-slate-500"/>
                                    <span className="text-xs font-bold text-slate-600">
                                        {node.type === 'SOURCE' ? '数据源' : node.type === 'TRANSFORM' ? '转换' : '输出'}
                                    </span>
                                </div>
                                {node.status === 'SUCCESS' && <CheckCircle2 size={14} className="text-emerald-500"/>}
                                {node.status === 'WAITING' && <div className="w-3 h-3 rounded-full border-2 border-slate-300 border-t-blue-500 animate-spin"></div>}
                            </div>
                            {/* Node Body */}
                            <div className="p-3">
                                <div className="font-medium text-sm text-slate-800 mb-1 truncate">{node.name}</div>
                                <div className="flex items-center justify-between text-[10px] text-slate-400">
                                    <span>SQL / Python</span>
                                    <span>240 行</span>
                                </div>
                            </div>
                            {/* Ports */}
                            <div className="absolute top-1/2 -left-1.5 w-3 h-3 bg-slate-300 rounded-full border-2 border-white"></div>
                            <div className="absolute top-1/2 -right-1.5 w-3 h-3 bg-slate-300 rounded-full border-2 border-white"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* L5 Config Drawer */}
            {selectedNode && <NodeConfigPanel node={selectedNode} onClose={() => setSelectedNode(null)} />}
        </div>
    )
}

// Helper icon
const ZapIcon = ({size}: {size:number}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
)

// --- L3: Pipeline Explorer (List) ---
export const DataPipeline = () => {
   const [selectedPipeline, setSelectedPipeline] = useState<Pipeline | null>(null);
   const [isCreating, setCreating] = useState(false);

   const pipelines: Pipeline[] = [
       { id: 'p1', name: '核心销售数据清洗', status: 'HEALTHY', lastRun: '2 分钟前', nodes: 12 },
       { id: 'p2', name: '日志实时同步流', status: 'RUNNING', lastRun: '运行中...', nodes: 8 },
       { id: 'p3', name: '营销归因分析_V2', status: 'ERROR', lastRun: '5 小时前', nodes: 24 },
   ];

   if (selectedPipeline) {
       return (
           <div className="h-full flex flex-col">
               <PipelineCanvas pipeline={selectedPipeline} onBack={() => setSelectedPipeline(null)} />
           </div>
       );
   }

   return (
       <div className="flex h-full">
           {/* Sidebar L3 */}
           <div className="w-64 border-r border-slate-200 bg-slate-50 p-4 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">资源导航</span>
                    <button onClick={() => setCreating(true)} className="text-slate-400 hover:text-blue-600"><Plus size={16}/></button>
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-slate-700 font-medium py-1.5 px-2 rounded bg-white border border-slate-200 shadow-sm cursor-pointer">
                         <Folder size={14} className="text-blue-500 fill-blue-100" /> 全部流水线
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 py-1.5 px-2 hover:bg-slate-100 rounded cursor-pointer pl-6">
                         <Folder size={14} className="text-slate-400" /> 生产环境
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 py-1.5 px-2 hover:bg-slate-100 rounded cursor-pointer pl-6">
                         <Folder size={14} className="text-slate-400" /> 测试环境
                    </div>
                </div>
           </div>

           {/* Main List L3 */}
           <div className="flex-1 bg-white p-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">数据流水线</h1>
                        <p className="text-slate-500 text-sm mt-1">管理和监控数据转换与集成任务。</p>
                    </div>
                    <button 
                        onClick={() => setCreating(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm flex items-center gap-2"
                    >
                        <Plus size={16}/> 新建流水线
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pipelines.map(p => (
                        <div 
                            key={p.id} 
                            onClick={() => setSelectedPipeline(p)}
                            className="group border border-slate-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer bg-white relative overflow-hidden"
                        >
                            <div className={`absolute top-0 left-0 w-1 h-full ${
                                p.status === 'HEALTHY' ? 'bg-emerald-500' : p.status === 'RUNNING' ? 'bg-blue-500' : 'bg-red-500'
                            }`}></div>
                            
                            <div className="flex justify-between items-start mb-4 pl-2">
                                <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                    <Workflow size={24} className="text-slate-400 group-hover:text-blue-600"/>
                                </div>
                                <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={18}/></button>
                            </div>
                            
                            <div className="pl-2">
                                <h3 className="font-bold text-slate-800 mb-1">{p.name}</h3>
                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                    <span className="flex items-center gap-1"><Clock size={12}/> {p.lastRun}</span>
                                    <span className="flex items-center gap-1"><LayoutTemplate size={12}/> {p.nodes} 节点</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-100 pl-2 flex items-center justify-between">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    p.status === 'HEALTHY' ? 'bg-emerald-50 text-emerald-600' : 
                                    p.status === 'RUNNING' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
                                }`}>
                                    {p.status}
                                </span>
                                <span className="text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                    打开 <ArrowRight size={12}/>
                                </span>
                            </div>
                        </div>
                    ))}
                    
                    {/* New Item Placeholder */}
                    <div 
                        onClick={() => setCreating(true)}
                        className="border-2 border-dashed border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center text-slate-400 hover:border-slate-300 hover:bg-slate-50 cursor-pointer transition-colors min-h-[180px]"
                    >
                        <Plus size={32} className="mb-2 opacity-50"/>
                        <span className="text-sm font-medium">创建新项目</span>
                    </div>
                </div>
           </div>

           {/* L3.5 Wizard Modal */}
           {isCreating && (
               <NewPipelineWizard 
                   onClose={() => setCreating(false)} 
                   onCreate={(name) => {
                       console.log("Created", name);
                       setCreating(false);
                       // In a real app, you would add to the list and navigate
                   }} 
               />
           )}
       </div>
   );
}
