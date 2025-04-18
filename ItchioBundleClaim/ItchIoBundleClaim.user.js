// ==UserScript==
// @name         Itch.io Bundle Claim
// @author       TheFallender
// @version      1.5.3
// @description  This script will claim all the items in a bundle slowly, without sending too many requests to the website
// @homepageURL  https://github.com/TheFallender/TamperMonkeyScripts
// @updateURL    https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/ItchioBundleClaim/ItchIoBundleClaim.user.js
// @downloadURL  https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/ItchioBundleClaim/ItchIoBundleClaim.user.js
// @supportURL   https://github.com/TheFallender/TamperMonkeyScripts
// @match        https://itch.io/bundle/download/*
// @match        https://*.itch.io/*/download/*
// @icon         https://www.google.com/s2/favicons?domain=itch.io
// @license      MIT
// @copyright    Copyright © 2024 TheFallender
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    //Wait time: Time to wait between changes.
    //Let me suggest against changing this setting to a lower value as it
    //will saturate Itch.io and probably give a headache to the owner,
    //do not DDOS the site if just because you cannot wait. ty
    const timeBetweenWaits = 2000;

    //Next button selector
    let nextButtonSelector = "a.next_page.button"

    //Filter options load
    let filterOptionsSelector = "div.filter_options > div > a.button"

    //Game row selector
    let gameRowSelector = "button[value='claim']"

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

    //Timeout for each transition
    setTimeout(function () {
        //Detect if the current URL belongs to a bundle
        if (window.location.href.includes("https://itch.io/bundle/download/")) {
            //Wait until the game rows are loaded
            waitForElement(filterOptionsSelector).then((element) => {
                //Game list
                let gameRow = document.querySelector(gameRowSelector);
                //Check if there are claimable games
                if (gameRow) {
                    //Keep claiming the first on the list
                    gameRow.click();
                } else {
                    //Go to the next page if there are no gamerows
                    let nextPageLink = document.querySelector(nextButtonSelector);
                    if (nextPageLink) {
                        nextPageLink.click();
                    }
                }
            });
        } else if (window.location.href.match(/.*\.itch\.io\/.*\/download\/.*/g).length == 1) {
            //Inside an item page, go back to the bundle
            window.history.back();
        }
    }, timeBetweenWaits + Math.floor(Math.random() * 1001) - 500);
})();