/**
 * @jest-environment jsdom
 */
jest.useFakeTimers();

const { View } = require('../view.js');
const { Model } = require('../model.js');
const { dvorakToColemakConversion } = require('../controller.js');

global.Model = Model;
//document.execCommand = jest.fn();

describe('View', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    View.currentOverlay = null;
    // Do NOT overwrite Model with a plain object!
    Model.isActive = true; // Just set the property
  });

  test('handleFocus sets borderColor to red if active', () => {
    const input = document.createElement('input');
    View.handleFocus({ target: input });
    expect(input.style.borderColor).toBe('red');
  });

  test('handleBlur resets borderColor if active', () => {
    const input = document.createElement('input');
    input.style.borderColor = 'red';
    View.handleBlur({ target: input });
    expect(input.style.borderColor).toBe('');
  });

  test('updateHighlight highlights active input', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();
    View.updateHighlight();
    expect(input.style.borderColor).toBe('red');
  });

  test('showToggleMessage creates and removes overlay', () => {
    View.showToggleMessage('Test');
    const overlay = document.querySelector('div');
    expect(overlay).not.toBeNull();
    expect(overlay.textContent).toBe('Test');
    // Simulate timeout
    jest.runAllTimers();
  });

  test('handleFocus does not set borderColor if Model.isActive is false', () => {
    Model.isActive = false;
    const input = document.createElement('input');
    View.handleFocus({ target: input });
    expect(input.style.borderColor).toBe('');
  });

  test('typing in textbox converts keys to Colemak when Model.isActive is true', () => {
    // Set up
    Model.isActive = false;
    Model.setLayout('qwerty');
    document.body.innerHTML = '<input id="testInput">';
    const input = document.getElementById('testInput');
    input.focus();

    // Simulate typing 'hi ' with Model inactive (should be literal)
    ['h', 'i', ' '].forEach(key => {
      input.selectionStart = input.value.length;
      input.selectionEnd = input.value.length;
      const event = new KeyboardEvent('keydown', { key, bubbles: true });
      input.dispatchEvent(event);
      input.value += key;
    });
    expect(input.value).toBe('hi ');

    // Activate extension
    Model.isActive = true;

    // Simulate typing 'there' in Colemak keys (QWERTY: t h e r e)
    const colemakKeys = ['t', 'h', 'e', 'r', 'e'];
    colemakKeys.forEach(key => {
      input.selectionStart = input.value.length;
      input.selectionEnd = input.value.length;
      const event = new KeyboardEvent('keydown', { key, bubbles: true });
      Object.defineProperty(event, 'target', { writable: false, value: input });
      dvorakToColemakConversion(event);
    });

    // The expected value is: 'hi ' + mapped keys
    expect(input.value).toBe('hi ghfpf');
  });
});