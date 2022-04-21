// ==UserScript==
// @name         Twitch Show More
// @author       TheFallender
// @version      1.5
// @description  A script that will show all your streammers and hide the bloat
// @homepageURL  https://github.com/TheFallender/TamperMonkeyScripts
// @updateURL    https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/TwitchShowMore/TwitchShowMore.user.js
// @downloadURL  https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/TwitchShowMore/TwitchShowMore.user.js
// @supportURL   https://github.com/TheFallender/TamperMonkeyScripts
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?domain=twitch.tv
// @license      MIT
// @copyright    Copyright © 2021 TheFallender
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    //Search wait
    const promiseWait = [
        //ms to wait
        100,
        //Times to perform the search before giving up
        100
    ]

    //Main selector for the show more
    const selector = '[aria-label="Followed Channels"] > div > Button';

    //Side Nav Bloat
    const sideNavBloatRemove = true;
    const sideNavBloat = [
        'div.side-nav-section[aria-label="Recommended Channels"]',
        'div.side-nav-section[aria-label*="viewers"]',
        'div.side-nav-search-input',
        'div.find-me'
    ];

    window.onload = async function() {
        //Show more button variable
        let showMoreElement = null;

        //Wait until the page is fully loaded and it's able to get the element
        for (let i = 0; !showMoreElement; showMoreElement = document.querySelector(selector), i++) {
            await new Promise(t => setTimeout(t, promiseWait[0]));
            if (i == promiseWait[1]) {
                console.log("TwitchShowMore ERROR: Selector not found.");
                return;
            }
        }

        //Loop until the Toggle doesn't have the "Show More" text
        for (; showMoreElement && showMoreElement.textContent == "Show More"; showMoreElement = document.querySelector(selector)) {
            showMoreElement.click();
        }
        showMoreElement.style.display = "none";

        //Delete the side navigation bloat
        if (sideNavBloatRemove) {
            sideNavBloat.forEach(element => {
                let elementSearch = document.querySelector(element);
                if (elementSearch) {
                    elementSearch.setAttribute('style', 'display: none !important');
                }
            });
        }
    }
})();