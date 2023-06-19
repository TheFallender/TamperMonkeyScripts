// ==UserScript==
// @name         Twitch Drops only show interesting
// @author       TheFallender
// @version      1.0
// @description  A script that hides the drops not interesting to the user
// @homepageURL  https://github.com/TheFallender/TamperMonkeyScripts
// @updateURL    https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/TwitchDropsHide/TwitchDropsHide.user.js
// @downloadURL  https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/TwitchDropsHide/TwitchDropsHide.user.js
// @supportURL   https://github.com/TheFallender/TamperMonkeyScripts
// @match        https://www.twitch.tv/drops/*
// @icon         https://www.google.com/s2/favicons?domain=twitch.tv
// @license      MIT
// @copyright    Copyright © 2021 TheFallender
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Which drops to hide
    const dropsToHide = [
        "Albion Online",
        "ArcheAge",
        "Black Desert",
        "Crossfire",
        "Dead Island 2",
        "Eternal Return",
        "Freestyle Football R",
        "Goose Goose Duck",
        "Gundam Evolution",
        "HUMANKIND",
        "Hellcard",
        "Honkai: Star Rail",
        "King of the Castle",
        "Lost Ark",
        "Marbles on Stream",
        "NARAKA: BLADEPOINT",
        "New World",
        "Nitro: Stream Racing",
        "Out of the Park Baseball 24",
        "Paladins",
        "Project Genesis",
        "Rocket League",
        "SMITE",
        "Splitgate",
        "Summoners War: Chronicles",
        "Tanki Online",
        "UNDECEMBER",
        "VALORANT",
        "Vampire: The Masquerade - Bloodhunt",
        "Warface",
        "World of Tanks",
        "World of Tanks",
        "World of Warships"
    ];

    //Main selector for the show more
    const dropsListSel = 'div.drops-root__content > div > div:has(>div.accordion-header h3.tw-title)';
    const dropTitleSel = 'div.accordion-header h3.tw-title';

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

    //Wait until the followed channel button is loaded
    waitForElement(dropsListSel, true).then((element) => {
        Array.from(element).forEach((drop) => {
            if (dropsToHide.includes(drop.querySelector(dropTitleSel).innerText)) {
                drop.setAttribute('style', 'display: none !important');
            }
        });
    });
})();
