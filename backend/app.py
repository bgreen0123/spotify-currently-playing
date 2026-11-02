from flask import Flask, jsonify
from spotify_service import get_current_playing

app = Flask(__name__.split(".")[0])


@app.route("/v1/api/current-track", methods=["GET"])
def current_track():
    try:
        currentTrack = get_current_playing()
        return jsonify(currentTrack)
    except Exception as error:
        app.logger.exception(
            "Error when trying to get the currently playing track data"
        )

        return jsonify(
            {
                "error": "Unable to get track data",
            }
        ), 500


@app.route("/v1/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "OK"}), 200


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
