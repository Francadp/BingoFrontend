import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BingoService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getNumbers() {
    return this.http.get<{ numbers: number[] }>(`${this.apiUrl}/numbers`);
  }

  generateNumber() {
    return this.http.post<{ number: number }>(`${this.apiUrl}/number`, {});
  }

  getPrizes() {
    return this.http.get<{ prizes: any[] }>(`${this.apiUrl}/prizes`);
  }

  setPrizes(linePrizes: number, cartonPrizes: number) {
    return this.http.post(`${this.apiUrl}/prizes`, { linePrizes, cartonPrizes });
  }

  updatePrize(id: number, winner: string) {
    return this.http.patch(`${this.apiUrl}/prizes/${id}`, { winner });
  }

  /**
   * Método para reiniciar el juego
   */
  resetGame() {
    return this.http.post<{ message: string }>(`${this.apiUrl}/reset`, {});
  }
}
