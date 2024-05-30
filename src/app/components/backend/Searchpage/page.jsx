"use client";

import { useState, useEffect } from 'react';

const apiKey = 'AIzaSyBX2L2d_FVbwMkfbyptRPMkdDBZTrxwnpA';
const cx = 'e06da44efe1a64a45';
const numResults = 100; // Number of results you want

const delay = (s) => new Promise(resolve => setTimeout(resolve, s));

async function fetchSearchResults(query) {
  const results = [];
  let start = 1;
  let retries = 5;

  while (results.length < numResults) {
    try {
      const response = await fetch(`https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&start=${start}`);
      if (!response.ok) {
        if (response.status === 429 && retries > 0) {
          retries -= 1;
          console.warn('Too many requests, retrying...');
          await delay(5000); // Wait for 5 seconds before retrying
          continue;
        } else {
          console.error(`Network response was not ok: ${response.status} ${response.statusText}`);
          const errorData = await response.json();
          console.error('Error details:', errorData);
          break;
        }
      }
      const data = await response.json();

      if (!data.items) {
        console.error('No items in response', data);
        break;
      }

      results.push(...data.items);
      start += 10;

    } catch (error) {
      console.error('Error fetching search results:', error);
      break;
    }
  }

  return results;
}

const extractDetails = (item) => {
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
  const phoneRegex = /(\+?\d{1,2}\s?\(?\d{2,3}\)?[\s.-]?\d{3}[\s.-]?\d{4,6})/g;
  
  const emails = item.snippet.match(emailRegex) || [];
  const phones = item.snippet.match(phoneRegex) || [];
  const nameMatch = item.snippet.match(/(?:Name:)\s*([^,]+)/i);
  const addressMatch = item.snippet.match(/(?:Address:)\s*([^,]+)/i);

  return {
    name: nameMatch ? nameMatch[1] : null,
    address: addressMatch ? addressMatch[1] : null,
    emails,
    phones,
    ...item
  };
};

const SearchPage = () => {
  const [site, setSite] = useState('linkedin.com');
  const [profession, setProfession] = useState('doctors');
  const [place, setPlace] = useState('canada');
  const [emailDomain, setEmailDomain] = useState('@gmail.com');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    const searchQuery = `site:${site} "${profession}" "${place}" "${emailDomain}"`;
    setQuery(searchQuery);
    setLoading(true);
    const searchResults = await fetchSearchResults(searchQuery);
    const detailedResults = searchResults.map(extractDetails);
    setResults(detailedResults);
    setLoading(false);
  };

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      const searchResults = await fetchSearchResults(query);
      const detailedResults = searchResults.map(extractDetails);
      setResults(detailedResults);
      setLoading(false);
    };

    fetchResults();
  }, []);

  return (
    <div className="min-h-screen w-4/6  bg-gray-900  rounded-3xl ">
      <h1 className="text-4xl font-poppins-regular mb-8 text-zinc-300 text-center mt-10"> Google Custom Search Results</h1>
      <h2 className="text-lg font-poppins-light text-zinc-100 text-center mb-14">Made By Sr. Software  Engnieer  - Solanki Omkumar</h2>
      
      <form onSubmit={handleSearch} className="mb-8 w-full max-w-3xl mx-auto flex flex-col space-y-4">
        <input
          type="text"
          value={site}
          onChange={(e) => setSite(e.target.value)}
          className="p-3 rounded bg-gray-800 text-white placeholder-gray-400"
          placeholder="Enter site (e.g., linkedin.com)"
        />
        <input
          type="text"
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
          className="p-3 rounded bg-gray-800 text-white placeholder-gray-400"
          placeholder="Enter profession (e.g., doctors)"
        />
        <input
          type="text"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          className="p-3 rounded bg-gray-800 text-white placeholder-gray-400"
          placeholder="Enter place (e.g., canada)"
        />
        <input
          type="text"
          value={emailDomain}
          onChange={(e) => setEmailDomain(e.target.value)}
          className="p-3 rounded bg-gray-800 text-white placeholder-gray-400"
          placeholder="Enter email domain (e.g., @gmail.com)"
        />
        <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition duration-200">
          Search
        </button>
      </form>

      <div className="p-10 bg-gray-800 rounded mr-10 ml-10">
        {loading ? (
          <p className="text-white text-xl text-center">Loading results...</p>
        ) : (
          results.length > 0 ? (
            <ul className="list-disc list-inside text-white  space-y-6 w-full max-w-3xl mx-auto">
              {results.map((result, index) => (
                <li key={index} className="p-6 bg-gray-800 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 hover:bg-gray-700">
                  {result.name && <p className="text-white text-lg mb-2"><strong className='text-white'>Name:</strong> {result.name}</p>}
                  {result.address && <p className="text-white text-lg mb-2"><strong className='text-white'>Address:</strong> {result.address}</p>}
                  {result.emails.length > 0 && (
                    <div className="mb-2">
                      <strong className='text-white'>Emails:</strong>
                      <ul className="list-disc list-inside">
                        {result.emails.map((email, i) => <li key={i} className="text-white">{email}</li>)}
                      </ul>
                    </div>
                  )}
                  {result.phones.length > 0 && (
                    <div className="mb-2">
                      <strong className='text-white'>Phone Numbers:</strong>
                      <ul className="list-disc list-inside">
                        {result.phones.map((phone, i) => <li key={i} className="text-white">{phone}</li>)}
                      </ul>
                    </div>
        
                  )}
                  <a href={result.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600 underline text-xl font-semibold">
                    {result.title}
                  </a>
                  <p className="text-gray-400 mt-3">{result.snippet}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-white text-xl text-center">No results found.</p>
          )
        )}
      </div>
    </div>
  );
};

export default SearchPage;