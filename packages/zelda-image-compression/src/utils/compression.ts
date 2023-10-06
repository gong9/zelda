import path from 'node:path'
import { execSync } from 'node:child_process'
import imageminJpegtran from 'imagemin-jpegtran'
import imageminPngquant from 'imagemin-pngquant'
import { consola } from 'consola'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs-extra'

const map = new Map<string, string>()

const compress = async (imgPath: string, rootPath: string) => {
    const imagemin = (await import('imagemin')).default
    const uuid = uuidv4()
    const temp = path.resolve(rootPath, 'image-temp', uuid)

    map.set(imgPath, path.join(temp, path.basename(imgPath)))

    const files = await imagemin([imgPath], {
        destination: temp,
        plugins: [
            imageminJpegtran(),
            imageminPngquant({
                quality: [0.6, 0.8],
            }),
        ],
    })

    return files
}

async function remove(filePath: string) {
    const files = fs.readdirSync(filePath)
    for (let i = 0; i < files.length; i++) {
        const newPath = path.join(filePath, files[i])
        const stat = fs.statSync(newPath)
        if (stat.isDirectory())
            remove(newPath)
        else
            fs.unlinkSync(newPath)
    }
    fs.rmdirSync(filePath)
}

async function move(srcPath: string, path: string) {
    try {
        await fs.move(srcPath, path, { overwrite: true })
    }
    catch (err) {
        consola.error(err)
    }
}

async function isExists(path: string) {
    return await fs.pathExists(path)
}

const handleCompress = async (pathArr: string[], rootPath: string) => {
    if (pathArr.length === 0)
        return

    const result = await consola.prompt('是否执行压缩', {
        type: 'confirm',
    })

    if (!result)
        return

    consola.info('开始压缩')
    const tempPath = path.resolve(rootPath, 'image-temp')

    if (await isExists(tempPath))
        await remove(tempPath)

    const res = await Promise.allSettled(pathArr.map(img => compress(img, rootPath)))

    // map.forEach(async (item, key) => {
    //     await move(item, key)
    //     map.delete(key)
    // })

    const keyIterator = map.keys()
    let isDone = false

    while (!isDone) {
        const { value: key, done } = keyIterator.next()
        isDone = !!done

        if (!isDone) {
            await move(map.get(key)!, key)
            map.delete(key)
        }
    }

    if (map.size === 0) {
        await remove(tempPath)
        consola.success('需要处理的文件已经压缩完成')
    }

    const rejectedImage = res.filter((item) => {
        return item.status === 'rejected'
    })

    if (rejectedImage.length > 0)
        consola.warn('存在未完成压缩的文件', rejectedImage)
    else
        execSync('git add .')
}

export default handleCompress
