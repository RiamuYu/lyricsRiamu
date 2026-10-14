const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const stored = new Map();
const config = { modes: ['karaoke', 'synced', 'unsynced'], visual: { 'translate:target-language': 'vi', 'translate:translation-style': 'smart_adaptive', 'translate:pronoun-mode': 'default' } };
const context = { window: {}, CONFIG: config, CacheManager: { async set(key, value) { stored.set(key, value); } }, getText: key => key };
vm.runInNewContext(read('services/TranslationCoordinator.js'), context);
const coordinator = context.window.LyricsPlus.TranslationCoordinator;
const original = [{ text: 'Original', startTime: 1000 }];
const previous = [{ text: 'Old translation', originalText: 'Original', startTime: 1000 }];
const revised = [{ text: 'New translation', originalText: 'Original', startTime: 1000 }];
const self = { currentTrackUri: 'track:a', state: { uri: 'track:a', mode: 1, synced: original, currentLyrics: previous }, _dmResults: { 'track:a': { gemini_vi: previous } } };
coordinator.lyricsSource = target => { target.state.currentLyrics = target._dmResults[target.state.uri].gemini_vi; };
async function main() {
    coordinator.getGeminiTranslation = async (target, state, lyrics, mode, silent, revision) => {
        assert.equal(mode, 'gemini_vi');
        assert.equal(target.state.currentLyrics, previous);
        assert.equal(revision.feedback, 'Female narrator');
        assert.equal(revision.previous[0].translation, 'Old translation');
        assert.equal(lyrics[0].startTime, 1000);
        return revised;
    };
    await coordinator.reviseTranslation(self, 'track:a', 'Female narrator');
    assert.equal(self.state.currentLyrics, revised);
    assert.equal(stored.get('track:a:gemini_vi:smart_adaptive:default'), revised);
    coordinator.getGeminiTranslation = async () => { throw Error('Network failure'); };
    await assert.rejects(coordinator.reviseTranslation(self, 'track:a'), /Network failure/);
    assert.equal(self.state.currentLyrics, revised);
    assert.equal(self._revisionBusy, false);
    coordinator.getGeminiTranslation = async () => { self.currentTrackUri = 'track:b'; return previous; };
    await assert.rejects(coordinator.reviseTranslation(self, 'track:a'), /revision.trackChanged/);
    assert.equal(self.state.currentLyrics, revised);
    assert.equal(stored.get('track:a:gemini_vi:smart_adaptive:default'), revised);

    const client = read('services/GeminiClient.js');
    const block = client.slice(client.indexOf('        if (revision && !wantSmartPhonetic)'), client.indexOf('        // Apply provider-specific reasoning-effort'));
    const body = { messages: [{ role: 'system', content: 'Keep JSON format and fixed pronouns' }, { role: 'user', content: 'Original song' }] };
    vm.runInNewContext(block, { body, revision: { previous: ['Old translation'], feedback: 'Female narrator' }, wantSmartPhonetic: false });
    assert.equal(body.messages[0].content, 'Keep JSON format and fixed pronouns');
    assert(body.messages[1].content.includes('Female narrator'));
    assert(body.messages[1].content.includes('Old translation'));
    assert(body.messages[1].content.includes('No Internet research'));
    console.log('PASS: revision context, successful commit, failure retention, changed-track rejection and prompt format protection.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
