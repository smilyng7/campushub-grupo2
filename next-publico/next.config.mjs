import path from 'node:path';
import { fileURLToPath } from 'node:url';
const nextConfig = { turbopack: { root: path.dirname(fileURLToPath(import.meta.url)) } };
export default nextConfig;
