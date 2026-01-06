import * as os from 'os'
import * as path from 'path'
import * as core from '@actions/core'
import * as io from '@actions/io'
import * as tc from '@actions/tool-cache'
import * as exec from '@actions/exec'

/**
 * Installs Mill wrapper and adds it to PATH.
 *
 * Throws error if the installation fails.
 */
export async function install(wrapperUrl: string): Promise<void> {
  try {
    const binary = path.join(os.homedir(), 'bin')
    await io.mkdirP(binary)

    const millPath = path.join(binary, 'mill')

    core.debug(`Downloading Mill wrapper from ${wrapperUrl}`)
    await tc.downloadTool(wrapperUrl, millPath)
    await exec.exec('chmod', ['+x', millPath], {silent: true, ignoreReturnCode: true})

    core.addPath(binary)
    core.info('✓ Mill wrapper installed')
  } catch (error: unknown) {
    core.error((error as Error).message)
    throw new Error('Unable to install Mill wrapper')
  }
}

/**
 * Removes Mill binary
 */
export async function remove(): Promise<void> {
  await io.rmRF(path.join(os.homedir(), 'bin', 'mill'))
}
