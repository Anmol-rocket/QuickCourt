package com.kucp1127.odoohackathon_2025.SecurityConfiguration;

import com.kucp1127.odoohackathon_2025.UserRegistration.Model.UserRegistrationsModel;
import com.kucp1127.odoohackathon_2025.UserRegistration.Service.UserRegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class MyUserDetailService implements UserDetailsService {


    @Autowired
    private UserRegistrationService userRegistrationService;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<UserRegistrationsModel> userRegistration = userRegistrationService.findRegistrationByUsername(username);
        if (userRegistration.isPresent()) {
            return new UserPrincipal(userRegistration.get());
        }
        
        // 3) If neither found
        System.out.println("Not found in User");
        throw new UsernameNotFoundException("User 404");
    }

}