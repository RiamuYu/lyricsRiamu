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
            assert.ok(prompt.includes('SLANG, ABBREVIATIONS & DOUBLE MEANINGS — EVERY GENRE'));
            assert.equal(prompt.includes('GENERAL SLANG & ABBREVIATIONS — VIETNAMESE'), language === 'vi');
            if (language === 'vi') {
                assert.ok(prompt.includes('GOAT / G.O.A.T. = greatest of all time'));
                assert.ok(prompt.includes('Do not render it as "ly"'));
                assert.ok(prompt.includes('Do not add "chết" unless death is stated'));
                for (const acronym of ['NGL', 'IYKYK', 'IRL', 'DM / DMs', 'FOMO', 'YOLO']) {
                    assert.ok(prompt.includes(acronym), `Missing abbreviation: ${acronym}`);
                }
            }
            assert.equal(prompt.includes('CONTEXTUAL VIETNAMESE WORD BANK'), language === 'vi' && style !== 'literal_study');
            assert.ok(prompt.indexOf('NARRATIVE & CULTURAL READING') > prompt.indexOf('PRONOUN LOCK'));
        }
    }
}
const offPrompt = vm.runInContext("buildTranslationSystemPrompt(3, 'smart_adaptive', 'default', 'tags', 'off', 'vi')", context);
assert.ok(offPrompt.includes('Use the supplied full-song context'));
assert.ok(!offPrompt.includes('Skip deliberation entirely'));
console.log('PASS: narrative rules across 11 styles, 6 languages and both formats; Vietnamese lexicon scope and effort-off context.');

for (const mode of ['tags', 'json']) {
    for (const style of ['smart_adaptive', 'street_bold', 'street_cool', 'poetic_standard']) {
        const prompt = vm.runInContext(
            `buildTranslationSystemPrompt(3, '${style}', 'default', '${mode}', 'low', 'vi', 'Maz B', 'Receipts')`, context);
        assert.ok(prompt.includes('Relationship evidence takes priority over genre labels'));
        assert.ok(prompt.includes('A couple arguing, accusing, breaking up or using profanity'));
        assert.ok(prompt.includes('default to "Anh - Em" as a Vietnamese lyrical convention'));
        assert.ok(!prompt.includes('Street / Rap / Hip-Hop / Diss: Use "Tao - Mày"'));
        assert.ok(prompt.includes('Rap/Hip-Hop, AAVE, swearing or diss-like wording alone never selects this pair'));
        const styleOverride = vm.runInContext(`STYLE_INSTRUCTIONS['${style}'].override || ''`, context);
        if (styleOverride) assert.ok(prompt.indexOf('PRONOUN & RELATIONSHIP SELECTION') > prompt.indexOf(styleOverride));
    }
    for (const key of ['anh_em', 'em_anh', 'toi_ban', 'tao_may']) {
        const prompt = vm.runInContext(
            `buildTranslationSystemPrompt(3, 'smart_adaptive', '${key}', '${mode}', 'low', 'vi')`, context);
        const [first, second] = vm.runInContext(`PRONOUN_MODES['${key}'].value.split(' - ')`, context);
        assert.ok(prompt.includes(`First person (I/me/my/tôi) → "${first}"`));
        assert.ok(prompt.includes(`Second person (you/your/bạn) → "${second}"`));
        assert.ok(!prompt.includes('PRONOUN & RELATIONSHIP SELECTION'));
    }
}
console.log('PASS: Auto relationship priority, Receipts context and 4 explicit pronoun locks in tags/JSON.');
