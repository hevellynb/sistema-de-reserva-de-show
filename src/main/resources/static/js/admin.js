document.addEventListener("DOMContentLoaded", () => {
  carregarShowsAdmin();
  carregarCategoriasAdmin();
});

let listaDeShows = [];


function mostrarRelatorios() {
  ocultarTodosContainers();
  document.getElementById("container-relatorios").style.display = "block";
  document.getElementById("link-relatorios").classList.add("is-active");
  carregarRelatorioCompleto(); 
}

function irParaShows() {
  ocultarTodosContainers();
  document.getElementById("container-shows").style.display = "block";
  document.getElementById("link-shows").classList.add("is-active");
  carregarShowsAdmin();
}

function mostrarCategorias() {
  const shows = document.getElementById("container-shows");
  const relatorios = document.getElementById("container-relatorios");
  const categorias = document.getElementById("container-categorias");

  if (shows) shows.style.display = "none";
  if (relatorios) relatorios.style.display = "none";

  if (categorias) {
    categorias.style.display = "block";
  }

  document.getElementById("link-shows").classList.remove("is-active");
  document.getElementById("link-relatorios").classList.remove("is-active");
  document.getElementById("link-categorias").classList.add("is-active");

  carregarCategoriasAdmin();
}

function ocultarTodosContainers() {
  const ids = [
    "container-shows",
    "container-relatorios",
    "container-categorias",
  ];
  const links = ["link-shows", "link-relatorios", "link-categorias"];
  ids.forEach((id) => {
    if (document.getElementById(id))
      document.getElementById(id).style.display = "none";
  });
  links.forEach((id) => {
    if (document.getElementById(id))
      document.getElementById(id).classList.remove("is-active");
  });
}

async function carregarShowsAdmin() {
  const tabela = document.getElementById("tabela-admin-shows");
  if (!tabela) return;

  const response = await fetchWithAuth("/shows");
  if (response && response.ok) {
    listaDeShows = await response.json();
    tabela.innerHTML = "";
    listaDeShows.forEach((show) => {
      tabela.innerHTML += `
                <tr>
                    <td>${show.nome}</td>
                    <td>${show.local || "Não informado"}</td>
                    <td>${new Date(show.dataHora).toLocaleString("pt-BR")}</td>
                    <td>R$ ${show.preco.toFixed(2)}</td>
                    <td>${show.ingressosDisponiveis}</td>
                    <td>
                        <button class="button is-small is-info" onclick="prepararEdicao(${show.id})">Editar</button>
                        <button class="button is-small is-danger" onclick="deletarShow(${show.id})">Excluir</button>
                    </td>
                </tr>`;
    });
  }
}

async function salvarShow(event) {
 event.preventDefault();
    const id = document.getElementById('show-id').value;
    
    const showData = {
        nome: document.getElementById('show-nome').value,
        descricao: document.getElementById('show-descricao').value,
        dataHora: document.getElementById('show-dataHora').value, 
        local: document.getElementById('show-local').value,
        totalIngressos: parseInt(document.getElementById('show-totalIngressos').value),
        preco: parseFloat(document.getElementById('show-preco').value),
        categoryId: parseInt(document.getElementById('show-categoryId').value)
    };

    const url = id ? `http://localhost:8080/shows/${id}` : 'http://localhost:8080/shows';
    const method = id ? 'PUT' : 'POST';

    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(showData)
    });

    if (response.ok) {
        alert(id ? "Show atualizado com sucesso!" : "Show criado!");
        fecharModal();
        carregarShowsAdmin();
    } else {
        const erroMsg = await response.text();
        console.error("Erro do servidor:", erroMsg);
        alert("Erro ao salvar: Verifique os campos do formulário.");
    }
}

