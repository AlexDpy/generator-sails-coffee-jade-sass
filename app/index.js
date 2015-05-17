var generators = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var ncp = require('ncp').ncp;
var fs = require('fs');

module.exports = generators.Base.extend({

    constructor: function () {
        generators.Base.apply(this, arguments);

        this.argument('appname', {type: String, required: false})
    },

    initializing: function () {
        this.log(yosay(
                'This is a Sails '
                + chalk.green('coffee') + '/'
                + chalk.red('jade') + '/'
                + chalk.yellow('sass') + ' generator !'
            ));
    },

    prompting: function () {
        var done = this.async();

        var promptAppname = function () {
            this.prompt([
                {
                    type: 'input',
                    name: 'appname',
                    message: 'What is your project name ?',
                    default: this.appname
                }
            ], function (answers) {
                answers.appname = answers.appname.trim();

                if (answers.appname.length < 1) {
                    this.log('Please provide a name for your application.');

                    return promptAppname();
                } else if (this.dest.exists(answers.appname)) {
                    this.log('The folder ' + chalk.yellow(answers.appname) + ' already exists. Please provide another name for your application.');

                    return promptAppname();
                } else {
                    this.appname = answers.appname;

                    done();
                }
            }.bind(this));

        }.bind(this);

        promptAppname();
    },

    writing: function () {
        ncp(this.sourceRoot(), this.destinationRoot(this.appname));
    },

    install: function () {
        this.installDependencies();
    }
});
