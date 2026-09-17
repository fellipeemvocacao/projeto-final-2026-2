// Banco de dados centralizado de produtos com categorias e resenhas
const PRODUTOS = [
    { 
        id: '1', 
        titulo: 'Castelo Interior ou Moradas', 
        autor: 'Santa Teresa de Ávila', 
        categoria: 'Espiritualidade', 
        preco: 50.00, 
        img: 'img/moradas.png',
        resenhas: [
            { autor: 'João Paulo', nota: 5, comentario: 'Livro transformador. Leitura indispensável para a vida espiritual.' }
        ]
    },
    { 
        id: '2', 
        titulo: 'Devocionário a Santa Teresinha', 
        autor: 'Editora Santidade', 
        categoria: 'Espiritualidade', 
        preco: 59.90, 
        img: 'img/devocionario.png',
        resenhas: [
            { autor: 'Ana Maria', nota: 5, comentario: 'Lindas orações e meditações.' }
        ]
    },
    { 
        id: '3', 
        titulo: 'Suma Teológica (Resumo)', 
        autor: 'Santo Tomás de Aquino', 
        categoria: 'Teologia', 
        preco: 89.90, 
        img: 'img/suma.png',
        resenhas: []
    },
    { 
        id: '4', 
        titulo: 'Bíblia Sagrada', 
        autor: 'Pe. Manuel de Matos Soares', 
        categoria: 'Bíblicos', 
        preco: 95.90, 
        img: 'img/biblia.png',
        resenhas: [
            { autor: 'Carlos Eduardo', nota: 5, comentario: 'Excelente tradução clássica.' }
        ]
    },
    { 
        id: '5', 
        titulo: 'O Privilégio de Ser Mulher', 
        autor: 'Alice von Hildebrand', 
        categoria: 'Filosofia', 
        preco: 29.90, 
        img: 'img/vonhildebrand.png',
        resenhas: []
    },
    { 
        id: '6', 
        titulo: 'KIT - Catena Aurea (4 Vols)', 
        autor: 'Santo Tomás de Aquino', 
        categoria: 'Teologia', 
        preco: 314.90, 
        img: 'img/catena.png',
        resenhas: [
            { autor: 'Padre Lucas', nota: 5, comentario: 'Comentários fabulosos dos Santos Padres.' }
        ]
    },
    { 
        id: '7', 
        titulo: 'Triunfo: O Poder e a Glória', 
        autor: 'H. W. Crocker III', 
        categoria: 'História', 
        preco: 83.00, 
        img: 'img/triunfo.png',
        resenhas: []
    },
    { 
        id: '8', 
        titulo: 'Tratado da Verdadeira Devoção', 
        autor: 'São Luís Maria Grignion', 
        categoria: 'Espiritualidade', 
        preco: 45.00, 
        img: 'img/tratado.png',
        resenhas: [
            { autor: 'Beatriz', nota: 5, comentario: 'Essencial para quem deseja se consagrar.' }
        ]
    }
];

// Estado da Aplicação (LocalStorage)
let carrinho = JSON.parse(localStorage.getItem('carrinho_santidade')) || [];
let desejos = JSON.parse(localStorage.getItem('desejos_santidade')) || ['8'];
let estanteComprados = JSON.parse(localStorage.getItem('estante_santidade')) || [
    { id: '9', titulo: 'Introdução à Vida Devota', autor: 'S. Francisco de Sales' }
];
let resenhasBanco = JSON.parse(localStorage.getItem('resenhas_santidade')) || {};

document.addEventListener('DOMContentLoaded', () => {
    inicializarResenhas();
    renderizarPillsCategorias();
    renderizarProdutosHome();
    executarBuscaAvançada();
    atualizarCarrinhoUI();
    configurarEventosModais();
});

function salvarEstado() {
    localStorage.setItem('carrinho_santidade', JSON.stringify(carrinho));
    localStorage.setItem('desejos_santidade', JSON.stringify(desejos));
    localStorage.setItem('estante_santidade', JSON.stringify(estanteComprados));
    localStorage.setItem('resenhas_santidade', JSON.stringify(resenhasBanco));
}

function inicializarResenhas() {
    PRODUTOS.forEach(p => {
        if (!resenhasBanco[p.id]) {
            resenhasBanco[p.id] = p.resenhas || [];
        }
    });
    salvarEstado();
}

