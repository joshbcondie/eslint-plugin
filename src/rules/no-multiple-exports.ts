import {AST_NODE_TYPES, ESLintUtils} from '@typescript-eslint/experimental-utils';

export default ESLintUtils.RuleCreator(() => '')({
    name: 'no-multiple-exports',
    meta: {
        docs: {
            description: 'Disallows exporting multiple items from an NGModule',
            category: 'Best Practices',
            recommended: 'warn',
            suggestion: true,
        },
        messages: {
            multipleExports:
                'NGModules should only export one item. Consider splitting this module into multiple modules.',
        },
        schema: [],
        type: 'suggestion',
    },
    defaultOptions: [],
    create(context) {
        return {
            ExportNamedDeclaration(node): void {
                if (
                    context.getFilename().endsWith('.module.ts') &&
                    node.declaration?.type === AST_NODE_TYPES.ClassDeclaration &&
                    node.declaration?.decorators
                ) {
                    for (const decorator of node.declaration?.decorators) {
                        if (
                            decorator.expression.type === AST_NODE_TYPES.CallExpression &&
                            decorator.expression.callee.type === AST_NODE_TYPES.Identifier &&
                            decorator.expression.callee.name === 'NgModule'
                        ) {
                            for (const argument of decorator.expression.arguments) {
                                if (argument.type === AST_NODE_TYPES.ObjectExpression) {
                                    for (const property of argument.properties) {
                                        if (
                                            property.type === AST_NODE_TYPES.Property &&
                                            property.key.type === AST_NODE_TYPES.Identifier &&
                                            property.key.name === 'exports' &&
                                            property.value.type === AST_NODE_TYPES.ArrayExpression &&
                                            property.value.elements.length > 1
                                        ) {
                                            context.report({
                                                messageId: 'multipleExports',
                                                node: property,
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
        };
    },
});
