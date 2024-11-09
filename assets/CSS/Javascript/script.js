const wordInput = document.querySelector(".word");
const searchBtn = document.querySelector(".search-btn");
const mainBody = document.querySelector(".main_text");

function removeAsterisks(str) {
    return str.replace(/\*/g, '');

}
function replaceItWithI(str) {
    return str.replace(/{it}/g, '<i>')
        .replace(/{\/it}/g, '</i>')
        .replace(/{ldquo}/g, '“')
        .replace(/{rdquo}/g, '”')
        .replace(/{wi}/g, '<i>')
        .replace(/{\/wi}/g, '</i>');
}

async function getWordDefinition(wordInput) {
    if (wordInput.value === "") {
        mainBody.innerHTML = `<h3>Enter Any Word First to search!!</h3>` +
            `<h4> Enter Any Other Word to Search</h4> ` +
            `<h4> Continue Learning</h4>`;
        return;
    }
    const KEY1 = "badf222b-e237-4b73-94ae-160dc8848ed9";
    const URL = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${wordInput.value}?key=${KEY1}`;
    const KEY2 = "c55d4532-924b-40b5-a51e-908fa7a09159";
    const URL1 = `https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${wordInput.value}?key=${KEY2}`;
    const URL3 = `https://api.dictionaryapi.dev/api/v2/entries/en/${wordInput.value}`;

    try {
        const response = await fetch(URL);
        const data = await response.json();
        console.log(data);


        if (!data.length) {
            mainBody.innerHTML = `<p>No definition found for <h3>"${wordInput.value}"</h3></p>` +
                `<h4>Enter Any Other Word to Search</h4>` +
                `<h4>Continue Learning</h4>`;
            return;
        }

        let wordHtml = "";
        if (data[0] && data[0].hwi && data[0].hwi.hw) {
            word_1 = removeAsterisks(data[0].hwi.hw).toUpperCase();
            wordHtml = `<i><h3>Word: ${word_1}</h3></i>`;
        }

        let shortdefHtml = "";
        if (data[0] && data[0].shortdef) {
            shortdefHtml += ` <h4> Short Definition of ${wordInput.value}:</h4>` + `<ul>`;
            data[0].shortdef.forEach(definition => {
                shortdefHtml += `<li>${definition}</li>`;
            });
            shortdefHtml += `</ul>`;
        }


        let similar_word = '';

        if (data[0] && data[0].meta && data[0].meta.stems) {
            data[0].meta.stems.forEach((w, index) => {
                if (index > 0) {
                    similar_word += ', ';
                }
                similar_word += `${w}`;
            });
        }


        let et = "";
        if (data[0] && data[0].et) {
            et += '<ul>';
            if (data[0].et) {
                data[0].et.forEach(etymology => {
                    let et1 = replaceItWithI(etymology[1]);
                    et += `<li>${et1}</li>`;
                });
            }
            et += '</ul>';
        }
        let pronunciations = '';

        if (data[0] && data[0].hwi && data[0].hwi.prs) {
            pronunciations += '<ul>';
            data[0].hwi.prs.forEach(pr => {
                pronunciations += `<li>${pr.mw ? pr.mw : 'N/A'} ${pr.sound ?
                    `<audio controls src="https://media.merriam-webster.com/audio/prons/en/us/mp3/${pr.sound.audio[0]}/${pr.sound.audio}.mp3"></audio>` : ''}</li>`;
            });
            pronunciations += '</ul>';
        }

        let usageExamples = "";

        if (data[0] && data[0].def && data[0].def[0] && data[0].def[0].sseq) {
            usageExamples += '<ul>';
            data[0].def[0].sseq.forEach(seq => {
                seq.forEach(item => {
                    if (item[1] && item[1].dt) {
                        item[1].dt.forEach(dtItem => {
                            if (dtItem[0] === "vis" && dtItem[1]) {
                                dtItem[1].forEach(example => {
                                    usageExamples += `<li>${replaceItWithI(example.t)}</li>`;
                                });
                            }
                        });
                    }
                });
            });
            usageExamples += '</ul>';
        }

        // Illustrations
        let illustrations = '';
        if (data[0] && data[0].art) {
            illustrations += '<ul>'
            data[0].art.artref.forEach(art => {
                illustrations += `<li><img src="${art.artid}" alt="${art.alttext}"/></li>`;
            });
            illustrations += '</ul>'
        }


        let spellingSuggestions = "";

        if (data[0] && data[0].meta && data[0].meta.stems) {
            spellingSuggestions += '<ul>';
            data[0].meta.stems.forEach(suggestion => {
                spellingSuggestions += `<li>${suggestion}</li>`;
            });
            spellingSuggestions += '</ul>';
        }

        let htmlerror = "";
        if (data) {
            let htmlContent = `<strong>Similar : </Strong>`;
            data.forEach(d => {
                htmlContent += `${d}, `;
            });
            htmlerror = htmlContent.slice(0, -2); // Remove the trailing comma and space
        }

        // API2 - Thesaurus
        let synonyms = '';
        let antonyms = '';
        let relatedWords = '';
        let nearAntonyms = '';
        let idiomaticPhrases = '';
        let conciseDefinitions = '';
        let htmlerror1 = "";
        try {
            const response1 = await fetch(URL1);
            const data1 = await response1.json();
            console.log(data1);

            if (!data1.length) {
                mainBody.innerHTML = `<p>No Words found for "${wordInput.value}"</p>`;
                return;
            }
            if (data1[0].meta && data1[0].meta.syns) {
                data1[0].meta.syns.forEach(synList => {
                    synList.forEach((syn, index) => {
                        if (index > 0) {
                            synonyms += ', ';
                        }
                        synonyms += syn;
                    });
                });
            }

            // Antonyms
            if (data1[0].meta && data1[0].meta.ants) {
                data1[0].meta.ants.forEach(antList => {
                    antList.forEach((ant, index) => {
                        if (index > 0) {
                            antonyms += ', ';
                        }
                        antonyms += ant;
                    });
                });
            }

            // Related words
            if (data1[0].meta && data1[0].meta.rel) {
                data1[0].meta.rel.forEach(relList => {
                    relList.forEach((rel, index) => {
                        if (index > 0) {
                            relatedWords += ', ';
                        }
                        relatedWords += rel;
                    });
                });
            }

            // Near antonyms
            if (data1[0].meta && data1[0].meta.near) {
                data1[0].meta.near.forEach(nearList => {
                    nearList.forEach((near, index) => {
                        if (index > 0) {
                            nearAntonyms += ', ';
                        }
                        nearAntonyms += near;
                    });
                });
            }

            // Idiomatic phrases
            if (data1[0].def && data1[0].def[0] && data1[0].def[0].sseq) {
                data1[0].def[0].sseq.forEach(seq => {
                    seq.forEach(item => {
                        if (item[1] && item[1].dt) {
                            item[1].dt.forEach(dtItem => {
                                if (dtItem[0] === "phrase" && dtItem[1]) {
                                    idiomaticPhrases += `<li>${replaceItWithI(dtItem[1])}</li>`;
                                }
                            });
                        }
                    });
                });
            }

            // Concise definitions
            if (data1[0].shortdef) {
                conciseDefinitions = `<ul>`;
                data1[0].shortdef.forEach(definition => {
                    conciseDefinitions += `<li>${definition}</li>`;
                });
                conciseDefinitions += `</ul>`;
            }


            if (data1) {
                let htmlContent = `<div><strong>Similar : </Strong>`;
                data1.forEach(d => {
                    htmlContent += `${d}, `;
                });
                htmlerror1 = htmlContent.slice(0, -2); // Remove the trailing comma and space
                htmlerror1 += `</div>`;
            }

        } catch (error) {
            console.error('Error fetching Words:', error);
        }


        // API3 - Dictionary
        let meaningsHTML = '';
        let phoneticsHTML = '';
        let sourceHTML = '';

        try {
            const response3 = await fetch(URL3);
            const data3 = await response3.json();
            console.log(data3);



            if (data3.length === 0 || data3.message) {
                // Display the no definitions found message
                let html4 = htmlerror1 + htmlerror + "<ul>";
                html4 += `<li><strong>${data3.title}</strong></li>`;
                html4 += `<li>${data3.message}</li>`;
                html4 += `<li>${data3.resolution}</li>`;
                html4 += "</ul>";
                mainBody.innerHTML = html4;
                return;
            }
            if (data3[0] && data3[0].meanings) {
                data3[0].meanings.forEach(meaning => {
                    meaningsHTML += `<h4>Part of Speech: ${meaning.partOfSpeech}</h4>`;
                    meaningsHTML += '<ul>';
                    meaning.definitions.forEach(def => {
                        meaningsHTML += `<li>Definition: ${def.definition}</li>`;
                    });
                    meaningsHTML += '</ul>';
                });
            }

            if (data3[0] && data3[0].phonetics) {
                phoneticsHTML = '<h4>Phonetics:</h4><ul>';
                data3[0].phonetics.forEach(phonetic => {
                    phoneticsHTML += `<li>Text: ${phonetic.text ? phonetic.text : 'N/A'}, Audio: ${phonetic.audio ? `<audio controls src="${phonetic.audio}"></audio>` : 'N/A'}</li>`;
                });
                phoneticsHTML += '</ul>';
            }

            if (data3[0] && data3[0].sourceUrls) {
                sourceHTML = '<h4>Source URLs:</h4><ul>';
                data3[0].sourceUrls.forEach(url => {
                    sourceHTML += `<li><a href="${url}" target="_blank">${url}</a></li>`;
                });
                sourceHTML += '</ul>';

            }

        } catch (error) {
            console.error('Error fetching word definition:', error);
            let html4 = "<ul>";
            html4 += `<li>${error.message}</li>`;
            html4 += "</ul>";
            mainBody.innerHTML += html4;
        }


        const HtMl1 = `<span><h4>Meaning :</h4> ${meaningsHTML}</span>`
            + shortdefHtml +
            `<span><h4>Pronunciations:</h4> ${pronunciations}</span>` +
            `<span><h4></h4> ${phoneticsHTML}</span>` +
            `<span><h4>Etymologies :</h4> ${et}</span>` +
            `<span><h4>Similar Words :</h4> ${similar_word}</span>` +
            `<span><h4>Antonyms:</h4> ${antonyms}</span>` +
            `<span><h4>Synonyms:</h4> ${synonyms}</span>` +
            `<span><h4>Related Words:</h4> ${relatedWords}</span>` +
            `<span><h4>Near Antonyms:</h4> ${nearAntonyms}</span>` +
            `<span><h4>Idiomatic Phrases:</h4> ${idiomaticPhrases}</span>` +
            `<span><h4>Concise Definitions:</h4> ${conciseDefinitions}</span>` +
            `<span><h4>Usage Examples:</h4> ${usageExamples}</span>` +
            `<span><h4>Illustrations:</h4> ${illustrations}</span>` +
            `<span><h4>Spelling Suggestions:</h4> ${spellingSuggestions}</span>` +
            `<span>${sourceHTML}</span>`;

        mainBody.innerHTML = wordHtml + HtMl1;

    } catch (error) {
        console.error('Error fetching word definition:', error);
    }
}
function showLoader() {
    document.querySelector(".loader").classList.add("vis_show");
    document.querySelector(".loader").classList.remove("vis_hidden");
}
hideLoader();
function hideLoader() {
    document.querySelector(".loader").classList.add("vis_hidden");
    document.querySelector(".loader").classList.remove("vis_show");
}

