import core from '@actions/core';
import { writeFile, mkdir } from 'fs/promises';
import { platform, homedir } from 'os';
import * as child_process from 'child_process';
import { promisify } from 'util';

import * as tc from '@actions/tool-cache';

const sup3_version = "v0.5.2"
const sup3_path = 'sup3'

const execFile = promisify(child_process.execFile);

const aws_conf = `[default]
aws_access_key_id = ${core.getInput("access_key")}
aws_secret_access_key = ${core.getInput("secret_key")}
`

const msys2_shim = `#!/bin/bash
export AWS_SHARED_CREDENTIALS_FILE=$USERPROFILE/.aws/credentials
'${process.cwd()}\\${sup3_path}\\sup3' "$*"
`

async function setup_for_msys2() {
    core.info('Detected $MSYSTEM, installing MSYS2 support');
    //const {stdout, stderr} = await execFile('C:/msys64/usr/bin/bash.exe', ['setup_for_msys2.sh', 'sup3_path']);
    //core.info(`setup_for_msys2: output:\n${stdout}`);
    //core.info(`stderr:\n${stderr}`);
    await writeFile('C:/msys64/usr/bin/sup3', msys2_shim, {mode: 0o755});
}

async function write_credentials(conf) {
    if (process.env.NO_CONFIG)
        return;
    const aws_config_path = `${homedir}/.aws`;
    await mkdir(aws_config_path);
    await writeFile(`${aws_config_path}/credentials`, conf);
    if (platform() == 'win32' && process.env.MSYSTEM)
        await setup_for_msys2();
}

function platform_settings() {
    switch (platform()) {
        case 'win32': return {
            'name': 'windows',
            'suffix': 'zip',
            'extract': tc.extractZip,
        };
        case 'linux': return {
            'name': 'linux',
            'suffix': 'tar.gz',
            'extract': tc.extractTar,
        };
        case 'darwin': return {
            'name': 'macos',
            'suffix': 'tar.gz',
            'extract': tc.extractTar,
        };
        default:
            throw new Error(`Unsupported platform ${platform()}`);
    }
}

async function fetch_sup3() {
    await mkdir(sup3_path);
    const settings = platform_settings();
    const tool_archive = `sup3-${settings.name}-x64_64-${sup3_version}.${settings.suffix}`;
    core.info(`Fetching sup3 ${sup3_version} (${tool_archive})`);
    const tool = await tc.downloadTool(`https://github.com/lsr0/sup3/releases/download/${sup3_version}/${tool_archive}`);
    core.startGroup('Extract');
    const extracted = await settings.extract(tool, sup3_path);
    core.endGroup();
    core.addPath(extracted);
    core.setOutput('path', extracted);
    core.exportVariable('SUP3_BIN', `${extracted}/sup3`);
}


try {
    const written = write_credentials(aws_conf);
    const fetched = fetch_sup3();
    await written;
    await fetched;
} catch (error) {
    core.setFailed(error.message);
}

