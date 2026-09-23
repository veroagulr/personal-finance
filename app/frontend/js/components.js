async function loadComponent(containerId, componentPath) {

    const container = document.getElementById(containerId);

    if (!container) {
        console.error(
            `No existe el contenedor: ${containerId}`
        );

        return;
    }

    try {

        const response = await fetch(componentPath);

        if (!response.ok) {
            throw new Error(
                `No se pudo cargar ${componentPath}`
            );
        }

        const html = await response.text();

        container.innerHTML = html;

    } catch (error) {

        console.error(
            `Error cargando ${componentPath}:`,
            error
        );

    }
}


async function loadComponents() {

    await Promise.all([

        loadComponent(
            "sidebar-container",
            "components/sidebar.html"
        ),

        loadComponent(
            "topbar-container",
            "components/topbar.html"
        )

    ]);

    // Avisamos que Sidebar y Topbar ya están cargados
    document.dispatchEvent(
        new Event("componentsLoaded")
    );
}


loadComponents();