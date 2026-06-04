# Controle de Estoque Mobile

Projeto acadêmico de um aplicativo mobile para controle de estoque, PDV (vendas) e recebimentos, desenvolvido com Ionic e Angular.

## Objetivo
Fornecer um sistema completo de gestão empresarial no formato PWA/Mobile, focando em usabilidade, segurança local e forte consistência de regras de negócios, garantindo que o ciclo físico de estoque e o ciclo financeiro estejam perfeitamente integrados.

## Tecnologias Utilizadas
- **Angular 17+** (Standalone Components)
- **Ionic Framework 8+** (Componentes de UI Nativos e Responsivos)
- **Ionic Storage Angular** (IndexedDB, pronto para migração nativa no futuro)
- **TypeScript** e **SCSS**

## Estrutura do Sistema
Arquitetura baseada em domínios (Feature-based), separando claramente as responsabilidades:
- `/core`: Serviços globais (Banco de Dados, Autenticação local, Guards de Rotas).
- `/features`: Módulos da aplicação (Dashboard, Clientes, Usuários, Produtos, Vendas, Recebimentos, Relatórios).
- `/models`: Interfaces de domínio fortemente tipadas.
- `/services`: Abstrações de negócio específicas para cada entidade, garantindo reuso.

## Funcionalidades Implementadas
1. **Autenticação Segura:** Tela de Login, controle de sessão via Storage e Route Guards bloqueando intrusos.
2. **Cadastros Base (CRUD):** Gestão de Usuários, Clientes e Produtos com validações rigorosas visuais via Reactive Forms.
3. **Ponto de Venda (PDV):** Carrinho dinâmico, cálculos em tempo real, dedução imediata de estoque e salvamento imutável de preços históricos.
4. **Financeiro (Contas a Receber):** Transição de status fiscal (Pendente/Pago) integrado ao fluxo de venda.
5. **Relatórios Inteligentes:** Painel com indicadores gerenciais (segmentado em 5 abas) cruzando dados dinamicamente, permitindo filtros em tempo real e detecção inteligente de baixo estoque.
6. **Dashboard Dinâmico:** Visão panorâmica atualizada em tempo real (Home).

## Principais Regras de Negócio Blindadas
- Usuários não podem ter credenciais (Username) duplicadas.
- Clientes não podem ter CPFs duplicados.
- Produtos não aceitam preços nem saldos negativos, e não podem ter o mesmo Código Identificador.
- Vendas totalmente bloqueadas caso o produto não tenha estoque físico suficiente para a demanda solicitada.
- A baixa no estoque é atômica (feita nativamente ao registrar a Venda).
- Após paga, uma venda não pode ter seu status revertido ou valores adulterados.

## Como Executar o Projeto
1. Certifique-se de ter o [Node.js](https://nodejs.org) e o [Ionic CLI](https://ionicframework.com/docs/cli) instalados em sua máquina.
2. No diretório raiz do projeto, instale as dependências:
   ```bash
   npm install
   ```
3. Execute o servidor de desenvolvimento:
   ```bash
   ionic serve
   ```
4. O aplicativo será aberto no seu navegador padrão.

## Usuário Padrão
Para o primeiro acesso (o sistema percebe o banco zerado e cria automaticamente a primeira credencial máster):
- **Usuário:** admin
- **Senha:** 123
