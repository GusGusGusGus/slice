import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { GalleryModule, GalleryItem, ImageItem, Gallery, ImageSize } from 'ng-gallery';
import 'hammerjs';
import { SharedModule } from 'src/app/_modules/shared.module';
import { CommonModule } from '@angular/common';
import { DateAgoPipe } from 'src/app/pipes/date-ago.pipe';


@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
  standalone: true,
  imports: [CommonModule, SharedModule, GalleryModule]
})
export class MemberDetailComponent {
  member: Member;
  galleryImages: GalleryItem[] = [];


  constructor(
    private memberService: MembersService, 
    private route: ActivatedRoute) {
    }
    
    ngOnInit() {
      this.loadMember();
      

  }

  getImages(): GalleryItem[] {
    const images = [];
    for (const photo of this.member.photos) {
      images.push(new ImageItem({ src: photo?.url, thumb: photo?.url}));
    }
    return images;
  }

  loadMember() {
    this.memberService.getMember(this.route.snapshot.paramMap.get('username')).subscribe(member => {
      this.member = member;
      this.galleryImages = this.getImages();
    })
  }

}
