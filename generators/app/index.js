/*
 * Copyright (c) 2021-2022. StoneOne AG
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable class-methods-use-this */

const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const helper = require('./helper');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.argument('name', {
      type: String,
      required: true,
      default: 'my-service',
      desc: 'Name of the new service',
    });
  }

  initializing() {
    // not implemented
  }

  async prompting() {
    this.props = {
      version: 'latest',
      initGit: true,
    };
    // Have Yeoman greet the user.
    this.log(yosay(`Welcome to the delightful ${chalk.red('PlanQK Service')} generator!`));

    const versionQuestion = {
      type: 'list',
      name: 'version',
      message: 'Tell me which version of the template files you want to use:',
      default: 'latest',
      choices: [
        { name: 'Latest version (works with platform.planqk.de)', value: 'latest', short: 'latest' },
        { name: 'Experimental (may not work as expected)', value: 'next', short: 'next' },
      ],
      store: true,
    };
    Object.assign(this.props, await this.prompt(versionQuestion));

    const initGitQuestion = {
      type: 'confirm',
      name: 'initGit',
      message: 'Do you want to develop in a Git repo?',
      default: true,
      store: true,
    };
    Object.assign(this.props, await this.prompt(initGitQuestion));
  }

  configuring() {
    // not implemented
  }

  async writing() {
    await helper.downloadTemplate(this.props.version, this);
  }

  async install() {
    if (this.props.initGit) {
      this.fs.commit(() => {
        process.chdir(this.destinationPath(this.options.name));
        helper.initGit(this);
      });
    }
  }

  end() {
    this.log(`Everything initialized for you. ${chalk.green('Happy coding!')}`);
  }
};
