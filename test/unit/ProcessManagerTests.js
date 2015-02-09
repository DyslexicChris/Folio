var expect = require('chai').expect;
var assert = require('chai').assert;
var Stubs = require('./Helpers/Stubs');
var Assertions = require('./Helpers/Assertions');
var mockery = require('mockery');


describe('ProcessManager', function () {

    beforeEach(function () {

        this.mockCluster = Stubs.newCluster();
        this.mockCluster.isMaster = true;

        this.mockOS = Stubs.newOS();
        this.mockOS.cpus.returns([1, 2]);

        this.mockLoggerModule = Stubs.LoggerModule();

        mockery.deregisterAll();

        mockery.enable({
            warnOnReplace: false,
            useCleanCache: true
        });

        mockery.registerAllowable('../../lib/ProcessManager', true);
        mockery.registerAllowable('underscore');
        mockery.registerMock('cluster', this.mockCluster);
        mockery.registerMock('os', this.mockOS);
        mockery.registerMock('./Logger', this.mockLoggerModule);

        this.ProcessManager = require('../../lib/ProcessManager');

    });


    describe('On new', function () {

        beforeEach(function () {

            this.processManager = new this.ProcessManager();

        });

        it('Should not be null', function () {

            expect(this.processManager).to.not.be.null;

        });

        describe('On cluster(clusterizedFunction) (with a CPU count of 2)', function () {

            describe('When process is master', function () {


                beforeEach(function () {

                    this.mockCluster.isMaster = true;
                    this.clusterizedFunction = Stubs.newFunction();

                    this.processManager.cluster(this.clusterizedFunction);

                });

                it('Should fork 2 workers', function () {

                    assert(this.mockCluster.fork.calledTwice);

                });

                it('Should not call the given clusterized function', function () {

                    assert(this.clusterizedFunction.notCalled);

                });

                it('Should set the exit callback on the cluster', function () {

                    assert(this.mockCluster.on.calledOnce);
                    assert(this.mockCluster.on.calledWith('exit'));

                });

                describe('When the exit callback is called', function () {

                    beforeEach(function () {

                        this.mockCluster.fork.reset();
                        this.mockCluster.on.callArg(1);

                    });

                    it('Should fork another worker', function () {

                        assert(this.mockCluster.fork.calledOnce);

                    });

                });

            });

            describe('When process is worker', function () {


                beforeEach(function () {

                    this.mockCluster.isMaster = false;
                    this.clusterizedFunction = Stubs.newFunction();

                    this.processManager.cluster(this.clusterizedFunction);

                });

                it('Should not fork any workers', function () {

                    assert(this.mockCluster.fork.notCalled);

                });

                it('Should immediately call the given clusterized function', function () {

                    assert(this.clusterizedFunction.calledOnce);

                });

            });

        });

    });

});
