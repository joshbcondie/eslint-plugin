import {AST_NODE_TYPES, ESLintUtils, TSESTree} from '@typescript-eslint/experimental-utils';

export default ESLintUtils.RuleCreator(() => '')({
    name: 'no-destructuring-awaits',
    meta: {
        docs: {
            description: '',
            category: 'Best Practices',
            recommended: 'error',
        },
        messages: {
            destructureAwait:
                'Do not destructure awaited array promises (it increases our bundle sizes). Instead, assign the result to a temporary value and destructure it on a later line.',
        },
        schema: [],
        type: 'problem',
    },
    defaultOptions: [],
    create(context) {
        const runRule = (node: TSESTree.Node, left: TSESTree.Node, right: TSESTree.Node | null) => {
            if (left.type === AST_NODE_TYPES.ArrayPattern && right?.type === AST_NODE_TYPES.AwaitExpression) {
                context.report({
                    messageId: 'destructureAwait',
                    node,
                });
            }
        };

        const filename = context.getFilename();
        return filename.endsWith('.spec.ts') || filename.endsWith('.test.ts')
            ? {}
            : {
                  AssignmentExpression(node): void {
                      runRule(node, node.left, node.right);
                  },
                  VariableDeclaration(node): void {
                      node.declarations.forEach((declaration) => {
                          runRule(declaration, declaration.id, declaration.init);
                      });
                  },
              };
    },
});

