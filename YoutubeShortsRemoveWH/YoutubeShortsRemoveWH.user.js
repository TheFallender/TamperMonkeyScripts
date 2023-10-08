// ==UserScript==
// @name         Youtube Shorts - Remove from WH
// @author       TheFallender
// @version      1.2.0
// @description  This script will remove all the Shorts watched in your watch history.
// @homepageURL  https://github.com/TheFallender/TamperMonkeyScripts
// @updateURL    https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/YoutubeShortsRemoveWH/YoutubeShortsRemoveWH.user.js
// @downloadURL  https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/YoutubeShortsRemoveWH/YoutubeShortsRemoveWH.user.js
// @match        https://*.youtube.com/feed/history
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @license      MIT
// @copyright    Copyright © 2023 TheFallender
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @require      http://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Wait time: Time to wait between changes.
    const timeBetweenWaits = 500;

    // Iterations limit
    const iterationsLimit = -1;

    // Selector items
    const waitUntilReadySelector = "button#button.yt-icon-button[aria-label='Notifications']";

    // Classic Shorts
    const selShorts = "ytd-video-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style='SHORTS'])"
    const selShortsButton = "button[aria-label='Remove from watch history']";

    // Shorts on shelfs
    const selShortsSelf = "ytd-reel-shelf-renderer:has(> div#title-container)";
    const selShortsSelfHamburgerMenu = "div#menu.ytd-reel-item-renderer > ytd-menu-renderer > yt-icon-button#button > button";
    const selMenuRemove = "div.tp-yt-iron-dropdown ytd-menu-service-item-renderer";

    // Method to wait for an element in the DOM
    function waitForElement(selector) {
        return new Promise(resolve => {
            // Return the element if it is already in the DOM
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            // Wait for the element to be in the DOM
            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            // Observer settings
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    // Sleep method for easier use
    function sleep (msTime) {
        return new Promise(r => setTimeout(r, msTime));
    }

    // Wait until the shorts are loaded, if there are none
    // the script will be stalled here
    waitForElement(waitUntilReadySelector).then(async (element) => {
        // Iteration limit
        for (let iterations = 0; iterations != iterationsLimit; iterations++, await sleep(3000), window.scrollBy(0, 750)) {
            console.log(`Iteration: ${iterations}`);

            // Get the first short shelf
            let shortsSelf = document.querySelectorAll(selShortsSelf);
            console.log(`ShortsSelf: ${shortsSelf.length}`);

            // Shorts
            let shorts = document.querySelectorAll(selShorts);
            console.log(`Shorts: ${shorts.length}`);

            // Scroll if not found
            if (shortsSelf.length == 0 && shorts.length == 0) {
                continue;
            }

            // Clean the shorts list
            for (let i = 0; i < shorts.length; i++) {
                let short = shorts[i];

                // Click the button to delete it from the watch history
                short.querySelector(selShortsButton)?.click();

                // Remove the short
                short.remove();

                // Wait the time for the next short
                await sleep(timeBetweenWaits);
            }

            // Loop through the shorts shelf
            for (let i = 0; i < shortsSelf.length; i++) {
                // Get the shorts
                let shortsSelfList = shortsSelf[i].querySelectorAll(selShortsSelfHamburgerMenu);

                // Go to each menu and remove it
                for (let i = 0; i < shortsSelfList.length; i++) {
                    // Click the button to show the toast
                    shortsSelfList[i].click();
                    await sleep(250);

                    // Click on the remove on the toast
                    let shortMenu = document.querySelectorAll(selMenuRemove);

                    // Find the remove button
                    let removeButton = shortMenu.find((menuItem) => {
                        if (menuItem.textContent.toLowerCase().includes('remove')) {
                            return true;
                        }
                    });

                    // Click the button
                    removeButton.click();

                    // Wait the time for the next short
                    await sleep(timeBetweenWaits);
                }

                // Remove the shelf
                shortsSelf[i].remove();
            }
        }

        location.reload();
    });
})();
