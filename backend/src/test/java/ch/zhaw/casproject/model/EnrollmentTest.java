package ch.zhaw.casproject.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class EnrollmentTest {

    @Test
    void settersAndGetters_WorkCorrectly() {
        Enrollment enrollment = new Enrollment();

        Long id = 1L;
        User user = User.builder().email("u@test.com").username("u").password("pw").build();
        Course course = new Course();
        String status = "angemeldet";

        enrollment.setId(id);
        enrollment.setUser(user);
        enrollment.setCourse(course);
        enrollment.setStatus(status);

        assertEquals(id, enrollment.getId());
        assertEquals(user, enrollment.getUser());
        assertEquals(course, enrollment.getCourse());
        assertEquals(status, enrollment.getStatus());
    }
}
