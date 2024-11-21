$(document).ready(function () {
  const API_KEY = 'AIzaSyAVhO8H0bVJ0759w9KbAmjfBpube8Jf9F8';
  const MAX_RESULTS_PER_PAGE = 10;
  let books = [];
  let currentPage = 1;
  let isGridView = true; // Default to Grid View

  // Search for books
  function searchBooks(query, page = 1) {
      const startIndex = (page - 1) * MAX_RESULTS_PER_PAGE;
      $.getJSON(`https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=${MAX_RESULTS_PER_PAGE}&key=${API_KEY}`)
          .done(function (data) {
              books = data.items || [];
              displayResults(books);
          })
          .fail(function () {
              $('#results').html('<p>An error occurred while fetching data. Please try again.</p>');
          });
  }

  // Display results
  function displayResults(books) {
      const container = $('#results');
      container.empty();
      if (books.length === 0) {
          container.html('<p>No results found.</p>');
          return;
      }

      books.forEach(book => {
          const title = book.volumeInfo.title;
          const imageUrl = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'placeholder.jpg';
          const bookHtml = `
              <div class="book" data-id="${book.id}">
                  <img src="${imageUrl}" alt="${title}">
                  <p>${title}</p>
              </div>
          `;
          container.append(bookHtml);
      });

      // Apply current view
      container.removeClass('grid-view list-view').addClass(isGridView ? 'grid-view' : 'list-view');
  }

  // Event listener for the search button
  $('#searchButton').click(function () {
      const query = $('#searchTerm').val().trim();
      if (query) {
          searchBooks(query);
      } else {
          alert('Enter a search term');
      }
  });

  // Toggle between Grid View and List View
  $('#viewToggle button').click(function () {
      $('#viewToggle button').removeClass('active');
      $(this).addClass('active');

      isGridView = $(this).attr('id') === 'gridView';
      $('#results').removeClass('grid-view list-view').addClass(isGridView ? 'grid-view' : 'list-view');
  });

  // Event listener for book clicks to show details
  $('#results').on('click', '.book', function () {
      const bookId = $(this).data('id');
      const book = books.find(b => b.id === bookId);
      displayBookDetails(book);
  });

  function displayBookDetails(book) {
      const details = `
          <h3>${book.volumeInfo.title}</h3>
          <p>${book.volumeInfo.description || 'No description available.'}</p>
          <img src="${book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'placeholder.jpg'}" alt="${book.volumeInfo.title}">
      `;
      $('#bookDetails .details-content').html(details);
      $('#bookDetails').removeClass('hidden');
      $('#searchPage').addClass('hidden');
  }

  $('#backToSearch').click(function () {
      $('#bookDetails').addClass('hidden');
      $('#searchPage').removeClass('hidden');
  });


    function displayBookshelf() {
      fetch(`https://www.googleapis.com/books/v1/users/111513666397003909535/bookshelves/1002/volumes?key=${API_KEY}`)
          .then(response => response.json())
          .then(data => {
              bookshelfBooks = data.items || [];
              $('#bookshelf').empty();
              if (bookshelfBooks.length === 0) {
                  $('#bookshelf').html('<p>No books found in the bookshelf.</p>');
                  return;
              }
              bookshelfBooks.forEach(book => {
                  const title = book.volumeInfo.title;
                  const imageUrl = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'placeholder.jpg';
                  $('#bookshelf').append(`
                      <div class="book" data-id="${book.id}">
                          <img src="${imageUrl}" alt="${title}">
                          <p>${title}</p>
                      </div>
                  `);
              });
          })
          .catch(error => console.error('Error fetching bookshelf data:', error));
  }

  $('#homeButton').click(function () {
    $('#searchPage').removeClass('hidden');
    $('#bookshelfPage').addClass('hidden');
    $('#bookDetails').addClass('hidden');
});


  ('#bookshelfButton').click(function () {
    $('#searchPage').addClass('hidden');
    $('#bookshelfPage').removeClass('hidden');
    $('#bookDetails').addClass('hidden');
});

displayBookshelf();
});


