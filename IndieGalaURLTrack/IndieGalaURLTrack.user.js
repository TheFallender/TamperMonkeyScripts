// ==UserScript==
// @name         IndieGala Remove URL Trackers from Links
// @author       TheFallender
// @version      1.0.1
// @description  Remove tracking parameters from URLs in a tags
// @homepageURL  https://github.com/TheFallender/TamperMonkeyScripts
// @updateURL    https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/IndieGalaURLTrack/IndieGalaURLTrack.user.js
// @downloadURL  https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/IndieGalaURLTrack/IndieGalaURLTrack.user.js
// @supportURL   https://github.com/TheFallender/TamperMonkeyScripts
// @match        https://isthereanydeal.com/*
// @icon         https://www.google.com/s2/favicons?domain=isthereanydeal.com
// @license      MIT
// @copyright    Copyright © 2024 TheFallender
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    //Main selector for the Links
    const linksToGiveAways = 'a.lg';

    // Links that will be replaced
    const domainsToReplace = [
        "adtraction.com",
        "jdoqocy.com",
    ];

    //Method to wait for an element in the DOM
    function waitForElement(selector, selectorAll = false) {
        return new Promise(resolve => {
            //Return the element if it is already in the DOM
            if (!selectorAll) {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                }
            } else {
                const element = document.querySelectorAll(selector);
                if (element.length > 0) {
                    resolve(element);
                }
            }

            //Wait for the element to be in the DOM
            const observer = new MutationObserver(mutations => {
                if (!selectorAll) {
                    const element = document.querySelector(selector);
                    if (element) {
                        resolve(element);
                        observer.disconnect();
                    }
                } else {
                    const element = document.querySelectorAll(selector);
                    if (element.length > 0) {
                        resolve(element);
                        observer.disconnect();
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

    // Function to extract the destination URL from the tracking URL
    function extractUrl(url) {
        // Check if it matches the domains to replace
        if (!domainsToReplace.some(domain => url.includes(domain))) {
            return null;
        }

        // Turn the URL to lower case
        const urlToMatch = url.toLowerCase();

        // Match all the URLs with the limit of & or /
        const match = urlToMatch.match("url=([^/&]+)");
        if (match) {
            return decodeURIComponent(match[1]);
        }

        // No match found
        return null;
    }

    // Wait until the links are ready
    waitForElement(linksToGiveAways, true).then((links) => {
        Array.from(links).forEach((link) => {
            const newUrl = extractUrl(link.getAttribute('href'));
            if (newUrl !== null) {
                link.setAttribute('href', newUrl);
            }
        });
    });
})();
