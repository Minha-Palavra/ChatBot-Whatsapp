export function formatString(template: string, ...values: any[]): string {
  return template.replace(/\$\{(\d+)\}/g, (match, index) => {
    return values[index] || match;
  });
}
