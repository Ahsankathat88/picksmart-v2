let allProducts = [];
let currentData = [];

// Load data from JSON
async function loadData() {
    const grid = document.getElementById("productGrid");
    const loader = document.getElementById("loader");
    loader.style.display = "block";
    
    try {
        // Correct path for GitHub Pages: './data/products.json'
        const response = await fetch('./data/products.json');
        if (!response.ok) throw new Error("Data not found");
        
        allProducts = await response.json();
        currentData = [...allProducts];
        
        setupCategories();
        render(allProducts);
    } catch (err) {
        console.error(err);
        grid.innerHTML = `<div style="text-align:center; width:100%; padding:50px;">
            <h3>product not show please try agine</h3>
            <p>VS Code me 'Live Server' use karein ya GitHub par check karein.</p>
        </div>`;
    } finally {
        loader.style.display = "none";
    }
}

function render(data) {
    const grid = document.getElementById("productGrid");
    grid.innerHTML = data.map(p => `
        <div class="card">
            <img src="${p.img}" alt="${p.name}" loading="lazy">
            <h3>${p.name}</h3>
            <p class="price">₹${p.price.toLocaleString("en-IN")}</p>
            <a href="${p.link}" target="_blank" rel="nofollow sponsored" class="buy-btn">View on Amazon</a>
        </div>
    `).join("");
}

function setupCategories() {
    const strip = document.getElementById("categoryStrip");
    const cats = ["all", ...new Set(allProducts.map(p => p.cat))];
    strip.innerHTML = cats.map(c => 
        `<button class="cat-btn ${c === 'all' ? 'active' : ''}" onclick="filterProducts('${c}', this)">${c}</button>`
    ).join("");
}

function filterProducts(cat, btn) {
    document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentData = (cat === "all") ? allProducts : allProducts.filter(p => p.cat === cat);
    render(currentData);
}

function searchProduct() {
    const term = document.getElementById("searchInput").value.toLowerCase();
    const filtered = allProducts.filter(p => p.name.toLowerCase().includes(term));
    render(filtered);
}

function sortProducts() {
    const val = document.getElementById("sortPrice").value;
    if (val === "low") currentData.sort((a, b) => a.price - b.price);
    if (val === "high") currentData.sort((a, b) => b.price - a.price);
    render(currentData);
}

function showPage(page) {
    document.querySelectorAll(".content-section").forEach(s => s.classList.add("hidden"));
    document.getElementById(page + "Page").classList.remove("hidden");
    if(!document.getElementById("mobileMenu").classList.contains("hidden")) toggleMenu();
    window.scrollTo(0,0);
}

function toggleMenu() {
    document.getElementById("mobileMenu").classList.toggle("hidden");
}

document.getElementById("themeToggle").onclick = () => {
    const body = document.body;
    const isDark = body.getAttribute("data-theme") === "dark";
    body.setAttribute("data-theme", isDark ? "light" : "dark");
    document.getElementById("themeToggle").innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
};

// Start
loadData();