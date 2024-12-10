// ==UserScript==
// @name         GG.deals filter stores
// @author       TheFallender
// @version      1.2.4
// @description  A script that hides the stores and clicks the "Show all deals" button on GGdeals
// @homepageURL  https://github.com/TheFallender/TamperMonkeyScripts
// @updateURL    https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/GGDealsFilterStores/GGDealsFilterStores.user.js
// @downloadURL  https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/GGDealsFilterStores/GGDealsFilterStores.user.js
// @supportURL   https://github.com/TheFallender/TamperMonkeyScripts
// @match        https://gg.deals/*/*
// @icon         https://www.google.com/s2/favicons?domain=gg.deals
// @license      MIT
// @copyright    Copyright © 2024 TheFallender
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
        "Microsoft Store",
        "Noctre",
        "Startselect",
        "Voidu",

        // Grey Market
        "Difmark",
        "Driffle",
        "G2A",
        "G2Play",
        "GameSeal",
        "Gamivo",
        "HRK Game",
        "Instant Gaming",
        "K4G.com",
        "Keycense",
        "Kinguin",
        "MTCGame",
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
    const listsOfDeals = 'div.offer-section:has(> div.game-deals-container > div.load-more-content > div.similar-deals-container)';
    const priceHistorySelector = 'a.game-lowest-prices-keyshops-switch.active'

    // Sleep method for easier use
    function sleep(msTime) {
        return new Promise(r => setTimeout(r, msTime));
    }

    //Method to wait for an element in the DOM
    function waitForElement(selector, selectorAll = false, minimum_elements = 0) {
        return new Promise(resolve => {
            function conditionsSuccess() {
                let queryResult = null
                if (!selectorAll) {
                    const singleElement = document.querySelector(selector);
                    if (singleElement) {
                        queryResult = singleElement;
                    }
                } else {
                    const multipleElements = document.querySelectorAll(selector);
                    if (multipleElements.length > 0 && multipleElements.length >= minimum_elements) {
                        queryResult = multipleElements;
                    }
                }
                return queryResult;
            }

            //Return the element if it is already in the DOM
            const domCheck = conditionsSuccess()
            if (domCheck) {
                resolve(domCheck)
            }

            //Wait for the element to be in the DOM
            const observer = new MutationObserver(mutations => {
                //Return the element if it is already in the DOM
                const mutationCheck = conditionsSuccess()
                if (mutationCheck) {
                    resolve(mutationCheck)
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
    function filterStore() {
        document.querySelectorAll(storeSelector).forEach((store) => {
            const storeName = store.getAttribute('data-shop-name').toLowerCase();
            if (storesToHide.includes(storeName)) {
                store.parentNode.setAttribute('style', 'display: none !important');
            }
        });
    }

    class observerData {
        callback(mutations) {
            let mutationFound = false;
            mutationFound = mutations.find((mutation) => {
                if (mutation.type === 'childList') {
                    return true;
                }
            });

            // Filter timeout
            if (mutationFound) {
                clearTimeout(this.timeOut);
                this.timeOut = setTimeout(() => {
                    filterStore();
                }, 50);
            }

            // Disconnect timeout
            if (mutationFound && this.disconnectTimeOut == null) {
                this.disconnectTimeOut = setTimeout(() => {
                    this.disconnect();
                }, 3000);
            }
        }

        observe(element) {
            this.observer = new MutationObserver(this.callback);
            this.observer.id = element.id;
            this.observer.observe(element, { childList: true, attributes: true, subtree: true});
        }
    }

    // Wait for the lists to be loaded
    waitForElement(listsOfDeals, true, 2).then(async (listOfDeals) => {
        // Wait for the lists to be loaded
        Array.from(listOfDeals).forEach((list) => {
            new observerData().observe(list);
        });

        // Wait for the buttons to be loaded
        waitForElement(showAllDealsButton, true).then(async (showMorebuttons) => {
            // Click the buttons
            Array.from(showMorebuttons).forEach((button) => {
                button.click();
                button.remove();
            });
        });
    });

    // Wait for the stores to be loaded
    waitForElement(storeSelector, true).then(async (stores) => {
        filterStore();
    });

    // Wait for the price history
    waitForElement(priceHistorySelector, false).then(async (priceHistory) => {
        priceHistory.click();
    });
})();
