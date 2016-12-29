"use strict";
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
var IfVisible = (function () {
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
//# sourceMappingURL=ifvisible.js.map