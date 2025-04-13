'use client';

import React, { useState } from 'react';

interface StartProps {
    onQuery: (data: { query: string }) => void;
}

export default function Start({ onQuery }: StartProps) {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const input = query.trim()
        if (input) {
            onQuery({ query: input });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <h1 className="text-3xl font-bold mb-8">Explore Data</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-md">
                <div className="mb-4">
                    <label htmlFor="query" className="block font-medium mb-2">
                        I would like to know more about
                    </label>
                    <input
                        type="text"
                        id="query"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="whatever..."
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition"
                >
                    Search
                </button>
            </form>
        </div>
    );
}