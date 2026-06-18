"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Input, Button, Select, SelectItem, Card, CardBody, CardFooter, Chip, Skeleton, Pagination
} from "@heroui/react";
import { MagnifierPlus, Funnel, ArrowUp, ArrowDown, BookOpen, Xmark } from "@gravity-ui/icons";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

const GENRES = ["All", "Fiction", "Mystery", "Romance", "Sci-Fi", "Fantasy", "Horror", "Biography", "Self-Help", "History", "Thriller", "Adventure", "Poetry"];
const SORT_OPTIONS = [
  { key: "newest", label: "Newest First" },
  { key: "oldest", label: "Oldest First" },
  { key: "price_asc", label: "Price: Low → High" },
  { key: "price_desc", label: "Price: High → Low" },
];

function EbookCardSkeleton() {
  return (
    <Card className="glass-card border-0 overflow-hidden">
      <Skeleton className="h-52 rounded-none bg-purple-900/20" />
      <CardBody className="gap-2 p-4">
        <Skeleton className="h-4 w-3/4 rounded bg-purple-900/20" />
        <Skeleton className="h-3 w-1/2 rounded bg-purple-900/20" />
        <Skeleton className="h-3 rounded bg-purple-900/20" />
      </CardBody>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-8 w-full rounded bg-purple-900/20" />
      </CardFooter>
    </Card>
  );
}

function BrowseContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({
    search: "",
    genre: searchParams.get("genre") || "All",
    minPrice: "",
    maxPrice: "",
    sort: searchParams.get("sort") || "newest",
    page: 1,
    limit: 12,
  });

  const fetchEbooks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        sort: filters.sort,
        page: filters.page,
        limit: filters.limit,
      };
      if (filters.search) params.search = filters.search;
      if (filters.genre && filters.genre !== "All") params.genre = filters.genre;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      const res = await axios.get(`${API}/ebooks`, { params });
      setEbooks(res.data.ebooks);
      setTotalPages(res.data.totalPages);
      setTotal(res.data.total);
    } catch {
      setEbooks([]);
    } finally {
      setLoading(false);
    }
  }, [filters, API]);

  useEffect(() => {
    const timer = setTimeout(fetchEbooks, 400);
    return () => clearTimeout(timer);
  }, [fetchEbooks]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ search: "", genre: "All", minPrice: "", maxPrice: "", sort: "newest", page: 1, limit: 12 });
  };

  const hasActiveFilters = filters.search || filters.genre !== "All" || filters.minPrice || filters.maxPrice;

  return (
    <div className="min-h-screen bg-[#0f0a1e]">
      <Navbar />

      {/* Page Header */}
      <div className="pt-36 pb-10 relative overflow-hidden">
        <div className="orb orb-purple w-80 h-80 top-0 right-1/4 opacity-15" />
        <div className="container-main relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="section-heading text-4xl md:text-5xl mb-3">Browse Ebooks</h1>
            <p className="text-slate-400">
              {total > 0 ? `${total} ebooks found` : "Explore our library"}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-main pb-20">
        {/* ─── Filters Row ─── */}
        <div className="glass-card p-5 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <Input
              placeholder="Search by title or writer..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              startContent={<MagnifierPlus className="text-slate-400" width={16} height={16} />}
              classNames={{
                base: "flex-1",
                inputWrapper: "bg-white/5 border border-purple-500/20 hover:border-purple-500/40 focus-within:border-purple-500",
                input: "text-white placeholder:text-slate-500",
              }}
            />

            {/* Genre Filter */}
            <Select
              selectedKeys={[filters.genre]}
              onSelectionChange={(keys) => updateFilter("genre", [...keys][0])}
              classNames={{
                base: "w-full lg:w-48",
                trigger: "bg-white/5 border border-purple-500/20 hover:border-purple-500/40 data-[open=true]:border-purple-500",
                value: "text-white",
                listboxWrapper: "bg-[#1e1245] border border-purple-500/20",
              }}
              aria-label="Filter by genre"
            >
              {GENRES.map((g) => (
                <SelectItem key={g} className="text-slate-200 hover:bg-purple-500/10">
                  {g}
                </SelectItem>
              ))}
            </Select>

            {/* Price Range */}
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                placeholder="Min $"
                value={filters.minPrice}
                onChange={(e) => updateFilter("minPrice", e.target.value)}
                classNames={{
                  base: "w-24",
                  inputWrapper: "bg-white/5 border border-purple-500/20 hover:border-purple-500/40",
                  input: "text-white placeholder:text-slate-500",
                }}
              />
              <span className="text-slate-500 text-sm">—</span>
              <Input
                type="number"
                placeholder="Max $"
                value={filters.maxPrice}
                onChange={(e) => updateFilter("maxPrice", e.target.value)}
                classNames={{
                  base: "w-24",
                  inputWrapper: "bg-white/5 border border-purple-500/20 hover:border-purple-500/40",
                  input: "text-white placeholder:text-slate-500",
                }}
              />
            </div>

            {/* Sort */}
            <Select
              selectedKeys={[filters.sort]}
              onSelectionChange={(keys) => updateFilter("sort", [...keys][0])}
              classNames={{
                base: "w-full lg:w-52",
                trigger: "bg-white/5 border border-purple-500/20 hover:border-purple-500/40",
                value: "text-white",
                listboxWrapper: "bg-[#1e1245] border border-purple-500/20",
              }}
              aria-label="Sort ebooks"
            >
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.key} className="text-slate-200 hover:bg-purple-500/10">
                  {opt.label}
                </SelectItem>
              ))}
            </Select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                isIconOnly
                variant="flat"
                className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 shrink-0"
                onPress={clearFilters}
                aria-label="Clear filters"
              >
                <Xmark width={16} height={16} />
              </Button>
            )}
          </div>
        </div>

        {/* ─── Ebook Grid ─── */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array(12).fill(0).map((_, i) => <EbookCardSkeleton key={i} />)}
          </div>
        ) : ebooks.length === 0 ? (
          <div className="text-center py-24 glass-card rounded-2xl">
            <BookOpen width={48} height={48} className="mx-auto mb-4 text-purple-400 opacity-40" />
            <h3 className="text-xl font-semibold text-white mb-2">No ebooks found</h3>
            <p className="text-slate-400 mb-6">Try adjusting your search or filters.</p>
            <Button className="glow-btn text-white" onPress={clearFilters}>Clear Filters</Button>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          >
            {ebooks.map((ebook) => (
              <motion.div
                key={ebook._id}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              >
                <Link href={`/ebooks/${ebook._id}`}>
                  <Card className="ebook-card glass-card border-0 overflow-hidden group cursor-pointer h-full">
                    <div className="relative overflow-hidden h-52">
                      <img
                        src={ebook.coverImage}
                        alt={ebook.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a1e] via-transparent to-transparent" />
                      <Chip size="sm" className="absolute top-2 right-2 bg-purple-600/80 text-white text-xs">
                        {ebook.genre}
                      </Chip>
                      {user?.purchasedEbooks?.includes(ebook._id) && (
                        <Chip size="sm" className="absolute top-2 left-2 bg-green-500/80 text-white text-xs">
                          Owned
                        </Chip>
                      )}
                    </div>
                    <CardBody className="p-4">
                      <h3 className="font-bold text-white text-sm mb-1 line-clamp-2 leading-snug group-hover:text-purple-300 transition-colors">
                        {ebook.title}
                      </h3>
                      <p className="text-slate-500 text-xs mb-2">by {ebook.writerName}</p>
                      <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">{ebook.description}</p>
                    </CardBody>
                    <CardFooter className="px-4 pb-4 pt-0 flex items-center justify-between">
                      <span className="text-purple-400 font-bold">${ebook.price}</span>
                      <Button size="sm" className="glow-btn text-white text-xs px-3 h-7 min-w-0">
                        View
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ─── Pagination ─── */}
        {totalPages > 1 && !loading && (
          <div className="flex justify-center mt-10">
            <Pagination
              total={totalPages}
              page={filters.page}
              onChange={(page) => setFilters((prev) => ({ ...prev, page }))}
              classNames={{
                wrapper: "gap-1",
                item: "bg-white/5 border border-purple-500/20 text-slate-300 hover:bg-purple-500/20 hover:text-white",
                cursor: "bg-purple-gradient text-white font-bold",
              }}
            />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0f0a1e] flex items-center justify-center">
        <div className="text-slate-400">Loading library...</div>
      </div>
    }>
      <BrowseContent />
    </Suspense>
  );
}
