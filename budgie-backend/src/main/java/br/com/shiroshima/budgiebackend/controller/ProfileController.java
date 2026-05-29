package br.com.shiroshima.budgiebackend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.shiroshima.budgiebackend.model.Profile;
import br.com.shiroshima.budgiebackend.service.ProfileService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/profile")
public class ProfileController {

    @Autowired
    private ProfileService service;

    @GetMapping
    public ResponseEntity<List<Profile>> getAllProfiles() {
        return ResponseEntity.ok(service.listAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Profile> fetchProfileById(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(service.fetchById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Profile> addProfile(@RequestBody @Valid Profile profile) {
        var response = service.createProfile(profile);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeProfile(@PathVariable UUID id) {
        service.remove(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PutMapping
    public ResponseEntity<Profile> editProfile(@RequestBody @Valid Profile profile) {
        return ResponseEntity.ok(service.edit(profile));
    }
}
