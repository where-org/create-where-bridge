#!/usr/bin/env node

import path from 'node:path';
import * as where from '@where-org/where-bridge';

const resolve = (module) => {
  return module.indexOf('#module') === -1 ? import.meta.resolve(module) : module;
};

// main
const main = async (dir) => {

  // config
  const bridgeConfig = await where.loadConfig(dir);

  const bridgeAppConfig = Object.entries(bridgeConfig.app).reduce((o, [k, v]) => (
    { ...o, [k]: { ...v, importPath: resolve(v.app.module) } }
  ), {});

  const bridgeAppMergedConfig = await where.mergeSpec(bridgeAppConfig, bridgeConfig.spec);

  // bridge
  const bridge = await where.createBridge({ ...bridgeConfig, app: bridgeAppMergedConfig });
  await bridge.listen();

}

const [, , dir] = process.argv;
main(path.resolve(...(dir ? [dir] : [import.meta.dirname, '../config'])));