searchBtn.addEventListener("click", async () => {
    showLoader();
    await getWordDefinition(wordInput);
    hideLoader();
});

wordInput.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
        showLoader();
        await getWordDefinition(wordInput);
        hideLoader();
    }
});

const startRecordBtn = document.querySelector(".mic_img");

// Check for browser support
if (!('webkitSpeechRecognition' in window)) {
    alert('Your browser does not support speech recognition. Try Chrome.');
} else {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        wordInput.placeholder = 'Listening...';
        startRecordBtn.src = "/assets/CSS/images_icons/mic_fill.svg";
    };

    recognition.onresult = (event) => {
        let transcript = event.results[0][0].transcript;
        transcript = transcript.endsWith('.') ? transcript.slice(0, -1) : transcript;
        wordInput.value = transcript;
        getWordDefinition(wordInput);
    };

    recognition.onerror = (event) => {
        console.error(event.error);
        wordInput.placeholder = 'Error...';
    };

    recognition.onend = () => {
        wordInput.placeholder = 'Search...';
        startRecordBtn.src = "mic.svg";
    };

    startRecordBtn.addEventListener('click', () => {
        recognition.start();
    });
}


const searchBar = document.querySelector('.word');
const suggestionsList = document.getElementById('suggestions-list');
let words = [];

