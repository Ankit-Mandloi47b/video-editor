export const downloadContentFromUrl = (url) => {
    const mylink = document.createElement('a')
    mylink.setAttribute('download', 'recordingVideo')
    mylink.setAttribute('href', url)
    mylink.click()
}