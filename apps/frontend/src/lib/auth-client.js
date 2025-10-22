export const authClient = {
  signUp: {
    async email({ name, email, password }) {
      const res = await fetch("http://localhost:5001/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) throw new Error("Signup failed");
      return res.json();
    },
  },
  signIn: {
    async email({ email, password }) {
      const res = await fetch("http://localhost:5001/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Signin failed");
      return res.json();
    },
  },
};
