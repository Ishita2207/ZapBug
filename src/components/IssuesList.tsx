import { CodeIssue } from '../types';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface IssuesListProps {
  issues: CodeIssue[];
  onIssueClick: (line: number) => void;
}

export function IssuesList({ issues, onIssueClick }: IssuesListProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'border-red-200 bg-red-50 hover:bg-red-100';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100';
      default:
        return 'border-blue-200 bg-blue-50 hover:bg-blue-100';
    }
  };

  return (
    <div className="h-full overflow-auto">
      <div className="p-4 space-y-3">
        {issues.map((issue, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border cursor-pointer transition-colors ${getSeverityClass(
              issue.severity
            )}`}
            onClick={() => onIssueClick(issue.line)}
          >
            <div className="flex items-start space-x-3">
              {getSeverityIcon(issue.severity)}
              <div>
                <p className="font-medium text-gray-900">{issue.message}</p>
                <p className="text-sm text-gray-600">
                  Line {issue.line}, Column {issue.column} - {issue.ruleId}
                </p>
                {issue.fix && (
                  <p className="mt-2 text-sm text-gray-700 bg-white p-2 rounded border">
                    Suggestion: {issue.fix.suggestion}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}