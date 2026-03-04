#!/usr/bin/env node

import path from 'node:path';
import url from 'node:url';

import { parseArgs } from 'node:util';

import fs from 'fs-extra';
import prompts from 'prompts';

const main = async () => {

  // package
  const bridgePackage = { name: '@where-org/where-bridge', version: '^1.0.0', };

  // args
  const { positionals } = parseArgs({

    allowNegative: true,
    allowPositionals: true,

  });

  const [name] = positionals;

  // prompt
  const result = await prompts([{
    // name
    type   : name ? null : 'text',
    name   : 'name',
    message: ':Please enter the where-bridge name:',
    initial: 'where-bridge'
  }]);

  const packageName = name ?? result.name;

  const srcDir = path.resolve(import.meta.dirname, 'templates'),
        destDir = path.resolve(process.cwd(), packageName);

  fs.copySync(srcDir, destDir);

  // package.json
  const packageJsonPath = path.resolve(destDir, 'package.json'),
        packageJson = JSON.parse(fs.readFileSync(packageJsonPath));

  packageJson.dependencies[bridgePackage.name] = bridgePackage.version;

  fs.writeFileSync(
    packageJsonPath, JSON.stringify({ ...packageJson, name: packageName }, null, 2)
  );

  console.log(`
  cd ${packageName}
  npm i
  # Before starting, install the required where-bridge-app modules and edit config/bridge-app.yaml.
  npm start`);

};

main();
