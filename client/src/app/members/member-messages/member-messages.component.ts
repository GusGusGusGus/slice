import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Message } from 'src/app/_models/message';
import { SharedModule } from 'src/app/_modules/shared.module';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-messages',
  standalone: true,
  imports: [CommonModule, SharedModule, FormsModule],
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.css'
})
export class MemberMessagesComponent {
  @ViewChild('messageForm') messageForm: NgForm;
  @Input() messages: Message[];
  @Input() username: string;
  messageContent: string;

  constructor(private messageService: MessageService) {
  }

  ngOnInit(): void {
  }

  sendMessage() {
    this.messageService.sendMessage(this.username, this.messageContent).subscribe(message => {
      this.messages.push(message);
      this.messageForm.reset();
    });
  }

}
