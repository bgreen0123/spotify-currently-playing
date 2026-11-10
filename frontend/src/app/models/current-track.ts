export interface Track {
  id: string;
  title: string;
  artists: string[];
  artist: string;
  album: string;
  albumArtUrl: string | null;
  spotifyUrl: string;
  durationMs: number;
}

export interface CurrentTrack {
  isPlaying: boolean;
  progress_ms: number | null;
  track: Track | null;
}
