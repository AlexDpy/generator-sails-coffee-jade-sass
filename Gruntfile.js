module.exports = function(grunt) {

    grunt.initConfig({
        clean: {
            sails: {
                src: '__sails__'
            },
            templates: {
                src: 'app/templates'
            },
            sails_node_modules: {
                src: '__sails__/node_modules'
            }
        },
        shell: {
            sails: {
                command: 'sails new __sails__ --viewEngine=jade'
            }
        },
        js2coffee: {
            options: {
                indent: "    "
            },
            coffee: {
                expand: true,
                cwd: '__sails__',
                src: '{api,config}/**/*.js',
                dest: 'app/templates',
                ext: '.coffee'
            }
        },
        copy: {
            resources: {
                expand: true,
                cwd: 'resources',
                src: ['**/*', '**/.*'],
                dest: 'app/templates'
            },
            gitignore: {
                expand: true,
                cwd: '__sails__',
                src: '.gitignore',
                dest: 'app/templates',
                options: {
                    process: function (content, srcpath) {
                        return content.replace(/local\.js/g, 'local.coffee');
                    }
                }
            },
            app: {
                expand: true,
                cwd: '__sails__',
                src: [
                    '**/*',
                    '**/.*',
                    '!node_modules/*',
                    '!<%= js2coffee.coffee.src %>',
                    '!.editorconfig',
                    '!<%= copy.gitignore.src %>'
                ],
                dest: 'app/templates'
            }
        },
        json_massager: {
            'package.json': {
                files: {
                    'app/templates/package.json': ['app/templates/package.json']
                },
                modifier: function (obj) {
                    obj.dependencies['coffee-script'] = '~1.9.2';
                    obj.dependencies['jade'] = '~1.9.2';
                    delete obj.dependencies.ejs;

                    obj.author = '';
                    obj.repository = {};

                    return obj;
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-js2coffee');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-json-massager');

    grunt.registerTask('default', []);

    grunt.registerTask('build', [
        'clean:sails',
        'clean:templates',
        'shell:sails',
        'clean:sails_node_modules',
        'js2coffee',
        'copy:resources',
        'copy:gitignore',
        'copy:app',
        'json_massager:package.json'
    ]);
};
