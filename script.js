// Seleciona os elementos do visor
const visorResultado = document.querySelector('#resultado');
const visorHistorico = document.querySelector('#historico');

// Variáveis de estado da calculadora
let expressaoAtual = '';
let novaEntrada = true; // indica se é o início de uma nova entrada

// ===========================
// Funções auxiliares
// ===========================

// Atualiza o visor com o valor atual
function atualizarVisor(valor) {
  visorResultado.textContent = valor;
}

// Adiciona um dígito ou ponto à expressão
function adicionarValor(valor) {
  // Se acabou de calcular (=), começa nova expressão
  if (novaEntrada) {
    expressaoAtual = '';
    novaEntrada = false;
    removerDestaqueBotoes();
  }

  // Impede dois pontos seguidos
  const partes = expressaoAtual.split(/[\+\-\*\/]/);
  const ultimaParte = partes[partes.length - 1];
  if (valor === '.' && ultimaParte.includes('.')) return;

  // Impede operador duplo
  const operadores = ['+', '-', '*', '/'];
  const ultimoChar = expressaoAtual.slice(-1);
  if (operadores.includes(valor) && operadores.includes(ultimoChar)) {
    expressaoAtual = expressaoAtual.slice(0, -1);
  }

  expressaoAtual += valor;
  atualizarVisor(formatarExpressao(expressaoAtual));
}

// Formata a expressão para exibição (troca * por × e / por ÷)
function formatarExpressao(expr) {
  return expr
    .replace(/\*/g, '×')
    .replace(/\//g, '÷');
}

// Calcula o resultado da expressão atual
function calcular() {
  if (expressaoAtual === '') return;

  try {
    visorHistorico.textContent = formatarExpressao(expressaoAtual) + ' =';

    // Usa Function para evitar eval() diretamente
    const resultado = new Function('return ' + expressaoAtual)();

    // Evita resultados infinitos ou inválidos
    if (!isFinite(resultado)) {
      atualizarVisor('Erro');
      expressaoAtual = '';
      return;
    }

    // Arredonda para evitar problemas de ponto flutuante
    const resultadoFormatado = parseFloat(resultado.toFixed(10));

    atualizarVisor(resultadoFormatado);
    expressaoAtual = String(resultadoFormatado);
    novaEntrada = true;

  } catch (erro) {
    atualizarVisor('Erro');
    expressaoAtual = '';
  }
}

// Limpa tudo (botão C)
function limpar() {
  expressaoAtual = '';
  novaEntrada = false;
  atualizarVisor('0');
  visorHistorico.textContent = '';
  removerDestaqueBotoes();
}

// Apaga o último caractere (botão ⌫)
function apagar() {
  if (novaEntrada) {
    limpar();
    return;
  }
  expressaoAtual = expressaoAtual.slice(0, -1);
  atualizarVisor(expressaoAtual === '' ? '0' : formatarExpressao(expressaoAtual));
}

// Calcula a porcentagem do número atual
function calcularPorcentagem() {
  if (expressaoAtual === '') return;
  try {
    const valor = new Function('return ' + expressaoAtual)();
    const resultado = parseFloat((valor / 100).toFixed(10));
    expressaoAtual = String(resultado);
    atualizarVisor(resultado);
  } catch (erro) {
    atualizarVisor('Erro');
    expressaoAtual = '';
  }
}

// Remove destaque dos botões de operador
function removerDestaqueBotoes() {
  document.querySelectorAll('.botao--operador').forEach(function(btn) {
    btn.classList.remove('ativo');
  });
}

// ===========================
// Eventos dos botões numéricos e ponto
// ===========================
const botoes = document.querySelectorAll('.botao[data-valor]');

botoes.forEach(function(botao) {
  botao.addEventListener('click', function() {
    const valor = botao.getAttribute('data-valor');
    adicionarValor(valor);
  });
});

// ===========================
// Eventos dos botões especiais
// ===========================
document.querySelector('#btn-limpar').addEventListener('click', limpar);
document.querySelector('#btn-apagar').addEventListener('click', apagar);
document.querySelector('#btn-igual').addEventListener('click', calcular);
document.querySelector('#btn-porcentagem').addEventListener('click', calcularPorcentagem);

// ===========================
// Suporte ao teclado
// ===========================
document.addEventListener('keydown', function(evento) {
  const tecla = evento.key;

  if (!isNaN(tecla) || tecla === '.') {
    adicionarValor(tecla);
  } else if (tecla === '+' || tecla === '-' || tecla === '*' || tecla === '/') {
    adicionarValor(tecla);
  } else if (tecla === 'Enter' || tecla === '=') {
    calcular();
  } else if (tecla === 'Backspace') {
    apagar();
  } else if (tecla === 'Escape') {
    limpar();
  } else if (tecla === '%') {
    calcularPorcentagem();
  }
});
