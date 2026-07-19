import jwtDecode from "jwt-decode";

type DecodedToken = {
  id: string;
  email: string;
  username?: string;
  role: "user" | "admin";
  exp?: number;
};

export function getDecodedToken(): DecodedToken | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}

export function getUserRole(): "user" | "admin" | null {
  const decoded = getDecodedToken();
  if (!decoded) return null;
  return decoded.role || "user";
}

export function isTokenValid(): boolean {
  const decoded = getDecodedToken();
  if (!decoded) return false;

  if (decoded.exp && typeof decoded.exp === "number") {
    // exp is in seconds since epoch
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now) {
      // token expired
      localStorage.removeItem("token");
      return false;
    }
  }

  return true;
}
