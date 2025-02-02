import React, {useEffect, useState} from 'react'
import Header from './Header'
import Footer from './Footer'
import TrackerMenu from "./TrackerMenu";
import {useWindowSize} from "react-use";

export default function PageTemplate({ children }: { children: React.ReactNode}) {
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)
    const [isClient, setIsClient] = useState(false)
    const {width: width} = useWindowSize()

    useEffect(() => {
        setIsClient(true)
    }, []);

    const toggleSideMenu = () => {
        setIsSideMenuOpen(!isSideMenuOpen)
    }

    return (
        <div className="flex flex-col min-h-screen max-h-svh h-svh">
            <Header toggleSideMenu={toggleSideMenu} isSideMenuOpen={isSideMenuOpen}/>
            <div className="flex flex-1 overflow-hidden h-svh max-h-svh">
                {isClient && <TrackerMenu isOpen={isSideMenuOpen || width > 1024} setIsOpen={setIsSideMenuOpen}/>}
                <main className="flex-1 overflow-y-auto p-4 page-main-content">
                    <div className={"p-2 min-h-full max-h-full"}>
                        <div className="mx-auto w-[1920px] max-w-full min-h-full">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
            <Footer/>
        </div>
    )
}

