import { type TSESTree, type TSESLint } from '@typescript-eslint/utils'

const rule: TSESLint.RuleModule<'noDestructureInParams', []> = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Forbids destructuring `props` in component parameters.',
    },
    schema: [],
    messages: {
      noDestructureInParams:
        'Do not destructure `props` in the component params. Do it in the first line of the component body instead.',
    },
  },
  defaultOptions: [],
  create(context) {
    const isPropsDestructuredParam = (param: TSESTree.Parameter): boolean =>
      param.type === 'ObjectPattern'

    const isArrowOrFuncExpression = (
      node: TSESTree.Node,
    ): node is TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression =>
      node.type === 'ArrowFunctionExpression' ||
      node.type === 'FunctionExpression'

    const isComponentFunction = (
      node:
        | TSESTree.FunctionDeclaration
        | TSESTree.FunctionExpression
        | TSESTree.ArrowFunctionExpression,
      idName?: string,
    ) => idName?.match(/^[A-Z]/)

    const isForwardRefCall = (node: TSESTree.CallExpression): boolean => {
      const callee = node.callee
      return (
        (callee.type === 'MemberExpression' &&
          callee.object.type === 'Identifier' &&
          callee.object.name === 'React' &&
          callee.property.type === 'Identifier' &&
          callee.property.name === 'forwardRef') ||
        (callee.type === 'Identifier' && callee.name === 'forwardRef')
      )
    }

    const checkParams = (
      node:
        | TSESTree.FunctionDeclaration
        | TSESTree.FunctionExpression
        | TSESTree.ArrowFunctionExpression,
    ) => {
      if (!node.params?.length) return
      const param = node.params[0]
      if (param && isPropsDestructuredParam(param)) {
        context.report({ node: param, messageId: 'noDestructureInParams' })
      }
    }

    return {
      FunctionDeclaration(node) {
        if (isComponentFunction(node, node.id?.name)) checkParams(node)
      },

      VariableDeclarator(node) {
        if (!node.init) return

        // Arrow / function components
        if (
          node.id.type === 'Identifier' &&
          isArrowOrFuncExpression(node.init) &&
          isComponentFunction(node.init, node.id.name)
        ) {
          checkParams(node.init)
        }

        // forwardRef (React.forwardRef / forwardRef)
        if (
          node.init.type === 'CallExpression' &&
          isForwardRefCall(node.init)
        ) {
          const fn = node.init.arguments[0]
          if (fn && isArrowOrFuncExpression(fn)) {
            checkParams(fn)
          }
        }
      },
    }
  },
}

export default rule
