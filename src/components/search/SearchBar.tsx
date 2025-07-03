'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { publicService } from '@/lib/api';
import { useDebounce } from '@/hooks/useDebounce';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  // Safe function to convert any value to string
  const safeToString = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      // Handle object with common text properties
      return value.value || value.name || value.text || value.title || value.label || JSON.stringify(value);
    }
    return String(value);
  };

  // Fetch suggestions when query changes
  useEffect(() => {
    if (debouncedQuery.trim() && debouncedQuery.length >= 2) {
      setIsLoading(true);
      
      publicService.getSearchSuggestions(debouncedQuery)
        .then(rawSuggestions => {
          console.log('Raw suggestions:', rawSuggestions); // Debug log
          
          if (!Array.isArray(rawSuggestions)) {
            console.warn('Suggestions response is not an array:', rawSuggestions);
            setSuggestions([]);
            return;
          }

          // Convert all suggestions to safe strings
          const safeSuggestions = rawSuggestions
            .map(item => safeToString(item))
            .filter(item => item.trim().length > 0) // Remove empty strings
            .slice(0, 8);
          
          console.log('Processed suggestions:', safeSuggestions); // Debug log
          setSuggestions(safeSuggestions);
          setIsOpen(safeSuggestions.length > 0);
        })
        .catch(error => {
          console.error('Search suggestions error:', error);
          setSuggestions([]);
          setIsOpen(false);
        })
        .finally(() => setIsLoading(false));
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [debouncedQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string = query) => {
    const cleanQuery = safeToString(searchQuery).trim();
    if (cleanQuery) {
      setIsOpen(false);
      setQuery('');
      router.push(`/search?q=${encodeURIComponent(cleanQuery)}`);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    const cleanSuggestion = safeToString(suggestion);
    setQuery(cleanSuggestion);
    handleSearch(cleanSuggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = safeToString(e.target.value);
    setQuery(value);
  };

  const handleClearClick = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className="relative flex-1 max-w-2xl">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={safeToString(query)}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder="Search for products..."
          className="block w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-amazon-500 focus:border-amazon-500"
        />
        {query && (
          <button
            onClick={handleClearClick}
            className="absolute inset-y-0 right-8 flex items-center pr-2"
            type="button"
          >
            <XMarkIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
        <button
          onClick={() => handleSearch()}
          className="absolute inset-y-0 right-0 flex items-center pr-3 bg-amazon-600 hover:bg-amazon-700 rounded-r-md px-4 transition-colors"
          type="button"
        >
          <MagnifyingGlassIcon className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Search Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-gray-500">Searching...</div>
          ) : suggestions.length > 0 ? (
            <ul className="py-1">
              {suggestions.map((suggestion, index) => {
                const displayText = safeToString(suggestion);
                return (
                  <li
                    key={`suggestion-${index}-${displayText}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 flex items-center"
                  >
                    <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                    <span className="truncate">{displayText}</span>
                  </li>
                );
              })}
            </ul>
          ) : query.trim().length >= 2 ? (
            <div className="px-4 py-3 text-sm text-gray-500">No suggestions found</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
