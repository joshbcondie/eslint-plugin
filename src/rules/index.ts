import noDestructuringAwaits from './no-destructuring-awaits';
import noMultipleExports from './no-multiple-exports';
import quoteI18nReplacements from './quote-i18n-replacements';

export = {
  rules: {
    'no-destructuring-awaits': noDestructuringAwaits,
    'no-multiple-exports': noMultipleExports,
    'quote-i18n-replacements': quoteI18nReplacements
  }
};
