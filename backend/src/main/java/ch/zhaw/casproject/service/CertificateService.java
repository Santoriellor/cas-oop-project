package ch.zhaw.casproject.service;

import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.canvas.PdfCanvas;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.properties.TextAlignment;
import org.springframework.stereotype.Service;

import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.layout.element.Image;

import com.itextpdf.kernel.geom.Rectangle;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;

/**
 * Service responsible for generating certificate PDF documents.
 *
 * <p>
 * This service uses the iText library to create simple PDF documents
 * containing course completion information for a user.
 * </p>
 *
 * <p>
 * The generated PDF is created entirely in memory and returned
 * as a byte array.
 * </p>
 */

@Service
public class CertificateService {

    /**
     * Generates a PDF certificate for a given user and course.
     *
     * <p>
     * The PDF contains basic textual information such as the course title
     * and the participant's name.
     * </p>
     *
     * @param userName the name of the user receiving the certificate
     * @param courseName the name of the completed course
     * @return a byte array containing the generated PDF
     * @throws RuntimeException if PDF generation fails
     */

    public byte[] generatePdf(String userName, String courseName) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            // Initialize PDF writer and document using an in-memory output stream
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // Fonts
            PdfFont titleFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
            PdfFont normalFont = PdfFontFactory.createFont(StandardFonts.HELVETICA);

            // Add basic certificate content
            // Inhalt
              // nur Abstand
            document.add(new Paragraph("")
                    .setFont(normalFont)
                    .setFontSize(14)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(25));

            document.add(new Paragraph("CERTIFICATE OF COMPLETION")
                    .setFont(titleFont)
                    .setFontSize(24)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(40));

            document.add(new Paragraph("This certifies that")
                    .setFont(normalFont)
                    .setFontSize(14)
                    .setTextAlignment(TextAlignment.CENTER));

            document.add(new Paragraph(userName)
                    .setFont(titleFont)
                    .setFontSize(20)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(30));

            document.add(new Paragraph("has successfully completed the course")
                    .setFont(normalFont)
                    .setFontSize(14)
                    .setTextAlignment(TextAlignment.CENTER));

            document.add(new Paragraph(courseName)
                    .setFont(titleFont)
                    .setFontSize(18)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(40));

            document.add(new Paragraph("Date: " + LocalDate.now())
                    .setFont(normalFont)
                    .setFontSize(12)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(80));

            // Bild der Unterschrift einfügen
            String signaturePath = "src/main/resources/signature.png";
            ImageData signatureData = ImageDataFactory.create(signaturePath);
            Image signature = new Image(signatureData);
            signature.scaleToFit(150, 50);           // Breite/Höhe anpassen
            signature.setHorizontalAlignment(com.itextpdf.layout.properties.HorizontalAlignment.CENTER);
            document.add(signature);

            document.add(new Paragraph("__________________________")
                    .setTextAlignment(TextAlignment.CENTER));

            document.add(new Paragraph("Authorized Signature")
                    .setFontSize(12)
                    .setTextAlignment(TextAlignment.CENTER));







            // Rahmen (auf ERSTE Seite!)
            PdfCanvas canvas = new PdfCanvas(pdf.getFirstPage());
            Rectangle rect = new Rectangle(36, 36, 523, 770);
            canvas.setLineWidth(2);
            canvas.rectangle(rect);
            canvas.stroke();

            // Finalize the document and flush content to the output stream
            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            // Wrap and rethrow exceptions to signal PDF generation failure
            throw new RuntimeException("PDF konnte nicht erstellt werden", e);
        }
    }
}
