import { StormGlass } from '@src/clients/stormGlass';
import axios from 'axios';
import stormGlassWeather3HoursFixture from '@test/fixture/stormGlass_weather_3_hours.json'
import stomGlassWeatherNormalized3HoursFixture from '@test/fixture/stormGlass_normalized_response_3_hours.json'

jest.mock('axios');

describe('StormGlass client', () => {
  it('should return the normalized forecast from the StormGlass service', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    axios.get = jest.fn().mockResolvedValue({data: stormGlassWeather3HoursFixture})

    const stormGlass = new StormGlass(axios)
    const response = await stormGlass.featshPoints(lat, lng)
    expect(response).toEqual(stomGlassWeatherNormalized3HoursFixture)
  })
})
