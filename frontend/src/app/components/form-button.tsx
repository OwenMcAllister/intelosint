

interface ButtonProps {
    display: string;
}

export default function FormButton({ display }: ButtonProps) {
    return (
        <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition"
        >
            {display}
        </button>
    );
}