# Projeto Convite de Casamento

## Visão Geral

Este é um site interativo de convite de casamento desenvolvido com **React** e **Vite**, hospedado no **Netlify** e integrado ao **Firebase** (Firestore, Auth, Storage). Ele oferece:

- Tela de boas‑vindas com animações e música de fundo.
- Navegação responsiva (desktop e mobile) usando **framer‑motion**.
- Formulário de RSVP que grava respostas no Firestore.
- Dashboard administrativo para visualização e gerenciamento de convidados.
- Geração de convite em PNG/PDF e botão para adicionar ao Google Calendar.

## Tecnologias Principais

- **Frontend**: React, Vite, JavaScript, HTML, CSS (vanilla).
- **Animações**: framer‑motion.
- **Backend / Serviços**: Firebase (Firestore, Auth, Storage).
- **Hospedagem**: Netlify (CI/CD, CSP, cache).
- **Utilitários**: html2canvas, jspdf, lucide‑react.

## Estrutura de Pastas

```text
src/
 ├─ components/       # 💍 Sistema de Convite de Casamento - Binth & Jubílio

Sistema completo de convite digital profissional com RSVP, galeria, photo booth e dashboard administrativo.

[![Status](https://img.shields.io/badge/status-production-success)](https://binthjubilio.netlify.app)
[![Performance](https://img.shields.io/badge/performance-optimized-brightgreen)]()
[![Security](https://img.shields.io/badge/security-hardened-blue)]()

## 🚀 Tecnologias

**Frontend**:
- React 18 + Vite 7
- TailwindCSS + Custom CSS
- Framer Motion
- React Router v6
- React Hot Toast

**Backend & Services**:
- Firebase (Firestore, Auth, Storage)
- Netlify (Hosting + Functions)

**Utilities**:
- DOMPurify (XSS protection)
- html2canvas, jspdf
- Lucide React (icons)

## ✨ Funcionalidades

### Core Features
- ✅ Sistema de RSVP com validação de convidados
- ✅ Admin Dashboard com estatísticas em tempo real
- ✅ Galeria de fotos do casal
- ✅ Mural de mensagens
- ✅ Gerenciamento de mesas e assentos
- ✅ Download de convite personalizado (PNG/PDF)
- ✅ Player de música de fundo
- ✅ Contagem regressiva animada

### UX Enhancements
- ✅ Loading skeletons contextuais (5 tipos)
- ✅ Empty states elegantes
- ✅ Micro-interações (11 animações)
- ✅ Error boundaries
- ✅ Toast notifications
- ✅ Visual polish (20+ utilidades)

### Performance
- ✅ Lazy loading de imagens
- ✅ Code splitting (vendor, firebase)
- ✅ Asset compression (gzip + brotli)
- ✅ Font preloading
- ✅ Route-based splitting

### Security
- ✅ Source maps desabilitados
- ✅ Firestore rules hardened
- ✅ DOMPurify sanitization
- ✅ CSP headers
- ✅ HSTS enabled

## 📦 Instalação

```bash
# Clone o repositório
git clone <repo-url>

# Instale dependências
npm install
```

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie `.env.local`:

```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_dominio
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

### 2. Netlify Environment

Configure as mesmas variáveis em:
`Site settings → Environment variables`

### 3. Firebase Setup

1. Crie projeto no Firebase Console
2. Ative Firestore, Authentication, Storage
3. Deploy das rules: `firebase deploy --only firestore:rules`

## 🏃 Desenvolvimento

```bash
# Iniciar servidor dev
npm run dev

# Build para produção
npm run build

# Preview build
npm run preview
```

Acesse: `http://localhost:5173`

## 📋 Estrutura do Projeto

```
src/
├── assets/              # Imagens e mídia
├── components/          # Componentes reutilizáveis
│   ├── EmptyState.jsx
│   ├── ErrorBoundary.jsx
│   └── LoadingSkeleton.jsx (5 tipos)
├── data/               # Dados (guestList.json)
├── lib/                # Config (firebase.js)
├── pages/              # Páginas/rotas
├── styles/             # CSS customizado
│   ├── animations.css      # 11 micro-interações
│   └── visual-polish.css   # 20+ utilidades visuais
└── utils/              # Funções helper
```

