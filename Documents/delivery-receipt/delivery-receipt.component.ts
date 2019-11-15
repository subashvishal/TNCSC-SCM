import { Component, OnInit, ViewChild } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { SelectItem, MessageService } from 'primeng/api';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { DatePipe } from '@angular/common';
import { GolbalVariable } from 'src/app/common/globalvariable';
import { Dropdown } from 'primeng/primeng';
import { StatusMessage } from 'src/app/constants/Messages';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-delivery-receipt',
  templateUrl: './delivery-receipt.component.html',
  styleUrls: ['./delivery-receipt.component.css']
})
export class DeliveryReceiptComponent implements OnInit {
  data: any;
  isSaveSucceed: boolean = false;
  username: any;
  viewDate: Date = new Date();
  viewPane: boolean = false;
  deliveryCols: any;
  deliveryData: any = [];
  deliveryViewCols: any;
  deliveryViewData: any = [];
  index: number = 0;
  scheme_data: any[];
  itemCols: any;
  itemData: any = [];
  paymentCols: any;
  paymentData: any = [];
  paymentBalCols: any;
  paymentBalData: any = [];
  itemSchemeCols: any;
  itemSchemeData: any = [];
  maxDate: Date = new Date();
  transactionOptions: SelectItem[];
  yearOptions: SelectItem[];
  receivorTypeOptions: SelectItem[];
  partyNameOptions: SelectItem[];
  monthOptions: SelectItem[];
  itemDescOptions: SelectItem[];
  schemeOptions: SelectItem[];
  rateInTermsOptions: SelectItem[];
  marginSchemeOptions: SelectItem[];
  marginRateInTermsOptions: SelectItem[];
  paymentOptions: SelectItem[];
  selectedItem: boolean;
  RegionName: any;
  GodownName: any;
  marginItemDescOptions: SelectItem[];
  marginTotal: any = 0;
  totalAmount: any = 0;
  canShowMenu: boolean;
  rowId: any;
  UnLoadingSlip: any;
  DeliveryDate: Date = new Date();
  DeliveryOrderNo: any;
  Trcode: any;
  trCode: any;
  TransType: string = 'I';
  IndentNo: any = '-';
  OrderPeriod: any;
  PermitDate: Date = new Date();
  PMonth: any;
  PYear: any;
  RCode: string;
  GCode: string;
  PName: any;
  pCode: any;
  RTCode: any;
  rtCode: any;
  Remarks: string;
  Scheme: any;
  schemeCode: any;
  MarginScheme: any;
  marginSchemeCode: any;
  ICode: any;
  iCode: any;
  MICode: any;
  miCode: any;
  NKgs: any;
  Rate: any;
  RateTerm: any;
  TotalAmount: any = 0;
  MarginNKgs: any;
  MarginRate: any;
  MarginAmount: any = 0;
  MarginRateInTerms: any;
  GrandTotal: any = 0;
  Payment: string;
  ChequeNo: any;
  ChequeDate: any = new Date();
  PAmount: any;
  PayableAt: any;
  OnBank: any;
  PrevOrderNo: any;
  PrevOrderDate: any = new  Date();
  AdjusmentAmount: any;
  AdjustmentType: string;
  OtherAmount: any;
  Balance: any;
  DueAmount: any = 0;
  PaidAmount: any = 0;
  BalanceAmount: any = 0;
  curMonth: any;
  checkTransactionType: boolean = true;
  isViewed: boolean = false;
  blockScreen: boolean;
  ChDate: any;
  AdjustDate: any;
  submitted: boolean;
  missingFields: any;
  field: any;
  selected: any;
  // isSaved: boolean = false;
  @ViewChild('tr') transactionPanel: Dropdown;
  @ViewChild('m') monthPanel: Dropdown;
  @ViewChild('y') yearPanel: Dropdown;
  @ViewChild('rt') receivorTypePanel: Dropdown;
  @ViewChild('pn') partyNamePanel: Dropdown;
  @ViewChild('sc') schemePanel: Dropdown;
  @ViewChild('i_desc') commodityPanel: Dropdown;
  @ViewChild('rate') weighmentPanel: Dropdown;
  @ViewChild('ms') marginSchemePanel: Dropdown;
  @ViewChild('margin_id') marginCommodityPanel: Dropdown;
  @ViewChild('margin_rate') marginWeighmentPanel: Dropdown;
  @ViewChild('pay') paymentPanel: Dropdown;
 


