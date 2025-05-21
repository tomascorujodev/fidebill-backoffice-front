import jsPDF from "jspdf";
import jwtDecode from "../utils/jwtDecode";

export default async function imprimirComprobante({documento, nombre, apellido, cuerpo, puntos}){

    const token = jwtDecode(sessionStorage.getItem("token"));
    let counter = 42;
    const doc = new jsPDF({
    unit: "mm",
    format: [58, 90],
    lineHeight: 1.2,
    });

    doc.setFont("Courier", "normal");
    doc.setFontSize(8);
    doc.addImage(`/assets/${token?.NombreEmpresa}_logo.png`, 'PNG', 15, 1, 27, 13);
    doc.text(`NRO DOCUMENTO: ${documento}`, 2, 18);
    doc.text(`CLIENTE: ${nombre + " " + apellido}`, 2, 26);
    doc.text("--------------------------------", 2, 34);
    cuerpo?.map((text) => {
        doc.text(text, 2, counter);
        counter += 8;
    })
    doc.text("--------------------------------", 2, counter);
    counter += 8;
    doc.text(`PUNTOS ACUMULADOS: ${puntos}`, 2, counter);
    counter += 8;
    doc.text("--------------------------------", 2, counter);
    counter += 8;
    doc.text("MUCHAS GRACIAS", 17, counter);
    
    doc.autoPrint();

    window.open(doc.output('bloburl'), '_blank');
}