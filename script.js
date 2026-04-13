
const visorResultado = document.querySelector('#resultado');
const visorHistorico = document.querySelector('#historico');

let expressaoAtual = '';
let novaEntrada = true; 

function atualizarVisor(valor) {
  visorResultado.textContent = valor;
}

function adicionarValor(valor) {
  if (novaEntrada) {
    expressaoAtual = '';
    novaEntrada = false;
    removerDestaqueBotoes();
  }

  const partes = expressaoAtual.split(/[\+\-\*\/]/);
  const ultimaParte = partes[partes.length - 1];
  if (valor === '.' && ultimaParte.includes('.')) return;

  const operadores = ['+', '-', '*', '/'];
  const ultimoChar = expressaoAtual.slice(-1);
  if (operadores.includes(valor) && operadores.includes(ultimoChar)) {
    expressaoAtual = expressaoAtual.slice(0, -1);
  }

  expressaoAtual += valor;
  atualizarVisor(formatarExpressao(expressaoAtual));
}

function formatarExpressao(expr) {
  return expr
    .replace(/\*/g, '×')
    .replace(/\//g, '÷');
}

function calcular() {
  if (expressaoAtual === '') return;

  try {
    visorHistorico.textContent = formatarExpressao(expressaoAtual) + ' =';

    const resultado = new Function('return ' + expressaoAtual)();

    if (!isFinite(resultado)) {
      atualizarVisor('Erro');
      expressaoAtual = '';
      return;
    }

    const resultadoFormatado = parseFloat(resultado.toFixed(10));

    atualizarVisor(resultadoFormatado);
    expressaoAtual = String(resultadoFormatado);
    novaEntrada = true;

  } catch (erro) {
    atualizarVisor('Erro');
    expressaoAtual = '';
  }
}

function limpar() {
  expressaoAtual = '';
  novaEntrada = false;
  atualizarVisor('0');
  visorHistorico.textContent = '';
  removerDestaqueBotoes();
}

function apagar() {
  if (novaEntrada) {
    limpar();
    return;
  }
  expressaoAtual = expressaoAtual.slice(0, -1);
  atualizarVisor(expressaoAtual === '' ? '0' : formatarExpressao(expressaoAtual));
}

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

function removerDestaqueBotoes() {
  document.querySelectorAll('.botao--operador').forEach(function(btn) {
    btn.classList.remove('ativo');
  });
}

const botoes = document.querySelectorAll('.botao[data-valor]');

botoes.forEach(function(botao) {
  botao.addEventListener('click', function() {
    const valor = botao.getAttribute('data-valor');
    adicionarValor(valor);
  });
});

document.querySelector('#btn-limpar').addEventListener('click', limpar);
document.querySelector('#btn-apagar').addEventListener('click', apagar);
document.querySelector('#btn-igual').addEventListener('click', calcular);
document.querySelector('#btn-porcentagem').addEventListener('click', calcularPorcentagem);

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
