const baseURL = 'https://ftsdm04s2-2512-evaluation-default-rtdb.asia-southeast1.firebasedatabase.app/feedback';

document.body.onload = loadData;

document.getElementById('feedbackForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const form = document.getElementById('feedbackForm');

    const name = form['name'].value;
    const email = form['email'].value;
    const rating = form['rating'].value;
    const feedbackMessage = form['feedbackMessage'].value;
    const isAnonymous = form['anonymous'].checked;

    if ((name === "" || email === "") && !isAnonymous ) {
        alert('Invalid Input!');
        return;
    }

    let data = {
        name,
        email,
        rating,
        feedbackMessage,
        isAnonymous,
        'data': new Date,
    }

    console.log(data);

    saveFeedback(data);
    form.reset();
})

async function saveFeedback(obj) {
    try {
        const response = await fetch(baseURL + '.json', {
            'method': 'POST',
            'Content-Type': 'application/json',
            'body': JSON.stringify(obj),
        });
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}


async function loadData() {
    navigation();
    try {
        const response = await fetch(baseURL + '.json');
        const data = await response.json();
    
        console.log(data);

        feedbackData = Object.entries(data).map(([id, value]) => {
            return {id, ...value}
        })

        localStorage.setItem('feedback', JSON.stringify(feedbackData));
        // console.log(feedbackData);
    } catch (error) {
        console.log(error);
    }
}


function navigation(option = 'home') {
    const home = document.getElementById('HomeSection');
    const submitForm = document.getElementById('SubmitFeedbackSection');
    const feedback = document.getElementById('ViewFeedbackSection');

    home.style.display = 'none';
    submitForm.style.display = 'none';
    feedback.style.display = 'none';

    switch (option) {
        case 'home':
            home.style.display = '';
            break;

        case 'submitForm':
            submitForm.style.display = '';
            break;

        case 'feedback':
            feedback.style.display = '';
            break;
    }
}