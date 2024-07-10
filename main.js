

getHolidays();

function showAlert(message) {
    let alertMessage = document.getElementById("alert-message");
    alertMessage.textContent = message;
    alertMessage.style.display = "block";
    setTimeout(function () {
        alertMessage.style.display = "none";
    }, 3000);
}

function getHolidays() {
    fetch("http://127.0.0.1:8000/getHolidays")
        .then(response => response.json())
        .then(data => {
            let container = document.getElementById("container");
            container.innerHTML = "";

            let createButton = document.createElement("button");
            createButton.id = "create-holiday-btn";
            createButton.className = "create-button";
            createButton.textContent = "Sukurti naują kelionių kryptį";
            container.appendChild(createButton);

            let holidayForm = document.createElement("form");
            holidayForm.id = "holiday-form";
            holidayForm.style.display = "none";
            container.appendChild(holidayForm);

            holidayForm.addEventListener("submit", function (event) {
                event.preventDefault();
                createHoliday(holidayForm);
            });

            let formFields = `
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
              <input type="text" id="description" name="description"><br><br>

              <label for="holiday-price">Kaina</label>
              <input type="text" id="price" name="price"><br><br>

              <label for="holiday-photos">Nuotraukos</label>
              <input type="text" id="photos" name="photo1"><br><br>
              <input type="text" id="photos" name="photo2"><br><br>

              <input type="submit" value="Išsaugoti">
            `;
            holidayForm.innerHTML = formFields;

            document.getElementById("create-holiday-btn").addEventListener("click", function () {
                document.getElementById("holiday-form").style.display = "block";
            });

            let holidayList = document.createElement("div");
            holidayList.id = "holiday-list";
            container.appendChild(holidayList);

            data.forEach(holiday => {
                let holidayCard = document.createElement("div");
                holidayCard.className = "holiday-card";

                let title = document.createElement("h2");
                title.textContent = holiday.title;
                holidayCard.appendChild(title);

                let details = document.createElement("ul");
                details.className = "details";

                let countryItem = document.createElement("li");
                countryItem.textContent = `Šalis: ${holiday.country}`;
                details.appendChild(countryItem);

                let cityItem = document.createElement("li");
                cityItem.textContent = `Miestas: ${holiday.city}`;
                details.appendChild(cityItem);

                let durationItem = document.createElement("li");
                durationItem.textContent = `Trukmė: ${holiday.duration}`;
                details.appendChild(durationItem);

                let seasonItem = document.createElement("li");
                seasonItem.textContent = `Sezonas: ${holiday.season}`;
                details.appendChild(seasonItem);

                let priceItem = document.createElement("li");
                priceItem.textContent = `Kaina: ${holiday.price}`;
                details.appendChild(priceItem);

                let ratingItem = document.createElement("li");
                ratingItem.textContent = `Įvertinimas: ${holiday.averageRating}`;
                details.appendChild(ratingItem);

                let photos = document.createElement("div");
                photos.className = "photos";
                holiday.photos.forEach(photoUrl => {
                    let img = document.createElement("img");
                    img.src = photoUrl;
                    photos.appendChild(img);
                });
                holidayCard.appendChild(photos);

                holidayCard.appendChild(details);

                holidayCard.onclick = function () {
                    getHoliday(holiday.id);
                };

                holidayList.appendChild(holidayCard);
            });
        });
}

