const books = [];

const STORAGE_KEY = 'BOOKSSHELF_APPS';

const SAVED_EVENT = 'save-books';

const RENDER_EVENT = 'BookShelf-Apps';

const Storageisexist = () => {
    if(typeof(Storage) === 'undefined'){
        alert('Browser Tidak Mendukung Web Storage');
        return false;
    }
    return true;
};

document.addEventListener(SAVED_EVENT, () => {
    const parray = localStorage.getItem(STORAGE_KEY);
    const jmldata = JSON.parse(parray);

    console.log(jmldata.length);
});

const loadDataFromStorage = () => {
    const serializeData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializeData);

    if(data !== null) {
        for(const book of data){
            books.push(book);
        };
    };

    document.dispatchEvent(new Event(RENDER_EVENT));
}

const generateId = () => {
    return +new Date();
}

const generateBookObject = (id, title, author, genre, year, isCompleted) => {
    return{
        id,
        title,
        author,
        genre,
        year,
        isCompleted
    };
};

const saveData = () => {
    if(Storageisexist()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    };
};

const isCompleted = document.getElementById('inputBookIsComplete')
isCompleted.addEventListener('change', ()=> {
    const completed = document.getElementById('complete');
    if(isCompleted.checked){
        complete.innerText = 'Sudah Selesai Dibaca';
    }else{
        complete.innerText = 'Belum Selesai Dibaca';
    }
});

const checked = () => {
    if(isCompleted.checked){
        return true;
    }
    return false;
};

const findBook = (bookID) => {
    for(const buku of books){
        if(buku.id == bookID){
            return buku;
        };
    };
    return null;
};

const findBookIndex = (bookID) => {
    for(const index in books){
        if(books[index].id == bookID){
            return index;
        };
    };
    return -1
};

const addBook = () => {
    const id = generateId();
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const genre = document.getElementById('inputBookGenre').value;
    const year = document.getElementById('inputBookYear').value;
    const isCompleted = checked();

    const objBook = generateBookObject(id, title, author, genre, year, isCompleted);
    books.unshift(objBook);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

const removeBook = (bookID) => {
    const bookObject = findBookIndex(bookID);

    if(bookObject == -1) {
        return;
    }

    books.splice(bookObject, 1);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

const addtoComplete = (bookID) => {
    const bookObject = findBook(bookID);
    if(bookObject == null) {
        return;
    }

    bookObject.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const undofromComplete = (bookID) => {
    const bookObject = findBook(bookID);

    if(bookObject == null) {
        return;
    }

    bookObject.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const createBook = (bookObj) => {
    const title = document.createElement('h1');
    title.innerText = bookObj.title;

    const author = document.createElement('p');
    author.innerText = bookObj.author;

    const genre = document.createElement('p');
    genre.innerText = bookObj.genre;

    const year = document.createElement('p');
    year.innerText = bookObj.year;

    const infobook = document.createElement('div');
    infobook.classList.add('infobook');
    infobook.append(title, author, genre, year);

    const container = document.createElement('article');
    container.classList.add('innerData');
    container.append(infobook);

    const DelBtn = document.createElement('button');
    DelBtn.classList.add('DelBtn');
    DelBtn.style.cursor = 'pointer';
    DelBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    DelBtn.addEventListener('click', () => {
        const isConfirm = confirm(`Yakin Ingin Menghapus Buku ${bookObj.title} Dari List?`);
        if(isConfirm){
            removeBook(bookObj.id);
        };
    });

    const action = document.createElement('div');
    action.classList.add('actionButton');

    if(bookObj.isCompleted){
        const undoBtn = document.createElement('button');
        undoBtn.classList.add('undoBtn');
        undoBtn.style.cursor = 'pointer';
        undoBtn.innerHTML = '<i class="fa-solid fa-rotate-left"></i>';
        undoBtn.addEventListener('click', () => {
            undofromComplete(bookObj.id);
        });
        action.append(undoBtn, DelBtn);
        container.append(action);
    } else {
        const doneBtn = document.createElement('button');
        doneBtn.classList.add('doneBtn');
        doneBtn.style.cursor = 'pointer';
        doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
        doneBtn.addEventListener('click', () => {
            addtoComplete(bookObj.id);
        });
        action.append(doneBtn, DelBtn);
        container.append(action);
    };

    return container;
};

const searchBook = () => {
    const title = document.getElementById('searchBookbyTitle').value;
    const containerSearchBooks = document.querySelector('#searchBook>.innerBookshelf');
    containerSearchBooks.innerHTML = '';

    if (title === "") {
        document.dispatchEvent(new Event(RENDER_EVENT));
        return;
    };

    for(const book of books){
        const booksElement = createBook(book);
        if(book.title.toLowerCase().includes(title.toLowerCase())){
            if(book.isCompleted){
                containerSearchBooks.append(booksElement);
            };

            if(!book.isCompleted){
                containerSearchBooks.append(booksElement);
            };
        };
    };
};

document.addEventListener('DOMContentLoaded', () => {
    const submit = document.getElementById('inputBook');
    submit.addEventListener('submit', (event) => {
        event.preventDefault();
        addBook();
        document.getElementById('inputBook').reset();
    });

    const searchBooks = document.getElementById('searchBook');
    searchBooks.addEventListener('keyup', (event) => {
        event.preventDefault();

        searchBook();
    });

    searchBooks.addEventListener('submit', (event) => {
        event.preventDefault();

        searchBook();
    });

    if(Storageisexist()){
        loadDataFromStorage();
    };
});

document.addEventListener(RENDER_EVENT, () => {
    const unCompletedBooks = document.getElementById('incompleteBookshelfList');
    unCompletedBooks.innerHTML = '';

    const completedBooks = document.getElementById('completeBookshelfList');
    completedBooks.innerHTML = '';

    for(const booksList of books){
        const booksElement = createBook(booksList);

        if(!booksList.isCompleted){
            unCompletedBooks.append(booksElement);
        }else{
            completedBooks.append(booksElement);
        };
    };
});