## 🎨 CSS Utilities

### Animations (`animations.css`)
- `animate-pulse-scale`, `animate-heart-beat`
- `btn-ripple`, `hover-lift`, `hover-scale`
- `glow-gold`, `animate-shimmer`

### Visual Polish (`visual-polish.css`) 
- Gradients: `gradient-hero`, `gradient-text-gold`
- Shadows: `shadow-soft` → `shadow-gold-strong`
- Effects: `glass`, `card-premium`, `divider-gold`

**Ver**: `guia_ux_improvements.md` para referência completa

## 🔐 Segurança

- ✅ Source maps OFF em produção
- ✅ Admin-only routes (email validation)
- ✅ XSS protection (DOMPurify)
- ✅ CSP headers (no unsafe-eval)
- ✅ HSTS with preload

## 📱 Responsividade

- 📱 Mobile: 320px+
- 📱 Tablet: 768px+
- 💻 Desktop: 1024px+
- 🖥️ Large: 1280px+

## 📊 Performance Metrics

- Bundle size: ~30-40% reduzido (compressão)
- LCP: Melhorado (lazy + preload)
- FCP: Otimizado (code splitting)

## 📚 Documentação

- `README.md` - Este arquivo
- `CHANGELOG.md` - Histórico de mudanças
- `guia_ux_improvements.md` - Guia de utilidades CSS
- `code_audit_report.md` - Relatório de auditoria

## 🚀 Deploy

### Netlify (Produção)

1. Conecte repositório ao Netlify
2. Configure environment variables
3. Deploy automático no push para `main`

### Manual

```bash
npm run build
netlify deploy --prod
```

## 🤝 Manutenção

**Admin Dashboard**: `/gestao-casamento-2026`

- Gerenciar RSVPs
- Visualizar estatísticas
- Organizar mesas
- Exportar dados

## 📄 Licença

Projeto privado - Casamento Binth & Jubílio 2026

---

**Desenvolvido com** ❤️ **para Binth & Jubílio**

**Status**: ✅ Em Produção | **URL**: https://binthjubilio.netlify.appesence`). |
| `MusicPlayer.jsx` | Botão flutuante para tocar/pausar música, persiste estado via `localStorage`. |
| `Splash.jsx` | Tela inicial com botão que inicia a música. |
| `RSVPForm.jsx` | Formulário de confirmação, validação e gravação no Firestore. |
| `InvitationCard.jsx` | Renderiza convite e permite download PNG/PDF. |
| `AdminDashboard.jsx` | Área administrativa (visualização em tempo real, importação de lista, estatísticas). |
| `firebase.js` | Inicializa Firebase a partir das variáveis de ambiente. |

## Firebase

- **Firestore**: coleção `rsvps` para respostas de convidados.
- **Auth**: login de administradores via email/senha.
- **Storage**: (opcional) para arquivos de mídia.
- **firestore.indexes.json**: agora contém JSON válido (`{"indexes": [], "fieldOverrides": []}`).

## Netlify

- **CSP** inclui `https://firestore.googleapis.com`.
- **Headers de cache**: assets (`max-age=31536000, immutable`), `index.html` (`must-revalidate`).
- **Redirects**: SPA fallback (`/*  /index.html  200`).

## Testes e Qualidade

- **Lint**: ESLint configurado; comentários desnecessários removidos.
- **Sugestão**: adicionar testes unitários com Jest + React Testing Library para `RSVPForm`, `MusicPlayer` e `AdminDashboard`.

## Como Contribuir

1. Fork o repositório.
2. Crie uma branch `feature/SEU-NOME`.
3. Rode `npm test` (quando houver testes) e `npm run lint`.
4. Abra um Pull Request descrevendo a mudança.

---
*Este documento foi gerado automaticamente por Antigravity.*
