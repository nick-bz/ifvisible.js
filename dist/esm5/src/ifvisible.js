/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
var /** @type {?} */ STATUS_ACTIVE = "active";
var /** @type {?} */ STATUS_IDLE = "idle";
var /** @type {?} */ STATUS_HIDDEN = "hidden";
var /** @type {?} */ DOC_HIDDEN;
var /** @type {?} */ VISIBILITY_CHANGE_EVENT = void 0;
export var Events;
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
                callback.apply(void 0, tslib_1.__spread(args));
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
})(Events || (Events = {}));
/**
 * @record
 */
export function IdleInfo() { }
function IdleInfo_tsickle_Closure_declarations() {
    /** @type {?} */
    IdleInfo.prototype.isIdle;
    /** @type {?} */
    IdleInfo.prototype.idleFor;
    /** @type {?} */
    IdleInfo.prototype.timeLeft;
    /** @type {?} */
    IdleInfo.prototype.timeLeftPer;
}
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
export { Timer };
function Timer_tsickle_Closure_declarations() {
    /** @type {?} */
    Timer.prototype.token;
    /** @type {?} */
    Timer.prototype.stopped;
    /** @type {?} */
    Timer.prototype.ifvisible;
    /** @type {?} */
    Timer.prototype.seconds;
    /** @type {?} */
    Timer.prototype.callback;
}
export var /** @type {?} */ IE = (function () {
    var /** @type {?} */ undef, /** @type {?} */
    v = 3, /** @type {?} */
    div = document.createElement("div"), /** @type {?} */
    all = div.getElementsByTagName("i");
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
            Events.dom(this.root, BLUR_EVENT, function () {
                return _this.blur();
            });
            Events.dom(this.root, FOCUS_EVENT, function () {
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
            Events.dom(this.doc, VISIBILITY_CHANGE_EVENT, trackChange);
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
        Events.dom(this.doc, "mousemove", this.startIdleTimer.bind(this));
        Events.dom(this.doc, "mousedown", this.startIdleTimer.bind(this));
        Events.dom(this.doc, "keyup", this.startIdleTimer.bind(this));
        Events.dom(this.doc, "touchstart", this.startIdleTimer.bind(this));
        Events.dom(this.root, "scroll", this.startIdleTimer.bind(this));
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
        Events.attach(event, callback);
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
        Events.remove(event, callback);
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
            Events.fire("idle");
            Events.fire("statusChanged", [{ status: this.status }]);
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
            Events.fire("blur");
            Events.fire("statusChanged", [{ status: this.status }]);
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
            Events.fire("focus");
            Events.fire("wakeup");
            Events.fire("statusChanged", [{ status: this.status }]);
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
            Events.fire("wakeup");
            Events.fire("statusChanged", [{ status: this.status }]);
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
export { IfVisible };
function IfVisible_tsickle_Closure_declarations() {
    /** @type {?} */
    IfVisible.prototype.status;
    /** @type {?} */
    IfVisible.prototype.VERSION;
    /** @type {?} */
    IfVisible.prototype.timer;
    /** @type {?} */
    IfVisible.prototype.idleTime;
    /** @type {?} */
    IfVisible.prototype.idleStartedTime;
    /** @type {?} */
    IfVisible.prototype.root;
    /** @type {?} */
    IfVisible.prototype.doc;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWZ2aXNpYmxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vaWZ2aXNpYmxlLmpzLyIsInNvdXJjZXMiOlsic3JjL2lmdmlzaWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHFCQUFNLGFBQWEsR0FBRyxRQUFRLENBQUM7QUFDL0IscUJBQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQztBQUMzQixxQkFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDO0FBRS9CLHFCQUFJLFVBQWtCLENBQUM7QUFDdkIscUJBQUksdUJBQXVCLEdBQVcsS0FBSyxDQUFDLENBQUM7QUFFN0MsTUFBTSxLQUFXLE1BQU07QUFBdkIsV0FBaUIsTUFBTTtJQUNuQixxQkFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ2pCLHFCQUFJLFdBQXFCLENBQUM7Ozs7OztJQUUxQixnQkFBdUIsS0FBYSxFQUFFLFFBQWtCO1FBQ3BELEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQixLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO1NBQ3JCOztRQUVELEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDL0I7SUFOZSxhQUFNLFNBTXJCLENBQUE7Ozs7OztJQUVELGNBQXFCLEtBQWEsRUFBRSxJQUFZO1FBQzVDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDZixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsUUFBUTtnQkFDMUIsUUFBUSxnQ0FBSSxJQUFJLEdBQUU7YUFDckIsQ0FBQyxDQUFDO1NBQ047S0FDSjtJQU5lLFdBQUksT0FNbkIsQ0FBQTs7Ozs7O0lBRUQsZ0JBQXVCLEtBQWEsRUFBRSxRQUFrQjtRQUNwRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxD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QU8sUUFBNkI7UUFDaEMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNYLElBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQy9CO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssYUFBYSxDQUFDLENBQUMsQ0FBQztZQUN2QyxJQUFJLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQztZQUM1QixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3RCLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsRUFBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQyxDQUFDLENBQUMsQ0FBQztTQUN6RDtRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7S0FDZjs7Ozs7O0lBRUQsMkJBQU87Ozs7O0lBQVAsVUFBUSxPQUFlLEVBQUUsUUFBa0I7UUFDdkMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDN0M7Ozs7O0lBRUQsdUJBQUc7Ozs7SUFBSCxVQUFJLEtBQWM7UUFDZCxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLEtBQUssQ0FBQztTQUNoQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssYUFBYSxDQUFDO1NBQ3hDO0tBQ0o7b0JBM1NMO0lBNFNDLENBQUE7QUF0TEQscUJBc0xDIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgU1RBVFVTX0FDVElWRSA9IFwiYWN0aXZlXCI7XG5jb25zdCBTVEFUVVNfSURMRSA9IFwiaWRsZVwiO1xuY29uc3QgU1RBVFVTX0hJRERFTiA9IFwiaGlkZGVuXCI7XG5cbmxldCBET0NfSElEREVOOiBzdHJpbmc7XG5sZXQgVklTSUJJTElUWV9DSEFOR0VfRVZFTlQ6IHN0cmluZyA9IHZvaWQgMDtcblxuZXhwb3J0IG5hbWVzcGFjZSBFdmVudHMge1xuICAgIGNvbnN0IHN0b3JlID0ge307XG4gICAgbGV0IHNldExpc3RlbmVyOiBGdW5jdGlvbjtcblxuICAgIGV4cG9ydCBmdW5jdGlvbiBhdHRhY2goZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uKSB7XG4gICAgICAgIGlmICghc3RvcmVbZXZlbnRdKSB7XG4gICAgICAgICAgICBzdG9yZVtldmVudF0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInNla29cIik7XG4gICAgICAgIHN0b3JlW2V2ZW50XS5wdXNoKGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICBleHBvcnQgZnVuY3Rpb24gZmlyZShldmVudDogc3RyaW5nLCBhcmdzPzogYW55W10pIHtcbiAgICAgICAgaWYgKHN0b3JlW2V2ZW50XSkge1xuICAgICAgICAgICAgc3RvcmVbZXZlbnRdLmZvckVhY2goKGNhbGxiYWNrKSA9PiB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soLi4uYXJncyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBmdW5jdGlvbiByZW1vdmUoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uKSB7XG4gICAgICAgIGlmIChzdG9yZVtldmVudF0pIHtcbiAgICAgICAgICAgIHN0b3JlW2V2ZW50XSA9IHN0b3JlW2V2ZW50XS5maWx0ZXIoKHNhdmVkQ2FsbGJhY2spID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sgIT09IHNhdmVkQ2FsbGJhY2s7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBmdW5jdGlvbiBkb20oZWxlbWVudDogYW55LCBldmVudDogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24pIHtcbiAgICAgICAgaWYgKCFzZXRMaXN0ZW5lcikge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIHNldExpc3RlbmVyID0gZnVuY3Rpb24gKGVsLCBldiwgZm4pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsLmFkZEV2ZW50TGlzdGVuZXIoZXYsIGZuLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGVsZW1lbnRbXCJhdHRhY2hFdmVudFwiXSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgc2V0TGlzdGVuZXIgPSBmdW5jdGlvbiAoZWwsIGV2LCBmbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWwuYXR0YWNoRXZlbnQoXCJvblwiICsgZXYsIGZuLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2V0TGlzdGVuZXIgPSBmdW5jdGlvbiAoZWwsIGV2LCBmbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxbXCJvblwiICsgZXZdID0gZm47XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2V0TGlzdGVuZXIoZWxlbWVudCwgZXZlbnQsIGNhbGxiYWNrKTtcbiAgICB9XG5cbn1cblxuZXhwb3J0IGludGVyZmFjZSBJZGxlSW5mbyB7XG4gICAgaXNJZGxlOiBib29sZWFuO1xuICAgIGlkbGVGb3I6IG51bWJlcjtcbiAgICB0aW1lTGVmdDogbnVtYmVyO1xuICAgIHRpbWVMZWZ0UGVyOiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBUaW1lciB7XG4gICAgcHJpdmF0ZSB0b2tlbjogbnVtYmVyO1xuICAgIHN0b3BwZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaWZ2aXNpYmxlOiBJZlZpc2libGUsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBzZWNvbmRzOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBjYWxsYmFjazogRnVuY3Rpb24pIHtcbiAgICAgICAgdGhpcy5zdGFydCgpO1xuXG4gICAgICAgIHRoaXMuaWZ2aXNpYmxlLm9uKFwic3RhdHVzQ2hhbmdlZFwiLCAoZGF0YTogYW55KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdG9wcGVkID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLnN0YXR1cyA9PT0gU1RBVFVTX0FDVElWRSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXVzZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGFydCgpIHtcbiAgICAgICAgdGhpcy5zdG9wcGVkID0gZmFsc2U7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50b2tlbik7XG4gICAgICAgIHRoaXMudG9rZW4gPSBzZXRJbnRlcnZhbCh0aGlzLmNhbGxiYWNrLCB0aGlzLnNlY29uZHMgKiAxMDAwKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RvcCgpIHtcbiAgICAgICAgdGhpcy5zdG9wcGVkID0gdHJ1ZTtcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRva2VuKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVzdW1lKCkge1xuICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgfVxuXG4gICAgcHVibGljIHBhdXNlKCkge1xuICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBJRSA9IChmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHVuZGVmLFxuICAgICAgICB2ID0gMyxcbiAgICAgICAgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSxcbiAgICAgICAgYWxsID0gZGl2LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaVwiKTtcblxuICAgIHdoaWxlIChcbiAgICAgICAgZGl2LmlubmVySFRNTCA9IFwiPCEtLVtpZiBndCBJRSBcIiArICgrK3YpICsgXCJdPjxpPjwvaT48IVtlbmRpZl0tLT5cIixcbiAgICAgICAgICAgIGFsbFswXVxuICAgICAgICApO1xuXG4gICAgcmV0dXJuIHYgPiA0ID8gdiA6IHVuZGVmO1xufSgpKTtcblxuXG5leHBvcnQgY2xhc3MgSWZWaXNpYmxlIHtcbiAgICBwdWJsaWMgc3RhdHVzOiBzdHJpbmcgPSBTVEFUVVNfQUNUSVZFO1xuICAgIHB1YmxpYyBWRVJTSU9OOiBzdHJpbmcgPSAnJztcbiAgICBwcml2YXRlIHRpbWVyOiBhbnk7XG4gICAgcHJpdmF0ZSBpZGxlVGltZTogbnVtYmVyID0gMzAwMDA7XG4gICAgcHJpdmF0ZSBpZGxlU3RhcnRlZFRpbWU6IG51bWJlcjtcblxuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByb290LCBwcml2YXRlIGRvYykge1xuICAgICAgICBsZXQgQkxVUl9FVkVOVCA9IFwiYmx1clwiO1xuICAgICAgICBsZXQgRk9DVVNfRVZFTlQgPSBcImZvY3VzXCI7XG5cbiAgICAgICAgLy8gRmluZCBjb3JyZWN0IGJyb3dzZXIgZXZlbnRzXG4gICAgICAgIGlmICh0aGlzLmRvYy5oaWRkZW4gIT09IHZvaWQgMCkge1xuICAgICAgICAgICAgRE9DX0hJRERFTiA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICBWSVNJQklMSVRZX0NIQU5HRV9FVkVOVCA9IFwidmlzaWJpbGl0eWNoYW5nZVwiO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZG9jW1wibW96SGlkZGVuXCJdICE9PSB2b2lkIDApIHtcbiAgICAgICAgICAgIERPQ19ISURERU4gPSBcIm1vekhpZGRlblwiO1xuICAgICAgICAgICAgVklTSUJJTElUWV9DSEFOR0VfRVZFTlQgPSBcIm1venZpc2liaWxpdHljaGFuZ2VcIjtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmRvY1tcIm1zSGlkZGVuXCJdICE9PSB2b2lkIDApIHtcbiAgICAgICAgICAgIERPQ19ISURERU4gPSBcIm1zSGlkZGVuXCI7XG4gICAgICAgICAgICBWSVNJQklMSVRZX0NIQU5HRV9FVkVOVCA9IFwibXN2aXNpYmlsaXR5Y2hhbmdlXCI7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5kb2NbXCJ3ZWJraXRIaWRkZW5cIl0gIT09IHZvaWQgMCkge1xuICAgICAgICAgICAgRE9DX0hJRERFTiA9IFwid2Via2l0SGlkZGVuXCI7XG4gICAgICAgICAgICBWSVNJQklMSVRZX0NIQU5HRV9FVkVOVCA9IFwid2Via2l0dmlzaWJpbGl0eWNoYW5nZVwiO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKERPQ19ISURERU4gPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgaWYgKElFIDwgOSkge1xuICAgICAgICAgICAgICAgIEJMVVJfRVZFTlQgPSBcImZvY3Vzb3V0XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBFdmVudHMuZG9tKHRoaXMucm9vdCwgQkxVUl9FVkVOVCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmJsdXIoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgRXZlbnRzLmRvbSh0aGlzLnJvb3QsIEZPQ1VTX0VWRU5ULCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZm9jdXMoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgdHJhY2tDaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZG9jW0RPQ19ISURERU5dKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmx1cigpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdHJhY2tDaGFuZ2UoKTsgLy8gZ2V0IGluaXRpYWwgc3RhdHVzXG4gICAgICAgICAgICBFdmVudHMuZG9tKHRoaXMuZG9jLCBWSVNJQklMSVRZX0NIQU5HRV9FVkVOVCwgdHJhY2tDaGFuZ2UpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RhcnRJZGxlVGltZXIoKTtcbiAgICAgICAgdGhpcy50cmFja0lkbGVTdGF0dXMoKTtcbiAgICB9XG5cbiAgICBzdGFydElkbGVUaW1lcihldmVudD86IEV2ZW50KSB7XG4gICAgICAgIC8vIFByZXZlbnRzIFBoYW50b20gZXZlbnRzLlxuICAgICAgICAvLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9zZXJrYW55ZXJzZW4vaWZ2aXNpYmxlLmpzL3B1bGwvMzdcbiAgICAgICAgaWYgKGV2ZW50IGluc3RhbmNlb2YgTW91c2VFdmVudCAmJiBldmVudC5tb3ZlbWVudFggPT09IDAgJiYgZXZlbnQubW92ZW1lbnRZID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcik7XG5cbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSBTVEFUVVNfSURMRSkge1xuICAgICAgICAgICAgdGhpcy53YWtldXAoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaWRsZVN0YXJ0ZWRUaW1lID0gKyhuZXcgRGF0ZSgpKTtcbiAgICAgICAgdGhpcy50aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSBTVEFUVVNfQUNUSVZFIHx8IHRoaXMuc3RhdHVzID09PSBTVEFUVVNfSElEREVOKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaWRsZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzLmlkbGVUaW1lKTtcbiAgICB9XG5cbiAgICB0cmFja0lkbGVTdGF0dXMoKSB7XG4gICAgICAgIEV2ZW50cy5kb20odGhpcy5kb2MsIFwibW91c2Vtb3ZlXCIsIHRoaXMuc3RhcnRJZGxlVGltZXIuYmluZCh0aGlzKSk7XG4gICAgICAgIEV2ZW50cy5kb20odGhpcy5kb2MsIFwibW91c2Vkb3duXCIsIHRoaXMuc3RhcnRJZGxlVGltZXIuYmluZCh0aGlzKSk7XG4gICAgICAgIEV2ZW50cy5kb20odGhpcy5kb2MsIFwia2V5dXBcIiwgdGhpcy5zdGFydElkbGVUaW1lci5iaW5kKHRoaXMpKTtcbiAgICAgICAgRXZlbnRzLmRvbSh0aGlzLmRvYywgXCJ0b3VjaHN0YXJ0XCIsIHRoaXMuc3RhcnRJZGxlVGltZXIuYmluZCh0aGlzKSk7XG4gICAgICAgIEV2ZW50cy5kb20odGhpcy5yb290LCBcInNjcm9sbFwiLCB0aGlzLnN0YXJ0SWRsZVRpbWVyLmJpbmQodGhpcykpO1xuXG4gICAgICAgIC8vIHRoaXMuZm9jdXMod2FrZVVwKTtcbiAgICAgICAgLy8gdGhpcy53YWtldXAod2FrZVVwKTtcbiAgICB9XG5cbiAgICBvbihldmVudDogc3RyaW5nLCBjYWxsYmFjazogKGRhdGE6IGFueSkgPT4gYW55KTogSWZWaXNpYmxlIHtcbiAgICAgICAgRXZlbnRzLmF0dGFjaChldmVudCwgY2FsbGJhY2spO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvZmYoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s/OiBhbnkpOiBJZlZpc2libGUge1xuICAgICAgICBFdmVudHMucmVtb3ZlKGV2ZW50LCBjYWxsYmFjayk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHNldElkbGVEdXJhdGlvbihzZWNvbmRzOiBudW1iZXIpOiBJZlZpc2libGUge1xuICAgICAgICB0aGlzLmlkbGVUaW1lID0gc2Vjb25kcyAqIDEwMDA7XG4gICAgICAgIHRoaXMuc3RhcnRJZGxlVGltZXIoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZ2V0SWRsZUR1cmF0aW9uKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmlkbGVUaW1lO1xuICAgIH1cblxuICAgIGdldElkbGVJbmZvKCk6IElkbGVJbmZvIHtcbiAgICAgICAgbGV0IG5vdyA9ICsobmV3IERhdGUoKSk7XG4gICAgICAgIGxldCByZXM6IElkbGVJbmZvO1xuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT09IFNUQVRVU19JRExFKSB7XG4gICAgICAgICAgICByZXMgPSB7XG4gICAgICAgICAgICAgICAgaXNJZGxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGlkbGVGb3I6IG5vdyAtIHRoaXMuaWRsZVN0YXJ0ZWRUaW1lLFxuICAgICAgICAgICAgICAgIHRpbWVMZWZ0OiAwLFxuICAgICAgICAgICAgICAgIHRpbWVMZWZ0UGVyOiAxMDBcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgdGltZUxlZnQgPSAodGhpcy5pZGxlU3RhcnRlZFRpbWUgKyB0aGlzLmlkbGVUaW1lKSAtIG5vdztcbiAgICAgICAgICAgIHJlcyA9IHtcbiAgICAgICAgICAgICAgICBpc0lkbGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGlkbGVGb3I6IG5vdyAtIHRoaXMuaWRsZVN0YXJ0ZWRUaW1lLFxuICAgICAgICAgICAgICAgIHRpbWVMZWZ0LFxuICAgICAgICAgICAgICAgIHRpbWVMZWZ0UGVyOiBwYXJzZUZsb2F0KCgxMDAgLSAodGltZUxlZnQgKiAxMDAgLyB0aGlzLmlkbGVUaW1lKSkudG9GaXhlZCgyKSlcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBpZGxlKGNhbGxiYWNrPzogKGRhdGE6IGFueSkgPT4gYW55KTogSWZWaXNpYmxlIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLm9uKFwiaWRsZVwiLCBjYWxsYmFjayk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9IFNUQVRVU19JRExFO1xuICAgICAgICAgICAgRXZlbnRzLmZpcmUoXCJpZGxlXCIpO1xuICAgICAgICAgICAgRXZlbnRzLmZpcmUoXCJzdGF0dXNDaGFuZ2VkXCIsIFt7c3RhdHVzOiB0aGlzLnN0YXR1c31dKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBibHVyKGNhbGxiYWNrPzogKGRhdGE6IGFueSkgPT4gYW55KTogSWZWaXNpYmxlIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLm9uKFwiYmx1clwiLCBjYWxsYmFjayk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9IFNUQVRVU19ISURERU47XG4gICAgICAgICAgICBFdmVudHMuZmlyZShcImJsdXJcIik7XG4gICAgICAgICAgICBFdmVudHMuZmlyZShcInN0YXR1c0NoYW5nZWRcIiwgW3tzdGF0dXM6IHRoaXMuc3RhdHVzfV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZvY3VzKGNhbGxiYWNrPzogKGRhdGE6IGFueSkgPT4gYW55KTogSWZWaXNpYmxlIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLm9uKFwiZm9jdXNcIiwgY2FsbGJhY2spO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdHVzICE9PSBTVEFUVVNfQUNUSVZFKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9IFNUQVRVU19BQ1RJVkU7XG4gICAgICAgICAgICBFdmVudHMuZmlyZShcImZvY3VzXCIpO1xuICAgICAgICAgICAgRXZlbnRzLmZpcmUoXCJ3YWtldXBcIik7XG4gICAgICAgICAgICBFdmVudHMuZmlyZShcInN0YXR1c0NoYW5nZWRcIiwgW3tzdGF0dXM6IHRoaXMuc3RhdHVzfV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHdha2V1cChjYWxsYmFjaz86IChkYXRhOiBhbnkpID0+IGFueSk6IElmVmlzaWJsZSB7XG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgdGhpcy5vbihcIndha2V1cFwiLCBjYWxsYmFjayk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0dXMgIT09IFNUQVRVU19BQ1RJVkUpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gU1RBVFVTX0FDVElWRTtcbiAgICAgICAgICAgIEV2ZW50cy5maXJlKFwid2FrZXVwXCIpO1xuICAgICAgICAgICAgRXZlbnRzLmZpcmUoXCJzdGF0dXNDaGFuZ2VkXCIsIFt7c3RhdHVzOiB0aGlzLnN0YXR1c31dKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvbkV2ZXJ5KHNlY29uZHM6IG51bWJlciwgY2FsbGJhY2s6IEZ1bmN0aW9uKTogVGltZXIge1xuICAgICAgICByZXR1cm4gbmV3IFRpbWVyKHRoaXMsIHNlY29uZHMsIGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICBub3coY2hlY2s/OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKGNoZWNrICE9PSB2b2lkIDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0YXR1cyA9PT0gY2hlY2s7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdGF0dXMgPT09IFNUQVRVU19BQ1RJVkU7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=