  constructor(private tableConstants: TableConstants, private roleBasedService: RoleBasedService,
    private restAPIService: RestAPIService, private authService: AuthService,
    private messageService: MessageService, private datepipe: DatePipe) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.scheme_data = this.roleBasedService.getSchemeData();
    this.username = JSON.parse(this.authService.getCredentials());
    this.deliveryCols = this.tableConstants.DeliveryDocumentcolumns;
    this.deliveryViewCols = this.tableConstants.DeliveryDocumentViewCols;
    this.itemCols = this.tableConstants.DeliveryItemColumns;
    this.paymentCols = this.tableConstants.DeliveryPaymentcolumns;
    this.paymentBalCols = this.tableConstants.DeliveryPaymentBalanceCols;
    this.itemSchemeCols = this.tableConstants.DeliveryItemSchemeColumns;
    this.curMonth = "0" + (new Date().getMonth() + 1);
    this.PMonth = this.datepipe.transform(new Date(), 'MMM');
    this.monthOptions = [{ label: this.PMonth, value: this.curMonth }];
    this.PYear = new Date().getFullYear();
    this.yearOptions = [{ label: this.PYear, value: this.PYear }];
    this.AdjusmentAmount = 0; this.OtherAmount = 0; this.Balance = 0; this.PAmount = 0;
    this.RegionName = this.authService.getUserAccessible().rName;
    this.GodownName = this.authService.getUserAccessible().gName;
    this.GCode = this.authService.getUserAccessible().gCode;
    this.RCode = this.authService.getUserAccessible().rCode;
  }

  onSelect(selectedItem, type) {
    let transactoinSelection = [];
    let schemeSelection = [];
    let marginSchemeSelection = [];
    let commoditySelection = [];
    let marginCommoditySelection = [];
    let receivorTypeList = [];
    let weighment = [];
    let marginWeighment = [];
    let partyNameList = [];
    let yearArr = [];
    const range = 3;
    switch (selectedItem) {
      case 'y':
        if (type === 'enter') {
          this.yearPanel.overlayVisible = true;
        }
        const year = new Date().getFullYear();
        for (let i = 0; i < range; i++) {
          if (i === 0) {
            yearArr.push({ 'label': (year - 1).toString(), 'value': year - 1 });
          } else if (i === 1) {
            yearArr.push({ 'label': (year).toString(), 'value': year });
          } else {
            yearArr.push({ 'label': (year + 1).toString(), 'value': year + 1 });
          }
        }
        this.yearOptions = yearArr;
        this.yearOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        break;
      case 'm':
        if (type === 'enter') {
          this.monthPanel.overlayVisible = true;
        }
        this.monthOptions = [{ 'label': 'Jan', 'value': 1 },
        { 'label': 'Feb', 'value': 2 }, { 'label': 'Mar', 'value': 3 }, { 'label': 'Apr', 'value': 4 },
        { 'label': 'May', 'value': 5 }, { 'label': 'Jun', 'value': 6 }, { 'label': 'Jul', 'value': 7 },
        { 'label': 'Aug', 'value': 8 }, { 'label': 'Sep', 'value': 9 }, { 'label': 'Oct', 'value': 10 },
        { 'label': 'Nov', 'value': 11 }, { 'label': 'Dec', 'value': 12 }];
        this.monthOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        break;
      case 'tr':
        if (type === 'enter') {
          this.transactionPanel.overlayVisible = true;
        }
        transactoinSelection.push({ label: 'SALES', value: 'TR014' },
          { label: 'CREDIT SALES', value: 'TR019' }, { label: 'FREE SCHEME', value: 'TR022' });
        this.transactionOptions = transactoinSelection;
        this.transactionOptions.unshift({ 'label': '-select', 'value': null });
        this.checkTransactionType = ((this.Trcode !== undefined && this.Trcode !== null) ?
          ((this.Trcode.value !== undefined) ? (this.Trcode.value === 'TR019') : this.trCode) : false) ? true : false;
        break;
      case 'scheme':
        if (type === 'enter') {
          this.schemePanel.overlayVisible = true;
        }
        if (this.scheme_data !== undefined && this.scheme_data !== null) {
          this.scheme_data.forEach(y => {
            schemeSelection.push({ 'label': y.SName, 'value': y.SCode });
            this.schemeOptions = schemeSelection;
          });
          this.schemeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        } else {
          this.schemeOptions = schemeSelection;
        }
        break;
      case 'margin_scheme':
        if (type === 'enter') {
          this.marginSchemePanel.overlayVisible = true;
        }
        if (this.scheme_data !== undefined && this.scheme_data !== null) {
          this.scheme_data.forEach(y => {
            marginSchemeSelection.push({ 'label': y.SName, 'value': y.SCode });
            this.marginSchemeOptions = marginSchemeSelection;
          });
          this.marginSchemeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        } else {
          this.marginSchemeOptions = marginSchemeSelection;
        }
        break;
      case 'rt':
        if (type === 'enter') {
          this.receivorTypePanel.overlayVisible = true;
        }
        if (this.Trcode !== null && this.Trcode !== undefined) {
          if ((this.Trcode.value !== undefined && this.Trcode.value !== null) ||
            (this.trCode !== null && this.trCode !== undefined)) {
            const params = new HttpParams().set('TRCode', (this.Trcode.value !== undefined) ? this.Trcode.value : this.trCode).append('GCode', this.GCode);
            this.restAPIService.getByParameters(PathConstants.DEPOSITOR_TYPE_MASTER, params).subscribe((res: any) => {
              if (res !== null && res !== undefined && res.length !== 0) {
                res.forEach(dt => {
                  receivorTypeList.push({ 'label': dt.Tyname, 'value': dt.Tycode });
                });
                this.receivorTypeOptions = receivorTypeList;
              }
              // this.isReceivorNameDisabled = false;
              this.receivorTypeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
            });
          }
        } else {
          this.receivorTypeOptions = receivorTypeList;
        }
        break;
      case 'pn':
        if (type === 'enter') {
          this.partyNamePanel.overlayVisible = true;
        }
        if (this.RTCode !== undefined && this.Trcode !== null && this.RTCode !== null && this.Trcode !== undefined) {
          if ((this.Trcode.value !== undefined && this.RTCode.value !== undefined) || (this.rtCode !== undefined && this.trCode !== null)) {
            const params = new HttpParams().set('TyCode', (this.RTCode.value !== undefined) ? this.RTCode.value : this.rtCode)
              .append('TRType', this.TransType).append('TRCode', (this.Trcode.value !== undefined) ? this.Trcode.value : this.trCode).append('GCode', this.GCode);
            this.restAPIService.getByParameters(PathConstants.DEPOSITOR_NAME_MASTER, params).subscribe((res: any) => {
              if (res !== null && res !== undefined && res.length !== 0) {
                res.forEach(dn => {
                  partyNameList.push({ 'label': dn.DepositorName, 'value': dn.DepositorCode });
                })
                this.partyNameOptions = partyNameList;
              }
              this.partyNameOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
            });
          }
        } else {
          this.partyNameOptions = partyNameList;
        }
        break;
      case 'commodity':
        if (type === 'enter') {
          this.commodityPanel.overlayVisible = true;
        }
        if (this.Scheme !== null && this.Scheme !== undefined) {
          if ((this.Scheme.value !== undefined && this.Scheme.value !== null)
          || (this.schemeCode !== undefined && this.schemeCode !== null)) {
            const params = new HttpParams().set('SCode', (this.Scheme.value !== undefined) ? this.Scheme.value : this.schemeCode);
            this.restAPIService.getByParameters(PathConstants.COMMODITY_FOR_SCHEME, params).subscribe((res: any) => {
              if (res !== null && res !== undefined && res.length !== 0) {
                if (!this.selectedItem) {
                  res.forEach(i => {
                    commoditySelection.push({ 'label': i.ITDescription, 'value': i.ITCode });
                  });
                } else {
                  let filteredArr = res.filter(x => {
                    return x.Allotmentgroup === 'RICE';
                  })
                  filteredArr.forEach(i => {
                    commoditySelection.push({ 'label': i.ITDescription, 'value': i.ITCode });
                  })
                }
                this.itemDescOptions = commoditySelection;
              }
              this.itemDescOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
            });
          }
        } else {
          this.itemDescOptions = commoditySelection;
        }
        break;
      case 'margin_commodity':
        if (type === 'enter') {
          this.marginCommodityPanel.overlayVisible = true;
        }
        if (this.MarginScheme !== null && this.MarginScheme !== undefined) {
          if ((this.MarginScheme.value !== undefined && this.MarginScheme.value !== null)
          || (this.marginSchemeCode !== undefined && this.marginSchemeCode !== null)) {
            const params = new HttpParams().set('SCode', (this.MarginScheme.value !== undefined) ? this.MarginScheme.value : this.schemeCode);
            this.restAPIService.getByParameters(PathConstants.COMMODITY_FOR_SCHEME, params).subscribe((res: any) => {
              if (res !== null && res !== undefined && res.length !== 0) {
                if (!this.selectedItem) {
                  res.forEach(i => {
                    marginCommoditySelection.push({ 'label': i.ITDescription, 'value': i.ITCode });
                  });
                } else {
                  let filteredArr = res.filter(x => {
                    return x.Allotmentgroup === 'RICE';
                  })
                  filteredArr.forEach(i => {
                    marginCommoditySelection.push({ 'label': i.ITDescription, 'value': i.ITCode });
                  })
                }
                this.marginItemDescOptions = marginCommoditySelection;
              }
              this.marginItemDescOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
            });
          }
        } else {
          this.marginItemDescOptions = marginCommoditySelection;
        }
        break;
      case 'wmt':
        if (type === 'enter') {
          this.weighmentPanel.overlayVisible = true;
        }
        // if(this.rateInTermsOptions === undefined) {
        this.restAPIService.get(PathConstants.BASIC_WEIGHT_MASTER).subscribe((res: any) => {
          if (res !== null && res !== undefined && res.length !== 0) {
            res.forEach(w => {
              if (w.Basicweight !== 'GRAMS') {
                weighment.push({ 'label': w.Basicweight, 'value': w.Basicweight });
              }
            })
            this.rateInTermsOptions = weighment;
          }
          this.rateInTermsOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        });
      // }
        break;
      case 'margin_wmt':
        if (type === 'enter') {
          this.marginWeighmentPanel.overlayVisible = true;
        }
        // if(this.marginRateInTermsOptions === undefined) {
          this.restAPIService.get(PathConstants.BASIC_WEIGHT_MASTER).subscribe((res: any) => {
          if (res !== null && res !== undefined && res.length !== 0) {
            res.forEach(w => {
              if (w.Basicweight !== 'GRAMS') {
                marginWeighment.push({ 'label': w.Basicweight, 'value': w.Basicweight });
              }
            })
            this.marginRateInTermsOptions = marginWeighment;
          }
          this.marginRateInTermsOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        });
      // }
        break;
      case 'pay':
        if (type === 'enter') {
          this.paymentPanel.overlayVisible = true;
        }
        this.paymentOptions = [
          { label: 'Adjustment', value: 'Adjustment' }, { label: 'Cash', value: 'Cash' },
          { label: 'Cheque', value: 'Cheque' }, { label: 'Draft', value: 'Draft' }, { label: 'Ocr', value: 'Ocr' },
          { label: 'PayOrder', value: 'PayOrder' }];
        this.paymentOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        break;
    }
  }

  refreshSelect(id) {
    switch (id) {
      case 'tr':
        this.receivorTypeOptions = []; this.partyNameOptions = [];
        this.RTCode = null; this.rtCode = null; this.PName = null; this.pCode = null;
        break;
      case 'rt':
        this.partyNameOptions = [];
        this.pCode = null; this.PName = null;
        break;
      case 'sc':
        this.itemDescOptions = [];
        this.iCode = null; this.ICode = null;
        break;
      case 'msc':
        this.marginItemDescOptions = [];
        this.miCode = null; this.MICode = null;
        break;
    }
  }

  onRowSelect(event) {
    this.selected = event;
    this.DeliveryOrderNo = event.data.Dono;
  }

  openNext() {
    this.index = (this.index === 2) ? 0 : this.index + 1;
  }

  openPrev() {
    this.index = (this.index === 0) ? 2 : this.index - 1;
  }

  checkPayment() {
    this.messageService.clear();
    this.deliveryData = [];
    const params = {
      Type: 1,
      DoDate: this.datepipe.transform(this.DeliveryDate, 'MM/dd/yyyy'),
      GCode: this.GCode,
      DoNo: (this.DeliveryOrderNo !== undefined) ? this.DeliveryOrderNo : 0,
      ReceivorCode: (this.PName !== undefined && this.PName !== null) ?
        ((this.PName.value !== undefined && this.PName.value !== null) ? this.PName.value : this.pCode) : 0
    }
    this.restAPIService.post(PathConstants.STOCK_PAYMENT_DETAILS_DOCUMENT, params).subscribe(res => {
      if (res !== null && res !== undefined && res.length !== 0) {
        this.deliveryData = res;
        this.deliveryData.forEach(x => {
          x.DoDate = this.datepipe.transform(x.DoDate, 'dd/MM/yyyy');
          x.PaymentAmount = (x.PaymentAmount !== null) ? x.PaymentAmount : '-';
          let paidAmount = (x.PaymentAmount !== '-') ? x.PaymentAmount : 0;
          x.AdvCollection = ((x.GrandTotal * 1) - (paidAmount * 1)).toFixed(2);
        })
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination })
      }
    });
  }

  deleteRow(id, data, index) {
    switch (id) {
      case 'item':
        this.Scheme = data.SchemeName;
        this.schemeCode = data.Scheme;
        this.schemeOptions = [{ label: data.SchemeName, value: data.Scheme }];
        this.iCode = data.Itemcode;
        this.ICode = data.ITDescription;
        this.itemDescOptions = [{ label: data.ITDescription, value: data.ItemCode }];
        this.NKgs = (data.NetWeight * 1).toFixed(3);
        this.Rate = (data.Rate * 1).toFixed(3);
        this.RateTerm = data.Wtype;
        this.rateInTermsOptions = [{ label: data.Wtype, value: data.Wtype }];
        this.TotalAmount = (data.Total * 1);
        if(this.itemData.length !== 0) {
        this.GrandTotal = ((this.GrandTotal * 1) - (this.TotalAmount * 1)).toFixed(2);
        this.GrandTotal = ((this.GrandTotal * 1) < 0) ? 0 : (this.GrandTotal * 1);
        } else {
          this.GrandTotal = (this.GrandTotal * 1).toFixed(2);
          this.GrandTotal = ((this.GrandTotal * 1) < 0) ? 0 : (this.GrandTotal * 1);
        }
        this.DueAmount = (this.GrandTotal * 1);
        this.itemData.splice(index, 1);
        let sno = 1;
        this.itemData.forEach(x => { x.sno = sno; sno += 1; });
        break;
      case 'scheme':
        this.marginSchemeCode = data.SchemeCode;
        this.MarginScheme = data.SchemeName;
        this.marginSchemeOptions = [{ label: data.SchemeName, value: data.SchemeCode }];
        this.MICode = data.ITDescription;
        this.miCode = data.ItemCode;
        this.marginItemDescOptions = [{ label: data.ITDescription, value: data.ItemCode }];
        this.MarginRateInTerms = data.MarginWtype;
        this.marginRateInTermsOptions = [{ label: data.MarginWtype, value: data.MarginWtype }];
        this.MarginNKgs = (data.MarginNkgs * 1).toFixed(3);
        this.MarginRate = (data.MarginRate * 1).toFixed(3);
        this.MarginAmount = (data.MarginAmount * 1).toFixed(3);
        if(this.itemSchemeData.length !== 0) {
        this.GrandTotal = ((this.GrandTotal * 1) + (this.MarginAmount * 1)).toFixed(2);
        this.GrandTotal = ((this.GrandTotal * 1) < 0) ? 0 : (this.GrandTotal * 1);
        } else {
          this.GrandTotal = (this.GrandTotal * 1).toFixed(2);
          this.GrandTotal = ((this.GrandTotal * 1) < 0) ? 0 : (this.GrandTotal * 1);
        }
        this.DueAmount = (this.GrandTotal * 1);
        this.itemSchemeData.splice(index, 1);
        let slno = 1;
        this.itemSchemeData.forEach(x => { x.sno = slno; slno += 1; });
        break;
      case 'payment':
        this.Payment = data.PaymentMode;
        this.paymentOptions = [{ label: data.PaymentMode, value: data.PaymentMode }];
        this.ChequeNo = data.ChequeNo;
        this.ChequeDate = data.ChequeDate; //String Format
        this.ChDate = data.ChDate; //Date Format
        this.PAmount = (data.PaymentAmount * 1)
        this.PayableAt = data.payableat;
        this.OnBank = data.bank;
        this.PaidAmount = this.PaidAmount - (this.paymentData[index].PaymentAmount * 1);
        this.BalanceAmount = (this.DueAmount * 1) - (this.PaidAmount * 1);
        this.paymentData.splice(index, 1);
        let psno = 1;
        this.paymentData.forEach(x => { x.sno = psno; psno += 1; });
        break;
      case 'prevBal':
        this.PrevOrderNo = data.AdjustedDoNo;
        this.PrevOrderDate = data.AdjustedDate; //String Format
        this.AdjustDate = data.AdjustDate; //Date Format
        this.AdjusmentAmount = (data.Amount * 1);
        this.OtherAmount = (data.AmountNowAdjusted * 1);
        this.Balance = (data.Balance * 1);
        this.AdjustmentType = data.AdjustmentType;
        this.paymentBalData.splice(index, 1);
        let sNo = 1;
        this.paymentBalData.forEach(x => { x.sno = sNo; sNo += 1; });
        break;
    }
  }

  onEnter(id) {
    switch (id) {
      case 'Item':
        this.itemData.push({
          ITDescription: (this.ICode.label !== undefined && this.ICode.label !== null) ? this.ICode.label : this.ICode,
          SchemeName: (this.Scheme.label !== undefined && this.Scheme.label !== null) ? this.Scheme.label : this.Scheme,
          Itemcode: (this.ICode.value !== undefined && this.ICode.value !== null) ? this.ICode.value : this.iCode,
          NetWeight: this.NKgs, Rate: this.Rate, Total: this.TotalAmount, Rcode: this.RCode,
          Wtype: (this.RateTerm.value !== undefined && this.RateTerm.value !== null) ? this.RateTerm.value : this.RateTerm,
          Scheme: (this.Scheme.value !== undefined && this.Scheme.value !== null) ? this.Scheme.value : this.schemeCode,
        });
        if (this.itemData.length !== 0) {
          this.totalAmount = 0;
          let sno = 1;
          this.itemData.forEach(x => {
            x.sno = sno;
            this.totalAmount += (x.Total * 1);
            sno += 1;
          });
          this.GrandTotal = ((this.totalAmount * 1) - (this.marginTotal * 1)).toFixed(2);
          this.GrandTotal = ((this.GrandTotal * 1) < 0) ? 0 : (this.GrandTotal * 1);
          this.DueAmount = this.GrandTotal;
          this.BalanceAmount = (this.DueAmount !== undefined && this.PaidAmount !== undefined) ?
          ((this.DueAmount * 1) - (this.PaidAmount * 1)).toFixed(2) : 0; 
          this.Scheme = null; this.ICode = null; this.NKgs = null;
          this.RateTerm = null; this.Rate = null; this.TotalAmount = null;
          this.schemeOptions = this.rateInTermsOptions = this.itemDescOptions = [];
        }
        break;
      case 'MarginItem':
        this.itemSchemeData.push({
          ITDescription: (this.MICode.label !== undefined && this.MICode.label !== null) ? this.MICode.label : this.MICode,
          SchemeName: (this.MarginScheme.label !== undefined && this.MarginScheme.label !== null)
            ? this.MarginScheme.label : this.MarginScheme,
          ItemCode: (this.MICode.value !== undefined && this.MICode.value !== null)
            ? this.MICode.value : this.miCode,
          MarginRate: this.MarginRate, MarginAmount: this.MarginAmount,
          Rcode: this.RCode, MarginNkgs: this.MarginNKgs,
          MarginWtype: (this.MarginRateInTerms.value !== undefined && this.MarginRateInTerms.value !== null)
            ? this.MarginRateInTerms.value : this.MarginRateInTerms,
          SchemeCode: (this.MarginScheme.value !== undefined && this.MarginScheme.value !== null)
            ? this.MarginScheme.value : this.marginSchemeCode
        });
        if (this.itemSchemeData.length !== 0) {
          this.marginTotal = 0;
          let sno = 1;
          this.itemSchemeData.forEach(y => {
            y.sno = sno;
            this.marginTotal += (y.MarginAmount * 1);
            sno += 1;
          });
          this.GrandTotal = ((this.totalAmount * 1) - (this.marginTotal * 1)).toFixed(2);
          this.GrandTotal = ((this.GrandTotal * 1) < 0) ? 0 : (this.GrandTotal * 1);
          this.DueAmount = this.GrandTotal;
          this.BalanceAmount = (this.DueAmount !== undefined && this.PaidAmount !== undefined) ?
          ((this.DueAmount * 1) - (this.PaidAmount * 1)).toFixed(2) : 0; 
          this.MarginScheme = null;
          this.MICode = null; this.MarginNKgs = null;
          this.MarginRateInTerms = null; this.MarginRate = null; this.MarginAmount = null;
          this.marginSchemeOptions = this.marginRateInTermsOptions = this.marginItemDescOptions = [];
        }
        break;
      case 'Payment':
        const bankname = this.OnBank.toString().toUpperCase();
        let validateBank = (bankname.startsWith('C-', 0) || bankname.startsWith('N-', 0)) ? true : false;
        if (!validateBank) {
          this.OnBank = null;
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_REQUIRED, detail: StatusMessage.BankNameInDO })
        }
        else if ((this.Payment === 'Cheque' || this.Payment === 'Draft' || this.Payment === 'PayOrder') && (this.ChequeNo === '-' || this.PayableAt === '-')) {
          this.ChequeNo = (this.ChequeNo !== '-') ? this.ChequeNo : null;
          this.PayableAt = (this.PayableAt !== '-') ? this.PayableAt : null;
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_REQUIRED, detail: StatusMessage.CHAndPayableAtInDO })
        } else {
          this.paymentData.push({
            PaymentMode: this.Payment, ChequeNo: this.ChequeNo,
            ChDate: (typeof this.ChequeDate === 'string') ? this.datepipe.transform(this.ChDate, 'MM/dd/yyyy') : this.datepipe.transform(this.ChequeDate, 'MM/dd/yyyy'),
            ChequeDate: (typeof this.ChequeDate === 'string') ? this.datepipe.transform(this.ChDate, 'dd/MM/yyyy') : this.datepipe.transform(this.ChequeDate, 'dd/MM/yyyy'),
            Rcode: this.RCode,
            PaymentAmount: (this.PAmount * 1).toFixed(2),
            payableat: this.PayableAt,
            bank: this.OnBank.toString().toUpperCase()
          })
          let lastIndex = this.paymentData.length;
          if (this.paymentData.length !== 0) {
            let sno = 1;
            this.paymentData.forEach(x => { x.sno = sno; sno += 1; }); this.PaidAmount += (this.PAmount * 1);
            this.DueAmount = (this.DueAmount !== undefined) ? this.DueAmount : this.GrandTotal;
            this.BalanceAmount = (this.DueAmount !== undefined && this.PaidAmount !== undefined) ?
              ((this.DueAmount * 1) - (this.PaidAmount * 1)).toFixed(2) : 0;
            this.ChequeDate = new Date();
            this.Payment = null; this.PayableAt = null; this.ChequeNo = null;
            this.OnBank = null; this.PAmount = 0;
            this.paymentOptions = [];
          }
        }
        break;
      case 'Adjustment':
        this.paymentBalData.push({
          AdjustedDoNo: this.PrevOrderNo,
          AdjustDate: (typeof this.PrevOrderDate === 'string') ? this.datepipe.transform(this.AdjustDate, 'MM/dd/yyyy') : this.datepipe.transform(this.PrevOrderDate, 'MM/dd/yyyy'),
          AdjustedDate: (typeof this.PrevOrderDate === 'string') ? this.datepipe.transform(this.AdjustDate, 'dd/MM/yyyy') : this.datepipe.transform(this.PrevOrderDate, 'dd/MM/yyyy'),
          convertedDate: new Date(this.PrevOrderDate),
          Amount: (this.AdjusmentAmount * 1).toFixed(2),
          AdjustmentType: this.AdjustmentType,
          Rcode: this.RCode,
          AmountNowAdjusted: (this.OtherAmount * 1).toFixed(2),
          Balance: (this.Balance * 1).toFixed(2)
        });
        if (this.paymentBalData.length !== 0) {
          let sno = 1;
          this.paymentBalData.forEach(x => { x.sno = sno; sno += 1; });
          this.PrevOrderDate = new Date();
          this.PrevOrderNo = null;
          this.AdjusmentAmount = 0; this.AdjustmentType = null;
          this.Balance = 0; this.OtherAmount = 0;
        }
        break;
    }
  }

  rateWithQtyCalculation(selectedWt, amnt, qty) {
    let total: any = 0;
    switch (selectedWt) {
      case 'KGS':
        total = (qty * amnt).toFixed(2);
        break;
      case 'QUINTALL':
        total = ((qty / 100) * amnt).toFixed(2);
        break;
      case 'TONS':
        total = ((qty / 1000) * amnt).toFixed(2);
        break;
      case 'LTRS':
        total = (qty * amnt).toFixed(2);
        break;
      case 'NOS':
        total = (qty * amnt).toFixed(2);
        break;
      case 'KILOLTRS':
        total = ((qty / 1000) * amnt).toFixed(2);
        break;
    }
    return total;
  }

  calculateTotal() {
    if (this.NKgs !== undefined && this.Rate !== undefined && this.NKgs !== null && this.Rate !== null && this.RateTerm !== undefined && this.RateTerm !== null) {
      let unit = (this.RateTerm.value !== undefined && this.RateTerm.value !== null) ? this.RateTerm.value : this.RateTerm;
      this.TotalAmount = this.rateWithQtyCalculation(unit, this.Rate, this.NKgs);
    }
    if (this.MarginNKgs !== undefined && this.MarginRate !== undefined && this.MarginNKgs !== null && this.MarginRate !== null && this.MarginRateInTerms !== undefined && this.MarginRateInTerms !== null) {
      let marginUnit = (this.MarginRateInTerms.value !== undefined && this.MarginRateInTerms.value !== null) ? this.MarginRateInTerms.value : this.MarginRateInTerms;
      this.MarginAmount = this.rateWithQtyCalculation(marginUnit, this.MarginRate, this.MarginNKgs);
    }
  }

  onCalculateBalance() {
    if (this.DueAmount !== undefined && this.PaidAmount !== undefined &&
      this.OtherAmount !== undefined && this.AdjusmentAmount !== undefined &&
      this.DueAmount !== null && this.PaidAmount !== null &&
      this.OtherAmount !== null && this.AdjusmentAmount !== null) {
      if (this.AdjustmentType === 'Credit') {
        this.Balance = (((this.AdjusmentAmount * 1) + (this.PaidAmount * 1)) -
          ((this.DueAmount * 1) + (this.OtherAmount * 1)));
      } else {
        this.Balance = (((this.AdjusmentAmount * 1) + (this.DueAmount * 1) + (this.OtherAmount * 1)) -
          ((this.PaidAmount * 1)));
      }
    }
  }

  getPreviousBalance() {
    this.messageService.clear();
    const params = {
      Type: 2,
      DoDate: this.datepipe.transform(this.DeliveryDate, 'MM/dd/yyyy'),
      GCode: this.GCode,
      DoNo: (this.PrevOrderNo !== undefined && this.PrevOrderNo !== null) ? this.PrevOrderNo : 0,
      ReceivorCode: (this.PName !== undefined && this.PName !== null) ?
        ((this.PName.value !== undefined && this.PName.value !== null) ? this.PName.value : this.pCode) : 0
    }
    this.restAPIService.post(PathConstants.STOCK_PAYMENT_DETAILS_DOCUMENT, params).subscribe(res => {
      if (res !== null && res !== undefined && res.length !== 0) {
        this.PrevOrderNo = res[0].Dono;
        this.PrevOrderDate = new Date(res[0].DoDate);
        this.AdjusmentAmount = (res[0].Balance * 1);
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination })
      }
    })
  }

  onView() {
    this.viewPane = true;
    this.selected = null;
    this.messageService.clear();
    const params = new HttpParams().set('sValue', this.datepipe.transform(this.viewDate, 'MM/dd/yyyy')).append('Type', '1').append('GCode', this.GCode);
    this.restAPIService.getByParameters(PathConstants.STOCK_DELIVERY_ORDER_VIEW_DOCUMENT, params).subscribe((res: any) => {
      if (res.Table !== null && res.Table !== undefined && res.Table.length !== 0) {
        let sno = 1;
        res.Table.forEach(data => {
          data.sno = sno;
          data.DoDate = this.datepipe.transform(data.DoDate, 'dd/MM/yyyy');
          sno += 1;
        })
        this.deliveryViewData = res.Table;
      } else {
        this.deliveryViewData = [];
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination })
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.deliveryData = [];
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
  }

  onClear() {
    this.itemData = []; this.deliveryData = []; this.itemSchemeData = [];
    this.paymentBalData = []; this.paymentData = [];
    this.BalanceAmount = 0; this.DueAmount = 0; this.PaidAmount = 0; this.GrandTotal = 0;
    this.Balance = 0; this.AdjusmentAmount = 0; this.OtherAmount = 0;
    this.PayableAt = null; this.Payment = null; this.ChequeNo = null;
    this.PAmount = null; this.PrevOrderNo = null;
    this.Trcode = null; this.trCode = null; this.IndentNo = '-'; this.RTCode = null;
    this.PName = null; this.Remarks = null; this.DeliveryOrderNo = null; this.OnBank = null;
    this.transactionOptions = []; this.partyNameOptions = []; this.receivorTypeOptions = [];
    this.curMonth = "0" + (new Date().getMonth() + 1);
    this.PMonth = this.datepipe.transform(new Date(), 'MMM');
    this.monthOptions = [{ label: this.PMonth, value: this.curMonth }];
    this.PYear = new Date().getFullYear(); this.AdjustmentType = null;
    this.yearOptions = [{ label: this.PYear, value: this.PYear }];
    this.selectedItem = null; this.PrevOrderNo = null;
    this.PrevOrderDate = new Date(); this.ICode = null;
    this.schemeCode = null; this.Scheme = null; this.iCode = null;
    this.NKgs = 0; this.MarginNKgs = 0; this.Rate = 0; this.MarginRate = 0;
    this.RateTerm = null; this.MarginRateInTerms = null; this.miCode = null;
    this.TotalAmount = 0; this.GrandTotal = 0; this.MarginAmount = 0;
    this.marginTotal = 0; this.totalAmount = 0;
    this.MarginScheme = null; this.MICode = null; this.marginSchemeCode = null;
    this.schemeOptions = []; this.marginSchemeOptions = [];
    this.marginRateInTermsOptions = undefined; this.rateInTermsOptions = undefined;
    this.itemDescOptions = []; this.marginItemDescOptions = [];
    // this.isSaved = false;
    //this.isViewed = false;
  }

  getDocByDoNo() {
    this.messageService.clear();
    this.itemData = []; this.itemSchemeData = []; this.paymentBalData = []; this.paymentData = [];
    this.viewPane = false;
    this.isViewed = true;
    this.isSaveSucceed = false;
    const params = new HttpParams().set('sValue', this.DeliveryOrderNo).append('Type', '2').append('GCode', this.GCode);
    this.restAPIService.getByParameters(PathConstants.STOCK_DELIVERY_ORDER_VIEW_DOCUMENT, params).subscribe((res: any) => {
      if (res.Table !== undefined && res.Table.length !== 0 && res.Table !== null) {
        this.onClear();
        this.rowId = res.Table[0].RowId;
        this.DeliveryOrderNo = res.Table[0].Dono;
        this.DeliveryDate = new Date(res.Table[0].DoDate);
        this.trCode = res.Table[0].TransactionCode;
        this.Trcode = res.Table[0].TRName;
        this.transactionOptions = [{ label: res.Table[0].TRName, value: res.Table[0].TransactionCode }];
        this.IndentNo = res.Table[0].IndentNo;
        this.PermitDate = new Date(res.Table[0].PermitDate);
        let currentYr = new Date().getFullYear();
        let today = new Date().getDate();
        this.curMonth = res.Table[0].OrderPeriod.slice(5, 7);
        let formDate = this.curMonth + "-" + today + "-" + currentYr;
        this.monthOptions = [{ label: this.datepipe.transform(new Date(formDate), 'MMM'), value: this.curMonth }]
        this.PMonth = this.datepipe.transform(new Date(formDate), 'MMM');
        this.yearOptions = [{ label: res.Table[0].OrderPeriod.slice(0, 4), value: res.Table[0].OrderPeriod.slice(0, 4) }]
        this.PYear = res.Table[0].OrderPeriod.slice(0, 4);
        this.PName = res.Table[0].ReceivorName;
        this.pCode = res.Table[0].ReceivorCode;
        this.partyNameOptions = [{ label: res.Table[0].ReceivorName, value: res.Table[0].ReceivorCode }];
        this.RTCode = res.Table[0].Tyname;
        this.rtCode = res.Table[0].IssuerType;
        this.receivorTypeOptions = [{ label: res.Table[0].Tyname, value: res.Table[0].IssuerType }];
        this.Remarks = res.Table[0].Remarks.trim();
        this.GrandTotal = ((res.Table[0].GrandTotal * 1) < 0) ? 0 : (res.Table[0].GrandTotal * 1).toFixed(2);
        this.GrandTotal = (this.GrandTotal * 1);
        this.DueAmount = (res.Table[0].GrandTotal * 1);
        this.BalanceAmount = (this.DueAmount * 1) - (this.PaidAmount * 1);
        this.totalAmount = 0; this.marginTotal = 0;
        let i_sno = 1;
        res.Table.forEach(i => {
          this.itemData.push({
            sno: i_sno,
            ITDescription: i.ITDescription,
            NetWeight: (i.NetWeight * 1),
            Wtype: i.Wtype,
            SchemeName: i.SCName,
            Rate: (i.Rate * 1),
            Total: (i.Total * 1),
            Itemcode: i.Itemcode,
            Scheme: i.Scheme,
            Rcode: i.Rcode
          });
          this.totalAmount += (i.Total * 1);
          i_sno += 1;
        })
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage });
      }
      if (res.Table1 !== undefined && res.Table1.length !== 0 && res.Table1 !== null) {
        let m_sno = 1;
        res.Table1.forEach(i => {
          this.itemSchemeData.push({
            sno: m_sno,
            ITDescription: i.ITDescription,
            MarginNkgs: (i.MarginNkgs * 1),
            MarginWtype: i.MarginWtype,
            SchemeName: i.SCName,
            MarginRate: (i.MarginRate * 1),
            MarginAmount: (i.MarginAmount * 1),
            ItemCode: i.ItemCode,
            SchemeCode: i.SchemeCode,
            Rcode: i.Rcode
          });
          this.marginTotal += (i.MarginAmount * 1);
          m_sno += 1;
        })
      }
      if (res.Table3 !== undefined && res.Table3.length !== 0 && res.Table3 !== null) {
        let p_sno = 1;
        res.Table3.forEach(i => {
          this.paymentData.push({
            sno: p_sno,
            PaymentMode: i.PaymentMode,
            ChequeNo: i.ChequeNo,
            ChequeDate: this.datepipe.transform(i.ChDate, 'dd/MM/yyyy'),
            ChDate: this.datepipe.transform(i.ChDate, 'MM/dd/yyyy'),
            PaymentAmount: (i.PaymentAmount !== null) ? i.PaymentAmount : 0,
            payableat: i.payableat,
            bank: i.bank,
            RCode: i.Rcode
          });
          p_sno += 1;
        })
        if (this.paymentData.length !== 0) {
          this.paymentData.forEach(x => {
            this.PaidAmount += (x.PaymentAmount * 1);
      })
           this.BalanceAmount = ((this.DueAmount * 1) - (this.PaidAmount * 1));
        }
      }
      if (res.Table2 !== undefined && res.Table2.length !== 0 && res.Table2 !== null) {
        let pb_sno = 1;
        res.Table2.forEach(i => {
          this.paymentBalData.push({
            sno: pb_sno,
            AdjustedDoNo: i.AdjustedDoNo,
            AdjustedDate: this.datepipe.transform(i.AdjustDate, 'dd/MM/yyyy'),
            AdjustDate: this.datepipe.transform(i.AdjustDate, 'MM/dd/yyyy'),
            Amount: (i.Amount !== null) ? i.Amount : 0,
            AdjustmentType: i.AdjustmentType,
            AmountNowAdjusted: (i.AmountNowAdjusted !== null) ? i.AmountNowAdjusted : 0,
            Balance: (i.Balance !== null) ? i.Balance : 0,
            RCode: i.Rcode
          });
          pb_sno += 1;
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
  }

  resetForm(deliveryForm: NgForm) {
    deliveryForm.form.markAsUntouched();
    deliveryForm.form.markAsPristine();
  }

  onSave(type) {
    this.messageService.clear();
    this.blockScreen = true;
    this.OrderPeriod = this.PYear + '/' + ((this.PMonth.value !== undefined && this.PMonth.value !== null)
      ? this.PMonth.value : this.curMonth);
    this.DeliveryOrderNo = (this.DeliveryOrderNo !== undefined && this.DeliveryOrderNo !== null)
      ? this.DeliveryOrderNo : 0;
    this.rowId = (this.rowId !== undefined && this.rowId !== null) ? this.rowId : 0;
    this.UnLoadingSlip = (this.DeliveryOrderNo === undefined || this.DeliveryOrderNo === null) ? 'N' : this.UnLoadingSlip;
    const params = {
      'Type': type,
      'Dono': this.DeliveryOrderNo,
      'RowId': this.rowId,
      'DoDate': this.datepipe.transform(this.DeliveryDate, 'MM/dd/yyyy'),
      'TransactionCode': (this.Trcode.value !== undefined) ? this.Trcode.value : this.trCode,
      'IndentNo': this.IndentNo,
      'PermitDate': this.datepipe.transform(this.PermitDate, 'MM/dd/yyyy'),
      'OrderPeriod': this.OrderPeriod,
      'ReceivorCode': (this.PName.value !== undefined) ? this.PName.value : this.pCode,
      'ReceivorName': (this.PName.label !== undefined) ? this.PName.label : this.PName,
      'IssuerCode': this.GCode,
      'IssuerType': (this.RTCode.value !== undefined) ? this.RTCode.value : this.rtCode,
      'GrandTotal': this.GrandTotal,
      'Regioncode': this.RCode,
      'Remarks': (this.Remarks !== null && this.Remarks.trim() !== '') ? this.Remarks.trim() : '-',
      'deliverytype': '',
      'GodownName': this.GodownName,
      'TransactionName': (this.Trcode.label !== undefined && this.Trcode.label !== null) ? this.Trcode.label : this.Trcode,
      'RegionName': this.RegionName,
      'UnLoadingSlip': this.UnLoadingSlip,
      'UserID': this.username.user,
      'documentDeliveryItems': this.itemData,
      'deliveryMarginDetails': this.itemSchemeData,
      'deliveryPaymentDetails': this.paymentData,
      'deliveryAdjustmentDetails': this.paymentBalData
    };
    // this.isSaved = true;
    this.restAPIService.post(PathConstants.STOCK_DELIVERY_ORDER_DOCUMENT, params).subscribe(res => {
      if (res.Item1 !== undefined && res.Item1 !== null && res.Item2 !== undefined && res.Item2 !== null) {
        if (res.Item1) {
          if (type !== '2') {
            this.isSaveSucceed = true;
            this.isViewed = false;
          } else {
            this.isSaveSucceed = false;
            this.loadDocument();
            this.isViewed = false;
          }
          this.blockScreen = false;
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: res.Item2 });
          this.onClear();
        } else {
          this.isViewed = false;
          this.isSaveSucceed = false;
          this.blockScreen = false;
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: res.Item2 });
        }
      }
    }, (err: HttpErrorResponse) => {
      this.isViewed = false;
      this.isSaveSucceed = false;
      this.blockScreen = false;
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.NetworkErrorMessage });
      }
    });
  }

  onPrint() {
    // this.blockScreen = true;
    if (this.isViewed) {
      this.onSave('2');
    } else {
      this.loadDocument();
      this.isSaveSucceed = false;
      this.isViewed = false;
    }
  }

  loadDocument() {
    const path = "../../assets/Reports/" + this.username.user + "/";
    const filename = this.GCode + GolbalVariable.DeliveryOrderDocument;
    let filepath = path + filename + ".txt";
    var w = window.open(filepath);
    w.print();
  }

  onSubmit(form) {
    this.submitted = true;
    let arr = [];
    let no = 0;
    if(form.invalid) {
      for (var key in form.value) {
       if((form.value[key] === undefined || form.value[key] === '') && (key !== 'DoNo' && key !== 'RiceChecked' && key !== 'DueAmnt'
       && key !== 'TareWt' && key !== 'PaidAmnt' && key !== 'BalAmnt' && key !== 'groupname' &&
       key !== 'MarginSchemes' &&  key !== 'MarginCommodity' &&  key !== 'MarginWt' &&  key !== 'MarginRateTerms' 
       &&  key !== 'MarginRateRS' &&  key !== 'PaymentMode' &&  key !== 'ChequeNumber' && key !== 'AdjType' &&
       key !== 'PayAt' && key !== 'Bank' && key !== 'PreviousOrderNo' && key !== 'PreviousOrderDate')) {
         no += 1;
         arr.push({label: no, value: no + '.' + key});
        }
       }
       this.missingFields = arr;
    } else {
      this.missingFields = StatusMessage.SuccessValidationMsg;
      this.submitted = false;
    }
  }
}
