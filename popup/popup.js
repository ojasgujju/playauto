// popup/popup.js
document.addEventListener('DOMContentLoaded', () => {
    const journeyList = document.getElementById('journeyList');
    
    document.getElementById('startRecording').addEventListener('click', async () => {
        await chrome.runtime.sendMessage({type: 'START_RECORDING'});
        updateStatus('Recording...');
    });

    document.getElementById('stopRecording').addEventListener('click', async () => {
        await chrome.runtime.sendMessage({type: 'STOP_RECORDING'});
        updateStatus('Recording stopped');
        loadJourneys();
    });

    // Replace inline onclick handlers with proper event listeners
    async function handleExportClick(journeyId) {
        const data = await chrome.storage.local.get('journeys');
        const journey = data.journeys.find(j => j.id === journeyId);
        if (journey) {
            exportJourney(journey);
        }
    }

    // Modified loadJourneys function
    async function loadJourneys() {
        const data = await chrome.storage.local.get('journeys');
        const journeys = data.journeys || [];
        journeyList.innerHTML = '';
        
        journeys.forEach(journey => {
            const div = document.createElement('div');
            div.className = 'journey-item';
            
            const span = document.createElement('span');
            span.textContent = `Journey ${new Date(journey.timestamp).toLocaleString()}`;
            
            const button = document.createElement('button');
            button.textContent = 'Export Test';
            button.addEventListener('click', () => handleExportClick(journey.id));
            
            div.appendChild(span);
            div.appendChild(button);
            journeyList.appendChild(div);
        });
    }

    // Initial load
    loadJourneys();
});
