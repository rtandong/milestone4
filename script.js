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
  