import React, { useState } from 'react';
import { 
    Search, 
    Database, 
    FileText, 
    ArrowRight, 
    GitBranch,
    Box,
    Layers,
    Filter,
    MoreHorizontal,
    ZoomIn,
    ZoomOut,
    Maximize,
    Settings,
    Clock,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';

// Mock Node Data
interface LineageNode {
    id: string;
    type: 'DATASET' | 'TRANSFORM' | 'OBJECT' | 'REPORT';
    name: string;
    path: string;
    status: 'HEALTHY' | 'STALE' | 'BUILDING' | 'ERROR';
    lastUpdate: string;
    x: number;
    y: number;
    parents: string[];
}

export const Lineage = () => {
    const [selectedNode, setSelectedNode] = useState<LineageNode | null>(null);
    const [zoom, setZoom] = useState(1);

    const nodes: LineageNode[] = [
        { id: '1', type: 'DATASET', name: 'raw_orders_pg', path: '/Raw/Postgres/Orders', status: 'HEALTHY', lastUpdate: '10m ago', x: 100, y: 300, parents: [] },
        { id: '2', type: 'DATASET', name: 'raw_customers_csv', path: '/Raw/Files/Customers', status: 'HEALTHY', lastUpdate: '1h ago', x: 100, y: 500, parents: [] },
        { id: '3', type: 'TRANSFORM', name: 'clean_orders', path: '/Clean/Orders', status: 'HEALTHY', lastUpdate: '5m ago', x: 400, y: 300, parents: ['1'] },
        { id: '4', type: 'TRANSFORM', name: 'clean_customers', path: '/Clean/Customers', status: 'HEALTHY', lastUpdate: '55m ago', x: 400, y: 500, parents: ['2'] },
        { id: '5', type: 'DATASET', name: 'joined_sales_data', path: '/Derived/Sales/MasterTable', status: 'BUILDING', lastUpdate: 'Running...', x: 700, y: 400, parents: ['3', '4'] },
        { id: '6', type: 'OBJECT', name: 'Customer Object', path: 'Ontology/Customer', status: 'HEALTHY', lastUpdate: 'Live', x: 1000, y: 300, parents: ['4'] },
        { id: '7', type: 'OBJECT', name: 'Order Object', path: 'Ontology/Order', status: 'STALE', lastUpdate: '2h ago', x: 1000, y: 500, parents: ['3'] },
        { id: '8', type: 'REPORT', name: 'Q3 Sales Dashboard', path: '/Reports/Q3_Sales', status: 'HEALTHY', lastUpdate: '1d ago', x: 1300, y: 400, parents: ['5', '6', '7'] },
    ];

    return (
        <div className="flex h-full bg-slate-50 relative overflow-hidden">
            {/* Toolbar */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                 <div className="bg-white p-1.5 rounded-lg shadow-md border border-slate-200 flex flex-col gap-1">
                     <button className="p-2 hover:bg-slate-100 rounded text-slate-600" title="Zoom In" onClick={() => setZoom(z => Math.min(z + 0.1, 2))}><ZoomIn size={18}/></button>
                     <button className="p-2 hover:bg-slate-100 rounded text-slate-600" title="Zoom Out" onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))}><ZoomOut size={18}/></button>
                     <button className="p-2 hover:bg-slate-100 rounded text-slate-600" title="Fit to Screen"><Maximize size={18}/></button>
                 </div>
                 <div className="bg-white p-3 rounded-lg shadow-md border border-slate-200 w-64">
                     <div className="text-xs font-bold text-slate-500 uppercase mb-2">显示层级</div>
                     <div className="space-y-2">
                         <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                             <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500"/> 数据集 (Datasets)
                         </label>
                         <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                             <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500"/> 对象 (Objects)
                         </label>
                         <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                             <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500"/> 检查 (Checks)
                         </label>
                     </div>
                 </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 relative cursor-grab active:cursor-grabbing bg-slate-50">
                 <div 
                    className="absolute inset-0 transition-transform duration-200 origin-top-left"
                    style={{ transform: `scale(${zoom})` }}
                 >
                     {/* SVG Edges */}
                     <svg className="absolute inset-0 w-[2000px] h-[1000px] pointer-events-none z-0">
                         {nodes.map(node => node.parents.map(parentId => {
                             const parent = nodes.find(n => n.id === parentId);
                             if (!parent) return null;
                             return (
                                 <path 
                                    key={`${parent.id}-${node.id}`}
                                    d={`M ${parent.x + 220} ${parent.y + 40} C ${parent.x + 280} ${parent.y + 40}, ${node.x - 60} ${node.y + 40}, ${node.x} ${node.y + 40}`}
                                    stroke="#cbd5e1" 
                                    strokeWidth="2" 
                                    fill="none" 
                                 />
                             );
                         }))}
                     </svg>

                     {/* Nodes */}
                     {nodes.map(node => (
                         <div 
                            key={node.id}
                            onClick={() => setSelectedNode(node)}
                            className={`absolute w-56 bg-white rounded-lg shadow-sm border-2 transition-all cursor-pointer group hover:shadow-md z-10 ${
                                selectedNode?.id === node.id ? 'border-blue-500 ring-4 ring-blue-50' : 'border-slate-200 hover:border-blue-300'
                            }`}
                            style={{ left: node.x, top: node.y }}
                         >
                            <div className={`h-1.5 w-full rounded-t ${
                                node.status === 'HEALTHY' ? 'bg-emerald-500' :
                                node.status === 'BUILDING' ? 'bg-blue-500 animate-pulse' :
                                node.status === 'STALE' ? 'bg-amber-500' : 'bg-red-500'
                            }`}></div>
                            <div className="p-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`p-1.5 rounded ${
                                        node.type === 'DATASET' ? 'bg-indigo-50 text-indigo-600' :
                                        node.type === 'OBJECT' ? 'bg-purple-50 text-purple-600' :
                                        node.type === 'REPORT' ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                        {node.type === 'DATASET' ? <Database size={14}/> :
                                         node.type === 'OBJECT' ? <Box size={14}/> :
                                         node.type === 'REPORT' ? <FileText size={14}/> : <GitBranch size={14}/>}
                                    </div>
                                    <div className="font-bold text-sm text-slate-800 truncate flex-1">{node.name}</div>
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono truncate mb-2">{node.path}</div>
                                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                                    <div className="flex items-center gap-1.5">
                                        {node.status === 'HEALTHY' && <CheckCircle2 size={12} className="text-emerald-500"/>}
                                        {node.status === 'BUILDING' && <Clock size={12} className="text-blue-500 animate-spin"/>}
                                        {node.status === 'STALE' && <Clock size={12} className="text-amber-500"/>}
                                        <span className="text-[10px] text-slate-500 font-medium">{node.lastUpdate}</span>
                                    </div>
                                    {node.type === 'DATASET' && <span className="text-[10px] text-slate-400">12.5MB</span>}
                                </div>
                            </div>
                            {/* Connectors */}
                            <div className="absolute top-[40px] -left-1.5 w-3 h-3 bg-slate-300 rounded-full border-2 border-white group-hover:bg-blue-400 transition-colors"></div>
                            <div className="absolute top-[40px] -right-1.5 w-3 h-3 bg-slate-300 rounded-full border-2 border-white group-hover:bg-blue-400 transition-colors"></div>
                         </div>
                     ))}
                 </div>
            </div>

            {/* Right Sidebar: Node Details */}
            {selectedNode && (
                <div className="w-80 bg-white border-l border-slate-200 flex flex-col shadow-xl z-30 animate-in slide-in-from-right duration-300">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-start bg-slate-50">
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{selectedNode.type}</div>
                            <h2 className="font-bold text-slate-800">{selectedNode.name}</h2>
                        </div>
                        <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={20}/></button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {/* Status Card */}
                        <div className={`p-4 rounded-lg border ${
                             selectedNode.status === 'HEALTHY' ? 'bg-emerald-50 border-emerald-100' : 
                             selectedNode.status === 'BUILDING' ? 'bg-blue-50 border-blue-100' : 'bg-amber-50 border-amber-100'
                        }`}>
                            <div className="flex items-center gap-2 mb-2">
                                {selectedNode.status === 'HEALTHY' ? <CheckCircle2 size={18} className="text-emerald-600"/> : <AlertCircle size={18} className="text-amber-600"/>}
                                <span className={`font-bold text-sm ${
                                    selectedNode.status === 'HEALTHY' ? 'text-emerald-800' : 'text-amber-800'
                                }`}>
                                    {selectedNode.status === 'HEALTHY' ? '构建成功' : selectedNode.status}
                                </span>
                            </div>
                            <div className="text-xs text-slate-600">
                                上次更新于 {selectedNode.lastUpdate}。<br/>由 pipeline_daily_job 触发。
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-3">
                            <button className="flex items-center justify-center gap-2 p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-sm text-slate-700 transition-colors">
                                <Database size={14}/> 预览数据
                            </button>
                             <button className="flex items-center justify-center gap-2 p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-sm text-slate-700 transition-colors">
                                <GitBranch size={14}/> 查看逻辑
                            </button>
                        </div>

                        {/* Schema / Details */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-900 uppercase mb-3 border-b border-slate-100 pb-2">Schema 结构</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs py-1 border-b border-slate-50">
                                    <span className="font-mono text-slate-600">id</span>
                                    <span className="text-blue-600 bg-blue-50 px-1.5 rounded">String</span>
                                </div>
                                <div className="flex justify-between text-xs py-1 border-b border-slate-50">
                                    <span className="font-mono text-slate-600">created_at</span>
                                    <span className="text-orange-600 bg-orange-50 px-1.5 rounded">Timestamp</span>
                                </div>
                                <div className="flex justify-between text-xs py-1 border-b border-slate-50">
                                    <span className="font-mono text-slate-600">total_amount</span>
                                    <span className="text-green-600 bg-green-50 px-1.5 rounded">Double</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};