export function registerUser() {
    // const url = 'http://localhost:5000';
    const url = 'https://watch-later-ten.vercel.app';
    console.log('Register Page!')

    const input_fullname = document.querySelector('.reg_fullname');
    const input_username = document.querySelector('.reg_username');
    const input_password = document.querySelector('.reg_password');

    const form_register = document.querySelector('.register_form');

    form_register.addEventListener('submit', (e) => {
        e.preventDefault();
        const registrationData = {
            fullname: input_fullname.value,
            username: input_username.value,
            password: input_password.value,
        }

        console.log(registrationData)

        fetch(`${url}/user/register`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(registrationData)
        }).then(response => response.json())
        .then(data => {
            console.log(data)
        }).catch((err) => {
            console.error(err)
        });

        window.location.replace('/login');
    });

}