import { useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";
import DrawingApp from "./DrawingApp";
import Header from "./Header";
import "./CodeEditor.css";

const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  return (
    <div>
      <Header />
      <div className="code-editor-container">
      <div className="editor-panel">
        <LanguageSelector language={language} onSelect={onSelect} />
        <Editor
          options={{ minimap: { enabled: false } }}
          className="flex-1"
          theme="vs-dark"
          language={language}
          defaultValue={CODE_SNIPPETS[language]}
          onMount={onMount}
          value={value}
          onChange={(value) => setValue(value)}
        />
      </div>

      <div className="output-panel">
        <Output editorRef={editorRef} language={language} />
      </div>
      <div className="drawing-pad">
        <DrawingApp />
      </div>
    </div>
    </div>    
  );
};

export default CodeEditor;
