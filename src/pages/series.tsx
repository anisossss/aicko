import { useEffect, useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import XtreamAPI from "@/services/xtream";
import type { Category, Episode, Series, SeriesInfo } from "@/services/xtream";
import AssetPlayer from "@/components/asset-player/asset-player";
import { InView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useXtreamContext } from "@/wrappers/UserContext";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";

export default function Series() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSeriesInfo, setSelectedSeriesInfo] = useState<SeriesInfo | null>(null);
  const [series, setSeries] = useState<Series[]>([]);
  const [allSeries, setAllSeries] = useState<Series[]>([]);

  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedStream, setSelectedStream] = useState<{
    url: string;
    episode: Episode; // Changed from `movie` to `episode`
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [xtream, setXtream] = useState<XtreamAPI | null>(null);
  const { account } = useXtreamContext();
  const [search, setSearch] = useState("");


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
        const [seriesCategories, seriesData] = await Promise.all([
          xtream.getSeriesCategories(),
          selectedCategory
            ? xtream.getSeries(Number.parseInt(selectedCategory))
            : xtream.getSeries()
        ]);

        if (seriesCategories) {
          const hiddenCategories = xtream.getHiddenCategories();
          const filteredCategories = seriesCategories.filter(
            (category) => !hiddenCategories.includes(category.category_id)
          );
          setCategories(
            filteredCategories.map((c: any) => ({
              ...c,
              category_id: c.category_id.toString()
            }))
          );
        }

        if (seriesData) setSeries(seriesData);
        if (seriesData) setAllSeries(seriesData);
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
      setSeries(allSeries);
    } else {
      const filteredSeries = allSeries.filter((serie) =>
        serie.name.toLowerCase().includes(filter.toLowerCase())
      );
      setSeries(filteredSeries);
    }
  };

  if (!xtream) {
    return (
      <div className="h-screen w-screen text-white p-4 flex justify-center items-center">
        <Link
          to={"/"}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {t("login")}
        </Link>
      </div>
    );
  }

  const handleSeriesSelect = async (seriesId: number) => {
    if (!xtream) return;
    const seriesInfo = await xtream.getSeriesInfo(seriesId);
    setSelectedSeriesInfo(seriesInfo);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
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
            placeholder={t("searchseriesplaceholder")}
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

        <SeriesModal
          seriesInfo={selectedSeriesInfo}
          onClose={() => setSelectedSeriesInfo(null)}
          onEpisodeSelect={(episode) => {
            if (!xtream) return;
            const streamUrl = xtream.getSeriesStreamUrl(episode);
            setSelectedStream({ url: streamUrl, episode }); // Updated to use `episode`
          }}
        />

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
              {series.map((series) => (
                <SeriesCard
                  key={series.series_id}
                  series={series}
                  onSelect={() => handleSeriesSelect(series.series_id)}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}

interface SeriesCardProps {
  series: {
    series_id: number;
    name: string;
    cover: string;
    genre: string;
    rating_5based: string;
  };
  onSelect: () => void;
}

const SeriesCard = ({ series, onSelect }: SeriesCardProps) => {
  const [loaded, setLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    if (loaded && series.cover) {
      const img = new Image();
      img.src = series.cover;
      img.onload = () => setImageSrc(series.cover);
      img.onerror = () => setImageSrc("/movie.webp");
    }
  }, [loaded, series.cover]);

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
                  alt={series.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/movie.webp";
                    (e.target as HTMLImageElement).style.objectFit = "cover";
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

                <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded">
                  <span className="text-sm font-bold text-yellow-400">
                    ★ {parseFloat(series.rating_5based).toFixed(1)}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="truncate text-sm md:text-base lg:text-lg font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                    {series.name}
                  </h3>
                  <p className="truncate text-xs md:text-sm text-gray-200">
                    {series.genre}
                  </p>
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
}: CategoryGridProps) => {
  const { t } = useTranslation();
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden"
          onClick={() => setIsCategoryMenuOpen(false)}
        />
      )}
      <div
        className={`md:block ${
          isOpen ? "block fixed inset-y-0 left-0 z-50 w-screen" : "hidden"
        }`}
      >
        <ScrollArea className="h-full w-full md:w-[200px]">
          <div className="flex flex-col gap-4 p-2">
            <div
              onClick={() => setIsCategoryMenuOpen(false)}
              className={`cursor-pointer p-4 rounded-lg border transition-all md:hidden`}
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

interface SeriesModalProps {
  seriesInfo: SeriesInfo | null;
  onClose: () => void;
  onEpisodeSelect: (episode: Episode) => void;
}

const SeriesModal = ({ seriesInfo, onClose, onEpisodeSelect }: SeriesModalProps) => {
  const { t } = useTranslation();

  if (!seriesInfo) return null;

  return (
    <Dialog open={!!seriesInfo} onOpenChange={onClose}>
      <DialogContent className="bg-black p-0 border-none max-w-6xl w-[90vw] rounded-none">

        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* <img
              src={seriesInfo.info.cover}
              alt={seriesInfo.info.name}
              className="w-full md:w-1/3 rounded-lg"
            /> */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">{seriesInfo.info.name}</h2>
              {/* <p className="text-gray-300">{seriesInfo.info.plot}</p> */}
              <p className="text-gray-300">{seriesInfo.info.genre}</p>
              <p className="text-gray-300">{seriesInfo.info.releaseDate}</p>
            </div>
          </div>
          <ScrollArea className="h-[60vh]">

          <div className="mt-4">
            {seriesInfo.episodes && Object.keys(seriesInfo.episodes).map((season) => (
              <div key={season} className="mb-4">
                <h3 className="text-xl font-bold text-white">season {season}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
                  {seriesInfo.episodes[season]?.map((episode) => (
                    <div
                      key={episode.id}
                      onClick={() => onEpisodeSelect(episode)}
                      className="cursor-pointer"
                    >
                      <img
                        src={episode.info.movie_image || seriesInfo.info.cover}
                        alt={episode.title}
                        className="w-full rounded-lg h-32 object-cover"
                    
                      />
                      <p className="text-white">{episode.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          </ScrollArea>
        </div>
  
      </DialogContent>
    </Dialog>
  );
};