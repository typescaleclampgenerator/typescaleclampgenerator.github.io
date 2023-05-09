// Events.js

// Écouteurs d'événements pour mettre à jour la page en temps réel
document.getElementById('messageTextInput').oninput = onMessageTextInput;
document.getElementById('fontSelector').oninput = onFontSelector;

// Écouteurs d'événements pour mettre à jour les valeurs des tailles de police
['viewportWidth-min', 'viewportWidth-max'].forEach(id => document.getElementById(id).onchange = getSettingsValue);

document.getElementById('rangeScreenWidthInput').oninput = changeScreenWidth;

['outputButton', 'codeSectionCloseButton'].forEach(id => document.getElementById(id).onclick = toggleCodeSection);

// Écouteurs d'événements concernant le reset ou la copie du code
document.getElementById('resetButton').onclick = onResetButtonClick;
document.getElementById('btnCopy').onclick = onCopyButtonClick;

// Écouteur pour charger la liste des polices Google et mettre à jour les valeurs des tailles de police
document.addEventListener("DOMContentLoaded", () => {
    const apiKey = "AIzaSyCGSRPFktjIxbGlNC7bG8Kyb2b9LHJmMn8";
    const fontSelector = document.getElementById('fontSelector');

    fetch('./assets/data/google_fonts_list.json')
        .then(response => response.json())
        .then(fonts => {
            fonts.forEach(font => {
                const option = document.createElement('option');
                option.value = font.family;
                option.textContent = font.family;
                fontSelector.appendChild(option);
            });
        })
        .catch(console.error);

    const tempSizeValues = Object.assign({}, sizeValues);
    buildingHTML(tempSizeValues);

    document.querySelectorAll('#rangeSizeWrapper .settings-size-element input').forEach(input => {
        input.onchange = getSettingsValue;
        if (input.id.endsWith('-min')) {
          input.oninput = () => updateMinMaxAttributes(input, document.getElementById(input.id.replace('-min', '-max')));
        } else if (input.id.endsWith('-max')) {
          input.oninput = () => updateMinMaxAttributes(document.getElementById(input.id.replace('-max', '-min')), input);
        }
    });

    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.onchange = onCheckboxChange;
    });

    changeScreenWidth();
    getSettingsValue();
});