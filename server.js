"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var admin = require("firebase-admin");
var serviceAccount = require("./firebase-key.json"); // Importez la clé de service
var cors_1 = require("cors");
var routes_1 = require("./routes/routes");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
var db = admin.database();
var app = (0, express_1.default)();
var port = 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api', routes_1.default);
app.get("/", function (req, res) {
    res.send("Serveur en cours d'exécution !");
});
// ✅ Route pour s'assurer que l'admin est dans la base de données
app.post('/create-admin', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, password, userRecord, error_1, userRef, snapshot, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 9, , 10]);
                email = "salma.essid25@gmail.com";
                password = "salmaessid";
                userRecord = void 0;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 5]);
                return [4 /*yield*/, admin.auth().getUserByEmail(email)];
            case 2:
                userRecord = _a.sent();
                return [3 /*break*/, 5];
            case 3:
                error_1 = _a.sent();
                return [4 /*yield*/, admin.auth().createUser({ email: email, password: password })];
            case 4:
                userRecord = _a.sent();
                return [3 /*break*/, 5];
            case 5:
                userRef = db.ref("users/".concat(userRecord.uid));
                return [4 /*yield*/, userRef.once('value')];
            case 6:
                snapshot = _a.sent();
                if (!!snapshot.exists()) return [3 /*break*/, 8];
                return [4 /*yield*/, userRef.set({
                        email: email,
                        role: "admin",
                        status: "approved"
                    })];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8:
                res.status(201).send("\u2705 Admin op\u00E9rationnel: ".concat(userRecord.uid));
                return [3 /*break*/, 10];
            case 9:
                error_2 = _a.sent();
                res.status(500).send("❌ Erreur lors de la création de l'admin.");
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
// ✅ Route pour récupérer les utilisateurs en attente
app.get('/pending-users', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var snapshot, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db.ref('users').orderByChild('status').equalTo('pending').once('value')];
            case 1:
                snapshot = _a.sent();
                res.status(200).json(snapshot.val() || {});
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                res.status(500).send("❌ Erreur lors de la récupération des utilisateurs en attente.");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// ✅ Route pour approuver un utilisateur
app.post('/approve-user', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var uid, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                uid = req.body.uid;
                return [4 /*yield*/, db.ref("users/".concat(uid)).update({ status: 'approved' })];
            case 1:
                _a.sent();
                res.status(200).send("\u2705 Utilisateur ".concat(uid, " approuv\u00E9."));
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                res.status(500).send("❌ Erreur lors de l'approbation de l'utilisateur.");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// ✅ Route pour refuser un utilisateur
app.post('/reject-user', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var uid, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                uid = req.body.uid;
                return [4 /*yield*/, db.ref("users/".concat(uid)).remove()];
            case 1:
                _a.sent();
                res.status(200).send("\u274C Utilisateur ".concat(uid, " refus\u00E9."));
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                res.status(500).send("❌ Erreur lors du refus de l'utilisateur.");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// ✅ Route pour envoyer des notifications via FCM
app.post('/send-notification', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, token, title, body, message, response, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, token = _a.token, title = _a.title, body = _a.body;
                if (!token || !title || !body) {
                    res.status(400).send("❌ Token, title et body sont requis.");
                    return [2 /*return*/];
                }
                message = {
                    notification: {
                        title: title,
                        body: body
                    },
                    token: token // Token FCM de l'utilisateur
                };
                return [4 /*yield*/, admin.messaging().send(message)];
            case 1:
                response = _b.sent();
                res.status(200).json({ success: true, response: response });
                return [3 /*break*/, 3];
            case 2:
                error_6 = _b.sent();
                console.error('❌ Erreur lors de l\'envoi de la notification:', error_6);
                res.status(500).send("❌ Erreur lors de l'envoi de la notification.");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// 🚀 Lancer le serveur
app.listen(port, function () {
    console.log("Serveur d\u00E9marr\u00E9 sur http://localhost:".concat(port));
});
