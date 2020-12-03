import {AST_NODE_TYPES, ESLintUtils, TSESLint, TSESTree} from '@typescript-eslint/experimental-utils';

export default ESLintUtils.RuleCreator(() => '')({
    name: 'no-destructuring-awaits',
    meta: {
        docs: {
            description: 'Disallow destructuring awaited array promises (because they increase our bundle sizes)',
            category: 'Best Practices',
            recommended: 'error',
            suggestion: true,
        },
        fixable: 'code',
        messages: {
            destructureAwait:
                'Do not destructure awaited array promises (it increases our bundle sizes). Instead, assign the result to a temporary value and destructure it on a later line.',
        },
        schema: [],
        type: 'problem',
    },
    defaultOptions: [],
    create(context) {
        const runRule = (
            node: TSESTree.Node,
            left: TSESTree.Node,
            right: TSESTree.Node | null,
            fix: (fixer: TSESLint.RuleFixer, resultsVariableName: string) => TSESLint.RuleFix[],
        ) => {
            if (left.type === AST_NODE_TYPES.ArrayPattern && right?.type === AST_NODE_TYPES.AwaitExpression) {
                context.report({
                    messageId: 'destructureAwait',
                    node,
                    fix: (fixer) => {
                        let resultsVariableName = 'results';
                        let i = 1;
                        while (context.getScope().variables.some((variable) => variable.name === resultsVariableName)) {
                            i++;
                            resultsVariableName = `results${i}`;
                        }
                        return fix(fixer, resultsVariableName);
                    },
                });
            }
        };

        const filename = context.getFilename();
        return filename.endsWith('.spec.ts') || filename.endsWith('.test.ts')
            ? {}
            : {
                  AssignmentExpression(node): void {
                      runRule(node, node.left, node.right, (fixer, resultsVariableName) => [
                          fixer.replaceText(node.left, `const ${resultsVariableName}`),
                          fixer.insertTextAfter(
                              node,
                              `;\n${context.getSourceCode().getText(node.left)} = ${resultsVariableName}`,
                          ),
                      ]);
                  },
                  VariableDeclaration(node): void {
                      node.declarations.forEach((declaration) => {
                          runRule(declaration, declaration.id, declaration.init, (fixer, resultsVariableName) => [
                              fixer.replaceText(declaration.id, resultsVariableName),
                              fixer.insertTextAfter(
                                  node,
                                  `;\n${node.kind} ${context
                                      .getSourceCode()
                                      .getText(declaration.id)} = ${resultsVariableName}`,
                              ),
                          ]);
                      });
                  },
              };
    },
});

