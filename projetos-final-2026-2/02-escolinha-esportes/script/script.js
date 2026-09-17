/* =========================================================
   Escolinha de Futebol & Vôlei Craques
   Script Principal
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Atualização Automática do Ano no Rodapé
  const elementoAno = document.getElementById('ano');
  if (elementoAno) {
    elementoAno.textContent = new Date().getFullYear();
  }

  // 2. Calculadora de Plano de Mensalidade Personalizado
  const selectModalidade = document.getElementById('plano-modalidade');
  const selectFrequencia = document.getElementById('plano-frequencia');
  const selectDuracao = document.getElementById('plano-duracao');

  const resModalidadeTitulo = document.getElementById('res-modalidade-titulo');
  const resFreqTexto = document.getElementById('res-freq-texto');
  const resDuracaoTexto = document.getElementById('res-duracao-texto');
  const resValorTotal = document.getElementById('res-valor-total');
  const btnWhatsapp = document.getElementById('btn-contratar-whatsapp');

  function calcularPlano() {
    if (!selectModalidade || !selectFrequencia || !selectDuracao) return;

    // Valores Base
    const optModalidade = selectModalidade.options[selectModalidade.selectedIndex];
    const precoBase = parseFloat(optModalidade.getAttribute('data-preco'));
    const modalidadeTexto = optModalidade.text.split(' (')[0];

    // Multiplicador de Frequência
    const optFrequencia = selectFrequencia.options[selectFrequencia.selectedIndex];
    const multiplicadorFreq = parseFloat(optFrequencia.getAttribute('data-multiplicador'));
    const freqTexto = optFrequencia.text.split(' (')[0];

    // Desconto de Duração (Fidelidade)
    const optDuracao = selectDuracao.options[selectDuracao.selectedIndex];
    const descontoDuracao = parseFloat(optDuracao.getAttribute('data-desconto'));
    const duracaoTexto = optDuracao.text.split(' (')[0];

    // Cálculo final: (Preço Base * Frequência) * (1 - Desconto)
    let total = (precoBase * multiplicadorFreq) * (1 - descontoDuracao);
    total = Math.round(total); // Arredonda para valores inteiros

    // Atualiza a interface
    resModalidadeTitulo.textContent = modalidadeTexto;
    resFreqTexto.innerHTML = `<i class="fa-solid fa-check text-success"></i> Aulas ${freqTexto}`;
    resDuracaoTexto.innerHTML = `<i class="fa-solid fa-check text-success"></i> Plano ${duracaoTexto}`;
    resValorTotal.textContent = total;

    // Cria o link personalizado para o WhatsApp
    const mensagem = encodeURIComponent(
      `Olá! Gostaria de matricular meu filho(a) no plano personalizado:\n` +
      `- Modalidade: ${modalidadeTexto}\n` +
      `- Frequência: ${freqTexto}\n` +
      `- Tipo: Plano ${duracaoTexto}\n` +
      `- Mensalidade calculada: R$ ${total},00/mês`
    );
    btnWhatsapp.href = `https://wa.me/5511988881000?text=${mensagem}`;
  }

  // Registra os ouvintes de mudança nos selects
  if (selectModalidade && selectFrequencia && selectDuracao) {
    selectModalidade.addEventListener('change', calcularPlano);
    selectFrequencia.addEventListener('change', calcularPlano);
    selectDuracao.addEventListener('change', calcularPlano);

    // Inicializa o cálculo na abertura da página
    calcularPlano();
  }

  // 3. Manipulação do Formulário de Contato / Pré-Matrícula
  const formContato = document.querySelector('.form-contato');
  if (formContato) {
    formContato.addEventListener('submit', (event) => {
      event.preventDefault();

      const nome = document.getElementById('nome').value;
      const modalidade = document.getElementById('modalidade').value;

      alert(`Obrigado, ${nome}! Sua pré-matrícula para a modalidade (${modalidade}) foi enviada com sucesso. Entraremos em contato via WhatsApp!`);
      
      formContato.reset();
    });
  }

  // 4. Manipulação do Formulário de Feedback
  const formFeedback = document.querySelector('.form-feedback');
  if (formFeedback) {
    formFeedback.addEventListener('submit', (event) => {
      event.preventDefault();

      const nome = document.getElementById('nome-feedback').value;
      const avaliacao = document.getElementById('avaliacao').value;
      const gridFeedbacks = document.querySelector('.grid-feedbacks');

      if (gridFeedbacks) {
        const novoCard = document.createElement('article');
        novoCard.className = 'feedback-card';
        novoCard.innerHTML = `
          <p class="comentario">"${avaliacao}"</p>
          <p class="autor"><strong>— ${nome}</strong></p>
          <span class="estrelas">⭐⭐⭐⭐⭐</span>
        `;

        gridFeedbacks.appendChild(novoCard);
      }

      alert('Agradecemos pelo seu feedback!');
      formFeedback.reset();
    });
  }

  // 5. Mudar cor do cabeçalho ao rolar a página
  const header = document.querySelector('.site-header-top');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(21, 128, 61, 0.95)';
      } else {
        header.style.backgroundColor = '';
      }
    });
  }

});