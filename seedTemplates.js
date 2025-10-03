const path = require('path');
// Load env from project root .env
require('dotenv').config({ path: path.join(__dirname, '.env') });
// Fallback: try server/.env if root .env not found or missing key
if (!process.env.MONGODB_URI) {
  require('dotenv').config({ path: path.join(__dirname, 'server', '.env') });
}

// Prefer the server's mongoose instance to avoid dual-instance buffering issues
let mongoose;
try {
  mongoose = require('./server/node_modules/mongoose');
} catch (e) {
  mongoose = require('mongoose');
}
const Template = require('./server/models/Template');

const MONGODB_URI = process.env.MONGODB_URI;

// Generate many sample templates per category
function makeElements({ title, accent = '#2563EB', bg = '#FFFFFF', w = 800, h = 1200, includeImage = false }) {
  const els = [];
  // Background rectangle
  els.push({ id: `${Date.now()}_bg`, type: 'rect', x: 0, y: 0, width: w, height: h, fill: bg, opacity: 1, rotation: 0, scaleX: 1, scaleY: 1 });
  // Header text
  els.push({ id: `${Date.now()}_t1`, type: 'text', text: title, fontSize: Math.max(32, Math.round(w * 0.08)), fontFamily: 'Inter', fontWeight: 800, fill: accent, x: 60, y: 80, opacity: 1, rotation: 0, scaleX: 1, scaleY: 1 });
  // Subtitle
  els.push({ id: `${Date.now()}_t2`, type: 'text', text: 'Your catchy subtitle goes here', fontSize: 20, fontFamily: 'Inter', fontWeight: 400, fill: '#374151', x: 60, y: 80 + Math.max(40, Math.round(w * 0.08)), opacity: 1, rotation: 0, scaleX: 1, scaleY: 1 });
  if (includeImage) {
    els.push({ id: `${Date.now()}_img`, type: 'image', src: 'https://picsum.photos/seed/' + Math.floor(Math.random()*9999) + '/400/250', x: 60, y: 220, width: 400, height: 250, opacity: 1, rotation: 0, scaleX: 1, scaleY: 1 });
  }
  return els;
}

function createBatch(category, count, size) {
  const palettes = [
    { bg: '#FFFFFF', accent: '#2563EB' },
    { bg: '#F3F4F6', accent: '#111827' },
    { bg: '#111827', accent: '#F59E0B' },
    { bg: '#FAFAF9', accent: '#0EA5E9' },
    { bg: '#FEF3C7', accent: '#92400E' },
    { bg: '#ECFEFF', accent: '#0369A1' },
    { bg: '#FFF7ED', accent: '#9A3412' },
  ];
  const items = [];
  for (let i = 1; i <= count; i++) {
    const pal = palettes[i % palettes.length];
    const dims = size || (category === 'Card' ? { w: 1050, h: 600 } : category === 'Resume' ? { w: 850, h: 1100 } : { w: 800, h: 1200 });
    const includeImage = category !== 'Resume' && category !== 'Card';
    const elements = makeElements({ title: `${category} Template ${i}`, accent: pal.accent, bg: pal.bg, w: dims.w, h: dims.h, includeImage });
    items.push({
      title: `${category} Template ${i}`,
      category,
      previewUrl: `https://via.placeholder.com/600x400?text=${encodeURIComponent(category + ' ' + i)}`,
      jsonData: { canvas: { width: dims.w, height: dims.h }, elements, objects: elements },
    });
  }
  return items;
}

const baseSamples = [
  // Keep a few hand-crafted ones
  {
    title: 'Modern Event Poster',
    category: 'Poster',
    previewUrl: 'https://via.placeholder.com/600x800?text=Poster+Template',
    jsonData: {
      background: { color: '#111827' },
      elements: [
        { id: 't1', type: 'text', text: 'SUMMER FEST', fontSize: 72, fill: '#F59E0B', x: 100, y: 120, fontFamily: 'Inter', fontWeight: 800 },
        { id: 't2', type: 'text', text: 'Live Music • Food • Art', fontSize: 24, fill: '#F3F4F6', x: 100, y: 210 },
        { id: 'i1', type: 'image', src: 'https://via.placeholder.com/400x250?text=Image', x: 100, y: 260, width: 400, height: 250 },
      ],
      objects: [],
      canvas: { width: 800, height: 1200 },
    },
  },
];

const samples = [
  ...baseSamples,
  ...createBatch('Poster', 15),
  ...createBatch('Resume', 15),
  ...createBatch('Flyer', 15),
  ...createBatch('Card', 15),
  ...createBatch('Invitation', 15),
];

async function seed() {
  if (!MONGODB_URI) {
    console.error('Missing MONGODB_URI environment variable. Please set it in your .env file.');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Clear existing templates before seeding
    await Template.deleteMany({});
    console.log('Cleared existing templates');

    await Template.insertMany(samples);
    console.log(`Inserted ${samples.length} templates.`);
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

seed();
