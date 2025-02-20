import Image from "next/image";

export default function Header() {
    return (
        <header className="bg-black">
            <nav className="mx-auto flex items-center justify-between p-6 lg:px-6" aria-label="Global">
                <div className="flex items-center gap-2">
                    <a href="#" className="-m-1.5 p-1">
                        <Image
                            className="dark:invert"
                            src="/logo.png"
                            alt="Next.js logo"
                            width={50}
                            height={38}
                            priority
                        />
                    </a>
                    <span className="text-white text-xl font-semibold">RIDE PLANNER</span>
                </div>

                <div className="flex lg:hidden">
                    <button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
                        <span className="sr-only">Open main menu</span>
                        <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12 text-white ">
                    <a href="#" className="text-sm/6 font-semibold text-[#f60] active:text-[#f60]">CREATE</a>
                    <a href="#" className="text-sm/6 font-semibold hover:text-[#f60]">MAP</a>
                    <a href="#" className="text-sm/6 font-semibold hover:text-[#f60]">SIGN-IN</a>
                    <a href="#" className="text-sm/6 font-semibold hover:text-[#f60]">H-D.COM <span aria-hidden="true">&rarr;</span></a>
                </div>
            </nav>
        </header>
    )
}
