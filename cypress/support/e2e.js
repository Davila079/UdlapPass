// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Expone BrowserQRCodeReader globalmente para que Cypress pueda hacer stub
import { BrowserQRCodeReader } from '@zxing/browser'
window.BrowserQRCodeReader = BrowserQRCodeReader