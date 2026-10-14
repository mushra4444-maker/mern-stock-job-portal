import { useEffect, useState } from "react";
import "./index.css";

const API = "http://localhost:5000/api";

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("jobPortalUser") || "null")
  );
  const [token, setToken] = useState(
    localStorage.getItem("jobPortalToken") || ""
  );
  const [mode, setMode] = useState("login");
  const [message, setMessage] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [showPost, setShowPost] = useState(false);

  async function loadJobs() {
    try {
      const response = await fetch(
        `${API}/jobs?search=${encodeURIComponent(search)}`
      );
      const data = await response.json();

      if (!response.ok) throw new Error(data.message);
      setJobs(data);
    } catch {
      setMessage("Could not load jobs. Check that the backend and MongoDB are running.");
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  async function submitAuth(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password"),
      role: form.get("role")
    };

    try {
      const response = await fetch(`${API}/auth/${mode === "login" ? "login" : "register"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      localStorage.setItem("jobPortalToken", data.token);
      localStorage.setItem("jobPortalUser", JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);
      setShowAuth(false);
      setMessage(`Welcome, ${data.user.name}!`);
    } catch (error) {
      setMessage(error.message || "Authentication failed.");
    }
  }

  async function createJob(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const payload = {
      title: form.get("title"),
      company: form.get("company"),
      location: form.get("location"),
      salary: form.get("salary"),
      description: form.get("description"),
      skills: String(form.get("skills") || "").split(",").map(s => s.trim()).filter(Boolean)
    };

    try {
      const response = await fetch(`${API}/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setShowPost(false);
      setMessage("Job posted successfully!");
      await loadJobs();
    } catch (error) {
      setMessage(error.message || "Could not post job.");
    }
  }

  async function apply(job) {
    if (!user || !token) {
      setMode("login");
      setShowAuth(true);
      setMessage("Log in as a job seeker to apply.");
      return;
    }

    if (user.role !== "jobseeker") {
      setMessage("Recruiter accounts cannot apply for jobs.");
      return;
    }

    const coverLetter = window.prompt("Write a short cover letter (optional):") || "";

    try {
      const response = await fetch(`${API}/applications/${job._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ coverLetter })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setMessage("Your application was submitted!");
    } catch (error) {
      setMessage(error.message || "Could not submit application.");
    }
  }

  function logout() {
    localStorage.removeItem("jobPortalToken");
    localStorage.removeItem("jobPortalUser");
    setToken("");
    setUser(null);
    setMessage("You have logged out.");
  }

  return (
    <div className="page">
      <header className="navbar">
        <a className="logo" href="#"><span>J</span>obNest</a>

        <nav>
          <a href="#jobs">Find Jobs</a>
          <a href="#about">About</a>
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <span className="welcome">Hi, {user.name}</span>
              {user.role === "recruiter" && (
                <button className="button primary" onClick={() => setShowPost(true)}>
                  Post a Job
                </button>
              )}
              <button className="button outline" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <button className="button outline" onClick={() => { setMode("login"); setShowAuth(true); }}>
                Login
              </button>
              <button className="button primary" onClick={() => { setMode("register"); setShowAuth(true); }}>
                Sign Up
              </button>
            </>
          )}
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="eyebrow">YOUR CAREER STARTS HERE</div>
          <h1>Find a job that fits<br /><span>your future.</span></h1>
          <p>Discover opportunities, connect with employers, and take the next step in your career.</p>

          <form className="search-box" onSubmit={e => { e.preventDefault(); loadJobs(); }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search job title, company, or skill"
            />
            <button className="button primary">Search Jobs</button>
          </form>
        </section>

        {message && (
          <div className="notice">
            <span>{message}</span>
            <button onClick={() => setMessage("")}>×</button>
          </div>
        )}

        <section id="jobs" className="jobs-section">
          <div className="section-heading">
            <div>
              <div className="eyebrow">EXPLORE OPPORTUNITIES</div>
              <h2>Latest jobs</h2>
            </div>
            <span>{jobs.length} jobs available</span>
          </div>

          <div className="job-grid">
            {jobs.map(job => (
              <article className="job-card" key={job._id}>
                <div className="company-icon">{job.company?.charAt(0)?.toUpperCase()}</div>
                <div className="company">{job.company}</div>
                <h3>{job.title}</h3>
                <p className="location">📍 {job.location}</p>
                <p className="salary">{job.salary || "Salary not specified"}</p>
                <p className="description">{job.description}</p>
                <div className="skills">
                  {(job.skills || []).map(skill => <span key={skill}>{skill}</span>)}
                </div>
                <button className="button primary apply-button" onClick={() => apply(job)}>
                  Apply Now →
                </button>
              </article>
            ))}
          </div>

          {jobs.length === 0 && (
            <div className="empty">
              <h3>No jobs found</h3>
              <p>Try a different keyword, or check back later.</p>
            </div>
          )}
        </section>

        <section id="about" className="about">
          <h2>Your next opportunity is out there.</h2>
          <p>Search, apply, and take your career forward with JobNest.</p>
        </section>
      </main>

      <footer>JobNest · MERN Stack Job Portal · Learning Project</footer>

      {showAuth && (
        <div className="overlay">
          <form className="modal" onSubmit={submitAuth}>
            <button type="button" className="close" onClick={() => setShowAuth(false)}>×</button>
            <h2>{mode === "login" ? "Welcome back" : "Create an account"}</h2>
            <p>{mode === "login" ? "Log in to continue." : "Join JobNest today."}</p>

            {mode === "register" && (
              <>
                <label>Full name<input name="name" required placeholder="Your name" /></label>
                <label>Account type
                  <select name="role">
                    <option value="jobseeker">Job seeker</option>
                    <option value="recruiter">Recruiter</option>
                  </select>
                </label>
              </>
            )}

            <label>Email<input name="email" type="email" required placeholder="you@example.com" /></label>
            <label>Password<input name="password" type="password" minLength="8" required placeholder="At least 8 characters" /></label>
            <button className="button primary full">{mode === "login" ? "Login" : "Register"}</button>

            <p className="switch">
              {mode === "login" ? "New here?" : "Already registered?"}
              <button type="button" onClick={() => setMode(mode === "login" ? "register" : "login")}>
                {mode === "login" ? "Create account" : "Login"}
              </button>
            </p>
          </form>
        </div>
      )}

      {showPost && (
        <div className="overlay">
          <form className="modal" onSubmit={createJob}>
            <button type="button" className="close" onClick={() => setShowPost(false)}>×</button>
            <h2>Post a job</h2>
            <p>Share your opening with job seekers.</p>
            <label>Job title<input name="title" required placeholder="React Developer" /></label>
            <label>Company<input name="company" required placeholder="Company name" /></label>
            <label>Location<input name="location" required placeholder="Bengaluru or Remote" /></label>
            <label>Salary<input name="salary" placeholder="₹5–8 LPA" /></label>
            <label>Skills<input name="skills" placeholder="React, Node.js, MongoDB" /></label>
            <label>Description<textarea name="description" required rows="4" placeholder="Describe the role..." /></label>
            <button className="button primary full">Publish Job</button>
          </form>
        </div>
      )}
    </div>
  );
}