package ch.zhaw.casproject.service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

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

            // Add basic certificate content
            document.add(new Paragraph("Kursbestätigung"));
            document.add(new Paragraph("Teilnehmer: " + userName));
            document.add(new Paragraph("Kurs: " + courseName));

            // Finalize the document and flush content to the output stream
            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            // Wrap and rethrow exceptions to signal PDF generation failure
            throw new RuntimeException("PDF konnte nicht erstellt werden", e);
        }
    }
}
