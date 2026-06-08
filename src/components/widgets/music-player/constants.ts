import type { Song } from "./types";

export const STORAGE_KEY_VOLUME = "music-player-volume";

export const DEFAULT_VOLUME = 0.7;

export const LOCAL_PLAYLIST: Song[] = [
  {
    id: 1,
    title: "BOW AND ARROW",
    artist: "米津玄师",
    cover: "assets/music/cover/bowandarrow.webp",
    url: "assets/music/url/bowandarrow.mp3",
    duration: 0,
  },
  {
    id: 2,
    title: "限りなく灰色へ",
    artist: "25時、ナイトコードで",
    cover: "assets/music/cover/xiandinghui.webp",
    url: "assets/music/url/xiandinghui.mp3",
    duration: 240,
  },
  {
    id: 3,
    title: "眩耀夜行",
    artist: "ス리즈ブーケ",
    cover: "assets/music/cover/xryx.webp",
    url: "assets/music/url/xryx.mp3",
    duration: 180,
  },
  {
    id: 4,
    title: "25時の情熱",
    artist: "25時、ナイトコードで",
    cover: "assets/music/cover/qingre.webp",
    url: "assets/music/url/qingre.mp3",
    duration: 200,
  },
  {
    id: 5,
    title: "下等马",
    artist: "ChiliChili",
    cover: "assets/music/cover/poorhorse.webp",
    url: "assets/music/url/poorhorse.mp3",
    duration: 200,
  },
];

export const DEFAULT_SONG: Song = {
  title: "Sample Song",
  artist: "Sample Artist",
  cover: "/favicon/favicon.ico",
  url: "",
  duration: 0,
  id: 0,
};

export const DEFAULT_METING_API =
  "https://www.bilibili.uno/api?server=:server&type=:type&id=:id&auth=:auth&r=:r";
export const DEFAULT_METING_ID = "14164869977";
export const DEFAULT_METING_SERVER = "netease";
export const DEFAULT_METING_TYPE = "playlist";

export const ERROR_DISPLAY_DURATION = 3000;
export const SKIP_ERROR_DELAY = 1000;
