import { useEffect, useState } from "react";
import { DocumentData } from 'firebase/firestore';
import Card from '../components/Card';
import { StarRating } from "star-rating-react-ts";
import { useNavigate } from "react-router-dom";
import '../styles/RatedBooks.css';

const RatedBooks = () => {

    const userEmail = localStorage.getItem('user')?.replace(/"/g, '');

    const [reviews, setReviews] = useState<DocumentData[]>([]);
    const [books, setBooks] = useState<DocumentData[]>([]);


    useEffect(() => {
      let allReviews: DocumentData[] = [];
      const reviewsCached = localStorage.getItem("reviews");
      if (reviewsCached) {
        allReviews = JSON.parse(reviewsCached);
      }
      setReviews(allReviews);
    }, []);

    useEffect(() => {
        let allBooks: DocumentData[] = [];
        const booksCached = localStorage.getItem("books");
        if (booksCached) {
          allBooks = JSON.parse(booksCached);
        }
        setBooks(allBooks);
      }, []);

    let userReviewsBookID : Array<string> = [];

    let idReview = new Map<string, number>();

    for (const review of reviews) {
        if (review.userID === userEmail){
            idReview.set(review.bookID, review.rating);
            userReviewsBookID.push(review.bookID);
        }
    }

    let reviewedBooks : Array<DocumentData> = [];

    for (const book of books) {
        if(userReviewsBookID.includes(book.id)){
            reviewedBooks.push(book);
        }
    }

    const navigate = useNavigate();

    return (
        <div>
            {reviewedBooks.length > 0 ?
            <div>
                <div className="header mt-10">
                    <div className="element "> </div>
                    <h1>My Rated Books</h1>
                </div>
                <div className="ml-10 mt-10 grid grid-cols-5">
                        {reviewedBooks.map((book) => (
                            <div>
                                <Card
                                    title={book.title}
                                    bookIMG={book.imgURL}
                                    id={book.id}
                                    key={book.id}
                              />
                                <div className="stars">
                                <StarRating theme={{ size: 40 }} readOnly={true} initialRating={idReview.get(book.id)} />
                                </div>
                            </div>
                        ))}
                </div>
                </div>
                :
                <div className="px-10 py-5 mt-10 center">
                    <h1>You have not rated any books yet. </h1>
                    <h1>Rate your first book today!</h1>
                    <button className="browse-book px-6 py-3 rounded-xl bg-hvit shadow-0 hover:shadow-lg h-12 leading-5 mt-6"
                    onClick={ () => {navigate(`/filteredBooks`)}} >Browse books</button>
                </div>
            }
        </div>
    )
}

export default RatedBooks;