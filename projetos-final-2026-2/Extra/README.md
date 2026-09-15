# ✝️ Galeria de Santos Católicos

**Categoria:** Religioso / Biográfico
**Tipo de projeto:** `content_gallery`

Galeria interativa com biografias, obras, orações e linhas do tempo detalhadas sobre a vida de diversos santos.

## 🎯 Conceitos abordados
- Estrutura HTML5 semântica e acessível
- CSS Grid para layout de duas colunas (barra lateral de metadados + conteúdo principal)
- Uso avançado de multimídia: vídeos em segundo plano (`<video>` loop com overlay)
- Padronização de design e identidade visual entre múltiplas páginas HTML
- Responsividade fluida para leitura e navegação em dispositivos móveis

## 📂 Estrutura de arquivos
santos-catolicos/
├── index.html                 # galeria principal
├── estilo/
│   └── estilo.css             # estilos consolidados e layout em grid
├── video/
│   └── santos.mp4             # vídeo de fundo
├── img/                       # imagens dos santos
└── paginas/                   # páginas internas individuais
├── santo-agostinho.html
├── sao-bento.html
├── sao-carlo-acutis.html
├── sao-joao-paulo-ii.html
├── sao-justino.html
├── sao-joao-vianney.html
├── sao-maximiliano-kolbe.html
├── sao-pedro.html
├── sao-tomas-aquino.html
└── santa-teresinha.html


## ▶️ Como executar
Basta abrir o arquivo `index.html` ou qualquer uma das páginas da pasta `paginas/` em um navegador moderno.
Não precisa de servidor — é HTML, CSS e JavaScript puro.

## 💡 Exercícios de fixação sugeridos

### Nível 1 — HTML / CSS
1. Criar a página interna para um novo santo (ex: *São Francisco de Assis*) seguindo a mesma estrutura das outras.
2. Alterar a cor de destaque principal (dourada) editando as variáveis de cor no `estilo.css`.
3. Adicionar uma nova seção "Curiosidades" nas páginas dos santos.
4. Incluir um botão de impressão para que a oração possa ser impressa formatada.

### Nível 2 — Layout / Responsividade
5. Ajustar a grade do layout para que a imagem do santo fique acima do título em telas menores que `480px`.
6. Adicionar uma animação suave de aparecimento (*fade-in*) ao carregar a página do santo.
7. Implementar uma galeria visual na página principal com todos os cards dos santos dispostos em CSS Grid.

### Nível 3 — JavaScript
8. Adicionar uma barra de progresso de leitura no topo da página conforme o usuário rola o texto.
9. Criar um filtro dinâmico por século ou período histórico dos santos.
10. Adicionar um botão "Copiar Oração" que salva o texto da oração diretamente na área de transferência (*clipboard*).

## 📚 Sugestão de aula
1. Apresentar o layout padronizado das páginas internas rodando no navegador.
2. Demonstrar aos alunos como utilizar a mesma folha de estilo CSS (`estilo.css`) para padronizar múltiplos arquivos HTML.
3. Propor a criação de uma página interna do zero como exercício de fixação.
4. Incentivar a publicação do site no **GitHub Pages**.