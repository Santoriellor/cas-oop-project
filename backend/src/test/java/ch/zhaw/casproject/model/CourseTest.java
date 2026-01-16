package ch.zhaw.casproject.model;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class CourseTest {

    @Test
    void settersAndGetters_WorkCorrectly() {
        Course course = new Course();

        Long id = 1L;
        String name = "Java Grundlagen";
        LocalDate date = LocalDate.of(2025, 3, 15);
        String status = "offen";
        String materials = "/files/java-course.pdf";

        course.setId(id);
        course.setName(name);
        course.setDate(date);
        course.setStatus(status);
        course.setMaterials(materials);

        assertEquals(id, course.getId());
        assertEquals(name, course.getName());
        assertEquals(date, course.getDate());
        assertEquals(status, course.getStatus());
        assertEquals(materials, course.getMaterials());
    }

    @Test
    void defaultValues_AreNull() {
        Course course = new Course();

        assertNull(course.getId());
        assertNull(course.getName());
        assertNull(course.getDate());
        assertNull(course.getStatus());
        assertNull(course.getMaterials());
    }
}
