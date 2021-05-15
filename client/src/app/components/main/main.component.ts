import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../server.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  private id: number;
  public answer: any;
  public cotization: number;
  public addForm: FormGroup;
  public rows: FormArray;
  public itemForm: FormGroup;
  public afuConfig = {
    multiple: true,
    uploadAPI: {
      url: 'http://127.0.0.1:8000/files',
    },
    fileNameIndex: false,
    replaceTexts: {
      selectFileBtn: 'Seleccionar Archivos',
      resetBtn: 'Reiniciar',
      uploadBtn: 'Enviar',
      afterUploadMsg_success: 'Enviado con exito!',
      afterUploadMsg_error: 'Error al enviar!',
      sizeLimit: 'Tamaño limite',
    },
  };

  constructor(
    private server: ServerService,
    private actRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.addForm = this.fb.group({
      items: [null, Validators.required],
      items_value: ['no', Validators.required],
    });
    this.rows = this.fb.array([]);
    this.cotization = 0;
  }

  ngOnInit(): void {
    this.actRoute.paramMap.subscribe(async (param) => {
      if (param.has('id')) {
        this.id = +param.get('id');
        this.answer = await this.server.getAnswer(this.id);
      }
    });
    this.addForm.get('items_value').setValue('yes');
    this.addForm.addControl('rows', this.rows);
  }

  public onAddRow() {
    this.rows.push(this.createItemFormGroup());
  }

  public onRemoveRow(rowIndex: number) {
    this.rows.removeAt(rowIndex);
  }

  public createItemFormGroup(): FormGroup {
    return this.fb.group({
      description: null,
      value: null,
    });
  }

  public async saveCotization() {
    var n = 0;
    var resume: object;
    for (var v of this.rows.value) {
      n += v['value'];
      resume = {
        description: v['description'],
        value: v['value'],
      };
      this.server.regCotization(resume);
    }
    this.cotization = n;
  }

  public DocUpload(e) {
    console.log(e);
  }

  public async saveEvaluation(des: any): Promise<void> {
    var res: object;
    let eva: object = {
      request: this.answer['request']['__data__']['_id'],
      answer: this.id,
      investment_return: this.cotization + this.cotization * 0.1,
      description: des,
    };
    console.log(eva);
    res = await this.server.saveEvaluation(eva);
    console.log(res);
    alert(res['msg']);
    //var evaRes = await this.server.getEva(res['arg']['id']);
    //console.log(evaRes['arg']);
  }

  public cancelEvaluation(): void {
    var option = confirm('¿Desea cancelar esta Evaluacion?');
    if (option) {
      alert('Evaluacion Cancelada...');
      this.answer = {};
    }
  }
}
