import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Load environment variables manually since dotenv might not be installed
function loadEnv() {
  const envPath = path.join(ROOT_DIR, '.env');
  const envVars = {};
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let key = match[1];
        let value = match[2] || '';
        value = value.replace(/^['"]|['"]$/g, '');
        envVars[key] = value;
      }
    });
  }
  return envVars;
}

const env = loadEnv();
const API_KEY = process.env.VITE_GEMINI_API_KEY || env['VITE_GEMINI_API_KEY'];

if (!API_KEY) {
  console.error("Missing VITE_GEMINI_API_KEY in environment");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function generateBlog() {
  console.log("Initializing Autonomous SEO Agent...");
  
  const rulesPath = path.join(ROOT_DIR, '.agents', 'AGENTS.md');
  let rules = "";
  if (fs.existsSync(rulesPath)) {
    rules = fs.readFileSync(rulesPath, 'utf8');
  }

  const blogDir = path.join(ROOT_DIR, 'src', 'content', 'blog');
  let existingBlogs = [];
  if (fs.existsSync(blogDir)) {
    existingBlogs = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));
  }

  const prompt = `
    You are an Autonomous SEO Content Agent for Prixuslabs.
    Here are your Master Rules from the system config:
    ${rules}
    
    Existing blog topics we have already covered (DO NOT REPEAT THESE):
    ${existingBlogs.join(', ')}

    Task:
    1. Discover a highly trending, high-value B2B tech topic related to Custom Web Development, AI Integration, React, Next.js, etc.
    2. Write a 100% original, deeply technical, SEO-optimized article.
    3. Do NOT include any images. The website does not render featured images anymore.
    4. You MUST return a JSON object with EXACTLY this structure, and no other text:
    {
      "title": "The Title of the Blog",
      "slug": "url-friendly-slug",
      "excerpt": "A short meta description.",
      "markdown_content": "The full article in markdown format, using # and ## for headers. Do not include front-matter in this field, just the body."
    }
  `;

  console.log("Calling Gemini API...");
  
  const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
  let result = null;
  let responseText = "";

  try {
    for (const modelName of modelsToTry) {
    try {
      console.log(`Trying model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        }
      });
      responseText = result.response.text();
      console.log(`Successfully generated content using ${modelName}`);
      break; // Success, exit the loop
    } catch (error) {
      console.error(`Error with model ${modelName}:`, error.message);
      // If it's the last model in the array, throw the error
      if (modelName === modelsToTry[modelsToTry.length - 1]) {
        throw error;
      }
    }
  }
  
  const data = JSON.parse(responseText);
    
    console.log(`Generated Blog: ${data.title}`);
    
    // Create the markdown file with front-matter
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    const fileContent = `---
title: "${data.title.replace(/"/g, '\\"')}"
date: "${date}"
excerpt: "${data.excerpt.replace(/"/g, '\\"')}"
---

${data.markdown_content}
`;

    const filePath = path.join(blogDir, `${data.slug}.md`);
    fs.writeFileSync(filePath, fileContent, 'utf8');
    console.log(`Successfully saved to: src/content/blog/${data.slug}.md`);

    // Trigger Notification
    console.log("Triggering email notification...");
    try {
      execSync(`node scripts/notify-blog.js "${data.title}" "${data.slug}"`, { stdio: 'inherit', cwd: ROOT_DIR });
    } catch (e) {
      console.error("Failed to send notification email. This is non-fatal.");
    }
    
  } catch (error) {
    console.error("Error generating blog:", error);
    process.exit(1);
  }
}

generateBlog();
