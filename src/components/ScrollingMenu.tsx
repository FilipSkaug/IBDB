import React, { useEffect, useState } from "react";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import Card from "./Card";
import { DocumentData } from "firebase/firestore";

const sortAndFilterBooks = (books: DocumentData[], filter: string) => {
  let sortedBooks = [...books];
  if (filter === "news") {
    sortedBooks = sortedBooks
      .filter(book => book.releaseYear <= 2023)
      .sort((b1, b2) => b2.releaseYear - b1.releaseYear);
  } else if (filter === "coming") {
    sortedBooks = sortedBooks
      .filter((book) => book.releaseYear > 2023);
  } else if (filter === "rated") {
    sortedBooks
      .sort((b1, b2) => b2.rating - b1.rating);
  } else if (filter === "added") {
    sortedBooks.sort((b1, b2) => b2.id - b1.id);
  }
  return sortedBooks.slice(0,10);
}
const ScrollingMenu = (prop: { filter: string }) => {

  const [books, setBooks] = useState<DocumentData[]>([]);

  useEffect(() => {
    let allBooks: DocumentData[] = [];
    const booksCached = localStorage.getItem("books");
    if (booksCached) {
      allBooks = JSON.parse(booksCached);
    }
    setBooks(sortAndFilterBooks(allBooks, prop.filter));
    
  }, []);

  return (
    <div>
      {/* create scrolling menu */}
      <ScrollMenu>
        <div className="scrollingmenu">
        {/* create card component for each item */}
        {books.map((book) => (
          <Card
            title={book.title}
            bookIMG={book.imgURL}
            id={book.id}
            key={book.id}
          />
        ))}
        </div>
      </ScrollMenu>
    </div>
  );
}
export default ScrollingMenu;
