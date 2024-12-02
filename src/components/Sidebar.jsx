import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { name: 'home', path: '/' },
    { name: 'about', path: '/about' },
    { name: 'play ground', path: '/protected' },
    { name: 'github-summarizer', path: '/github-summarizer' },
    { name: 'blog', path: '/blog' },
    { name: 'portfolio', path: '/portfolio' },
    { name: 'contact', path: '/contact' },
    { name: 'faq', path: '/faq' }
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-50 rounded-full bg-purple-600 p-2 text-white hover:bg-purple-700"
      >
        {isOpen ? '←' : '→'}
      </button>

      <aside className={`
        fixed left-0 top-0 h-screen w-48 bg-gradient-to-b from-purple-600 to-green-400 p-4
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <nav className="flex flex-col space-y-4 pt-12">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`
                text-white font-mono text-sm hover:text-purple-200 transition-colors
                ${pathname === item.path ? 'text-purple-200' : ''}
              `}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
} 