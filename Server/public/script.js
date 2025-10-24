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
    const thumbnail = document.querySelector('.thumbnail');
    

    thumbnail.innerHTML = '';
    thumbnailList.forEach((thumb, index) => {
        if (thumb.link !== '') {
            const linkContainer = document.createElement('a');
            linkContainer.classList.add('video_link');
            linkContainer.href = thumb.link;
            linkContainer.target = 'video_container';

            linkContainer.textContent = `Video ${index + 1}`
            thumbnail.append(linkContainer);
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


