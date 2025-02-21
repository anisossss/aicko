import { useEffect, useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import XtreamAPI from "@/services/xtream";
import type { LiveStream, Category, ShortEPG } from "@/services/xtream";
import Player from "@/components/player/player";
import { InView } from "react-intersection-observer";
import { decodeBase64 } from "@/utils/decodeBase64";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useXtreamContext } from "@/wrappers/UserContext";
import { useTranslation } from "react-i18next";

export default function Tv() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<{
    url: string;
    streamId: number;
  } | null>(null);
  const [epgData, setEpgData] = useState<ShortEPG[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [xtream, setXtream] = useState<XtreamAPI | null>(null);
  const { account } = useXtreamContext();
  const { t } = useTranslation();

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
        const [liveCategories, liveStreams] = await Promise.all([
          xtream.getLiveCategories(),
          selectedCategory
            ? xtream.getLiveStreamsByCategory(Number.parseInt(selectedCategory))
            : xtream.getLiveStreams()
        ]);

        if (liveCategories) {
          const hiddenCategories = xtream.getHiddenCategories();
          const filteredCategories = liveCategories.filter(
            (category) => !hiddenCategories.includes(category.category_id)
          );
          setCategories(
            filteredCategories.map((c: any) => ({
              ...c,
              category_id: c.category_id.toString()
            }))
          );
        }

        if (liveStreams) setStreams(liveStreams);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, xtream]);

  useEffect(() => {
    if (!xtream) return;
    const fetchEpg = async () => {
      if (selectedChannel) {
        const epg = await xtream.getShortEPG(selectedChannel.streamId);
        setEpgData(epg);
      }
    };

    fetchEpg();
  }, [selectedChannel]);

  if (!xtream) {
    return (
      <div className="h-screen w-screen   text-white p-4 flex flex-col">
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
    <div className="flex flex-col md:flex-row h-screen">
      <Button
        className="md:hidden m-4"
        onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
      >
        <Menu className="mr-2 h-4 w-4" /> {t("categories")}
      </Button>

      <CategoryGrid
        setIsCategoryMenuOpen={setIsCategoryMenuOpen}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(category) => {
          setSelectedCategory(category);
          setIsCategoryMenuOpen(false);
        }}
        isOpen={isCategoryMenuOpen}
      />

      <div className="flex-1 p-4 overflow-hidden">
        <Dialog
          open={!!selectedChannel}
          onOpenChange={() => setSelectedChannel(null)}
        >
          <DialogContent className="bg-black p-0 border-none max-w-6xl w-[90vw] rounded-none">
            <DialogTitle className="px-4 pt-4 text-white">
              <EPGInfo epgData={epgData} />
            </DialogTitle>
            {selectedChannel && <Player src={selectedChannel.url} />}
          </DialogContent>
        </Dialog>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:gap-5 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <AspectRatio ratio={16 / 9}>
                  <div className="h-full w-full bg-muted" />
                </AspectRatio>
              </Card>
            ))}
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:gap-5 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {streams.map((channel) => (
                <LazyCard
                  key={channel.stream_id}
                  channel={channel}
                  onSelect={() =>
                    setSelectedChannel({
                      url: xtream.getLiveStreamUrl(channel.stream_id),
                      streamId: channel.stream_id
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

interface LazyCardProps {
  channel: {
    stream_icon: string;
    name: string;
  };
  onSelect: () => void;
}

const LazyCard = ({ channel, onSelect }: LazyCardProps) => {
  const [loaded, setLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    if (loaded && channel.stream_icon) {
      const img = new Image();
      img.src = channel.stream_icon;
      img.onload = () => setImageSrc(channel.stream_icon);
      img.onerror = () => setImageSrc("/tv.jpg");
    }
  }, [loaded, channel.stream_icon]);

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
            style={{
              borderColor: "#0a0a2e"
            }}
            className="cursor-pointer group relative overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg"
          >
            <AspectRatio ratio={16 / 9}>
              <div className="relative h-full w-full">
                <img
                  src={imageSrc ?? "/tv.jpg"}
                  alt={channel.name}
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/tv.jpg";
                    (e.target as HTMLImageElement).style.objectFit = "cover";
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="truncate text-sm md:text-base lg:text-lg font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                    {channel.name}
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

const EPGInfo = ({ epgData }: { epgData: ShortEPG[] | null }) => {
  if (!epgData || epgData.length === 0) {
    return <h3 className="text-lg font-bold">Loading EPG...</h3>;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-bold">
        Now Playing: {decodeBase64(epgData[0].title)}
      </h3>
      <p className="text-sm text-gray-300">
        {new Date(
          Number.parseInt(epgData[0].start_timestamp) * 1000
        ).toLocaleTimeString()}{" "}
        -{" "}
        {new Date(
          Number.parseInt(epgData[0].stop_timestamp) * 1000
        ).toLocaleTimeString()}
      </p>
      {/* <p className="text-sm text-gray-300">
        {decodeBase64(epgData[0].description)}
      </p> */}
      {/* {epgData.length > 1 && (
        <div className="mt-4">4
4
          <h4 className="font-semibold">Up Next:</h4>
          <ul className="text-sm text-gray-300">
            {epgData.slice(1).map((epg, index) => (
              <li key={index}>
                {decodeBase64(epg.title)} (
                {new Date(
                  Number.parseInt(epg.start_timestamp) * 1000
                ).toLocaleTimeString()}
                )
              </li>
            ))}
          </ul>
        </div>
      )} */}
    </div>
  );
};