// Fetch the words from the server
fetch('http://localhost:3000/api/words')
    .then(response => response.json())
    .then(data => {
        words = data;
    })
    .catch(error => console.error('Error fetching data:', error));

// Add event listener to the search bar
searchBar.addEventListener('input', () => {
    const input = searchBar.value.toLowerCase();
    suggestionsList.innerHTML = '';

    if (input.length > 0) {
        const filteredSuggestions = words
            .filter(word => word.toLowerCase().startsWith(input))
            .slice(0, 10); // Limit to 10 suggestions

        filteredSuggestions.forEach(word => {
            const li = document.createElement('li');
            li.textContent = word;
            li.classList.add('list-group-item');

            li.addEventListener('click', () => {
                searchBar.value = word;
                suggestionsList.innerHTML = '';
                suggestionsList.style.display = 'none';
            });

            suggestionsList.appendChild(li);
        });

        suggestionsList.style.display = 'block';
    } else {
        suggestionsList.style.display = 'none';
    }
});

//Date and time

const dateAndTimeElement = document.querySelector('.dateandtime');


function updateDateAndTime() {
    const now = new Date();
    const date = now.toLocaleDateString('en-GB'); // Format: dd-mm-yyyy
    const time = now.toLocaleTimeString('en-GB'); // Format: HH:MM:SS
    dateAndTimeElement.textContent = `${date} | ${time}`;
}

