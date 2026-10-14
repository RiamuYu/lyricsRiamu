// Spotify controls stay independent of the YouTube background, which is always muted.
window.FullscreenNowPlaying = ({ info, onExit, onSettings, onToggleLyrics, lyricsVisible, translationControl }) => {
    const React = Spicetify.React;
    const player = Spicetify.Player;
    const snapshot = () => ({
        progress: Math.max(0, player.getProgress() || 0), duration: Math.max(0, player.getDuration() || 0),
        playing: player.isPlaying(), volume: player.getVolume?.() ?? 1,
        shuffle: player.getShuffle?.() || false, repeat: player.getRepeat?.() || 0, liked: player.getHeart?.() || false
    });
    const [state, setState] = React.useState(snapshot);
    const [controlsVisible, setControlsVisible] = React.useState(false);
    const idleTimer = React.useRef(null);
    React.useEffect(() => {
        const update = () => setState(snapshot());
        const timer = setInterval(update, 500);
        player.addEventListener("onplaypause", update);
        return () => {
            clearInterval(timer);
            clearTimeout(idleTimer.current);
            player.removeEventListener("onplaypause", update);
        };
    }, []);
    const wake = () => {
        setControlsVisible(true);
        clearTimeout(idleTimer.current);
        idleTimer.current = setTimeout(() => setControlsVisible(false), 2500);
    };
    const iconPaths = {
        play: "M5 3l10 7L5 17z", pause: "M5 3h3v14H5zM12 3h3v14h-3z",
        back: "M3 3h2v14H3zM17 3L6 10l11 7z", next: "M15 3h2v14h-2zM3 3l11 7-11 7z",
        shuffle: "M2 5h3l10 10h3m-3-3 3 3-3 3M2 15h3l10-10h3m-3-3 3 3-3 3",
        repeat: "M4 6h12l-3-3m3 3-3 3M16 14H4l3 3m-3-3 3-3",
        heart: "M10 17S1 12 1 6a4 4 0 0 1 9-1 4 4 0 0 1 9 1c0 6-9 11-9 11z",
        close: "M4 4l12 12M16 4L4 16", settings: "M10 2v3m0 10v3M2 10h3m10 0h3M4 4l2 2m8 8 2 2M16 4l-2 2M6 14l-2 2M13 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
        lyrics: "M3 4h14M3 10h14M3 16h10"
    };
    const button = (icon, label, action, active = false, disabled = false) => React.createElement("button", {
        type: "button", className: `lp-player-button${active ? " is-active" : ""}`, title: label,
        "aria-label": label, "aria-pressed": active, disabled, onClick: () => { action(); setState(snapshot()); wake(); }
    }, React.createElement("svg", { viewBox: "0 0 20 20", width: 24, height: 24, "aria-hidden": true },
        React.createElement("path", { d: iconPaths[icon], fill: ["play", "pause", "back", "next"].includes(icon) ? "currentColor" : "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" })));
    const label = key => getText(`fullscreen.${key}`);
    return React.createElement("section", { className: `lp-now-playing${controlsVisible ? " controls-visible" : ""}`, onPointerMove: wake, "aria-label": label("nowPlaying") },
        React.createElement("div", { className: "lp-cover-frame" },
            info?.image && React.createElement("img", { className: "lp-cover", src: info.image, alt: info.album || info.title || "", draggable: false }),
            React.createElement("div", { className: "lp-cover-tools" },
                button("lyrics", label("lyrics"), onToggleLyrics, lyricsVisible), translationControl,
                button("heart", label("favorite"), () => player.toggleHeart(), state.liked, !player.toggleHeart),
                button("settings", label("settings"), onSettings), button("close", label("exit"), onExit)),
            React.createElement("div", { className: "lp-cover-playback" },
                button("shuffle", label("shuffle"), () => player.toggleShuffle(), state.shuffle, !player.toggleShuffle),
                button("back", label("previous"), () => player.back()),
                button(state.playing ? "pause" : "play", state.playing ? label("pause") : label("play"), () => player.togglePlay()),
                button("next", label("next"), () => player.next()),
                button("repeat", `${label("repeat")} · ${state.repeat}`, () => player.toggleRepeat(), state.repeat > 0, !player.toggleRepeat)),
            React.createElement("input", { className: "lp-cover-volume", type: "range", min: 0, max: 1, step: 0.01, value: state.volume,
                "aria-label": label("volume"), title: label("volume"), disabled: !player.setVolume,
                onChange: event => { const volume = Number(event.target.value); player.setVolume(volume); setState(prev => ({ ...prev, volume })); } })),
        React.createElement("div", { className: "lp-track-progress" },
            React.createElement("span", null, player.formatTime(state.progress)),
            React.createElement("input", { type: "range", min: 0, max: state.duration || 1, value: Math.min(state.progress, state.duration),
                "aria-label": label("seek"), disabled: !state.duration, step: 1000,
                style: { "--progress": `${state.duration ? state.progress / state.duration * 100 : 0}%` },
                onChange: event => { const progress = Number(event.target.value); player.seek(progress); setState(prev => ({ ...prev, progress })); } }),
            React.createElement("span", null, player.formatTime(state.duration))),
        React.createElement("h1", { className: "lp-track-title", dir: "auto" }, info?.title || label("nothingPlaying")),
        React.createElement("p", { className: "lp-track-artist", dir: "auto" }, info?.artist || "")
    );
};
