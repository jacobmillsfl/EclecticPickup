class AuthManager {
  private static instance: AuthManager | null = null;

  private constructor() {
    // Private constructor to prevent instantiation
  }

  static setAuthToken(token: string): void {
    localStorage.setItem("jwtToken", token);
  }

  static clearAuthToken(): void {
    localStorage.removeItem("jwtToken");
  }

  static getAuthToken(): string | null {
    return localStorage.getItem("jwtToken");
  }

  static isAuthenticated(): boolean {
    const token = this.getAuthToken();
    if (token === null || token === "") {
      return false;
    }
    const payload = AuthManager.decodeJwtPayloadUnsafe(token);
    if (!payload) {
      AuthManager.clearAuthToken();
      return false;
    }
    const exp = payload.exp;
    if (typeof exp === "number" && Date.now() / 1000 >= exp) {
      AuthManager.clearAuthToken();
      return false;
    }
    return true;
  }

  /**
   * Older API login issued PyJWT tokens with `sub` as an object. Flask-JWT-Extended
   * rejects those ("Subject must be a string") on every protected route. Remove stale
   * tokens so the user signs in again and receives a compliant JWT.
   */
  static clearLegacyJwtIfPresent(): void {
    const token = localStorage.getItem("jwtToken");
    if (!token) return;
    const payload = AuthManager.decodeJwtPayloadUnsafe(token);
    if (!payload) {
      AuthManager.clearAuthToken();
      return;
    }
    const sub = payload.sub;
    if (sub !== null && typeof sub === "object") {
      AuthManager.clearAuthToken();
    }
  }

  private static decodeJwtPayloadUnsafe(token: string): Record<string, unknown> | null {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;
      let b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const pad = b64.length % 4;
      if (pad) b64 += "=".repeat(4 - pad);
      return JSON.parse(atob(b64)) as Record<string, unknown>;
    } catch {
      return null;
    }
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
