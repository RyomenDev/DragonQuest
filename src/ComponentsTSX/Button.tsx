

interface ButtonProps {
  onClick: () => void; // Function type for onClick handler
  text: string; // Text to display on the button
  style?: React.CSSProperties; // Optional style object
}

const Button: React.FC<ButtonProps> = ({ onClick, text, style }) => {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 20px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
        ...style, // Apply dynamic styles from props
      }}
    >
      {text}
    </button>
  );
};

export default Button;
