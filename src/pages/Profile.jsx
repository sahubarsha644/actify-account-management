
import { useState } from "react";
import {
  Save,
  Plus,
  Pencil,
  Trash2,
  X,
  GraduationCap,
  BriefcaseBusiness
} from "lucide-react";
import "./Profile.css";

const STORAGE_KEY = "actify_profile_v1";

const blankPersonal = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  pinCode: "",
  country: "",
  state: "",
  city: ""
};

const blankEducation = {
  qualification: "",
  degree: "",
  institution: "",
  specialization: "",
  startYear: "",
  endYear: "",
  grade: "",
  description: ""
};

const blankExperience = {
  jobTitle: "",
  company: "",
  employmentType: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  description: ""
};

const blankOther = {
  skills: [],
  languages: [],
  certifications: "",
  linkedin: "",
  portfolio: "",
  github: "",
  additionalInfo: ""
};

function loadProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return {
      personal: { ...blankPersonal, ...saved.personal },
      education: Array.isArray(saved.education) ? saved.education : [],
      experience: Array.isArray(saved.experience) ? saved.experience : [],
      other: { ...blankOther, ...saved.other }
    };
  } catch {
    return {
      personal: { ...blankPersonal },
      education: [],
      experience: [],
      other: { ...blankOther }
    };
  }
}

const years = Array.from(
  { length: new Date().getFullYear() - 1949 + 6 },
  (_, i) => 1950 + i
).reverse();

function Field({ label, required, children, className = "" }) {
  return (
    <div className={`profile-field ${className}`}>
      <label>
        {label}
        {required && <span className="profile-required"> *</span>}
      </label>
      {children}
    </div>
  );
}

