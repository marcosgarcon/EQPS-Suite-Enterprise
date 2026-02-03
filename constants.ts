
import { Database, BusinessUnit, Department, Model, MeasurementPoint, FITPStep, Course, PlantNode } from './types';

export const COLORS = {
  accent: '#38bdf8',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  text: '#f8fafc',
  muted: '#94a3b8',
  bg: '#020617',
  card: '#0f172a',
  border: '#1e293b',
  panasonic: '#004098'
};

export const LOCATION = "Planta de Extrema";

export const BUSINESS_UNITS: BusinessUnit[] = [
  'WM-Lavadoras', 
  'RF-Refrigerador', 
  'Qualidade', 
  'Manutenção', 
  'Injetoras', 
  'Estamparia'
];

export const DEPARTMENTS: Department[] = [
  'Produção', 
  'Qualidade', 
  'Engenharia', 
  'Estoque', 
  'Máquinas', 
  'Histórico', 
  'Checklist'
];

export const MODELS: Model[] = ['W640', 'W600', 'NEW_LVCA', 'B41', 'B42', 'B43', 'GERAL'];

export const INITIAL_STRUCTURE: PlantNode[] = BUSINESS_UNITS.map(bu => ({
  id: bu,
  name: bu,
  type: 'BU',
  children: [
    {
      id: `${bu}-Prod`,
      name: 'Produção',
      type: 'DEPT',
      children: MODELS.filter(m => bu === 'Manutenção' ? m === 'GERAL' : true).map(m => ({
        id: `${bu}-Prod-${m}`,
        name: m,
        type: 'MODEL',
        children: [
          { id: `${bu}-${m}-FITP`, name: 'FITP', type: 'DOC' },
          { id: `${bu}-${m}-Check`, name: 'Checklist', type: 'DOC' }
        ]
      }))
    },
    {
      id: `${bu}-Maint`,
      name: 'Manutenção',
      type: 'DEPT',
      children: [
        { id: `${bu}-Maint-Stock`, name: 'Estoque', type: 'DOC' },
        { id: `${bu}-Maint-Machines`, name: 'Máquinas', type: 'DOC' },
        { id: `${bu}-Maint-Hist`, name: 'Histórico', type: 'DOC' }
      ]
    }
  ]
}));

export const INITIAL_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Gestão Integrada da Qualidade',
    category: 'Qualidade',
    description: 'Fundamentos essenciais, 5S e tratativa de não conformidades para a Planta de Extrema.',
    totalDuration: '24h',
    modules: [
      {
        id: 1,
        title: "Fundamentos da Qualidade",
        duration: "4 Horas",
        content: [
            { title: "1.1 Conceito Histórico", text: "A qualidade evoluiu da simples 'Inspeção' para a 'Gestão da Qualidade Total'. Hoje, na Indústria 4.0, a qualidade é preditiva." },
            { title: "1.2 O Cliente é o Rei", text: "Atender ou exceder as expectativas do cliente inclui Preço, Prazo e Conformidade." },
            { title: "1.3 Custo da Não-Qualidade", text: "Regra 1-10-100: Corrigir no projeto custa 1. Na linha custa 10. No cliente custa 100." }
        ],
        questions: [
            { q: "Qual a definição moderna de qualidade?", options: ["Ser o produto mais caro", "Atender aos requisitos do cliente", "Não ter defeitos visíveis", "Usar materiais importados"], a: 1 },
            { q: "Na regra 1-10-100, onde o custo é maior?", options: ["No projeto", "Na fábrica", "No cliente", "No fornecedor"], a: 2 },
            { q: "Quem criou o ciclo PDCA?", options: ["Ford", "Deming", "Elon Musk", "Toyota"], a: 1 }
        ]
      }
    ]
  }
];

export const MOCK_MEASUREMENTS: Record<string, MeasurementPoint[]> = {
  'W640': [
    { 
      id: 'P1', 
      label: 'Diâmetro Interno Cesto', 
      nominal: 450.5, 
      tolerancePlus: 0.5, 
      toleranceMinus: 0.5, 
      status: 'PENDENTE', 
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
      instruction: 'Medir com paquímetro digital de 600mm na face superior do cesto.'
    }
  ]
};

export const MOCK_FITP: Record<string, FITPStep[]> = {
  'W640': [
    {
      id: 'F1',
      step: 1,
      description: 'Montagem do Conjunto Cesto/Tanque',
      image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=800',
      critical: true,
      points: ['P1']
    }
  ]
};

export const INITIAL_DB: Database = {
  kpis: {
    ACA: { key: 'ACA', name: 'ACA (Acidentes c/ Afastamento)', category: 'Segurança', target: 0, comparator: '=', unit: 'nº' },
    ASA: { key: 'ASA', name: 'ASA (Acidentes s/ Afastamento)', category: 'Segurança', target: 4, comparator: '<', unit: 'nº' },
    FPY: { key: 'FPY', name: 'First Pass Yield (FPY)', category: 'Qualidade', target: 97, comparator: '>=', unit: '%' },
    OEE: { key: 'OEE', name: 'OEE (Eficiência Global)', category: 'Produtividade e Eficiência', target: 85, comparator: '>=', unit: '%' }
  },
  records: {
    OEE: [{ id: 1, date: '2024-05-15', value: 82, reason: 'Setup de máquina estendido' }]
  },
  plans: {},
  structure: INITIAL_STRUCTURE,
  modelAssets: {}
};
