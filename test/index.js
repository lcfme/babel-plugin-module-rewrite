/* eslint-env mocha */
import path from 'path';
import assert from 'assert';
import { transform } from 'babel-core';
import babelPluginSyntaxDynamicImport from 'babel-plugin-syntax-dynamic-import';
import plugin from '../src';

describe('Babel plugin module alias', () => {
    const transformerOpts = {
        plugins: [
            babelPluginSyntaxDynamicImport,
            [plugin, {
                replaceFunc: './test/replace/replaceFunc.js',
                replaceHandlerName: 'replaceImport',
                resolveFrom: '"."'
            }]
        ]
    };

    describe('should alias a known path', () => {
        describe('using a simple exposed name', () => {
            describe('when requiring the exact name', () => {
                it('with a require statement', () => {
                    const code = 'var utils = require("utils");';
                    const result = transform(code, transformerOpts);

                    assert.strictEqual(result.code, 'var utils = require("$ls");');
                });

                it('with an import statement', () => {
                    const code = 'import utils from "utils";';
                    const result = transform(code, transformerOpts);

                    assert.strictEqual(result.code, 'import utils from "$ls";');
                });

                it('with an export statement', () => {
                    const code = 'export { utils } from "utils";';
                    const result = transform(code, transformerOpts);

                    assert.strictEqual(result.code, 'export { utils } from "$ls";');
                });

                it('with a dynamic import expression', () => {
                    const code = 'var utils = import("utils");';
                    const result = transform(code, transformerOpts);

                    assert.strictEqual(result.code, 'var utils = import("$ls");');
                })
            });
        });
    });
});
