// ==UserScript==
// @name         Youtube Real Links
// @author       TheFallender
// @version      1.0.1
// @description  Will replace the links with the actual content, not the Youtube Redirect
// @homepageURL  https://github.com/TheFallender/TamperMonkeyScripts
// @updateURL    https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/YoutubeRealLinks/YoutubeRealLinks.user.js
// @downloadURL  https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/YoutubeRealLinks/YoutubeRealLinks.user.js
// @supportURL   https://github.com/TheFallender/TamperMonkeyScripts
// @match        https://www.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @license      MIT
// @copyright    Copyright © 2024 TheFallender
// @grant        none
// ==/UserScript==


(function () {
    'use strict';

    // Selectors
    const descriptionLinksSel = '#description-inline-expander .yt-core-attributed-string__link';
    const descriptionExpandedLinksSel = '#description-inline-expander[is-expanded] .yt-core-attributed-string__link';

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
                const element = document.querySelectorAll(selector);
                if (element.length > 0) {
                    if (shouldDisconnect) {
                        resolve(element);
                    } else {
                        callback(element);
                    }
                }
            }

            //Wait for the element to be in the DOM
            const observer = new MutationObserver(mutations => {
                if (oldHref !== document.location.href) {
                    resolve([]);
                    observer.disconnect();
                }
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

    //Links replacement
    function replaceLinks(elements) {
        Array.from(elements).forEach((element) => {
            const elemURL = new URL(element.href);
            if (!elemURL.hostname.includes('youtube.com') || elemURL.pathname !== '/redirect') {
                // No redirect or no youtube, skip
                return;
            }
            const urlParams = new URLSearchParams(elemURL.search);
            const redirectURL = urlParams.get('q');

            if (redirectURL) {
                element.href = decodeURIComponent(redirectURL);
            }
        });
    }

    // Page change detection
    let oldHref = "";
    function pageChangeCheck() {
        if (oldHref !== document.location.href) {
            if (new URL(document.location.href).pathname === '/watch') {
                waitForElement(descriptionLinksSel, null, true, true).then((elements) => replaceLinks(elements));
                waitForElement(descriptionExpandedLinksSel, null, true, true).then((elements) => replaceLinks(elements));
            }
        }
    }

    pageChangeCheck();
    setInterval(pageChangeCheck, 3000);
})();
