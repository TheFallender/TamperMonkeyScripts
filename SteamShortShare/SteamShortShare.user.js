// ==UserScript==
// @name         Steam Short Share
// @author       TheFallender
// @version      1.0.1
// @description  Will replace the links of sharing with the s.team/a/<id> format
// @homepageURL  https://github.com/TheFallender/TamperMonkeyScripts
// @updateURL    https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/SteamShortShare/SteamShortShare.user.js
// @downloadURL  https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/SteamShortShare/SteamShortShare.user.js
// @supportURL   https://github.com/TheFallender/TamperMonkeyScripts
// @match        https://store.steampowered.com/app/*
// @icon         https://www.google.com/s2/favicons?domain=s.team
// @license      MIT
// @copyright    Copyright © 2024 TheFallender
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Selectors
    const shareButtonSel = 'a[onclick*="ShowShareDialog"]';
    const gameId = document.location.pathname.match(/\/app\/(\d+)\//)[1];

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

    //Replace share links
    waitForElement(shareButtonSel, false).then((element) => {
        element.onclick = (event) => { navigator.clipboard.writeText(`https://s.team/a/${gameId}`); };
    });
})();
