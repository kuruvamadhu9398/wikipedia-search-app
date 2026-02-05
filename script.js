const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsDiv = document.getElementById('results');
const message = document.getElementById('message');
const loader = document.getElementById('loader');
const suggestionsBox = document.getElementById('suggestions');
const themeToggle = document.getElementById('themeToggle');

/* THEME TOGGLE */
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
});

/* FETCH SUGGESTIONS */
searchInput.addEventListener('input', async () => {
  const q = searchInput.value.trim();
  if (!q) return (suggestionsBox.innerHTML = '');

  const res = await fetch(
    `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${q}&origin=*`
  );
  const data = await res.json();

  suggestionsBox.innerHTML = data[1].map((item) => `<div>${item}</div>`).join('');

  document.querySelectorAll('#suggestions div').forEach((div) => {
    div.addEventListener('click', () => {
      searchInput.value = div.textContent;
      suggestionsBox.innerHTML = '';
      searchWikipedia();
    });
  });
});

/* SEARCH FUNCTION */
async function searchWikipedia() {
  const query = searchInput.value.trim();
  if (!query) {
    message.textContent = '⚠️ Enter a search term.';
    return;
  }

  loader.classList.remove('hidden');
  resultsDiv.innerHTML = '';
  message.textContent = '';

  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&format=json&origin=*`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const results = data.query.search;

    if (results.length === 0) {
      message.textContent = 'No results found.';
    } else {
      resultsDiv.innerHTML = results
        .map(
          (r) => `
                    <div class="result-card">
                        <h3>${r.title}</h3>
                        <p>${r.snippet}</p>
                        <a href="https://en.wikipedia.org/?curid=${r.pageid}" target="_blank">
                            Read on Wikipedia →
                        </a>
                    </div>
                `
        )
        .join('');
    }
  } catch (error) {
    message.textContent = '❌ Network error.';
  }

  loader.classList.add('hidden');
}

/* TRIGGER SEARCH */
searchBtn.addEventListener('click', searchWikipedia);
searchInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') searchWikipedia();
});
