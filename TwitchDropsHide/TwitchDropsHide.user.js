// ==UserScript==
// @name         Twitch Drops only show interesting
// @author       TheFallender
// @version      1.1.5
// @description  A script that hides the drops not interesting to the user
// @homepageURL  https://github.com/TheFallender/TamperMonkeyScripts
// @updateURL    https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/TwitchDropsHide/TwitchDropsHide.user.js
// @downloadURL  https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/TwitchDropsHide/TwitchDropsHide.user.js
// @supportURL   https://github.com/TheFallender/TamperMonkeyScripts
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?domain=twitch.tv
// @license      MIT
// @copyright    Copyright © 2024 TheFallender
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Drops to always show
    const dropsToShow = [
		"Apex Legends",
        "Assassin's Creed Mirage",
		"Baldur's Gate 3",
		"BattleBit Remastered",
        "Cyberpunk 2077",
		"Escape from Tarkov",
		"Genshin Impact",
		"Halo Infinite",
		"Marauders",
		"Overwatch 2",
		"PAYDAY 2",
        "PAYDAY 3",
        "Pokémon GO",
		"Rust",
		"Sea of Thieves",
		"VALORANT",
    ];

    // Which drops to hide
    const drops = [
        "Aether Gazer",
        "AK-xolotl",
        "Albion Online",
        "Apex Legends",
        "ArcheAge",
        "Arena Breakout",
        "Assassin's Creed Mirage",
        "Assassin's Creed Odyssey",
        "Assassin's Creed Valhalla",
        "Avatar: Frontiers of Pandora",
        "Baldur's Gate 3",
        "BAPBAP",
        "Battle Teams 2",
        "BattleBit Remastered",
        "Black Desert",
        "Brawl Stars",
        "Brazen Blaze",
        "Caliber",
        "Chess",
        "Clash of Clans",
        "Coin Pusher World",
        "Conan Exiles",
        "Conqueror's Blade",
        "Crossfire",
        "Crossout",
        "Cyberpunk 2077",
        "DC Dual Force",
        "Dead Island 2",
        "Deceive Inc.",
        "Disney Speedstorm",
        "Dofus",
        "DOFUS Touch",
        "Dragonheir: Silent Gods",
        "Dungeon Defenders II",
        "Dungeon Fighter Online",
        "Dungeon of the Endless",
        "Dying Light 2: Stay Human",
        "Dysterra",
        "EA Sports FC 24",
        "Eco",
        "EVE Online",
        "Elite: Dangerous",
        "Endless Dungeon",
        "Epic Seven",
        "Escape from Tarkov",
        "Eternal Return",
        "Evilmun Family",
        "FIFA 23",
        "Farlight 84",
        "Fishing Planet",
        "For Honor",
        "Fortnite",
        "Freestyle Football R",
        "From Space",
        "GODDESS OF VICTORY: NIKKE",
        "Genshin Impact",
        "Ghostbusters: Spirits Unleashed",
        "Go Go Muffin",
        "Goose Goose Duck",
        "Gord",
        "Guardian Tales",
        "Guessr.tv",
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
        "House Flipper 2",
        "Infestation: The New Z",
        "Kakele Online: MMORPG",
        "KartRider: Drift",
        "King of the Castle",
        "Kirka.io",
        "Legion TD 2",
        "Lost Ark",
        "Lost Light",
        "MLB The Show 23",
        "MLB The Show 24",
        "Madden NFL 24",
        "Marauders",
        "Marbles on Stream",
        "Marvel Snap",
        "Mir Korabley",
        "Mir Tankov",
        "Mortal Online 2",
        "My Hero Ultra Rumble",
        "My Time at Sandrock",
        "NW2Online",
        "NARAKA: BLADEPOINT",
        "Neon Abyss: Infinity",
        "New World",
        "Ninja Must Die",
        "Nitro: Stream Racing",
        "Oh Baby! Kart",
        "One Punch Man: World",
        "Operation Valor",
        "OUTERPLANE",
        "Out of the Park Baseball 24",
        "Overwatch 2",
        "PAYDAY 2",
        "PUBG: BATTLEGROUNDS",
        "Paladins",
        "Palia",
        "Party Animals",
        "Path of Exile",
        "Pokémon GO",
        "Pokémon Trading Card Game",
        "Pokémon UNITE",
        "Project: Arena",
        "Project Genesis",
        "Project Winter",
        "Race Day Rampage",
        "RavenQuest",
        "Ravendawn",
        "Relic Hunters Legend",
        "Riders Republic",
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
        "S.K.I.L.L.: Special Force 2",
        "Skull and Bones",
        "Slapshot Rebound",
        "Snowbreak: Containment Zone",
        "Splitgate",
        "Starsiege: Deadzone",
        "Stream Raiders",
        "Suicide Squad: Kill the Justice League",
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
        "Undying",
        "UNDAWN",
        "UNDECEMBER",
        "UNITED 1944",
        "VALORANT",
        "Vampire: The Masquerade - Bloodhunt",
        "Veiled Experts",
        "Venatur",
        "WWE SuperCard",
        "Wakfu",
        "War Thunder",
        "Warface",
        "Warframe",
        "Warhammer 40,000: Warpforge",
        "Warhammer Age of Sigmar: Realms of Ruin",
        "Warhammer Online: Age of Reckoning",
        "Warhaven",
        "West Hunt",
        "With Your Destiny",
        "World of Tanks",
        "World of Tanks",
        "World of Warcraft",
        "World of Warships",
        "XERA: Survival",
    ];

    const companiesToShow = [
        "Rust",
    ]

    const companies = [
        "PC Game Pass",
        "Rust",
        "Taco Bell",
    ]

    //Main selector for the show more
    const dropsListSel = 'div.drops-root__content div:has(>div.accordion-header h3.tw-title)';
    const dropTitleSel = 'div.accordion-header h3.tw-title';
    const dropCompanySel = 'div.accordion-header p[class*=CoreText]';

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
                if (oldHref !== document.location.href) {
                    oldHref = document.location.href;
                    if (document.location.href.includes("/drops/campaigns")) {
                        //Wait for the drops
                        waitForElement(dropsListSel, true).then((element) => {
                            Array.from(element).forEach((drop) => {
                                if (companiesToShow.includes(drop.querySelector(dropCompanySel).innerText) ||
                                    dropsToShow.includes(drop.querySelector(dropTitleSel).innerText)) {
                                    return;
                                }
                                if (companies.includes(drop.querySelector(dropCompanySel).innerText) ||
                                    drops.includes(drop.querySelector(dropTitleSel).innerText)) {
                                    drop.setAttribute('style', 'display: none !important');
                                }
                            });
                        });
                    }
                }
            });
        });
        observer.observe(body, { childList: true, subtree: true });
    }

    removeDrops();
})();
