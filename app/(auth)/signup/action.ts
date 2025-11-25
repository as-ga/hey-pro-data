/** @format */
"use server";
interface RegisterResponse {
  user: {
    firstName?: string;
    lastName?: string;
    username?: string;
    profilePhoto?: string;
    [key: string]: string | undefined;
  };
}

interface RegisterPayload {
  emailId: string;
  password: string;
}

const register = async (data: RegisterPayload): Promise<RegisterResponse> => {
  const response = await fetch(`${process.env.API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Registration failed");
  }
  console.log("Registration response:", response);
  return response.json();
};

interface SendOtpResponse {
  message: string;
  success: boolean;
}

const sendOtp = async (email: string): Promise<SendOtpResponse> => {
  const response = await fetch("/api/send-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to send OTP");
  }

  return response.json();
};
interface VerifyOtpResponse {
  message: string;
  success: boolean;
}
const verifyOtp = async (
  email: string,
  otp: string
): Promise<VerifyOtpResponse> => {
  const response = await fetch("/api/verify-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to verify OTP");
  }

  return response.json();
};
export { sendOtp, verifyOtp, register };
