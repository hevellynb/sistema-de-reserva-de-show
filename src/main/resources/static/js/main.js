document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("token")) {
    window.location.href = "../index.html";
  } else {
    carregarFiltros();
    aplicarFiltros();
  }
});

async function carregarFiltros() {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("http://localhost:8080/categories", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const categorias = await response.json();
      const select = document.getElementById("filtro-categoria-select");
      categorias.forEach((cat) => {
        select.innerHTML += `<option value="${cat.id}">${cat.nome}</option>`;
      });
    }
  } catch (error) {
    console.error("Erro ao carregar categorias:", error);
  }
}

async function aplicarFiltros() {

  const data = document.getElementById("filtro-data").value;
  const categoryId = document.getElementById("filtro-categoria-select").value;
  const listaContainer = document.getElementById("lista-shows");

  listaContainer.innerHTML =
    '<p class="column is-full has-text-centered">Buscando shows...</p>';

  let url = "http://localhost:8080/shows?";
  if (categoryId) url += `categoryId=${categoryId}&`;
  if (data) url += `data=${data}`;

  try {
    const response = await fetch(url);
    if (response.ok) {
      const shows = await response.json();
      exibirShows(shows);
    } else {
      listaContainer.innerHTML =
        '<p class="column is-full has-text-centered">Erro ao buscar shows.</p>';
    }
  } catch (error) {
    console.error("Erro na requisição de filtros:", error);
  }
}

function exibirShows(shows) {
  
 const container = document.getElementById("lista-shows");
  if (!container) return;

  container.innerHTML = "";

  if (!shows || shows.length === 0) {
    container.innerHTML =
      '<p class="column is-full has-text-centered">Nenhum show encontrado para este filtro.</p>';
    return;
  }

  shows.forEach((show) => {
    const preco = typeof show.preco === "number" ? show.preco.toFixed(2) : "0.00";
    const dataObj = new Date(show.dataHora);
    const dataStr = dataObj.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const estoque = show.ingressosDisponiveis;
    const estaEsgotado = estoque <= 0;
    const tagEstoque = !estaEsgotado 
        ? `<span class="tag is-success is-light">${estoque} disponíveis</span>`
        : `<span class="tag is-danger is-light">Esgotado</span>`;

    container.innerHTML += `
      <div class="column is-4">
        <div class="card" style="border-radius: 10px; height: 100%; display: flex; flex-direction: column;">
          <div class="card-content" style="flex-grow: 1;">
            <div class="is-flex is-justify-content-space-between is-align-items-start mb-3">
              <p class="title is-5 mb-0">${show.nome}</p>
              ${tagEstoque}
            </div>
            
            <div class="is-size-6 mb-4">
              <p><strong>Data:</strong> ${dataStr}</p>
              <p><strong>Local:</strong> ${show.local || "Não informado"}</p>
              <p><strong>Estilo:</strong> ${show.categoryName || "Geral"}</p>
            </div>

            <p class="title is-4 has-text-primary mb-5">R$ ${preco}</p>
            
            <button class="button is-link is-fullwidth" 
                    onclick="prepararReserva(${show.id})" 
                    ${estaEsgotado ? 'disabled' : ''}>
                <strong>${estaEsgotado ? 'Indisponível' : 'Reservar Ingresso'}</strong>
            </button>
          </div>
        </div>
      </div>
    `;
  });
}

function limparFiltros() {
  document.getElementById("filtro-data").value = "";
  document.getElementById("filtro-categoria-select").value = "";
  aplicarFiltros();
}

let precoShowSelecionado = 0;
let estoqueDisponivelSelecionado = 0;

function prepararReserva(id) {
  document.getElementById("modal-reserva").classList.add("is-active");
  document.getElementById("modal-show-id").value = id;

  fetch(`http://localhost:8080/shows/${id}`)
    .then((res) => res.json())
    .then((show) => {
      document.getElementById("modal-show-nome").innerText = show.nome;
      precoShowSelecionado = show.preco;
      
      estoqueDisponivelSelecionado = show.ingressosDisponiveis; 

      const inputQtd = document.getElementById("modal-quantidade");
      
      inputQtd.min = 1; 
      inputQtd.max = estoqueDisponivelSelecionado;
      
      inputQtd.value = estoqueDisponivelSelecionado > 0 ? 1 : 0;
      inputQtd.disabled = estoqueDisponivelSelecionado <= 0;

      calcularTotalModal();
    });
}

function calcularTotalModal() {
  const qtd = document.getElementById("modal-quantidade").value;
  const total = qtd * precoShowSelecionado;
  document.getElementById("modal-total-valor").innerText =
    `R$ ${total.toFixed(2)}`;
}

function fecharModal() {
  document.getElementById("modal-reserva").classList.remove("is-active");
}

async function confirmarReserva() {

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const showId = document.getElementById("modal-show-id").value;
  const quantidade = parseInt(document.getElementById("modal-quantidade").value);
  const metodo = document.getElementById("modal-metodo-pagamento").value;

  if (quantidade <= 0) {
    alert("A quantidade de ingressos deve ser maior que zero.");
    return;
  }

  if (quantidade > estoqueDisponivelSelecionado) {
    alert(`Desculpe, restam apenas ${estoqueDisponivelSelecionado} ingressos para este show.`);
    return;
  }

  const dadosReserva = {
    showId: parseInt(showId),
    quantidade: quantidade,
    metodoPagamento: metodo,
  };

  try {
    const response = await fetch(
      `http://localhost:8080/reservations?userId=${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dadosReserva),
      }
    );

    if (response.ok) {
      alert("Reserva realizada com sucesso!");
      window.location.href = "minhas-reservas.html";
    } else {
      const erroMsg = await response.text();
      alert("Erro: " + erroMsg); 
    }
  } catch (error) {
    alert("Erro de conexão com o servidor.");
  }
}

async function excluirMinhaConta() {
  if (!confirm("Tem certeza que deseja excluir sua conta?")) return;

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const response = await fetch(`http://localhost:8080/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    alert("Conta excluída com sucesso.");
    localStorage.clear();
    window.location.href = "../index.html";
  } else {
    alert("Erro ao excluir conta: Verifique as permissões no servidor.");
  }
}
