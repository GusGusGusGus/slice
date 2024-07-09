import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { GalleryModule, GalleryItem, ImageItem, Gallery, ImageSize } from 'ng-gallery';
import 'hammerjs';
import { SharedModule } from 'src/app/_modules/shared.module';
import { CommonModule } from '@angular/common';
import { DateAgoPipe } from 'src/app/pipes/date-ago.pipe';
import { MemberMessagesComponent } from "../member-messages/member-messages.component";
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Message } from 'src/app/_models/message';
import { MessageService } from 'src/app/_services/message.service';


@Component({
    selector: 'app-member-detail',
    templateUrl: './member-detail.component.html',
    styleUrls: ['./member-detail.component.css'],
    standalone: true,
    imports: [CommonModule, SharedModule, GalleryModule, MemberMessagesComponent]
})
export class MemberDetailComponent {
  @ViewChild('memberTabs', {static: true}) memberTabs: TabsetComponent;
  member: Member;
  galleryImages: GalleryItem[] = [];
  activeTab: TabDirective;
  messages: Message[] = [];


  constructor(
    private memberService: MembersService, 
    private messageService: MessageService,
    private route: ActivatedRoute) {
    }
    
    ngOnInit() {
      this.route.data.subscribe(data => {
        this.member = data['member'];
      }
      );

      this.route.queryParams.subscribe(params => {
        params['tab'] ? this.selectTab(params['tab']) : this.selectTab(0);
      });

      this.galleryImages = this.getImages();
  }

  getImages(): GalleryItem[] {
    const images = [];
    for (const photo of this.member.photos) {
      images.push(new ImageItem({ src: photo?.url, thumb: photo?.url}));
    }
    return images;
  }


  loadMessages() {
    this.messageService.getMessageThread(this.member.username).subscribe(messages => {
      this.messages = messages;
    });
  }

  selectTab(tabId: number) {
    this.memberTabs.tabs[tabId].active = true;
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages' && this.messages.length === 0) {
      this.loadMessages();
    }
  }

}
