export class Util {
  static parseDate(dateStr: string): Date {
    const d = dateStr.replace(/-/g, '/')
    return new Date(d)
  }
}
