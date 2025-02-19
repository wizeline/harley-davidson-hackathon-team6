export default function Button({ children, onClick }) {
    return (
        <button
            className="border hover:bg-slate-700 border-[#979797] text-[#f60] text-base font-semibold rounded-lg p-4 w-full"
            onClick={onClick}
        >
            {children}
        </button>
    );
}