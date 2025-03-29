export interface CodeIssue {
  severity: 'error' | 'warning' | 'info';
  message: string;
  line: number;
  column: number;
  ruleId: string;
  fix?: {
    suggestion: string;
  };
}

export interface AnalysisResult {
  issues: CodeIssue[];
  stats: {
    errors: number;
    warnings: number;
    info: number;
  };
}