# CodeMirror

CodeMirror is a browser-based coding reflection tool built with React and Vite. It gives learners a first-pass, rule-based view of code patterns, estimated complexity, possible issues, and practice ideas.

The analyzer works locally in the browser. It does not send submitted code to an API or execute it.

## Features

- A code editor with line numbers, character count, language selection, example loading, and clear controls.
- Heuristic pattern and time/space complexity estimates based on visible code structure.
- A lightweight correctness review that can flag some likely Python issues.
- Limited Python output prediction for supported simple statements, including literals, variables, arithmetic, lists, `print`, and `range` loops.
- A better-version suggestion for a narrow, recognizable nested membership-search pattern, with an explanation of its trade-offs.
- Result sections for analysis, errors, output, explanation, suggested code, and practice.

## Language support

The selector includes Python, C, C++, Java, and JavaScript. Pattern and complexity estimates use simple code inspection and are not compiler-backed. Python has the additional limited checks and output prediction described below. Output simulation is not provided for C, C++, Java, or JavaScript.

## Run locally

Install the dependencies and start the Vite development server:

```bash
npm install
npm run dev
```

The terminal prints the local development URL.

Available scripts:

```bash
npm run lint    # Check source with ESLint
npm run build   # Create the production build in dist/
npm run preview # Serve the production build locally
```

## Analysis limits

- The analyzer is educational and heuristic. Complexity estimates and pattern labels may be incomplete or incorrect for a particular problem.
- Python error checks cover only a few detectable cases and do not replace running a real parser, tests, or debugger.
- Output is predicted only for a small set of supported Python patterns. Other code receives an explicit unsupported-simulation message. Submitted code is never evaluated or executed.
- Better-version generation is intentionally narrow. When the analyzer cannot identify a safe, meaningful rewrite, it shows a general fallback instead.
- The project does not compile, run, or prove the correctness of submitted programs.

## Project structure

```text
src/
  components/  Page sections and analyzer UI
  lib/         Rule-based analyzer and status helpers
  assets/      Local visual assets
  App.jsx      Page composition
  App.css      Site and component styles
  index.css    Global styles
  main.jsx     React entry point
public/        Static public assets
```
