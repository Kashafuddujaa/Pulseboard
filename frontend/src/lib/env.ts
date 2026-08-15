/**
 * Env values copied out of dashboards or rich-text docs routinely pick up
 * wrapping quotes, stray whitespace, or invisible characters. Those that a
 * browser cannot encode into an HTTP header surface much later as the opaque
 * "String contains non ISO-8859-1 code point" fetch error, so strip what is
 * safely strippable and reject the rest with a message that names the culprit.
 */
function readEnv(name: string, raw: string | undefined): string {
  const value = (raw ?? '')
    .trim()
    .replace(/^(['"])([\s\S]*)\1$/, '$2')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim()

  if (!value) {
    throw new Error(`Missing ${name} environment variable`)
  }

  const chars = [...value]
  const badIndex = chars.findIndex((char) => char.codePointAt(0)! > 0xff)
  if (badIndex !== -1) {
    const codePoint = chars[badIndex].codePointAt(0)!.toString(16).toUpperCase()
    throw new Error(
      `${name} contains the character U+${codePoint.padStart(4, '0')} at position ${badIndex}, ` +
        'which cannot be sent in an HTTP header. Re-copy the value from its source as plain ' +
        'text — smart quotes and en dashes introduced by rich-text editors break Supabase requests.',
    )
  }

  return value
}

export const env = {
  supabaseUrl: readEnv('VITE_SUPABASE_URL', import.meta.env.VITE_SUPABASE_URL),
  supabaseAnonKey: readEnv('VITE_SUPABASE_ANON_KEY', import.meta.env.VITE_SUPABASE_ANON_KEY),
  apiUrl: readEnv('VITE_API_URL', import.meta.env.VITE_API_URL),
}
