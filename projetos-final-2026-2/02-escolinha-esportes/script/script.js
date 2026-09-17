/* =========================================================
   Escolinha de Futebol & Vôlei Craques
   Script Principal Unificado
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

    // Obter dados da Modalidade
    const optModalidade = selectModalidade.options[selectModalidade.selectedIndex];
    const precoBase = parseFloat(optModalidade.getAttribute('data-preco'));
    const modalidadeTexto = optModalidade.text.split(' (')[0];

    // Obter multiplicador de Frequência
    const optFrequencia = selectFrequencia.options[selectFrequencia.selectedIndex];
    const multiplicadorFreq = parseFloat(optFrequencia.getAttribute('data-multiplicador'));
    const freqTexto = optFrequencia.text.split(' (')[0];

    // Obter desconto de Fidelidade
    const optDuracao = selectDuracao.options[selectDuracao.selectedIndex];
    const descontoDuracao = parseFloat(optDuracao.getAttribute('data-desconto'));
    const duracaoTexto = optDuracao.text.split(' (')[0];

    // Cálculo final: (Preço Base * Frequência) * (1 - Desconto)
    let total = (precoBase * multiplicadorFreq) * (1 - descontoDuracao);
    total = Math.round(total);

    // Atualização da Interface
    if (resModalidadeTitulo) resModalidadeTitulo.textContent = modalidadeTexto;
    if (resFreqTexto) resFreqTexto.innerHTML = `<i class="fa-solid fa-check text-success"></i> Aulas ${freqTexto}`;
    if (resDuracaoTexto) resDuracaoTexto.innerHTML = `<i class="fa-solid fa-check text-success"></i> Plano ${duracaoTexto}`;
    if (resValorTotal) resValorTotal.textContent = total;

    // Gerar link direcionado para o WhatsApp
    if (btnWhatsapp) {
      const mensagem = encodeURIComponent(
        `Olá! Gostaria de obter mais informações para realizar a matrícula no plano:\n` +
        `- Modalidade: ${modalidadeTexto}\n` +
        `- Frequência: ${freqTexto}\n` +
        `- Fidelidade: Plano ${duracaoTexto}\n` +
        `- Valor Calculado: R$ ${total},00/mês`
      );
      btnWhatsapp.href = `https://wa.me/5511988881000?text=${mensagem}`;
    }
  }

  // Adicionar eventos para cálculo em tempo real
  if (selectModalidade && selectFrequencia && selectDuracao) {
    selectModalidade.addEventListener('change', calcularPlano);
    selectFrequencia.addEventListener('change', calcularPlano);
    selectDuracao.addEventListener('change', calcularPlano);

    // Rodar cálculo ao carregar a página
    calcularPlano();
  }

});