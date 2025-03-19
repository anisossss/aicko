import axios from "axios";

class XtreamAPI {
  proxy = "http://localhost:3500";
  private readonly host: string;
  private readonly username: string;
  private readonly password: string;

  constructor(host: string, username: string, password: string) {
    const cleanedHost = host.replace(/^https?:\/\//, "").replace(/\/+$/, "");
    this.host = `${this.proxy}/?url=http://${encodeURIComponent(cleanedHost)}`;
    this.username = username;
    this.password = password;

    axios
      .post(this.proxy + "/playlist", {
        host: encodeURIComponent(cleanedHost),
        username: this.username,
        password: this.password
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  private async fetchData<T>(partialUrl: string): Promise<T | null> {
    try {
      const response = await axios.get<T>(encodeURI(partialUrl));
      return response.data;
    } catch (error) {
      console.error("Request failed for URL:", partialUrl, error);
      return null;
    }
  }

  async getLiveStreams(): Promise<LiveStream[] | null> {
    const url = `${this.host}/player_api.php&username=${this.username}&password=${this.password}&action=get_live_streams`;
    return this.fetchData<LiveStream[]>(url);
  }

  async getLiveStreamsByCategory(
    categoryId: number
  ): Promise<LiveStream[] | null> {
    const url = `${this.host}/player_api.php&username=${this.username}&password=${this.password}&action=get_live_streams&category_id=${categoryId}`;
    return this.fetchData<LiveStream[]>(url);
  }

  async getLiveCategories(): Promise<Category[] | null> {
    const url = `${this.host}/player_api.php&username=${this.username}&password=${this.password}&action=get_live_categories`;
    return this.fetchData<Category[]>(url);
  }

  async getMovies(categoryId?: number): Promise<Movie[] | null> {
    const base = `${this.host}/player_api.php&username=${this.username}&password=${this.password}&action=get_vod_streams`;
    const url = categoryId ? `${base}&category_id=${categoryId}` : base;
    return this.fetchData<Movie[]>(url);
  }

  async getMovieCategories(): Promise<Category[] | null> {
    const url = `${this.host}/player_api.php&username=${this.username}&password=${this.password}&action=get_vod_categories`;
    return this.fetchData<Category[]>(url);
  }

  async getSeries(categoryId?: number): Promise<Series[] | null> {
    const base = `${this.host}/player_api.php&username=${this.username}&password=${this.password}&action=get_series`;
    const url = categoryId ? `${base}&category_id=${categoryId}` : base;
    const series = await this.fetchData<Series[]>(url);
    return series;
  }

  async getSeriesInfo(seriesId: number): Promise<SeriesInfo | null> {
    const url = `${this.host}/player_api.php&username=${this.username}&password=${this.password}&action=get_series_info&series_id=${seriesId}`;

    return await this.fetchData<SeriesInfo>(url);
  }

  async getSeriesCategories(): Promise<Category[] | null> {
    const url = `${this.host}/player_api.php&username=${this.username}&password=${this.password}&action=get_series_categories`;
    return this.fetchData<Category[]>(url);
  }

  getLiveStreamUrl(streamId: number, extension: string = "ts"): string {
    return `${this.host}/live/${this.username}/${this.password}/${streamId}.${extension}`;
  }

  getMovieStreamUrl(movie: Movie): string {
    return `${this.host}/movie/${this.username}/${this.password}/${movie.stream_id}.${movie.container_extension}`;
  }

  getSeriesStreamUrl(episode: Episode): string {
    return `${this.host}/series/${this.username}/${this.password}/${episode.id}.${episode.container_extension}`;
  }

  async getFullEPG(): Promise<string | null> {
    try {
      const url = `${this.host}/xmltv.php&username=${this.username}&password=${this.password}`;
      const response = await fetch(url);
      return await response.text();
    } catch (error) {
      console.error("Error fetching EPG:", error);
      return null;
    }
  }

  async getShortEPG(
    streamId: number,
    limit: number = 4
  ): Promise<ShortEPG[] | null> {
    try {
      const url = `${this.host}/player_api.php&username=${this.username}&password=${this.password}&action=get_short_epg&stream_id=${streamId}&limit=${limit}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data.epg_listings || [];
    } catch (error) {
      console.error("Error fetching EPG:", error);
      return null;
    }
  }

  checkifseriehasavi = async (serieId: number) => {
    const data = await this.getSeriesInfo(serieId);
    const episodes = data?.episodes;
    for (const season in episodes) {
      for (const episode of episodes[season]) {
        if (episode.container_extension === "avi") {
          return { seasons: data?.seasons, info: data?.info, episodes: [] };
        }
      }
    }
    return data;
  };
  getHiddenCategories = () => {
    return JSON.parse(localStorage.getItem("hiddenCategories") ?? "[]");
  };
}

// Type Definitions
export interface Category {
  category_id: number;
  category_name: string;
  parent_id?: number;
}

export interface LiveStream {
  num: number;
  name: string;
  stream_type: "live";
  stream_id: number;
  stream_icon: string;
  epg_channel_id: string | null;
  added: string;
  category_id: string;
  category_ids: number[];
  custom_sid: string | null;
  tv_archive: number;
  direct_source: string;
  tv_archive_duration: string;
}

export interface Movie {
  num: number;
  name: string;
  stream_type: "movie";
  stream_id: number;
  stream_icon: string;
  rating: string;
  rating_5based: number;
  tmdb: string;
  trailer: string;
  added: string;
  is_adult: number;
  category_id: string;
  category_ids: number[];
  container_extension: string;
  custom_sid: string | null;
  direct_source: string;
}

export interface Series {
  num: number;
  name: string;
  series_id: number;
  cover: string;
  plot: string;
  cast: string;
  director: string;
  genre: string;
  releaseDate: string;
  last_modified: string;
  rating: string;
  rating_5based: string;
  backdrop_path: string[];
  youtube_trailer: string;
  tmdb: string;
  episode_run_time: string;
  category_id: string;
  category_ids: number[];
}

export interface SeriesInfo {
  info: {
    name: string;
    cover: string;
    plot: string;
    cast: string;
    director: string;
    genre: string;
    releaseDate: string;
    last_modified: string;
    rating: string;
    rating_5based: string;
    backdrop_path: string[];
    tmdb: string;
    youtube_trailer: string;
    episode_run_time: string;
    category_id: string;
    category_ids: number[];
  };
  seasons: Season[];
  episodes: Record<string, Episode[]>;
}

export interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  season_number: number;
  cover: string;
  cover_big: string;
}

export interface Episode {
  id: string;
  episode_num: number;
  title: string;
  container_extension: string;
  info: {
    movie_image: string;
    plot: string | null;
    releasedate: string | null;
    rating: string | null;
    name: string | null;
    duration_secs: number;
    duration: string;
    video: VideoInfo;
    audio: AudioInfo;
    bitrate: number;
  };
  custom_sid: string;
  added: string;
  season: number;
  direct_source: string;
}

export interface VideoInfo {
  index: number;
  codec_name: string;
  width: number;
  height: number;
  duration: string;
  bit_rate: string;
}

export interface AudioInfo {
  index: number;
  codec_name: string;
  sample_rate: string;
  channels: number;
  bit_rate: string;
}

export interface ShortEPG {
  id: string;
  epg_id: string;
  title: string;
  lang: string;
  start: string;
  end: string;
  description: string;
  channel_id: string;
  start_timestamp: string;
  stop_timestamp: string;
  stream_id: string;
}

export default XtreamAPI;
