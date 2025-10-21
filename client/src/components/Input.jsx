function Input({ type = 'text', ...props }) {
  return (
    <input
      type={type}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      {...props}
    />
  );
}

export default Input;