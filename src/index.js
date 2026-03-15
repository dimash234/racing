// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Global base styles
const style = document.createElement("style");
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'DM Sans', sans-serif; background: #fff; color: #1A1A2E; -webkit-font-smoothing: antialiased; }
  img { max-width: 100%; }
  a { color: inherit; }
`;
document.head.appendChild(style);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<React.StrictMode><App /></React.StrictMode>);
