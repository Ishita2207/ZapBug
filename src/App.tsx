import { useState, useRef } from 'react';
import { CodeEditor } from './components/CodeEditor';
import { IssuesList } from './components/IssuesList';
import { Stats } from './components/Stats';
import { analyzeCode } from './utils/analyzer';
import { Bug } from 'lucide-react';
import type { AnalysisResult } from './types';

const DEFAULT_CODE = `// Paste your JavaScript code here or upload a file
function example() {
  console.log("Hello World");
  let unused = "This will trigger a warning";
  const a = undefinedVariable;
}`;

function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [result, setResult] = useState<AnalysisResult>({
    issues: [],
    stats: { errors: 0, warnings: 0, info: 0 }
  });
  const editorRef = useRef<any>(null);

  const handleAnalyze = async () => {
    const analysis = await analyzeCode(code);
    setResult(analysis);
  };

  const handleIssueClick = (line: number) => {
    editorRef.current?.revealLineInCenter(line);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Bug className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold">Bug Detection System</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 gap-8 h-[800px]">
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <CodeEditor
              code={code}
              onChange={setCode}
              onAnalyze={handleAnalyze}
            />
          </div>
          <div className="flex flex-col bg-gray-800 rounded-lg overflow-hidden">
            <Stats stats={result.stats} />
            <IssuesList
              issues={result.issues}
              onIssueClick={handleIssueClick}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;