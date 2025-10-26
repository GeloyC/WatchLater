//  import { response } from "express";

const url = 'http://localhost:5000';
let thumbnailList = [];

function createThumb() {
    let link_input = document.querySelector('.link_input').value;

    function parseIframeAttributes(iframe) {
        const regex = /(\w+)(?:="([^"]*)")?/g;
        const attrs = {};

        let match;

        while((match = regex.exec(iframe))) {
            const [, key, value ] = match;

            attrs[key] = value !== undefined ? value : true; 
        }

        return attrs;
    }

    const clean_embed_link = parseIframeAttributes(link_input);

    fetch(`${url}/yt_link`, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        }, 
        body: JSON.stringify({
            yt_link: clean_embed_link.src,
            yt_title: clean_embed_link.title
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error: ', error);
        });

    window.location.reload();
}





function displayNewVideo () {
    const thumbnail = document.querySelector('.thumbnail');
    
    
    fetch(`${url}/yt_link_list`)
        .then(response => response.json())
        .then(data => {
            thumbnail.innerHTML = '';
            data.forEach((thumb, index) => {
                if (thumb.link !== '') {
                    const linkWrapper = document.createElement('div');
                    linkWrapper.classList.add('link_wrapper');
                    linkWrapper.dataset.id = thumb.link_id;
                    linkWrapper.dataset.title = thumb.video_title;

                    const linkContainer = document.createElement('a');
                    linkContainer.classList.add('video_link');
                    linkContainer.href = thumb.video_link;
                    linkContainer.target = 'video_container';
                    linkContainer.textContent = thumb.video_title;

                    const button_delete = document.createElement('button');
                    button_delete.classList.add('btn_delete_link');
                    button_delete.textContent = 'DELETE'
                    

                    thumbnail.append(linkWrapper);
                    linkWrapper.append(linkContainer, button_delete);


                    button_delete.addEventListener('click', async () => {
                        try {
                            const response = await fetch(`${url}/yt_link_delete/${thumb.link_id}`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type' : 'application/json',
                                }
                            })

                            const data = await response.json();
                            if (response.ok) {
                                console.log(data.message);
                                linkWrapper.remove();
                            } else {
                                console.error('Delete failed:', data.error);
                            }

                        } catch(err) {
                            console.error('Error deleting link:', err);
                        }

                        console.log('Delete button is working! for: ', thumb.link_id)
                    })

                    

                } else {
                    console.log('Cant!')
                }
            }
        )
    })
    .catch((err) => {
        console.error('Error fetching data: ', err)
    }); 

}



document.addEventListener('DOMContentLoaded', () => {
    const currentVideoTitle = document.querySelector('.video_title');
    const videoDisplayer = document.querySelector('.video_container');

    if (!currentVideoTitle) {
        console.error('.video_title element not found!');
        return;
    }

    // One listener for ALL .video_link clicks (even future ones)
    document.addEventListener('click', (e) => {
        const link = e.target.closest('.video_link');
        if (!link) return; // Not a .video_link

        const youtubeUrl = link.getAttribute('href');
        videoDisplayer.src = youtubeUrl;

        console.log(youtubeUrl)
        
        const title = link.dataset.title || link.textContent.trim();
        console.log('Video clicked:', title); // This WILL show now

        currentVideoTitle.textContent = title;
    });
});






const btn_addLink = document.querySelector('.button_addLink');
btn_addLink.addEventListener('click', () => {
    
    createThumb();
    displayNewVideo();
    document.querySelector('.link_input').value = '';
})

displayNewVideo();

window.onload = (event) => {
    displayNewVideo();
};

