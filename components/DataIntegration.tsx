import React, { useState } from 'react';
import { 
    Database, 
    Search, 
    Plus, 
    MoreVertical, 
    ArrowLeft, 
    Save, 
    Play, 
    History, 
    CheckCircle2, 
    AlertCircle, 
    RefreshCw,
    Table,
    Settings,
    FileText,
    Server,
    Globe,
    Lock
} from 'lucide-react';

// --- Types ---
interface DataSource {
    id: string;
    name: string;
    type: 'POSTGRES' | 'MYSQL' | 'ORACLE' | 'REST_API' | 'S3';
    host: string;
    status: 'ONLINE' | 'OFFLINE' | 'SYNCING';
    lastSync: string;
    recordCount: string;
}

// --- Mock Data ---
const sources: DataSource[] = [
    { id: 'ds_001', name: 'CRM_Production_DB', type: 'POSTGRES', host: '10.0.4.23:5432', status: 'ONLINE', lastSync: '10 分钟前', recordCount: '12.4M' },
    { id: 'ds_002', name: 'Legacy_Billing_System', type: 'ORACLE', host: '192.168.1.100:1521', status: 'ONLINE', lastSync: '1 小时前', recordCount: '450K' },
    { id: 'ds_003', name: 'Marketing_Events_Log', type: 'S3', host: 's3://corp-data-lake', status: 'SYNCING', lastSync: '同步中...', recordCount: '89.2M' },
    { id: 'ds_004', name: 'Shopify_API_Connector', type: 'REST_API', host: 'api.shopify.com', status: 'OFFLINE', lastSync: '2 天前', recordCount: '-' },
];