function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function mostrarToast(mensagem, tipo = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    toast.textContent = mensagem;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        toast.addEventListener('animationend', () => toast.remove());
    }, 3000);
}

// --- CATEGORIAS ---
function renderizarPillsCategorias() {
    const container = document.getElementById('home-category-pills');
    if (!container) return;

    const categorias = ['Todas', 'Espiritualidade', 'Teologia', 'Bíblicos', 'Filosofia', 'História'];
    container.innerHTML = '';

    categorias.forEach(cat => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'pill-btn';
        btn.textContent = cat;
        btn.onclick = () => {
            mudarAba('catalogo');
            const catSelect = document.getElementById('adv-category');
            if (catSelect) catSelect.value = cat === 'Todas' ? '' : cat;
            executarBuscaAvançada();
        };
        container.appendChild(btn);
    });
}

// --- CRIAR CARD DO LIVRO ---
function criarCardHtml(produto, modo = 'loja') {
    const card = document.createElement('div');
    card.className = 'book-card';

    const resenhas = resenhasBanco[produto.id] || [];
    const mediaNotas = resenhas.length > 0 
        ? (resenhas.reduce((s, r) => s + Number(r.nota), 0) / resenhas.length).toFixed(1)
        : 'N/A';

    if (modo === 'loja') {
        card.innerHTML = `
            <div class="book-info">
                <span class="category-badge">${produto.categoria || 'Geral'}</span>
                <h4>${produto.titulo}</h4>
                <p>${produto.autor}</p>
                <img src="${produto.img}" alt="Capa do livro ${produto.titulo}" class="logo-img" onerror="this.src='https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'">
                <div class="rating-info">
                    ⭐ ${mediaNotas} (${resenhas.length} resenha${resenhas.length !== 1 ? 's' : ''})
                </div>
                <p class="price-tag">${formatarMoeda(produto.preco)}</p>
            </div>
            <div class="book-actions">
                <button type="button" class="btn btn-comprar">Comprar</button>
                <button type="button" class="btn btn-outline btn-review" aria-label="Ver resenhas">💬</button>
                <button type="button" class="btn btn-outline btn-desejo" aria-label="Adicionar aos desejos">❤️</button>
            </div>
        `;

        card.querySelector('.btn-comprar').addEventListener('click', () => adicionarCarrinho(produto.id));
        card.querySelector('.btn-desejo').addEventListener('click', () => adicionarDesejos(produto.id));
        card.querySelector('.btn-review').addEventListener('click', () => abrirModalResenhas(produto.id));
    } else if (modo === 'desejos') {
        card.innerHTML = `
            <div class="book-info">
                <h4>${produto.titulo}</h4>
                <p>${produto.autor}</p>
                <p class="price-tag">${formatarMoeda(produto.preco)}</p>
            </div>
            <div class="book-actions">
                <button type="button" class="btn btn-mover">Mover p/ Carrinho</button>
                <button type="button" class="btn btn-outline btn-remover-desejo">Remover</button>
            </div>
        `;
        card.querySelector('.btn-mover').addEventListener('click', () => {
            adicionarCarrinho(produto.id);
            removerDesejo(produto.id);
        });
        card.querySelector('.btn-remover-desejo').addEventListener('click', () => removerDesejo(produto.id));
    } else if (modo === 'estante') {
        card.innerHTML = `
            <div class="book-info">
                <h4>${produto.titulo}</h4>
                <p class="status-success">Adquirido / Disponível</p>
            </div>
            <div class="book-actions">
                <button type="button" class="btn btn-ler">Ler Livro</button>
            </div>
        `;
        card.querySelector('.btn-ler').addEventListener('click', () => mostrarToast('Abrindo e-reader...'));
    }

    return card;
}

// --- RENDERIZAÇÃO DAS TELAS ---
function renderizarProdutosHome() {
    const grid = document.getElementById('home-featured-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    PRODUTOS.slice(0, 6).forEach(prod => {
        grid.appendChild(criarCardHtml(prod, 'loja'));
    });
}

// --- BUSCA AVANÇADA E FILTROS ---
function atualizarLabelPreco() {
    const val = document.getElementById('adv-max-price').value;
    document.getElementById('price-display').textContent = val;
}

