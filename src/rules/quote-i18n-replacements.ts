import {AST_NODE_TYPES, ESLintUtils} from '@typescript-eslint/experimental-utils';

export default ESLintUtils.RuleCreator(() => '')({
    name: 'quote-i18n-replacements',
    meta: {
        docs: {
            description: 'TODO',
            category: 'Best Practices',
            recommended: 'error',
            suggestion: true,
        },
        fixable: 'code',
        messages: {
            quoteI18nReplacements: 'Replacement keys for i18n strings must be in quotes.',
        },
        schema: [],
        type: 'problem',
    },
    defaultOptions: [],
    create(context) {
        return {
            CallExpression(node): void {
                if (
                    node.callee.type === AST_NODE_TYPES.MemberExpression &&
                    node.callee.object.type === AST_NODE_TYPES.Identifier &&
                    node.callee.object.name === 'i18n' &&
                    node.callee.property.type === AST_NODE_TYPES.Identifier &&
                    node.callee.property.name === 'get' &&
                    node.arguments[1]?.type === AST_NODE_TYPES.ObjectExpression
                ) {
                    for (const property of node.arguments[1].properties) {
                        if (
                            property.type === AST_NODE_TYPES.Property &&
                            property.key.type === AST_NODE_TYPES.Identifier
                        ) {
                            const key = property.key;
                            context.report({
                                messageId: 'quoteI18nReplacements',
                                node: key,
                                fix: (fixer) => fixer.replaceText(key, `'${key.name}'`),
                            });
                        }
                    }
                }
            },
        };
    },
});