// Update the date and time every second
setInterval(updateDateAndTime, 1000);

//quotes
function fetchQuote() {
    fetch('http://localhost:3000/api/facts')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            document.querySelector('.quote').textContent = `${data}`;
        })
        .catch(error => console.error('Error fetching quote:', error));
}

/// Fetch initial quote and random word on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchQuote();
    fetchRandomWord();
});

async function fetchRandomWord() {
    try {
        const wordInfoDiv = document.getElementById('word-info');
        const lastFetched = localStorage.getItem('lastFetched');
        const now = Date.now();

        if (lastFetched && now - lastFetched < 86400000) { // 86400000 ms in 24 hours
            const cachedWord = localStorage.getItem('cachedWord');
            const cachedDefinition = localStorage.getItem('cachedDefinition');
            if (cachedWord && cachedDefinition) {
                wordInfoDiv.innerHTML = cachedDefinition;
                // console.log("Using cached data:", cachedWord, cachedDefinition);
                return;
            }

                let wordDefinition = "";
                let word_new = "";
                let retryCount = 0;
                const maxRetries = 5;

                while (wordDefinition === "" && retryCount < maxRetries) {
                    const response = await fetch('http://localhost:3000/api/new_word');
                    const data = await response.json();

                    word_new = data.word;
                    console.log(`Fetched new word: ${word_new}`);

                    wordDefinition = await getWordDefinition_new(word_new);
                    console.log(`Fetched definition: ${wordDefinition}`);

                    retryCount++;

                    if (retryCount >= maxRetries && wordDefinition === "") {
                        console.error(`Failed to fetch a valid word definition after ${maxRetries} retries.`);
                        wordDefinition = "No definition found. Please try again later.";
                    }
                }

                wordInfoDiv.innerHTML = wordDefinition;
                console.log("Final word and definition:", word_new, wordDefinition);

                localStorage.setItem('lastFetched', now.toString());
                localStorage.setItem('cachedWord', word_new);
                localStorage.setItem('cachedDefinition', wordDefinition);
            }

    } catch (error) {
        console.error('Error fetching random word:', error);
    }
}


const now = new Date();
const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
const formattedDate = now.toLocaleDateString('en-GB', options);
document.querySelector(".today").innerHTML = `Today's Word (${formattedDate})`;
// Fetch initial random word on page load
document.addEventListener('DOMContentLoaded', fetchRandomWord);

