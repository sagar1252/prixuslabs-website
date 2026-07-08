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
  subject: `🎉 Success! New Blog Published: ${blogTitle}`,
  html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 40px; border-radius: 12px; border: 1px solid #e5e7eb;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #4f46e5; margin: 0; font-size: 28px;">Mission Accomplished! 🚀</h1>
        <p style="color: #6b7280; font-size: 16px; margin-top: 10px;">Your Autonomous SEO Agent just did its job.</p>
      </div>
      
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #111827; font-size: 20px; margin-top: 0; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">New Article Details</h2>
        
        <p style="font-size: 16px; color: #374151; line-height: 1.5;">
          <strong>Title:</strong> <span style="color: #111827;">${blogTitle}</span>
        </p>
        
        <p style="font-size: 16px; color: #374151; line-height: 1.5;">
          <strong>Live URL:</strong><br/>
          <a href="https://prixuslabs.com/blog/${blogSlug}" style="color: #2563eb; text-decoration: none; word-break: break-all;">https://prixuslabs.com/blog/${blogSlug}</a>
        </p>
        
        <div style="margin-top: 30px; text-align: center;">
          <a href="https://prixuslabs.com/blog/${blogSlug}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Live Article</a>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 14px;">
        <p>This is an automated notification from your Prixus Labs AI System.</p>
        <p>Powered by Next.js & Google Gemini 3.1</p>
      </div>
    </div>
  `,
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log("Error sending email:", error);
  } else {
    console.log('Email sent successfully: ' + info.response);
  }
});
