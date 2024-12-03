$(document).ready(function () {
    const API_KEY = 'AIzaSyAVhO8H0bVJ0759w9KbAmjfBpube8Jf9F8';
    const MAX_RESULTS_PER_PAGE = 10;
    let books = [];
    let currentPage = 1;
    let totalPages = 0;
    let isGridView = true;

    // Search Books from Google Books API
    function searchBooks(query, page = 1) {
        const startIndex = (page - 1) * MAX_RESULTS_PER_PAGE;
        $.getJSON(`https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=${MAX_RESULTS_PER_PAGE}&key=${API_KEY}`)
            .done(function (data) {
                books = data.items || [];
                totalPages = Math.ceil(data.totalItems / MAX_RESULTS_PER_PAGE);
                displayResults(books);
                setupPagination(data.totalItems, page);
            })
            .fail(() => {
                $('#results').html('<p>An error occurred while fetching data. Please try again.</p>');
            });
    }

    // Display Search Results (Grid/List View)
    function displayResults(books) {
        const container = $('#results');
        container.empty().addClass(isGridView ? 'grid-view' : 'list-view');
        if (books.length === 0) {
            container.html('<p>No results found.</p>');
            return;
        }
        books.forEach(book => {
            const title = book.volumeInfo.title || 'No Title Available';
            const imageUrl = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'placeholder.jpg';
            container.append(`
                <div class="book" data-id="${book.id}">
                    <img src="${imageUrl}" alt="${title}">
                    <p>${title}</p>
                </div>
            `);
        });
    }

    // Setup Pagination for Search Results
    function setupPagination(totalItems, currentPage) {
        const totalPages = Math.ceil(totalItems / MAX_RESULTS_PER_PAGE);
        $('#pagination').empty();
        for (let i = 1; i <= Math.min(totalPages, 5); i++) {
            $('#pagination').append(`
                <button class="page-link" data-page="${i}">${i}</button>
            `);
        }
        $('.page-link').removeClass('active');
        $(`.page-link[data-page="${currentPage}"]`).addClass('active');
    }

    // Switch between Grid and List View
    $('#viewToggle button').click(function () {
        $('#viewToggle button').removeClass('active');
        $(this).addClass('active');
        isGridView = $(this).attr('id') === 'gridView';
        $('#results').removeClass('grid-view list-view').addClass(isGridView ? 'grid-view' : 'list-view');
    });

    // Display Book Details
    function displayBookDetails(book) {
        const title = book.volumeInfo.title || 'No Title';
        const description = book.volumeInfo.description || 'No description available.';
        const imageUrl = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'placeholder.jpg';
        $('#bookDetails .details-content').html(`
            <h3>${title}</h3>
            <p>${description}</p>
            <img src="${imageUrl}" alt="${title}">
        `);
        $('#searchPage').addClass('hidden');
        $('#bookDetails').removeClass('hidden');
    }

    // Event listener for book clicks to show details
    $('#results').on('click', '.book', function () {
        const bookId = $(this).data('id');
        const book = books.find(b => b.id === bookId);
        if (book) displayBookDetails(book);
    });

    // Return to Search Page
    $('#homeButton').click(function () {
        $('#bookDetails').addClass('hidden');
        $('#searchPage').removeClass('hidden');
    });

    // Fetch Bookshelf Data
    function displayBookshelf() {
        $.getJSON(`https://www.googleapis.com/books/v1/users/111513666397003909535/bookshelves/1002/volumes?key=${API_KEY}`)
            .done(data => {
                const bookshelfBooks = data.items || [];
                const container = $('#bookshelf');
                container.empty();
                if (bookshelfBooks.length === 0) {
                    container.html('<p>No books found in your bookshelf.</p>');
                    return;
                }
                bookshelfBooks.forEach(book => {
                    const title = book.volumeInfo.title;
                    const imageUrl = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'placeholder.jpg';
                    container.append(`
                        <div class="book">
                            <img src="${imageUrl}" alt="${title}">
                            <p>${title}</p>
                        </div>
                    `);
                });
            })
            .fail(() => {
                $('#bookshelf').html('<p>Error fetching bookshelf data.</p>');
            });
    }

    // Event Listeners for Buttons and Pagination
    $('#searchButton').click(function () {
        const query = $('#searchTerm').val().trim();
        if (query) searchBooks(query);
    });

    $('#pagination').on('click', '.page-link', function () {
        const query = $('#searchTerm').val().trim();
        currentPage = $(this).data('page');
        searchBooks(query, currentPage);
    });

    // Show Bookshelf when Bookshelf Button is clicked
    $('#bookshelfButton').click(function () {
        displayBookshelf();
    });

    // Default function call to display bookshelf
    displayBookshelf();
});

