/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {migrateDocusaurusProject} from '../index';
import path from 'path';
import fs from 'fs-extra';
import {posixPath} from '@docusaurus/utils';

async function testMigration(siteDir: string, newDir: string) {
  const writeMock = jest.spyOn(fs, 'outputFile').mockImplementation();
  const mkdirpMock = jest.spyOn(fs, 'mkdirp').mockImplementation();
  const mkdirsMock = jest.spyOn(fs, 'mkdirs').mockImplementation();
  const copyMock = jest.spyOn(fs, 'copy').mockImplementation();
  await migrateDocusaurusProject(siteDir, newDir, true, true);
  expect(
    writeMock.mock.calls.sort((a, b) =>
      posixPath(a[0] as string).localeCompare(posixPath(b[0] as string)),
    ),
  ).toMatchSnapshot('write');
  expect(
    mkdirpMock.mock.calls.sort((a, b) =>
      posixPath(a[0] as string).localeCompare(posixPath(b[0] as string)),
    ),
  ).toMatchSnapshot('mkdirp');
  expect(
    mkdirsMock.mock.calls.sort((a, b) =>
      posixPath(a[0] as string).localeCompare(posixPath(b[0] as string)),
    ),
  ).toMatchSnapshot('mkdirs');
  expect(
    copyMock.mock.calls.sort((a, b) =>
      posixPath(a[0] as string).localeCompare(posixPath(b[0] as string)),
    ),
  ).toMatchSnapshot('copy');
  writeMock.mockRestore();
  mkdirpMock.mockRestore();
  mkdirsMock.mockRestore();
  copyMock.mockRestore();
}

describe('migration test', () => {
  const fixtureDir = path.join(__dirname, '__fixtures__');
  test('simple website', async () => {
    const siteDir = path.join(fixtureDir, 'simple_website', 'website');
    const newDir = path.join(fixtureDir, 'migrated_simple_site');
    await testMigration(siteDir, newDir);
  });
  test('complex website', async () => {
    const siteDir = path.join(fixtureDir, 'complex_website', 'website');
    const newDir = path.join(fixtureDir, 'migrated_complex_site');
    await testMigration(siteDir, newDir);
  });

  test('missing versions', async () => {
    const siteDir = path.join(fixtureDir, 'missing_version_website', 'website');
    const newDir = path.join(fixtureDir, 'migrated_missing_version_site');
    await testMigration(siteDir, newDir);
  });
});