async function carregarCategoriasAdmin() {
  try {
    const response = await fetch("http://localhost:8080/categories", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    if (response.ok) {
      const categorias = await response.json();
      const tabela = document.getElementById("tabela-categorias");
      const selectShow = document.getElementById("show-categoryId");

      if (tabela) tabela.innerHTML = "";
      if (selectShow)
        selectShow.innerHTML =
          '<option value="">Selecione uma categoria</option>';

      categorias.forEach((cat) => {
        if (tabela) {
          tabela.innerHTML += `
                        <tr>
                            <td>${cat.id}</td>
                            <td>${cat.nome}</td>
                            <td><button class="button is-small is-danger" onclick="deletarCategoria(${cat.id})">Excluir</button></td>
                        </tr>`;
        }
        if (selectShow) {
          selectShow.innerHTML += `<option value="${cat.id}">${cat.nome}</option>`;
        }
      });
    }
  } catch (error) {
    console.error("Erro ao carregar categorias:", error);
  }
}

async function salvarCategoria(event) {
  event.preventDefault();
  const nome = document.getElementById("categoria-nome").value;
  const response = await fetch("http://localhost:8080/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ nome: nome }),
  });

  if (response.ok) {
    alert("Categoria cadastrada!");
    fecharModalCategoria();
    carregarCategoriasAdmin();
  }
}

async function deletarCategoria(id) {
  if (confirm("Deseja excluir esta categoria?")) {
    const response = await fetch(`http://localhost:8080/categories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (response.ok) carregarCategoriasAdmin();
    else alert("Erro: Verifique se existem shows vinculados a esta categoria.");
  }
}

async function carregarRelatorioCompleto() {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("http://localhost:8080/reservations/report", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      const todasReservas = await response.json();
      const aprovadas = todasReservas.filter((r) => r.status === "APROVADA");
      const pendentes = todasReservas.filter((r) => r.status === "PENDENTE");
      const canceladas = todasReservas.filter((r) => r.status === "CANCELADA");

      document.getElementById("total-receita").innerText =
        `R$ ${aprovadas.reduce((sum, r) => sum + r.valorTotal, 0).toFixed(2)}`;
      document.getElementById("total-ingressos").innerText = aprovadas.reduce(
        (sum, r) => sum + r.quantidade,
        0,
      );

      preencherTabelaHtml(aprovadas, "tabela-relatorio-vendas");
      preencherTabelaHtml(pendentes, "tabela-relatorio-pendentes");
      preencherTabelaHtml(canceladas, "tabela-relatorio-cancelados");
    }
  } catch (error) {
    console.error("Erro no relatório:", error);
  }
}

function preencherTabelaHtml(lista, idCorpo) {
  const corpo = document.getElementById(idCorpo);
  if (!corpo) return;
  corpo.innerHTML =
    lista.length === 0
      ? '<tr><td colspan="3" class="has-text-centered">Sem dados</td></tr>'
      : "";
  lista.forEach((item) => {
    corpo.innerHTML += `<tr><td><strong>${item.show}</strong></td><td>${item.quantidade}</td><td>R$ ${item.valorTotal.toFixed(2)}</td></tr>`;
  });
}

function abrirModalCategoria() {
  document.getElementById("modal-categoria").classList.add("is-active");
}
function fecharModalCategoria() {
  document.getElementById("modal-categoria").classList.remove("is-active");
  document.getElementById("form-categoria").reset();
}
function deletarShow(id) {
  if (confirm("Remover este show?"))
    fetchWithAuth(`/shows/${id}`, { method: "DELETE" }).then((res) => {
      if (res.ok) carregarShowsAdmin();
    });
}

function prepararEdicao(id) {
    const show = listaDeShows.find(s => s.id === id);
    
    if (show) {
        document.querySelector('#modal-show .title').innerText = "Editar Show";

        document.getElementById('show-id').value = show.id;
        document.getElementById('show-nome').value = show.nome;
        document.getElementById('show-descricao').value = show.descricao;
        document.getElementById('show-local').value = show.local;
        document.getElementById('show-totalIngressos').value = show.totalIngressos;
        document.getElementById('show-preco').value = show.preco;

        if (show.dataHora) {
            document.getElementById('show-dataHora').value = show.dataHora.substring(0, 16);
        }

        const selectCategoria = document.getElementById('show-categoryId');
        if (selectCategoria) {
            selectCategoria.value = show.categoryId || "";
        }
        
        abrirModalShow();
    }
}
