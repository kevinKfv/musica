package com.bandhub;

import com.bandhub.auth.internal.domain.Account;
import com.bandhub.auth.internal.domain.AccountRepository;
import com.bandhub.chat.internal.application.ChatService;
import com.bandhub.chat.internal.domain.Conversation;
import com.bandhub.library.internal.domain.AudioTrack;
import com.bandhub.library.internal.domain.SheetMusic;
import com.bandhub.library.internal.domain.Song;
import com.bandhub.library.internal.domain.SongRepository;
import com.bandhub.places.internal.domain.Place;
import com.bandhub.places.internal.domain.PlaceRepository;
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

import java.util.UUID;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final AccountRepository accountRepository;
    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final SocialRepository socialRepository;
    private final PlaceRepository placeRepository;
    private final SongRepository songRepository;
    private final ChatService chatService;

    public DataSeeder(AccountRepository accountRepository,
                      UserProfileRepository userProfileRepository,
                      PasswordEncoder passwordEncoder,
                      SocialRepository socialRepository,
                      PlaceRepository placeRepository,
                      SongRepository songRepository,
                      ChatService chatService) {
        this.accountRepository = accountRepository;
        this.userProfileRepository = userProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.socialRepository = socialRepository;
        this.placeRepository = placeRepository;
        this.songRepository = songRepository;
        this.chatService = chatService;
    }

    @Override
    @Transactional
    public void run(String... args) {
        log.info("=== [DataSeeder] Seeding test data for local/dev profile ===");
        Account admin = seedUser("admin@bandhub.com", "password123", "Admin BandHub", "Buenos Aires, Argentina");
        Account juan = seedUser("juan@bandhub.com", "password123", "Juan Músico", "Córdoba, Argentina");
        seedUser("maria@bandhub.com", "password123", "María Guitarrista", "Rosario, Argentina");

        seedPosts();
        seedPlaces();
        seedLibrary(admin.getId());
        seedChat(admin.getId(), juan.getId());

        log.info("=== [DataSeeder] Done. Login con cualquiera: password = password123 ===");
    }

    private Account seedUser(String email, String password, String displayName, String location) {
        Account account = accountRepository.findByEmail(email).orElse(null);
        if (account != null) {
            log.info("[DataSeeder] Account ya existe, omitiendo: {}", email);
            return account;
        }

        account = new Account();
        account.setEmail(email);
        account.setPasswordHash(passwordEncoder.encode(password));
        account.setEmailVerified(true);
        account = accountRepository.save(account);

        if (!userProfileRepository.existsById(account.getId())) {
            UserProfile profile = new UserProfile();
            profile.setAccountId(account.getId());
            profile.setEmail(email);
            profile.setLocation(location);
            profile.setBio("Músico de la comunidad - " + displayName);
            userProfileRepository.save(profile);
        }

        log.info("[DataSeeder] Creado usuario: {} ({})", email, displayName);
        return account;
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

    private void seedPlaces() {
        if (placeRepository.count() > 0) {
            log.info("[DataSeeder] Places ya existen, omitiendo.");
            return;
        }

        log.info("[DataSeeder] Seeding lugares y salas para el mapa...");

        createPlace("La Cueva Bar & Live Stage", "Mítico bar porteño con escenario acústico, consola digital Behringer y microfonía Shure.",
                -34.5889, -58.4305, Place.PlaceType.BAR, "Av. Santa Fe 3420, Palermo, CABA");

        createPlace("Estudio El Pie Recording", "Estudio clase A de grabación y mastering con consola SSL 4000E y microfonía Neumann.",
                -34.5715, -58.4623, Place.PlaceType.RECORDING_STUDIO, "Villa Urquiza, CABA");

        createPlace("Salas La Bohemia", "4 salas de ensayo totalmente acustizadas con Marshall JCM900, Ampeg SVT y batería Pearl Export.",
                -34.6037, -58.4116, Place.PlaceType.REHEARSAL_ROOM, "Av. Corrientes 3800, Almagro, CABA");

        createPlace("Teatro Vorterix Live", "Auditorio con capacidad para 1500 personas, sistema Line Array D&B y pantalla LED gigante.",
                -34.5772, -58.4455, Place.PlaceType.VENUE, "Federico Lacroze 3455, Colegiales, CABA");

        createPlace("Córdoba Rock Club & Sala", "Espacio cultural para recitales y ensayos con backline completo y bar propio.",
                -31.4201, -64.1888, Place.PlaceType.BAR, "Bv. San Juan 650, Córdoba");

        log.info("[DataSeeder] {} lugares creados para el mapa.", placeRepository.count());
    }

    private void seedLibrary(UUID userId) {
        if (songRepository.count() > 0) {
            log.info("[DataSeeder] Canciones de biblioteca ya existen, omitiendo.");
            return;
        }

        log.info("[DataSeeder] Seeding canciones en la biblioteca musical...");

        createSongWithAssets("De Música Ligera", "Soda Stereo", "Rock Alternativo", userId,
                "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                "Guitarra Eléctrica", "PDF");

        createSongWithAssets("Mil Horas", "Los Abuelos de la Nada", "Pop Rock", userId,
                "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                "Teclado / Piano", "PDF");

        createSongWithAssets("Rezo por Vos", "Charly García & Spinetta", "Rock Nacional", userId,
                "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                "Bajo Eléctrico", "MusicXML");

        createSongWithAssets("Crimen", "Gustavo Cerati", "Art Rock", userId,
                "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
                "Voz y Acordes", "PDF");

        log.info("[DataSeeder] {} canciones creadas en la biblioteca.", songRepository.count());
    }

    private void seedChat(UUID adminId, UUID juanId) {
        try {
            Conversation conv = chatService.createDirectConversation(adminId, juanId);
            chatService.saveMessage(conv.getId(), juanId, "¡Hola! ¿Coordinamos el ensayo para este sábado?");
            chatService.saveMessage(conv.getId(), adminId, "¡Dale, de una! Tengo listos los temas nuevos en la biblioteca musical.");
            log.info("[DataSeeder] Chat de prueba inicializado con éxito.");
        } catch (Exception e) {
            log.warn("[DataSeeder] No se pudo inicializar chat de prueba: {}", e.getMessage());
        }
    }

    private void createPlace(String name, String desc, double lat, double lng, Place.PlaceType type, String address) {
        Place place = new Place();
        place.setName(name);
        place.setDescription(desc);
        place.setLatitude(lat);
        place.setLongitude(lng);
        place.setPlaceType(type);
        place.setAddress(address);
        place.setCreatedByEmail("admin@bandhub.com");
        placeRepository.save(place);
    }

    private void createSongWithAssets(String title, String artist, String genre, UUID userId, String audioUrl, String instrument, String format) {
        Song song = new Song();
        song.setTitle(title);
        song.setArtist(artist);
        song.setGenre(genre);
        song.setCreatedBy(userId);

        AudioTrack track = new AudioTrack();
        track.setSong(song);
        track.setTrackType("ORIGINAL");
        track.setFileUrl(audioUrl);
        track.setDurationSeconds(210);
        track.setCreatedBy(userId);
        song.addAudioTrack(track);

        SheetMusic sheet = new SheetMusic();
        sheet.setSong(song);
        sheet.setInstrument(instrument);
        sheet.setFormatType(format);
        sheet.setFileUrl("https://raw.githubusercontent.com/DietrichGebert/ponytail/main/README.md");
        sheet.setCreatedBy(userId);
        song.addSheetMusic(sheet);

        songRepository.save(song);
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
