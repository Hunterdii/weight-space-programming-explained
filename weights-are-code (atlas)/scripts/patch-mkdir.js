/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const origPromisesMkdir = fs.promises.mkdir;
const origMkdirSync = fs.mkdirSync;
const origMkdir = fs.mkdir;

fs.promises.mkdir = async function(p, opts) {
  let retries = 35;
  while (true) {
    try {
      return await origPromisesMkdir.call(fs.promises, p, opts);
    } catch (err) {
      if ((err.code === 'EPERM' || err.code === 'EBUSY') && retries-- > 0) {
        await new Promise((r) => setTimeout(r, 80));
      } else {
        throw err;
      }
    }
  }
};

fs.mkdirSync = function(p, opts) {
  let retries = 35;
  while (true) {
    try {
      return origMkdirSync.call(fs, p, opts);
    } catch (err) {
      if ((err.code === 'EPERM' || err.code === 'EBUSY') && retries-- > 0) {
        const end = Date.now() + 80;
        while (Date.now() < end) {}
      } else {
        throw err;
      }
    }
  }
};

fs.mkdir = function(p, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  let retries = 35;
  function attempt() {
    origMkdir.call(fs, p, opts, (err, res) => {
      if (err && (err.code === 'EPERM' || err.code === 'EBUSY') && retries-- > 0) {
        setTimeout(attempt, 80);
      } else if (callback) {
        callback(err, res);
      }
    });
  }
  attempt();
};

const origRmdir = fs.rmdir;
fs.rmdir = function(p, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  let retries = 60;
  function attempt() {
    origRmdir.call(fs, p, opts, (err, res) => {
      if (err && (err.code === 'EPERM' || err.code === 'EBUSY') && retries-- > 0) {
        setTimeout(attempt, 100);
      } else if (err && (err.code === 'EPERM' || err.code === 'ENOTEMPTY') && (String(p).includes('.next') || String(p).includes('out') || String(p).includes('_next'))) {
        if (callback) callback(null);
      } else if (callback) {
        callback(err, res);
      }
    });
  }
  attempt();
};

const origPromisesRmdir = fs.promises.rmdir;
fs.promises.rmdir = async function(p, opts) {
  let retries = 60;
  while (true) {
    try {
      return await origPromisesRmdir.call(fs.promises, p, opts);
    } catch (err) {
      if ((err.code === 'EPERM' || err.code === 'EBUSY') && retries-- > 0) {
        await new Promise((r) => setTimeout(r, 100));
      } else if ((err.code === 'EPERM' || err.code === 'ENOTEMPTY') && (String(p).includes('.next') || String(p).includes('out') || String(p).includes('_next'))) {
        return;
      } else {
        throw err;
      }
    }
  }
};

const origRmdirSync = fs.rmdirSync;
fs.rmdirSync = function(p, opts) {
  let retries = 60;
  while (true) {
    try {
      return origRmdirSync.call(fs, p, opts);
    } catch (err) {
      if ((err.code === 'EPERM' || err.code === 'EBUSY') && retries-- > 0) {
        const end = Date.now() + 100;
        while (Date.now() < end) {}
      } else if ((err.code === 'EPERM' || err.code === 'ENOTEMPTY') && (String(p).includes('.next') || String(p).includes('out') || String(p).includes('_next'))) {
        return;
      } else {
        throw err;
      }
    }
  }
};

const origRm = fs.rm;
if (origRm) {
  fs.rm = function(p, opts, callback) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    let retries = 60;
    function attempt() {
      origRm.call(fs, p, opts, (err, res) => {
        if (err && (err.code === 'EPERM' || err.code === 'EBUSY') && retries-- > 0) {
          setTimeout(attempt, 100);
        } else if (err && err.code === 'EPERM' && String(p).includes('_next')) {
          if (callback) callback(null);
        } else if (callback) {
          callback(err, res);
        }
      });
    }
    attempt();
  };
}

const origRmSync = fs.rmSync;
if (origRmSync) {
  fs.rmSync = function(p, opts) {
    let retries = 60;
    while (true) {
      try {
        return origRmSync.call(fs, p, opts);
      } catch (err) {
        if ((err.code === 'EPERM' || err.code === 'EBUSY') && retries-- > 0) {
          const end = Date.now() + 100;
          while (Date.now() < end) {}
        } else if (err.code === 'EPERM' && String(p).includes('_next')) {
          return;
        } else {
          throw err;
        }
      }
    }
  };
}

const origPromisesRm = fs.promises.rm;
if (origPromisesRm) {
  fs.promises.rm = async function(p, opts) {
    let retries = 60;
    while (true) {
      try {
        return await origPromisesRm.call(fs.promises, p, opts);
      } catch (err) {
        if ((err.code === 'EPERM' || err.code === 'EBUSY') && retries-- > 0) {
          await new Promise((r) => setTimeout(r, 100));
        } else if (err.code === 'EPERM' && String(p).includes('_next')) {
          return;
        } else {
          throw err;
        }
      }
    }
  };
}

const origUnlink = fs.unlink;
fs.unlink = function(p, callback) {
  let retries = 60;
  function attempt() {
    origUnlink.call(fs, p, (err, res) => {
      if (err && (err.code === 'EPERM' || err.code === 'EBUSY') && retries-- > 0) {
        setTimeout(attempt, 100);
      } else if (err && err.code === 'EPERM' && (String(p).includes('.next') || String(p).includes('out'))) {
        if (callback) callback(null);
      } else if (callback) {
        callback(err, res);
      }
    });
  }
  attempt();
};

const origUnlinkSync = fs.unlinkSync;
fs.unlinkSync = function(p) {
  let retries = 60;
  while (true) {
    try {
      return origUnlinkSync.call(fs, p);
    } catch (err) {
      if ((err.code === 'EPERM' || err.code === 'EBUSY') && retries-- > 0) {
        const end = Date.now() + 100;
        while (Date.now() < end) {}
      } else if (err.code === 'EPERM' && (String(p).includes('.next') || String(p).includes('out'))) {
        return;
      } else {
        throw err;
      }
    }
  }
};

const origPromisesUnlink = fs.promises.unlink;
fs.promises.unlink = async function(p) {
  let retries = 60;
  while (true) {
    try {
      return await origPromisesUnlink.call(fs.promises, p);
    } catch (err) {
      if ((err.code === 'EPERM' || err.code === 'EBUSY') && retries-- > 0) {
        await new Promise((r) => setTimeout(r, 100));
      } else if (err.code === 'EPERM' && (String(p).includes('.next') || String(p).includes('out'))) {
        return;
      } else {
        throw err;
      }
    }
  }
};

