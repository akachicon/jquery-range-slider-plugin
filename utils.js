const path = require('path');
const project = require('./project.config');

module.exports = {
  inProject(...files) {
    return path.resolve(project.basePath, ...files);
  },
  inProjectSrc(...files) {
    return path.resolve(project.basePath, project.srcDir, ...files);
  }
};
