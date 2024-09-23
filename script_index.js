document.getElementById('start-game').addEventListener('click', function() {
    const fontSize = document.getElementById('font-size').value + 'px';
    const language = document.getElementById('language').value;
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a file first.');
        return;
    }
    
    localStorage.setItem('fontSize', fontSize);
    localStorage.setItem('language', language);

    const reader = new FileReader();
    reader.onload = function(e) {
        const data = e.target.result;
        sessionStorage.setItem('fileContent', data);
        window.location.href = 'game.html';
    };
    reader.readAsText(file);
});