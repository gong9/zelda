import path from 'node:path'
import { readFile } from 'node:fs/promises'
import { execSync } from 'node:child_process'
import imageminJpegtran from 'imagemin-jpegtran'
import imageminPngquant from 'imagemin-pngquant'
import { consola } from 'consola'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs-extra'

const map = new Map<string, string>()

/**
 * isApng, apng handle separately
 * @param path
 * @returns
 */
const isApng = async (path: string) => {
    const isApng = (await import('is-apng')).default
    const buffer = await readFile(path)

    return (/\.(png)$/g.test(path)) && isApng(buffer)
}

/**
 * compress
 * @param imgPath
 * @param rootPath
 * @returns
 */
const compress = async (imgPath: string, rootPath: string) => {
    const imagemin = (await import('imagemin')).default
    const imageminWebp = (await import('imagemin-webp')).default
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
            imageminWebp({ quality: 80 }),
        ],
    })

    return files
}

/**
 * remove file
 * @param filePath
 */
export const remove = async (filePath: string) => {
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

/**
 * move
 * @param srcPath
 * @param path
 */
const move = async (srcPath: string, path: string) => {
    try {
        await fs.move(srcPath, path, { overwrite: true })
    }
    catch (err) {
        consola.error(err)
    }
}

export const isExists = async (path: string) => {
    return await fs.pathExists(path)
}

/**
 * start compress
 * @param pathArr
 * @param rootPath
 * @returns
 */
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

    const filterpPathArr = pathArr.filter(async path => !await isApng(path))
    const res = await Promise.allSettled(filterpPathArr.map(img => compress(img, rootPath)))

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
        if (await isExists(tempPath))
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
