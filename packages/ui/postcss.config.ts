import type { Node } from 'postcss'

/**
 * PostCSS plugin to ignore specific nodes in the CSS AST
 * @returns {object} PostCSS plugin
 */
const postcssIgnore = () => {
  // Regex patterns to match the ignore comments
  const nextRegex = /postcss-ignore-next/
  const inlineRegex = /postcss-ignore-inline/

  return {
    postcssPlugin: 'postcss-ignore',

    Once(root) {
      root.walk((node) => {
        if (node.type !== 'comment') return

        const text = node.text.trim()

        let nodeToBeRemoved: Node | null = null
        // If comment is "postcss-ignore-next", remove the next node
        if (nextRegex.test(text)) nodeToBeRemoved = node.next()
        // If comment is "postcss-ignore-inline", remove the previous node
        if (inlineRegex.test(text)) nodeToBeRemoved = node.prev()

        if (nodeToBeRemoved) nodeToBeRemoved.remove()
        node.remove()
      })
    },
  }
}

postcssIgnore.postcss = true

export default {
  plugins: [postcssIgnore()],
}
