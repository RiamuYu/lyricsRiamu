const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const track = { uri: 'spotify:track:a', artist: 'Test Artist', title: 'Test Song', duration: 180000, image: 'https://example.test/cover.jpg' };
const official = { videoId: 'abcdefghijk', title: 'Test Artist - Test Song (Official Music Video)', author: 'TestArtistVEVO', lengthSeconds: 180 };

function manager() {
    const db = new Map();
    const context = {
        window: {}, console: { log() {}, warn() {}, error() {} }, AbortController,
        localStorage: { removeItem() {} },
        IDBCache: { async get(k) { return db.get(k); }, async set(k, v) { db.set(k, v); }, async delete(k) { db.delete(k); } }
    };
    vm.runInNewContext(read('components/VideoManager.js'), context);
    return { video: context.window.VideoManager, db };
}

async function main() {
    const { video, db } = manager();
    assert(video._isMatchingVideo(official, track));
    assert(video._isMatchingVideo({ ...official, lengthSeconds: 195 }, track));
    assert(video._isMatchingVideo({ ...official, lengthSeconds: 90 }, track));
    assert(video._isMatchingVideo({ ...official, title: 'Test Artist feat. Guest - Test Song (MV)', lengthSeconds: 90 }, track));
    assert(video._isMatchingVideo({ ...official, title: 'Guest - Test Song (Official MV)', author: 'Guest', lengthSeconds: 90 }, { ...track, artists: ['Test Artist', 'Guest'] }));
    assert(video._isMatchingVideo(official, { ...track, title: 'Test Song (ft. Guest)' }));
    assert(video._isMatchingVideo({ ...official, title: 'Test Artist - Song Test (Official MV)' }, track));
    assert(!video._isMatchingVideo({ ...official, title: 'Test Artist - Song Test (Official MV)', lengthSeconds: 90 }, track));
    assert(!video._isMatchingVideo({ ...official, title: 'Other Song (Official Music Video)' }, track));
    assert(!video._isMatchingVideo({ ...official, title: 'Other Artist - Test Song (Official MV)', author: 'Other Artist' }, track));
    assert(!video._isMatchingVideo({ ...official, title: 'Test Artist - Test Song (Official Audio)' }, track));
    assert(!video._isMatchingVideo({ ...official, title: 'Test Artist - Test Song (fan-made Official MV)' }, track));
    assert(video._isMatchingVideo({ ...official, title: 'Test Artist - Test Song', author: 'Random uploader' }, track));
    assert(video._isMatchingVideo({ ...official, title: 'Test Song (Visualizer)' }, track));
    assert.equal(video._parseYoutubeSearchResults({ videoId: official.videoId }, 'Test Artist - Test Song').length, 0);
    const parsed = video._parseYoutubeSearchResults({ contents: [{ videoRenderer: {
        videoId: official.videoId, title: { runs: [{ text: official.title }] },
        ownerText: { runs: [{ text: official.author }] }, lengthText: { simpleText: '3:00' }
    } }] });
    assert.equal(parsed[0].lengthSeconds, 180);

    // Bad legacy cache must be ignored, then the first acceptable search result wins.
    db.set(`video-auto:${track.uri}`, { notFound: true, selectionVersion: 2 });
    assert.equal(await video.getAutoVideo(track.uri, track), null);
    db.set(`video-auto:${track.uri}`, { videoId: 'oldcache000', title: 'Unrelated', selectionVersion: 2 });
    video._searchYoutubeTVHTML5 = async () => [{ ...official, videoId: 'wrongvid000', title: 'Unrelated Official MV' },
        { ...official, videoId: 'fuzzyvid000', title: 'Test Artist - Song Test (Official MV)' }, official];
    assert.equal((await video.fetchVideoForTrack(track)).video_id, official.videoId);
    assert.equal(db.get(`video-auto:${track.uri}`).selectionVersion, 3);
    await video.reset();
    video._searchYoutubeTVHTML5 = async () => { throw Error('Validated cache should avoid searching'); };
    assert.equal((await video.fetchVideoForTrack(track)).video_id, official.videoId);

    const other = { ...track, uri: 'spotify:track:b', title: 'Other Song' };
    video._searchYoutubeTVHTML5 = async () => [official];
    assert.equal(await video.fetchVideoForTrack(other), null);
    assert.equal(db.get(`video-auto:${other.uri}`).notFound, true);
    await video.saveManualVideo(other.uri, official.videoId);
    assert.equal((await video.fetchVideoForTrack(other)).source, 'manual+saved');

    // A search that finishes after switching tracks cannot replace the current video.
    const { video: racing } = manager();
    let finish;
    const started = new Promise(resolve => {
        racing._searchYoutubeTVHTML5 = () => { resolve(); return new Promise(r => { finish = r; }); };
    });
    const pending = racing.fetchVideoForTrack(track);
    await started;
    racing._searchYoutubeTVHTML5 = async () => [];
    await racing.fetchVideoForTrack(other);
    finish([official]);
    assert.equal(await pending, null);
    assert.equal(racing.getCurrentVideo(), null);

    const source = read('index.js');
    const method = source.slice(source.indexOf('\tasync fetchVideoBackground(info) {'), source.indexOf('\tasync refreshMusixmatchTranslation()'));
    const timers = new Map();
    let timerId = 0, complete;
    const config = { visual: { 'video-background': true } };
    const context = { CONFIG: config, console, clearTimeout: id => timers.delete(id),
        setTimeout: fn => { timers.set(++timerId, fn); return timerId; },
        window: { VideoManager: { fetchVideoForTrack: () => new Promise(r => { complete = r; }) } } };
    const container = vm.runInNewContext(`({${method}})`, context);
    container.state = { uri: track.uri, videoBackground: { uri: other.uri, video_id: official.videoId } };
    container.currentTrackUri = track.uri;
    container.setState = patch => Object.assign(container.state, patch);
    await container.fetchVideoBackground(track);
    assert.equal(container.state.videoBackground, null);
    const active = timers.get(timerId)();
    config.visual['video-background'] = false;
    await container.fetchVideoBackground(track);
    complete({ uri: track.uri, video_id: official.videoId });
    await active;
    assert.equal(container.state.videoBackground, null);

    // Execute the actual render conditions and background elements with a tiny React stub.
    const conditions = source.slice(source.indexOf('\t\tconst backgroundTrackUri ='), source.indexOf('\t\tif (this.state.isFADMode)', source.indexOf('\t\tconst backgroundTrackUri =')));
    const elements = source.slice(source.indexOf('\t\t\thasVideoBackground &&'), source.indexOf('\t\t\treact.createElement(window.TranslationStatusOverlay'));
    const renderContext = { CONFIG: config, window: { VideoBackground: 'VideoBackground' }, document: {}, fadLyricsContainer: null,
        react: { createElement: (type, props) => ({ type, props }) } };
    const render = vm.runInNewContext(`(function() { ${conditions} return [${elements}]; })`, renderContext);
    const self = { currentTrackInfo: track, currentTrackUri: track.uri, state: { uri: track.uri, image: track.image, videoBackground: null } };
    config.visual['video-background'] = true;
    let nodes = render.call(self).filter(Boolean);
    assert.equal(nodes[0].props.className, 'lyrics-album-art-fallback');
    assert.equal(nodes[0].props.style.backgroundImage, `url(${JSON.stringify(track.image)})`);
    self.state.videoBackground = { uri: other.uri, video_id: official.videoId };
    assert.equal(render.call(self).filter(Boolean)[0].props.className, 'lyrics-album-art-fallback');
    self.state.videoBackground.uri = track.uri;
    nodes = render.call(self).filter(Boolean);
    assert.equal(nodes.length, 1);
    assert.equal(nodes[0].type, 'VideoBackground');
    config.visual['video-background'] = false;
    assert.equal(render.call(self).filter(Boolean).length, 0);
    config.visual['album-art-background'] = true;
    assert.equal(render.call(self).filter(Boolean)[0].props.className, 'lyrics-album-art-fallback');

    const playback = read('components/VideoBackground.js');
    const endHandler = playback.slice(playback.indexOf('        const handleVideoEnd ='), playback.indexOf('        useEffect(() => {'));
    const sync = playback.slice(playback.indexOf('            const syncTime = () => {'), playback.indexOf('            const syncInterval ='));
    const calls = [];
    let progress = 95000, playing = true;
    const player = { getPlayerState: () => 1, getDuration: () => 90, getCurrentTime: () => 0,
        seekTo: time => calls.push(['seek', time]), playVideo: () => calls.push(['play']), pauseVideo: () => calls.push(['pause']) };
    const playbackContext = { Spicetify: { Player: { isPlaying: () => playing, getProgress: () => progress } },
        loopRef: { current: false }, endedRef: { current: false }, setHasEnded: value => { playbackContext.hasEnded = value; },
        playerRef: { current: player }, adSessionRef: { current: null }, observeAd() {}, isPlayerReady: true, videoInfo: { video_id: official.videoId },
        checkPlayerIsAd: () => false, isAdPlaying: false, hasStartedPlaying: true, isYTReadyToRender: true,
        lastSeekTimeRef: { current: 0 }, lastSeekAttemptRef: { current: { time: 0, attempts: 0 } },
        Date, setIsAdPlaying() {} };
    const handlers = vm.runInNewContext(`(() => { ${endHandler} ${sync} return { handleVideoEnd, syncTime }; })()`, playbackContext);
    handlers.syncTime();
    assert.equal(playbackContext.hasEnded, true);
    assert.deepEqual(calls, [['pause']]);
    calls.length = 0;
    handlers.syncTime();
    assert.equal(calls.length, 0); // Do not restart an ended video while album art is visible.
    progress = 30000;
    handlers.syncTime();
    assert.equal(playbackContext.hasEnded, false);
    assert.deepEqual(calls, [['seek', 30]]); // Seeking back into the video restores it.
    calls.length = 0;
    playbackContext.loopRef.current = true;
    playbackContext.lastSeekTimeRef.current = 0;
    progress = 95000;
    handlers.syncTime();
    assert.deepEqual(calls, [['seek', 5]]);
    calls.length = 0;
    playing = false;
    handlers.handleVideoEnd(player);
    assert.deepEqual(calls, [['seek', 0]]); // Looping must respect Spotify pause.
    playing = true;
    calls.length = 0;
    handlers.handleVideoEnd(player);
    assert.deepEqual(calls, [['seek', 0], ['play']]);

    const finalRender = playback.slice(playback.indexOf('        const isFullscreenMode ='), playback.lastIndexOf('    };'));
    const viewContext = { fullscreen: false, hasEnded: true, loopVideo: false, albumImage: track.image, CONFIG: { visual: {} }, adFailed: false, notice: "",
        react: { Fragment: 'Fragment', createElement: (type, props, ...children) => ({ type, props, children }) },
        isPlayerReady: true, hasStartedPlaying: true, isAdPlaying: false, videoInfo: {},
        playerDivRef: {}, scale: 1.1, blurValue: 0, brightnessRatio: 0.5 };
    const playerRender = vm.runInNewContext(`(function() { ${finalRender} })`, viewContext);
    const endedView = playerRender();
    assert.equal(endedView.children[0].props.className, 'lyrics-album-art-fallback');
    assert.equal(endedView.children[1].props.style.display, 'none'); // Keep the player mounted for seek/loop changes.
    viewContext.loopVideo = true;
    assert.equal(playerRender().children[0], false);
    assert.equal(playerRender().children[1].props.style.display, undefined);
    console.log('PASS: title/artist/feat matching, secondary duration checks, cache, races, album background, end fallback, seek-back and loop/pause.');
}

main().catch(error => { console.error(error); process.exitCode = 1; });
