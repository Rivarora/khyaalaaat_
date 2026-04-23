import jwtDecode from "jwt-decode";

type DecodedToken = {
  id: number;
  email: string;
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
