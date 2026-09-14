import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut, Save, RotateCcw, User, Briefcase, FolderOpen, Code2,
  Settings, Plus, Trash2, Upload, ChevronDown, ChevronUp,
  Check, AlertCircle, X, Image, ExternalLink
} from "lucide-react";
import { hashPassword, decryptPAT } from "../../utils/crypto";
import { fetchFileContent, updateFileContent, uploadImage } from "../../utils/github";
import "./admin.css";

const OWNER = "lalitmohan-mekap";
const REPO = "Lalit-Portfolio";
const CONFIG_PATH = "src/data/config.js";
const ADMIN_HASH = "d7acae03ba1d5e71745718fe6cb2dcbef3f4ee56659cc94367dcc1d646f761fb";

function parseConfigJS(raw) {
  const match = raw.match(/export\s+const\s+config\s*=\s*(\{[\s\S]*\})\s*;?\s*$/);
  if (!match) throw new Error("Could not parse config.js");
  return new Function(`return ${match[1]}`)();
}

function generateConfigJS(cfg) {
  return `export const config = ${JSON.stringify(cfg, null, 2)};\n`;
}

// Also regenerate the public/data/config.json
function generateConfigJSON(cfg) {
  return JSON.stringify(cfg, null, 2);
}

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "skills", label: "Skills", icon: Code2 },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "career", label: "Career", icon: Briefcase },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function AdminPanel() {
  const navigate = useNavigate();
  const [config, setConfig] = useState(null);
  const [originalConfig, setOriginalConfig] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [configSha, setConfigSha] = useState(null);
  const [jsonSha, setJsonSha] = useState(null);
  const [pendingImages, setPendingImages] = useState([]);
  const patRef = useRef(null);

  useEffect(() => {
    initAdmin();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  async function initAdmin() {
    const pwd = sessionStorage.getItem("admin_pwd");
    const encPat = localStorage.getItem("admin_enc_pat");
    if (!pwd || !encPat) { navigate("/admin"); return; }

    try {
      const hash = await hashPassword(pwd);
      if (hash !== ADMIN_HASH) { navigate("/admin"); return; }
      const decrypted = await decryptPAT(encPat, pwd);
      if (!decrypted) { navigate("/admin"); return; }
      patRef.current = decrypted;
      await loadConfig();
    } catch {
      navigate("/admin");
    }
  }

  async function loadConfig() {
    setLoading(true);
    try {
      const result = await fetchFileContent(patRef.current, OWNER, REPO, CONFIG_PATH);
      const parsed = parseConfigJS(result.content);
      setConfig(structuredClone(parsed));
      setOriginalConfig(structuredClone(parsed));
      setConfigSha(result.sha);

      // Also get json SHA
      try {
        const jsonResult = await fetchFileContent(patRef.current, OWNER, REPO, "public/data/config.json");
        if (jsonResult) setJsonSha(jsonResult.sha);
      } catch { /* json file may not exist yet */ }

      setLoading(false);
    } catch (err) {
      setToast({ type: "error", msg: `Failed to load: ${err.message}` });
      setLoading(false);
    }
  }

  const hasChanges = config && originalConfig &&
    (JSON.stringify(config) !== JSON.stringify(originalConfig) || pendingImages.length > 0);

  async function handleSave() {
    setSaving(true);
    try {
      // 1. Upload pending images
      for (const img of pendingImages) {
        await uploadImage(patRef.current, OWNER, REPO, img.file, img.path);
      }

      // 2. Update config.js
      const jsContent = generateConfigJS(config);
      const jsResult = await updateFileContent(
        patRef.current, OWNER, REPO, CONFIG_PATH, jsContent, configSha,
        "Update portfolio config via admin panel"
      );
      setConfigSha(jsResult.content.sha);

      // 3. Update public/data/config.json
      const jsonContent = generateConfigJSON(config);
      const jsonResult = await updateFileContent(
        patRef.current, OWNER, REPO, "public/data/config.json", jsonContent, jsonSha,
        "Sync config.json via admin panel"
      );
      setJsonSha(jsonResult.content.sha);

      setOriginalConfig(structuredClone(config));
      setPendingImages([]);
      setToast({ type: "success", msg: "Saved! Site will redeploy in ~2 min." });
    } catch (err) {
      setToast({ type: "error", msg: `Save failed: ${err.message}` });
    }
    setSaving(false);
  }

  function handleDiscard() {
    setConfig(structuredClone(originalConfig));
    setPendingImages([]);
    setToast({ type: "info", msg: "Changes discarded." });
  }

  function handleLogout() {
    sessionStorage.removeItem("admin_pwd");
    navigate("/admin");
  }

  // --- UPDATERS ---
  const updateDeveloper = (field, value) =>
    setConfig(prev => ({ ...prev, developer: { ...prev.developer, [field]: value } }));

  const updateAbout = (value) =>
    setConfig(prev => ({ ...prev, about: { ...prev.about, description: value } }));

  const updateSocial = (field, value) =>
    setConfig(prev => ({ ...prev, social: { ...prev.social, [field]: value } }));

  const updateContact = (field, value) =>
    setConfig(prev => ({ ...prev, contact: { ...prev.contact, [field]: value } }));

  const updateSkill = (category, field, value) =>
    setConfig(prev => ({
      ...prev,
      skills: { ...prev.skills, [category]: { ...prev.skills[category], [field]: value } }
    }));

  const updateSkillTools = (category, tools) =>
    setConfig(prev => ({
      ...prev,
      skills: { ...prev.skills, [category]: { ...prev.skills[category], tools } }
    }));

  const updateProject = (index, field, value) =>
    setConfig(prev => {
      const projects = [...prev.projects];
      projects[index] = { ...projects[index], [field]: value };
      return { ...prev, projects };
    });

  const addProject = () =>
    setConfig(prev => ({
      ...prev,
      projects: [...prev.projects, {
        id: Date.now(), title: "New Project", category: "Category",
        technologies: "", image: "./images/placeholder.png",
        link: "", description: "Project description..."
      }]
    }));

  const removeProject = (index) =>
    setConfig(prev => ({ ...prev, projects: prev.projects.filter((_, i) => i !== index) }));

  const updateExperience = (index, field, value) =>
    setConfig(prev => {
      const experiences = [...prev.experiences];
      experiences[index] = { ...experiences[index], [field]: value };
      return { ...prev, experiences };
    });

  const updateExpResponsibilities = (expIdx, respIdx, value) =>
    setConfig(prev => {
      const experiences = [...prev.experiences];
      const resp = [...experiences[expIdx].responsibilities];
      resp[respIdx] = value;
      experiences[expIdx] = { ...experiences[expIdx], responsibilities: resp };
      return { ...prev, experiences };
    });

  const addExpResponsibility = (expIdx) =>
    setConfig(prev => {
      const experiences = [...prev.experiences];
      experiences[expIdx] = {
        ...experiences[expIdx],
        responsibilities: [...experiences[expIdx].responsibilities, ""]
      };
      return { ...prev, experiences };
    });

  const removeExpResponsibility = (expIdx, respIdx) =>
    setConfig(prev => {
      const experiences = [...prev.experiences];
      experiences[expIdx] = {
        ...experiences[expIdx],
        responsibilities: experiences[expIdx].responsibilities.filter((_, i) => i !== respIdx)
      };
      return { ...prev, experiences };
    });

  const updateExpTechnologies = (expIdx, techs) =>
    setConfig(prev => {
      const experiences = [...prev.experiences];
      experiences[expIdx] = { ...experiences[expIdx], technologies: techs };
      return { ...prev, experiences };
    });

  const addExperience = () =>
    setConfig(prev => ({
      ...prev,
      experiences: [...prev.experiences, {
        position: "New Position", company: "Company",
        period: "2025", location: "Location",
        description: "Description...",
        responsibilities: [""],
        technologies: [""]
      }]
    }));

  const removeExperience = (index) =>
    setConfig(prev => ({ ...prev, experiences: prev.experiences.filter((_, i) => i !== index) }));

  const handleImageUpload = (projIdx, file) => {
    const fileName = `project-${Date.now()}-${file.name.replace(/\s/g, "-")}`;
    const path = `public/images/${fileName}`;
    setPendingImages(prev => [...prev, { file, path, projIdx }]);
    updateProject(projIdx, "image", `./images/${fileName}`);
  };

  const handleResumeUpload = (file) => {
    const ext = file.name.split('.').pop();
    const fileName = `resume-${Date.now()}.${ext}`;
    const path = `public/${fileName}`;
    setPendingImages(prev => [...prev, { file, path, isResume: true }]);
    updateDeveloper("resumeUrl", fileName);
  };

  // --- RENDER ---
  if (loading) {
    return (
      <div className="admin-loading-page">
        <div className="admin-spinner large" />
        <p>Loading configuration...</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="admin-loading-page">
        <AlertCircle size={48} />
        <p>Failed to load configuration.</p>
        <button onClick={() => navigate("/admin")} className="admin-submit-btn">
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-left">
          <h1>Portfolio Admin</h1>
          {hasChanges && <span className="admin-unsaved-badge">Unsaved changes</span>}
        </div>
        <div className="admin-header-right">
          {hasChanges && (
            <>
              <button className="admin-btn admin-btn-ghost" onClick={handleDiscard} disabled={saving}>
                <RotateCcw size={14} /> Discard
              </button>
              <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? <span className="admin-spinner" /> : <><Save size={14} /> Save &amp; Deploy</>}
              </button>
            </>
          )}
          <button className="admin-btn admin-btn-ghost" onClick={handleLogout}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      <div className="admin-body">
        {/* Sidebar */}
        <nav className="admin-sidebar">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`admin-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <main className="admin-content">
          {activeTab === "profile" && <ProfileTab config={config} updateDeveloper={updateDeveloper} updateAbout={updateAbout} updateSocial={updateSocial} updateContact={updateContact} handleResumeUpload={handleResumeUpload} />}
          {activeTab === "skills" && <SkillsTab config={config} updateSkill={updateSkill} updateSkillTools={updateSkillTools} />}
          {activeTab === "projects" && <ProjectsTab config={config} updateProject={updateProject} addProject={addProject} removeProject={removeProject} handleImageUpload={handleImageUpload} pendingImages={pendingImages} />}
          {activeTab === "career" && <CareerTab config={config} updateExperience={updateExperience} addExperience={addExperience} removeExperience={removeExperience} updateExpResponsibilities={updateExpResponsibilities} addExpResponsibility={addExpResponsibility} removeExpResponsibility={removeExpResponsibility} updateExpTechnologies={updateExpTechnologies} />}
          {activeTab === "settings" && <SettingsTab navigate={navigate} />}
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`admin-toast admin-toast-${toast.type}`}>
          {toast.type === "success" && <Check size={16} />}
          {toast.type === "error" && <AlertCircle size={16} />}
          {toast.msg}
          <button onClick={() => setToast(null)}><X size={14} /></button>
        </div>
      )}
    </div>
  );
}

/* ==================== TAB COMPONENTS ==================== */

function ProfileTab({ config, updateDeveloper, updateAbout, updateSocial, updateContact, handleResumeUpload }) {
  const fileInputRef = useRef(null);
  return (
    <div className="admin-tab-content">
      <h2>Profile Information</h2>
      <div className="admin-card">
        <h3>Developer</h3>
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label>Display Name</label>
            <input value={config.developer.name} onChange={e => updateDeveloper("name", e.target.value)} />
          </div>
          <div className="admin-form-group">
            <label>Full Name</label>
            <input value={config.developer.fullName} onChange={e => updateDeveloper("fullName", e.target.value)} />
          </div>
        </div>
        <div className="admin-form-group">
          <label>Title</label>
          <input value={config.developer.title} onChange={e => updateDeveloper("title", e.target.value)} />
        </div>
        <div className="admin-form-group">
          <label>Short Description</label>
          <textarea rows={3} value={config.developer.description} onChange={e => updateDeveloper("description", e.target.value)} />
        </div>
        <div className="admin-form-group">
          <label>Resume (PDF)</label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "var(--admin-muted)" }}>
              {config.developer.resumeUrl || "Lalit_Mohan_Mekap_Resume.pdf"}
            </span>
            <input
              type="file"
              accept=".pdf"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={e => {
                if (e.target.files?.[0]) handleResumeUpload(e.target.files[0]);
              }}
            />
            <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => fileInputRef.current?.click()}>
              <Upload size={12} /> Upload New Resume
            </button>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h3>About Section</h3>
        <div className="admin-form-group">
          <label>About Description</label>
          <textarea rows={5} value={config.about.description} onChange={e => updateAbout(e.target.value)} />
        </div>
      </div>

      <div className="admin-card">
        <h3>Social &amp; Contact</h3>
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label>Email</label>
            <input value={config.contact.email} onChange={e => updateContact("email", e.target.value)} />
          </div>
          <div className="admin-form-group">
            <label>Location</label>
            <input value={config.social.location} onChange={e => updateSocial("location", e.target.value)} />
          </div>
        </div>
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label>GitHub</label>
            <input value={config.contact.github} onChange={e => updateContact("github", e.target.value)} />
          </div>
          <div className="admin-form-group">
            <label>LinkedIn</label>
            <input value={config.contact.linkedin} onChange={e => updateContact("linkedin", e.target.value)} />
          </div>
        </div>
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label>Instagram</label>
            <input value={config.contact.instagram} onChange={e => updateContact("instagram", e.target.value)} />
          </div>
          <div className="admin-form-group">
            <label>Formspree Endpoint</label>
            <input value={config.contact.formspreeEndpoint} onChange={e => updateContact("formspreeEndpoint", e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SkillsTab({ config, updateSkill, updateSkillTools }) {
  return (
    <div className="admin-tab-content">
      <h2>Skills &amp; Expertise</h2>
      {Object.entries(config.skills).map(([key, skill]) => (
        <div className="admin-card" key={key}>
          <h3>{key === "develop" ? "AI Developer" : "Full-Stack"}</h3>
          <div className="admin-form-group">
            <label>Title</label>
            <input value={skill.title} onChange={e => updateSkill(key, "title", e.target.value)} />
          </div>
          <div className="admin-form-group">
            <label>Description</label>
            <input value={skill.description} onChange={e => updateSkill(key, "description", e.target.value)} />
          </div>
          <div className="admin-form-group">
            <label>Details</label>
            <textarea rows={3} value={skill.details} onChange={e => updateSkill(key, "details", e.target.value)} />
          </div>
          <div className="admin-form-group">
            <label>Tools (comma-separated)</label>
            <CommaInput
              valueArray={skill.tools}
              onChange={tools => updateSkillTools(key, tools)}
            />
          </div>
          <div className="admin-tags-preview">
            {skill.tools.map((tool, i) => <span key={i} className="admin-tag">{tool}</span>)}
          </div>
        </div>
      ))}
    </div>
  );
}

function ProjectsTab({ config, updateProject, addProject, removeProject, handleImageUpload, pendingImages }) {
  const [expanded, setExpanded] = useState(null);
  const fileInputRefs = useRef({});

  return (
    <div className="admin-tab-content">
      <div className="admin-tab-header">
        <h2>Projects</h2>
        <button className="admin-btn admin-btn-primary" onClick={addProject}>
          <Plus size={14} /> Add Project
        </button>
      </div>

      {config.projects.map((proj, idx) => {
        const isExpanded = expanded === idx;
        const pendingImg = pendingImages.find(p => p.projIdx === idx);
        return (
          <div className="admin-card admin-project-card" key={proj.id || idx}>
            <div className="admin-card-header" onClick={() => setExpanded(isExpanded ? null : idx)}>
              <div className="admin-card-header-left">
                <div className="admin-project-thumb">
                  {pendingImg ? (
                    <img src={URL.createObjectURL(pendingImg.file)} alt="" />
                  ) : (
                    <img src={proj.image} alt="" onError={e => { e.target.style.display = "none"; }} />
                  )}
                </div>
                <div>
                  <h4>{proj.title}</h4>
                  <span className="admin-badge">{proj.category}</span>
                </div>
              </div>
              <div className="admin-card-header-right">
                <button className="admin-btn-icon" onClick={(e) => { e.stopPropagation(); removeProject(idx); }}>
                  <Trash2 size={16} />
                </button>
                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </div>

            {isExpanded && (
              <div className="admin-card-body">
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Title</label>
                    <input value={proj.title} onChange={e => updateProject(idx, "title", e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    <label>Category</label>
                    <input value={proj.category} onChange={e => updateProject(idx, "category", e.target.value)} />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label>Technologies</label>
                  <input value={proj.technologies} onChange={e => updateProject(idx, "technologies", e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label>Link (optional)</label>
                  <div className="admin-input-with-action">
                    <input value={proj.link || ""} onChange={e => updateProject(idx, "link", e.target.value)} placeholder="https://..." />
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noopener noreferrer" className="admin-btn-icon">
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
                <div className="admin-form-group">
                  <label>Description</label>
                  <textarea rows={3} value={proj.description} onChange={e => updateProject(idx, "description", e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label>Image</label>
                  <div className="admin-image-upload">
                    <div className="admin-image-preview">
                      {pendingImg ? (
                        <img src={URL.createObjectURL(pendingImg.file)} alt="Preview" />
                      ) : (
                        <img src={proj.image} alt="Current" onError={e => { e.target.src = ""; e.target.alt = "No image"; }} />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      ref={el => { fileInputRefs.current[idx] = el; }}
                      style={{ display: "none" }}
                      onChange={e => { if (e.target.files[0]) handleImageUpload(idx, e.target.files[0]); }}
                    />
                    <button className="admin-btn admin-btn-ghost" onClick={() => fileInputRefs.current[idx]?.click()}>
                      <Upload size={14} /> Upload New Image
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function CareerTab({ config, updateExperience, addExperience, removeExperience, updateExpResponsibilities, addExpResponsibility, removeExpResponsibility, updateExpTechnologies }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="admin-tab-content">
      <div className="admin-tab-header">
        <h2>Career &amp; Experience</h2>
        <button className="admin-btn admin-btn-primary" onClick={addExperience}>
          <Plus size={14} /> Add Experience
        </button>
      </div>

      {config.experiences.map((exp, idx) => {
        const isExpanded = expanded === idx;
        return (
          <div className="admin-card" key={idx}>
            <div className="admin-card-header" onClick={() => setExpanded(isExpanded ? null : idx)}>
              <div className="admin-card-header-left">
                <div>
                  <h4>{exp.position}</h4>
                  <span className="admin-badge">{exp.company} · {exp.period}</span>
                </div>
              </div>
              <div className="admin-card-header-right">
                <button className="admin-btn-icon" onClick={e => { e.stopPropagation(); removeExperience(idx); }}>
                  <Trash2 size={16} />
                </button>
                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </div>

            {isExpanded && (
              <div className="admin-card-body">
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Position</label>
                    <input value={exp.position} onChange={e => updateExperience(idx, "position", e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    <label>Company</label>
                    <input value={exp.company} onChange={e => updateExperience(idx, "company", e.target.value)} />
                  </div>
                </div>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Period</label>
                    <input value={exp.period} onChange={e => updateExperience(idx, "period", e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    <label>Location</label>
                    <input value={exp.location} onChange={e => updateExperience(idx, "location", e.target.value)} />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label>Description</label>
                  <textarea rows={3} value={exp.description} onChange={e => updateExperience(idx, "description", e.target.value)} />
                </div>

                <div className="admin-form-group">
                  <label>Responsibilities</label>
                  {exp.responsibilities.map((resp, rIdx) => (
                    <div className="admin-list-item" key={rIdx}>
                      <input value={resp} onChange={e => updateExpResponsibilities(idx, rIdx, e.target.value)} />
                      <button className="admin-btn-icon" onClick={() => removeExpResponsibility(idx, rIdx)}>
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => addExpResponsibility(idx)}>
                    <Plus size={12} /> Add Responsibility
                  </button>
                </div>

                <div className="admin-form-group">
                  <label>Technologies (comma-separated)</label>
                  <CommaInput
                    valueArray={exp.technologies}
                    onChange={techs => updateExpTechnologies(idx, techs)}
                  />
                  <div className="admin-tags-preview">
                    {exp.technologies.map((t, i) => <span key={i} className="admin-tag">{t}</span>)}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SettingsTab({ navigate }) {
  const handleReset = () => {
    if (window.confirm("This will clear your stored credentials. You'll need to re-enter your password and GitHub token.")) {
      localStorage.removeItem("admin_enc_verify");
      localStorage.removeItem("admin_enc_pat");
      sessionStorage.removeItem("admin_pwd");
      navigate("/admin");
    }
  };

  return (
    <div className="admin-tab-content">
      <h2>Settings</h2>
      <div className="admin-card">
        <h3>Credentials</h3>
        <p className="admin-hint">If you need to update your GitHub Personal Access Token, reset your credentials and log in again.</p>
        <button className="admin-btn admin-btn-danger" onClick={handleReset}>
          Reset Credentials
        </button>
      </div>
      <div className="admin-card">
        <h3>About This Panel</h3>
        <p className="admin-hint">
          Changes made here are committed to your GitHub repository via the Contents API.
          After saving, GitHub Pages will automatically rebuild and deploy your site (~2 minutes).
        </p>
      </div>
    </div>
  );
}

function CommaInput({ valueArray, onChange }) {
  const propKey = valueArray.filter(Boolean).join(",");
  const [state, setState] = useState({ key: propKey, text: valueArray.join(", ") });

  // Re-sync when parent changes the array externally (e.g. discard)
  if (propKey !== state.key) {
    setState({ key: propKey, text: valueArray.join(", ") });
  }

  const handleChange = (e) => {
    const text = e.target.value;
    const parsed = text.split(",").map(t => t.trim()).filter(Boolean);
    setState({ key: parsed.join(","), text });
    onChange(parsed);
  };

  return <input value={state.text} onChange={handleChange} />;
}
