import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useXtreamContext } from "@/wrappers/UserContext";
import XtreamAPI, { Category } from "@/services/xtream";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const [xtream, setXtream] = useState<XtreamAPI | null>(null);
  const [tvCategories, setTvCategories] = useState<Category[]>([]);
  const [moviesCategories, setMoviesCategories] = useState<Category[]>([]);
  const [seriesCategories, setSeriesCategories] = useState<Category[]>([]);
  const { t } = useTranslation();

  const { account } = useXtreamContext();

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

    xtream.getLiveCategories().then((categories) => {
      setTvCategories(categories || []);
    });
    xtream.getMovieCategories().then((categories) => {
      setMoviesCategories(categories || []);
    });
    xtream.getSeriesCategories().then((categories) => {
      setSeriesCategories(categories || []);
    });
  }, [xtream]);

  const showCategory = (categoryId: any) => {
    let hidden = JSON.parse(localStorage.getItem("hiddenCategories") ?? "[]");
    hidden = hidden.filter((item: any) => item !== categoryId);
    localStorage.setItem("hiddenCategories", JSON.stringify(hidden));
  };
  const hideCategory = (categoryId: any) => {
    let hidden = JSON.parse(localStorage.getItem("hiddenCategories") ?? "[]");
    hidden.push(categoryId);
    localStorage.setItem("hiddenCategories", JSON.stringify(hidden));
  };

  const verifyCategory = (categoryId: any) => {
    let hidden = JSON.parse(localStorage.getItem("hiddenCategories") ?? "[]");
    return !hidden.includes(categoryId);
  };

  if (!xtream) {
    return (
      <div className="h-screen w-screen  text-white p-4 flex flex-col">
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
    <div className="container mx-auto text-white">
      <ScrollArea className="h-screen">
        <div className="flex justify-between items-center m-6">
          <Link
            to={"/home"}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {t("home")}
          </Link>
          <h1 className="text-2xl font-bold mb-4">
            {t("playlistname")} : {account?.playlistName}
          </h1>
        </div>
        <hr className="my-4" />
        <h2 className="text-lg font-semibold mb-2">{t("live")} {t("categories")}</h2>
        <ul>
          {tvCategories.map((item) => (
            <li key={item.category_id}>
              <div
                className="flex justify-between items-center"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  borderRadius: 9,
                  border: "1px solid white",
                  margin: "5px 10px 5px 5px",
                  padding: "5px"
                }}
              >
                <span>{item.category_name}</span>

                <Button
                  variant="outline"
                  className="text-blue-900 w-40"
                  size="default"
                  onClick={() => {
                    if (verifyCategory(item.category_id)) {
                      hideCategory(item.category_id);
                    } else {
                      showCategory(item.category_id);
                    }
                    setTvCategories([...tvCategories]);
                  }}
                >
                  {verifyCategory(item.category_id) ? t("hide") : t("show")}
                </Button>
              </div>
            </li>
          ))}
        </ul>
        <hr className="my-4" />

        <h2 className="text-lg font-semibold mb-2">{t("movies")} {t("categories")}</h2>
        <ul>
          {moviesCategories.map((item) => (
            <li key={item.category_id}>
              <div
                className="flex justify-between items-center"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  borderRadius: 9,
                  border: "1px solid white",
                  margin: "5px 10px 5px 5px",
                  padding: "5px"
                }}
              >
                <span>{item.category_name}</span>

                <Button
                  variant="outline"
                  className="text-blue-900 w-40"
                  size="default"
                  onClick={() => {
                    if (verifyCategory(item.category_id)) {
                      hideCategory(item.category_id);
                    } else {
                      showCategory(item.category_id);
                    }
                    setMoviesCategories([...moviesCategories]);
                  }}
                >
                  {verifyCategory(item.category_id) ?  t("hide") : t("show")}
                </Button>
              </div>
            </li>
          ))}
        </ul>
        <hr className="my-4" />

        <h2 className="text-lg font-semibold mb-2">{t("series")} {t("categories")}</h2>
        <ul>
          {seriesCategories.map((item) => (
            <li key={item.category_id}>
              <div
                className="flex justify-between items-center"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  borderRadius: 9,
                  border: "1px solid white",
                  margin: "5px 10px 5px 5px",
                  padding: "5px"
                }}
              >
                <span>{item.category_name}</span>

                <Button
                  variant="outline"
                  className="text-blue-900 w-40"
                  size="default"
                  onClick={() => {
                    if (verifyCategory(item.category_id)) {
                      hideCategory(item.category_id);
                    } else {
                      showCategory(item.category_id);
                    }
                    setSeriesCategories([...seriesCategories]);
                  }}
                >
                  {verifyCategory(item.category_id) ?  t("hide") : t("show")}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
};

export default Profile;
