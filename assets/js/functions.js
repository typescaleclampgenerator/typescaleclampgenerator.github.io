// Fonctions.js

const createSizeContainer = (size, min, max, visible) => {
  let checked = visible ? 'checked' : '';
  let controlClass = visible ? '' : 'control--closed';

  const sizeContainerHTML = sizeContainerTemplate
    .replace(/%SIZE%/g, size)
    .replace('%MIN_VALUE%', min)
    .replace('%MAX_VALUE%', max)
    .replace('%CHECKED%', checked)
    .replace('%CONTROL_CLASS%', controlClass);

  return sizeContainerHTML;
}

const buildingHTML = (tempSizeValues) => {
  for (let size in tempSizeValues) {
    if (size !== 'all') {
      // Settings
      const { 'min-fontsize': min, 'max-fontsize': max, visible } = tempSizeValues[size];

      const sizeContainerHTML = createSizeContainer(size, min, max, visible);
      RANGE_SIZE_WRAPPER.insertAdjacentHTML('beforeend', sizeContainerHTML);

      // Render text
      const isSizeVisible = visible;
      const visibleClass = isSizeVisible ? '' : 'hidden';
      const sizeTextRenderHTML = sizeTextRenderTemplate
        .replace(/%SIZE%/g, size)
        .replace('%VISIBLE_CLASS%', visibleClass)
        .replace('%TEXT%', basicValues.text);

      RENDER_SIZE_TEXT_CONTAINER.insertAdjacentHTML('beforeend', sizeTextRenderHTML);
    }
  }
};

const onCheckboxChange = (e) => {
  const checkbox = e.target;
  const size = checkbox.closest('.settings-size-element').querySelector('label').innerHTML;
  toggleSettingsSizeControl(checkbox);
  toggleRenderText(size, checkbox.checked);
};

const onMessageTextInput = () => {
  updateTextContent();
}

const onFontSelector = () => {
  changeTextFont();
}

const onCopyButtonClick = () => {
    navigator.clipboard.writeText(COPY_RESULT.innerText);
    COPY_DONE.classList.add('visible');
    setTimeout(() => COPY_DONE.classList.remove('visible'), 1500);
};

const toggleCodeSection = (e) => {
  const closeButton = document.getElementById('codeSectionCloseButton');
  if (e.target === closeButton || e.target === document.getElementById('outputButton')) {
    if (codeVisible) {
      closeCodeSection();
    } else {
      openCodeSection();
    }
  }
}

const openCodeSection = () => {
  const codeSection = document.getElementById('codeSection');
  let codeSectionNumber = 1;
  codeVisible = true;
  codeSection.classList.add('visible');

  for (let size in sizeValues) {
    if(size !== 'all'){
      const { 'min-fontsize': min, 'max-fontsize': max, visible } = sizeValues[size];
      if(visible == true){
        for (let i = 0; i < 4; i++) {
          // Number
          let tempLI = document.createElement('li');
          tempLI.textContent = ` ${codeSectionNumber}`;
          CODE_SECTION_NUMBERS_LIST.appendChild(tempLI);
          codeSectionNumber++;

          let tempCodePart = document.createElement('li');
          if(i == 0){
            tempCodePart.textContent = `${size} {`;
            CODE_SECTION_TEXT_LIST.appendChild(tempCodePart);
          }
          else if(i == 1){
            let tempCodeContent = generateClampCSS(size, sizeValues['all']['min-viewport'], sizeValues['all']['max-viewport'], min, max);
            tempCodePart.textContent = `   ${tempCodeContent}`;
            tempCodePart.classList.add('clampToFill');
            CODE_SECTION_TEXT_LIST.appendChild(tempCodePart);
          }
          else if(i == 2){
            tempCodePart.textContent = `}`;
            CODE_SECTION_TEXT_LIST.appendChild(tempCodePart);
          }
          else if(i == 3){
            let tempLIBR = document.createElement('br');
            tempCodePart.appendChild(tempLIBR);
            CODE_SECTION_TEXT_LIST.appendChild(tempCodePart);
          }
        }

      }
    }
  }
}

const closeCodeSection = () => {
  const codeSection = document.getElementById('codeSection');
  codeVisible = false;
  codeSection.classList.remove('visible');
  const codeNumbersLis = CODE_SECTION_NUMBERS_LIST.querySelectorAll('li');
  codeNumbersLis.forEach(li => li.remove());
  const codeTextLis = CODE_SECTION_TEXT_LIST.querySelectorAll('li');
  codeTextLis.forEach(li => li.remove());
}

const updateMinMaxAttributes = (minInput, maxInput) => {
  const minValue = parseFloat(minInput.value);
  const maxValue = parseFloat(maxInput.value);
  minInput.setAttribute('max', maxValue);
  maxInput.setAttribute('min', minValue);
};

