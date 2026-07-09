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
    2. Write a 100% original, deeply technical, SEO-optimized article following the specifications below.
    3. Do NOT include any images.

    SPECIFICATIONS:
    CONTEXT
    - Target audience: CTOs, Founders, and business owners aged 25-55 exploring digital transformation and AI.
    - Reader's pain point: Confused about which tech stack to invest in, how to automate business processes, or struggling with scale.
    - Business goal of this post: Generate leads for our web development and AI integration services.
    - Funnel stage: Consideration / Decision

    TOPIC & ANGLE
    - Primary topic: The trending tech topic you discovered in Step 1.
    - Unique angle/POV: Take a contrarian stance — most guides oversimplify this.
    - Keywords: Discover and target 1 primary keyword and 3-5 secondary keywords naturally.

    STRUCTURE
    - Hook: Open with a specific, punchy insight or question in the first 2 sentences — no generic scene-setting.
    - Length: 800-1200 words.
    - Format: Use H2/H3 subheadings, short paragraphs (2-3 sentences max), bullet points where useful.
    - Include: 1 real-world example or case study, 1 data point/statistic (cite source), 1 actionable takeaway per section.
    - End with: A clear, non-salesy CTA tied to Prixus Labs development services.

    TONE & STYLE
    - Voice: Confident, direct, slightly informal — like a smart friend, not a textbook.
    - Avoid corporate jargon and fluff.
    - Write in active voice.
    - Vary sentence length to keep rhythm natural (not robotic).

    DO NOT:
    - Start with generic phrases like "In today's fast-paced digital world..." or "In this blog, we will discuss..."
    - Use filler transition phrases like "Moreover," "Furthermore," "In conclusion," repeatedly.
    - Make vague claims without data ("many studies show," "experts agree") — cite specifics or don't claim it.
    - Use listicle clichés like "10 Amazing Tips You Won't Believe".
    - Over-explain basic concepts the target audience already knows.
    - Repeat the same idea in different words to hit a word count.
    - Use excessive exclamation points or hype language ("game-changing," "revolutionary," "unlock the secret").
    - Write generic CTAs like "Contact us today!" — tie the CTA to a specific value/outcome.
    - Sound like it was written by 5 different people — maintain one consistent voice throughout.
    - Include disclaimers, meta-commentary about being an AI, or "I hope this helps!"
    - Pad the intro with unnecessary context before getting to the point.
    - Use overly complex words when simple ones work better (avoid corporate-speak: "leverage," "synergy," "utilize").
    
    4. Adhere strictly to the OUTPUT FORMAT defined in the Master Rules above.
  `;

  console.log("Calling Gemini API...");
  
  try {
    console.log("Fetching list of available models for this API key...");
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + API_KEY);
    const data = await response.json();
    if (data.models) {
      console.log("Available models:");
      data.models.forEach(m => console.log(m.name));
    } else {
      console.log("Model fetch response:", JSON.stringify(data, null, 2));
    }
  } catch (e) {
    console.log("Could not fetch model list:", e.message);
  }

  const modelsToTry = ["gemini-3.1-flash-lite", "gemini-3.5-flash", "gemini-2.5-flash"];
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
    
    const excerptText = data.meta_description || data.excerpt || "New Blog Post";
    const fileContent = `---
title: "${(data.title || 'Untitled').replace(/"/g, '\\"')}"
date: "${date}"
description: "${excerptText.replace(/"/g, '\\"')}"
seo_score: ${data.seo_score || 100}
primary_keyword: "${(data.primary_keyword || '').replace(/"/g, '\\"')}"
---

${data.markdown_content}
`;

    const filePath = path.join(blogDir, `${data.slug}.md`);
    fs.writeFileSync(filePath, fileContent, 'utf8');
    console.log(`Successfully saved to: src/content/blog/${data.slug}.md`);

    // Trigger Notification
    console.log("Triggering email notification...");
    try {
      execSync(`node scripts/notify-blog.js "${data.title}" "${data.slug}" "${data.seo_score || 'N/A'}"`, { stdio: 'inherit', cwd: ROOT_DIR });
    } catch (e) {
      console.error("Failed to send notification email. This is non-fatal.");
    }
    
  } catch (error) {
    console.error("Error generating blog:", error);
    process.exit(1);
  }
}

generateBlog();
