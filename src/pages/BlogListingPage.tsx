import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllBlogPosts, type BlogPost } from '../utils/blog';

export default function BlogListingPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    getAllBlogPosts().then(setPosts);
  }, []);

  return (
    <div className="min-h-screen bg-[#0C0C0C] font-kanit text-white py-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold tracking-wide mb-8 inline-block uppercase">
          &larr; Back to Home
        </Link>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-12 tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-blue-200">
            Insights & Engineering
          </span>
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link 
              key={post.slug} 
              to={`/blog/${post.slug}`}
              className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 hover:border-cyan-400/50 transition-all duration-300 group shadow-[0_0_20px_rgba(0,0,0,0.4)] flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-semibold uppercase text-cyan-400 tracking-wider">
                  {post.date}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                {post.title}
              </h2>
              <p className="text-white/60 text-sm leading-relaxed line-clamp-3">
                {post.description}
              </p>
            </Link>
          ))}
          {posts.length === 0 && (
            <div className="col-span-full py-12 text-center text-white/50">
              Initializing knowledge base... No articles found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
