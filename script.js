/* =========================================================
   WYRE — MAIN JAVASCRIPT
   Add to Cart + Checkout + Formspree
========================================================= */


/* =========================================================
   FORMSPREE
========================================================= */

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xvkoqrna";


/* =========================================================
   NAVBAR
========================================================= */

const navbar = document.querySelector(".navbar");

if (navbar) {
    window.addEventListener("scroll", function () {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });
}


/* =========================================================
   MOBILE MENU
========================================================= */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
        navLinks.classList.toggle("active");
        menuToggle.classList.toggle("active");
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            navLinks.classList.remove("active");
            menuToggle.classList.remove("active");
        });
    });
}


/* =========================================================
   SEARCH
========================================================= */

const searchButton = document.querySelector(".search-trigger");
const searchOverlay = document.getElementById("searchOverlay");
const searchClose = document.getElementById("searchClose");
const searchInput = document.getElementById("searchInput");

if (searchButton && searchOverlay) {
    searchButton.addEventListener("click", function () {
        searchOverlay.classList.add("active");

        if (searchInput) {
            setTimeout(function () {
                searchInput.focus();
            }, 200);
        }
    });
}

if (searchClose && searchOverlay) {
    searchClose.addEventListener("click", function () {
        searchOverlay.classList.remove("active");

        if (searchInput) {
            searchInput.value = "";
            showAllProducts();
        }
    });
}


/* =========================================================
   PRODUCTS
========================================================= */

const products = document.querySelectorAll(".product-card");


/* =========================================================
   SHOW ALL PRODUCTS
========================================================= */

function showAllProducts() {
    products.forEach(function (product) {
        product.style.display = "";
    });
}


/* =========================================================
   PRODUCT FILTER
========================================================= */

const filters = document.querySelectorAll(".filter-btn");

filters.forEach(function (filter) {

    filter.addEventListener("click", function () {

        filters.forEach(function (item) {
            item.classList.remove("active");
        });

        filter.classList.add("active");

        const selectedCategory = filter.dataset.filter;

        products.forEach(function (product) {

            const category = product.dataset.category;

            if (
                selectedCategory === "all" ||
                category === selectedCategory
            ) {
                product.style.display = "";
            } else {
                product.style.display = "none";
            }

        });

    });

});


/* =========================================================
   CATEGORY CARDS
========================================================= */

const categoryCards =
    document.querySelectorAll(".category-card");

categoryCards.forEach(function (category) {

    category.addEventListener("click", function (event) {

        event.preventDefault();

        const selectedCategory =
            category.dataset.categoryLink;

        const matchingFilter =
            document.querySelector(
                '.filter-btn[data-filter="' +
                selectedCategory +
                '"]'
            );

        if (matchingFilter) {
            matchingFilter.click();
        }

        const shopSection =
            document.getElementById("shop");

        if (shopSection) {
            shopSection.scrollIntoView({
                behavior: "smooth"
            });
        }

    });

});


/* =========================================================
   SEARCH PRODUCTS
========================================================= */

if (searchInput) {

    searchInput.addEventListener("input", function () {

        const searchValue =
            searchInput.value.toLowerCase().trim();

        products.forEach(function (product) {

            const nameElement =
                product.querySelector(".product-info h3");

            const name =
                nameElement
                    ? nameElement.textContent.toLowerCase()
                    : "";

            const category =
                product.dataset.category
                    ? product.dataset.category.toLowerCase()
                    : "";

            const matches =
                searchValue === "" ||
                name.includes(searchValue) ||
                category.includes(searchValue);

            product.style.display =
                matches ? "" : "none";

        });

    });

}


/* =========================================================
   WISHLIST
========================================================= */

const wishlistButtons =
    document.querySelectorAll(".wishlist-btn");

wishlistButtons.forEach(function (button) {

    button.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();

        button.classList.toggle("liked");

        if (button.classList.contains("liked")) {
            button.textContent = "♥";
        } else {
            button.textContent = "♡";
        }

    });

});


