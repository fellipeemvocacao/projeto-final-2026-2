// Base de dados das Acomodações
const ACOMODACOES = [
    {
        id: 'suite-canina-standard',
        nome: 'Suíte Canina Standard',
        especie: 'Cachorro',
        precoDiaria: 110.00,
        imagem: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=600&q=80',
        recursos: ['Cama ortopédica', 'Climatizado', '2 passeios diários', 'Câmera ao vivo']
    },
    {
        id: 'suite-canina-master',
        nome: 'Suíte Canina Master',
        especie: 'Cachorro',
        precoDiaria: 180.00,
        imagem: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
        recursos: ['Acesso ao gramado privativo', 'Piscina liberada', 'Monitoramento 24h', 'Cama King Size']
    },
    {
        id: 'gatolandia-standard',
        nome: 'Chalé Gatolândia Standard',
        especie: 'Gato',
        precoDiaria: 95.00,
        imagem: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=600&q=80',
        recursos: ['Nicho suspenso', 'Ar-condicionado', 'Arranhadores altos', 'Área 100% acústica']
    },
    {
        id: 'gatolandia-luxury',
        nome: 'Penthouse Felina VIP',
        especie: 'Gato',
        precoDiaria: 150.00,
        imagem: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80',
        recursos: ['Solário privativo telado', 'Fonte de água corrente', 'Enriquecimento vertical', 'Visita diária do veterinário']
    }
];

let quantidadeReservas = 0;

// Inicialização da página
document.addEventListener('DOMContentLoaded', () => {
    renderizarAcomodacoes();
    configurarDatasCheckin();
    configurarEventosFormulario();
});