const onResetButtonClick = () => {
  document.getElementById('messageTextInput').value = basicValues.text;
  FONT_SELECTOR.value = basicValues.fontFamily;
  document.getElementById('viewportWidth-min').value = basicValues['all']['min-viewport'];
  document.getElementById('viewportWidth-max').value = basicValues['all']['max-viewport'];

  for (let size in sizeValues) {
    if ('visible' in sizeValues[size]) {
      sizeValues[size]['min-fontsize'] = basicValues[size]['min-fontsize'];
      document.querySelector(`#size-${size}-min`).value = basicValues[size]['min-fontsize'];
      sizeValues[size]['max-fontsize'] = basicValues[size]['max-fontsize'];
      document.querySelector(`#size-${size}-max`).value = basicValues[size]['max-fontsize'];
      sizeValues[size]['visible'] = basicValues[size]['visible'];
      if(basicValues[size]['visible'] == true){
        document.querySelector(`input[name="choose-size-${size}"]`).checked = true;
        document.querySelector(`#size-settings-${size} .settings-size-control`).classList.remove('control--closed');
        document.querySelector(`#renderSection div[data-size-name="${size}"] .render-size-text`).classList.remove('hidden');
      }
      else{
        document.querySelector(`input[name="choose-size-${size}"]`).checked = false;
        document.querySelector(`#size-settings-${size} .settings-size-control`).classList.add('control--closed');
        document.querySelector(`#renderSection div[data-size-name="${size}"] .render-size-text`).classList.add('hidden');
      }
    }
  }
  
  updateTextContent();
  changeTextFont();
  getSettingsValue();
};

const changeTextFont = () => {
  const fontFamily = FONT_SELECTOR.value;
  if (fontFamily) {
    WebFont.load({ google: { families: [fontFamily] } });
    setTimeout(() => RENDER_SECTION.style.fontFamily = fontFamily, 300);
  }
}

const updateTextContent = () => {
  Array.from(RENDER_SIZE_TEXT).forEach(element => {
    element.textContent = document.getElementById('messageTextInput').value;
  });
}

const getSettingsValue = () => {
  // Get screen min/max value for font-size to evolve
  const minVW = parseFloat(VIEWPORT_WIDTH_MIN.value);
  const maxVW = parseFloat(VIEWPORT_WIDTH_MAX.value);

  // Loop through each settings-size-element element to get its tag and min/max font-size values
  document.querySelectorAll('#rangeSizeWrapper .settings-size-element').forEach(container => {
    const tag = container.querySelector('label').innerHTML;
    const minFS = parseFloat(container.querySelector(`#size-${tag}-min`).value);
    const maxFS = parseFloat(container.querySelector(`#size-${tag}-max`).value);

    // Update sizeValues values
    sizeValues['all'] = { 'min-viewport': minVW, 'max-viewport': maxVW };
    sizeValues[tag] = { 'min-fontsize': minFS, 'max-fontsize': maxFS, 'visible': sizeValues[tag]['visible']};
  });

  updateTestTextSize();
}

const updateTestTextSize = () => { 
    const sectionWidth = RENDER_SECTION.offsetWidth;
    Array.from(RENDER_SIZE_TEXT).forEach(textElement => {
        let elementTag = textElement.parentElement.getAttribute('data-size-name');
        if (sizeValues.hasOwnProperty(elementTag)) {
            let minFS = sizeValues[elementTag]["min-fontsize"];
            let maxFS = sizeValues[elementTag]["max-fontsize"];
            let minVW = sizeValues["all"]["min-viewport"];
            let maxVW = sizeValues["all"]["max-viewport"];
            textElement.style.fontSize = calculateFontSize(sectionWidth, minFS * baseFontSize, maxFS * baseFontSize, minVW, maxVW);
        } else {
            console.error(`La clé '${elementTag}' est manquante dans l'objet sizeValues.`);
        }
    });
};

const changeScreenWidth = () => {
    document.getElementById('renderSection').style.width = document.getElementById('rangeScreenWidthInput').value + '%';
    document.getElementById('rangeScreenIndication').innerHTML = document.getElementById('renderSection').offsetWidth;
    updateTestTextSize();
}

const toggleSettingsSizeControl = (checkbox) => {
  if (checkbox && checkbox.nodeName === "INPUT" && checkbox.type === "checkbox") {
    const sizeElement = checkbox.parentNode.parentNode;
    const sizeName = checkbox.name.replace('choose-size-', '');
    const settingsSizeControl = sizeElement.querySelector('.settings-size-control');
    if(sizeValues[sizeName].visible === true){ settingsSizeControl.classList.add('control--closed'); } else{ settingsSizeControl.classList.remove('control--closed'); }
    if(sizeValues[sizeName].visible === true){ sizeValues[sizeName].visible = false; } else{ sizeValues[sizeName].visible = true; }
  }
};

const toggleRenderText = (size, isVisible) => {
  const renderTextParent = RENDER_SECTION.querySelector(`[data-size-name="${size}"]`);
  const renderText = renderTextParent.querySelector('.render-size-text');
  isVisible ? renderText.classList.remove('hidden') : renderText.classList.add('hidden');
};

const generateClampCSS = (elm, minVW, maxVW, minFS, maxFS) => {
  const factor = (100 * (maxFS - minFS)) / ((maxVW - minVW) * 0.0625);
  const baseSize = minFS - ((100 * (maxFS - minFS)) / ((maxVW - minVW)) * minVW) / 100;
  return clampString = `font-size: clamp(${minFS.toFixed(4)}rem, ${baseSize.toFixed(4)}rem + ${factor.toFixed(4)}vw, ${maxFS.toFixed(4)}rem);`;
}

const calculateFontSize = (screenWidth, minFontSize, maxFontSize, minScreen, maxScreen) => {
  const sizeRatio = (maxFontSize - minFontSize) / (maxScreen - minScreen);
  let result = minFontSize + ((screenWidth - minScreen) * sizeRatio);
  if (result < minFontSize) { result = minFontSize; }
  if (result > maxFontSize) { result = maxFontSize; }
  return result + 'px';
};
