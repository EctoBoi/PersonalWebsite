/*
<body>
  <div id="gallery">
    <img class="gallery-img" src="https://www.discoverboating.com/sites/default/files/inline-images/lake-tahoe.jpg" >
    <img class="gallery-img" src="https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80">
    <img class="gallery-img" src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg/640px-Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg">
    <img class="gallery-img" src="https://upload.wikimedia.org/wikipedia/commons/5/50/Salta-VallesCalchaquies-P3140151.JPG">
  </div>
</body>
*/



let galleryImgs = document.getElementsByClassName("gallery-img")
let imgDefaultHeight = 130
let imgDefaultWidth = 200

setImgOnClick()
setImgSize()

window.onresize = function() {
    setImgSize()
}

function setImgOnClick() {
    for (let i = 0; i < galleryImgs.length; i++) {
        galleryImgs[i].onclick = expand
    }
}

function expand() {
    if (this.expanded === undefined)
        this.expanded = false

    if (this.expanded) {
        for (let j = 0; j < galleryImgs.length; j++) {
            let img = galleryImgs[j]
            img.hidden = false
        }
        this.style.height = imgDefaultHeight + 'px'
        this.style.width = imgDefaultWidth + 'px'
    } else {
        for (let j = 0; j < galleryImgs.length; j++) {
            let img = galleryImgs[j]
            if (img != this) {
                img.hidden = true
            } else {
                this.style.width = (this.width * 2) + 'px'
                this.style.height = (this.height * 2) + 'px'
            }
        }
    }

    this.expanded = !this.expanded
}

function setImgSize() {
    let gallery = document.getElementById('gallery')
    imgDefaultHeight = gallery.clientWidth / 4
    imgDefaultWidth = gallery.clientWidth * 0.39

    for (let i = 0; i < galleryImgs.length; i++) {
        if (galleryImgs[i].expanded) {
            galleryImgs[i].style.height = (imgDefaultHeight * 2) + 'px'
            galleryImgs[i].style.width = (imgDefaultWidth * 2) + 'px'
        } else {
            galleryImgs[i].style.height = imgDefaultHeight + 'px'
            galleryImgs[i].style.width = imgDefaultWidth + 'px'
        }

        galleryImgs[i].style.margin = (gallery.clientWidth * 0.05) + 'px'
    }
}