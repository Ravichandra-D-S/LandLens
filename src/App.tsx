import { useState } from 'react'
import { uploadLandRecordImage } from './services/api'
import Dashboard from './components/Dashboard'
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  FileText,
  Search,
  ShieldCheck,
  Upload,
} from 'lucide-react'
import './App.css'

type Page = 'home' | 'login' | 'dashboard'

type LandRecordFields = {
  owner_name: string | null
  survey_number: string | null
  village: string | null
  district: string | null
}

type ValidationResult = {
  status: string
  is_valid: boolean
  message: string
  missing_fields: string[]
}

function App() {
  const [page, setPage] = useState<Page>('home')

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [ocrText, setOcrText] = useState('')
  const [ocrFields, setOcrFields] =
    useState<LandRecordFields | null>(null)
  const [validation, setValidation] =
    useState<ValidationResult | null>(null)

  const [ocrLoading, setOcrLoading] = useState(false)
  const [ocrError, setOcrError] = useState('')

  const handleOCRUpload = async (file: File) => {
    setSelectedFile(file)
    setOcrText('')
    setOcrFields(null)
    setValidation(null)
    setOcrError('')
    setOcrLoading(true)

    try {
      const result = await uploadLandRecordImage(file)

      setOcrText(result.text || '')
      setOcrFields(result.fields || null)
      setValidation(result.validation || null)
    } catch (error) {
      setOcrError(
        error instanceof Error
          ? error.message
          : 'OCR processing failed'
      )
    } finally {
      setOcrLoading(false)
    }
  }


  if (page === 'dashboard') {
  return <Dashboard />
}
  if (page === 'login') {
    return (
      <div className="login-page">
        <div className="login-card">
          <button
            className="back-button"
            onClick={() => setPage('home')}
          >
            ← Back to LandLens
          </button>

          <div className="login-logo">
            <span className="logo-icon">L</span>
            <span>LandLens</span>
          </div>

          <h1>Welcome back</h1>

          <p className="login-subtitle">
            Sign in to manage and validate your land records.
          </p>

          <form
            onSubmit={(event) => {
              event.preventDefault()
              alert('Login will be connected to the backend later.')
            }}
          >
            <label htmlFor="email">Email address</label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              required
            />

            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              required
            />

            <button
              type="submit"
              className="primary-btn login-submit"
            >
              Sign In
            </button>
          </form>

          <p className="login-note">
            Authentication will be connected in a later step.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">
          <span className="logo-icon">L</span>
          <span>LandLens</span>
        </div>

        <nav className="nav-links">
          <a href="#features">Features</a>

          <a href="#about">About</a>

          <button
            className="login-btn"
            onClick={() => setPage('login')}
          >
            Login
          </button>

          <button
            className="get-started-btn"
            onClick={() => setPage('login')}
          >
            Get Started
          </button>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <span className="badge">
              Intelligent Land Record Management
            </span>

            <h1>
              Transforming Land Records
              <span>Into Digital Intelligence</span>
            </h1>

            <p>
              LandLens digitizes, extracts, validates, and organizes
              land records using intelligent document processing.
            </p>

            <div className="hero-buttons">
              <button
                className="primary-btn"
                onClick={() => setPage('dashboard')}
              >
                Get Started
                <ArrowRight size={17} />
              </button>

              <a
                href="#features"
                className="secondary-btn"
              >
                Explore Features
              </a>
            </div>

            <div className="ocr-upload">
              <label
                htmlFor="land-record-upload"
                className="upload-btn"
              >
                <Upload size={18} />
                {ocrLoading
                  ? 'Processing...'
                  : 'Upload Land Record'}
              </label>

              <input
                id="land-record-upload"
                type="file"
                accept="image/*"
                hidden
                onChange={(event) => {
                  const file = event.target.files?.[0]

                  if (file) {
                    handleOCRUpload(file)
                  }
                }}
              />

              {selectedFile && (
                <p className="selected-file">
                  Selected: {selectedFile.name}
                </p>
              )}

              {ocrLoading && (
                <p className="ocr-processing">
                  Extracting text from your land record...
                </p>
              )}

              {ocrError && (
                <p className="ocr-error">
                  {ocrError}
                </p>
              )}

              {validation && (
                <div
                  className={`validation-result ${
                    validation.is_valid
                      ? 'validation-success'
                      : 'validation-warning'
                  }`}
                >
                  <div className="validation-icon">
                    {validation.is_valid ? (
                      <CheckCircle2 size={22} />
                    ) : (
                      <AlertCircle size={22} />
                    )}
                  </div>

                  <div>
                    <span className="validation-status">
                      {validation.is_valid
                        ? 'RECORD COMPLETE'
                        : 'RECORD INCOMPLETE'}
                    </span>

                    <h3>Validation Status</h3>

                    <p>{validation.message}</p>

                    {validation.missing_fields.length > 0 && (
                      <p className="missing-fields">
                        Missing: {validation.missing_fields.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {ocrFields && (
                <div className="land-fields">
                  <div className="ocr-result-header">
                    <div>
                      <span className="ocr-status">
                        INFORMATION EXTRACTED
                      </span>

                      <h3>Land Record Information</h3>
                    </div>

                    <CheckCircle2 size={20} />
                  </div>

                  <div className="land-fields-grid">
                    <div className="land-field">
                      <span>Owner Name</span>
                      <strong>
                        {ocrFields.owner_name || 'Not detected'}
                      </strong>
                    </div>

                    <div className="land-field">
                      <span>Survey Number</span>
                      <strong>
                        {ocrFields.survey_number || 'Not detected'}
                      </strong>
                    </div>

                    <div className="land-field">
                      <span>Village</span>
                      <strong>
                        {ocrFields.village || 'Not detected'}
                      </strong>
                    </div>

                    <div className="land-field">
                      <span>District</span>
                      <strong>
                        {ocrFields.district || 'Not detected'}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {ocrText && (
                <div className="ocr-result">
                  <div className="ocr-result-header">
                    <div>
                      <span className="ocr-status">
                        OCR COMPLETE
                      </span>

                      <h3>Extracted Land Record Text</h3>
                    </div>

                    <CheckCircle2 size={20} />
                  </div>

                  <pre>{ocrText}</pre>
                </div>
              )}
            </div>

            <div className="trust-text">
              Built for smarter and more reliable land record management
            </div>
          </div>

          <div className="hero-card">
            <div className="document-preview">
              <div className="document-header">
                <div className="document-logo">L</div>

                <div>
                  <strong>Land Record</strong>
                  <small>Digital Document</small>
                </div>
              </div>

              <div className="document-line large"></div>
              <div className="document-line"></div>
              <div className="document-line"></div>

              <div className="record-fields">
                <div>
                  <span>Owner Name</span>
                  <strong>Ramesh Kumar</strong>
                </div>

                <div>
                  <span>Survey Number</span>
                  <strong>125/3</strong>
                </div>

                <div>
                  <span>Village</span>
                  <strong>Pavagada</strong>
                </div>

                <div>
                  <span>Area</span>
                  <strong>2.5 Acres</strong>
                </div>
              </div>

              <div className="verified">
                <CheckCircle2 size={18} />
                Record Verified
              </div>
            </div>
          </div>
        </section>

        <section
          className="features"
          id="features"
        >
          <div className="section-heading">
            <span className="section-label">
              CORE FEATURES
            </span>

            <h2>
              Everything you need to digitize land records
            </h2>

            <p>
              From document upload to validation, LandLens simplifies
              the complete record-processing workflow.
            </p>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FileText size={22} />
              </div>

              <h3>Document Digitization</h3>

              <p>
                Upload scanned land records and convert them into
                searchable digital information.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Search size={22} />
              </div>

              <h3>Intelligent OCR</h3>

              <p>
                Extract important information from land-record
                documents using OCR technology.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <ShieldCheck size={22} />
              </div>

              <h3>Data Validation</h3>

              <p>
                Validate extracted fields and identify information
                that requires manual verification.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Upload size={22} />
              </div>

              <h3>Digital Records</h3>

              <p>
                Store organized land information for easier access,
                tracking, and management.
              </p>
            </div>
          </div>
        </section>

        <section
          className="about"
          id="about"
        >
          <div>
            <span className="section-label">
              ABOUT LANDLENS
            </span>

            <h2>
              Making legacy land records easier to understand and manage.
            </h2>
          </div>

          <p>
            LandLens is an intelligent land-record digitization and
            validation platform designed to transform traditional
            documents into structured digital records. It combines
            OCR, data extraction, validation, and human verification
            into one simple workflow.
          </p>
        </section>
      </main>

      <footer>
        <div className="logo">
          <span className="logo-icon">L</span>
          <span>LandLens</span>
        </div>

        <p>
          Intelligent Land Record Digitization & Validation System
        </p>
      </footer>
    </div>
  )
}

export default App