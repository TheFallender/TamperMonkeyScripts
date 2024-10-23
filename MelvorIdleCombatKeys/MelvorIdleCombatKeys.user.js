// ==UserScript==
// @name         Melvor Idle Combat Hotkeys
// @description  This script will allow you to switch between combat sets with the numpad keys
// @author       TheFallender
// @version      1.0.0
// @homepageURL  https://github.com/TheFallender/TamperMonkeyScripts
// @updateURL    https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/MelvorIdleCombatKeys/MelvorIdleCombatKeys.user.js
// @downloadURL  https://raw.githubusercontent.com/TheFallender/TamperMonkeyScripts/master/MelvorIdleCombatKeys/MelvorIdleCombatKeys.user.js
// @match        https://melvoridle.com/index_game.php
// @icon         https://www.google.com/s2/favicons?domain=melvoridle.com
// @license      MIT
// @copyright    Copyright © 2024 TheFallender
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if (event.code === 'NumpadAdd') {
            document.querySelector("button:has(> lang-string[lang-id=\"COMBAT_MISC_84\"]").click();
            return;
        }

        const numpadButton = event.code.match(/Numpad(\d+)/)
        if (numpadButton) {
            const number = Number(numpadButton[1])
            if (number < 1 || number > 8) {
                return;
            }
            document.querySelector(`#combat-equipment-set-menu-0 > button:nth-of-type(${number})`).click();
        }
    });

})();
