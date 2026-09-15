# 📚 Editora Santidade - Livraria Virtual

**Categoria:** E-commerce / Livraria
**Tipo de projeto:** `landing_store_grid`

Plataforma de e-commerce e livraria virtual para a Editora Santidade, com suporte a catálogo de livros, navegação por abas (SPA), carrinho de compras dinâmico, lista de desejos e gerenciamento de perfil.

## 🎯 Conceitos abordados
- Estrutura HTML semântica (`header`, `main`, `aside`, `section`, `footer`)
- Meta tags, acessibilidade básica e atributos ARIA (`aria-label`)
- CSS moderno: variáveis (`:root`), Flexbox, CSS Grid, formulários estilizados e responsividade
- Navegação Single Page Application (SPA) baseada no chaveamento de abas
- JavaScript: manipulação do DOM, manipulação de modal (carrinho drawer), controle de estados e eventos

## 📂 Estrutura de arquivos
editora-santidade/
├── index.html       # estrutura e abas da loja
├── css/
│   └── styles.css   # estilos e responsividade
├── script/
│   └── script.js    # lógica do carrinho, abas e interatividade
└── README.md        # este arquivo


## ▶️ Como executar
Basta abrir o arquivo `index.html` em qualquer navegador moderno.
Não precisa de servidor — é HTML, CSS e JavaScript puro.

## 💡 Exercícios de fixação sugeridos

### Nível 1 — HTML / CSS
1. Trocar a paleta de cores alterando as variáveis em `:root` no `styles.css`.
2. Adicionar 2 novos cards de livros na grade da aba `Home`.
3. Personalizar o banner da promoção principal mudando as cores de fundo e textos.
4. Adicionar um efeito visual de destaque (*box-shadow*) ao passar o mouse sobre os cards dos livros.

### Nível 2 — Layout / Responsividade
5. Tornar a barra lateral (*sidebar*) recolhível em dispositivos móveis.
6. Ajustar a quebra mobile para `@media (max-width: 600px)`, deixando as capas dos livros centralizadas.
7. Implementar um botão de alternância de tema claro/escuro (`classList.toggle('light-theme')`).

### Nível 3 — JavaScript
8. Salvar os itens do carrinho no `localStorage` para que a lista persista ao recarregar a página.
9. Implementar a busca em tempo real para filtrar os livros conforme o usuário digita na barra de pesquisa.
10. Criar uma função para remover ou alterar a quantidade de itens diretamente dentro do carrinho.
11. Exibir uma notificação temporária (*Toast notification*) na tela sempre que um livro for adicionado à Lista de Desejos.

## 📚 Sugestão de aula
1. Mostrar a loja funcionando para a turma entender o fluxo do e-commerce.
2. Apagar a função `mudarAba()` e refazer junto com a turma explicando a lógica de SPA.
3. Aplicar 2 ou 3 exercícios de fixação como tarefa prática.
4. Estimular a publicação do projeto no **GitHub Pages**.