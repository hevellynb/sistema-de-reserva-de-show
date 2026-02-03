document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, senha: senha }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userId", data.userId);
      alert("Login realizado com sucesso!");
      if (data.role === "ADMIN" || data.role === "ROLE_ADMIN") {
        window.location.href = "pages/admin.html";
      } else {
        window.location.href = "pages/dashboard.html";
      }
    } else {
      alert("Erro: Usuário ou senha inválidos");
    }
  } catch (error) {
    console.error("Erro na conexão:", error);
    alert("Não foi possível conectar ao servidor.");
  }
});

function abrirModalCadastro() {
  document.getElementById("modal-cadastro").classList.add("is-active");
}

function fecharModalCadastro() {
  document.getElementById("modal-cadastro").classList.remove("is-active");
}

async function realizarCadastro(event) {
  event.preventDefault();
  const userData = {
    nome: document.getElementById("cad-nome").value,
    email: document.getElementById("cad-email").value,
    password: document.getElementById("cad-senha").value,
    role: "ROLE_USER",
  };

  const response = await fetch("http://localhost:8080/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (response.ok) {
    alert("Cadastro realizado! Agora você pode fazer login.");
    fecharModalCadastro();
  } else {
    alert("Erro ao cadastrar. Verifique se o e-mail já existe.");
  }
}

async function realizarCadastro(event) {
  event.preventDefault();

  const userData = {
    nome: document.getElementById("cad-nome").value,
    email: document.getElementById("cad-email").value,
    senha: document.getElementById("cad-senha").value,
  };

  try {
    const response = await fetch("http://localhost:8080/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      alert("Cadastro realizado com sucesso! Agora você pode entrar.");
      fecharModalCadastro();
    } else {
      const erro = await response.text();
      alert("Erro ao cadastrar: " + erro);
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    alert("Erro de conexão com o servidor.");
  }
}
