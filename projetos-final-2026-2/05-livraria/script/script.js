// Banco de dados centralizado de produtos
const PRODUTOS = [
    { id: '1', titulo: 'Castelo Interior ou Moradas', autor: 'Santa Teresa de Ávila', preco: 50.00, img: 'img/moradas.png' },
    { id: '2', titulo: 'Devocionário a Santa Teresinha', autor: 'Editora Santidade', preco: 59.90, img: 'img/devocionario.png' },
    { id: '3', titulo: 'Suma Teológica (Resumo)', autor: 'Santo Tomás de Aquino', preco: 89.90, img: 'img/suma.png' },
    { id: '4', titulo: 'Bíblia Sagrada', autor: 'Pe. Manuel de Matos Soares', preco: 95.90, img: 'img/biblia.png' },
    { id: '5', titulo: 'O Privilégio de Ser Mulher', autor: 'Alice von Hildebrand', preco: 29.90, img: 'img/vonhildebrand.png' },
    { id: '6', titulo: 'KIT - Catena Aurea (4 Vols)', autor: 'Santo Tomás de Aquino', preco: 314.90, img: 'img/catena.png' },
    { id: '7', titulo: 'Triunfo: O Poder e a Glória', autor: 'H. W. Crocker III', preco: 83.00, img: 'img/triunfo.png' },
    { id: '8', titulo: 'Tratado da Verdadeira Devoção', autor: 'São Luís Maria Grignion', preco: 45.00, img: 'img/tratado.png' }
];

// Estado da Aplicação (com suporte a LocalStorage)
let carrinho = JSON.parse(localStorage.getItem('carrinho_santidade')) || [];
let desejos = JSON.parse(localStorage.getItem('desejos_santidade')) || ['8'];
let estanteComprados = JSON.parse(localStorage.getItem('estante_santidade')) || [
    { id: '9', titulo: 'Introdução à Vida Devota', autor: 'S. Francisco de Sales' }
];

document.addEventListener('DOMContentLoaded', () => {
    renderizarProdutosHome();
    renderizarDestaques(PRODUTOS);
    atualizarCarrinhoUI();
    configurarEventosModais();
});

// --- PERSISTÊNCIA DE DADOS ---
function salvarEstado() {
    localStorage.setItem('carrinho_santidade', JSON.stringify(carrinho));
    localStorage.setItem('desejos_santidade', JSON.stringify(desejos));
    localStorage.setItem('estante_santidade', JSON.stringify(estanteComprados));
}

// --- UTILITÁRIOS ---
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

// --- COMPONENTES DE UI ---
function criarCardHtml(produto, modo = 'loja') {
    const card = document.createElement('div');
    card.className = 'book-card';

    if (modo === 'loja') {
        card.innerHTML = `
            <div class="book-info">
                <h4>${produto.titulo}</h4>
                <p>${produto.autor}</p>
                <img src="${produto.img}" alt="Capa do livro ${produto.titulo}" class="logo-img">
                <p class="price-tag">${formatarMoeda(produto.preco)}</p>
            </div>
            <div class="book-actions">
                <button type="button" class="btn btn-comprar">Comprar</button>
                <button type="button" class="btn btn-outline btn-desejo" aria-label="Adicionar aos desejos">❤️</button>
            </div>
        `;
        
        const imgEl = card.querySelector('img');
        imgEl.onerror = () => { imgEl.src = 'img/capa-padrao.png'; };

        card.querySelector('.btn-comprar').addEventListener('click', () => adicionarCarrinho(produto.id));
        card.querySelector('.btn-desejo').addEventListener('click', () => adicionarDesejos(produto.id));
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

// --- RENDERIZAÇÃO DE TELAS ---
function renderizarProdutosHome() {
    const grid = document.getElementById('home-featured-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    PRODUTOS.slice(1, 7).forEach(prod => {
        grid.appendChild(criarCardHtml(prod, 'loja'));
    });
}

function renderizarDestaques(listaProdutos = PRODUTOS) {
    const grid = document.getElementById('all-highlights-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (listaProdutos.length === 0) {
        grid.innerHTML = '<p class="empty-msg">Nenhum produto encontrado para a busca.</p>';
        return;
    }

    listaProdutos.forEach(prod => {
        grid.appendChild(criarCardHtml(prod, 'loja'));
    });
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
        if (prod) {
            grid.appendChild(criarCardHtml(prod, 'desejos'));
        }
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

    estanteComprados.forEach(livro => {
        grid.appendChild(criarCardHtml(livro, 'estante'));
    });
}

// --- NAVEGAÇÃO ---
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

// --- CARRINHO COM QUANTIDADE ---
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
        
        if (carrinho[index].quantidade <= 0) {
            carrinho.splice(index, 1);
        }
        
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

// --- CONTROLE DE MODAL E EVENTOS DE TECLADO ---
function abrirCarrinho() {
    const modal = document.getElementById('cart-modal');
    if (modal) modal.classList.add('open');
}

function fecharCarrinho() {
    const modal = document.getElementById('cart-modal');
    if (modal) modal.classList.remove('open');
}

function configurarEventosModais() {
    const modal = document.getElementById('cart-modal');
    if (!modal) return;

    modal.addEventListener('click', (e) => {
        if (e.target.id === 'cart-modal') fecharCarrinho();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') fecharCarrinho();
    });
}

// --- DESEJOS ---
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

// --- BUSCA REAL ---
function realizarBusca(event) {
    event.preventDefault();
    const termo = document.getElementById('global-search').value.toLowerCase().trim();

    if (termo === '') {
        renderizarDestaques(PRODUTOS);
        return;
    }

    const filtrados = PRODUTOS.filter(p => 
        p.titulo.toLowerCase().includes(termo) || 
        p.autor.toLowerCase().includes(termo)
    );

    renderizarDestaques(filtrados);
    mudarAba('destaques');
    mostrarToast(`Exibindo resultados para: "${termo}"`);
}