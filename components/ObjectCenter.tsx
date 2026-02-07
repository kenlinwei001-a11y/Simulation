import React, { useState, useMemo } from 'react';
import { 
  Folder, 
  MoreVertical, 
  Box, 
  Plus, 
  Settings, 
  GitCommit, 
  Play, 
  Save, 
  X,
  ChevronRight,
  Code,
  AlertCircle,
  FileText,
  Share2,
  Database,
  Calendar,
  Zap,
  CheckCircle2,
  Table as TableIcon,
  Search,
  LayoutGrid,
  Filter,
  ArrowLeft,
  Link,
  Trash2,
  ShieldCheck,
  GitGraph
} from 'lucide-react';
import { BusinessObject, ObjectStatus } from '../types';

// --- Types for Mock Data ---
interface MockDetailData {
    description: string;
    stats: {
        apiCalls: string;
        relations: number;
        activeRules: number;
        health: string;
    };
    properties: Array<{
        name: string;
        type: string;
        required: boolean;
        unique: boolean;
        desc: string;
    }>;
    relationships: Array<{
        id: string;
        target: string;
        targetCode: string;
        type: string;
        field: string;
        description: string;
        cardinality: string;
        constraintName: string;
        onDelete: string;
    }>;
    actions: Array<{
        id: string;
        name: string;
        trigger: string;
        description: string;
        status: string;
        lastMod: string;
    }>;
}

// --- Sub-Components ---

// L6: New Object Wizard (Modal)
const NewObjectModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
   const [step, setStep] = useState(1);
   const [name, setName] = useState('');
   const [code, setCode] = useState('');

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
         <div className="bg-white rounded-xl shadow-2xl w-[600px] overflow-hidden flex flex-col transform transition-all scale-100">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <div>
                  <h3 className="font-bold text-slate-800 text-lg">新建数据业务实体</h3>
                  <p className="text-xs text-slate-500">定义新的数据实体模型 (Ontology)</p>
               </div>
               <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-full hover:bg-slate-200 transition-colors"><X size={20} /></button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-6">
               <div className="space-y-4">
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">实体名称 (Display Name) <span className="text-red-500">*</span></label>
                     <input 
                        type="text" 
                        placeholder="例如：客户订单" 
                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                     />
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">系统代号 (System Code) <span className="text-red-500">*</span></label>
                     <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">obj_</span>
                        <input 
                           type="text" 
                           placeholder="customer_order" 
                           className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-2.5 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                           value={code}
                           onChange={(e) => setCode(e.target.value)}
                        />
                     </div>
                     <p className="text-[10px] text-slate-400 mt-1">创建后不可更改。仅支持英文字母、数字和下划线。</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">所属目录</label>
                        <select className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 bg-white">
                           <option value="f1">CRM 核心</option>
                           <option value="f2">供应链 (SCM)</option>
                           <option value="f3">财务 (Finance)</option>
                           <option value="f4">人事行政 (HR)</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">存储引擎</label>
                        <select className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 bg-white text-slate-600" disabled>
                           <option>Standard Relational (PostgreSQL)</option>
                        </select>
                     </div>
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">描述 (Description)</label>
                     <textarea 
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none h-20"
                        placeholder="描述该实体的业务用途..."
                     ></textarea>
                  </div>
               </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
               <button onClick={onClose} className="px-5 py-2 text-sm text-slate-600 hover:bg-white hover:shadow-sm hover:border-slate-300 border border-transparent rounded-lg font-medium transition-all">取消</button>
               <button 
                  onClick={onClose} 
                  className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md shadow-blue-200 font-medium transition-colors flex items-center gap-2"
               >
                  <Plus size={16}/> 创建实体
               </button>
            </div>
         </div>
      </div>
   )
}

// L6: Atomic Logic Editor (Modal/Popover)
const LogicRuleEditor = ({ onClose, onSave }: { onClose: () => void, onSave: (rule: any) => void }) => {
  const [param, setParam] = useState('');
  const [operator, setOperator] = useState('GT');
  const [val, setVal] = useState('10000');

  const isValid = param.length > 0 && val.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-[600px] border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Code size={18} className="text-blue-600" />
            条件判断规则 (IF...THEN)
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* IF Block */}
          <div className="relative pl-6 border-l-2 border-blue-200">
             <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-400"></div>
             <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3">满足条件 (IF)</h4>
             
             <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="bg-white border border-slate-300 rounded px-2 py-1 text-sm text-slate-700 font-mono flex items-center gap-1 cursor-pointer hover:border-blue-400">
                   <span className="text-blue-600">@</span> 
                   <input 
                     className="outline-none w-24 text-sm" 
                     placeholder="参数名" 
                     value={param} 
                     onChange={(e) => setParam(e.target.value)}
                   />
                </div>
                <select 
                  className="bg-white border border-slate-300 rounded px-2 py-1 text-sm text-slate-600 outline-none focus:border-blue-500"
                  value={operator}
                  onChange={(e) => setOperator(e.target.value)}
                >
                  <option value="GT">大于 ( &gt; )</option>
                  <option value="LT">小于 ( &lt; )</option>
                  <option value="EQ">等于 ( == )</option>
                </select>
                <input 
                  type="text" 
                  className="bg-white border border-slate-300 rounded px-2 py-1 text-sm text-slate-700 w-24 outline-none focus:border-blue-500"
                  value={val}
                  onChange={(e) => setVal(e.target.value)}
                />
             </div>
             <button className="mt-2 text-xs text-blue-600 font-medium hover:underline">+ 添加子条件 (AND/OR)</button>
          </div>

          {/* THEN Block */}
           <div className="relative pl-6 border-l-2 border-green-200">
             <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-100 border-2 border-green-400"></div>
             <h4 className="text-xs font-bold text-green-600 uppercase tracking-wider mb-3">执行操作 (THEN)</h4>
             
             <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
               <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-500">操作:</span>
                  <select className="bg-white border border-slate-300 rounded px-2 py-1 text-sm">
                    <option>修改实体属性</option>
                  </select>
               </div>
               <div className="flex items-center gap-2 text-sm">
                  <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs border border-purple-200">当前实体</span>
                  <span className="text-slate-400">.</span>
                  <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-xs border border-slate-300">状态</span>
                  <span className="text-slate-400">=</span>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs border border-yellow-200">'已处理'</span>
               </div>
             </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">取消</button>
          <button 
            onClick={() => onSave({})} 
            disabled={!isValid}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-300 cursor-not-allowed'}`}
          >
            保存规则
          </button>
        </div>
      </div>
    </div>
  );
};

