"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const AdmZip = require("adm-zip");
const axios = require("axios");

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.argument("name", {
            type: String,
            required: true,
            default: "my-service",
            desc: "Name of the new service"
        });
    }

    _isSdkValid(sdk) {
        if (
            typeof sdk === "string" &&
            (sdk.toLowerCase() === "ocean" || sdk.toLowerCase() === "qiskit")
        ) {
            return true;
        }

        return false;
    }

    initializing() {}

    async prompting() {
        this.props = {};
        // Have Yeoman greet the user.
        this.log(
            yosay(
                `Welcome to the delightful ${chalk.red(
                    "PlanQK Service"
                )} generator!`
            )
        );

        const sdkQuestion = {
            type: "list",
            name: "sdk",
            message: "Tell me in which SDK you want to program:",
            default: "none",
            choices: [
                { name: "That is my secret", value: "none", short: "None" },
                { name: "DWAVE OCEAN", value: "ocean", short: "OCEAN" },
                { name: "IBM QISKIT", value: "qiskit", short: "QISKIT" }
            ],
            store: true
        };
        Object.assign(this.props, await this.prompt(sdkQuestion));

        if (this.props.sdk !== "none") {
            const installSDKQuestion = {
                type: "confirm",
                name: "installSDK",
                message: "Should I install the selected SDK via pip for you?",
                default: false,
                store: true
            };
            Object.assign(this.props, await this.prompt(installSDKQuestion));
        }

        const vsCodeLaunchConfigQuestion = {
            type: "confirm",
            name: "installLaunchConfig",
            message: "May I add a launch configuration for Visual Studio Code?",
            default: true,
            store: true
        };
        Object.assign(
            this.props,
            await this.prompt(vsCodeLaunchConfigQuestion)
        );

        const initGitQuestion = {
            type: "confirm",
            name: "initGit",
            message: "Do you want to develop in a git repo?",
            default: true,
            store: true
        };
        Object.assign(this.props, await this.prompt(initGitQuestion));
    }

    configuring() {}

    async _generateUserCodeFolder() {
        try {
            const config = {
                headers: {
                    "Cache-Control": "no-cache",
                    "Pragma": "no-cache",
                    "Expires": "0",
                },
                responseType: "arraybuffer"
            }
            this.log(`   ${chalk.green("download")} service-template`);
            const serviceTemplate = await axios.get(
                "https://storage.googleapis.com/yeoman-templates/1.0.0/service-template.zip",
                config
            );
            this.log(`   ${chalk.green("extract")} to ${this.options.name}/service-template`);
            new AdmZip(serviceTemplate.data).extractAllTo(
                this.destinationPath(this.options.name)
            );
        } catch (err) {
            this.log.error(
                "Something went wrong while fetching the template.\n" +
                    chalk.red(err.message)
            );
        }
    }

    async _generateOpenApiSpec() {
        try {
            const config = {
                headers: {
                    "Cache-Control": "no-cache",
                    "Pragma": "no-cache",
                    "Expires": "0",
                },
                responseType: "arraybuffer"
            }
            this.log(`   ${chalk.green("download")} openapi-spec.yml`);
            const openapiSpec = await axios.get(
                "https://storage.googleapis.com/yeoman-templates/1.0.0/openapi-spec.yml",
                config
            );
            this.fs.write(
                this.destinationPath(this.options.name, "openapi-spec.yml"),
                openapiSpec.data
            );
        } catch (error) {
            this.log.error(
                "Something went wrong while fetching openapi-spec template.\n" +
                    chalk.red(error.message)
            );
        }
    }

    async _generateVSCodeLaunchConfig() {
        try {
            const config = {
                headers: {
                    "Cache-Control": "no-cache",
                    "Pragma": "no-cache",
                    "Expires": "0",
                },
                responseType: "arraybuffer"
            }
            const response = await axios.get(
                "https://storage.googleapis.com/yeoman-templates/1.0.0/vscode-launch.json",
                config
            );
            this.fs.write(
                this.destinationPath(
                    this.options.name,
                    ".vscode",
                    "launch.json"
                ),
                response.data
            );
        } catch (err) {
            this.log.error(
                "Something went wrong while fetching the VSCode launch configuration.\n" +
                    chalk.red(err.message)
            );
        }
    }

    async writing() {
        await this._generateUserCodeFolder();

        await this._generateOpenApiSpec();

        if (this.props.installLaunchConfig) {
            await this._generateVSCodeLaunchConfig();
        }

        // Todo: Move requirements files to cloud storage bucket
        if (
            this._isSdkValid(this.props.sdk) &&
            this.props.sdk.toLowerCase() === "ocean"
        ) {
            this.fs.copy(
                this.templatePath(
                    "requirements-templates/requirements-ocean.txt"
                ),
                this.destinationPath(this.options.name, "requirements.txt")
            );
        }

        if (
            this._isSdkValid(this.props.sdk) &&
            this.props.sdk.toLowerCase() === "qiskit"
        ) {
            this.fs.copy(
                this.templatePath(
                    "requirements-templates/requirements-qiskit.txt"
                ),
                this.destinationPath(this.options.name, "requirements.txt")
            );
        }
    }

    conflicts() {}

    _initGit() {
        this.spawnCommandSync("git", ["init", "-b", "main"]);
    }

    async install() {
        if (this._isSdkValid(this.props.sdk) && this.props.installSDK) {
            let requirementsFilePath = this.destinationPath(
                this.options.name,
                "requirements.txt"
            );
            this.spawnCommandSync("pip", [
                "install",
                "-r",
                requirementsFilePath
            ]);
        }

        if (this.props.initGit) {
            this.fs.commit(() => {
                process.chdir(this.destinationPath(this.options.name));
                this._initGit();
            });
        }
    }

    end() {
        this.log(
            `Everything initialized for you. ${chalk.green("Happy coding!")}`
        );
    }
};
