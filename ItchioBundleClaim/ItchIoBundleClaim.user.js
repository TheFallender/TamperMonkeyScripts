// ==UserScript==
// @name         Itch.io Bundle Claim
// @author       TheFallender
// @version      1.4
// @description  This script will claim all the items in a bundle slowly, without sending too many requests to the website
// @homepageURL  https://github.com/TheFallender/TamperMonkeyScripts
// @updateURL    https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/ItchioBundleClaim/ItchIoBundleClaim.user.js
// @downloadURL  https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/ItchioBundleClaim/ItchIoBundleClaim.user.js
// @supportURL   https://github.com/TheFallender/TamperMonkeyScripts
// @match        https://itch.io/bundle/download/*
// @match        https://*.itch.io/*/download/*
// @icon         https://www.google.com/s2/favicons?domain=itch.io
// @license      MIT
// @copyright    Copyright © 2021 TheFallender
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    //Wait time: Time to wait between changes.
    //I really don't recommend changing this setting to a lower value.
    const timeBetweenWaits = 1500;

    //Debug mode
    const debug = false;

    window.onload = async function() {
        //Timeout for each transition
        setTimeout(function() {
            //Detect if the current URL belongs to a bundle
            if (window.location.href.includes("https://itch.io/bundle/download/")) {
                //Bundle URL
                if (debug) {
                    console.log("Bundle detected.");
                }

                //Get a list of the current game rows
                let gameToClaim = document.querySelector("button[value='claim']");

                //Check if there are claimable games
                if (gameToClaim) {
                    if (debug) {
                        //console.log(`Claiming the game: ${gameToClaim.querySelector('.game_title').childNodes[0].textContent}.`);
                    }

                    //Keep claiming the first on the list
                    gameToClaim.click();
                } else {
                    //Go to the next page if there are no gamerows
                    let nextPageLink = document.querySelector('a.next_page.button');
                    if (nextPageLink) {
                        nextPageLink.click();
                    } else if (debug) {
                        console.log("Finished claiming.");
                    }
                }
            } else if (window.location.href.match(/.*\.itch\.io\/.*\/download\/.*/g).length == 1) {
                if (debug) {
                    console.log("Game detected.");
                }

                //Inside an item page, go back to the bundle
                window.history.back();
            }
        }, timeBetweenWaits);
    }
})();