// ==UserScript==
// @name         Reddit Mass Unhide
// @author       TheFallender
// @version      1.1
// @description  This script will unhide all your hidden posts, cause reddit sucks and doesn't have this feature by default.
// @homepageURL  https://github.com/TheFallender/TamperMonkeyScripts
// @updateURL    https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/RedditMassUnhide/RedditMassUnhide.user.js
// @downloadURL  https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/RedditMassUnhide/RedditMassUnhide.user.js
// @supportURL   https://github.com/TheFallender/TamperMonkeyScripts
// @match        https://www.reddit.com/user/*/hidden/
// @icon         https://www.google.com/s2/favicons?domain=reddit.com
// @license      MIT
// @copyright    Copyright © 2022 TheFallender
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @require      http://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    //Wait time: Time to wait between changes.
    const timeBetweenWaits = 250;

    //Hidden posts var
    let currentHiddenPosts = [];

    //Iterations done
    let iterations = 0;

    //Iteration limit
    let iterationsLimit = 10;

    window.onload = async function() {
        //Timeout for each transition
        const interval = setInterval(function() {
            //Refresh hidden posts list
			if (currentHiddenPosts.length == 0) {
                //Scroll to the bottom to force a refresh
                window.scrollTo(0, document.body.scrollHeight);

                //Get posts
				currentHiddenPosts = $("button:has(span:contains('unhide'))").toArray();

                //Remove the toasts
                let divOfTheToasts = $("div:has(> div > div > svg.CloseIcon)").toArray();
                if (divOfTheToasts.length > 0) {
                    divOfTheToasts[0].remove();
                }

                //Increase iterations
                if (++iterations >= iterationsLimit) {
                    clearInterval(interval);
                    location.reload();
				}
			}

			//Unhide hidden post
			currentHiddenPosts.shift().click();
        }, timeBetweenWaits);
    }
})();