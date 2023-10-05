import { exec } from 'node:child_process'
import { consola } from 'consola'

const REGEX = /\.(jpg|jpeg|png|gif)$/i

const execDiff = () => {
  const command = 'git diff --cached --name-only'
  const imagePathList: string[] = []

  // eslint-disable-next-line promise/param-names
  return new Promise((res, rej) => {
    exec(command, async (err, stdout: string) => {
      if (err) {
        console.error(err)
        rej(err)
      }
      else {
        if (!stdout) {
          consola.info('本次提交暂无图片资源的改动')
          res(imagePathList)
        }

        else {
          stdout.split('\n').forEach((item) => {
            if (REGEX.test(item))
              imagePathList.push(item)
          })

          if (imagePathList.length > 0)
            consola.info(`检测到图片资源: ${imagePathList.join(', ')}`)
          else
            consola.info('本次提交无图片资源的改动')

          res(imagePathList)
        }
      }
    })
  })
}

export default execDiff
