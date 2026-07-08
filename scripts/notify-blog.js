import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Very simple dotenv parser for our script
function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env');
  if (!fs.existsSync(envPath)) return {};
  
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      let key = match[1].trim();
      let value = match[2].trim();
      // Remove surrounding quotes if they exist
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.substring(1, value.length - 1);
      }
      env[key] = value;
    }
  });
  return env;
}

const env = loadEnv();
const email = process.env.SMTP_EMAIL || env['SMTP_EMAIL'];
let password = process.env.SMTP_PASSWORD || env['SMTP_PASSWORD'];

if (password) {
  password = password.replace(/\s+/g, '');
}

if (!email || !password) {
  console.error("Missing SMTP_EMAIL or SMTP_PASSWORD in .env or environment");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: email,
    pass: password
  },
  tls: {
    rejectUnauthorized: false
  }
});

const args = process.argv.slice(2);
const blogTitle = args[0] || "New Blog Post";
const blogSlug = args[1] || "";

const mailOptions = {
  from: email,
  to: 'sagarc1252@gmail.com',
  subject: `[Prixus Labs Automation] Blog Published: ${blogTitle}`,
  text: `Your automated SEO blog agent has successfully published a new article!
  
Title: ${blogTitle}
URL: http://localhost:5173/blog/${blogSlug}

The post is live on the local Markdown Engine and properly SEO optimized.
`,
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log("Error sending email:", error);
  } else {
    console.log('Email sent successfully: ' + info.response);
  }
});
