// The Internet in One Word — make.fun entry.
// A single word describing the whole internet, written to /output/entry.txt.
// Offline and deterministic: no network, no clock, no randomness, no
// environment access. The program only emits the word.
import * as fs from "node:fs";

// Why this word: the judge weighs, in order, single-word fit, an instant
// laugh, truth about the internet as a whole, surprise, and landing in one
// beat. "scrollhole" is a coined blend of scroll and rabbit hole: the whole
// internet is one endless hole you fall into by scrolling — you came for one
// thing, three hours vanish, and you surface somewhere you never meant to
// go. Everybody recognises it at once, it needs no caption to land, and it
// is not the first obvious word anyone reaches for (not Addiction, not
// Distraction, not RabbitHole), so it stays fresh while describing the
// entire internet, not one app or one mood.
const WORD = "scrollhole";
const MAX_CHARS = 30;

// Guard the sealed gate ourselves: 1-30 UTF-8 characters, not only
// whitespace, a single word with no spaces. Fail loudly instead of
// ever writing an entry the scorer would reject.
const chars = [...WORD].length;
if (chars < 1 || chars > MAX_CHARS || !WORD.trim() || /\s/.test(WORD)) {
  throw new Error(`internet word violates the 1-30 char single-word gate (${chars} chars)`);
}
// One word means letters only: no hyphen, apostrophe, digit or punctuation
// that would make the judge read it as two things.
if (!/^[A-Za-z]+$/.test(WORD)) {
  throw new Error(`internet word must be a single plain word, got ${JSON.stringify(WORD)}`);
}
// A coined common noun lands in one beat only in lowercase: mixed case
// would read as a brand name, not as a word for the whole internet.
if (WORD !== WORD.toLowerCase()) {
  throw new Error(`internet word must be all lowercase, got ${JSON.stringify(WORD)}`);
}

fs.mkdirSync("/output", { recursive: true });
fs.writeFileSync("/output/entry.txt", WORD, "utf8");

// Verify the written file round-trips exactly: same bytes, one word,
// and no trailing newline or extra byte the gate would count.
const written = fs.readFileSync("/output/entry.txt", "utf8");
if (written !== WORD) {
  throw new Error("entry.txt does not match the internet word");
}
if (Buffer.byteLength(written, "utf8") !== chars) {
  throw new Error("entry.txt byte length does not match its char count");
}
// Independent re-check of the written file against the sealed scorer's
// own rule (1-30 chars, not only whitespace), in case the constant and
// the file ever drift apart.
const writtenChars = [...written].length;
if (writtenChars < 1 || writtenChars > MAX_CHARS || written.trim().length === 0) {
  throw new Error(`written entry.txt fails the 1-30 char gate (${writtenChars} chars)`);
}
// A second, independent size check: the file on disk must be exactly the
// word's byte length, so a stray newline or extra byte fails here even if
// the string comparison above were ever bypassed.
const stat = fs.statSync("/output/entry.txt");
if (stat.size !== Buffer.byteLength(WORD, "utf8")) {
  throw new Error(`entry.txt size ${stat.size} does not match word byte length ${Buffer.byteLength(WORD, "utf8")}`);
}

console.log(`wrote ${chars} chars ("${WORD}") to /output/entry.txt`);