async function getWordDefinition_new(wordInput) {
    console.log("ENTEred");
    if (wordInput === "") {
        console.log("Error Going");
        return "";
    }
    const KEY1 = "badf222b-e237-4b73-94ae-160dc8848ed9";
    const URL = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${wordInput}?key=${KEY1}`;
    const KEY2 = "c55d4532-924b-40b5-a51e-908fa7a09159";
    const URL1 = `https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${wordInput}?key=${KEY2}`;
    const URL3 = `https://api.dictionaryapi.dev/api/v2/entries/en/${wordInput}`;

    try {
        const response = await fetch(URL);
        const data = await response.json();
        console.log(data);


        if (!data.length) {
            return "";
        }


        let wordHtml = "";
            word_1 = wordInput.toUpperCase();
            wordHtml = `<i><h3>Word: ${word_1}</h3></i>`;


        let shortdefHtml = "";
        if (data[0] && data[0].shortdef) {
            shortdefHtml += ` <h4> Short Definition of ${wordInput}:</h4>` + `<ul>`;
            data[0].shortdef.forEach(definition => {
                shortdefHtml += `<li>${definition}</li>`;
            });
            shortdefHtml += `</ul>`;
        }


        let similar_word = '';

        if (data[0] && data[0].meta && data[0].meta.stems) {
            data[0].meta.stems.forEach((w, index) => {
                if (index > 0) {
                    similar_word += ', ';
                }
                similar_word += `${w}`;
            });
        }


        let et = "";
        if (data[0] && data[0].et) {
            et += '<ul>';
            if (data[0].et) {
                data[0].et.forEach(etymology => {
                    let et1 = replaceItWithI(etymology[1]);
                    et += `<li>${et1}</li>`;
                });
            }
            et += '</ul>';
        }
        let pronunciations = '';

        if (data[0] && data[0].hwi && data[0].hwi.prs) {
            pronunciations += '<ul>';
            data[0].hwi.prs.forEach(pr => {
                pronunciations += `<li>${pr.mw ? pr.mw : 'N/A'} ${pr.sound ?
                    `<audio controls src="https://media.merriam-webster.com/audio/prons/en/us/mp3/${pr.sound.audio[0]}/${pr.sound.audio}.mp3"></audio>` : ''}</li>`;
            });
            pronunciations += '</ul>';
        }

        let usageExamples = "";

        if (data[0] && data[0].def && data[0].def[0] && data[0].def[0].sseq) {
            usageExamples += '<ul>';
            data[0].def[0].sseq.forEach(seq => {
                seq.forEach(item => {
                    if (item[1] && item[1].dt) {
                        item[1].dt.forEach(dtItem => {
                            if (dtItem[0] === "vis" && dtItem[1]) {
                                dtItem[1].forEach(example => {
                                    usageExamples += `<li>${replaceItWithI(example.t)}</li>`;
                                });
                            }
                        });
                    }
                });
            });
            usageExamples += '</ul>';
        }

        // Illustrations
        let illustrations = '';
        if (data[0] && data[0].art) {
            illustrations += '<ul>'
            data[0].art.artref.forEach(art => {
                illustrations += `<li><img src="${art.artid}" alt="${art.alttext}"/></li>`;
            });
            illustrations += '</ul>'
        }


        let spellingSuggestions = "";

        if (data[0] && data[0].meta && data[0].meta.stems) {
            spellingSuggestions += '<ul>';
            data[0].meta.stems.forEach(suggestion => {
                spellingSuggestions += `<li>${suggestion}</li>`;
            });
            spellingSuggestions += '</ul>';
        }

        let htmlerror = "";
        if (data) {
            let htmlContent = `<strong>Similar : </Strong>`;
            data.forEach(d => {
                htmlContent += `${d}, `;
            });
            htmlerror = htmlContent.slice(0, -2); // Remove the trailing comma and space
        }

        // API2 - Thesaurus
        let synonyms = '';
        let antonyms = '';
        let relatedWords = '';
        let nearAntonyms = '';
        let idiomaticPhrases = '';
        let conciseDefinitions = '';
        let htmlerror1 = "";
        try {
            const response1 = await fetch(URL1);
            const data1 = await response1.json();
            console.log(data1);

            if (!data1.length) {
                return `<p>No Words found for "${wordInput.value}"</p>`;
            }
            if (data1[0].meta && data1[0].meta.syns) {
                data1[0].meta.syns.forEach(synList => {
                    synList.forEach((syn, index) => {
                        if (index > 0) {
                            synonyms += ', ';
                        }
                        synonyms += syn;
                    });
                });
            }

            // Antonyms
            if (data1[0].meta && data1[0].meta.ants) {
                data1[0].meta.ants.forEach(antList => {
                    antList.forEach((ant, index) => {
                        if (index > 0) {
                            antonyms += ', ';
                        }
                        antonyms += ant;
                    });
                });
            }

            // Related words
            if (data1[0].meta && data1[0].meta.rel) {
                data1[0].meta.rel.forEach(relList => {
                    relList.forEach((rel, index) => {
                        if (index > 0) {
                            relatedWords += ', ';
                        }
                        relatedWords += rel;
                    });
                });
            }

            // Near antonyms
            if (data1[0].meta && data1[0].meta.near) {
                data1[0].meta.near.forEach(nearList => {
                    nearList.forEach((near, index) => {
                        if (index > 0) {
                            nearAntonyms += ', ';
                        }
                        nearAntonyms += near;
                    });
                });
            }

            // Idiomatic phrases
            if (data1[0].def && data1[0].def[0] && data1[0].def[0].sseq) {
                data1[0].def[0].sseq.forEach(seq => {
                    seq.forEach(item => {
                        if (item[1] && item[1].dt) {
                            item[1].dt.forEach(dtItem => {
                                if (dtItem[0] === "phrase" && dtItem[1]) {
                                    idiomaticPhrases += `<li>${replaceItWithI(dtItem[1])}</li>`;
                                }
                            });
                        }
                    });
                });
            }

            // Concise definitions
            if (data1[0].shortdef) {
                conciseDefinitions = `<ul>`;
                data1[0].shortdef.forEach(definition => {
                    conciseDefinitions += `<li>${definition}</li>`;
                });
                conciseDefinitions += `</ul>`;
            }


            if (data1) {
                let htmlContent = `<div><strong>Similar : </Strong>`;
                data1.forEach(d => {
                    htmlContent += `${d}, `;
                });
                htmlerror1 = htmlContent.slice(0, -2); // Remove the trailing comma and space
                htmlerror1 += `</div>`;
            }

        } catch (error) {
            console.error('Error fetching Words:', error);
        }


        // API3 - Dictionary
        let meaningsHTML = '';
        let phoneticsHTML = '';
        let sourceHTML = '';

        try {
            const response3 = await fetch(URL3);
            const data3 = await response3.json();
            console.log(data3);

            if (data3.length === 0 || data3.message) {
                // Display the no definitions found message
                // let html4 = htmlerror1 + htmlerror + "<ul>";
                // html4 += `<li><strong>${data3.title}</strong></li>`;
                // html4 += `<li>${data3.message}</li>`;
                // html4 += `<li>${data3.resolution}</li>`;
                // html4 += "</ul>";
                return "";
            }

            if (data3[0] && data3[0].meanings) {
                data3[0].meanings.forEach(meaning => {
                    meaningsHTML += `<h4>Part of Speech: ${meaning.partOfSpeech}</h4>`;
                    meaningsHTML += '<ul>';
                    meaning.definitions.forEach(def => {
                        meaningsHTML += `<li>Definition: ${def.definition}</li>`;
                    });
                    meaningsHTML += '</ul>';
                });
            }

            if (data3[0] && data3[0].phonetics) {
                phoneticsHTML = '<h4>Phonetics:</h4><ul>';
                data3[0].phonetics.forEach(phonetic => {
                    phoneticsHTML += `<li>Text: ${phonetic.text ? phonetic.text : 'N/A'}, Audio: ${phonetic.audio ? `<audio controls src="${phonetic.audio}"></audio>` : 'N/A'}</li>`;
                });
                phoneticsHTML += '</ul>';
            }

            if (data3[0] && data3[0].sourceUrls) {
                sourceHTML = '<h4>Source URLs:</h4><ul>';
                data3[0].sourceUrls.forEach(url => {
                    sourceHTML += `<li><a href="${url}" target="_blank">${url}</a></li>`;
                });
                sourceHTML += '</ul>';

            }

        } catch (error) {
            console.error('Error fetching word definition:', error);
            let html4 = "";
            // html4 += `<li>${error.message}</li>`;
            // html4 += "</ul>";
            return html4;
        }


        const HtMl1 = `<span><h4>Meaning :</h4> ${meaningsHTML}</span>`
            + shortdefHtml +
            `<span><h4>Pronunciations:</h4> ${pronunciations}</span>` +
            `<span><h4></h4> ${phoneticsHTML}</span>` +
            `<span><h4>Etymologies :</h4> ${et}</span>` +
            `<span><h4>Similar Words :</h4> ${similar_word}</span>` +
            `<span><h4>Antonyms:</h4> ${antonyms}</span>` +
            `<span><h4>Synonyms:</h4> ${synonyms}</span>` +
            `<span><h4>Related Words:</h4> ${relatedWords}</span>` +
            `<span><h4>Near Antonyms:</h4> ${nearAntonyms}</span>` +
            `<span><h4>Idiomatic Phrases:</h4> ${idiomaticPhrases}</span>` +
            `<span><h4>Concise Definitions:</h4> ${conciseDefinitions}</span>` +
            `<span><h4>Usage Examples:</h4> ${usageExamples}</span>` +
            `<span><h4>Illustrations:</h4> ${illustrations}</span>` +
            `<span><h4>Spelling Suggestions:</h4> ${spellingSuggestions}</span>` +
            `<span>${sourceHTML}</span>`;

        return wordHtml + HtMl1;

    } catch (error) {
        console.error('Error fetching word definition:', error);
    }
}