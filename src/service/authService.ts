import api from "@/lib/axios";

export async function login(username: string, password: string) {
  // request token
  const { data } = await api.post("/auth/login", { username, password });
  const token = data.token;

  // simpan token ke localStorage
  localStorage.setItem("token", token);

  //  request profile pakai token
  const profileRes = await api.get("/auth/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return { token, user: profileRes.data };
}

export function logout() {
  localStorage.removeItem("token");
}
