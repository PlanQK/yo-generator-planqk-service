/*
 * Copyright (c) 2022. StoneOne AG
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const AdmZip = require('adm-zip');
const axios = require('axios');
const chalk = require('chalk');

module.exports.downloadTemplate = async (version, yo) => {
  try {
    const config = {
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0',
      },
      responseType: 'arraybuffer',
    };
    yo.log(`• ${chalk.green('Download')} PlanQK Service template archive`);
    const t = await axios.get(`https://storage.googleapis.com/yeoman-templates/${version}/template.zip`, config);
    yo.log(`• ${chalk.green('Extract')} archive to '${yo.options.name}' directory`);
    new AdmZip(t.data, {}).extractAllTo(yo.destinationPath(yo.options.name), false);
  } catch (err) {
    yo.log.error(`Error fetching the template: ${chalk.red(err.message)}`);
  }
};

module.exports.initGit = (yo) => {
  yo.spawnCommandSync('git', ['init', '-b', 'main']);
};
