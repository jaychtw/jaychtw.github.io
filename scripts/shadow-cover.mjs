import sharp from "sharp";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
const input =
    "docs/shadow-becomes-me/masters/shadow-becomes-me-approved-cover.png",
  output = "public/assets/covers/games/shadow-becomes-me.webp";
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");
const original = readFileSync(input);
if (
  sha(original) !==
  "3764649da4cfb79a32849c10b569da34a0c104af649d942a776efa89812c0d34"
)
  throw Error("Approved original mismatch");
await sharp(original).webp({ lossless: true, effort: 6 }).toFile(output);
const a = await sharp(original).ensureAlpha().raw().toBuffer(),
  b = await sharp(output).ensureAlpha().raw().toBuffer();
if (!a.equals(b)) throw Error("Lossless cover pixels differ");
const meta = await sharp(original).metadata();
if (Math.abs(meta.height - (meta.width * 9) / 16) >= 1)
  throw Error("Review cover framing before standard 16:9 export");
mkdirSync(".artifacts/shadow-becomes-me", { recursive: true });
writeFileSync(
  ".artifacts/shadow-becomes-me/cover.json",
  JSON.stringify(
    {
      original: input,
      originalSha256: sha(original),
      sourceWebP: output,
      sourceSha256: sha(readFileSync(output)),
      losslessDecodedPixelsIdentical: true,
      width: meta.width,
      height: meta.height,
      standardVariantRoundingCropSourcePixels: Math.abs(
        meta.height - (meta.width * 9) / 16,
      ),
      note: "Original and lossless source preserve all pixels. Existing 16:9 responsive exports have less than one source pixel of aspect-ratio rounding; title and Shadow are well inside frame. No art regeneration or overlay.",
    },
    null,
    2,
  ) + "\n",
);
