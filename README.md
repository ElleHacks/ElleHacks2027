# ElleHacks Application System

This project is the ElleHacks application system built with React + Vite.

## Prerequisites

Before you begin, make sure you have:

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/) 18 or newer
- npm (included with Node.js)

## 1) Clone the repo

```bash
git clone https://github.com/ElleHacks/ElleHacks2027.git
cd ElleHacks2027
```

If you are working inside the application system folder specifically:

```bash
cd ellehacks-application-system
```

## 2) Install dependencies

`node_modules` is not stored in Git, so you must install dependencies locally:

```bash
npm install
```

If you ever delete your `node_modules` folder, run this command again.

## 3) Run the app locally

Start the development server:

```bash
npm run dev
```

Then open the local URL shown in the terminal, typically:

```text
http://localhost:5173
```

To stop the app, press `Ctrl+C` in the terminal.

## 4) Create a new branch before making changes

Never work directly on `main` or the shared dev branch. Create a personal branch first:

```bash
git switch dev-application-system
git pull origin dev-application-system
git switch -c your-name
```

Replace `your-name` with a descriptive branch name, for example:

```bash
git switch -c natalie-homepage-fix
```

## 5) Make changes and test them

After editing files, run the project checks:

```bash
npm run lint
npm run build
```

If either step fails, fix the issue before committing.

## 6) Commit and push your branch

Check the files you changed:

```bash
git status
```

Stage and commit your work:

```bash
git add .
git commit -m "Describe your change"
```

Push your branch to GitHub:

```bash
git push -u origin your-name
```

Once pushed, open a Pull Request in GitHub from your branch into `dev-application-system`.

## Important rules

- Do not commit `node_modules`
- Do not commit generated build files or local environment files
- Do not push directly to `main` or `dev-application-system`
- Always work from a personal branch and open a Pull Request

## Typical workflow

```bash
git switch dev-application-system
git pull origin dev-application-system
git switch -c your-name
npm install
npm run dev
# make your edits
npm run lint
npm run build
git add .
git commit -m "Describe your change"
git push -u origin your-name
```

