// src/sections/Footer.jsx

const Footer = () => {
    return (
        <footer className="w-full py-8 px-6 md:px-12 text-center bg-gray-900 bg-opacity-70">
            <p className="text-gray-400">
                &copy; {new Date().getFullYear()} 3Shirts. All Rights Reserved.
            </p>
            <p className="text-gray-500 text-sm mt-2">
                Built with React, Three.js, and a lot of coffee.
            </p>
        </footer>
    )
}

export default Footer;