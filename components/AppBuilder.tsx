import React, { useState } from 'react';
import { 
  AppWindow, 
  Smartphone, 
  Monitor, 
  MousePointer2, 
  Layout, 
  Type, 
  Database,
  Filter,
  X,
  ChevronUp,
  ChevronDown,
  Layers,
  Settings2,
  Undo,
  Play
} from 'lucide-react';
import { AppDefinition } from '../types';

// L6: Filter Atom Config (Popover)
const FilterAtomConfig = ({ onClose }: { onClose: () => void }) => {
   return (
      <div className="absolute bottom-full left-0 mb-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50 p-4 animate-in fade-in zoom-in-95 duration-200">
         <div className="flex justify-between items-center mb-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase">过滤条件配置</h4>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={14} /></button>
         </div>
         
         <div className="space-y-3">
            {/* Field Select */}
            <div>
               <label className="block text-[10px] text-slate-400 mb-1">字段 (Field)</label>
               <select className="w-full text-sm border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-blue-500">
                  <option>注册日期 (created_at)</option>
                  <option>状态 (status)</option>
               </select>
            </div>
            
            {/* Operator */}
            <div>
               <label className="block text-[10px] text-slate-400 mb-1">操作符 (Operator)</label>
               <select className="w-full text-sm border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-blue-500">
                  <option>在...范围内 (Between)</option>
                  <option>等于 (Equals)</option>
               </select>
            </div>

            {/* Dynamic Value Binding */}
            <div>
               <div className="flex justify-between items-center mb-1">
                   <label className="text-[10px] text-slate-400">值绑定 (Value)</label>
                   <div className="flex items-center gap-1">
                      <span className="text-[10px] text-blue-600 font-medium">动态</span>
                      <div className="w-6 h-3 bg-blue-600 rounded-full relative cursor-pointer">
                         <div className="absolute right-0.5 top-0.5 w-2 h-2 bg-white rounded-full"></div>
                      </div>
                   </div>
               </div>
               <div className="flex items-center gap-1 border border-blue-200 bg-blue-50 rounded px-2 py-1.5 cursor-pointer hover:border-blue-400">
                   <Filter size={12} className="text-blue-500" />
                   <span className="text-xs text-blue-700 truncate">DateRangePicker1.Value</span>
                   <X size={12} className="ml-auto text-blue-400 hover:text-blue-600" />
               </div>
               <p className="text-[10px] text-red-500 mt-1 hidden">循环引用错误</p>
            </div>
         </div>
      </div>
   );
}

// L5: Variable Configuration Panel
const VariableConfig = ({ onClose }: { onClose: () => void }) => {
   const [showFilterConfig, setShowFilterConfig] = useState(false);

   return (
      <div className="h-full flex flex-col bg-white border-r border-slate-200 w-80 flex-shrink-0">
         <div className="p-4 border-b border-slate-200 flex justify-between items-center">
             <h3 className="font-semibold text-slate-800">变量配置 (Variable Config)</h3>
             <button onClick={onClose}><X size={16} className="text-slate-400"/></button>
         </div>
         <div className="p-4 space-y-4 flex-1 overflow-y-auto">
             <div>
                <label className="text-xs text-slate-500 font-medium">变量名称</label>
                <input type="text" defaultValue="filtered_orders" className="w-full mt-1 px-2 py-1.5 text-sm border border-slate-200 rounded focus:border-blue-500 outline-none font-mono text-slate-700"/>
             </div>
             
             <div>
                <label className="text-xs text-slate-500 font-medium">初始数据源</label>
                <div className="mt-1 flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded">
                   <Database size={14} className="text-blue-500" />
                   <span className="text-sm">实体: 订单 (Orders)</span>
                </div>
             </div>

             <div className="relative">
                <div className="flex justify-between items-center mb-2">
                   <label className="text-xs text-slate-500 font-medium">处理管道 (Pipeline)</label>
                </div>
                {/* Pipeline Visual */}
                <div className="space-y-2 relative pl-3 border-l border-slate-200 ml-1">
                   {/* Step 1 */}
                   <div className="relative">
                      <div className="absolute -left-[17px] top-2 w-2 h-2 rounded-full bg-slate-300"></div>
                      <div className="p-2 bg-white border border-slate-200 rounded shadow-sm text-sm">
                         加载所有记录
                      </div>
                   </div>
                   {/* Step 2 (Filter) */}
                   <div className="relative">
                      <div className="absolute -left-[17px] top-2 w-2 h-2 rounded-full bg-blue-500"></div>
                      <div className="p-2 bg-blue-50 border border-blue-200 rounded shadow-sm relative">
                         <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-blue-700">过滤 (FILTER)</span>
                            <button onClick={() => setShowFilterConfig(!showFilterConfig)} className="text-blue-400 hover:text-blue-600"><Settings2 size={12}/></button>
                         </div>
                         <div className="text-xs text-blue-600 mt-1">关联组件 DateRangePicker1</div>
                         
                         {/* L6 Popover Anchor */}
                         {showFilterConfig && <FilterAtomConfig onClose={() => setShowFilterConfig(false)} />}
                      </div>
                   </div>
                   
                   <button className="text-xs text-slate-400 hover:text-blue-600 flex items-center gap-1 mt-2">
                      <div className="w-4 h-4 rounded-full border border-dashed border-slate-300 flex items-center justify-center">+</div>
                      添加阶段
                   </button>
                </div>
             </div>
         </div>
      </div>
   )
}

