package com.bandhub;

import com.bandhub.auth.internal.domain.Account;
import com.bandhub.auth.internal.domain.AccountRepository;
import com.bandhub.social.internal.domain.Post;
import com.bandhub.social.internal.domain.SocialRepository;
import com.bandhub.users.internal.domain.UserProfile;
import com.bandhub.users.internal.domain.UserProfileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Profile("local")
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final AccountRepository accountRepository;
    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final SocialRepository socialRepository;

    public DataSeeder(AccountRepository accountRepository,
                      UserProfileRepository userProfileRepository,
                      PasswordEncoder passwordEncoder,
                      SocialRepository socialRepository) {
        this.accountRepository = accountRepository;
        this.userProfileRepository = userProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.socialRepository = socialRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        log.info("=== [DataSeeder] Seeding test data for local profile ===");
        seedUser("admin@bandhub.com",   "password123", "Admin BandHub",       "Buenos Aires, Argentina");
        seedUser("juan@bandhub.com",    "password123", "Juan Músico",         "Córdoba, Argentina");
        seedUser("maria@bandhub.com",   "password123", "María Guitarrista",   "Rosario, Argentina");
        seedPosts();
        log.info("=== [DataSeeder] Done. Login con cualquiera: password = password123 ===");
    }

    private void seedUser(String email, String password, String displayName, String location) {
        if (accountRepository.existsByEmail(email)) {
            log.info("[DataSeeder] Account ya existe, omitiendo: {}", email);
            return;
        }

        Account account = new Account();
        account.setEmail(email);
        account.setPasswordHash(passwordEncoder.encode(password));
        account.setEmailVerified(true);
        accountRepository.save(account);

        if (!userProfileRepository.existsById(account.getId())) {
            UserProfile profile = new UserProfile();
            profile.setAccountId(account.getId());
            profile.setEmail(email);
            profile.setLocation(location);
            profile.setBio("Usuario de prueba - " + displayName);
            userProfileRepository.save(profile);
        }

        log.info("[DataSeeder] Creado usuario: {} ({})", email, displayName);
    }

    private void seedPosts() {
        if (socialRepository.count() > 0) {
            log.info("[DataSeeder] Posts ya existen, omitiendo seed de foro.");
            return;
        }

        log.info("[DataSeeder] Seeding posts del foro...");

        createPost("juan@bandhub.com", "¿Qué guitarra recomiendan para principiantes?",
            "Estoy empezando y tengo un presupuesto de ~300 USD. Vi la Yamaha Pacifica 112V y la Squier Classic Vibe. ¿Alguna experiencia con estas?",
            "Guitarristas", Post.PostType.QUESTION, null);

        createPost("maria@bandhub.com", "Grabé mi primera canción 🎵",
            "Después de 6 meses de práctica, finalmente terminé de grabar mi primera canción. Es un folk acústico con influencias de Nick Drake. Les dejo el link de SoundCloud.",
            "Composición", Post.PostType.MUSIC, "https://soundcloud.com/example");

        createPost("admin@bandhub.com", "Tutorial: Cómo mezclar batería en producción moderna",
            "En este post voy a explicar las técnicas básicas de compresión paralela, EQ y reverb para lograr una batería que suene profesional en producciones de pop/rock moderno.",
            "Producción", Post.PostType.DISCUSSION, null);

        createPost("juan@bandhub.com", "Banda busca baterista - Buenos Aires",
            "Somos una banda de rock progresivo buscando baterista con experiencia. Tocamos covers de Tool, Porcupine Tree y material propio. Ensayamos sábados en Palermo.",
            "Bandas", Post.PostType.DISCUSSION, null);

        createPost("maria@bandhub.com", "Review: Fender Telecaster American Professional II",
            "Después de un año tocándola en vivo y en estudio, les cuento mi experiencia detallada con esta guitarra. Spoiler: vale cada centavo.",
            "Gear", Post.PostType.DISCUSSION, null);

        createPost("admin@bandhub.com", "¿Teoría musical o de oído? El debate eterno",
            "Siempre surge esta discusión: ¿es necesario aprender teoría musical o alcanza con desarrollar el oído? ¿Cuál es tu experiencia?",
            "Teoría Musical", Post.PostType.QUESTION, null);

        log.info("[DataSeeder] {} posts del foro creados.", socialRepository.count());
    }

    private void createPost(String email, String title, String content,
                             String category, Post.PostType type, String linkUrl) {
        Post post = new Post();
        post.setAuthorEmail(email);
        post.setTitle(title);
        post.setContent(content);
        post.setCategory(category);
        post.setPostType(type);
        post.setLinkUrl(linkUrl);
        post.setUpvotes((int)(Math.random() * 150) + 5);
        post.setDownvotes((int)(Math.random() * 10));
        socialRepository.save(post);
    }
}
