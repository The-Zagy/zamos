import React from 'react';

const Navbar: React.FC = () => {
    return (
        <nav className="flex items-center justify-between px-4 py-3 bg-slate-500  shadow-lg">
            <div className="flex items-center">
                <div className="text-white font-bold text-xl">Zamos <em className='text-sm text-gray-400'>OS scheduling simulator</em></div>
            </div>
        </nav>
    );
};

export default Navbar;