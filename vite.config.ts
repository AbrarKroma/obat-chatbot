import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
      return null
    },
  }
}

// Figma Make exports many UI components with versioned bare imports such as
// `@radix-ui/react-scroll-area@1.2.3`. npm cannot resolve these — strip the
// suffix and let Vite resolve the canonical package name from node_modules.
function figmaVersionedImportResolver() {
  const versionedPattern = /^(@?[^@\s]+(?:\/[^@\s]+)?)@\d[\w.\-]*(\/.*)?$/
  return {
    name: 'figma-versioned-imports',
    enforce: 'pre' as const,
    async resolveId(this: any, source: string, importer: string | undefined) {
      const match = source.match(versionedPattern)
      if (!match) return null
      const [, pkg, subpath = ''] = match
      const rewritten = `${pkg}${subpath}`
      if (rewritten === source) return null
      const resolved = await this.resolve(rewritten, importer, { skipSelf: true })
      return resolved || rewritten
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    figmaVersionedImportResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/app'),
    },
  },
})
