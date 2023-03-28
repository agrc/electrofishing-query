/* eslint-disable camelcase */
module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    var otherFiles = [
        '_src/app/**/*.html',
        '_src/index.html',
        '_src/ChangeLog.html'
    ];
    var gruntFile = 'Gruntfile.js';
    var jsFiles = ['_src/app/**/*.js', gruntFile];
    var bumpFiles = [
        'package.json',
        'package-lock.json',
        'bower.json',
        '_src/app/package.json',
        '_src/app/config.js'
    ];

    grunt.initConfig({
        babel: {
            options: {
                sourceMap: true,
                presets: ['latest'],
                plugins: [
                    'transform-remove-strict-mode',
                    ['transform-inline-environment-variables', {
                        include: [
                            'API_KEY',
                            'FIREBASE_CONFIG',
                            'QUAD_WORD'
                        ]
                    }]
                ]
            },
            src: {
                files: [
                    {
                        expand: true,
                        cwd: '_src/app/',
                        src: ['**/*.js'],
                        dest: 'src/app/'
                    }
                ]
            }
        },
        bump: {
            options: {
                files: bumpFiles,
                commitFiles: bumpFiles.concat(['_src/ChangeLog.html']),
                push: false
            }
        },
        clean: {
            src: ['src/app'],
            dist: ['dist']
        },
        connect: {
            uses_defaults: {}
        },
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['*.html'],
                        dest: 'dist/'
                    }
                ]
            },
            src: {
                expand: true,
                cwd: '_src',
                src: ['**/*.html', '**/*.png', '**/*.jpg', 'app/package.json'],
                dest: 'src'
            }
        },
        dojo: {
            prod: {
                options: {
                    profiles: [
                        'profiles/prod.build.profile.js',
                        'profiles/build.profile.js'
                    ]
                }
            },
            stage: {
                options: {
                    profiles: [
                        'profiles/stage.build.profile.js',
                        'profiles/build.profile.js'
                    ]
                }
            },
            options: {
                dojo: 'src/dojo/dojo.js',
                load: 'build',
                releaseDir: '../dist',
                requires: ['src/app/packages.js', 'src/app/run.js'],
                basePath: './src'
            }
        },
        eslint: {
            main: {
                src: jsFiles
            }
        },
        imagemin: {
            main: {
                options: {
                    optimizationLevel: 3
                },
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        // exclude tests because some images in dojox throw errors
                        src: ['**/*.{png,jpg,gif}', '!**/tests/**/*.*'],
                        dest: 'src/'
                    }
                ]
            }
        },
        jasmine: {
            main: {
                src: ['src/app/run.js'],
                options: {
                    specs: ['src/app/**/spec/Spec*.js'],
                    vendor: [
                        'src/app/tests/jasmineTestBootstrap.js',
                        'src/dojo/dojo.js',
                        'src/app/packages.js',
                        'src/app/tests/jasmineAMDErrorChecking.js'
                    ],
                    host: 'http://localhost:8000'
                }
            }
        },
        pkg: grunt.file.readJSON('package.json'),
        processhtml: {
            options: {},
            main: {
                files: {
                    'dist/index.html': ['src/index.html']
                }
            }
        },
        stylus: {
            main: {
                options: {
                    compress: false,
                    'resolve url': true
                },
                files: [
                    {
                        expand: true,
                        cwd: '_src/',
                        src: ['app/resources/App.styl'],
                        dest: 'src/',
                        ext: '.css'
                    }
                ]
            }
        },
        uglify: {
            options: {
                preserveComments: false,
                sourceMap: true,
                compress: {
                    drop_console: true,
                    passes: 2,
                    dead_code: true
                }
            },
            stage: {
                options: {
                    compress: {
                        drop_console: false
                    }
                },
                src: ['dist/dojo/dojo.js'],
                dest: 'dist/dojo/dojo.js'
            },
            prod: {
                files: [
                    {
                        expand: true,
                        cwd: 'dist',
                        src: ['**/*.js', '!proj4/**/*.js'],
                        dest: 'dist'
                    }
                ]
            }
        },
        watch: {
            src: {
                files: jsFiles.concat(otherFiles),
                options: { livereload: true },
                tasks: ['eslint', 'newer:babel', 'newer:copy:src']
            },
            stylus: {
                files: '_src/app/**/*.styl',
                options: { livereload: true },
                tasks: ['stylus']
            }
        }
    });

    grunt.registerTask('default', [
        'eslint',
        'clean:src',
        'babel',
        'stylus',
        'copy:src',
        'connect',
        'jasmine:main:build',
        'watch'
    ]);
    grunt.registerTask('build-prod', [
        'clean',
        'babel',
        'stylus',
        'copy:src',
        'newer:imagemin:main',
        'dojo:prod',
        'uglify:prod',
        'copy:dist',
        'processhtml:main'
    ]);
    grunt.registerTask('build-stage', [
        'clean',
        'babel',
        'stylus',
        'copy:src',
        'newer:imagemin:main',
        'dojo:stage',
        'uglify:stage',
        'copy:dist',
        'processhtml:main'
    ]);
    grunt.registerTask('test', [
        'babel',
        'copy:src',
        'connect',
        'jasmine'
    ]);
    grunt.registerTask('ci-tests', [
        'eslint',
        'test'
    ]);
};
