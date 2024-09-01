
console.log('common.js is being executed');

const headerHTML = `
<nav class="navbar">
    <div class="nav-links">
        <a href="index.html">Home</a>
        <a href="blog.html">Blog</a>
        <a href="bookshelf.html">Bookshelf</a>
    </div>
    <div class="social-links">
        <a href="https://github.com/SaiKiran92" target="_blank"><i class="fab fa-github"></i></a>
        <a href="https://www.linkedin.com/in/saikiranm92" target="_blank"><i class="fab fa-linkedin"></i></a>
    </div>
</nav>
`;

window.loadHeader = function() {
    console.log('Attempting to load header...');
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    console.log('Header inserted into the document.');
}

// Call loadHeader when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', window.loadHeader);

console.log('loadHeader function has been defined');

// Call loadHeader when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadHeader);

function showPage(items, itemsPerPage, pageNum) {
    const start = (pageNum - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    items.forEach((item, index) => {
        if (index >= start && index < end) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function createPagination(items, itemsPerPage, paginationTopId, paginationBottomId) {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const paginationTop = document.getElementById(paginationTopId);
    const paginationBottom = document.getElementById(paginationBottomId);
    let paginationHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `<a href="#" ${i === 1 ? 'class="active"' : ''}>${i}</a>`;
    }

    paginationTop.innerHTML = paginationHTML;
    paginationBottom.innerHTML = paginationHTML;

    [paginationTop, paginationBottom].forEach(pagination => {
        pagination.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                e.preventDefault();
                const pageNum = parseInt(e.target.textContent);
                showPage(items, itemsPerPage, pageNum);
                document.querySelectorAll('.pagination a').forEach(a => a.classList.remove('active'));
                document.querySelectorAll(`.pagination a:nth-child(${pageNum})`).forEach(a => a.classList.add('active'));
            }
        });
    });
}

function setupTagFiltering(items, tagSelectId, itemsPerPage, paginationTopId, paginationBottomId) {
    document.getElementById(tagSelectId).addEventListener('change', function() {
        const selectedTag = this.value;
        items.forEach(item => {
            const tags = item.getAttribute('data-tags').split(',');
            item.style.display = selectedTag === '' || tags.includes(selectedTag) ? 'block' : 'none';
        });
        createPagination(Array.from(items).filter(item => item.style.display !== 'none'), itemsPerPage, paginationTopId, paginationBottomId);
        showPage(items, itemsPerPage, 1);
    });
}

async function loadBooks() {
    try {
        const response = await fetch('books/index.json');
        const bookFiles = await response.json();
        const bookPromises = bookFiles.map(file => fetch(`books/${file}`).then(res => res.json()));
        const books = await Promise.all(bookPromises);
        return books;
    } catch (error) {
        console.error('Error loading books:', error);
        return [];
    }
}

function renderBooks(books) {
    const booksContainer = document.querySelector('.books');
    booksContainer.innerHTML = books.map(book => `
        <div class="book" data-tags="${book.tags.join(',')}">
            <img src="${book.cover}" alt="${book.title}" data-thoughts="${book.thoughts}">
            <p>${book.title}</p>
            <div class="book-tags">
                ${book.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

async function loadBlogPosts() {
    try {
        const response = await fetch('blog_posts/index.json');
        const postFiles = await response.json();
        const postPromises = postFiles.map(file => fetch(`blog_posts/${file}`).then(res => res.json()));
        const posts = await Promise.all(postPromises);
        return posts.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first
    } catch (error) {
        console.error('Error loading blog posts:', error);
        return [];
    }
}

function renderBlogPosts(posts) {
    const postsContainer = document.querySelector('#blog-posts');
    const baseUrl = window.location.href.replace(/\/[^\/]*$/, '/');
    postsContainer.innerHTML = posts.map(post => `
        <div class="blog-post" data-tags="${post.tags.join(',')}">
            <h2><a href="https://nbviewer.jupyter.org/url/${encodeURIComponent(baseUrl + post.notebook_url)}" target="_blank">${post.title}</a></h2>
            <p>Posted on ${new Date(post.date).toLocaleDateString()}</p>
            <p>${post.brief}</p>
            <div class="tags">
                ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');
}
