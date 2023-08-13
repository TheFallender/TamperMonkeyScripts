// ==UserScript==
// @name         Twitch Drops only show interesting
// @author       TheFallender
// @version      1.1.0
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

    // Drops to always show
    const dropsToShow = [
        "Apex Legends",
        "Baldur's Gate 3",
        "BattleBit Remastered",
        "Escape from Tarkov",
        "Genshin Impact",
        "Halo Infinite",
        "HAWKED",
        "Marauders",
        "Overwatch 2",
        "PAYDAY 2",
        "Rust",
        "Sea of Thieves"
    ];

    // Which drops to hide
    const dropsToHide = [
        "Aether Gazer",
        "Albion Online",
        "Apex Legends",
        "ArcheAge",
        "Arena Breakout",
        "Baldur's Gate 3",
        "Battle Teams 2",
        "BattleBit Remastered",
        "Black Desert",
        "Conan Exiles",
        "Crossfire",
        "Dead Island 2",
        "Dofus",
        "Dysterra",
        "Dungeon Defenders II",
        "Dungeon Fighter Online",
        "Dungeon of the Endless",
        "Elite: Dangerous",
        "Epic Seven",
        "Escape from Tarkov",
        "Eternal Return",
        "Evilmun Family",
        "Farlight 84",
        "FIFA 23",
        "For Honor",
        "Fortnite",
        "Freestyle Football R",
        "Genshin Impact",
        "Ghostbusters: Spirits Unleashed",
        "Goose Goose Duck",
        "Gundam Evolution",
        "Gwent: The Witcher Card Game",
        "Halo Infinite",
        "HAWKED",
        "Hearthstone",
        "Honor of Kings",
        "HUMANKIND",
        "Hellcard",
        "Honkai: Star Rail",
        "Honkai Impact 3rd",
        "Kakele Online: MMORPG",
        "KartRider: Drift",
        "King of the Castle",
        "Legion TD 2",
        "Lost Ark",
        "Marauders",
        "Marbles on Stream",
        "Mir Korabley",
        "Mir Tankov",
        "NARAKA: BLADEPOINT",
        "New World",
        "Nitro: Stream Racing",
        "Out of the Park Baseball 24",
        "Overwatch 2",
        "Paladins",
        "PAYDAY 2",
        "Project Genesis",
        "Project Winter",
        "Race Day Rampage",
        "Ravendawn",
        "RavenQuest",
        "Relic Hunters Legend",
        "Rise Online",
        "Rust",
        "Rocket League",
        "Sea of Thieves",
        "Shatterline",
        "Shakes and Fidget",
        "Slapshot Rebound",
        "SMITE",
        "Snowbreak: Containment Zone",
        "Splitgate",
        "Summoners War: Chronicles",
        "STALCRAFT",
        "Starsiege: Deadzone",
        "Stream Raiders",
        "Super Animal Royale",
        "OUTERPLANE",
        "Path of Exile",
        "PUBG: BATTLEGROUNDS",
        "Pokémon Trading Card Game",
        "Pokémon UNITE",
        "Tanki Online",
        "The Crew: Motorfest",
        "The Elder Scrolls Online",
        "The Settlers: New Allies",
        "Tower of Fantasy",
        "Trust No Bunny",
        "UNDAWN",
        "UNDECEMBER",
        "VALORANT",
        "Vampire: The Masquerade - Bloodhunt",
        "Wakfu",
        "War Thunder",
        "Warhammer Online: Age of Reckoning",
        "Warface",
        "Warframe",
        "West Hunt",
        "With Your Destiny",
        "World of Tanks",
        "World of Tanks",
        "World of Warcraft",
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

    //Remove the side nav bloat
    function removeDrops () {
        let oldHref = "";
        const body = document.querySelector("body");
        const observer = new MutationObserver(mutations => {
            mutations.forEach(() => {
                if (oldHref !== document.location.href && document.location.href.includes("/drops/campaigns")) {
                    oldHref = document.location.href;
                    //Wait for the drops
                    waitForElement(dropsListSel, true).then((element) => {
                        Array.from(element).forEach((drop) => {
                            if (dropsToShow.includes(drop.querySelector(dropTitleSel).innerText)) {
                                return;
                            }
                            if (dropsToHide.includes(drop.querySelector(dropTitleSel).innerText)) {
                                drop.setAttribute('style', 'display: none !important');
                            }
                        });
                    });
                }
            });
        });
        observer.observe(body, { childList: true, subtree: true });
    }

    removeDrops();
})();
