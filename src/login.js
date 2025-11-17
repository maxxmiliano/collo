console.log("login.js foi e nao carregado!");
document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const tipo = document.getElementById("tipo").value;

    const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email,
            senha: password,
            cargo: tipo
        })
    });

    const data = await response.json();

    if (data.error) {
        alert(data.error);
    } else {
        alert("Logado com sucesso!");
        localStorage.setItem("token", data.token);
        // redirecionar por tipo
    }
});
