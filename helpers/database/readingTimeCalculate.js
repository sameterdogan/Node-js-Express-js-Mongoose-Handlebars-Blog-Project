const readingTimeCalculate = (content) => {
    let wordLength = content.split(' ').length
    let readingTime = wordLength / 200

    return Math.ceil(readingTime)
}

module.exports = readingTimeCalculate
