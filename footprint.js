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
    const FONTLIST = [
        "Fira Code", "Fira Sans", "Arial",
        "Segoe UI", "Droid Sans", "Source Code Pro",
        "Unifont", "Terminus", "Impact", "Noto Sans"
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
            fontFamily: "initial",
            fontSize: "42px"
        });
        testSpan.textContent = "mmmmmmmmmmlli"
        document.body.appendChild(testSpan);

        const defaultFontWidth = testSpan.getBoundingClientRect().width;

        const foundFonts = [];
        fonts.forEach(font => {
            testSpan.style.fontFamily = font;
            if (testSpan.getBoundingClientRect().width !== defaultFontWidth) {
                foundFonts.push(font);
            }
        })
        return foundFonts;
    }
    
    /**
     * run all tests
     * @returns Object containing all collected information
     */
    window.calculateFootprint = () => {
        return {
            navigator: {
                userAgent: navigator.userAgent,
                vendor: navigator.vendor
            },
            // the following is very hacky, but Number.isInteger(5.0) === true
            performance_now_isFloat: performance.now().toString().includes("."),
            foundFonts: testFonts(FONTLIST)
        }
    }
})();
