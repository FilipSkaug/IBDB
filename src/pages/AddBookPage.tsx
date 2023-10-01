import React, { useEffect } from 'react'
import { useState } from 'react';
import firebaseControl from '../firebaseControl';
import '../styles/HomePage.css';
import { useNavigate } from 'react-router-dom';


const AddBookPage = () => {
    const [title, setTitle] = useState<string>('');
    const [author, setAuthor] = useState<string>('');
    const [genre, setGenre] = useState<string>('');
    const [releaseYear, setReleaseYear] = useState<number | undefined >();
    const [description, setDescription] = useState<string>('');
    const [imgURL, setImgURL] = useState<string>('');
    const [rating, setRating] = useState<number>(0);    
    const [buttonActive, setButtonActive] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);


    const firebaseController = new firebaseControl();
    const navigate = useNavigate();
    
    async function addThisBook() {
        if (title.length > 0 && author.length > 0 && genre.length > 0 && description.length > 0 && imgURL.length > 0 && releaseYear !== undefined){
            await firebaseController.addBook(title, author, genre, releaseYear, description, imgURL, rating);
            setTitle('');
            setAuthor('');
            setGenre('');
            setReleaseYear(undefined);
            setDescription('');
            setImgURL('');
            
            //Navigate to the bookpage for the new book 
           const newBookId : number = (await firebaseController.findLength()) - 1 
            navigate(`/bookPage/${newBookId}`);
        }
    }
    
    //Control description area
    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(event.target.value);
        event.target.style.height = "16"; // reset the height to auto
        event.target.style.height = `${event.target.scrollHeight}px`; // set the height to the scroll height
      };    
    
    useEffect(() => {
        if (title.length > 0 && author.length > 0 && genre.length > 0 && description.length > 0 && imgURL.length > 0 && releaseYear !== undefined){
            setButtonActive(true);
        } else {
            setButtonActive(false);
        }
    }, [title, author, genre, description, imgURL, releaseYear]);

     //Check if current user is admin
    useEffect(() => {
        const userEmail = localStorage.getItem('user')?.replace(/"/g, '');
        if (userEmail === "admin@gmail.com"){
             setIsAdmin(true);
         }
    }, [])
    
    const genres = [
        { id: 1, genre: "Crime" },
        { id: 2, genre: "Fantasy" },
        { id: 3, genre: "Roman" },
        { id: 4, genre: "Cartoon" },
        { id: 5, genre: "Classic" },
        { id: 6, genre: "Historical" },
        { id: 7, genre: "Biography" }
    ];
    
    function handleGenreChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setGenre(event.target.value);
    }
    
    return (
        <div>
        { isAdmin ? 
        <div className='w-full'>
            <div className="header mt-10">
                <div className="element "></div>
                    <h1>Add new book</h1>
                </div>
            <div className="px-8 py-4 grid gap-6 md:grid-cols-2 w-2/3 items-start mt-8">
                <div>
                    <label className="block mb-2 text-sm font-semibold">Title</label>
                    <input type="text" 
                        className="block w-full px-4 py-2 text-purple-700 bg-white rounded-full focus:border-teitTheme focus:ring-teitTheme focus:outline-none focus:ring focus:ring-opacity-40 shadow-0"
                        placeholder="Title" 
                        value={title} onChange={(event) => {setTitle(event.target.value)}}/>
                </div>
                <div>
                    <label className="block mb-2 text-sm font-semibold">Author</label>
                    <input type="text" 
                        className="block w-full px-4 py-2 text-purple-700 bg-white rounded-full focus:border-teitTheme focus:ring-teitTheme focus:outline-none focus:ring focus:ring-opacity-40 shadow-0"
                        placeholder="Author" 
                        value={author} onChange={(event) => {setAuthor(event.target.value)}}/>
                </div>
                <div>
                    <label className="block mb-2 text-sm font-semibold">Genre</label>
                    <select id ='genre-select' name ='genre' value={genre} onChange={handleGenreChange} 
                        className="block w-full px-4 py-2 text-purple-700 bg-white rounded-full focus:border-teitTheme focus:ring-teitTheme focus:outline-none focus:ring focus:ring-opacity-40 shadow-0">
                        {genres.map(el => <option key={el.id} value={el.genre} >{el.genre}</option>)}
                        <option value="" selected disabled hidden>Select Genre</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-2 text-sm font-semibold">Release Year</label>
                    <input 
                    id="releaseYear" 
                    type="number" 
                    placeholder="Release Year" 
                    className="block w-full px-4 py-2 text-purple-700 bg-white rounded-full focus:border-teitTheme focus:ring-teitTheme focus:outline-none focus:ring focus:ring-opacity-40 shadow-0" 
                    value = {releaseYear} onChange={(event) => {setReleaseYear(Number(event.target.value))}}/>
                </div>
                            <div>
                    <label className="block mb-2 text-sm font-semibold">Description</label>
                    <textarea
                        className="input-field block w-full px-4 py-2 text-purple-700 bg-white rounded-lg focus:border-teitTheme focus:ring-teitTheme focus:outline-none focus:ring-opacity-40 shadow-0 h-11"
                        placeholder="Description"
                        value={description}
                        onChange={handleInputChange}/>
                </div>
                <div>
                    <label className="block mb-2 text-sm font-semibold">Image URL</label>
                    <input type="text" 
                        className="block w-full px-4 py-2 text-purple-700 bg-white rounded-full focus:border-teitTheme focus:ring-teitTheme focus:outline-none focus:ring focus:ring-opacity-40 shadow-0"
                        placeholder="Image URL" 
                        value={imgURL} onChange={(event) => {setImgURL(event.target.value)}}/>
                </div>                
                <div>
                    {buttonActive ? 
                        <div>
                            <label className="block mb-2 text-sm font-semibold">Ready to add the book!</label>
                            <button onClick={addThisBook} className="px-6 py-3 rounded-lg bg-hvit shadow-0 hover:shadow-lg">
                                Add book
                            </button>
                        </div>
                        : 
                        <div>
                            <label className="block mb-2 text-sm font-semibold">Fill out all fields to add the book to IBDb</label>
                            <button type="button" disabled className="px-6 py-3 rounded-lg shadow-0">
                            Add book
                            </button>
                        </div>
                    }
                </div>
            </div>
                
        </div>
        : 
        <div>
        <p>Only admins can access this page</p>
        </div>
        }
        </div>
    )
}

export default AddBookPage;