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
    window.calculateFootprint = () => {
        return {
            "navigator": {
                userAgent: navigator.userAgent,
            },
            // the following is very hacky, but Number.isInteger(5.0) === true
            "performance_now_isFloat": performance.now().toString().includes(".")
        }
    }
})();
