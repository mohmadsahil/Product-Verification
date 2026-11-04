import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { LOGO_REMOTE_FALLBACK } from "../lib/brand";

async function main() {
  const dest = join(process.cwd(), "public", "logo.png");
  const dir = dirname(dest);
  if (!existsSync(dir)) await mkdir(dir, { recursive: true });

  const res = await fetch(LOGO_REMOTE_FALLBACK);
  if (!res.ok) {
    throw new Error(`Download failed: HTTP ${res.status}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
  // eslint-disable-next-line no-console
  console.log(`Saved logo to ${dest} (${buf.byteLength} bytes)`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
