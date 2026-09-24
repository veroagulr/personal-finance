const token = localStorage.getItem("access_token");

if (!token) {
    window.location.href = "index.html";
}


// =========================================
// VARIABLES
// =========================================

let expenses = [];
let incomes = [];
let movementToEdit = null;
let movementToDelete = null;


// =========================================
// CARGAR MOVIMIENTOS
// =========================================

async function loadFinancialMovements() {

    try {

        const [expensesResponse, incomesResponse] =
            await Promise.all([

                fetch(
                    "http://127.0.0.1:8000/expenses",
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                ),

                fetch(
                    "http://127.0.0.1:8000/incomes",
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                )

            ]);


        if (!expensesResponse.ok || !incomesResponse.ok) {

            console.error(
                "No se pudieron cargar los movimientos"
            );

            return;
        }


        expenses = await expensesResponse.json();

        incomes = await incomesResponse.json();


        console.log("Gastos:", expenses);

        console.log("Ingresos:", incomes);


        populateCategoryFilter();

        filterMovements();

    } catch (error) {

        console.error(
            "Error cargando movimientos:",
            error
        );

    }

}


// =========================================
// OBTENER TODOS LOS MOVIMIENTOS
// =========================================

function getAllMovements() {

    return [

        ...expenses.map(function (expense) {

            return {
                ...expense,
                type: "expense"
            };

        }),

        ...incomes.map(function (income) {

            return {
                ...income,
                type: "income"
            };

        })

    ];

}


// =========================================
// FILTRAR MOVIMIENTOS
// =========================================

function filterMovements() {

    const searchInput =
        document.getElementById("financeSearch");

    const typeFilter =
        document.getElementById("typeFilter");

    const categoryFilter =
        document.getElementById("categoryFilter");


    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    const selectedType =
        typeFilter.value;


    const selectedCategory =
        categoryFilter.value;


    let movements =
        getAllMovements();


    // =========================================
    // FILTRO DE BÚSQUEDA
    // =========================================

    if (search !== "") {

        movements =
            movements.filter(function (movement) {

                const description =
                    movement.description || "";

                const category =
                    movement.type === "expense"
                        ? movement.category || ""
                        : movement.source || "";

                const amount =
                    movement.amount || "";


                return (

                    description
                        .toLowerCase()
                        .includes(search)

                    ||

                    category
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(amount)
                        .includes(search)

                );

            });

    }


    // =========================================
    // FILTRO POR TIPO
    // =========================================

    if (selectedType !== "all") {

        movements =
            movements.filter(function (movement) {

                return movement.type === selectedType;

            });

    }


    // =========================================
    // FILTRO POR CATEGORÍA
    // =========================================

    if (selectedCategory !== "all") {

        movements =
            movements.filter(function (movement) {

                const category =
                    movement.type === "expense"
                        ? movement.category
                        : movement.source;


                return category === selectedCategory;

            });

    }


    renderMovements(movements);

}


// =========================================
// MOSTRAR MOVIMIENTOS
// =========================================

