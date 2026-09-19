# LandLens

## Intelligent Land Record Digitization and Validation System

LandLens is a web-based application designed to digitize and validate land-record documents using Optical Character Recognition (OCR).

It extracts important information such as:

- Owner Name
- Survey Number
- Village
- District

The system also validates whether all required fields have been successfully detected.

## Problem Statement

Land records in India can exist as handwritten registers, scanned documents, legacy PDFs, and other difficult-to-process formats.

LandLens provides a simple digital workflow to:

1. Upload a land-record document
2. Extract text using OCR
3. Identify important land-record fields
4. Validate the extracted information
5. Display missing or incomplete fields

## Features

- Land-record image upload
- OCR-based text extraction
- English and Kannada OCR support
- Automatic field extraction
- Required-field validation
- Complete/incomplete record detection
- Dashboard for land-record processing
- React + TypeScript frontend
- Flask REST API backend

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- CSS
- Lucide React

### Backend

- Python
- Flask
- Flask-CORS
- Tesseract OCR
- Pytesseract
- Pillow

## Project Structure

```text
LandLens/
├── backend/
│   ├── app.py
│   ├── app_backup.py
│   ├── requirements.txt
│   └── ocr_test/
│
├── public/
│
├── src/
│   ├── components/
│   │   └── Dashboard.tsx
│   ├── services/
│   │   └── api.ts
│   ├── App.tsx
│   └── App.css
│
├── .gitignore
├── package.json
├── README.md
└── vite.config.ts