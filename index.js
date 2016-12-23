"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var ifvisible_1 = require("./src/ifvisible");
var root = typeof self === "object" && self.self === self && self ||
    typeof global === "object" && global.global === global && global ||
    this;
exports.ifvisible = new ifvisible_1.IfVisible(root, document);
__export(require("./src/ifvisible"));
//# sourceMappingURL=index.js.map