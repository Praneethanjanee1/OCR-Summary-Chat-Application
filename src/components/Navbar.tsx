import React from 'react';

const Navbar: React.FC = () => {
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-white text-lg font-bold">OCR Summarization App</h1>
                <ul className="flex space-x-4">
                    <li>
                        <a href="/" className="text-gray-300 hover:text-white">Home</a>
                    </li>
                    <li>
                        <a href="/upload" className="text-gray-300 hover:text-white">Upload</a>
                    </li>
                    <li>
                        <a href="/summary" className="text-gray-300 hover:text-white">Summary</a>
                    </li>
                    <li>
                        <a href="/qa" className="text-gray-300 hover:text-white">Q&A</a>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;