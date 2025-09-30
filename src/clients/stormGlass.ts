import { InternalError } from "@src/utils/errors/internal-erros";
import { AxiosStatic } from "axios";

export interface StormGlassPointSource {
  [key: string]: number;
}

export interface StormGlassPoint {
  readonly time: string;
  readonly waveHeight: StormGlassPointSource;
  readonly waveDirection: StormGlassPointSource;
  readonly swellDirection: StormGlassPointSource;
  readonly swellHeight: StormGlassPointSource;
  readonly swellPeriod: StormGlassPointSource;
  readonly windDirection: StormGlassPointSource;
  readonly windSpeed: StormGlassPointSource;
}

export interface StormGlassForecastResponse {
  hours: StormGlassPoint[]
}

export interface forecastPonit {
  time: string
  waveHeight: number;
  waveDirection: number;
  swellDirection: number;
  swellHeight: number;
  swellPeriod: number;
  windDirection: number;
  windSpeed: number;

}

export class ClientRequestError extends InternalError {
  constructor(message: string) {
    const internalMessage = 'Unexpected error when trying to communicate to StormGlass'
    super(`${internalMessage}: ${message}`)
  }
}

export class StormGlassResponseError extends InternalError {
  constructor(message: string) {
    const internalMessage = 'Unexpected error returned by the StormGlass service';
    super(`${internalMessage}: ${message}`)
  }
}

// 3259908e-9a4b-11f0-b07a-0242ac130006-32599138-9a4b-11f0-b07a-0242ac130006

export class StormGlass {
  readonly stormGlassApiParams = 'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed'
  readonly stormGlassApiSource = 'noaa'
  constructor(protected request: AxiosStatic) { }
  public async featshPoints(lat: number, lng: number): Promise<forecastPonit[]> {
    try {
      const response = await this.request.get<StormGlassForecastResponse>(
        `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${this.stormGlassApiParams}&source=${this.stormGlassApiSource}`,
        {
          headers: {
            Authorization: 'fake-token'
          }
        }
      )
      return this.normalizeResponse(response.data)

    } catch (err: any) {
        if (err.response && err.response.status) {
          throw new StormGlassResponseError(`Error: ${JSON.stringify(err.response.data)} Code: ${
            err.response.status
          }`)
        }
        throw new ClientRequestError(err.message)
    }
  }

  private normalizeResponse(points: StormGlassForecastResponse): forecastPonit[] {
    return points.hours.filter(this.isValidPoint.bind(this)).map((point) => ({
      swellDirection: point.swellDirection[this.stormGlassApiSource],
      swellHeight: point.swellHeight[this.stormGlassApiSource],
      swellPeriod: point.swellPeriod[this.stormGlassApiSource],
      time: point.time,
      waveDirection: point.waveDirection[this.stormGlassApiSource],
      waveHeight: point.waveHeight[this.stormGlassApiSource],
      windDirection: point.windDirection[this.stormGlassApiSource],
      windSpeed: point.windSpeed[this.stormGlassApiSource],
    }));
  }

  private isValidPoint(points: Partial<StormGlassPoint>): boolean {
    return !!(
      points.time &&
      points.swellDirection?.[this.stormGlassApiSource] &&
      points.swellPeriod?.[this.stormGlassApiSource] &&
      points.swellHeight?.[this.stormGlassApiSource] &&
      points.waveDirection?.[this.stormGlassApiSource] &&
      points.waveHeight?.[this.stormGlassApiSource] &&
      points.windDirection?.[this.stormGlassApiSource] &&
      points.windSpeed?.[this.stormGlassApiSource]
    )
  }
}
