"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.health = void 0;
async function health(req, res) {
    if (req.path === "/up") {
        res.status(200).json({ message: "ok" });
    }
    else if (req.path === "/ping") {
        res.status(200).json({ message: "pong" });
    }
}
exports.health = health;
//# sourceMappingURL=health.js.map