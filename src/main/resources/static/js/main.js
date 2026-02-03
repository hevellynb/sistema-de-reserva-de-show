document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('token')) {
        window.location.href = '../index.html';
    } else {
        carregarShows();
    }
});

    function exibirShows(shows) {
        const container = document.getElementById('lista-shows');
        if (!container) return;
        
        container.innerHTML = ''; 

        if (!shows || shows.length === 0) {
            container.innerHTML = '<p class="column is-full has-text-centered">Nenhum show disponível no momento.</p>';
            return;
        }

        shows.forEach(show => {
            const nome = show.nome || 'Evento sem nome';
            const local = show.local || 'Não informado';
            const preco = typeof show.preco === 'number' ? show.preco.toFixed(2) : '0.00';
            
            let dataStr = 'Data não informada';
            if (show.dataHora) {
                const dataObj = new Date(show.dataHora);
                dataStr = dataObj.toLocaleString('pt-BR', { 
                    day: '2-digit', month: '2-digit', year: 'numeric', 
                    hour: '2-digit', minute: '2-digit' 
                });
            }

            container.innerHTML += `
                <div class="column is-4">
                    <div class="card" style="border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <div class="card-content">
                            <p class="title is-5 mb-3">${nome}</p>
                            
                            <div class="mb-4 is-size-6">
                                <p class="mb-1"><strong>Data:</strong> ${dataStr}</p>
                                <p><strong>Local:</strong> ${local}</p>
                            </div>

                            <p class="title is-4 has-text-primary mb-4">R$ ${preco}</p>
                            
                            <button class="button is-primary is-fullwidth" onclick="prepararReserva(${show.id})">
                                <strong>Reservar Ingresso</strong>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    }

document.addEventListener('DOMContentLoaded', () => {
    console.log("Página carregada, buscando dados...");
    carregarFiltros();
    
    filtrarPorCategoria(null); 
});

async function carregarShows() {
    const response = await fetchWithAuth('/shows'); 
    
    if (response && response.ok) {
        const shows = await response.json();
        const container = document.getElementById('lista-shows');
        container.innerHTML = ''; 

        if (shows.length === 0) {
            container.innerHTML = '<p class="column is-12">Nenhum show encontrado no banco de dados.</p>';
            return;
        }

    shows.forEach(show => {
    const dataFormatada = new Date(show.dataHora).toLocaleDateString('pt-BR');
    const horaFormatada = new Date(show.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    container.innerHTML += `
    <div class="column is-4">
        <div class="card" style="height: 100%;">
            <div class="card-content">
                <p class="title is-5 mb-3">${nome}</p>
                
                <div class="content is-size-6 mb-4">
                    <p class="mb-1"><strong>Data:</strong> ${dataStr}</p>
                    <p class="mb-0"><strong>Local:</strong> ${local}</p>
                </div>

                <p class="title is-4 has-text-primary mb-4">R$ ${preco}</p>
                
                <button class="button is-primary is-fullwidth is-medium" onclick="prepararReserva(${show.id})">
                    <strong>Reservar Ingresso</strong>
                </button>
            </div>
        </div>
    </div>
`   ;
});

    }
}

async function fazerReserva(showId) {
    const userId = localStorage.getItem('userId');
    const reservaData = { showId: showId, quantidade: 1 };

    try {
        const response = await fetchWithAuth(`/reservations?userId=${userId}`, {
            method: 'POST',
            body: JSON.stringify(reservaData)
        });

        if (response && response.ok) {
            alert('Sucesso! Sua reserva para o show foi confirmada.');
            window.location.href = 'minhas-reservas.html';
        } else {
            const erro = await response.json();
            alert('Erro: ' + (erro.message || 'Não foi possível completar a reserva.'));
        }
    } catch (error) {
        console.error("Erro ao reservar:", error);
        alert("Erro de conexão com o servidor.");
    }
}

async function carregarFiltros() {
    try {
        const token = localStorage.getItem('token');
         const response = await fetch('http://localhost:8080/categories', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const categorias = await response.json();
            const container = document.getElementById('filtro-categorias');
            
            container.innerHTML = '<button class="button is-light is-rounded" onclick="filtrarPorCategoria(null)">Todos</button>';

            categorias.forEach(cat => {
                container.innerHTML += `
                    <button class="button is-link is-light is-rounded" onclick="filtrarPorCategoria(${cat.id})">
                        ${cat.nome}
                    </button>
                `;
            });
        }
    } catch (error) {
        console.error("Erro ao carregar categorias:", error);
    }
}

async function filtrarPorCategoria(categoryId) {
    const listaContainer = document.getElementById('lista-shows');
    if (listaContainer) {
        listaContainer.innerHTML = '<p class="column is-full has-text-centered">Carregando eventos...</p>';
    }

    const url = categoryId 
        ? `http://localhost:8080/shows?categoryId=${categoryId}` 
        : 'http://localhost:8080/shows';

    try {
        const response = await fetch(url);
        if (response.ok) {
            const shows = await response.json();
            exibirShows(shows);
        } else {
            console.error("Erro na resposta do servidor:", response.status);
        }
    } catch (error) {
        console.error("Erro de conexão ao buscar shows:", error);
        if (listaContainer) {
            listaContainer.innerHTML = '<p class="column is-full has-text-centered has-text-danger">Erro ao conectar com o servidor.</p>';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carregarFiltros();
    
    filtrarPorCategoria(null); 
});

let precoShowSelecionado = 0;

function prepararReserva(id) {
    document.getElementById('modal-reserva').classList.add('is-active');
    document.getElementById('modal-show-id').value = id;
    document.getElementById('modal-quantidade').value = 1;

    fetch(`http://localhost:8080/shows/${id}`)
        .then(res => res.json())
        .then(show => {
            document.getElementById('modal-show-nome').innerText = show.nome;
            precoShowSelecionado = show.preco;
            calcularTotalModal();
        });
}

function calcularTotalModal() {
    const qtd = document.getElementById('modal-quantidade').value;
    const total = qtd * precoShowSelecionado;
    document.getElementById('modal-total-valor').innerText = `R$ ${total.toFixed(2)}`;
}

function fecharModal() {
    document.getElementById('modal-reserva').classList.remove('is-active');
}

async function confirmarReserva() {
    console.log("Botão clicado! Iniciando processo de reserva...");

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    
    const showId = document.getElementById('modal-show-id').value;
    const quantidade = document.getElementById('modal-quantidade').value;
    const metodo = document.getElementById('modal-metodo-pagamento').value;

    if (!showId || !quantidade || !metodo) {
        alert("Erro: Dados do formulário incompletos.");
        return;
    }

    if (quantidade <= 0) {
    alert("A quantidade deve ser pelo menos 1 ingresso.");
    return;
    }

    const dadosReserva = {
        showId: parseInt(showId),
        quantidade: parseInt(quantidade),
        metodoPagamento: metodo
    };

    console.log("Dados que serão enviados ao Java:", dadosReserva);

    try {
        const response = await fetch(`http://localhost:8080/reservations?userId=${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(dadosReserva)
        });

        if (response.ok) {
            alert("Reserva realizada com sucesso!");
            fecharModal();
            window.location.href = 'minhas-reservas.html'; 
        } else {
            const erroMsg = await response.text();
            console.error("Erro do servidor:", erroMsg);
            alert("Erro ao realizar reserva: " + erroMsg);
        }
    } catch (error) {
        console.error("Erro na comunicação:", error);
        alert("Não foi possível conectar ao servidor. Verifique se o Java está rodando.");
    }
}