/* =========================================================
   CART
========================================================= */

let cart = [];

try {

    const savedCart =
        localStorage.getItem("wyreCart");

    if (savedCart) {

        const parsedCart =
            JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
            cart = parsedCart;
        }

    }

} catch (error) {

    console.error(
        "Could not load cart:",
        error
    );

    cart = [];

}


/* =========================================================
   CART ELEMENTS
========================================================= */

const cartOpen =
    document.getElementById("cartOpen");

const cartDrawer =
    document.getElementById("cartDrawer");

const cartClose =
    document.getElementById("cartClose");

const cartOverlay =
    document.getElementById("cartOverlay");

const cartItems =
    document.getElementById("cartItems");

const cartTotal =
    document.getElementById("cartTotal");

const cartCount =
    document.getElementById("cartCount");

const checkoutBtn =
    document.getElementById("checkoutBtn");


/* =========================================================
   OPEN CART
========================================================= */

function openCart() {

    if (!cartDrawer || !cartOverlay) {
        return;
    }

    cartDrawer.classList.add("active");
    cartOverlay.classList.add("active");

    document.body.style.overflow = "hidden";
}


/* =========================================================
   CLOSE CART
========================================================= */

function closeCartDrawer() {

    if (!cartDrawer || !cartOverlay) {
        return;
    }

    cartDrawer.classList.remove("active");
    cartOverlay.classList.remove("active");

    document.body.style.overflow = "";
}


/* =========================================================
   CART OPEN / CLOSE BUTTONS
========================================================= */

if (cartOpen) {
    cartOpen.addEventListener("click", openCart);
}

if (cartClose) {
    cartClose.addEventListener(
        "click",
        closeCartDrawer
    );
}

if (cartOverlay) {
    cartOverlay.addEventListener(
        "click",
        closeCartDrawer
    );
}


/* =========================================================
   ADD TO CART
========================================================= */

const quickAddButtons =
    document.querySelectorAll(".quick-add");

quickAddButtons.forEach(function (button) {

    button.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();

        const name =
            button.dataset.name || "WYRE Product";

        const price =
            Number(button.dataset.price) || 0;

        const image =
            button.dataset.image || "";

        if (price <= 0) {
            alert("Product price is missing.");
            return;
        }


        /* Check if product already exists */

        const existingProduct =
            cart.find(function (item) {
                return item.name === name;
            });


        if (existingProduct) {

            existingProduct.quantity =
                Number(existingProduct.quantity || 0) + 1;

        } else {

            cart.push({
                name: name,
                price: price,
                image: image,
                quantity: 1
            });

        }


        saveCart();
        updateCart();
        openCart();

    });

});


/* =========================================================
   UPDATE CART
========================================================= */

