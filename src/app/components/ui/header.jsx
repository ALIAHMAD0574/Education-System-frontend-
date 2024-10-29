"use client";
import Link from 'next/link';
import { GraduationCap, User } from 'lucide-react';
import { Menu } from '@headlessui/react';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track if the user is logged in

  useEffect(() => {
    const token = Cookies.get('token'); // Check for the token in cookies
    if (token) {
      setIsLoggedIn(true); // Set the state to logged in if the token is present
    }

    // Listen for the custom 'login' event
    const handleLoginEvent = () => {
      setIsLoggedIn(true); // Update state when the login event is triggered
    };

    window.addEventListener('login', handleLoginEvent);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('login', handleLoginEvent);
    };
  }, []);

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-white text-black">
      <Link className="flex items-center justify-center" href="/">
        <GraduationCap className="h-6 w-6" />
        <span className="ml-2 text-lg font-bold">Quiz Pro</span>
      </Link>
      <nav className="ml-auto flex items-center gap-4 sm:gap-6">
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/">
          Features
        </Link>
        {isLoggedIn ? (
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center text-sm focus:outline-none">
              <User className="h-6 w-6" />
            </Menu.Button>

            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/dashboard"
                      className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''}`}
                    >
                      Dashboard
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/profile"
                      className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''}`}
                    >
                      Profile
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/add_preferences"
                      className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''}`}
                    >
                      Add Prefrences
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/quiz"
                      className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''}`}
                    >
                      Generate Quiz
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/resources"
                      className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''}`}
                    >
                      Resources
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`block w-full text-left px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''}`}
                      onClick={() => {
                        Cookies.remove('token'); // Remove the token on logout
                        setIsLoggedIn(false); // Update the state to logged out
                        window.location.href = '/'; // Redirect to landing page
                      }}
                    >
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Menu>
        ) : (
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/register?login=true">
            Login
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
