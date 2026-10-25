const form = document.getElementById("orderForm");
const ordersList = document.getElementById("ordersList");
const searchInput = document.getElementById("searchOrders");

const STORAGE_KEY = "novatrix_demo_orders";

let orders = [];

try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    if (Array.isArray(parsed)) {
        orders = parsed.filter(order =>
            order &&
            typeof order.id === "string" &&
            typeof order.name === "string" &&
            typeof order.email === "string" &&
            typeof order.project === "string" &&
            Number.isFinite(order.amount) &&
            ["Pending", "In Progress", "Completed", "Cancelled"]
                .includes(order.status)
        );
    }
} catch {
    orders = [];
}

function saveOrders() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
        return true;
    } catch {
        alert("डेटा सेव नहीं हो पाया। स्टोरेज उपलब्धता जाँचें।");
        return false;
    }
}

function updateStats() {
    document.getElementById("totalOrders").textContent =
        orders.length;

    document.getElementById("pendingOrders").textContent =
        orders.filter(order => order.status === "Pending").length;

    document.getElementById("completedOrders").textContent =
        orders.filter(order => order.status === "Completed").length;
}

function renderOrders() {
    const query = searchInput.value.trim().toLowerCase();

    ordersList.replaceChildren();

    const filtered = orders.filter(order =>
        order.name.toLowerCase().includes(query) ||
        order.project.toLowerCase().includes(query) ||
        order.email.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
        const empty = document.createElement("p");
        empty.textContent = "कोई ऑर्डर नहीं मिला।";
        ordersList.appendChild(empty);
    }

    filtered.forEach(order => {
        const card = document.createElement("article");
        card.className = "order";

        const title = document.createElement("h3");
        title.textContent = order.project;

        const customer = document.createElement("p");
        customer.textContent = `Customer: ${order.name}`;

        const email = document.createElement("p");
        email.textContent = `Email: ${order.email}`;

        const amount = document.createElement("p");
        amount.textContent =
            `Amount: ₹${order.amount.toLocaleString("en-IN")}`;

        const status = document.createElement("select");
        status.setAttribute("aria-label", "Order status");

        [
            "Pending",
            "In Progress",
            "Completed",
            "Cancelled"
        ].forEach(value => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = value;
            status.appendChild(option);
        });

        status.value = order.status;

        status.addEventListener("change", () => {
            const previousStatus = order.status;
            order.status = status.value;

            if (saveOrders()) {
                renderOrders();
            } else {
                order.status = previousStatus;
                renderOrders();
            }
        });

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.textContent = "Delete Order";

        removeButton.addEventListener("click", () => {
            if (!confirm("क्या तुम यह ऑर्डर हटाना चाहते हो?")) {
                return;
            }

            const previousOrders = orders;
            orders = orders.filter(item => item.id !== order.id);

            if (saveOrders()) {
                renderOrders();
            } else {
                orders = previousOrders;
                renderOrders();
            }
        });

        card.append(title, customer, email, amount, status, removeButton);
        ordersList.appendChild(card);
    });

    updateStats();
}

form.addEventListener("submit", event => {
    event.preventDefault();

    const name =
        document.getElementById("customerName").value.trim();

    const email =
        document.getElementById("customerEmail").value.trim();

    const project =
        document.getElementById("projectName").value.trim();

    const amount = Number(
        document.getElementById("orderAmount").value
    );

    if (
        !name ||
        !email ||
        !project ||
        !Number.isFinite(amount) ||
        amount < 0 ||
        amount > 100000000
    ) {
        alert("कृपया सभी जानकारी सही तरीके से भरें।");
        return;
    }

    const order = {
        id: crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random()}`,
        name,
        email,
        project,
        amount,
        status: "Pending"
    };

    orders.unshift(order);

    if (saveOrders()) {
        form.reset();
        renderOrders();
    } else {
        orders.shift();
    }
});

searchInput.addEventListener("input", renderOrders);

renderOrders();