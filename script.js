// Cache DOM elements once so they can be reused efficiently.
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const resultsContainer = document.getElementById('results');
const statusMessage = document.getElementById('statusMessage');

// Wikipedia search endpoint with JSON output and CORS support.
const WIKIPEDIA_API_URL =
  'https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*';

// Converts HTML snippets from API into plain text for safe rendering.
function stripHtml(htmlText) {
  const temp = document.createElement('div');
  temp.innerHTML = htmlText;
  return temp.textContent || temp.innerText || '';
}

// Clears current search results before rendering a new set.
function clearResults() {
  resultsContainer.innerHTML = '';
}

// Renders the fetched results as clickable cards that open in a new tab.
function renderResults(results) {
  clearResults();

  results.forEach((item) => {
    const articleUrl = `https://en.wikipedia.org/?curid=${item.pageid}`;

    const card = document.createElement('a');
    card.className = 'result-item';
    card.href = articleUrl;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';

    const title = document.createElement('h2');
    title.textContent = item.title;

    const snippet = document.createElement('p');
    snippet.textContent = stripHtml(item.snippet);

    card.appendChild(title);
    card.appendChild(snippet);
    resultsContainer.appendChild(card);
  });
}

// Performs API fetch based on the user's query and updates the UI states.
async function searchWikipedia() {
  const query = searchInput.value.trim();

  if (!query) {
    statusMessage.textContent = 'Please enter a search term.';
    clearResults();
    return;
  }

  statusMessage.textContent = 'Searching...';
  clearResults();

  try {
    const response = await fetch(`${WIKIPEDIA_API_URL}&srsearch=${encodeURIComponent(query)}`);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    const results = data?.query?.search || [];

    if (results.length === 0) {
      statusMessage.textContent = 'No results found.';
      return;
    }

    statusMessage.textContent = `Showing ${results.length} result(s).`;
    renderResults(results);
  } catch (error) {
    statusMessage.textContent = 'Could not fetch results. Please try again.';
    console.error('Wikipedia API error:', error);
  }
}

// Wire up click and Enter-key handlers for better usability.
searchButton.addEventListener('click', searchWikipedia);
searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    searchWikipedia();
  }
});
