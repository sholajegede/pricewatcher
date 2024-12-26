'use client';

import { scrapeAndStoreProduct } from '@/lib/actions';
import { FormEvent, useState } from 'react';
import { Button } from './ui/button';
import { ArrowRight } from "lucide-react";
import { Input } from './ui/input';

const isValidAmazonProductURL = (url: string) => {
  try {
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;

    if (
      hostname.includes('amazon.com') || 
      hostname.includes('amazon.') || 
      hostname.endsWith('amazon')
    ) {
      return true;
    }
  } catch (error) {
    return false;
  }

  return false;
};

const Searchbar = () => {
  const [searchPrompt, setSearchPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidLink = isValidAmazonProductURL(searchPrompt);

    if (!isValidLink) return alert('Please provide a valid Amazon link');

    try {
      setIsLoading(true);
      await scrapeAndStoreProduct(searchPrompt);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setSearchPrompt('');
    }
  };

  return (
    <form 
      className="flex flex-row items-start gap-4 mt-12 w-full max-w-2xl mx-auto" 
      onSubmit={handleSubmit}
    >
      <Input 
        type="text"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder="Enter Amazon product link"
        className="flex items-start py-3 border rounded-lg text-sm"
      />
      <Button
        type="submit"
        className={`py-3 rounded-lg text-sm ${
          searchPrompt === ''
            ? 'bg-primary text-white cursor-not-allowed'
            : 'bg-blue-600 text-white cursor-pointer'
        }`}
      >
        {isLoading ? (
          <span>Fetching...</span>
        ) : (
          <span className="flex items-center">
            Start tracking
            <ArrowRight className="ml-2 h-5 w-5" />
          </span>
        )}
      </Button>
    </form>
  );
};

export default Searchbar;