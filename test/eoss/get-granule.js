const { describe, it } = require('mocha');
const chai = require('chai');
const { hookServersStartStop } = require('../helpers/servers');
const { eossRequest } = require('../helpers/eoss');

const { expect } = chai;

describe('EOSS Endpoint', function () {
  const collection = 'C1215669046-GES_DISC';
  const granule = 'G1224343298-GES_DISC';

  hookServersStartStop();

  describe('EOSS service request', function () {
    it('returns an HTTP 400 "Bad Request" error with explanatory message when the bbox parameter is invalid', async function () {
      const res = await eossRequest(this.frontend, collection, granule, { bbox: [1, 2] });
      expect(res.status).to.equal(400);
      expect(res.text).to.equal(JSON.stringify('Query parameter "request" must be one of "GetCapabilities", "GetMap"'));
    });

    it('returns successfully when the bbox parameter is valid', async function () {
      const res = await eossRequest(this.frontend, collection, granule, { bbox: [0, 10, 10, 0] });
      expect(res.status).to.equal(200);
      expect(res.text).to.equal('Granule service request');
    });
  });
});