function updateCart() {

    if (!cartItems) {
        return;
    }


    cartItems.innerHTML = "";


    /* Empty cart */

    if (cart.length === 0) {

        cartItems.innerHTML =
            '<p class="empty-cart">Your cart is currently empty.</p>';

        if (cartTotal) {
            cartTotal.textContent = "PKR 0";
        }

        if (cartCount) {
            cartCount.textContent = "0";
        }

        return;
    }


    let total = 0;
    let count = 0;


    cart.forEach(function (item, index) {

        const price =
            Number(item.price) || 0;

        const quantity =
            Number(item.quantity) || 1;


        total += price * quantity;
        count += quantity;


        const cartItem =
            document.createElement("div");

        cartItem.className =
            "wyre-cart-item";


        cartItem.innerHTML = `
            <div class="wyre-cart-info">

                <strong>
                    ${escapeHTML(item.name)}
                </strong>

                <span>
                    PKR ${price.toLocaleString()}
                </span>

                <div class="wyre-quantity">

                    <button
                        type="button"
                        class="quantity-minus"
                        data-index="${index}">
                        −
                    </button>

                    <span>
                        ${quantity}
                    </span>

                    <button
                        type="button"
                        class="quantity-plus"
                        data-index="${index}">
                        +
                    </button>

                </div>

            </div>

            <button
                type="button"
                class="wyre-remove"
                data-index="${index}"
                aria-label="Remove product">
                ×
            </button>
        `;


        cartItems.appendChild(cartItem);

    });


    /* =====================================================
       QUANTITY MINUS
    ===================================================== */

    cartItems
        .querySelectorAll(".quantity-minus")
        .forEach(function (button) {

            button.addEventListener("click", function () {

                const index =
                    Number(button.dataset.index);

                changeQuantity(index, -1);

            });

        });


    /* =====================================================
       QUANTITY PLUS
    ===================================================== */

    cartItems
        .querySelectorAll(".quantity-plus")
        .forEach(function (button) {

            button.addEventListener("click", function () {

                const index =
                    Number(button.dataset.index);

                changeQuantity(index, 1);

            });

        });


    /* =====================================================
       REMOVE PRODUCT
    ===================================================== */

    cartItems
        .querySelectorAll(".wyre-remove")
        .forEach(function (button) {

            button.addEventListener("click", function () {

                const index =
                    Number(button.dataset.index);

                removeFromCart(index);

            });

        });


    /* =====================================================
       UPDATE TOTAL
    ===================================================== */

    if (cartTotal) {

        cartTotal.textContent =
            "PKR " + total.toLocaleString();

    }


    /* =====================================================
       UPDATE CART COUNT
    ===================================================== */

    if (cartCount) {

        cartCount.textContent =
            count;

    }

}


/* =========================================================
   CHANGE QUANTITY
========================================================= */

function changeQuantity(index, amount) {

    if (!cart[index]) {
        return;
    }


    cart[index].quantity =
        Number(cart[index].quantity || 1) + amount;


    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }


    saveCart();
    updateCart();

}


/* =========================================================
   REMOVE FROM CART
========================================================= */

function removeFromCart(index) {

    if (!cart[index]) {
        return;
    }


    cart.splice(index, 1);

    saveCart();
    updateCart();

}


/* =========================================================
   SAVE CART
========================================================= */

function saveCart() {

    try {

        localStorage.setItem(
            "wyreCart",
            JSON.stringify(cart)
        );

    } catch (error) {

        console.error(
            "Could not save cart:",
            error
        );

    }

}


/* =========================================================
   GET CART TOTAL
========================================================= */

function getCartTotal() {

    let total = 0;

    cart.forEach(function (item) {

        const price =
            Number(item.price) || 0;

        const quantity =
            Number(item.quantity) || 1;

        total += price * quantity;

    });

    return total;

}


/* =========================================================
   CHECKOUT MODAL
========================================================= */

