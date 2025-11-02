export function userLogin() {
    console.log('Hello World Login!')
    const url = 'http://localhost:5000';

    const input_username = document.querySelector('.login_username');
    const input_password = document.querySelector('.login_password');
    const button_login = document.querySelector('.login_button');
    const login_form = document.querySelector('.login_form');

    
    
    button_login.addEventListener('click', () => {
        const loginData = {
            username: input_username.value,
            password: input_password.value,
        }
        console.log('Username: ', input_username.value);
        console.log('Password: ', input_password.value)

        fetch(`${url}/user/login`, {
            method: 'POST',
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(loginData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Sent data: ',  data);
            localStorage.setItem('user', JSON.stringify(data.user));
        })
        .catch(err => console.error('Error sending formData: ', err)) 


        window.location.replace('/');
    });



}


