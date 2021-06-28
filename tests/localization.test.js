const { getMessagesFromFile, createKeyFromString } =  require('../src/util');
const { t, setTranslations } = require('../src/localization');
const path = require('path');
const root = './tests';

const sglBacktickPath = './fixtures/SingleKeyComponents/BacktickComponent.jsx';
const sglSingleQuotePath = './fixtures/SingleKeyComponents/SingleQuoteComponent.jsx';
const sglDoubleQuotePath = './fixtures/SingleKeyComponents/DoubleQuoteComponent.jsx';

const dblBacktickPath = './fixtures/DoubleKeyComponents/BacktickComponent.jsx';
const dblSingleQuotePath = './fixtures/DoubleKeyComponents/SingleQuoteComponent.jsx';
const dblDoubleQuotePath = './fixtures/DoubleKeyComponents/DoubleQuoteComponent.jsx';

const mockTranslations = require('./fixtures/mockTranslations.json');
setTranslations(mockTranslations);

test('Test finding single \' message', () => {
  const msgs = getMessagesFromFile(path.resolve(root, sglSingleQuotePath));
  expect(msgs.length).toBe(1);
  expect(msgs[0].id).toBe("test_key");
  expect(msgs[0].defaultMessage).toBe("Test key");
});

test('Test finding single \` message', () => {
  const msgs = getMessagesFromFile(path.resolve(root, sglBacktickPath));
  expect(msgs.length).toBe(1);
  expect(msgs[0].id).toBe("test_key");
  expect(msgs[0].defaultMessage).toBe("Test key");
});

test('Test finding single \" message', () => {
  const msgs = getMessagesFromFile(path.resolve(root, sglDoubleQuotePath));
  expect(msgs.length).toBe(1);
  expect(msgs[0].id).toBe("test_key");
  expect(msgs[0].defaultMessage).toBe("Test key");
});

test('Test finding double \' message', () => {
  const msgs = getMessagesFromFile(path.resolve(root, dblSingleQuotePath));
  expect(msgs.length).toBe(2);
  expect(msgs[0].id).toBe("first_test_key");
  expect(msgs[0].defaultMessage).toBe("First test key");
  expect(msgs[1].id).toBe("second_test_key");
  expect(msgs[1].defaultMessage).toBe("Second test key");
});

test('Test finding double \` message', () => {
  const msgs = getMessagesFromFile(path.resolve(root, dblBacktickPath));
  expect(msgs.length).toBe(2);
  expect(msgs[0].id).toBe("first_test_key");
  expect(msgs[0].defaultMessage).toBe("First test key");
  expect(msgs[1].id).toBe("second_test_key");
  expect(msgs[1].defaultMessage).toBe("Second test key");
});

test('Test finding double \" message', () => {
  const msgs = getMessagesFromFile(path.resolve(root, dblDoubleQuotePath));
  expect(msgs.length).toBe(2);
  expect(msgs[0].id).toBe("first_test_key");
  expect(msgs[0].defaultMessage).toBe("First test key");
  expect(msgs[1].id).toBe("second_test_key");
  expect(msgs[1].defaultMessage).toBe("Second test key");
});

test('Extracting multiple keys', () => {
  const msgs = getMessagesFromFile(path.resolve(root, dblSingleQuotePath));
  expect(msgs.length).toBe(2);
  expect(createKeyFromString(msgs[0].defaultMessage)).toBe("first_test_key");
  expect(createKeyFromString(msgs[1].defaultMessage)).toBe("second_test_key");
});

test('Should get message key style key', () => {
  expect(t('test_key')).toBe('Test key number one');
});

test('Should get message from string style key', () => {
  expect(t('Test key!')).toBe('Test key number one');
});

test('Should get message with one number value', () => {
  expect(t('key_with_one_value', 1)).toBe('Test key with value: 1');
});

test('Should get message with one string value', () => {
  expect(t('key_with_one_value', 'one')).toBe('Test key with value: one');
});

test('Should get message with multiple number values', () => {
  expect(t('key_with_two_values', 1, 2)).toBe('Test key with value1: 1, value2: 2');
});

test('Should get message with one string value', () => {
  expect(t('key_with_two_values', 'one', 'two')).toBe('Test key with value1: one, value2: two');
});

test('Should throw too many values', () => {
  expect(() => t('Test key', 33)).toThrowError('wrong amount');
});
