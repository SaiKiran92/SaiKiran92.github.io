document.addEventListener('DOMContentLoaded', (event) => {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        if (query.length < 2) {
            searchResults.innerHTML = '';
            return;
        }

        fetch('/index.json')
            .then(response => response.json())
            .then(data => {
                const results = data.filter(item => 
                    item.title.toLowerCase().includes(query) || 
                    item.tags.some(tag => tag.toLowerCase().includes(query))
                );
                displayResults(results);
            });
    });

    function displayResults(results) {
        searchResults.innerHTML = '';
        results.forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = item.permalink;
            a.textContent = item.title;
            li.appendChild(a);
            searchResults.appendChild(li);
        });
    }
});