import { Component, OnDestroy, OnInit } from '@angular/core';
import { BingoService } from 'src/app/services/bingo.service';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-numbers-list',
  templateUrl: './numbers-list.component.html',
  styleUrls: ['./numbers-list.component.css'],
})
export class NumbersListComponent implements OnInit, OnDestroy {
  numbers: number[] = [];
  private subscription: Subscription | null = null;

  constructor(private bingoService: BingoService) {}

  ngOnInit(): void {
    this.startAutoFetch();
  }

  ngOnDestroy(): void {
    this.stopAutoFetch();
  }

  startAutoFetch() {
    // Realiza una solicitud cada 5 segundos (ajusta el intervalo según sea necesario)
    this.subscription = interval(1000)
      .pipe(switchMap(() => this.bingoService.getNumbers()))
      .subscribe({
        next: (res) => {
          this.numbers = res.numbers;
        },
        error: (err) => {
          console.error('Error fetching numbers:', err);
        },
      });
  }

  stopAutoFetch() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  resetGame(): void {
    // Detiene la actualización automática y reinicia el juego en el backend
    this.stopAutoFetch();
    this.bingoService.resetGame().subscribe({
      next: () => {
        this.numbers = []; // Limpia la lista de números
        this.startAutoFetch(); // Reinicia la lista automáticamente
      },
      error: (err) => {
        console.error('Error resetting game:', err);
        alert('Hubo un problema al reiniciar el juego.');
      },
    });
  }

}
