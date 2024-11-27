export class Logger {
  static info(...data: any[]) {
    console.log(`[${now()}] INFO ${this.printArray(" ", ...data)}`);
  }

  static debug(...data: any[]) {
    console.log(`[${now()}] DEBUG ${this.printArray(" ", ...data)}`);
  }

  private static printArray(end: string, ...data: any[]) {
    let final = ""
    for (const item of data) {
      final += (item + end);
    }
    return final;
  }
}

function now() {
  return new Date().toLocaleString('de-DE', {timeZone: 'Europe/Berlin'});
}