package ch.zhaw.casproject.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class CertificateTest {

    @Test
    void constructor_SetsFieldsCorrectly() {
        User user = User.builder().email("u@test.com").username("u").password("pw").build();
        Course course = new Course(); // falls Course später Felder bekommt, kannst du sie hier setzen
        String filePath = "/tmp/cert.pdf";

        Certificate certificate = new Certificate(user, course, filePath);

        assertEquals(user, certificate.getUser());
        assertEquals(course, certificate.getCourse());
        assertEquals(filePath, certificate.getFilePath());
    }

    @Test
    void settersAndGetters_WorkCorrectly() {
        Certificate certificate = new Certificate();

        User user = User.builder().email("u@test.com").username("u").password("pw").build();
        Course course = new Course();
        String filePath = "path/to/file.pdf";

        certificate.setUser(user);
        certificate.setCourse(course);
        certificate.setFilePath(filePath);

        assertEquals(user, certificate.getUser());
        assertEquals(course, certificate.getCourse());
        assertEquals(filePath, certificate.getFilePath());
    }

    @Test
    void id_DefaultIsNull() {
        Certificate certificate = new Certificate();
        assertNull(certificate.getId()); // ohne Persistence bleibt id null
    }
}
