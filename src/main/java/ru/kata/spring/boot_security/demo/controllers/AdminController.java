package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.RoleService;
import ru.kata.spring.boot_security.demo.services.UserService;

import java.security.Principal;

@Controller
@RequestMapping("/admin")
public class AdminController {
    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public AdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping("/users")
    public String getAllUsers(Model model, Principal principal) {
        User user = userService.getUserByUsername(principal.getName());
        model.addAttribute("user", user);
        model.addAttribute("emptyUser", new User());
        model.addAttribute("users", userService.getAllUsers());
        model.addAttribute("roles", roleService.getAllRoles());
        return "admin";
    }

    @PostMapping("/add")
    public String saveUser(@ModelAttribute("emptyUser") User user) {
        userService.saveUser(user);
        return "redirect:/admin/users";
    }

    @PatchMapping("/edit")
    public String editUser(@RequestParam(value = "id") Long id, @ModelAttribute("user") User user) {
        userService.editUser(id, user);
        return "redirect:/admin/users";
    }

    @DeleteMapping("/delete")
    public String deleteUser(@RequestParam(value = "id") Long id) {
        userService.deleteUser(id);
        return "redirect:/admin/users";
    }
}
