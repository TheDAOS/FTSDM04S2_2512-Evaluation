const baseURL = 'https://ftsdm04s2-2512-evaluation-default-rtdb.asia-southeast1.firebasedatabase.app/feedback';

document.body.onload = () => {
    navigation();
    loadData();
};

document.getElementById('feedbackForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const form = document.getElementById('feedbackForm');

    const name = form['name'].value;
    const email = form['email'].value;
    const rating = form['rating'].value;
    const feedbackMessage = form['feedbackMessage'].value;
    const isAnonymous = form['anonymous'].checked;

    if ((name === "" || email === "") && !isAnonymous) {
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

    // console.log(data);

    saveFeedback(data);
    loadData();
    form.reset();
})

function displayFeedback() {
    let data = localStorage.getItem('feedback') || '[]';
    data = JSON.parse(data);
    data = Object.entries(data).map(([id, value]) => {
        return { ...value };
    });

    // console.log(data);

    const section = document.getElementById('ViewFeedbackSection');
    section.innerHTML = ``;

    data.forEach(row => {
        const card = document.createElement('div');
        card.className = 'card';

        const name = document.createElement('h3');
        name.innerText = "Name: " + ((row.isAnonymous) ? 'Anonymous' : row.name);
        card.appendChild(name);

        const submittedOn = document.createElement('i');
        submittedOn.innerText = new Date(row.data);
        submittedOn.style.fontWeight = 'lighter';
        card.appendChild(submittedOn);

        const email = document.createElement('p');
        email.innerText = "Email: " + ((row.isAnonymous) ? 'Anonymous' : row.email)
        card.appendChild(email);

        const rating = document.createElement('p');
        rating.innerText = "Rating: "+ row.rating;
        card.appendChild(rating);

        const feedback = document.createElement('p');
        feedback.innerText = "feedback: \n"+ row.feedbackMessage;
        card.appendChild(feedback);

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete Feedback';
        deleteButton.onclick = () => {
            deleteFeedback(row.id);
        }
        card.appendChild(deleteButton);

        section.appendChild(card);
    });
}

async function deleteFeedback(id) {
    try {
        const response = await fetch (baseURL+'/'+id+'.json', {
            'method': 'DELETE',
        })
        const data = await response.json();
        console.log(data);
        loadData();
    } catch (error) {
        console.log(error);
    }
}

async function saveFeedback(obj) {
    try {
        const response = await fetch(baseURL + '.json', {
            'method': 'POST',
            'Content-Type': 'application/json',
            'body': JSON.stringify(obj),
        });
        const data = await response.json();
        alert('Feedback accepted...');
        console.log(data);
    } catch (error) {
        alert('Filed to send Feedback!!!');
        console.log(error);
    }
}

async function loadData() {
    try {
        const response = await fetch(baseURL + '.json');
        const data = await response.json();

        console.log(data);

        feedbackData = Object.entries(data).map(([id, value]) => {
            return { id, ...value }
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
            document.title = "Home";
            break;

        case 'submitForm':
            submitForm.style.display = '';
            document.title = "Submit Your Feedback";
            break;

        case 'feedback':
            feedback.style.display = '';
            document.title = "Student Feedback Entries";
            displayFeedback();
            break;
    }
}