function getHoliday(id) {
    fetch(`http://127.0.0.1:8000/getHoliday?id=${id}`)
        .then(response => response.json())
        .then(data => {
            container.innerHTML = "";

            let holidayInfo = document.createElement("div");
            holidayInfo.className = "holiday-info";
            container.appendChild(holidayInfo);

            let title = document.createElement("h1");
            title.textContent = data.title;
            holidayInfo.appendChild(title);

            let details = document.createElement("ul");
            details.className = "details";

            let descriptionItem = document.createElement("li");
            descriptionItem.textContent = `Aprašas: ${data.description}`;
            details.appendChild(descriptionItem);

            let countryItem = document.createElement("li");
            countryItem.textContent = `Šalis: ${data.country}`;
            details.appendChild(countryItem);

            let cityItem = document.createElement("li");
            cityItem.textContent = `Miestas: ${data.city}`;
            details.appendChild(cityItem);

            let durationItem = document.createElement("li");
            durationItem.textContent = `Trukmė: ${data.duration}`;
            details.appendChild(durationItem);

            let seasonItem = document.createElement("li");
            seasonItem.textContent = `Sezonas: ${data.season}`;
            details.appendChild(seasonItem);

            let priceItem = document.createElement("li");
            priceItem.textContent = `Kaina: ${data.price}`;
            details.appendChild(priceItem);

            let ratingItem = document.createElement("li");
            ratingItem.textContent = `Įvertinimas: ${data.averageRating}`;
            details.appendChild(ratingItem);

            let photos = document.createElement("div");
            photos.className = "photos";
            data.photos.forEach(photoUrl => {
                let img = document.createElement("img");
                img.src = photoUrl;
                photos.appendChild(img);
            });
            holidayInfo.appendChild(photos);

            holidayInfo.appendChild(details);

            let backButton = document.createElement("button");
            backButton.className = "back-button";
            backButton.textContent = "Grįžti į sąrašą";
            backButton.onclick = function () {
                getHolidays();
            };
            holidayInfo.appendChild(backButton);

            let editButton = document.createElement("button");
            editButton.className = "edit-button";
            editButton.textContent = "Redaguoti įrašą";
            editButton.onclick = function () {
                editHoliday(data);
            };
            holidayInfo.appendChild(editButton);

            let deleteButton = document.createElement("button");
            deleteButton.className = "delete-button";
            deleteButton.textContent = "Ištrinti įrašą";
            deleteButton.onclick = function () {
                deletetHoliday(data.id);
            };
            holidayInfo.appendChild(deleteButton);
        });
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
                showAlert("sukurtas");
                form.reset();
                getHolidays();
            } else {
                showAlert("Klaida: negalima sukurti įrašo");
            }
        })
        .catch(error => {
            console.error("Error creating holiday:", error);
            showAlert("Klaida: negalima sukurti įrašo");
        });
}

function updateHoliday(holidayId) {
    let form = document.getElementById("edit-form");
    let formData = {
        id:holidayId
    };
    for (let field of Array.from(form.elements)) {
        if (field.name) {
            if (field.name == "photo1" || field.name == "photo2") {
                if (!formData["photos"]) {
                    formData["photos"] = [];
                }
                formData["photos"].push(field.value);
            } else {
                formData[field.name] = field.value;
            }
        }
    }

    fetch(`http://127.0.0.1:8000/updateHoliday?id=${holidayId}`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Holiday updated successfully!");
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

    let titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.name = "title";
    titleInput.value = data.title;
    form.appendChild(titleInput);

    let descriptionInput = document.createElement("input");
    descriptionInput.type = "text";
    descriptionInput.name = "description";
    descriptionInput.value = data.description;
    form.appendChild(descriptionInput);

    let countryInput = document.createElement("input");
    countryInput.type = "text";
    countryInput.name = "country";
    countryInput.value = data.country;
    form.appendChild(countryInput);

    let cityInput = document.createElement("input");
    cityInput.type = "text";
    cityInput.name = "city";
    cityInput.value = data.city;
    form.appendChild(cityInput);

    let durationInput = document.createElement("input");
    durationInput.type = "text";
    durationInput.name = "duration";
    durationInput.value = data.duration;
    form.appendChild(durationInput);

    let seasonInput = document.createElement("input");
    seasonInput.type = "text";
    seasonInput.name = "season";
    seasonInput.value = data.season;
    form.appendChild(seasonInput);

    let priceInput = document.createElement("input");
    priceInput.type = "text";
    priceInput.name = "price";
    priceInput.value = data.price;
    form.appendChild(priceInput);

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

    let submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Išsaugoti";
    form.appendChild(submitButton);

    form.onsubmit = function(event) {
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
                showAlert("ištrintas");
                getHolidays();
            }
        })
}
