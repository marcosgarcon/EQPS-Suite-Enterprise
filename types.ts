
export type KpiCategory = 'Segurança' | 'Qualidade' | 'Produtividade e Eficiência';

export interface KPI {
  key: string;
  name: string;
  category: KpiCategory;
  target: number;
  comparator: '>=' | '<=' | '>' | '<' | '=';
  unit: string;
}

export interface KPIRecord {
  id: number;
  date: string;
  value: number;
  reason?: string;
}

export interface ActionPlan {
  id: number;
  title: string;
  status: 'Aberto' | 'Em Andamento' | 'Concluído';
  responsible: string;
  date: string;
}

export interface IndustrialAsset {
  id: string;
  name: string;
  type: DocumentType;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  content?: string; // Base64 ou texto refatorado
}

export interface PlantNode {
  id: string;
  name: string;
  type: 'BU' | 'DEPT' | 'MODEL' | 'DOC';
  children?: PlantNode[];
  icon?: string;
  assets?: IndustrialAsset[];
}

export interface Database {
  kpis: Record<string, KPI>;
  records: Record<string, KPIRecord[]>;
  plans: Record<string, ActionPlan[]>;
  structure: PlantNode[];
  modelAssets: Record<string, IndustrialAsset[]>; // Novo repositório central por modelo
}

export type ViewState = 'dashboard' | 'kpi-detail' | 'settings' | 'tv-monitor' | 'quality-tools' | 'user-mgmt' | 'business-mgmt' | 'asset-adjuster' | 'help' | 'operator-terminal' | 'training-academy' | 'projects-mgmt';

export interface MeasurementPoint {
  id: string;
  label: string;
  nominal: number;
  tolerancePlus: number;
  toleranceMinus: number;
  measured?: number;
  status?: 'PENDENTE' | 'APROVADO' | 'REPROVADO';
  imageUrl?: string;
  instruction?: string;
}

export interface FITPStep {
  id: string;
  step: number;
  description: string;
  image: string;
  critical: boolean;
  points: string[]; 
}

export interface IshikawaData {
  method: string[];
  machine: string[];
  material: string[];
  measurement: string[];
  manpower: string[];
  milieu: string[];
  effect: string;
}

export interface TrainingModule {
  id: number;
  title: string;
  duration: string;
  content: { title: string; text: string }[];
  questions: { q: string; options: string[]; a: number }[];
}

export interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  totalDuration: string;
  modules: TrainingModule[];
  icon?: string;
}

export interface ProjectTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Project {
  id: string;
  title: string;
  category: 'Plano de Ação' | 'Padronização' | 'Lean Six Sigma' | 'Monitoramento' | 'Análise de Falha' | 'Kaizen/5S' | 'Comitê' | 'Treinamento';
  description: string;
  responsible: string;
  status: 'Planejamento' | 'Em Execução' | 'Monitoramento' | 'Concluído';
  progress: number;
  startDate: string;
  endDate: string;
  image?: string;
  tasks: ProjectTask[];
  instructions?: string;
}

export interface CustomTool {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  createdAt: string;
  mapping?: {
    business: string;
    department: string;
    model: string;
    docType: string;
  };
}

export interface CustomModule {
  id: string;
  name: string;
  tools: CustomTool[];
}

export type Model = string;
export type BusinessUnit = string;
export type Department = string;
export type DocumentType = 'Desenhos' | 'FIT' | 'Cartas de Controle' | 'Peças' | 'Extracts' | 'FITP' | 'Estoque' | 'Máquinas' | 'Histórico' | 'Checklist';

export interface NavigationState {
  business: BusinessUnit | null;
  department: Department | null;
  model: Model | null;
  docType: DocumentType | null;
}

export interface TelemetryEvent {
  id: string;
  timestamp: string;
  type: 'AI_SEARCH' | 'NAV' | 'ERROR' | 'SYNC' | 'USER';
  message: string;
  details?: string;
}

export interface EQPSUser {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Master' | 'Viewer' | 'Operator';
  avatar?: string;
}
