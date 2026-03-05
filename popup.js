document.addEventListener('DOMContentLoaded', () => {
            const importButton = document.getElementById("importButton");
            importButton.addEventListener( "click", () => {
                chrome.runtime.sendMessage({ type: 'START_IMPORT' }, (response) => {
                    const statusDisplay = document.getElementById("status");
                    if (response.status === "success") {
                        statusDisplay.innerText = "Success! Nutrition data imported."
                        statusDisplay.style.color = "green";
                    } else if (response.status === "no_data") {
                        statusDisplay.innerText = "Error: no UW nutrition page found!"
                        statusDisplay.style.color = "red";
                    } else if (response.status === "no_editor") {
                        statusDisplay.innerText = "Error: no Cronometer editor found!"
                        statusDisplay.style.color = "red";
                    } else {
                        statusDisplay.innerText = "Error: an unknown error occured."
                        statusDisplay.style.color = "red";
                    }
                });

            });
        });