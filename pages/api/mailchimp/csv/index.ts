import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error al procesar el archivo");
      }

      // Aquí puedes procesar el archivo CSV
      // files.csv es el archivo enviado en el formulario
    });
  } else {
    res.status(405).send("Método no permitido");
  }
}
