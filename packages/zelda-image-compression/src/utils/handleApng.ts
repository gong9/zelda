import path from 'node:path'
import { execSync } from 'node:child_process'
import parseApng from 'apng-js'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Assembler from 'apng-assembler'
import fs from 'fs-extra'

let rootPath = ''

try {
    rootPath = execSync('git rev-parse --show-toplevel', { encoding: 'utf-8' }).trim()
}
catch (error) {
    console.error('获取Git工作空间路径失败:', error)
}

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

const compressApng = (inputPath: string) => {
    const data = fs.readFileSync(inputPath)
    const anim = parseApng(data)
    const outputPath = path.resolve(rootPath, 'apng-out');

    (anim as any).frames.forEach(async (frame: any, index: any) => {
        const outputFilePath = `${outputPath}/frame_${index}.png`

        await blobToImage(frame.imageData, outputFilePath)

        console.log(`Frame ${index} saved as ${outputFilePath}`)
    })
}

Assembler.assemble(

    path.resolve(rootPath, 'apng-out/*.png'),

    'output.png',
    {
        loopCount: 0,
        frameDelay: 100,
        compression: Assembler.COMPRESS_7ZIP,
    },
).then(
    () => {
        console.log('has been assembled successfully.')
    },
    (error: any) => {
        console.error(`Failed to assemble: ${error.message}`)
        console.error(`stdout: ${error.stdout}`)
        console.error(`stderr: ${error.stderr}`)
    },
)

compressApng(path.resolve(__dirname, './test.png'))
