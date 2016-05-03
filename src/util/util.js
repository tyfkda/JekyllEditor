export default class Util {
  static parseDate(dateStr) {
    const d = dateStr.replace(/-/g, '/')
    return new Date(d)
  }
}
