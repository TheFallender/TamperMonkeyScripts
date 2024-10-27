// ==UserScript==
// @name         Anilist Source Split
// @author       TheFallender
// @version      1.0.0
// @description  Will split the source list into anime, manga, and light novels and put the most relevant at the top
// @homepageURL  https://github.com/TheFallender/TamperMonkeyScripts
// @updateURL    https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/AnilistSourceSplit/AnilistSourceSplit.user.js
// @downloadURL  https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/AnilistSourceSplit/AnilistSourceSplit.user.js
// @supportURL   https://github.com/TheFallender/TamperMonkeyScripts
// @match        https://anilist.co/*/*/*
// @require      https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/_Shared/WaitForElement.js
// @icon         https://www.google.com/s2/favicons?domain=anilist.co
// @license      MIT
// @copyright    Copyright © 2024 TheFallender
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    // Selectors
    const sourceListSel = ".relations > div:has(.media-preview-card)";
    const contentTypeSel = ".data > .data-set";

    // Header size
    const headerSize = 4;

    // Get the type of material we are seeing
    let contentType;

    // Data set get
    function getValueByType(dataSets, key) {
        const dataSet = dataSets.find(
            (set) => set.querySelector(".type")?.innerText.trim() === key
        );

        return dataSet?.querySelector(".value")?.innerText.trim() || null;
    }

    // Function to filter sources and return the filtered and not filtered sources
    function filterSource(sourceList, condition) {
        const filtered = sourceList.filter(condition);
        const notFiltered = sourceList.filter((item) => !condition(item));

        return { filtered, notFiltered };
    }

    // Function to get the list of each sources
    function getSourcesList(sourceList) {
        // Filter Anime sources
        const animeFilter = filterSource(sourceList, (x) => {
            return (
                x.type === "TV" ||
                x.type === "TV Short" ||
                x.type === "Movie" ||
                x.type === "OVA" ||
                x.type === "ONA"
            );
        });
        const animeSource = animeFilter.filtered;
        sourceList = animeFilter.notFiltered;

        // Filter Manga sources
        const mangaFilter = filterSource(sourceList, (x) => {
            return x.type === "Manga";
        });
        const mangaSource = mangaFilter.filtered;
        sourceList = mangaFilter.notFiltered;

        // Filter Light Novel sources
        const lightNovelFilter = filterSource(sourceList, (x) => {
            return x.type === "Light Novel";
        });
        const lightNovelSource = lightNovelFilter.filtered;
        sourceList = lightNovelFilter.notFiltered;

        // Others
        const otherSources = sourceList;

        return { animeSource, mangaSource, lightNovelSource, otherSources };
    }

    // Header builder
    function headerBuilder(content) {
        const header = document.createElement(`h${headerSize}`);
		header.style.gridColumn = '1 / -1';
        header.appendChild(document.createTextNode(content));
        return header;
    }

    // Append list
    function appendList(sourceContainer, elementList, type) {
        // Abort if there are no sources
        if (elementList.length === 0) {
            return;
        }

        // Add the header
        sourceContainer.appendChild(headerBuilder(type));

        // Add the list
        elementList.forEach((source) => {
            sourceContainer.appendChild(source.element);
        });
    }

    // Rebuild Sources
    function rebuildSources(sourceContainer) {
        // Get the sources from the grid
        const sources = Array.from(
            sourceContainer.querySelectorAll(".media-preview-card")
        );

        // Get the type of source
        let sourceType = sources.map((x) => {
            return {
                type: x.querySelector(".info").textContent.split(" · ")[0],
                element: x,
            };
        });

        // Get the list of each source
        const { animeSource, mangaSource, lightNovelSource, otherSources } =
            getSourcesList(sourceType);

        // Now rebuild the source list
        sourceContainer.innerHTML = "";

        // Check the content type and add the sources with a dict
        switch (contentType) {
            case "anime":
				appendList(sourceContainer, animeSource, "Anime");
				appendList(sourceContainer, mangaSource, "Manga");
				appendList(sourceContainer, lightNovelSource, "Light Novel");
				break;
            case "manga":
				appendList(sourceContainer, mangaSource, "Manga");
				appendList(sourceContainer, animeSource, "Anime");
				appendList(sourceContainer, lightNovelSource, "Light Novel");
                break;
            case "light_novel":
				appendList(sourceContainer, lightNovelSource, "Light Novel");
				appendList(sourceContainer, animeSource, "Anime");
				appendList(sourceContainer, mangaSource, "Manga");
                break;
        }

        // Add the others
		appendList(sourceContainer, otherSources, "Others");
    }

    // Start of the script
    function rebuildSourcesCheck() {
        let oldHref = "";
        const body = document.querySelector("body");
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(() => {
                if (oldHref !== document.location.href) {
                    oldHref = document.location.href;

                    // Get the content type
                    waitForElement(contentTypeSel, null, true).then((dataSets) => {
                        // Get the content type
                        contentType = getValueByType(dataSets, "Format");

                        // Check the content type
                        if (
                            ["TV", "TV Short", "Movie", "OVA", "ONA"].includes(contentType)
                        ) {
                            contentType = "anime";
                        } else if (contentType === "Manga") {
                            contentType = "manga";
                        } else if (contentType === "Light Novel") {
                            contentType = "light_novel";
                        } else {
							return;
						}

                        // Wait for the source list
                        waitForElement(sourceListSel).then((element) =>
                            rebuildSources(element)
                        );
                    });
                }
            });
        });
        observer.observe(body, { childList: true, subtree: true });
    }

    // Start the script
    rebuildSourcesCheck();
})();
