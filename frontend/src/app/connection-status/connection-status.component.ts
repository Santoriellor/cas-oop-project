import { Component } from '@angular/core';
import { ConnectionStatusService } from '../service/connection-status.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-connection-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './connection-status.component.html',
  styleUrls: ['./connection-status.component.scss']
})
export class ConnectionStatusComponent {
  isConnected$ = this.connectionStatusService.getStatus();

  constructor(private connectionStatusService: ConnectionStatusService) {}
}
