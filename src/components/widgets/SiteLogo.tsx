import { HomeIcon } from 'lucide-react';
import Link from 'next/link';

export default function SiteLogo () {
    return (
        <>
            <Link href="/"><h3 className="font-bold flex items-center"> <HomeIcon className="mr-2"/> QuickRent PH</h3></Link>
        </>
    );
}