
document.addEventListener("componentsLoaded", function () {

    const token = localStorage.getItem("access_token");

    if (!token) {
        window.location.href = "index.html";
        return;
    }

    let expensesChart = null;

    async function loadFinancialSummary() {
    try {
        const response = await fetch(
            "http://127.0.0.1:8000/financial-summary",
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        console.log("Datos recibidos:", data);

        if (!response.ok) {
            console.error(data);
            return;
        }

        document.getElementById("totalIncome").textContent =
            `S/ ${Number(data.total_income).toFixed(2)}`;

        document.getElementById("totalExpense").textContent =
            `S/ ${Number(data.total_expense).toFixed(2)}`;

        document.getElementById("balance").textContent =
            `S/ ${Number(data.balance).toFixed(2)}`;

        const categoriesContainer =
            document.getElementById("categories");

        categoriesContainer.innerHTML = "";

        const categories = data.expenses_by_category || {};

        if (Object.keys(categories).length === 0) {
            categoriesContainer.textContent =
                "No hay gastos registrados.";
        } else {
            for (const [category, amount] of Object.entries(categories)) {
                const item = document.createElement("div");

                item.classList.add("category-item");

                const categoryName = document.createElement("span");
                categoryName.textContent = category;

                const categoryAmount = document.createElement("strong");
                categoryAmount.textContent =
                    `S/ ${Number(amount).toFixed(2)}`;

                item.appendChild(categoryName);
                item.appendChild(categoryAmount);

                categoriesContainer.appendChild(item);
            }
        }

        const chartCanvas = document.getElementById("expensesChart");

        if (expensesChart) {
            expensesChart.destroy();
            expensesChart = null;
        }

        if (Object.keys(categories).length > 0) {

            expensesChart = new Chart(chartCanvas, {
                type: "doughnut",

                data: {
                    labels: Object.keys(categories),

                    datasets: [
                        {
                            data: Object.values(categories)
                        }
                    ]
                },

                options: {
                    responsive: true,

                    plugins: {
                        legend: {
                            position: "bottom"
                        }
                    }
                }
            });
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

loadFinancialSummary();

const expenseForm = document.getElementById("expenseForm");

expenseForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const description =
        document.getElementById("expenseDescription").value;

    const amount =
        Number(document.getElementById("expenseAmount").value);

    const category =
        document.getElementById("expenseCategory").value;

    const date =
        document.getElementById("expenseDate").value;

    const message =
        document.getElementById("expenseMessage");

    try {
        const response = await fetch(
            "http://127.0.0.1:8000/expenses",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    description: description,
                    amount: amount,
                    category: category,
                    date: date
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            message.textContent =
                data.detail || "Error al registrar el gasto";
            return;
        }

        message.textContent =
            "Gasto registrado correctamente";

        expenseForm.reset();

        loadFinancialSummary();

    } catch (error) {
        console.error("Error:", error);

        message.textContent =
            "No se pudo conectar con el servidor";
    }
});

const incomeForm = document.getElementById("incomeForm");

incomeForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const description =
        document.getElementById("incomeDescription").value;

    const amount =
        Number(document.getElementById("incomeAmount").value);

    const source =
        document.getElementById("incomeSource").value;

    const date =
        document.getElementById("incomeDate").value;

    const message =
        document.getElementById("incomeMessage");

    try {
        const response = await fetch(
            "http://127.0.0.1:8000/incomes",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    description: description,
                    amount: amount,
                    source: source,
                    date: date
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            message.textContent =
                data.detail || "Error al registrar el ingreso";
            return;
        }

        message.textContent =
            "Ingreso registrado correctamente";

        incomeForm.reset();

        loadFinancialSummary();

    } catch (error) {
        console.error("Error:", error);

        message.textContent =
            "No se pudo conectar con el servidor";
    }
});

const logoutButton = document.getElementById("logoutButton");

logoutButton.addEventListener("click", function () {
    localStorage.removeItem("access_token");
    window.location.href = "index.html";
});

// ==========================================
// OBTENER USUARIO AUTENTICADO
// ==========================================

async function loadCurrentUser() {

    const token = localStorage.getItem("access_token");

    // Si no existe token, regresar al login
    if (!token) {
        window.location.href = "index.html";
        return;
    }

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/users/me",
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {

            // Token inválido o expirado
            localStorage.removeItem("access_token");

            window.location.href = "index.html";

            return;
        }

        const user = await response.json();

        console.log("Usuario autenticado:", user);

        // Mostrar nombre
        document.getElementById("userName").textContent =
            user.username;

        // Mostrar correo
        document.getElementById("userEmail").textContent =
            user.email;

        // Obtener primera letra del usuario
        const initial =
            user.username.charAt(0).toUpperCase();

        document.getElementById("userAvatar").textContent =
            initial;

        document.getElementById("topUserAvatar").textContent =
            initial;

    } catch (error) {

        console.error(
            "Error al obtener el usuario:",
            error
        );
    }
}

loadFinancialSummary();
loadCurrentUser();

});
