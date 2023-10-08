import path from 'node:path'
import { execSync } from 'node:child_process'
import parseApng from 'apng-js'
import { consola } from 'consola'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Assembler from 'apng-assembler'
import fs from 'fs-extra'

import { isExists } from './compression'
import { getDimensions, getFirstFrame, resetSize } from './'

let rootPath = ''

try {
    rootPath = execSync('git rev-parse --show-toplevel', { encoding: 'utf-8' }).trim()
}
catch (error) {
    console.error('获取Git工作空间路径失败:', error)
}

/**
 * blob to image
 * @param blob
 * @param outputFilePath
 */
async function blobToImage(blob: any, outputFilePath: string) {
    try {
        const buffer = await blob.arrayBuffer()
        // eslint-disable-next-line n/prefer-global/buffer
        fs.writeFileSync(outputFilePath, Buffer.from(buffer))
        console.log('图像保存成功！')
    }
    catch (error) {
        console.error(error)
    }
}

/**
 * detachApng to png
 * @param inputPath
 */
const detachApng = async (inputPath: string) => {
    const data = fs.readFileSync(inputPath)
    const anim = parseApng(data)
    const outputPath = path.resolve(rootPath, 'apng-out')

    if (!await isExists(outputPath))
        fs.ensureDirSync(outputPath)
            ;

    (anim as any).frames.forEach(async (frame: any, index: any) => {
        const outputFilePath = `${outputPath}/frame_${index}.png`

        await blobToImage(frame.imageData, outputFilePath)

        console.log(`Frame ${index} saved as ${outputFilePath}`)
    })
}

/**
 * png assemble Apng
 */
const assembleApng = async () => {
    const firstFramePath = await getFirstFrame(path.resolve(rootPath, 'apng-out'))
    const {
        width,
        height,
    } = await getDimensions(path.resolve(rootPath, 'apng-out', firstFramePath))

    consola.info('分离图片大小标准化')
    resetSize(path.resolve(rootPath, 'apng-out'), path.resolve(rootPath, 'apng-standard'), width!, height!)

    Assembler.assemble(
        path.resolve(rootPath, 'apng-standard/*.png'),

        'output.png',
        {
        },
    ).then(
        () => {
            consola.success('合成完成.')
        },
        (error: Error) => {
            console.error('assemble error', error)
        },
    )
    consola.info('合成中，时间较长，请耐心等待')
}

const hanldeApng = async () => {
    consola.info('apng开始单帧分离')
    await detachApng(path.resolve(__dirname, './apng图片.png'))
    consola.info('分离完成')

    consola.info('png开始合成apng')
    await assembleApng()
}

export {
    detachApng,
    assembleApng,
}

export default hanldeApng
