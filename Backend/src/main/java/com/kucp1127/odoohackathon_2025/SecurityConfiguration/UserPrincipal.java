package com.kucp1127.odoohackathon_2025.SecurityConfiguration;


import com.kucp1127.odoohackathon_2025.UserRegistration.Model.UserRegistrationsModel;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class UserPrincipal implements UserDetails {



    private final UserRegistrationsModel studentRegistrationModel;

    public UserPrincipal(UserRegistrationsModel users){
        this.studentRegistrationModel =users;
    }
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority("USER"));
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public String getPassword() {
        return studentRegistrationModel.getPassword();
    }

    @Override
    public String getUsername() {
        return studentRegistrationModel.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }


}