/**
 * @file sign up js
 * @author xiangzheng Jing
 */

function handleAvatar(accountForm) {
    const avatarList = accountForm.querySelectorAll('input[name=avatar]');
    const currentAvatar = accountForm.querySelector('input[type=hidden]');
    if(currentAvatar) {
       avatarList.forEach(avatar => {
           if (avatar.value === currentAvatar.value) {
               avatar.setAttribute('checked', true);
           } else {
               avatar.removeAttribute('checked');
           }
       });
    }
}

function checkUsernameUnique(accountForm) {
    const nameInput = accountForm.querySelector('.sign-up input[name=username]');
    if(!nameInput) return;

    const currentValue = nameInput.value;
    nameInput.addEventListener('blur', async function() {
        if (this.value && this.value !== currentValue) {
            const response = await fetch(`/checkusername?username=${this.value}`);
            const data = await response.json();

            const errorEle =  document.querySelector('.error-tips');
            if (data.errno) {
                errorEle.innerHTML = data.message;
                errorEle.style.opacity = 1;
                submitButton.setAttribute('disabled', true);
            } else {
                errorEle.innerHTML = 'Please enter the same password';
                errorEle.style.opacity = 0;
                submitButton.removeAttribute('disabled');
            }
        }
    });
}

function checkPasswords(accountForm) {
    const passwordInputs = accountForm.querySelectorAll('input[type=password]');
    if (passwordInputs.length === 0) return;
    const [   
        firstPassword,
        secondPassword
    ] = passwordInputs;

    const submitButton = accountForm.querySelector('button');
    secondPassword.addEventListener('blur', function() {
        const errorTips = accountForm.querySelector('.error-tips');
        if (this.value === firstPassword.value) {
            errorTips.style.opacity = 0;
            submitButton.removeAttribute('disabled');
        } else {
            errorTips.style.opacity = 1;
            submitButton.setAttribute('disabled', true);
        }
    });  
}
export function renderSignup() {

    const accountForm = document.getElementById('accountForm');
    if(!accountForm) return;

    // 1. When edit account, the avatar chosen should be selected by red border.
    handleAvatar(accountForm);
     

    // 2. make sure the username is unique
    checkUsernameUnique(accountForm);    

    // 3. keep the first password is same to the second one.
    checkPasswords(accountForm);
};