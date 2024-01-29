import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';
import { YandexStrategy } from './yandex.strategy';
import { ApiKeyStrategy } from './api-key.strategy';

export const STRATEGIES = [JwtStrategy, GoogleStrategy, YandexStrategy, ApiKeyStrategy];
