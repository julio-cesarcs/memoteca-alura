import ui from "./ui.js";
import api from "./api.js";

function removerEspacos(string) {
  return string.replaceAll(/\s+/g, "");
}

const regexConteudo = /^[A-Za-z\s]{10,}$/;
const regexAutoria = /^[A-Za-z]{3,15}$/;

function validarConteudo(conteudo) {
  return regexConteudo.test(conteudo);
}

function validarAutoria(autoria) {
  return regexAutoria.test(autoria);
}

document.addEventListener("DOMContentLoaded", () => {
  ui.renderizarPensamentos();

  const formularioPensamento = document.getElementById("pensamento-form");
  const botaoCancelar = document.getElementById("botao-cancelar");
  const inputBusca = document.getElementById("campo-busca");

  formularioPensamento.addEventListener("submit", manipularSubmissaoFormulario);
  botaoCancelar.addEventListener("click", manipularCancelamento);
  inputBusca.addEventListener("input", manipularBusca);
});

async function manipularSubmissaoFormulario(event) {
  event.preventDefault();
  const id = document.querySelector("#pensamento-id").value;
  const conteudo = document.querySelector("#pensamento-conteudo").value;
  const autoria = document.querySelector("#pensamento-autoria").value;
  const data = document.querySelector("#pensamento-data").value;

  const conteudoSemEspacos = removerEspacos(conteudo);
  const autoriaSemEspacos = removerEspacos(autoria);

  if (!validarConteudo(conteudoSemEspacos)) {
    alert(
      "É permitida a inclusão apenas de letras e espaços com o mínimo de 10 caracteres"
    );
    return;
  }

  if (!validarAutoria(autoriaSemEspacos)) {
    alert(
      "É permitida a inclusão de letras e entre 3 e 15 caracteres sem espaços"
    );
    return;
  }

  if (!validarData(data)) {
    alert("Não é permitido cadastro de datas futuras, selecione outra data");
    return
  }

  try {
    if (id) {
      await api.editarPensamento({ id, conteudo, autoria, data });
    } else {
      await api.salvarPensamento({ conteudo, autoria, data });
    }
    ui.renderizarPensamentos();
  } catch {
    alert("Erro ao salvar pensamento");
  }
}

function manipularCancelamento() {
  ui.limparFormulario();
}

async function manipularBusca() {
  const termoBusca = document.getElementById("campo-busca").value;
  try {
    const pensamentosFiltrados = await api.buscarPensamentoPorTermo(termoBusca);
    ui.renderizarPensamentos(pensamentosFiltrados);
  } catch {
    alert("Erro ao realizar busca");
  }
}

function validarData(data) {
  const dataAtual = new Date();
  const dataInserida = new Date(data);

  return dataInserida <= dataAtual;
}
