document.addEventListener('DOMContentLoaded', carregarMinhasReservas);

async function carregarMinhasReservas() {
    const userId = localStorage.getItem('userId'); 
    const token = localStorage.getItem('token');
    const tabela = document.getElementById('tabela-reservas');

    if (!tabela) return; 

    try {
        const response = await fetch(`http://localhost:8080/reservations?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const reservas = await response.json();
            tabela.innerHTML = '';

            if (reservas.length === 0) {
                tabela.innerHTML = '<tr><td colspan="6" class="has-text-centered">Você ainda não possui compras.</td></tr>';
                return;
            }

            reservas.forEach(res => {
                const statusClass = {
                    'PENDENTE': 'is-warning',
                    'APROVADA': 'is-success',
                    'CANCELADA': 'is-danger'
                }[res.status] || 'is-info';

                const hoje = new Date();
                const dataDoShow = new Date(res.dataReserva);
                let acaoBotao = '';

                if (res.status === 'PENDENTE') {
                    if (dataDoShow >= hoje) {
                        // btn-principal-client para o verde água (Aqua)
                        // btn-cancelar-reserva para o roxo com borda
                        acaoBotao = `
                            <button class="button is-small btn-principal-client" onclick="confirmarPagamento(${res.id})">
                                Confirmar Pgt
                            </button>
                            <button class="button is-small btn-cancelar-reserva ml-2" onclick="cancelarReserva(${res.id})">
                                Cancelar
                            </button>
                        `;
                    } else {
                        acaoBotao = `<small class="has-text-grey-light">Evento Expirado</small>`;
                    }
                }

                tabela.innerHTML += `
                <tr>
                    <td><strong>${res.show}</strong></td>
                    <td>${dataDoShow.toLocaleDateString('pt-BR')}</td>
                    <td>${res.quantidade}x</td>
                    <td class="preco-destaque">R$ ${res.valorTotal.toFixed(2)}</td>
                    <td><span class="tag ${statusClass}">${res.status}</span></td>
                    <td>${acaoBotao}</td> </tr>`;
            });
        }
    } catch (error) {
        console.error("Erro de conexão:", error);
    }
}

async function confirmarPagamento(reservationId) {
   if (!confirm("Deseja confirmar que o pagamento foi realizado?")) return;
    const token = localStorage.getItem('token');
    const url = `http://localhost:8080/reservations/${reservationId}/confirm-payment`;

    try {
        const response = await fetch(url, {
            method: 'PATCH', 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert("Pagamento confirmado com sucesso!");
            location.reload();
        } else {
            const erroMsg = await response.text();
            alert("Erro ao confirmar: " + erroMsg);
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro de conexão com o servidor.");
    }
}

async function cancelarReserva(reservationId) {
    if (!confirm("Tem certeza que deseja cancelar esta reserva? Os ingressos voltarão para o estoque.")) return;
    const token = localStorage.getItem('token');
    const url = `http://localhost:8080/reservations/${reservationId}`;

    try {
        const response = await fetch(url, {
            method: 'DELETE', 
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            alert("Reserva cancelada com sucesso!");
            location.reload(); 
        } else {
            const erroMsg = await response.text();
            alert("Erro ao cancelar: " + erroMsg);
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro de conexão com o servidor.");
    }
}

function logout() {
    localStorage.clear();
    window.location.href = '../index.html';
}