const fs = require("fs");

class FileSystemManager {
  constructor() {}

  async checkFile(file) {
    return await fs.promises.access(file, fs.constants.R_OK);
  }

  async writeToJsonFile(path, data) {
    return await fs.promises.writeFile(path, data);
  }

  async readFile(path) {
    return await fs.promises.readFile(path);
  }
}

module.exports = { FileSystemManager };