// const url = 'http://localhost:5000';
const url = 'https://watch-later-ten.vercel.app';
const user = JSON.parse(localStorage.getItem('user'))
const input_addLink = document.querySelector('.input_link');
const landingPage = document.querySelector('.landing_container');
if (!user) {
    console.log('No user logged in!')
    input_addLink.style.display = 'none';
    landingPage.style.display = 'flex';
} 


export function initPageFunctions() {
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
                user_id: user.user_id,
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

    function displayVideoViewer(videoLink, videoTitle) {
        const iFrameContainer = document.querySelector('.iFrame_container');

        // Create the iframe and title dynamically
        const iframe_element = document.createElement('iframe');
        iframe_element.classList.add('video_container');
        iframe_element.name = 'video_container';
        iframe_element.src = videoLink;

        if (iframe_element.src === undefined) {
            iframe_element.style.display = 'none';
        }

        const video_title_label = document.createElement('label');
        video_title_label.classList.add('video_title');
        video_title_label.textContent = videoTitle;

        // Add them to the container
        iFrameContainer.innerHTML;
        iFrameContainer.append(iframe_element, video_title_label);
    }


    function displayNewVideo () {
        const thumbnail = document.querySelector('.thumbnail');
        if (!user) {
            console.log('No user logged in!')
        }
        
        fetch(`${url}/user/${user?.user_id}`)
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

                        linkContainer.addEventListener('click', (e) => {
                            const iframe = document.querySelector('.video_container');
                            if (!iframe) {
                                e.preventDefault(); 
                                displayVideoViewer(linkContainer.href, thumb.video_title);
                                console.log(linkContainer.href, thumb.video_title);
                                linksContainer();
                            } else {
                                linkContainer.target = 'video_container';
                            }
                        });

                        button_delete.addEventListener('click', async () => {
                            try {
                                const response = await fetch(`${url}/yt_link_delete/${thumb.link_id}/${user.user_id}`, {
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
                                // displayVideoViewer();
                                window.location.reload();
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


    function linksContainer() {
        const currentVideoTitle = document.querySelector('.video_title');
        const videoDisplayer = document.querySelector('.video_container');

        // if (!currentVideoTitle) {
        //     console.error('.video_title element not found!');
        //     return;
        // }

        // One listener for ALL .video_link clicks (even future ones)
        document.addEventListener('click', (e) => {
            const link = e.target.closest('.video_link');
            if (!link) return; // Not a .video_link

            const youtubeUrl = link.getAttribute('href');
            if(!youtubeUrl) {
                console.log('No youtube URL found!');
            } else {
                videoDisplayer.src = youtubeUrl;
            }

            console.log(youtubeUrl)
            
            const title = link.dataset.title || link.textContent.trim();
            console.log('Video clicked:', title); 

            currentVideoTitle.textContent = title;
        });
    }


    const btn_addLink = document.querySelector('.button_addLink');
    btn_addLink.addEventListener('click', () => {
        
        createThumb();
        displayNewVideo();
        document.querySelector('.link_input').value = '';
    })



    displayNewVideo();
    linksContainer()


    
    window.onload = () => {
        linksContainer()
        displayNewVideo();
        displayUser()
    }

    function displayUser() {
        let user_settings_container = document.querySelector('.user_settings');

        // let user_current = document.querySelector('.user_label');
        let btn_logn = document.querySelector('.user_login');
        let btn_register = document.querySelector('.user_register');
        // let btn_logout = document.querySelector('.user_logout');


        // const user = JSON.parse(localStorage.getItem('user'))
        if(user) {
            btn_logn.style.display = 'none';
            btn_register.style.display = 'none';

            const user_current = document.createElement('label');
            user_current.classList.add('user_label');
            user_current.textContent = user?.username;

            const btn_exit = document.createElement('button');
            btn_exit.classList.add('user_logout');
            btn_exit.textContent = 'Exit';

            user_settings_container.innerHTML = '';
            user_settings_container.append(user_current, btn_exit);


            btn_exit.addEventListener('click', () => {
                localStorage.removeItem('user');
                window.location.reload();
                displayUser();
            })
        } else {
            btn_logn.style.display = 'flex';
            btn_register.style.display = 'flex';
        } 


    }

    displayUser()


}


