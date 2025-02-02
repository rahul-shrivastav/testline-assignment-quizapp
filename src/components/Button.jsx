export function Button({ children, onClick, className }) {
    return (
      <button
        onClick={onClick}
        className={`px-6 py-3 rounded-lg text-white font-bold transition-transform transform hover:scale-105 ${className}`}
      >
        {children}
      </button>
    );
  }
  