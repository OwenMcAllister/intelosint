'use client'

import { FormEvent, useState } from "react";

export default function Search() {
    const [query, setQuery] = useState('');

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();

        //TODO: link up to backend
    };

    return (
        <div className="p-5">
            <h1 className="text-2xl font-bold mb-4">Search</h1>
            <form onSubmit={handleSearch} className="flex items-center">
                <label htmlFor="search" className="mr-2">I need information about</label>
                <input
                    id="search"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="whatever..."
                    className="border border-gray-300 rounded px-2 py-1"
                />
                <button
                    type="submit"
                    className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Search
                </button>
            </form>
        </div>
    );
}