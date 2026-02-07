import React, { useState } from 'react';
import { 
    GitBranch, 
    GitCommit, 
    Play, 
    Search, 
    File, 
    Folder, 
    Settings, 
    ChevronRight, 
    ChevronDown, 
    MoreHorizontal,
    RefreshCw,
    Code,
    Cpu,
    CheckCircle2
} from 'lucide-react';

// --- L4: Web IDE for Data Transforms ---
export const CodeRepository = () => {
    const [activeFile, setActiveFile] = useState('transforms.py');
    const [branch, setBranch] = useState('feature/add-customer-metrics');
    const [status, setStatus] = useState<'IDLE' | 'RUNNING' | 'SUCCESS'>('IDLE');

    return (
        <div className="flex h-full bg-slate-900 text-slate-300 overflow-hidden font-sans">
            {/* Left Sidebar: File Tree */}
            <div className="w-64 border-r border-slate-700 bg-slate-900 flex flex-col flex-shrink-0">
                {/* Repo Header */}
                <div className="h-12 border-b border-slate-700 flex items-center px-4 gap-2 bg-slate-800/50">
                    <Code size={16} className="text-blue-400"/>
                    <span className="font-bold text-sm text-slate-200 truncate">crm-data-transforms</span>
                </div>
                
                {/* Branch Selector */}
                <div className="p-3 border-b border-slate-700">
                    <div className="flex items-center gap-2 bg-slate-800 rounded px-2 py-1.5 text-xs cursor-pointer hover:bg-slate-700 border border-slate-700 transition-colors">
                        <GitBranch size={14} className="text-purple-400"/>
                        <span className="truncate flex-1">{branch}</span>
                        <ChevronDown size={14} className="text-slate-500"/>
                    </div>
                </div>

                {/* Files */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1 text-sm font-medium">
                    <div className="flex items-center gap-1.5 px-2 py-1 text-slate-400 hover:text-slate-200 cursor-pointer">
                        <ChevronDown size={14}/> <Folder size={14} className="text-blue-400"/> <span>src</span>
                    </div>
                    <div className="pl-6 space-y-1">
                        <div className="flex items-center gap-2 px-2 py-1 text-slate-400 hover:bg-slate-800 rounded cursor-pointer">
                             <Folder size={14} className="text-orange-400"/> <span>datasets</span>
                        </div>
                        <div 
                            className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer ${activeFile === 'transforms.py' ? 'bg-blue-900/30 text-blue-300 border border-blue-800' : 'text-slate-400 hover:bg-slate-800 border border-transparent'}`}
                            onClick={() => setActiveFile('transforms.py')}
                        >
                             <File size={14} className="text-yellow-400"/> <span>transforms.py</span>
                        </div>
                        <div className="flex items-center gap-2 px-2 py-1 text-slate-400 hover:bg-slate-800 rounded cursor-pointer">
                             <File size={14} className="text-yellow-400"/> <span>utils.py</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 text-slate-400 hover:text-slate-200 cursor-pointer">
                        <ChevronRight size={14}/> <Folder size={14} className="text-slate-500"/> <span>tests</span>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1 text-slate-500 hover:bg-slate-800 rounded cursor-pointer">
                         <File size={14} className="text-slate-600"/> <span>README.md</span>
                    </div>
                </div>
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
                {/* Tabs */}
                <div className="h-10 bg-[#252526] flex items-center border-b border-black">
                    <div className="px-4 h-full bg-[#1e1e1e] border-t-2 border-t-blue-500 flex items-center gap-2 text-sm text-slate-200 min-w-[120px]">
                        <File size={14} className="text-yellow-400"/>
                        {activeFile}
                        <div className="w-2 h-2 rounded-full bg-white opacity-0 hover:opacity-100"></div>
                    </div>
                    <div className="px-4 h-full flex items-center gap-2 text-sm text-slate-500 hover:bg-[#2a2a2b] cursor-pointer min-w-[100px] border-r border-slate-800">
                        <File size={14} className="text-yellow-400"/>
                        utils.py
                    </div>
                </div>

                {/* Toolbar */}
                <div className="h-12 border-b border-slate-800 bg-[#1e1e1e] flex items-center justify-between px-4">
                     <div className="flex items-center gap-1 text-xs text-slate-500">
                         <span>crm-data-transforms</span> <span>&gt;</span> <span>src</span> <span>&gt;</span> <span>{activeFile}</span>
                     </div>
                     <div className="flex items-center gap-3">
                         <div className="flex items-center gap-2 mr-4">
                             <span className="text-xs text-slate-500">Environment:</span>
                             <div className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded border border-green-400/20">
                                 <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                                 Running
                             </div>
                         </div>
                         <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs text-white transition-colors">
                             <RefreshCw size={12}/> Preview
                         </button>
                         <button 
                            onClick={() => {
                                setStatus('RUNNING');
                                setTimeout(() => setStatus('SUCCESS'), 2000);
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-xs text-white font-medium shadow-lg shadow-blue-900/20 transition-all"
                        >
                             {status === 'RUNNING' ? <RefreshCw size={12} className="animate-spin"/> : <Play size={12}/>}
                             Build
                         </button>
                         <button className="flex items-center gap-2 px-3 py-1.5 bg-green-700 hover:bg-green-600 rounded text-xs text-white font-medium shadow-lg shadow-green-900/20 transition-all">
                             <GitCommit size={12}/> Commit
                         </button>
                     </div>
                </div>

                {/* Code Editor (Visual Mock) */}
                <div className="flex-1 relative overflow-auto font-mono text-sm leading-6">
                    <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#1e1e1e] border-r border-[#333] flex flex-col items-end pr-3 pt-4 text-slate-600 select-none">
                        {Array.from({length: 20}).map((_, i) => <div key={i}>{i+1}</div>)}
                    </div>
                    <div className="pl-16 pt-4 text-slate-300">
                        <div><span className="text-purple-400">from</span> transforms.api <span className="text-purple-400">import</span> transform, Input, Output</div>
                        <div><span className="text-purple-400">from</span> pyspark.sql <span className="text-purple-400">import</span> functions <span className="text-purple-400">as</span> F</div>
                        <div className="h-4"></div>
                        <div><span className="text-yellow-200">@transform</span>(</div>
                        <div>{'    '}my_output=Output(<span className="text-green-300">"/Company/Clean/Orders"</span>),</div>
                        <div>{'    '}raw_orders=Input(<span className="text-green-300">"/Company/Raw/Orders_Source"</span>),</div>
                        <div>)</div>
                        <div><span className="text-purple-400">def</span> <span className="text-blue-300">compute_clean_orders</span>(my_output, raw_orders):</div>
                        <div>{'    '}df = raw_orders.dataframe()</div>
                        <div className="h-4"></div>
                        <div>{'    '}<span className="text-slate-500"># Filter invalid records</span></div>
                        <div>{'    '}df = df.filter(F.col(<span className="text-green-300">"status"</span>).isin([<span className="text-green-300">"PAID"</span>, <span className="text-green-300">"SHIPPED"</span>]))</div>
                        <div className="h-4"></div>
                        <div>{'    '}<span className="text-slate-500"># Calculate derived metrics</span></div>
                        <div>{'    '}df = df.withColumn(</div>
                        <div>{'        '}<span className="text-green-300">"total_tax"</span>, </div>
                        <div>{'        '}F.col(<span className="text-green-300">"amount"</span>) * <span className="text-orange-300">0.085</span></div>
                        <div>{'    '})</div>
                        <div className="h-4"></div>
                        <div>{'    '}my_output.write_dataframe(df)</div>
                    </div>
                </div>

                {/* Bottom Panel: Build Status */}
                <div className="h-40 border-t border-slate-700 bg-[#1e1e1e] flex flex-col">
                    <div className="h-8 flex items-center gap-6 px-4 border-b border-slate-700 bg-[#252526]">
                        <span className="text-xs font-bold text-slate-200 border-b-2 border-blue-500 h-full flex items-center px-1">TERMINAL</span>
                        <span className="text-xs font-medium text-slate-500 h-full flex items-center px-1 hover:text-slate-300 cursor-pointer">CHECKS</span>
                        <span className="text-xs font-medium text-slate-500 h-full flex items-center px-1 hover:text-slate-300 cursor-pointer">PREVIEW</span>
                    </div>
                    <div className="flex-1 p-3 font-mono text-xs overflow-y-auto">
                        {status === 'IDLE' && <div className="text-slate-500">Ready to build.</div>}
                        {status === 'RUNNING' && (
                            <div className="space-y-1">
                                <div className="text-slate-400">&gt; Allocating executor resources...</div>
                                <div className="text-slate-400">&gt; Spark session initialized (ID: app-20231024-001)</div>
                                <div className="text-blue-400">&gt; Running transform: compute_clean_orders...</div>
                            </div>
                        )}
                        {status === 'SUCCESS' && (
                            <div className="space-y-1">
                                <div className="text-slate-500">&gt; Allocating executor resources...</div>
                                <div className="text-slate-500">&gt; Spark session initialized (ID: app-20231024-001)</div>
                                <div className="text-slate-500">&gt; Running transform: compute_clean_orders...</div>
                                <div className="text-emerald-400 flex items-center gap-2">
                                    <CheckCircle2 size={12}/> Build successful in 4.2s
                                </div>
                                <div className="text-slate-300 mt-2">Output dataset written to: /Company/Clean/Orders (14,203 rows)</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};