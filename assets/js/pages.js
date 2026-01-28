document.addEventListener("DOMContentLoaded", function () {
  const API_URL = "https://blessed-crystal-ef83780819.strapiapp.com/api/news";
  const ARTICLES_PER_PAGE = 12;
  const PAGES_PER_SET = 10;
  const CACHE_DURATION = 1000 * 60 * 30;

  const urlParams = new URLSearchParams(window.location.search);
  let currentPage = parseInt(urlParams.get('page')) || 1;

  function createExcerpt(markdown, length = 200) {
    if (!markdown) return "";
    let text = markdown.replace(/!\[.*?\]\(.*?\)/g, "");
    text = text.replace(/#+/g, "");
    text = text.replace(/\*/g, "");
    return text.trim().substring(0, length) + "...";
  }

  function getCoverImage(item) {
    if (item.thumbnail?.url) {
      return item.thumbnail.url;
    }

    const markdownImage = item.content.match(/!\[.*?\]\((.*?)\)/);
    if (markdownImage && markdownImage[1]) {
      return markdownImage[1];
    }

    return null;
  }

  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }


  function renderArticles(articles) {
    const container = document.getElementById("article-container");
    container.innerHTML = "";

    if (articles.length === 0) {
      container.innerHTML = `<div class="col-12 text-center"><p>No news available.</p></div>`;
      return;
    }

    articles.forEach(item => {
      const imageUrl = getCoverImage(item);
      const excerpt = createExcerpt(item.content);
      const date = formatDate(item.date);

      const detailLink = `news-detail.html?slug=${item.slug}`;

      const cardHtml = `
            <div class="col-12 col-sm-6 col-lg-4 d-flex mb-4">
                <div class="card h-100 shadow-sm w-100">
                 ${imageUrl ? `<img src="${imageUrl}" class="card-img-top" alt="${item.title}" style="height: 200px; object-fit: cover;">` : ""}
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title"><a href="${detailLink}" style="text-decoration:none; color:inherit;">${item.title}</a></h5>
                        <p class="text-muted small mb-2">
                            <i class="bi bi-calendar-event"></i> ${date}
                        </p>
                        <p class="card-text" style="text-align: justify;">
                            ${excerpt}
                        </p>
                        <a href="${detailLink}" class="btn btn-primary btn-sm mt-auto">
                            Continue reading <i class="bi bi-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </div>
            `;
      container.insertAdjacentHTML('beforeend', cardHtml);
    });
  }

  function renderPagination(paginationMeta) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    const totalPages = paginationMeta.pageCount;
    const current = paginationMeta.page;

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

    // Tombol Angka
    for (let i = startPage; i <= endPage; i++) {
      pagination.innerHTML += `
            <li class="page-item ${i === current ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
            </li>`;
    }

    // Tombol Next
    if (current < totalPages) {
      pagination.innerHTML += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="changePage(${current + 1}); return false;">&raquo;</a>
            </li>`;
    }
  }

  async function fetchNews(page) {
    const cacheKey = `news_page_${page}`;

    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      const now = new Date().getTime();
      if (now - parsed.timestamp < CACHE_DURATION) {
        console.log(`⚡ Load News Page ${page} from Cache`);
        renderArticles(parsed.data);
        renderPagination(parsed.meta);
        return;
      }
    }

    try {
      console.log(`🌐 Fetching News Page ${page} from Strapi...`);

      const query = new URLSearchParams({
        'pagination[page]': page,
        'pagination[pageSize]': ARTICLES_PER_PAGE,
        'sort': 'date:desc',
        'populate': 'thumbnail'
      });

      const response = await fetch(`${API_URL}?${query.toString()}`);
      if (!response.ok) throw new Error("API Error");

      const json = await response.json();

      // Render UI
      renderArticles(json.data);
      renderPagination(json.meta.pagination);

      const cacheData = {
        timestamp: new Date().getTime(),
        data: json.data,
        meta: json.meta.pagination
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));

    } catch (error) {
      console.error("Error fetching news:", error);
      const container = document.getElementById("article-container");
      container.innerHTML = `<div class="col-12 text-center text-danger"><p>Failed to load news. Please try again later.</p></div>`;
    }
  }

  window.changePage = function (page) {
    const url = new URL(window.location);
    url.searchParams.set('page', page);
    window.history.pushState({}, '', url);

    document.getElementById('header').scrollIntoView({ behavior: 'smooth' });

    fetchNews(page);
  };

  fetchNews(currentPage);
});