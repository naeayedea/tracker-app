'use client'

import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useTracker} from '@/contexts/TrackerContext'
import {Download, Menu, Plus} from 'lucide-react'

interface TrackerMenuProps {
    isOpen: boolean;
    setIsOpen: (state: boolean) => void;
}

const TrackerMenu: React.FC<TrackerMenuProps> = ({isOpen, setIsOpen}) => {
    const [isClient, setIsClient] = useState(false);
    const {trackers} = useTracker()
    const pathname = usePathname()

    useEffect(() => {
        setIsClient(true)
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen)

    return (
        <>
            {/*<div className={`h-full bg-white shadow-lg transition-transform duration-300 ease-in-out z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`} style={{width: '250px'}}>*/}
            <aside
                className={`bg-secondary text-secondary-foreground w-64 overflow-y-auto transition-all duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0 md:relative absolute inset-y-0 left-0 z-10`}>
                <div className="p-4">
                    <div className="flex items-center mb-4">
                        <button onClick={toggleMenu} className={"p-2 md:hidden"}>
                            <div><Menu/></div>
                        </button>
                        <h2 className="text-xl font-bold">Trackers</h2>
                    </div>
                    <ul>
                        <li className="mb-2">
                            <Link href="/"
                                  className={`block w-full text-left p-2 hover:bg-gray-100 rounded ${pathname === '/' ? 'bg-gray-200' : ''}`}>
                                <Plus className="inline-block mr-2" size={18}/>
                                Create New Tracker
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link href="/export"
                                  className={`block w-full text-left p-2 hover:bg-gray-100 rounded ${pathname === '/export' ? 'bg-gray-200' : ''}`}>
                                <Download className="inline-block mr-2" size={18}/>
                                Export Data
                            </Link>
                        </li>
                        {isClient && trackers.map((tracker) => (
                            <li key={tracker.id} className="mb-2">
                                <Link
                                    href={`/tracker/${tracker.id}`}
                                    className={`block w-full text-left p-2 hover:bg-gray-100 rounded ${pathname === `/tracker/${tracker.id}` ? 'bg-gray-200' : ''}`}
                                >
                                    {tracker.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={toggleMenu}
                ></div>
            )}
        </>
    )
}

export default TrackerMenu

