

const Button = ({ onClick, text, style }) => {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 20px",
        backgroundColor: "#007BFF",
        color: "#FFFFFF",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        ...style,
      }}
    >
      {text}
    </button>
  );
};

export default Button;
