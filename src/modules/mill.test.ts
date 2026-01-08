import {existsSync} from 'fs'
import {mkdtemp, writeFile} from 'fs/promises'
import {tmpdir} from 'os'
import {join} from 'path'
import test from 'ava'
import {exec} from '@actions/exec'
import {getBundledMillPath} from './mill'

test('`getBundledMillPath()` → returns path where mill binary exists', t => {
  const millPath = getBundledMillPath()
  t.true(existsSync(millPath))
})

// This will actually execute the mill binary, so it may take some time.
test('`getBundledMillPath()` → mill binary can execute', async t => {
  const temporaryDirectory = await mkdtemp(join(tmpdir(), 'mill-test-'))
  const buildMillPath = join(temporaryDirectory, 'build.mill')
  await writeFile(buildMillPath, '//| mill-version: 1.0.6\n\ndef hello = "world"')

  const millPath = getBundledMillPath()

  const exitCode = await exec('sh', ['-c', `cd ${temporaryDirectory} && ${millPath} resolve _`], {
    ignoreReturnCode: true,
    silent: true,
  })

  t.is(exitCode, 0)
})
