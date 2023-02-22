/**
 * 
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { IAttributeGroupLine } from './iAttributeGroupLine';
import { IDeliveryOrderLine } from './iDeliveryOrderLine';
import { IDocument } from './iDocument';
import { IItemLine } from './iItemLine';
import { ILedger } from './iLedger';
import { ILedgerDetailLine } from './iLedgerDetailLine';
import { IOtherChargesLine } from './iOtherChargesLine';
import { IPaymentLine } from './iPaymentLine';
import { IStockDetailLine } from './iStockDetailLine';
import { ITaxableLine } from './iTaxableLine';
import { ReferenceTxInfo } from './referenceTxInfo';
import { ResourceProxy } from './resourceProxy';
import { TransactionInfo } from './transactionInfo';

export interface IDrNoteInvTx { 
    stateName?: string;
    documents?: Array<IDocument>;
    noOfCreditDays?: number;
    stockDelivered?: boolean;
    serviceLineTotal?: number;
    nonSchemeItemLines?: Array<IItemLine>;
    totalItemQuantity?: number;
    otherChargesLines?: Array<IOtherChargesLine>;
    deliveryOrderLines?: Array<IDeliveryOrderLine>;
    stockAutoDelivered?: boolean;
    deliveryAddress?: string;
    billingAddressState?: string;
    supervisorName?: string;
    billAmountCalculated?: number;
    billingAddress?: string;
    roundOffLedger?: ILedger;
    roundOffEnabled?: boolean;
    createStockLines?: boolean;
    transporterMobNo?: string;
    shipmentDescription?: string;
    modeOrTermsOfPayment?: string;
    receivedAmount?: number;
    autoStockDeliveryMode?: boolean;
    paymentDueDate?: Date;
    containerLines?: Array<IStockDetailLine>;
    termsOfDelivery?: string;
    otherChargesTotal?: number;
    billAmountWithoutTax?: number;
    rawMaterialLines?: Array<IItemLine>;
    shippingAddressCity?: string;
    billingAddressPinCode?: string;
    deliveryAddress2?: string;
    shippingAddress3?: string;
    deliveryAddress3?: string;
    deliveryAddressState?: string;
    shippingAddressState?: string;
    shippingAddress2?: string;
    billingAddressCity?: string;
    shippingAddress?: string;
    billingAddress2?: string;
    deliveryAddressCity?: string;
    billingAddress3?: string;
    transportDetailsForVoucherPrint?: string;
    deliveryAddressPinCode?: string;
    shippingAddressPinCode?: string;
    descriptionForVoucherPrint?: string;
    billingGroupAttibuteGroupLine?: IAttributeGroupLine;
    stateId?: number;
    contactId?: number;
    contactName?: string;
    salesManName?: string;
    salesManId?: number;
    sourceTx?: TransactionInfo;
    itemLineTotal?: number;
    transporter?: string;
    shipmentId?: string;
    paymentLines?: Array<IPaymentLine>;
    vehicleNumber?: string;
    shipmentDate?: Date;
    roundAmount?: number;
    stockGoingOut?: boolean;
    challanNo?: string;
    challanDated?: Date;
    returnAmount?: number;
    billAmount?: number;
    deliveryDate?: Date;
    ewayBillNo?: string;
    supervisorId?: number;
    transporterId?: string;
    transportMode?: number;
    buyersOrderNo?: string;
    transDistance?: number;
    vehicleType?: string;
    transDocNo?: string;
    transDocDate?: Date;
    ewayBillDate?: Date;
    gstIn?: string;
    dated?: Date;
    ledger?: number;
    ledgerDetailLines?: Array<ILedgerDetailLine>;
    paymentModeName?: string;
    billingGroupName?: string;
    billingClassification?: number;
    taxableLineTotal?: number;
    billDiscountPerc?: number;
    billDiscountFixed?: number;
    billingClassificationName?: string;
    reverseChargeApplicable?: boolean;
    createLedgerDetailLines?: boolean;
    ledgerName?: string;
    printName?: string;
    paymentMode?: number;
    taxableLines?: Array<ITaxableLine>;
    billingGroup?: number;
    voucherConfigType?: number;
    generatedVchNumSeq?: number;
    voucherConfigTypeName?: string;
    tdsTypeWithPan?: boolean;
    vouchernumber?: string;
    tdsTypeId?: number;
    tdsTypeName?: string;
    tdsRate?: number;
    typeName?: string;
    description?: string;
    transactionType?: number;
    transactiondate?: Date;
    otherReferences?: string;
    referenceTxInfoList?: Array<ReferenceTxInfo>;
    storeName?: string;
    storeId?: number;
    referenceNo?: string;
    termsId?: number;
    resourceProxy?: ResourceProxy;
    txStatus?: number;
    modificationdate?: Date;
    impCompanyGuid?: string;
    productUserName?: string;
    productUserId?: number;
    logInfo?: string;
    importedId?: number;
    creationdate?: Date;
    id?: number;
    jacksontype?: string;
    stockDetailLines?: Array<IStockDetailLine>;
    itemLines?: Array<IItemLine>;
}