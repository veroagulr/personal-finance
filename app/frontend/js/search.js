document.addEventListener("componentsLoaded", function () {

    const searchInput = document.getElementById("searchInput");

    if (!searchInput) {
        return;
    }

    const searchBox = searchInput.closest(".search-box");

    const resultsContainer = document.createElement("div");

    resultsContainer.className = "search-results";

    searchBox.appendChild(resultsContainer);


    let expenses = [];
    let incomes = [];

    async function loadSearchData() {

        const token = localStorage.getItem("access_token");

        if (!token) {
            return;
        }

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


            if (expensesResponse.ok) {
                expenses = await expensesResponse.json();
            }


            if (incomesResponse.ok) {
                incomes = await incomesResponse.json();
            }


        } catch (error) {

            console.error(
                "Error cargando datos para búsqueda:",
                error
            );

        }

    }


    function showResults(results) {

        resultsContainer.innerHTML = "";


        if (results.length === 0) {

            resultsContainer.innerHTML = `
                <div class="search-no-results">
                    No se encontraron resultados
                </div>
            `;

            resultsContainer.style.display = "block";

            return;
        }


        results.forEach(function (item) {

            const resultElement =
                document.createElement("div");

            resultElement.className =
                "search-result-item";


            const isExpense =
                item.type === "expense";


            resultElement.innerHTML = `

                <div class="search-result-icon ${
                    isExpense
                        ? "expense-result"
                        : "income-result"
                }">

                    <i class="bi ${
                        isExpense
                            ? "bi-arrow-up-circle"
                            : "bi-arrow-down-circle"
                    }"></i>

                </div>


                <div class="search-result-info">

                    <strong>
                        ${item.description}
                    </strong>

                    <span>
                        ${
                            isExpense
                                ? item.category || "Sin categoría"
                                : item.source || "Sin fuente"
                        }
                    </span>

                </div>


                <div class="search-result-amount ${
                    isExpense
                        ? "expense-amount"
                        : "income-amount"
                }">

                    ${
                        isExpense
                            ? "-"
                            : "+"
                    }
                    S/ ${Number(item.amount).toFixed(2)}

                </div>

            `;


            resultElement.addEventListener(
                "click",
                function () {

                    console.log(
                        "Resultado seleccionado:",
                        item
                    );

                }
            );


            resultsContainer.appendChild(
                resultElement
            );

        });


        resultsContainer.style.display = "block";
    }

    function search(text) {

        const query =
            text.trim().toLowerCase();


        if (!query) {

            resultsContainer.style.display =
                "none";

            return;
        }


        const expenseResults =
            expenses
                .filter(function (expense) {

                    return (

                        String(
                            expense.description || ""
                        )
                        .toLowerCase()
                        .includes(query)

                        ||

                        String(
                            expense.category || ""
                        )
                        .toLowerCase()
                        .includes(query)

                        ||

                        String(
                            expense.amount || ""
                        )
                        .includes(query)

                    );

                })
                .map(function (expense) {

                    return {
                        ...expense,
                        type: "expense"
                    };

                });


        const incomeResults =
            incomes
                .filter(function (income) {

                    return (

                        String(
                            income.description || ""
                        )
                        .toLowerCase()
                        .includes(query)

                        ||

                        String(
                            income.source || ""
                        )
                        .toLowerCase()
                        .includes(query)

                        ||

                        String(
                            income.amount || ""
                        )
                        .includes(query)

                    );

                })
                .map(function (income) {

                    return {
                        ...income,
                        type: "income"
                    };

                });


        const results = [
            ...expenseResults,
            ...incomeResults
        ];


        showResults(results);
    }

    searchInput.addEventListener(
        "input",
        function () {

            search(
                searchInput.value
            );

        }
    );


    // Ctrl + K

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                (event.ctrlKey || event.metaKey)
                &&
                event.key.toLowerCase() === "k"
            ) {

                event.preventDefault();

                searchInput.focus();

                searchInput.select();

            }

        }
    );

    document.addEventListener(
        "click",
        function (event) {

            if (
                !searchBox.contains(event.target)
            ) {

                resultsContainer.style.display =
                    "none";

            }

        }
    );

    loadSearchData();

});