
interface InputProps {
    message: string;
    value: string;
    setValue: (newValue: string) => void;
}

export default function Input({ message, value, setValue }: InputProps) {
    return (
        <div className="mb-4">
            <label htmlFor="query" className="block font-medium mb-2">
                I would like to know more about
            </label>
            <input
                type="text"
                id="query"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={message}
                required
            />
        </div>
    );
}