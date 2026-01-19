package ch.zhaw.casproject.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * REST controller providing a health check endpoint.
 *
 * <p>
 * This endpoint can be used by monitoring systems, load balancers,
 * or deployment pipelines to verify that the application is running
 * and responsive.
 * </p>
 */

@RestController
@RequestMapping("/api")
public class HealthController {

    /**
     * Returns the health status of the application.
     *
     * <p>
     * A successful response indicates that the application is up and
     * able to handle requests.
     * </p>
     *
     * @return a JSON response containing the application status
     */

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of("status", "UP"));
    }
}
