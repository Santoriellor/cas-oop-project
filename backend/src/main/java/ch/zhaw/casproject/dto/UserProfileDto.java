package ch.zhaw.casproject.dto;

import ch.zhaw.casproject.model.Role;
import ch.zhaw.casproject.model.User;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(name = "UserProfile", description = "Public profile information of the authenticated user")
public class UserProfileDto {

    @Schema(description = "User identifier")
    private UUID id;

    @Schema(description = "Email address", example = "jane.doe@example.com")
    private String email;

    @Schema(description = "Display username", example = "janedoe")
    private String username;

    @Schema(description = "Assigned roles", example = "[ 'ROLE_USER' ]")
    private Set<String> roles;

    @Schema(description = "Creation timestamp")
    private OffsetDateTime createdAt;

    @Schema(description = "Last successful login timestamp")
    private OffsetDateTime lastLogin;

    public static UserProfileDto from(User u) {
        if (u == null) return null;
        return UserProfileDto.builder()
                .id(u.getId())
                .email(u.getEmail())
                .username(u.getUsername())
                .roles(u.getRoles().stream().map(Role::name).collect(Collectors.toSet()))
                .createdAt(u.getCreatedAt())
                .lastLogin(u.getLastLogin())
                .build();
    }
}
