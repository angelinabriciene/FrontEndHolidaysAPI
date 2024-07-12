getHolidays();

function showAlert(message) {
    let alertMessage = document.getElementById("alert-message");
    alertMessage.textContent = message;
    alertMessage.classList.add("show");
    setTimeout(function () {
        alertMessage.classList.remove("show");
    }, 3000);
}

function getHolidays() {
    fetch("http://127.0.0.1:8000/getHolidays")
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById("container");
            container.innerHTML = "";

            createButton(container);
            createHolidayForm(container);
            createHolidayList(container, data);
        });
}

function createButton(container) {
    const createButton = document.createElement("button");
    createButton.id = "create-holiday-btn";
    createButton.className = "create-button";
    createButton.textContent = "Sukurti naują kelionių kryptį";
    container.appendChild(createButton);

    createButton.addEventListener("click", () => {
        document.getElementById("holiday-form").style.display = "block";
    });
}

function createHolidayForm(container) {
    const holidayForm = document.createElement("form");
    holidayForm.id = "holiday-form";
    holidayForm.style.display = "none";
    container.appendChild(holidayForm);

    holidayForm.addEventListener("submit", event => {
        event.preventDefault();
        createHoliday(holidayForm);
    });

    const formFields = `
      <label for="holiday-title">Pavadinimas</label>
      <input type="text" id="title" name="title"><br><br>

      <label for="holiday-country">Šalis</label>
      <input type="text" id="country" name="country"><br><br>

      <label for="holiday-city">Miestas</label>
      <input type="text" id="city" name="city"><br><br>

      <label for="holiday-duration">Trukmė</label>
      <input type="text" id="duration" name="duration"><br><br>

      <label for="holiday-season">Sezonas</label>
      <input type="text" id="season" name="season"><br><br>

      <label for="holiday-description">Aprašas</label>
      <textarea type="text" id="description" name="description"></textarea>

      <label for="holiday-price">Kaina</label>
      <input type="text" id="price" name="price"><br><br>

      <label for="holiday-photos">Nuotraukos</label>
      <input type="text" id="photos" name="photo1"><br><br>
      <input type="text" id="photos" name="photo2"><br><br>

      <input type="submit" value="Išsaugoti">
    `;
    holidayForm.innerHTML = formFields;
}

function createHolidayList(container, data) {
    const holidayList = document.createElement("div");
    holidayList.id = "holiday-list";
    container.appendChild(holidayList);

    data.forEach(holiday => {
        const holidayCard = createHolidayCard(holiday);
        holidayList.appendChild(holidayCard);
    });
}

function createHolidayCard(holiday) {
    const holidayCard = document.createElement("div");
    holidayCard.className = "holiday-card";

    const title = document.createElement("h2");
    title.textContent = holiday.title;
    holidayCard.appendChild(title);

    const details = createDetails(holiday);
    holidayCard.appendChild(details);

    holidayCard.onclick = () => {
        getHoliday(holiday.id, holidayCard);
    };

    return holidayCard;
}

function createDetails(holiday) {
    const details = document.createElement("ul");
    details.className = "details";

    const countryItem = createListItem(`Šalis : ${holiday.country}`);
    details.appendChild(countryItem);

    const cityItem = createListItem(`Miestas : ${holiday.city}`);
    details.appendChild(cityItem);

    const durationItem = createListItem(`Trukmė : ${holiday.duration}`);
    details.appendChild(durationItem);

    const seasonItem = createListItem(`Sezonas : ${holiday.season}`);
    details.appendChild(seasonItem);

    const priceItem = createListItem(`Kaina € : ${holiday.price}`);
    details.appendChild(priceItem);

    const ratingItem = createListItem("", "", details, true);
    createRatingStars(ratingItem, holiday.averageRating);

    return details;
}

function createListItem(label, text, parent, isRating = false) {
    const listItem = document.createElement("li");

    if (!label) {
        listItem.classList.add("rating-item");
    }

    if (label) {
        const labelSpan = document.createElement("span");
        labelSpan.textContent = label;
        listItem.appendChild(labelSpan);
    }

    if (text) {
        const textSpan = document.createElement("span");
        textSpan.textContent = text;
        listItem.appendChild(textSpan);
    }

    if (parent) {
        parent.appendChild(listItem);
    }

    if (isRating) {
        return listItem;
    }

    return listItem;
}

function getHoliday(id) {
    fetch(`http://127.0.0.1:8000/getHoliday?id=${id}`)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById("container");
            container.innerHTML = "";

            const holidayInfo = document.createElement("div");
            holidayInfo.className = "holiday-info";
            container.appendChild(holidayInfo);

            createHolidayTitle(data.title, holidayInfo);
            createHolidayDetails(data, holidayInfo);
            createPhotos(data.photos, holidayInfo);
            createButtons(holidayInfo, data);
            window.scrollTo(0, 0);
        });
}

