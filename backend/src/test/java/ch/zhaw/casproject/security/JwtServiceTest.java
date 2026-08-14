package ch.zhaw.casproject.security;

import ch.zhaw.casproject.model.Role;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;

class JwtServiceTest {

    /** 32 zero bytes, base64-encoded — valid shape, test-only value. */
    private static final String TEST_SECRET =
            "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
    private static final String OLD_HARDCODED_KEY =
            "u1NqXk7b3L8nF7h1yT5rP4m9wQ0zA2vB6cYdGfHjK8s=";

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey", TEST_SECRET);
        jwtService.validateKeyOnStartup();
    }

    @Test
    void tokenSignedWithConfiguredKeyIsAccepted() {
        String token = jwtService.generateToken("alice@example.com", Collections.emptySet());
        assertEquals("alice@example.com", jwtService.extractEmail(token));
    }

    @Test
    void tokenForgedWithOldHardcodedKeyIsRejected() {
        String forged = Jwts.builder()
                .setSubject("attacker@example.com")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 60_000))
                .signWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(OLD_HARDCODED_KEY)),
                          SignatureAlgorithm.HS256)
                .compact();

        assertFalse(jwtService.validateToken(forged));
        assertThrows(JwtService.InvalidJwtException.class,
                     () -> jwtService.extractEmail(forged));
    }

    @Test
    void startupFailsWhenSecretIsBlank() {
        JwtService svc = new JwtService();
        ReflectionTestUtils.setField(svc, "secretKey", "");
        assertThrows(IllegalStateException.class, svc::validateKeyOnStartup);
    }

    @Test
    void startupFailsWhenSecretDecodesToTooFewBytes() {
        JwtService svc = new JwtService();
        ReflectionTestUtils.setField(svc, "secretKey", "c2hvcnQ=");  // "short"
        assertThrows(IllegalStateException.class, svc::validateKeyOnStartup);
    }

    @Test
    void startupFailsWhenSecretIsStillTheOldKey() {
        JwtService svc = new JwtService();
        ReflectionTestUtils.setField(svc, "secretKey", OLD_HARDCODED_KEY);
        assertThrows(IllegalStateException.class, svc::validateKeyOnStartup);
    }
}
