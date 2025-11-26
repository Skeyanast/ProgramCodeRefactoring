const CircuitBreaker = require('opossum');
const axios = require('axios');

// Конфигурация circuit breaker
const circuitOptions = {
    timeout: 3000,
    errorThresholdPercentage: 50,
    resetTimeout: 3000,
};

// Фабрика для создания circuit breakers
const createCircuitBreaker = (serviceName) => {
    const circuit = new CircuitBreaker(async (url, options = {}) => {
        try {
            const response = await axios({
                url,
                ...options,
                validateStatus: status => (status >= 200 && status < 300) || status === 404
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return error.response.data;
            }
            throw error;
        }
    }, circuitOptions);

    // Настраиваем fallback функцию
    circuit.fallback(() => ({ 
        error: `${serviceName} service temporarily unavailable` 
    }));

    // Логирование событий
    circuit.on('open', () => console.log(`${serviceName} circuit breaker opened`));
    circuit.on('close', () => console.log(`${serviceName} circuit breaker closed`));
    circuit.on('halfOpen', () => console.log(`${serviceName} circuit breaker half-open`));

    return circuit;
};

// Создаем circuit breakers для всех сервисов
const usersCircuit = createCircuitBreaker('Users');
const ordersCircuit = createCircuitBreaker('Orders');

module.exports = {
    usersCircuit,
    ordersCircuit
};