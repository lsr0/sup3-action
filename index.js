const core = require('@actions/core');
import { writeFile, mkdir } from 'fs/promises';
import { platform, homedir } from 'os';

const tc = require('@actions/tool-cache');

const sup3_version = "v0.4.0"

function key(key_name) {
    const raw = core.getInput(key_name);
    const sanitised = raw.split('\n', 1)[0].strip();
    return sanitised;
}

const aws_conf = `
[default]
aws_access_key_id = ${key("access_key")}
aws_secret_access_key = ${key("secret_key")}
`

async function write_credentials(conf) {
    const aws_config_path = `${homedir}/.aws`;
    await mkdir(aws_config_path);
    await writeFile(`${aws_config_path}/credentials`, conf);
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
    const sup3_path = '/sup3'
    await mkdir(sup3_path);
    const settings = platform_settings();
    const tool = await tc.downloadTool(`https://github.com/lsr0/sup3/releases/download/${sup3_version}/sup3-${settings.name}-x64_64-${sup3_version}.${settings.suffix}`);
    const extracted = await settings.extract(tool, sup3_path);
    core.addPath(extracted);
}


try {
    const written = write_credentials(aws_conf);
    const fetched = fetch_sup3();
    await written;
    await fetched;
} catch (error) {
    core.setFailed(error.message);
}

