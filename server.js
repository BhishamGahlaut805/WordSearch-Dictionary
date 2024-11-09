const express = require('express');
const cors = require('cors');
const quotes = require('inspirational-quotes');
const moment = require('moment');
const { rword } = require('rword');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Use CORS middleware
app.use(cors());

// Function to inject CSS, JS, and images into HTML
const injectAssets = (htmlFilePath, cssFilePath, jsFilePath) => {
    let html = fs.readFileSync(htmlFilePath, 'utf-8');
    const css = fs.readFileSync(cssFilePath, 'utf-8');
    const js = fs.readFileSync(jsFilePath, 'utf-8');
    html = html.replace('</head>', `<style>${css}</style></head>`);
    html = html.replace('</body>', `<script>${js}</script></body>`);

    return html;
};

// Middleware to serve images from the 'assets/images_icons' directory
app.use('/assets/CSS/images_icons', express.static(path.join(__dirname, 'assets', 'CSS', 'images_icons')));

// Route for the about page
app.get('/contact', (req, res) => {
    const aboutPage = injectAssets(
        path.join(__dirname, 'templates', 'about.html'),
        path.join(__dirname, 'assets', 'CSS', 'style.css'),
        path.join(__dirname, 'assets','CSS','Javascript', 'script.js')
    );
    res.send(aboutPage);
});

// Route for the main page
app.get('/main', (req, res) => {
    const mainPage = injectAssets(
        path.join(__dirname, 'templates', 'index.html'),
        path.join(__dirname, 'assets', 'CSS', 'style.css'),
        path.join(__dirname, 'assets', 'CSS','Javascript', 'script.js')
    );
    res.send(mainPage);
});

// Get Result from Package
const getResultFromPackage = () => {
    const words = require('an-array-of-english-words');
    return words;
};

app.get('/api/words', (req, res) => {
    const result = getResultFromPackage();
    res.json(result); // Send the result as JSON
});

// Get today's date in dd-mm-yyyy format
const today = moment().format('DD-MM-YYYY');

// Get the current time in hh:mm:ss format
const currentTime = moment().format('HH:mm:ss');

console.log('Today\'s date:', today);
console.log('Current time:', currentTime);

// facts
app.get('/api/facts', (req, res) => {
    const fetchQuote = quotes.getRandomQuote();
    res.json(fetchQuote);
});

// words
console.log(rword.generate());

app.get('/api/new_word', (req, res) => {
    try {
        const randomWord = rword.generate();
        const wordInfo = {
            word: randomWord,
        };
        res.json(wordInfo);
    } catch (error) {
        console.error('Error fetching word information:', error);
        res.status(500).json({ error: 'An error occurred while fetching word information.' });
    }
});

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Serving HTML files
app.get('/contact', (req, res) => {
    res.sendFile('templates/about.html', { root: __dirname });
});

app.get('/main', (req, res) => {
    res.sendFile('templates/index.html', { root: __dirname });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/main`);
});
