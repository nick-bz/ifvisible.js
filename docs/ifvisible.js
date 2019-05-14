(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.ts":
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var ifvisible_1 = __webpack_require__(/*! ./src/ifvisible */ "./src/ifvisible.ts");
var root = typeof self === "object" && self.self === self && self ||
    typeof global === "object" && global.global === global && global ||
    this;
exports.ifvisible = new ifvisible_1.IfVisible(root, document);
__export(__webpack_require__(/*! ./src/ifvisible */ "./src/ifvisible.ts"));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./src/ifvisible.ts":
/*!**************************!*\
  !*** ./src/ifvisible.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var STATUS_ACTIVE = "active";
var STATUS_IDLE = "idle";
var STATUS_HIDDEN = "hidden";
var DOC_HIDDEN;
var VISIBILITY_CHANGE_EVENT = void 0;
var Events;
(function (Events) {
    var store = {};
    var setListener;
    function attach(event, callback) {
        if (!store[event]) {
            store[event] = [];
        }
        // console.log("seko");
        store[event].push(callback);
    }
    Events.attach = attach;
    function fire(event, args) {
        if (store[event]) {
            store[event].forEach(function (callback) {
                callback.apply(void 0, args);
            });
        }
    }
    Events.fire = fire;
    function remove(event, callback) {
        if (store[event]) {
            store[event] = store[event].filter(function (savedCallback) {
                return callback !== savedCallback;
            });
        }
    }
    Events.remove = remove;
    function dom(element, event, callback) {
        if (!setListener) {
            if (element.addEventListener) {
                setListener = function (el, ev, fn) {
                    return el.addEventListener(ev, fn, false);
                };
            }
            else if (typeof element["attachEvent"] === "function") {
                setListener = function (el, ev, fn) {
                    return el.attachEvent("on" + ev, fn, false);
                };
            }
            else {
                setListener = function (el, ev, fn) {
                    return el["on" + ev] = fn;
                };
            }
        }
        return setListener(element, event, callback);
    }
    Events.dom = dom;
})(Events = exports.Events || (exports.Events = {}));
var Timer = /** @class */ (function () {
    function Timer(ifvisible, seconds, callback) {
        var _this = this;
        this.ifvisible = ifvisible;
        this.seconds = seconds;
        this.callback = callback;
        this.stopped = false;
        this.start();
        this.ifvisible.on("statusChanged", function (data) {
            if (_this.stopped === false) {
                if (data.status === STATUS_ACTIVE) {
                    _this.start();
                }
                else {
                    _this.pause();
                }
            }
        });
    }
    Timer.prototype.start = function () {
        this.stopped = false;
        clearInterval(this.token);
        this.token = setInterval(this.callback, this.seconds * 1000);
    };
    Timer.prototype.stop = function () {
        this.stopped = true;
        clearInterval(this.token);
    };
    Timer.prototype.resume = function () {
        this.start();
    };
    Timer.prototype.pause = function () {
        this.stop();
    };
    return Timer;
}());
exports.Timer = Timer;
exports.IE = (function () {
    var undef, v = 3, div = document.createElement("div"), all = div.getElementsByTagName("i");
    while (div.innerHTML = "<!--[if gt IE " + (++v) + "]><i></i><![endif]-->",
        all[0])
        ;
    return v > 4 ? v : undef;
}());
var IfVisible = /** @class */ (function () {
    function IfVisible(root, doc) {
        var _this = this;
        this.root = root;
        this.doc = doc;
        this.status = STATUS_ACTIVE;
        this.VERSION = '';
        this.idleTime = 30000;
        var BLUR_EVENT = "blur";
        var FOCUS_EVENT = "focus";
        // Find correct browser events
        if (this.doc.hidden !== void 0) {
            DOC_HIDDEN = "hidden";
            VISIBILITY_CHANGE_EVENT = "visibilitychange";
        }
        else if (this.doc["mozHidden"] !== void 0) {
            DOC_HIDDEN = "mozHidden";
            VISIBILITY_CHANGE_EVENT = "mozvisibilitychange";
        }
        else if (this.doc["msHidden"] !== void 0) {
            DOC_HIDDEN = "msHidden";
            VISIBILITY_CHANGE_EVENT = "msvisibilitychange";
        }
        else if (this.doc["webkitHidden"] !== void 0) {
            DOC_HIDDEN = "webkitHidden";
            VISIBILITY_CHANGE_EVENT = "webkitvisibilitychange";
        }
        if (DOC_HIDDEN === void 0) {
            if (exports.IE < 9) {
                BLUR_EVENT = "focusout";
            }
            Events.dom(this.root, BLUR_EVENT, function () {
                return _this.blur();
            });
            Events.dom(this.root, FOCUS_EVENT, function () {
                return _this.focus();
            });
        }
        else {
            var trackChange = function () {
                if (_this.doc[DOC_HIDDEN]) {
                    _this.blur();
                }
                else {
                    _this.focus();
                }
            };
            trackChange(); // get initial status
            Events.dom(this.doc, VISIBILITY_CHANGE_EVENT, trackChange);
        }
        this.startIdleTimer();
        this.trackIdleStatus();
    }
    IfVisible.prototype.startIdleTimer = function (event) {
        var _this = this;
        // Prevents Phantom events.
        // @see https://github.com/serkanyersen/ifvisible.js/pull/37
        if (event instanceof MouseEvent && event.movementX === 0 && event.movementY === 0) {
            return;
        }
        clearTimeout(this.timer);
        if (this.status === STATUS_IDLE) {
            this.wakeup();
        }
        this.idleStartedTime = +(new Date());
        this.timer = setTimeout(function () {
            if (_this.status === STATUS_ACTIVE || _this.status === STATUS_HIDDEN) {
                return _this.idle();
            }
        }, this.idleTime);
    };
    IfVisible.prototype.trackIdleStatus = function () {
        Events.dom(this.doc, "mousemove", this.startIdleTimer.bind(this));
        Events.dom(this.doc, "mousedown", this.startIdleTimer.bind(this));
        Events.dom(this.doc, "keyup", this.startIdleTimer.bind(this));
        Events.dom(this.doc, "touchstart", this.startIdleTimer.bind(this));
        Events.dom(this.root, "scroll", this.startIdleTimer.bind(this));
        // this.focus(wakeUp);
        // this.wakeup(wakeUp);
    };
    IfVisible.prototype.on = function (event, callback) {
        Events.attach(event, callback);
        return this;
    };
    IfVisible.prototype.off = function (event, callback) {
        Events.remove(event, callback);
        return this;
    };
    IfVisible.prototype.setIdleDuration = function (seconds) {
        this.idleTime = seconds * 1000;
        this.startIdleTimer();
        return this;
    };
    IfVisible.prototype.getIdleDuration = function () {
        return this.idleTime;
    };
    IfVisible.prototype.getIdleInfo = function () {
        var now = +(new Date());
        var res;
        if (this.status === STATUS_IDLE) {
            res = {
                isIdle: true,
                idleFor: now - this.idleStartedTime,
                timeLeft: 0,
                timeLeftPer: 100
            };
        }
        else {
            var timeLeft = (this.idleStartedTime + this.idleTime) - now;
            res = {
                isIdle: false,
                idleFor: now - this.idleStartedTime,
                timeLeft: timeLeft,
                timeLeftPer: parseFloat((100 - (timeLeft * 100 / this.idleTime)).toFixed(2))
            };
        }
        return res;
    };
    IfVisible.prototype.idle = function (callback) {
        if (callback) {
            this.on("idle", callback);
        }
        else {
            this.status = STATUS_IDLE;
            Events.fire("idle");
            Events.fire("statusChanged", [{ status: this.status }]);
        }
        return this;
    };
    IfVisible.prototype.blur = function (callback) {
        if (callback) {
            this.on("blur", callback);
        }
        else {
            this.status = STATUS_HIDDEN;
            Events.fire("blur");
            Events.fire("statusChanged", [{ status: this.status }]);
        }
        return this;
    };
    IfVisible.prototype.focus = function (callback) {
        if (callback) {
            this.on("focus", callback);
        }
        else if (this.status !== STATUS_ACTIVE) {
            this.status = STATUS_ACTIVE;
            Events.fire("focus");
            Events.fire("wakeup");
            Events.fire("statusChanged", [{ status: this.status }]);
        }
        return this;
    };
    IfVisible.prototype.wakeup = function (callback) {
        if (callback) {
            this.on("wakeup", callback);
        }
        else if (this.status !== STATUS_ACTIVE) {
            this.status = STATUS_ACTIVE;
            Events.fire("wakeup");
            Events.fire("statusChanged", [{ status: this.status }]);
        }
        return this;
    };
    IfVisible.prototype.onEvery = function (seconds, callback) {
        return new Timer(this, seconds, callback);
    };
    IfVisible.prototype.now = function (check) {
        if (check !== void 0) {
            return this.status === check;
        }
        else {
            return this.status === STATUS_ACTIVE;
        }
    };
    return IfVisible;
}());
exports.IfVisible = IfVisible;


/***/ }),

/***/ 0:
/*!************************!*\
  !*** multi ./index.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./index.ts */"./index.ts");


/***/ })

/******/ });
});