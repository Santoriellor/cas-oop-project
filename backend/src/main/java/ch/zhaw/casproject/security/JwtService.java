package ch.zhaw.casproject.security;

import ch.zhaw.casproject.model.Role;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class JwtService {

    private static final String FORBIDDEN_OLD_KEY =
            "u1NqXk7b3L8nF7h1yT5rP4m9wQ0zA2vB6cYdGfHjK8s=";
    private static final int MIN_KEY_BYTES = 32;

    @Value("${jwt.secret:}")
    private String secretKey;
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24;

    // --- Extraction helpers ---

    public String extractEmail(String token) throws InvalidJwtException {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) throws InvalidJwtException {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) throws InvalidJwtException {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSignInKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            throw new InvalidJwtException("JWT expired", e);
        } catch (JwtException e) {
            throw new InvalidJwtException("Invalid JWT", e);
        }
    }

    // --- Token generation helpers ---

    public String generateToken(String username, Set<Role> roles) {
        String rolesStr = roles.stream().map(Enum::name).collect(Collectors.joining(","));
        Date now = new Date();
        Date exp = new Date(now.getTime() + EXPIRATION_TIME);
        return Jwts.builder()
                .setSubject(username)
                .claim("roles", rolesStr)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // --- Token validation helpers ---

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getSignInKey()).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // --- Key generation helpers ---

    /**
     * Fails application startup rather than allowing a weak, absent, or leaked signing key.
     * Package-private so the test can invoke it directly.
     */
    @PostConstruct
    void validateKeyOnStartup() {
        if (secretKey == null || secretKey.isBlank()) {
            throw new IllegalStateException(
                    "jwt.secret is not configured. Set the JWT_SECRET environment variable.");
        }
        if (FORBIDDEN_OLD_KEY.equals(secretKey)) {
            throw new IllegalStateException(
                    "jwt.secret is the leaked key from git history. Generate a new one.");
        }
        final byte[] decoded;
        try {
            decoded = Decoders.BASE64.decode(secretKey);
        } catch (RuntimeException e) {
            throw new IllegalStateException("jwt.secret must be valid base64", e);
        }
        if (decoded.length < MIN_KEY_BYTES) {
            throw new IllegalStateException(
                    "jwt.secret must decode to at least " + MIN_KEY_BYTES
                    + " bytes for HS256; got " + decoded.length);
        }
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // --- Custom exception ---

    public static class InvalidJwtException extends RuntimeException {
        public InvalidJwtException(String message) { super(message); }
        public InvalidJwtException(String message, Throwable cause) { super(message, cause); }
    }
}