// --- L4: Integration Workbench ---
const IntegrationWorkbench = ({ source, onBack }: { source: DataSource, onBack: () => void }) => {
    const [activeTab, setActiveTab] = useState<'QUERY' | 'SCHEMA' | 'SETTINGS'>('QUERY');

    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Workbench Header */}
            <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-1.5 hover:bg-slate-100 rounded text-slate-500">
                        <ArrowLeft size={18} />
                    </button>
                    <div className="w-px h-6 bg-slate-300 mx-1"></div>
                    <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-600">
                             <Database size={18} />
                         </div>
                         <div>
                             <h1 className="font-bold text-slate-800 text-sm">{source.name}</h1>
                             <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                                 <span>{source.type}</span>
                                 <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                 <span>{source.host}</span>
                             </div>
                         </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                     <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${
                         source.status === 'ONLINE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                     }`}>
                         <div className={`w-1.5 h-1.5 rounded-full ${source.status === 'ONLINE' ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                         {source.status}
                     </div>
                     <button className="bg-slate-900 text-white px-3 py-1.5 rounded text-sm font-medium flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-sm">
                         <RefreshCw size={14} /> 同步数据
                     </button>
                </div>
            </div>

            {/* Main Workspace */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar: Schema Browser */}
                <div className="w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
                    <div className="p-3 border-b border-slate-100">
                         <div className="relative">
                             <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"/>
                             <input type="text" placeholder="搜索表或视图..." className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded outline-none focus:border-blue-500"/>
                         </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
                        <div className="px-2 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Public Schema</div>
                        {['users', 'orders', 'products', 'inventory_logs', 'shipping_addresses'].map(table => (
                            <div key={table} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-blue-50 cursor-pointer text-slate-700 hover:text-blue-700 group transition-colors">
                                <Table size={14} className="text-slate-400 group-hover:text-blue-500"/>
                                <span className="text-sm font-mono">{table}</span>
                            </div>
                        ))}
                         <div className="px-2 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-2">Views</div>
                        {['v_daily_sales', 'v_active_users'].map(view => (
                            <div key={view} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-purple-50 cursor-pointer text-slate-700 hover:text-purple-700 group transition-colors">
                                <FileText size={14} className="text-slate-400 group-hover:text-purple-500"/>
                                <span className="text-sm font-mono">{view}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Center: Query/Config Area */}
                <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
                    {/* Tab Navigation */}
                    <div className="h-10 bg-white border-b border-slate-200 flex items-center px-4 space-x-6 flex-shrink-0">
                         <button 
                            onClick={() => setActiveTab('QUERY')}
                            className={`h-full text-xs font-medium border-b-2 transition-colors ${activeTab === 'QUERY' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                         >
                             SQL 查询编辑器
                         </button>
                         <button 
                            onClick={() => setActiveTab('SCHEMA')}
                            className={`h-full text-xs font-medium border-b-2 transition-colors ${activeTab === 'SCHEMA' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                         >
                             Schema 映射
                         </button>
                         <button 
                            onClick={() => setActiveTab('SETTINGS')}
                            className={`h-full text-xs font-medium border-b-2 transition-colors ${activeTab === 'SETTINGS' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                         >
                             连接配置
                         </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {activeTab === 'QUERY' && (
                            <div className="flex-1 flex flex-col">
                                {/* SQL Editor Area */}
                                <div className="h-1/2 flex flex-col border-b border-slate-200">
                                    <div className="bg-slate-100 px-4 py-2 flex justify-between items-center border-b border-slate-200">
                                        <span className="text-xs font-mono text-slate-500">Query 1.sql</span>
                                        <div className="flex gap-2">
                                            <button className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50">
                                                <Save size={12}/> 保存
                                            </button>
                                            <button className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700">
                                                <Play size={12}/> 运行 (Cmd+Enter)
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-white font-mono text-sm p-4 text-slate-800 overflow-auto resize-none outline-none">
                                        <span className="text-purple-600 font-bold">SELECT</span> * <span className="text-purple-600 font-bold">FROM</span> public.orders <br/>
                                        <span className="text-purple-600 font-bold">WHERE</span> created_at {'>'} <span className="text-green-600">'2023-01-01'</span> <br/>
                                        <span className="text-purple-600 font-bold">LIMIT</span> 100;
                                    </div>
                                </div>
                                {/* Results Area */}
                                <div className="flex-1 bg-white flex flex-col">
                                    <div className="px-4 py-2 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-500 uppercase">查询结果 (Results)</span>
                                        <span className="text-xs text-slate-400">100 rows in 45ms</span>
                                    </div>
                                    <div className="flex-1 overflow-auto">
                                        <table className="w-full text-left text-xs border-collapse">
                                            <thead className="bg-slate-50 sticky top-0">
                                                <tr>
                                                    {['id', 'user_id', 'amount', 'status', 'created_at'].map(h => (
                                                        <th key={h} className="px-4 py-2 border-b border-slate-200 font-mono text-slate-500 font-medium">{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {[1,2,3,4,5].map(i => (
                                                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                                                        <td className="px-4 py-2 font-mono text-slate-700">ord_{1000+i}</td>
                                                        <td className="px-4 py-2 font-mono text-slate-700">u_{50+i}</td>
                                                        <td className="px-4 py-2 font-mono text-slate-700">${(Math.random()*1000).toFixed(2)}</td>
                                                        <td className="px-4 py-2">
                                                            <span className="bg-green-50 text-green-700 px-1.5 py-0.5 rounded border border-green-100">PAID</span>
                                                        </td>
                                                        <td className="px-4 py-2 text-slate-500">2023-10-2{i} 14:30:00</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {activeTab === 'SETTINGS' && (
                            <div className="p-8 max-w-3xl">
                                <h3 className="text-lg font-medium text-slate-900 mb-6">连接设置 (Connection Settings)</h3>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">主机地址 (Host)</label>
                                            <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2 bg-white">
                                                <Server size={16} className="text-slate-400"/>
                                                <input type="text" defaultValue={source.host} className="flex-1 outline-none text-sm font-mono text-slate-700"/>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">端口 (Port)</label>
                                            <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2 bg-white">
                                                <Globe size={16} className="text-slate-400"/>
                                                <input type="text" defaultValue="5432" className="flex-1 outline-none text-sm font-mono text-slate-700"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">数据库名称 (Database Name)</label>
                                        <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2 bg-white">
                                            <Database size={16} className="text-slate-400"/>
                                            <input type="text" defaultValue="production_db" className="flex-1 outline-none text-sm font-mono text-slate-700"/>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">用户名 (Username)</label>
                                            <input type="text" defaultValue="admin_read_only" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none"/>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">密码 (Password)</label>
                                            <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2 bg-white">
                                                <Lock size={16} className="text-slate-400"/>
                                                <input type="password" defaultValue="********" className="flex-1 outline-none text-sm font-mono text-slate-700"/>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-6 border-t border-slate-200 flex justify-end gap-3">
                                        <button className="px-4 py-2 text-slate-600 font-medium text-sm hover:bg-slate-100 rounded-lg transition-colors">测试连接</button>
                                        <button className="px-4 py-2 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm">保存更改</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'SCHEMA' && (
                            <div className="flex items-center justify-center h-full text-slate-400 flex-col gap-2">
                                <Table size={32} className="opacity-50"/>
                                <span className="text-sm">Schema 映射配置 (开发中)</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar: Sync Config */}
                <div className="w-72 bg-white border-l border-slate-200 flex flex-col flex-shrink-0">
                    <div className="p-4 border-b border-slate-100">
                        <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">同步策略 (Sync Strategy)</h3>
                    </div>
                    <div className="p-4 space-y-6 flex-1 overflow-y-auto">
                        <div>
                             <label className="text-xs font-medium text-slate-500 mb-2 block">同步模式</label>
                             <div className="space-y-2">
                                 <div className="flex items-start gap-2 p-3 border border-blue-500 bg-blue-50 rounded cursor-pointer">
                                     <div className="mt-0.5 w-3 h-3 rounded-full border-4 border-blue-600"></div>
                                     <div>
                                         <div className="text-sm font-bold text-slate-800">增量同步 (Incremental)</div>
                                         <div className="text-xs text-slate-500 leading-tight mt-1">仅同步上次运行后变更的数据 (基于 cursor)。</div>
                                     </div>
                                 </div>
                                 <div className="flex items-start gap-2 p-3 border border-slate-200 rounded cursor-pointer hover:border-slate-300">
                                     <div className="mt-0.5 w-3 h-3 rounded-full border border-slate-400"></div>
                                     <div>
                                         <div className="text-sm font-bold text-slate-800">全量覆盖 (Full Replace)</div>
                                         <div className="text-xs text-slate-500 leading-tight mt-1">每次运行时清空目标表并重新加载。</div>
                                     </div>
                                 </div>
                             </div>
                        </div>

                        <div>
                             <label className="text-xs font-medium text-slate-500 mb-2 block">调度计划 (Schedule)</label>
                             <div className="flex items-center gap-2 border border-slate-200 rounded p-2 bg-slate-50 mb-2">
                                 <History size={14} className="text-slate-400"/>
                                 <span className="text-sm font-mono text-slate-700">0 0 * * *</span>
                             </div>
                             <p className="text-[10px] text-slate-400">每天午夜 00:00 运行</p>
                        </div>
                        
                        <div className="pt-4 border-t border-slate-100">
                             <div className="flex justify-between items-center mb-2">
                                 <span className="text-xs font-bold text-slate-500">最近运行</span>
                                 <span className="text-[10px] text-blue-600 hover:underline cursor-pointer">查看日志</span>
                             </div>
                             <div className="space-y-2">
                                 <div className="flex justify-between items-center text-xs">
                                     <span className="flex items-center gap-1.5 text-emerald-600"><CheckCircle2 size={12}/> 成功</span>
                                     <span className="text-slate-400">10 分钟前</span>
                                 </div>
                                 <div className="flex justify-between items-center text-xs">
                                     <span className="flex items-center gap-1.5 text-emerald-600"><CheckCircle2 size={12}/> 成功</span>
                                     <span className="text-slate-400">昨天 00:00</span>
                                 </div>
                                 <div className="flex justify-between items-center text-xs">
                                     <span className="flex items-center gap-1.5 text-red-500"><AlertCircle size={12}/> 失败</span>
                                     <span className="text-slate-400">2天前 00:00</span>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- L3: Main List View ---
export const DataIntegration = () => {
    const [selectedSource, setSelectedSource] = useState<DataSource | null>(null);

    if (selectedSource) {
        return <IntegrationWorkbench source={selectedSource} onBack={() => setSelectedSource(null)} />;
    }

    return (
        <div className="p-8 max-w-6xl mx-auto h-full flex flex-col">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">数据集成 (Data Integration)</h1>
                    <p className="text-slate-500 text-sm">连接和管理外部数据源，配置同步策略。</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm flex items-center gap-2 transition-colors">
                    <Plus size={16} /> 新建连接
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">总连接数</div>
                    <div className="text-2xl font-bold text-slate-800">12</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold text-emerald-500 uppercase mb-1">运行正常</div>
                    <div className="text-2xl font-bold text-slate-800">10</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold text-red-500 uppercase mb-1">同步失败</div>
                    <div className="text-2xl font-bold text-slate-800">1</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold text-blue-500 uppercase mb-1">今日同步数据量</div>
                    <div className="text-2xl font-bold text-slate-800">1.2 GB</div>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="flex gap-4 mb-6">
                 <div className="relative flex-1">
                     <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                     <input type="text" placeholder="搜索连接名称、主机..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 transition-colors text-sm"/>
                 </div>
                 <select className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500 text-slate-600">
                     <option>所有类型</option>
                     <option>Database (SQL)</option>
                     <option>File System (S3/FTP)</option>
                     <option>SaaS API</option>
                 </select>
            </div>

            {/* Data Grid */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex-1">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <th className="py-3 px-6 w-[30%]">名称 / 主机</th>
                            <th className="py-3 px-4 w-[15%]">类型</th>
                            <th className="py-3 px-4 w-[15%]">状态</th>
                            <th className="py-3 px-4 w-[15%]">最后同步</th>
                            <th className="py-3 px-4 w-[15%]">记录数</th>
                            <th className="py-3 px-4 text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {sources.map(source => (
                            <tr 
                                key={source.id} 
                                className="hover:bg-slate-50 transition-colors cursor-pointer group"
                                onClick={() => setSelectedSource(source)}
                            >
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${
                                            source.type === 'POSTGRES' || source.type === 'MYSQL' || source.type === 'ORACLE' ? 'bg-blue-50 text-blue-600' :
                                            source.type === 'S3' ? 'bg-orange-50 text-orange-600' : 'bg-purple-50 text-purple-600'
                                        }`}>
                                            {source.type === 'S3' ? <FileText size={18}/> : source.type === 'REST_API' ? <Globe size={18}/> : <Database size={18}/>}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-slate-800 group-hover:text-blue-600 transition-colors">{source.name}</div>
                                            <div className="text-xs text-slate-400 font-mono">{source.host}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">{source.type}</span>
                                </td>
                                <td className="py-4 px-4">
                                     <div className="flex items-center gap-1.5">
                                         {source.status === 'SYNCING' ? (
                                             <RefreshCw size={12} className="text-blue-500 animate-spin"/>
                                         ) : (
                                             <div className={`w-1.5 h-1.5 rounded-full ${
                                                 source.status === 'ONLINE' ? 'bg-emerald-500' : 'bg-slate-300'
                                             }`}></div>
                                         )}
                                         <span className={`text-xs font-medium ${
                                             source.status === 'ONLINE' ? 'text-emerald-700' : 
                                             source.status === 'SYNCING' ? 'text-blue-600' : 'text-slate-500'
                                         }`}>{source.status}</span>
                                     </div>
                                </td>
                                <td className="py-4 px-4 text-sm text-slate-600">
                                    {source.lastSync}
                                </td>
                                <td className="py-4 px-4 text-sm font-mono text-slate-600">
                                    {source.recordCount}
                                </td>
                                <td className="py-4 px-4 text-right">
                                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                        <MoreVertical size={16}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
