import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <>
            <div className="min-h-screen bg-darkSlate text-white flex flex-col items-center justify-center">
                <div className="text-center mb-32">
                    <h2 className="text-6xl font-extrabold text-lightBlue">Expense Tracker</h2>
                    <h1 className="text-3xl font-medium mt-4">Take your accounts to the next level.</h1>
                    <h4 className="text-xl font-light mt-2">The best system to control all your expenses from one place!</h4>
                    <Link to="/login" className="mt-6 inline-block bg-lightBlue text-darkSlate px-6 py-3 rounded-full text-lg font-medium hover:bg-lightSlate transition-colors">Sign up for free</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-16 w-full">
                    <div className="bg-darkBlue rounded-lg p-8 text-center">
                        <h2 className="text-2xl font-semibold mb-4">Create</h2>
                        <p className="text-gray">Create your budgets and financial plans with ease.</p>
                    </div>
                    <div className="bg-darkBlue rounded-lg p-8 text-center">
                        <h2 className="text-2xl font-semibold mb-4">Edit</h2>
                        <p className="text-gray">Edit and adjust your financial records at any time.</p>
                    </div>
                    <div className="bg-darkBlue rounded-lg p-8 text-center">
                        <h2 className="text-2xl font-semibold mb-4">Manage</h2>
                        <p className="text-gray">Manage your finances efficiently and in an organized manner.</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home