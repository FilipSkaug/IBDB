import { DocumentData } from 'firebase/firestore';
import { useState, useEffect, useRef, MouseEventHandler} from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SearchBar.css'


const SearchBar = () => {

  const [books, setBooks] = useState<DocumentData[]>([]);

  useEffect(() => {
    let allBooks: DocumentData[] = [];
    const booksCached = localStorage.getItem("books");
    if (booksCached) {
      allBooks = JSON.parse(booksCached);
    }
    setBooks(allBooks);
  }, []);



let titleId = new Map<string, string>();
let titleAuthor = new Map<string, string>();
let titleImg = new Map<string, string>();

for (const book of books) {
  titleId.set(book.id, book.title);
}

for (const book of books) {
  titleAuthor.set(book.title, book.author);
}
for (const book of books) {
  titleImg.set(book.title, book.imgURL);
}


const [value, setValue] = useState<string>('');
const [result, setResult] = useState<string[]>([]);

function getKeyByValue(value: string, map: Map<string, string>): string | undefined {
  for (const [key, mapValue] of map.entries()) {
    if (mapValue === value) {
      return key;
    }
  }
  return undefined;
}

  useEffect(() => {
    if (value.length > 0) {
      setResult([]); //Resets the searchable items every time the value length changes 
      let searchQuery = value.toLowerCase();
      for (let index = 1; index <= titleId.size; index++) {
        const title = titleId.get(index.toString());
        if (title){
          const titleLowered = title?.toLowerCase(); //first searchable item 
          const authorLowered = titleAuthor.get(title)?.toLowerCase(); // second searchable item
          if (titleLowered?.slice(0, searchQuery.length).indexOf(searchQuery) !== -1 || authorLowered?.slice(0, searchQuery.length).indexOf(searchQuery) !== -1) {
            setResult(prevResult => {
              return [...prevResult, title].slice(0,5); //Displays 5 books at max given the searchQuery
          })
        }
      }
    }        
    } 
    else {
      setResult([]);
    } 
  }, [value])

  //Searchbox is still visible without any items in the result array, this is to fix that.

  const [showResults, setShowResults] = useState(false); //New variable which decides to either show or not show the box
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    if (result.length > 0 && !showResults) setShowResults(true);
    if (result.length <= 0) setShowResults(false);
  }, [result]) //What this does is update the variable showResults depending on whether there are any results available 
  
  useEffect(() => {

    if (value.length === 0 && result.length === 0) {
      setNoResults(false);
    }

    if (value.length > 0 && result.length === 0 ) {
      setNoResults(true);
    }
  }, [value, result, showResults])
  


  const navigate = useNavigate();

  return (
    <div className = "relative block w-3/6">
      <input
        type="text"
        className="searchbar-text block w-full px-4 py-2 text-purple-700 bg-white rounded-full focus:border-teitTheme focus:ring-teitTheme focus:outline-none focus:ring focus:ring-opacity-40 shadow-0"
        placeholder="Title / Author" 
      onChange={(event)=> setValue(event.target.value)} 
      onBlur={() => {setShowResults(false); setNoResults(false);}} //Removes the search results when on selected
      onFocus={() => { {if (result.length > 0) setShowResults(true);} {if (!noResults && value.length > 0) setNoResults(true) }}} //Shows the search results when selected
      value ={value}/>

      {noResults && (
        <div className='search-result absolute top-full left-0 mt-1 w-full p-2 bg-hvit shadow-lg 
        rounded-b1 rounded-lg'>
          <p className='italic'>No results</p>
        </div>
      )
      }
  
      {showResults && ( //This makes sure to only show the white box when there are results available
      <div className='search-result absolute top-full left-0 mt-1 w-full p-2 bg-hvit shadow-lg 
    rounded-b1 rounded-lg '>
        {result.map((result, index) => {  
        const bookId = getKeyByValue(result, titleId);
        const bookAuthor = titleAuthor.get(result);
        const bookImg = titleImg.get(result);
  
//Navigate to the correct book page 

  return (
      <div 
      key={index} onMouseDown={() =>  //OnMouseDown() event fires before OnBlur() hence we are able to click a result before it disappearing
      {navigate(`/bookPage/${bookId}`);
      setValue(''); }}>
        <div className='search-result-text cursor-pointer left-0 hover:bg-kulTheme hover:shadow-lg bg-hvit hover:bg-opacity-10 p-1 flex'>
          <img className='h-20 mr-5 ' src={bookImg} alt={bookImg} />
          <div className='flex flex-col justify-center flex-grow'>
            <span className='text-lg'>{result}</span>
            <p className='text-base italic mb-2'>{bookAuthor}</p>
          </div>
        </div>
      </div>
  );
      })}
      </div>)}
    </div>
  );
};

export default SearchBar;