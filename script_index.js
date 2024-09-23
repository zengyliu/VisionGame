document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('file-input');
    const fileButton = document.getElementById('file-button');

    // 设置默认按钮文本
    fileButton.textContent = 'Choose File';

    // 当用户点击按钮时，触发文件选择
    fileButton.addEventListener('click', function() {
        fileInput.click();
    });

    // 当用户选择文件时，更新按钮文本
    fileInput.addEventListener('change', function() {
        const fileName = fileInput.files[0] ? fileInput.files[0].name : 'words.txt';
        fileButton.textContent = `${fileName}`;
    });
});

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