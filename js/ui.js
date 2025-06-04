import api from "./api.js";

const ui = {
  async preencherFormulario(pensamentoId) {
    const pensamento = await api.buscarPensamentoPorId(pensamentoId);
    document.getElementById("pensamento-id").value = pensamento.id;
    document.getElementById("pensamento-conteudo").value = pensamento.conteudo;
    document.getElementById("pensamento-autoria").value = pensamento.autoria;
  },

  limparFormulario() {
    document.getElementById("pensamento-form").reset();
  },

  async renderizarPensamentos(pensamentosFiltrados = null) {
    const listaPensamentos = document.getElementById("lista-pensamentos");
    const mensagemVazia = document.getElementById("mensagem-vazia");
    listaPensamentos.innerHTML = "";

    try {
      let pensamentoParaRenderizar;
      if (pensamentosFiltrados) {
        pensamentoParaRenderizar = pensamentosFiltrados;
      } else {
        pensamentoParaRenderizar = await api.buscarPensamentos();
      }
      if (pensamentoParaRenderizar.length === 0) {
        mensagemVazia.style.display = "block";
      } else {
        mensagemVazia.style.display = "none";
        pensamentoParaRenderizar.forEach(ui.adicionarPensamentoNaLista);
      }
    } catch {
      alert("Erro ao renderizar pensamentos");
    }
  },

  adicionarPensamentoNaLista(pensamento) {
    const listaPensamentos = document.getElementById("lista-pensamentos");
    const li = document.createElement("li");
    li.setAttribute("data-id", pensamento.id);
    li.classList.add("li-pensamento");

    const iconeAspas = document.createElement("img");
    iconeAspas.src = "assets/imagens/aspas-azuis.png";
    iconeAspas.alt = "Aspas azuis";
    iconeAspas.classList.add("icone-aspas");

    const pensamentoConteudo = document.createElement("div");
    pensamentoConteudo.textContent = pensamento.conteudo;
    pensamentoConteudo.classList.add("pensamento-conteudo");

    const pensamentoAutoria = document.createElement("div");
    pensamentoAutoria.textContent = pensamento.autoria;
    pensamentoAutoria.classList.add("pensamento-autoria");

    const botaoFavorito = document.createElement("button");
    botaoFavorito.classList.add("botao-favorito");
    botaoFavorito.onclick = async() => {
      try{
      await api.atualizarFavorito(pensamento.id, !pensamento.favorito)
      ui.renderizarPensamentos()
    }catch{
      alert("Erro ao atualizar favorito")

    }
    };

    const iconeFavorito = document.createElement("img");
    iconeFavorito.src = pensamento.favorito ?
    "assets/imagens/icone-favorito.png":
    "assets/imagens/icone-favorito_outline.png";
    iconeFavorito.alt = "Favorito";
    botaoFavorito.appendChild(iconeFavorito);

    const botaoEditar = document.createElement("button");
    botaoEditar.classList.add("botao-editar");
    botaoEditar.onclick = () => ui.preencherFormulario(pensamento.id);

    const iconeEditar = document.createElement("img");
    iconeEditar.src = "assets/imagens/icone-editar.png";
    iconeEditar.alt = "Editar";
    botaoEditar.appendChild(iconeEditar);

    const botaoExcluir = document.createElement("button");
    botaoExcluir.classList.add("botao-excluir");
    botaoExcluir.onclick = async () => {
      try {
        await api.excluirPensamento(pensamento.id);
        ui.renderizarPensamentos();
      } catch (error) {
        alert("Erro ao excluir pensamento");
      }
    };

    const iconeExcluir = document.createElement("img");
    iconeExcluir.src = "assets/imagens/icone-excluir.png";
    iconeExcluir.alt = "Excluir";
    botaoExcluir.appendChild(iconeExcluir);

    const icones = document.createElement("div");
    icones.classList.add("icones");
    icones.append(botaoFavorito, botaoEditar, botaoExcluir);

    li.append(iconeAspas, pensamentoConteudo, pensamentoAutoria, icones);
    listaPensamentos.appendChild(li);
  },
};

export default ui;