function executarBuscaAvançada() {
    const texto = (document.getElementById('adv-text')?.value || '').toLowerCase().trim();
    const categoria = document.getElementById('adv-category')?.value || '';
    const maxPreco = parseFloat(document.getElementById('adv-max-price')?.value || 9999);
    const ordem = document.getElementById('adv-sort')?.value || 'padrao';

    let resultado = PRODUTOS.filter(p => {
        const atendeTexto = p.titulo.toLowerCase().includes(texto) || p.autor.toLowerCase().includes(texto);
        const atendeCategoria = categoria === '' || p.categoria === categoria;
        const atendePreco = p.preco <= maxPreco;
        return atendeTexto && atendeCategoria && atendePreco;
    });

    // Ordenação
    if (ordem === 'preco-asc') {
        resultado.sort((a, b) => a.preco - b.preco);
    } else if (ordem === 'preco-desc') {
        resultado.sort((a, b) => b.preco - a.preco);
    } else if (ordem === 'nome-asc') {
        resultado.sort((a, b) => a.titulo.localeCompare(b.titulo));
    } else if (ordem === 'avaliacoes') {
        resultado.sort((a, b) => {
            const resA = resenhasBanco[a.id] || [];
            const resB = resenhasBanco[b.id] || [];
            const mediaA = resA.length ? resA.reduce((s, r) => s + Number(r.nota), 0) / resA.length : 0;
            const mediaB = resB.length ? resB.reduce((s, r) => s + Number(r.nota), 0) / resB.length : 0;
            return mediaB - mediaA;
        });
    }

    renderizarCatalogo(resultado);
}

function renderizarCatalogo(lista) {
    const grid = document.getElementById('catalogo-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (lista.length === 0) {
        grid.innerHTML = '<p class="empty-msg">Nenhum produto encontrado com os filtros selecionados.</p>';
        return;
    }

    lista.forEach(prod => grid.appendChild(criarCardHtml(prod, 'loja')));
}

function realizarBuscaSimples(e) {
    e.preventDefault();
    const termo = document.getElementById('global-search').value;
    mudarAba('catalogo');
    const advInput = document.getElementById('adv-text');
    if (advInput) {
        advInput.value = termo;
        executarBuscaAvançada();
    }
}

// --- CLUBE DE ASSINATURA ---
function assinarClube(planoNome) {
    const statusEl = document.getElementById('user-club-status');
    if (statusEl) statusEl.textContent = planoNome;
    mostrarToast(`Parabéns! Você assinou o ${planoNome}!`, 'sucesso');
}

// --- RESENHAS E AVALIAÇÕES ---
function abrirModalResenhas(idProduto) {
    const produto = PRODUTOS.find(p => p.id === idProduto);
    if (!produto) return;

    document.getElementById('modal-book-title').textContent = `Resenhas: ${produto.titulo}`;
    document.getElementById('review-book-id').value = idProduto;

    const container = document.getElementById('modal-reviews-list');
    const resenhas = resenhasBanco[idProduto] || [];

    if (resenhas.length === 0) {
        container.innerHTML = '<p class="empty-msg">Nenhuma resenha enviada para este livro ainda. Seja o primeiro!</p>';
    } else {
        container.innerHTML = resenhas.map(r => `
            <div class="review-item">
                <div class="review-header">
                    <strong>${r.autor}</strong>
                    <span>${'⭐'.repeat(r.nota)}</span>
                </div>
                <p class="review-comment">"${r.comentario}"</p>
            </div>
        `).join('');
    }

    document.getElementById('reviews-modal').classList.add('open');
}

function fecharModalResenhas() {
    document.getElementById('reviews-modal').classList.remove('open');
}

function salvarResenha(e) {
    e.preventDefault();
    const id = document.getElementById('review-book-id').value;
    const autor = document.getElementById('review-author').value;
    const nota = parseInt(document.getElementById('review-rating').value);
    const comentario = document.getElementById('review-comment').value;

    if (!resenhasBanco[id]) resenhasBanco[id] = [];
    resenhasBanco[id].push({ autor, nota, comentario });

    salvarEstado();
    mostrarToast('Resenha adicionada com sucesso!', 'sucesso');
    fecharModalResenhas();
    document.getElementById('add-review-form').reset();
    executarBuscaAvançada();
    renderizarProdutosHome();
}

