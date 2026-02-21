const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const suggestionsList = document.getElementById("suggestionsList");
const resultsContainer = document.getElementById("resultsContainer");
const statusMessage = document.getElementById("statusMessage");
const loader = document.getElementById("loader");
const themeToggle = document.getElementById("themeToggle");

let timeout = null;

/* ----------------- Fetch Suggestions ----------------- */
searchInput.addEventListener("input", () => {
    clearTimeout(timeout);
    const query = searchInput.value.trim();
    if (!query) {
        suggestionsList.classList.add("hidden");
        return;
    }

    timeout = setTimeout(async () => {
        const url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${query}&limit=5&origin=*`;
        const response = await fetch(url);
        const data = await response.json();
        showSuggestions(data[1]);
    }, 300);
});

function showSuggestions(suggestions) {
    suggestionsList.innerHTML = "";
    if (suggestions.length === 0) return;

    suggestions.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        li.onclick = () => {
            searchInput.value = item;
            suggestionsList.classList.add("hidden");
            searchWikipedia();
        };
        suggestionsList.appendChild(li);
    });

    suggestionsList.classList.remove("hidden");
}

/* ----------------- Search Wikipedia ----------------- */
searchBtn.addEventListener("click", searchWikipedia);
searchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") searchWikipedia();
});

async function searchWikipedia() {
    const query = searchInput.value.trim();
    if (!query) return;

    suggestionsList.classList.add("hidden");
    resultsContainer.innerHTML = "";
    statusMessage.textContent = "";
    loader.classList.remove("hidden");

    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srsearch=${query}`;
    const response = await fetch(url);
    const data = await response.json();

    loader.classList.add("hidden");

    if (data.query.search.length === 0) {
        statusMessage.textContent = "No results found.";
        return;
    }

    data.query.search.forEach(item => {
        const pageUrl = `https://en.wikipedia.org/?curid=${item.pageid}`;
        const card = `
            <div class="card">
                <h3>${item.title}</h3>
                <p>${item.snippet}...</p>
                <a href="${pageUrl}" target="_blank">Read More →</a>
            </div>
        `;
        resultsContainer.innerHTML += card;
    });
}

/* ----------------- Dark/Light Mode Toggle ----------------- */
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});
