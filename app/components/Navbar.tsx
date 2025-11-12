import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="bg-white shadow-md">
            <div className="w-full px-4 sm:px-6 lg:px-8 h-25 flex items-center">
                <Link href="/" className="flex items-center">
                    <Image src="/logo.svg" alt="Dollar UAE" className="h-12 w-auto" width={360} height={360} />
                </Link>
            </div>
        </nav>
    );
}