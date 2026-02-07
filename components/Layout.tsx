import React, { useState } from 'react';
import { ViewState } from '../types';
import { 
  LayoutGrid, 
  Database, 
  Workflow, 
  Box, 
  AppWindow, 
  BarChart3, 
  Settings, 
  Search,
  ChevronDown,
  ShieldAlert,
  GitGraph,
  LineChart,
  ShoppingBag,
  Target
} from 'lucide-react';

interface LayoutProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  children: React.ReactNode;
}

const NavItem = ({ 
  icon: Icon, 
  tooltip, 
  active, 
  onClick 
}: { 
  icon: React.ElementType; 
  tooltip: string; 
  active: boolean; 
  onClick: () => void;
}) => (
  <div className="relative group flex justify-center py-4 cursor-pointer" onClick={onClick}>
    <div className={`p-2 rounded-lg transition-colors ${active ? 'bg-blue-100 text-blue-600' : 'text-slate-500 hover:bg-slate-100'}`}>
      <Icon size={24} strokeWidth={1.5} />
    </div>
    {/* Tooltip */}
    <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
      {tooltip}
    </div>
    {/* Active Indicator */}
    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />}
  </div>
);

export const Layout: React.FC<LayoutProps> = ({ currentView, setView, children }) => {
  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden">
      {/* L2: Global Sidebar */}
      <aside className="w-16 bg-white border-r border-slate-200 flex flex-col z-20 flex-shrink-0 scrollbar-hide overflow-y-auto">
        <div className="h-16 flex items-center justify-center border-b border-slate-100 mb-2 flex-shrink-0">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            D
          </div>
        </div>
        
        <nav className="flex-1 flex flex-col gap-1">
          <NavItem 
            icon={LayoutGrid} 
            tooltip="门户首页 (Portal)" 
            active={currentView === ViewState.PORTAL} 
            onClick={() => setView(ViewState.PORTAL)} 
          />
          <div className="h-px bg-slate-100 mx-4 my-2" />
          
          <NavItem 
            icon={Target} 
            tooltip="年度计划 (Annual Plan)" 
            active={currentView === ViewState.ANNUAL_PLAN} 
            onClick={() => setView(ViewState.ANNUAL_PLAN)} 
          />

          {/* Data Engineering */}
          <NavItem 
            icon={Database} 
            tooltip="数据集成 (Connectors)" 
            active={currentView === ViewState.DATA_INTEGRATION} 
            onClick={() => setView(ViewState.DATA_INTEGRATION)} 
          />
          <NavItem 
            icon={Workflow} 
            tooltip="流水线构建 (Pipeline Builder)" 
            active={currentView === ViewState.DATA_PIPELINE} 
            onClick={() => setView(ViewState.DATA_PIPELINE)} 
          />
          
          {/* Exploration & Ontology */}
          <div className="h-px bg-slate-100 mx-4 my-2" />
          
          <NavItem 
            icon={Box} 
            tooltip="数据业务实体 (Data Entity)" 
            active={currentView === ViewState.OBJECT_CENTER} 
            onClick={() => setView(ViewState.OBJECT_CENTER)} 
          />

          {/* Analytics & Apps */}
          <div className="h-px bg-slate-100 mx-4 my-2" />
          <NavItem 
            icon={BarChart3} 
            tooltip="路径分析 (Contour)" 
            active={currentView === ViewState.ANALYTICS} 
            onClick={() => setView(ViewState.ANALYTICS)} 
          />
           <NavItem 
            icon={LineChart} 
            tooltip="高维分析 (Quiver)" 
            active={currentView === ViewState.QUIVER} 
            onClick={() => setView(ViewState.QUIVER)} 
          />
          <NavItem 
            icon={AppWindow} 
            tooltip="应用构建器 (Workshop)" 
            active={currentView === ViewState.APP_BUILDER} 
            onClick={() => setView(ViewState.APP_BUILDER)} 
          />

           {/* Ecosystem */}
           <div className="h-px bg-slate-100 mx-4 my-2" />
           <NavItem 
            icon={ShoppingBag} 
            tooltip="应用市场 (Marketplace)" 
            active={currentView === ViewState.MARKETPLACE} 
            onClick={() => setView(ViewState.MARKETPLACE)} 
          />
        </nav>

        <div className="mb-4">
          <NavItem 
            icon={ShieldAlert} 
            tooltip="全域治理 (Control Panel)" 
            active={currentView === ViewState.ADMIN} 
            onClick={() => setView(ViewState.ADMIN)} 
          />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-slate-50 relative">
        {/* L1 Header */}
        {currentView !== ViewState.PORTAL && (
             <header className="h-14 bg-white border-b border-slate-200 flex items-center px-6 justify-between flex-shrink-0 z-10">
             <div className="flex items-center gap-2 text-sm text-slate-500">
               <span className="cursor-pointer hover:text-blue-600" onClick={() => setView(ViewState.PORTAL)}>门户</span>
               <span>/</span>
               <span className="font-medium text-slate-900">
                {currentView === ViewState.OBJECT_CENTER ? '数据业务实体中心 (Data Entity)' : 
                 currentView === ViewState.APP_BUILDER ? '应用构建器 (Workshop)' : 
                 currentView === ViewState.DATA_PIPELINE ? '数据流水线 (Pipeline Builder)' : 
                 currentView === ViewState.DATA_INTEGRATION ? '数据集成 (Connectors)' : 
                 currentView === ViewState.ANALYTICS ? '路径分析 (Contour)' : 
                 currentView === ViewState.QUIVER ? '高维分析 (Quiver)' : 
                 currentView === ViewState.LINEAGE ? '血缘探索 (Monocle)' : 
                 currentView === ViewState.MARKETPLACE ? '应用市场 (Marketplace)' :
                 currentView === ViewState.ANNUAL_PLAN ? '年度计划跟踪 (Annual Plan)' :
                 currentView === ViewState.ADMIN ? '系统管理 (Control Panel)' : '工作台'}
               </span>
             </div>
             
             <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input 
                    type="text" 
                    placeholder="全局搜索..." 
                    className="pl-9 pr-4 py-1.5 bg-slate-100 border-none rounded-md text-sm text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none w-64 transition-all"
                  />
                </div>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded pr-2">
                   <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-xs text-indigo-600 font-bold">
                     张
                   </div>
                   <span className="text-sm font-medium text-slate-700">张三</span>
                </div>
             </div>
           </header>
        )}
        
        {/* Content Render */}
        <div className="flex-1 overflow-hidden relative">
          {children}
        </div>
      </main>
    </div>
  );
};
