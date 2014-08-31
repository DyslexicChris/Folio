var _ = require('underscore');
var expect = require('chai').expect;
var sinon = require('sinon');
var mockery = require('mockery');


describe('ProcessManager', function () {

    beforeEach(function () {

        this.mockCluster = {
            isMaster: true,
            fork: function(){},
            on: function(){}
        };

        this.mockOS = {
            cpus: function(){
                return [1,2];
            }
        };

        this.mockLogger = {
            log: function(){
            },
            getLogger: function () {
                return this;
            }
        };

        this.spies = {};
        this.spies.clusterFork = sinon.spy(this.mockCluster, 'fork');
        this.spies.clusterOn = sinon.spy(this.mockCluster, 'on');


        mockery.deregisterAll();

        mockery.enable({
            warnOnReplace: false,
            useCleanCache: true
        });


        mockery.registerAllowable('../../lib/ProcessManager', true);
        mockery.registerAllowable('underscore');
        mockery.registerMock('cluster', this.mockCluster);
        mockery.registerMock('os', this.mockOS);
        mockery.registerMock('./Logger', this.mockLogger);


        this.ProcessManager = require('../../lib/ProcessManager');


    });

    afterEach(function () {
        _.each(this.spies, function (spy) {
            spy.restore();
        })
    });

    describe('On new', function () {

        beforeEach(function () {

            this.processManager = new this.ProcessManager();

        });

        it('Should not be null', function(){

            expect(this.processManager).to.not.be.null;

        });

        describe('On cluster(clusterizedFunction) (with a CPU count of 2)', function(){

            describe('When process is master', function(){


                beforeEach(function(){

                    this.mockCluster.isMaster = true;

                    this.clusterizedFunction = function(){
                    };

                    this.spies.clusterizedFunction = sinon.spy(this, 'clusterizedFunction');

                    this.processManager.cluster(this.clusterizedFunction);

                });

                it('Should fork 2 workers', function(){

                    expect(this.mockCluster.fork.callCount).to.equal(2);

                });

                it('Should not call the given clusterized function', function(){

                    expect(this.clusterizedFunction.callCount).to.equal(0);

                });

                it('Should set the exit callback on the cluster', function(){

                    expect(this.mockCluster.on.callCount).to.equal(1);
                    expect(this.mockCluster.on.getCall(0).args[0]).to.equal('exit');

                });

                describe('When the exit callback is called', function(){

                    beforeEach(function(){

                        this.mockCluster.fork.reset();
                        var callback = this.mockCluster.on.getCall(0).args[1];
                        callback();

                    });

                    it('Should fork another worker', function(){

                        expect(this.mockCluster.fork.callCount).to.equal(1);

                    });

                });

            });


            describe('When process is worker', function(){


                beforeEach(function(){

                    this.mockCluster.isMaster = false;

                    this.clusterizedFunction = function(){
                    };

                    this.spies.clusterizedFunction = sinon.spy(this, 'clusterizedFunction');

                    this.processManager.cluster(this.clusterizedFunction);

                });

                it('Should not fork any workers', function(){

                    expect(this.mockCluster.fork.callCount).to.equal(0);

                });

                it('Should immediately call the given clusterized function', function(){

                    expect(this.clusterizedFunction.callCount).to.equal(1);

                });

            });

        });

    });

});
