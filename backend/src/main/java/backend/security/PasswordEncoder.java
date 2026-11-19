
package backend.security;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class PasswordEncoder {

    private final BCryptPasswordEncoder encoder =
            new BCryptPasswordEncoder();

    public String encodePassword(String password) {
        return encoder.encode(password);
    }

    public boolean checkPassword(
            String rawPassword,
            String encodedPassword) {

        return encoder.matches(rawPassword, encodedPassword);
    }
}
