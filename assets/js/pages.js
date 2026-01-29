document.addEventListener("DOMContentLoaded", function () {
  const DATA_URL = "content/news-index.json"; 
  const ARTICLES_PER_PAGE = 12;
  const PAGES_PER_SET = 10;

  const urlParams = new URLSearchParams(window.location.search);
  let currentPage = parseInt(urlParams.get('page')) || 1;

  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }

  function renderArticles(articles) {
    const container = document.getElementById("article-container");
    container.innerHTML = "";

    if (!articles || articles.length === 0) {
      container.innerHTML = `<div class="col-12 text-center"><p>No news available.</p></div>`;
      return;
    }

    articles.forEach(item => {
      const imageUrl = item.image || "assets/img/placeholder-news.jpg";
      const date = formatDate(item.date);
      const detailLink = `news-detail.html?slug=${item.slug}`;

      const cardHtml = `
            <div class="col-12 col-sm-6 col-lg-4 d-flex mb-4">
                <div class="card h-100 shadow-sm w-100">
                    ${imageUrl !== 'assets/img/placeholder-news.jpg' ? `<img src="${imageUrl}" class="card-img-top" alt="${item.title}">` : ""}
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">
                            <a href="${detailLink}" style="text-decoration:none; color:inherit;">${item.title}</a>
                        </h5>
                        <p class="text-muted small mb-2">
                            <i class="bi bi-calendar-event"></i> ${date}
                        </p>
                        <p class="card-text" style="text-align: justify;">
                            ${item.summary}
                        </p>
                        <a href="${detailLink}" class="btn btn-primary btn-sm mt-auto">
                            Continue reading <i class="bi bi-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </div>`;
      container.insertAdjacentHTML('beforeend', cardHtml);
    });
  }

  function renderPagination(totalItems, current) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    const totalPages = Math.ceil(totalItems / ARTICLES_PER_PAGE);
    if (totalPages <= 1) return;

    let startPage = Math.max(1, current - Math.floor(PAGES_PER_SET / 2));
    let endPage = Math.min(totalPages, startPage + PAGES_PER_SET - 1);

    if (endPage - startPage + 1 < PAGES_PER_SET) {
      startPage = Math.max(1, endPage - PAGES_PER_SET + 1);
    }

    if (current > 1) {
      pagination.innerHTML += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="changePage(${current - 1}); return false;">&laquo;</a>
            </li>`;
    }

    for (let i = startPage; i <= endPage; i++) {
      pagination.innerHTML += `
            <li class="page-item ${i === current ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
            </li>`;
    }

    if (current < totalPages) {
      pagination.innerHTML += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="changePage(${current + 1}); return false;">&raquo;</a>
            </li>`;
    }
  }

  async function fetchNews(page) {
    try {
      console.log(`🌐 Fetching local news index...`);
      const response = await fetch(DATA_URL);
      if (!response.ok) throw new Error("Gagal load news-index.json");

      const json = await response.json();
      const allNews = json.news;

      const startIndex = (page - 1) * ARTICLES_PER_PAGE;
      const endIndex = startIndex + ARTICLES_PER_PAGE;
      const paginatedNews = allNews.slice(startIndex, endIndex);

      renderArticles(paginatedNews);
      renderPagination(allNews.length, page);

    } catch (error) {
      console.error("Error loading news:", error);
      document.getElementById("article-container").innerHTML = 
        `<div class="col-12 text-center text-danger"><p>Failed to load news. Check if news-index.json exists.</p></div>`;
    }
  }

  window.changePage = function (page) {
    const url = new URL(window.location);
    url.searchParams.set('page', page);
    window.history.pushState({}, '', url);
    
    const scrollTarget = document.getElementById('article-container');
    if(scrollTarget) scrollTarget.scrollIntoView({ behavior: 'smooth' });

    fetchNews(page);
  };

  fetchNews(currentPage);
});