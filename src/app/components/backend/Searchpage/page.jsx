"use client";

import { useState } from 'react';

const apiKey = 'AIzaSyDbs5gd0-fRd1691ZaiENr9wzmR1pcWHfM';
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
  const [name, setName] = useState('');
  const [site, setSite] = useState('linkedin.com');
  const [profession, setProfession] = useState('doctors');
  const [place, setPlace] = useState('canada');
  const [emailDomain, setEmailDomain] = useState('@gmail.com');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    let searchQuery = `site:${site} "${profession}" "${place}" "${emailDomain}"`;
    if (name.trim()) {
      searchQuery += ` "${name}"`;
    }
    setQuery(searchQuery);
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const searchResults = await fetchSearchResults(searchQuery);
      const detailedResults = searchResults.map(extractDetails);
      setResults(detailedResults);
      setLoading(false);

      if (detailedResults.length > 0) {
        setSuccessMessage('Success: Search results fetched successfully.');
      } else {
        setErrorMessage('Error: No results found.');
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage('Error: Failed to fetch search results.');
    }
  };

  return (
    <div className="min-h-screen w-4/6 bg-gray-900 rounded-3xl">
      <h1 className="text-4xl font-poppins-regular mb-8 text-zinc-300 text-center mt-10">Google Custom Search</h1>
      <h2 className="text-lg font-poppins-light text-zinc-100 text-center mb-14">
        Developer Sr. Software Engineer - <span className="text-green-500 font-poppins-light">Solanki Omkumar</span>
      </h2>
      
      <form onSubmit={handleSearch} className="mb-8 w-full max-w-3xl mx-auto flex flex-col rounded-3xl space-y-4 items-center">
        <div className="w-full md:w-1/2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-4 mb-3 rounded bg-gray-800 text-white placeholder-gray-400 w-full border border-gray-700 focus:outline-none focus:border-blue-500 transition duration-200 transform hover:scale-105 focus:scale-110 shadow hover:shadow-lg focus:shadow-xl"
            placeholder="(e.g., Omkumar) Or Null"
          />
          <input
            type="text"
            value={site}
            onChange={(e) => setSite(e.target.value)}
            className="p-4 rounded bg-gray-800 text-white placeholder-gray-400 w-full border border-gray-700 focus:outline-none focus:border-blue-500 transition duration-200 transform hover:scale-105 focus:scale-110 shadow hover:shadow-lg focus:shadow-xl"
            placeholder="Enter site (e.g., linkedin.com)"
          />
        </div>
        <div className="w-full md:w-1/2">
          <input
            type="text"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            className="p-4 rounded bg-gray-800 text-white placeholder-gray-400 w-full border border-gray-700 focus:outline-none focus:border-blue-500 transition duration-200 transform hover:scale-105 focus:scale-110 shadow hover:shadow-lg focus:shadow-xl"
            placeholder="Enter profession (e.g., doctors)"
          />
        </div>
        <div className="w-full md:w-1/2">
          <input
            type="text"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            className="p-4 rounded bg-gray-800 text-white placeholder-gray-400 w-full border border-gray-700 focus:outline-none focus:border-blue-500 transition duration-200 transform hover:scale-105 focus:scale-110 shadow hover:shadow-lg focus:shadow-xl"
            placeholder="Enter place (e.g., canada)"
          />
        </div>
        <div className="w-full md:w-1/2">
          <input
            type="text"
            value={emailDomain}
            onChange={(e) => setEmailDomain(e.target.value)}
            className="p-4 rounded bg-gray-800 text-white placeholder-gray-400 w-full border border-gray-700 focus:outline-none focus:border-blue-500 transition duration-200 transform hover:scale-105 focus:scale-110 shadow hover:shadow-lg focus:shadow-xl"
            placeholder="Enter email domain (e.g., @gmail.com)"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-4 rounded hover:bg-blue-600 transition duration-200 w-full md:w-1/2 focus:outline-none focus:border-blue-500 transition duration-200 transform hover:scale-105 focus:scale-110 shadow hover:shadow-lg focus:shadow-xl">
          Search
        </button>
      </form>

      {successMessage && (
        <div className="text-center p-4 mb-4 font-poppins-light text-green-400">
          <strong>{successMessage}</strong>
        </div>
      )}

      {errorMessage && (
        <div className="text-center p-4 mb-4 font-poppins-light text-red-800">
          <strong>{errorMessage}</strong>
        </div>
      )}

      <div className="p-10 bg-gray-800 rounded m-20">
        {loading ? (
          <p className="text-white text-xl text-center">Loading results...</p>
        ) : (
          results.length > 0 ? (
            <ul className="list-disc list-inside text-white space-y-6 w-full max-w-3xl mx-auto">
              {results.map((result, index) => (
                <li key={index} className="p-6 bg-gray-800 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 hover:bg-gray-700">
                  {result.name && <p className="text-white text-lg mb-2"><strong className='text-white'>Name:</strong> {result.name}</p>}
                  {result.address && <p className="text-white text-lg mb-2"><strong className='text-white'>Address:</strong> {result.address}</p>}
                  {result.emails.length > 0 && (
                    <div className="mb-2">
                      <strong className='text-white'>Emails:</strong>
                      <ul className="list-none">
                        {result.emails.map((email, i) => <li key={i} className="text-white">{email}</li>)}
                      </ul>
                    </div>
                  )}
                  {result.phones.length > 0 && (
                    <div className="mb-2">
                      <strong className='text-white'>Phone Numbers:</strong>
                      <ul className="list-none">
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

