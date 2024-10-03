export const getConfigurations = () => {
  const configs = localStorage.getItem('evaluationConfigs');
  return configs ? JSON.parse(configs) : [];
};

export const saveConfigurations = (configs) => {
  localStorage.setItem('evaluationConfigs', JSON.stringify(configs));
};

export const addConfiguration = (config) => {
  const configs = getConfigurations();
  configs.push(config);
  saveConfigurations(configs);
};

export const updateConfiguration = (updatedConfig) => {
  let configs = getConfigurations();
  configs = configs.map((config) => (config.id === updatedConfig.id ? updatedConfig : config));
  saveConfigurations(configs);
};

export const deleteConfiguration = (id) => {
  let configs = getConfigurations();
  configs = configs.filter((config) => config.id !== id);
  saveConfigurations(configs);
};