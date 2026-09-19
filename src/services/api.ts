const API_BASE_URL = 'http://127.0.0.1:5000'

export type LandRecordFields = {
  owner_name: string | null
  survey_number: string | null
  village: string | null
  district: string | null
}

export type ValidationResult = {
  status: string
  is_valid: boolean
  message: string
  missing_fields: string[]
}

export type OCRResponse = {
  status: string
  text: string
  fields: LandRecordFields
  validation: ValidationResult
}

export async function checkBackendHealth() {
  const response = await fetch(`${API_BASE_URL}/api/health`)

  if (!response.ok) {
    throw new Error('Backend health check failed')
  }

  return response.json()
}

export async function uploadLandRecordImage(
  file: File
): Promise<OCRResponse> {
  const formData = new FormData()

  formData.append('image', file)

  const response = await fetch(`${API_BASE_URL}/api/ocr`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)

    throw new Error(
      errorData?.message || 'OCR processing failed'
    )
  }

  return response.json()
}