function Button({ children, onClick, type = 'button', variant = 'primary', disabled = false, className = '', ...props }) {
  const baseStyle = "py-2 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "text-white bg-primary hover:bg-primary-hover focus:ring-primary border-transparent",
    secondary: "text-on-surface bg-surface hover:bg-gray-50 focus:ring-primary border-border",
    destructive: "text-white bg-destructive hover:bg-red-600 focus:ring-destructive border-transparent",
  };

  const variantStyle = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variantStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;