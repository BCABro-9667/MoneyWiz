
import ProfileClient from '@/components/ProfileClient';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
             <header className="bg-primary text-primary-foreground p-6 md:p-8 rounded-bl-[50px] rounded-br-[50px] shadow-lg relative">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold font-headline">Profile Settings</h1>
                    <Link href="/" passHref>
                        <Button variant="outline" className="rounded-full bg-primary-foreground text-primary">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </header>
            <main className="p-4 md:p-6">
                <ProfileClient />
            </main>
        </div>
    )
}
