import { getFirestore, collection, getDocs, DocumentData, deleteDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { doc, setDoc } from "firebase/firestore";
import firebase from "firebase/compat/app";
import 'firebase/compat/firestore';
import 'firebase/auth';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyAVZS1MZ7twZLXAGzOH2a4fUdk5PTixsoM",
  authDomain: "ibdb-743f5.firebaseapp.com",
  projectId: "ibdb-743f5",
  storageBucket: "ibdb-743f5.appspot.com",
  messagingSenderId: "870088009869",
  appId: "1:870088009869:web:f33ac12df7b1bb6a415ac4",
  measurementId: "G-G39Y25NM7D"
};

const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
export { auth, googleProvider };




class firebaseControl {

  constructor() {
  };

  async getBooks() {
    const books = collection(db, 'books');
    const bookSnapshot = await getDocs(books);
    const bookList = bookSnapshot.docs.map(doc => doc.data());
    return bookList;
  };

  async getReviews() {
    const reviews = collection(db, 'reviews');
    const reviewSnapshot = await getDocs(reviews);
    const reviewList = reviewSnapshot.docs.map(doc => doc.data());
    return reviewList;
  };

  getBookIds() {
    const colRef = collection(db, "books");
    let bookIDs: any[] = [];
    getDocs(colRef).then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        bookIDs.push({ id: doc.id });
      })
    });
    return bookIDs;
  };

  async getBook(id: string) {
    const doc = await firebase.firestore().collection('books').doc(id).get();
    const docData = doc.data();
    return docData;
  }

  listenForCollectionChanges = (collection: string, callback: (updatedCollection: DocumentData[]) => void): (() => void) => {
    const unsubscribe = firebase.firestore().collection(collection)
      .onSnapshot((snapshot) => {
        const updateCollection: DocumentData[] = [];
        snapshot.forEach((doc) => {
          updateCollection.push(doc.data());
        });
        callback(updateCollection);
      });
    return unsubscribe;
  };

  async findReviewLength() {
    const amount: Number = (await this.getReviews()).length + 1;
    return amount;
  }


  async addReview(review: DocumentData) {
    //Find the id, equal to the number of books
    const id: string = review.userID + review.bookID;
    try {

      await setDoc(doc(db, "reviews", id), review);
    }
    catch (error) {
      console.log(error)
    }
  }

  async deleteReview(review: DocumentData) {
    const id: string = review.userID + review.bookID;
    try {
      await deleteDoc(doc(db, "reviews", id));
    }
    catch (error) {
      console.log(error)
    }
  }

  async findLength() {
    const amount : number = (await this.getBooks()).length + 1;
    return amount;
  }

  async addBook(title : string, author : string, genre : string, releaseYear : number, 
    description : string, imgURL : string, rating : number) 
    {
      //Find the id, equal to the number of books
    const id : string = (await this.findLength()).toString();
      // Add a new document in collection "cities"
    console.log(id)
 
    await setDoc(doc(db, "books", id), {
      title: title, 
      author: author,
      genre: genre,
      releaseYear: releaseYear,
      description: description,
      imgURL: imgURL,
      rating: rating,
      id: id,
    });
    }

};

export default firebaseControl;