function createCheckoutModal() {

    if (
        document.getElementById(
            "wyreCheckout"
        )
    ) {
        return;
    }


    const overlay =
        document.createElement("div");

    overlay.id = "wyreCheckout";


    overlay.innerHTML = `

        <div class="wyre-checkout-overlay"></div>

        <div class="wyre-checkout-box">

            <button
                type="button"
                id="wyreCheckoutClose"
                class="wyre-checkout-close"
                aria-label="Close checkout">
                &times;
            </button>

            <div class="wyre-checkout-heading">

                <span>
                    WYRE CHECKOUT
                </span>

                <h2>
                    Complete Your Order
                </h2>

                <p>
                    Enter your delivery details below.
                </p>

            </div>


            <form id="wyreCheckoutForm">

                <div class="wyre-form-group">

                    <label for="wyreCustomerName">
                        Full Name
                    </label>

                    <input
                        type="text"
                        id="wyreCustomerName"
                        name="customer_name"
                        placeholder="Your full name"
                        autocomplete="name"
                        required>

                </div>


                <div class="wyre-form-group">

                    <label for="wyreCustomerPhone">
                        Phone Number
                    </label>

                    <input
                        type="tel"
                        id="wyreCustomerPhone"
                        name="phone"
                        placeholder="03XXXXXXXXX"
                        inputmode="numeric"
                        maxlength="11"
                        pattern="03[0-9]{9}"
                        autocomplete="tel"
                        required>

                </div>


                <div class="wyre-form-group">

                    <label for="wyreCustomerAddress">
                        Delivery Address
                    </label>

                    <textarea
                        id="wyreCustomerAddress"
                        name="address"
                        placeholder="House / street, area, city"
                        rows="4"
                        autocomplete="street-address"
                        required></textarea>

                </div>


                <div
                    class="wyre-order-summary"
                    id="wyreOrderSummary"></div>


                <input
                    type="hidden"
                    id="wyreProducts"
                    name="products">


                <input
                    type="hidden"
                    id="wyreTotal"
                    name="total">


                <input
                    type="hidden"
                    id="wyreOrderDate"
                    name="order_date">


                <button
                    type="submit"
                    id="wyrePlaceOrder"
                    class="wyre-place-order">
                    <span id="wyrePlaceOrderText">
                        Place Order
                    </span>
                    <span aria-hidden="true">&rarr;</span>
                </button>


                <p
                    id="wyreCheckoutMessage"
                    class="wyre-order-message"></p>

            </form>

        </div>
    `;


    document.body.appendChild(overlay);


    /* Close button */

    const closeButton =
        document.getElementById(
            "wyreCheckoutClose"
        );

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeCheckout
        );

    }


    /* Close by clicking outside */

    overlay.addEventListener(
        "click",
        function (event) {

            if (
                event.target === overlay ||
                event.target.classList.contains(
                    "wyre-checkout-overlay"
                )
            ) {
                closeCheckout();
            }

        }
    );


    /* Submit form */

    const checkoutForm =
        document.getElementById(
            "wyreCheckoutForm"
        );

    if (checkoutForm) {

        checkoutForm.addEventListener(
            "submit",
            submitOrder
        );

    }

}


/* =========================================================
   OPEN CHECKOUT
========================================================= */

function openCheckout() {

    if (cart.length === 0) {

        alert(
            "Your cart is empty. Please add a product first."
        );

        return;
    }


    createCheckoutModal();

    updateOrderInformation();


    const overlay =
        document.getElementById(
            "wyreCheckout"
        );


    if (overlay) {

        overlay.classList.add("active");

        document.body.style.overflow =
            "hidden";

    }

}


/* =========================================================
   CLOSE CHECKOUT
========================================================= */

function closeCheckout() {

    const overlay =
        document.getElementById(
            "wyreCheckout"
        );


    if (overlay) {

        overlay.classList.remove("active");

    }


    document.body.style.overflow = "";

}


/* =========================================================
   UPDATE ORDER INFORMATION
========================================================= */

function updateOrderInformation() {

    let total = 0;

    const productLines = [];


    cart.forEach(function (item) {

        const price =
            Number(item.price) || 0;

        const quantity =
            Number(item.quantity) || 1;

        const itemTotal =
            price * quantity;


        total += itemTotal;


        productLines.push(
            item.name +
            " | Quantity: " +
            quantity +
            " | Price: PKR " +
            price.toLocaleString() +
            " | Total: PKR " +
            itemTotal.toLocaleString()
        );

    });


    const productsInput =
        document.getElementById(
            "wyreProducts"
        );

    const totalInput =
        document.getElementById(
            "wyreTotal"
        );

    const dateInput =
        document.getElementById(
            "wyreOrderDate"
        );


    if (productsInput) {

        productsInput.value =
            productLines.join("\n");

    }


    if (totalInput) {

        totalInput.value =
            "PKR " + total.toLocaleString();

    }


    if (dateInput) {

        dateInput.value =
            new Date().toLocaleString();

    }


    /* Visible summary inside the checkout box */

    const summaryBox =
        document.getElementById(
            "wyreOrderSummary"
        );


    if (summaryBox) {

        let rows = "";


        cart.forEach(function (item) {

            const price =
                Number(item.price) || 0;

            const quantity =
                Number(item.quantity) || 1;


            rows +=
                '<div class="wyre-summary-item">' +
                    "<span>" +
                        item.name +
                        " &times; " +
                        quantity +
                    "</span>" +
                    "<strong>PKR " +
                        (price * quantity).toLocaleString() +
                    "</strong>" +
                "</div>";

        });


        summaryBox.innerHTML =
            '<div class="wyre-summary-title">' +
                "YOUR ORDER" +
            "</div>" +
            rows +
            '<div class="wyre-summary-total">' +
                "<span>Total (Cash on delivery)</span>" +
                "<strong>PKR " +
                    total.toLocaleString() +
                "</strong>" +
            "</div>";

    }

}


