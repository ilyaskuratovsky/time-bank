class Logger {
  private logInternal: string[] = [];

  public log(message: string): void {
    this.logInternal.push(`[${new Date().toISOString()}] ${message}`);
  }

  public printLog(): void {
    console.log(this.logInternal.join("\n"));
  }
  public clear(): void {
    this.logInternal = [];
  }

  public getLog(): string[] {
    return this.logInternal;
  }
}

export default new Logger();
