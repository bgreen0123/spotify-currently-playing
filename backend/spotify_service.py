import os

import spotipy
from dotenv import load_dotenv
from spotipy.oauth2 import SpotifyPKCE

load_dotenv()

CLIENT_ID = os.getenv("SPOTIPY_CLIENT_ID")
REDIRECT_URI = os.getenv("SPOTIPY_REDIRECT_URI")
SCOPE = "user-read-currently-playing"

if not CLIENT_ID:
    raise ValueError("Client Id not set")

auth_manager = SpotifyPKCE(
    client_id=CLIENT_ID,
    redirect_uri=REDIRECT_URI,
    scope=SCOPE,
    cache_path=".cache-spotify-display",
    open_browser=False,
)
sp = spotipy.Spotify(auth_manager=auth_manager)


def get_current_playing():
    current_track = sp.current_user_playing_track()

    if current_track is None or current_track.get("item") is None:
        return {"isPlaying": False, "track": None}

    track = current_track["item"]
    artists = [artist["name"] for artist in track["artists"]]
    album_art = track["album"]["images"][0]["url"]

    return {
        "isPlaying": current_track["is_playing"],
        "progress_ms": current_track["progress_ms"],
        "track": {
            "id": track["id"],
            "title": track["name"],
            "artists": artists,
            "artist": ", ".join(artists),
            "album": track["album"]["name"],
            "albumArtUrl": album_art,
            "spotifyUrl": track["external_urls"]["spotify"],
            "durationMs": track["duration_ms"],
        },
    }
