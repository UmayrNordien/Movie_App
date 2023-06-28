const apiKey = "bb54f7b2b7df1fb3997388d5d115ba52"; /* temporary key */
const imgApi = "https://image.tmdb.org/t/p/w1280";
const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=`;
const form = document.getElementById("search-form");
const query = document.getElementById("search-input");
const result = document.getElementById("result");

//emojis to use in console.log from CodePoint
const flame = String.fromCodePoint(0x1F525);

let page = 1;
let isSearching = false;

async function fetchData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response error");
      }
      console.log('%cdata fetched successfully...', 'color: purple; background: pink;');
      return await response.json();
    } catch (error) {
      return null;
    }
  }

// Fetch and show results based on url
async function fetchAndShowResult(url) {
    const data = await fetchData(url);
    if (data && data.results) {
        showResults(data.results);
    }
    console.log('%cdata fetched and displayed successfully ' + flame, 'color: purple; background: pink;');
}

// Create movie card html template
function createMovieCard(movie) {
    const { poster_path, original_title, release_date, overview } = movie;
    const imagePath = poster_path ? imgApi + poster_path : "loader.gif";
    const truncatedTitle = original_title.length > 15 ? original_title.slice(0, 15) + "..." : original_title;
    const formattedDate = release_date || "No release date";
    const cardTemplate = `
        <div class="column">
            <div class="card">
                <a class="card-media" href="fallback.gif">
                    <img src="${imagePath}" alt="${original_title}" width="100%" />
                </a>
                <div class="card-content">
                    <div class="card-header">
                        <div class="left-content">
                        <h3 style="font-weight: 600">${truncatedTitle}</h3>
                        <span style="color: var(--tertiary-color); font-weight: 600">${formattedDate}</span>
                        </div>
                    <div class="right-content">
                        <a href="${imagePath}" target="_blank" class="card-btn">See Cover</a>
                    </div>
                </div>
                <div class="info">
                    ${overview || "No overview yet..."}
                </div>
            </div>
        </div>
    </div>
    `;
    return cardTemplate;
}


// Clear result element for search
function clearResults() {
    result.innerHTML = "";
    console.log('%cresults cleared upon page initialisation', 'color: white; background: blue;');
}

// Show results in page
function showResults(item) {
    const newContent = item.map(createMovieCard).join("");
    result.innerHTML += newContent || "<p>No results found.</p>";
}

// Load more results
async function loadMoreResults() {
    if (isSearching) {
        return;
    }
    page++;
    const searchTerm = query.value;
    const url = searchTerm ? `${searchUrl}${searchTerm}&page=${page}` : `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=${page}`;
    await fetchAndShowResult(url);
}

// Detect end of page and load more results
function detectEnd() {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
        loadMoreResults();
        console.log('%cmore rusults loaded', 'color: green');
    }
} 

// Handle search
async function handleSearch(e) {
    e.preventDefault();
    const searchTerm = query.value.trim();
    if (searchTerm) {
        isSearching = true;
        clearResults();
        const newUrl = `${searchUrl}${searchTerm}&page=${page}`;
        await fetchAndShowResult(newUrl);
        query.value = "";
        document.body.classList.add('searching');
    }
}

// Clear search results and reset page to show popular movies
function clearSearch() {
    page = 1;
    isSearching = false;
    document.body.classList.remove('searching');
    clearResults();
    init();
    console.log('%csearch results cleared', 'color: green');
}

// Add event listener to "Go Back" button
document.querySelector('.back-btn').addEventListener('click', clearSearch);

// Event listeners
form.addEventListener('submit', handleSearch);
query.addEventListener('keydown', function (event) {
    if (event.key === "Enter") {
        handleSearch(event);
    }
});
window.addEventListener('scroll', detectEnd);
window.addEventListener('resize', detectEnd);

// Initialize the page
async function init() {
    clearResults();
    const url = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=${page}`;
    isSearching = false;
    await fetchAndShowResult(url);
    document.body.classList.remove('searching'); // Remove the 'searching' class from the body element
}

init(); // Call the init function to initialize the page


//Back to top button
const backToTopButton = document.querySelector(".back-to-top-btn");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 100) {
    backToTopButton.classList.add("show");
  } else {
    backToTopButton.classList.remove("show");
  }
});

backToTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  console.log('%c--back to top button clicked', 'color: purple;');
});
