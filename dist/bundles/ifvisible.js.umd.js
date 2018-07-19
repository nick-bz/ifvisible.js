(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define('ifvisible.js', ['exports'], factory) :
    (factory((global.ifvisible = global.ifvisible || {}, global.ifvisible.js = {})));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var /** @type {?} */ STATUS_ACTIVE = "active";
    var /** @type {?} */ STATUS_IDLE = "idle";
    var /** @type {?} */ STATUS_HIDDEN = "hidden";
    var /** @type {?} */ DOC_HIDDEN;
    var /** @type {?} */ VISIBILITY_CHANGE_EVENT = void 0;
    (function (Events) {
        var /** @type {?} */ store = {};
        var /** @type {?} */ setListener;
        /**
         * @param {?} event
         * @param {?} callback
         * @return {?}
         */
        function attach(event, callback) {
            if (!store[event]) {
                store[event] = [];
            }
            // console.log("seko");
            store[event].push(callback);
        }
        Events.attach = attach;
        /**
         * @param {?} event
         * @param {?=} args
         * @return {?}
         */
        function fire(event, args) {
            if (store[event]) {
                store[event].forEach(function (callback) {
                    callback.apply(void 0, __spread(args));
                });
            }
        }
        Events.fire = fire;
        /**
         * @param {?} event
         * @param {?} callback
         * @return {?}
         */
        function remove(event, callback) {
            if (store[event]) {
                store[event] = store[event].filter(function (savedCallback) {
                    return callback !== savedCallback;
                });
            }
        }
        Events.remove = remove;
        /**
         * @param {?} element
         * @param {?} event
         * @param {?} callback
         * @return {?}
         */
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
    })(exports.Events || (exports.Events = {}));
    var Timer = (function () {
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
        /**
         * @return {?}
         */
        Timer.prototype.start = /**
         * @return {?}
         */
            function () {
                this.stopped = false;
                clearInterval(this.token);
                this.token = setInterval(this.callback, this.seconds * 1000);
            };
        /**
         * @return {?}
         */
        Timer.prototype.stop = /**
         * @return {?}
         */
            function () {
                this.stopped = true;
                clearInterval(this.token);
            };
        /**
         * @return {?}
         */
        Timer.prototype.resume = /**
         * @return {?}
         */
            function () {
                this.start();
            };
        /**
         * @return {?}
         */
        Timer.prototype.pause = /**
         * @return {?}
         */
            function () {
                this.stop();
            };
        return Timer;
    }());
    var /** @type {?} */ IE = (function () {
        var /** @type {?} */ undef, /** @type {?} */ v = 3, /** @type {?} */ div = document.createElement("div"), /** @type {?} */ all = div.getElementsByTagName("i");
        while (div.innerHTML = "<!--[if gt IE " + (++v) + "]><i></i><![endif]-->",
            all[0])
            ;
        return v > 4 ? v : undef;
    }());
    var IfVisible = (function () {
        function IfVisible(root, doc) {
            var _this = this;
            this.root = root;
            this.doc = doc;
            this.status = STATUS_ACTIVE;
            this.VERSION = '';
            this.idleTime = 30000;
            var /** @type {?} */ BLUR_EVENT = "blur";
            var /** @type {?} */ FOCUS_EVENT = "focus";
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
                if (IE < 9) {
                    BLUR_EVENT = "focusout";
                }
                exports.Events.dom(this.root, BLUR_EVENT, function () {
                    return _this.blur();
                });
                exports.Events.dom(this.root, FOCUS_EVENT, function () {
                    return _this.focus();
                });
            }
            else {
                var /** @type {?} */ trackChange = function () {
                    if (_this.doc[DOC_HIDDEN]) {
                        _this.blur();
                    }
                    else {
                        _this.focus();
                    }
                };
                trackChange(); // get initial status
                exports.Events.dom(this.doc, VISIBILITY_CHANGE_EVENT, trackChange);
            }
            this.startIdleTimer();
            this.trackIdleStatus();
        }
        /**
         * @param {?=} event
         * @return {?}
         */
        IfVisible.prototype.startIdleTimer = /**
         * @param {?=} event
         * @return {?}
         */
            function (event) {
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
        /**
         * @return {?}
         */
        IfVisible.prototype.trackIdleStatus = /**
         * @return {?}
         */
            function () {
                exports.Events.dom(this.doc, "mousemove", this.startIdleTimer.bind(this));
                exports.Events.dom(this.doc, "mousedown", this.startIdleTimer.bind(this));
                exports.Events.dom(this.doc, "keyup", this.startIdleTimer.bind(this));
                exports.Events.dom(this.doc, "touchstart", this.startIdleTimer.bind(this));
                exports.Events.dom(this.root, "scroll", this.startIdleTimer.bind(this));
                // this.focus(wakeUp);
                // this.wakeup(wakeUp);
            };
        /**
         * @param {?} event
         * @param {?} callback
         * @return {?}
         */
        IfVisible.prototype.on = /**
         * @param {?} event
         * @param {?} callback
         * @return {?}
         */
            function (event, callback) {
                exports.Events.attach(event, callback);
                return this;
            };
        /**
         * @param {?} event
         * @param {?=} callback
         * @return {?}
         */
        IfVisible.prototype.off = /**
         * @param {?} event
         * @param {?=} callback
         * @return {?}
         */
            function (event, callback) {
                exports.Events.remove(event, callback);
                return this;
            };
        /**
         * @param {?} seconds
         * @return {?}
         */
        IfVisible.prototype.setIdleDuration = /**
         * @param {?} seconds
         * @return {?}
         */
            function (seconds) {
                this.idleTime = seconds * 1000;
                this.startIdleTimer();
                return this;
            };
        /**
         * @return {?}
         */
        IfVisible.prototype.getIdleDuration = /**
         * @return {?}
         */
            function () {
                return this.idleTime;
            };
        /**
         * @return {?}
         */
        IfVisible.prototype.getIdleInfo = /**
         * @return {?}
         */
            function () {
                var /** @type {?} */ now = +(new Date());
                var /** @type {?} */ res;
                if (this.status === STATUS_IDLE) {
                    res = {
                        isIdle: true,
                        idleFor: now - this.idleStartedTime,
                        timeLeft: 0,
                        timeLeftPer: 100
                    };
                }
                else {
                    var /** @type {?} */ timeLeft = (this.idleStartedTime + this.idleTime) - now;
                    res = {
                        isIdle: false,
                        idleFor: now - this.idleStartedTime,
                        timeLeft: timeLeft,
                        timeLeftPer: parseFloat((100 - (timeLeft * 100 / this.idleTime)).toFixed(2))
                    };
                }
                return res;
            };
        /**
         * @param {?=} callback
         * @return {?}
         */
        IfVisible.prototype.idle = /**
         * @param {?=} callback
         * @return {?}
         */
            function (callback) {
                if (callback) {
                    this.on("idle", callback);
                }
                else {
                    this.status = STATUS_IDLE;
                    exports.Events.fire("idle");
                    exports.Events.fire("statusChanged", [{ status: this.status }]);
                }
                return this;
            };
        /**
         * @param {?=} callback
         * @return {?}
         */
        IfVisible.prototype.blur = /**
         * @param {?=} callback
         * @return {?}
         */
            function (callback) {
                if (callback) {
                    this.on("blur", callback);
                }
                else {
                    this.status = STATUS_HIDDEN;
                    exports.Events.fire("blur");
                    exports.Events.fire("statusChanged", [{ status: this.status }]);
                }
                return this;
            };
        /**
         * @param {?=} callback
         * @return {?}
         */
        IfVisible.prototype.focus = /**
         * @param {?=} callback
         * @return {?}
         */
            function (callback) {
                if (callback) {
                    this.on("focus", callback);
                }
                else if (this.status !== STATUS_ACTIVE) {
                    this.status = STATUS_ACTIVE;
                    exports.Events.fire("focus");
                    exports.Events.fire("wakeup");
                    exports.Events.fire("statusChanged", [{ status: this.status }]);
                }
                return this;
            };
        /**
         * @param {?=} callback
         * @return {?}
         */
        IfVisible.prototype.wakeup = /**
         * @param {?=} callback
         * @return {?}
         */
            function (callback) {
                if (callback) {
                    this.on("wakeup", callback);
                }
                else if (this.status !== STATUS_ACTIVE) {
                    this.status = STATUS_ACTIVE;
                    exports.Events.fire("wakeup");
                    exports.Events.fire("statusChanged", [{ status: this.status }]);
                }
                return this;
            };
        /**
         * @param {?} seconds
         * @param {?} callback
         * @return {?}
         */
        IfVisible.prototype.onEvery = /**
         * @param {?} seconds
         * @param {?} callback
         * @return {?}
         */
            function (seconds, callback) {
                return new Timer(this, seconds, callback);
            };
        /**
         * @param {?=} check
         * @return {?}
         */
        IfVisible.prototype.now = /**
         * @param {?=} check
         * @return {?}
         */
            function (check) {
                if (check !== void 0) {
                    return this.status === check;
                }
                else {
                    return this.status === STATUS_ACTIVE;
                }
            };
        return IfVisible;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var /** @type {?} */ root = typeof self === "object" && self.self === self && self ||
        typeof global === "object" && global.global === global && global ||
        this;
    var /** @type {?} */ ifvisible = new IfVisible(root, document);

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */

    exports.ifvisible = ifvisible;
    exports.Timer = Timer;
    exports.IE = IE;
    exports.IfVisible = IfVisible;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWZ2aXNpYmxlLmpzLnVtZC5qcy5tYXAiLCJzb3VyY2VzIjpbbnVsbCwibmc6Ly9pZnZpc2libGUuanMvc3JjL2lmdmlzaWJsZS50cyIsIm5nOi8vaWZ2aXNpYmxlLmpzL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlXHJcbnRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlXHJcbkxpY2Vuc2UgYXQgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcblxyXG5USElTIENPREUgSVMgUFJPVklERUQgT04gQU4gKkFTIElTKiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXHJcbktJTkQsIEVJVEhFUiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBXSVRIT1VUIExJTUlUQVRJT04gQU5ZIElNUExJRURcclxuV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIFRJVExFLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSxcclxuTUVSQ0hBTlRBQkxJVFkgT1IgTk9OLUlORlJJTkdFTUVOVC5cclxuXHJcblNlZSB0aGUgQXBhY2hlIFZlcnNpb24gMi4wIExpY2Vuc2UgZm9yIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9uc1xyXG5hbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMClcclxuICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBleHBvcnRzKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmICghZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgZXhwb3J0c1twXSA9IG1bcF07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl0sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7IH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlbbl0gPSBvW25dID8gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIHJlc3VsdFtrXSA9IG1vZFtrXTtcclxuICAgIHJlc3VsdC5kZWZhdWx0ID0gbW9kO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuIiwiY29uc3QgU1RBVFVTX0FDVElWRSA9IFwiYWN0aXZlXCI7XG5jb25zdCBTVEFUVVNfSURMRSA9IFwiaWRsZVwiO1xuY29uc3QgU1RBVFVTX0hJRERFTiA9IFwiaGlkZGVuXCI7XG5cbmxldCBET0NfSElEREVOOiBzdHJpbmc7XG5sZXQgVklTSUJJTElUWV9DSEFOR0VfRVZFTlQ6IHN0cmluZyA9IHZvaWQgMDtcblxuZXhwb3J0IG5hbWVzcGFjZSBFdmVudHMge1xuICAgIGNvbnN0IHN0b3JlID0ge307XG4gICAgbGV0IHNldExpc3RlbmVyOiBGdW5jdGlvbjtcblxuICAgIGV4cG9ydCBmdW5jdGlvbiBhdHRhY2goZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uKSB7XG4gICAgICAgIGlmICghc3RvcmVbZXZlbnRdKSB7XG4gICAgICAgICAgICBzdG9yZVtldmVudF0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInNla29cIik7XG4gICAgICAgIHN0b3JlW2V2ZW50XS5wdXNoKGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICBleHBvcnQgZnVuY3Rpb24gZmlyZShldmVudDogc3RyaW5nLCBhcmdzPzogYW55W10pIHtcbiAgICAgICAgaWYgKHN0b3JlW2V2ZW50XSkge1xuICAgICAgICAgICAgc3RvcmVbZXZlbnRdLmZvckVhY2goKGNhbGxiYWNrKSA9PiB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soLi4uYXJncyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBmdW5jdGlvbiByZW1vdmUoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uKSB7XG4gICAgICAgIGlmIChzdG9yZVtldmVudF0pIHtcbiAgICAgICAgICAgIHN0b3JlW2V2ZW50XSA9IHN0b3JlW2V2ZW50XS5maWx0ZXIoKHNhdmVkQ2FsbGJhY2spID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sgIT09IHNhdmVkQ2FsbGJhY2s7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBmdW5jdGlvbiBkb20oZWxlbWVudDogYW55LCBldmVudDogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24pIHtcbiAgICAgICAgaWYgKCFzZXRMaXN0ZW5lcikge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIHNldExpc3RlbmVyID0gZnVuY3Rpb24gKGVsLCBldiwgZm4pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsLmFkZEV2ZW50TGlzdGVuZXIoZXYsIGZuLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGVsZW1lbnRbXCJhdHRhY2hFdmVudFwiXSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgc2V0TGlzdGVuZXIgPSBmdW5jdGlvbiAoZWwsIGV2LCBmbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWwuYXR0YWNoRXZlbnQoXCJvblwiICsgZXYsIGZuLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2V0TGlzdGVuZXIgPSBmdW5jdGlvbiAoZWwsIGV2LCBmbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxbXCJvblwiICsgZXZdID0gZm47XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2V0TGlzdGVuZXIoZWxlbWVudCwgZXZlbnQsIGNhbGxiYWNrKTtcbiAgICB9XG5cbn1cblxuZXhwb3J0IGludGVyZmFjZSBJZGxlSW5mbyB7XG4gICAgaXNJZGxlOiBib29sZWFuO1xuICAgIGlkbGVGb3I6IG51bWJlcjtcbiAgICB0aW1lTGVmdDogbnVtYmVyO1xuICAgIHRpbWVMZWZ0UGVyOiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBUaW1lciB7XG4gICAgcHJpdmF0ZSB0b2tlbjogbnVtYmVyO1xuICAgIHN0b3BwZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaWZ2aXNpYmxlOiBJZlZpc2libGUsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBzZWNvbmRzOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBjYWxsYmFjazogRnVuY3Rpb24pIHtcbiAgICAgICAgdGhpcy5zdGFydCgpO1xuXG4gICAgICAgIHRoaXMuaWZ2aXNpYmxlLm9uKFwic3RhdHVzQ2hhbmdlZFwiLCAoZGF0YTogYW55KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdG9wcGVkID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLnN0YXR1cyA9PT0gU1RBVFVTX0FDVElWRSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXVzZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGFydCgpIHtcbiAgICAgICAgdGhpcy5zdG9wcGVkID0gZmFsc2U7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50b2tlbik7XG4gICAgICAgIHRoaXMudG9rZW4gPSBzZXRJbnRlcnZhbCh0aGlzLmNhbGxiYWNrLCB0aGlzLnNlY29uZHMgKiAxMDAwKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RvcCgpIHtcbiAgICAgICAgdGhpcy5zdG9wcGVkID0gdHJ1ZTtcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRva2VuKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVzdW1lKCkge1xuICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgfVxuXG4gICAgcHVibGljIHBhdXNlKCkge1xuICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBJRSA9IChmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHVuZGVmLFxuICAgICAgICB2ID0gMyxcbiAgICAgICAgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSxcbiAgICAgICAgYWxsID0gZGl2LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaVwiKTtcblxuICAgIHdoaWxlIChcbiAgICAgICAgZGl2LmlubmVySFRNTCA9IFwiPCEtLVtpZiBndCBJRSBcIiArICgrK3YpICsgXCJdPjxpPjwvaT48IVtlbmRpZl0tLT5cIixcbiAgICAgICAgICAgIGFsbFswXVxuICAgICAgICApO1xuXG4gICAgcmV0dXJuIHYgPiA0ID8gdiA6IHVuZGVmO1xufSgpKTtcblxuXG5leHBvcnQgY2xhc3MgSWZWaXNpYmxlIHtcbiAgICBwdWJsaWMgc3RhdHVzOiBzdHJpbmcgPSBTVEFUVVNfQUNUSVZFO1xuICAgIHB1YmxpYyBWRVJTSU9OOiBzdHJpbmcgPSAnJztcbiAgICBwcml2YXRlIHRpbWVyOiBhbnk7XG4gICAgcHJpdmF0ZSBpZGxlVGltZTogbnVtYmVyID0gMzAwMDA7XG4gICAgcHJpdmF0ZSBpZGxlU3RhcnRlZFRpbWU6IG51bWJlcjtcblxuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByb290LCBwcml2YXRlIGRvYykge1xuICAgICAgICBsZXQgQkxVUl9FVkVOVCA9IFwiYmx1clwiO1xuICAgICAgICBsZXQgRk9DVVNfRVZFTlQgPSBcImZvY3VzXCI7XG5cbiAgICAgICAgLy8gRmluZCBjb3JyZWN0IGJyb3dzZXIgZXZlbnRzXG4gICAgICAgIGlmICh0aGlzLmRvYy5oaWRkZW4gIT09IHZvaWQgMCkge1xuICAgICAgICAgICAgRE9DX0hJRERFTiA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICBWSVNJQklMSVRZX0NIQU5HRV9FVkVOVCA9IFwidmlzaWJpbGl0eWNoYW5nZVwiO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZG9jW1wibW96SGlkZGVuXCJdICE9PSB2b2lkIDApIHtcbiAgICAgICAgICAgIERPQ19ISURERU4gPSBcIm1vekhpZGRlblwiO1xuICAgICAgICAgICAgVklTSUJJTElUWV9DSEFOR0VfRVZFTlQgPSBcIm1venZpc2liaWxpdHljaGFuZ2VcIjtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmRvY1tcIm1zSGlkZGVuXCJdICE9PSB2b2lkIDApIHtcbiAgICAgICAgICAgIERPQ19ISURERU4gPSBcIm1zSGlkZGVuXCI7XG4gICAgICAgICAgICBWSVNJQklMSVRZX0NIQU5HRV9FVkVOVCA9IFwibXN2aXNpYmlsaXR5Y2hhbmdlXCI7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5kb2NbXCJ3ZWJraXRIaWRkZW5cIl0gIT09IHZvaWQgMCkge1xuICAgICAgICAgICAgRE9DX0hJRERFTiA9IFwid2Via2l0SGlkZGVuXCI7XG4gICAgICAgICAgICBWSVNJQklMSVRZX0NIQU5HRV9FVkVOVCA9IFwid2Via2l0dmlzaWJpbGl0eWNoYW5nZVwiO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKERPQ19ISURERU4gPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgaWYgKElFIDwgOSkge1xuICAgICAgICAgICAgICAgIEJMVVJfRVZFTlQgPSBcImZvY3Vzb3V0XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBFdmVudHMuZG9tKHRoaXMucm9vdCwgQkxVUl9FVkVOVCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmJsdXIoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgRXZlbnRzLmRvbSh0aGlzLnJvb3QsIEZPQ1VTX0VWRU5ULCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZm9jdXMoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgdHJhY2tDaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZG9jW0RPQ19ISURERU5dKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmx1cigpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdHJhY2tDaGFuZ2UoKTsgLy8gZ2V0IGluaXRpYWwgc3RhdHVzXG4gICAgICAgICAgICBFdmVudHMuZG9tKHRoaXMuZG9jLCBWSVNJQklMSVRZX0NIQU5HRV9FVkVOVCwgdHJhY2tDaGFuZ2UpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RhcnRJZGxlVGltZXIoKTtcbiAgICAgICAgdGhpcy50cmFja0lkbGVTdGF0dXMoKTtcbiAgICB9XG5cbiAgICBzdGFydElkbGVUaW1lcihldmVudD86IEV2ZW50KSB7XG4gICAgICAgIC8vIFByZXZlbnRzIFBoYW50b20gZXZlbnRzLlxuICAgICAgICAvLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9zZXJrYW55ZXJzZW4vaWZ2aXNpYmxlLmpzL3B1bGwvMzdcbiAgICAgICAgaWYgKGV2ZW50IGluc3RhbmNlb2YgTW91c2VFdmVudCAmJiBldmVudC5tb3ZlbWVudFggPT09IDAgJiYgZXZlbnQubW92ZW1lbnRZID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcik7XG5cbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSBTVEFUVVNfSURMRSkge1xuICAgICAgICAgICAgdGhpcy53YWtldXAoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaWRsZVN0YXJ0ZWRUaW1lID0gKyhuZXcgRGF0ZSgpKTtcbiAgICAgICAgdGhpcy50aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSBTVEFUVVNfQUNUSVZFIHx8IHRoaXMuc3RhdHVzID09PSBTVEFUVVNfSElEREVOKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaWRsZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzLmlkbGVUaW1lKTtcbiAgICB9XG5cbiAgICB0cmFja0lkbGVTdGF0dXMoKSB7XG4gICAgICAgIEV2ZW50cy5kb20odGhpcy5kb2MsIFwibW91c2Vtb3ZlXCIsIHRoaXMuc3RhcnRJZGxlVGltZXIuYmluZCh0aGlzKSk7XG4gICAgICAgIEV2ZW50cy5kb20odGhpcy5kb2MsIFwibW91c2Vkb3duXCIsIHRoaXMuc3RhcnRJZGxlVGltZXIuYmluZCh0aGlzKSk7XG4gICAgICAgIEV2ZW50cy5kb20odGhpcy5kb2MsIFwia2V5dXBcIiwgdGhpcy5zdGFydElkbGVUaW1lci5iaW5kKHRoaXMpKTtcbiAgICAgICAgRXZlbnRzLmRvbSh0aGlzLmRvYywgXCJ0b3VjaHN0YXJ0XCIsIHRoaXMuc3RhcnRJZGxlVGltZXIuYmluZCh0aGlzKSk7XG4gICAgICAgIEV2ZW50cy5kb20odGhpcy5yb290LCBcInNjcm9sbFwiLCB0aGlzLnN0YXJ0SWRsZVRpbWVyLmJpbmQodGhpcykpO1xuXG4gICAgICAgIC8vIHRoaXMuZm9jdXMod2FrZVVwKTtcbiAgICAgICAgLy8gdGhpcy53YWtldXAod2FrZVVwKTtcbiAgICB9XG5cbiAgICBvbihldmVudDogc3RyaW5nLCBjYWxsYmFjazogKGRhdGE6IGFueSkgPT4gYW55KTogSWZWaXNpYmxlIHtcbiAgICAgICAgRXZlbnRzLmF0dGFjaChldmVudCwgY2FsbGJhY2spO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvZmYoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s/OiBhbnkpOiBJZlZpc2libGUge1xuICAgICAgICBFdmVudHMucmVtb3ZlKGV2ZW50LCBjYWxsYmFjayk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHNldElkbGVEdXJhdGlvbihzZWNvbmRzOiBudW1iZXIpOiBJZlZpc2libGUge1xuICAgICAgICB0aGlzLmlkbGVUaW1lID0gc2Vjb25kcyAqIDEwMDA7XG4gICAgICAgIHRoaXMuc3RhcnRJZGxlVGltZXIoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZ2V0SWRsZUR1cmF0aW9uKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmlkbGVUaW1lO1xuICAgIH1cblxuICAgIGdldElkbGVJbmZvKCk6IElkbGVJbmZvIHtcbiAgICAgICAgbGV0IG5vdyA9ICsobmV3IERhdGUoKSk7XG4gICAgICAgIGxldCByZXM6IElkbGVJbmZvO1xuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT09IFNUQVRVU19JRExFKSB7XG4gICAgICAgICAgICByZXMgPSB7XG4gICAgICAgICAgICAgICAgaXNJZGxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGlkbGVGb3I6IG5vdyAtIHRoaXMuaWRsZVN0YXJ0ZWRUaW1lLFxuICAgICAgICAgICAgICAgIHRpbWVMZWZ0OiAwLFxuICAgICAgICAgICAgICAgIHRpbWVMZWZ0UGVyOiAxMDBcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgdGltZUxlZnQgPSAodGhpcy5pZGxlU3RhcnRlZFRpbWUgKyB0aGlzLmlkbGVUaW1lKSAtIG5vdztcbiAgICAgICAgICAgIHJlcyA9IHtcbiAgICAgICAgICAgICAgICBpc0lkbGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGlkbGVGb3I6IG5vdyAtIHRoaXMuaWRsZVN0YXJ0ZWRUaW1lLFxuICAgICAgICAgICAgICAgIHRpbWVMZWZ0LFxuICAgICAgICAgICAgICAgIHRpbWVMZWZ0UGVyOiBwYXJzZUZsb2F0KCgxMDAgLSAodGltZUxlZnQgKiAxMDAgLyB0aGlzLmlkbGVUaW1lKSkudG9GaXhlZCgyKSlcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBpZGxlKGNhbGxiYWNrPzogKGRhdGE6IGFueSkgPT4gYW55KTogSWZWaXNpYmxlIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLm9uKFwiaWRsZVwiLCBjYWxsYmFjayk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9IFNUQVRVU19JRExFO1xuICAgICAgICAgICAgRXZlbnRzLmZpcmUoXCJpZGxlXCIpO1xuICAgICAgICAgICAgRXZlbnRzLmZpcmUoXCJzdGF0dXNDaGFuZ2VkXCIsIFt7c3RhdHVzOiB0aGlzLnN0YXR1c31dKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBibHVyKGNhbGxiYWNrPzogKGRhdGE6IGFueSkgPT4gYW55KTogSWZWaXNpYmxlIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLm9uKFwiYmx1clwiLCBjYWxsYmFjayk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9IFNUQVRVU19ISURERU47XG4gICAgICAgICAgICBFdmVudHMuZmlyZShcImJsdXJcIik7XG4gICAgICAgICAgICBFdmVudHMuZmlyZShcInN0YXR1c0NoYW5nZWRcIiwgW3tzdGF0dXM6IHRoaXMuc3RhdHVzfV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZvY3VzKGNhbGxiYWNrPzogKGRhdGE6IGFueSkgPT4gYW55KTogSWZWaXNpYmxlIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLm9uKFwiZm9jdXNcIiwgY2FsbGJhY2spO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdHVzICE9PSBTVEFUVVNfQUNUSVZFKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9IFNUQVRVU19BQ1RJVkU7XG4gICAgICAgICAgICBFdmVudHMuZmlyZShcImZvY3VzXCIpO1xuICAgICAgICAgICAgRXZlbnRzLmZpcmUoXCJ3YWtldXBcIik7XG4gICAgICAgICAgICBFdmVudHMuZmlyZShcInN0YXR1c0NoYW5nZWRcIiwgW3tzdGF0dXM6IHRoaXMuc3RhdHVzfV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHdha2V1cChjYWxsYmFjaz86IChkYXRhOiBhbnkpID0+IGFueSk6IElmVmlzaWJsZSB7XG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgdGhpcy5vbihcIndha2V1cFwiLCBjYWxsYmFjayk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0dXMgIT09IFNUQVRVU19BQ1RJVkUpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gU1RBVFVTX0FDVElWRTtcbiAgICAgICAgICAgIEV2ZW50cy5maXJlKFwid2FrZXVwXCIpO1xuICAgICAgICAgICAgRXZlbnRzLmZpcmUoXCJzdGF0dXNDaGFuZ2VkXCIsIFt7c3RhdHVzOiB0aGlzLnN0YXR1c31dKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvbkV2ZXJ5KHNlY29uZHM6IG51bWJlciwgY2FsbGJhY2s6IEZ1bmN0aW9uKTogVGltZXIge1xuICAgICAgICByZXR1cm4gbmV3IFRpbWVyKHRoaXMsIHNlY29uZHMsIGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICBub3coY2hlY2s/OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKGNoZWNrICE9PSB2b2lkIDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0YXR1cyA9PT0gY2hlY2s7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdGF0dXMgPT09IFNUQVRVU19BQ1RJVkU7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJZlZpc2libGUgfSBmcm9tIFwiLi9zcmMvaWZ2aXNpYmxlXCI7XG5cbmRlY2xhcmUgdmFyIGdsb2JhbDogYW55O1xuY29uc3Qgcm9vdCA9IHR5cGVvZiBzZWxmID09PSBcIm9iamVjdFwiICYmIHNlbGYuc2VsZiA9PT0gc2VsZiAmJiBzZWxmIHx8XG4gICAgICAgICAgICAgdHlwZW9mIGdsb2JhbCA9PT0gXCJvYmplY3RcIiAmJiBnbG9iYWwuZ2xvYmFsID09PSBnbG9iYWwgJiYgZ2xvYmFsIHx8XG4gICAgICAgICAgICAgdGhpcztcblxuZXhwb3J0IGNvbnN0IGlmdmlzaWJsZSA9IG5ldyBJZlZpc2libGUocm9vdCwgZG9jdW1lbnQpO1xuZXhwb3J0ICogZnJvbSBcIi4vc3JjL2lmdmlzaWJsZVwiOyJdLCJuYW1lcyI6WyJFdmVudHMiLCJ0aGlzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7SUFBQTs7Ozs7Ozs7Ozs7Ozs7QUFjQSxvQkF1R3VCLENBQUMsRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxHQUFHLE9BQU8sTUFBTSxLQUFLLFVBQVUsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxDQUFDO1lBQUUsT0FBTyxDQUFDLENBQUM7UUFDakIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDakMsSUFBSTtZQUNBLE9BQU8sQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLElBQUk7Z0JBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDOUU7UUFDRCxPQUFPLEtBQUssRUFBRTtZQUFFLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQztTQUFFO2dCQUMvQjtZQUNKLElBQUk7Z0JBQ0EsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNwRDtvQkFDTztnQkFBRSxJQUFJLENBQUM7b0JBQUUsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDO2FBQUU7U0FDcEM7UUFDRCxPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7QUFFRDtRQUNJLEtBQUssSUFBSSxFQUFFLEdBQUcsRUFB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