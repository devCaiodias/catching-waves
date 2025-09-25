import { Server } from '@overnightjs/core';
import './utils/mudule-alias';
import bodyParser from 'body-parser';
import { ForecastController } from './controllers/forecast';
import { Application } from 'express';

export class SetupServer extends Server {
  constructor(private port = 8080) {
    super();
  }

  public init(): void {
    this.setupExpress();
    this.setupControllers();
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
  }

  private setupControllers(): void {
    const forecasController = new ForecastController();
    this.addControllers([forecasController]);
  }

  public getApp(): Application {
    return this.app;
  }
}
