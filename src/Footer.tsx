

const Footer = () => {
    return (
        <footer className=" bg-slate-500 p-2 sticky bottom-0 w-full">
            <div className="container mx-auto flex justify-between items-center text-white">
                <a
                    href="https://github.com/The-Zagy/zamos/tree/simulator-frontend"
                    className="font-bold"
                >
                    Contribute on Github
                </a>
                <a href="https://zagy.tech" className="font-bold">
                    Blog
                </a>
            </div>
        </footer>
    );
};

export default Footer;