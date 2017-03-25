# Knowt
A Note Taking App

How to set up and run react:
1. Install node.js
2. Change the "scripts" code in package.json file to the following:

```
"scripts": {
    "start": "npm run build",
    "build": "webpack -d && cp src/index.html dist/index.html && webpack-dev-server --content-base src/ --inline --hot",
    "build:prod": "webpack -p && cp src/index.html dist/index.html"
  },
```
3. Execute the following:
```
npm install react react-dom –save
```
```
npm install webpack webpack-dev-server babel-loader babel-preset-es2015 babel-preset-react babel-preset-stage-2 –save-dev
```

4. Type `npm start` in your terminal and navigate to localhost:8080
