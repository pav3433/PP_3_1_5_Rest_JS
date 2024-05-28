package ru.kata.spring.boot_security.demo.services;

import org.springframework.security.core.userdetails.UserDetailsService;
import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;

public interface UserService extends UserDetailsService {
    List<User> getAllUsers();

    User getUserByUsername(String username);

    void saveUser(User user);

    User getUserById(Long id);

    void editUser(Long id, User user);

    void deleteUser(Long id);


}
