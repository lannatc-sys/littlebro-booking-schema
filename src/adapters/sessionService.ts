export var SESSION_PREFIX = "SESSION:";
export var SESSION_EXPIRE_SECONDS = 21600;
export function createSession(email) {
  const cache = CacheService.getScriptCache();
  const token = Utilities.getUuid();
  cache.put(SESSION_PREFIX + token, email.toLowerCase(), SESSION_EXPIRE_SECONDS);
  return token;
}
export function destroySession(token) {
  if (!token) return;
  CacheService.getScriptCache().remove(SESSION_PREFIX + token);
}
export function isValidToken(token) {
  return getSessionEmail(token) !== null;
}
export function getSessionEmail(token) {
  if (!token) return null;
  return CacheService.getScriptCache().get(SESSION_PREFIX + token);
}
