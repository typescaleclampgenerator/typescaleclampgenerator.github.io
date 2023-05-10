// Variables.js
const basicValues = { 
    text: 'The quick brown fox jumps over the lazy dog.', 
    fontFamily: 'Inter',
    'all': { 'min-viewport': 576, 'max-viewport': 1200 },
    'xxl': { 'min-fontsize': 2.00, 'max-fontsize': 6.00, 'visible': false },
    'xl': { 'min-fontsize': 1.55, 'max-fontsize': 4.00, 'visible': true },
    'lg': { 'min-fontsize': 1.25, 'max-fontsize': 2.00, 'visible': true },
    'md': { 'min-fontsize': 1.00, 'max-fontsize': 1.20, 'visible': true },
    'sm': { 'min-fontsize': 0.80, 'max-fontsize': 1.10, 'visible': true },
    'xs': { 'min-fontsize': 0.65, 'max-fontsize': 0.90, 'visible': false }
};
    
let codeVisible = false;

let baseFontSize = 16;

const sizeValues = {
    'all': { 'min-viewport': 576, 'max-viewport': 1200 },
    'xxl': { 'min-fontsize': 2.00, 'max-fontsize': 6.00, 'visible': false },
    'xl': { 'min-fontsize': 1.55, 'max-fontsize': 4.00, 'visible': true },
    'lg': { 'min-fontsize': 1.25, 'max-fontsize': 2.00, 'visible': true },
    'md': { 'min-fontsize': 1.00, 'max-fontsize': 1.20, 'visible': true },
    'sm': { 'min-fontsize': 0.80, 'max-fontsize': 1.10, 'visible': true },
    'xs': { 'min-fontsize': 0.65, 'max-fontsize': 0.90, 'visible': false }
};

const FONT_SELECTOR = document.getElementById('fontSelector');
const RENDER_SECTION = document.getElementById('renderSection');
const VIEWPORT_WIDTH_MIN = document.getElementById('viewportWidth-min');
const VIEWPORT_WIDTH_MAX = document.getElementById('viewportWidth-max');
const RENDER_SIZE_TEXT = document.getElementsByClassName('render-size-text');
const RENDER_SIZE_TEXT_CONTAINER = document.getElementById('render-window-content');
const RANGE_SIZE_WRAPPER = document.getElementById('rangeSizeWrapper');
const COPY_RESULT = document.getElementById('code_result');
const COPY_DONE = document.getElementById('copyDone');
const CODE_SECTION_NUMBERS_LIST = codeSection.querySelector('.code-number-list');
const CODE_SECTION_TEXT_LIST = codeSection.querySelector('.code-text-list');

const sizeContainerTemplate = `
    <div id="size-settings-%SIZE%" class="settings-size-element size-container">
        <div class="size-element-heading">
            <input type="checkbox" name="choose-size-%SIZE%" class="size-heading-checkbox" %CHECKED%>
            <label class="size-heading-label" for="size-%SIZE%">%SIZE%</label>
        </div>
        <div class="settings-size-control %CONTROL_CLASS%">
            <div class="size-control-min">
                <input type="number" id="size-%SIZE%-min" class="size-control-input" value="%MIN_VALUE%" step="0.01" %TABINDEX%>
                <span class="size-control-unit">rem</span>
            </div>
            <div class="size-control-max">
                <input type="number" id="size-%SIZE%-max" class="size-control-input" value="%MAX_VALUE%" step="0.01" %TABINDEX%>
                <span class="size-control-unit">rem</span>
            </div>
        </div>
    </div>
`;

const sizeTextRenderTemplate = `
    <div class="render-size-container" data-size-name="%SIZE%">
        <span class="render-size-name">%SIZE%</span>
        <span class="render-size-text %VISIBLE_CLASS%">%TEXT%</span>
    </div>
`;