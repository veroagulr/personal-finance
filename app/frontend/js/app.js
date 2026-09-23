const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async function(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://127.0.0.1:8000/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            message.textContent = data.detail || "Error al iniciar sesión";
            return;
        }

        localStorage.setItem("access_token", data.access_token);

        console.log("Token guardado correctamente");

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 500);

    } catch (error) {
        console.error(error);
        message.textContent = "No se pudo conectar con el servidor";
    }
});