document.addEventListener("DOMContentLoaded", carregarMinhasReservas);

async function carregarMinhasReservas() {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const tabela = document.getElementById("tabela-reservas");

  if (!tabela) return;

  try {
    const response = await fetch(
      `http://localhost:8080/reservations?userId=${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (response.ok) {
      const reservas = await response.json();
      tabela.innerHTML = "";

      if (!reservas || reservas.length === 0) {
        tabela.innerHTML =
          '<tr><td colspan="6" class="has-text-centered">Nenhuma compra encontrada.</td></tr>';
        return;
      }

      reservas.forEach((res) => {
        let dataFormatada = "Data indisponível";
        try {
          if (res.dataReserva) {
            const dataObj = new Date(res.dataReserva);
            dataFormatada = dataObj.toLocaleDateString("pt-BR");
          }
        } catch (e) {
          console.error("Erro na data:", e);
        }

        const statusClass =
          {
            PENDENTE: "is-warning",
            APROVADA: "is-success",
            CANCELADA: "is-danger",
          }[res.status] || "is-info";

        let acaoBotao = "";
        if (res.status === "PENDENTE") {
          acaoBotao = `
                        <button class="button is-small btn-principal-client" onclick="confirmarPagamento(${res.id})">
                            Confirmar Pgt
                        </button>
                        <button class="button is-small btn-cancelar-reserva ml-2" onclick="cancelarReserva(${res.id})">
                            Cancelar
                        </button>
                    `;
        }

        tabela.innerHTML += `
                <tr>
                    <td><strong>${res.show}</strong></td>
                    <td>${dataFormatada}</td>
                    <td>${res.quantidade}x</td>
                    <td class="preco-destaque">R$ ${res.valorTotal.toFixed(2)}</td>
                    <td><span class="tag ${statusClass} is-light">${res.status}</span></td>
                    <td>${acaoBotao}</td> 
                </tr>`;
      });
    }
  } catch (error) {
    console.error("Erro de conexão:", error);
    tabela.innerHTML =
      '<tr><td colspan="6" class="has-text-centered has-text-danger">Erro ao carregar dados do servidor.</td></tr>';
  }
}

async function confirmarPagamento(reservationId) {
  if (!confirm("Deseja confirmar que o pagamento foi realizado?")) return;
  const token = localStorage.getItem("token");
  const url = `http://localhost:8080/reservations/${reservationId}/confirm-payment`;

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
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
 if (!confirm("Deseja cancelar esta reserva? Os ingressos serão devolvidos ao estoque.")) return;

    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`http://localhost:8080/reservations/${reservationId}`, {
            method: 'DELETE', 
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            alert("Reserva cancelada com sucesso!");
            if (typeof carregarMinhasReservas === "function") {
                carregarMinhasReservas();
            } else {
                window.location.reload();
            }
        } else {
            const erro = await response.text();
            alert("Erro ao cancelar: " + erro);
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro de conexão com o servidor.");
    }
}

function logout() {
  localStorage.clear();
  window.location.href = "../index.html";
}