// --- NAVEGAÇÃO E CARRINHO ---
function mudarAba(abaId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.sidebar button').forEach(el => el.classList.remove('active'));

    const aba = document.getElementById(`tab-${abaId}`);
    if (aba) aba.classList.add('active');

    const btn = document.getElementById(`btn-${abaId}`);
    if (btn) btn.classList.add('active');

    if (abaId === 'desejos') renderizarDesejos();
    if (abaId === 'estante') renderizarEstante();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderizarDesejos() {
    const grid = document.getElementById('desejos-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (desejos.length === 0) {
        grid.innerHTML = '<p class="empty-msg">Nenhum livro na lista de desejos.</p>';
        return;
    }

    desejos.forEach(id => {
        const prod = PRODUTOS.find(p => p.id === id);
        if (prod) grid.appendChild(criarCardHtml(prod, 'desejos'));
    });
}

function renderizarEstante() {
    const grid = document.getElementById('estante-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (estanteComprados.length === 0) {
        grid.innerHTML = '<p class="empty-msg">Sua estante de leitura está vazia.</p>';
        return;
    }

    estanteComprados.forEach(livro => grid.appendChild(criarCardHtml(livro, 'estante')));
}

function adicionarCarrinho(idProduto) {
    const produto = PRODUTOS.find(p => p.id === idProduto);
    if (!produto) return;

    const itemExistente = carrinho.find(item => item.id === idProduto);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
    }

    salvarEstado();
    atualizarCarrinhoUI();
    mostrarToast(`"${produto.titulo}" adicionado ao carrinho!`, 'sucesso');
}

function alterarQuantidade(index, delta) {
    if (carrinho[index]) {
        carrinho[index].quantidade += delta;
        if (carrinho[index].quantidade <= 0) carrinho.splice(index, 1);
        salvarEstado();
        atualizarCarrinhoUI();
    }
}

function removerCarrinho(index) {
    carrinho.splice(index, 1);
    salvarEstado();
    atualizarCarrinhoUI();
}

function atualizarCarrinhoUI() {
    const countEl = document.getElementById('cart-count');
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total-price');

    if (!countEl || !container || !totalEl) return;

    const totalItens = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
    countEl.textContent = totalItens;

    if (carrinho.length === 0) {
        container.innerHTML = '<p class="empty-msg">Seu carrinho está vazio.</p>';
        totalEl.textContent = formatarMoeda(0);
        return;
    }

    container.innerHTML = '';
    let totalPreco = 0;

    carrinho.forEach((item, index) => {
        const subtotal = item.preco * item.quantidade;
        totalPreco += subtotal;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        
        itemDiv.innerHTML = `
            <div class="cart-item-info">
                <span><strong>${item.titulo}</strong></span>
                <span>${formatarMoeda(item.preco)} x ${item.quantidade} = ${formatarMoeda(subtotal)}</span>
            </div>
            <div class="cart-item-actions">
                <button type="button" class="btn-qty btn-minus">-</button>
                <span>${item.quantidade}</span>
                <button type="button" class="btn-qty btn-plus">+</button>
                <button type="button" class="btn-remove" aria-label="Remover item">&times;</button>
            </div>
        `;

        itemDiv.querySelector('.btn-minus').addEventListener('click', () => alterarQuantidade(index, -1));
        itemDiv.querySelector('.btn-plus').addEventListener('click', () => alterarQuantidade(index, 1));
        itemDiv.querySelector('.btn-remove').addEventListener('click', () => removerCarrinho(index));

        container.appendChild(itemDiv);
    });

    totalEl.textContent = formatarMoeda(totalPreco);
}

function abrirCarrinho() {
    document.getElementById('cart-modal')?.classList.add('open');
}

function fecharCarrinho() {
    document.getElementById('cart-modal')?.classList.remove('open');
}

function configurarEventosModais() {
    document.getElementById('cart-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'cart-modal') fecharCarrinho();
    });

    document.getElementById('reviews-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'reviews-modal') fecharModalResenhas();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            fecharCarrinho();
            fecharModalResenhas();
        }
    });
}

function adicionarDesejos(idProduto) {
    if (!desejos.includes(idProduto)) {
        desejos.push(idProduto);
        salvarEstado();
        mostrarToast('Adicionado à Lista de Desejos!');
    } else {
        mostrarToast('Este livro já está na sua lista de desejos.', 'alerta');
    }
}

function removerDesejo(idProduto) {
    desejos = desejos.filter(id => id !== idProduto);
    salvarEstado();
    renderizarDesejos();
}