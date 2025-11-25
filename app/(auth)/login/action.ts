/** @format */

interface LoginResponse {
  user: {
    firstName?: string;
    lastName?: string;
    username?: string;
    profilePhoto?: string;
    [key: string]: string | undefined;
  };
}

const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed");
  }
  return response.json();
};

export { login };
