import { type TSESTree, type TSESLint } from '@typescript-eslint/utils'

const rule: TSESLint.RuleModule<'mustDestructureFirst', []> = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Requires destructuring `props` as the first line in the component body.',
    },
    schema: [],
    messages: {
      mustDestructureFirst:
        'First line of the component body must destructure `props`.',
    },
  },
  defaultOptions: [],
  create(context) {
    const isPropsParam = (param: TSESTree.Parameter): boolean =>
      param.type === 'Identifier' && param.name === 'props'

    const isDestructuringProps = (statement?: TSESTree.Statement): boolean => {
      if (!statement || statement.type !== 'VariableDeclaration') return false
      const decl = statement.declarations[0]
      return (
        decl?.init?.type === 'Identifier' &&
        decl.init.name === 'props' &&
        decl.id.type === 'ObjectPattern'
      )
    }

    const isComponentFunction = (
      node:
        | TSESTree.FunctionDeclaration
        | TSESTree.FunctionExpression
        | TSESTree.ArrowFunctionExpression,
      idName?: string,
    ) => idName?.match(/^[A-Z]/) && node.body.type === 'BlockStatement'

    const isArrowOrFuncExpression = (
      node: TSESTree.Node,
    ): node is TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression =>
      node.type === 'ArrowFunctionExpression' ||
      node.type === 'FunctionExpression'

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

    const checkFirstLine = (
      node:
        | TSESTree.FunctionDeclaration
        | TSESTree.FunctionExpression
        | TSESTree.ArrowFunctionExpression,
      body: TSESTree.Statement[],
    ) => {
      if (!node.params?.length) return
      const param = node.params[0]
      if (param && !isPropsParam(param)) return

      const firstStatement = body[0]
      if (!isDestructuringProps(firstStatement)) {
        context.report({ node, messageId: 'mustDestructureFirst' })
      }
    }

    return {
      FunctionDeclaration(node) {
        if (isComponentFunction(node, node.id?.name)) {
          checkFirstLine(node, node.body.body)
        }
      },

      VariableDeclarator(node) {
        if (!node.init) return

        if (
          node.id.type === 'Identifier' &&
          isArrowOrFuncExpression(node.init)
        ) {
          if (node.init.body.type === 'BlockStatement') {
            checkFirstLine(node.init, node.init.body.body)
          }
        }

        if (
          node.init.type === 'CallExpression' &&
          isForwardRefCall(node.init)
        ) {
          const fn = node.init.arguments[0]
          if (
            fn &&
            isArrowOrFuncExpression(fn) &&
            fn.body.type === 'BlockStatement'
          ) {
            checkFirstLine(fn, fn.body.body)
          }
        }
      },
    }
  },
}

export default rule
