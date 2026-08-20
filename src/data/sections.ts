import type { Section } from '../types';

export const SECTIONS: Section[] = [
  {
    id: 'life_planning',
    name: 'ライフプランニングと資金計画',
    icon: '📋',
    subsections: [
      { id: 'keisu', name: 'ライフプラン手法・各種係数' },
      { id: 'cf_bs', name: 'キャッシュフロー表・バランスシート' },
      { id: 'shakai_hoken', name: '社会保険（健康・雇用・介護）' },
      { id: 'nenkin', name: '公的年金（老齢・遺族・障害）' },
      { id: 'kigyo_ideco', name: '企業年金・iDeCo' },
      { id: 'housing', name: '住宅取得・住宅ローン' },
      { id: 'education', name: '教育資金・奨学金' },
      { id: 'corporation', name: '中小法人の資金計画' },
    ],
  },
  {
    id: 'risk_management',
    name: 'リスク管理',
    icon: '🛡️',
    subsections: [
      { id: 'insurance_base', name: '保険の基本・契約者保護' },
      { id: 'seiho_type', name: '生命保険の種類と特約' },
      { id: 'seiho_tax', name: '生命保険と税金' },
      { id: 'sonpo', name: '損害保険（火災・自動車・賠償）' },
      { id: 'third_sector', name: '第三分野の保険（医療・がん）' },
    ],
  },
  {
    id: 'financial_assets',
    name: '金融資産運用',
    icon: '📈',
    subsections: [
      { id: 'economy', name: '経済指標・市場動向' },
      { id: 'bond_deposit', name: '預貯金・債券投資' },
      { id: 'stocks', name: '株式投資・指標（PER/PBR等）' },
      { id: 'mutual_funds', name: '投資信託' },
      { id: 'nisa_tax', name: 'NISA・金融商品と税金' },
    ],
  },
  {
    id: 'tax_planning',
    name: 'タックスプランニング',
    icon: '🧾',
    subsections: [
      { id: 'shotoku_base', name: '所得税の仕組み・分類' },
      { id: 'shotoku_calc', name: '各種所得の計算（給与・不動産等）' },
      { id: 'tax_deduction', name: '所得控除（医療費・配偶者等）' },
      { id: 'tax_credit', name: '税額控除（住宅ローン控除等）' },
      { id: 'tax_return', name: '確定申告と納付' },
    ],
  },
  {
    id: 'real_estate',
    name: '不動産',
    icon: '🏠',
    subsections: [
      { id: 're_trade', name: '不動産取引・価格指標' },
      { id: 'shakuchi_shakuya', name: '借地借家法' },
      { id: 'kenchiku_toshi', name: '建築基準法・都市計画法' },
      { id: 're_tax', name: '不動産の取得・保有・譲渡の税金' },
      { id: 're_utilization', name: '不動産の有効活用' },
    ],
  },
  {
    id: 'inheritance',
    name: '相続・事業承継',
    icon: '🎁',
    subsections: [
      { id: 'gift_tax', name: '贈与と贈与税（暦年・精算課税）' },
      { id: 'sozoku_nin', name: '相続人と法定相続分' },
      { id: 'igon_iryubu', name: '遺言と遺留分' },
      { id: 'sozoku_tax', name: '相続税の計算・申告' },
      { id: 'property_eval', name: '財産評価・特例（小規模宅地等）' },
    ],
  },
];
