const fontSize = localStorage.getItem('fontSize') || '16px';
const language = localStorage.getItem('language') || 'en';
const maxRoundCount = 30;

document.documentElement.style.setProperty('--font-size', fontSize);

let words = [];
let currentWordIndex = 0;
let score = 0;
let totalCharNum = 0;
let alignedCharNum = 0;
let roundCount = 0;

// Create a <style> element
const style = document.createElement('style');
style.innerHTML = `
     body {
        background-color: black; /* Set background color to black */
        color: white; /* Set font color to white */
    }
     .letter-spacing {
        margin-right: 60px; /* Adjust the value as needed */
    }
   
    @media screen and (-webkit-min-device-pixel-ratio:0) {
    /* Chrome, Safari 和 Opera */
        body {
            font-smooth: never;
            -webkit-font-smoothing: none;
        }
    }

    #word-display {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 68vh; /* Full viewport height */
        font-size: var(--font-size);
       /* font-weight: bold;*/
        font-family: 'Arial', sans-serif; /* 使用清晰的字体 */
        font-smooth: always; /* 非标准属性，用于字体平滑 */
        -moz-osx-font-smoothing: grayscale; /* Firefox 专用属性，适用于 macOS */
        -webkit-font-smoothing: antialiased; /* WebKit 浏览器专用属性，用于字体平滑 */
    }
    #word-display span {
        display: inline-block;
        letter-spacing: 40px;
    }
`;

document.head.appendChild(style);

function loadWords(event) {
    const fileContent = sessionStorage.getItem('fileContent');
    if (!fileContent) {
        alert('No file content found.');
        return;
    }
     // Ensure the file content is correctly decoded
     const decoder = new TextDecoder('utf-8');
     const decodedContent = decoder.decode(new TextEncoder().encode(fileContent));
 
    words = fileContent.split(/\s+/).filter(word => word.trim());

    if (words.length > maxRoundCount) {
        const selectedWords = [];
        const oddIndices = Array.from({ length: Math.floor(words.length / 2) }, (_, i) => 2 * i);
        
        for (let i = 0; i < 15; i++) {
            const randomIndex = Math.floor(Math.random() * oddIndices.length);
            const oddIndex = oddIndices.splice(randomIndex, 1)[0];
            
            selectedWords.push(words[oddIndex]);
            if (oddIndex + 1 < words.length) {
                selectedWords.push(words[oddIndex + 1]);
            }
        }
        
        words = selectedWords;
    }

    displayWord();
}

function displayWord() {
    if (currentWordIndex >= words.length) {
        currentWordIndex = 0;
    }

    const word = words[currentWordIndex].toUpperCase();
    const letters = word.split('');

    const wordDisplay = document.getElementById('word-display');
    wordDisplay.innerHTML = '';

    let randomOffsets = [];

    // Generate random offsets for each letter
    randomOffsets[0] = 0;
    for (let i = 1; i < letters.length; i++) {
        randomOffsets[i] = Math.floor(Math.random() * 1.4);
        if (randomOffsets[i] == 0) {
            randomOffsets[i] = 1;
        }
        if (Math.random() > 0.5) {
            randomOffsets[i] *= -1;
        }
    }

    for (let i = 0; i < letters.length; i++) {
        const span = document.createElement('span');
        span.textContent = letters[i];
        span.style.position = 'relative';
        span.style.top = `${randomOffsets[i]}mm`;
        if (i > 0) {
            span.addEventListener('click', () => adjustLetter(i));
        }
        wordDisplay.appendChild(span);
    }

    updateRoundCount();
}

function adjustLetter(index) {
    const spans = document.querySelectorAll('#word-display span');
    const firstLetterOffset = parseInt(getComputedStyle(spans[0]).getPropertyValue('top').replace('mm', ''));
    const letterOffset = parseInt(getComputedStyle(spans[index]).getPropertyValue('top').replace('mm', ''));

    let maxStep = Math.abs(letterOffset - firstLetterOffset);
    let step = Math.min(Math.floor(Math.random() * 3) + 2, maxStep/4);
    if (step <= 1){
        step = 0;
    }
    
    if (letterOffset < firstLetterOffset) {
        // If the letter is above the first letter, move it down
        spans[index].style.top = `${firstLetterOffset + step}mm`;
    } else {
        // If the letter is below the first letter, move it up
        spans[index].style.top = `${firstLetterOffset - step}mm`;
    }
}

function toggleLowercase() {
    const wordDisplay = document.getElementById('word-display').textContent.toLowerCase();
    const lowercaseDisplay = document.getElementById('lowercase-display');

    if (lowercaseDisplay.style.display === 'none') {
        lowercaseDisplay.textContent = wordDisplay;
        lowercaseDisplay.style.display = 'block';
    } else {
        lowercaseDisplay.style.display = 'none';
    }
}

function updateRoundCount() {
    roundCount++;
    document.getElementById('round-count').textContent = `${roundCount}/${maxRoundCount}`;

    if (roundCount === maxRoundCount) {
        score = Math.ceil(alignedCharNum*100/totalCharNum);
        localStorage.setItem('score', score);
        window.location.href = 'result.html';
    }
}

function displayNextWord() {

    const spans = document.querySelectorAll('#word-display span');
    let allAligned = true;

    for (let i = 1; i < spans.length; i++) {
        if (spans[i].style.top !== spans[0].style.top) {
            allAligned = false;
            break;
        }
    }
    
    totalCharNum += words[currentWordIndex].length
    if (allAligned) {
        alignedCharNum += words[currentWordIndex].length;
    }
    currentWordIndex++;
    displayWord();
}

document.addEventListener('DOMContentLoaded', function() {
    // 其他代码...

    // 为退出按钮添加事件监听器
    document.getElementById('exit-game').addEventListener('click', function() {
        window.location.href = 'index.html';
    });
});

document.getElementById('show-lowercase').addEventListener('click', toggleLowercase);
document.getElementById('next-word').addEventListener('click', displayNextWord);

loadWords();