var expect = require('chai').expect;
var assert = require('chai').assert;
var sinon = require('sinon');
var _ = require('underscore');
var Assertions = require('./Helpers/Assertions');
var RouteSpecificationParser = require('../../lib/RouteSpecificationParser');

describe('RouteSpecificationParser', function () {

    describe('On new', function () {

        beforeEach(function () {

            this.routeSpecificationParser = new RouteSpecificationParser();

        });

        it('Should not be undefined', function () {

            expect(this.routeSpecificationParser).to.not.be.undefined;

        });

        describe('validateSpecification(specification)', function () {

            describe('Valid specifications', function () {

                it('The root path /', function () {

                    assertValidSpecification(this.routeSpecificationParser, '/', this);

                });

                it('The root path with a wildcard /*', function () {

                    assertValidSpecification(this.routeSpecificationParser, '/*', this);

                });

                it('Mixed case alphanumeric, hyphen, period and underscore path with leading slash', function () {

                    assertValidSpecification(this.routeSpecificationParser, '/test-123/TE_ST/hello.world', this);

                });

                it('Mixed case alphanumeric, hyphen, period and underscore path with leading and trailing slash', function () {

                    assertValidSpecification(this.routeSpecificationParser, '/test-123/TE_ST/hello.world/', this);

                });

                it('Path with single variable component', function () {

                    assertValidSpecification(this.routeSpecificationParser, '/test-123/TE_ST/:var', this);

                });

                it('Path with two variable components separated by a single slash', function () {

                    assertValidSpecification(this.routeSpecificationParser, '/test-123/TE_ST/:varA/:varB', this);

                });

                it('Path with two variable components separated by a static component', function () {

                    assertValidSpecification(this.routeSpecificationParser, '/test-123/TE_ST/:varA/split/:varB', this);

                });

                it('Static path with a wildcard at the end', function () {

                    assertValidSpecification(this.routeSpecificationParser, '/test-123/TE_ST/hello.world/*', this);

                });

                it('Path with a single variable component mid-path and wildcard at the end', function () {

                    assertValidSpecification(this.routeSpecificationParser, '/test-123/TE_ST/:varA/hello.world/*', this);

                });

                it('Path with multiple variable components mid-path and wildcard at the end', function () {

                    assertValidSpecification(this.routeSpecificationParser, '/test-123/TE_ST/:varA/:varB/hello.world/*', this);

                });

                it('Path with multiple variable components immediately followed by wildcard at the end', function () {

                    assertValidSpecification(this.routeSpecificationParser, '/test-123/TE_ST/:varA/:varB/*', this);

                });

            });


            describe('Invalid specifications', function () {

                it('A wildcard on its own *', function () {

                    assertInvalidSpecification(this.routeSpecificationParser, '*', this);

                });

                it('The root path with double slash //', function () {

                    assertInvalidSpecification(this.routeSpecificationParser, '//', this);

                });

                it('Basic path containing double slashes', function () {

                    assertInvalidSpecification(this.routeSpecificationParser, '/test//test/', this);

                });

                it('Basic path containing a disallowed character', function () {

                    assertInvalidSpecification(this.routeSpecificationParser, '/te$t', this);

                });

                it('Basic path with a query parameter', function () {

                    assertInvalidSpecification(this.routeSpecificationParser, '/test?test=value', this);

                });

                it('Alphanumeric, hyphen and underscore path without leading slash', function () {

                    assertInvalidSpecification(this.routeSpecificationParser, 'test-123/TE_ST', this);

                });

                it('Path containing space', function () {

                    assertInvalidSpecification(this.routeSpecificationParser, '/te st-123/TE_ST', this);

                });

                it('Path with two variable components not separated by a slash', function () {

                    assertInvalidSpecification(this.routeSpecificationParser, '/test-123/TE_ST/:varA:varB', this);

                });

                it('Static path with a wildcard mid-path', function () {

                    assertInvalidSpecification(this.routeSpecificationParser, '/test-123/TE_ST/hello/*/world', this);

                });

                it('Static path with a wildcard at the end, but without a slash immediately before it e.g. /test*', function () {

                    assertInvalidSpecification(this.routeSpecificationParser, '/test*', this);

                });

                it('Path with a wildcard at the end, after a variable component but without a slash immediately before it e.g. /test/:varA*', function () {

                    assertInvalidSpecification(this.routeSpecificationParser, '/test/:varA*', this);

                });

                it('Path with a double wildcard character at the end e.g. /**', function () {

                    assertInvalidSpecification(this.routeSpecificationParser, '/test-123/TE_ST/hello/**', this);

                });

            });

        });

        describe('buildRegEx(specification)', function () {

            it('The root path /', function () {

                expect(this.routeSpecificationParser.buildRegEx('/').toString()).to.equal(/^(?:\/)?$/.toString());

            });

            it('The root path with a wildcard /*', function () {

                expect(this.routeSpecificationParser.buildRegEx('/*').toString()).to.equal(/^\/[a-zA-Z0-9%\-_\.\/]*(?:\/)?$/.toString());

            });

            it('Mixed case alphanumeric, hyphen, period and underscore path with leading slash', function () {

                expect(this.routeSpecificationParser.buildRegEx('/test-123/TE_ST/hello.world').toString()).to.equal(/^\/test-123\/TE_ST\/hello\.world(?:\/)?$/.toString());

            });

            it('Mixed case alphanumeric, hyphen, period and underscore path with leading and trailing slash', function () {

                expect(this.routeSpecificationParser.buildRegEx('/test-123/TE_ST/hello.world/').toString()).to.equal(/^\/test-123\/TE_ST\/hello\.world(?:\/)?$/.toString());

            });

            it('Path with single variable component', function () {

                expect(this.routeSpecificationParser.buildRegEx('/test-123/TE_ST/:var').toString()).to.equal(/^\/test-123\/TE_ST\/([a-zA-Z0-9%\-_\.]+)(?:\/)?$/.toString());

            });

            it('Path with two variable components separated by a single slash', function () {

                expect(this.routeSpecificationParser.buildRegEx('/test-123/TE_ST/:varA/:varB').toString()).to.equal(/^\/test-123\/TE_ST\/([a-zA-Z0-9%\-_\.]+)\/([a-zA-Z0-9%\-_\.]+)(?:\/)?$/.toString());

            });

            it('Path with two variable components separated by a static component', function () {

                expect(this.routeSpecificationParser.buildRegEx('/test-123/TE_ST/:varA/split/:varB').toString()).to.equal(/^\/test-123\/TE_ST\/([a-zA-Z0-9%\-_\.]+)\/split\/([a-zA-Z0-9%\-_\.]+)(?:\/)?$/.toString());

            });

            it('Static path with a wildcard at the end', function () {

                expect(this.routeSpecificationParser.buildRegEx('/test-123/TE_ST/hello.world/*').toString()).to.equal(/^\/test-123\/TE_ST\/hello\.world\/[a-zA-Z0-9%\-_\.\/]*(?:\/)?$/.toString());

            });

            it('Path with a single variable component mid-path and wildcard at the end', function () {

                expect(this.routeSpecificationParser.buildRegEx('/test-123/TE_ST/:varA/hello.world/*').toString()).to.equal(/^\/test-123\/TE_ST\/([a-zA-Z0-9%\-_\.]+)\/hello\.world\/[a-zA-Z0-9%\-_\.\/]*(?:\/)?$/.toString());

            });

            it('Path with multiple variable components mid-path and wildcard at the end', function () {

                expect(this.routeSpecificationParser.buildRegEx('/test-123/TE_ST/:varA/:varB/hello.world/*').toString()).to.equal(/^\/test-123\/TE_ST\/([a-zA-Z0-9%\-_\.]+)\/([a-zA-Z0-9%\-_\.]+)\/hello\.world\/[a-zA-Z0-9%\-_\.\/]*(?:\/)?$/.toString());

            });

            it('Path with multiple variable components immediately followed by wildcard at the end', function () {

                expect(this.routeSpecificationParser.buildRegEx('/test-123/TE_ST/:varA/:varB/*').toString()).to.equal(/^\/test-123\/TE_ST\/([a-zA-Z0-9%\-_\.]+)\/([a-zA-Z0-9%\-_\.]+)\/[a-zA-Z0-9%\-_\.\/]*(?:\/)?$/.toString());

            });


        });

        describe('extractVariableComponents(specification)', function () {

            it('The root path / should have no variable components', function () {

                expect(this.routeSpecificationParser.extractVariableComponents('/')).to.deep.equal([]);

            });

            it('The root path with a wildcard /* should have no variable components', function () {

                expect(this.routeSpecificationParser.extractVariableComponents('/*')).to.deep.equal([]);

            });

            it('Static mixed case alphanumeric, hyphen, period and underscore path with leading slash', function () {

                expect(this.routeSpecificationParser.extractVariableComponents('/test-123/TE_ST/hello.world')).to.deep.equal([]);

            });

            it('Path with single variable component - one variable component should be extracted', function () {

                expect(this.routeSpecificationParser.extractVariableComponents('/test-123/TE_ST/:var')).to.deep.equal(['var']);

            });

            it('Path with two variable components separated by a single slash - two variable components should be extracted', function () {

                expect(this.routeSpecificationParser.extractVariableComponents('/test-123/TE_ST/:varA/:varB')).to.deep.equal(['varA', 'varB']);

            });

            it('Path with two variable components separated by a static component - two variable components should be extracted', function () {

                expect(this.routeSpecificationParser.extractVariableComponents('/test-123/TE_ST/:varA/split/:varB')).to.deep.equal(['varA', 'varB']);

            });

            it('Static path with a wildcard at the end - no variable components should be extracted', function () {

                expect(this.routeSpecificationParser.extractVariableComponents('/test-123/TE_ST/hello.world/*')).to.deep.equal([]);

            });

            it('Path with a single variable component mid-path and wildcard at the end - one variable component should be extracted', function () {

                expect(this.routeSpecificationParser.extractVariableComponents('/test-123/TE_ST/:varA/hello.world/*')).to.deep.equal(['varA']);

            });

            it('Path with multiple variable components mid-path and wildcard at the end - only the variable components shoud be extracted, not the wildcard', function () {

                expect(this.routeSpecificationParser.extractVariableComponents('/test-123/TE_ST/:varA/:varB/hello.world/*')).to.deep.equal(['varA', 'varB']);

            });

            it('Path with multiple variable components immediately followed by wildcard at the end - only the variable components shoud be extracted, not the wildcard', function () {

                expect(this.routeSpecificationParser.extractVariableComponents('/test-123/TE_ST/:varA/:varB/*')).to.deep.equal(['varA', 'varB']);

            });

        });

    });

});

/**
 *
 * @param routeSpecificationParser
 * @param specification
 * @param context
 */
function assertValidSpecification(routeSpecificationParser, specification, context) {
    'use strict';

    Assertions.assertNoThrow(function () {
        routeSpecificationParser.validateSpecification(specification);
    }, context);
}

/**
 *
 * @param routeSpecificationParser
 * @param specification
 * @param context
 */
function assertInvalidSpecification(routeSpecificationParser, specification, context) {
    'use strict';

    Assertions.assertThrows(function () {
        routeSpecificationParser.validateSpecification(specification);
    }, 'Invalid route specification', context);
}
