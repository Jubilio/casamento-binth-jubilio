# Projeto Convite de Casamento 🥂

## Visão Geral

Este é um site interativo e solene de convite de casamento, desenvolvido para proporcionar uma experiência emocionante e organizada aos convidados. O sistema integra **React**, **Vite**, **Framer Motion** e **Supabase**.

## ✨ Novas Funcionalidades (Recentes)

### 🎬 Experiência de Entrada

- **Splash Screen Inteligente**: Transição automática de 5 segundos para links diretos (RSVP).
- **Homenagem Familiar**: Bloco dedicado com os nomes dos pais dos noivos com tipografia elegante.
- **Autoplay de Música**: O sistema tenta iniciar a trilha sonora automaticamente após o primeiro clique do usuário.

### 📊 Painel Administrativo Pro

- **Gestão de Mesas**: Atribuição dinâmica de convidados confirmados às respectivas mesas (Labels).
- **Mapa de Assentos**: Visualização gráfica 2D da disposição dos convidados em cada mesa (10 lugares por mesa).
- **Interface Segura**: Substituição de alertas nativos por modais de confirmação elegantes e notificações `toast`.

---

## 🚀 Funcionalidades Principais

- **RSVP Inteligente**: Validação em tempo real contra lista de convidados permitidos.
- **Tickets Personalizados**: Geração de convites em PNG e PDF com QR Code/Mesa.
- **Mural de Mensagens**: Mural interativo para os convidados deixarem votos.
- **Galeria e Contagem**: Exposição de fotos do casal e contagem regressiva para o grande dia.

## 🛠️ Tecnologias e Segurança

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion.
- **Backend**: Supabase (PostgreSQL, Auth, RLS).
- **Utilitários**: html2canvas, jspdf, react-hot-toast.
- **Segurança**: Row Level Security (RLS) habilitado, Content Security Policy (CSP), Higienização de entradas.

## 📦 Instalação e Uso

```bash
# Instalar dependências
npm install

# Servidor de desenvolvimento
npm run dev

# Dashboard Admin
Acesse: /gestao-casamento-2026
```

## 📋 Variáveis de Ambiente (.env)

```env
VITE_SUPABASE_URL=seu_url
VITE_SUPABASE_ANON_KEY=sua_key
```

---
**Desenvolvido com ❤️ para Binth & Jubílio — 07.03.2026**
