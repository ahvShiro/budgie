package br.com.shiroshima.budgiebackend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.shiroshima.budgiebackend.model.User;
// import br.com.shiroshima.budgiebackend.model.dto.UserCreateDTO;
import br.com.shiroshima.budgiebackend.repository.UserRepository;

@Service
public class UserService {
    
    @Autowired
    private UserRepository repo;

    public User createUser(User user) {
        return repo.save(user);
    }

    public List<User> listAll() {
        return repo.findAll();
    }

    public User fetchById(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Id not found"));
    }

    public void remove(Long id) {
        repo.deleteById(id);
    }
    
    public User edit(User user) {
        User prevUser = fetchById(user.getId());
        prevUser.setName(user.getName());

        return repo.save(prevUser);
    }
}
