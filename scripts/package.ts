import { resolve, relative } from "node:path";
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
  mkdirSync,
} from "node:fs";
import { execFileSync } from "node:child_process";
import { root } from "./build.ts";
import { sha256, loadContent, published } from "../src/catalog.ts";
const dist = resolve(root, "dist"),
  out = resolve(root, ".artifacts/release");
const info = JSON.parse(
  readFileSync(resolve(dist, "build-info.json"), "utf8"),
) as { sourceCommit: string; sourceDirty: boolean; version: string };
const head = execFileSync("git", ["rev-parse", "HEAD"], {
  cwd: root,
  encoding: "utf8",
}).trim();
const dirty = execFileSync(
  "git",
  ["status", "--porcelain", "--untracked-files=normal"],
  { cwd: root, encoding: "utf8" },
).trim();
if (info.sourceDirty || dirty || info.sourceCommit !== head)
  throw new Error(
    "Release packaging requires a clean checkout and a build of this exact commit. Commit, rebuild, then retry.",
  );
const { site, projects } = loadContent(root);
const publishedWork = published(projects);
if (
  info.version.startsWith("1.0.") &&
  !publishedWork.some((p) => p.category === "games")
)
  throw new Error("The 1.0 launch requires a verified released game");
const livePath = resolve(root, ".artifacts/live-links.json");
if (!existsSync(livePath))
  throw new Error("Run npm run verify:links before packaging");
const live = JSON.parse(readFileSync(livePath, "utf8")) as {
  checkedAt: string;
  projects: { id: string; url: string; status: number }[];
};
if (
  Date.now() - Date.parse(live.checkedAt) > 86400000 ||
  !publishedWork.every((p) =>
    live.projects.some(
      (v) => v.id === p.id && v.url === p.destination.url && v.status === 200,
    ),
  )
)
  throw new Error(
    "Release requires successful live link checks from the last 24 hours",
  );
function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = resolve(dir, name);
    return statSync(p).isDirectory() ? files(p) : [p];
  });
}
const manifest = {
  version: info.version,
  sourceCommit: head,
  designVersion: site.designVersion,
  designAuthority: "Platform v1.0 textual amendment",
  previousVisualBaseline: site.approvedBaseline,
  files: files(dist)
    .sort()
    .map((p) => ({
      path: relative(dist, p).replaceAll("\\", "/"),
      bytes: statSync(p).size,
      sha256: sha256(readFileSync(p)),
    })),
};
mkdirSync(out, { recursive: true });
writeFileSync(
  resolve(out, "manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);
if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/u.test(info.version))
  throw new Error("Invalid release version");
const name = `possibility-${info.version}-${head.slice(0, 12)}.zip`;
execFileSync("python3", [
  "-c",
  `from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED
import sys
root=Path(sys.argv[1]); target=Path(sys.argv[2])
with ZipFile(target,'w',ZIP_DEFLATED) as z:
 for p in sorted(root.rglob('*')):
  if p.is_file():
   info=ZipInfo(str(p.relative_to(root)),(1980,1,1,0,0,0));info.compress_type=ZIP_DEFLATED;info.external_attr=0o100644<<16;z.writestr(info,p.read_bytes())
 assert z.testzip() is None
`,
  dist,
  resolve(out, name),
]);
writeFileSync(
  resolve(out, "SHA256SUMS.txt"),
  sha256(readFileSync(resolve(out, name))) + "  " + name + "\n",
);
console.log(
  `Review release prepared: .artifacts/release/${name}; source ${head}. No deployment performed.`,
);
