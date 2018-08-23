import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataComponent {
  public webAPIForecasts: WeatherForecast[];
  public azureFunctionForecasts: WeatherForecast[];

  private webAPIUrl: string = 'https://localhost:44399/';
  private azureFunctionUrl: string = 'http://localhost:7071/';

  constructor(private http: HttpClient) {
    this.fetchWebAPIData();
    this.fetchFunctionAPIData();
  }

  fetchWebAPIData() {
    console.log("Fetching Web API data...");
    this.http.get<WeatherForecast[]>(this.webAPIUrl + 'api/SampleData/WeatherForecasts').subscribe(result => {
      this.webAPIForecasts = result;
    }, error => console.error(error));
  }

  fetchFunctionAPIData() {
    console.log("Fetching Azure Function data...");
    this.http.get<WeatherForecast[]>(this.azureFunctionUrl + 'api/SampleData/WeatherForecasts').subscribe(result => {
      this.azureFunctionForecasts = result;
    }, error => console.error(error));
  }
}

interface WeatherForecast {
  dateFormatted: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}
