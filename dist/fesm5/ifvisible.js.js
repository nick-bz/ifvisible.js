import { __spread } from 'tslib';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var /** @type {?} */ STATUS_ACTIVE = "active";
var /** @type {?} */ STATUS_IDLE = "idle";
var /** @type {?} */ STATUS_HIDDEN = "hidden";
var /** @type {?} */ DOC_HIDDEN;
var /** @type {?} */ VISIBILITY_CHANGE_EVENT = void 0;
var Events;
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
})(Events || (Events = {}));
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
var /** @type {?} */ IE = (function () {
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

export { ifvisible, Events, Timer, IE, IfVisible };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWZ2aXNpYmxlLmpzLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9pZnZpc2libGUuanMvc3JjL2lmdmlzaWJsZS50cyIsIm5nOi8vaWZ2aXNpYmxlLmpzL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFNUQVRVU19BQ1RJVkUgPSBcImFjdGl2ZVwiO1xuY29uc3QgU1RBVFVTX0lETEUgPSBcImlkbGVcIjtcbmNvbnN0IFNUQVRVU19ISURERU4gPSBcImhpZGRlblwiO1xuXG5sZXQgRE9DX0hJRERFTjogc3RyaW5nO1xubGV0IFZJU0lCSUxJVFlfQ0hBTkdFX0VWRU5UOiBzdHJpbmcgPSB2b2lkIDA7XG5cbmV4cG9ydCBuYW1lc3BhY2UgRXZlbnRzIHtcbiAgICBjb25zdCBzdG9yZSA9IHt9O1xuICAgIGxldCBzZXRMaXN0ZW5lcjogRnVuY3Rpb247XG5cbiAgICBleHBvcnQgZnVuY3Rpb24gYXR0YWNoKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbikge1xuICAgICAgICBpZiAoIXN0b3JlW2V2ZW50XSkge1xuICAgICAgICAgICAgc3RvcmVbZXZlbnRdID0gW107XG4gICAgICAgIH1cbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJzZWtvXCIpO1xuICAgICAgICBzdG9yZVtldmVudF0ucHVzaChjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGZpcmUoZXZlbnQ6IHN0cmluZywgYXJncz86IGFueVtdKSB7XG4gICAgICAgIGlmIChzdG9yZVtldmVudF0pIHtcbiAgICAgICAgICAgIHN0b3JlW2V2ZW50XS5mb3JFYWNoKChjYWxsYmFjaykgPT4ge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKC4uLmFyZ3MpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBleHBvcnQgZnVuY3Rpb24gcmVtb3ZlKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbikge1xuICAgICAgICBpZiAoc3RvcmVbZXZlbnRdKSB7XG4gICAgICAgICAgICBzdG9yZVtldmVudF0gPSBzdG9yZVtldmVudF0uZmlsdGVyKChzYXZlZENhbGxiYWNrKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrICE9PSBzYXZlZENhbGxiYWNrO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBleHBvcnQgZnVuY3Rpb24gZG9tKGVsZW1lbnQ6IGFueSwgZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uKSB7XG4gICAgICAgIGlmICghc2V0TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGlmIChlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICBzZXRMaXN0ZW5lciA9IGZ1bmN0aW9uIChlbCwgZXYsIGZuKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbC5hZGRFdmVudExpc3RlbmVyKGV2LCBmbiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBlbGVtZW50W1wiYXR0YWNoRXZlbnRcIl0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIHNldExpc3RlbmVyID0gZnVuY3Rpb24gKGVsLCBldiwgZm4pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsLmF0dGFjaEV2ZW50KFwib25cIiArIGV2LCBmbiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNldExpc3RlbmVyID0gZnVuY3Rpb24gKGVsLCBldiwgZm4pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsW1wib25cIiArIGV2XSA9IGZuO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNldExpc3RlbmVyKGVsZW1lbnQsIGV2ZW50LCBjYWxsYmFjayk7XG4gICAgfVxuXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSWRsZUluZm8ge1xuICAgIGlzSWRsZTogYm9vbGVhbjtcbiAgICBpZGxlRm9yOiBudW1iZXI7XG4gICAgdGltZUxlZnQ6IG51bWJlcjtcbiAgICB0aW1lTGVmdFBlcjogbnVtYmVyO1xufVxuXG5leHBvcnQgY2xhc3MgVGltZXIge1xuICAgIHByaXZhdGUgdG9rZW46IG51bWJlcjtcbiAgICBzdG9wcGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGlmdmlzaWJsZTogSWZWaXNpYmxlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgc2Vjb25kczogbnVtYmVyLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgY2FsbGJhY2s6IEZ1bmN0aW9uKSB7XG4gICAgICAgIHRoaXMuc3RhcnQoKTtcblxuICAgICAgICB0aGlzLmlmdmlzaWJsZS5vbihcInN0YXR1c0NoYW5nZWRcIiwgKGRhdGE6IGFueSkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RvcHBlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdGF0dXMgPT09IFNUQVRVU19BQ1RJVkUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGF1c2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhcnQoKSB7XG4gICAgICAgIHRoaXMuc3RvcHBlZCA9IGZhbHNlO1xuICAgICAgICBjbGVhckludGVydmFsKHRoaXMudG9rZW4pO1xuICAgICAgICB0aGlzLnRva2VuID0gc2V0SW50ZXJ2YWwodGhpcy5jYWxsYmFjaywgdGhpcy5zZWNvbmRzICogMTAwMCk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0b3AoKSB7XG4gICAgICAgIHRoaXMuc3RvcHBlZCA9IHRydWU7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50b2tlbik7XG4gICAgfVxuXG4gICAgcHVibGljIHJlc3VtZSgpIHtcbiAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBwYXVzZSgpIHtcbiAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgSUUgPSAoZnVuY3Rpb24gKCkge1xuICAgIGxldCB1bmRlZixcbiAgICAgICAgdiA9IDMsXG4gICAgICAgIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksXG4gICAgICAgIGFsbCA9IGRpdi5nZXRFbGVtZW50c0J5VGFnTmFtZShcImlcIik7XG5cbiAgICB3aGlsZSAoXG4gICAgICAgIGRpdi5pbm5lckhUTUwgPSBcIjwhLS1baWYgZ3QgSUUgXCIgKyAoKyt2KSArIFwiXT48aT48L2k+PCFbZW5kaWZdLS0+XCIsXG4gICAgICAgICAgICBhbGxbMF1cbiAgICAgICAgKTtcblxuICAgIHJldHVybiB2ID4gNCA/IHYgOiB1bmRlZjtcbn0oKSk7XG5cblxuZXhwb3J0IGNsYXNzIElmVmlzaWJsZSB7XG4gICAgcHVibGljIHN0YXR1czogc3RyaW5nID0gU1RBVFVTX0FDVElWRTtcbiAgICBwdWJsaWMgVkVSU0lPTjogc3RyaW5nID0gJyc7XG4gICAgcHJpdmF0ZSB0aW1lcjogYW55O1xuICAgIHByaXZhdGUgaWRsZVRpbWU6IG51bWJlciA9IDMwMDAwO1xuICAgIHByaXZhdGUgaWRsZVN0YXJ0ZWRUaW1lOiBudW1iZXI7XG5cblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcm9vdCwgcHJpdmF0ZSBkb2MpIHtcbiAgICAgICAgbGV0IEJMVVJfRVZFTlQgPSBcImJsdXJcIjtcbiAgICAgICAgbGV0IEZPQ1VTX0VWRU5UID0gXCJmb2N1c1wiO1xuXG4gICAgICAgIC8vIEZpbmQgY29ycmVjdCBicm93c2VyIGV2ZW50c1xuICAgICAgICBpZiAodGhpcy5kb2MuaGlkZGVuICE9PSB2b2lkIDApIHtcbiAgICAgICAgICAgIERPQ19ISURERU4gPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgVklTSUJJTElUWV9DSEFOR0VfRVZFTlQgPSBcInZpc2liaWxpdHljaGFuZ2VcIjtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmRvY1tcIm1vekhpZGRlblwiXSAhPT0gdm9pZCAwKSB7XG4gICAgICAgICAgICBET0NfSElEREVOID0gXCJtb3pIaWRkZW5cIjtcbiAgICAgICAgICAgIFZJU0lCSUxJVFlfQ0hBTkdFX0VWRU5UID0gXCJtb3p2aXNpYmlsaXR5Y2hhbmdlXCI7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5kb2NbXCJtc0hpZGRlblwiXSAhPT0gdm9pZCAwKSB7XG4gICAgICAgICAgICBET0NfSElEREVOID0gXCJtc0hpZGRlblwiO1xuICAgICAgICAgICAgVklTSUJJTElUWV9DSEFOR0VfRVZFTlQgPSBcIm1zdmlzaWJpbGl0eWNoYW5nZVwiO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZG9jW1wid2Via2l0SGlkZGVuXCJdICE9PSB2b2lkIDApIHtcbiAgICAgICAgICAgIERPQ19ISURERU4gPSBcIndlYmtpdEhpZGRlblwiO1xuICAgICAgICAgICAgVklTSUJJTElUWV9DSEFOR0VfRVZFTlQgPSBcIndlYmtpdHZpc2liaWxpdHljaGFuZ2VcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChET0NfSElEREVOID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgIGlmIChJRSA8IDkpIHtcbiAgICAgICAgICAgICAgICBCTFVSX0VWRU5UID0gXCJmb2N1c291dFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgRXZlbnRzLmRvbSh0aGlzLnJvb3QsIEJMVVJfRVZFTlQsICgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ibHVyKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIEV2ZW50cy5kb20odGhpcy5yb290LCBGT0NVU19FVkVOVCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmZvY3VzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHRyYWNrQ2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRvY1tET0NfSElEREVOXSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJsdXIoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRyYWNrQ2hhbmdlKCk7IC8vIGdldCBpbml0aWFsIHN0YXR1c1xuICAgICAgICAgICAgRXZlbnRzLmRvbSh0aGlzLmRvYywgVklTSUJJTElUWV9DSEFOR0VfRVZFTlQsIHRyYWNrQ2hhbmdlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0YXJ0SWRsZVRpbWVyKCk7XG4gICAgICAgIHRoaXMudHJhY2tJZGxlU3RhdHVzKCk7XG4gICAgfVxuXG4gICAgc3RhcnRJZGxlVGltZXIoZXZlbnQ/OiBFdmVudCkge1xuICAgICAgICAvLyBQcmV2ZW50cyBQaGFudG9tIGV2ZW50cy5cbiAgICAgICAgLy8gQHNlZSBodHRwczovL2dpdGh1Yi5jb20vc2Vya2FueWVyc2VuL2lmdmlzaWJsZS5qcy9wdWxsLzM3XG4gICAgICAgIGlmIChldmVudCBpbnN0YW5jZW9mIE1vdXNlRXZlbnQgJiYgZXZlbnQubW92ZW1lbnRYID09PSAwICYmIGV2ZW50Lm1vdmVtZW50WSA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpO1xuXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gU1RBVFVTX0lETEUpIHtcbiAgICAgICAgICAgIHRoaXMud2FrZXVwKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmlkbGVTdGFydGVkVGltZSA9ICsobmV3IERhdGUoKSk7XG4gICAgICAgIHRoaXMudGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gU1RBVFVTX0FDVElWRSB8fCB0aGlzLnN0YXR1cyA9PT0gU1RBVFVTX0hJRERFTikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmlkbGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcy5pZGxlVGltZSk7XG4gICAgfVxuXG4gICAgdHJhY2tJZGxlU3RhdHVzKCkge1xuICAgICAgICBFdmVudHMuZG9tKHRoaXMuZG9jLCBcIm1vdXNlbW92ZVwiLCB0aGlzLnN0YXJ0SWRsZVRpbWVyLmJpbmQodGhpcykpO1xuICAgICAgICBFdmVudHMuZG9tKHRoaXMuZG9jLCBcIm1vdXNlZG93blwiLCB0aGlzLnN0YXJ0SWRsZVRpbWVyLmJpbmQodGhpcykpO1xuICAgICAgICBFdmVudHMuZG9tKHRoaXMuZG9jLCBcImtleXVwXCIsIHRoaXMuc3RhcnRJZGxlVGltZXIuYmluZCh0aGlzKSk7XG4gICAgICAgIEV2ZW50cy5kb20odGhpcy5kb2MsIFwidG91Y2hzdGFydFwiLCB0aGlzLnN0YXJ0SWRsZVRpbWVyLmJpbmQodGhpcykpO1xuICAgICAgICBFdmVudHMuZG9tKHRoaXMucm9vdCwgXCJzY3JvbGxcIiwgdGhpcy5zdGFydElkbGVUaW1lci5iaW5kKHRoaXMpKTtcblxuICAgICAgICAvLyB0aGlzLmZvY3VzKHdha2VVcCk7XG4gICAgICAgIC8vIHRoaXMud2FrZXVwKHdha2VVcCk7XG4gICAgfVxuXG4gICAgb24oZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IChkYXRhOiBhbnkpID0+IGFueSk6IElmVmlzaWJsZSB7XG4gICAgICAgIEV2ZW50cy5hdHRhY2goZXZlbnQsIGNhbGxiYWNrKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgb2ZmKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrPzogYW55KTogSWZWaXNpYmxlIHtcbiAgICAgICAgRXZlbnRzLnJlbW92ZShldmVudCwgY2FsbGJhY2spO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzZXRJZGxlRHVyYXRpb24oc2Vjb25kczogbnVtYmVyKTogSWZWaXNpYmxlIHtcbiAgICAgICAgdGhpcy5pZGxlVGltZSA9IHNlY29uZHMgKiAxMDAwO1xuICAgICAgICB0aGlzLnN0YXJ0SWRsZVRpbWVyKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGdldElkbGVEdXJhdGlvbigpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5pZGxlVGltZTtcbiAgICB9XG5cbiAgICBnZXRJZGxlSW5mbygpOiBJZGxlSW5mbyB7XG4gICAgICAgIGxldCBub3cgPSArKG5ldyBEYXRlKCkpO1xuICAgICAgICBsZXQgcmVzOiBJZGxlSW5mbztcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSBTVEFUVVNfSURMRSkge1xuICAgICAgICAgICAgcmVzID0ge1xuICAgICAgICAgICAgICAgIGlzSWRsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpZGxlRm9yOiBub3cgLSB0aGlzLmlkbGVTdGFydGVkVGltZSxcbiAgICAgICAgICAgICAgICB0aW1lTGVmdDogMCxcbiAgICAgICAgICAgICAgICB0aW1lTGVmdFBlcjogMTAwXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHRpbWVMZWZ0ID0gKHRoaXMuaWRsZVN0YXJ0ZWRUaW1lICsgdGhpcy5pZGxlVGltZSkgLSBub3c7XG4gICAgICAgICAgICByZXMgPSB7XG4gICAgICAgICAgICAgICAgaXNJZGxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBpZGxlRm9yOiBub3cgLSB0aGlzLmlkbGVTdGFydGVkVGltZSxcbiAgICAgICAgICAgICAgICB0aW1lTGVmdCxcbiAgICAgICAgICAgICAgICB0aW1lTGVmdFBlcjogcGFyc2VGbG9hdCgoMTAwIC0gKHRpbWVMZWZ0ICogMTAwIC8gdGhpcy5pZGxlVGltZSkpLnRvRml4ZWQoMikpXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgaWRsZShjYWxsYmFjaz86IChkYXRhOiBhbnkpID0+IGFueSk6IElmVmlzaWJsZSB7XG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgdGhpcy5vbihcImlkbGVcIiwgY2FsbGJhY2spO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSBTVEFUVVNfSURMRTtcbiAgICAgICAgICAgIEV2ZW50cy5maXJlKFwiaWRsZVwiKTtcbiAgICAgICAgICAgIEV2ZW50cy5maXJlKFwic3RhdHVzQ2hhbmdlZFwiLCBbe3N0YXR1czogdGhpcy5zdGF0dXN9XSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYmx1cihjYWxsYmFjaz86IChkYXRhOiBhbnkpID0+IGFueSk6IElmVmlzaWJsZSB7XG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgdGhpcy5vbihcImJsdXJcIiwgY2FsbGJhY2spO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSBTVEFUVVNfSElEREVOO1xuICAgICAgICAgICAgRXZlbnRzLmZpcmUoXCJibHVyXCIpO1xuICAgICAgICAgICAgRXZlbnRzLmZpcmUoXCJzdGF0dXNDaGFuZ2VkXCIsIFt7c3RhdHVzOiB0aGlzLnN0YXR1c31dKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmb2N1cyhjYWxsYmFjaz86IChkYXRhOiBhbnkpID0+IGFueSk6IElmVmlzaWJsZSB7XG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgdGhpcy5vbihcImZvY3VzXCIsIGNhbGxiYWNrKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnN0YXR1cyAhPT0gU1RBVFVTX0FDVElWRSkge1xuICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSBTVEFUVVNfQUNUSVZFO1xuICAgICAgICAgICAgRXZlbnRzLmZpcmUoXCJmb2N1c1wiKTtcbiAgICAgICAgICAgIEV2ZW50cy5maXJlKFwid2FrZXVwXCIpO1xuICAgICAgICAgICAgRXZlbnRzLmZpcmUoXCJzdGF0dXNDaGFuZ2VkXCIsIFt7c3RhdHVzOiB0aGlzLnN0YXR1c31dKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB3YWtldXAoY2FsbGJhY2s/OiAoZGF0YTogYW55KSA9PiBhbnkpOiBJZlZpc2libGUge1xuICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMub24oXCJ3YWtldXBcIiwgY2FsbGJhY2spO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdHVzICE9PSBTVEFUVVNfQUNUSVZFKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9IFNUQVRVU19BQ1RJVkU7XG4gICAgICAgICAgICBFdmVudHMuZmlyZShcIndha2V1cFwiKTtcbiAgICAgICAgICAgIEV2ZW50cy5maXJlKFwic3RhdHVzQ2hhbmdlZFwiLCBbe3N0YXR1czogdGhpcy5zdGF0dXN9XSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgb25FdmVyeShzZWNvbmRzOiBudW1iZXIsIGNhbGxiYWNrOiBGdW5jdGlvbik6IFRpbWVyIHtcbiAgICAgICAgcmV0dXJuIG5ldyBUaW1lcih0aGlzLCBzZWNvbmRzLCBjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgbm93KGNoZWNrPzogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIGlmIChjaGVjayAhPT0gdm9pZCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdGF0dXMgPT09IGNoZWNrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhdHVzID09PSBTVEFUVVNfQUNUSVZFO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSWZWaXNpYmxlIH0gZnJvbSBcIi4vc3JjL2lmdmlzaWJsZVwiO1xuXG5kZWNsYXJlIHZhciBnbG9iYWw6IGFueTtcbmNvbnN0IHJvb3QgPSB0eXBlb2Ygc2VsZiA9PT0gXCJvYmplY3RcIiAmJiBzZWxmLnNlbGYgPT09IHNlbGYgJiYgc2VsZiB8fFxuICAgICAgICAgICAgIHR5cGVvZiBnbG9iYWwgPT09IFwib2JqZWN0XCIgJiYgZ2xvYmFsLmdsb2JhbCA9PT0gZ2xvYmFsICYmIGdsb2JhbCB8fFxuICAgICAgICAgICAgIHRoaXM7XG5cbmV4cG9ydCBjb25zdCBpZnZpc2libGUgPSBuZXcgSWZWaXNpYmxlKHJvb3QsIGRvY3VtZW50KTtcbmV4cG9ydCAqIGZyb20gXCIuL3NyYy9pZnZpc2libGVcIjsiXSwibmFtZXMiOlsidGhpcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEscUJBQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQztBQUMvQixxQkFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDO0FBQzNCLHFCQUFNLGFBQWEsR0FBRyxRQUFRLENBQUM7QUFFL0IscUJBQUksVUFBa0IsQ0FBQztBQUN2QixxQkFBSSx1QkFBdUIsR0FBVyxLQUFLLENBQUMsQ0FBQztBQUU3QyxJQUFpQixNQUFNO0FBQXZCLFdBQWlCLE1BQU07SUFDbkIscUJBQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztJQUNqQixxQkFBSSxXQUFxQixDQUFDOzs7Ozs7SUFFMUIsZ0JBQXVCLEtBQWEsRUFBRSxRQUFrQjtRQUNwRCxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2YsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztTQUNyQjs7UUFFRCxLQUFLLENBQUMsS0FBSyxDQUFDLENB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