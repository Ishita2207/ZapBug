import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Moon, Sun, Upload } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
}

export function CodeEditor({ code, onChange, onAnalyze }: CodeEditorProps) {
  const [isDark, setIsDark] = useState(true);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-4 bg-gray-800 dark:bg-gray-900">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <input
            type="file"
            accept=".js,.jsx,.ts,.tsx"
            className="hidden"
            id="file-upload"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  onChange(e.target?.result as string);
                };
                reader.readAsText(file);
              }
            }}
          />
          <label
            htmlFor="file-upload"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Upload File</span>
          </label>
        </div>
        <button
          onClick={onAnalyze}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
        >
          Analyze Code
        </button>
      </div>
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          theme={isDark ? "vs-dark" : "light"}
          value={code}
          onChange={(value) => onChange(value || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
}