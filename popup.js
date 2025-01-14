// popup.js
const startBtn = document.getElementById('startRecording');
const stopBtn = document.getElementById('stopRecording');
const generateBtn = document.getElementById('generateTests');

let isRecording = false;

function updateButtonStates() {
  startBtn.disabled = isRecording;
  stopBtn.disabled = !isRecording;
  startBtn.textContent = isRecording ? 'Recording...' : 'Start Recording';
  startBtn.style.backgroundColor = isRecording ? '#ff4444' : '#4CAF50';
}

startBtn.addEventListener('click', () => {
  isRecording = true;
  updateButtonStates();
  chrome.runtime.sendMessage({ action: 'startRecording' });
});

stopBtn.addEventListener('click', () => {
  isRecording = false;
  updateButtonStates();
  chrome.runtime.sendMessage({ action: 'stopRecording' });
});

generateBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'generateTests' });
});

// Initialize button states
updateButtonStates();