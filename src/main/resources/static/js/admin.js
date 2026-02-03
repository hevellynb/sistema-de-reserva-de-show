document.addEventListener("DOMContentLoaded", () => {
    carregarShowsAdmin();
    carregarCategoriasAdmin();
});

let listaDeShows = [];

function ocultarTodosContainers() {
    const ids = ["container-shows", "container-relatorios", "container-categorias"];
    const links = ["link-shows", "link-relatorios", "link-categorias"];
    
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
    });
    
    links.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove("is-active");
    });
}

function irParaShows() {
    ocultarTodosContainers();
    document.getElementById("container-shows").style.display = "block";
    document.getElementById("link-shows").classList.add("is-active");
    carregarShowsAdmin();
}

function mostrarCategorias() {
    ocultarTodosContainers();
    document.getElementById("container-categorias").style.display = "block";
    document.getElementById("link-categorias").classList.add("is-active");
    carregarCategoriasAdmin();
}

function mostrarRelatorios() {
    ocultarTodosContainers();
    document.getElementById("container-relatorios").style.display = "block";
    document.getElementById("link-relatorios").classList.add("is-active");
    carregarRelatorioCompleto();
}

async function carregarShowsAdmin() {
    const tabela = document.getElementById("tabela-admin-shows");
    if (!tabela) return;

    tabela.innerHTML = ""; 

    const response = await fetch("http://localhost:8080/shows", {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });

    if (response.ok) {
        listaDeShows = await response.json();
        
        listaDeShows.forEach((show) => {
            const precoFormatado = typeof show.preco === "number" ? show.preco.toFixed(2) : "0.00";
            
            tabela.innerHTML += `
                <tr>
                    <td>${show.nome}</td>
                    <td>${show.local || "Não informado"}</td>
                    <td>${new Date(show.dataHora).toLocaleString("pt-BR")}</td>
                    <td>R$ ${precoFormatado}</td>
                    <td>${show.totalIngressos || 0}</td> 
                    <td>
                        <div class="buttons">
                            <button class="button is-small is-info" onclick="prepararEdicao(${show.id})">Editar</button>
                            <button class="button is-small is-danger" onclick="deletarShow(${show.id})">Excluir</button>
                        </div>
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

    const url = id ? `http://localhost:8080/admin/shows/${id}` : 'http://localhost:8080/admin/shows';
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
        alert("Erro ao salvar: Verifique os campos ou sua permissão.");
    }
}

async function deletarShow(id) {
    if (!confirm("Remover este show?")) return;
    
    const response = await fetch(`http://localhost:8080/admin/shows/${id}`, { 
        method: "DELETE",
        headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
        }
    });

    if (response.ok) {
        alert("Show desativado com sucesso!");
        carregarShowsAdmin();
    } else {
        alert("Erro ao remover show.");
    }
}

function prepararEdicao(id) {
    const show = listaDeShows.find(s => s.id === id);
    if (show) {
        document.getElementById('show-id').value = show.id;
        document.getElementById('show-nome').value = show.nome;
        document.getElementById('show-descricao').value = show.descricao;
        document.getElementById('show-local').value = show.local || "";
        document.getElementById('show-totalIngressos').value = show.totalIngressos; 
        document.getElementById('show-preco').value = show.preco;

        if (show.dataHora) {
            document.getElementById('show-dataHora').value = show.dataHora.substring(0, 16);
        }

        const selectCategoria = document.getElementById('show-categoryId');
        if (selectCategoria) selectCategoria.value = show.categoryId; 
        
        document.getElementById('modal-show').classList.add('is-active');
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
            if (selectShow) selectShow.innerHTML = '<option value="">Selecione uma categoria</option>';

            categorias.forEach((cat) => {
                if (tabela) {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td>${cat.id}</td>
                        <td>${cat.nome}</td>
                        <td>
                            <button class="button is-small is-danger" onclick="deletarCategoria(${cat.id})">Excluir</button>
                        </td>`;
                    tabela.appendChild(tr);
                }
                if (selectShow) {
                    const option = document.createElement("option");
                    option.value = cat.id;
                    option.text = cat.nome;
                    selectShow.appendChild(option);
                }
            }); 
        }
    } catch (error) { console.error("Erro categorias:", error); }
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
    if (!confirm("Deseja desativar esta categoria?")) return;
    const response = await fetch(`http://localhost:8080/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    if (response.ok) {
        alert("Categoria desativada!"); 
        carregarCategoriasAdmin(); 
    }
}


async function carregarRelatorioCompleto() {
    try {
        const response = await fetch("http://localhost:8080/reservations/report", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (response.ok) {
            const dados = await response.json();
            const aprovadas = dados.filter(r => r.status === "APROVADA");
            
            document.getElementById("total-receita").innerText = `R$ ${aprovadas.reduce((sum, r) => sum + r.valorTotal, 0).toFixed(2)}`;
            document.getElementById("total-ingressos").innerText = aprovadas.reduce((sum, r) => sum + r.quantidade, 0);

            preencherTabelaHtml(aprovadas, "tabela-relatorio-vendas");
            preencherTabelaHtml(dados.filter(r => r.status === "PENDENTE"), "tabela-relatorio-pendentes");
            preencherTabelaHtml(dados.filter(r => r.status === "CANCELADA"), "tabela-relatorio-cancelados");
        }
    } catch (error) { console.error("Erro relatório:", error); }
}

function preencherTabelaHtml(lista, idCorpo) {
    const corpo = document.getElementById(idCorpo);
    if (!corpo) return;
    corpo.innerHTML = lista.length === 0 ? '<tr><td colspan="3">Sem dados</td></tr>' : "";
    lista.forEach(item => {
        corpo.innerHTML += `<tr><td><strong>${item.show}</strong></td><td>${item.quantidade}</td><td>R$ ${item.valorTotal.toFixed(2)}</td></tr>`;
    });
}

function abrirModalNovoShow() {
  document.getElementById('show-id').value = ""; 
    document.getElementById('form-show').reset();
    const modalTitle = document.querySelector('#modal-show .title');
    if (modalTitle) modalTitle.innerText = "Configurar Novo Show";
    document.getElementById('modal-show').classList.add('is-active');
}

function fecharModal() { document.getElementById('modal-show').classList.remove('is-active'); }
function fecharModalCategoria() { document.getElementById("modal-categoria").classList.remove("is-active"); }
function abrirModalCategoria() { document.getElementById("modal-categoria").classList.add("is-active"); }