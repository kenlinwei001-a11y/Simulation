import React from 'react';
import { 
    ShieldAlert, 
    Users, 
    HardDrive, 
    Activity, 
    Lock, 
    Key, 
    Search,
    AlertTriangle,
    CheckCircle2,
    RefreshCw
} from 'lucide-react';

export const Admin = () => {
    return (
        <div className="p-8 max-w-6xl mx-auto h-full overflow-y-auto bg-slate-50">
            <h1 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <ShieldAlert className="text-slate-800"/>
                全域治理控制台 (Control Panel)
            </h1>

            {/* System Health */}
            <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                        <Activity size={14}/> 计算资源池
                    </div>
                    <div className="text-2xl font-bold text-slate-800">48 / 64 <span className="text-sm font-normal text-slate-500">vCPUs</span></div>
                    <div className="w-full bg-slate-100 h-1.5 mt-3 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 w-[75%] h-full"></div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                        <HardDrive size={14}/> 存储使用量
                    </div>
                    <div className="text-2xl font-bold text-slate-800">4.2 <span className="text-sm font-normal text-slate-500">TB</span></div>
                    <div className="w-full bg-slate-100 h-1.5 mt-3 rounded-full overflow-hidden">
                        <div className="bg-blue-500 w-[40%] h-full"></div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                        <Users size={14}/> 活跃用户 (24h)
                    </div>
                    <div className="text-2xl font-bold text-slate-800">128</div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                        <ShieldAlert size={14}/> 安全告警
                    </div>
                    <div className="text-2xl font-bold text-amber-600">3 <span className="text-sm font-normal text-slate-500">Pending</span></div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-8">
                {/* Markings (Access Control) */}
                <div className="col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-bold text-slate-800 text-sm">权限标记 (Markings)</h3>
                        <button className="text-xs text-blue-600 hover:underline">管理策略</button>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-medium">
                            <tr>
                                <th className="px-6 py-3">标记名称</th>
                                <th className="px-6 py-3">受限资源数</th>
                                <th className="px-6 py-3">授权用户组</th>
                                <th className="px-6 py-3">状态</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <tr>
                                <td className="px-6 py-4 font-medium flex items-center gap-2">
                                    <Lock size={14} className="text-red-500"/> PII (敏感个人信息)
                                </td>
                                <td className="px-6 py-4 text-slate-500">1,204 Objects</td>
                                <td className="px-6 py-4"><span className="bg-slate-100 px-2 py-1 rounded text-xs">HR_Admins</span></td>
                                <td className="px-6 py-4"><span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded">Active</span></td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-medium flex items-center gap-2">
                                    <Lock size={14} className="text-amber-500"/> Financial (财务数据)
                                </td>
                                <td className="px-6 py-4 text-slate-500">45 Datasets</td>
                                <td className="px-6 py-4"><span className="bg-slate-100 px-2 py-1 rounded text-xs">Finance_Team</span></td>
                                <td className="px-6 py-4"><span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded">Active</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Ontology Indexing Status */}
                <div className="col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                     <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="font-bold text-slate-800 text-sm">本体索引状态 (Ontology Indexing)</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-1"><CheckCircle2 size={16} className="text-emerald-500"/></div>
                            <div>
                                <div className="text-sm font-bold text-slate-800">Object Storage (Phonograph)</div>
                                <div className="text-xs text-slate-500">Healthy • Latency 12ms</div>
                            </div>
                        </div>
                         <div className="flex items-start gap-3">
                            <div className="mt-1"><CheckCircle2 size={16} className="text-emerald-500"/></div>
                            <div>
                                <div className="text-sm font-bold text-slate-800">Search Index (Opensearch)</div>
                                <div className="text-xs text-slate-500">Healthy • 14.5M Documents</div>
                            </div>
                        </div>
                         <div className="flex items-start gap-3">
                            <div className="mt-1"><RefreshCw size={16} className="text-blue-500 animate-spin"/></div>
                            <div>
                                <div className="text-sm font-bold text-slate-800">Link Traversal Service</div>
                                <div className="text-xs text-slate-500">Re-indexing relationships (45%)...</div>
                            </div>
                        </div>
                        <div className="mt-6 p-3 bg-amber-50 border border-amber-100 rounded text-xs text-amber-800 flex gap-2">
                            <AlertTriangle size={14} className="flex-shrink-0"/>
                            <div>Indexing queue is slightly backed up due to high write volume on "Orders" object.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};