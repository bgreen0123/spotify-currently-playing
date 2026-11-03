export interface Track {
    "id": string,
    "title": string,
    "artists": string[],
    "artist": string,
    "album": string,
    "albumArtUrl": string | null,
    "spotifyUrl": string,
    "durationMs": string,
}

export interface CurrentTrack {
    "isPlaying": boolean,
    "track": Track | null,
}
