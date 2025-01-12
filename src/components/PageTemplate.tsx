'use client'

import React, {useEffect, useState} from 'react'
import Header from './Header'
import Footer from './Footer'
import TrackerMenu from "./TrackerMenu";
import {useWindowSize} from "react-use";

export default function PageTemplate({ children }: { children: React.ReactNode}) {
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)
    const [isClient, setIsClient] = useState(false)
    const {width} = useWindowSize()

    useEffect(() => {
        setIsClient(true)
    }, []);

    const toggleSideMenu = () => {
        setIsSideMenuOpen(!isSideMenuOpen)
    }

    return (
        <div className="flex flex-col min-h-screen max-h-screen">
            <Header toggleSideMenu={toggleSideMenu} />
            <div className="flex flex-1 overflow-hidden">
                {isClient && <TrackerMenu isOpen={isSideMenuOpen || width > 1000} setIsOpen={setIsSideMenuOpen}/>}
                <main className="flex-1 overflow-y-auto p-4">
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    )
}

