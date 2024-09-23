
const score = localStorage.getItem('score') || 0;

const resultMessage = document.getElementById('result-message');
if (parseInt(score) > 60) {
    resultMessage.textContent = `Congratulations! Your score is ${score}`;
} else {
    resultMessage.textContent = `Keep up the good work! Your score is ${score}`;
}

document.getElementById('continue-game').addEventListener('click', () => {
    localStorage.removeItem('score');
    window.location.href = 'index.html';
});

