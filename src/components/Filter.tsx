import React, { useEffect, useState } from 'react';
import 'firebase/firestore';
import { Link } from 'react-router-dom';
import { DocumentData } from 'firebase/firestore';
import Card from './Card';
import '../styles/Filter.css';
import { MenuProps } from 'antd';
import DownDrop from './DownDrop';


const Filter = () => {

    const [books, setBooks] = useState<DocumentData[]>([]);
    const [orgBooks, setOrgBooks] = useState<DocumentData[]>([]);
    const [genreChosen, setGenreChosen] = useState("");
    const [sortOn, setSortBy] = useState("");
    const [yearsChosen, setYearsChosen] = useState(false);
    const [fromValue, setFromValue] = useState<number>(0);
    const [toValue, setToValue] = useState<number>(2023);


    let allGenres: string[] = ['Crime', 'Fantasy', 'Roman', 'Cartoon', 'Classic', 'Historical', 'Biography'];

    //cache og listener
    useEffect(() => {
        let allBooks: DocumentData[] = [];
        const booksCached = localStorage.getItem("books");
        if (booksCached) {
            allBooks = JSON.parse(booksCached);
        }
        setOrgBooks(allBooks);
    }, []);


    useEffect(() => {
        let filteredBooks = orgBooks.filter(book =>
            (genreChosen === "" || book.genre === genreChosen) &&
            (!yearsChosen || (book.releaseYear >= fromValue && book.releaseYear <= toValue))
        );

        if (sortOn === "newest") {
            filteredBooks = filteredBooks
                .filter(book => book.releaseYear <= 2023)
                .sort((b1, b2) => b2.releaseYear - b1.releaseYear);
        } else if (sortOn === "rating") {
            filteredBooks.sort((b1, b2) => b2.rating - b1.rating);
        }
        setBooks(filteredBooks);
    }, [yearsChosen, fromValue, toValue, sortOn, genreChosen]);

    const handleConfirm = () => {
        const fromElement = document.getElementById("fromValue") as HTMLInputElement;
        setFromValue(fromElement.value !== "" ? fromElement.valueAsNumber : 0);
        const toElement = document.getElementById("toValue") as HTMLInputElement;
        setToValue(toElement.value !== "" ? toElement.valueAsNumber : 2023);
        setYearsChosen(true);
        fromElement.value = '';
        toElement.value = '';
    };

    const handleReset = () => {
        setBooks(orgBooks);
    }

    const genres: MenuProps['items'] = [
        {
            key: '1',
            label: <p className="menu-choice">Crime</p>,
            onClick: () => setGenreChosen("Crime")
        },
        {
            key: '2',
            label: <p className="menu-choice">Fantasy</p>,
            onClick: () => setGenreChosen("Fantasy")
        },
        {
            key: '3',
            label: <p className="menu-choice">Roman</p>,
            onClick: () => setGenreChosen("Roman")
        },
        {
            key: '4',
            label: <p className="menu-choice">Cartoon</p>,
            onClick: () => setGenreChosen("Cartoon")
        },
        {
            key: '5',
            label: <p className="menu-choice">Classic</p>,
            onClick: () => setGenreChosen("Classic")
        },
        {
            key: '6',
            label: <p className="menu-choice">Historical</p>,
            onClick: () => setGenreChosen("Historical")
        },
        {
            key: '7',
            label: <p className="menu-choice">Biography</p>,
            onClick: () => setGenreChosen("Biography")
        },
    ];

    const sortBy: MenuProps['items'] = [
        {
            key: '1',
            label: <p className="menu-choice">Highest Rated</p>,
            onClick: () => setSortBy("rating")
        },
        {
            key: '2',
            label: <p className="menu-choice">Recently Released</p>,
            onClick: () => setSortBy("newest")
        },
    ];

    const releaseYear: MenuProps['items'] = [
        {
            key: '1',
            label: <input id="fromValue" type="number" placeholder="From" className="block w-full px-4 py-2 text-purple-700 bg-white rounded-full focus:border-teitTheme focus:ring-teitTheme focus:outline-none focus:ring focus:ring-opacity-40 shadow-0" onClick={(e) => e.stopPropagation()}/>,
            
        },
        {
            key: '2',
            label: (
                <input id="toValue" type="number" placeholder="To" className="block w-full px-4 py-2 text-purple-700 bg-white rounded-full focus:border-teitTheme focus:ring-teitTheme focus:outline-none focus:ring focus:ring-opacity-40 shadow-0" onClick={(e) => e.stopPropagation()}/>
            ),
        },
        {
            key: '3',
            label: <p className="menu-choice w-full rounded-full">Confirm</p>,
            onClick: () => handleConfirm()
        },
    ];

    return (
        <div>
            <div className="navbar navbar-expand-lg shadow-md pb-5 px-10 bg-bigBoy relative flex items-center w-full justify-center space-x-10">
                <h1>Filters: </h1>
                <DownDrop items={genres} text="Genres" />
                <div className="space-y-2 relative bg-current">
                    <DownDrop items={releaseYear} text="Release Year" />

                </div>
                <DownDrop items={sortBy} text="Sort By" />
                <div>
                    {genreChosen !== "" ?
                        <button onClick={() => { handleReset(); setGenreChosen("") }} className="filter-chosen px-4 mr-2 py-2 rounded-xl bg-graa shadow-0 hover:shadow-lg">
                            <p className='text-sm'>{genreChosen} X</p>
                        </button> : null
                    }
                    {yearsChosen ?
                        <button onClick={() => { handleReset(); setYearsChosen(false) }} className="filter-chosen px-4 mr-2 py-2 rounded-xl bg-graa shadow-0 hover:shadow-lg">
                            <p className='text-sm'> {fromValue} - {toValue} X</p>
                        </button> : null
                    }
                    {sortOn === "newest" ?
                        <button onClick={() => { handleReset(); setSortBy("") }} className="filter-chosen px-4 mr-2 py-2 rounded-xl bg-graa shadow-0 hover:shadow-lg">
                            <p className='text-sm'> Recently Released X</p>
                        </button> : null
                    }
                    {sortOn === "rating" ?
                        <button onClick={() => { handleReset(); setSortBy("") }} className="filter-chosen px-4 mr-2 py-2 rounded-xl bg-graa shadow-0 hover:shadow-lg">
                            <p className='text-sm'> Highest Rated X</p>
                        </button> : null
                    }
                </div>
            </div>
            {books.length > 0 ?
                <div className="ml-10 mt-10 grid grid-cols-5">
                    {books.map((book) => (
                        <Card
                            title={book.title}
                            bookIMG={book.imgURL}
                            id={book.id}
                            key={book.id}
                        />
                    ))}
                </div>
                :
                <div className="books-div ml-10 mt-10 grid grid-cols-5">
                    {orgBooks.map((book) => (
                        <Card
                            title={book.title}
                            bookIMG={book.imgURL}
                            id={book.id}
                            key={book.id}
                        />
                    ))}
                </div>
            }

        </div>
    )
}

export default Filter;