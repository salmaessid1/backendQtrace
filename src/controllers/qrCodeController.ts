import { Request, Response } from "express";
import QRCode from "qrcode";

export const generateQRCode = async (req: Request, res: Response) => {
  try {
    const { text } = req.body; // Le texte à encoder dans le QR Code
    if (!text) {
      return res.status(400).json({ error: "Le texte est requis" });
    }

    // Générer l'image du QR Code sous format Data URL (base64)
    const qrCodeImage = await QRCode.toDataURL(text);

    res.status(200).json({ qrCode: qrCodeImage });
  } catch (error) {
    console.error("Erreur de génération du QR Code :", error);
    res.status(500).json({ error: "Erreur lors de la génération du QR Code" });
  }
};
