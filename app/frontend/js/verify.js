const verifyForm = document.getElementById("verifyForm");
const message = document.getElementById("message");

const savedEmail = localStorage.getItem("verification_email");

if (savedEmail) {
    document.getElementById("email").value = savedEmail;
}

verifyForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const code = document.getElementById("code").value;

    try {
        const response = await fetch("http://127.0.0.1:8000/users/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                code: code
            })
        });

        const data = await response.json();

        if (!response.ok) {
            message.textContent = data.detail || "Código incorrecto";
            return;
        }

        message.textContent = "Cuenta verificada correctamente.";

        localStorage.removeItem("verification_email");

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);

    } catch (error) {
        console.error(error);
        message.textContent = "No se pudo conectar con el servidor";
    }
});
