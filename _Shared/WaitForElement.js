// A shared resource that should be used by all scripts
// It will wait for an element to be in the DOM


//Method to wait for an element in the DOM
function waitForElement(selector, callback = null, selectorAll = false, shouldDisconnect = true) {
    return new Promise(resolve => {
        //Return the element if it is already in the DOM
        if (!selectorAll) {
            const element = document.querySelector(selector);
            if (element) {
                if (shouldDisconnect) {
                    resolve(element);
                } else {
                    callback(element);
                }
            }
        } else {
            let elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                elements = Array.from(elements);
                if (shouldDisconnect) {
                    resolve(elements);
                } else {
                    callback(elements);
                }
            }
        }

        //Wait for the element to be in the DOM
        const observer = new MutationObserver(mutations => {
            if (!selectorAll) {
                const element = document.querySelector(selector);
                if (element) {
                    if (shouldDisconnect) {
                        resolve(element);
                        observer.disconnect();
                    } else {
                        callback(element);
                    }
                }
            } else {
                const element = document.querySelectorAll(selector);
                if (element.length > 0) {
                    if (shouldDisconnect) {
                        resolve(element);
                        observer.disconnect();
                    } else {
                        callback(element);
                    }
                }
            }
        });

        //Observer settings
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}