// L5: Action Configuration Drawer
const ActionDrawer = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [showLogicEditor, setShowLogicEditor] = useState(false);
  const [dirty, setDirty] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/10 z-30 backdrop-blur-[1px]" onClick={() => {
        if(dirty) {
           if(confirm("有未保存的更改，确定关闭吗？")) onClose();
        } else {
           onClose();
        }
      }} />
      
      <div className="fixed top-0 right-0 h-full w-[800px] bg-white shadow-2xl z-40 flex flex-col transform transition-transform duration-300 border-l border-slate-200">
        <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-slate-50">
           <div>
              <div className="text-xs text-slate-500 mb-1 font-bold tracking-wider">动作配置 (ACTION CONFIGURATION)</div>
              <input 
                type="text" 
                defaultValue="CustomAction" 
                className="bg-transparent font-bold text-lg text-slate-900 outline-none border-b border-transparent focus:border-blue-500 transition-colors w-64"
                onChange={() => setDirty(true)}
              />
           </div>
           <div className="flex gap-2">
             <button className="p-2 hover:bg-slate-200 rounded text-slate-500"><MoreVertical size={18}/></button>
             <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded text-slate-500"><X size={18}/></button>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* Section 1: Parameters */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
             <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 font-medium text-sm flex justify-between text-slate-700">
                <span className="flex items-center gap-2"><TableIcon size={14}/> 参数定义 (Parameters)</span>
                <span className="text-xs bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-500">2 defined</span>
             </div>
             <div className="p-5 bg-white">
                <div className="space-y-2">
                   {['Reason (String)', 'IsUrgent (Boolean)'].map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-transparent hover:border-blue-200 group transition-all">
                         <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold">P{i+1}</div>
                            <span className="text-sm font-medium text-slate-700">{p}</span>
                         </div>
                         <div className="flex items-center gap-4">
                            <Settings size={14} className="text-slate-300 group-hover:text-blue-500 cursor-pointer"/>
                         </div>
                      </div>
                   ))}
                   <button className="w-full py-3 border border-dashed border-slate-300 rounded-lg text-xs font-medium text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                      <Plus size={14}/> 添加参数
                   </button>
                </div>
             </div>
          </div>

          {/* Section 2: Execution Logic */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm ring-1 ring-blue-500 ring-opacity-10">
             <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 font-medium text-sm flex justify-between items-center text-slate-700">
                <span className="flex items-center gap-2"><Zap size={14} className="text-amber-500"/> 执行逻辑 (Execution)</span>
                <button className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition-colors flex items-center gap-1" onClick={() => setShowLogicEditor(true)}>
                   <Plus size={12}/> 添加规则
                </button>
             </div>
             <div className="p-5 bg-white space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative group cursor-pointer hover:border-blue-300 hover:shadow-md transition-all" onClick={() => setShowLogicEditor(true)}>
                   <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded border border-blue-200">IF</span>
                      <span className="text-xs font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">IsUrgent == true</span>
                   </div>
                   <div className="flex items-center gap-3 pl-4 border-l-2 border-slate-300 ml-1">
                      <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                      <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200">THEN</span>
                      <span className="text-xs text-slate-600">设置 <b>Priority</b> = 'High'</span>
                   </div>
                   <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 text-slate-400 hover:text-blue-600">
                          <Settings size={14} />
                      </div>
                   </div>
                </div>
                
                {/* Visual Connector */}
                <div className="flex justify-center">
                   <div className="h-4 w-px bg-slate-200"></div>
                </div>

                <div className="p-4 bg-white border border-dashed border-slate-300 rounded-xl text-center text-xs text-slate-400">
                   流程结束 (End)
                </div>
             </div>
          </div>
        </div>

        <div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 z-50">
           <button onClick={onClose} className="px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">取消</button>
           <button onClick={() => {setDirty(false); onClose();}} className="px-5 py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md shadow-blue-200 font-medium transition-colors flex items-center gap-2">
              <Save size={16}/> 保存配置
           </button>
        </div>
      </div>
      
      {showLogicEditor && <LogicRuleEditor onClose={() => setShowLogicEditor(false)} onSave={() => {setShowLogicEditor(false); setDirty(true);}} />}
    </>
  );
};

