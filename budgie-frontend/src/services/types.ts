export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface AuthDTO {
  email: string; 
  password: string;
}

export interface ApiAuthResponseDTO {
  token: string;
}

export interface ApiUserResponseDTO {
  id: number; 
  name: string;
  email: string;
  createdAt: string;
}

export interface ApiErrorMessage {
  timestamp: string; 
  status: number; 
  error: string; 
  message: string;
}

