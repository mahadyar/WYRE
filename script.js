/* =========================================================
   WYRE — MAIN JAVASCRIPT
   Add to Cart + Checkout + Formspree
========================================================= */


/* =========================================================
   FORMSPREE
========================================================= */

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xvkoqrna";

/* Newsletter ke liye alag form banayen to sirf ye line badlein */
const NEWSLETTER_ENDPOINT = "https://formspree.io/f/xbgjzkpw";


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

/* Mobile par mega menu accordion ban jata hai */
function isMobileNav() {
    return window.matchMedia("(max-width: 700px)").matches;
}

function closeDrawer() {

    if (!navLinks || !menuToggle) return;

    navLinks.classList.remove("active");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");

    closeAllDropdowns();
}


if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", function () {

        const open = !navLinks.classList.contains("active");

        navLinks.classList.toggle("active", open);
        menuToggle.classList.toggle("active", open);
        menuToggle.setAttribute("aria-expanded", open ? "true" : "false");

        if (!open) closeAllDropdowns();
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            closeDrawer();
        });
    });
}


/* =========================================================
   MEGA MENU — desktop par hover, mobile par accordion
========================================================= */

const navItems =
    Array.prototype.slice.call(
        document.querySelectorAll("[data-nav-item]")
    );


/* Nav trigger ka apna section (jaise #collections) */

function goToNavTarget(selector) {

    if (!selector) return;

    const section = document.querySelector(selector);

    if (!section) return;

    section.scrollIntoView({ behavior: "smooth" });

    if (history.replaceState) {
        history.replaceState(null, "", selector);
    }
}


function closeAllDropdowns(except) {

    navItems.forEach(function (item) {

        if (item === except) return;

        item.classList.remove("open");

        const trigger = item.querySelector(".nav-trigger");
        if (trigger) trigger.setAttribute("aria-expanded", "false");
    });
}


function openDropdown(item) {

    closeAllDropdowns(item);

    item.classList.add("open");

    const trigger = item.querySelector(".nav-trigger");
    if (trigger) trigger.setAttribute("aria-expanded", "true");
}


function closeDropdown(item) {

    item.classList.remove("open");

    const trigger = item.querySelector(".nav-trigger");
    if (trigger) trigger.setAttribute("aria-expanded", "false");
}


navItems.forEach(function (item) {

    const trigger = item.querySelector(".nav-trigger");
    let hoverTimer = null;


    /* Hover (sirf desktop) */

    item.addEventListener("mouseenter", function () {

        if (isMobileNav()) return;

        clearTimeout(hoverTimer);
        openDropdown(item);
    });


    item.addEventListener("mouseleave", function () {

        if (isMobileNav()) return;

        hoverTimer = setTimeout(function () {
            closeDropdown(item);
        }, 140);
    });


    /* Click / keyboard

       Mobile par tap sirf accordion khole/band kare.

       Desktop par: menu band hai to pehle khule (keyboard aur touch
       ke liye), aur agar hover se already khula hai to click apne
       section par le jaye. */

    if (trigger) {

        trigger.addEventListener("click", function (event) {

            event.preventDefault();
            event.stopPropagation();

            const isOpen = item.classList.contains("open");

            if (isMobileNav()) {

                if (isOpen) {
                    closeDropdown(item);
                } else {
                    openDropdown(item);
                }

                return;
            }

            if (isOpen) {

                closeDropdown(item);
                goToNavTarget(trigger.dataset.navTarget);

            } else {
                openDropdown(item);
            }
        });
    }
});


/* Bahar click karne par band */

document.addEventListener("click", function (event) {

    if (navItems.length === 0) return;

    const insideNav = event.target.closest(".nav-links");

    if (!insideNav) closeAllDropdowns();
});


/* Escape se band */

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {
        closeAllDropdowns();
        if (isMobileNav()) closeDrawer();
    }
});


/* Desktop par wapis aane par accordion state saaf */

window.addEventListener("resize", function () {
    if (!isMobileNav()) closeAllDropdowns();
});


