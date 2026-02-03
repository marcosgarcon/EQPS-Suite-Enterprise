# EQPS Suite - Enterprise Quality & Production System 5.0 🚀

![Status](https://img.shields.io/badge/Status-Production--Ready-emerald?style=for-the-badge)
![Tech](https://img.shields.io/badge/Stack-React%2019%20%2B%20Gemini%20IA-sky?style=for-the-badge)
![Deployment](https://img.shields.io/badge/Deployment-PWA%20%2F%20GitHub%20Pages-indigo?style=for-the-badge)

## 🏭 Visão Geral

O **EQPS Suite** é uma plataforma industrial "All-in-One" desenvolvida para a **Planta de Extrema**, focada na digitalização completa da operação (Indústria 5.0). O sistema integra monitoramento de KPIs em tempo real, gestão de documentos de engenharia, treinamento corporativo assistido por IA e um laboratório de refatoração de ativos legados.

---

## 🛠 Módulos Principais

### 🧠 1. Laboratório de Ativos IA (Multimodal)
Transforme arquivos brutos (HTML, Python, JPG, DOC, COM) em componentes interativos nativos do sistema.
- **Refatoração Inteligente**: Utiliza o motor **Google Gemini 3 Flash** para converter lógica legada em interfaces Tailwind modernas.
- **Multimodalidade**: Analise fotos de peças ou cartas de controle para extração automática de dados.

### 📊 2. Dashboard de KPIs & Telemetria
Monitoramento crítico de indicadores (OEE, FPY, Segurança).
- **Veredito em Tempo Real**: Validação automática de conformidade.
- **Telemetry Engine**: Busca semântica por voz/texto em todo o histórico de eventos da planta.

### 📚 3. Academia Corporativa
Sistema de gestão de aprendizagem (LMS) dinâmico.
- **Gerador Autônomo**: Carregue um PDF técnico e a IA estruturará um curso completo com módulos, teoria e exames de proficiência.
- **Certificação Industrial**: Emissão automática de certificados após atingimento de nota de corte.

### 🗄️ 4. Industrial Data Hub
O "Single Source of Truth" para a engenharia.
- Repositório centralizado de FITP, Desenhos CAD, e Cartas de Controle.
- Estrutura hierárquica dinâmica (BU > Departamento > Modelo).

---

## 🚀 Tecnologias Utilizadas

- **Frontend**: [React 19](https://react.dev/) (Hooks, Context, Concurrent Mode)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/) (Design System Dark Mode Industrial)
- **Inteligência Artificial**: [Google Gemini API](https://ai.google.dev/) (Modelos Flash e Pro)
- **Gráficos**: [Recharts](https://recharts.org/) (Telemetria visual e Histórico de KPIs)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **PWA**: Suporte Offline via Service Workers e Manifesto de Aplicativo.

---

## 🔧 Instalação e Execução

### Pré-requisitos
- Node.js instalado
- Uma chave de API do [Google AI Studio](https://aistudio.google.com/)

### Passos
1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/eqps-suite.git
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure sua chave de API no ambiente:
   ```bash
   export API_KEY='sua_chave_aqui'
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```

---

## 📱 Funcionalidade PWA (Versão Desktop)

O EQPS Suite foi projetado para rodar como um aplicativo nativo no Windows/Linux/macOS:
1. Abra o sistema no Chrome ou Edge.
2. Clique no ícone de **Instalar** na barra de endereços.
3. O sistema funcionará como um executável independente, com cache offline para consulta de documentos.

---

## ⚖️ Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

---
**Desenvolvido para Panasonic Industrial - Unidade Extrema.**  
*Mantendo a excelência através da inovação digital.*