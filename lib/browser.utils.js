"use strict";

var utils = exports;

/**
 * @returns {window}
 */
utils.getWindow = function () {
    return window;
};

/**
 * @returns {HTMLDocument}
 */
utils.getDocument = function () {
    return document;
};

/**
 * @returns {HTMLElement}
 */
utils.getBody = function () {
	return document.getElementsByTagName("body")[0];
};

/**
 * Get the current x/y position crossbow
 * @returns {{x: *, y: *}}
 */
utils.getBrowserScrollPosition = function () {

    var $window = exports.getWindow();
    var $document = exports.getDocument();
    var scrollX;
    var scrollY;
    var dElement = $document.documentElement;
    var dBody = $document.body;

    if ($window.pageYOffset !== undefined) {
        scrollX = $window.pageXOffset;
        scrollY = $window.pageYOffset;
    } else {
        scrollX = dElement.scrollLeft || dBody.scrollLeft || 0;
        scrollY = dElement.scrollTop || dBody.scrollTop || 0;
    }

    return {
        x: scrollX,
        y: scrollY
    };
};

/**
 * @returns {{x: number, y: number}}
 */
utils.getScrollSpace = function () {
    var $document = exports.getDocument();
    var dElement = $document.documentElement;
    var dBody = $document.body;
    return {
        x: dBody.scrollHeight - dElement.clientWidth,
        y: dBody.scrollHeight - dElement.clientHeight
    };
};

/**
 * Saves scroll position into cookies
 */
utils.saveScrollPosition = function () {
    var pos = utils.getBrowserScrollPosition();
    pos = [pos.x, pos.y];
    utils.getDocument.cookie = "bs_scroll_pos=" + pos.join(",");
};

/**
 * Restores scroll position from cookies
 */
utils.restoreScrollPosition = function () {
    var pos = utils.getDocument().cookie.replace(/(?:(?:^|.*;\s*)bs_scroll_pos\s*\=\s*([^;]*).*$)|^.*$/, "$1").split(",");
    utils.getWindow().scrollTo(pos[0], pos[1]);
};

/**
 * @param tagName
 * @param elem
 * @returns {*|number}
 */
utils.getElementIndex = function (tagName, elem) {
    var allElems = utils.getDocument().getElementsByTagName(tagName);
    return Array.prototype.indexOf.call(allElems, elem);
};

/**
 * Force Change event on radio & checkboxes (IE)
 */
utils.forceChange = function (elem) {
    elem.blur();
    elem.focus();
};

/**
 * @param elem
 * @returns {{tagName: (elem.tagName|*), index: *}}
 */
utils.getElementData = function (elem) {
    var tagName = elem.tagName;
    var index = utils.getElementIndex(tagName, elem);
    return {
        tagName: tagName,
        index:   index
    };
};

/**
 * @param {string} tagName
 * @param {number} index
 */
utils.getSingleElement = function (tagName, index) {
    var elems = utils.getDocument().getElementsByTagName(tagName);
    return elems[index];
};

/**
 * Get the body element
 */
utils.getBody = function () {
    return utils.getDocument().getElementsByTagName("body")[0];
};

/**
 * @param {{x: number, y: number}} pos
 */
utils.setScroll = function (pos) {
    utils.getWindow().scrollTo(pos.x, pos.y);
};

/**
 * Set up functionality to reload only when tab is in focus.
 * This prevents too many unwanted connections to the dev server.
 */
var tab_needs_reload = false;
var tab_hidden, tab_state, tab_visibilityChange;

if (typeof document.hidden !== "undefined") {
    tab_hidden = "hidden";
    tab_visibilityChange = "visibilitychange";
    tab_state = "visibilityState";
} else if (typeof document.mozHidden !== "undefined") {
    tab_hidden = "mozHidden";
    tab_visibilityChange = "mozvisibilitychange";
    tab_state = "mozVisibilityState";
} else if (typeof document.msHidden !== "undefined") {
    tab_hidden = "msHidden";
    tab_visibilityChange = "msvisibilitychange";
    tab_state = "msVisibilityState";
} else if (typeof document.webkitHidden !== "undefined") {
    tab_hidden = "webkitHidden";
    tab_visibilityChange = "webkitvisibilitychange";
    tab_state = "webkitVisibilityState";
}

document.addEventListener(tab_visibilityChange, function(evt) {
    doReload()
}, false);


/**
 * Hard reload
 */
utils.reloadBrowser = function () {
    tab_needs_reload = true;
    doReload();
};

function doReload() {
    if ( !document[tab_hidden] ) {
        if (tab_needs_reload) {
            utils.getWindow().location.reload(true);
        } else {
            setTimeout(doReload,500)
        }
    } else {
        setTimeout(doReload,500)
    }
}


/**
 * Foreach polyfill
 * @param coll
 * @param fn
 */
utils.forEach = function (coll, fn) {
    for (var i = 0, n = coll.length; i < n; i += 1) {
        fn(coll[i], i, coll);
    }
};

/**
 * Are we dealing with old IE?
 * @returns {boolean}
 */
utils.isOldIe = function () {
    return typeof utils.getWindow().attachEvent !== "undefined";
};