/* =========================================================
   SUBMIT ORDER TO FORMSPREE
========================================================= */

async function submitOrder(event) {

    event.preventDefault();


    const form =
        event.target;


    const button =
        document.getElementById(
            "wyrePlaceOrder"
        );

    const message =
        document.getElementById(
            "wyreCheckoutMessage"
        );

    const buttonText =
        document.getElementById(
            "wyrePlaceOrderText"
        );


    /* Update latest cart information */

    updateOrderInformation();


    if (button) {

        button.disabled = true;

    }


    if (buttonText) {

        buttonText.textContent =
            "Sending Order...";

    }


    if (message) {

        message.textContent = "";

        message.className =
            "wyre-order-message";

    }


    try {

        const response =
            await fetch(
                FORMSPREE_ENDPOINT,
                {
                    method: "POST",

                    body: new FormData(form),

                    headers: {
                        Accept: "application/json"
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                "Formspree submission failed."
            );

        }


        /* Success */

        if (message) {

            message.textContent =
                "✓ Order placed successfully!";

            message.className =
                "wyre-order-message success";

        }


        if (buttonText) {

            buttonText.textContent =
                "Order Placed ✓";

        }


        /* Clear cart */

        cart = [];

        saveCart();

        updateCart();


        /* Close checkout after 2 seconds */

        setTimeout(function () {

            closeCheckout();

            closeCartDrawer();

            form.reset();


            if (button) {

                button.disabled = false;

            }


            if (buttonText) {

                buttonText.textContent =
                    "Place Order";

            }


            if (message) {

                message.textContent = "";

                message.className =
                    "wyre-order-message";

            }

        }, 2000);


    } catch (error) {

        console.error(
            "Order submission error:",
            error
        );


        if (message) {

            message.textContent =
                "Something went wrong. Please try again.";

            message.className =
                "wyre-order-message error";

        }


        if (button) {

            button.disabled = false;

        }


        if (buttonText) {

            buttonText.textContent =
                "Place Order";

        }

    }

}


/* =========================================================
   CHECKOUT BUTTON
========================================================= */

if (checkoutBtn) {

    checkoutBtn.addEventListener(
        "click",
        openCheckout
    );

}


/* =========================================================
   NEWSLETTER
========================================================= */

const newsletterForm =
    document.getElementById(
        "newsletterForm"
    );


if (newsletterForm) {

    newsletterForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const button =
                newsletterForm.querySelector(
                    "button"
                );


            if (button) {

                button.textContent =
                    "Subscribed ✓";

                button.disabled = true;

            }


            newsletterForm.reset();


            setTimeout(function () {

                if (button) {

                    button.textContent =
                        "Subscribe →";

                    button.disabled = false;

                }

            }, 3000);

        }
    );

}


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            if (searchOverlay) {

                searchOverlay.classList.remove(
                    "active"
                );

            }


            closeCartDrawer();

            closeCheckout();

        }

    }
);


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements =
    document.querySelectorAll(".reveal");


if ("IntersectionObserver" in window) {

    const revealObserver =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "show"
                        );

                        revealObserver.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach(function (element) {

        revealObserver.observe(element);

    });


} else {

    revealElements.forEach(function (element) {

        element.classList.add("show");

    });

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        String(text);

    return div.innerHTML;

}


/* =========================================================
   INITIALIZE
========================================================= */

updateCart();