import React,{useState, useRef, useEffect} from 'react'
import "../styles/home.scss"
import { useInterview } from '../hooks/useInterview'
import { useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth.js'

const Home = () => {
    const { handleLogout } = useAuth()
    const {loading, generateReport, reports} = useInterview()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [resumeName, setResumeName] = useState("");
    const { user } = useAuth()
    const resumeInputRef = useRef()
    const navigate = useNavigate()
    let file = null
    const handleGenerateReport = async() => {
        const resumeFile = resumeInputRef.current.files[0]
        const data = await generateReport({jobDescription, selfDescription, resumeFile})
        navigate(`/interview/${data._id}`)
    }

    if(loading){
        return (
            <main className="loading-screen">
                <h1>Loading your interview plan...</h1>
            </main>
        )
    }
  return (
    <main className="home">

      {/* ── Hero ── */}
      <section className="hero">
        <span className="badge">AI-Powered Interview Prep</span>
        <h1>Land your <em>dream job</em><br /></h1>
        <h1>{user?.username}</h1>
        <p>Paste a job description and your background</p>
      </section>
      

      {/* ── Main Card ── */}
      <section className="card">

        {/* Left — Job Description */}
        <div className="card-panel left">
          <div className="panel-heading">
            <span className="step-tag">Step 01</span>
            <label htmlFor="jobDescription">Job Description</label>
            <p className="panel-hint">Paste the full job posting from LinkedIn, Indeed, etc.</p>
          </div>
          <textarea
            onChange={(e) => {setJobDescription(e.target.value)}}
            name="jobDescription"
            id="jobDescription"
            placeholder="Enter job description here..."
          />
        </div>

        {/* Divider */}
        <div className="card-divider">
          <span>✦</span>
        </div>

        {/* Right — Your Profile */}
        <div className="card-panel right">
          <div className="panel-heading">
            <span className="step-tag">Step 02</span>
            <label>Your Profile</label>
            <p className="panel-hint">Add your resume and/or a short self description.</p>
          </div>

          {/* Resume Upload */}
          <div className="input-group">
            <p className="input-label">
              Resume{" "}
              <small className="highlight">Use resume and self description together for best results</small>
            </p>
            <input ref={resumeInputRef} hidden type="file" name="resume" id="resume" accept=".pdf" onChange={(e) => {
              file = e.target.files[0];
              if(file){
                setResumeName(file.name);
              }
            }}/>
            <label className="file-label" htmlFor="resume">
              <span className="upload-icon">↑</span>
              {resumeName || "Upload Resume"}
            </label>
          </div>

          {/* Self Description */}
          <div className="input-group">
            <label htmlFor="selfDescription">Self Description</label>
            <textarea
              onChange={(e) => {setSelfDescription(e.target.value)}}
              name="selfDescription"
              id="selfDescription"
              placeholder="Enter about yourself..."
            />
          </div>

          {/* Submit */}
          <button onClick={handleGenerateReport} className="button primary-button">
            Generate Interview Report →
          </button>
        </div>

      </section>
      
      <button className="logout" onClick={ handleLogout }>
        Logout
      </button>
      {/* Recent Reports List */}                     
      {reports.length > 0 && (
        <section className='recent-reports'>
            <h2>My Recent Interview Plans</h2>
            <ul className="reports-list">
                {reports.map(report => (
                    <li key={report._id} className="report-item" onClick={() => navigate(`/interview/${report._id}`)}>
                        <h3>{report.title || 'Untitled Position'}</h3>
                        <p className="report-meta">Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                        <p className={`match-score ${report.matchScore >= 80 ? 'score-high' : report.matchScore >= 60 ? 'score-mid' : 'score-low'}`}>Match Score: {report.matchScore}%</p>
                    </li>
                ))}
            </ul>
        </section>
      )}
      {/* ── Footer ── */}
      <footer className="site-footer">
        <p>© 2026 PrepAI · Built with ♥ for job seekers</p>
      </footer>

    </main>
  )
}

export default Home