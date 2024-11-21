
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


=======
$(document).ready(function () {
    // Switch between grid and list views
    $('#grid-view-btn').click(function () {
      $('#results-container').removeClass('list-view').addClass('grid-view');
    });
  
    $('#list-view-btn').click(function () {
      $('#results-container').removeClass('grid-view').addClass('list-view');
    });
  
    // Search function
    $('#search-button').click(function () {
      let query = $('#search-input').val();
      if (query) {
        fetchBooks(query);
        updateSearchHistory(query);
      }
    });
  
    // Fetch books from Google Books API
    function fetchBooks(query) {
      $.ajax({
        url: `https://www.googleapis.com/books/v1/volumes?q=${query}&key=AIzaSyDrRfySObJpjK4gu_pY4c9L75QkhHUHhQg
        method: 'GET',
        success: function (data) {
          displayResults(data.items);
        },
        error: function () {
          alert('Failed to fetch data');
        }
      });
    }
  
    // Display search results
    function displayResults(books) {
      $('#results-container').empty();
      books.forEach(function (book) {
        let bookData = {
          id: book.id,
          title: book.volumeInfo.title || 'No title available',
          author: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown author',
          thumbnail: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'placeholder.jpg'
        };
        let template = $('#template-search-result').html();
        let rendered = Mustache.render(template, bookData);
        $('#results-container').append(rendered);
      });
    }
  
    // Display detailed book info when a book is clicked
    $('#results-container').on('click', '.book-item', function () {
      let bookId = $(this).data('id');
      fetchBookDetails(bookId);
    });
  
    function fetchBookDetails(bookId) {
      $.ajax({
        url: `https://www.googleapis.com/books/v1/volumes/${bookId}`,
        method: 'GET',
        success: function (book) {
          let bookDetails = {
            title: book.volumeInfo.title || 'No title available',
            author: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown author',
            publisher: book.volumeInfo.publisher || 'Unknown publisher',
            publishedDate: book.volumeInfo.publishedDate || 'N/A',
            description: book.volumeInfo.description || 'No description available',
            thumbnail: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'placeholder.jpg'
          };
          let template = $('#template-book-details').html();
          let rendered = Mustache.render(template, bookDetails);
          $('#book-details').html(rendered);
        }
      });
    }
  
    // Search history functionality
    function updateSearchHistory(query) {
      let history = $('#search-history');
      if (!$(`#search-history:contains(${query})`).length) {
        history.append(`<span class="history-item">${query}</span>`);
      }
    }
  
    $('#search-history').on('click', '.history-item', function () {
      let query = $(this).text();
      $('#search-input').val(query);
      fetchBooks(query);
    });
  });
  

