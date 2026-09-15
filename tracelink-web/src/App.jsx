import { useState } from "react";

const API_URL = "http://localhost:3000";

function App() {
  const [mode, setMode] = useState("register"); // "register" or "login"
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState(null); // { type: "error" | "info", text }
  const [user, setUser] = useState(null); // set once login succeeds

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleRegister(e) {
    e.preventDefault();
    setMessage(null);

    const res = await fetch(API_URL + "/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok) {
      setMessage({ type: "error", text: data.error || "Registration failed" });
      return;
    }

    setMode("login");
    setMessage({ type: "info", text: "Account created! You can log in now." });
  }

  async function handleLogin(e) {
    e.preventDefault();
    setMessage(null);

    const res = await fetch(API_URL + "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, password: form.password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setMessage({ type: "error", text: data.error || "Login failed" });
      return;
    }

    setUser(data.user);
  }

  function handleLogout() {
    setUser(null);
    setForm({ firstName: "", lastName: "", email: "", password: "" });
    setMessage(null);
    setMode("login");
  }

  if (user) {
    return (
      <div style={{ maxWidth: 400, margin: "40px auto", fontFamily: "sans-serif" }}>
        <h1>Welcome, {user.firstName}! 👋</h1>
        <p>You're logged in as {user.email} ({user.role}).</p>
        <button onClick={handleLogout}>Log out</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>TraceLink</h1>

      <div style={{ marginBottom: 16 }}>
        <button onClick={() => { setMode("register"); setMessage(null); }}>
          Switch to Register
        </button>
        <button onClick={() => { setMode("login"); setMessage(null); }} style={{ marginLeft: 8 }}>
          Switch to Login
        </button>
      </div>

      <h2>{mode === "register" ? "Register" : "Login"}</h2>

      <form onSubmit={mode === "register" ? handleRegister : handleLogin}>
        {mode === "register" && (
          <>
            <input
              name="firstName"
              placeholder="First name"
              value={form.firstName}
              onChange={handleChange}
              style={{ display: "block", marginBottom: 8, width: "100%" }}
            />
            <input
              name="lastName"
              placeholder="Last name"
              value={form.lastName}
              onChange={handleChange}
              style={{ display: "block", marginBottom: 8, width: "100%" }}
            />
          </>
        )}
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={{ display: "block", marginBottom: 8, width: "100%" }}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={{ display: "block", marginBottom: 8, width: "100%" }}
        />
        <button type="submit">{mode === "register" ? "Register" : "Login"}</button>
      </form>

      {message && (
        <p style={{ color: message.type === "error" ? "red" : "green", marginTop: 12 }}>
          {message.text}
        </p>
      )}
    </div>
  );
}

export default App;