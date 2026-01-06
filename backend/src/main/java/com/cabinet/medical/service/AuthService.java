package com.cabinet.medical.service;

import com.cabinet.medical.dto.request.LoginRequest;
import com.cabinet.medical.dto.response.LoginResponse;
import com.cabinet.medical.entity.Utilisateur;
import com.cabinet.medical.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder; // ✅ AJOUTÉ

    public LoginResponse login(LoginRequest request) {
        System.out.println("🔍 Login demandé : " + request.getLogin());
        System.out.println("🔑 Mot de passe reçu : " + request.getPassword());

        Utilisateur user = utilisateurRepository
                .findByLogin(request.getLogin())
                .orElseThrow(() -> {
                    System.out.println("❌ UTILISATEUR INTROUVABLE");
                    return new RuntimeException("Login ou mot de passe incorrect");
                });

        System.out.println("✅ Utilisateur trouvé : " + user.getLogin());
        System.out.println("🔐 Hash BD : " + user.getPwd());
        System.out.println("🔐 Length hash : " + user.getPwd().length());

        boolean passwordMatches = false;

        if (user.getPwd().startsWith("$2a$") || user.getPwd().startsWith("$2b$")) {
            passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPwd());
            System.out.println("🔒 BCrypt match result : " + passwordMatches);
        } else {
            passwordMatches = request.getPassword().equals(user.getPwd());
            System.out.println("🔓 Comparaison directe : " + passwordMatches);

            if (passwordMatches) {
                user.setPwd(passwordEncoder.encode(request.getPassword()));
                utilisateurRepository.save(user);
            }
        }

        if (!passwordMatches) {
            System.out.println("❌ MOT DE PASSE INCORRECT");
            throw new RuntimeException("Login ou mot de passe incorrect");
        }

        System.out.println("✅ CONNEXION RÉUSSIE");

        return new LoginResponse(
                user.getId(),
                user.getLogin(),
                user.getNom(),
                user.getPrenom(),
                user.getRole(),
                "token-temporaire"
        );
    }
}