export class Util {
  static parseDate(dateStr: string): Date {
    const d = dateStr.replace(/(\d+)-(\d+)-(\d+)/,
                              (_m, year, month, day) => `${year}/${month}/${day}`)
    return new Date(d)
  }
}
