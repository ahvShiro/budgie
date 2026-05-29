package br.com.shiroshima.budgiebackend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.shiroshima.budgiebackend.model.Profile;

public interface ProfileRepository extends JpaRepository<Profile, UUID> {
    
}
