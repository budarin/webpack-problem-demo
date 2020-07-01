import getEnvironments, { TEnv } from '../appHelpers/getEnvironments';

// eslint-disable-next-line max-lines-per-function
describe('Тестируем getEnvironments', () => {
    test('Проверяем создание env.', async () => {
        await Promise.resolve()
            .then(() => getEnvironments())
            .then((env: TEnv) => {
                expect(env).toBeDefined();
            });
    });
});
