import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import '../styles/StockSearch.css';
import '../styles/Stock.css';

function StockSearch({ addStock, search }) {
    const [csvData, setCsvData] = useState([]);
    const [results, setResults] = useState([]);

    // Load the CSV file and parse it on component mount
    useEffect(() => {
        const csvFilePath = '/nasdaq.csv'; // Ensure this path is correct
        Papa.parse(csvFilePath, {
            download: true,
            header: true,
            complete: function(parsedData) {
                setCsvData(parsedData.data); // Store parsed CSV data in state
            },
            error: function(error) {
                console.error('Error parsing CSV:', error);
            }
        });
    }, []);

    // Effect to trigger search when csvData or search query changes
    useEffect(() => {
        if (csvData.length > 0 && search.length > 0) {
            handleSearch(search); // Run search when csvData is loaded and search query is updated
        } else {
            handleSearch('a'); // Clear results if no search
        }
    }, [csvData, search]);

    // Handle search functionality
    const handleSearch = (query) => {
        const searchQuery = query.trim().toLowerCase(); // Case-insensitive search
        const filteredResults = csvData.filter(row => 
            (row['Name'] && row['Name'].toLowerCase().includes(searchQuery)) ||
            (row['Symbol'] && row['Symbol'].toLowerCase().includes(searchQuery))
        );
        setResults(filteredResults); // Update results based on search
    };

    return (
        <div className="stock-search-column">
            {results.length > 0 ? (
                <div>
                    {results.map((result, index) => (
                        <button 
                            className="suggestion-buttons-button" 
                            key={index} 
                            onClick={() => addStock(result)}
                        >
                            <span className="ticker">{result['Symbol']}</span> - {result['Name']}
                        </button>
                    ))}
                </div>
            ) : null} {/* Added to handle the case when results.length is 0 */}
        </div>
    );
}

export default StockSearch;
