import { useState } from "react";
import { LANGUAGE_VERSIONS } from "../constants";

const languages = Object.entries(LANGUAGE_VERSIONS);
const ACTIVE_COLOR = "text-blue-400";

const LanguageSelector = ({ language, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="ml-2 mb-4 relative inline-block text-left">
      <p className="mb-2 text-lg">Language:</p>

      {/* Dropdown button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
      >
        {language}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute mt-2 w-40 bg-[#110c1b] rounded-lg shadow-lg z-10">
          {languages.map(([lang, version]) => (
            <button
              key={lang}
              onClick={() => {
                onSelect(lang);
                setIsOpen(false);
              }}
              className={`flex justify-between w-full px-4 py-2 text-left rounded-md ${
                lang === language
                  ? "bg-gray-900 text-blue-400"
                  : "text-gray-300 hover:bg-gray-900 hover:text-blue-400"
              }`}
            >
              {lang}
              <span className="text-gray-500 text-sm">({version})</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;