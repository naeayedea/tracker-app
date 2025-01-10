'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTracker } from '@/contexts/TrackerContext'
import { Menu, Plus, Download } from 'lucide-react'

const TrackerMenu: React.FC = () => {
    const { trackers } = useTracker()
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    const toggleMenu = () => setIsOpen(!isOpen)

    return (
        <>
            <div className={"md:hidden p-4"}>
                <div className={"flex flex-row content-center h-max"}>
                    <button onClick={toggleMenu} className={"p-2"}>
                        <div><Menu/></div>
                    </button>
                    <h2 className={"flex flex-col justify-center text-xl font-bold"}>Trackers</h2>
                </div>
        </div>

    <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-transform duration-300 ease-in-out z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`} style={{ width: '250px' }}>
                <div className="p-4">
                    <div className="flex items-center mb-4">
                        <button onClick={toggleMenu} className={"p-2 md:hidden"}>
                            <div><Menu/></div>
                        </button>
                        <h2 className="text-xl font-bold">Trackers</h2>
                    </div>
                    <ul>
                        <li className="mb-2">
                            <Link href="/" className={`block w-full text-left p-2 hover:bg-gray-100 rounded ${pathname === '/' ? 'bg-gray-200' : ''}`}>
                                <Plus className="inline-block mr-2" size={18} />
                                Create New Tracker
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link href="/export" className={`block w-full text-left p-2 hover:bg-gray-100 rounded ${pathname === '/export' ? 'bg-gray-200' : ''}`}>
                                <Download className="inline-block mr-2" size={18} />
                                Export Data
                            </Link>
                        </li>
                        {trackers.map((tracker) => (
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
            </div>
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

