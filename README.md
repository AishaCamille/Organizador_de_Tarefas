# 🚀 Organizador de Tarefas Inteligente

Um gerenciador de tarefas completo, flexível e focado em produtividade. Este projeto foi desenvolvido para ajudar qualquer pessoa a organizar sua rotina de forma eficiente, adaptando-se perfeitamente desde tarefas acadêmicas e estudos até afazeres domésticos e compromissos diários.

O grande diferencial do projeto é ir além de uma simples lista de afazeres, unindo organização com técnicas de foco e acompanhamento de evolução pessoal.

---

## 🛠️ Tecnologias Utilizadas

O projeto adota uma arquitetura limpa dividindo as responsabilidades entre Front-end e Back-end:

*   **Front-end:** HTML5, CSS3 (com design totalmente responsivo/mobile-first) e JavaScript (Fetch API).
*   **Back-end:** Python com o framework Flask e Flask-CORS.
*   **Banco de Dados:** PostgreSQL (gerenciado via pgAdmin 4) com relacionamento relacional (1:N) e criptografia de segurança para senhas (`werkzeug.security`).

---

## 🚀 Funcionalidades Já Implementadas

*   [x] **Interface Responsiva:** Navbar superior para telas de computador que se transforma em um menu lateral (sidebar) fluido em formato de três pontinhos para dispositivos móveis.
*   [x] **Sistema de Cadastro Seguro:** Criação de novos usuários com validação de dados e prevenção de e-mails duplicados diretamente no banco de dados.
*   [x] **Sistema de Autenticação (Login):** Validação segura de credenciais descriptografando hashes de senha salvos no PostgreSQL e persistência básica de sessão local (`localStorage`).
*   [x] **Cadastro de tarefas:** Salvas no banco e localstorage.
*   [x] **Timer tarefas:** Para saber quanto tempo levou para aquela tarefa
*   [x] **Timer Pomodoro:** Mini temporizador para ciclos pomodoros.
*   [x] **Lista de tarefas por tempo:** Lista de tarefas organizadar do menor para maior tempo
*   [x] **Cadastro de tarefas por Nivel de Urgencia:** Lista das tarefas organizadas de maior urgencia para menor.
*   [x] **Tarefas completadas:** Registro de tarefas completadas por ordem de finalização.

## 🗺️ Roadmap de Desenvolvimento (Próximas Etapas)

O projeto está em constante evolução. Estas são as funcionalidades planejadas para as próximas versões:


### 📊 Painel de Estatísticas
*   **Métricas de Foco:** Um dashboard visual exibindo gráficos estatísticos detalhados sobre o tempo que o usuário permaneceu focado em suas obrigações divididos por **Dia**, **Semana** e **Mês**.

### 👤 Personalização e Gamificação
*   **Perfil do Usuário:** Área dedicada para edição de dados cadastrais e inclusão de foto de perfil.
*   **Sistema de Ranking:** Um ranking global ou de amigos focado em gamificação, destacando os usuários que mais realizaram e concluíram tarefas no ecossistema da aplicação.

---

## 💻 Como Executar o Projeto Localmente

### Pré-requisitos
*   Python 3.x instalado.
*   PostgreSQL configurado e rodando.

### 1. Clonar o repositório
```bash
git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/seu-usuario/seu-repositorio.git)
cd seu-repositorio