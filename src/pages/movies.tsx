"use client";

import { useEffect, useRef, useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import XtreamAPI from "@/services/xtream";
import type { Movie, Category } from "@/services/xtream";
import AssetPlayer from "@/components/asset-player/asset-player";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useXtreamContext } from "@/wrappers/UserContext";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { useInView } from "react-intersection-observer";

export default function Movies() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const { t } = useTranslation();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedStream, setSelectedStream] = useState<{
    url: string;
    movie: Movie;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [xtream, setXtream] = useState<XtreamAPI | null>(null);
  const { account } = useXtreamContext();
  const [search, setSearch] = useState("");
  const [allMovies, setAllMovies] = useState<Movie[]>([]);

  useEffect(() => {
    if (!account || !account.host || !account.username || !account.password)
      return;
    const xtream = new XtreamAPI(
      account.host,
      account.username,
      account.password
    );
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
          const hiddenCategories = xtream.getHiddenCategories();
          const filteredCategories = movieCategories.filter(
            (category) => !hiddenCategories.includes(category.category_id)
          );
          setCategories(
            filteredCategories.map((c: any) => ({
              ...c,
              category_id: c.category_id.toString()
            }))
          );
        }

        if (movieData) setMovies(movieData);
        if (movieData) setAllMovies(movieData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, xtream]);

  const searchHandler = (filter: string) => {
    if (filter === "") {
      setMovies(allMovies);
    } else {
      const filteredMovies = allMovies.filter((movie) =>
        movie.name.toLowerCase().includes(filter.toLowerCase())
      );
      setMovies(filteredMovies);
    }
  };

  if (!xtream) {
    return (
      <div className="h-screen w-screen   text-white p-4 flex justify-center items-center">
        <Link
          to={"/"}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {t("login")}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen  ">
      <Button
        className="md:hidden m-4"
        onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
      >
        <Menu className="mr-2 h-4 w-4" /> {t("categories")}
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

        <div className="flex w-full max-w-sm items-center space-x-2 mb-4">
          <Input
            type="text"
            placeholder={t("searchmoviesplaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            type="button"
            onClick={() => {
              setSearch("");
              searchHandler("");
            }}
          >
            {t("clear")}
          </Button>
          <Button type="button" onClick={() => searchHandler(search)}>
            {t("search")}
          </Button>
        </div>

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
  const { ref, inView } = useInView({
    threshold: 0.01
  });

  if (!inView) return <div ref={ref} />;

  return (
    <Card
      ref={ref}
      onClick={onSelect}
      style={{ borderColor: "#0a0a2e" }}
      className="cursor-pointer group relative overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg"
    >
      <AspectRatio ratio={6 / 9}>
        <div className="relative h-full w-full">
          <img
            src={movie.stream_icon ?? "/movie.webp"}
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
}: CategoryGridProps) => {
  const { t } = useTranslation();
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden "
          onClick={() => setIsCategoryMenuOpen(false)}
        />
      )}
      <div
        className={`md:block ${
          isOpen ? "block fixed inset-y-0 left-0 z-50 w-screen" : "hidden"
        }`}
      >
        <ScrollArea className="h-full w-full md:w-[200px]  ">
          <div className="flex flex-col gap-4 p-2">
            <div
              onClick={() => setIsCategoryMenuOpen(false)}
              className={`cursor-pointer p-4 rounded-lg border transition-all md:hidden `}
            >
              <h3 className="text-center text-xs font-medium sm:text-base text-white">
                {t("close")}
              </h3>
            </div>
            <Link
              to={"/home"}
              className="cursor-pointer p-4 rounded-lg border transition-all bg-card flex items-center justify-center hover:bg-accent"
            >
              <ArrowBigLeft className="mr-2 h-8 w-8" />
              <h3 className="text-center text-xs font-medium sm:text-base">
                {t("back")}
              </h3>
            </Link>
            <div
              onClick={() => onSelectCategory(null)}
              className={`cursor-pointer p-4 rounded-lg border transition-all ${
                !selectedCategory ? "bg-accent" : "bg-card hover:bg-accent/50"
              }`}
            >
              <h3 className="text-center text-xs font-medium sm:text-base">
                {t("all")}
              </h3>
            </div>
            {categories.map((category) => (
              <div
                key={category.category_id}
                onClick={() =>
                  onSelectCategory(category.category_id.toString())
                }
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
};