// function updateRating(data, stars) {
//     fetch('http://127.0.0.1:8000/rateHoliday', {
//         method: "POST",
//         body: JSON.stringify({ id: data.id, rating: [stars] }),
//         headers: {
//             "Content-Type": "application/json"
//         }
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.success) {
//             showAlert("Rating submitted successfully");
//         } else {
//             showAlert("Error submitting rating: " + data.error);
//         }
//     })
//     .catch(error => {
//         console.error("Error submitting rating:", error);
//         showAlert("Error submitting rating");
//     });
// }

function createHolidayTitle(title, parent) {
    const titleElement = document.createElement("h1");
    titleElement.textContent = title;
    parent.appendChild(titleElement);
}

function createHolidayDetails(data, parent) {
    const details = document.createElement("ul");
    details.className = "details";
    parent.appendChild(details);

    createDetailItem("Kodėl verta rinktis šią kelionę:  ", data.description, details, true);
    createDetailItem("Šalis:  ", data.country, details, true);
    createDetailItem("Miestas:  ", data.city, details, true);
    createDetailItem("Trukmė:  ", data.duration, details, true);
    createDetailItem("Sezonas:  ", data.season, details, true);
    createDetailItem("Kaina €:  ", data.price, details, true);
    createDetailItem("Įvertinimas:  ", data.averageRating, details, true, true);

    // const ratingContainer = document.createElement("div");
    //         ratingContainer.className = "rating";
    // holidayInfo.appendChild(ratingContainer);
    // const stars = [];
    // for (let i = 1; i <= 5; i++) {
    //   const star = document.createElement("span");
    //   star.className = "star";
    //   star.id = `star-${i}`;
    //   ratingContainer.appendChild(star);
    //   stars.push(star);
    // }
    // updateRating(data, stars)

}

function createDetailItem(label, text, parent, bold = false, isRating = false) {
    const listItem = document.createElement("li");

    if (label) {
        const labelSpan = document.createElement("span");
        if (bold) {
            labelSpan.classList.add("bold");
        }
        labelSpan.textContent = label;
        listItem.appendChild(labelSpan);
    }

    if (text) {
        if (isRating) {
            createRatingStars(listItem, parseFloat(text));
        } else {
            const textSpan = document.createElement("span");
            textSpan.textContent = text;
            listItem.appendChild(textSpan);
        }
    }

    parent.appendChild(listItem);

    return listItem;
}

function createPhotos(photos, parent) {
    const photosDiv = document.createElement("div");
    photosDiv.className = "photos";
    parent.appendChild(photosDiv);

    photos.forEach(photoUrl => {
        const img = document.createElement("img");
        img.src = photoUrl;
        photosDiv.appendChild(img);
    });
}

function createButtons(parent, data) {
    const backButton = document.createElement("button");
    backButton.className = "back-button";
    backButton.textContent = "Grįžti į sąrašą";
    backButton.onclick = function () {
        getHolidays();
    };
    parent.appendChild(backButton);

    const editButton = document.createElement("button");
    editButton.className = "edit-button";
    editButton.textContent = "Redaguoti įrašą";
    editButton.onclick = function () {
        editHoliday(data);
    };
    parent.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Ištrinti įrašą";
    deleteButton.onclick = function () {
        deletetHoliday(data.id);
    };
    parent.appendChild(deleteButton);
}

function createHoliday(form) {
    if (!(form instanceof HTMLFormElement)) {
        console.error("Invalid form element:", form);
        return;
    }

    let formData = {};
    formData["photos"] = [];
    for (let field of Array.from(form.elements)) {
        if (field.name) {
            if (field.name == "photo1") {
                formData["photos"][0] = field.value;
            }
            if (field.name == "photo2") {
                formData["photos"][1] = field.value;
            } else {
                formData[field.name] = field.value;
            }
        }
    }

    fetch(`http://127.0.0.1:8000/createHoliday`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if (response.ok) {
                showAlert("Įrašas sukurtas");
                form.reset();
                getHolidays();
                window.scrollTo(0, 0);
            } else {
                window.scrollTo(0, 0);
                showAlert("Klaida: negalima sukurti įrašo");
            }
        })
        .catch(error => {
            console.error("Error creating holiday:", error);
            window.scrollTo(0, 0);
            showAlert("Klaida: negalima sukurti įrašo");
        });
}

function updateHoliday(holidayId) {
    let form = document.getElementById("edit-form");
    let formData = {
        id: holidayId
    };
    for (let field of Array.from(form.elements)) {
        if (field.name) {
            if (field.name == "photo1" || field.name == "photo2") {
                if (!formData["photos"]) {
                    formData["photos"] = [];
                }
                formData["photos"].push(field.value);
            } else if (field.name == "rating") {
                formData[field.name] = JSON.parse(field.value);
            } else {
                formData[field.name] = field.value;
            }
        }
    }

    fetch('http://127.0.0.1:8000/updateHoliday', {
        method: 'POST',
        body: JSON.stringify({ ...formData, id: holidayId }),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showAlert("Įrašas atnaujintas");
                getHolidays();
            } else {
                alert("Error updating holiday: " + data.error);
            }
        })
        .catch(error => {
            console.error("Error updating holiday:", error);
        });
}

