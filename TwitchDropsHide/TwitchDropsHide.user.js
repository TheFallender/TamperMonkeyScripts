// ==UserScript==
// @name         Twitch Drops only show interesting
// @author       TheFallender
// @version      1.1.3
// @description  A script that hides the drops not interesting to the user
// @homepageURL  https://github.com/TheFallender/TamperMonkeyScripts
// @updateURL    https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/TwitchDropsHide/TwitchDropsHide.user.js
// @downloadURL  https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/TwitchDropsHide/TwitchDropsHide.user.js
// @supportURL   https://github.com/TheFallender/TamperMonkeyScripts
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?domain=twitch.tv
// @license      MIT
// @copyright    Copyright © 2023 TheFallender
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Drops to always show
    const dropsToShow = [
        /* Games that you want to show
        * "Apex Legends",
        * "Rust",
        * "Sea of Thieves",
        * and more
        */ 
    ];

    // Which drops to hide
    const dropsToHide = [
        "Aether Gazer",
        "Albion Online",
        "Apex Legends",
        "ArcheAge",
        "Arena Breakout",
        "AK-xolotl",
        "Baldur's Gate 3",
        "Battle Teams 2",
        "BattleBit Remastered",
        "Black Desert",
        "Brawl Stars",
        "Conan Exiles",
        "Conqueror's Blade",
        "Crossfire",
        "Cyberpunk 2077",
        "DC Dual Force",
        "Dead Island 2",
        "Dofus",
        "DOFUS Touch",
        "Dragonheir: Silent Gods",
        "Dungeon Defenders II",
        "Dungeon Fighter Online",
        "Dungeon of the Endless",
        "Dysterra",
        "EVE Online",
        "Elite: Dangerous",
        "Endless Dungeon",
        "Epic Seven",
        "Escape from Tarkov",
        "Eternal Return",
        "Evilmun Family",
        "FIFA 23",
        "Farlight 84",
        "For Honor",
        "Fortnite",
        "Freestyle Football R",
        "GODDESS OF VICTORY: NIKKE",
        "Genshin Impact",
        "Ghostbusters: Spirits Unleashed",
        "Goose Goose Duck",
        "Gord",
        "Guild Wars 2",
        "Gundam Evolution",
        "Gwent: The Witcher Card Game",
        "HAWKED",
        "HUMANKIND",
        "HYENAS",
        "Halo Infinite",
        "Hearthstone",
        "Hellcard",
        "Honkai Impact 3rd",
        "Honkai: Star Rail",
        "Honor of Kings",
        "Infestation: The New Z",
        "Kakele Online: MMORPG",
        "KartRider: Drift",
        "King of the Castle",
        "Legion TD 2",
        "Lost Ark",
        "Lost Light",
        "MLB The Show 23",
        "Madden NFL 24",
        "Marauders",
        "Marbles on Stream",
        "Marvel Snap",
        "Mir Korabley",
        "Mir Tankov",
        "My Time at Sandrock",
        "NARAKA: BLADEPOINT",
        "New World",
        "Nitro: Stream Racing",
        "OUTERPLANE",
        "Out of the Park Baseball 24",
        "Overwatch 2",
        "PAYDAY 2",
        "PUBG: BATTLEGROUNDS",
        "Paladins",
        "Party Animals",
        "Path of Exile",
        "Pokémon Trading Card Game",
        "Pokémon UNITE",
        "Project Genesis",
        "Project Winter",
        "Race Day Rampage",
        "RavenQuest",
        "Ravendawn",
        "Relic Hunters Legend",
        "Rise Online",
        "Rocket League",
        "Rust",
        "SMITE",
        "STALCRAFT",
        "SYNCED",
        "Sea of Thieves",
        "Shakes and Fidget",
        "Shatterline",
        "Shell Shockers",
        "Slapshot Rebound",
        "Snowbreak: Containment Zone",
        "Splitgate",
        "Starsiege: Deadzone",
        "Stream Raiders",
        "Summoners War: Chronicles",
        "Super Animal Royale",
        "Tanki Online",
        "The Crew: Motorfest",
        "The Elder Scrolls Online",
        "The First Descendant",
        "The Settlers: New Allies",
        "The Tomorrow Children",
        "Torchlight: Infinite",
        "Tower of Fantasy",
        "Trust No Bunny",
        "UNDAWN",
        "UNDECEMBER",
        "VALORANT",
        "Vampire: The Masquerade - Bloodhunt",
        "WWE SuperCard",
        "Wakfu",
        "War Thunder",
        "Warface",
        "Warframe",
        "Warhammer Age of Sigmar: Realms of Ruin",
        "Warhammer Online: Age of Reckoning",
        "Warhaven",
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
