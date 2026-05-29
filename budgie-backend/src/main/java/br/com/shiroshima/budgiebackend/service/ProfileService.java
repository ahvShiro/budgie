package br.com.shiroshima.budgiebackend.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.shiroshima.budgiebackend.model.Profile;
import br.com.shiroshima.budgiebackend.repository.ProfileRepository;

@Service
public class ProfileService {
    
    @Autowired
    private ProfileRepository repo;

    public Profile createProfile(Profile profile) {
        return repo.save(profile);
    }

    public List<Profile> listAll() {
        return repo.findAll();
    }

    public Profile fetchById(UUID id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Id not found"));
    }

    public void remove(UUID id) {
        repo.deleteById(id);
    }
    
    public Profile edit(Profile profile) {
        Profile prevProfile = fetchById(profile.getId());
        prevProfile.setProfileName(profile.getProfileName());

        return repo.save(prevProfile);
    }
}
