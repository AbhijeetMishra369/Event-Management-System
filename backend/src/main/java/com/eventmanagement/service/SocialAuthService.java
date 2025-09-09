package com.eventmanagement.service;

import com.eventmanagement.dto.AuthResponse;
import com.eventmanagement.model.User;
import com.eventmanagement.repository.UserRepository;
import com.eventmanagement.security.JwtTokenProvider;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.GeneralSecurityException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

@Service
public class SocialAuthService {

    @Value("${google.clientId:}")
    private String googleClientId;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public AuthResponse authenticateWithGoogle(String idTokenString) throws Exception {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                JacksonFactory.getDefaultInstance()
        )
                .setAudience(Collections.singletonList(googleClientId))
                .build();

        GoogleIdToken idToken = verifyGoogleIdToken(verifier, idTokenString);
        if (idToken == null) {
            throw new IllegalArgumentException("Invalid Google ID token");
        }

        GoogleIdToken.Payload payload = idToken.getPayload();
        String googleUserId = payload.getSubject();
        String email = payload.getEmail();
        String firstName = (String) payload.get("given_name");
        String lastName = (String) payload.get("family_name");
        String pictureUrl = (String) payload.get("picture");

        Optional<User> existingByEmail = userRepository.findByEmail(email);
        User user = existingByEmail.orElseGet(User::new);
        if (user.getId() == null) {
            user.setEmail(email);
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setProfileImage(pictureUrl);
            user.setAuthProvider("GOOGLE");
            user.setProviderId(googleUserId);
            user.setEmailVerified(true);
            user.setRole(User.UserRole.ATTENDEE);
            user.setEnabled(true);
            user.setCreatedAt(LocalDateTime.now());
        } else {
            user.setFirstName(firstName != null ? firstName : user.getFirstName());
            user.setLastName(lastName != null ? lastName : user.getLastName());
            user.setProfileImage(pictureUrl != null ? pictureUrl : user.getProfileImage());
            user.setAuthProvider("GOOGLE");
            user.setProviderId(googleUserId);
            user.setEmailVerified(true);
        }
        user.setLastLoginAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User saved = userRepository.save(user);

        String jwt = jwtTokenProvider.generateTokenFromUsername(saved.getEmail());
        String refreshToken = jwtTokenProvider.generateRefreshToken(saved.getEmail());

        return new AuthResponse(
                jwt,
                refreshToken,
                "Bearer",
                jwtTokenProvider.getExpirationDateFromToken(jwt).getTime(),
                new AuthResponse.UserInfo(
                        saved.getId(),
                        saved.getEmail(),
                        saved.getFirstName(),
                        saved.getLastName(),
                        saved.getFullName(),
                        saved.getRole().name(),
                        saved.getProfileImage()
                )
        );
    }

    private GoogleIdToken verifyGoogleIdToken(GoogleIdTokenVerifier verifier, String idTokenString)
            throws GeneralSecurityException, java.io.IOException {
        return verifier.verify(idTokenString);
    }
}

