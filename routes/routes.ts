import express, { Request, Response, Router } from "express";
import QRCode from "qrcode"; // Bibliothèque QRCode pour générer le QR Code

const router: Router = express.Router(); // Typage explicite de 'router'

router.post("/generate-qr", async (req: Request, res: Response): Promise<void> => {
    try {
        const { text } = req.body;
        if (!text) {
            res.status(400).json({ error: "Texte requis pour générer un QR Code." });
            return;
        }

        // Générer le QR Code sous forme de data URL (Base64)
        const qrCodeDataUrl = await QRCode.toDataURL(text);

        res.json({ qrCode: qrCodeDataUrl });
    } catch (error) {
        console.error("Erreur de génération du QR Code :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

export default router;
