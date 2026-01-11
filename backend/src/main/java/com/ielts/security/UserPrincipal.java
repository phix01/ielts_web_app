package com.ielts.security;

import com.ielts.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

public class UserPrincipal implements UserDetails {
    private Long id;
    private String uid;
    private String email;
    private String password;
    private Boolean emailVerified = false;
    private Collection<? extends GrantedAuthority> authorities;
    
    public UserPrincipal(Long id, String uid, String email, String password,
                        Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.uid = uid;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
    }
    
    public static UserPrincipal create(User user) {
        List<GrantedAuthority> authorities = Collections.singletonList(
            new SimpleGrantedAuthority("ROLE_USER")
        );
        UserPrincipal p = new UserPrincipal(
            user.getId(),
            user.getUid(),
            user.getEmail(),
            user.getPassword(),
            authorities
        );
        p.emailVerified = Boolean.TRUE.equals(user.getEmailVerified());
        return p;
    }

    public boolean isEmailVerified() {
        return Boolean.TRUE.equals(emailVerified);
    }
    
    public Long getId() {
        return id;
    }
    
    public String getUid() {
        return uid;
    }
    
    @Override
    public String getUsername() {
        return email;
    }
    
    @Override
    public String getPassword() {
        return password;
    }
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
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
    public boolean isCredentialsNonExpired() {
        return true;
    }
    
    @Override
    public boolean isEnabled() {
        return true;
    }
}


