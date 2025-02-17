"use client";

import { useEffect, useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import XtreamAPI from "@/services/xtream";
import type { Movie, Category } from "@/services/xtream";
import AssetPlayer from "@/components/asset-player/asset-player";
import { InView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useXtreamContext } from "@/wrappers/UserContext";

export default function Movies() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedStream, setSelectedStream] = useState<{
    url: string;
    movie: Movie;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [xtream, setXtream] = useState<XtreamAPI | null>(null);
  const { account } = useXtreamContext();

  useEffect(() => {
    if (!account || !account.host || !account.username || !account.password) return;
    const xtream = new XtreamAPI(account.host, account.username, account.password);
    setXtream(xtream);
  }, [account?.host, account?.username, account?.password]);

  useEffect(() => {
    if (!xtream) return;

    const fetchData = async () => {
      try {
        const [movieCategories, movieData] = await Promise.all([
          xtream.getMovieCategories(),
          selectedCategory
            ? xtream.getMovies(Number.parseInt(selectedCategory))
            : xtream.getMovies()
        ]);

        if (movieCategories) {
          setCategories(
            movieCategories.map((c: any) => ({
              ...c,
              category_id: c.category_id.toString()
            }))
          );
        }

        if (movieData) setMovies(movieData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, xtream]);

  if (!xtream) {
    return (
      <div className="h-screen w-screen bg-[#0a0a2e] text-white p-4 flex flex-col">
        <Link
          to={"/"}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Go to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#0a0a2e]">
      <Button
        className="md:hidden m-4"
        onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
      >
        <Menu className="mr-2 h-4 w-4" /> Categories
      </Button>

      <CategoryGrid
        categories={categories}
        selectedCategory={selectedCategory}
        setIsCategoryMenuOpen={setIsCategoryMenuOpen}
        onSelectCategory={(category) => {
          setSelectedCategory(category);
          setIsCategoryMenuOpen(false);
        }}
        isOpen={isCategoryMenuOpen}
      />

      <div className="flex-1 p-4 overflow-hidden">
        <Dialog
          open={!!selectedStream}
          onOpenChange={() => setSelectedStream(null)}
        >
          <DialogContent className="bg-black p-0 border-none max-w-6xl w-[90vw] rounded-none">
            {selectedStream && <AssetPlayer src={selectedStream.url} />}
          </DialogContent>
        </Dialog>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:gap-5 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <AspectRatio ratio={6 / 9}>
                  <div className="h-full w-full bg-muted" />
                </AspectRatio>
              </Card>
            ))}
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:gap-5 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.stream_id}
                  movie={movie}
                  onSelect={() =>
                    setSelectedStream({
                      url: xtream.getMovieStreamUrl(movie),
                      movie
                    })
                  }
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}

interface MovieCardProps {
  movie: Movie;
  onSelect: () => void;
}

const MovieCard = ({ movie, onSelect }: MovieCardProps) => {
  const [loaded, setLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    if (loaded && movie.stream_icon) {
      const img = new Image();
      img.src = movie.stream_icon;
      img.onload = () => setImageSrc(movie.stream_icon);
      img.onerror = () => setImageSrc("/movie.webp");
    }
  }, [loaded, movie.stream_icon]);

  return (
    <InView
      triggerOnce
      rootMargin="200px 0px"
      threshold={0.01}
      onChange={(inView) => inView && !loaded && setLoaded(true)}
    >
      {({ inView, ref }) => (
        <div ref={ref}>
          <Card
            onClick={onSelect}
            style={{ borderColor: "#0a0a2e" }}
            className="cursor-pointer group relative overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg"
          >
            <AspectRatio ratio={6 / 9}>
              <div className="relative h-full w-full">
                <img
                  src={imageSrc ?? "/movie.webp"}
                  alt={movie.name}
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/movie.webp";
                    (e.target as HTMLImageElement).style.objectFit = "cover";
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="truncate text-sm md:text-base lg:text-lg font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                    {movie.name}
                  </h3>
                </div>
              </div>
            </AspectRatio>
          </Card>
        </div>
      )}
    </InView>
  );
};

interface CategoryGridProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  setIsCategoryMenuOpen: (isOpen: boolean) => void;
  isOpen: boolean;
}

const CategoryGrid = ({
  categories,
  selectedCategory,
  setIsCategoryMenuOpen,
  onSelectCategory,
  isOpen
}: CategoryGridProps) => (
  <>
    {isOpen && (
      <div 
        className="fixed inset-0 bg-black/50 md:hidden " 
        onClick={() => setIsCategoryMenuOpen(false)}
      />
    )}
    <div className={`md:block ${isOpen ? "block fixed inset-y-0 left-0 z-50 w-screen" : "hidden"}`}>
      <ScrollArea className="h-full w-full md:w-[200px] bg-[#0a0a2e]">
        <div className="flex flex-col gap-4 p-2">
        <div 
            onClick={() => setIsCategoryMenuOpen(false)}
            className={`cursor-pointer p-4 rounded-lg border transition-all md:hidden `}
          >
            <h3 className="text-center text-xs font-medium sm:text-base text-white">Fermer</h3>
          </div>
          <Link
            to={"/home"}
            className="cursor-pointer p-4 rounded-lg border transition-all bg-card flex items-center justify-center hover:bg-accent"
          >
            <ArrowBigLeft className="mr-2 h-8 w-8" />
            <h3 className="text-center text-xs font-medium sm:text-base">Accueil</h3>
          </Link>
          <div 
            onClick={() => onSelectCategory(null)}
            className={`cursor-pointer p-4 rounded-lg border transition-all ${
              !selectedCategory ? "bg-accent" : "bg-card hover:bg-accent/50"
            }`}
          >
            <h3 className="text-center text-xs font-medium sm:text-base">All</h3>
          </div>
          {categories.map((category) => (
            <div
              key={category.category_id}
              onClick={() => onSelectCategory(category.category_id.toString())}
              className={`cursor-pointer p-4 rounded-lg border transition-all ${
                selectedCategory === category.category_id.toString()
                  ? "bg-accent"
                  : "bg-card hover:bg-accent/50"
              }`}
            >
              <h3 className="text-center text-xs font-medium sm:text-base">
                {category.category_name}
              </h3>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  </>
);