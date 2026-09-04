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

function runProductSearch(searchValue) {

    let found = 0;


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

        const description =
            product.querySelector(".product-info p");

        const text =
            description
                ? description.textContent.toLowerCase()
                : "";


        const matches =
            searchValue === "" ||
            name.includes(searchValue) ||
            category.includes(searchValue) ||
            text.includes(searchValue);


        product.style.display =
            matches ? "" : "none";


        /* Reveal animation ke bina card invisible reh jata hai */

        if (matches) {

            product.classList.add("show");

            found += 1;

        }

    });


    return found;

}


if (searchInput) {

    /* Result counter inside the search box */

    const searchStatus =
        document.createElement("p");

    searchStatus.id = "searchStatus";

    searchStatus.style.cssText =
        "margin-top:18px;font-size:11px;letter-spacing:1px;color:#777;";

    if (searchInput.parentNode) {

        searchInput.parentNode.appendChild(
            searchStatus
        );

    }


    searchInput.addEventListener("input", function () {

        const searchValue =
            searchInput.value.toLowerCase().trim();


        const found =
            runProductSearch(searchValue);


        if (searchValue === "") {

            searchStatus.textContent = "";

        } else if (found === 0) {

            searchStatus.textContent =
                "No products match \u201C" +
                searchInput.value.trim() +
                "\u201D";

        } else {

            searchStatus.textContent =
                found +
                (found === 1
                    ? " product found \u2014 press Enter to view"
                    : " products found \u2014 press Enter to view");

        }

    });


    /* Enter = close overlay and jump to the results */

    searchInput.addEventListener("keydown", function (event) {

        if (event.key !== "Enter") {
            return;
        }

        event.preventDefault();


        const searchValue =
            searchInput.value.toLowerCase().trim();


        if (runProductSearch(searchValue) === 0) {
            return;
        }


        if (searchOverlay) {

            searchOverlay.classList.remove("active");

        }


        const shopSection =
            document.getElementById("shop");


        if (shopSection) {

            shopSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

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


        const thumb =
            item.image
                ? `<div class="wyre-cart-thumb">
                       <img src="${escapeHTML(item.image)}"
                            alt="${escapeHTML(item.name)}"
                            loading="lazy">
                   </div>`
                : "";


        cartItem.innerHTML = `
            ${thumb}

            <div class="wyre-cart-info">

                <div class="wyre-cart-top">

                    <strong>
                        ${escapeHTML(item.name)}
                    </strong>

                    <button
                        type="button"
                        class="wyre-remove"
                        data-index="${index}"
                        aria-label="Remove ${escapeHTML(item.name)}">
                        ×
                    </button>

                </div>

                <span class="wyre-cart-price">
                    PKR ${price.toLocaleString()}
                </span>

                <div class="wyre-cart-bottom">

                    <div class="wyre-quantity">

                        <button
                            type="button"
                            class="quantity-minus"
                            data-index="${index}"
                            aria-label="Decrease quantity">
                            −
                        </button>

                        <span>
                            ${quantity}
                        </span>

                        <button
                            type="button"
                            class="quantity-plus"
                            data-index="${index}"
                            aria-label="Increase quantity">
                            +
                        </button>

                    </div>

                    <span class="wyre-line-total">
                        PKR ${(price * quantity).toLocaleString()}
                    </span>

                </div>

            </div>
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

/* =========================================================
   PRODUCT DETAIL MODAL
========================================================= */

let pdImages = [];
let pdIndex = 0;
let pdQty = 1;
let pdCurrent = null;


function buildProductDetail() {

    if (document.getElementById("productDetail")) {
        return;
    }

    const modal = document.createElement("div");
    modal.id = "productDetail";

    modal.innerHTML = `
        <div class="pd-backdrop"></div>

        <div class="pd-box" role="dialog" aria-modal="true">

            <button class="pd-close" id="pdClose" aria-label="Close">&times;</button>

            <div class="pd-gallery">
                <div class="pd-track" id="pdTrack"></div>
                <button class="pd-arrow prev" id="pdPrev" aria-label="Previous image">&#8249;</button>
                <button class="pd-arrow next" id="pdNext" aria-label="Next image">&#8250;</button>
                <div class="pd-dots" id="pdDots"></div>
            </div>

            <div class="pd-info">

                <p class="pd-category" id="pdCategory"></p>
                <h2 class="pd-name" id="pdName"></h2>
                <p class="pd-price" id="pdPrice"></p>
                <p class="pd-desc" id="pdDesc"></p>

                <div class="pd-meta">
                    Cash on delivery available<br>
                    Delivery in 3&ndash;5 working days<br>
                    Easy exchange within 7 days
                </div>

                <div class="pd-qty-row">
                    <span class="pd-qty-label">Quantity</span>
                    <div class="pd-qty">
                        <button type="button" id="pdMinus" aria-label="Decrease">&minus;</button>
                        <span id="pdQtyValue">1</span>
                        <button type="button" id="pdPlus" aria-label="Increase">+</button>
                    </div>
                </div>

                <div class="pd-actions">
                    <button type="button" class="pd-buy" id="pdBuy">Order Now</button>
                    <button type="button" class="pd-add" id="pdAdd">Add to Bag</button>
                </div>

                <p class="pd-note">You pay when the parcel arrives.</p>

            </div>
        </div>
    `;

    document.body.appendChild(modal);


    document.getElementById("pdClose")
        .addEventListener("click", closeProductDetail);

    modal.querySelector(".pd-backdrop")
        .addEventListener("click", closeProductDetail);

    document.getElementById("pdPrev")
        .addEventListener("click", function () {
            goToSlide(pdIndex - 1);
        });

    document.getElementById("pdNext")
        .addEventListener("click", function () {
            goToSlide(pdIndex + 1);
        });

    document.getElementById("pdMinus")
        .addEventListener("click", function () {
            setQty(pdQty - 1);
        });

    document.getElementById("pdPlus")
        .addEventListener("click", function () {
            setQty(pdQty + 1);
        });

    document.getElementById("pdAdd")
        .addEventListener("click", function () {
            addDetailToCart();
            closeProductDetail();
            openCart();
        });

    document.getElementById("pdBuy")
        .addEventListener("click", function () {
            addDetailToCart();
            closeProductDetail();

            if (typeof openCheckout === "function") {
                openCheckout();
            } else {
                openCart();
            }
        });


    /* Swipe support for touch devices */

    const gallery = modal.querySelector(".pd-gallery");
    let startX = 0;
    let moved = false;

    gallery.addEventListener("touchstart", function (e) {
        startX = e.changedTouches[0].clientX;
        moved = false;
    }, { passive: true });

    gallery.addEventListener("touchmove", function () {
        moved = true;
    }, { passive: true });

    gallery.addEventListener("touchend", function (e) {
        if (!moved) return;
        const diff = e.changedTouches[0].clientX - startX;
        if (Math.abs(diff) < 45) return;
        goToSlide(diff < 0 ? pdIndex + 1 : pdIndex - 1);
    }, { passive: true });
}


function setQty(value) {

    pdQty = Math.max(1, Math.min(10, value));

    const box = document.getElementById("pdQtyValue");

    if (box) {
        box.textContent = pdQty;
    }
}


function goToSlide(index) {

    if (pdImages.length === 0) return;

    if (index < 0) {
        index = pdImages.length - 1;
    }

    if (index > pdImages.length - 1) {
        index = 0;
    }

    pdIndex = index;

    const track = document.getElementById("pdTrack");

    if (track) {
        track.style.transform =
            "translateX(-" + (pdIndex * 100) + "%)";
    }

    document.querySelectorAll(".pd-dot")
        .forEach(function (dot, i) {
            dot.classList.toggle("active", i === pdIndex);
        });
}


function renderGallery(images, name) {

    const track = document.getElementById("pdTrack");
    const dots = document.getElementById("pdDots");
    const prev = document.getElementById("pdPrev");
    const next = document.getElementById("pdNext");

    track.innerHTML = "";
    dots.innerHTML = "";

    images.forEach(function (src, i) {

        const slide = document.createElement("div");
        slide.className = "pd-slide";

        const img = document.createElement("img");
        img.src = src;
        img.alt = name + " image " + (i + 1);
        img.loading = i === 0 ? "eager" : "lazy";

        /* Agar file maujood na ho to slide hata do */
        img.addEventListener("error", function () {
            slide.remove();
            const dot = dots.children[i];
            if (dot) dot.remove();
            pdImages = pdImages.filter(function (s) {
                return s !== src;
            });
            refreshControls();
            goToSlide(0);
        });

        slide.appendChild(img);
        track.appendChild(slide);

        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "pd-dot" + (i === 0 ? " active" : "");
        dot.setAttribute("aria-label", "Image " + (i + 1));
        dot.addEventListener("click", function () {
            goToSlide(i);
        });
        dots.appendChild(dot);
    });

    refreshControls();

    function refreshControls() {
        const many = track.children.length > 1;
        prev.style.display = many ? "" : "none";
        next.style.display = many ? "" : "none";
        dots.style.display = many ? "" : "none";
    }
}


function openProductDetail(card) {

    buildProductDetail();

    const button = card.querySelector(".quick-add");
    const nameEl = card.querySelector(".product-info h3");
    const descEl = card.querySelector(".product-info p");
    const catEl = card.querySelector(".product-info span");
    const priceEl = card.querySelector(".product-info strong");
    const mainImg = card.querySelector(".product-image img");

    const name = nameEl ? nameEl.textContent.trim() : "WYRE Product";
    const price = button ? Number(button.dataset.price) || 0 : 0;
    const image = mainImg ? mainImg.getAttribute("src") : "";

    pdCurrent = { name: name, price: price, image: image };


    /* data-images ho to gallery, warna single image */

    if (card.dataset.images) {
        pdImages = card.dataset.images
            .split(",")
            .map(function (s) { return s.trim(); })
            .filter(Boolean);
    } else {
        pdImages = image ? [image] : [];
    }

    pdIndex = 0;
    setQty(1);

    document.getElementById("pdCategory").textContent =
        catEl ? catEl.textContent.trim() : "";

    document.getElementById("pdName").textContent = name;

    document.getElementById("pdPrice").textContent =
        priceEl ? priceEl.textContent.trim() : "";

    document.getElementById("pdDesc").textContent =
        descEl ? descEl.textContent.trim() : "";

    renderGallery(pdImages, name);
    goToSlide(0);

    const modal = document.getElementById("productDetail");
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}


function closeProductDetail() {

    const modal = document.getElementById("productDetail");

    if (modal) {
        modal.classList.remove("active");
    }

    document.body.style.overflow = "";
}


function addDetailToCart() {

    if (!pdCurrent || pdCurrent.price <= 0) {
        return;
    }

    const existing = cart.find(function (item) {
        return item.name === pdCurrent.name;
    });

    if (existing) {
        existing.quantity =
            Number(existing.quantity || 0) + pdQty;
    } else {
        cart.push({
            name: pdCurrent.name,
            price: pdCurrent.price,
            image: pdCurrent.image,
            quantity: pdQty
        });
    }

    saveCart();
    updateCart();
}


/* Card click opens the detail view */

products.forEach(function (card) {

    card.addEventListener("click", function (event) {

        if (event.target.closest(".quick-add") ||
            event.target.closest(".wishlist-btn")) {
            return;
        }

        openProductDetail(card);
    });
});


/* Keyboard: Esc closes, arrows change image */

document.addEventListener("keydown", function (event) {

    const modal = document.getElementById("productDetail");

    if (!modal || !modal.classList.contains("active")) {
        return;
    }

    if (event.key === "Escape") {
        closeProductDetail();
    }

    if (event.key === "ArrowLeft") {
        goToSlide(pdIndex - 1);
    }

    if (event.key === "ArrowRight") {
        goToSlide(pdIndex + 1);
    }
});