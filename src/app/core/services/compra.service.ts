import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CompraService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  realizarCompra(): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/compras/realizar`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
  }

  obtenerHistorial(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/compras/mis-compras`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  iniciarPagoWebpay(): Observable<{ token: string; url: string }> {
    return this.http.post<{ token: string; url: string }>(
      `${this.apiUrl}/api/compras/webpay/iniciar`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
  }

  confirmarPagoWebpay(tokenWs: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/compras/webpay/confirmar`,
      { token_ws: tokenWs },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
  );
}


  redirigirAPagoWebpay(): void {
    this.iniciarPagoWebpay().subscribe({
      next: ({ token, url }: { token: string; url: string }) => {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = url;

        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'token_ws';
        input.value = token;
        form.appendChild(input);

        document.body.appendChild(form);
        form.submit(); // Redirige a Webpay automáticamente
      },
      error: (err: any) => {
        console.error('Error al iniciar el pago:', err);
      }
    });
  }
}
