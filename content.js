// content.js
function generateSelector(element) {
    const selectorPath = [];
    while (element && element.nodeType === Node.ELEMENT_NODE) {
        let selector = element.nodeName.toLowerCase();
        if (element.id) {
            selector = `#${element.id}`;
            selectorPath.unshift(selector);
            break;
        } else {
            let sibling = element;
            let nth = 1;
            while (sibling.previousElementSibling) {
                sibling = sibling.previousElementSibling;
                if (sibling.nodeName === element.nodeName) nth++;
            }
            if (nth > 1) selector += `:nth-of-type(${nth})`;
        }
        selectorPath.unshift(selector);
        element = element.parentNode;
    }
    return selectorPath.join(' > ');
}

document.addEventListener('click', (e) => {
    const action = {
        type: 'click',
        selector: generateSelector(e.target),
        timestamp: Date.now(),
        url: window.location.href,
        text: e.target.textContent?.trim()
    };
    
    chrome.runtime.sendMessage({
        type: 'ACTION_RECORDED',
        action
    });
});

document.addEventListener('input', (e) => {
    const action = {
        type: 'fill',
        selector: generateSelector(e.target),
        value: e.target.value,
        timestamp: Date.now(),
        url: window.location.href
    };
    
    chrome.runtime.sendMessage({
        type: 'ACTION_RECORDED',
        action
    });
});
