class EventRecorder {
    constructor() {
      this.recording = false;
      this.events = [];
      this.setupListeners();
    }
  
    setupListeners() {
      document.addEventListener('click', this.handleClick.bind(this), true);
      document.addEventListener('input', this.handleInput.bind(this), true);
      document.addEventListener('change', this.handleChange.bind(this), true);
    }
  
    startRecording() {
      this.recording = true;
      this.events = [];
      console.log('Started recording');
    }
  
    stopRecording() {
      this.recording = false;
      console.log('Stopped recording');
      return this.events;
    }
  
    handleClick(event) {
      if (!this.recording) return;
      
      const element = event.target;
      const selector = this.generateSelector(element);
      
      this.events.push({
        type: 'click',
        selector,
        timestamp: Date.now(),
        url: window.location.href
      });
    }
  
    handleInput(event) {
      if (!this.recording) return;
      
      const element = event.target;
      const selector = this.generateSelector(element);
      
      this.events.push({
        type: 'input',
        selector,
        value: element.value,
        timestamp: Date.now(),
        url: window.location.href
      });
    }
  
    handleChange(event) {
      if (!this.recording) return;
      
      const element = event.target;
      const selector = this.generateSelector(element);
      
      this.events.push({
        type: 'change',
        selector,
        value: element.value,
        timestamp: Date.now(),
        url: window.location.href
      });
    }
  
    generateSelector(element) {
      if (element.id) {
        return `#${element.id}`;
      }
      
      if (element.className) {
        const classes = Array.from(element.classList).join('.');
        return `.${classes}`;
      }
      
      let path = [];
      let current = element;
      
      while (current.parentElement) {
        let index = Array.from(current.parentElement.children)
          .filter(child => child.tagName === current.tagName)
          .indexOf(current) + 1;
        
        path.unshift(`${current.tagName.toLowerCase()}:nth-child(${index})`);
        current = current.parentElement;
      }
      
      return path.join(' > ');
    }
  }
  
  const recorder = new EventRecorder();
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
      case 'startRecording':
        recorder.startRecording();
        break;
      case 'stopRecording':
        const events = recorder.stopRecording();
        chrome.runtime.sendMessage({ 
          action: 'recordingStopped',
          events 
        });
        break;
    }
  });