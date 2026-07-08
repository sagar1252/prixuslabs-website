import fm from 'front-matter';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  content: string;
  image?: string;
  keywords?: string[];
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  // Use Vite's glob import to get all markdown files as raw strings
  const files = import.meta.glob('/src/content/blog/*.md', { query: '?raw', import: 'default' });
  const posts: BlogPost[] = [];

  for (const path in files) {
    const slug = path.split('/').pop()?.replace('.md', '') || '';
    const rawContent = (await files[path]()) as string;
    
    // Parse frontmatter
    const parsed = fm(rawContent);
    const attributes = parsed.attributes as any;

    posts.push({
      slug,
      title: attributes.title || 'Untitled',
      description: attributes.description || '',
      date: attributes.date || '',
      image: attributes.image || '',
      keywords: attributes.keywords || [],
      content: parsed.body,
    });
  }

  // Sort by date descending
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getAllBlogPosts();
  return posts.find((p) => p.slug === slug) || null;
}
