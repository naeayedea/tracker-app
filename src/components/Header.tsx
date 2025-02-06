import React from "react";
import {Menu, X} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HeadingOne } from '@/components/ui/text'

export default function Header({ toggleSideMenu, isSideMenuOpen }: { toggleSideMenu: () => void, isSideMenuOpen: boolean }) {
    return (
        <header className="bg-foreground text-primary-foreground p-2 xl:p-4 flex items-center justify-between">
            <HeadingOne className="text-primary-foreground">Tracker Tracking</HeadingOne>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleSideMenu}>
                {isSideMenuOpen ? <X className="h-6 w-6" /> : <Menu className={"h-6 w-6"} />}
            </Button>
        </header>
    )
}

