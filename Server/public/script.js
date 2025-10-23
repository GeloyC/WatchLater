let thumbnailList = [];

function createThumb() {
    let link_input = document.querySelector('.link_input').value;
    let linkEmbed = link_input.replace('watch?v=', 'embed/');


    thumbnailList.push({
        link: linkEmbed,
    });

    console.log('ThumbList: ', thumbnailList);

}

function clearLinkInput() {
    document.querySelector('.link_input').value = '';
}


function displayNewVideo () {
    const thumbnail = document.querySelector('.thumbnail_container');
    

    thumbnail.innerHTML = '';
    thumbnailList.forEach((thumb) => {
        const thumbnailBlock = document.createElement('div');
        thumbnailBlock.classList.add('thumbnail');

        if (thumb.link !== '') {
            const thumbnailFrame = document.createElement('iframe');
            thumbnailFrame.classList.add('thumbnail_img_container');
            thumbnailFrame.setAttribute('width', 420);
            thumbnailFrame.setAttribute('height', 315);
            thumbnailFrame.src = thumb.link;

            thumbnailBlock.append(thumbnailFrame);
            thumbnail.append(thumbnailBlock);
        } else {
            console.log('Cant!')
        }


    })

}


const btn_addLink = document.querySelector('.button_addLink');
btn_addLink.addEventListener('click', () => {
    
    createThumb();
    displayNewVideo();
    clearLinkInput();
})


