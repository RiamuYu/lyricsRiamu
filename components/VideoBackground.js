// VideoBackground.js - React-managed YouTube Video Background with Sync
// Every mount creates a clean player instance; unmount destroys it to release resources (CPU/RAM).
// This prevents browser iframe reloads (which trigger play overlay flashes) when changing tabs.

const VideoBackground = (() => {
    let ytApiLoaded = false;
    let ytApiLoading = false;

    function ensureYTApi() {
        if (ytApiLoaded || ytApiLoading) return;
        if (window.YT && window.YT.Player) {
            ytApiLoaded = true;
            return;
        }
        ytApiLoading = true;
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const prev = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
            ytApiLoaded = true;
            ytApiLoading = false;
            if (typeof prev === "function") prev();
        };
        document.head.appendChild(tag);
    }

    const Component = ({ trackUri, brightness, blurAmount, scale, fullscreen, videoInfo, albumImage, loopVideo = false }) => {
        const { useState, useEffect, useRef } = Spicetify.React;
        const react = Spicetify.React;

        const [isPlayerReady, setIsPlayerReady] = useState(false);
        const [isPlaying, setIsPlaying] = useState(Spicetify.Player.isPlaying());
        const [isAdPlaying, setIsAdPlaying] = useState(false);
        const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
        const [isUIFlashing, setIsUIFlashing] = useState(false);
        const [isYTReadyToRender, setIsYTReadyToRender] = useState(false);
        const [hasEnded, setHasEnded] = useState(false);
        const [adFailed, setAdFailed] = useState(false);
        const [notice, setNotice] = useState("");
        const noticeTimerRef = useRef(null);
        const adSessionRef = useRef(null);
        const endedRef = useRef(false);
        const loopRef = useRef(loopVideo);
        loopRef.current = loopVideo;

        const playerRef = useRef(null);
        const playerDivRef = useRef(null);
        const currentVideoIdRef = useRef(null);
        const uiFlashTimeoutRef = useRef(null);
        const lastSeekAttemptRef = useRef({ time: 0, attempts: 0 });
        const lastSeekTimeRef = useRef(0);
        const isMountedRef = useRef(true);
        const bypassAdAttemptsRef = useRef(0);
        const isRecreatingRef = useRef(false);

        const brightnessValue = Math.min(Math.max(Number(brightness) || 50, 0), 100);
        const brightnessRatio = brightnessValue / 100;
        const blurValue = Math.min(Math.max(Number(blurAmount) || 0, 0), 80);

        const notify = (message, failed = false) => {
            setNotice(message);
            clearTimeout(noticeTimerRef.current);
            const seconds = Number(CONFIG.visual["video-ad-notice-seconds"] ?? 7);
            if (!failed && seconds === 0) { setNotice(""); return; }
            noticeTimerRef.current = setTimeout(() => {
                if (isMountedRef.current) setNotice("");
            }, (failed ? 10 : Math.min(10, Math.max(5, seconds))) * 1000);
        };

        const handleVideoEnd = (player) => {
            if (loopRef.current) {
                player.seekTo(0);
                if (Spicetify.Player.isPlaying()) player.playVideo();
            } else {
                endedRef.current = true;
                setHasEnded(true);
                player.pauseVideo?.();
            }
        };

        useEffect(() => {
            isMountedRef.current = true;
            ensureYTApi();
            return () => {
                isMountedRef.current = false;
                if (uiFlashTimeoutRef.current) clearTimeout(uiFlashTimeoutRef.current);
                clearTimeout(noticeTimerRef.current);
                if (playerRef.current) {
                    try { playerRef.current.destroy(); } catch (_) {}
                    playerRef.current = null;
                }
            };
        }, []);

        const checkPlayerIsAd = (player, state) => {
            if (!player) return false;
            try {
                if (state !== undefined && [105, 106, 107, 108, 109, 110, 111].includes(state)) return true;
                if (typeof player.getAdState === "function" && player.getAdState() === 1) return true;

                const videoData = typeof player.getVideoData === "function" ? player.getVideoData() : null;
                if (videoData?.isAd) return true;
            } catch (_) {}
            return false;
        };

        const reloadStuckAd = () => {
            if (!isMountedRef.current || isRecreatingRef.current) return;
            if (bypassAdAttemptsRef.current >= 2) {
                if (!adSessionRef.current?.failed) {
                    if (adSessionRef.current) adSessionRef.current.failed = true;
                    setAdFailed(true);
                    notify(getText("notifications.videoAdFailed"), true);
                }
                return;
            }

            isRecreatingRef.current = true;
            bypassAdAttemptsRef.current += 1;
            console.log(`[Lyrics+] Stuck ad: reloading video (${bypassAdAttemptsRef.current}/2).`);

            if (playerRef.current) {
                try { playerRef.current.destroy(); } catch (_) {}
                playerRef.current = null;
            }

            setIsPlayerReady(false);

            // Changing readiness recreates the player through the existing effect.
            setTimeout(() => { isRecreatingRef.current = false; }, 1200);
        };

        const observeAd = (active, player) => {
            if (!active) {
                if (adSessionRef.current) {
                    adSessionRef.current = null;
                    bypassAdAttemptsRef.current = 0;
                    setIsAdPlaying(false);
                    setAdFailed(false);
                    setNotice("");
                }
                return;
            }
            player?.mute?.();
            const now = Date.now();
            const time = Number(player?.getCurrentTime?.());
            if (!adSessionRef.current) {
                adSessionRef.current = { lastTime: time, lastAdvance: now, loops: 0, failed: false };
                setIsAdPlaying(true);
                if (CONFIG.visual["video-ad-album-art"] !== false) notify(getText("notifications.videoAdCover"));
            }
            const session = adSessionRef.current;
            if (session.failed || isRecreatingRef.current) return;
            if (!Spicetify.Player.isPlaying()) { session.lastAdvance = now; return; }
            if (Number.isFinite(time) && time > session.lastTime + 0.1) session.lastAdvance = now;
            if (Number.isFinite(time) && time < session.lastTime - 2) session.loops++;
            session.lastTime = time;
            const stallMs = Math.max(30, Number(CONFIG.visual["video-ad-stall-seconds"]) || 45) * 1000;
            if (now - session.lastAdvance >= stallMs || session.loops >= 3) {
                session.lastAdvance = now;
                session.loops = 0;
                reloadStuckAd();
            }
        };

        // Monitor Spotify playback state
        useEffect(() => {
            const update = () => {
                const spotifyPlaying = Spicetify.Player.isPlaying();
                setIsPlaying(spotifyPlaying);
                if (playerRef.current && isPlayerReady) {
                    if (spotifyPlaying) {
                        try { playerRef.current.playVideo(); } catch (_) {}
                    }
                    setTimeout(() => window.dispatchEvent(new CustomEvent("lyricsPlusSyncRequest")), 50);
                }
            };
            Spicetify.Player.addEventListener("onplaypause", update);
            return () => Spicetify.Player.removeEventListener("onplaypause", update);
        }, [isPlayerReady]);

        // Load or switch video when videoInfo changes
        useEffect(() => {
            if (!videoInfo || !videoInfo.video_id) {
                setIsPlayerReady(false);
                setIsYTReadyToRender(false);
                setHasStartedPlaying(false);
                currentVideoIdRef.current = null;
                return;
            }

            const targetVideoId = videoInfo.video_id;
            if (currentVideoIdRef.current !== targetVideoId) {
                endedRef.current = false;
                setHasEnded(false);
                adSessionRef.current = null;
                setIsAdPlaying(false);
                setAdFailed(false);
                bypassAdAttemptsRef.current = 0;
            }

            // Fast Path: Reuse existing player iframe with loadVideoById (10x faster, no black flash)
            if (playerRef.current && typeof playerRef.current.loadVideoById === "function" && isPlayerReady) {
                if (currentVideoIdRef.current !== targetVideoId) {
                    currentVideoIdRef.current = targetVideoId;
                    setHasStartedPlaying(false);
                    setIsYTReadyToRender(false);
                    setIsAdPlaying(false);
                    if (playerRef.current) {
                        playerRef.current._adBypassAttempts = 0;
                        try {
                            if (typeof playerRef.current.setPlaybackRate === "function") {
                                playerRef.current.setPlaybackRate(1);
                            }
                        } catch (_) {}
                    }
                    try {
                        const spotifyTime = (Spicetify.Player.getProgress() || 0) / 1000;
                        const syncOffset = videoInfo.sync_offset || 0;
                        const startSecs = Math.max(1, Math.floor(spotifyTime + syncOffset));
                        playerRef.current.loadVideoById({
                            videoId: targetVideoId,
                            startSeconds: startSecs
                        });
                        playerRef.current.mute();
                        if (Spicetify.Player.isPlaying()) {
                            playerRef.current.playVideo();
                        }
                    } catch (_) {}
                }
                return;
            }

            currentVideoIdRef.current = targetVideoId;
            setIsPlayerReady(false);
            setHasStartedPlaying(false);
            setIsYTReadyToRender(false);
            if (!adSessionRef.current) setIsAdPlaying(false);

            if (playerRef.current) {
                try { playerRef.current.destroy(); } catch (_) {}
                playerRef.current = null;
            }

            const tryCreate = (startOverride) => {
                if (!window.YT || !window.YT.Player) {
                    setTimeout(() => tryCreate(startOverride), 100);
                    return;
                }
                if (!isMountedRef.current) return;

                const playerDiv = playerDivRef.current;
                if (!playerDiv) return;

                const activeVideoId = currentVideoIdRef.current || targetVideoId;
                if (!activeVideoId) return;

                playerDiv.innerHTML = "";
                const ytTarget = document.createElement("div");
                playerDiv.appendChild(ytTarget);

                const spotifyTime = (Spicetify.Player.getProgress() || 0) / 1000;
                const syncOffset = videoInfo.sync_offset || 0;
                const initialStart = typeof startOverride === "number"
                    ? startOverride
                    : Math.max(1, Math.floor(spotifyTime + syncOffset));

                playerRef.current = new window.YT.Player(ytTarget, {
                    height: "100%",
                    width: "100%",
                    videoId: activeVideoId,
                    host: CONFIG?.visual?.["video-host"] ? `https://${CONFIG.visual["video-host"]}` : "https://www.youtube.com",
                    playerVars: {
                        autoplay: 1,
                        controls: 0,
                        disablekb: 1,
                        enablejsapi: 1,
                        fs: 0,
                        rel: 0,
                        iv_load_policy: 3,
                        modestbranding: 1,
                        mute: 1,
                        playsinline: 1,
                        cc_load_policy: 0,
                        cc_lang_pref: "none",
                        hl: "en",
                        origin: window.location.origin || "https://xpui.app.spotify.com",
                        start: Math.max(1, Math.floor(initialStart)),
                    },
                    events: {
                        onReady: (event) => {
                            if (!isMountedRef.current) return;
                            setIsPlayerReady(true);
                            event.target.mute();

                            try {
                                if (typeof event.target.getIframe === "function") {
                                    const iframe = event.target.getIframe();
                                    if (iframe) {
                                        iframe.style.pointerEvents = "none";
                                        iframe.tabIndex = -1;
                                        iframe.setAttribute("aria-hidden", "true");
                                    }
                                }
                            } catch (_) {}

                            try {
                                if (typeof event.target.setOption === "function") {
                                    event.target.setOption("captions", "track", {});
                                    event.target.setOption("cc", "track", {});
                                }
                                if (typeof event.target.unloadModule === "function") {
                                    event.target.unloadModule("captions");
                                    event.target.unloadModule("cc");
                                }
                            } catch (_) {}

                            if (Spicetify.Player.isPlaying()) {
                                event.target.playVideo();
                            }
                        },
                        onStateChange: (event) => {
                            if (!isMountedRef.current) return;
                            const state = event.data;
                            const player = event.target;

                            const isAd = checkPlayerIsAd(player, state);

                            player.mute?.();
                            if (isAd) {
                                observeAd(true, player);
                                return;
                            }
                            if ((state === 1 || state === 3) && player.getVideoData?.().video_id === targetVideoId) observeAd(false, player);
                            try {
                                if (typeof player.getPlaybackRate === "function" && player.getPlaybackRate() > 1) {
                                    player.setPlaybackRate(1);
                                }
                            } catch (_) {}

                            if (state === 2 && Spicetify.Player.isPlaying()) {
                                setIsUIFlashing(true);
                                if (uiFlashTimeoutRef.current) clearTimeout(uiFlashTimeoutRef.current);
                            }

                            if (state === 1 || state === 3) {
                                if (uiFlashTimeoutRef.current) clearTimeout(uiFlashTimeoutRef.current);
                                uiFlashTimeoutRef.current = setTimeout(() => setIsUIFlashing(false), 300);
                                setHasStartedPlaying(true);
                                setIsYTReadyToRender(true);

                                try {
                                    if (typeof player.setOption === "function") {
                                        player.setOption("captions", "track", {});
                                        player.setOption("cc", "track", {});
                                    }
                                    if (typeof player.unloadModule === "function") {
                                        player.unloadModule("captions");
                                        player.unloadModule("cc");
                                    }
                                } catch (_) {}
                            }

                            if (state === 0) {
                                handleVideoEnd(player);
                            }
                        },
                        onError: async (event) => {
                            if (!isMountedRef.current) return;
                            const errorCode = event.data;
                            console.error("[Lyrics+] YouTube Player Error:", errorCode);
                            if ([2, 5, 100, 101, 150].includes(errorCode) && videoInfo && videoInfo.video_id) {
                                const brokenId = videoInfo.video_id;
                                console.warn(`[Lyrics+] Video ${brokenId} failed. Fallback...`);
                                if (window.VideoManager?.blacklistVideo) {
                                    await window.VideoManager.blacklistVideo(trackUri, brokenId);
                                }
                                const autoKey = `video-auto:${trackUri}`;
                                if (window.IDBCache?.delete) {
                                    await window.IDBCache.delete(autoKey);
                                }
                                if (window.lyricContainer?.fetchVideoBackgroundWithLyrics) {
                                    const currentTrack = Spicetify.Player.data.item;
                                    window.lyricContainer.fetchVideoBackgroundWithLyrics(currentTrack);
                                }
                            }
                        }
                    }
                });
            };
            tryCreate();

            // Safety Watchdog: After 2.5s, force dismiss loading screen if player is alive and not playing an ad
            const safetyTimer = setTimeout(() => {
                if (isMountedRef.current && isPlayerReady && !isAdPlaying) {
                    setHasStartedPlaying(true);
                    setIsYTReadyToRender(true);
                    setIsUIFlashing(false);
                }
            }, 2500);

            return () => clearTimeout(safetyTimer);
        }, [videoInfo?.video_id, isPlayerReady]);

        // Sync & Watchdog Logic
        useEffect(() => {
            const syncTime = () => {
                const player = playerRef.current;
                if (!player || !isPlayerReady || !videoInfo) return;
                if (typeof player.getPlayerState !== "function") return;

                const spotifyIsPlaying = Spicetify.Player.isPlaying();
                const playerState = player.getPlayerState();

                // 🛡️ Ad-blocker Guard: If an ad is playing, do NOT sync/seek timeline to prevent stutter loops
                player.mute?.();
                const isAd = checkPlayerIsAd(player, playerState) || !!adSessionRef.current;
                if (isAd) {
                    observeAd(true, player);
                    return;
                }

                const spotifyTime = Spicetify.Player.getProgress() / 1000;
                const syncOffset = videoInfo.sync_offset || 0;
                let targetVideoTime = spotifyTime + syncOffset;
                const videoDuration = typeof player.getDuration === "function" ? player.getDuration() : 0;
                if (!loopRef.current && ((videoDuration > 0 && targetVideoTime >= videoDuration) ||
                    (endedRef.current && !(videoDuration > 0 && targetVideoTime < videoDuration - 1)))) {
                    if (!endedRef.current) handleVideoEnd(player);
                    return;
                }
                if (endedRef.current) {
                    endedRef.current = false;
                    setHasEnded(false);
                }
                if (loopRef.current && videoDuration > 0 && targetVideoTime >= videoDuration) {
                    targetVideoTime %= videoDuration;
                }

                // 🛡️ Watchdog: If video is moving or playing, immediately clear loading indicator
                if (typeof player.getCurrentTime === "function") {
                    const curr = player.getCurrentTime();
                    if ((curr > 0.05 || playerState === 1) && (!hasStartedPlaying || !isYTReadyToRender) && !isAdPlaying) {
                        setHasStartedPlaying(true);
                        setIsYTReadyToRender(true);
                        setIsUIFlashing(false);
                    }
                    if ((playerState === 5 || playerState === -1) && spotifyIsPlaying) {
                        player.playVideo();
                    }
                }

                if (!spotifyIsPlaying) {
                    if (playerState === 1) {
                        player.pauseVideo();
                    }
                } else {
                    if (playerState !== 1 && playerState !== 3) {
                        player.playVideo();
                    }
                }

                if (targetVideoTime >= 0 && typeof player.getCurrentTime === "function") {
                    const currentVideoTime = player.getCurrentTime();
                    const timeDiff = Math.abs(currentVideoTime - targetVideoTime);

                    if (timeDiff > 0.5) {
                        const now = Date.now();
                        const isBuffering = playerState === 3;
                        const isRecentlySeeked = (now - lastSeekTimeRef.current) < 1500;

                        if (!isBuffering && !isRecentlySeeked) {
                            player.seekTo(targetVideoTime, true);
                            lastSeekTimeRef.current = now;

                            if (now - lastSeekAttemptRef.current.time < 2500) {
                                lastSeekAttemptRef.current.attempts++;
                            } else {
                                lastSeekAttemptRef.current = { time: now, attempts: 1 };
                            }
                        }
                    } else {
                        if (isAdPlaying) setIsAdPlaying(false);
                        lastSeekAttemptRef.current.attempts = 0;
                    }
                }
            };

            const syncInterval = setInterval(syncTime, 500);
            const handleInternalSync = () => syncTime();
            window.addEventListener("lyricsPlusSyncRequest", handleInternalSync);

            const onSeek = () => setTimeout(syncTime, 50);
            Spicetify.Player.addEventListener("onseek", onSeek);

            const onMessage = (e) => {
                try {
                    if (!/^https:\/\/(?:www\.)?youtube(?:-nocookie)?\.com$/.test(e.origin) ||
                        e.source !== playerRef.current?.getIframe?.().contentWindow) return;
                    if (!e.data || typeof e.data !== "string" || !e.data.includes("infoDelivery")) return;
                    const parsed = JSON.parse(e.data);
                    if (parsed?.event === "infoDelivery" && parsed?.info) {
                        const info = parsed.info;
                        const isAd = Boolean(info.isAd || (info.adState !== undefined && info.adState > 0) || info.adVideoId);
                        const p = playerRef.current;
                        if (isAd) {
                            observeAd(true, p);
                        } else if (info.isAd === false || info.adState === 0) {
                            observeAd(false, p);
                            if (p && typeof p.getPlaybackRate === "function" && p.getPlaybackRate() > 1) {
                                p.setPlaybackRate(1);
                            }
                        }
                    }
                } catch (_) {}
            };
            window.addEventListener("message", onMessage);

            return () => {
                clearInterval(syncInterval);
                window.removeEventListener("lyricsPlusSyncRequest", handleInternalSync);
                Spicetify.Player.removeEventListener("onseek", onSeek);
                window.removeEventListener("message", onMessage);
            };
        }, [isPlayerReady, videoInfo, isPlaying, isAdPlaying]);

        // Loading indicator
        const LoadingIndicator = () => {
            const [dotIndex, setDotIndex] = react.useState(0);
            react.useEffect(() => {
                const interval = setInterval(() => setDotIndex(prev => (prev + 1) % 3), 400);
                return () => clearInterval(interval);
            }, []);

            return react.createElement("div", {
                style: {
                    position: "absolute", top: "20px", left: "20px",
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "10px 16px", background: "rgba(0, 0, 0, 0.6)",
                    backdropFilter: "blur(10px)", borderRadius: "8px",
                    zIndex: 100, opacity: 0.9,
                }
            },
                react.createElement("div", { style: { display: "flex", gap: "4px" } },
                    [0, 1, 2].map(i => react.createElement("div", {
                        key: i,
                        style: {
                            width: "8px", height: "8px", borderRadius: "50%",
                            backgroundColor: "var(--spice-button, #1db954)",
                            opacity: dotIndex === i ? 1 : 0.3,
                            transform: dotIndex === i ? "scale(1.2)" : "scale(1)",
                            transition: "all 0.3s ease",
                        }
                    }))
                ),
                react.createElement("span", {
                    style: {
                        color: "rgba(255, 255, 255, 0.9)", fontSize: "13px",
                        fontWeight: 500, letterSpacing: "0.5px",
                    }
                }, "Loading video...")
            );
        };

        const isFullscreenMode = Boolean(fullscreen);
        const showAdCover = (isAdPlaying || adFailed) && CONFIG.visual["video-ad-album-art"] !== false;
        const showCover = (hasEnded && !loopVideo) || showAdCover;

        return react.createElement(react.Fragment, null,
            showCover && react.createElement("div", {
                className: "lyrics-album-art-fallback",
                "aria-hidden": true,
                style: { backgroundImage: albumImage ? `url(${JSON.stringify(albumImage)})` : "none" }
            }),
        react.createElement("div", {
            className: `lyrics-video-background-container${isFullscreenMode ? " video-bg-fullscreen" : ""}`,
            style: {
                position: isFullscreenMode ? "fixed" : "absolute",
                top: 0,
                left: 0,
                width: isFullscreenMode ? "100vw" : "100%",
                height: isFullscreenMode ? "100vh" : "100%",
                overflow: "hidden",
                zIndex: -1,
                display: showCover ? "none" : undefined,
            }
        },
            // Dark background while player is initializing
            !isPlayerReady && react.createElement("div", {
                style: {
                    position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                    background: "linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 50%, #0d0d0d 100%)",
                    zIndex: 1,
                }
            }),
            // Loading indicator — automatically hidden as soon as video starts playing or watchdog triggers
            (!isPlayerReady || !hasStartedPlaying) && videoInfo && react.createElement(LoadingIndicator),
            // Video mount point — player div gets rendered here
            react.createElement("div", {
                ref: playerDivRef,
                style: {
                    position: "absolute", top: "50%", left: "50%",
                    width: "177.78vh", height: "56.25vw",
                    minWidth: "100%", minHeight: "100%",
                    transform: `translate(-50%, -50%) scale(${(scale || 1.0) * (blurValue ? 1.25 : 1.22)})`,
                    opacity: isPlayerReady && (hasStartedPlaying || isAdPlaying) && !showCover ? 1 : 0,
                    transition: "opacity 0.4s ease",
                    pointerEvents: "none",
                    filter: blurValue ? `blur(${blurValue}px)` : "none",
                }
            }),
            // Brightness overlay
            react.createElement("div", {
                style: {
                    position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                    backgroundColor: "black", opacity: 1 - brightnessRatio,
                    zIndex: 2, pointerEvents: "none"
                }
            })
        ), notice && react.createElement("div", { className: "lp-video-notice", role: "status", "aria-live": "polite" }, notice));
    };

    return Component;
})();

window.VideoBackground = VideoBackground;
