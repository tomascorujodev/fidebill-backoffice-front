import jsPDF from "jspdf";
import jwtDecode from "../utils/jwtDecode";

export default async function imprimirComprobante({ documento, nombre, apellido, cuerpo, puntos }) {
    let token = jwtDecode(sessionStorage.getItem("token"));
    let img = new Image();
    img.onload = () => {
        let width = img.width;
        let height = img.height;

        let maxWidth = 53;
        let maxHeight = 10;

        let aspectRatio = width / height;

        let newWidth = width;
        let newHeight = height;

        if (newWidth > maxWidth) {
            newWidth = maxWidth;
            newHeight = newWidth / aspectRatio;
        }

        if (newHeight > maxHeight) {
            newHeight = maxHeight;
            newWidth = newHeight * aspectRatio;
        }

        let pageWidth = 58;

        let xPos = (pageWidth - newWidth) / 2;

        let yPos = 5;

        let counter = yPos + newHeight + 5;

        let doc = new jsPDF({
            unit: "mm",
            format: [58, 90],
            lineHeight: 1.2,
        });

        doc.setFont("Courier", "normal");
        doc.setFontSize(8);

        doc.addImage(`/assets/${token?.NombreEmpresa}_logo.png`, 'PNG', xPos, yPos, newWidth, newHeight);

        doc.text(`NRO DOCUMENTO: ${documento}`, 2, counter);
        counter += 8;
        doc.text(`CLIENTE: ${nombre + " " + apellido}`, 2, counter);
        counter += 8;
        doc.text("--------------------------------", 2, counter);
        counter += 8;

        cuerpo?.forEach((text) => {
            doc.text(text, 2, counter);
            counter += 8;
        });

        doc.text("--------------------------------", 2, counter);
        counter += 8;
        doc.text(`PUNTOS ACUMULADOS: ${puntos}`, 2, counter);
        counter += 8;
        doc.text("--------------------------------", 2, counter);
        counter += 8;
        doc.text("MUCHAS GRACIAS", (pageWidth - doc.getTextWidth("MUCHAS GRACIAS")) / 2, counter);

        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');
    }

    img.src = `/assets/${token?.NombreEmpresa}_logo.png`;
}
