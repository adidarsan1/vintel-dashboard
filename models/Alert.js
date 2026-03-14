const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String,
    default: ''
  },
  source: {
    type: String,
    required: true,
    // Open enum so Google News, YouTube etc. are accepted
    enum: [
      'Polimer News', 'Thinamani', 'Thinamalar', 'Thinakaran',
      'News18 Tamil', 'News7 Tamil', 'Puthiya Thalaimurai',
      'The Hindu', 'Indian Express', 'Twitter/X', 'YouTube',
      'Google News', 'Manual'
    ]
  },
  sourceUrl: {
    type: String,
    default: ''
  },
  riskLevel: {
    type: String,
    enum: ['HIGH', 'MEDIUM', 'LOW'],
    default: 'LOW',
    index: true
  },
  categories: [{
    type: String,
    enum: [
      'POCSO', 'Weapons', 'Caste', 'Religious', 'Protest',
      'Firearms', 'Gang', 'Murder', 'Theft', 'Robbery',
      'Drugs', 'Crime', 'Other'
    ]
  }],
  district: {
    type: String,
    default: 'Virudhunagar',
    index: true
  },
  // Taluk-level location within Virudhunagar district
  taluk: {
    type: String,
    default: null,
    index: true,
    enum: [
      null,
      'Virudhunagar', 'Srivilliputhur', 'Rajapalayam', 'Sivakasi',
      'Sattur', 'Aruppukkottai', 'Tiruchuli', 'Watrap',
      'Vembakottai', 'Krishnankoil'
    ]
  },
  keywords: [String],
  rawContent: {
    type: String,
    default: ''
  },
  classificationReason: {
    type: String,
    default: ''
  },
  whatsappAlertSent: {
    type: Boolean,
    default: false
  },
  acknowledged: {
    type: Boolean,
    default: false
  },
  acknowledgedBy: {
    type: String,
    default: null
  },
  acknowledgedAt: {
    type: Date,
    default: null
  },
  fingerprint: {
    type: String,
    unique: true,
    required: true
  }
}, {
  timestamps: true
});

// Compound indexes for fast dashboard queries
alertSchema.index({ createdAt: -1 });
alertSchema.index({ riskLevel: 1, createdAt: -1 });
alertSchema.index({ source: 1, createdAt: -1 });
alertSchema.index({ categories: 1 });
alertSchema.index({ taluk: 1, createdAt: -1 });
alertSchema.index({ district: 1, riskLevel: 1, createdAt: -1 });

module.exports = mongoose.model('Alert', alertSchema);
