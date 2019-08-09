(function(mod) {
    mod(CodeMirror);
})(function(CodeMirror) {
    "use strict";
    const default_config = {
        "accessor-pairs": 0,
        "array-bracket-newline": 0,
        "array-bracket-spacing": ["warn", "never"],
        "array-callback-return": "warn",
        "arrow-body-style": ["warn", "as-needed", {
            "requireReturnForObjectLiteral": false
        }],
        "arrow-parens": ["warn", "as-needed", {
            "requireForBlockBody": true
        }],
        "arrow-spacing": ["warn", {
            "before": true,
            "after": true
        }],
        "block-scoped-var": "warn",
        "block-spacing": ["warn", "always"],
        "brace-style": ["warn", "1tbs", {
            "allowSingleLine": true
        }],
        "callback-return": 0,
        "camelcase": ["warn", {
            "properties": "never"
        }],
        "capitalized-comments": 0,
        "class-methods-use-this": ["warn", {
            "exceptMethods": ["render", "getInitialState", "getDefaultProps", "getChildContext", "componentWillMount", "componentDidMount", "componentWillReceiveProps", "shouldComponentUpdate", "componentWillUpdate", "componentDidUpdate", "componentWillUnmount"]
        }],
        "comma-dangle": ["warn", {
            "arrays": "always-multiline",
            "objects": "always-multiline",
            "imports": "always-multiline",
            "exports": "always-multiline",
            "functions": "always-multiline"
        }],
        "comma-spacing": ["warn", {
            "before": false,
            "after": true
        }],
        "comma-style": ["warn", "last"],
        "complexity": 0,
        "computed-property-spacing": ["warn", "never"],
        "consistent-return": "warn",
        "consistent-this": 0,
        "constructor-super": "warn",
        "curly": ["warn", "multi-line"],
        "default-case": ["warn", {
            "commentPattern": "^no default$"
        }],
        "dot-location": ["warn", "property"],
        "dot-notation": ["warn", {
            "allowKeywords": true
        }],
        "eol-last": ["warn", "always"],
        "eqeqeq": ["warn", "always", {
            "null": "ignore"
        }],
        "for-direction": 0,
        "func-call-spacing": ["warn", "never"],
        "func-name-matching": 0,
        "func-names": "warn",
        "func-style": 0,
        "generator-star-spacing": ["warn", {
            "before": false,
            "after": true
        }],
        "global-require": "warn",
        "guard-for-in": "warn",
        "handle-callback-err": 0,
        "id-blacklist": 0,
        "id-length": 0,
        "id-match": 0,
        "indent-legacy": 0,
        "indent": ["warn", 4, {
            "SwitchCase": 1,
            "VariableDeclarator": 1,
            "outerIIFEBody": 1,
            "FunctionDeclaration": {
                "parameters": 1,
                "body": 1
            },
            "FunctionExpression": {
                "parameters": 1,
                "body": 1
            }
        }],
        "init-declarations": 0,
        "jsx-quotes": ["warn", "prefer-double"],
        "key-spacing": ["warn", {
            "beforeColon": false,
            "afterColon": true
        }],
        "keyword-spacing": ["warn", {
            "before": true,
            "after": true,
            "overrides": {
                "return": {
                    "after": true
                },
                "throw": {
                    "after": true
                },
                "case": {
                    "after": true
                }
            }
        }],
        "line-comment-position": 0,
        "linebreak-style": ["warn", "unix"],
        "lines-around-comment": 0,
        "lines-around-directive": ["warn", {
            "before": "always",
            "after": "always"
        }],
        "max-depth": 0,
        "max-len": ["warn", 100, 2, {
            "ignoreUrls": true,
            "ignoreComments": false,
            "ignoreRegExpLiterals": true,
            "ignoreStrings": true,
            "ignoreTemplateLiterals": true
        }],
        "max-lines": 0,
        "max-nested-callbacks": 0,
        "max-params": 0,
        "max-statements-per-line": 0,
        "max-statements": 0,
        "multiline-ternary": 0,
        "new-cap": ["warn", {
            "newIsCap": true,
            "newIsCapExceptions": [],
            "capIsNew": false,
            "capIsNewExceptions": ["Immutable.Map", "Immutable.Set", "Immutable.List"]
        }],
        "new-parens": "warn",
        "newline-after-var": 0,
        "newline-before-return": 0,
        "newline-per-chained-call": ["warn", {
            "ignoreChainWithDepth": 4
        }],
        "no-alert": "warn",
        "no-array-constructor": "warn",
        "no-await-in-loop": "warn",
        "no-bitwise": "warn",
        "no-buffer-constructor": 0,
        "no-caller": "warn",
        "no-case-declarations": "warn",
        "no-catch-shadow": 0,
        "no-class-assign": "warn",
        "no-compare-neg-zero": 0,
        "no-cond-assign": ["warn", "always"],
        "no-confusing-arrow": ["warn", {
            "allowParens": true
        }],
        "no-console": "off",
        "no-const-assign": "warn",
        "no-constant-condition": "warn",
        "no-continue": "warn",
        "no-control-regex": "warn",
        "no-debugger": "warn",
        "no-delete-var": "warn",
        "no-div-regex": 0,
        "no-dupe-args": "warn",
        "no-dupe-class-members": "warn",
        "no-dupe-keys": "warn",
        "no-duplicate-case": "warn",
        "no-duplicate-imports": 0,
        "no-else-return": "warn",
        "no-empty-character-class": "warn",
        "no-empty-function": ["warn", {
            "allow": ["arrowFunctions", "functions", "methods"]
        }],
        "no-empty-pattern": "warn",
        "no-empty": "warn",
        "no-eq-null": 0,
        "no-eval": "warn",
        "no-ex-assign": "warn",
        "no-extend-native": "warn",
        "no-extra-bind": "warn",
        "no-extra-boolean-cast": "warn",
        "no-extra-label": "warn",
        "no-extra-parens": 0,
        "no-extra-semi": "warn",
        "no-fallthrough": "warn",
        "no-floating-decimal": "warn",
        "no-func-assign": "warn",
        "no-global-assign": ["warn", {
            "exceptions": []
        }],
        "no-implicit-coercion": 0,
        "no-implicit-globals": 0,
        "no-implied-eval": "warn",
        "no-inline-comments": 0,
        "no-inner-declarations": "warn",
        "no-invalid-regexp": "warn",
        "no-invalid-this": 0,
        "no-irregular-whitespace": "warn",
        "no-iterator": "warn",
        "no-label-var": "warn",
        "no-labels": ["warn", {
            "allowLoop": false,
            "allowSwitch": false
        }],
        "no-lone-blocks": "warn",
        "no-lonely-if": "warn",
        "no-loop-func": "warn",
        "no-magic-numbers": 0,
        "no-mixed-operators": ["warn", {
            "groups": [
                ["+", "-", "*", "/", "%", "**"],
                ["&", "|", "^", "~", "<<", ">>", ">>>"],
                ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
                ["&&", "||"],
                ["in", "instanceof"]
            ],
            "allowSamePrecedence": false
        }],
        "no-mixed-requires": 0,
        "no-mixed-spaces-and-tabs": "warn",
        "no-multi-assign": ["warn"],
        "no-multi-spaces": "warn",
        "no-multi-str": "warn",
        "no-multiple-empty-lines": ["warn", {
            "max": 2,
            "maxEOF": 1
        }],
        "no-native-reassign": 0,
        "no-negated-condition": 0,
        "no-negated-in-lhs": 0,
        "no-nested-ternary": "warn",
        "no-new-func": "warn",
        "no-new-object": "warn",
        "no-new-require": "warn",
        "no-new-symbol": "warn",
        "no-new-wrappers": "warn",
        "no-new": "warn",
        "no-obj-calls": "warn",
        "no-octal-escape": "warn",
        "no-octal": "warn",
        "no-param-reassign": ["warn", {
            "props": true,
            "ignorePropertyModificationsFor": ["acc", "e", "ctx", "req", "request", "res", "response", "$scope"]
        }],
        "no-path-concat": "warn",
        "no-plusplus": "warn",
        "no-process-env": 0,
        "no-process-exit": 0,
        "no-proto": "warn",
        "no-prototype-builtins": "warn",
        "no-redeclare": "warn",
        "no-regex-spaces": "warn",
        "no-restricted-globals": 0,
        "no-restricted-imports": 0,
        "no-restricted-modules": 0,
        "no-restricted-properties": ["warn", {
            "object": "arguments",
            "property": "callee",
            "message": "arguments.callee is deprecated"
        }, {
            "property": "__defineGetter__",
            "message": "Please use Object.defineProperty instead."
        }, {
            "property": "__defineSetter__",
            "message": "Please use Object.defineProperty instead."
        }, {
            "object": "Math",
            "property": "pow",
            "message": "Use the exponentiation operator (**) instead."
        }],
        "no-restricted-syntax": ["warn", {
            "selector": "ForInStatement",
            "message": "for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array."
        }, {
            "selector": "ForOfStatement",
            "message": "iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations."
        }, {
            "selector": "LabeledStatement",
            "message": "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand."
        }, {
            "selector": "WithStatement",
            "message": "`with` is disallowed in strict mode because it makes code impossible to predict and optimize."
        }],
        "no-return-assign": "warn",
        "no-return-await": "warn",
        "no-script-url": "warn",
        "no-self-assign": "warn",
        "no-self-compare": "warn",
        "no-sequences": "warn",
        "no-shadow-restricted-names": "warn",
        "no-shadow": "warn",
        "no-spaced-func": "warn",
        "no-sparse-arrays": "warn",
        "no-sync": 0,
        "no-tabs": "warn",
        "no-template-curly-in-string": "warn",
        "no-ternary": 0,
        "no-this-before-super": "warn",
        "no-throw-literal": "warn",
        "no-trailing-spaces": 0,
        "no-undef-init": "warn",
        "no-undef": "warn",
        "no-undefined": 0,
        "no-underscore-dangle": ["warn", {
            "allowAfterThis": false
        }],
        "no-unexpected-multiline": "warn",
        "no-unmodified-loop-condition": 0,
        "no-unneeded-ternary": ["warn", {
            "defaultAssignment": false
        }],
        "no-unreachable": "warn",
        "no-unsafe-finally": "warn",
        "no-unsafe-negation": "warn",
        "no-unused-expressions": ["warn", {
            "allowShortCircuit": false,
            "allowTernary": false,
            "allowTaggedTemplates": false
        }],
        "no-unused-labels": "warn",
        "no-unused-vars": ["warn", {
            "vars": "local",
            "args": "after-used",
            "ignoreRestSiblings": true
        }],
        "no-use-before-define": ["warn", {
            "functions": true,
            "classes": true,
            "variables": true
        }],
        "no-useless-call": 0,
        "no-useless-computed-key": "warn",
        "no-useless-concat": "warn",
        "no-useless-constructor": "warn",
        "no-useless-escape": "warn",
        "no-useless-rename": ["warn", {
            "ignoreDestructuring": false,
            "ignoreImport": false,
            "ignoreExport": false
        }],
        "no-useless-return": "warn",
        "no-var": "warn",
        "no-void": "warn",
        "no-warning-comments": 0,
        "no-whitespace-before-property": "warn",
        "no-with": "warn",
        "nonblock-statement-body-position": 0,
        "object-curly-newline": 0,
        "object-curly-spacing": ["warn", "always"],
        "object-property-newline": ["warn", {
            "allowMultiplePropertiesPerLine": true
        }],
        "object-shorthand": ["warn", "always", {
            "ignoreConstructors": false,
            "avoidQuotes": true
        }],
        "one-var-declaration-per-line": ["warn", "always"],
        "one-var": ["warn", "never"],
        "operator-assignment": ["warn", "always"],
        "operator-linebreak": 0,
        "padded-blocks": [0, "never"],
        "padding-line-between-statements": 0,
        "prefer-arrow-callback": ["warn", {
            "allowNamedFunctions": false,
            "allowUnboundThis": true
        }],
        "prefer-const": ["warn", {
            "destructuring": "any",
            "ignoreReadBeforeAssign": true
        }],
        "prefer-destructuring": 0,
        "prefer-numeric-literals": "warn",
        "prefer-promise-reject-warns": 0,
        "prefer-reflect": 0,
        "prefer-rest-params": "warn",
        "prefer-spread": "warn",
        "prefer-template": "warn",
        "quote-props": ["warn", "as-needed", {
            "keywords": false,
            "unnecessary": true,
            "numbers": false
        }],
        "quotes": ["warn", "single", {
            "avoidEscape": true
        }],
        "radix": "warn",
        "require-await": 0,
        "require-jsdoc": 0,
        "require-yield": "warn",
        "rest-spread-spacing": ["warn", "never"],
        "semi-spacing": ["warn", {
            "before": false,
            "after": true
        }],
        "semi": ["warn", "always"],
        "sort-imports": 0,
        "sort-keys": 0,
        "sort-vars": 0,
        "space-before-blocks": "warn",
        "space-before-function-paren": ["warn", {
            "anonymous": "always",
            "named": "never",
            "asyncArrow": "always"
        }],
        "space-in-parens": ["warn", "never"],
        "space-infix-ops": "warn",
        "space-unary-ops": ["warn", {
            "words": true,
            "nonwords": false,
            "overrides": {}
        }],
        "spaced-comment": ["warn", "always", {
            "line": {
                "exceptions": ["-", "+"],
                "markers": ["=", "!"]
            },
            "block": {
                "exceptions": ["-", "+"],
                "markers": ["=", "!"],
                "balanced": false
            }
        }],
        "strict": ["warn", "never"],
        "switch-colon-spacing": 0,
        "symbol-description": "warn",
        "template-curly-spacing": "warn",
        "template-tag-spacing": 0,
        "unicode-bom": ["warn", "never"],
        "use-isnan": "warn",
        "valid-jsdoc": 0,
        "valid-typeof": ["warn", {
            "requireStringLiterals": true
        }],
        "vars-on-top": "warn",
        "wrap-iife": ["warn", "outside", {
            "functionPrototypeMethods": false
        }],
        "wrap-regex": 0,
        "yield-star-spacing": ["warn", "after"],
        "yoda": "warn",
        "promise/param-names": "warn",
        "promise/no-return-wrap": "warn",
        "promise/always-return": "warn",
        "promise/catch-or-return": "warn",
        "promise/prefer-await-to-callbacks": 0,
        "promise/prefer-await-to-then": 0,
        "promise/no-native": 0,
        "promise/no-callback-in-promise": "warn",
        "promise/no-promise-in-callback": "warn",
        "promise/no-nesting": "warn",
        "promise/avoid-new": "warn",
        "standard/array-bracket-even-spacing": 0,
        "standard/computed-property-even-spacing": 0,
        "standard/object-curly-even-spacing": 0,
        "standard/no-callback-literal": 0
    }
    let eslint_config = {
        rules: default_config,
        parserOptions: {
            ecmaVersion: 8,
            ecmaFeatures: {
                experimentalObjectRestSpread: true,
                impliedStrict: true,
            },
            sourceType: "script",
        }
    }
    window.eslint_config = eslint_config;
    var bogus = [ "Dangerous comment" ];

    var warnings = [ [ "Expected '{'",
                     "Statement body should be inside '{ }' braces." ] ];

    var errors = [ "Missing semicolon", "Extra comma", "Missing property name",
                 "Unmatched ", " and instead saw", " is not defined",
                 "Unclosed string", "Stopping, unable to continue" ];

    function validator(text, options) {
        if (!window.eslint) return [];
        var es_rules_str = localStorage.getItem('es_rules')
        try {
            var es_rules = JSON.parse(es_rules_str)
            if (es_rules && typeof es_rules == 'object') {
                eslint_config.rules = es_rules
            }
        } catch (err) {
            console.log('parse .eslintrc error', err)
        }
        if (!eslint_config.rules) {
            eslint_config.rules = default_config
            console.log('using default eslint rules')
        }
        const code = 'async function mvccontrol() {\n'
        + text.replace(/^(.*)$/gm, '    $1')
        + '\n}\n'
        if (window.lang === "NodeJS") {
            eslint_config.env = {node: true}
            eslint_config.globals = {
                module: false,
                exports: false,
                res: false,
                req: false,
                lib: false,
                requestAsync: false,
                Parallel: false,
                url_for: false,
                redis: false,
                mysql: false,
                mssql: false,
                mongo: false,
                env: false,
                sleepAsync: false,
                ctx: false,
                console: false,
                utils: false,
                tag: false,
                Buffer: false
            }
        } else {
            eslint_config.env = {browser: true}
            eslint_config.globals = {}
        }
        eslint_config = eslint_config;
        eslint_config.rules = store.cfg || default_config;
        var res = eslint.verify(code, eslint_config);
        var result = [], i=0;
        for (let error of res) {
            if (i < 20) {
                result.push({
                    message: `${error.ruleId} : ${error.message}`,
                    severity: [null, 'warning', 'error'][error.severity],
                    from: CodeMirror.Pos(error.line - 2, error.column - 5),
                    to: CodeMirror.Pos(error.line - 2, error.column - 4)
                });
            }
            i++;
        }
        return result;
    }
    CodeMirror.registerHelper("lint", "javascript", validator);
});
