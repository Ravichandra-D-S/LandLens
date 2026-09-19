import { useState } from 'react'
import { uploadLandRecordImage } from '../services/api'
import {
  CheckCircle2,
  FileText,
  Search,
  ShieldCheck,
} from 'lucide-react'

function Dashboard() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [ocrLoading, setOcrLoading] = useState(false)
  const [ocrError, setOcrError] = useState('')

    const [ocrResult, setOcrResult] = useState<Awaited<
    ReturnType<typeof uploadLandRecordImage>
  > | null>(null)
    const handleDashboardUpload = async (file: File) => {
    setSelectedFile(file)
    setOcrError('')
    setOcrLoading(true)

    try {
      const result = await uploadLandRecordImage(file)

setOcrResult(result)
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
  return (
    <section className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <span className="section-label">LANDLENS DASHBOARD</span>
          <h1>Land Record Management</h1>
          <p>
            Upload, extract, validate, and manage your land records
            from one place.
          </p>
        </div>

        <div className="dashboard-status">
          <CheckCircle2 size={18} />
          System Ready
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">
            <FileText size={21} />
          </div>

          <div>
            <span>Total Records</span>
            <strong>0</strong>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">
            <Search size={21} />
          </div>

          <div>
            <span>OCR Processed</span>
            <strong>0</strong>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">
            <ShieldCheck size={21} />
          </div>

          <div>
            <span>Validated Records</span>
            <strong>0</strong>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <span className="ocr-status">QUICK ACTION</span>
              <h2>Process a Land Record</h2>
            </div>
          </div>

          <p>
            Upload a scanned land-record document to extract important
            information and check whether all required fields are
            available.
          </p>

          {ocrLoading && (
  <p className="ocr-processing">
    Processing your land record...
  </p>
)}

{selectedFile && !ocrLoading && (
  <p className="selected-file">
    Processed: {selectedFile.name}
  </p>
)}

{ocrError && (
  <p className="ocr-error">
    {ocrError}
  </p>
)}
{ocrResult && (
  <div className="dashboard-ocr-result">
    <span className="ocr-status">INFORMATION EXTRACTED</span>

    <h3>Land Record Information</h3>

    <div className="land-fields-grid">
      <div className="land-field">
        <span>Owner Name</span>
        <strong>
          {ocrResult.fields.owner_name || 'Not detected'}
        </strong>
      </div>

      <div className="land-field">
        <span>Survey Number</span>
        <strong>
          {ocrResult.fields.survey_number || 'Not detected'}
        </strong>
      </div>

      <div className="land-field">
        <span>Village</span>
        <strong>
          {ocrResult.fields.village || 'Not detected'}
        </strong>
      </div>

      <div className="land-field">
        <span>District</span>
        <strong>
          {ocrResult.fields.district || 'Not detected'}
        </strong>
      </div>
    </div>

    <div
      className={`validation-result ${
        ocrResult.validation.is_valid
          ? 'validation-success'
          : 'validation-warning'
      }`}
    >
      <strong>
        {ocrResult.validation.is_valid
          ? 'RECORD COMPLETE'
          : 'RECORD INCOMPLETE'}
      </strong>

      <p>{ocrResult.validation.message}</p>

      {ocrResult.validation.missing_fields.length > 0 && (
        <p className="missing-fields">
          Missing: {ocrResult.validation.missing_fields.join(', ')}
        </p>
      )}
    </div>
  </div>
)}

          <label htmlFor="dashboard-upload" className="primary-btn">
  Upload Land Record
</label>
<input
  id="dashboard-upload"
  type="file"
  accept="image/*"
  hidden
  onChange={(event) => {
    const file = event.target.files?.[0]

    if (file) {
      handleDashboardUpload(file)
    }
  }}
/>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <span className="ocr-status">RECENT ACTIVITY</span>
              <h2>Record History</h2>
            </div>
          </div>

          <div className="empty-state">
            <FileText size={28} />

            <strong>No records processed yet</strong>

            <span>
              Your processed land records will appear here.
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Dashboard