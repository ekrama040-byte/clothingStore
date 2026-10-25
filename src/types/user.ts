export interface UserProfile {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  avatar?: string;
  location?: string;
  bio?: string;
  createdAt: string;
}

export interface AuthFormState {
  name: string;
  email: string;
  password: string;
  location: string;
  avatar: string;
}
