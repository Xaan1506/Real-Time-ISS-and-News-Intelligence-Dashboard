import { useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDashboardStore } from '../context/useDashboardStore';
import { useISSData } from '../hooks/useISSData';
import { useNewsData } from '../hooks/useNewsData';
import { InfoCard } from '../components/InfoCard';
import { ISSMap } from '../map/ISSMap';
import { SpeedTrendChart } from '../charts/SpeedTrendChart';
import { NewsDistributionChart } from '../charts/NewsDistributionChart';
import { NewsPanel } from '../components/NewsPanel';
import { FloatingChatbot } from '../chatbot/FloatingChatbot';
import { SkeletonCard } from '../components/SkeletonLoader';

function formatTime(unixTs) {
  if (!unixTs) return '--';
  return new Date(unixTs * 1000).toLocaleTimeString();
}

export function DashboardPage() {
  const {
    issPositions,
    currentSpeed,
    nearestPlace,
    peopleInSpace,
    newsArticles,
    speedHistory,
    categoryFilter,
    searchTerm,
    sortBy,
    autoRefresh,
    isLoadingISS,
    isLoadingNews,
    newsError,
    issError,
    setSearchTerm,
    setSortBy,
    setCategoryFilter,
    setAutoRefresh,
  } = useDashboardStore();

  const { refreshISS, refreshAstronauts } = useISSData();
  const { refreshNews } = useNewsData();

  const current = issPositions.at(-1);

  const filteredNews = useMemo(() => {
    let data = [...newsArticles];

    if (categoryFilter !== 'all') {
      data = data.filter((item) =>
        [item.category, item.title, item.description].join(' ').toLowerCase().includes(categoryFilter.toLowerCase()),
      );
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      data = data.filter((item) =>
        [item.title, item.description, item.source].join(' ').toLowerCase().includes(q),
      );
    }

    if (sortBy === 'latest' || sortBy === 'date') {
      data.sort((a, b) => +new Date(b.pubDate) - +new Date(a.pubDate));
    } else if (sortBy === 'oldest') {
      data.sort((a, b) => +new Date(a.pubDate) - +new Date(b.pubDate));
    } else if (sortBy === 'source') {
      data.sort((a, b) => a.source.localeCompare(b.source));
    }

    return data;
  }, [newsArticles, categoryFilter, searchTerm, sortBy]);

  return (
    <div className="space-y-6">
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {isLoadingISS && issPositions.length === 0 ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <InfoCard title="Latitude" value={current ? current.latitude.toFixed(3) : '--'} subtitle="Live ISS" />
            <InfoCard title="Longitude" value={current ? current.longitude.toFixed(3) : '--'} subtitle="Live ISS" />
            <InfoCard title="ISS Speed" value={`${currentSpeed.toLocaleString()} km/h`} subtitle="Haversine" />
            <InfoCard title="Nearest Place" value={nearestPlace} subtitle="Reverse Geocode" />
            <InfoCard title="Tracked Positions" value={issPositions.length} subtitle="Last 15" />
            <InfoCard title="Last Update" value={formatTime(current?.timestamp)} subtitle="UTC local display" />
          </>
        )}
      </motion.section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="glass p-4 lg:col-span-2">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <button onClick={refreshISS} className="glass flex items-center gap-2 px-3 py-2 text-sm">
              <RefreshCw size={14} className={isLoadingISS ? 'animate-spin' : ''} /> Refresh ISS
            </button>
            <button onClick={() => setAutoRefresh(!autoRefresh)} className={`rounded-lg px-3 py-2 text-sm font-semibold ${autoRefresh ? 'bg-emerald-500 text-slate-900' : 'bg-slate-500/50 text-slate-100'}`}>
              Auto Refresh: {autoRefresh ? 'On' : 'Off'}
            </button>
          </div>
          <ISSMap positions={issPositions} nearestPlace={nearestPlace} />
          {issError ? <p className="mt-2 text-xs text-rose-300">{issError}</p> : null}
        </div>

        <div className="glass space-y-3 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">People In Space</h3>
            <button onClick={refreshAstronauts} className="glass px-2 py-1 text-xs">Refresh</button>
          </div>
          <p className="text-3xl font-semibold">{peopleInSpace.number || 0}</p>
          <div className="scroll-thin max-h-60 space-y-2 overflow-y-auto pr-1">
            {(peopleInSpace.people || []).map((person) => (
              <div key={`${person.name}-${person.craft}`} className="rounded-lg bg-white/5 p-2 text-sm">
                <p className="font-medium">{person.name}</p>
                <p className="text-xs text-slate-400">{person.craft}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <SpeedTrendChart points={speedHistory} />
        <NewsDistributionChart articles={newsArticles} onCategoryClick={(category) => setCategoryFilter(category)} />
      </section>

      <NewsPanel
        articles={filteredNews}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        refreshNews={refreshNews}
        isLoading={isLoadingNews}
        newsError={newsError}
      />

      <FloatingChatbot />
    </div>
  );
}
