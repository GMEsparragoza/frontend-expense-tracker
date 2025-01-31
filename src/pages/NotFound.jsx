import React from "react";
import { Link } from "react-router-dom";

export const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-darkSlate text-gray">
            <h1 className="text-6xl font-bold text-lightBlue">404</h1>
            <h2 className="text-2xl font-semibold mt-4">Page not found</h2>
            <p className="text-lightSlate mt-2 text-center px-4">
                We are sorry, the page you are looking for does not exist or has been moved.
            </p>
            <Link
                to="/"
                className="mt-6 px-6 py-3 bg-lightBlue font-semibold rounded-lg text-white hover:bg-darkBlue transition duration-300"
            >
                Back to top
            </Link>
        </div>
    );
};