function renderMovements(movements) {

    const tableBody =
        document.getElementById("financeTableBody");


    tableBody.innerHTML = "";


    if (movements.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="finance-empty"
                >

                    <i class="bi bi-search"></i>

                    <span>
                        No se encontraron movimientos.
                    </span>

                </td>

            </tr>

        `;

        return;
    }


    movements.sort(function (a, b) {

        return new Date(b.date) - new Date(a.date);

    });


    movements.forEach(function (movement) {

        const row =
            document.createElement("tr");


        const isExpense =
            movement.type === "expense";


        const typeText =
            isExpense
                ? "Gasto"
                : "Ingreso";


        const category =
            isExpense
                ? movement.category || "Sin categoría"
                : movement.source || "Sin fuente";


        const amount =
            Number(movement.amount).toFixed(2);


        row.innerHTML = `

            <td>
                ${formatDate(movement.date)}
            </td>


            <td>

                <strong class="movement-description">
                    ${movement.description}
                </strong>

            </td>


            <td>

                <span class="
                    movement-type
                    ${isExpense
                        ? "movement-expense"
                        : "movement-income"}
                ">

                    <i class="bi ${
                        isExpense
                            ? "bi-arrow-up-circle"
                            : "bi-arrow-down-circle"
                    }"></i>

                    ${typeText}

                </span>

            </td>


            <td>
                ${category}
            </td>


            <td>

                <strong class="
                    movement-amount
                    ${isExpense
                        ? "movement-expense-text"
                        : "movement-income-text"}
                ">

                    ${isExpense ? "-" : "+"}
                    S/ ${amount}

                </strong>

            </td>


            <td>

                <div class="movement-actions">

                    <button
                        type="button"
                        class="movement-action edit-action"
                        title="Editar"
                        data-id="${movement.id}"
                        data-type="${movement.type}"
                    >

                        <i class="bi bi-pencil"></i>

                    </button>


                    <button
                        type="button"
                        class="movement-action delete-action"
                        title="Eliminar"
                        data-id="${movement.id}"
                        data-type="${movement.type}"
                    >

                        <i class="bi bi-trash"></i>

                    </button>

                </div>

            </td>

        `;


        tableBody.appendChild(row);

    });

}


// =========================================
// FORMATEAR FECHA
// =========================================

function formatDate(date) {

    if (!date) {
        return "-";
    }


    const [year, month, day] =
        date.substring(0, 10).split("-");


    return `${day}/${month}/${year}`;

}


// =========================================
// FILTRO DE CATEGORÍAS
// =========================================

function populateCategoryFilter() {

    const categoryFilter =
        document.getElementById("categoryFilter");


    const categories = new Set();


    expenses.forEach(function (expense) {

        if (expense.category) {

            categories.add(
                expense.category
            );

        }

    });


    incomes.forEach(function (income) {

        if (income.source) {

            categories.add(
                income.source
            );

        }

    });


    categoryFilter.innerHTML = `

        <option value="all">
            Todas las categorías
        </option>

    `;


    [...categories]
        .sort()
        .forEach(function (category) {

            const option =
                document.createElement("option");


            option.value =
                category;


            option.textContent =
                category;


            categoryFilter.appendChild(
                option
            );

        });

}


// =========================================
// EVENTOS DE FILTROS
// =========================================

const financeSearch =
    document.getElementById("financeSearch");

const typeFilter =
    document.getElementById("typeFilter");

const categoryFilter =
    document.getElementById("categoryFilter");

const clearFilters =
    document.getElementById("clearFilters");


// =========================================
// BUSCADOR
// =========================================

financeSearch.addEventListener(
    "input",
    function () {

        filterMovements();

    }
);


// =========================================
// FILTRO POR TIPO
// =========================================

typeFilter.addEventListener(
    "change",
    function () {

        filterMovements();

    }
);


// =========================================
// FILTRO POR CATEGORÍA
// =========================================

categoryFilter.addEventListener(
    "change",
    function () {

        filterMovements();

    }
);


// =========================================
// LIMPIAR FILTROS
// =========================================

clearFilters.addEventListener(
    "click",
    function () {

        financeSearch.value = "";

        typeFilter.value = "all";

        categoryFilter.value = "all";


        filterMovements();

    }
);


// =========================================
// MODAL ELIMINAR
// =========================================

const deleteModalElement =
    document.getElementById("deleteModal");


const deleteModal =
    new bootstrap.Modal(
        deleteModalElement
    );


const confirmDeleteButton =
    document.getElementById(
        "confirmDeleteButton"
    );


const deleteMessage =
    document.getElementById(
        "deleteMessage"
    );


// =========================================
// MODAL EDITAR
// =========================================

const editModalElement =
    document.getElementById("editModal");


const editModal =
    new bootstrap.Modal(
        editModalElement
    );


const editForm =
    document.getElementById("editForm");


const editDescription =
    document.getElementById("editDescription");


const editAmount =
    document.getElementById("editAmount");


const editCategory =
    document.getElementById("editCategory");


const editSource =
    document.getElementById("editSource");


const editDate =
    document.getElementById("editDate");


const editCategoryGroup =
    document.getElementById(
        "editCategoryGroup"
    );


const editSourceGroup =
    document.getElementById(
        "editSourceGroup"
    );


const editModalTitle =
    document.getElementById(
        "editModalTitle"
    );


const editModalIcon =
    document.getElementById(
        "editModalIcon"
    );


// =========================================
// BOTONES EDITAR Y ELIMINAR
// =========================================

document
    .getElementById("financeTableBody")
    .addEventListener(
        "click",
        function (event) {

            const editButton =
                event.target.closest(
                    ".edit-action"
                );


            const deleteButton =
                event.target.closest(
                    ".delete-action"
                );


            // =========================================
            // EDITAR
            // =========================================

            if (editButton) {

                const movementId =
                    Number(
                        editButton.dataset.id
                    );


                const movementType =
                    editButton.dataset.type;


                const movements =
                    movementType === "expense"
                        ? expenses
                        : incomes;


                const movement =
                    movements.find(function (item) {

                        return item.id === movementId;

                    });


                if (!movement) {
                    return;
                }


                movementToEdit = {

                    id: movementId,

                    type: movementType

                };


                // =========================================
                // CARGAR DATOS
                // =========================================

                editDescription.value =
                    movement.description || "";


                editAmount.value =
                    movement.amount || "";


                editDate.value =
                    movement.date
                        ? movement.date.substring(0, 10)
                        : "";


                // =========================================
                // CONFIGURAR SEGÚN TIPO
                // =========================================

                if (movementType === "expense") {

                    editModalTitle.textContent =
                        "Editar gasto";


                    editModalIcon.className =
                        "bi bi-arrow-up-circle text-danger";


                    editCategoryGroup.style.display =
                        "block";


                    editSourceGroup.style.display =
                        "none";


                    editCategory.value =
                        movement.category || "";


                    editCategory.required =
                        true;


                    editSource.required =
                        false;

                } else {

                    editModalTitle.textContent =
                        "Editar ingreso";


                    editModalIcon.className =
                        "bi bi-arrow-down-circle text-success";


                    editCategoryGroup.style.display =
                        "none";


                    editSourceGroup.style.display =
                        "block";


                    editSource.value =
                        movement.source || "";


                    editCategory.required =
                        false;


                    editSource.required =
                        true;

                }


                document.getElementById(
                    "editMessage"
                ).textContent = "";


                editModal.show();


                return;

            }


            // =========================================
            // ELIMINAR
            // =========================================

            if (deleteButton) {

                const movementId =
                    Number(
                        deleteButton.dataset.id
                    );


                const movementType =
                    deleteButton.dataset.type;


                movementToDelete = {

                    id: movementId,

                    type: movementType

                };


                deleteMessage.textContent =
                    "";


                confirmDeleteButton.disabled =
                    false;


                confirmDeleteButton.innerHTML = `
                    <i class="bi bi-trash"></i>
                    Eliminar
                `;


                deleteModal.show();

            }

        }
    );


// =========================================
// GUARDAR CAMBIOS DE EDICIÓN
// =========================================

editForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        if (!movementToEdit) {
            return;
        }


        const message =
            document.getElementById(
                "editMessage"
            );


        const saveButton =
            document.getElementById(
                "saveEditButton"
            );


        // =========================================
        // OBTENER DATOS
        // =========================================

        const description =
            editDescription.value.trim();


        const amount =
            Number(
                editAmount.value
            );


        const date =
            editDate.value;


        // =========================================
        // ESTADO DEL BOTÓN
        // =========================================

        saveButton.disabled = true;


        saveButton.innerHTML = `
            <span class="spinner-border spinner-border-sm"></span>
            Guardando...
        `;


        try {

            let url = "";

            let data = {};


            // =========================================
            // ACTUALIZAR GASTO
            // =========================================

            if (
                movementToEdit.type === "expense"
            ) {

                url =
                    `http://127.0.0.1:8000/expenses/${movementToEdit.id}`;


                data = {

                    description:
                        description,

                    amount:
                        amount,

                    category:
                        editCategory.value,

                    date:
                        date

                };

            }


            // =========================================
            // ACTUALIZAR INGRESO
            // =========================================

            else {

                url =
                    `http://127.0.0.1:8000/incomes/${movementToEdit.id}`;


                data = {

                    description:
                        description,

                    amount:
                        amount,

                    source:
                        editSource.value,

                    date:
                        date

                };

            }


            // =========================================
            // ENVIAR PUT
            // =========================================

            const response =
                await fetch(
                    url,
                    {
                        method: "PUT",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`

                        },

                        body:
                            JSON.stringify(data)

                    }
                );


            // =========================================
            // COMPROBAR RESPUESTA
            // =========================================

            if (!response.ok) {

                const errorData =
                    await response.json();


                throw new Error(
                    errorData.detail ||
                    "No se pudo actualizar el movimiento."
                );

            }


            // =========================================
            // ÉXITO
            // =========================================

            message.textContent =
                "Movimiento actualizado correctamente.";


            message.className =
                "text-success";


            await new Promise(
                function (resolve) {

                    setTimeout(
                        resolve,
                        700
                    );

                }
            );


            // =========================================
            // CERRAR MODAL
            // =========================================

            editModal.hide();


            // =========================================
            // RECARGAR
            // =========================================

            await loadFinancialMovements();


            movementToEdit = null;


        } catch (error) {

            console.error(
                "Error actualizando movimiento:",
                error
            );


            message.textContent =
                error.message ||
                "Ocurrió un error al actualizar.";


            message.className =
                "text-danger";


        } finally {

            saveButton.disabled =
                false;


            saveButton.innerHTML = `
                <i class="bi bi-check-lg"></i>
                Guardar cambios
            `;

        }

    }
);


// =========================================
// CONFIRMAR ELIMINACIÓN
// =========================================

confirmDeleteButton.addEventListener(
    "click",
    async function () {

        if (!movementToDelete) {
            return;
        }


        // =========================================
        // ESTADO DEL BOTÓN
        // =========================================

        confirmDeleteButton.disabled =
            true;


        confirmDeleteButton.innerHTML = `
            <span class="spinner-border spinner-border-sm"></span>
            Eliminando...
        `;


        try {

            let url = "";


            // =========================================
            // ELIMINAR GASTO
            // =========================================

            if (
                movementToDelete.type === "expense"
            ) {

                url =
                    `http://127.0.0.1:8000/expenses/${movementToDelete.id}`;

            }


            // =========================================
            // ELIMINAR INGRESO
            // =========================================

            else {

                url =
                    `http://127.0.0.1:8000/incomes/${movementToDelete.id}`;

            }


            // =========================================
            // ENVIAR DELETE
            // =========================================

            const response =
                await fetch(
                    url,
                    {
                        method: "DELETE",

                        headers: {

                            "Authorization":
                                `Bearer ${token}`

                        }

                    }
                );


            // =========================================
            // COMPROBAR RESPUESTA
            // =========================================

            if (!response.ok) {

                const errorData =
                    await response.json();


                throw new Error(
                    errorData.detail ||
                    "No se pudo eliminar el movimiento."
                );

            }


            // =========================================
            // CERRAR MODAL
            // =========================================

            deleteModal.hide();


            // =========================================
            // RECARGAR MOVIMIENTOS
            // =========================================

            await loadFinancialMovements();


            movementToDelete = null;


        } catch (error) {

            console.error(
                "Error eliminando movimiento:",
                error
            );


            deleteMessage.textContent =
                error.message ||
                "Ocurrió un error al eliminar.";


        } finally {

            confirmDeleteButton.disabled =
                false;


            confirmDeleteButton.innerHTML = `
                <i class="bi bi-trash"></i>
                Eliminar
            `;

        }

    }
);


// =========================================
// INICIAR
// =========================================

loadFinancialMovements();