import { PlayListService } from './../../providers/playlist.service';
import { AdicionarPlayListPage } from './../adicionar-play-list/adicionar-play-list.page';
import { AdicionarCanalPage } from './../adicionar-canal/adicionar-canal.page';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilService } from 'src/providers/util.service';
import { VideoService } from 'src/providers/video.service';
import { CanalService } from 'src/providers/canal.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Content } from '@angular/compiler/src/render3/r3_ast';

@Component({
  selector: 'app-video',
  templateUrl: './video.page.html',
  styleUrls: ['./video.page.scss'],
})
export class VideoPage implements OnInit {

  form: FormGroup;
  canais : any[] = [];
  playlists: any[] = [];
  confirm:string;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private fb: FormBuilder,
    private utilService: UtilService,
    private modalCtrl: ModalController,
    private canalService: CanalService,
    private videoService : VideoService,
    private router : Router,
    private route : ActivatedRoute,
    private playListService : PlayListService)
 {
  this.confirm = this.route.snapshot.paramMap.get("video");
  console.log(this.confirm);
    this.form = this.fb.group({
      titulo: ['', Validators.compose([
        Validators.minLength(1),
        Validators.maxLength(100),
        Validators.required
      ])],
      descricao: ['', Validators.compose([
        Validators.minLength(1),
        Validators.maxLength(255),
        Validators.required
      ])],
      idVideoYoutube: ['', Validators.compose([
        Validators.minLength(1),
        Validators.maxLength(30),
        Validators.required
      ])],
      tags: ['', Validators.compose([
        Validators.minLength(1),
        Validators.maxLength(150),
        Validators.required
      ])],

      idCanal: ['', Validators.compose([
        Validators.required
      ])],

      idPlaylist: ['', Validators.compose([

      ])],

      ordemNaPlayList: ['', Validators.compose([


      ])],
    });
  }
  ngOnInit(){
    this.loadCanal();
    this.loadPlayList();
  }
  
  async loadCanal() {

    let loading = await this.utilService.showLoading();
    loading.present();

    this.canalService.listar().then((response) => {
      this.canais = response;
      loading.dismiss();

    }).catch((response) => {

      loading.dismiss();

      this.utilService.showMessageError(response);

    });
  }

  async loadPlayList() {

    let loading = await this.utilService.showLoading();
    loading.present();

    this.playListService.listar().then((response) => {
    this.playlists = response;
    loading.dismiss();

  }).catch((response) => {

    loading.dismiss();

    this.utilService.showMessageError(response);

  });
  }
  cancelar(){
    this.router.navigate([("/")]);
  }
  async showAddCanal(){
    let modal = await this.modalCtrl.create({
      component: AdicionarCanalPage
    });
    modal.present();
  }
  async showAddPlayList(){
    let modal = await this.modalCtrl.create({
      component: AdicionarPlayListPage
    });
    modal.present();
  }
  async salvar(){
    let loading = await this.utilService.showLoading();
    loading.present();
    
    this.videoService.adicionar(this.form.value).then((response)=>{
      loading.dismiss();

      this.utilService.showAlert("Operação realizada com sucesso!");
      this.router.navigate([("/")]);
    })
    .catch((response)=>{
      loading.dismiss();
      this.utilService.showMessageError(response);

    });
  }
  refresh() {
    console.log("ativado")
    this.ngOnInit();
  }
}
