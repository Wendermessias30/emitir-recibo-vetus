// ==================================================
// EMITIR RECIBO — COMPLETO COM REGEX E VALIDAÇÃO
// ==================================================

// ------------------------------
// MÁSCARA CPF com Regex
// ------------------------------
function aplicarMascaraCPF(valor) {
  valor = valor.replace(/\D/g, "");
  valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
  valor = valor.replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
  valor = valor.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})$/, "$1.$2.$3-$4");
  return valor;
}

// ------------------------------
// VALIDAÇÃO DE FORMATO com Regex
// ------------------------------
function validarFormatoCPF(cpf) {
  const regexCPF = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  return regexCPF.test(cpf);
}

// ------------------------------
// VALIDAÇÃO COMPLETA (dígitos verificadores)
// ------------------------------
function validarCPFCompleto(cpf) {
  const numeros = cpf.replace(/\D/g, "");

  if (numeros.length !== 11) return false;
  if (/^(\d)\1+$/.test(numeros)) return false;

  const digitos = numeros.split("").map(Number);

  let soma1 = 0;
  for (let i = 0; i < 9; i++) {
    soma1 += digitos[i] * (10 - i);
  }
  const dv1 = (soma1 * 10) % 11;
  const digito1 = dv1 === 10 ? 0 : dv1;
  if (digito1 !== digitos[9]) return false;

  let soma2 = 0;
  for (let i = 0; i < 10; i++) {
    soma2 += digitos[i] * (11 - i);
  }
  const dv2 = (soma2 * 10) % 11;
  const digito2 = dv2 === 10 ? 0 : dv2;
  if (digito2 !== digitos[10]) return false;

  return true;
}

// ------------------------------
// EXIBIR ERRO NA TELA
// ------------------------------
function mostrarErroCPF(mensagem) {
  const input = document.getElementById("rec-cpf");
  const erro = document.getElementById("rec-cpf-erro");

  if (mensagem) {
    input.classList.add("invalido");
    erro.textContent = mensagem;
  } else {
    input.classList.remove("invalido");
    erro.textContent = "";
  }
}

// ------------------------------
// VALIDAÇÃO EM TEMPO REAL
// ------------------------------
document.getElementById("rec-cpf").addEventListener("input", function () {
  this.value = aplicarMascaraCPF(this.value);

  if (this.value.length === 0) {
    mostrarErroCPF("");
  } else if (!validarFormatoCPF(this.value)) {
    mostrarErroCPF("Formato incompleto. Use: 000.000.000-00");
  } else if (!validarCPFCompleto(this.value)) {
    mostrarErroCPF("CPF inválido! Verifique os números.");
  } else {
    mostrarErroCPF("");
  }
});

// ------------------------------
// CRIAR PDF
// ------------------------------
function criarPDF(conteudo, nomeArquivo) {
  const janela = window.open(
    "",
    "_blank",
    "width=800,height=1000,scrollbars=yes",
  );
  janela.document.open();
  janela.document.write(conteudo);
  janela.document.close();
  janela.focus();
  setTimeout(function () {
    janela.print();
  }, 350);
}

// ------------------------------
// GERAR RECIBO
// ------------------------------
function gerarReciboPDF() {
  const nome = document.getElementById("rec-nome").value.trim();
  const cpf = document.getElementById("rec-cpf").value;
  const pacoteValor = document.getElementById("rec-pacote").value.split("|");
  const pacote = pacoteValor[0];
  const valor = pacoteValor[1];
  const pagamento = document.getElementById("rec-forma").value;
  const obs =
    document.getElementById("rec-obs").value.trim() || "Sem observações";
  const dataHoje = new Date().toLocaleDateString("pt-BR");
  const valorFormatado = "R$ " + parseFloat(valor).toFixed(2).replace(".", ",");

  // VALIDAÇÕES
  if (!nome) {
    alert("⚠️ Digite o nome do cliente!");
    return;
  }
  if (!validarFormatoCPF(cpf)) {
    alert("⚠️ Digite o CPF no formato: 000.000.000-00");
    return;
  }
  if (!validarCPFCompleto(cpf)) {
    alert("⚠️ CPF inválido! Corrija antes de emitir.");
    return;
  }

  // MONTA O RECIBO
  const reciboHTML =
    "<html>" +
    "<head>" +
    "<meta charset='UTF-8'>" +
    "<title>Recibo de Pagamento</title>" +
    "<style>" +
    "body { font-family: Arial; padding: 40px; font-size: 14px; line-height: 1.8; }" +
    "h1 { color: #0A2357; font-size: 26px; text-align: center; border-bottom: 3px solid #D4AF37; padding-bottom: 15px; margin-bottom: 30px; }" +
    ".cabecalho { text-align: center; margin-bottom: 30px; }" +
    ".cabecalho p { margin: 5px 0; color: #333; }" +
    ".dados { margin: 25px 0; }" +
    ".dados p { margin: 10px 0; font-size: 16px; }" +
    ".valor { font-size: 22px; font-weight: bold; color: #B8860B; margin: 20px 0; }" +
    ".assinatura { margin-top: 80px; border-top: 1px solid #333; padding-top: 20px; width: 300px; text-align: center; margin-left: auto; margin-right: auto; }" +
    ".data-rodape { text-align: right; margin-top: 30px; color: #555; }" +
    "</style>" +
    "</head>" +
    "<body>" +
    "<h1>RECIBO DE PAGAMENTO</h1>" +
    "<div class='cabecalho'>" +
    "<p><strong>VÉTUS GESTÃO DE ACESSO</strong></p>" +
    "<p>Wender M.J da Silva — CPF: 093.112.766-18</p>" +
    "<p>@vetusacessodigital</p>" +
    "</div>" +
    "<div class='dados'>" +
    "<p><strong>Recebi de:</strong> " +
    nome +
    "</p>" +
    "<p><strong>CPF:</strong> " +
    cpf +
    "</p>" +
    "<p><strong>Serviço:</strong> " +
    pacote +
    "</p>" +
    "<p class='valor'>Valor: " +
    valorFormatado +
    "</p>" +
    "<p><strong>Forma de pagamento:</strong> " +
    pagamento +
    "</p>" +
    "<p><strong>Observações:</strong> " +
    obs +
    "</p>" +
    "</div>" +
    "<p class='data-rodape'>,Emitido em " +
    dataHoje +
    "</p>" +
    "<div class='assinatura'>" +
    "Wender Messias José da Silva<br>Vétus Gestão de Acesso" +
    "</div>" +
    "</body>" +
    "</html>";

  criarPDF(reciboHTML, "Recibo de Pagamento");
}

// ------------------------------
// INICIALIZAÇÃO
// ------------------------------
document.getElementById("btn-gerar").addEventListener("click", gerarReciboPDF);