// Main Component
export const AppBuilder = () => {
   const [selectedApp, setSelectedApp] = useState<AppDefinition | null>(null);
   const [showVariableManager, setShowVariableManager] = useState(false);
   const [editingVariable, setEditingVariable] = useState(false);
   const [resolution, setResolution] = useState<'DESKTOP' | 'TABLET' | 'MOBILE'>('DESKTOP');

   const apps: AppDefinition[] = [
     { id: 'app_1', name: '销售大盘 V2', urlSuffix: '/sales-dashboard', thumbnail: 'bg-gradient-to-br from-blue-50 to-indigo-100' },
     { id: 'app_2', name: '库存管理后台', urlSuffix: '/inventory-admin', thumbnail: 'bg-gradient-to-br from-green-50 to-emerald-100' },
   ];

   if (!selectedApp) {
      return (
         <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-2xl font-semibold text-slate-900 mb-6">我的应用</h1>
            <div className="grid grid-cols-4 gap-6">
               {apps.map(app => (
                  <div key={app.id} onClick={() => setSelectedApp(app)} className="group cursor-pointer">
                     <div className={`aspect-video rounded-xl shadow-sm border border-slate-200 mb-3 ${app.thumbnail} group-hover:shadow-md transition-all relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                     </div>
                     <h3 className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{app.name}</h3>
                     <p className="text-xs text-slate-400 font-mono">{app.urlSuffix}</p>
                  </div>
               ))}
               <div className="aspect-video rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-slate-300 hover:bg-slate-50 transition-colors">
                  <span className="text-4xl mb-2 font-light">+</span>
                  <span className="text-sm">新建应用</span>
               </div>
            </div>
         </div>
      )
   }

   // L4: Canvas Workbench
   return (
      <div className="flex flex-col h-full bg-slate-100">
         {/* Top Bar */}
         <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 flex-shrink-0 z-20">
            <div className="flex items-center gap-4">
               <button onClick={() => setSelectedApp(null)} className="p-1.5 hover:bg-slate-100 rounded text-slate-500"><X size={18}/></button>
               <h2 className="font-semibold text-slate-800">{selectedApp.name}</h2>
            </div>
            
            <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
               <button onClick={() => setResolution('DESKTOP')} className={`p-1.5 rounded ${resolution === 'DESKTOP' ? 'bg-white shadow text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}><Monitor size={16}/></button>
               <button onClick={() => setResolution('TABLET')} className={`p-1.5 rounded ${resolution === 'TABLET' ? 'bg-white shadow text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}><Smartphone size={16} className="rotate-90"/></button>
               <button onClick={() => setResolution('MOBILE')} className={`p-1.5 rounded ${resolution === 'MOBILE' ? 'bg-white shadow text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}><Smartphone size={16}/></button>
            </div>

            <div className="flex items-center gap-2">
               <button className="p-2 text-slate-400 hover:text-slate-600"><Undo size={18}/></button>
               <button className="bg-slate-900 text-white px-4 py-1.5 rounded text-sm font-medium flex items-center gap-2 hover:bg-slate-800">
                  <Play size={14} /> 预览 (Preview)
               </button>
            </div>
         </div>

         {/* Workspace */}
         <div className="flex-1 flex overflow-hidden relative">
            {/* Left: Components */}
            <div className="w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 z-10">
               <div className="p-4 border-b border-slate-100 font-medium text-xs text-slate-500">组件库 (COMPONENTS)</div>
               <div className="p-4 space-y-6 overflow-y-auto">
                  <div>
                     <div className="text-xs font-bold text-slate-400 mb-2">布局 (LAYOUT)</div>
                     <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 border border-slate-200 rounded bg-slate-50 text-center text-[10px] cursor-grab active:cursor-grabbing hover:border-blue-300">容器 (Container)</div>
                        <div className="p-3 border border-slate-200 rounded bg-slate-50 text-center text-[10px] cursor-grab active:cursor-grabbing hover:border-blue-300">栅格 (Grid)</div>
                     </div>
                  </div>
                  <div>
                     <div className="text-xs font-bold text-slate-400 mb-2">输入 (INPUT)</div>
                     <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 border border-slate-200 rounded hover:bg-slate-50 cursor-grab">
                           <Type size={14} /> <span className="text-sm">文本输入 (Input)</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 border border-slate-200 rounded hover:bg-slate-50 cursor-grab">
                           <MousePointer2 size={14} /> <span className="text-sm">按钮 (Button)</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Center: Canvas */}
            <div className="flex-1 overflow-auto flex items-center justify-center p-8 bg-slate-100 relative">
                {/* Grid Pattern */}
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                    style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
               </div>

               {/* Simulated App Frame */}
               <div className={`bg-white shadow-2xl transition-all duration-300 flex flex-col ${
                  resolution === 'DESKTOP' ? 'w-full max-w-5xl h-[800px]' : 
                  resolution === 'TABLET' ? 'w-[768px] h-[1024px]' : 'w-[375px] h-[667px]'
               }`}>
                  <div className="h-full border border-slate-200 relative p-8">
                      {/* Mock Content */}
                      <div className="border-2 border-dashed border-blue-200 bg-blue-50/20 rounded-lg h-32 flex items-center justify-center mb-4 text-blue-300 text-sm">页眉区域 (Header Area)</div>
                      <div className="grid grid-cols-3 gap-4">
                         <div className="col-span-2 h-64 border border-slate-200 rounded bg-slate-50 p-4">
                            <h3 className="text-slate-400 font-medium mb-4">图表区域 (Chart Area)</h3>
                            <div className="flex items-end gap-2 h-40">
                               <div className="w-8 h-[40%] bg-blue-200"></div>
                               <div className="w-8 h-[70%] bg-blue-300"></div>
                               <div className="w-8 h-[50%] bg-blue-200"></div>
                               <div className="w-8 h-[90%] bg-blue-400"></div>
                            </div>
                         </div>
                         <div className="h-64 border border-slate-200 rounded bg-slate-50 p-4">
                            <h3 className="text-slate-400 font-medium mb-4">筛选区 (Filters)</h3>
                            <div className="space-y-3">
                               <div className="h-8 bg-white border border-slate-200 rounded w-full"></div>
                               <div className="h-8 bg-white border border-slate-200 rounded w-full"></div>
                               <div className="h-8 bg-blue-600 rounded w-full mt-4"></div>
                            </div>
                         </div>
                      </div>
                  </div>
               </div>
            </div>

            {/* Right: Properties */}
            <div className="w-72 bg-white border-l border-slate-200 flex flex-col flex-shrink-0 z-10">
               <div className="p-4 border-b border-slate-100 font-medium text-xs text-slate-500">属性面板 (PROPERTIES)</div>
               <div className="p-4 text-center text-slate-400 text-sm mt-10">在画布上选择组件以编辑属性</div>
            </div>
         </div>

         {/* Bottom: Variable Manager (Collapsible) */}
         <div className={`bg-white border-t border-slate-200 flex flex-col transition-all duration-300 z-30 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] ${showVariableManager ? 'h-80' : 'h-10'}`}>
            <div 
               className="h-10 bg-slate-50 border-b border-slate-200 flex items-center justify-between px-4 cursor-pointer hover:bg-slate-100"
               onClick={() => setShowVariableManager(!showVariableManager)}
            >
               <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <Database size={14} /> 变量管理器 (VARIABLE MANAGER)
               </div>
               {showVariableManager ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </div>
            
            {showVariableManager && (
               <div className="flex-1 flex overflow-hidden">
                  {/* Variable List */}
                  <div className="w-64 border-r border-slate-200 p-2 overflow-y-auto bg-slate-50/50">
                     <button className="w-full mb-2 py-1.5 border border-slate-300 rounded bg-white text-xs font-medium text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors shadow-sm">
                        + 新建变量
                     </button>
                     <div 
                        className={`p-2 rounded cursor-pointer mb-1 border ${editingVariable ? 'bg-blue-50 border-blue-200' : 'hover:bg-slate-100 border-transparent'}`}
                        onClick={() => setEditingVariable(true)}
                     >
                        <div className="flex items-center gap-2">
                           <Layers size={14} className="text-purple-600" />
                           <span className="text-sm font-medium text-slate-700">filtered_orders</span>
                        </div>
                        <div className="text-[10px] text-slate-400 pl-5.5 mt-0.5">对象集 (Object Set) • 24 行</div>
                     </div>
                  </div>

                  {/* Variable Editor / Config */}
                  <div className="flex-1 bg-white relative">
                      {editingVariable ? (
                         <div className="flex h-full">
                            <VariableConfig onClose={() => setEditingVariable(false)} />
                            <div className="flex-1 bg-slate-50 p-4 font-mono text-xs text-slate-500 overflow-auto">
                               {/* Mock Data Preview */}
                               <div className="mb-2 font-bold text-slate-400 uppercase">数据预览 (Data Preview)</div>
                               <div className="bg-white border border-slate-200 rounded p-2 shadow-sm">
                                  {JSON.stringify([
                                     { id: 101, amount: 5000, status: 'Pending' },
                                     { id: 102, amount: 12000, status: 'Approved' },
                                  ], null, 2)}
                               </div>
                            </div>
                         </div>
                      ) : (
                         <div className="h-full flex items-center justify-center text-slate-400 text-sm">请选择一个变量进行配置</div>
                      )}
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};