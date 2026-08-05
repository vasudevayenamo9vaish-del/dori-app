const { spawn } = require('child_process');

const email = `test.user.${Date.now()}@gmail.com`;
const password = "Password123!@#";

const surge = spawn('npx', ['surge', './dist', `dori-fixed-${Date.now()}.surge.sh`]);

surge.stdout.on('data', (data) => {
    const text = data.toString();
    console.log(`STDOUT: ${text}`);
    if (text.includes('email:')) {
        surge.stdin.write(email + '\n');
    } else if (text.includes('password:')) {
        surge.stdin.write(password + '\n');
    }
});

surge.stderr.on('data', (data) => {
    console.log(`STDERR: ${data.toString()}`);
});

surge.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});
