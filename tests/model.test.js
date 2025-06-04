const { Model } = require('../src/model.js');

describe('Model', () => {
  beforeEach(() => {
    // Reset Model state before each test
    Model.isActive = false;
    Model.keyboardLayout = null;
    global.chrome = {
      storage: {
        sync: {
          set: jest.fn(),
          get: jest.fn()
        }
      }
    };
    global.View = { updateHighlight: jest.fn() };
  });

  test('setLayout sets QWERTY mapping', () => {
    Model.setLayout('qwerty');
    expect(Model.keyboardLayout).toBe(Model.qwertyToColemak);
  });

  test('setLayout sets Dvorak mapping', () => {
    Model.setLayout('dvorak');
    expect(Model.keyboardLayout).toBe(Model.dvorakToColemak);
  });

  test('setActive updates isActive and persists', () => {
    Model.setActive(true);
    expect(Model.isActive).toBe(true);
    expect(global.chrome.storage.sync.set).toHaveBeenCalledWith({ isActive: true });
  });

  test('load sets state from storage', () => {
    global.chrome.storage.sync.get.mockImplementation((keys, cb) => {
      cb({ isActive: true, layout: 'dvorak' });
    });
    global.View = { updateHighlight: jest.fn() }; // <-- Add this line
    Model.setLayout = jest.fn();
    Model.load();
    expect(Model.isActive).toBe(true);
    expect(Model.setLayout).toHaveBeenCalledWith('dvorak');
  });
});