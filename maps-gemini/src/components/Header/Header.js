import Image from "next/image";
// import Logo from '../../assets/logo.png';

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
                        {/* <img className="h-8 w-auto" src="../../assets/logo.png" alt="Harley Davidson" /> */}
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

            <div className="lg:hidden" role="dialog" aria-modal="true">

                <div className="fixed inset-0 z-10"></div>
                <div className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="sr-only">Your Company</span>
                            <img className="h-8 w-auto" src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="" />
                        </a>
                        <button type="button" className="-m-2.5 rounded-md p-2.5 text-gray-700">
                            <span className="sr-only">Close menu</span>
                            <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">Product</a>
                                <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">Features</a>
                                <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">Marketplace</a>
                                <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">Company</a>
                            </div>
                            <div className="py-6">
                                <a href="#" className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">Log in</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>

    )
}
