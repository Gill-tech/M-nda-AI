/** Mock IoT kit data generator. */
/**
 * Generate mock IoT sensor data for a given serial number.
 * This simulates real IoT kit readings.
 */
const generateMockIoTData = (iotKitSerial) => {
  // Generate realistic sensor readings based on serial number hash
  const hash = iotKitSerial.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);

  // Use hash to create consistent but varied readings
  const seed = hash % 1000;
  
  return {
    npk: {
      n: 50 + (seed % 40), // 50-90
      p: 40 + (seed % 35), // 40-75
      k: 35 + (seed % 30), // 35-65
    },
    soilMoisture: 40 + (seed % 50), // 40-90%
    humidity: 60 + (seed % 30), // 60-90%
    temperature: 20 + (seed % 15), // 20-35°C
    cropYieldEstimate: 50 + (seed % 100), // 50-150 (arbitrary units)
  };
};

module.exports = {
  generateMockIoTData,
};

