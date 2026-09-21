import React from "react";
import { TEXTS } from "../config/photoConfig";

export const Header: React.FC = () => {
  return (
    <header className="app-header">
      <h1>{TEXTS.header}</h1>
    </header>
  );
};
