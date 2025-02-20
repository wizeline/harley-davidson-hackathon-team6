export default function SmallButton({ children, onClick, width = "w-1/3" }) {
    return (
        <button
            className={`border hover:bg-slate-700 border-[#979797] text-[#f60] text-sm font-semibold rounded-lg p-2 flex flex-row items-center justify-center ${width}` }
            onClick={onClick}
        >
            {children}
        </button>
    );
}