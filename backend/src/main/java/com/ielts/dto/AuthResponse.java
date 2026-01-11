package com.ielts.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String uid;
    private String email;
    private String firstName;
    private String userImage;
    private Boolean isPremium;
    private Boolean emailVerified;
}