function editHoliday(data) {
    let container = document.getElementById("container");
    container.innerHTML = "";

    let form = document.createElement("form");
    form.id = "edit-form";
    container.appendChild(form);

    let titleLabel = document.createElement("label");
    titleLabel.textContent = "Pavadinimas:";
    form.appendChild(titleLabel);

    let titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.name = "title";
    titleInput.value = data.title;
    form.appendChild(titleInput);

    let descriptionLabel = document.createElement("label");
    descriptionLabel.textContent = "Aprašymas:";
    form.appendChild(descriptionLabel);

    let descriptionInput = document.createElement("textarea");
    descriptionInput.name = "description";
    descriptionInput.value = data.description;
    form.appendChild(descriptionInput);

    let dcountryLabel = document.createElement("label");
    dcountryLabel.textContent = "Šalis:";
    form.appendChild(dcountryLabel);

    let countryInput = document.createElement("input");
    countryInput.type = "text";
    countryInput.name = "country";
    countryInput.value = data.country;
    form.appendChild(countryInput);

    let cityLabel = document.createElement("label");
    cityLabel.textContent = "Miestas:";
    form.appendChild(cityLabel);

    let cityInput = document.createElement("input");
    cityInput.type = "text";
    cityInput.name = "city";
    cityInput.value = data.city;
    form.appendChild(cityInput);

    let durationLabel = document.createElement("label");
    durationLabel.textContent = "Trukmė:";
    form.appendChild(durationLabel);

    let durationInput = document.createElement("input");
    durationInput.type = "text";
    durationInput.name = "duration";
    durationInput.value = data.duration;
    form.appendChild(durationInput);

    let seasonLabel = document.createElement("label");
    seasonLabel.textContent = "Sezonas:";
    form.appendChild(seasonLabel);

    let seasonInput = document.createElement("input");
    seasonInput.type = "text";
    seasonInput.name = "season";
    seasonInput.value = data.season;
    form.appendChild(seasonInput);

    let priceLabel = document.createElement("label");
    priceLabel.textContent = "Kaina €:";
    form.appendChild(priceLabel);

    let priceInput = document.createElement("input");
    priceInput.type = "text";
    priceInput.name = "price";
    priceInput.value = data.price;
    form.appendChild(priceInput);

    let photo1Label = document.createElement("label");
    photo1Label.textContent = "Nuotraukos:";
    form.appendChild(photo1Label);

    let photo1Input = document.createElement("input");
    photo1Input.type = "text";
    photo1Input.name = "photo1";
    photo1Input.value = data.photos[0];
    form.appendChild(photo1Input);

    let photo2Input = document.createElement("input");
    photo2Input.type = "text";
    photo2Input.name = "photo2";
    photo2Input.value = data.photos[1];
    form.appendChild(photo2Input);

    let ratingLabel = document.createElement("label");
    ratingLabel.textContent = "";
    form.appendChild(ratingLabel);

    let ratingInput = document.createElement("input");
    ratingInput.type = "hidden";
    ratingInput.name = "rating";
    ratingInput.value = JSON.stringify(data.rating);
    form.appendChild(ratingInput);

    let submitButton = document.createElement("button");
    submitButton.className = "save-holiday-button";
    submitButton.type = "submit";
    submitButton.textContent = "Išsaugoti";
    form.appendChild(submitButton);

    let cancelButton = document.createElement("button");
    cancelButton.className = "cancel-button";
    cancelButton.textContent = "Atšaukti";
    cancelButton.onclick = function (event) {
        event.preventDefault();
        getHolidays();
    };
    form.appendChild(cancelButton);

    form.onsubmit = function (event) {
        event.preventDefault();
        updateHoliday(data.id);
    };
}

function deletetHoliday(holidayId) {
    fetch(`http://127.0.0.1:8000/deleteHoliday`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: holidayId })
    })
        .then(response => {
            if (response.ok) {
                showAlert("Įrašas ištrintas");
                getHolidays();
                window.scrollTo(0, 0);
            }
        })
}

// function createRating(holiday) {
//     const ratingItem = document.createElement("p");
//     ratingItem.className = "rating";

//     const ratingStars = createRatingStars(null, holiday.averageRating);
//     ratingItem.appendChild(ratingStars);

//     return ratingItem;
// }

function createRatingStars(parent, rating) {
    const ratingStars = document.createElement("span");
    ratingStars.className = "rating-stars";

    for (let i = 1; i <= 5; i++) {
        const star = document.createElement("span");
        star.className = "star";
        if (i <= rating) {
            star.textContent = "★";
        } else if (i - 0.5 <= rating) {
            star.textContent = "☆";
            star.classList.add("half-star");
        } else {
            star.textContent = "☆";
        }
        ratingStars.appendChild(star);
    }

    parent.appendChild(ratingStars);
}