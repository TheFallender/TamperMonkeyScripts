// ==UserScript==
// @name         Youtube Shorts - Remove from WH
// @author       TheFallender
// @version      1.0
// @description  This script will remove all the Shorts watched in your watch history.
// @homepageURL  https://github.com/TheFallender/TamperMonkeyScripts
// @updateURL    https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/YoutubeShortsRemoveWH/YoutubeShortsRemoveWH.user.js
// @downloadURL  https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/YoutubeShortsRemoveWH/YoutubeShortsRemoveWH.user.js
// @supportURL   https://github.com/TheFallender/TamperMonkeyScripts
// @match        https://www.youtube.com/feed/history
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
    const timeBetweenWaits = 1000;

    // Iterations limit
    const iterationsLimit = -1;

    // Selector items
    const selShortsSelf = "ytd-reel-shelf-renderer";
    const selShorts = "div#menu.ytd-reel-item-renderer > ytd-menu-renderer > yt-icon-button > button";
    const selMenuRemove = "div.tp-yt-iron-dropdown ytd-menu-service-item-renderer";
    const selPostToasts = "tp-yt-paper-toast#toast";

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
    waitForElement(selShorts).then(async (element) => {
        // Wait a couple of seconds to make sure everything is loaded
        await sleep(3000);

        // Iteration limit
        for (let iterations = 0; iterations != iterationsLimit; iterations++) {
            // Get the first short shelf
            let shortsSelf = document.querySelector(selShortsSelf);
            // Scroll if not found
            if (shortsSelf == null) {
                // Scroll to the bottom to force a refresh
                window.scrollTo(0, document.documentElement.scrollHeight);
                await sleep(3000);
                shortsSelf = document.querySelector(selShortsSelf);
            }

            // Scroll to this list
            window.scrollTo(0, shortsSelf.getBoundingClientRect().top);
            await sleep(250);

            // Get the shorts list
            let shortsList = shortsSelf.querySelectorAll(selShorts);
            for (let i = 0; i < shortsList.length; i++) {
                // Click button to show toast
                shortsList[i].click();
                await sleep(250);

                // Click on the remove on the toast
                let shortMenu = document.querySelectorAll(selMenuRemove);
                for (let j = 0; j < shortMenu.length; j++) {
                    if (shortMenu[j].textContent.toLowerCase().includes('remove')) {
                        shortMenu[j].click();
                        break;
                    }
                }

                // Wait the time for the next element
                await sleep(timeBetweenWaits);
            }

            // Remove the list
            shortsSelf.remove()
        }

        location.reload();
    });
})();