// Renderizar lista de acomodações na página
function renderizarAcomodacoes() {
    const container = document.getElementById('roomsContainer');
    if (!container) return;

    container.innerHTML = '';

    ACOMODACOES.forEach(quarto => {
        const card = document.createElement('div');
        card.className = 'room-card';
        card.innerHTML = `
            <img src="${quarto.imagem}" alt="${quarto.nome}" class="room-img" loading="lazy">
            <div class="room-info">
                <span class="room-tag">${quarto.especie}</span>
                <h3>${quarto.nome}</h3>
                <p class="room-price"><strong>R$ ${quarto.precoDiaria.toFixed(2).replace('.', ',')}</strong> / diária</p>
                <ul class="room-features">
                    ${quarto.recursos.map(rec => `<li>✓ ${rec}</li>`).join('')}
                </ul>
                <button type="button" class="btn-primary btn-full" onclick="selecionarAcomodacaoDireta('${quarto.id}', '${quarto.especie}')">
                    Reservar Este Quarto
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Configura a data mínima de check-in para HOJE
function configurarDatasCheckin() {
    const hoje = new Date().toISOString().split('T')[0];
    const checkinInput = document.getElementById('checkinDate');
    const checkoutInput = document.getElementById('checkoutDate');

    if (checkinInput && checkoutInput) {
        checkinInput.min = hoje;
        checkoutInput.min = hoje;

        // Atualiza o min do checkout ao alterar o checkin
        checkinInput.addEventListener('change', () => {
            if (checkinInput.value) {
                checkoutInput.min = checkinInput.value;
                if (checkoutInput.value && checkoutInput.value <= checkinInput.value) {
                    checkoutInput.value = '';
                }
            }
            calcularReservaTempoReal();
        });

        checkoutInput.addEventListener('change', calcularReservaTempoReal);
    }
}

// Configuração dos Eventos do Formulário
function configurarEventosFormulario() {
    const especieSelect = document.getElementById('especiePet');
    const quartoSelect = document.getElementById('quartoSelect');
    const reservaForm = document.getElementById('reservaForm');

    if (especieSelect) {
        especieSelect.addEventListener('change', () => {
            filtrarAcomodacoes();
            calcularReservaTempoReal();
        });
    }

    if (quartoSelect) {
        quartoSelect.addEventListener('change', calcularReservaTempoReal);
    }

    if (reservaForm) {
        reservaForm.addEventListener('submit', enviarReserva);
    }
}

// Filtrar as opções do menu suspenso de quartos com base na espécie escolhida
function filtrarAcomodacoes() {
    const especieSelec = document.getElementById('especiePet').value;
    const quartoSelect = document.getElementById('quartoSelect');

    quartoSelect.innerHTML = '<option value="">Selecione um Quarto...</option>';

    if (!especieSelec) return;

    const acomodacoesFiltradas = ACOMODACOES.filter(q => q.especie === especieSelec);

    if (acomodacoesFiltradas.length === 0) {
        quartoSelect.innerHTML = '<option value="">Nenhum quarto disponível para esta espécie</option>';
    } else {
        acomodacoesFiltradas.forEach(q => {
            const opt = document.createElement('option');
            opt.value = q.id;
            opt.textContent = `${q.nome} - R$ ${q.precoDiaria.toFixed(2).replace('.', ',')}/dia`;
            quartoSelect.appendChild(opt);
        });
    }
}

// Seleção direta ao clicar em um Card de Quarto
function selecionarAcomodacaoDireta(quartoId, especie) {
    const especieSelect = document.getElementById('especiePet');
    if (especieSelect) {
        especieSelect.value = especie;
        filtrarAcomodacoes();
    }

    const quartoSelect = document.getElementById('quartoSelect');
    if (quartoSelect) {
        quartoSelect.value = quartoId;
    }

    rolarParaReservas();
    calcularReservaTempoReal();
}

function rolarParaReservas() {
    const secaoReservas = document.getElementById('reservas');
    if (secaoReservas) {
        secaoReservas.scrollIntoView({ behavior: 'smooth' });
    }
}

// Cálculo do Total em Tempo Real
function calcularReservaTempoReal() {
    const quartoSelect = document.getElementById('quartoSelect');
    const checkinInput = document.getElementById('checkinDate');
    const checkoutInput = document.getElementById('checkoutDate');
    const summaryBox = document.getElementById('priceSummary');

    if (!quartoSelect || !checkinInput || !checkoutInput || !summaryBox) return;

    const quartoId = quartoSelect.value;
    const checkinVal = checkinInput.value;
    const checkoutVal = checkoutInput.value;

    if (!quartoId || !checkinVal || !checkoutVal) {
        summaryBox.style.display = 'none';
        return;
    }

    // Tratamento UTC para cálculo exato de dias sem sofrer com timezone
    const checkin = new Date(`${checkinVal}T00:00:00`);
    const checkout = new Date(`${checkoutVal}T00:00:00`);

    if (checkout <= checkin) {
        summaryBox.style.display = 'block';
        document.getElementById('summaryTotal').textContent = 'Checkout deve ser após o Check-in';
        document.getElementById('summaryNights').textContent = '0 diárias';
        document.getElementById('summaryDailyPrice').textContent = 'R$ 0,00';
        return;
    }

    const diferencaTempo = checkout.getTime() - checkin.getTime();
    const totalDias = Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24));

    const quarto = ACOMODACOES.find(q => q.id === quartoId);

    if (quarto) {
        const totalValor = totalDias * quarto.precoDiaria;

        document.getElementById('summaryNights').textContent = `${totalDias} diária(s)`;
        document.getElementById('summaryDailyPrice').textContent = `R$ ${quarto.precoDiaria.toFixed(2).replace('.', ',')}`;
        document.getElementById('summaryTotal').textContent = `R$ ${totalValor.toFixed(2).replace('.', ',')}`;

        summaryBox.style.display = 'block';
    }
}

// Função para enviar o formulário de reserva
function enviarReserva(event) {
    event.preventDefault();
    
    const nome = document.getElementById('nomeTutor').value;
    const especie = document.getElementById('especiePet').value;
    const quartoId = document.getElementById('quartoSelect').value;
    const totalTexto = document.getElementById('summaryTotal').textContent;

    if (!quartoId || totalTexto.includes('Checkout')) {
        alert('Por favor, escolha um quarto válido e configure as datas corretamente.');
        return;
    }

    const quarto = ACOMODACOES.find(q => q.id === quartoId);

    alert(`Obrigado, ${nome}!\n\nSua reserva para a acomodação "${quarto.nome}" (${especie}) foi solicitada com sucesso.\nValor Total: ${totalTexto}.\n\nNossa equipe entrará em contato via WhatsApp para confirmação.`);

    // Atualizar o contador do carrinho
    quantidadeReservas++;
    const cartCount = document.getElementById('cartCount');
    if (cartCount) cartCount.textContent = quantidadeReservas;

    document.getElementById('reservaForm').reset();
    document.getElementById('priceSummary').style.display = 'none';
}

// Funções do Modal de Login
function abrirLogin() {
    const modal = document.getElementById('modalLogin');
    if (modal) modal.classList.add('active');
}

function fecharLogin() {
    const modal = document.getElementById('modalLogin');
    if (modal) modal.classList.remove('active');
}

function realizarLogin(event) {
    event.preventDefault();
    alert('Login efetuado com sucesso! Bem-vindo de volta ao Refúgio das Patas.');
    fecharLogin();
}

// Fecha o modal ao clicar fora da caixa
window.onclick = function(event) {
    const modal = document.getElementById('modalLogin');
    if (event.target === modal) {
        fecharLogin();
    }
};