function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="profile-empty-state">
      <Icon size={36} strokeWidth={1.7} />
      <strong>{title}</strong>
      <p>{subtitle}</p>
    </div>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState(loadProfile);
  const [tab, setTab] = useState("Personal");

  const [educationForm, setEducationForm] = useState({
    ...blankEducation
  });
  const [experienceForm, setExperienceForm] = useState({
    ...blankExperience
  });

  const [educationOpen, setEducationOpen] = useState(false);
  const [experienceOpen, setExperienceOpen] = useState(false);

  const [educationEditId, setEducationEditId] = useState(null);
  const [experienceEditId, setExperienceEditId] = useState(null);

  const [skillInput, setSkillInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");

  const [message, setMessage] = useState("");

  const saveProfile = (next, successMessage = "Changes saved successfully.") => {
    setProfile(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setMessage(successMessage);
  };

  const updateSection = (section, key, value) => {
    setProfile((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setMessage("");
  };

  const changeTab = (nextTab) => {
    setTab(nextTab);
    setMessage("");
  };

  const savePersonal = (e) => {
    e.preventDefault();
    saveProfile(profile, "Personal details saved successfully.");
  };

  const saveOther = (e) => {
    e.preventDefault();
    saveProfile(profile, "Other details saved successfully.");
  };

  const addTag = (key, value, clear) => {
    const values = value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

    if (!values.length) return;

    const existing = profile.other[key] || [];

    const merged = [...existing];

    values.forEach((item) => {
      if (!merged.some((v) => v.toLowerCase() === item.toLowerCase())) {
        merged.push(item);
      }
    });

    setProfile((prev) => ({
      ...prev,
      other: { ...prev.other, [key]: merged }
    }));

    clear("");
    setMessage("");
  };

  const removeTag = (key, value) => {
    setProfile((prev) => ({
      ...prev,
      other: {
        ...prev.other,
        [key]: prev.other[key].filter((v) => v !== value)
      }
    }));
    setMessage("");
  };

  const saveEducation = (e) => {
    e.preventDefault();

    if (
      Number(educationForm.endYear) <
      Number(educationForm.startYear)
    ) {
      alert("End year cannot be before start year.");
      return;
    }

    const record = {
      ...educationForm,
      id: educationEditId ?? crypto.randomUUID()
    };

    const education = educationEditId
      ? profile.education.map((item) =>
          item.id === educationEditId ? record : item
        )
      : [...profile.education, record];

    saveProfile(
      { ...profile, education },
      "Education record saved successfully."
    );

    setEducationForm({ ...blankEducation });
    setEducationEditId(null);
    setEducationOpen(false);
  };

  const editEducation = (record) => {
    setEducationForm({
      ...blankEducation,
      ...record
    });
    setEducationEditId(record.id);
    setEducationOpen(true);
    setMessage("");
  };

  const deleteEducation = (id) => {
    if (!window.confirm("Delete this education record?")) return;

    saveProfile({
      ...profile,
      education: profile.education.filter((item) => item.id !== id)
    }, "Education record deleted.");
  };

  const saveExperience = (e) => {
    e.preventDefault();

    if (
      !experienceForm.current &&
      experienceForm.endDate &&
      experienceForm.endDate < experienceForm.startDate
    ) {
      alert("End date cannot be before start date.");
      return;
    }

    const record = {
      ...experienceForm,
      endDate: experienceForm.current ? "" : experienceForm.endDate,
      id: experienceEditId ?? crypto.randomUUID()
    };

    const experience = experienceEditId
      ? profile.experience.map((item) =>
          item.id === experienceEditId ? record : item
        )
      : [...profile.experience, record];

    saveProfile(
      { ...profile, experience },
      "Experience record saved successfully."
    );

    setExperienceForm({ ...blankExperience });
    setExperienceEditId(null);
    setExperienceOpen(false);
  };

  const editExperience = (record) => {
    setExperienceForm({
      ...blankExperience,
      ...record
    });
    setExperienceEditId(record.id);
    setExperienceOpen(true);
    setMessage("");
  };

  const deleteExperience = (id) => {
    if (!window.confirm("Delete this experience record?")) return;

    saveProfile({
      ...profile,
      experience: profile.experience.filter((item) => item.id !== id)
    }, "Experience record deleted.");
  };

  const tabs = ["Personal", "Education", "Experience", "Other"];

  return (
    <main className="actify-profile">

      {/* Tabs */}
      <div className="profile-tabs">
        {tabs.map((item) => (
          <button
            key={item}
            type="button"
            className={tab === item ? "active" : ""}
            onClick={() => changeTab(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {message && (
        <div className="profile-success" role="status">
          {message}
        </div>
      )}

      {/* PERSONAL */}
      {tab === "Personal" && (
        <form className="profile-card" onSubmit={savePersonal}>
          <div className="profile-personal-banner">
            <h2>Personal Details</h2>
            <p>
              Make changes to your Profile Account here.
              Click save when you're done.
            </p>
          </div>

          <div className="profile-form-body">
            <div className="profile-grid three">
              <Field label="First Name" required>
                <input
                  required
                  placeholder="First name"
                  value={profile.personal.firstName}
                  onChange={(e) =>
                    updateSection("personal", "firstName", e.target.value)
                  }
                />
              </Field>

              <Field label="Middle Name">
                <input
                  placeholder="Middle name"
                  value={profile.personal.middleName}
                  onChange={(e) =>
                    updateSection("personal", "middleName", e.target.value)
                  }
                />
              </Field>

              <Field label="Last Name" required>
                <input
                  required
                  placeholder="Last name"
                  value={profile.personal.lastName}
                  onChange={(e) =>
                    updateSection("personal", "lastName", e.target.value)
                  }
                />
              </Field>
            </div>

            <div className="profile-grid two">
              <Field label="Email" required>
                <input
                  type="email"
                  required
                  placeholder="Enter email"
                  value={profile.personal.email}
                  onChange={(e) =>
                    updateSection("personal", "email", e.target.value)
                  }
                />
              </Field>

              <Field label="Phone" required>
                <input
                  type="tel"
                  required
                  placeholder="Enter phone"
                  value={profile.personal.phone}
                  onChange={(e) =>
                    updateSection("personal", "phone", e.target.value)
                  }
                />
              </Field>
            </div>

            <Field label="Address" required>
              <textarea
                required
                rows={3}
                placeholder="Type your address here."
                value={profile.personal.address}
                onChange={(e) =>
                  updateSection("personal", "address", e.target.value)
                }
              />
            </Field>

            <div className="profile-grid four">
              <Field label="Pin Code" required>
                <input
                  required
                  placeholder="Pin code"
                  value={profile.personal.pinCode}
                  onChange={(e) =>
                    updateSection("personal", "pinCode", e.target.value)
                  }
                />
              </Field>

              <Field label="Country" required>
                <select
                  required
                  value={profile.personal.country}
                  onChange={(e) =>
                    updateSection("personal", "country", e.target.value)
                  }
                >
                  <option value="">Country</option>
                  <option>India</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Canada</option>
                  <option>Australia</option>
                  <option>Other</option>
                </select>
              </Field>

              <Field label="State" required>
                <input
                  required
                  placeholder="State"
                  value={profile.personal.state}
                  onChange={(e) =>
                    updateSection("personal", "state", e.target.value)
                  }
                />
              </Field>

              <Field label="City" required>
                <input
                  required
                  placeholder="City"
                  value={profile.personal.city}
                  onChange={(e) =>
                    updateSection("personal", "city", e.target.value)
                  }
                />
              </Field>
            </div>

            <div className="profile-actions">
              <button className="profile-primary-btn" type="submit">
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </div>
        </form>
      )}

      {/* EDUCATION */}
      {tab === "Education" && (
        <>
          <div className="profile-section-heading">
            <div>
              <h3>Education</h3>
              <p>Add your educational qualifications.</p>
            </div>

            {!educationOpen && (
              <button
                className="profile-primary-btn"
                onClick={() => {
                  setEducationForm({ ...blankEducation });
                  setEducationEditId(null);
                  setEducationOpen(true);
                }}
              >
                <Plus size={16} />
                Add Education
              </button>
            )}
          </div>

          {educationOpen && (
            <form className="profile-editor" onSubmit={saveEducation}>
              <div className="profile-grid two">
                <Field label="Highest Qualification" required>
                  <select
                    required
                    value={educationForm.qualification}
                    onChange={(e) =>
                      setEducationForm({
                        ...educationForm,
                        qualification: e.target.value
                      })
                    }
                  >
                    <option value="">Select...</option>
                    <option>10th</option>
                    <option>12th</option>
                    <option>Diploma</option>
                    <option>Bachelor's Degree</option>
                    <option>Master's Degree</option>
                    <option>PhD</option>
                    <option>Other</option>
                  </select>
                </Field>

                <Field label="Degree / Course" required>
                  <input
                    required
                    placeholder="e.g. Bachelor of Technology"
                    value={educationForm.degree}
                    onChange={(e) =>
                      setEducationForm({
                        ...educationForm,
                        degree: e.target.value
                      })
                    }
                  />
                </Field>

                <Field label="Institution Name" required>
                  <input
                    required
                    placeholder="University / College name"
                    value={educationForm.institution}
                    onChange={(e) =>
                      setEducationForm({
                        ...educationForm,
                        institution: e.target.value
                      })
                    }
                  />
                </Field>

                <Field label="Specialization">
                  <input
                    placeholder="e.g. Computer Engineering"
                    value={educationForm.specialization}
                    onChange={(e) =>
                      setEducationForm({
                        ...educationForm,
                        specialization: e.target.value
                      })
                    }
                  />
                </Field>

                <Field label="Start Year" required>
                  <select
                    required
                    value={educationForm.startYear}
                    onChange={(e) =>
                      setEducationForm({
                        ...educationForm,
                        startYear: e.target.value
                      })
                    }
                  >
                    <option value="">Select...</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="End Year" required>
                  <select
                    required
                    value={educationForm.endYear}
                    onChange={(e) =>
                      setEducationForm({
                        ...educationForm,
                        endYear: e.target.value
                      })
                    }
                  >
                    <option value="">Select...</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Grade / CGPA / Percentage">
                  <input
                    placeholder="e.g. 8.5 CGPA or 85%"
                    value={educationForm.grade}
                    onChange={(e) =>
                      setEducationForm({
                        ...educationForm,
                        grade: e.target.value
                      })
                    }
                  />
                </Field>
              </div>

              <Field label="Description">
                <textarea
                  rows={3}
                  placeholder="Any additional details about your education..."
                  value={educationForm.description}
                  onChange={(e) =>
                    setEducationForm({
                      ...educationForm,
                      description: e.target.value
                    })
                  }
                />
              </Field>

              <div className="profile-actions">
                <button
                  type="button"
                  className="profile-secondary-btn"
                  onClick={() => {
                    setEducationOpen(false);
                    setEducationEditId(null);
                  }}
                >
                  <X size={15} />
                  Cancel
                </button>

                <button type="submit" className="profile-primary-btn">
                  <Save size={15} />
                  Save
                </button>
              </div>
            </form>
          )}

          {profile.education.length === 0 && !educationOpen && (
            <EmptyState
              icon={GraduationCap}
              title="No education records yet"
              subtitle={'Click "Add Education" to add your first record.'}
            />
          )}

          {profile.education.length > 0 && (
            <div className="profile-record-list">
              {profile.education.map((record) => (
                <div className="profile-record" key={record.id}>
                  <div className="profile-record-icon">
                    <GraduationCap size={20} />
                  </div>

                  <div className="profile-record-info">
                    <h4>{record.degree}</h4>
                    <p>{record.institution}</p>
                    <small>
                      {record.startYear} – {record.endYear}
                      {record.grade && ` • ${record.grade}`}
                    </small>
                    {record.specialization && (
                      <p>{record.specialization}</p>
                    )}
                    {record.description && (
                      <p>{record.description}</p>
                    )}
                  </div>

                  <div className="profile-record-actions">
                    <button
                      aria-label="Edit education"
                      onClick={() => editEducation(record)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="danger"
                      aria-label="Delete education"
                      onClick={() => deleteEducation(record.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* EXPERIENCE */}
      {tab === "Experience" && (
        <>
          <div className="profile-section-heading">
            <div>
              <h3>Experience</h3>
              <p>Add your work experience records.</p>
            </div>

            {!experienceOpen && (
              <button
                className="profile-primary-btn"
                onClick={() => {
                  setExperienceForm({ ...blankExperience });
                  setExperienceEditId(null);
                  setExperienceOpen(true);
                }}
              >
                <Plus size={16} />
                Add Experience
              </button>
            )}
          </div>

          {experienceOpen && (
            <form className="profile-editor" onSubmit={saveExperience}>
              <div className="profile-grid two">
                <Field label="Job Title" required>
                  <input
                    required
                    placeholder="e.g. Full Stack developer"
                    value={experienceForm.jobTitle}
                    onChange={(e) =>
                      setExperienceForm({
                        ...experienceForm,
                        jobTitle: e.target.value
                      })
                    }
                  />
                </Field>

                <Field label="Company Name" required>
                  <input
                    required
                    placeholder="e.g. Actify"
                    value={experienceForm.company}
                    onChange={(e) =>
                      setExperienceForm({
                        ...experienceForm,
                        company: e.target.value
                      })
                    }
                  />
                </Field>

                <Field label="Employment Type">
                  <select
                    value={experienceForm.employmentType}
                    onChange={(e) =>
                      setExperienceForm({
                        ...experienceForm,
                        employmentType: e.target.value
                      })
                    }
                  >
                    <option value="">Select...</option>
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Internship</option>
                    <option>Contract</option>
                    <option>Freelance</option>
                    <option>Self-employed</option>
                  </select>
                </Field>

                <Field label="Location">
                  <input
                    placeholder="e.g. Mumbai, India"
                    value={experienceForm.location}
                    onChange={(e) =>
                      setExperienceForm({
                        ...experienceForm,
                        location: e.target.value
                      })
                    }
                  />
                </Field>

                <Field label="Start Date" required>
                  <input
                    type="month"
                    required
                    value={experienceForm.startDate}
                    onChange={(e) =>
                      setExperienceForm({
                        ...experienceForm,
                        startDate: e.target.value
                      })
                    }
                  />
                </Field>

                <Field label="End Date">
                  <input
                    type="month"
                    disabled={experienceForm.current}
                    value={experienceForm.endDate}
                    onChange={(e) =>
                      setExperienceForm({
                        ...experienceForm,
                        endDate: e.target.value
                      })
                    }
                  />

                  <label className="profile-checkbox">
                    <input
                      type="checkbox"
                      checked={experienceForm.current}
                      onChange={(e) =>
                        setExperienceForm({
                          ...experienceForm,
                          current: e.target.checked,
                          endDate: e.target.checked
                            ? ""
                            : experienceForm.endDate
                        })
                      }
                    />
                    Currently working here
                  </label>
                </Field>
              </div>

              <Field label="Description">
                <textarea
                  rows={3}
                  placeholder="Key responsibilities and achievements..."
                  value={experienceForm.description}
                  onChange={(e) =>
                    setExperienceForm({
                      ...experienceForm,
                      description: e.target.value
                    })
                  }
                />
              </Field>

              <div className="profile-actions">
                <button
                  type="button"
                  className="profile-secondary-btn"
                  onClick={() => {
                    setExperienceOpen(false);
                    setExperienceEditId(null);
                  }}
                >
                  <X size={15} />
                  Cancel
                </button>

                <button type="submit" className="profile-primary-btn">
                  <Save size={15} />
                  Save
                </button>
              </div>
            </form>
          )}

          {profile.experience.length === 0 && !experienceOpen && (
            <EmptyState
              icon={BriefcaseBusiness}
              title="No experience records yet"
              subtitle={'Click "Add Experience" to add your first record.'}
            />
          )}

          {profile.experience.length > 0 && (
            <div className="profile-record-list">
              {profile.experience.map((record) => (
                <div className="profile-record" key={record.id}>
                  <div className="profile-record-icon">
                    <BriefcaseBusiness size={20} />
                  </div>

                  <div className="profile-record-info">
                    <h4>{record.jobTitle}</h4>
                    <p>{record.company}</p>
                    <small>
                      {record.startDate} –{" "}
                      {record.current ? "Present" : record.endDate || "—"}
                    </small>
                    {record.employmentType && (
                      <p>{record.employmentType}</p>
                    )}
                    {record.location && <p>{record.location}</p>}
                    {record.description && <p>{record.description}</p>}
                  </div>

                  <div className="profile-record-actions">
                    <button
                      aria-label="Edit experience"
                      onClick={() => editExperience(record)}
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      className="danger"
                      aria-label="Delete experience"
                      onClick={() => deleteExperience(record.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* OTHER */}
      {tab === "Other" && (
        <form className="profile-card" onSubmit={saveOther}>
          <div className="profile-other-banner">
            <h3>Other Details</h3>
            <p>Skills, languages, certifications, and professional links.</p>
          </div>

          <div className="profile-form-body">
            <div className="profile-grid two">
              <Field label="Skills">
                <input
                  placeholder="e.g. React, Python..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addTag("skills", skillInput, setSkillInput);
                    }
                  }}
                  onBlur={() =>
                    addTag("skills", skillInput, setSkillInput)
                  }
                />
                <small>Press Enter or comma to add</small>

                <div className="profile-tags">
                  {(profile.other.skills || []).map((skill) => (
                    <span key={skill}>
                      {skill}
                      <button
                        type="button"
                        aria-label={`Remove ${skill}`}
                        onClick={() => removeTag("skills", skill)}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </Field>

              <Field label="Languages">
                <input
                  placeholder="e.g. English, Hindi..."
                  value={languageInput}
                  onChange={(e) => setLanguageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addTag("languages", languageInput, setLanguageInput);
                    }
                  }}
                  onBlur={() =>
                    addTag("languages", languageInput, setLanguageInput)
                  }
                />
                <small>Press Enter or comma to add</small>

                <div className="profile-tags">
                  {(profile.other.languages || []).map((language) => (
                    <span key={language}>
                      {language}
                      <button
                        type="button"
                        aria-label={`Remove ${language}`}
                        onClick={() => removeTag("languages", language)}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </Field>
            </div>

            <Field label="Certifications">
              <textarea
                rows={2}
                placeholder="List your certifications (e.g. AWS Solutions Architect, PMP, Google Analytics...)"
                value={profile.other.certifications}
                onChange={(e) =>
                  updateSection("other", "certifications", e.target.value)
                }
              />
            </Field>

            <div className="profile-grid three">
              <Field label="LinkedIn Profile">
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={profile.other.linkedin}
                  onChange={(e) =>
                    updateSection("other", "linkedin", e.target.value)
                  }
                />
              </Field>

              <Field label="Portfolio Website">
                <input
                  type="url"
                  placeholder="https://yourportfolio.com"
                  value={profile.other.portfolio}
                  onChange={(e) =>
                    updateSection("other", "portfolio", e.target.value)
                  }
                />
              </Field>

              <Field label="GitHub Profile">
                <input
                  type="url"
                  placeholder="https://github.com/username"
                  value={profile.other.github}
                  onChange={(e) =>
                    updateSection("other", "github", e.target.value)
                  }
                />
              </Field>
            </div>

            <Field label="Additional Information">
              <textarea
                rows={3}
                placeholder="Anything else relevant to your professional profile..."
                value={profile.other.additionalInfo}
                onChange={(e) =>
                  updateSection("other", "additionalInfo", e.target.value)
                }
              />
            </Field>

            <div className="profile-actions">
              <button type="submit" className="profile-primary-btn">
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </div>
        </form>
      )}
    </main>
  );
}
