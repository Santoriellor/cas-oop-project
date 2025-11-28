package ch.zhaw.casproject.security;

import ch.zhaw.casproject.model.Role;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class JwtService {

    private static final String SECRET_KEY = "u1NqXk7b3L8nF7h1yT5rP4m9wQ0zA2vB6cYdGfHjK8s=";
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

    /*public String getUsernameFromJwtToken(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(SECRET_KEY).build().parseClaimsJws(token).getBody();
        return claims.getSubject();
    }*/

    // --- Key generation helpers ---

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // --- Custom exception ---

    public static class InvalidJwtException extends RuntimeException {
        public InvalidJwtException(String message) { super(message); }
        public InvalidJwtException(String message, Throwable cause) { super(message, cause); }
    }
}