// Main Component
export const ObjectCenter = () => {
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [activeFolderId, setActiveFolderId] = useState<string>('all');
  const [isNewObjectModalOpen, setNewObjectModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PROPS' | 'RELATIONSHIPS' | 'ACTIONS'>('PROPS');
  const [isActionDrawerOpen, setActionDrawerOpen] = useState(false);
  const [selectedRelId, setSelectedRelId] = useState<string | null>(null);

  // Folders Definition
  const folders = [
     { id: 'all', name: '全部实体 (All)', icon: LayoutGrid },
     { id: 'f1', name: 'CRM 核心', icon: Folder },
     { id: 'f2', name: '供应链 (SCM)', icon: Folder },
     { id: 'f3', name: '财务 (Finance)', icon: Folder },
     { id: 'f4', name: '人事行政 (HR)', icon: Folder },
     { id: 'f5', name: '客服支持 (Support)', icon: Folder },
     { id: 'f6', name: '市场营销 (Marketing)', icon: Folder },
  ];

  // Objects List
  const objects: BusinessObject[] = [
    { id: 'obj_001', name: '客户 (Customer)', code: 'Customer', dataset: 'DS_CRM_01', lastModifiedBy: 'Alice', status: ObjectStatus.ACTIVE, folderId: 'f1' },
    { id: 'obj_002', name: '订单 (Order)', code: 'Order', dataset: 'DS_SALES_MAIN', lastModifiedBy: 'Bob', status: ObjectStatus.ACTIVE, folderId: 'f1' },
    { id: 'obj_003', name: '产品 (Product)', code: 'Product', dataset: 'DS_PIM_02', lastModifiedBy: 'Charlie', status: ObjectStatus.ACTIVE, folderId: 'f2' },
    { id: 'obj_004', name: '供应商 (Supplier)', code: 'Supplier', dataset: 'DS_SRM_01', lastModifiedBy: 'Alice', status: ObjectStatus.ACTIVE, folderId: 'f2' },
    { id: 'obj_005', name: '发票 (Invoice)', code: 'Invoice', dataset: 'DS_FIN_03', lastModifiedBy: 'David', status: ObjectStatus.ACTIVE, folderId: 'f3' },
    { id: 'obj_006', name: '员工 (Employee)', code: 'Employee', dataset: 'DS_HR_01', lastModifiedBy: 'Eve', status: ObjectStatus.ACTIVE, folderId: 'f4' },
    { id: 'obj_007', name: '部门 (Department)', code: 'Department', dataset: 'DS_HR_02', lastModifiedBy: 'Eve', status: ObjectStatus.ACTIVE, folderId: 'f4' },
    { id: 'obj_008', name: '工单 (Ticket)', code: 'Ticket', dataset: 'DS_SUP_01', lastModifiedBy: 'Frank', status: ObjectStatus.DRAFT, folderId: 'f5' },
    { id: 'obj_009', name: '库存变动 (InventoryLog)', code: 'InventoryLog', dataset: 'DS_WMS_05', lastModifiedBy: 'Grace', status: ObjectStatus.ACTIVE, folderId: 'f2' },
    { id: 'obj_010', name: '营销活动 (Campaign)', code: 'Campaign', dataset: 'DS_MKT_01', lastModifiedBy: 'Heidi', status: ObjectStatus.DRAFT, folderId: 'f6' },
  ];

  // Filter objects based on selected folder
  const filteredObjects = activeFolderId === 'all' 
    ? objects 
    : objects.filter(o => o.folderId === activeFolderId);

  // --- Dynamic Mock Data Construction ---
  const objectDetailsMap: Record<string, MockDetailData> = {
    // 1. CUSTOMER
    'obj_001': {
        description: "核心客户实体，存储企业或个人客户的基础档案、联系方式及信用评级信息。是 CRM 系统的根实体。",
        stats: { apiCalls: '45.2k', relations: 12, activeRules: 8, health: '98%' },
        properties: [
            { name: 'id', type: 'String', required: true, unique: true, desc: '客户唯一标识 (UUID)' },
            { name: 'name', type: 'String', required: true, unique: false, desc: '客户全名或企业名称' },
            { name: 'tier', type: 'Enum', required: true, unique: false, desc: '客户等级 (VIP, Standard, Basic)' },
            { name: 'email', type: 'String', required: false, unique: true, desc: '主要联系邮箱' },
            { name: 'account_manager_id', type: 'Reference', required: false, unique: false, desc: '关联客户经理' },
            { name: 'created_at', type: 'DateTime', required: true, unique: false, desc: '注册时间' },
        ],
        relationships: [
            { id: 'rel_c1', target: '订单 (Order)', targetCode: 'Order', type: '一对多', field: 'customer_id', description: '一个客户可以下多个订单', cardinality: '1 : N', constraintName: 'FK_CUST_ORDER', onDelete: 'RESTRICT' },
            { id: 'rel_c2', target: '工单 (Ticket)', targetCode: 'Ticket', type: '一对多', field: 'customer_id', description: '客户发起的支持工单', cardinality: '1 : N', constraintName: 'FK_CUST_TICKET', onDelete: 'SET NULL' },
            { id: 'rel_c3', target: '细分 (Segment)', targetCode: 'Segment', type: '多对多', field: 'tags', description: '客户所属的市场细分群体', cardinality: 'N : N', constraintName: 'MTM_CUST_SEG', onDelete: 'CASCADE' },
        ],
        actions: [
            { id: 'act_c1', name: '更新信用评级', trigger: '自动 (Auto)', description: '基于年度消费更新 Tier', status: '活跃', lastMod: '1天前' },
            { id: 'act_c2', name: '发送营销邮件', trigger: '手动 (Manual)', description: '触发营销 EDM', status: '活跃', lastMod: '3天前' },
            { id: 'act_c3', name: '合并账户', trigger: '手动 (Manual)', description: '合并重复的客户档案', status: '未激活', lastMod: '1周前' },
        ]
    },
    // 2. ORDER
    'obj_002': {
        description: "销售交易记录，追踪从下单到履约的全生命周期。包含金额、状态及支付信息。",
        stats: { apiCalls: '128k', relations: 4, activeRules: 15, health: '99.9%' },
        properties: [
            { name: 'id', type: 'String', required: true, unique: true, desc: '订单号' },
            { name: 'customer_id', type: 'Reference', required: true, unique: false, desc: '下单客户' },
            { name: 'total_amount', type: 'Decimal', required: true, unique: false, desc: '订单总金额' },
            { name: 'status', type: 'Enum', required: true, unique: false, desc: '状态 (New, Paid, Shipped)' },
            { name: 'order_date', type: 'DateTime', required: true, unique: false, desc: '下单时间' },
        ],
        relationships: [
            { id: 'rel_o1', target: '客户 (Customer)', targetCode: 'Customer', type: '多对一', field: 'customer_id', description: '订单所属客户', cardinality: 'N : 1', constraintName: 'FK_ORDER_CUST', onDelete: 'RESTRICT' },
            { id: 'rel_o2', target: '发票 (Invoice)', targetCode: 'Invoice', type: '一对一', field: 'invoice_id', description: '关联的财务发票', cardinality: '1 : 1', constraintName: 'FK_ORDER_INV', onDelete: 'SET NULL' },
            { id: 'rel_o3', target: '订单项 (Item)', targetCode: 'OrderItem', type: '一对多', field: 'order_id', description: '订单包含的商品明细', cardinality: '1 : N', constraintName: 'FK_ORDER_ITEMS', onDelete: 'CASCADE' },
        ],
        actions: [
            { id: 'act_o1', name: '提交订单', trigger: '手动 (Manual)', description: '验证库存并创建订单', status: '活跃', lastMod: '2小时前' },
            { id: 'act_o2', name: '审批退款', trigger: '手动 (Manual)', description: '财务审核退款申请', status: '活跃', lastMod: '5小时前' },
            { id: 'act_o3', name: '自动发货', trigger: '自动 (Auto)', description: '支付成功后触发WMS指令', status: '活跃', lastMod: '1天前' },
            { id: 'act_o4', name: '计算税费', trigger: '自动 (Auto)', description: '根据地区计算 Tax', status: '活跃', lastMod: '1月前' },
        ]
    },
    // 3. PRODUCT
    'obj_003': {
        description: "商品主数据，管理 SKU、价格、库存水平及供应商关联。",
        stats: { apiCalls: '8.2k', relations: 6, activeRules: 3, health: '95%' },
        properties: [
            { name: 'id', type: 'String', required: true, unique: true, desc: '产品 ID' },
            { name: 'sku', type: 'String', required: true, unique: true, desc: '库存量单位编码' },
            { name: 'name', type: 'String', required: true, unique: false, desc: '产品名称' },
            { name: 'price', type: 'Decimal', required: true, unique: false, desc: '标准零售价' },
            { name: 'stock_level', type: 'Integer', required: true, unique: false, desc: '当前库存数量' },
            { name: 'supplier_id', type: 'Reference', required: false, unique: false, desc: '首选供应商' },
        ],
        relationships: [
            { id: 'rel_p1', target: '供应商 (Supplier)', targetCode: 'Supplier', type: '多对一', field: 'supplier_id', description: '供货商', cardinality: 'N : 1', constraintName: 'FK_PROD_SUP', onDelete: 'SET NULL' },
            { id: 'rel_p2', target: '类别 (Category)', targetCode: 'Category', type: '多对一', field: 'category_id', description: '产品分类', cardinality: 'N : 1', constraintName: 'FK_PROD_CAT', onDelete: 'RESTRICT' },
        ],
        actions: [
            { id: 'act_p1', name: '调整库存', trigger: '手动 (Manual)', description: '盘点后修正库存', status: '活跃', lastMod: '1周前' },
            { id: 'act_p2', name: '下架商品', trigger: '手动 (Manual)', description: '软删除产品', status: '活跃', lastMod: '3月前' },
        ]
    }
  };

  // Fallback for other objects
  const defaultDetail: MockDetailData = {
      description: "标准数据业务实体定义。",
      stats: { apiCalls: '-', relations: 0, activeRules: 0, health: '-' },
      properties: [
          { name: 'id', type: 'String', required: true, unique: true, desc: 'System ID' },
          { name: 'name', type: 'String', required: true, unique: false, desc: 'Name' },
          { name: 'created_at', type: 'DateTime', required: true, unique: false, desc: 'Creation Time' }
      ],
      relationships: [],
      actions: []
  };

  // Resolve current data
  const currentDetail = selectedObjectId && objectDetailsMap[selectedObjectId] ? objectDetailsMap[selectedObjectId] : defaultDetail;
  const currentRelList = currentDetail.relationships;
  const selectedRel = currentRelList.find(r => r.id === selectedRelId);

  // L3: Object Type List
  if (!selectedObjectId) {
    return (
      <div className="flex h-full">
        {/* Left Tree */}
        <div className="w-64 border-r border-slate-200 bg-slate-50 p-4 flex flex-col flex-shrink-0">
           <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">资源导航 (EXPLORER)</span>
              <button className="text-slate-400 hover:text-blue-600 transition-colors"><Plus size={16}/></button>
           </div>
           <div className="space-y-1 flex-1 overflow-y-auto">
              {folders.map(folder => {
                 const Icon = folder.icon;
                 const isActive = activeFolderId === folder.id;
                 return (
                    <div 
                     key={folder.id}
                     onClick={() => setActiveFolderId(folder.id)}
                     className={`flex items-center gap-2 text-sm font-medium py-2 px-3 rounded-lg cursor-pointer transition-colors ${
                        isActive 
                           ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                           : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                     }`}
                    >
                       <Icon size={16} className={isActive ? 'text-blue-500 fill-blue-100' : 'text-slate-400'} /> 
                       {folder.name}
                    </div>
                 )
              })}
           </div>
           <div className="mt-4 pt-4 border-t border-slate-200">
               <div className="text-xs text-slate-400 mb-2">存储空间</div>
               <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 w-[70%] h-full rounded-full"></div>
               </div>
               <div className="flex justify-between mt-1 text-[10px] text-slate-500">
                  <span>70% 已使用</span>
                  <span>1.4GB / 2GB</span>
               </div>
           </div>
        </div>

        {/* Right Table */}
        <div className="flex-1 flex flex-col bg-white">
           <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                 业务实体列表 <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{filteredObjects.length} 项</span>
              </h2>
              <button 
                  onClick={() => setNewObjectModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-sm shadow-blue-200"
               >
                 <Plus size={16} /> 新建实体类型
              </button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-6">
              {filteredObjects.length > 0 ? (
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          <th className="pb-3 pl-2 w-[30%]">名称 / 代号 (Code)</th>
                          <th className="pb-3 w-[20%]">数据集 (Dataset)</th>
                          <th className="pb-3 w-[15%]">状态</th>
                          <th className="pb-3 w-[20%]">最后修改</th>
                          <th className="pb-3 text-right w-[15%]">操作</th>
                       </tr>
                    </thead>
                    <tbody>
                       {filteredObjects.map(obj => (
                          <tr 
                            key={obj.id} 
                            className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer group transition-colors"
                            onClick={() => setSelectedObjectId(obj.id)}
                          >
                             <td className="py-4 pl-2">
                                <div className="flex items-center gap-3">
                                   <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                                      <Box size={18} />
                                   </div>
                                   <div>
                                      <div className="font-medium text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{obj.name}</div>
                                      <div className="text-xs text-slate-500 font-mono">{obj.code}</div>
                                   </div>
                                </div>
                             </td>
                             <td className="py-4 text-sm text-slate-600">
                                <div className="flex items-center gap-2">
                                   <GitCommit size={14} className="text-slate-400"/> 
                                   <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-mono">{obj.dataset}</span>
                                </div>
                             </td>
                             <td className="py-4">
                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${obj.status === ObjectStatus.ACTIVE ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                   {obj.status}
                                </span>
                             </td>
                             <td className="py-4 text-sm text-slate-500">
                                <div className="flex flex-col">
                                   <span>{obj.lastModifiedBy}</span>
                                   <span className="text-[10px] text-slate-400">2天前</span>
                                </div>
                             </td>
                             <td className="py-4 text-right">
                                <button className="p-2 hover:bg-slate-200 rounded-md text-slate-400 group-hover:text-slate-600 transition-colors">
                                   <MoreVertical size={16} />
                                </button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              ) : (
                 <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                    <div className="p-4 bg-slate-50 rounded-full mb-3">
                       <Folder size={32} className="text-slate-300"/>
                    </div>
                    <p className="text-sm font-medium">该目录下暂无业务实体</p>
                    <button onClick={() => setNewObjectModalOpen(true)} className="mt-2 text-xs text-blue-600 hover:underline">立即创建</button>
                 </div>
              )}
           </div>
        </div>

        {/* New Object Modal */}
        <NewObjectModal isOpen={isNewObjectModalOpen} onClose={() => setNewObjectModalOpen(false)} />
      </div>
    );
  }

  // L4: Object Type Editor Workbench
  const currentObj = objects.find(o => o.id === selectedObjectId);

  // Tab mapping for display
  const tabs = {
      OVERVIEW: '概览 (OVERVIEW)',
      PROPS: '属性 (PROPERTIES)',
      RELATIONSHIPS: '关系 (RELATIONSHIPS)',
      ACTIONS: '动作 (ACTIONS)'
  };

  return (
    <div className="flex flex-col h-full bg-white">
       {/* Workbench Header */}
       <div className="h-14 border-b border-slate-200 flex items-center justify-between px-6 bg-slate-50 flex-shrink-0">
          <div className="flex items-center gap-4">
             <button onClick={() => setSelectedObjectId(null)} className="p-1.5 hover:bg-slate-200 rounded text-slate-500 transition-colors">
                <X size={20} />
             </button>
             <div className="h-6 w-px bg-slate-300" />
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                   <Box size={18} />
                </div>
                <div>
                   <h1 className="font-bold text-slate-800 text-sm">{currentObj?.name}</h1>
                   <div className="text-[10px] text-slate-500 font-mono flex items-center gap-2">
                      {currentObj?.code} 
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      v2.4
                   </div>
                </div>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
                <GitGraph size={14}/> 探索血缘 (Monocle)
             </button>
             <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200 flex items-center gap-1">
               <AlertCircle size={12}/> 未保存的更改
             </span>
             <button className="bg-slate-900 text-white px-3 py-1.5 rounded text-sm font-medium flex items-center gap-2 hover:bg-slate-800 shadow-sm transition-colors">
                <Save size={14} /> 保存
             </button>
          </div>
       </div>

       {/* Tabs */}
       <div className="h-11 border-b border-slate-200 flex items-center px-6 bg-white space-x-1 flex-shrink-0">
          {(Object.keys(tabs) as Array<keyof typeof tabs>).map((tab) => (
             <button 
               key={tab}
               onClick={() => {
                   setActiveTab(tab);
                   setSelectedRelId(null); // Reset detail view on tab switch
               }}
               className={`h-full px-4 text-xs font-bold tracking-wide border-b-2 transition-all ${activeTab === tab ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
             >
                {tabs[tab]}
             </button>
          ))}
       </div>

       {/* Content Area */}
       <div className="flex-1 bg-slate-50/50 overflow-y-auto relative">
          
          {/* 1. OVERVIEW TAB */}
          {activeTab === 'OVERVIEW' && (
             <div className="p-8 max-w-5xl mx-auto space-y-6">
                <div className="grid grid-cols-3 gap-6">
                   <div className="col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><FileText size={16}/> 描述 (Description)</h3>
                      <textarea 
                        className="w-full h-24 text-sm text-slate-600 border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none bg-slate-50"
                        defaultValue={currentDetail.description}
                      />
                   </div>
                   <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><Database size={16}/> 元数据 (Metadata)</h3>
                      <div className="space-y-3">
                         <div className="flex justify-between text-sm">
                            <span className="text-slate-500">创建人</span>
                            <span className="font-medium text-slate-700">System Admin</span>
                         </div>
                         <div className="flex justify-between text-sm">
                            <span className="text-slate-500">数据集</span>
                            <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">{currentObj?.dataset}</span>
                         </div>
                         <div className="flex justify-between text-sm">
                            <span className="text-slate-500">记录总数</span>
                            <span className="font-medium text-slate-700">1,240,592</span>
                         </div>
                         <div className="flex justify-between text-sm">
                            <span className="text-slate-500">日均增长</span>
                            <span className="text-green-600 font-medium">+124</span>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                   <div className="px-6 py-4 border-b border-slate-100 font-medium text-sm text-slate-700">使用统计 (Usage Statistics)</div>
                   <div className="p-6 grid grid-cols-4 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                         <div className="text-xs text-blue-500 uppercase font-bold mb-1">API调用 (24h)</div>
                         <div className="text-2xl font-semibold text-blue-700">{currentDetail.stats.apiCalls}</div>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                         <div className="text-xs text-purple-500 uppercase font-bold mb-1">关联实体</div>
                         <div className="text-2xl font-semibold text-purple-700">{currentDetail.stats.relations}</div>
                      </div>
                      <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                         <div className="text-xs text-orange-500 uppercase font-bold mb-1">活跃规则</div>
                         <div className="text-2xl font-semibold text-orange-700">{currentDetail.stats.activeRules}</div>
                      </div>
                      <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                         <div className="text-xs text-emerald-500 uppercase font-bold mb-1">健康度</div>
                         <div className="text-2xl font-semibold text-emerald-700">{currentDetail.stats.health}</div>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {/* 2. PROPERTIES TAB */}
          {activeTab === 'PROPS' && (
             <div className="p-8 max-w-5xl mx-auto">
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                   <div className="grid grid-cols-12 gap-0 border-b border-slate-100 bg-slate-50/50 text-xs font-bold text-slate-500 uppercase tracking-wider py-3 px-4">
                      <div className="col-span-3">属性名 (Property Name)</div>
                      <div className="col-span-2">类型 (Type)</div>
                      <div className="col-span-1 text-center">必填</div>
                      <div className="col-span-1 text-center">唯一</div>
                      <div className="col-span-4">描述</div>
                      <div className="col-span-1 text-right">编辑</div>
                   </div>
                   {/* Rows */}
                   {currentDetail.properties.map((prop, i) => (
                     <div key={i} className="grid grid-cols-12 gap-0 border-b border-slate-100 py-3 px-4 items-center hover:bg-slate-50 transition-colors group">
                        <div className="col-span-3 flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-blue-500 transition-colors"></div>
                           <span className="text-sm text-slate-800 font-medium font-mono">{prop.name}</span>
                        </div>
                        <div className="col-span-2">
                           <span className={`text-xs font-mono px-2 py-1 rounded border ${
                              prop.type === 'String' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                              prop.type === 'DateTime' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                              prop.type === 'Boolean' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                              prop.type.includes('Reference') ? 'bg-pink-50 text-pink-700 border-pink-100' :
                              'bg-slate-100 text-slate-600 border-slate-200'
                           }`}>{prop.type}</span>
                        </div>
                        <div className="col-span-1 text-center">
                           {prop.required ? <CheckCircle2 size={14} className="mx-auto text-green-500"/> : <span className="text-slate-300">-</span>}
                        </div>
                        <div className="col-span-1 text-center">
                           {prop.unique ? <CheckCircle2 size={14} className="mx-auto text-blue-500"/> : <span className="text-slate-300">-</span>}
                        </div>
                        <div className="col-span-4 text-xs text-slate-500 truncate pr-4">
                           {prop.desc}
                        </div>
                        <div className="col-span-1 text-right">
                           <button className="text-slate-400 hover:text-blue-600 p-1 rounded hover:bg-slate-100 transition-colors"><Settings size={14}/></button>
                        </div>
                     </div>
                   ))}
                   <div className="py-3 px-4 bg-slate-50 border-t border-slate-100">
                      <button className="text-sm text-blue-600 hover:underline flex items-center gap-2 font-medium">
                        <Plus size={14}/> 添加新属性
                      </button>
                   </div>
                </div>
             </div>
          )}

          {/* 3. RELATIONSHIPS TAB */}
          {activeTab === 'RELATIONSHIPS' && (
             <div className="p-8 max-w-5xl mx-auto">
                {selectedRel ? (
                   /* Detail View (Drill Down) */
                   <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                       <div className="flex items-center gap-4 mb-6">
                           <button onClick={() => setSelectedRelId(null)} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 shadow-sm transition-all">
                               <ArrowLeft size={16} />
                           </button>
                           <div>
                               <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                  {currentObj?.name} <Link size={14} className="text-slate-400"/> {selectedRel.target}
                               </h2>
                               <div className="text-xs text-slate-500 font-mono mt-0.5">REL_ID: {selectedRel.id} • CONSTRAINT: {selectedRel.constraintName}</div>
                           </div>
                       </div>

                       <div className="grid grid-cols-3 gap-6">
                           {/* Left Column: Configuration */}
                           <div className="col-span-2 space-y-6">
                               <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                   <div className="px-6 py-4 border-b border-slate-100 font-medium text-sm text-slate-700 bg-slate-50/50">
                                       <span className="flex items-center gap-2"><Settings size={14}/> 核心定义 (Core Definition)</span>
                                   </div>
                                   <div className="p-6 space-y-6">
                                       <div className="grid grid-cols-2 gap-6">
                                           <div>
                                               <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase">关联类型 (Cardinality)</label>
                                               <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 font-medium text-slate-700 outline-none" defaultValue={selectedRel.cardinality}>
                                                   <option value="1 : N">一对多 (One-to-Many)</option>
                                                   <option value="N : 1">多对一 (Many-to-One)</option>
                                                   <option value="1 : 1">一对一 (One-to-One)</option>
                                                   <option value="N : N">多对多 (Many-to-Many)</option>
                                               </select>
                                           </div>
                                            <div>
                                               <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase">外键字段 (Foreign Key)</label>
                                               <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-slate-50">
                                                   <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                   <span className="text-sm font-mono text-slate-700">{selectedRel.field}</span>
                                               </div>
                                           </div>
                                       </div>
                                       <div>
                                            <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase">描述 (Description)</label>
                                            <textarea className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm h-20 resize-none outline-none focus:border-blue-500 transition-colors" defaultValue={selectedRel.description} />
                                       </div>
                                   </div>
                               </div>

                               <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                   <div className="px-6 py-4 border-b border-slate-100 font-medium text-sm text-slate-700 bg-slate-50/50">
                                       <span className="flex items-center gap-2"><ShieldCheck size={14}/> 参照完整性 (Referential Integrity)</span>
                                   </div>
                                   <div className="p-6">
                                        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                                                    <Trash2 size={16} />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-slate-800">删除策略 (On Delete)</div>
                                                    <div className="text-xs text-slate-500">当目标实体被删除时，源实体的行为</div>
                                                </div>
                                            </div>
                                            <select className="border border-slate-200 rounded px-2 py-1 text-sm bg-white text-slate-700 outline-none" defaultValue={selectedRel.onDelete}>
                                                <option value="RESTRICT">禁止删除 (Restrict)</option>
                                                <option value="CASCADE">级联删除 (Cascade)</option>
                                                <option value="SET NULL">置空 (Set Null)</option>
                                            </select>
                                        </div>
                                   </div>
                               </div>
                           </div>

                           {/* Right Column: Preview */}
                           <div className="col-span-1 space-y-6">
                               <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col items-center justify-center min-h-[200px]">
                                   <div className="flex items-center gap-4 w-full justify-center">
                                       <div className="w-20 h-20 bg-blue-50 border border-blue-200 rounded-xl flex flex-col items-center justify-center shadow-sm">
                                           <Box size={20} className="text-blue-500 mb-2"/>
                                           <span className="text-[10px] font-bold text-slate-600 text-center px-1 truncate w-full">{currentObj?.name}</span>
                                       </div>
                                       <div className="flex flex-col items-center gap-1">
                                            <div className="text-[10px] font-mono font-bold text-slate-400">{selectedRel.cardinality}</div>
                                            <div className="w-12 h-0.5 bg-slate-300 relative">
                                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                                            </div>
                                       </div>
                                       <div className="w-20 h-20 bg-purple-50 border border-purple-200 rounded-xl flex flex-col items-center justify-center shadow-sm">
                                           <Box size={20} className="text-purple-500 mb-2"/>
                                           <span className="text-[10px] font-bold text-slate-600 text-center px-1 truncate w-full">{selectedRel.target}</span>
                                       </div>
                                   </div>
                                   <div className="mt-6 w-full">
                                       <div className="text-xs font-bold text-slate-400 uppercase mb-2 text-center">数据预览 (Join Preview)</div>
                                       <div className="border border-slate-200 rounded-lg overflow-hidden text-[10px]">
                                           <div className="bg-slate-50 flex border-b border-slate-200 font-medium text-slate-600">
                                               <div className="flex-1 p-2 border-r border-slate-200 truncate">{currentObj?.code}</div>
                                               <div className="flex-1 p-2 truncate">{selectedRel.targetCode}</div>
                                           </div>
                                           <div className="bg-white flex border-b border-slate-100 text-slate-500">
                                               <div className="flex-1 p-2 border-r border-slate-100 truncate">Alice (ID:101)</div>
                                               <div className="flex-1 p-2 truncate">Ord_001 ($500)</div>
                                           </div>
                                           <div className="bg-white flex border-b border-slate-100 text-slate-500">
                                               <div className="flex-1 p-2 border-r border-slate-100 truncate">Alice (ID:101)</div>
                                               <div className="flex-1 p-2 truncate">Ord_002 ($120)</div>
                                           </div>
                                            <div className="bg-white flex text-slate-500">
                                               <div className="flex-1 p-2 border-r border-slate-100 truncate">Bob (ID:102)</div>
                                               <div className="flex-1 p-2 truncate">Ord_003 ($900)</div>
                                           </div>
                                       </div>
                                   </div>
                               </div>
                           </div>
                       </div>
                   </div>
                ) : (
                   /* List View */
                   <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mb-6">
                      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                         <h3 className="font-medium text-slate-700">实体关系图谱 (Relationship Map)</h3>
                         <button className="text-xs bg-white border border-slate-300 px-2 py-1 rounded hover:bg-slate-50 text-slate-600">可视化图表</button>
                      </div>
                      <div className="p-0">
                         {currentRelList.length > 0 ? currentRelList.map((rel, i) => (
                            <div 
                              key={rel.id} 
                              onClick={() => setSelectedRelId(rel.id)}
                              className="flex items-center p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group"
                           >
                               {/* Source */}
                               <div className="w-1/4 flex items-center gap-3 pl-2">
                                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                                     <Box size={16} />
                                   </div>
                                   <span className="text-sm font-bold text-slate-800">当前实体</span>
                               </div>
                               
                               {/* Connection */}
                               <div className="flex-1 flex flex-col items-center px-4">
                                  <div className="text-[10px] text-slate-400 font-mono mb-1 uppercase tracking-wider">{rel.type}</div>
                                  <div className="w-full flex items-center gap-2">
                                     <div className="h-px bg-slate-300 flex-1"></div>
                                     <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200 font-mono group-hover:border-blue-300 group-hover:bg-blue-50 transition-colors">{rel.cardinality}</span>
                                     <div className="h-px bg-slate-300 flex-1 relative">
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-l-4 border-l-slate-300 border-b-4 border-b-transparent"></div>
                                     </div>
                                  </div>
                                  <div className="text-[10px] text-slate-400 mt-1">通过 <span className="font-mono text-slate-600">{rel.field}</span> 关联</div>
                               </div>

                               {/* Target */}
                               <div className="w-1/4 flex items-center justify-end gap-3 pr-2">
                                  <div className="text-right">
                                     <div className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{rel.target}</div>
                                  </div>
                                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-100 transition-colors">
                                     <Share2 size={16} />
                                   </div>
                                   <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500"/>
                               </div>
                            </div>
                         )) : (
                             <div className="p-8 text-center text-slate-400 text-sm">暂无关联实体</div>
                         )}
                      </div>
                      <div className="p-4 bg-slate-50 flex justify-center">
                         <button className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-2">
                            <Plus size={14}/> 添加关联
                         </button>
                      </div>
                   </div>
                )}
             </div>
          )}

          {/* 4. ACTIONS TAB (Table Layout) */}
          {activeTab === 'ACTIONS' && (
             <div className="p-8 max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                   <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input type="text" placeholder="过滤动作..." className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 w-64"/>
                      </div>
                   </div>
                   <button onClick={() => setActionDrawerOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm flex items-center gap-2 transition-colors">
                      <Plus size={16} /> 新建动作
                   </button>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <th className="py-3 px-6 w-[25%]">动作名称 / ID</th>
                            <th className="py-3 px-4 w-[15%]">触发类型</th>
                            <th className="py-3 px-4 w-[35%]">描述</th>
                            <th className="py-3 px-4 w-[10%]">状态</th>
                            <th className="py-3 px-4 w-[15%] text-right">修改时间</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {currentDetail.actions.map((action, i) => (
                            <tr 
                              key={action.id} 
                              className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                              onClick={() => setActionDrawerOpen(true)}
                           >
                               <td className="py-3 px-6">
                                  <div className="flex items-center gap-3">
                                     <div className="p-2 bg-slate-100 text-slate-500 rounded-md group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                        <Play size={14} fill="currentColor" fillOpacity={0.2} />
                                     </div>
                                     <div>
                                        <div className="text-sm font-medium text-slate-800">{action.name}</div>
                                        <div className="text-[10px] font-mono text-slate-400">{action.id}</div>
                                     </div>
                                  </div>
                               </td>
                               <td className="py-3 px-4">
                                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border ${
                                     action.trigger.includes('Manual') 
                                        ? 'bg-white border-slate-200 text-slate-600' 
                                        : 'bg-purple-50 border-purple-100 text-purple-600'
                                  }`}>
                                     {action.trigger.includes('Manual') ? <MousePointer2Icon size={10}/> : <Zap size={10}/>}
                                     {action.trigger}
                                  </span>
                               </td>
                               <td className="py-3 px-4">
                                  <p className="text-sm text-slate-500 line-clamp-1">{action.description}</p>
                               </td>
                               <td className="py-3 px-4">
                                  <div className="flex items-center gap-1.5">
                                     <div className={`w-1.5 h-1.5 rounded-full ${action.status === '活跃' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                                     <span className={`text-xs ${action.status === '活跃' ? 'text-green-700' : 'text-slate-500'}`}>{action.status}</span>
                                  </div>
                               </td>
                               <td className="py-3 px-4 text-right">
                                  <div className="text-xs text-slate-400 group-hover:hidden">{action.lastMod}</div>
                                  <div className="hidden group-hover:flex justify-end gap-2">
                                     <button className="p-1 hover:bg-white hover:shadow-sm rounded text-blue-600"><Settings size={14}/></button>
                                  </div>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                   {currentDetail.actions.length === 0 && (
                       <div className="p-6 text-center text-slate-400 text-sm">暂无定义的动作</div>
                   )}
                   <div className="bg-slate-50 border-t border-slate-200 p-3 text-center text-xs text-slate-400">
                      显示 {currentDetail.actions.length} 条记录
                   </div>
                </div>
             </div>
          )}
       </div>

       {/* L5 Drawer */}
       <ActionDrawer isOpen={isActionDrawerOpen} onClose={() => setActionDrawerOpen(false)} />
    </div>
  );
};

// Helper Icon for table
const MousePointer2Icon = ({size}: {size:number}) => (
   <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19 7-7 3 3V2.5L2.5 13l3 3 7-7"/><path d="m12 19-9 2.5 2.5-9"/></svg>
)