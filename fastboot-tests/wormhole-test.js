'use strict';

const expect = require('chai').expect;
const setupTest = require('ember-fastboot-addon-tests').setupTest;

describe('wormhole', function() {
  setupTest('fastboot'/*, options */);

  it('renders', function() {
    return this.visit('/wormhole')
      .then(function(res) {
        let $ = res.jQuery;
        let response = res.response;

        // add your real tests here
        expect(response.statusCode).to.equal(200);
        expect($('#destination').text().trim()).to.equal('Hello world!');
        expect($('#origin').text().trim()).to.be.empty;
      });
  });

});