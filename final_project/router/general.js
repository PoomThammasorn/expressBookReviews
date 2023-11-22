const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!username || !password) {
      return res.status(400).send("Username and password are required");
    }
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .send("User successfully registred. Now you can login");
    } else {
      return res.status(404).send("User already exists!");
    }
  }
  console.log(users);
  return res.status(404).send("Unable to register user.");
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const authorToSearch = req.params.author;
  const booksByAuthor = getBooksByAuthor(authorToSearch);

  res.send({
    booksByAuthor: booksByAuthor,
  });
});

const getBooksByAuthor = (author) => {
  const result = [];

  for (const id in books) {
    if (books[id].author === author) {
      result.push(books[id]);
    }
  }

  return result;
};

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const titleToSearch = req.params.title;
  const booksByTitle = getBooksByTitle(titleToSearch);

  res.send({
    booksByTitle: booksByTitle,
  });
});

const getBooksByTitle = (title) => {
  const result = [];

  for (const id in books) {
    if (books[id].title === title) {
      result.push(books[id]);
    }
  }

  return result;
};

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

public_users.get("/server/asynbooks", async function (req, res) {
  try {
    let response = await axios.get("http://localhost:5005/");
    console.log(response.data);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error getting book list" });
  }
});

//Task 10
const getBooksAsyncAwait = async () => {
  try {
    const response = await axios.get(
      "https://poom992002-5000.theiadocker-2-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai"
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

//   (async () => {
//     try {
//       const booksData = await getBooksAsyncAwait();
//       console.log("List of Books:", booksData);
//     } catch (error) {
//       console.error("Error fetching books:", error);
//     }
//   })();

//Task 11
const getBookByISBNAsyncAwait = async (isbn) => {
  try {
    const response = await axios.get(
      `https://poom992002-5000.theiadocker-2-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/isbn/${isbn}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

//   (async () => {
//     try {
//       const bookData = await getBookByISBNAsyncAwait("1");
//       console.log("Book Data:", bookData);
//     } catch (error) {
//       console.error("Error fetching book:", error);
//     }
//   })();

//Task 12
const getBooksByAuthorAsyncAwait = async (author) => {
  try {
    const response = await axios.get(
      `https://poom992002-5000.theiadocker-2-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/author/${author}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

//  (async () => {
//    try {
//      const author = "author_name_here";
//      const booksByAuthor = await getBooksByAuthorAsyncAwait(author);
//      console.log("Books by Author:", booksByAuthor);
//    } catch (error) {
//      console.error("Error fetching books by author:", error);
//    }
//  })();

//Task 13
const getBooksByTitleAsyncAwait = async (title) => {
  try {
    const response = await axios.get(
      `https://poom992002-5000.theiadocker-2-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/title/${title}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// (async () => {
//   try {
//     const title = "book_title_here";
//     const booksByTitle = await getBooksByTitleAsyncAwait(title);
//     console.log("Books by Title:", booksByTitle);
//   } catch (error) {
//     console.error("Error fetching books by title:", error);
//   }
// })();

module.exports.general = public_users;
