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