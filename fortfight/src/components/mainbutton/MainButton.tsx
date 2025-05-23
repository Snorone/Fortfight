import React from "react";
import "./MainButton.css";

interface MainButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "danger" | "secondary";
}

export default function MainButton({
  children,
  onClick,
  type = "button",
  variant = "primary",
}: MainButtonProps) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`main-button ${variant}`}
    >
      {children}
    </button>
  );
}