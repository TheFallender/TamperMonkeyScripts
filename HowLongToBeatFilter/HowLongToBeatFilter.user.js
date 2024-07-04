// ==UserScript==
// @name         HowLongToBeat filter
// @author       TheFallender
// @version      1.0.3
// @description  A script that filters the games on HowLongToBeat by years or score.
// @homepageURL  https://github.com/TheFallender/TamperMonkeyScripts
// @updateURL    https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/HowLongToBeatFilter/HowLongToBeatFilter.user.js
// @downloadURL  https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/HowLongToBeatFilter/HowLongToBeatFilter.user.js
// @supportURL   https://github.com/TheFallender/TamperMonkeyScripts
// @match        https://howlongtobeat.com/user/*/games/*
// @icon         https://www.google.com/s2/favicons?domain=howlongtobeat.com
// @license      MIT
// @copyright    Copyright © 2024 TheFallender
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    //Main selectors
    const gameRowSel = "div[class*='UserGameList_table_divider']";
    const gameListHeaderSel = "div.table_head[class*='UserGameList_header']";
    const gameListInfoSel = "div.mobile_hide:has(select)";
    const gameListRandomSel = "button[aria-label='Random']";

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

    //Method to filter the games
    function filterGames() {
        //Get the games list
        function validPrompt(textForPrompt) {
            const promptReply = Number(prompt(textForPrompt));
            // Check if the prompt is valid
            if (!promptReply || promptReply === "NaN") {
                alert("Not a valid input.");
                return null;
            }
            return promptReply;
        };

        // Get Games list
        const gamesList = Array.from(document.querySelectorAll(gameRowSel)).map((game) => {
            return {
                gameName: game.childNodes[0].childNodes[0].childNodes[0].textContent,
                date: game.childNodes[0].childNodes[1].textContent,
                score: game.childNodes[0].childNodes[2].textContent,
                element: game
            }
        });

        // Show all the games if this script is being run multiple times
        gamesList.forEach((game) => {
            game.element.style.display = "";
        });

        // Get the filter type
        const filterType = validPrompt("Filter you want to apply:\n1. Year.\n2. Score");

        // Apply the filter
        let filteredList = null;
        let excludedElements = null;
        let filterApplied = null;
        if (filterType === 1) {
            filterApplied = validPrompt("Year you want to get:");
            filteredList = gamesList.filter((game) => {return game.date.includes(filterApplied)}).reverse();
            excludedElements = gamesList.filter((game) => {return !game.date.includes(filterApplied)});
        } else if (filterType === 2) {
            filterApplied = validPrompt("Score you want to get:");
            filteredList = gamesList.filter((game) => {return game.score.split('/')[0] == filterApplied});
            excludedElements = gamesList.filter((game) => {return game.score.split('/')[0] != filterApplied});
        } else {
            alert("Not a valid input.");
        };

        // Print the filteredList in a cool way
        const listHeader = `Filtered list with ${filteredList.length} games. ${filterType === 1 ? "Year" : "Score"} ${filterApplied}`;
        let printList = `${listHeader}\n`;
        filteredList.forEach((game, index) => {
            printList += `${index + 1} => ${game.gameName}\n\t\t${game.score}\n\t\t${game.date}\n`;
        });
        console.log(printList);

        // Change the table header
        document.querySelector(gameListHeaderSel).textContent = listHeader;

        // Hide the excluded elements
        excludedElements.forEach((game) => {
            game.element.style.display = "none";
        });
    };



    // Check if the user is in the games page
    function addFilters () {
        let oldHref = "";
        const body = document.querySelector("body");
        const observer = new MutationObserver(mutations => {
            mutations.forEach(() => {
                if (oldHref !== document.location.href) {
                    oldHref = document.location.href;
                    if (document.location.href.match("/user/.*/games/.*") != null) {
                        // Wait for the lists to be loaded
                        waitForElement(gameListInfoSel).then(async (gameListInfo) => {
                            // Get the games list
                            const gameListRandom = gameListInfo.querySelector(gameListRandomSel);

                            // Check if the filter button already exists
                            if (gameListInfo.querySelector("#filterButton") != null) {
                                return;
                            }

                            // Add the filter button
                            const filterButton = gameListInfo.insertBefore(document.createElement("button"), gameListRandom);
                            filterButton.id = "filterButton";
                            filterButton.classList = "form_button back_blue";
                            filterButton.style.marginRight = "5px";
                            filterButton.innerHTML = "<span style=\"line-height: 0;\">Ⴤ</span> Filter";
                            filterButton.onclick = filterGames;
                        });
                    }
                }
            });
        });
        observer.observe(body, { childList: true, subtree: true });
    }

    //Start the script
    addFilters();
})();
