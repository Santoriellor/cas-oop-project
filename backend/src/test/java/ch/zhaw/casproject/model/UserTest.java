package ch.zhaw.casproject.model;

import org.junit.jupiter.api.Test;

import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class UserTest {

    @Test
    void prePersist_GeneratesIdIfNull() {
        User user = User.builder()
                .email("test@example.com")
                .username("testuser")
                .password("pw")
                .build();

        assertNull(user.getId());

        user.prePersist();

        assertNotNull(user.getId());
    }

    @Test
    void prePersist_DoesNotOverrideExistingId() {
        UUID existingId = UUID.randomUUID();

        User user = User.builder()
                .id(existingId)
                .email("test@example.com")
                .username("testuser")
                .password("pw")
                .build();

        user.prePersist();

        assertEquals(existingId, user.getId());
    }

    @Test
    void builder_SetsFieldsCorrectly() {
        UUID id = UUID.randomUUID();

        User user = User.builder()
                .id(id)
                .email("test@example.com")
                .username("testuser")
                .password("secret")
                .roles(Set.of(Role.ROLE_USER))
                .build();

        assertEquals(id, user.getId());
        assertEquals("test@example.com", user.getEmail());
        assertEquals("testuser", user.getUsername());
        assertEquals("secret", user.getPassword());
        assertTrue(user.getRoles().contains(Role.ROLE_USER));
    }

    @Test
    void roles_DefaultIsEmptySet_NotNull() {
        User user = new User();
        assertNotNull(user.getRoles());
        assertTrue(user.getRoles().isEmpty());
    }
}

