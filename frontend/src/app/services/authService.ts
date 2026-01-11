import api from './api';

// Types matching backend DTOs exactly
export interface AuthRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  firstName: string;
}

export interface GoogleSignInRequest {
  idToken: string;
  displayName?: string;
  photoUrl?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  uid: string;
  email: string;
  firstName: string;
  userImage: string | null;
  isPremium: boolean;
  emailVerified?: boolean;
}

export const authService = {
  signIn: async (request: AuthRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/signin', {
        email: request.email.trim(),
        password: request.password,
      });
      return response.data;
    } catch (error: any) {
      // Handle network errors
      if (!error.response) {
        throw new Error('Network error. Please check your connection and ensure the backend is running.');
      }
      
      // Re-throw with better error message
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      }
      if (error.response?.status === 400) {
        // Spring Boot validation errors might be in different formats
        const errorData = error.response.data;
        if (errorData?.message) {
          throw new Error(errorData.message);
        }
        if (errorData?.errors && Array.isArray(errorData.errors)) {
          const messages = errorData.errors.map((e: any) => e.defaultMessage || e.message).join(', ');
          throw new Error(messages || 'Invalid request. Please check your input.');
        }
        throw new Error('Invalid request. Please check your input.');
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (error.message) {
        throw error;
      }
      throw new Error('Login failed. Please try again.');
    }
  },

  signUp: async (request: SignUpRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/signup', {
        email: request.email.trim(),
        password: request.password,
        firstName: request.firstName.trim(),
      });
      return response.data;
    } catch (error: any) {
      // Handle network errors
      if (!error.response) {
        throw new Error('Network error. Please check your connection and ensure the backend is running.');
      }
      
      // Re-throw with better error message
      if (error.response?.status === 400) {
        // Spring Boot validation errors might be in different formats
        const errorData = error.response.data;
        if (errorData?.message) {
          throw new Error(errorData.message);
        }
        if (errorData?.errors && Array.isArray(errorData.errors)) {
          const messages = errorData.errors.map((e: any) => e.defaultMessage || e.message).join(', ');
          throw new Error(messages || 'Registration failed. Please check your input.');
        }
        // Backend returns 400 for email already in use
        throw new Error('Registration failed. Email may already be in use.');
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (error.message) {
        throw error;
      }
      throw new Error('Registration failed. Please try again.');
    }
  },

  googleSignIn: async (request: GoogleSignInRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/google', {
        idToken: request.idToken,
        displayName: request.displayName,
        photoUrl: request.photoUrl,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Google sign-in failed. Please try again.');
    }
  },

  anonymousSignIn: async (): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/anonymous', {});
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Anonymous sign-in failed. Please try again.');
    }
  },

  resendVerification: async (email: string): Promise<{ dev?: boolean }> => {
    const res = await api.post('/auth/resend-verification', { email });
    return res.data || {};
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await api.post('/auth/reset-password', { token, password: newPassword });
  },
};

