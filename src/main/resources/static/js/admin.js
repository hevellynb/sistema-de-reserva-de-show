document.addEventListener('DOMContentLoaded', carregarShowsAdmin);
let listaDeShows = [];

async function carregarShowsAdmin() {
    const tabela = document.getElementById('tabela-admin-shows');
    if (!tabela) return;

    const response = await fetchWithAuth('/shows');
    if (response && response.ok) {
        listaDeShows = await response.json(); 
        tabela.innerHTML = '';

        listaDeShows.forEach(show => {
            tabela.innerHTML += `
                <tr>
                    <td>${show.nome}</td>
                    <td>${show.local}</td>
                    <td>${new Date(show.dataHora).toLocaleString('pt-BR')}</td>
                    <td>R$ ${show.preco.toFixed(2)}</td>
                    <td>${show.ingressosDisponiveis}</td>
                    <td>
                        <button class="button is-small is-info" onclick="prepararEdicao(${show.id})">Editar</button>
                        <button class="button is-small is-danger" onclick="deletarShow(${show.id})">Excluir</button>
                    </td>
                </tr>
            `;
        });
    }
}

function prepararEdicao(id) {
    const showEncontrado = listaDeShows.find(s => s.id === id);

    if (showEncontrado) {
        document.getElementById('show-id').value = showEncontrado.id;
        
        document.getElementById('show-nome').value = showEncontrado.nome;
        document.getElementById('show-descricao').value = showEncontrado.descricao || '';
        document.getElementById('show-local').value = showEncontrado.local;
        document.getElementById('show-totalIngressos').value = showEncontrado.ingressosDisponiveis;
        document.getElementById('show-preco').value = showEncontrado.preco;
        document.getElementById('show-categoryId').value = 1;
                
        if (showEncontrado.dataHora) {
            document.getElementById('show-dataHora').value = showEncontrado.dataHora.substring(0, 16);
        }

        document.getElementById('modal-show').classList.add('is-active');
        } else {
        console.error("Show não encontrado na lista local para o ID:", id);
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

    const metodo = id ? 'PUT' : 'POST';
    const url = id ? `/shows/${id}` : '/shows';

    const response = await fetchWithAuth(url, {
        method: metodo,
        body: JSON.stringify(showData)
    });

    if (response && response.ok) {
        alert(id ? "Show atualizado!" : "Show cadastrado!");
        fecharModal();
        carregarShowsAdmin();
    }
}

async function deletarShow(id) {
    if (confirm("Deseja realmente remover este show?")) {
        const response = await fetchWithAuth(`/shows/${id}`, {
            method: 'DELETE'
        });
        if (response && response.ok) {
            carregarShowsAdmin();
        }
    }
}

function mostrarRelatorios() {
    document.getElementById('container-shows').style.display = 'none';
    document.getElementById('container-relatorios').style.display = 'block';

    document.getElementById('link-shows').classList.remove('is-active');
    document.getElementById('link-relatorios').classList.add('is-active');

    gerarRelatorioFinanceiro();
}

async function gerarRelatorioFinanceiro() {
  try {
        const resRevenue = await fetchWithAuth('/admin/reports/revenue');
        const resSales = await fetchWithAuth('/admin/reports/sales-by-show');

        if (resRevenue.ok && resSales.ok) {
            const revenueData = await resRevenue.json(); 
            const salesData = await resSales.json();     
            
            document.getElementById('total-receita').innerText = `R$ ${revenueData.faturamentoTotal.toFixed(2)}`;
            document.getElementById('total-ingressos').innerText = revenueData.totalReservas;

            const tabela = document.getElementById('tabela-relatorio-vendas');
            tabela.innerHTML = '';
            
            salesData.forEach(item => {
                tabela.innerHTML += `
                    <tr>
                        <td>${item.showNome}</td>
                        <td>${item.totalIngressos}</td>
                        <td>R$ ${item.faturamento.toFixed(2)}</td>
                    </tr>`;
            });
        }
    } catch (error) {
        console.error("Erro ao carregar relatórios:", error);
        alert("Erro ao carregar dados do relatório.");
    }
}

function irParaShows() {
   document.getElementById('container-shows').style.display = 'block';
    document.getElementById('container-relatorios').style.display = 'none';

    document.getElementById('link-shows').classList.add('is-active');
    document.getElementById('link-relatorios').classList.remove('is-active');

    carregarShowsAdmin();
}
