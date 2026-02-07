import React, { useState } from 'react';
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
    Database
} from 'lucide-react';

// --- Types ---
interface AnalysisBoard {
    id: string;
    type: 'DATASET' | 'FILTER' | 'CHART' | 'PIVOT';
    title: string;
    config: any;
    resultCount: string;
}

// --- L4: Contour-style Analysis Path ---
export const Analytics = () => {
    const [boards, setBoards] = useState<AnalysisBoard[]>([
        { id: 'b1', type: 'DATASET', title: '原始订单数据集', config: { name: 'orders_raw_v2' }, resultCount: '12,405,920' },
        { id: 'b2', type: 'FILTER', title: '过滤: 已支付订单', config: { rules: ['status == PAID', 'amount > 0'] }, resultCount: '8,204,110' },
        { id: 'b3', type: 'CHART', title: '图表: 地区销售分布', config: { x: 'region', y: 'sum(amount)', type: 'bar' }, resultCount: '8,204,110' }
    ]);

    const addBoard = (type: AnalysisBoard['type']) => {
        const newBoard: AnalysisBoard = {
            id: `b_${Date.now()}`,
            type,
            title: type === 'FILTER' ? '新过滤器' : type === 'CHART' ? '新图表' : '新透视表',
            config: {},
            resultCount: boards[boards.length - 1].resultCount
        };
        setBoards([...boards, newBoard]);
    };

    return (
        <div className="flex h-full bg-slate-100">
            {/* Left Sidebar: Saved Analyses */}
            <div className="w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-700 text-sm">我的分析 (Analyses)</h3>
                    <button className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Plus size={16}/></button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    <div className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100 cursor-pointer">
                        Q3 季度销售复盘
                    </div>
                    <div className="px-3 py-2 hover:bg-slate-50 text-slate-600 rounded-lg text-sm cursor-pointer">
                        高价值客户流失分析
                    </div>
                    <div className="px-3 py-2 hover:bg-slate-50 text-slate-600 rounded-lg text-sm cursor-pointer">
                        库存周转率监控
                    </div>
                </div>
            </div>

            {/* Main Content: Infinite Canvas / Path */}
            <div className="flex-1 overflow-y-auto p-8 relative">
                <div className="max-w-4xl mx-auto space-y-8 pb-32">
                    
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Q3 季度销售复盘</h1>
                            <p className="text-slate-500 text-sm mt-1">创建于 2023-10-24 • 上次更新 10分钟前</p>
                        </div>
                        <div className="flex gap-2">
                             <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-700 text-sm font-medium hover:bg-slate-50">
                                 <Download size={14}/> 导出报告
                             </button>
                             <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 shadow-sm">
                                 <Save size={14}/> 保存路径
                             </button>
                        </div>
                    </div>

                    {/* Boards Stream */}
                    {boards.map((board, index) => (
                        <div key={board.id} className="relative group">
                            {/* Connector Line */}
                            {index < boards.length - 1 && (
                                <div className="absolute left-8 top-full h-8 w-0.5 bg-slate-300 z-0"></div>
                            )}

                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden z-10 relative">
                                {/* Board Header */}
                                <div className={`px-4 py-3 border-b flex justify-between items-center ${
                                    board.type === 'DATASET' ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50 border-slate-100'
                                }`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold shadow-sm ${
                                            board.type === 'DATASET' ? 'bg-indigo-500' :
                                            board.type === 'FILTER' ? 'bg-blue-500' :
                                            board.type === 'CHART' ? 'bg-emerald-500' : 'bg-purple-500'
                                        }`}>
                                            {board.type === 'DATASET' ? <Database size={16}/> :
                                             board.type === 'FILTER' ? <Filter size={16}/> :
                                             board.type === 'CHART' ? <BarChart3 size={16}/> : <Table size={16}/>}
                                        </div>
                                        <span className="font-bold text-slate-800 text-sm">{board.title}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-mono text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                                            {board.resultCount} rows
                                        </span>
                                        <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={16}/></button>
                                    </div>
                                </div>

                                {/* Board Content */}
                                <div className="p-4">
                                    {board.type === 'DATASET' && (
                                        <div className="flex items-center gap-4 text-sm text-slate-600">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs text-slate-400 uppercase">来源</span>
                                                <span className="font-mono bg-slate-100 px-2 py-1 rounded">PostgreSQL / Prod</span>
                                            </div>
                                            <ArrowRight size={14} className="text-slate-300"/>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs text-slate-400 uppercase">数据集名称</span>
                                                <span className="font-medium text-indigo-700 hover:underline cursor-pointer">{board.config.name}</span>
                                            </div>
                                        </div>
                                    )}

                                    {board.type === 'FILTER' && (
                                        <div className="space-y-2">
                                            {board.config.rules.map((rule: string, i: number) => (
                                                <div key={i} className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-100 rounded text-sm text-blue-800">
                                                    <span className="font-mono">{rule}</span>
                                                    <button className="ml-auto text-blue-400 hover:text-blue-600"><X size={14}/></button>
                                                </div>
                                            ))}
                                            <button className="text-xs text-slate-400 hover:text-blue-600 flex items-center gap-1 mt-2">
                                                <Plus size={12}/> 添加筛选条件
                                            </button>
                                        </div>
                                    )}

                                    {board.type === 'CHART' && (
                                        <div className="h-64 w-full bg-slate-50 rounded border border-slate-100 flex items-center justify-center relative">
                                            {/* Mock Chart Visual */}
                                            <div className="flex items-end gap-4 h-40 w-full px-12">
                                                <div className="flex-1 bg-emerald-400 h-[60%] rounded-t opacity-80 hover:opacity-100 transition-opacity relative group">
                                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">¥4.2M</div>
                                                </div>
                                                <div className="flex-1 bg-emerald-400 h-[80%] rounded-t opacity-80 hover:opacity-100 transition-opacity relative group">
                                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">¥6.8M</div>
                                                </div>
                                                <div className="flex-1 bg-emerald-400 h-[40%] rounded-t opacity-80 hover:opacity-100 transition-opacity relative group">
                                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">¥2.1M</div>
                                                </div>
                                                <div className="flex-1 bg-emerald-400 h-[90%] rounded-t opacity-80 hover:opacity-100 transition-opacity relative group">
                                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">¥7.5M</div>
                                                </div>
                                            </div>
                                            <div className="absolute bottom-2 left-0 w-full flex justify-between px-14 text-xs text-slate-400 font-medium">
                                                <span>East</span><span>West</span><span>North</span><span>South</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Add Button Between/After */}
                            <div className="h-8 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                <div className="w-0.5 h-full bg-blue-300"></div>
                            </div>
                        </div>
                    ))}

                    {/* Add New Board Controls */}
                    <div className="flex justify-center gap-4 mt-4">
                        <button onClick={() => addBoard('FILTER')} className="flex flex-col items-center gap-2 group">
                            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 group-hover:border-blue-500 group-hover:text-blue-600 transition-all">
                                <Filter size={18}/>
                            </div>
                            <span className="text-xs font-medium text-slate-500 group-hover:text-blue-600">筛选</span>
                        </button>
                        <button onClick={() => addBoard('CHART')} className="flex flex-col items-center gap-2 group">
                             <div className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 group-hover:border-emerald-500 group-hover:text-emerald-600 transition-all">
                                <BarChart3 size={18}/>
                            </div>
                            <span className="text-xs font-medium text-slate-500 group-hover:text-emerald-600">图表</span>
                        </button>
                         <button onClick={() => addBoard('PIVOT')} className="flex flex-col items-center gap-2 group">
                             <div className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 group-hover:border-purple-500 group-hover:text-purple-600 transition-all">
                                <Table size={18}/>
                            </div>
                            <span className="text-xs font-medium text-slate-500 group-hover:text-purple-600">透视表</span>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};