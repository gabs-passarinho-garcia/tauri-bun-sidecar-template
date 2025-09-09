# 🛡️ Tauri Bun Sidecar Template 🚀

[![Licença: GPL v3](https://img.shields.io/badge/Código-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Status do Build](https://img.shields.io/github/actions/workflow/status/gabs-passarinho-garcia/tauri-bun-sidecar-template/release.yml?branch=main)](https://github.com/gabs-passarinho-garcia/tauri-bun-sidecar-template/actions)

Bem-vindo, nobre aventureiro do código!

Você encontrou um "boilerplate" (um ponto de partida) forjado para uma missão sagrada: construir aplicações desktop que sejam, ao mesmo tempo, **absurdamente performáticas, ridiculamente seguras e divinamente agradáveis de se desenvolver.**

Cansado do caos de aplicações pesadas, lentas e inseguras? Este template é a sua fundação, a sua Rocha Firme, um manifesto que prova que é possível trazer Ordem, Segurança e Performance para o ecossistema desktop, usando as ferramentas mais abençoadas que o Criador nos deu (via comunidade Open Source, claro 😉).

---

### ⚔️ A Guilda de Heróis (A Nossa Stack)

Nenhum aventureiro vai para a masmorra sozinho. Nossa guilda é composta pelos melhores especialistas de cada classe, trabalhando em perfeita harmonia:

* **Tauri (O Paladino de Rust):** O líder do grupo. Veste uma armadura nativa, leve e impenetrável. Garante a segurança da missão e é a ponte entre o nosso mundo e o sistema operacional. Sua aura sagrada resulta em apps minúsculos e eficientes.
* **Bun & Elysia (O Ranger Veloz):** O batedor ágil que atua nas sombras (como um sidecar). É incrivelmente rápido, preciso e letal. Lida com toda a lógica de negócio e o trabalho pesado sem nunca atrasar o grupo.
* **React & Vite (O Mago Conjurador):** O mestre das artes arcanas da interface. Conjura experiências de usuário belas e reativas a partir de componentes, com um `dev server` que parece ter a velocidade da luz.
* **Prisma & SQLCipher (O Clérigo Guardião):** O protetor dos segredos sagrados (os dados). Mantém o grimório do banco de dados criptografado (SQLCipher) e se comunica com ele através de orações seguras e tipadas (Prisma).
* **TypeScript & Eden Treaty (O Mago Escriba):** O erudito que garante que todos na guilda falem a mesma língua. O **Pacto do Eden** é um feitiço poderoso que cria uma ponte telepática e 100% type-safe between o Mago (Frontend) e o Ranger (Backend).

---

### ✨ O Grimório de Feitiços (Features Principais)

* **Arquitetura Híbrida de Dois Reinos:** A força do Rust e a velocidade do TypeScript trabalhando juntos em um padrão de sidecar robusto.
* **Segurança Nível Fort Knox:** Múltiplas camadas de defesa, desde a criptografia do banco de dados até chaves de API dinâmicas para a comunicação entre os processos.
* **Estrutura de Monorepo Organizada:** Uma cidadela bem planejada com `workspaces`, `apps` e `packages`, mantendo tudo limpo e escalável.
* **Qualidade de Código Inegociável:** Um exército de linters (ESLint, Clippy) e formatadores (Prettier, rustfmt) que guardam os portões do repositório, garantindo que apenas código limpo e de alta qualidade entre.
* **Pipeline de CI/CD Automatizado:** Um golem de automação (GitHub Actions) que compila e distribui as versões do seu app para todos os reinos (Windows, macOS, Linux).

---

### 🗺️ A Jornada Começa (Como Rodar o Projeto)

1.  **Clone o Repositório:**
    ```bash
    git clone [https://github.com/gabs-passarinho-garcia/tauri-bun-sidecar-template.git](https://github.com/gabs-passarinho-garcia/tauri-bun-sidecar-template.git)
    cd tauri-bun-sidecar-template
    ```

2.  **Instale os Pergaminhos Antigos (Dependências):**
    Rode este comando na raiz do projeto. O Bun, nosso mestre de guildas, cuidará de tudo.
    ```bash
    bun install
    ```

3.  **Acenda a Fogueira (Inicie o Ambiente de Desenvolvimento):**
    Este único comando inicia o frontend, o backend, e a vigilância de ambos.
    ```bash
    bun dev
    ```

---

### 📜 O Tomo de Comandos (Scripts Principais)

Todos os comandos devem ser rodados da raiz do projeto.

| Comando | Descrição |
| :--- | :--- |
| `bun dev` | Inicia a Guilda completa: o app Tauri e o sidecar Bun em modo de desenvolvimento. |
| `bun test` | Convoca os golens de teste (`bun:test` e `vitest`) para validar todas as masmorras do código. |
| `bun run check` | Realiza uma inspeção completa de qualidade: formatação, linting (TS e Rust) e checagem de tipos. |
| `bun run release` | Forja os artefatos finais: compila tudo e gera os instaladores nativos para produção. |

---

### 📖 Os Votos Sagrados (Licença)

Este projeto é um testemunho da crença na liberdade e no compartilhamento.
* O **Código** é distribuído sob a **GPLv3**.
* O **Design** (quando aplicável) é distribuído sob a **CC BY-SA 4.0**.

Que ele sirva bem a você e a todos que vierem depois.

---
*Feito com ☕, fé e uma rolagem crítica de d20. Que o Criador abençoe suas compilações e que seus bugs sejam poucos. Amém!*