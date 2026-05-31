module.exports = {
    apps: [
        {
            name: 'edupay-api',
            cwd: '../server',
            script: 'npm',
            args: 'start',
        },
        {
            name: 'edupay-worker',
            cwd: '../server',
            script: 'npm',
            args: 'run worker',
        },
    ],
};
