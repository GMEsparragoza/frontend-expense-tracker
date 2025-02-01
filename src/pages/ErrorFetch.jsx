import React from "react";

export const ErrorFetch = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-darkSlate text-gray">
            <h1 className="text-6xl font-bold text-lightBlue">429</h1>
            <h2 className="text-3xl font-semibold mt-4">Server Error</h2>
            <h3 className="text-2xl text-lightSlate mt-2 text-center px-4">
                Too many requests,
            </h3>
            <p className="text-lightSlate text-center px-4">
                please wait before trying again
            </p>
        </div>
    );
};