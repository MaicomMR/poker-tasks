export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // remove caracteres especiais
    .replace(/^-+|-+$/g, '');    // remove traços do início/fim
}