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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQRCode = void 0;
const qrcode_1 = __importDefault(require("qrcode"));
const generateQRCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { text } = req.body; // Le texte à encoder dans le QR Code
        if (!text) {
            return res.status(400).json({ error: "Le texte est requis" });
        }
        // Générer l'image du QR Code sous format Data URL (base64)
        const qrCodeImage = yield qrcode_1.default.toDataURL(text);
        res.status(200).json({ qrCode: qrCodeImage });
    }
    catch (error) {
        console.error("Erreur de génération du QR Code :", error);
        res.status(500).json({ error: "Erreur lors de la génération du QR Code" });
    }
});
exports.generateQRCode = generateQRCode;
