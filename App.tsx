import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Portal } from './components/Portal';
import { ObjectCenter } from './components/ObjectCenter';
import { AppBuilder } from './components/AppBuilder';
import { DataPipeline } from './components/DataPipeline';
import { DataIntegration } from './components/DataIntegration';
import { Analytics } from './components/Analytics';
import { Admin } from './components/Admin';
import { Lineage } from './components/Lineage';
import { Quiver } from './components/Quiver';
import { Marketplace } from './components/Marketplace';
import { AnnualPlan } from './components/AnnualPlan';
import { ViewState } from './types';

export default function App() {
  const [currentView, setView] = useState<ViewState>(ViewState.PORTAL);
  const [navContext, setNavContext] = useState<any>(null);

  const handleNavigate = (view: ViewState, context?: any) => {
      setView(view);
      if (context) {
          setNavContext(context);
      }
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.PORTAL:
        return <Portal onNavigate={handleNavigate} />;
      case ViewState.OBJECT_CENTER:
        return <ObjectCenter />;
      case ViewState.APP_BUILDER:
        return <AppBuilder />;
      case ViewState.DATA_PIPELINE:
        return <DataPipeline />;
      case ViewState.DATA_INTEGRATION:
        return <DataIntegration />;
      case ViewState.ANALYTICS:
        return <Analytics />;
      case ViewState.ADMIN:
        return <Admin />;
      case ViewState.LINEAGE:
        return <Lineage />;
      case ViewState.QUIVER:
        return <Quiver onNavigate={handleNavigate} />;
      case ViewState.MARKETPLACE:
        return <Marketplace />;
      case ViewState.ANNUAL_PLAN:
        return <AnnualPlan initialContext={navContext} />;
      default:
        return (
          <div className="flex h-full items-center justify-center text-slate-400 flex-col gap-4">
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
               <span className="text-2xl font-bold">?</span>
             </div>
             <p>模块建设中 (Module under construction)</p>
          </div>
        );
    }
  };

  return (
    <Layout currentView={currentView} setView={setView}>
      {renderContent()}
    </Layout>
  );
}