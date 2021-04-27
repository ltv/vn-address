const path = require('path')
const fs = require('fs')
const esbuild = require('esbuild')

const rootDir = path.resolve(__dirname, '..')
const outfile = (to) => path.join(rootDir, 'dist', to)
const sourcefile = (from) => path.join(rootDir, 'libs', from)

const distDirs = fs
  .readdirSync(sourcefile('wards'))
  .filter((f) => /^[\d]+$/.test(f))
const wardEntries = distDirs.map((d) => ({
  entryPoints: [sourcefile(path.join('wards', d, 'index.js'))],
  outfile: outfile(`${d}/index.js`),
  platform: 'node',
  bundle: true,
  minify: true,
}))

const entries = [
  {
    entryPoints: [path.join(rootDir, 'index.js')],
    outfile: outfile('index.js'),
    platform: 'node',
  },
  {
    entryPoints: [sourcefile('provinces/index.js')],
    outfile: outfile('provinces.js'),
    platform: 'node',
  },
  {
    entryPoints: [sourcefile('provinces/index.js')],
    outfile: outfile('provinces.min.js'),
    globalName: 'provinces',
    platform: 'browser',
    target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
  },
  {
    entryPoints: [sourcefile('districts/index.js')],
    outfile: outfile('districts.js'),
    platform: 'node',
  },
  {
    entryPoints: [sourcefile('districts/index.js')],
    outfile: outfile('districts.min.js'),
    globalName: 'districts',
    platform: 'browser',
    target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
  },
  {
    entryPoints: [sourcefile('wards/index.js')],
    outfile: outfile('wards.js'),
    platform: 'node',
  },
  ...wardEntries,
]

entries.forEach(
  ({ entryPoints, outfile, globalName, target, platform, minify = true }) => {
    esbuild.buildSync({
      entryPoints,
      bundle: true,
      minify,
      platform,
      globalName,
      target,
      outfile,
    })
  }
)
