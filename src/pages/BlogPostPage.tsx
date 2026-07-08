import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getBlogPostBySlug, type BlogPost } from '../utils/blog';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      getBlogPostBySlug(slug).then((data) => {
        setPost(data);
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-pulse"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] font-kanit flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
        <Link to="/blog" className="text-cyan-400 hover:underline">Return to Insights</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0C0C0C] font-kanit text-white py-24 px-6 md:px-12 selection:bg-cyan-500/30 selection:text-cyan-50">
      <div className="max-w-4xl mx-auto">
        <Link to="/blog" className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold tracking-wide mb-12 inline-block uppercase transition-colors">
          &larr; Back to Articles
        </Link>

        <div className="flex items-center gap-4 mb-6">
          <span className="text-sm font-semibold uppercase tracking-wider text-cyan-400">{post.date}</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight leading-tight">
          {post.title}
        </h1>

        <div className="prose prose-invert prose-lg md:prose-xl max-w-none prose-headings:font-bold prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline prose-pre:bg-[#0a0a0a] prose-pre:border prose-pre:border-white/10">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
