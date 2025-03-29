import express from 'express';
import cors from 'cors';
import { ESLint } from 'eslint';
import { transformSync } from '@babel/core';
import { VM } from 'vm2';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Enhanced Bug Detection API is running' });
});

// Analyze JavaScript code
app.post('/api/analyze', async (req, res) => {
  try {
    const { code } = req.body;
    
    // Step 1: Set up ESLint with advanced rules
    const eslint = new ESLint({
      useEslintrc: false,
      overrideConfig: {
        parserOptions: {
          ecmaVersion: 2021,
          sourceType: 'module',
          ecmaFeatures: { jsx: true }
        },
        plugins: ['security'],
        extends: ['eslint:recommended', 'plugin:security/recommended'],
        rules: {
          'no-unused-vars': 'error',
          'no-undef': 'error',
          'no-console': 'warn',
          'prefer-const': 'warn',
          'no-duplicate-imports': 'error',
          'no-empty': 'warn',
          'no-extra-semi': 'warn',
          'no-irregular-whitespace': 'warn',
          'no-template-curly-in-string': 'warn',
          'security/detect-eval-with-expression': 'error',
          'security/detect-non-literal-require': 'warn',
          'security/detect-object-injection': 'warn',
          'spaced-comment': 'off', // Prevents warnings on commented lines
          'no-warning-comments': 'off', // Allows TODO/FIXME comments
          'capitalized-comments': 'off' // Prevents forcing comments to be capitalized
        }
      }
    });

    // Run ESLint analysis
    const results = await eslint.lintText(code);
    const messages = results[0].messages;

    // Step 2: Transform code using Babel for deeper analysis
    let transpiledCode = null;
    try {
      transpiledCode = transformSync(code, { presets: ['@babel/preset-env'] }).code;
    } catch (babelError) {
      messages.push({
        severity: 2,
        message: `Babel Parsing Error: ${babelError.message}`,
        line: 1,
        column: 1,
        ruleId: 'babel-parser'
      });
    }

    // Step 3: Sandbox execution to detect runtime errors
    let runtimeError = null;
    if (transpiledCode) {
      try {
        const vm = new VM({ timeout: 500, sandbox: {} });
        vm.run(transpiledCode);
      } catch (error) {
        runtimeError = {
          severity: 2,
          message: `Runtime Error: ${error.message}`,
          line: 1,
          column: 1,
          ruleId: 'runtime-error'
        };
      }
    }

    // Step 4: Format detected issues
    const issues = messages.map(msg => ({
      severity: msg.severity === 2 ? 'error' : msg.severity === 1 ? 'warning' : 'info',
      message: msg.message,
      line: msg.line,
      column: msg.column,
      ruleId: msg.ruleId || 'unknown',
      fix: msg.fix ? { suggestion: msg.fix.text } : undefined
    }));

    if (runtimeError) {
      issues.push(runtimeError);
    }

    // Step 5: Generate summary statistics
    const stats = {
      errors: issues.filter(i => i.severity === 'error').length,
      warnings: issues.filter(i => i.severity === 'warning').length,
      info: issues.filter(i => i.severity === 'info').length
    };

    res.json({ issues, stats });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Enhanced Bug Detection Server running on port ${port}`);
});
