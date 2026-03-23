class Logger {
  public log: string[] = [];

  public logMessage(message: string): void {
    this.log.push(`[${new Date().toISOString()}] ${message}`);
  }

  public printLog(): void {
    console.log(this.log.join("\n"));
  }
  public clear(): void {
    this.log = [];
  }
}

export default new Logger();
