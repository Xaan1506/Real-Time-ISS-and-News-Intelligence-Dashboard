import { Search, RefreshCw } from 'lucide-react';
import { SkeletonNewsCard } from './SkeletonLoader';

export function NewsPanel({
  articles,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  categoryFilter,
  setCategoryFilter,
  refreshNews,
  isLoading,
  newsError,
}) {
  const categories = ['all', 'technology', 'science', 'space', 'ai', 'world'];

  return (
    <section className="space-y-4">
      <div className="glass flex flex-col gap-3 p-4 md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/20 px-3 py-2">
          <Search size={16} className="text-slate-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search title, description, source"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="glass px-3 py-2 text-sm">
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
          <option value="source">Source</option>
          <option value="date">Date</option>
        </select>
        <button onClick={() => refreshNews(categoryFilter === 'all' ? '' : categoryFilter)} className="glass flex items-center gap-2 px-3 py-2 text-sm font-semibold">
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <div key={category} className="flex items-center gap-1">
            <button
              onClick={() => setCategoryFilter(category)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-widest ${
                categoryFilter === category ? 'bg-cyan-500 text-slate-900' : 'glass'
              }`}
            >
              {category}
            </button>
            <button
              onClick={() => refreshNews(category === 'all' ? '' : category)}
              className="glass rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-widest"
              title={`Refresh ${category} news`}
            >
              <RefreshCw size={11} className={isLoading && categoryFilter === category ? 'animate-spin' : ''} />
            </button>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {isLoading ? (
          <>
            <SkeletonNewsCard />
            <SkeletonNewsCard />
            <SkeletonNewsCard />
          </>
        ) : newsError ? (
          <div className="glass col-span-full p-6 text-center text-slate-300">
            <p>{newsError}</p>
            <button
              onClick={() => refreshNews(categoryFilter === 'all' ? '' : categoryFilter)}
              className="mt-3 rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-900"
            >
              Retry
            </button>
          </div>
        ) : articles.length === 0 ? (
          <div className="glass col-span-full p-6 text-center text-slate-400">No articles found. Try another filter.</div>
        ) : (
          articles.map((article) => (
            <article key={article.id} className="glass overflow-hidden">
              {article.image ? <img src={article.image} alt={article.title} className="h-40 w-full object-cover" /> : null}
              <div className="space-y-2 p-4">
                <h3 className="line-clamp-2 text-base font-semibold">{article.title}</h3>
                <p className="line-clamp-2 text-sm text-slate-400">{article.description}</p>
                <div className="text-xs text-slate-400">
                  <p>Source: {article.source}</p>
                  <p>Author: {article.author}</p>
                  <p>{new Date(article.pubDate).toLocaleString()}</p>
                </div>
                <a href={article.link} target="_blank" rel="noreferrer" className="inline-flex rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-900">
                  Read More
                </a>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
