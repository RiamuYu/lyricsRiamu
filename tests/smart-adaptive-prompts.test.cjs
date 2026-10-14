const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const context = vm.createContext({ window: {} });
vm.runInContext(fs.readFileSync(path.join(__dirname, '../utils/Prompts.js'), 'utf8'), context);

for (const mode of ['tags', 'json']) {
    const prompt = vm.runInContext(
        `buildTranslationSystemPrompt(3, 'smart_adaptive', 'toi_ban', '${mode}', 'low', 'vi')`, context);
    for (const rule of [
        'Assess genre and explicitness separately',
        'One explicit line does not make every line vulgar',
        'Soft delivery is not permission to erase explicit anatomy',
        'apply rap cadence only to rap passages',
        'Keep clean lines clean',
        'explicit wording alone never triggers RAP MODE',
        'Street narratives and dense rhyme chains are not requirements',
        'assess emotional stance separately from rap cadence',
        'EMO / INTROSPECTIVE RAP',
        'Profanity can express despair, emphasis or self-directed anger',
        'Rap cadence does not require street vocabulary',
        'PRONOUN LOCK'
    ]) assert.ok(prompt.includes(rule), `Missing ${mode} rule: ${rule}`);
    assert.ok(!prompt.includes('RAP FLOW & ATTITUDE RULES'));
    assert.ok(!prompt.includes('STREET SLANG DICTIONARY'));
    assert.ok(!prompt.includes('rhyme and flow rank equal to meaning'));
}
assert.equal(vm.runInContext('STYLE_INSTRUCTIONS.smart_adaptive.pronounSuggestion', context), null);
assert.ok(vm.runInContext('STYLE_INSTRUCTIONS.street_bold.style.includes(STREET_FLOW_RULES)', context));
console.log('PASS: Smart Adaptive contextual explicitness in tags/JSON; separate Bold & Street rules retained.');

const styles = vm.runInContext('Object.keys(TRANSLATION_STYLES)', context);
for (const language of ['vi', 'en', 'ja', 'ko', 'zh', 'uk']) {
    for (const style of styles) {
        for (const mode of ['tags', 'json']) {
            const prompt = vm.runInContext(
                `buildTranslationSystemPrompt(3, '${style}', 'toi_ban', '${mode}', 'low', '${language}')`, context);
            assert.ok(prompt.includes('NARRATIVE & CULTURAL READING'));
            assert.ok(prompt.includes('Distinguish the artist from a character'));
            assert.ok(prompt.includes('retain the ambiguity'));
            assert.ok(prompt.includes('take precedence over any style instruction permitting loss of detail'));
            assert.equal(prompt.includes('CONTEXTUAL VIETNAMESE WORD BANK'), language === 'vi' && style !== 'literal_study');
            assert.ok(prompt.indexOf('NARRATIVE & CULTURAL READING') > prompt.indexOf('PRONOUN LOCK'));
        }
    }
}
const offPrompt = vm.runInContext("buildTranslationSystemPrompt(3, 'smart_adaptive', 'default', 'tags', 'off', 'vi')", context);
assert.ok(offPrompt.includes('Use the supplied full-song context'));
assert.ok(!offPrompt.includes('Skip deliberation entirely'));
console.log('PASS: narrative rules across 11 styles, 6 languages and both formats; Vietnamese lexicon scope and effort-off context.');
