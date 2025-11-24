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
 ├─ components/          # Componentes reutilizáveis (Header, MusicPlayer, RSVPForm, etc.)
 ├─ pages/               # Páginas da aplicação (Splash, Home, RSVP, AdminDashboard)
 ├─ lib/                 # Configuração Firebase (firebase.js)
 ├─ utils/               # Funções auxiliares (guestUtils.js)
 └─ main.jsx, index.html
public/
 └─ music/someday.mp3   # Música de fundo (deve existir)
```

## Configuração e Execução Local

1. **Instalar dependências**

```bash
npm install
```

2. **Variáveis de ambiente** (criar `.env.local` na raiz):

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

3. **Rodar em modo desenvolvimento**

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

## Deploy

- **Netlify**: o comando de build configurado é `npm run build`. O diretório de publicação é `dist`.
- **Cache & CSP**: configurado em `netlify.toml` (assets imutáveis, CSP inclui `firestore.googleapis.com`).
- **Chunk Splitting**: configurado em `vite.config.js` para separar `vendor` e `firebase`.

## Principais Componentes

| Componente | Função |
|------------|--------|
| `Header.jsx` | Navbar responsiva com animações (`motion`, `AnimatePresence`). |
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
