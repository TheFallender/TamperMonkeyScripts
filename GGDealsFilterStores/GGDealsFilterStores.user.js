// ==UserScript==
// @name         GG.deals filter stores
// @author       TheFallender
// @version      1.0.1
// @description  A script that hides the stores and clicks the "Show all deals" button on GGdeals
// @homepageURL  https://github.com/TheFallender/TamperMonkeyScripts
// @updateURL    https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/GGDealsFilterStores/GGDealsFilterStores.user.js
// @downloadURL  https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/GGDealsFilterStores/GGDealsFilterStores.user.js
// @supportURL   https://github.com/TheFallender/TamperMonkeyScripts
// @match        https://gg.deals/game/*
// @match        https://gg.deals/dlc/*
// @icon         https://www.google.com/s2/favicons?domain=gg.deals
// @license      MIT
// @copyright    Copyright © 2023 TheFallender
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Which drops to hide
    const storesToHide = [
        // Market
        "2Game",
        "AllYouPlay",
        "DLGamer.com",
        "Dreamgame",
        "GamesLoad",
        "GamersGate",
        "Indie Gala Store",
        "JoyBuggy",
        "Noctre",
        "Voidu",

        // Grey Market
        "Driffle",
        "G2A",
        "G2Play",
        "Gamivo",
        "HRK Game",
        "Instant Gaming",
        "K4G.com",
        "Kinguin",
        "Play-Asia",
        "Yuplay"
    ];

    // Lowercase the stores
    storesToHide.forEach((store, index) => {
        storesToHide[index] = store.toLowerCase();
    });

    //Main selector for the show more
    const storeSelector = 'div.similar-deals-container > div.game-deals-item';
    const showAllDealsButton = 'div.btn-show-more-container > button.btn-show-more';
    const listsOfDeals = 'div.offer-section > div.game-deals-container > div';

    // Sleep method for easier use
    function sleep (msTime) {
        return new Promise(r => setTimeout(r, msTime));
    }

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

    // Filter the Stores
    function filterStore () {
        document.querySelectorAll(storeSelector).forEach((store) => {
            const storeName = store.getAttribute('data-shop-name');
            if (storesToHide.includes(storeName.toLowerCase())) {
                store.parentNode.remove();
            }
        });
    }

    //Wait for buttons
    waitForElement(showAllDealsButton, true).then(async (showMorebuttons) => {
        // Click the buttons
        Array.from(showMorebuttons).forEach((button) => {
            button.click();
            button.parentNode.remove(button);
        });
        
        // Wait for the lists to be loaded
        let observerList = [];
        document.querySelectorAll(listsOfDeals).forEach((list) => {
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList') {
                        filterStore();
                    }
                })
            });
            observer.observe(list, {childList: true, attributes: true, subtree: true});
            observer.
            observerList.push(observer);
        });
        await sleep(3000);

        // Disconnect the observers
        observerList.forEach((observer) => {
            observer.disconnect();
        });
    });

    // Wait for the Stores
    waitForElement(storeSelector, false).then(() => {
        filterStore();
    });
})();
