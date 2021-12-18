/*
 * This is free and unencumbered software released into the public domain.
 * See the Unlicense (LICENSE file) for more details.
 * footprint.js, a browser fingerprinting library
 * by chfour
 * 
 * DISCLAIMER: while this software *is* released into the public domain, please
 * don't use this outside of demonstrative or testing purposes, or to spy on
 * slash track people.
 * privacy is a human right.
 */
"use strict";

(() => {
    /**
     * wait for the specified amount of time in ms
     * @param {Number} duration the duration
     */
    function wait(duration) {
        return new Promise((resolve, reject) => setTimeout(resolve, duration));
    }

    const FONTLIST = [
        "Fira Code", "Fira Sans", "Arial", "Comic Sans",
        "Segoe UI", "Droid Sans", "Source Code Pro",
        "Unifont", "Terminus", "Impact", "Noto Sans",
        "Courier New", "Noto Color Emoji", "Twemoji Mozilla",
        "Georgia", "Marlett", "Lucida Console", "Segoe UI Emoji",
        "Segoe UI Symbol", "SimSun", "Tahoma", "Wingdings",
        "Consolas"
    ];

    /**
     * test if font is available
     * @param {Array} fonts the fonts to test
     * @returns fonts found
     */
    function testFonts(fonts) {
        const testSpan = document.createElement("span");
        Object.assign(testSpan.style, {
            visibility: "hidden",
            display: "block",
            position: "absolute",
            top: "0", left: "0",
            fontFamily: "sans-serif",
            fontSize: "42px"
        });
        testSpan.textContent = "mmmmmmmmmmlli";
        document.body.appendChild(testSpan);

        const defaultFontWidth = testSpan.getBoundingClientRect().width;

        const foundFonts = [];
        fonts.forEach(font => {
            testSpan.style.fontFamily = `'${font}', sans-serif`;
            if (testSpan.getBoundingClientRect().width !== defaultFontWidth) {
                foundFonts.push(font);
            }
        })
        document.body.removeChild(testSpan);
        return foundFonts;
    }
    
    /**
     * test if performance.now() is a float
     * @returns result of the test
     */
    async function testPerformanceNow() {
        for (let i = 0; i < 5; i++) {
            // the following is very hacky, but Number.isInteger(5.0) === true
            if (performance.now().toString().includes(".")) return true;
            await wait(2 + Math.random());
        }
        return false;
    }

    /**
     * run all tests
     * @returns Object containing all collected information
     */
    window.calculateFootprint = async () => {
        return {
            navigator: {
                userAgent: navigator.userAgent,
                vendor: navigator.vendor
            },
            performance_now_isFloat: await testPerformanceNow(),
            foundFonts: testFonts(FONTLIST)
        }
    }
})();
