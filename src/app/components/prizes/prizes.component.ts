import { Component, OnInit } from '@angular/core';
import { BingoService } from 'src/app/services/bingo.service';
import Swal from 'sweetalert2'; // Importar SweetAlert2

@Component({
  selector: 'app-prizes',
  templateUrl: './prizes.component.html',
  styleUrls: ['./prizes.component.css'],
})
export class PrizesComponent implements OnInit {
  prizes: { type: string; winner: string | null; successMessage?: string | null }[] = [];
  lineaPrizes = 0;
  cartonPrizes = 0;
  isConfigured = false; // Variable que controla si los premios están configurados
  showModal: boolean = false; // Controla la visibilidad del modal
  winnerName: string = ''; // Nombre del ganador que se asignará
  selectedPrizeIndex: number | null = null; // Índice del premio seleccionado

  constructor(private bingoService: BingoService) {}

  ngOnInit(): void {
    this.fetchPrizes();
  }

  configurePrizes(): void {
    if (this.lineaPrizes > 0 && this.cartonPrizes > 0) {
      this.bingoService.setPrizes(this.lineaPrizes, this.cartonPrizes).subscribe({
        next: () => {
          this.isConfigured = true;
          this.fetchPrizes();
        },
        error: (err) => {
          console.error('Error configurando los premios:', err);
          alert('Hubo un error al configurar los premios.');
        }
      });
    } else {
      alert('Por favor ingresa valores válidos para líneas y cartones.');
    }
  }

  fetchPrizes(): void {
    this.bingoService.getPrizes().subscribe({
      next: (res) => {
        this.prizes = res.prizes.map((prize: any) => ({
          ...prize,
          successMessage: null, // Agregar campo para el mensaje de éxito
        }));
      },
      error: (err) => {
        console.error('Error obteniendo los premios:', err);
        alert('Hubo un error al obtener los premios.');
      }
    });
  }

  markWinner(index: number): void {
    console.log('Abrir modal para el premio:', index);
    if (!this.prizes[index].winner) {
      // Mostrar el modal y almacenar el índice del premio seleccionado
      this.showModal = true;
      this.selectedPrizeIndex = index;
      this.winnerName = '';
    } else {
      alert('Este premio ya tiene unx ganadorx.');
    }
  }

  assignWinner(index: number): void {
    console.log('Ganador asignado:', this.winnerName);
    if (this.winnerName.trim() && index !== null) {
      this.bingoService.updatePrize(index, this.winnerName).subscribe({
        next: () => {
          this.prizes[index].winner = this.winnerName; // Actualizar ganador del premio seleccionado
          this.showModal = false; // Cerrar modal

          // Mostrar un mensaje con efecto de confeti usando SweetAlert2
          Swal.fire({
            title: `¡FELICITACIONES ${this.winnerName.toUpperCase()}!`,
            text: `Retirá tu premio`,
            icon: 'success',
            showConfirmButton: false,
            timer: 3000, // La ventana emergente se cierra después de 3 segundos
            didOpen: () => {
              Swal.showLoading();
              // Aquí es donde puedes agregar un efecto de confeti
            }
          });

          // Ocultar el mensaje después de 4 segundos
          setTimeout(() => {
            this.prizes[index].successMessage = null;
          }, 4000); // Cambié a 4000 ms (4 segundos) para que el mensaje sea visible por más tiempo
        },
        error: (err) => {
          console.error('Error al asignar ganadorx:', err);
          alert('Hubo un error al asignar lx ganadorx.');
        }
      });
    } else {
      alert('Por favor ingresa un nombre válido.');
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedPrizeIndex = null;
  }
}
