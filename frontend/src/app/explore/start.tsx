'use client';

import React, { FormEvent, useState } from 'react';
import Input from '../components/form-input';
import FormButton from '../components/form-button';

interface StartProps {
    onQuery: (data: { query: string }) => void;
}

export default function Start({ onQuery }: StartProps) {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: FormEvent) => {
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
                <Input
                    value={query}
                    setValue={setQuery}
                    message="whatever..."
                />
                <FormButton
                    display="Search"
                />
            </form>
        </div>
    );
}