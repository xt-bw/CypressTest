export function getTimestamp() {
  return new Date().toISOString()
    .replace(/T/, '_')
    .replace(/\..+/, '')
    .replace(/[-:]/g, '')
    .slice(2);
}

export const getScnshotName = (baseName) => {
  const timestamp = new Date()
    .toISOString()
    .replace(/T/, '_')
    .replace(/\..+/, '')
    .replace(/[-:]/g, '')
    .slice(2);
  return `${timestamp}_${baseName}`;
};

export const scnshotPath = (testClass, testName, step=null) => {
  const timestamp = new Date()
    .toISOString()
    .replace(/T/, '_')
    .replace(/\..+/, '')
    .replace(/[-:]/g, '')
    .slice(2);
  return step ? `Aurapay/${testClass}/${timestamp}_${testName}_${step}` : `Aurapay/${testClass}/${timestamp}_${testName}`;
};
