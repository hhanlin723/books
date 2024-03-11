class Books {
    constructor(title, author, genre) {
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.readBook = false; // assuming readBook is a boolean property
    }
}

class BookShelf {
    constructor() {
        this.url = 'https://65de92ecdccfcd562f5708ef.mockapi.io/api/book/books';
    }

    async createBook(book) {
        let response = await fetch(this.url, {
            method: 'POST',
            body: JSON.stringify(book),
            headers: {
                'content-type': 'application/json'
            }
        });
        let confirmation = await response.json();
        console.log(confirmation);
    }

    async getBook(id) {
        let response = await fetch(`${this.url}/${id}`);
        let data = await response.json();
        console.log(data);
    }

    async getAllBooks() {
        let response = await fetch(this.url);
        let data = await response.json();
        return data;
    }

    async update(id, updatedChange) {
        let response = await fetch(`${this.url}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updatedChange),
            headers: {
                'content-type': 'application/json'
            }
        });
        let confirmation = await response.json();
        console.log(confirmation);
    }

    async delete(id) {
        let response = await fetch(`${this.url}/${id}`, {
            method: 'DELETE'
        });
        let confirmation = await response.json();
        console.log(confirmation);
    }
}

$(document).ready(function () {
    const bookShelf = new BookShelf();

    // Load books on page load
    loadBooks();

    // Create new book form submission
    $('#new-book-form').submit(function (event) {
        event.preventDefault();
        const title = $('#new-book-name').val();
        const author = $('#new-book-author').val();
        const genre = $('#new-book-genre').val();
        const newBook = new Books(title, author, genre);
        bookShelf.createBook(newBook).then(() => {
            loadBooks();
            $('#new-book-form')[0].reset(); // Clear form fields
        });
    });

     

    // Delete book button click
    $(document).on('click', '.delete-book', function () {
        const bookId = $(this).data('id');
        bookShelf.delete(bookId).then(() => {
            loadBooks();
        });
    });

//    // Update read status button click
//    $(document).on('click', '.update-read-status', function () {
//     const bookId = $(this).data('id');
//     const book = bookShelf.getAllBooks().find(book => book.id === bookId);
//     const updatedBook = new Books(book.title, book.author, book.genre);
//     updatedBook.readBook = true; // Assuming readBook is a boolean property
//     bookShelf.update(bookId, updatedBook).then(() => {
//         loadBooks();
//     });
// });


  // Update book form submission
  $(document).on('submit', '.update-book-form', function (event) {
    event.preventDefault();
    const bookId = $(this).data('id');
    const title = $(`#title-${bookId}`).val();
    const author = $(`#author-${bookId}`).val();
    const genre = $(`#genre-${bookId}`).val();
    const updatedBook = new Books(title, author, genre);
    bookShelf.update(bookId, updatedBook).then(() => {
        loadBooks();
    });
});

// Function to load books and render them in the table
async function loadBooks() {
    const books = await bookShelf.getAllBooks();
    $('#book-table-body').empty();
    books.forEach(book => {
        $('#book-table-body').append(`
        <tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.genre}</td>
        <td>${book.readBook ? 'Yes' : 'No'}</td>
        <td>
            <form class="update-book-form" data-id="${book.id}">
                <div class="form-row align-items-center">
                    <div class="col-auto">
                        <input type="text" id="title-${book.id}" class="form-control" value="${book.title}" required>
                    </div>
                    <div class="col-auto">
                        <input type="text" id="author-${book.id}" class="form-control" value="${book.author}" required>
                    </div>
                    <div class="col-auto">
                        <input type="text" id="genre-${book.id}" class="form-control" value="${book.genre}" required>
                    </div>
                    <div class="col-auto">
                        <button type="submit" class="btn btn-primary">Update</button>
                    </div>
                </div>
            </form>
            <button class="btn btn-danger delete-book" data-id="${book.id}">Delete</button>
           
        </td>
    </tr>
        `);
    });
}
});

let project = new BookShelf();

project.getAllBooks();
project.getBook(10);
