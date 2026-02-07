
export enum ViewState {
  PORTAL = 'PORTAL',
  OBJECT_CENTER = 'OBJECT_CENTER',
  APP_BUILDER = 'APP_BUILDER',
  DATA_INTEGRATION = 'DATA_INTEGRATION',
  DATA_PIPELINE = 'DATA_PIPELINE',
  ANALYTICS = 'ANALYTICS',
  ADMIN = 'ADMIN',
  LINEAGE = 'LINEAGE',
  QUIVER = 'QUIVER',
  MARKETPLACE = 'MARKETPLACE',
  ANNUAL_PLAN = 'ANNUAL_PLAN'
}

export enum ObjectStatus {
  ACTIVE = '活跃',
  DRAFT = '草稿'
}

export interface BusinessObject {
  id: string;
  name: string;
  code: string;
  dataset: string;
  lastModifiedBy: string;
  status: ObjectStatus;
  folderId?: string;
}

export interface AppDefinition {
  id: string;
  name: string;
  urlSuffix: string;
  thumbnail: string;
}

export interface LogicRule {
  id: string;
  parameter: string;
  operator: string;
  value: string;
  targetObject: string;
  targetProperty: string;
  targetValue: string;
}

export interface Variable {
  id: string;
  name: string;
  type: 'OBJECT_SET' | 'AGGREGATION' | 'STRING' | 'NUMBER';
  source?: string;
}
