import { Component, OnInit } from '@angular/core';
import { BingoService } from 'src/app/services/bingo.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  countdownImage: string = 'assets/numbers/number2.png';  // Empezamos con la imagen de 'number3.png'
  currentNumber: number | null = null;
  isPlaying = false;
  isCountingDown = true; // Nueva propiedad para controlar si estamos en cuenta regresiva
  private gameInterval: any = null;

  constructor(private bingoService: BingoService) {}

  ngOnInit(): void {}

  togglePlayPause() {
    this.isPlaying ? this.pauseGame() : this.startGame();
  }

  private startGame() {
    this.isPlaying = true;
    this.currentNumber = null;
    this.isCountingDown = true;  // Reinicia la cuenta regresiva
    this.runGameCycle();
  }

  private pauseGame() {
    this.isPlaying = false;
    clearInterval(this.gameInterval);
  }

  private runGameCycle() {
    let countdown = 3;  // Usamos una variable local 'countdown'
    this.countdownImage = 'assets/numbers/number2.png';
    this.gameInterval = setInterval(() => {
      if (!this.isPlaying) {
        clearInterval(this.gameInterval);
        return;
      }

      // Cambiar la imagen según el valor de 'countdown'
      if (countdown === 3) {
        this.countdownImage = 'assets/numbers/number2.png';
      } else if (countdown === 2) {
        this.countdownImage = 'assets/numbers/number1.png';
      } else if (countdown === 1) {
        this.countdownImage = 'assets/numbers/number3.png';
      }

      // Decrementar el contador y verificar si termina
      countdown -= 1;

      if (countdown < 0) {
        clearInterval(this.gameInterval);  // Detiene el ciclo de cuenta regresiva
        this.isCountingDown = false;  // Termina la cuenta regresiva
        this.getNumber();  // Genera el número
      }
    }, 1000);
  }

  private getNumber() {
    this.bingoService.generateNumber().subscribe({
      next: (res) => {
        this.currentNumber = res.number;

        // Muestra el número durante 8 segundos
        setTimeout(() => {
          // Después de 8 segundos, reinicia la cuenta regresiva
          if (this.isPlaying) {
            this.isCountingDown = true;  // Reinicia la cuenta regresiva
            this.runGameCycle();  // Comienza de nuevo con la cuenta regresiva
          }
        }, 8000);
      },
      error: () => {
        this.currentNumber = null;
        alert('No more numbers to generate!');
        this.isPlaying = false;
      },
    });
  }
}
