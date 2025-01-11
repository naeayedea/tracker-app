import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Header({ toggleSideMenu }: { toggleSideMenu: () => void }) {
    return (
        <header className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">My App</h1>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSideMenu}>
                <Menu className="h-6 w-6" />
            </Button>
        </header>
    )
}

