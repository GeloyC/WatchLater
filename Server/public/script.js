
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

    // thumbnailList.push({
    //     link: clean_embed_link.src,
    //     title:clean_embed_link.title
    // });

    fetch(`http://localhost:5000/yt_link`, {
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
}





function displayNewVideo () {
    const thumbnail = document.querySelector('.thumbnail');
    
    fetch('http://localhost:5000/yt_link_list')
        .then(response => response.json())
        .then(data => {
            thumbnail.innerHTML = '';
            data.forEach((thumb, index) => {
                if (thumb.link !== '') {
                    const linkContainer = document.createElement('a');
                    linkContainer.classList.add('video_link');
                    linkContainer.href = thumb.video_link;
                    linkContainer.target = 'video_container';

                    linkContainer.textContent = thumb.video_title;
                    thumbnail.append(linkContainer);
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

displayNewVideo();


const btn_addLink = document.querySelector('.button_addLink');
btn_addLink.addEventListener('click', () => {
    
    createThumb();
    displayNewVideo();
    document.querySelector('.link_input').value = '';
})




// const YT_embed = '<iframe width="1731" height="656" src="https://www.youtube.com/embed/NiljDyzAOcI" title="The harsh reality of good software" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';

// function parseIframeAttributes(iframe) {
//     const regex = /(\w+)(?:="([^"]*)")?/g;
//     const attrs = {};

//     let match;

//     while((match = regex.exec(iframe))) {
//         const [, key, value ] = match;

//         attrs[key] = value !== undefined ? value : true; 
//     }

//     return attrs;
// }

// const iframeObject = parseIframeAttributes(YT_embed);

