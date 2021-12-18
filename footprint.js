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

    const TESTS = [
        {
            key: "navigator",
            /**
             * get data available from window.navigator
             * @returns navigator data
             */
            test: async () => ({
                userAgent: navigator.userAgent,
                vendor: navigator.vendor
            }),
        },
        {
            key: "performance_now_isFloat",
            /**
             * test if performance.now() is a float
             * @returns result of the test
             */
            test: async () => {
                for (let i = 0; i < 5; i++) {
                    // the following is very hacky, but Number.isInteger(5.0) === true
                    if (performance.now().toString().includes(".")) return true;
                    await wait(2 + Math.random());
                }
                return false;
            }
        },
        {
            key: "fonts",
            /**
             * test for available fonts
             * @returns fonts found
             */
            test: async () => {
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
                [
                    "Fira Code", "Fira Sans", "Arial", "Comic Sans",
                    "Segoe UI", "Droid Sans", "Source Code Pro",
                    "Unifont", "Terminus", "Impact", "Noto Sans",
                    "Courier New", "Noto Color Emoji", "Twemoji Mozilla",
                    "Georgia", "Marlett", "Lucida Console", "Segoe UI Emoji",
                    "Segoe UI Symbol", "SimSun", "Tahoma", "Wingdings",
                    "Consolas"
                ].forEach(font => {
                    testSpan.style.fontFamily = `'${font}', sans-serif`;
                    if (testSpan.getBoundingClientRect().width !== defaultFontWidth) {
                        foundFonts.push(font);
                    }
                })
                document.body.removeChild(testSpan);
                return foundFonts;
            }
        },
        {
            key: "webgl",
            /**
             * run WebGL tests
             * @returns test results
             */
            test: async () => {
                const canvas = document.createElement("canvas");
                canvas.width = 100; canvas.height = 100;
                const gl = canvas.getContext("webgl");
                if (gl === null) return {
                    available: false,
                    vendor: null,
                    renderer: null
                };

                const glDebug = gl.getExtension("WEBGL_debug_renderer_info");
                const results = {
                    available: true,
                    vendor: gl.getParameter(glDebug.UNMASKED_VENDOR_WEBGL),
                    renderer: gl.getParameter(glDebug.UNMASKED_RENDERER_WEBGL)
                }
                gl.getExtension('WEBGL_lose_context').loseContext();
                return results;
            }
        },
        {
            key: "webgl2",
            /**
             * run WebGL 2.0 tests
             * @returns test results
             */
            test: async () => {
                const canvas = document.createElement("canvas");
                canvas.width = 100; canvas.height = 100;
                const gl = canvas.getContext("webgl2");
                if (gl === null) return {
                    available: false,
                    vendor: null,
                    renderer: null
                };

                const glDebug = gl.getExtension("WEBGL_debug_renderer_info");
                const results = {
                    available: true,
                    vendor: gl.getParameter(glDebug.UNMASKED_VENDOR_WEBGL),
                    renderer: gl.getParameter(glDebug.UNMASKED_RENDERER_WEBGL)
                }
                gl.getExtension('WEBGL_lose_context').loseContext();
                return results;
            }
        }
    ];

    /**
     * run all tests
     * @returns Object containing all collected information
     */
    window.calculateFootprint = async () => {
        const results = {};
        await Promise.all(TESTS.map(async ({key, test}) => {
            results[key] = await test();
            console.debug(key, results[key]);
        }));
        return results;
    }
})();
