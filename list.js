const customersCollection = db.collection("customers");

const customersList = document.getElementById("customers-list");
const customerSearch = document.getElementById("customer-search");

let customers = [];

function renderCustomers(data) {

    customersList.innerHTML = "";

    if (data.length === 0) {

        customersList.innerHTML = `
            <p class="list-message">
                Nenhum cliente encontrado.
            </p>
        `;

        return;
    }

    data.forEach(customer => {

        const item = document.createElement("div");

        item.className = "list-item";

        // Identifica clientes inativos
        if (customer.active !== true) {
            item.classList.add("inactive");
        }

        const name = document.createElement("span");

        name.className = "list-item-main-value";
        name.textContent = customer.name + " | " + customer.customerId || "Sem nome";

        const actions = document.createElement("div");

        actions.className = "list-item-actions";

        actions.innerHTML = `
            <button
                class="list-item-action"
                data-action="history"
                data-id="${customer.documentId}"
                aria-label="Histórico">

                <img
                    src="https://personalcross.github.io/assets/store/history.png"
                    alt="">

            </button>

            <button
                class="list-item-action"
                data-action="view"
                data-id="${customer.documentId}"
                aria-label="Consultar">

                <img
                    src="https://personalcross.github.io/assets/store/eye.png"
                    alt="">

            </button>

            <button
                class="list-item-action"
                data-action="edit"
                data-id="${customer.documentId}"
                aria-label="Editar">

                <img
                    src="https://personalcross.github.io/assets/store/pencil.png"
                    alt="">

            </button>
        `;

        item.appendChild(name);
        item.appendChild(actions);

        customersList.appendChild(item);

    });

}

customerSearch.addEventListener("input", event => {

    const search = event.target.value
        .trim()
        .toLocaleLowerCase("pt-PT");

    const filtered = customers.filter(customer =>
        (customer.name || "")
            .toLocaleLowerCase("pt-PT")
            .includes(search)
    );

    renderCustomers(filtered);

});

async function loadCustomers() {
    customersList.innerHTML = `
        <p class="list-message">A carregar clientes...</p>
    `;

    try {
        const snapshot = await customersCollection
            .where("checkIn", "==", true)
            .orderBy("name")
            .get();

        customers = snapshot.docs.map(doc => ({
            documentId: doc.id,
            ...doc.data()
        }));

        renderCustomers(customers);
    } catch (error) {

        console.error("Error loading customers:", error);

        customersList.innerHTML = `
            <p class="list-message">
                Não foi possível carregar os clientes.
            </p>
        `;

    }
}

loadCustomers();