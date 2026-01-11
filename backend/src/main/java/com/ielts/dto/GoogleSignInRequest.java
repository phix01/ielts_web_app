package com.ielts.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoogleSignInRequest {
    @NotBlank
    private String idToken;
    
    private String displayName;
    
    private String photoUrl;
}


