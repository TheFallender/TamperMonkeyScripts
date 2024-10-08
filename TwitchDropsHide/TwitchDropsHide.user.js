// ==UserScript==
// @name         Twitch Drops only show interesting
// @author       TheFallender
// @version      1.2.2
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

    // List selectors of drops and rewards
    const dropsListSel = 'div.drops-root__content > div > div:has(>div.accordion-header h3.tw-title)';
    const rewardsListSel = 'div.drops-root__content > div > div > div:has(>div.accordion-header h3.tw-title)';

    // Selector of data of the drops/rewards
    const dropsGameTitleSel = 'div.accordion-header h3.tw-title';
    const rewardsCompanySel = 'div.accordion-header p[class*=CoreText]';
    const rewardsGameSel = 'a.tw-link[href*="/directory/category/"]';

    // Bloat on the drops
    const bloatTextInfo = 'div.drops-root__content > div > div:has(> span)';

    // Drops to always show
    const dropsGamesToShow = [
		"Apex Legends",
		"Baldur's Gate 3",
		"BattleBit Remastered",
        "Call of Duty: Warzone",
        "Cult of the Lamb",
        "Cyberpunk 2077",
        "Destiny 2",
        "Don't Starve Together",
        "Enshrouded",
		"Escape from Tarkov",
        "Escape from Tarkov: Arena",
		"Genshin Impact",
        "Halo: The Master Chief Collection",
		"Halo Infinite",
        "HITMAN World of Assassination",
        "Hunt: Showdown 1896",
        "Last Epoch",
		"Marauders",
        "Nightingale",
        "Once Human",
        "Palworld",
		"PAYDAY 2",
        "PAYDAY 3",
        "Pokémon GO",
		"Rust",
		"Sea of Thieves",
        "Spectre Divide",
        "Special Events",
        "Splitgate",
        "Splitgate 2",
        "THE FINALS",
        "Tom Clancy's Rainbow Six Siege",
		"VALORANT",
        "XDefiant",
    ];

    // Which drops to hide
    const dropsGames = [
        "Aether Gazer",
        "AK-xolotl",
        "Albion Online",
        "Apex Legends",
        "ArcheAge",
        "Arena Breakout",
        "Arena Breakout: Infinite",
        "Assassin's Creed Mirage",
        "Assassin's Creed Odyssey",
        "Assassin's Creed Valhalla",
        "Avatar: Frontiers of Pandora",
        "Baldur's Gate 3",
        "BAPBAP",
        "BATTLE CRUSH",
        "Battle Teams 2",
        "BattleBit Remastered",
        "BattleCore Arena",
        "Black Desert",
        "Brawl Stars",
        "Brawlhalla",
        "Brazen Blaze",
        "Call of Duty: Warzone",
        "Caliber",
        "Chess",
        "Clash of Clans",
        "Coin Pusher World",
        "Conan Exiles",
        "Conqueror's Blade",
        "Coryphaeus Championships",
        "Crossfire",
        "Crossout",
        "Cult of the Lamb",
        "Cyberpunk 2077",
        "DC Dual Force",
        "Dead by Daylight",
        "Dead Island 2",
        "Diabotical Rogue",
        "Deathbound",
        "Deceive Inc.",
        "Destiny 2",
        "Disney Speedstorm",
        "Dofus",
        "DOFUS Touch",
        "Don't Starve Together",
        "Dragonheir: Silent Gods",
        "Dungeon Defenders II",
        "Dungeon Fighter Online",
        "Dungeon of the Endless",
        "Dungeonborne",
        "Dying Light 2: Stay Human",
        "Dysterra",
        "EA Sports FC 24",
        "EA Sports Madden NFL 25",
        "Eco",
        "EVE Online",
        "Elite: Dangerous",
        "Endless Dungeon",
        "Enshrouded",
        "Epic Seven",
        "Escape from Tarkov",
        "Escape from Tarkov: Arena",
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
        "Homeworld 3",
        "HUMANKIND",
        "HYENAS",
        "Halo: The Master Chief Collection",
        "Halo Infinite",
        "Hearthstone",
        "Hellcard",
        "HITMAN World of Assassination",
        "Honkai Impact 3rd",
        "Honkai: Star Rail",
        "Honor of Kings",
        "House Flipper 2",
        "Hunt: Showdown 1896",
        "Infestation: The New Z",
        "Kakele Online: MMORPG",
        "KartRider: Drift",
        "Killer Klowns from Outer Space: The Game",
        "King of the Castle",
        "Kirka.io",
        "Last Epoch",
        "League of Legends",
        "Legion TD 2",
        "Level Zero: Extraction",
        "Lineage II",
        "Lost Ark",
        "Lost Light",
        "MLB The Show 23",
        "MLB The Show 24",
        "Madden NFL 24",
        "Marauders",
        "Marbles on Stream",
        "Marvel Rivals",
        "Marvel Snap",
        "Mecha BREAK",
        "Metin2",
        "Mir Korabley",
        "Mir Tankov",
        "Mortal Kombat 1",
        "Mortal Online 2",
        "MultiVersus",
        "My Hero Ultra Rumble",
        "My Time at Sandrock",
        "Myth of Empires",
        "NW2Online",
        "NARAKA: BLADEPOINT",
        "NBA 2K24",
        "NBA 2K25",
        "Neon Abyss: Infinity",
        "NextWorld2",
        "New World",
        "Nightingale",
        "Ninja Must Die",
        "Nitro: Stream Racing",
        "Oh Baby! Kart",
        "Once Human",
        "One Punch Man: World",
        "Operation Valor",
        "OUTERPLANE",
        "OutRage: Fight Fest",
        "Out of the Park Baseball 24",
        "Out of the Park Baseball 25",
        "Overwatch 2",
        "PAYDAY 2",
        "PAYDAY 3",
        "PUBG: BATTLEGROUNDS",
        "Paladins",
        "Palia",
        "Palworld",
        "Party Animals",
        "Path of Exile",
        "Pokémon GO",
        "Pokémon Trading Card Game",
        "Pokémon Trading Card Game Live",
        "Pokémon UNITE",
        "Predecessor",
        "Project: Arena",
        "Project Genesis",
        "Project Winter",
        "Race Day Rampage",
        "RavenQuest",
        "Ravendawn",
        "Rawmen",
        "Relic Hunters Legend",
        "Rennsport",
        "Riders Republic",
        "Rise Online",
        "Rocket League",
        "Rumble Club",
        "Rust",
        "SMITE",
        "SMITE 2",
        "STALCRAFT",
        "SYNCED",
        "Sea of Thieves",
        "Seekers of Skyveil",
        "Shakes and Fidget",
        "Shatterline",
        "Shell Shockers",
        "S.K.I.L.L.: Special Force 2",
        "Skull and Bones",
        "Slapshot Rebound",
        "Slipstream: Rogue Space",
        "Snowbreak: Containment Zone",
        "Special Events",
        "Spectre Divide",
        "Splitgate",
        "Splitgate 2",
        "Squad Busters",
        "Stampede Racing Royale",
        "STALCRAFT: X",
        "Starsiege: Deadzone",
        "Star Wars Outlaws",
        "Star Wars: The Old Republic",
        "Stormgate",
        "Stream Raiders",
        "Stumble Guys",
        "Suicide Squad: Kill the Justice League",
        "Summoners War: Chronicles",
        "Super Animal Royale",
        "SUPERVIVE",
        "Tanki Online",
        "Tarisland",
        "Teamfight Tactics",
        "TerraTech Worlds",
        "The Crew: Motorfest",
        "The Elder Scrolls Online",
        "THE FINALS",
        "The First Descendant",
        "The Settlers: New Allies",
        "The Tomorrow Children",
        "Tom Clancy's Rainbow Six Siege",
        "TopSpin 2K25",
        "Torchlight: Infinite",
        "Tower of Fantasy",
        "TRIBES 3: Rivals",
        "Trust No Bunny",
        "Trove",
        "Undying",
        "UNDAWN",
        "UNDECEMBER",
        "UNITED 1944",
        "Unrooted",
        "VALORANT",
        "Vampire: The Masquerade - Bloodhunt",
        "Veiled Experts",
        "Venatur",
        "WWE SuperCard",
        "Wakfu",
        "War Thunder",
        "Warface",
        "Warface: Clutch",
        "Warframe",
        "Warhammer: The Horus Heresy - Legions",
        "Warhammer 40,000: Speed Freeks",
        "Warhammer 40,000: Warpforge",
        "Warhammer Age of Sigmar: Realms of Ruin",
        "Warhammer Online: Age of Reckoning",
        "Warhaven",
        "West Hunt",
        "With Your Destiny",
        "World of Tanks",
        "World of Tanks Console",
        "World of Warcraft",
        "World of Warships",
        "World War Z: Aftermath",
        "Wuthering Waves",
        "XERA: Survival",
        "XDefiant",
        "Zenless Zone Zero",
        "Zombie Within",
    ];

    const rewardsCompaniesToShow = [
        "PC Game Pass",
        "Rust",
    ]

    const rewardsCompanies = [
        "Apple TV+",
        "PC Game Pass",
        "Rust",
        "Taco Bell",
        "Wuthering Waves",
    ]

    const rewardsGamesToShow = [

    ]

    const rewardsGames = [
        "FINAL FANTASY XIV ONLINE",
        "World of Warcraft",
        "XDefiant",
    ]

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
                        // This will leave games not defined in either out, better that way than
                        // missing drops of new games.

                        // Bloat
                        waitForElement(bloatTextInfo, true).then((element) => {
                            Array.from(element).forEach((bloat) => {
                                bloat.remove();
                            });
                        });

                        //Wait for the Drops
                        waitForElement(dropsListSel, true).then((element) => {
                            Array.from(element).forEach((drop) => {
                                // Extract the names
                                const dropGame = drop.querySelector(dropsGameTitleSel)?.innerText;

                                // Drops to show
                                if (dropsGamesToShow.includes(dropGame)) {
                                    return;
                                }

                                // Drops to remove
                                if (dropsGames.includes(dropGame)) {
                                    drop.remove()
                                }
                            });
                        });

                        //Wait for the Reward campaigns
                        waitForElement(rewardsListSel, true).then((element) => {
                            Array.from(element).forEach((drop) => {
                                // Extract the names
                                const rewardCompany = drop.querySelector(rewardsCompanySel)?.innerText;
                                const rewardGame = drop.querySelector(rewardsGameSel)?.innerText;

                                // Drops to show
                                if (rewardsCompaniesToShow.includes(rewardCompany) ||
                                    rewardsGamesToShow.includes(rewardGame)
                                ){
                                    return;
                                }

                                // Drops to remove
                                if (rewardsCompanies.includes(rewardCompany) ||
                                    rewardsGames.includes(rewardGame)
                                ){
                                    drop.remove()
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
