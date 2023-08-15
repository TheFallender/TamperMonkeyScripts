// ==UserScript==
// @name         GG.deals filter stores
// @author       TheFallender
// @version      1.1.0
// @description  A script that hides the stores and clicks the "Show all deals" button on GGdeals
// @homepageURL  https://github.com/TheFallender/TamperMonkeyScripts
// @updateURL    https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/GGDealsFilterStores/GGDealsFilterStores.user.js
// @downloadURL  https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/GGDealsFilterStores/GGDealsFilterStores.user.js
// @supportURL   https://github.com/TheFallender/TamperMonkeyScripts
// @match        https://gg.deals/game/*
// @match        https://gg.deals/dlc/*
// @match        https://gg.deals/pack/*
// @match        https://gg.deals/gift-card/*
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
            const storeName = store.getAttribute('data-shop-name');
            if (storesToHide.includes(storeName.toLowerCase())) {
                store.parentNode.remove();
            }
        });
    }

    class observerData {
        observer = null;
        childMutation = false;
        timeOut = null;

        callback(mutations) {
            for (let i = 0; i < mutations.length; i++) {
                if (mutations[i].type === 'childList' && mutations[i].removedNodes.length > 0) {
                    this.childMutation = true;
                    this.timeOut = setTimeout(() => {
                        filterStore();
                        this.disconnect();
                    }, 500);
                } else if (mutations[i].type === 'attributes' && this.childMutation) {
                    clearTimeout(this.timeOut);
                    this.timeOut = setTimeout(() => {
                        filterStore();
                        this.disconnect();
                    }, 50);
                    break;
                }
            }
        }

        observe(element) {
            this.observer = new MutationObserver(this.callback);
            this.observer.observe(element, { childList: true, attributes: true, subtree: true});
        }

        disconnect() {
            this.observer.disconnect();
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
})();
