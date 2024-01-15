type AuthResponse = {
  message: string;
  status: number;
};

class AuthManager {
  private static instance: AuthManager | null = null;

  private constructor() {
    // Private constructor to prevent instantiation
  }

  static setAuthToken(token: string): void {
    localStorage.setItem("jwtToken", token);
  }

  static getAuthToken(): string | null {
    return localStorage.getItem("jwtToken");
  }

  static isAuthenticated(): boolean {
    const token = this.getAuthToken();
    return token !== null && token !== "";
  }

  // Singleton instance creation
  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }
}

export default AuthManager;
