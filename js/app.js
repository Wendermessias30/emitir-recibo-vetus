// ==================================================
// EMITIR RECIBO — COM SERVIÇO AVULSO CONDICIONAL
// ==================================================

// ------------------------------
// MÁSCARAS
// ------------------------------
function aplicarMascaraCPF(valor) {
  valor = valor.replace(/\D/g, "");
  valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
  valor = valor.replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
  valor = valor.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})$/, "$1.$2.$3-$4");
  return valor;
}

function aplicarMascaraWhats(valor) {
  valor = valor.replace(/\D/g, "");
  valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
  valor = valor.replace(/(\d{5})(\d{4})$/, "$1-$2");
  return valor;
}

// ------------------------------
// VALIDAÇÕES
// ------------------------------
function validarFormatoCPF(cpf) {
  return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf);
}

function validarCPFCompleto(cpf) {
  const numeros = cpf.replace(/\D/g, "");
  if (numeros.length !== 11) return false;
  if (/^(\d)\1+$/.test(numeros)) return false;

  const digitos = numeros.split("").map(Number);
  let soma1 = 0;
  for (let i = 0; i < 9; i++) soma1 += digitos[i] * (10 - i);
  let resto1 = (soma1 * 10) % 11;
  if (resto1 === 10) resto1 = 0;
  if (resto1 !== digitos[9]) return false;

  let soma2 = 0;
  for (let i = 0; i < 10; i++) soma2 += digitos[i] * (11 - i);
  let resto2 = (soma2 * 10) % 11;
  if (resto2 === 10) resto2 = 0;
  if (resto2 !== digitos[10]) return false;

  return true;
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarWhats(whats) {
  if (!whats) return true;
  return /^\(\d{2}\) \d{5}-\d{4}$/.test(whats);
}

// ------------------------------
// EXIBIR ERROS
// ------------------------------
function mostrarErro(idCampo, idErro, mensagem) {
  const campo = document.getElementById(idCampo);
  const erro = document.getElementById(idErro);
  if (mensagem) {
    if (campo) campo.classList.add("invalido");
    erro.textContent = mensagem;
  } else {
    if (campo) campo.classList.remove("invalido");
    erro.textContent = "";
  }
}

// ------------------------------
// MOSTRAR/ESCONDER CAMPO SERVIÇO AVULSO
// ------------------------------
function verificarTipoPacote() {
  const valorPacote = document.getElementById("rec-pacote").value;
  const campoExtra = document.getElementById("campo-servico-avulso");

  if (valorPacote.startsWith("Serviço Avulso")) {
    campoExtra.classList.remove("oculto");
  } else {
    campoExtra.classList.add("oculto");
    mostrarErro("rec-servico-desc", "rec-servico-erro", "");
  }
}

// ------------------------------
// EVENTOS EM TEMPO REAL
// ------------------------------
document.getElementById("rec-cpf").addEventListener("input", function () {
  this.value = aplicarMascaraCPF(this.value);
  if (!this.value) mostrarErro("rec-cpf", "rec-cpf-erro", "");
  else if (!validarFormatoCPF(this.value))
    mostrarErro("rec-cpf", "rec-cpf-erro", "Formato: 000.000.000-00");
  else if (!validarCPFCompleto(this.value))
    mostrarErro(
      "rec-cpf",
      "rec-cpf-erro",
      "CPF inválido! Verifique os números.",
    );
  else mostrarErro("rec-cpf", "rec-cpf-erro", "");
});

document.getElementById("rec-email").addEventListener("blur", function () {
  if (!this.value) mostrarErro("rec-email", "rec-email-erro", "");
  else if (!validarEmail(this.value))
    mostrarErro("rec-email", "rec-email-erro", "E-mail inválido");
  else mostrarErro("rec-email", "rec-email-erro", "");
});

document.getElementById("rec-whats").addEventListener("input", function () {
  this.value = aplicarMascaraWhats(this.value);
  if (!this.value) mostrarErro("rec-whats", "rec-whats-erro", "");
  else if (!validarWhats(this.value))
    mostrarErro("rec-whats", "rec-whats-erro", "Formato: (XX) XXXXX-XXXX");
  else mostrarErro("rec-whats", "rec-whats-erro", "");
});

document
  .getElementById("rec-pacote")
  .addEventListener("change", verificarTipoPacote);

// ------------------------------
// DADOS COMUNS
// ------------------------------
function coletarDados() {
  const nome = document.getElementById("rec-nome").value.trim();
  const cpf = document.getElementById("rec-cpf").value;
  const email = document.getElementById("rec-email").value.trim();
  const whats = document.getElementById("rec-whats").value.trim();
  const pacoteValor = document.getElementById("rec-pacote").value.split("|");
  let pacote = pacoteValor[0];
  const valor = pacoteValor[1];
  const pagamento = document.getElementById("rec-forma").value;
  const obs =
    document.getElementById("rec-obs").value.trim() || "Sem observações";
  const dataHoje = new Date().toLocaleDateString("pt-BR");
  const valorFormatado = "R$ " + parseFloat(valor).toFixed(2).replace(".", ",");

  // Se for serviço avulso, junta a descrição
  if (pacote === "Serviço Avulso") {
    const descricao = document.getElementById("rec-servico-desc").value.trim();
    pacote = "Serviço Avulso: " + descricao;
  }

  return {
    nome,
    cpf,
    email,
    whats,
    pacote,
    valorFormatado,
    pagamento,
    obs,
    dataHoje,
  };
}

function validarDados(dados) {
  if (!dados.nome) {
    alert("⚠️ Digite o nome do cliente!");
    return false;
  }
  if (!validarFormatoCPF(dados.cpf) || !validarCPFCompleto(dados.cpf)) {
    alert("⚠️ CPF inválido!");
    return false;
  }
  if (!validarEmail(dados.email)) {
    alert("⚠️ E-mail inválido!");
    return false;
  }
  if (dados.whats && !validarWhats(dados.whats)) {
    alert("⚠️ WhatsApp inválido!");
    return false;
  }

  // Valida serviço avulso
  const pacoteOriginal = document.getElementById("rec-pacote").value;
  if (pacoteOriginal.startsWith("Serviço Avulso")) {
    const desc = document.getElementById("rec-servico-desc").value.trim();
    if (!desc) {
      alert("⚠️ Descreva qual é o serviço avulso!");
      mostrarErro("rec-servico-desc", "rec-servico-erro", "Campo obrigatório");
      return false;
    }
  }

  return true;
}

function gerarReciboResumido(dados) {
  return `RECIBO DE PAGAMENTO
==========================

VÉTUS GESTÃO DE ACESSO
Wender M.J da Silva — CPF: 093.112.766-18
@vetusacessodigital

Recebi de: ${dados.nome}
CPF: ${dados.cpf}
Serviço: ${dados.pacote}
Valor: ${dados.valorFormatado}
Forma de pagamento: ${dados.pagamento}
Observações: ${dados.obs}

Emitido em ${dados.dataHoje}

_______________________________
Wender Messias José da Silva
Vétus Gestão de Acesso`;
}

function gerarReciboHTML(dados) {
  return `
<html>
<head>
<meta charset='UTF-8'>
<title>Recibo de Pagamento</title>
<style>
body { font-family: Arial; padding: 40px; font-size: 14px; line-height: 1.8; }
h1 { color: #0A2357; font-size: 26px; text-align: center; border-bottom: 3px solid #D4AF37; padding-bottom: 15px; margin-bottom: 30px; }
.cabecalho { text-align: center; margin-bottom: 30px; }
.cabecalho p { margin: 5px 0; color: #333; }
.dados { margin: 25px 0; }
.dados p { margin: 10px 0; font-size: 16px; }
.valor { font-size: 22px; font-weight: bold; color: #B8860B; margin: 20px 0; }
.assinatura { margin-top: 80px; border-top: 1px solid #333; padding-top: 20px; width: 300px; text-align: center; margin-left: auto; margin-right: auto; }
.data-rodape { text-align: right; margin-top: 30px; color: #555; }
</style>
</head>
<body>
<h1>RECIBO DE PAGAMENTO</h1>
<div class='cabecalho'>
<p><strong>VÉTUS GESTÃO DE ACESSO</strong></p>
<p>Wender M.J da Silva</p>
<p>@vetusacessodigital</p>
</div>
<div class='dados'>
<p><strong>Recebi de:</strong> ${dados.nome}</p>
<p><strong>CPF:</strong> ${dados.cpf}</p>
<p><strong>Serviço:</strong> ${dados.pacote}</p>
<p class='valor'>Valor: ${dados.valorFormatado}</p>
<p><strong>Forma de pagamento:</strong> ${dados.pagamento}</p>
<p><strong>Observações:</strong> ${dados.obs}</p>
</div>
<p class='data-rodape'>Emitido em ${dados.dataHoje}</p>
<div class='assinatura'>Wender Messias José da Silva<br>Vétus Gestão de Acesso</div>
</body>
</html>`;
}

function criarPDF(conteudo) {
  const janela = window.open(
    "",
    "_blank",
    "width=800,height=1000,scrollbars=yes",
  );
  janela.document.open();
  janela.document.write(conteudo);
  janela.document.close();
  janela.focus();
  setTimeout(() => janela.print(), 350);
}

// ------------------------------
// BOTÃO: GERAR E BAIXAR
// ------------------------------
document.getElementById("btn-gerar").addEventListener("click", function () {
  const dados = coletarDados();
  if (!validarDados(dados)) return;
  criarPDF(gerarReciboHTML(dados));
});

// ------------------------------
// BOTÃO: ENVIAR POR WHATSAPP
// ------------------------------
document.getElementById("btn-whatsapp").addEventListener("click", function () {
  const dados = coletarDados();
  if (!validarDados(dados)) return;
  if (!dados.whats) {
    alert("⚠️ Preencha o WhatsApp do cliente!");
    return;
  }

  const mensagem = `Olá ${dados.nome}! Tudo bem?

Aqui está o seu recibo referente ao serviço contratado:

${gerarReciboResumido(dados)}

Agradecemos pela confiança!
Qualquer dúvida, estamos à disposição.`;

  const numeroLimpo = dados.whats.replace(/\D/g, "");
  const url =
    "https://wa.me/55" + numeroLimpo + "?text=" + encodeURIComponent(mensagem);
  window.open(url, "_blank");
});

// ------------------------------
// BOTÃO: ENVIAR POR E-MAIL
// ------------------------------
document.getElementById("btn-email").addEventListener("click", function () {
  const dados = coletarDados();
  if (!validarDados(dados)) return;

  const assunto =
    "Recibo de Pagamento — " + dados.pacote + " — Vétus Gestão de Acesso";
  const corpo =
    "Olá " +
    dados.nome +
    "!\n\n" +
    "Segue abaixo o seu recibo referente ao serviço contratado:\n\n" +
    gerarReciboResumido(dados) +
    "\n\n" +
    "Agradecemos muito pela confiança! \n" +
    "Ficamos à disposição para quaisquer dúvidas.\n\n" +
    "Atenciosamente,\n" +
    "Wender Messias José da Silva\n" +
    "Vétus Gestão de Acesso\n" +
    "@vetusacessodigital";

  const link = document.createElement("a");
  link.href =
    "mailto:" +
    dados.email +
    "?subject=" +
    encodeURIComponent(assunto) +
    "&body=" +
    encodeURIComponent(corpo);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Inicializa ao carregar
verificarTipoPacote();
