const apiVerion = preval`
    const config = require('../../../package.json');
    module.exports = config.version;
` as string;

export default apiVerion;
