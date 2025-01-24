import React, {useState, useEffect, useMemo} from 'react'
import { useTracker } from '@/contexts/TrackerContext'
import {Plus, Download, Upload, LayoutDashboard} from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import {Link, useLocation} from "react-router-dom";

interface TrackerMenuProps {
    isOpen: boolean;
    setIsOpen: (state: boolean) => void
}

const TrackerMenu: React.FC<TrackerMenuProps> = ({ isOpen, setIsOpen })  => {
    const { trackers, getCategories } = useTracker()
    const [isClient, setIsClient] = useState(false)
    const [categories, setCategories] = useState<string[]>([])
    const location = useLocation()

    const pathname = useMemo(() => location.pathname, [location])

    useEffect(() => {
        setCategories(getCategories())
    }, [getCategories, trackers])

    useEffect(() => {
        setIsClient(true)
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen)

    const groupedTrackers = categories.reduce((acc, category) => {
        acc[category] = trackers.filter(tracker => tracker.category === category)
        return acc
    }, {} as Record<string, typeof trackers>)

    const uncategorizedTrackers = trackers.filter(tracker => !tracker.category)

    return (
        <>
            <div
                className={`fixed top-0 left-0 h-screen bg-white shadow-lg transition-transform duration-300 ease-in-out z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:h-full`}
                style={{ width: '250px' }}
            >
                <div className="p-4">
                    <div className="flex items-center mb-4">
                        <h2 className="text-xl font-bold">Navigation</h2>
                    </div>
                    <ul>
                        <li className="mb-2">
                            <Link to="/"
                                  className={`block w-full text-left p-2 hover:bg-gray-100 rounded ${pathname === '/' ? 'bg-gray-200' : ''}`}>
                                <Plus className="inline-block mr-2" size={18}/>
                                Create New Tracker
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link to="/dashboard"
                                  className={`block w-full text-left p-2 hover:bg-gray-100 rounded ${pathname === '/dashboard' ? 'bg-gray-200' : ''}`}>
                                <LayoutDashboard className="inline-block mr-2" size={18}/>
                                Dashboard
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link to="/export"
                                  className={`block w-full text-left p-2 hover:bg-gray-100 rounded ${pathname === '/export' ? 'bg-gray-200' : ''}`}>
                                <Download className="inline-block mr-2" size={18}/>
                                Export Data
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link to="/import"
                                  className={`block w-full text-left p-2 hover:bg-gray-100 rounded ${pathname === '/import' ? 'bg-gray-200' : ''}`}>
                                <Upload className="inline-block mr-2" size={18}/>
                                Import Data
                            </Link>
                        </li>
                    </ul>

                    <div className="flex items-center my-4">
                        <h2 className="text-xl font-bold">Trackers</h2>
                    </div>
                    {isClient && <>
                        {categories.map((category) => (
                            <Accordion type="multiple" className="w-full" key={category}>
                                <AccordionItem value={category}>
                                    <AccordionTrigger>{category}</AccordionTrigger>
                                    <AccordionContent>
                                        <ul>
                                            {groupedTrackers[category].map((tracker) => (
                                                <li key={tracker.id} className="mb-2">
                                                    <Link
                                                        to={`/tracker/${tracker.id}`}
                                                        className={`block w-full text-left p-2 hover:bg-gray-100 rounded ${pathname === `/tracker/${tracker.id}` ? 'bg-gray-200' : ''}`}
                                                    >
                                                        {tracker.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        ))}
                        {uncategorizedTrackers.length > 0 && (
                            <ul>
                                {uncategorizedTrackers.map((tracker) => (
                                    <li key={tracker.id} className="mb-2">
                                        <Link
                                            to={`/tracker/${tracker.id}`}
                                            className={`block w-full text-left p-2 hover:bg-gray-100 rounded ${pathname === `/tracker/${tracker.id}` ? 'bg-gray-200' : ''}`}
                                        >
                                            {tracker.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>}
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

