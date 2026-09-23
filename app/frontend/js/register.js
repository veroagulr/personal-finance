const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");


// ================================
// VALIDACIÓN DE CONTRASEÑA
// ================================

passwordInput.addEventListener("input", function() {

    const password = passwordInput.value;

    let requirements = [];

    requirements.push({
        text: "Al menos 8 caracteres",
        valid: password.length >= 8
    });

    requirements.push({
        text: "Una letra mayúscula",
        valid: /[A-Z]/.test(password)
    });

    requirements.push({
        text: "Una letra minúscula",
        valid: /[a-z]/.test(password)
    });

    requirements.push({
        text: "Un número",
        valid: /[0-9]/.test(password)
    });

    requirements.push({
        text: "Un carácter especial",
        valid: /[!@#$%^&*()\-_=+\[\]{};:,.?/]/.test(password)
    });

    let html = "<ul class='password-requirements'>";

    requirements.forEach(requirement => {

        const symbol = requirement.valid ? "✓" : "✗";

        html += `
            <li class="${requirement.valid ? "valid" : "invalid"}">
                ${symbol} ${requirement.text}
            </li>
        `;
    });

    html += "</ul>";

    let existingRequirements =
        document.getElementById("passwordRequirements");

    if (!existingRequirements) {

        existingRequirements = document.createElement("div");

        existingRequirements.id = "passwordRequirements";

        passwordInput.parentElement.appendChild(
            existingRequirements
        );
    }

    existingRequirements.innerHTML = html;
});


// ================================
// VALIDACIÓN DEL CORREO
// ================================

emailInput.addEventListener("input", function() {

    const email = emailInput.value.toLowerCase();

    const allowedDomains = [
        "gmail.com",
        "outlook.com",
        "hotmail.com"
    ];

    const emailMessage =
        document.getElementById("emailRequirement");

    const domain = email.includes("@")
        ? email.split("@")[1]
        : "";

    const validDomain =
        allowedDomains.includes(domain);

    if (email === "") {

        emailMessage.textContent = "";

    } else if (validDomain) {

        emailMessage.textContent =
            "✓ Correo válido";

        emailMessage.className = "valid";

    } else {

        emailMessage.textContent =
            "✗ Usa un correo Gmail, Outlook o Hotmail";

        emailMessage.className = "invalid";
    }
});


// Crear mensaje debajo del correo
const emailRequirement = document.createElement("small");

emailRequirement.id = "emailRequirement";

emailInput.parentElement.appendChild(
    emailRequirement
);


// ================================
// CONFIRMAR CONTRASEÑA
// ================================

confirmPasswordInput.addEventListener("input", function() {

    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    const confirmMessage =
        document.getElementById("confirmRequirement");

    if (confirmPassword === "") {

        confirmMessage.textContent = "";

    } else if (password === confirmPassword) {

        confirmMessage.textContent =
            "✓ Las contraseñas coinciden";

        confirmMessage.className = "valid";

    } else {

        confirmMessage.textContent =
            "✗ Las contraseñas no coinciden";

        confirmMessage.className = "invalid";
    }
});


// Crear mensaje debajo de confirmar contraseña
const confirmRequirement = document.createElement("small");

confirmRequirement.id = "confirmRequirement";

confirmPasswordInput.parentElement.appendChild(
    confirmRequirement
);


// ================================
// REGISTRO
// ================================

registerForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const username = usernameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;


    // Comprobar contraseñas
    if (password !== confirmPassword) {

        message.textContent =
            "Las contraseñas no coinciden";

        return;
    }


    // Comprobar contraseña
    const passwordValid =
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[!@#$%^&*()\-_=+\[\]{};:,.?/]/.test(password);


    if (!passwordValid) {

        message.textContent =
            "La contraseña no cumple todos los requisitos";

        return;
    }


    // Comprobar correo
    const allowedDomains = [
        "gmail.com",
        "outlook.com",
        "hotmail.com"
    ];

    const domain = email.includes("@")
        ? email.split("@")[1].toLowerCase()
        : "";

    if (!allowedDomains.includes(domain)) {

        message.textContent =
            "El correo debe ser Gmail, Outlook o Hotmail";

        return;
    }


    try {

        const response = await fetch(
            "http://127.0.0.1:8000/users",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            if (Array.isArray(data.detail)) {

                message.textContent = data.detail
                    .map(error => error.msg)
                    .join(", ");

            } else {

                message.textContent =
                    data.detail ||
                    "Error al crear la cuenta";
            }

            return;
        }


        message.textContent =
            "Cuenta creada. Revisa el código de verificación.";

        localStorage.setItem(
            "verification_email",
            email
        );


        setTimeout(() => {

            window.location.href = "verify.html";

        }, 1000);


    } catch (error) {

        console.error(error);

        message.textContent =
            "No se pudo conectar con el servidor";
    }

});
