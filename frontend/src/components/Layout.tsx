import React from 'react';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../hooks/useStacks';

type NavLink = {
  name: string;
  href: string;
};

const navigation: NavLink[] = [
  { name: 'Campaigns', href: '/campaigns' },
  { name: 'Create Campaign', href: '/create' },
  { name: 'My Donations', href: '/donations' },
  { name: 'About', href: '/about' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <img
                  className="h-8 w-auto"
                  src="/logo.svg"
                  alt="TPC Logo"
                />
                <span className="ml-2 text-xl font-bold text-gray-900">TPC</span>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <NavLink key={item.name} item={item} />
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <ConnectWalletButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              <a href="https://twitter.com/TPChain" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="https://github.com/irobinda01/Transparent-Philanthropy-Chain" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
            <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
              &copy; 2025 Transparent Philanthropy Chain. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavLink({ item }: { item: NavLink }) {
  const isActive = window.location.pathname === item.href;
  return (
    <Link
      to={item.href}
      className={twMerge(
        'inline-flex items-center px-1 pt-1 text-sm font-medium',
        isActive
          ? 'border-b-2 border-primary-500 text-gray-900'
          : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
      )}
    >
      {item.name}
    </Link>
  );
}

function ConnectWalletButton() {
  const { isAuthenticated, authenticate, disconnect, address } = useAuth();

  if (isAuthenticated && address) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-700 truncate" title={address}>
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <button
          type="button"
          onClick={disconnect}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={authenticate}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
    >
      Connect Wallet
    </button>
  );
}