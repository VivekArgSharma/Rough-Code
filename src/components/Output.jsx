import { useState } from "react";
import { executeCode } from "../api";
import "./Output.css"; // Import the CSS file

const Output = ({ editorRef, language }) => {
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [toast, setToast] = useState(null);

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
    try {
      setIsLoading(true);
      setToast(null);
      const { run: result } = await executeCode(language, sourceCode);
      setOutput(result.output.split("\n"));
      result.stderr ? setIsError(true) : setIsError(false);
    } catch (error) {
      console.error(error);
      setToast(error.message || "Unable to run code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="output-container">
      <div className="output-header">
        <h2>Output</h2>
        <button
          onClick={runCode}
          disabled={isLoading}
          className={`run-btn ${isLoading ? "disabled" : ""}`}
        >
          {isLoading ? "Running..." : "Run Code"}
        </button>
      </div>

      {/* Toast Message */}
      {toast && <div className="toast">{toast}</div>}

      {/* Output Box */}
      <div className={`output-box ${isError ? "error" : ""}`}>
        {output
          ? output.map((line, i) => <p key={i}>{line}</p>)
          : 'Click "Run Code" to see the output here'}
      </div>
    </div>
  );
};

export default Output;
