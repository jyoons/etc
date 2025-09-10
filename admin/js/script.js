// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initFileUpload();
    initPlayButtons();
    initLogout();
});

// Logout Function
function initLogout() {
    const logoutBtn = document.querySelector('.logout-btn');
    
    logoutBtn.addEventListener('click', function() {
        if (confirm('정말 로그아웃 하시겠습니까?')) {
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    });
}

// File Upload Function
function initFileUpload() {
    const fileInput = document.getElementById('file-upload');
    const fileInputText = document.querySelector('.file-input-text');
    
    if (fileInput && fileInputText) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                fileInputText.textContent = file.name;
                fileInputText.style.color = '#333333';
            } else {
                fileInputText.textContent = '파일을 선택하세요';
                fileInputText.style.color = '#999999';
            }
        });
        
        // File input display click handler
        const fileInputDisplay = document.querySelector('.file-input-display');
        if (fileInputDisplay) {
            fileInputDisplay.addEventListener('click', function() {
                fileInput.click();
            });
        }
    }
}

// Play Button Function
function initPlayButtons() {
    const playButtons = document.querySelectorAll('.play-btn');
    
    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            const isPlaying = this.classList.contains('paused');
            
            if (isPlaying) {
                this.classList.remove('paused');
                this.classList.add('play');
            } else {
                this.classList.remove('play');
                this.classList.add('paused');
            }
        });
    });
}
