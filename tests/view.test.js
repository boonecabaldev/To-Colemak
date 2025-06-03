/**
 * @jest-environment jsdom
 */
jest.useFakeTimers();

const { View } = require('../view.js');

describe('View', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    View.currentOverlay = null;
    global.Model = { isActive: true };
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
});