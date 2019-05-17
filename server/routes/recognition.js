const { Router } = require('express')
const router = Router()
const fs = require('fs')
const path = require('path')

router.post('/recognition', function(req, res, next) {
	const recognitionImage = req.body.recognitionImage
	let name = req.body.imgName,
    folderName = req.body.folderName

	let base64Data = recognitionImage.replace(/^data:image\/\w+;base64,/, '')
  	let dataBuffer = new Buffer(base64Data, 'base64')
    const imgDisPath = path.join(__dirname, '../../../').split(path.sep).join('/')

    let writeFlieImg = () => {
        fs.writeFile(`${imgDisPath}/images/${folderName}/${name}.jpg`, dataBuffer, (error) => {
            if (error) {
                console.log('ダウンロード失敗',error);
            } else {
                console.log('ダウンロード成功！')
            }
        })
    }

    let writeFlieFolderImages = () => {
        fs.access(`${imgDisPath}/images/${folderName}`, fs.constants.F_OK, (err) => {
            if(err != null && err.code == 'ENOENT') {
                fs.mkdir(`${imgDisPath}/images/${folderName}`, (err) => {
                    if(err) {

                    } else {
                        writeFlieImg()
                        res.json('成功')
                    }
                })
            } else if(err == null) {
                writeFlieImg()
                res.json('成功')
            }
        })
    }

    fs.access(`${imgDisPath}/images`, fs.constants.F_OK, (err) => {
        if(err != null && err.code == 'ENOENT') {
            fs.mkdir(`${imgDisPath}/images`, (err) => {
                if(err) {

                } else {
                    writeFlieFolderImages()
                }
            })
        } else if(err == null) {
            writeFlieFolderImages()
        }
    })
	
})

router.post('/getPath', function(req, res, next) {
    res.json(path.join(__dirname, '../../../'))
})



module.exports = router
