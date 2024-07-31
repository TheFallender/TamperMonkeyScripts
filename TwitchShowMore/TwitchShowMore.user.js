// ==UserScript==
// @name         Twitch Show More
// @author       TheFallender
// @version      1.9.4
// @description  A script that will show all your streammers and hide the bloat
// @homepageURL  https://github.com/TheFallender/TamperMonkeyScripts
// @updateURL    https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/TwitchShowMore/TwitchShowMore.user.js
// @downloadURL  https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/TwitchShowMore/TwitchShowMore.user.js
// @supportURL   https://github.com/TheFallender/TamperMonkeyScripts
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?domain=twitch.tv
// @license      MIT
// @copyright    Copyright © 2024 TheFallender
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    //Main selector for the show more
    const followedChannelsSelector = 'div.side-nav-show-more-toggle__button button';

    // Sleep method for easier use
    function sleep (msTime) {
        return new Promise(r => setTimeout(r, msTime));
    }

    //Method to wait for an element in the DOM
    function waitForElement(selector) {
        return new Promise(resolve => {
            //Return the element if it is already in the DOM
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            //Wait for the element to be in the DOM
            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            //Observer settings
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    //Remove the side nav bloat
    function removeBloat () {
        const body = document.querySelector("body");
        const observer = new MutationObserver(mutations => {
            //Wait until the followed channel button is loaded
            waitForElement(followedChannelsSelector).then(async (element) => {
                //Assign the show more element to the one it waited for
                let showMoreElement = element;

                //Loop until the Toggle doesn't have the "Show More" text
                for (; showMoreElement && showMoreElement.textContent == "Show More"; showMoreElement = document.querySelector(followedChannelsSelector)) {
                    showMoreElement.click();
                    await sleep(100);
                }

                //Hide the show more/show less button
                showMoreElement.setAttribute('style', 'display: none !important');
            });
        });
        observer.observe(body, { childList: true, subtree: true });
    }

    removeBloat();
})();
