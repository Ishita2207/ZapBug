import { type AnalysisResult } from '../types';

export async function analyzeCode(code: string): Promise<AnalysisResult> {
  const lintingRules = {
    'no-unused-vars': 'error',
    'no-undef': 'error',
    'no-console': 'warn',
    'prefer-const': 'warn',
    'no-duplicate-imports': 'error',
    'no-empty': 'warn',
    'no-extra-semi': 'warn',
    'no-irregular-whitespace': 'warn',
    'no-template-curly-in-string': 'warn',
  };

  const issues = [];
  const lines = code.split('\n');

  // ✅ Helper function to check if a line is a comment
  const isComment = (line: string) => line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*');

  // ✅ Helper function to check if a word is inside a string (prevents false flags)
  const isInsideString = (line: string, word: string) => {
    let insideString = false;
    let quoteType = '';
    
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"' || line[i] === "'" || line[i] === '`') {
        if (!insideString) {
          insideString = true;
          quoteType = line[i]; // Start of string
        } else if (line[i] === quoteType) {
          insideString = false; // End of string
        }
      }
      if (insideString && line.startsWith(word, i)) return true;
    }
    return false;
  };

  // ✅ Process each line
  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    // Ignore comments
    if (isComment(line)) return;

    // Check for console.log
    if (line.includes('console.log')) {
      issues.push({
        severity: 'warning',
        message: 'Unexpected console statement.',
        line: lineNumber,
        column: line.indexOf('console.log') + 1,
        ruleId: 'no-console'
      });
    }

    // Check for let that could be const
    if (/\blet\s+\w+\b/.test(line) && !line.includes('=')) {
      issues.push({
        severity: 'warning',
        message: 'Use const instead of let for variables that are never reassigned.',
        line: lineNumber,
        column: line.indexOf('let') + 1,
        ruleId: 'prefer-const'
      });
    }

    // ✅ Improved Undefined Variable Check (Ignores Strings)
    const words = line.split(/[\s\(\)\{\}\[\],;=+\-*\/]+/);
    const keywords = new Set([
      'let', 'const', 'var', 'function', 'class', 'if', 'else', 'return',
      'true', 'false', 'null', 'undefined', 'import', 'export', 'new', 'try', 'catch'
    ]);

    words.forEach(word => {
      if (word && !keywords.has(word)) {
        if (!/^["'`].*["'`]$/.test(word) && !/^\d+$/.test(word) && !isInsideString(line, word)) {
          if (!/\bfunction\s+\b/.test(line) && !/\bclass\s+\b/.test(line)) {
            issues.push({
              severity: 'error',
              message: `'${word}' is not defined.`,
              line: lineNumber,
              column: line.indexOf(word) + 1,
              ruleId: 'no-undef'
            });
          }
        }
      }
    });
  });

  const stats = {
    errors: issues.filter(i => i.severity === 'error').length,
    warnings: issues.filter(i => i.severity === 'warning').length,
    info: issues.filter(i => i.severity === 'info').length
  };

  return { issues, stats };
}


//it is also flaging eveyr word in " "  in a let unused = " thisis me" then also in a console.log("this is hello") what to do. u know what aanlaysse and ensure that the checks implemented are enoguha and accurate 