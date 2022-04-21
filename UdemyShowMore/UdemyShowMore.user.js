// ==UserScript==
// @name         Udemy Show More
// @author       TheFallender
// @version      1.3
// @description  A script that will show all your elements in your collections.
// @homepageURL  https://github.com/TheFallender/TamperMonkeyScripts
// @updateURL    https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/UdemyShowMore/UdemyShowMore.user.js
// @downloadURL  https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/UdemyShowMore/UdemyShowMore.user.js
// @supportURL   https://github.com/TheFallender/TamperMonkeyScripts
// @match        https://www.udemy.com/home/my-courses/lists/
// @icon         https://www.google.com/s2/favicons?domain=udemy.com
// @license      MIT
// @copyright    Copyright © 2021 TheFallender
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    //Search wait
    const promiseWait = [
        //ms to wait
        100,
        //Times to perform the search before giving up
        100
    ]

    //Main selector for the show more
    const selector = 'div[role="button"][data-purpose="load-more-courses-for-collection"]';

    //Ratings
    const removeRatings = true;
    const ratingsSelector = '.details__bottom--review';

    window.onload = async function() {
        //See more list
        let seeMoreList = document.querySelectorAll(selector);

        //Wait until the page is fully loaded and it's able to get the element
        for (let i = 0; seeMoreList.length === 0; seeMoreList = document.querySelectorAll(selector), i++) {
            await new Promise(t => setTimeout(t, promiseWait[0]));
            if (i == promiseWait[1]) {
                console.log("UdemyShowMore ERROR: Selector not found.");
                return;
            }
        }

        //Loop all of the elements
        seeMoreList.forEach (element => {
            element.click();
            element.style.display = "none";
        });

        //Reset scroll
        window.scrollTo(0,0);

        //Remove Ratings
        if (removeRatings) {
            let elementSearch = document.querySelector(ratingsSelector);
            if (elementSearch) {
                elementSearch.setAttribute('style', 'display: none !important');
            }
        }
    }
})();