/* =========================================================
   MEGA MENU LINKS — category filter chalao
========================================================= */

document.querySelectorAll("[data-nav-filter]").forEach(function (link) {

    link.addEventListener("click", function (event) {

        event.preventDefault();

        const wanted = link.dataset.navFilter;

        const matchingFilter =
            document.querySelector(
                '.filter-btn[data-filter="' + wanted + '"]'
            );

        if (matchingFilter) matchingFilter.click();

        closeAllDropdowns();
        closeDrawer();

        const shopSection = document.getElementById("shop");

        if (shopSection) {
            shopSection.scrollIntoView({ behavior: "smooth" });
        }
    });
});


/* =========================================================
   SEARCH — panel search icon ke neeche khulta hai
========================================================= */

const searchButton = document.querySelector(".search-trigger");
const searchOverlay = document.getElementById("searchOverlay");
const searchClose = document.getElementById("searchClose");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const searchStatus = document.getElementById("searchStatus");


function openSearch() {

    if (!searchOverlay) {
        return;
    }

    searchOverlay.classList.add("active");

    if (searchButton) {
        searchButton.setAttribute("aria-expanded", "true");
    }

    if (searchInput) {

        setTimeout(function () {
            searchInput.focus();
        }, 120);

        renderSearchResults(searchInput.value);
    }
}


function closeSearch(clear) {

    if (!searchOverlay) {
        return;
    }

    searchOverlay.classList.remove("active");

    if (searchButton) {
        searchButton.setAttribute("aria-expanded", "false");
    }

    if (clear && searchInput) {

        searchInput.value = "";

        if (searchResults) {
            searchResults.innerHTML = "";
        }

        if (searchStatus) {
            searchStatus.textContent = "";
        }

        showAllProducts();
    }
}


if (searchButton && searchOverlay) {

    searchButton.addEventListener("click", function () {

        if (searchOverlay.classList.contains("active")) {
            closeSearch(false);
        } else {
            openSearch();
        }

    });

}


