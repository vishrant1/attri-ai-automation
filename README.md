# Attri AI Automation

This repository contains automated Playwright tests for [Attri AI](https://attri.ai). The framework is built with **TypeScript**, **Playwright**, **ESLint**, and **Allure reporting**. It is designed to run locally or on **CI/CD** pipelines using GitHub Actions.

---

## Features

- **Playwright** for end-to-end UI automation
- **TypeScript** for type safety
- **ESLint + Prettier** for code quality
- **Allure Reports** for detailed test reporting
- CI/CD ready with **GitHub Actions**
- Dynamic handling of browser projects: Chrome, Firefox, Edge, Safari
- Handles cookie popups automatically

---

## Project Structure

```bash
attri-ai-automation/
├─ src/
│ ├─ fixtures/ # Base test setup
│ └─ tests/ # All test specs
├─ .github/workflows/ # GitHub Actions CI/CD
├─ playwright.config.ts # Playwright configuration
├─ eslint.config.js # ESLint configuration
├─ tsconfig.json # TypeScript config
├─ package.json # NPM scripts & dependencies
└─ README.md
```

---

## Prerequisites

- Node.js >= 18
- npm >= 9
- Allure CLI installed globally (optional for local reports)

```bash
npm install -g allure-commandline --save-dev
npx playwright install
```

## Installation
Clone the repository:
```bash
git clone https://github.com/vishrant1/attri-ai-automation.git
cd attri-ai-automation
npm install
```

## Running Tests Locally
Run all tests:
```bash
npm test
```
Run a specific test file:
```bash
npx playwright test src/tests/layout.spec.ts
```
Run a single test in debug mode:
```bash
 npx playwright test src/tests/layout.spec.ts -g 'Verify header navigation links are visible' --debug
```

## Generating Allure Reports Locally
```bash
allure generate allure-results --clean ; allure open
```

## Author
Vishrant Thakkar