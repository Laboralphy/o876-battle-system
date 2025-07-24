const { Client } = require('../../src/worker');

describe('basic mechanism', function () {
    it('should work just fin when init and shutting down', async function () {
        const c = new Client();
        await c.init({
            modules: ['classic', 'magic']
        });
        const v = await c.getVersion();
        await c.shutdown();
        expect(v).toHaveProperty('version');
    });
});
