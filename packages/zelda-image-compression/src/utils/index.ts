import fs from 'fs-extra'
import sharp from 'sharp'

/**
 * get png dimensions
 * @param path
 */
export const getDimensions = async (path: string) => {
    // console.log(path)
    return await sharp(path).metadata()
}

export const getFirstFrame = async (path: string) => {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, files) => {
            if (err)
                reject(err)

            if (files.length > 0)
                resolve(files[0])

            else
                resolve('')
        })
    }) as Promise<string>
}

export const resetSize = (inputDirectory: string, outputDirectory: string, targetWidth: number, targetHeight: number) => {
    fs.readdir(inputDirectory, (err, files) => {
        if (err)
            throw err

        files.forEach((file) => {
            if (file.endsWith('.png')) {
                sharp(`${inputDirectory}/${file}`)
                    .resize(targetWidth, targetHeight)
                    .toFile(`${outputDirectory}/${file}`, (err) => {
                        if (err)
                            throw err
                        console.log(`Resized ${file}`)
                    })
            }
        })
    })
}
