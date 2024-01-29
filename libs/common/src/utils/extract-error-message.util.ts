export function extractErrorMessage(fullErrorMessage: string): string {
    const lines = fullErrorMessage.split('\n');
    // Возвращаем последнюю непустую строку
    return lines.reverse().find((line) => line.trim() !== '');
}