if (searchClose) {

    searchClose.addEventListener("click", function () {
        closeSearch(true);

        if (searchButton) {
            searchButton.focus();
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


/* =========================================================
   SEARCH RESULTS — dropdown ke andar live list
========================================================= */

const SEARCH_LIMIT = 6;


function readSearchCard(card) {

    const nameEl = card.querySelector(".product-info h3");
    const catEl = card.querySelector(".product-info span");
    const descEl = card.querySelector(".product-info p");
    const priceEl = card.querySelector(".product-info strong");
    const imgEl = card.querySelector(".product-image img");

    return {
        card: card,
        name: nameEl ? nameEl.textContent.trim() : "",
        category: catEl ? catEl.textContent.trim() : "",
        description: descEl ? descEl.textContent.trim() : "",
        price: priceEl ? priceEl.textContent.trim() : "",
        image: imgEl ? imgEl.getAttribute("src") : ""
    };
}


function scoreSearchCard(item, query) {

    const name = item.name.toLowerCase();
    const category = (
        item.category + " " + (item.card.dataset.category || "")
    ).toLowerCase();

    if (name.startsWith(query)) {
        return 4;
    }

    if (name.includes(query)) {
        return 3;
    }

    if (category.includes(query)) {
        return 2;
    }

    if (item.description.toLowerCase().includes(query)) {
        return 1;
    }

    return 0;
}


function findMatches(query) {

    const scored = [];

    products.forEach(function (card) {

        const item = readSearchCard(card);
        const score = scoreSearchCard(item, query);

        if (score > 0) {
            scored.push({ item: item, score: score });
        }

    });

    scored.sort(function (a, b) {
        return b.score - a.score;
    });

    return scored.map(function (entry) {
        return entry.item;
    });
}


function renderSearchResults(rawValue) {

    if (!searchResults) {
        return 0;
    }

    const query = rawValue.toLowerCase().trim();


    /* Khali input — grid poora, list khali */

    if (query === "") {

        searchResults.innerHTML = "";

        if (searchStatus) {
            searchStatus.textContent = "";
        }

        showAllProducts();

        return 0;
    }


    const matches = findMatches(query);


    /* Shop grid bhi sath hi filter hota rahe */

    runProductSearch(query);


    if (matches.length === 0) {

        searchResults.innerHTML =
            '<p class="search-empty">Koi product match nahi hua. ' +
            '<button type="button" id="searchReset">Show everything</button></p>';

        const reset = document.getElementById("searchReset");

        if (reset) {

            reset.addEventListener("click", function () {
                searchInput.value = "";
                renderSearchResults("");
                searchInput.focus();
            });

        }

        if (searchStatus) {
            searchStatus.textContent = "NO MATCHES";
        }

        return 0;
    }


    searchResults.innerHTML = "";


    matches.slice(0, SEARCH_LIMIT).forEach(function (item) {

        const hit = document.createElement("button");

        hit.type = "button";
        hit.className = "search-hit";
        hit.setAttribute("role", "option");

        const thumb = document.createElement("img");
        thumb.src = item.image;
        thumb.alt = "";

        const text = document.createElement("span");
        text.className = "search-hit-text";

        const name = document.createElement("b");
        name.textContent = item.name;

        const category = document.createElement("span");
        category.textContent = item.category;

        text.appendChild(name);
        text.appendChild(category);

        const price = document.createElement("strong");
        price.textContent = item.price;

        hit.appendChild(thumb);
        hit.appendChild(text);
        hit.appendChild(price);


        hit.addEventListener("click", function () {

            closeSearch(false);

            if (typeof openProductDetail === "function") {
                openProductDetail(item.card);
            } else {
                scrollToCard(item.card);
            }

        });


        searchResults.appendChild(hit);

    });


    if (searchStatus) {

        searchStatus.textContent =
            matches.length === 1
                ? "1 PRODUCT"
                : matches.length + " PRODUCTS" +
                  (matches.length > SEARCH_LIMIT
                      ? " — PRESS ENTER FOR ALL"
                      : "");

    }


    return matches.length;
}


function scrollToCard(card) {

    const shopSection = document.getElementById("shop");

    if (shopSection) {

        shopSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

    if (card) {

        setTimeout(function () {

            card.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }, 400);

    }
}


function moveSearchActive(direction) {

    if (!searchResults) {
        return;
    }

    const hits = Array.prototype.slice.call(
        searchResults.querySelectorAll(".search-hit")
    );

    if (hits.length === 0) {
        return;
    }

    let index = hits.findIndex(function (hit) {
        return hit.classList.contains("active");
    });

    hits.forEach(function (hit) {
        hit.classList.remove("active");
    });

    if (direction === "down") {
        index = index + 1 >= hits.length ? 0 : index + 1;
    } else {
        index = index <= 0 ? hits.length - 1 : index - 1;
    }

    hits[index].classList.add("active");

    if (hits[index].scrollIntoView) {
        hits[index].scrollIntoView({ block: "nearest" });
    }
}


if (searchInput) {

    let searchTimer = null;


    searchInput.addEventListener("input", function () {

        clearTimeout(searchTimer);

        searchTimer = setTimeout(function () {
            renderSearchResults(searchInput.value);
        }, 110);

    });


    searchInput.addEventListener("keydown", function (event) {

        if (event.key === "ArrowDown" || event.key === "ArrowUp") {

            event.preventDefault();

            moveSearchActive(
                event.key === "ArrowDown" ? "down" : "up"
            );

            return;
        }


        if (event.key !== "Enter") {
            return;
        }

        event.preventDefault();


        /* Arrow se select kiya hua result kholein */

        const active = searchResults
            ? searchResults.querySelector(".search-hit.active")
            : null;

        if (active) {
            active.click();
            return;
        }


        /* Warna poori grid dikhaen aur shop tak scroll karein */

        const query = searchInput.value.toLowerCase().trim();

        if (query === "" || runProductSearch(query) === 0) {
            return;
        }

        closeSearch(false);

        scrollToCard(null);

    });

}


/* =========================================================
   WISHLIST
========================================================= */

let wishlist = [];

try {
    wishlist = JSON.parse(
        localStorage.getItem("wyreWishlist")
    ) || [];
} catch (e) {
    wishlist = [];
}


function saveWishlist() {
    try {
        localStorage.setItem(
            "wyreWishlist",
            JSON.stringify(wishlist)
        );
    } catch (e) {
        /* storage band ho to bhi site chalti rahe */
    }
}


function readCard(card) {

    const button = card.querySelector(".quick-add");
    const nameEl = card.querySelector(".product-info h3");
    const catEl = card.querySelector(".product-info span");
    const img = card.querySelector(".product-image img");

    return {
        name: nameEl ? nameEl.textContent.trim() : "",
        price: button ? Number(button.dataset.price) || 0 : 0,
        image: img ? img.getAttribute("src") : "",
        category: catEl ? catEl.textContent.trim() : ""
    };
}


function inWishlist(name) {
    return wishlist.some(function (item) {
        return item.name === name;
    });
}


function updateWishlistCount() {

    const badge =
        document.getElementById("wishlistCount");

    if (badge) {
        badge.textContent = wishlist.length;
    }
}


const wishlistButtons =
    document.querySelectorAll(".wishlist-btn");

wishlistButtons.forEach(function (button) {

    const card = button.closest(".product-card");
    const data = card ? readCard(card) : null;

    /* Page khulte hi purani wishlist ke dil bhare hue dikhen */

    if (data && inWishlist(data.name)) {
        button.classList.add("liked");
        button.textContent = "♥";
    }


    button.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();

        if (!data) return;

        if (inWishlist(data.name)) {

            wishlist = wishlist.filter(function (item) {
                return item.name !== data.name;
            });

            button.classList.remove("liked");
            button.textContent = "♡";

        } else {

            wishlist.push(data);

            button.classList.add("liked");
            button.textContent = "♥";
        }

        saveWishlist();
        updateWishlistCount();
        renderWishlist();
    });

});


/* =========================================================
   WISHLIST DRAWER
========================================================= */

function buildWishlistDrawer() {

    if (document.getElementById("wishlistDrawer")) {
        return;
    }

    const drawer = document.createElement("div");
    drawer.className = "cart-drawer wishlist-drawer";
    drawer.id = "wishlistDrawer";

    drawer.innerHTML = `
        <div class="cart-header">

            <div>
                <p>SAVED FOR LATER</p>
                <h3>Wishlist</h3>
            </div>

            <button class="cart-close" id="wishlistClose" aria-label="Close wishlist">
                &times;
            </button>

        </div>

        <div class="cart-items" id="wishlistItems"></div>

        <div class="cart-footer">
            <button
                type="button"
                class="checkout-btn"
                id="wishlistAddAll">
                Move all to bag
            </button>
        </div>
    `;

    document.body.appendChild(drawer);


    document.getElementById("wishlistClose")
        .addEventListener("click", closeWishlist);

    document.getElementById("wishlistAddAll")
        .addEventListener("click", function () {

            if (wishlist.length === 0) return;

            wishlist.slice().forEach(function (item) {
                addSavedToCart(item.name);
            });

            closeWishlist();
            openCart();
        });
}


function renderWishlist() {

    buildWishlistDrawer();

    const box =
        document.getElementById("wishlistItems");

    const addAll =
        document.getElementById("wishlistAddAll");

    if (!box) return;

    box.innerHTML = "";


    if (wishlist.length === 0) {

        box.innerHTML =
            '<p class="empty-cart">Your wishlist is empty.</p>';

        if (addAll) addAll.disabled = true;

        return;
    }

    if (addAll) addAll.disabled = false;


    wishlist.forEach(function (item) {

        const row = document.createElement("div");
        row.className = "wyre-cart-item";

        const thumb =
            item.image
                ? `<div class="wyre-cart-thumb">
                       <img src="${escapeHTML(item.image)}"
                            alt="${escapeHTML(item.name)}"
                            loading="lazy">
                   </div>`
                : "";

        row.innerHTML = `
            ${thumb}

            <div class="wyre-cart-info">

                <div class="wyre-cart-top">

                    <strong>
                        ${escapeHTML(item.name)}
                    </strong>

                    <button
                        type="button"
                        class="wyre-remove wish-remove"
                        data-name="${escapeHTML(item.name)}"
                        aria-label="Remove from wishlist">
                        &times;
                    </button>

                </div>

                <span class="wyre-cart-price">
                    PKR ${Number(item.price).toLocaleString()}
                </span>

                <div class="wyre-cart-bottom">

                    <button
                        type="button"
                        class="wish-add"
                        data-name="${escapeHTML(item.name)}">
                        Add to bag
                    </button>

                </div>

            </div>
        `;

        box.appendChild(row);
    });


    box.querySelectorAll(".wish-remove").forEach(function (btn) {
        btn.addEventListener("click", function () {
            removeFromWishlist(btn.dataset.name);
        });
    });

    box.querySelectorAll(".wish-add").forEach(function (btn) {
        btn.addEventListener("click", function () {
            addSavedToCart(btn.dataset.name);
        });
    });
}


function removeFromWishlist(name) {

    wishlist = wishlist.filter(function (item) {
        return item.name !== name;
    });

    saveWishlist();
    updateWishlistCount();
    renderWishlist();

    /* Card wala dil bhi khali kar do */

    document.querySelectorAll(".product-card")
        .forEach(function (card) {

            const heading =
                card.querySelector(".product-info h3");

            if (heading &&
                heading.textContent.trim() === name) {

                const heart =
                    card.querySelector(".wishlist-btn");

                if (heart) {
                    heart.classList.remove("liked");
                    heart.textContent = "♡";
                }
            }
        });
}


function addSavedToCart(name) {

    /* Colour wale product ke liye detail modal kholo,
       warna colour chune baghair order chala jayega */

    let target = null;

    document.querySelectorAll(".product-card")
        .forEach(function (card) {

            const heading =
                card.querySelector(".product-info h3");

            if (heading &&
                heading.textContent.trim() === name) {
                target = card;
            }
        });

    if (target && target.dataset.colors) {
        closeWishlist();
        goToProductPage(target);
        return;
    }


    const saved = wishlist.find(function (item) {
        return item.name === name;
    });

    if (!saved) return;


    const existing = cart.find(function (item) {
        return item.name === saved.name;
    });

    if (existing) {
        existing.quantity = Number(existing.quantity || 0) + 1;
    } else {
        cart.push({
            name: saved.name,
            price: saved.price,
            image: saved.image,
            quantity: 1
        });
    }

    saveCart();
    updateCart();
}


function openWishlist() {

    renderWishlist();

    const drawer =
        document.getElementById("wishlistDrawer");

    if (drawer) {
        drawer.classList.add("active");
    }

    document.body.style.overflow = "hidden";
}


function closeWishlist() {

    const drawer =
        document.getElementById("wishlistDrawer");

    if (drawer) {
        drawer.classList.remove("active");
    }

    document.body.style.overflow = "";
}


const wishlistOpen =
    document.getElementById("wishlistOpen");

if (wishlistOpen) {
    wishlistOpen.addEventListener("click", openWishlist);
}

updateWishlistCount();


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

    checkoutBtn.addEventListener("click", function () {

        if (cart.length === 0) {
            return;
        }

        /* Ab checkout modal ki jagah apna alag page */
        window.location.href = "checkout.html";
    });

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
                newsletterForm.querySelector("button");

            const input =
                document.getElementById("newsletterEmail");

            if (!input) return;


            const email = input.value.trim();

            /* Sada sa check: bina @ aur dot ke bhejne ka faida nahi */
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                input.focus();
                return;
            }


            const original =
                button ? button.textContent : "";

            if (button) {
                button.textContent = "Sending...";
                button.disabled = true;
            }


            fetch(NEWSLETTER_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    type: "Newsletter signup",
                    email: email,
                    signed_up_at: new Date().toLocaleString()
                })
            })
            .then(function (response) {

                if (!response.ok) {
                    throw new Error("failed");
                }

                if (button) {
                    button.textContent = "Subscribed \u2713";
                }

                newsletterForm.reset();
            })
            .catch(function () {

                if (button) {
                    button.textContent = "Try again";
                }
            })
            .then(function () {

                setTimeout(function () {

                    if (button) {
                        button.textContent = original;
                        button.disabled = false;
                    }

                }, 3000);
            });

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

            closeSearch(false);


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
let pdColor = "";
let pdDefaultImages = [];
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

                <div class="pd-colors-row" id="pdColorsRow" hidden>

                    <span class="pd-qty-label">
                        Colour: <b id="pdColorName"></b>
                    </span>

                    <div class="pd-colors" id="pdColors"></div>

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
                    <button type="button" class="pd-add" id="pdAdd">Add to Cart</button>
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
            window.location.href = "checkout.html";
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

        /* Agar file maujood na ho to slide aur uska dot hata do */
        img.addEventListener("error", function () {

            const position =
                Array.prototype.indexOf.call(
                    track.children,
                    slide
                );

            if (position > -1 && dots.children[position]) {
                dots.children[position].remove();
            }

            slide.remove();

            pdImages = pdImages.filter(function (item) {
                return item !== src;
            });

            /* Baqi dots ko dobara sahi index dena */
            Array.prototype.forEach.call(
                dots.children,
                function (dot, newIndex) {
                    dot.onclick = function () {
                        goToSlide(newIndex);
                    };
                }
            );

            /* Sab slides gir gayin to asal tasveer wapis lao */
            if (track.children.length === 0 &&
                pdDefaultImages.length &&
                pdImages.length === 0) {

                showImages(pdDefaultImages);
                return;
            }

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


function showImages(list) {

    pdImages = list.slice();

    if (pdCurrent && pdImages[0]) {
        pdCurrent.image = pdImages[0];
    }

    renderGallery(pdImages, pdCurrent ? pdCurrent.name : "");
    goToSlide(0);
}


function applyColorImages(shots) {

    /* Us colour ki koi image di hi nahi gayi */

    if (shots.length === 0) {
        showImages(pdDefaultImages);
        return;
    }


    /* File maujood hai ya nahi, pehle check karo.
       Na mile to asal tasveer par hi rahne do,
       warna gallery khali ho jati hai. */

    const test = new Image();

    test.onload = function () {
        showImages(shots);
    };

    test.onerror = function () {
        showImages(pdDefaultImages);
    };

    test.src = shots[0];
}


function renderColors(raw) {

    const row = document.getElementById("pdColorsRow");
    const box = document.getElementById("pdColors");
    const label = document.getElementById("pdColorName");

    box.innerHTML = "";
    pdColor = "";


    const list = raw
        .split(",")
        .map(function (part) { return part.trim(); })
        .filter(Boolean);


    if (list.length === 0) {
        row.hidden = true;
        return;
    }

    row.hidden = false;


    list.forEach(function (entry, i) {

        const bits = entry.split("|");
        const colorName = bits[0].trim();
        const hex = (bits[1] || "#ccc").trim();

        /* Teesra hissa: is colour ki apni images (; se alag) */
        const shots =
            (bits[2] || "")
                .split(";")
                .map(function (x) { return x.trim(); })
                .filter(Boolean);


        const swatch = document.createElement("button");
        swatch.type = "button";
        swatch.className = "pd-swatch" + (i === 0 ? " active" : "");
        swatch.style.background = hex;
        swatch.title = colorName;
        swatch.setAttribute("aria-label", colorName);

        swatch.addEventListener("click", function () {

            box.querySelectorAll(".pd-swatch")
                .forEach(function (other) {
                    other.classList.remove("active");
                });

            swatch.classList.add("active");
            pdColor = colorName;
            label.textContent = colorName;

            applyColorImages(shots);
        });

        box.appendChild(swatch);

        if (i === 0) {
            pdColor = colorName;
            label.textContent = colorName;
            if (shots.length) {
                applyColorImages(shots);
            }
        }
    });
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

    pdDefaultImages = pdImages.slice();
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

    renderColors(card.dataset.colors || "");

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

    /* Har colour cart mein apni alag line banega */

    const label =
        pdColor
            ? pdCurrent.name + " \u2014 " + pdColor
            : pdCurrent.name;

    const existing = cart.find(function (item) {
        return item.name === label;
    });

    if (existing) {
        existing.quantity =
            Number(existing.quantity || 0) + pdQty;
    } else {
        cart.push({
            name: label,
            price: pdCurrent.price,
            image: pdCurrent.image,
            quantity: pdQty
        });
    }

    saveCart();
    updateCart();
}


/* Card click opens the detail view */

function productSlug(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}


function goToProductPage(card) {

    const heading =
        card.querySelector(".product-info h3");

    if (!heading) return;

    window.location.href =
        "product.html?p=" +
        productSlug(heading.textContent.trim());
}


products.forEach(function (card) {

    /* Colour wale product ka Quick Add uske page par le jaye,
       warna order mein colour hi nahi aayega */

    if (card.dataset.colors) {

        const quick = card.querySelector(".quick-add");

        if (quick) {

            quick.addEventListener("click", function (event) {
                event.stopPropagation();
                event.preventDefault();
                goToProductPage(card);
            }, true);
        }
    }


    card.addEventListener("click", function (event) {

        if (event.target.closest(".quick-add") ||
            event.target.closest(".wishlist-btn")) {
            return;
        }

        goToProductPage(card);
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

/* =========================================================
   REAL VIEWPORT HEIGHT
   Mobile browsers ka address bar 100vh ko bara kar deta hai,
   is liye asal height khud naap kar CSS ko dete hain.
========================================================= */

function setAppHeight() {

    document.documentElement.style.setProperty(
        "--app-height",
        window.innerHeight + "px"
    );
}

setAppHeight();

window.addEventListener("resize", setAppHeight);
window.addEventListener("orientationchange", setAppHeight);

/* Address bar chhupne/aane par bhi update */
if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", setAppHeight);
}

/* Search panel ke bahar click karne par band ho jaye */

document.addEventListener("click", function (event) {

    const overlay =
        document.getElementById("searchOverlay");

    if (!overlay || !overlay.classList.contains("active")) {
        return;
    }

    if (event.target.closest(".nav-search")) {
        return;
    }

    closeSearch(false);
});


/* Escape se bhi band */

document.addEventListener("keydown", function (event) {

    if (event.key !== "Escape") return;

    const overlay =
        document.getElementById("searchOverlay");

    if (overlay && overlay.classList.contains("active")) {

        closeSearch(false);

        if (searchButton) {
            searchButton.focus();
        }

    }

    closeWishlist();
});

/* =========================================================
   NAVBAR: active link scroll ke sath badle
========================================================= */

const spySections =
    document.querySelectorAll("section[id]");

const spyLinks =
    document.querySelectorAll(".nav-links > a[href^='#']");


function updateActiveLink() {

    let current = "";

    spySections.forEach(function (section) {

        const top =
            section.getBoundingClientRect().top;

        /* Navbar ki oonchai ka margin */
        if (top <= 120) {
            current = section.id;
        }
    });


    /* Page ke bilkul neeche pohanch gaye to aakhri section */
    if (window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 40) {

        const last = spySections[spySections.length - 1];
        if (last) current = last.id;
    }


    spyLinks.forEach(function (link) {

        const target =
            link.getAttribute("href").replace("#", "");

        link.classList.toggle(
            "active",
            target === current
        );
    });
}


window.addEventListener("scroll", updateActiveLink, { passive: true });
window.addEventListener("resize", updateActiveLink);
updateActiveLink();