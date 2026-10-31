
const cart = [];

// HTML elements
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartButton = document.getElementById("cartButton");
const checkoutButton = document.getElementById("checkoutButton");
const searchInput = document.getElementById("searchInput");
const priceFilter = document.getElementById("priceFilter");
const productCards = document.querySelectorAll(".product-card");
const noProducts = document.getElementById("noProducts");

// Format prices in Indian Rupees
function formatPrice(amount) {
    return "₹" + amount.toLocaleString("en-IN");
}

// Add products to cart
document.querySelectorAll(".add-button").forEach(function(button) {
    button.addEventListener("click", function() {
        const card = button.closest(".product-card");
        const name = card.dataset.name;
        const price = Number(card.dataset.price);

        const existingProduct = cart.find(function(item) {
            return item.name === name;
        });

        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push({
                name: name,
                price: price,
                quantity: 1
            });
        }

        updateCart();

        button.textContent = "Added ✓";
        setTimeout(function() {
            button.textContent = "Add to Cart +";
        }, 800);
    });
});

// Display cart and calculate total
function updateCart() {
    cartItems.innerHTML = "";

    let totalQuantity = 0;
    let totalPrice = 0;

    cart.forEach(function(item, index) {
        totalQuantity += item.quantity;
        totalPrice += item.price * item.quantity;

        const row = document.createElement("div");
        row.className = "cart-item";

        const details = document.createElement("div");

        const name = document.createElement("h3");
        name.textContent = item.name;

        const price = document.createElement("p");
        price.textContent =
            formatPrice(item.price) + " each";

        details.append(name, price);

        const actions = document.createElement("div");
        actions.className = "cart-actions";

        const decrease = document.createElement("button");
        decrease.className = "quantity-button";
        decrease.textContent = "−";
        decrease.setAttribute("aria-label", "Decrease quantity");

        decrease.addEventListener("click", function() {
            item.quantity--;

            if (item.quantity <= 0) {
                cart.splice(index, 1);
            }

            updateCart();
        });

        const quantity = document.createElement("span");
        quantity.textContent = item.quantity;

        const increase = document.createElement("button");
        increase.className = "quantity-button";
        increase.textContent = "+";
        increase.setAttribute("aria-label", "Increase quantity");

        increase.addEventListener("click", function() {
            item.quantity++;
            updateCart();
        });

        const subtotal = document.createElement("strong");
        subtotal.textContent =
            formatPrice(item.price * item.quantity);

        const remove = document.createElement("button");
        remove.className = "remove-button";
        remove.textContent = "Remove";

        remove.addEventListener("click", function() {
            cart.splice(index, 1);
            updateCart();
        });

        actions.append(
            decrease,
            quantity,
            increase,
            subtotal,
            remove
        );

        row.append(details, actions);
        cartItems.appendChild(row);
    });

    if (cart.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "empty-cart";
        emptyMessage.textContent =
            "Your cart is empty. Add a bat to get started!";

        cartItems.appendChild(emptyMessage);
    }

    cartCount.textContent = totalQuantity;
    cartTotal.textContent = formatPrice(totalPrice);
}

// Open cart section
cartButton.addEventListener("click", function() {
    document.getElementById("cart").scrollIntoView({
        behavior: "smooth"
    });
});

// Search products and filter by price
function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedPrice = priceFilter.value;

    let visibleCount = 0;

    productCards.forEach(function(card) {
        const name = card.dataset.name.toLowerCase();
        const price = Number(card.dataset.price);

        const matchesSearch = name.includes(searchTerm);

        let matchesPrice = true;

        if (selectedPrice === "under2000") {
            matchesPrice = price < 2000;
        } else if (selectedPrice === "2000to5000") {
            matchesPrice = price >= 2000 && price <= 5000;
        } else if (selectedPrice === "above5000") {
            matchesPrice = price > 5000;
        }

        const showProduct = matchesSearch && matchesPrice;

        card.hidden = !showProduct;

        if (showProduct) {
            visibleCount++;
        }
    });

    noProducts.hidden = visibleCount !== 0;
}

searchInput.addEventListener("input", filterProducts);
priceFilter.addEventListener("change", filterProducts);

// Demo checkout
checkoutButton.addEventListener("click", function() {
    if (cart.length === 0) {
        alert("Your cart is empty! Please add a cricket bat first.");
        return;
    }

    const total = cart.reduce(function(sum, item) {
        return sum + item.price * item.quantity;
    }, 0);

    const confirmed = confirm(
        "Demo Order Summary\n\n" +
        "Total items: " + cart.reduce(
            (sum, item) => sum + item.quantity, 0
        ) + "\n" +
        "Total amount: " + formatPrice(total) +
        "\n\nPlace this demo order?"
    );

    if (confirmed) {
        alert(
            "Demo order placed successfully!\n" +
            "Thank you for visiting BatPro."
        );

        cart.length = 0;
        updateCart();

        document.getElementById("home").scrollIntoView({
            behavior: "smooth"
        });
    }
});

// Mobile navigation
const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");

menuButton.setAttribute("aria-expanded", "false");

menuButton.addEventListener("click", function() {
    navLinks.classList.toggle("active");

    const isOpen = navLinks.classList.contains("active");

    menuButton.textContent = isOpen ? "✕" : "☰";
    menuButton.setAttribute("aria-expanded", String(isOpen));
});

// Close mobile menu after navigation
navLinks.querySelectorAll("a").forEach(function(link) {
    link.addEventListener("click", function() {
        navLinks.classList.remove("active");
        menuButton.textContent = "☰";
        menuButton.setAttribute("aria-expanded", "false");
    });
});

// Contact form validation
document.getElementById("contactForm").addEventListener(
    "submit",
    function(event) {
        event.preventDefault();

        const name =
            document.getElementById("customerName").value.trim();

        if (!name) {
            alert("Please enter your name.");
            return;
        }

        document.getElementById("formMessage").textContent =
            "Thank you, " + name +
            "! Your demo message has been received.";

        this.reset();
    }
);

// Automatically display current year
document.getElementById("year").textContent =
    new Date().getFullYear();

// Initial cart display
updateCart();
